package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	memorymodel "github.com/dever-package/bot/model/memory"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	memoryservice "github.com/dever-package/bot/service/memory"
)

const memoryExtractionTimeout = 25 * time.Second

type memoryExtraction struct {
	Memories []memoryCandidate `json:"memories"`
}

type memoryCandidate struct {
	Operation  string   `json:"operation"`
	MemoryID   uint64   `json:"memory_id"`
	Key        string   `json:"key"`
	Scope      string   `json:"scope"`
	Kind       string   `json:"kind"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Tags       []string `json:"tags"`
	Confidence float64  `json:"confidence"`
	Explicit   bool     `json:"explicit"`
}

func (s Service) extractSessionMemoryAsync(sessionID uint64, sourceMessageID uint64) {
	if sessionID == 0 || sourceMessageID == 0 {
		return
	}
	submitChatMaintenance("提取会话记忆", sourceMessageID, memoryExtractionTimeout, func(ctx context.Context) {
		s.extractSessionMemory(ctx, sessionID, sourceMessageID)
	})
}

func (s Service) extractSessionMemory(ctx context.Context, sessionID uint64, sourceMessageID uint64) {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": sessionID, "status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return
	}
	if !sessionMemoryEnabled(ctx, *session) {
		return
	}
	messageModel := agentmodel.NewMessageModel()
	if messageModel.Find(ctx, map[string]any{
		"id": sourceMessageID, "session_id": session.ID, "role": "assistant",
	}) == nil {
		return
	}
	userMessageID, userText := userMessageBefore(ctx, session.ID, sourceMessageID)
	if userMessageID == 0 {
		return
	}
	if !memoryservice.CanAnalyzeInput(userText) {
		return
	}
	memory := memoryservice.NewService()
	related := memory.RuntimeMemories(ctx, memoryservice.RuntimeRequest{
		OwnerType: session.OwnerType, OwnerID: session.OwnerID,
		AgentKey: session.AgentKey, ContextKey: session.ContextKey, SessionID: session.ID,
		Query: userText, Limit: 8, IncludeGlobal: true, IncludeAgent: true,
	})
	candidates := s.extractMemoryCandidates(ctx, *session, userText, related)
	if messageModel.Find(ctx, map[string]any{
		"id": sourceMessageID, "session_id": session.ID,
	}) == nil {
		return
	}
	reviews := make([]map[string]any, 0, len(candidates))
	for _, candidate := range candidates {
		review := memory.ReviewCandidate(ctx, memoryservice.CandidateRequest{
			Session: *session, SourceMessageID: userMessageID, Candidate: candidate,
		})
		if len(review) > 0 {
			reviews = append(reviews, review)
		}
	}
	if len(reviews) == 1 {
		saveMemoryReview(ctx, session.ID, sourceMessageID, reviews[0])
	} else if len(reviews) > 1 {
		saveMemoryReview(ctx, session.ID, sourceMessageID, map[string]any{
			"status": "saved", "text": "已更新本轮长期记忆。",
			"items": reviews, "source_message_id": userMessageID,
		})
	}
}

func (s Service) extractMemoryCandidates(ctx context.Context, session agentmodel.Session, userText string, related []memoryservice.RuntimeMemory) []memoryservice.Candidate {
	powerKey := s.sessionPowerKey(ctx, session.ID)
	if powerKey == "" {
		return nil
	}
	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power":   powerKey,
			"set":     map[string]any{"role": memoryExtractorRole()},
			"input":   energonservice.PromptInput(memoryExtractorPrompt(session, userText, related)),
			"options": map[string]any{"stream": false, "temperature": 0},
		},
	})
	if response.Status == botprotocol.ResponseStatusFail {
		return nil
	}
	output := botprotocol.ExtractOutput(response.Payload())
	raw := strings.TrimSpace(botprotocol.AsText(output["text"]))
	if raw == "" {
		raw = strings.TrimSpace(botprotocol.AsText(output["json"]))
	}
	return parseMemoryCandidates(raw)
}

func userMessageBefore(ctx context.Context, sessionID uint64, messageID uint64) (uint64, string) {
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"role":       "user",
		"status":     agentmodel.MessageStatusNormal,
		"id":         map[string]any{"lt": messageID},
	}, map[string]any{"order": "main.id desc", "limit": 1})
	for _, row := range rows {
		if row != nil {
			return row.ID, strings.TrimSpace(row.Text)
		}
	}
	return 0, ""
}

func saveMemoryReview(ctx context.Context, sessionID uint64, messageID uint64, review map[string]any) {
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": messageID, "session_id": sessionID,
	})
	if message == nil {
		return
	}
	output := runtimemessageoutput.Merge(message.Output, map[string]any{"memory_review": review})
	agentmodel.NewMessageModel().Update(ctx, map[string]any{"id": message.ID}, map[string]any{
		"output": encodeJSON(output, "{}"),
	})
}

func parseMemoryCandidates(raw string) []memoryservice.Candidate {
	raw = trimJSONFence(raw)
	if raw == "" {
		return nil
	}
	var parsed memoryExtraction
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return nil
	}
	result := make([]memoryservice.Candidate, 0, 3)
	for _, item := range parsed.Memories {
		operation := strings.ToLower(strings.TrimSpace(item.Operation))
		if operation != "upsert" && operation != "delete" {
			continue
		}
		if operation == "upsert" && strings.TrimSpace(item.Content) == "" {
			continue
		}
		if operation == "delete" && item.MemoryID == 0 {
			continue
		}
		result = append(result, memoryservice.Candidate{
			Operation: operation, MemoryID: item.MemoryID, Key: item.Key, Scope: item.Scope,
			Kind: item.Kind, Title: item.Title, Content: item.Content, Tags: item.Tags,
			Importance: memoryImportanceFromConfidence(item.Confidence),
			Source:     memorymodel.SourceLLM, Confidence: item.Confidence,
			Explicit: item.Explicit,
		})
		if len(result) >= 3 {
			break
		}
	}
	return result
}

func memoryImportanceFromConfidence(confidence float64) int {
	if confidence >= 0.9 {
		return 85
	}
	if confidence >= 0.75 {
		return 75
	}
	return 65
}

func trimJSONFence(raw string) string {
	raw = strings.TrimSpace(raw)
	if strings.HasPrefix(raw, "```") {
		lines := strings.Split(raw, "\n")
		if len(lines) >= 3 {
			raw = strings.Join(lines[1:len(lines)-1], "\n")
		}
	}
	return strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(raw), "json"))
}

