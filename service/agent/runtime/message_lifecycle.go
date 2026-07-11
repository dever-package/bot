package runtime

import (
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
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
	case runStatusSuccess:
		if text == "" {
			text = "智能体已返回结果。"
		}
	case runStatusCanceled:
		if text == "" {
			text = "已停止生成"
		}
	case runStatusFail:
		messageStatus = agentmodel.MessageStatusError
		if text == "" {
			text = errorMessage
		}
	default:
		messageStatus = agentmodel.MessageStatusError
		event = runStatusFail
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
