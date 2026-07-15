package loop

import (
	"context"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type runState struct {
	execution        execution
	repository       repository
	seq              int
	phase            string
	modelStep        int
	input            map[string]any
	history          []any
	lastText         string
	artifacts        map[string]any
	activities       []map[string]any
	loaded           []string
	pendingTools     []botprotocol.ToolCall
	pendingIndex     int
	pendingVisible   bool
	documentID       uint64
	documentTextStep int
	finalStatus      string
	finalText        string
	finalMessage     string
	finalOutput      map[string]any
	finalCommitted   bool
	completed        bool
}

func newRunState(execution execution) runState {
	checkpoint := normalizeCheckpoint(execution.checkpoint)
	return runState{
		execution:        execution,
		repository:       newRepository(),
		seq:              checkpoint.Seq,
		phase:            checkpoint.Phase,
		modelStep:        checkpoint.ModelStep,
		input:            cloneMap(checkpoint.Input),
		history:          append([]any(nil), checkpoint.History...),
		lastText:         checkpoint.LastText,
		artifacts:        cloneMap(checkpoint.Artifacts),
		activities:       append([]map[string]any(nil), checkpoint.Activities...),
		loaded:           append([]string(nil), checkpoint.LoadedSkills...),
		pendingTools:     append([]botprotocol.ToolCall(nil), checkpoint.PendingTools...),
		pendingIndex:     checkpoint.PendingIndex,
		pendingVisible:   checkpoint.PendingVisible,
		documentID:       checkpoint.DocumentID,
		documentTextStep: checkpoint.DocumentTextStep,
		finalStatus:      checkpoint.FinalStatus,
		finalText:        checkpoint.FinalText,
		finalMessage:     checkpoint.FinalMessage,
		finalOutput:      cloneMap(checkpoint.FinalOutput),
		finalCommitted:   checkpoint.FinalCommitted,
	}
}

func (state *runState) Checkpoint(seq int) runCheckpoint {
	return runCheckpoint{
		Version:          runtimeSnapshotVersion,
		Phase:            state.phase,
		ModelStep:        state.modelStep,
		Seq:              seq,
		Input:            cloneMap(state.input),
		History:          append([]any(nil), state.history...),
		LastText:         state.lastText,
		Artifacts:        cloneMap(state.artifacts),
		Activities:       append([]map[string]any(nil), state.activities...),
		LoadedSkills:     append([]string(nil), state.loaded...),
		MediaReferences:  append([]runtimeprovider.MediaReference(nil), state.execution.mediaReferences...),
		PendingTools:     append([]botprotocol.ToolCall(nil), state.pendingTools...),
		PendingIndex:     state.pendingIndex,
		PendingVisible:   state.pendingVisible,
		DocumentID:       state.documentID,
		DocumentTextStep: state.documentTextStep,
		FinalStatus:      state.finalStatus,
		FinalText:        state.finalText,
		FinalMessage:     state.finalMessage,
		FinalOutput:      cloneMap(state.finalOutput),
		FinalCommitted:   state.finalCommitted,
	}
}

func (state *runState) MarkFinal(status string, text string, output map[string]any, message string) {
	state.phase = runPhaseFinal
	state.finalStatus = status
	state.finalText = strings.TrimSpace(text)
	state.finalMessage = strings.TrimSpace(message)
	state.finalOutput = state.ApplyArtifacts(output)
}

func (state *runState) AppendVisibleText(value string) bool {
	value = strings.TrimSpace(value)
	if value == "" {
		return false
	}
	if state.lastText == "" {
		state.lastText = value
		return true
	}
	state.lastText += "\n\n" + value
	return true
}

func (state *runState) AddLoadedSkill(key string) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}
	for _, current := range state.loaded {
		if current == key {
			return
		}
	}
	state.loaded = append(state.loaded, key)
}

func (state *runState) Step(stepType string, title string, content string, payload any, status string) error {
	next := state.seq + 1
	checkpoint, err := encodeCheckpoint(state.Checkpoint(next))
	if err != nil {
		return err
	}
	err = state.repository.CommitStep(context.Background(), stepRecord{
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

func (state *runState) AbsorbToolOutput(content any) {
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
		s.finalizeDocument(state)
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
			return
		}
	}

	finishedAt := time.Now()
	finished, err := s.finishRunAndChat(context.Background(), state.execution.runID, state.execution.workerID, state.execution.persistChat, runResult{
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
	if err != nil || !finished {
		return
	}
	state.completed = true
	defer state.complete(runCompletion{
		Status:  outcome.status,
		Text:    strings.TrimSpace(outcome.text),
		Message: message,
		Output:  output,
	})

	responseStatus := botprotocol.ResponseStatusSuccess
	if outcome.status == runStatusFail {
		responseStatus = botprotocol.ResponseStatusFail
	}
	_ = s.writeExecutionResult(context.Background(), state.execution, output, message, responseStatus)
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
	err := func() (transactionErr error) {
		defer repositoryError(&transactionErr)
		return orm.Transaction(ctx, func(tx context.Context) error {
			var persistChat bool
			var err error
			transactionCommitted, persistChat, err = mutation(tx)
			if err != nil || !transactionCommitted || !persistChat {
				return err
			}
			sessionID, err = s.chat.SaveRunTurnCompletion(tx, completion)
			return err
		})
	}()
	if err != nil {
		return false, err
	}
	if transactionCommitted && sessionID > 0 {
		s.chat.AfterRunTurnCompletion(sessionID)
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
	_ = s.chat.CompleteRunTurn(context.Background(), runtimechat.RunTurnCompletion{
		RequestID: requestID,
		Status:    status,
		Text:      text,
		Output:    output,
		Error:     message,
	})
}
