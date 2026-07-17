package chat

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type CompletedAssistantMessage struct {
	ID        uint64
	SessionID uint64
	RequestID string
	Text      string
	Content   any
	Output    map[string]any
	Document  any
}

func (Service) RequireSessionScope(ctx context.Context, sessionID uint64, agentKey string, contextKey string) error {
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	session, err := requireSession(ctx, owner, sessionID)
	if err != nil {
		return err
	}
	return validateSessionScope(*session, agentKey, contextKey)
}

func (Service) RequireRunScope(ctx context.Context, requestID string, agentKey string, contextKey string) error {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return fmt.Errorf("运行请求ID不能为空")
	}
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"role": "assistant", "request_id": requestID,
	})
	if message == nil {
		return fmt.Errorf("运行消息不存在")
	}
	return Service{}.RequireSessionScope(ctx, message.SessionID, agentKey, contextKey)
}

func (Service) RequireCompletedAssistantMessage(
	ctx context.Context,
	messageID uint64,
	agentKey string,
	contextKey string,
) (CompletedAssistantMessage, error) {
	if messageID == 0 {
		return CompletedAssistantMessage{}, fmt.Errorf("消息不能为空")
	}
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": messageID, "role": "assistant", "status": agentmodel.MessageStatusNormal,
	})
	if message == nil {
		return CompletedAssistantMessage{}, fmt.Errorf("只有已完成的智能体回复可以保存")
	}
	if err := (Service{}).RequireSessionScope(ctx, message.SessionID, agentKey, contextKey); err != nil {
		return CompletedAssistantMessage{}, err
	}
	payload := messageMap(ctx, message)
	output, _ := payload["output"].(map[string]any)
	return CompletedAssistantMessage{
		ID:        message.ID,
		SessionID: message.SessionID,
		RequestID: strings.TrimSpace(message.RequestID),
		Text:      strings.TrimSpace(fmt.Sprint(payload["text"])),
		Content:   payload["content"],
		Output:    output,
		Document:  payload["document"],
	}, nil
}
