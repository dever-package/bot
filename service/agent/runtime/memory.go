package runtime

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	memorymodel "github.com/dever-package/bot/model/memory"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	memoryservice "github.com/dever-package/bot/service/memory"
)

const memoryExtractionTimeout = 25 * time.Second

type memoryExtraction struct {
	Memories []memoryCandidate `json:"memories"`
}

type memoryCandidate struct {
	Action     string   `json:"action"`
	Kind       string   `json:"kind"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Tags       []string `json:"tags"`
	Confidence float64  `json:"confidence"`
}

func (s Service) extractSessionMemoryAsync(sessionID uint64, sourceMessageID uint64) {
	if sessionID == 0 || sourceMessageID == 0 {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), memoryExtractionTimeout)
		defer cancel()
		s.extractSessionMemory(ctx, sessionID, sourceMessageID)
	}()
}

func (s Service) extractSessionMemory(ctx context.Context, sessionID uint64, sourceMessageID uint64) {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": sessionID, "status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return
	}
	messageModel := agentmodel.NewMessageModel()
	if messageModel.Find(ctx, map[string]any{
		"id": sourceMessageID, "session_id": session.ID, "role": "assistant",
	}) == nil {
		return
	}
	userText := userMessageTextBefore(ctx, session.ID, sourceMessageID)
	analysis := memoryservice.AnalyzeInput(userText)
	memory := memoryservice.NewService()
	if analysis.ForgetTarget != "" {
		memory.ForgetForSession(ctx, *session, analysis.ForgetTarget)
		saveMemoryReview(ctx, session.ID, sourceMessageID, map[string]any{
			"status": "forgot", "text": "已按本轮要求清理相关记忆。",
		})
		return
	}
	if !analysis.ShouldExtract {
		return
	}
	candidates := s.extractMemoryCandidates(ctx, *session, userText, analysis.Explicit)
	if len(candidates) == 0 {
		candidates = analysis.Fallback
	}
	if messageModel.Find(ctx, map[string]any{
		"id": sourceMessageID, "session_id": session.ID,
	}) == nil {
		return
	}
	for _, candidate := range candidates {
		review := memory.ReviewCandidate(ctx, memoryservice.CandidateRequest{
			Session: *session, SourceMessageID: sourceMessageID, Candidate: candidate,
		})
		if len(review) > 0 {
			saveMemoryReview(ctx, session.ID, sourceMessageID, review)
			return
		}
	}
}

func (s Service) extractMemoryCandidates(ctx context.Context, session agentmodel.Session, userText string, explicit bool) []memoryservice.Candidate {
	powerKey := s.sessionPowerKey(ctx, session.ID)
	if powerKey == "" {
		return nil
	}
	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power":   powerKey,
			"set":     map[string]any{"role": memoryExtractorRole()},
			"input":   map[string]any{"text": memoryExtractorPrompt(session, userText)},
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
	return parseMemoryCandidates(raw, explicit)
}

func userMessageTextBefore(ctx context.Context, sessionID uint64, messageID uint64) string {
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"role":       "user",
		"status":     agentmodel.MessageStatusNormal,
		"id":         map[string]any{"lt": messageID},
	}, map[string]any{"order": "main.id desc", "limit": 1})
	for _, row := range rows {
		if row != nil {
			return strings.TrimSpace(row.Text)
		}
	}
	return ""
}

func saveMemoryReview(ctx context.Context, sessionID uint64, messageID uint64, review map[string]any) {
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": messageID, "session_id": sessionID,
	})
	if message == nil {
		return
	}
	output := mergeMessageOutput(message.Output, map[string]any{"memory_review": review})
	agentmodel.NewMessageModel().Update(ctx, map[string]any{"id": message.ID}, map[string]any{
		"output": encodeJSON(output, "{}"),
	})
}

func parseMemoryCandidates(raw string, explicit bool) []memoryservice.Candidate {
	raw = trimJSONFence(raw)
	if raw == "" {
		return nil
	}
	var parsed memoryExtraction
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return nil
	}
	for _, item := range parsed.Memories {
		if strings.ToLower(strings.TrimSpace(item.Action)) != "upsert" || strings.TrimSpace(item.Content) == "" {
			continue
		}
		return []memoryservice.Candidate{{
			Kind: item.Kind, Title: item.Title, Content: item.Content, Tags: item.Tags,
			Importance: memoryImportanceFromConfidence(item.Confidence),
			Source:     memorymodel.SourceLLM, Confidence: item.Confidence,
			Explicit: explicit || item.Confidence >= 0.85 || looksLikeExplicitMemory(item.Content),
		}}
	}
	return nil
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

func looksLikeExplicitMemory(text string) bool {
	for _, signal := range []string{"记住", "以后", "每次", "默认", "必须", "禁止", "不许"} {
		if strings.Contains(text, signal) {
			return true
		}
	}
	return false
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
		"最多输出 1 条最高价值记忆；scope 固定为 context。",
		"kind 只能是 working、episodic、semantic、procedural、persona、content。",
		"输出格式：{\"memories\":[{\"action\":\"upsert\",\"kind\":\"procedural\",\"title\":\"短标题\",\"content\":\"完整规则\",\"tags\":[\"rule\"],\"confidence\":0.9}]}",
		"没有值得记忆的信息时输出 {\"memories\":[]}",
	}, "\n")
}

func memoryExtractorPrompt(session agentmodel.Session, userText string) string {
	return strings.Join([]string{
		"当前 agent_key: " + strings.TrimSpace(session.AgentKey),
		"当前 context_key: " + strings.TrimSpace(session.ContextKey),
		"", "用户本轮输入:", userText,
	}, "\n")
}
