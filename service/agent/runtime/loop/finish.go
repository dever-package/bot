package loop

import (
	"context"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type runState struct {
	execution               execution
	repository              repository
	seq                     int
	phase                   string
	modelStep               int
	input                   map[string]any
	history                 []any
	lastText                string
	artifacts               map[string]any
	activities              []map[string]any
	loaded                  []agentmodel.LoadedSkillRef
	toolReceipts            []toolReceipt
	activeToolExecution     *toolExecutionMarker
	pendingTools            []botprotocol.ToolCall
	pendingIndex            int
	pendingModelText        string
	awaitingDelivery        bool
	deliveryContinuations   int
	lengthContinuations     int
	completionReviewPending bool
	completionReviews       int
	requiredToolName        string
	requiredToolFailures    int
	documentID              uint64
	documentDeliveryReady   bool
	documentTextSourceKey   string
	knowledgeUsed           bool
	knowledgeNodeIDs        map[uint64]struct{}
	finalStatus             string
	finalText               string
	finalMessage            string
	finalOutput             map[string]any
	finalCommitted          bool
	completed               bool
}

func newRunState(execution execution) runState {
	checkpoint := normalizeCheckpoint(execution.checkpoint)
	return runState{
		execution:               execution,
		repository:              newRepository(),
		seq:                     checkpoint.Seq,
		phase:                   checkpoint.Phase,
		modelStep:               checkpoint.ModelStep,
		input:                   cloneMap(checkpoint.Input),
		history:                 append([]any(nil), execution.history...),
		lastText:                checkpoint.LastText,
		artifacts:               cloneMap(checkpoint.Artifacts),
		activities:              append([]map[string]any(nil), checkpoint.Activities...),
		loaded:                  agentmodel.NormalizeLoadedSkillRefs(checkpoint.LoadedSkills),
		toolReceipts:            append([]toolReceipt(nil), checkpoint.ToolReceipts...),
		activeToolExecution:     cloneToolExecutionMarker(checkpoint.ActiveToolExecution),
		pendingTools:            append([]botprotocol.ToolCall(nil), checkpoint.PendingTools...),
		pendingIndex:            checkpoint.PendingIndex,
		pendingModelText:        checkpoint.PendingModelText,
		awaitingDelivery:        checkpoint.AwaitingDelivery,
		deliveryContinuations:   checkpoint.DeliveryContinuations,
		lengthContinuations:     checkpoint.LengthContinuations,
		completionReviewPending: checkpoint.CompletionReviewPending,
		completionReviews:       checkpoint.CompletionReviews,
		requiredToolName:        checkpoint.RequiredToolName,
		requiredToolFailures:    checkpoint.RequiredToolFailures,
		documentID:              checkpoint.DocumentID,
		documentDeliveryReady:   checkpoint.DocumentDeliveryReady,
		documentTextSourceKey:   checkpoint.DocumentTextSourceKey,
		knowledgeUsed:           checkpoint.KnowledgeUsed,
		knowledgeNodeIDs:        knowledgeNodeIDSet(checkpoint.KnowledgeNodeIDs),
		finalStatus:             checkpoint.FinalStatus,
		finalText:               checkpoint.FinalText,
		finalMessage:            checkpoint.FinalMessage,
		finalOutput:             cloneMap(checkpoint.FinalOutput),
		finalCommitted:          checkpoint.FinalCommitted,
	}
}

func (state *runState) Checkpoint(seq int) runCheckpoint {
	return runCheckpoint{
		Version:                 runtimeSnapshotVersion,
		Phase:                   state.phase,
		ModelStep:               state.modelStep,
		Seq:                     seq,
		Input:                   cloneMap(state.input),
		HistoryDelta:            historyCheckpointDelta(state),
		LastText:                state.lastText,
		Artifacts:               cloneMap(state.artifacts),
		Activities:              append([]map[string]any(nil), state.activities...),
		LoadedSkills:            agentmodel.NormalizeLoadedSkillRefs(state.loaded),
		ToolReceipts:            append([]toolReceipt(nil), state.toolReceipts...),
		ActiveToolExecution:     cloneToolExecutionMarker(state.activeToolExecution),
		MediaDelta:              mediaCheckpointDelta(state),
		PendingTools:            append([]botprotocol.ToolCall(nil), state.pendingTools...),
		PendingIndex:            state.pendingIndex,
		PendingModelText:        state.pendingModelText,
		AwaitingDelivery:        state.awaitingDelivery,
		DeliveryContinuations:   state.deliveryContinuations,
		LengthContinuations:     state.lengthContinuations,
		CompletionReviewPending: state.completionReviewPending,
		CompletionReviews:       state.completionReviews,
		RequiredToolName:        state.requiredToolName,
		RequiredToolFailures:    state.requiredToolFailures,
		DocumentID:              state.documentID,
		DocumentDeliveryReady:   state.documentDeliveryReady,
		DocumentTextSourceKey:   state.documentTextSourceKey,
		KnowledgeUsed:           state.knowledgeUsed,
		KnowledgeNodeIDs:        sortedKnowledgeNodeIDs(state.knowledgeNodeIDs),
		FinalStatus:             state.finalStatus,
		FinalText:               state.finalText,
		FinalMessage:            state.finalMessage,
		FinalOutput:             cloneMap(state.finalOutput),
		FinalCommitted:          state.finalCommitted,
	}
}

func (state *runState) requireTool(name string) {
	if state == nil {
		return
	}
	name = strings.TrimSpace(name)
	if !strings.EqualFold(state.requiredToolName, name) {
		state.requiredToolFailures = 0
	}
	state.requiredToolName = name
	if name == "" {
		state.requiredToolFailures = 0
	}
}

func (state *runState) isRequiredToolCall(call botprotocol.ToolCall) bool {
	return state != nil && state.requiredToolName != "" &&
		strings.EqualFold(strings.TrimSpace(call.Name), state.requiredToolName)
}

func historyCheckpointDelta(state *runState) []any {
	if state == nil {
		return nil
	}
	start := state.execution.snapshotHistoryLen
	if start < 0 || start > len(state.history) {
		start = 0
	}
	return append([]any(nil), state.history[start:]...)
}

func mediaCheckpointDelta(state *runState) []runtimeprovider.MediaReference {
	if state == nil {
		return nil
	}
	start := state.execution.snapshotMediaLen
	if start < 0 || start > len(state.execution.mediaReferences) {
		start = 0
	}
	return append([]runtimeprovider.MediaReference(nil), state.execution.mediaReferences[start:]...)
}

func (state *runState) MarkFinal(status string, text string, output map[string]any, message string) {
	state.phase = runPhaseFinal
	state.finalStatus = status
	state.finalText = strings.TrimSpace(text)
	state.finalMessage = strings.TrimSpace(message)
	state.finalOutput = state.ApplyArtifacts(output)
}

func (state *runState) AppendVisibleText(value string) {
	value = strings.TrimSpace(value)
	if value == "" {
		return
	}
	if state.lastText == "" {
		state.lastText = value
		return
	}
	state.lastText += "\n\n" + value
}

func (state *runState) continueAfterTools() bool {
	hadVisibleText := strings.TrimSpace(state.pendingModelText) != ""
	state.phase = runPhaseModel
	state.modelStep++
	state.input = state.continuationInput(nextModelInput())
	state.pendingTools = nil
	state.pendingIndex = 0
	state.pendingModelText = ""
	state.awaitingDelivery = true
	state.completionReviewPending = true
	if state.isDocumentWriter() {
		state.documentDeliveryReady = false
	}
	return hadVisibleText
}

func (state *runState) AddLoadedSkill(reference agentmodel.LoadedSkillRef) {
	reference.Key = strings.TrimSpace(reference.Key)
	reference.ContentHash = strings.TrimSpace(reference.ContentHash)
	if reference.Key == "" {
		return
	}
	for index, current := range state.loaded {
		if strings.EqualFold(current.Key, reference.Key) {
			state.loaded[index] = reference
			return
		}
	}
	state.loaded = append(state.loaded, reference)
}

func (state *runState) Step(stepType string, title string, content string, payload any, status string) error {
	next := state.seq + 1
	checkpoint, err := encodeCheckpoint(state.Checkpoint(next))
	if err != nil {
		return err
	}
	ctx, cancel := maintenanceContext()
	defer cancel()
	err = state.repository.CommitStep(ctx, stepRecord{
		RunID:     state.execution.runID,
		RequestID: state.execution.requestID,
		Seq:       next,
		Type:      stepType,
		Title:     title,
		Content:   content,
		Payload:   encodeJSON(payload, "{}"),
		Status:    status,
	}, checkpoint, state.loaded, state.execution.workerID, time.Now().Add(runtimeLeaseDuration))
	if err == nil {
		state.seq = next
	}
	return err
}

func (state *runState) AbsorbToolOutput(content any, definition runtimeprovider.Definition) {
	switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
	case "knowledge", "skill", "control", "interaction", "presentation", "document":
		return
	}
	source, ok := content.(map[string]any)
	if !ok {
		return
	}
	if state.artifacts == nil {
		state.artifacts = map[string]any{}
	}
	if artifacts := appendArtifactValues(artifactValues(state.artifacts["artifacts"]), source["artifacts"]); len(artifacts) > 0 {
		state.artifacts["artifacts"] = artifacts
		return
	}
	for _, key := range []string{"images", "videos", "audios", "files"} {
		values := appendStringValues(stringValues(state.artifacts[key]), source[key])
		if len(values) > 0 {
			state.artifacts[key] = values
		}
	}
	for _, key := range []string{"title", "rich", "content", "json", "result_mode", "display_mode"} {
		if _, exists := state.artifacts[key]; exists || source[key] == nil {
			continue
		}
		state.artifacts[key] = source[key]
	}
}

