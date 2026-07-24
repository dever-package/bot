package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const maxRequiredToolFailures = 2

func (s Service) runToolStep(ctx context.Context, controller *runController, state *runState) bool {
	if state.pendingIndex < 0 || state.pendingIndex >= len(state.pendingTools) {
		state.continueAfterTools()
		return true
	}
	call := state.pendingTools[state.pendingIndex]
	completed, interrupted := s.executeToolStep(ctx, controller, state, call)
	if interrupted {
		s.finishContext(controller, state)
		return false
	}

	definition, _ := state.execution.registry.Definition(call.Name)
	if !isDocumentArtifactTool(state, definition) {
		state.AbsorbToolOutput(completed.result.Content, definition)
	}
	state.recordToolReceipt(call, definition, completed)
	knowledgeResultResolved := completed.err == nil && knowledgeResultCountsAsUsed(completed.result)
	if knowledgeResultResolved {
		state.addKnowledgeNodeReferences(call.Name, completed.result.Content)
	}
	if knowledgeResultResolved && strings.EqualFold(strings.TrimSpace(definition.Kind), "knowledge") {
		state.knowledgeUsed = true
	}
	if completed.err == nil && call.Name == "load_skill" {
		if arguments, parseErr := botprotocol.ToolCallArguments(call); parseErr == nil {
			state.AddLoadedSkill(agentmodel.LoadedSkillRef{
				Key:         botprotocol.AsText(arguments["key"]),
				ContentHash: toolResultText(completed.result.Content, "content_hash"),
			})
		}
	}
	state.history = append(state.history, toolHistoryMessage(call, completed.content))
	state.pendingIndex++

	terminal := completed.result.Terminal
	if state.isRequiredToolCall(call) {
		if completed.err == nil {
			state.requireTool("")
		} else if !terminal {
			state.requiredToolFailures++
			if state.requiredToolFailures >= maxRequiredToolFailures {
				terminal = true
				completed.result.Terminal = true
				completed.title = "终止必要工具重试"
				if completed.payload == nil {
					completed.payload = map[string]any{}
				}
				completed.payload["circuit_open"] = true
				completed.payload["required_tool_failure_count"] = state.requiredToolFailures
			}
		}
	}
	if terminal {
		text := terminalResultText(state.lastText, completed)
		output := completed.result.Output()
		output["text"] = text
		output["completion_mode"] = call.Name
		output["knowledge_used"] = state.knowledgeUsed
		status := runStatusSuccess
		message := ""
		if completed.err != nil {
			status = runStatusFail
			message = completed.err.Error()
		}
		state.MarkFinal(status, text, output, message)
	} else if state.pendingIndex >= len(state.pendingTools) {
		if state.continueAfterTools() && !state.isDocumentWriter() {
			_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{"event": "delta", "text": "\n\n"})
		}
	}
	commit := s.commitRuntimeStep
	if terminal {
		commit = s.commitFinalRuntimeStep
	}
	if !commit(state, completed.typeKey, completed.title, toolStepContent(completed.result.Text, completed.err), completed.payload, completed.status) {
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
	if current != "" {
		return current
	}
	return strings.TrimSpace(completed.result.Text)
}

