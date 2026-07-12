package chat

import (
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	completionSuccess  = "success"
	completionFail     = "fail"
	completionCanceled = "canceled"
)

func (s Service) afterRecordedMessage(message *agentmodel.Message, memoryEnabled bool) {
	if message != nil && message.Role == "assistant" && message.Status == agentmodel.MessageStatusNormal {
		s.afterTurn(message.SessionID)
		if memoryEnabled {
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
		if text == "" {
			text = "智能体已返回结果。"
		}
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
	if text == "" {
		text = "智能体运行失败。"
	}
	output := mergeMessageOutput(completion.Output, map[string]any{"event": event, "text": text})
	if errorMessage != "" {
		output["error"] = errorMessage
	}
	return messageStatus, text, output
}
