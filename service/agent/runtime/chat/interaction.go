package chat

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeinteraction "github.com/dever-package/bot/service/agent/runtime/interaction"
)

func resolveInteractionResponse(
	ctx context.Context,
	sessionID uint64,
	interactionID string,
	data map[string]any,
) (bool, error) {
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
	}, map[string]any{
		"order": "main.id desc",
		"limit": 1,
	})
	if len(rows) == 0 || rows[0] == nil {
		return false, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	message := rows[0]
	if message.Role != "assistant" || message.Status != agentmodel.MessageStatusNormal {
		return false, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	knowledgeUsed, err := runtimeinteraction.ResolveResponse(message.Output, strings.TrimSpace(interactionID), data)
	if err != nil {
		return false, err
	}
	return knowledgeUsed, nil
}
