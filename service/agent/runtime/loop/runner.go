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
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
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
	version            int
	workerID           string
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
	checkpoint         runCheckpoint
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

type toolStepResult struct {
	result  runtimeprovider.Result
	err     error
	content string
	typeKey string
	title   string
	status  string
	payload map[string]any
}

func (s Service) run(controller *runController, execution execution) {
	state := newRunState(execution)
	defer s.runs.Remove(execution.requestID)
	defer controller.cancel()
	defer execution.close()
	defer func() {
		if recovered := recover(); recovered != nil && controller.StopReason() != "lease_lost" {
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: fmt.Sprintf("智能体运行异常: %v", recovered),
				stepType: "error", stepTitle: "运行异常", stepStatus: stepStatusFail,
			})
		}
	}()

	ctx := controller.Context()
	maxSteps := maxModelSteps(ctx, execution.agent)
	for {
		if ctx.Err() != nil {
			s.finishContext(controller, &state)
			return
		}
		switch state.phase {
		case runPhaseFinal:
			s.finishCheckpoint(&state)
			return
		case runPhaseTool:
			if !s.runToolStep(ctx, controller, &state) {
				return
			}
		case runPhaseModel:
			if state.modelStep > maxSteps {
				s.finish(&state, finishOutcome{
					status: runStatusFail, text: state.lastText,
					message:  fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps),
					stepType: "error", stepTitle: "达到最大步骤", stepStatus: stepStatusFail,
				})
				return
			}
			if !s.runModelStep(ctx, controller, &state, maxSteps) {
				return
			}
		default:
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: "智能体运行检查点无效",
				stepType: "error", stepTitle: "恢复失败", stepStatus: stepStatusFail,
			})
			return
		}
	}
}

func (s Service) runModelStep(ctx context.Context, controller *runController, state *runState, maxSteps int) bool {
	result, err := s.callModel(ctx, controller, state.execution, state.input, state.history, "auto")
	hasVisibleText := state.AppendVisibleText(result.Text)
	if err != nil {
		if ctx.Err() != nil {
			s.finishContext(controller, state)
			return false
		}
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "模型调用失败", stepStatus: stepStatusFail,
		})
		return false
	}

	calls := normalizeToolCallIDs(result.ToolCalls)
	result.ToolCalls = calls
	if err := s.prepareDocumentModelStep(ctx, state, result); err != nil {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "保存图文内容失败", stepStatus: stepStatusFail,
		})
		return false
	}
	if len(calls) == 0 {
		return s.finishModelOutput(state, result)
	}

	if state.modelStep >= maxSteps && !terminalToolCalls(state.execution.registry, calls) {
		state.MarkFinal(runStatusFail, state.lastText, nil, fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps))
		if !s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
			"finish_reason": result.FinishMode,
			"tool_calls":    botprotocol.ToolCallsValue(calls),
		}, stepStatusSuccess) {
			return false
		}
		s.finishCheckpoint(state)
		return false
	}

	if state.modelStep == 1 {
		state.history = append(state.history, userHistoryMessage(state.execution.input))
	}
	state.history = append(state.history, assistantToolHistoryMessage(result.Text, calls))
	state.phase = runPhaseTool
	state.pendingTools = calls
	state.pendingIndex = 0
	state.pendingVisible = hasVisibleText
	return s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"tool_calls":    botprotocol.ToolCallsValue(calls),
	}, stepStatusSuccess)
}

func (s Service) finishModelOutput(state *runState, result modelStepResult) bool {
	text := strings.TrimSpace(state.lastText)
	if text == "" {
		s.finish(state, finishOutcome{
			status: runStatusFail, message: "模型未返回可展示内容",
			stepType: "error", stepTitle: "模型输出为空", stepStatus: stepStatusFail,
		})
		return false
	}
	output := map[string]any(result.Output)
	if output == nil {
		output = map[string]any{}
	}
	output["event"] = "final"
	output["text"] = text
	state.MarkFinal(runStatusSuccess, text, output, "")
	if !s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
	}, stepStatusSuccess) {
		return false
	}
	s.finishCheckpoint(state)
	return false
}

