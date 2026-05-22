package agent

import (
	"context"
	"strings"

	agentaction "my/package/bot/service/agent/action"
	agentprompt "my/package/bot/service/agent/prompt"
	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	botstream "my/package/bot/service/energon/stream"
	frontstream "my/package/front/service/stream"
)

const (
	agentTurnFinal       = "final"
	agentTurnInteraction = "interaction"
	agentTurnAction      = "action"
	agentTurnCanceled    = "canceled"
	agentTurnError       = "error"
)

type agentTurnResult struct {
	Kind        string
	Text        string
	Output      map[string]any
	Interaction map[string]any
	Action      agentaction.Action
	LastID      string
	Message     string
}

func (s Service) collectAgentTurn(ctx context.Context, exec runExecution, runtimePrompt string, history []any, step int, maxSteps int, gatewayLastID string) agentTurnResult {
	body := agentprompt.BuildEnergonBody(agentprompt.EnergonBodyInput{
		Agent:          exec.Agent,
		Power:          exec.Power,
		RuntimePrompt:  runtimePrompt,
		Input:          exec.Parsed.Input,
		History:        history,
		Options:        exec.Parsed.Options,
		SourceTargetID: exec.Parsed.SourceTargetID,
	})
	start := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: exec.RequestID,
		Method:    exec.Request.Method,
		Host:      exec.Request.Host,
		Path:      exec.Request.Path,
		Headers:   exec.Request.Headers,
		Body:      body,
	})
	startPayload := start.Payload()
	if int(frontstream.InputInt64(startPayload["status"], 0)) == 2 {
		return agentTurnErrorResult(responseErrorMessage(startPayload, nil, "调用 LLM 能力失败"))
	}
	if botstream.FrameType(startPayload) == "result" {
		return resolveAgentTurn("", startPayload, gatewayLastID, nil)
	}

	var turn agentTurnResult
	text, status, message := s.collectGatewayStream(ctx, exec, gatewayStreamOptions{
		TimeoutMessage:      "智能体运行超时",
		InitialLastID:       gatewayLastID,
		CollectDeltaText:    true,
		CollectOutputs:      true,
		SuppressErrorResult: true,
		OnOutput: func(ctx context.Context, output map[string]any) error {
			if !isGatewayTimingOutput(output) {
				return nil
			}
			return s.writeStreamOutput(ctx, exec.RequestID, normalizeGatewayStreamOutput(output))
		},
		OnResult: func(ctx context.Context, frame map[string]any, state gatewayStreamState) (string, string, string) {
			turn = resolveAgentTurn(mergedGatewayText(state), frame, state.LastID, mergedGatewayOutput(state))
			switch turn.Kind {
			case agentTurnCanceled:
				return turn.Text, runStatusCanceled, "任务已取消"
			case agentTurnError:
				return turn.Text, runStatusFail, turn.Message
			default:
				return turn.Text, runStatusSuccess, ""
			}
		},
	})
	if turn.Kind != "" {
		return turn
	}
	if status == runStatusCanceled {
		return agentTurnResult{Kind: agentTurnCanceled, Text: text, Message: firstText(message, "任务已取消")}
	}
	if status != runStatusSuccess {
		return agentTurnErrorResult(firstText(message, "LLM 能力调用失败"))
	}
	return agentTurnResult{Kind: agentTurnFinal, Text: text, Output: map[string]any{"event": "final", "text": text}}
}

func mergedGatewayText(state gatewayStreamState) string {
	text := strings.TrimSpace(state.Text)
	merged := botprotocol.MergeStreamResult(state.Outputs)
	if mergedText := strings.TrimSpace(frontstream.InputText(merged["text"])); mergedText != "" {
		text = mergedText
	}
	return text
}

func mergedGatewayOutput(state gatewayStreamState) map[string]any {
	output := map[string]any(botprotocol.MergeStreamResult(state.Outputs))
	if strings.TrimSpace(frontstream.InputText(output["text"])) == "" {
		if text := strings.TrimSpace(state.Text); text != "" {
			output["text"] = text
		}
	}
	if len(output) == 0 {
		return nil
	}
	return output
}

func resolveAgentTurn(aggregateText string, frame map[string]any, gatewayLastID string, fallbackOutput map[string]any) agentTurnResult {
	output := map[string]any(botstream.FrameOutput(frame))
	if shouldUseGatewayFallback(output, fallbackOutput) {
		output = fallbackOutput
	}
	if botstream.OutputEvent(botprotocol.Output(output)) == "cancel" {
		return agentTurnResult{Kind: agentTurnCanceled, Text: aggregateText, Message: "任务已取消"}
	}
	if int(frontstream.InputInt64(frame["status"], 0)) == 2 {
		return agentTurnErrorResult(responseErrorMessage(frame, output, "LLM 能力调用失败"))
	}

	finalOutput := agentaction.NormalizeAgentFinalOutput(output, aggregateText)
	outputText := strings.TrimSpace(frontstream.InputText(finalOutput["text"]))
	if isGatewayTimingOutput(finalOutput) && strings.TrimSpace(aggregateText) != "" {
		outputText = strings.TrimSpace(aggregateText)
		finalOutput["event"] = "final"
		finalOutput["text"] = outputText
	}
	if outputText == "" {
		outputText = strings.TrimSpace(aggregateText)
	}
	if cleanText, interaction, ok := agentaction.ExtractInteraction(outputText); ok {
		return agentTurnResult{
			Kind:        agentTurnInteraction,
			Text:        cleanText,
			Output:      agentInteractionOutput(cleanText, interaction),
			Interaction: interaction,
			LastID:      gatewayLastID,
		}
	}
	if cleanText, action, ok := agentaction.ExtractAgentAction(outputText); ok {
		return agentTurnResult{
			Kind:   agentTurnAction,
			Text:   cleanText,
			Action: action,
			LastID: gatewayLastID,
		}
	}
	if cleanText, result, ok := agentaction.ExtractAgentResult(outputText); ok {
		finalOutput = agentaction.ApplyAgentResult(finalOutput, result, cleanText)
		outputText = strings.TrimSpace(frontstream.InputText(finalOutput["text"]))
	}
	if !agentaction.HasDisplayOutput(finalOutput) && outputText != "" {
		finalOutput["text"] = outputText
	}
	if !agentaction.HasDisplayOutput(finalOutput) {
		outputText = "内容生成完成，但没有收到可展示内容。请调整输入后重试。"
		finalOutput["event"] = "final"
		finalOutput["text"] = outputText
	}
	return agentTurnResult{
		Kind:   agentTurnFinal,
		Text:   outputText,
		Output: finalOutput,
		LastID: gatewayLastID,
	}
}

func shouldUseGatewayFallback(output map[string]any, fallback map[string]any) bool {
	if len(fallback) == 0 || !agentaction.HasDisplayOutput(fallback) {
		return false
	}
	if len(output) == 0 || !agentaction.HasDisplayOutput(output) {
		return true
	}
	return isGatewayTimingOutput(output)
}

func agentInteractionOutput(text string, interaction map[string]any) map[string]any {
	return map[string]any{
		"event":       "interaction",
		"text":        text,
		"interaction": interaction,
	}
}

func agentTurnErrorResult(message string) agentTurnResult {
	return agentTurnResult{
		Kind:    agentTurnError,
		Message: message,
	}
}