func appendArtifactValues(current []map[string]any, value any) []map[string]any {
	seen := make(map[string]struct{}, len(current))
	for _, item := range current {
		seen[artifactIdentity(item)] = struct{}{}
	}
	for _, item := range artifactValues(value) {
		key := artifactIdentity(item)
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			for index := range current {
				if artifactIdentity(current[index]) == key {
					current[index] = item
					break
				}
			}
			continue
		}
		seen[key] = struct{}{}
		current = append(current, item)
	}
	return current
}

func artifactValues(value any) []map[string]any {
	switch current := value.(type) {
	case []map[string]any:
		return append([]map[string]any(nil), current...)
	case []any:
		result := make([]map[string]any, 0, len(current))
		for _, item := range current {
			if mapped, ok := item.(map[string]any); ok {
				result = append(result, mapped)
			}
		}
		return result
	}
	return nil
}

func artifactIdentity(value map[string]any) string {
	return strings.TrimSpace(botprotocol.AsText(value["artifact_id"]))
}

func (state *runState) ApplyArtifacts(output map[string]any) map[string]any {
	if output == nil {
		output = map[string]any{}
	}
	for key, value := range state.artifacts {
		if _, exists := output[key]; !exists {
			output[key] = value
		}
	}
	if len(state.activities) > 0 {
		if _, exists := output["activities"]; !exists {
			output["activities"] = state.activities
		}
	}
	return output
}