func terminalToolCalls(registry *runtimetool.Registry, calls []botprotocol.ToolCall) bool {
	if registry == nil || len(calls) == 0 {
		return false
	}
	for _, call := range calls {
		definition, exists := registry.Definition(call.Name)
		if !exists {
			return false
		}
		switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
		case "control", "interaction", "presentation":
		default:
			return false
		}
	}
	return true
}

func (s Service) runToolStep(ctx context.Context, controller *runController, state *runState) bool {
	if state.pendingIndex < 0 || state.pendingIndex >= len(state.pendingTools) {
		state.phase = runPhaseModel
		state.modelStep++
		state.input = toolContinuationInput()
		state.pendingTools = nil
		state.pendingIndex = 0
		state.pendingVisible = false
		return true
	}
	call := state.pendingTools[state.pendingIndex]
	completed, interrupted := s.executeToolStep(ctx, controller, state, call)
	if interrupted {
		s.finishContext(controller, state)
		return false
	}

	state.AbsorbToolOutput(completed.result.Content)
	if completed.err == nil && call.Name == "load_skill" {
		if arguments, parseErr := botprotocol.ToolCallArguments(call); parseErr == nil {
			state.AddLoadedSkill(botprotocol.AsText(arguments["key"]))
		}
	}
	state.history = append(state.history, toolHistoryMessage(call, completed.content))
	state.pendingIndex++

	terminal := completed.err == nil && completed.result.Terminal
	if terminal {
		text := terminalResultText(state.lastText, completed)
		output := completed.result.Output()
		output["text"] = text
		state.MarkFinal(runStatusSuccess, text, output, "")
	} else if state.pendingIndex >= len(state.pendingTools) {
		visible := state.pendingVisible
		state.phase = runPhaseModel
		state.modelStep++
		state.input = toolContinuationInput()
		state.pendingTools = nil
		state.pendingIndex = 0
		state.pendingVisible = false
		if visible {
			_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{"event": "delta", "text": "\n\n"})
		}
	}
	if !s.commitRuntimeStep(state, completed.typeKey, completed.title, toolStepContent(completed.result.Text, completed.err), completed.payload, completed.status) {
		return false
	}
	if terminal {
		s.finishCheckpoint(state)
		return false
	}
	return true
}

func terminalResultText(current string, completed toolStepResult) string {
	current = strings.TrimSpace(current)
	message := strings.TrimSpace(completed.result.Text)
	if current == "" {
		return message
	}
	if completed.typeKey != "presentation" || message == "" || strings.HasSuffix(current, message) {
		return current
	}
	return current + "\n\n" + message
}

