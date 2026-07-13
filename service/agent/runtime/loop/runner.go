package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

type execution struct {
	runID              uint64
	requestID          string
	startedAt          time.Time
	agent              agentmodel.Agent
	power              energonmodel.Power
	sessionID          uint64
	userMessageID      uint64
	assistantMessageID uint64
	prompt             string
	input              map[string]any
	history            []any
	registry           *runtimetool.Registry
	transport          modelTransport
	persistChat        bool
	onStream           func(map[string]any)
	completion         chan runCompletion
	cleanup            func()
	mediaReferences    []runtimeprovider.MediaReference
}

type modelTransport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
}

func (execution execution) close() {
	if execution.cleanup != nil {
		execution.cleanup()
	}
}

type modelStepResult struct {
	Text       string
	Output     botprotocol.Output
	ToolCalls  []botprotocol.ToolCall
	FinishMode string
}

func (s Service) run(controller *runController, execution execution) {
	state := runState{execution: execution, repository: s.repository, seq: 1}
	defer s.runs.Remove(execution.requestID)
	defer controller.cancel()
	defer execution.close()
	defer func() {
		if recovered := recover(); recovered != nil {
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: fmt.Sprintf("智能体运行异常: %v", recovered),
				stepType: "error", stepTitle: "运行异常", stepStatus: stepStatusFail,
			})
		}
	}()

	ctx := controller.Context()
	conversation := append(append([]any{}, execution.history...), userHistoryMessage(execution.input))
	history := execution.history
	input := gatewayInput(execution.input)
	maxSteps := maxModelSteps(ctx, execution.agent)

	for step := 1; step <= maxSteps; step++ {
		if ctx.Err() != nil {
			s.finishContext(controller, &state)
			return
		}
		modelResult, err := s.callModel(ctx, controller, execution, input, history)
		if err == nil && len(modelResult.ToolCalls) > 0 && strings.TrimSpace(modelResult.Text) == "" {
			modelResult.Text = fallbackToolPreamble(modelResult.ToolCalls, execution.registry)
			if modelResult.Text != "" {
				_ = s.writeExecutionOutput(ctx, execution, map[string]any{"event": "delta", "text": modelResult.Text})
			}
		}
		hasVisibleText := state.AppendVisibleText(modelResult.Text)
		if err != nil {
			if ctx.Err() != nil {
				s.finishContext(controller, &state)
				return
			}
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: err.Error(),
				stepType: "error", stepTitle: "模型调用失败", stepStatus: stepStatusFail,
			})
			return
		}
		if err := state.Step("model", modelStepTitle(modelResult), modelResult.Text, map[string]any{
			"finish_reason": modelResult.FinishMode,
			"tool_calls":    botprotocol.ToolCallsValue(modelResult.ToolCalls),
		}, stepStatusSuccess); err != nil {
			s.finish(&state, finishOutcome{status: runStatusFail, text: state.lastText, message: err.Error(), stepType: "error", stepTitle: "保存模型步骤失败", stepStatus: stepStatusFail})
			return
		}

		if len(modelResult.ToolCalls) == 0 {
			text := strings.TrimSpace(state.lastText)
			if text == "" {
				s.finish(&state, finishOutcome{status: runStatusFail, message: "模型未返回可展示内容", stepType: "error", stepTitle: "模型输出为空", stepStatus: stepStatusFail})
				return
			}
			output := map[string]any(modelResult.Output)
			output["event"] = "final"
			output["text"] = text
			output = state.ApplyArtifacts(output)
			s.finish(&state, finishOutcome{status: runStatusSuccess, text: text, output: output, stepType: "final", stepTitle: "最终输出", stepStatus: stepStatusSuccess})
			return
		}
		if step == maxSteps {
			s.finish(&state, finishOutcome{status: runStatusFail, text: state.lastText, message: fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps), stepType: "error", stepTitle: "达到最大步骤", stepStatus: stepStatusFail})
			return
		}

		calls := normalizeToolCallIDs(modelResult.ToolCalls)
		conversation = append(conversation, assistantToolHistoryMessage(modelResult.Text, calls))
		for _, call := range calls {
			if ctx.Err() != nil {
				s.finishContext(controller, &state)
				return
			}
			definition, _ := execution.registry.Definition(call.Name)
			streamActivity := shouldStreamToolActivity(definition)
			artifactBatch, toolErr := s.beginToolArtifactBatch(ctx, execution, call, definition)
			startedOutput := artifactBatch.startedOutput(ctx)
			if streamActivity {
				state.RecordToolActivity(toolStartedOutput(call, definition, startedOutput))
				_ = s.writeToolStarted(ctx, execution, call, definition, startedOutput)
			}
			childRequestID := uuid.NewString()
			toolResult := runtimeprovider.Result{}
			if toolErr == nil {
				controller.SetChild(childRequestID)
				toolResult, toolErr = execution.registry.Execute(ctx, call, childRequestID, func(output map[string]any) error {
					if !streamActivity {
						return nil
					}
					return s.writeToolProgress(ctx, execution, call, definition, output)
				})
				controller.ClearChild(childRequestID)
			}
			if ctx.Err() != nil {
				cancelErr := fmt.Errorf("生成已停止")
				toolResult.Content = artifactBatch.fail(context.Background(), cancelErr.Error())
				state.AbsorbToolOutput(toolResult.Content)
				if streamActivity {
					state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, cancelErr))
					_ = s.writeToolFinished(context.Background(), execution, call, definition, toolResult, cancelErr)
				}
				s.finishContext(controller, &state)
				return
			}
			if toolErr != nil {
				toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
			} else {
				toolResult = artifactBatch.complete(ctx, toolResult)
				generatedReferences := toolResultMediaReferences(toolResult.Content)
				execution.mediaReferences = appendMediaReferences(execution.mediaReferences, generatedReferences)
				execution.registry.AddMediaReferences(generatedReferences)
			}

			content := ""
			stepType := "tool"
			stepTitle := "工具调用: " + call.Name
			stepStatus := stepStatusSuccess
			stepPayload := map[string]any{"tool_call": firstToolCallValue(call)}
			if toolErr != nil {
				content = toolErrorContent(toolErr.Error())
				stepStatus = stepStatusWarning
				stepPayload["error"] = toolErr.Error()
				if toolResult.Content != nil {
					stepPayload["output"] = toolResult.Content
					state.AbsorbToolOutput(toolResult.Content)
				}
			} else {
				content = toolResult.ModelContent()
				stepPayload["output"] = toolResult.Output()
				state.AbsorbToolOutput(toolResult.Content)
				if call.Name == "load_skill" {
					if arguments, parseErr := botprotocol.ToolCallArguments(call); parseErr == nil {
						state.AddLoadedSkill(botprotocol.AsText(arguments["key"]))
					}
				}
				if len(toolResult.Tools) > 0 {
					stepPayload["added_tools"] = execution.registry.Names()
				}
				if len(toolResult.Interaction) > 0 {
					stepType = "interaction"
					stepTitle = "等待用户输入"
				} else if toolResult.Terminal {
					stepType = "presentation"
					stepTitle = "展示后续建议"
				}
			}
			if streamActivity {
				state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, toolErr))
				_ = s.writeToolFinished(ctx, execution, call, definition, toolResult, toolErr)
			}
			if err := state.Step(stepType, stepTitle, toolStepContent(toolResult.Text, toolErr), stepPayload, stepStatus); err != nil {
				s.finish(&state, finishOutcome{status: runStatusFail, text: state.lastText, message: err.Error(), stepType: "error", stepTitle: "保存工具步骤失败", stepStatus: stepStatusFail})
				return
			}
			conversation = append(conversation, toolHistoryMessage(call, content))
			if toolErr == nil && toolResult.Terminal {
				text := strings.TrimSpace(state.lastText)
				if text == "" {
					text = strings.TrimSpace(toolResult.Text)
				}
				output := toolResult.Output()
				output["text"] = text
				s.finish(&state, finishOutcome{status: runStatusSuccess, text: text, output: output})
				return
			}
		}
		if hasVisibleText {
			_ = s.writeExecutionOutput(ctx, execution, map[string]any{"event": "delta", "text": "\n\n"})
		}
		history = conversation
		input = toolContinuationInput()
	}
}

