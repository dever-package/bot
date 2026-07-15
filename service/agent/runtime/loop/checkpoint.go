package loop

import (
	"encoding/json"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	runtimeSnapshotVersion = 1
	runPhaseModel          = "model"
	runPhaseTool           = "tool"
	runPhaseFinal          = "final"
)

// executionSnapshot contains only durable business input. Process-local callbacks,
// server contexts and credentials deliberately stay outside the persisted payload.
type executionSnapshot struct {
	Version            int                              `json:"version"`
	Agent              agentmodel.Agent                 `json:"agent"`
	Power              energonmodel.Power               `json:"power"`
	SessionID          uint64                           `json:"session_id,omitempty"`
	UserMessageID      uint64                           `json:"user_message_id,omitempty"`
	AssistantMessageID uint64                           `json:"assistant_message_id,omitempty"`
	Prompt             string                           `json:"prompt"`
	Input              map[string]any                   `json:"input"`
	History            []any                            `json:"history"`
	Transport          persistedTransport               `json:"transport"`
	PersistChat        bool                             `json:"persist_chat"`
	MediaReferences    []runtimeprovider.MediaReference `json:"media_references,omitempty"`
}

type persistedTransport struct {
	Method string `json:"method,omitempty"`
	Host   string `json:"host,omitempty"`
	Path   string `json:"path,omitempty"`
}

type runCheckpoint struct {
	Version          int                              `json:"version"`
	Phase            string                           `json:"phase"`
	ModelStep        int                              `json:"model_step"`
	Seq              int                              `json:"seq"`
	Input            map[string]any                   `json:"input"`
	History          []any                            `json:"history"`
	LastText         string                           `json:"last_text,omitempty"`
	Artifacts        map[string]any                   `json:"artifacts,omitempty"`
	Activities       []map[string]any                 `json:"activities,omitempty"`
	LoadedSkills     []string                         `json:"loaded_skills,omitempty"`
	MediaReferences  []runtimeprovider.MediaReference `json:"media_references,omitempty"`
	PendingTools     []botprotocol.ToolCall           `json:"pending_tools,omitempty"`
	PendingIndex     int                              `json:"pending_index,omitempty"`
	PendingVisible   bool                             `json:"pending_visible,omitempty"`
	DocumentID       uint64                           `json:"document_id,omitempty"`
	DocumentTextStep int                              `json:"document_text_step,omitempty"`
	FinalStatus      string                           `json:"final_status,omitempty"`
	FinalText        string                           `json:"final_text,omitempty"`
	FinalMessage     string                           `json:"final_message,omitempty"`
	FinalOutput      map[string]any                   `json:"final_output,omitempty"`
	FinalCommitted   bool                             `json:"final_committed,omitempty"`
}

func snapshotFromExecution(execution execution) executionSnapshot {
	return executionSnapshot{
		Version:            runtimeSnapshotVersion,
		Agent:              execution.agent,
		Power:              execution.power,
		SessionID:          execution.sessionID,
		UserMessageID:      execution.userMessageID,
		AssistantMessageID: execution.assistantMessageID,
		Prompt:             execution.prompt,
		Input:              cloneMap(execution.input),
		History:            append([]any(nil), execution.history...),
		Transport: persistedTransport{
			Method: execution.transport.Method,
			Host:   execution.transport.Host,
			Path:   execution.transport.Path,
		},
		PersistChat:     execution.persistChat,
		MediaReferences: append([]runtimeprovider.MediaReference(nil), execution.mediaReferences...),
	}
}

func initialCheckpoint(execution execution) runCheckpoint {
	return runCheckpoint{
		Version:         runtimeSnapshotVersion,
		Phase:           runPhaseModel,
		ModelStep:       1,
		Seq:             1,
		Input:           gatewayInput(execution.input),
		History:         append([]any(nil), execution.history...),
		MediaReferences: append([]runtimeprovider.MediaReference(nil), execution.mediaReferences...),
	}
}

func encodeSnapshot(value executionSnapshot) (string, error) {
	return encodeRuntimeJSON(value, "执行快照")
}

func encodeCheckpoint(value runCheckpoint) (string, error) {
	return encodeRuntimeJSON(value, "运行检查点")
}

func decodeSnapshot(value string) (executionSnapshot, error) {
	result := executionSnapshot{}
	if err := decodeRuntimeJSON(value, &result, "执行快照"); err != nil {
		return executionSnapshot{}, err
	}
	if result.Version != runtimeSnapshotVersion || result.Agent.ID == 0 || result.Power.ID == 0 {
		return executionSnapshot{}, fmt.Errorf("执行快照版本或内容无效")
	}
	return result, nil
}

func decodeCheckpoint(value string) (runCheckpoint, error) {
	result := runCheckpoint{}
	if err := decodeRuntimeJSON(value, &result, "运行检查点"); err != nil {
		return runCheckpoint{}, err
	}
	if result.Version != runtimeSnapshotVersion {
		return runCheckpoint{}, fmt.Errorf("运行检查点版本无效")
	}
	return normalizeCheckpoint(result), nil
}

func normalizeCheckpoint(value runCheckpoint) runCheckpoint {
	if value.Phase == "" {
		value.Phase = runPhaseModel
	}
	if value.ModelStep < 1 {
		value.ModelStep = 1
	}
	if value.Seq < 1 {
		value.Seq = 1
	}
	if value.Input == nil {
		value.Input = map[string]any{}
	}
	if value.History == nil {
		value.History = []any{}
	}
	return value
}

func encodeRuntimeJSON(value any, label string) (string, error) {
	encoded, err := json.Marshal(value)
	if err != nil {
		return "", fmt.Errorf("序列化%s失败: %w", label, err)
	}
	return string(encoded), nil
}

func decodeRuntimeJSON(value string, target any, label string) error {
	value = strings.TrimSpace(value)
	if value == "" {
		return fmt.Errorf("%s为空", label)
	}
	if err := json.Unmarshal([]byte(value), target); err != nil {
		return fmt.Errorf("解析%s失败: %w", label, err)
	}
	return nil
}

func cloneMap(source map[string]any) map[string]any {
	if source == nil {
		return nil
	}
	target := make(map[string]any, len(source))
	for key, value := range source {
		target[key] = value
	}
	return target
}