func memoryExtractorRole() string {
	return strings.Join([]string{
		"你是长期记忆抽取器，只判断用户本轮输入是否包含稳定、可复用的长期记忆。",
		"只输出 JSON，不要 Markdown，不要解释。",
		"不要保存 API Key、Token、Cookie、密码、私钥、授权头或任何敏感凭证。",
		"不要保存临时任务、单次操作、普通闲聊或不稳定猜测。",
		"最多输出 3 条彼此独立的高价值记忆。已有同类记忆时使用相同 key 覆盖更新，不要追加近义重复项。",
		"scope 只能是 global、agent、context：跨智能体稳定用户偏好用 global；仅当前智能体规则用 agent；当前业务上下文规则用 context。",
		"key 使用稳定的小写英文点号标识，例如 profile.response_language、preference.answer_length；无法稳定归类时可为空。",
		"kind 只能是 working、episodic、semantic、procedural、persona、content。",
		"operation 只能是 upsert 或 delete；不需要变更时不要输出。",
		"explicit 表示用户是否在本轮明确要求长期保存或删除，而不是你根据内容重要性猜测。",
		"delete 仅在用户明确要求删除已有记忆时使用，必须填写已有相关记忆中的 memory_id，不得猜测 ID。",
		"输出格式：{\"memories\":[{\"operation\":\"upsert\",\"memory_id\":0,\"key\":\"preference.answer_length\",\"scope\":\"global\",\"kind\":\"persona\",\"title\":\"短标题\",\"content\":\"完整规则\",\"tags\":[\"preference\"],\"confidence\":0.9,\"explicit\":true}]}",
		"没有值得记忆的信息时输出 {\"memories\":[]}",
	}, "\n")
}

func memoryExtractorPrompt(session agentmodel.Session, userText string, related []memoryservice.RuntimeMemory) string {
	parts := []string{
		"当前 agent_key: " + strings.TrimSpace(session.AgentKey),
		"当前 context_key: " + strings.TrimSpace(session.ContextKey),
	}
	if len(related) > 0 {
		parts = append(parts, "", "已有相关记忆:")
		for _, item := range related {
			parts = append(parts, fmt.Sprintf("- [memory_id=%d, scope=%s] %s: %s", item.ID, item.Scope, strings.TrimSpace(item.Title), strings.TrimSpace(item.Content)))
		}
	}
	parts = append(parts, "", "用户本轮输入:", userText)
	return strings.Join(parts, "\n")
}