func (s Service) callModel(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any) (modelStepResult, error) {
	childRequestID := uuid.NewString()
	controller.SetChild(childRequestID)
	defer controller.ClearChild(childRequestID)

	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: childRequestID,
		Method:    execution.transport.Method,
		Host:      execution.transport.Host,
		Path:      execution.transport.Path,
		Headers:   execution.transport.Headers,
		Body:      buildGatewayBody(execution.agent, execution.power, execution.prompt, input, history, execution.registry.Definitions()),
	})
	payload := response.Payload()
	if int(frontstream.InputInt64(payload["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{}, fmt.Errorf("%s", responseMessage(payload, "调用 LLM 能力失败"))
	}
	if botstream.FrameType(payload) == botprotocol.ResponseTypeResult {
		return modelResultFromOutput(botstream.FrameOutput(payload)), nil
	}

	collected := s.gateway.CollectStream(ctx, botstream.CollectOptions{
		RequestID:        childRequestID,
		InitialLastID:    "0-0",
		Block:            streamReadBlock,
		CollectDeltaText: true,
		CollectOutputs:   true,
		OnOutput: func(ctx context.Context, output botprotocol.Output) error {
			switch botstream.OutputEvent(output) {
			case "", "delta":
				// Whitespace-only deltas carry Markdown block boundaries.
				if botprotocol.AsText(output["text"]) != "" {
					return s.writeExecutionOutput(ctx, execution, map[string]any(output))
				}
			case "status", "warning":
				return s.writeExecutionOutput(ctx, execution, map[string]any(output))
			}
			return nil
		},
	})
	if collected.Err != nil {
		_ = s.gateway.StopStream(context.Background(), childRequestID)
		return modelStepResult{Text: collected.State.Text}, collected.Err
	}
	if int(frontstream.InputInt64(collected.Frame["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{Text: collected.State.Text}, fmt.Errorf("%s", responseMessage(collected.Frame, "LLM 能力调用失败"))
	}
	output := botstream.FrameOutput(collected.Frame)
	if len(output) == 0 {
		output = botprotocol.MergeStreamResult(collected.State.Outputs)
	}
	result := modelResultFromOutput(output)
	if strings.TrimSpace(result.Text) == "" {
		result.Text = collected.State.Text
	}
	return result, nil
}

func modelResultFromOutput(output botprotocol.Output) modelStepResult {
	return modelStepResult{
		Text:       strings.TrimSpace(botprotocol.AsText(output["text"])),
		Output:     output,
		ToolCalls:  botprotocol.ParseToolCalls(output["tool_calls"]),
		FinishMode: strings.TrimSpace(botprotocol.AsText(output["finish_reason"])),
	}
}

func modelStepTitle(result modelStepResult) string {
	if len(result.ToolCalls) > 0 {
		return "模型请求工具"
	}
	return "模型输出"
}

func toolStepContent(text string, err error) string {
	if err != nil {
		return err.Error()
	}
	return strings.TrimSpace(text)
}

func firstToolCallValue(call botprotocol.ToolCall) any {
	values := botprotocol.ToolCallsValue([]botprotocol.ToolCall{call})
	if len(values) == 0 {
		return map[string]any{}
	}
	return values[0]
}

func maxModelSteps(ctx context.Context, agent agentmodel.Agent) int {
	config := agentmodel.DefaultRuntimeConfig()
	if row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{"id": agentmodel.DefaultRuntimeConfigID}); row != nil {
		config = runtimeconfig.WithDefaults(*row)
	}
	steps := agent.MaxAutoSteps
	if steps <= 0 {
		steps = config.DefaultMaxAutoSteps
	}
	if steps > config.HardMaxAutoSteps {
		steps = config.HardMaxAutoSteps
	}
	if steps <= 0 {
		return 1
	}
	return steps
}

func (s Service) finishContext(controller *runController, state *runState) {
	if controller.StopReason() == "canceled" || errors.Is(controller.Context().Err(), context.Canceled) {
		s.finish(state, finishOutcome{status: runStatusCanceled, text: state.lastText, message: "任务已取消", stepType: "error", stepTitle: "运行已取消", stepStatus: stepStatusWarning})
		return
	}
	s.finish(state, finishOutcome{status: runStatusFail, text: state.lastText, message: "智能体运行超时", stepType: "error", stepTitle: "运行超时", stepStatus: stepStatusFail})
}

func responseMessage(payload map[string]any, fallback string) string {
	output := botstream.FrameOutput(payload)
	for _, value := range []any{payload["msg"], output["error"], output["text"]} {
		if message := strings.TrimSpace(botprotocol.AsText(value)); message != "" {
			return message
		}
	}
	return fallback
}