func (s Service) executeToolStep(ctx context.Context, controller *runController, state *runState, call botprotocol.ToolCall) (toolStepResult, bool) {
	definition, _ := state.execution.registry.Definition(call.Name)
	if validationErr := validateTerminalCall(ctx, state, call); validationErr != nil {
		return toolStepResult{
			err:         validationErr,
			receiptable: true,
			content:     toolErrorContent(validationErr.Error()),
			typeKey:     "control",
			title:       "终态工具调用无效",
			status:      stepStatusWarning,
			payload: map[string]any{
				"tool_call": firstToolCallValue(call),
				"error":     validationErr.Error(),
			},
		}, false
	}
	if recovered, ok := recoverUnknownKnowledgeNodeReference(state, call, definition); ok {
		return recovered, false
	}
	if reused, ok := state.reusableToolStep(call, definition); ok {
		return reused, false
	}
	if repeated, ok := state.repeatedFailureStep(call); ok {
		return repeated, false
	}
	if strings.EqualFold(strings.TrimSpace(call.Name), runtimeprovider.ComposeDocumentToolName) {
		return s.executeComposeDocumentStep(ctx, state, call), false
	}
	if shouldEnqueueArtifact(state.execution, definition) {
		if state.isDocumentWriter() {
			return s.enqueueDocumentArtifact(ctx, state, call, definition), false
		}
		return s.enqueueMessageArtifact(ctx, state, call, definition), false
	}
	if definition.Execution.PreventDuplicateRecovery {
		arguments, parseErr := botprotocol.ToolCallArguments(call)
		if parseErr != nil {
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, parseErr), false
		}
		if validationErr := state.execution.registry.ValidateArguments(call.Name, arguments); validationErr != nil {
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, validationErr), false
		}
		if state.consumeInterruptedToolExecution(call) {
			err := fmt.Errorf("该工具上次执行结果未能确认，为避免重复执行，本轮不再自动重放: %s", call.Name)
			return toolStepResult{
				err: err, receiptable: true, blockRetry: true,
				content: toolErrorContent(err.Error()),
				typeKey: "tool", title: "阻止重复工具执行", status: stepStatusWarning,
				payload: map[string]any{"tool_call": firstToolCallValue(call), "error": err.Error(), "recovery_blocked": true},
			}, false
		}
		if err := state.markToolExecution(call); err != nil {
			if errors.Is(err, errRunLeaseLost) {
				controller.Stop("lease_lost")
				return toolStepResult{}, true
			}
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, err), false
		}
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
		toolCtx, cancel := operationContext(ctx, definition.RequestTimeout(toolRequestTimeout))
		controller.SetChild(childRequestID)
		toolResult, toolErr = state.execution.registry.Execute(toolCtx, call, childRequestID, func(output map[string]any) error {
			if !streamActivity {
				return nil
			}
			return s.writeToolProgress(toolCtx, state.execution, call, definition, output)
		})
		controller.ClearChild(childRequestID)
		if toolErr == nil && ctx.Err() == nil && toolCtx.Err() != nil {
			toolErr = fmt.Errorf("工具调用超时: %s", call.Name)
		}
		cancel()
	}
	if ctx.Err() != nil {
		if controller.StopReason() == "canceled" {
			cancelErr := fmt.Errorf("生成已停止")
			cancelCtx, cancel := maintenanceContext()
			toolResult.Content = artifactBatch.fail(cancelCtx, cancelErr.Error())
			state.AbsorbToolOutput(toolResult.Content, definition)
			if streamActivity {
				state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, cancelErr))
				_ = s.writeToolFinished(cancelCtx, state.execution, call, definition, toolResult, cancelErr)
			}
			cancel()
		}
		return toolStepResult{}, true
	}

	if toolErr != nil {
		toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
	} else {
		if !recovered {
			toolResult, toolErr = artifactBatch.complete(ctx, toolResult)
			if toolErr != nil {
				toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
			}
		}
		if toolErr == nil {
			generated := toolResultMediaReferences(toolResult.Content)
			state.execution.mediaReferences = appendMediaReferences(state.execution.mediaReferences, generated)
			state.execution.registry.AddMediaReferences(generated)
		}
	}

	result := buildToolStepResult(state.execution.registry, call, definition, toolResult, toolErr)
	if definition.Execution.PreventDuplicateRecovery {
		state.activeToolExecution = nil
	}
	if streamActivity {
		state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, toolErr))
		_ = s.writeToolFinished(ctx, state.execution, call, definition, toolResult, toolErr)
	}
	return result, false
}

func buildToolStepResult(
	registry *runtimetool.Registry,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
	toolResult runtimeprovider.Result,
	toolErr error,
) toolStepResult {
	result := toolStepResult{
		result:      toolResult,
		err:         toolErr,
		receiptable: true,
		typeKey:     "tool",
		title:       "工具调用: " + call.Name,
		status:      stepStatusSuccess,
		payload:     map[string]any{"tool_call": firstToolCallValue(call)},
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
		if len(toolResult.Tools) > 0 && registry != nil {
			result.payload["added_tools"] = registry.Names()
		}
		if len(toolResult.Interaction) > 0 {
			result.typeKey = "interaction"
			result.title = "等待用户输入"
		} else if strings.EqualFold(strings.TrimSpace(definition.Kind), "presentation") {
			result.typeKey = "presentation"
			result.title = "展示后续建议"
		} else if toolResult.Terminal {
			result.typeKey = "control"
			result.title = "任务完成"
		}
	}
	return result
}

func (s Service) commitRuntimeStep(state *runState, stepType string, title string, content string, payload any, status string) bool {
	return s.commitRuntimeStepState(state, false, stepType, title, content, payload, status)
}

func (s Service) commitFinalRuntimeStep(state *runState, stepType string, title string, content string, payload any, status string) bool {
	return s.commitRuntimeStepState(state, true, stepType, title, content, payload, status)
}

func (s Service) commitRuntimeStepState(
	state *runState,
	final bool,
	stepType string,
	title string,
	content string,
	payload any,
	status string,
) bool {
	if final {
		state.finalCommitted = true
	}
	if err := state.Step(stepType, title, content, payload, status); err != nil {
		if final {
			state.finalCommitted = false
		}
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
