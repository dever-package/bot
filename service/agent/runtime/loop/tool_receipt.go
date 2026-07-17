package loop

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const maxIdenticalToolFailures = 2

type toolExecutionMarker struct {
	ToolName     string `json:"tool_name"`
	ArgumentsKey string `json:"arguments_key"`
}

type toolReceipt struct {
	ToolName     string `json:"tool_name"`
	ArgumentsKey string `json:"arguments_key"`
	ModelContent string `json:"model_content,omitempty"`
	LastError    string `json:"last_error,omitempty"`
	Succeeded    bool   `json:"succeeded,omitempty"`
	FailureCount int    `json:"failure_count,omitempty"`
}

func (state *runState) reusableToolStep(call botprotocol.ToolCall, definition runtimeprovider.Definition) (toolStepResult, bool) {
	if state == nil || !definition.Execution.ReuseSuccessfulArguments {
		return toolStepResult{}, false
	}
	receipt := state.findToolReceipt(call)
	if receipt == nil || !receipt.Succeeded {
		return toolStepResult{}, false
	}
	content := strings.TrimSpace(receipt.ModelContent)
	if content == "" {
		content = "{}"
	}
	result := runtimeprovider.Result{Text: "已复用本轮已有工具结果"}
	return toolStepResult{
		result:  result,
		content: content,
		typeKey: "tool",
		title:   "复用工具结果: " + call.Name,
		status:  stepStatusSuccess,
		payload: map[string]any{"tool_call": firstToolCallValue(call), "reused": true},
	}, true
}

func (state *runState) repeatedFailureStep(call botprotocol.ToolCall) (toolStepResult, bool) {
	receipt := state.findToolReceipt(call)
	if receipt == nil || receipt.FailureCount < maxIdenticalToolFailures {
		return toolStepResult{}, false
	}
	err := fmt.Errorf("相同参数的工具调用已经连续失败，请根据原错误修改参数: %s", receipt.LastError)
	return toolStepResult{
		err:     err,
		content: toolErrorContent(err.Error()),
		typeKey: "tool",
		title:   "阻止重复失败工具调用",
		status:  stepStatusWarning,
		payload: map[string]any{"tool_call": firstToolCallValue(call), "error": err.Error(), "reused": true},
	}, true
}

func (state *runState) recordToolReceipt(call botprotocol.ToolCall, definition runtimeprovider.Definition, completed toolStepResult) {
	if state == nil || !completed.receiptable {
		return
	}
	key, ok := toolArgumentsKey(call)
	if !ok {
		return
	}
	receiptIndex := -1
	for index := range state.toolReceipts {
		current := state.toolReceipts[index]
		if current.ToolName == strings.TrimSpace(call.Name) && current.ArgumentsKey == key {
			receiptIndex = index
			break
		}
	}
	if completed.err == nil && !definition.Execution.ReuseSuccessfulArguments {
		if receiptIndex >= 0 {
			state.toolReceipts = append(state.toolReceipts[:receiptIndex], state.toolReceipts[receiptIndex+1:]...)
		}
		return
	}
	if receiptIndex < 0 {
		state.toolReceipts = append(state.toolReceipts, toolReceipt{
			ToolName: strings.TrimSpace(call.Name), ArgumentsKey: key,
		})
		receiptIndex = len(state.toolReceipts) - 1
	}
	receipt := &state.toolReceipts[receiptIndex]
	if completed.err == nil {
		receipt.Succeeded = true
		receipt.ModelContent = strings.TrimSpace(completed.content)
		receipt.FailureCount = 0
		receipt.LastError = ""
		return
	}
	receipt.Succeeded = false
	receipt.ModelContent = ""
	if completed.blockRetry {
		receipt.FailureCount = maxIdenticalToolFailures
	} else {
		receipt.FailureCount++
	}
	receipt.LastError = strings.TrimSpace(completed.err.Error())
}

func (state *runState) markToolExecution(call botprotocol.ToolCall) error {
	key, ok := toolArgumentsKey(call)
	if state == nil || !ok {
		return fmt.Errorf("无法保存工具执行标记: %s", call.Name)
	}
	state.activeToolExecution = &toolExecutionMarker{
		ToolName: strings.TrimSpace(call.Name), ArgumentsKey: key,
	}
	checkpoint, err := encodeCheckpoint(state.Checkpoint(state.seq))
	if err != nil {
		state.activeToolExecution = nil
		return err
	}
	ctx, cancel := maintenanceContext()
	defer cancel()
	err = state.repository.CommitCheckpoint(
		ctx,
		state.execution.runID,
		checkpoint,
		state.loaded,
		state.execution.workerID,
		time.Now().Add(runtimeLeaseDuration),
	)
	if err != nil {
		state.activeToolExecution = nil
	}
	return err
}

func (state *runState) consumeInterruptedToolExecution(call botprotocol.ToolCall) bool {
	if state == nil || state.activeToolExecution == nil {
		return false
	}
	key, ok := toolArgumentsKey(call)
	if !ok || state.activeToolExecution.ToolName != strings.TrimSpace(call.Name) || state.activeToolExecution.ArgumentsKey != key {
		return false
	}
	state.activeToolExecution = nil
	return true
}

func cloneToolExecutionMarker(source *toolExecutionMarker) *toolExecutionMarker {
	if source == nil {
		return nil
	}
	result := *source
	return &result
}

func (state *runState) findToolReceipt(call botprotocol.ToolCall) *toolReceipt {
	if state == nil {
		return nil
	}
	key, ok := toolArgumentsKey(call)
	if !ok {
		return nil
	}
	name := strings.TrimSpace(call.Name)
	for index := range state.toolReceipts {
		current := &state.toolReceipts[index]
		if current.ToolName == name && current.ArgumentsKey == key {
			return current
		}
	}
	return nil
}

func toolArgumentsKey(call botprotocol.ToolCall) (string, bool) {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return "", false
	}
	encoded, err := json.Marshal(arguments)
	if err != nil {
		return "", false
	}
	sum := sha256.Sum256(append([]byte(strings.TrimSpace(call.Name)+"\n"), encoded...))
	return hex.EncodeToString(sum[:]), true
}
