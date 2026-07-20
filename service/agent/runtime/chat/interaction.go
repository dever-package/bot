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
	if err := runtimeinteraction.ValidateResponse(interaction, data); err != nil {
		return interactionResumeState{}, err
	}
	knowledgeUsed, _ := output["knowledge_used"].(bool)
	return interactionResumeState{
		knowledgeUsed: knowledgeUsed,
		loadedSkills:  interactionLoadedSkills(ctx, message.RequestID),
	}, nil
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
