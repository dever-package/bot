package loop

import (
	"context"
	"strings"
	"time"

	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type runState struct {
	execution  execution
	repository repository
	seq        int
	lastText   string
	artifacts  map[string]any
	activities []map[string]any
	loaded     []string
	completed  bool
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
	_ = state.repository.UpdateRunSkills(context.Background(), state.execution.runID, state.loaded)
}

func (state *runState) Step(stepType string, title string, content string, payload any, status string) error {
	next := state.seq + 1
	err := state.repository.CreateStep(context.Background(), stepRecord{
		RunID:     state.execution.runID,
		RequestID: state.execution.requestID,
		Seq:       next,
		Type:      stepType,
		Title:     title,
		Content:   content,
		Payload:   encodeJSON(payload, "{}"),
		Status:    status,
	})
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
	state.completed = true
	if outcome.stepType != "" {
		stepType := outcome.stepType
		if stepType == "" {
			stepType = "final"
		}
		stepTitle := outcome.stepTitle
		if stepTitle == "" {
			stepTitle = "最终输出"
		}
		stepStatus := outcome.stepStatus
		if stepStatus == "" {
			stepStatus = stepStatusSuccess
		}
		content := strings.TrimSpace(outcome.text)
		if outcome.status != runStatusSuccess && strings.TrimSpace(outcome.message) != "" {
			content = strings.TrimSpace(outcome.message)
		}
		_ = state.Step(stepType, stepTitle, content, map[string]any{
			"output":         outcome.output,
			"error":          strings.TrimSpace(outcome.message),
			"partial_output": strings.TrimSpace(outcome.text),
		}, stepStatus)
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
	defer state.complete(runCompletion{
		Status:  outcome.status,
		Text:    strings.TrimSpace(outcome.text),
		Message: message,
		Output:  output,
	})

	finishedAt := time.Now()
	_ = s.repository.FinishRun(context.Background(), state.execution.runID, runResult{
		Status:     outcome.status,
		Output:     encodeJSON(output, "{}"),
		Error:      message,
		StepCount:  state.seq,
		Latency:    finishedAt.Sub(state.execution.startedAt).Milliseconds(),
		FinishedAt: finishedAt,
	})
	if state.execution.persistChat {
		s.completeRunTurn(state.execution.requestID, outcome.status, outcome.text, output, message)
	}

	responseStatus := botprotocol.ResponseStatusSuccess
	if outcome.status == runStatusFail {
		responseStatus = botprotocol.ResponseStatusFail
	}
	_ = s.writeExecutionResult(context.Background(), state.execution, output, message, responseStatus)
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
