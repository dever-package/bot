package chat

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
)

const (
	completionSuccess  = "success"
	completionFail     = "fail"
	completionCanceled = "canceled"
)

func (s Service) afterRecordedMessage(ctx context.Context, message *agentmodel.Message) {
	if message != nil && message.Role == "assistant" && message.Status == agentmodel.MessageStatusNormal {
		s.afterTurn(message.SessionID)
		session := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": message.SessionID})
		if session != nil && sessionMemoryEnabled(ctx, *session) {
			s.extractSessionMemoryAsync(message.SessionID, message.ID)
		}
	}
}

func (s Service) afterTurn(sessionID uint64) {
	s.generateSessionTitleAsync(sessionID)
	s.compactSessionContextAsync(sessionID)
}

func completedRunTurnMessage(completion RunTurnCompletion) (int16, string, map[string]any) {
	status := strings.ToLower(strings.TrimSpace(completion.Status))
	text := strings.TrimSpace(completion.Text)
	errorMessage := strings.TrimSpace(completion.Error)
	messageStatus := agentmodel.MessageStatusNormal
	event := status
	switch status {
	case completionSuccess:
		// Suggestions and other structured results may intentionally have no text.
	case completionCanceled:
		if text == "" {
			text = "已停止生成"
		}
	case completionFail:
		messageStatus = agentmodel.MessageStatusError
		if text == "" {
			text = errorMessage
		}
	default:
		messageStatus = agentmodel.MessageStatusError
		event = completionFail
	}
	if text == "" && status != completionSuccess {
		text = "智能体运行失败。"
	}
	output := runtimemessageoutput.Merge(completion.Output, map[string]any{"event": event, "text": text})
	if errorMessage != "" {
		output["error"] = errorMessage
	}
	return messageStatus, text, output
}
