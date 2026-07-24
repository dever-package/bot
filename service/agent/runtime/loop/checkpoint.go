package loop

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	runtimeSnapshotVersion = 2
	runPhaseModel          = "model"
	runPhaseTool           = "tool"
	runPhaseFinal          = "final"
)

// executionSnapshot contains only durable business input. Process-local callbacks,
// server contexts and credentials deliberately stay outside the persisted payload.
type executionSnapshot struct {
	Version              int                              `json:"version"`
	RequestedAt          time.Time                        `json:"requested_at"`
	Agent                agentmodel.Agent                 `json:"agent"`
	Power                energonmodel.Power               `json:"power"`
	ModelLimits          energonservice.ModelLimits       `json:"model_limits"`
	WorkingContextTokens int                              `json:"working_context_tokens"`
	SessionID            uint64                           `json:"session_id,omitempty"`
	AssistantMessageID   uint64                           `json:"assistant_message_id,omitempty"`
	Prompt               string                           `json:"prompt"`
	Input                map[string]any                   `json:"input"`
	History              []any                            `json:"history"`
	Transport            persistedTransport               `json:"transport"`
	PersistChat          bool                             `json:"persist_chat"`
	MediaReferences      []runtimeprovider.MediaReference `json:"media_references,omitempty"`
	Scope                runtimescope.Scope               `json:"scope,omitempty"`
	Billing              botprotocol.BillingContext       `json:"billing,omitempty"`
	DocumentID           uint64                           `json:"document_id,omitempty"`
	DocumentWriter       bool                             `json:"document_writer,omitempty"`
}

type persistedTransport struct {
	Method string `json:"method,omitempty"`
	Host   string `json:"host,omitempty"`
	Path   string `json:"path,omitempty"`
}

type runCheckpoint struct {
	Version                 int                              `json:"version"`
	Phase                   string                           `json:"phase"`
	ModelStep               int                              `json:"model_step"`
	Seq                     int                              `json:"seq"`
	Input                   map[string]any                   `json:"input"`
	HistoryDelta            []any                            `json:"history_delta,omitempty"`
	LastText                string                           `json:"last_text,omitempty"`
	Artifacts               map[string]any                   `json:"artifacts,omitempty"`
	Activities              []map[string]any                 `json:"activities,omitempty"`
	LoadedSkills            []agentmodel.LoadedSkillRef      `json:"loaded_skills,omitempty"`
	ToolReceipts            []toolReceipt                    `json:"tool_receipts,omitempty"`
	ActiveToolExecution     *toolExecutionMarker             `json:"active_tool_execution,omitempty"`
	MediaDelta              []runtimeprovider.MediaReference `json:"media_delta,omitempty"`
	PendingTools            []botprotocol.ToolCall           `json:"pending_tools,omitempty"`
	PendingIndex            int                              `json:"pending_index,omitempty"`
	PendingModelText        string                           `json:"pending_model_text,omitempty"`
	AwaitingDelivery        bool                             `json:"awaiting_delivery,omitempty"`
	DeliveryContinuations   int                              `json:"delivery_continuations,omitempty"`
	LengthContinuations     int                              `json:"length_continuations,omitempty"`
	CompletionReviewPending bool                             `json:"completion_review_pending,omitempty"`
	CompletionReviews       int                              `json:"completion_reviews,omitempty"`
	RequiredToolName        string                           `json:"required_tool_name,omitempty"`
	RequiredToolFailures    int                              `json:"required_tool_failures,omitempty"`
	DocumentID              uint64                           `json:"document_id,omitempty"`
	DocumentDeliveryReady   bool                             `json:"document_delivery_ready,omitempty"`
	DocumentTextSourceKey   string                           `json:"document_text_source_key,omitempty"`
	KnowledgeUsed           bool                             `json:"knowledge_used,omitempty"`
	KnowledgeNodeIDs        []uint64                         `json:"knowledge_node_ids,omitempty"`
	FinalStatus             string                           `json:"final_status,omitempty"`
	FinalText               string                           `json:"final_text,omitempty"`
	FinalMessage            string                           `json:"final_message,omitempty"`
	FinalOutput             map[string]any                   `json:"final_output,omitempty"`
	FinalCommitted          bool                             `json:"final_committed,omitempty"`
}

func snapshotFromExecution(execution execution) executionSnapshot {
	return executionSnapshot{
		Version:              runtimeSnapshotVersion,
		RequestedAt:          execution.requestedAt,
		Agent:                execution.agent,
		Power:                execution.power,
		ModelLimits:          execution.modelLimits,
		WorkingContextTokens: execution.workingContextTokens,
		SessionID:            execution.sessionID,
		AssistantMessageID:   execution.assistantMessageID,
		Prompt:               execution.prompt,
		Input:                cloneMap(execution.input),
		History:              append([]any(nil), execution.history...),
		Transport: persistedTransport{
			Method: execution.transport.Method,
			Host:   execution.transport.Host,
			Path:   execution.transport.Path,
		},
		PersistChat:     execution.persistChat,
		MediaReferences: append([]runtimeprovider.MediaReference(nil), execution.mediaReferences...),
		Scope:           execution.scope,
		Billing:         execution.billing,
		DocumentID:      execution.documentID,
		DocumentWriter:  execution.documentWriter,
	}
}

func initialCheckpoint(execution execution) runCheckpoint {
	eventType := runtimeEventType(execution.input)
	interactionResumed := eventType == "interaction_resumed"
	opening := eventType == runtimeEventSessionStarted
	checkpoint := runCheckpoint{
		Version:                 runtimeSnapshotVersion,
		Phase:                   runPhaseModel,
		ModelStep:               1,
		Seq:                     1,
		Input:                   gatewayInput(execution.input),
		AwaitingDelivery:        interactionResumed,
		CompletionReviewPending: !opening,
		DocumentID:              execution.documentID,
	}
	checkpoint.KnowledgeUsed = execution.priorKnowledgeUsed
	return checkpoint
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
	if value.HistoryDelta == nil {
		value.HistoryDelta = []any{}
	}
	if value.DeliveryContinuations < 0 {
		value.DeliveryContinuations = 0
	}
	if value.LengthContinuations < 0 {
		value.LengthContinuations = 0
	}
	if value.CompletionReviews < 0 {
		value.CompletionReviews = 0
	}
	if value.RequiredToolFailures < 0 {
		value.RequiredToolFailures = 0
	}
	value.RequiredToolName = strings.TrimSpace(value.RequiredToolName)
	if value.RequiredToolName == "" {
		value.RequiredToolFailures = 0
	}
	value.DocumentTextSourceKey = strings.TrimSpace(value.DocumentTextSourceKey)
	if value.DocumentID == 0 {
		value.DocumentDeliveryReady = false
		value.DocumentTextSourceKey = ""
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
