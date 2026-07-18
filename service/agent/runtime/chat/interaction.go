package chat

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
)

type interactionResumeState struct {
	knowledgeUsed bool
	loadedSkills  []string
}

func resolveInteractionResponse(
	ctx context.Context,
	sessionID uint64,
	interactionID string,
	data map[string]any,
) (interactionResumeState, error) {
	interactionID = strings.TrimSpace(interactionID)
	if interactionID == "" {
		return interactionResumeState{}, fmt.Errorf("交互ID不能为空")
	}
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
	}, map[string]any{
		"order": "main.id desc",
		"limit": 1,
	})
	if len(rows) == 0 || rows[0] == nil {
		return interactionResumeState{}, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	message := rows[0]
	if message.Role != "assistant" || message.Status != agentmodel.MessageStatusNormal {
		return interactionResumeState{}, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	output := runtimemessageoutput.Merge(message.Output, nil)
	interaction, ok := output["interaction"].(map[string]any)
	if !ok || strings.TrimSpace(interactionText(interaction["id"])) != interactionID {
		return interactionResumeState{}, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	if err := validateInteractionData(interactionFields(interaction["fields"]), data); err != nil {
		return interactionResumeState{}, err
	}
	knowledgeUsed, _ := output["knowledge_used"].(bool)
	return interactionResumeState{
		knowledgeUsed: knowledgeUsed,
		loadedSkills:  interactionLoadedSkills(ctx, message.RequestID),
	}, nil
}

func interactionLoadedSkills(ctx context.Context, requestID string) []string {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}
	run := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
	if run == nil {
		return nil
	}
	values, ok := decodeJSON(run.Skills).([]any)
	if !ok {
		return nil
	}
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		key := strings.TrimSpace(interactionText(value))
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, key)
	}
	return result
}

func interactionFields(value any) []any {
	switch fields := value.(type) {
	case []any:
		return fields
	case []map[string]any:
		result := make([]any, 0, len(fields))
		for _, field := range fields {
			result = append(result, field)
		}
		return result
	default:
		return nil
	}
}

func validateInteractionData(fields []any, data map[string]any) error {
	if len(fields) == 0 {
		return fmt.Errorf("交互字段为空")
	}
	if data == nil {
		return fmt.Errorf("交互回答不能为空")
	}
	for _, value := range fields {
		field, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("交互字段格式无效")
		}
		key := strings.TrimSpace(interactionText(field["key"]))
		if key == "" {
			return fmt.Errorf("交互字段缺少 key")
		}
		if runtimemessageoutput.HasValue(data[key]) {
			continue
		}
		name := strings.TrimSpace(interactionText(field["name"]))
		if name == "" {
			name = key
		}
		return fmt.Errorf("请补充必填信息：%s", name)
	}
	return nil
}

func interactionText(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