func appendStringValues(current []string, value any) []string {
	seen := make(map[string]struct{}, len(current))
	for _, item := range current {
		seen[item] = struct{}{}
	}
	for _, item := range stringValues(value) {
		if _, exists := seen[item]; exists {
			continue
		}
		seen[item] = struct{}{}
		current = append(current, item)
	}
	return current
}

func stringValues(value any) []string {
	switch current := value.(type) {
	case string:
		if text := strings.TrimSpace(current); text != "" {
			return []string{text}
		}
	case []string:
		result := make([]string, 0, len(current))
		for _, item := range current {
			if text := strings.TrimSpace(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	case []any:
		result := make([]string, 0, len(current))
		for _, item := range current {
			if text, ok := item.(string); ok && strings.TrimSpace(text) != "" {
				result = append(result, strings.TrimSpace(text))
			}
		}
		return result
	}
	return nil
}

type finishOutcome struct {
	status     string
	text       string
	message    string
	output     map[string]any
	stepType   string
	stepTitle  string
	stepStatus string
}

type runCompletion struct {
	Status  string
	Text    string
	Message string
	Output  map[string]any
}

func (s Service) finish(state *runState, outcome finishOutcome) {
	if state == nil || state.completed {
		return
	}
	if state.documentID > 0 {
		if state.finalText == "" {
			state.finalText = strings.TrimSpace(outcome.text)
		}
		if state.finalOutput == nil {
			state.finalOutput = cloneMap(outcome.output)
		}
		if err := s.prepareDocumentResult(state, outcome.status, outcome.message); err != nil {
			logFinishRecovery(state, "document_finalize", err)
			return
		}
		outcome.text = state.finalText
		outcome.output = state.finalOutput
	}
	output := state.ApplyArtifacts(outcome.output)
	if _, exists := output["text"]; !exists {
		output["text"] = strings.TrimSpace(outcome.text)
	}
	message := strings.TrimSpace(outcome.message)
	switch outcome.status {
	case runStatusSuccess:
		if _, exists := output["event"]; !exists {
			output["event"] = "final"
		}
	case runStatusCanceled:
		output["event"] = "cancel"
		if strings.TrimSpace(botprotocol.AsText(output["text"])) == "" {
			output["text"] = "已停止生成"
		}
	default:
		output["event"] = "error"
		output["error"] = message
	}
	state.MarkFinal(outcome.status, outcome.text, output, message)
	if !state.finalCommitted {
		state.finalCommitted = true
		stepType := outcome.stepType
		stepTitle := outcome.stepTitle
		stepStatus := outcome.stepStatus
		if stepType == "" {
			stepType = "final"
		}
		if stepTitle == "" {
			stepTitle = "最终输出"
		}
		if stepStatus == "" {
			stepStatus = stepStatusSuccess
		}
		content := strings.TrimSpace(outcome.text)
		if outcome.status != runStatusSuccess && message != "" {
			content = message
		}
		if err := state.Step(stepType, stepTitle, content, map[string]any{
			"output":         output,
			"error":          message,
			"partial_output": strings.TrimSpace(outcome.text),
		}, stepStatus); err != nil {
			state.finalCommitted = false
			logFinishRecovery(state, "checkpoint_commit", err)
			return
		}
	}
	responseStatus := botprotocol.ResponseStatusSuccess
	if outcome.status == runStatusFail {
		responseStatus = botprotocol.ResponseStatusFail
	}
	resultCtx, resultCancel := maintenanceContext()
	resultErr := s.writeExecutionResult(resultCtx, state.execution, output, message, responseStatus)
	resultCancel()
	if resultErr != nil {
		logFinishRecovery(state, "result_publish", resultErr)
		return
	}

	finishedAt := time.Now()
	finishCtx, finishCancel := maintenanceContext()
	finished, err := s.finishRunAndChat(finishCtx, state.execution.runID, state.execution.workerID, state.execution.persistChat, runResult{
		Status:     outcome.status,
		Output:     encodeJSON(output, "{}"),
		Error:      message,
		StepCount:  state.seq,
		Latency:    finishedAt.Sub(state.execution.startedAt).Milliseconds(),
		FinishedAt: finishedAt,
	}, runtimechat.RunTurnCompletion{
		RequestID: state.execution.requestID,
		Status:    outcome.status,
		Text:      outcome.text,
		Output:    output,
		Error:     message,
	})
	finishCancel()
	if err != nil {
		logFinishRecovery(state, "terminal_commit", err)
		return
	}
	if !finished {
		logFinishRecovery(state, "terminal_commit", errRunLeaseLost)
		return
	}
	state.completed = true
	completion := runCompletion{
		Status:  outcome.status,
		Text:    strings.TrimSpace(outcome.text),
		Message: message,
		Output:  output,
	}
	state.complete(completion)
}

func logFinishRecovery(state *runState, stage string, err error) {
	if state == nil || err == nil {
		return
	}
	dlog.ErrorFields("agent_run_finish_recovery", "智能体运行收口失败，等待租约恢复", dlog.Fields{
		"run_id":     state.execution.runID,
		"request_id": state.execution.requestID,
		"stage":      stage,
		"error":      err.Error(),
	})
}

func (s Service) finishRunAndChat(
	ctx context.Context,
	runID uint64,
	workerID string,
	persistChat bool,
	result runResult,
	completion runtimechat.RunTurnCompletion,
) (bool, error) {
	return s.commitRunTerminal(ctx, completion, func(tx context.Context) (bool, bool, error) {
		finished, err := s.repository.FinishRun(tx, runID, workerID, result)
		return finished, persistChat, err
	})
}

type runTerminalMutation func(context.Context) (committed bool, persistChat bool, err error)

func (s Service) commitRunTerminal(
	ctx context.Context,
	completion runtimechat.RunTurnCompletion,
	mutation runTerminalMutation,
) (bool, error) {
	transactionCommitted := false
	sessionID := uint64(0)
	messageID := uint64(0)
	err := func() (transactionErr error) {
		defer repositoryError(&transactionErr)
		return orm.Transaction(ctx, func(tx context.Context) error {
			var persistChat bool
			var err error
			transactionCommitted, persistChat, err = mutation(tx)
			if err != nil || !transactionCommitted || !persistChat {
				return err
			}
			sessionID, messageID, err = s.chat.SaveRunTurnCompletion(tx, completion)
			if err != nil {
				return err
			}
			return nil
		})
	}()
	if err != nil {
		return false, err
	}
	if transactionCommitted && sessionID > 0 {
		s.chat.AfterRunTurnCompletion(sessionID, messageID, completion.Status)
	}
	return transactionCommitted, nil
}

func (s Service) finishCheckpoint(state *runState) {
	status := strings.TrimSpace(state.finalStatus)
	if status == "" {
		status = runStatusFail
		state.finalMessage = "智能体最终检查点无效"
	}
	stepType := "final"
	stepTitle := "最终输出"
	stepStatus := stepStatusSuccess
	if status != runStatusSuccess {
		stepType = "error"
		stepTitle = "运行失败"
		stepStatus = stepStatusFail
	}
	if status == runStatusCanceled {
		stepTitle = "运行已取消"
		stepStatus = stepStatusWarning
	}
	s.finish(state, finishOutcome{
		status: status, text: state.finalText, message: state.finalMessage,
		output: state.finalOutput, stepType: stepType, stepTitle: stepTitle, stepStatus: stepStatus,
	})
}

func (state *runState) complete(completion runCompletion) {
	if state.execution.completion == nil {
		return
	}
	select {
	case state.execution.completion <- completion:
	default:
	}
}

func (s Service) completeRunTurn(requestID string, status string, text string, output map[string]any, message string) {
	ctx, cancel := maintenanceContext()
	defer cancel()
	_ = s.chat.CompleteRunTurn(ctx, runtimechat.RunTurnCompletion{
		RequestID: requestID,
		Status:    status,
		Text:      text,
		Output:    output,
		Error:     message,
	})
}
