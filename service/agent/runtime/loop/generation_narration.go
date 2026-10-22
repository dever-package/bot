package loop

import (
	"context"
	"encoding/json"
	"strings"
	"time"
	"unicode/utf8"

	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	generationNarrationTokens  = 256
	generationNarrationRunes   = 200
	generationNarrationTimeout = 15 * time.Second
)

const generationNarrationPrompt = `本次只补一句即将开始工作的说明，不执行任务。
沿用当前智能体的人设、语气和用户语言，结合用户要求及已决定的工作，自然简短地说明准备做什么。
只输出一句给用户阅读的话，不超过200字。不输出推理、措辞修改、字数提醒、工具名、参数、JSON、进度自评或内部说明。
工作尚未执行，不得声称已经生成、发送或完成。不调用任何工具，不提问，不扩展任务。`

func needsGenerationNarration(state *runState) bool {
	if state == nil || state.isDocumentWriter() || state.requiredToolName != "" ||
		state.narrationAttempted || strings.TrimSpace(state.lastText) != "" {
		return false
	}
	return len(generationNarrationOperations(state)) > 0
}

func generationNarrationOperations(state *runState) []any {
	operations := make([]any, 0, len(state.pendingTools))
	for _, call := range state.pendingTools {
		definition, exists := state.execution.registry.Definition(call.Name)
		if !exists {
			continue
		}
		kind := strings.ToLower(strings.TrimSpace(definition.Kind))
		if !isGeneratedMediaKind(kind) && kind != "document" {
			continue
		}
		operations = append(operations, map[string]any{"kind": kind, "purpose": definition.Title})
	}
	return operations
}

func (s Service) runGenerationNarration(ctx context.Context, controller *runController, state *runState) bool {
	text := ""
	if !state.narrationAttempted {
		// Persist the attempt before model I/O. Recovery keeps the decided calls
		// and falls back to system status instead of repeating either request.
		state.narrationAttempted = true
		if !s.commitRuntimeStep(state, "narration", "准备生成说明", "", nil, stepStatusSuccess) {
			return false
		}
		result, err := s.requestGenerationNarration(ctx, controller, state)
		if ctx.Err() != nil {
			s.finishContext(controller, state)
			return false
		}
		if err == nil {
			text = generationNarrationText(result)
		}
	}
	state.phase = runPhaseTool
	if text == "" {
		state.generationStatus = "系统：正在开始生成，请稍候"
	}
	if text != "" {
		state.AppendVisibleText(text)
		state.pendingModelText = text
	}
	// Keep pending calls out of native history until the explanation is settled;
	// restoring mounted skills may append other complete groups in this phase.
	state.history = append(state.history, assistantToolHistoryMessage(text, state.pendingTools))
	if !s.commitRuntimeStep(state, "narration", "生成说明", text, map[string]any{
		"system_status": text == "",
	}, stepStatusSuccess) {
		return false
	}
	if ctx.Err() != nil {
		s.finishContext(controller, state)
		return false
	}
	if text != "" {
		return s.publishCommittedModelText(ctx, state, text)
	}
	// This is a runtime status, never model/persona prose or a success receipt.
	if err := s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event": "status", "text": state.generationStatus,
		"runtime_status": generationRuntimeStatus(state.generationStatus),
		"meta":           map[string]any{"source": "runtime", "stage": "generation_started"},
	}); err != nil {
		logFinishRecovery(state, "generation_status_publish", err)
		return false
	}
	return true
}

func (s Service) requestGenerationNarration(ctx context.Context, controller *runController, state *runState) (modelStepResult, error) {
	execution := state.execution
	execution.agent.MaxOutputTokens = generationNarrationTokens
	execution.modelLimits = normalizedExecutionModelLimits(execution.modelLimits)
	execution.modelLimits.MaxOutputTokens = min(execution.modelLimits.MaxOutputTokens, generationNarrationTokens)
	execution.modelSingleAttempt = true
	role := strings.TrimSpace(execution.prompt) + "\n\n" + generationNarrationPrompt
	input := runtimeEventInput("generation_explanation_required", map[string]any{
		"operations": generationNarrationOperations(state),
	})
	narrationCtx, cancel := context.WithTimeout(ctx, generationNarrationTimeout)
	defer cancel()
	return s.callModelRequestWithRole(narrationCtx, controller, execution, role, input, state.history,
		nil, "none", false, "generation_narration", state.modelStep)
}

func generationNarrationText(result modelStepResult) string {
	text := strings.TrimSpace(result.Text)
	if text == "" || utf8.RuneCountInString(text) > generationNarrationRunes ||
		len(result.ToolCalls) > 0 || isLengthLimitedFinish(result.FinishMode) ||
		botprotocol.HasMediaOutput(result.Output) || json.Valid([]byte(text)) {
		return ""
	}
	for _, key := range []string{"interaction", "document", "artifacts", "rich", "content"} {
		if runtimemessageoutput.HasValue(result.Output[key]) {
			return ""
		}
	}
	return text
}

func (s Service) publishCommittedModelText(ctx context.Context, state *runState, text string) bool {
	if err := s.writeExecutionOutput(ctx, state.execution, map[string]any{"event": "delta", "text": text}); err != nil {
		// The checkpoint owns the text; restoration publishes it in reset and
		// continues the original calls without repeating the narration model.
		logFinishRecovery(state, "model_text_publish", err)
		return false
	}
	return true
}

func generationRuntimeStatus(text string) map[string]any {
	if text = strings.TrimSpace(text); text == "" {
		return nil
	}
	return map[string]any{"type": "generation_start", "text": text}
}