func (s Service) executeToolStep(ctx context.Context, controller *runController, state *runState, call botprotocol.ToolCall) (toolStepResult, bool) {
	definition, _ := state.execution.registry.Definition(call.Name)
	if state.documentID > 0 && runtimeartifact.IsSupportedKind(definition.Kind) {
		return s.scheduleDocumentArtifact(ctx, state, call, definition), false
	}
	streamActivity := shouldStreamToolActivity(definition)
	artifactBatch, toolErr := s.beginToolArtifactBatch(ctx, state.execution, call, definition, 0, 0)
	startedOutput := artifactBatch.startedOutput(ctx)
	if streamActivity {
		state.RecordToolActivity(toolStartedOutput(call, definition, startedOutput))
		_ = s.writeToolStarted(ctx, state.execution, call, definition, startedOutput)
	}

	childRequestID := deterministicToolRequestID(state.execution.requestID, call)
	toolResult, recovered := artifactBatch.recoveredResult(ctx)
	if toolErr == nil && !recovered {
		controller.SetChild(childRequestID)
		toolResult, toolErr = state.execution.registry.Execute(ctx, call, childRequestID, func(output map[string]any) error {
			if !streamActivity {
				return nil
			}
			return s.writeToolProgress(ctx, state.execution, call, definition, output)
		})
		controller.ClearChild(childRequestID)
	}
	if ctx.Err() != nil {
		if controller.StopReason() == "canceled" {
			cancelErr := fmt.Errorf("生成已停止")
			toolResult.Content = artifactBatch.fail(context.Background(), cancelErr.Error())
			state.AbsorbToolOutput(toolResult.Content)
			if streamActivity {
				state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, cancelErr))
				_ = s.writeToolFinished(context.Background(), state.execution, call, definition, toolResult, cancelErr)
			}
		}
		return toolStepResult{}, true
	}

	if toolErr != nil {
		toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
	} else {
		if !recovered {
			toolResult = artifactBatch.complete(ctx, toolResult)
		}
		generated := toolResultMediaReferences(toolResult.Content)
		state.execution.mediaReferences = appendMediaReferences(state.execution.mediaReferences, generated)
		state.execution.registry.AddMediaReferences(generated)
	}

	result := toolStepResult{
		result:  toolResult,
		err:     toolErr,
		typeKey: "tool",
		title:   "工具调用: " + call.Name,
		status:  stepStatusSuccess,
		payload: map[string]any{"tool_call": firstToolCallValue(call)},
	}
	if toolErr != nil {
		result.content = toolErrorContent(toolFailureText(definition, toolErr))
		result.status = stepStatusWarning
		result.payload["error"] = toolErr.Error()
		if toolResult.Content != nil {
			result.payload["output"] = toolResult.Content
		}
	} else {
		result.content = toolResult.ModelContent()
		result.payload["output"] = toolResult.Output()
		if len(toolResult.Tools) > 0 {
			result.payload["added_tools"] = state.execution.registry.Names()
		}
		if len(toolResult.Interaction) > 0 {
			result.typeKey = "interaction"
			result.title = "等待用户输入"
		} else if toolResult.Terminal {
			switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
			case "presentation":
				result.typeKey = "presentation"
				result.title = "展示后续建议"
			default:
				result.typeKey = "control"
				result.title = "任务完成"
			}
		}
	}
	if streamActivity {
		state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, toolErr))
		_ = s.writeToolFinished(ctx, state.execution, call, definition, toolResult, toolErr)
	}
	return result, false
}

func (s Service) commitRuntimeStep(state *runState, stepType string, title string, content string, payload any, status string) bool {
	if err := state.Step(stepType, title, content, payload, status); err != nil {
		if errors.Is(err, errRunLeaseLost) {
			return false
		}
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "保存运行步骤失败", stepStatus: stepStatusFail,
		})
		return false
	}
	return true
}

func (s Service) callModel(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, toolChoice string) (modelStepResult, error) {
	childRequestID := uuid.NewString()
	controller.SetChild(childRequestID)
	defer controller.ClearChild(childRequestID)

	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: childRequestID,
		Method:    execution.transport.Method,
		Host:      execution.transport.Host,
		Path:      execution.transport.Path,
		Headers:   execution.transport.Headers,
		Body:      buildGatewayBody(execution.agent, execution.power, execution.prompt, input, history, execution.registry.Definitions(), toolChoice),
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
	if controller.StopReason() == "lease_lost" {
		return
	}
	if controller.StopReason() == "canceled" {
		s.finish(state, finishOutcome{
			status: runStatusCanceled, text: state.lastText, message: "任务已取消",
			stepType: "error", stepTitle: "运行已取消", stepStatus: stepStatusWarning,
		})
		return
	}
	s.finish(state, finishOutcome{
		status: runStatusFail, text: state.lastText, message: "智能体运行超时",
		stepType: "error", stepTitle: "运行超时", stepStatus: stepStatusFail,
	})
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
