package assistant

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/google/uuid"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	assistantmodel "github.com/dever-package/bot/model/assistant"
	energonmodel "github.com/dever-package/bot/model/energon"
	memorymodel "github.com/dever-package/bot/model/memory"
	energonservice "github.com/dever-package/bot/service/energon"
	frontstream "github.com/dever-package/front/service/stream"
)

type llmMemoryExtraction struct {
	Memories []llmMemoryCandidate `json:"memories"`
}

type llmMemoryCandidate struct {
	Action     string   `json:"action"`
	Scope      string   `json:"scope"`
	Kind       string   `json:"kind"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Tags       []string `json:"tags"`
	Confidence float64  `json:"confidence"`
	Reason     string   `json:"reason"`
}

func (s Service) extractMemoryCandidatesWithLLM(ctx context.Context, session assistantmodel.Session, userText string) []memoryCandidate {
	powerKey := assistantMemoryPowerKey(ctx, session.AgentKey)
	if powerKey == "" {
		return nil
	}
	callCtx, cancel := context.WithTimeout(ctx, memoryLLMExtractionTimeout)
	defer cancel()
	resp := energonservice.NewGatewayService().Request(callCtx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": powerKey,
			"set": map[string]any{
				"role": memoryExtractorRole(),
			},
			"input": map[string]any{
				"text": memoryExtractorPrompt(session, userText),
			},
			"options": map[string]any{
				"stream":      false,
				"temperature": 0,
			},
		},
	})
	payload := resp.Payload()
	if util.ToIntDefault(payload["status"], 0) == 2 {
		return nil
	}
	raw := gatewayPayloadText(payload)
	if raw == "" {
		return nil
	}
	return parseLLMMemoryCandidates(raw, explicitMemoryContent(userText) != "")
}

func assistantMemoryPowerKey(ctx context.Context, agentKey string) string {
	key := strings.TrimSpace(agentKey)
	if key == "" {
		key = agentmodel.FrontAssistantAgentKey
	}
	agent := agentmodel.NewAgentModel().Find(ctx, map[string]any{"key": key})
	if agent == nil {
		if builtinID := builtinAssistantAgentID(key); builtinID > 0 {
			agent = agentmodel.NewAgentModel().Find(ctx, map[string]any{"id": builtinID})
		}
	}
	if agent == nil || agent.LLMPowerID == 0 || agent.Status != 1 {
		return ""
	}
	return assistantPowerKeyByID(ctx, agent.LLMPowerID)
}

func builtinAssistantAgentID(agentKey string) uint64 {
	switch strings.TrimSpace(agentKey) {
	case agentmodel.FrontAssistantAgentKey:
		return agentmodel.FrontAssistantAgentID
	case agentmodel.SkillInstallerAgentKey:
		return agentmodel.SkillInstallerAgentID
	case agentmodel.SkillCreatorAgentKey:
		return agentmodel.SkillCreatorAgentID
	default:
		return 0
	}
}

func assistantPowerKeyByID(ctx context.Context, powerID uint64) string {
	row := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	if row == nil || row.Status != 1 || strings.ToLower(strings.TrimSpace(row.Kind)) != "text" {
		return ""
	}
	return strings.TrimSpace(row.Key)
}

func memoryExtractorRole() string {
	return strings.Join([]string{
		"你是长期记忆抽取器，只判断用户本轮输入是否包含稳定、可复用的长期记忆。",
		"只输出 JSON，不要 Markdown，不要解释。",
		"不要保存 API Key、Token、Cookie、密码、私钥、授权头或任何敏感凭证。",
		"不要保存临时任务、单次操作、普通闲聊或不稳定猜测。",
		"最多输出 1 条最高价值记忆；不要一次输出多条。",
		"scope 只能是 global、agent、context、session。",
		"kind 只能是 working、episodic、semantic、procedural、persona、content。",
		"输出格式：{\"memories\":[{\"action\":\"upsert\",\"scope\":\"context\",\"kind\":\"procedural\",\"title\":\"短标题\",\"content\":\"完整可执行规则\",\"tags\":[\"rule\"],\"confidence\":0.9,\"reason\":\"原因\"}]}",
		"没有值得记忆的信息时输出 {\"memories\":[]}",
	}, "\n")
}

func memoryExtractorPrompt(session assistantmodel.Session, userText string) string {
	agentKey := strings.TrimSpace(session.AgentKey)
	contextKey := strings.TrimSpace(session.ContextKey)
	return strings.Join([]string{
		"当前 agent_key: " + agentKey,
		"当前 context_key: " + contextKey,
		"",
		"用户本轮输入:",
		userText,
	}, "\n")
}

func gatewayPayloadText(payload map[string]any) string {
	output := mapFromUnknown(payload["output"])
	if text := strings.TrimSpace(frontstream.InputText(output["text"])); text != "" {
		return text
	}
	if text := outputJSONText(output["json"]); text != "" {
		return text
	}
	return strings.TrimSpace(frontstream.InputText(payload["data"]))
}

func outputJSONText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return ""
		}
		return strings.TrimSpace(string(raw))
	}
}

func mapFromUnknown(value any) map[string]any {
	switch current := value.(type) {
	case nil:
		return map[string]any{}
	case map[string]any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return map[string]any{}
		}
		result := map[string]any{}
		if err := json.Unmarshal(raw, &result); err != nil {
			return map[string]any{}
		}
		return result
	}
}

func parseLLMMemoryCandidates(raw string, explicit bool) []memoryCandidate {
	raw = trimJSONFence(raw)
	var parsed llmMemoryExtraction
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return nil
	}
	result := make([]memoryCandidate, 0, len(parsed.Memories))
	for _, item := range parsed.Memories {
		if strings.ToLower(strings.TrimSpace(item.Action)) != "upsert" {
			continue
		}
		content := normalizeMemoryContent(item.Content)
		if content == "" || hasSensitiveMemoryContent(content) {
			continue
		}
		result = append(result, memoryCandidate{
			Kind:       item.Kind,
			Title:      item.Title,
			Content:    content,
			Tags:       item.Tags,
			Importance: memoryImportanceFromConfidence(item.Confidence),
			Scope:      item.Scope,
			Source:     memorymodel.SourceLLM,
			Confidence: item.Confidence,
			Reason:     item.Reason,
			Explicit:   explicit || item.Confidence >= 0.85 || looksLikeExplicitMemory(content),
		})
		break
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

func looksLikeExplicitMemory(text string) bool {
	return explicitMemoryContent(text) != "" || containsAny(text, []string{"记住", "以后", "每次", "默认", "必须", "禁止", "不许"})
}

func trimJSONFence(raw string) string {
	raw = strings.TrimSpace(raw)
	if strings.HasPrefix(raw, "```") {
		lines := strings.Split(raw, "\n")
		if len(lines) >= 3 {
			lines = lines[1 : len(lines)-1]
			raw = strings.Join(lines, "\n")
		}
	}
	raw = strings.TrimSpace(raw)
	raw = strings.TrimPrefix(raw, "json")
	return strings.TrimSpace(raw)
}
