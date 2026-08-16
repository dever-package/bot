package chat

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeinteraction "github.com/dever-package/bot/service/agent/runtime/interaction"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
)

type interactionResumeState struct {
	knowledgeUsed bool
	loadedSkills  []agentmodel.LoadedSkillRef
}

type InteractionSource struct {
	RequestID string
}

func (Service) RequireInteractionSource(
	ctx context.Context,
	sessionID uint64,
	agentKey string,
	contextKey string,
	interactionID string,
) (InteractionSource, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return InteractionSource{}, err
	}
	session, err := requireSession(ctx, owner, sessionID)
	if err != nil {
		return InteractionSource{}, err
	}
	if err = validateSessionScope(*session, agentKey, contextKey); err != nil {
		return InteractionSource{}, err
	}
	message, _, err := interactionSourceMessage(ctx, sessionID, interactionID)
	if err != nil {
		return InteractionSource{}, err
	}
	requestID := strings.TrimSpace(message.RequestID)
	if requestID == "" {
		return InteractionSource{}, fmt.Errorf("交互来源运行不存在，请重新提交当前需求")
	}
	return InteractionSource{RequestID: requestID}, nil
}

func resolveInteractionResponse(
	ctx context.Context,
	sessionID uint64,
	interactionID string,
	data map[string]any,
) (interactionResumeState, error) {
	message, interaction, err := interactionSourceMessage(ctx, sessionID, interactionID)
	if err != nil {
		return interactionResumeState{}, err
	}
	if err := runtimeinteraction.ValidateResponse(interaction, data); err != nil {
		return interactionResumeState{}, err
	}
	output := runtimemessageoutput.Merge(message.Output, nil)
	knowledgeUsed, _ := output["knowledge_used"].(bool)
	return interactionResumeState{
		knowledgeUsed: knowledgeUsed,
		loadedSkills:  interactionLoadedSkills(ctx, message.RequestID),
	}, nil
}

func interactionSourceMessage(
	ctx context.Context,
	sessionID uint64,
	interactionID string,
) (*agentmodel.Message, map[string]any, error) {
	interactionID = strings.TrimSpace(interactionID)
	if interactionID == "" {
		return nil, nil, fmt.Errorf("交互ID不能为空")
	}
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
	}, map[string]any{
		"order": "main.id desc",
		"limit": 1,
	})
	if len(rows) == 0 || rows[0] == nil {
		return nil, nil, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	message := rows[0]
	if message.Role != "assistant" || message.Status != agentmodel.MessageStatusNormal {
		return nil, nil, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	output := runtimemessageoutput.Merge(message.Output, nil)
	interaction, ok := output["interaction"].(map[string]any)
	if !ok || strings.TrimSpace(interactionText(interaction["id"])) != interactionID {
		return nil, nil, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	return message, interaction, nil
}

func interactionLoadedSkills(ctx context.Context, requestID string) []agentmodel.LoadedSkillRef {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}
	run := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
	if run == nil {
		return nil
	}
	return agentmodel.DecodeLoadedSkillRefs(run.Skills)
}

func interactionText(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
