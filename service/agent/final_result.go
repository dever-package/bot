package agent

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	agentaction "github.com/dever-package/bot/service/agent/action"
	agentcontext "github.com/dever-package/bot/service/agent/context"
	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agenttool "github.com/dever-package/bot/service/agent/tool"
	"github.com/dever-package/bot/service/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	finalResultEventDetail   = "result_detail"
	finalResultEventTask     = "result_task"
	finalResultEventProgress = "result_progress"
	finalResultEventCard     = "result_card"

	finalResultModeInline   = "inline"
	finalResultModeArtifact = "artifact"

	finalTaskStatusPending   = "pending"
	finalTaskStatusRunning   = "running"
	finalTaskStatusSucceeded = "succeeded"
	finalTaskStatusFailed    = "failed"
)

var finalResultSnapshotMu sync.Mutex

type finalTaskState struct {
	ID            string
	PlaceholderID string
	Title         string
	Kind          string
	Power         string
	Execution     string
	Status        string
	Text          string
	Error         string
	Progress      int
	Output        map[string]any
	Sort          int
}

type finalTaskRunResult struct {
	State  finalTaskState
	Result agentaction.Result
}

func (s Service) handleFinalResult(
	ctx context.Context,
	exec runExecution,
	tracker *runTracker,
	output map[string]any,
	history []any,
	options runtimeOptions,
) agentLoopResult {
	streamCtx := context.Background()
	resultID := finalResultID(exec)
	output = mergePartialResultWithBaseline(output, exec.Baseline, exec.ContextPlan)
	var validation agentaction.ResultValidation
	output, validation = agentaction.RepairAgentResultOutput(output)
	if len(validation.Warnings) > 0 {
		tracker.Step(ctx, "result_validate", "结果协议修复", strings.Join(validation.Warnings, "\n"), map[string]any{
			"repaired": validation.Repaired,
			"warnings": validation.Warnings,
			"plan":     exec.ContextPlan,
		}, stepStatusWarning)
	}
	tasks := agentaction.ExtractAbilityTasks(output)
	sort.SliceStable(tasks, func(i, j int) bool {
		return tasks[i].Sort < tasks[j].Sort
	})

	states := initialFinalTaskStates(tasks)
	resultMode := resolveFinalResultMode(output, states)
	detailOutput := agentaction.EnsureAgentRichOutput(output)
	attachFinalResultMode(detailOutput, resultMode)
	if resultMode == finalResultModeArtifact {
		_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, detailOutput, states)
	}

	if len(tasks) > 0 {
		tracker.Step(ctx, "final_tasks", "最终结果素材任务", fmt.Sprintf("共 %d 个任务", len(tasks)), map[string]any{
			"result_id": resultID,
			"tasks":     finalTaskStateMaps(states),
		}, stepStatusSuccess)
		taskCtx, cancelTasks := context.WithTimeout(context.Background(), finalTaskTimeout(exec, len(tasks)))
		unregisterTaskCancel := registerFinalTaskCancel(exec.RequestID, cancelTasks)
		runs := s.executeFinalTasks(taskCtx, exec, resultID, resultMode, tasks, states, history, options)
		unregisterTaskCancel()
		cancelTasks()
		states = mergeFinalTaskRunStates(states, runs)
		if finalTaskRunsCanceled(runs) {
			attachFinalTaskStates(detailOutput, states)
			attachFinalResultMode(detailOutput, resultMode)
			_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, detailOutput, states)
			_ = s.writeCancelResult(streamCtx, exec.RequestID)
			return newAgentLoopResult(detailOutput, runStatusCanceled, "任务已取消")
		}
		detailOutput = mergeFinalTaskOutputs(agentaction.EnsureAgentRichOutput(output), states)
		attachFinalTaskStates(detailOutput, states)
		attachFinalResultMode(detailOutput, resultMode)
	} else {
		attachFinalTaskStates(detailOutput, states)
		attachFinalResultMode(detailOutput, resultMode)
	}

	attachFinalResultTiming(detailOutput, exec.StartedAt, time.Now())
	if resultMode == finalResultModeArtifact {
		_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, detailOutput, states)
	}
	s.triggerRefluxIfNeeded(context.Background(), exec, history, detailOutput)

	if resultMode == finalResultModeInline {
		_ = s.writeSuccessResult(streamCtx, exec.RequestID, detailOutput)
		return newAgentLoopResult(detailOutput, runStatusSuccess, "")
	}

	card := finalResultCard(resultID, resultMode, detailOutput, states)
	_ = s.writeSuccessResult(streamCtx, exec.RequestID, card)
	return newAgentLoopResult(detailOutput, runStatusSuccess, "")
}

func (s Service) executeFinalTasks(
	ctx context.Context,
	exec runExecution,
	resultID string,
	resultMode string,
	tasks []agentaction.AbilityTask,
	states []finalTaskState,
	history []any,
	options runtimeOptions,
) []finalTaskRunResult {
	if len(tasks) == 0 {
		return nil
	}
	taskPlan := dedupeFinalTasks(tasks)
	if finalTaskExecutionMode(tasks) == agentaction.TaskExecutionSync {
		runs := s.executeFinalTasksSync(ctx, exec, resultID, resultMode, taskPlan.Tasks, states, history)
		return expandFinalTaskRuns(runs, taskPlan.Aliases)
	}
	runs := s.executeFinalTasksAsync(ctx, exec, resultID, resultMode, taskPlan.Tasks, states, history, options.AsyncMaxConcurrency)
	return expandFinalTaskRuns(runs, taskPlan.Aliases)
}

func (s Service) executeFinalTasksSync(
	ctx context.Context,
	exec runExecution,
	resultID string,
	resultMode string,
	tasks []agentaction.AbilityTask,
	states []finalTaskState,
	history []any,
) []finalTaskRunResult {
	streamCtx := context.Background()
	runs := make([]finalTaskRunResult, 0, len(tasks))
	for index, task := range tasks {
		progress := index * 100 / len(tasks)
		_ = s.writeFinalResultProgress(streamCtx, exec.RequestID, resultID, fmt.Sprintf("正在生成 %d/%d：%s", index+1, len(tasks), finalTaskTitle(task)), progress)
		run := s.executeFinalTask(ctx, exec, resultID, task, history)
		runs = append(runs, run)
		states = mergeFinalTaskRunStates(states, []finalTaskRunResult{run})
		_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, nil, states)
	}
	_ = s.writeFinalResultProgress(streamCtx, exec.RequestID, resultID, "素材生成完成", 100)
	return runs
}

func (s Service) executeFinalTasksAsync(
	ctx context.Context,
	exec runExecution,
	resultID string,
	resultMode string,
	tasks []agentaction.AbilityTask,
	states []finalTaskState,
	history []any,
	maxConcurrency int,
) []finalTaskRunResult {
	if maxConcurrency <= 0 {
		maxConcurrency = 10
	}
	if maxConcurrency > 10 {
		maxConcurrency = 10
	}

	runs := make([]finalTaskRunResult, len(tasks))
	streamCtx := context.Background()
	sem := make(chan struct{}, maxConcurrency)
	var wg sync.WaitGroup
	var mu sync.Mutex
	for index, task := range tasks {
		index, task := index, task
		wg.Add(1)
		go func() {
			defer wg.Done()
			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				run := finalTaskContextResult(task, ctx.Err())
				mu.Lock()
				runs[index] = run
				states = mergeFinalTaskRunStates(states, []finalTaskRunResult{run})
				currentStates := append([]finalTaskState{}, states...)
				mu.Unlock()
				_ = s.writeFinalResultTask(streamCtx, exec.RequestID, resultID, run.State, nil)
				_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, nil, currentStates)
				return
			}

			run := s.executeFinalTask(ctx, exec, resultID, task, history)
			mu.Lock()
			runs[index] = run
			states = mergeFinalTaskRunStates(states, []finalTaskRunResult{run})
			currentStates := append([]finalTaskState{}, states...)
			mu.Unlock()
			_ = s.writeFinalResultDetail(streamCtx, exec.RequestID, resultID, resultMode, nil, currentStates)
		}()
	}
	wg.Wait()
	return runs
}

func (s Service) executeFinalTask(
	ctx context.Context,
	exec runExecution,
	resultID string,
	task agentaction.AbilityTask,
	history []any,
) finalTaskRunResult {
	key := finalTaskInflightKey(exec, task)
	if key != "" {
		return s.executeFinalTaskInflight(ctx, exec, resultID, task, history, key)
	}
	return s.executeFinalTaskDirect(ctx, exec, resultID, task, history)
}

func (s Service) executeFinalTaskInflight(
	ctx context.Context,
	exec runExecution,
	resultID string,
	task agentaction.AbilityTask,
	history []any,
	key string,
) finalTaskRunResult {
	call := &finalTaskInflightCall{done: make(chan struct{})}
	actual, loaded := finalTaskInflightRegistry.LoadOrStore(key, call)
	if loaded {
		existing, _ := actual.(*finalTaskInflightCall)
		if existing == nil {
			return s.executeFinalTaskDirect(ctx, exec, resultID, task, history)
		}
		select {
		case <-existing.done:
			return aliasFinalTaskRun(existing.result, task)
		case <-ctx.Done():
			return finalTaskContextResult(task, ctx.Err())
		}
	}
	defer finalTaskInflightRegistry.Delete(key)
	defer close(call.done)
	result := s.executeFinalTaskDirect(ctx, exec, resultID, task, history)
	call.result = result
	return result
}

func (s Service) executeFinalTaskDirect(
	ctx context.Context,
	exec runExecution,
	resultID string,
	task agentaction.AbilityTask,
	history []any,
) finalTaskRunResult {
	if err := ctx.Err(); err != nil {
		return finalTaskContextResult(task, err)
	}

	childRequestID := finalTaskRequestID(exec.RequestID, task.ID)
	unregister := registerFinalTaskStream(exec.RequestID, childRequestID)
	defer unregister()
	if err := ctx.Err(); err != nil {
		return finalTaskContextResult(task, err)
	}

	streamCtx := context.Background()
	state := initialFinalTaskState(task)
	state.Status = finalTaskStatusRunning
	state.Text = "正在调用能力"
	_ = s.writeFinalResultTask(streamCtx, exec.RequestID, resultID, state, nil)

	assets := agentaction.CollectAssets(exec.Parsed.Input, history)
	result := agentaction.ExecutePower(ctx, agentaction.ExecuteRequest{
		RequestID:        exec.RequestID,
		GatewayRequestID: childRequestID,
		Method:           exec.Request.Method,
		Host:             exec.Request.Host,
		Path:             exec.Request.Path,
		Headers:          exec.Request.Headers,
		Input:            exec.Parsed.Input,
		History:          history,
		Assets:           assets,
		SourceTargetID:   exec.Parsed.SourceTargetID,
		Gateway:          s.gateway,
		ResolvePower: func(ctx context.Context, identity string) (string, error) {
			return s.repo.ResolveCallablePowerKey(ctx, identity, exec.Power.ID)
		},
		WriteStatus: func(ctx context.Context, text string, meta map[string]any) error {
			state.Text = text
			state.Progress = mergeFinalTaskProgress(state.Progress, finalTaskProgress(meta))
			return s.writeFinalResultTask(streamCtx, exec.RequestID, resultID, state, meta)
		},
		WriteOutput: func(ctx context.Context, output map[string]any) error {
			state.Text = firstText(output["text"], output["title"], state.Text)
			state.Progress = mergeFinalTaskProgress(
				state.Progress,
				int(frontstream.InputInt64(output["progress"], -1)),
			)
			return s.writeFinalResultTask(streamCtx, exec.RequestID, resultID, state, map[string]any{"output": output})
		},
		StreamBlock: time.Duration(defaultAgentStreamBlockMs) * time.Millisecond,
	}, task.Action, "", "")

	state = finalTaskStateFromResult(task, state, result)
	_ = s.writeFinalResultTask(streamCtx, exec.RequestID, resultID, state, nil)
	return finalTaskRunResult{State: state, Result: result}
}

func finalTaskContextResult(task agentaction.AbilityTask, err error) finalTaskRunResult {
	state := initialFinalTaskState(task)
	state.Status = finalTaskStatusFailed
	state.Error = "素材任务未启动"
	if err != nil {
		switch err {
		case context.Canceled:
			state.Error = "任务已取消"
		case context.DeadlineExceeded:
			state.Error = "素材任务超时"
		default:
			state.Error = err.Error()
		}
	}
	state.Text = state.Error
	kind := agentaction.ResultError
	if err == context.Canceled {
		kind = agentaction.ResultCanceled
	}
	return finalTaskRunResult{
		State: state,
		Result: agentaction.Result{
			Kind:    kind,
			Action:  task.Action,
			Message: state.Error,
		},
	}
}

func finalTaskExecutionMode(tasks []agentaction.AbilityTask) string {
	for _, task := range tasks {
		if task.Execution == agentaction.TaskExecutionAsync {
			return agentaction.TaskExecutionAsync
		}
	}
	return agentaction.TaskExecutionSync
}

type finalTaskDedupePlan struct {
	Tasks   []agentaction.AbilityTask
	Aliases map[string][]agentaction.AbilityTask
}

func dedupeFinalTasks(tasks []agentaction.AbilityTask) finalTaskDedupePlan {
	plan := finalTaskDedupePlan{
		Tasks:   make([]agentaction.AbilityTask, 0, len(tasks)),
		Aliases: map[string][]agentaction.AbilityTask{},
	}
	primaryByKey := map[string]string{}
	for _, task := range tasks {
		key := finalTaskDedupeKey(task)
		if key == "" {
			plan.Tasks = append(plan.Tasks, task)
			continue
		}
		if primaryID := primaryByKey[key]; primaryID != "" {
			plan.Aliases[primaryID] = append(plan.Aliases[primaryID], task)
			continue
		}
		primaryByKey[key] = task.ID
		plan.Tasks = append(plan.Tasks, task)
	}
	return plan
}

func finalTaskDedupeKey(task agentaction.AbilityTask) string {
	placeholderID := strings.TrimSpace(task.PlaceholderID)
	if placeholderID == "" {
		return ""
	}
	payload := map[string]any{
		"placeholder_id":   placeholderID,
		"kind":             strings.TrimSpace(task.Kind),
		"execution":        strings.TrimSpace(task.Execution),
		"power":            strings.TrimSpace(task.Action.Power),
		"input":            task.Action.Input,
		"options":          task.Action.Options,
		"protocol":         strings.TrimSpace(task.Action.Protocol),
		"action_kind":      strings.TrimSpace(task.Action.Kind),
		"source_target_id": task.Action.SourceTargetID,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return string(raw)
}

func finalTaskInflightKey(exec runExecution, task agentaction.AbilityTask) string {
	if strings.TrimSpace(task.Action.Power) == "" {
		return ""
	}
	payload := map[string]any{
		"power":            strings.TrimSpace(task.Action.Power),
		"input":            task.Action.Input,
		"options":          task.Action.Options,
		"protocol":         strings.TrimSpace(task.Action.Protocol),
		"kind":             strings.TrimSpace(task.Action.Kind),
		"source_target_id": firstNonZeroUint64(task.Action.SourceTargetID, exec.Parsed.SourceTargetID),
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return string(raw)
}

func firstNonZeroUint64(values ...uint64) uint64 {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}

func expandFinalTaskRuns(runs []finalTaskRunResult, aliases map[string][]agentaction.AbilityTask) []finalTaskRunResult {
	if len(runs) == 0 || len(aliases) == 0 {
		return runs
	}
	expanded := make([]finalTaskRunResult, 0, len(runs)+len(aliases))
	for _, run := range runs {
		expanded = append(expanded, run)
		for _, alias := range aliases[run.State.ID] {
			expanded = append(expanded, aliasFinalTaskRun(run, alias))
		}
	}
	return expanded
}

func aliasFinalTaskRun(source finalTaskRunResult, task agentaction.AbilityTask) finalTaskRunResult {
	state := source.State
	state.ID = task.ID
	state.PlaceholderID = task.PlaceholderID
	state.Title = finalTaskTitle(task)
	state.Kind = task.Kind
	state.Power = task.Action.Power
	state.Execution = task.Execution
	state.Sort = task.Sort

	result := source.Result
	result.Action = task.Action
	return finalTaskRunResult{State: state, Result: result}
}

func initialFinalTaskStates(tasks []agentaction.AbilityTask) []finalTaskState {
	states := make([]finalTaskState, 0, len(tasks))
	for _, task := range tasks {
		states = append(states, initialFinalTaskState(task))
	}
	return states
}

func initialFinalTaskState(task agentaction.AbilityTask) finalTaskState {
	return finalTaskState{
		ID:            task.ID,
		PlaceholderID: task.PlaceholderID,
		Title:         finalTaskTitle(task),
		Kind:          task.Kind,
		Power:         task.Action.Power,
		Execution:     task.Execution,
		Status:        finalTaskStatusPending,
		Progress:      -1,
		Sort:          task.Sort,
	}
}

func finalTaskStateFromResult(task agentaction.AbilityTask, current finalTaskState, result agentaction.Result) finalTaskState {
	state := current
	switch result.Kind {
	case agentaction.ResultDone:
		state.Status = finalTaskStatusSucceeded
		state.Progress = 100
		state.Text = firstText(agentaction.SummaryText(result.Output), state.Text, "生成完成")
		state.Output = result.Output
	case agentaction.ResultCanceled:
		state.Status = finalTaskStatusFailed
		state.Error = "任务已取消"
		state.Text = "任务已取消"
	case agentaction.ResultInteraction:
		state.Status = finalTaskStatusFailed
		state.Error = firstText(result.Text, "能力参数不足，无法自动生成")
		state.Text = state.Error
	default:
		state.Status = finalTaskStatusFailed
		state.Error = firstText(result.Message, "能力调用失败")
		state.Text = state.Error
	}
	state.ID = task.ID
	state.PlaceholderID = task.PlaceholderID
	state.Title = finalTaskTitle(task)
	state.Kind = task.Kind
	state.Power = task.Action.Power
	state.Execution = task.Execution
	state.Sort = task.Sort
	return state
}

func mergeFinalTaskRunStates(states []finalTaskState, runs []finalTaskRunResult) []finalTaskState {
	if len(states) == 0 || len(runs) == 0 {
		return states
	}
	byID := make(map[string]finalTaskState, len(runs))
	for _, run := range runs {
		if strings.TrimSpace(run.State.ID) != "" {
			byID[run.State.ID] = run.State
		}
	}
	next := append([]finalTaskState{}, states...)
	for index, state := range next {
		if updated, exists := byID[state.ID]; exists {
			next[index] = updated
		}
	}
	return next
}

func finalTaskRunsCanceled(runs []finalTaskRunResult) bool {
	for _, run := range runs {
		if run.Result.Kind == agentaction.ResultCanceled {
			return true
		}
	}
	return false
}

func attachFinalTaskStates(output map[string]any, states []finalTaskState) {
	if len(output) == 0 || len(states) == 0 {
		return
	}
	output["tasks"] = finalTaskStateMaps(states)
	content := cloneMap(normalizeMap(output["content"]))
	if len(content) > 0 {
		content["tasks"] = finalTaskStateMaps(states)
		output["content"] = content
	}
}

func resolveFinalResultMode(output map[string]any, states []finalTaskState) string {
	if mode := explicitFinalResultMode(output); mode != "" {
		return mode
	}
	if len(states) > 0 || hasArtifactResultOutput(output) {
		return finalResultModeArtifact
	}
	return finalResultModeInline
}

func mergePartialResultWithBaseline(output map[string]any, baseline agentcontext.Baseline, plan agentcontext.Plan) map[string]any {
	if len(output) == 0 || !baseline.Found || len(baseline.Output) == 0 {
		return output
	}
	if !shouldPatchBaselineResult(output, plan) {
		return output
	}
	base := cloneMap(baseline.Output)
	if result := normalizeMap(base["result"]); len(result) > 0 {
		base = cloneMap(result)
	}
	next := cloneMap(base)
	for _, key := range []string{"kind", "event", "result_mode", "display_mode"} {
		if value, exists := output[key]; exists && hasResultValue(value) {
			next[key] = value
		}
	}
	for _, key := range []string{"title", "suggestions", "tasks", "ability_tasks", "abilityTasks"} {
		if value, exists := output[key]; exists && hasResultValue(value) {
			next[key] = value
		}
	}
	content := cloneMap(normalizeMap(next["content"]))
	incomingContent := normalizeMap(output["content"])
	for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
		if value, exists := incomingContent[key]; exists && hasResultValue(value) {
			content[key] = value
		}
	}
	if len(content) > 0 {
		next["content"] = content
	}
	if text := strings.TrimSpace(firstText(output["text"])); text != "" && !baselinePatchShouldKeepText(plan) {
		next["text"] = text
		if len(content) > 0 {
			content["text"] = text
			next["content"] = content
		}
	}
	return next
}

func shouldPatchBaselineResult(output map[string]any, plan agentcontext.Plan) bool {
	switch strings.TrimSpace(plan.EditScope) {
	case "local", "replace_assets":
	default:
		return false
	}
	if hasRichResultContent(output) {
		return false
	}
	return hasAbilityTaskFieldInAgentOutput(output) || hasTaskFieldInContent(output)
}

func baselinePatchShouldKeepText(plan agentcontext.Plan) bool {
	return strings.TrimSpace(plan.EditScope) == "replace_assets"
}

func hasRichResultContent(output map[string]any) bool {
	if len(normalizeMap(output["rich"])) > 0 {
		return true
	}
	content := normalizeMap(output["content"])
	return len(normalizeMap(content["rich"])) > 0
}

func hasAbilityTaskFieldInAgentOutput(output map[string]any) bool {
	for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
		if hasResultValue(output[key]) {
			return true
		}
	}
	return false
}

func hasTaskFieldInContent(output map[string]any) bool {
	content := normalizeMap(output["content"])
	for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
		if hasResultValue(content[key]) {
			return true
		}
	}
	return false
}

func explicitFinalResultMode(output map[string]any) string {
	if len(output) == 0 {
		return ""
	}
	content := normalizeMap(output["content"])
	for _, value := range []any{
		output["result_mode"],
		output["display_mode"],
		content["result_mode"],
		content["display_mode"],
	} {
		switch strings.ToLower(strings.TrimSpace(firstText(value))) {
		case finalResultModeInline:
			return finalResultModeInline
		case finalResultModeArtifact, "detail", "drawer":
			return finalResultModeArtifact
		}
	}
	return ""
}

func attachFinalResultMode(output map[string]any, mode string) {
	if len(output) == 0 {
		return
	}
	output["result_mode"] = mode
	content := cloneMap(normalizeMap(output["content"]))
	if len(content) > 0 {
		content["result_mode"] = mode
		output["content"] = content
	}
}

func hasArtifactResultOutput(output map[string]any) bool {
	if len(output) == 0 {
		return false
	}
	for _, key := range []string{"rich", "images", "videos", "audios", "files", "json", "tasks"} {
		if hasResultValue(output[key]) {
			return true
		}
	}
	content := normalizeMap(output["content"])
	if len(content) == 0 {
		return false
	}
	if strings.ToLower(strings.TrimSpace(firstText(content["format"]))) == "rich_json" {
		return true
	}
	for _, key := range []string{"rich", "images", "videos", "audios", "files", "json", "tasks"} {
		if hasResultValue(content[key]) {
			return true
		}
	}
	return false
}

func hasResultValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case []string:
		return len(current) > 0
	case map[string]any:
		return len(current) > 0
	default:
		return true
	}
}

func mergeFinalTaskOutputs(output map[string]any, states []finalTaskState) map[string]any {
	next := agentaction.EnsureAgentRichOutput(output)
	placed := replaceFinalTaskPlaceholders(next, states)
	artifacts := agentaction.NewArtifactAccumulator()
	for _, state := range states {
		if len(state.Output) == 0 || placed[state.ID] {
			continue
		}
		artifacts.Add(state.Output)
	}
	return agentaction.EnsureAgentRichOutput(artifacts.MergeInto(next))
}

func replaceFinalTaskPlaceholders(output map[string]any, states []finalTaskState) map[string]bool {
	if len(output) == 0 || len(states) == 0 {
		return nil
	}
	byPlaceholder := make(map[string]finalTaskState, len(states))
	for _, state := range states {
		for _, key := range []string{state.PlaceholderID, state.ID} {
			key = strings.TrimSpace(key)
			if key != "" {
				byPlaceholder[key] = state
			}
		}
	}
	if len(byPlaceholder) == 0 {
		return nil
	}
	placed := map[string]bool{}
	if rich := normalizeMap(output["rich"]); len(rich) > 0 {
		output["rich"] = replaceFinalTaskPlaceholderNode(rich, byPlaceholder, placed)[0]
	}
	content := cloneMap(normalizeMap(output["content"]))
	if rich := normalizeMap(content["rich"]); len(rich) > 0 {
		content["rich"] = replaceFinalTaskPlaceholderNode(rich, byPlaceholder, placed)[0]
		output["content"] = content
	}
	return placed
}

func replaceFinalTaskPlaceholderNode(node map[string]any, states map[string]finalTaskState, placed map[string]bool) []any {
	nodeType := strings.TrimSpace(firstText(node["type"]))
	if nodeType == "agentAbilityPlaceholder" || nodeType == "agentTaskPlaceholder" {
		attrs := normalizeMap(node["attrs"])
		placeholderID := firstText(attrs["placeholder_id"], attrs["placeholderId"], attrs["id"])
		if state, exists := states[placeholderID]; exists {
			if mediaNodes := finalTaskMediaNodes(state); len(mediaNodes) > 0 {
				placed[state.ID] = true
				return mediaNodes
			}
			node["attrs"] = finalTaskPlaceholderAttrs(attrs, state)
		}
		return []any{node}
	}
	if content, ok := node["content"].([]any); ok {
		nextContent := make([]any, 0, len(content))
		for _, item := range content {
			child, ok := item.(map[string]any)
			if !ok {
				nextContent = append(nextContent, item)
				continue
			}
			nextContent = append(nextContent, replaceFinalTaskPlaceholderNode(child, states, placed)...)
		}
		node["content"] = nextContent
	}
	return []any{node}
}

func finalTaskPlaceholderAttrs(attrs map[string]any, state finalTaskState) map[string]any {
	next := cloneMap(attrs)
	next["status"] = state.Status
	next["title"] = state.Title
	next["kind"] = state.Kind
	if state.Progress >= 0 {
		next["progress"] = state.Progress
	}
	if text := finalTaskDisplayText(state.Text); text != "" {
		next["text"] = text
	} else {
		delete(next, "text")
	}
	if state.Error != "" {
		next["error"] = state.Error
	}
	return next
}

func finalTaskMediaNodes(state finalTaskState) []any {
	if state.Status != finalTaskStatusSucceeded || len(state.Output) == 0 {
		return nil
	}
	switch strings.ToLower(strings.TrimSpace(state.Kind)) {
	case "image", "images", "cover":
		return finalTaskMediaNodeList("editorMediaImage", finalTaskMediaURLs(state.Output, "images"), state.Title)
	case "video", "videos":
		return finalTaskMediaNodeList("editorMediaVideo", finalTaskMediaURLs(state.Output, "videos"), state.Title)
	case "audio", "audios", "song", "music":
		nodes := finalTaskMediaNodeList("editorMediaAudio", finalTaskMediaURLs(state.Output, "audios"), state.Title)
		return append(nodes, finalTaskTextNodes(state.Output)...)
	default:
		if nodes := finalTaskMediaNodeList("editorMediaImage", finalTaskMediaURLs(state.Output, "images"), state.Title); len(nodes) > 0 {
			return nodes
		}
		if nodes := finalTaskMediaNodeList("editorMediaVideo", finalTaskMediaURLs(state.Output, "videos"), state.Title); len(nodes) > 0 {
			return nodes
		}
		if nodes := finalTaskMediaNodeList("editorMediaAudio", finalTaskMediaURLs(state.Output, "audios"), state.Title); len(nodes) > 0 {
			return nodes
		}
		return nil
	}
}

func finalTaskTextNodes(output map[string]any) []any {
	if nodes := finalTaskRichNodes(output); len(nodes) > 0 {
		return nodes
	}
	text := strings.TrimSpace(finalTaskOutputText(output))
	if text == "" {
		return nil
	}
	nodes := make([]any, 0)
	for _, paragraph := range strings.Split(text, "\n\n") {
		paragraph = strings.TrimSpace(paragraph)
		if paragraph == "" {
			continue
		}
		nodes = append(nodes, map[string]any{
			"type":    "paragraph",
			"content": finalTaskInlineTextNodes(paragraph),
		})
	}
	return nodes
}

func finalTaskInlineTextNodes(text string) []any {
	lines := strings.Split(text, "\n")
	nodes := make([]any, 0, len(lines)*2)
	for index, line := range lines {
		if index > 0 {
			nodes = append(nodes, map[string]any{"type": "hardBreak"})
		}
		if line != "" {
			nodes = append(nodes, map[string]any{"type": "text", "text": line})
		}
	}
	return nodes
}

func finalTaskRichNodes(output map[string]any) []any {
	rich := normalizeMap(output["rich"])
	if len(rich) == 0 {
		rich = normalizeMap(normalizeMap(output["content"])["rich"])
	}
	if len(rich) == 0 || strings.TrimSpace(firstText(rich["type"])) != "doc" {
		return nil
	}
	return normalizeAnySlice(rich["content"])
}

func finalTaskOutputText(output map[string]any) string {
	content := normalizeMap(output["content"])
	for _, value := range []any{
		output["text"], content["text"],
		output["lyrics"], content["lyrics"],
		output["lyric"], content["lyric"],
		output["lrc"], content["lrc"],
		output["song_lyrics"], content["song_lyrics"],
		output["songLyrics"], content["songLyrics"],
	} {
		if text, ok := value.(string); ok && strings.TrimSpace(text) != "" {
			return strings.TrimSpace(text)
		}
	}
	return ""
}

func normalizeAnySlice(value any) []any {
	switch current := value.(type) {
	case []any:
		return append([]any{}, current...)
	case []map[string]any:
		values := make([]any, 0, len(current))
		for _, item := range current {
			values = append(values, item)
		}
		return values
	default:
		return nil
	}
}

func finalTaskMediaNodeList(nodeType string, urls []string, title string) []any {
	nodes := make([]any, 0, len(urls))
	for _, url := range urls {
		if strings.TrimSpace(url) == "" {
			continue
		}
		nodes = append(nodes, map[string]any{
			"type": nodeType,
			"attrs": map[string]any{
				"src":   strings.TrimSpace(url),
				"title": title,
				"alt":   title,
			},
		})
	}
	return nodes
}

func finalTaskMediaURLs(output map[string]any, key string) []string {
	content := normalizeMap(output["content"])
	values := make([]string, 0)
	values = append(values, stringListFromAny(content[key])...)
	values = append(values, stringListFromAny(output[key])...)
	return uniqueStrings(values)
}

func stringListFromAny(value any) []string {
	switch current := value.(type) {
	case string:
		if strings.TrimSpace(current) == "" {
			return nil
		}
		return []string{strings.TrimSpace(current)}
	case []string:
		values := make([]string, 0, len(current))
		for _, item := range current {
			if strings.TrimSpace(item) != "" {
				values = append(values, strings.TrimSpace(item))
			}
		}
		return values
	case []any:
		values := make([]string, 0, len(current))
		for _, item := range current {
			if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
				values = append(values, text)
			}
		}
		return values
	default:
		return nil
	}
}

func uniqueStrings(values []string) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func (s Service) writeFinalResultDetail(ctx context.Context, requestID string, resultID string, resultMode string, output map[string]any, states []finalTaskState) error {
	payload := map[string]any{
		"event":          finalResultEventDetail,
		"semantic_event": stream.EventResultCreated,
		"event_type":     stream.EventTypeResult,
		"result_id":      resultID,
		"result_mode":    resultMode,
		"text":           finalResultDetailText(resultMode, output),
		"tasks":          finalTaskStateMaps(states),
	}
	if len(output) > 0 {
		payload["result"] = output
		payload["title"] = firstText(output["title"], "最终结果")
	}
	s.saveFinalResultSnapshot(ctx, requestID, resultID, resultMode, output, states)
	return s.writeStreamOutput(ctx, requestID, payload)
}

func (s Service) saveFinalResultSnapshot(ctx context.Context, requestID string, resultID string, resultMode string, output map[string]any, states []finalTaskState) {
	if len(output) == 0 {
		return
	}
	finalResultSnapshotMu.Lock()
	defer finalResultSnapshotMu.Unlock()
	s.repo.UpdateRunByRequestID(ctx, requestID, map[string]any{
		"output": runOutputText(finalResultCard(resultID, resultMode, output, states), ""),
	})
}

func (s Service) updateFinalResultSnapshot(ctx context.Context, requestID string, resultID string, update func(map[string]any) bool) {
	if strings.TrimSpace(requestID) == "" || update == nil {
		return
	}
	finalResultSnapshotMu.Lock()
	defer finalResultSnapshotMu.Unlock()

	run, err := s.repo.FindRunOutputByRequestID(ctx, requestID)
	if err != nil {
		return
	}
	card := normalizeMap(jsonAny(run.Output))
	if len(card) == 0 || strings.TrimSpace(firstText(card["event"])) != finalResultEventCard {
		return
	}
	if currentID := strings.TrimSpace(firstText(card["result_id"])); currentID != "" && strings.TrimSpace(resultID) != "" && currentID != strings.TrimSpace(resultID) {
		return
	}
	if !update(card) {
		return
	}
	s.repo.UpdateRunByRequestID(ctx, requestID, map[string]any{
		"output": runOutputText(card, ""),
	})
}

func (s Service) saveFinalResultTaskSnapshot(ctx context.Context, requestID string, resultID string, task map[string]any) {
	if len(task) == 0 {
		return
	}
	if !shouldPersistFinalResultTaskSnapshot(task) {
		return
	}
	s.updateFinalResultSnapshot(ctx, requestID, resultID, func(card map[string]any) bool {
		tasks := mergeFinalResultSnapshotTask(card["tasks"], task)
		card["tasks"] = tasks
		if result := cloneMap(normalizeMap(card["result"])); len(result) > 0 {
			result["tasks"] = tasks
			if content := cloneMap(normalizeMap(result["content"])); len(content) > 0 {
				content["tasks"] = tasks
				result["content"] = content
			}
			card["result"] = result
		}
		return true
	})
}

func shouldPersistFinalResultTaskSnapshot(task map[string]any) bool {
	switch strings.TrimSpace(firstText(task["status"])) {
	case finalTaskStatusSucceeded, finalTaskStatusFailed:
		return true
	default:
		return false
	}
}

func finalResultDetailText(resultMode string, output map[string]any) string {
	if resultMode == finalResultModeInline && len(output) > 0 {
		content := normalizeMap(output["content"])
		if text := firstText(output["text"], content["text"], output["title"], content["title"]); text != "" {
			return text
		}
	}
	return "内容已生成，点击查看结果。"
}

func (s Service) writeFinalResultTask(ctx context.Context, requestID string, resultID string, state finalTaskState, meta map[string]any) error {
	taskPayload := state.Map()
	payload := cloneMap(taskPayload)
	semanticEvent := finalTaskSemanticEvent(state)
	payload["event"] = finalResultEventTask
	payload["semantic_event"] = semanticEvent
	payload["event_type"] = stream.EventType(semanticEvent)
	payload["result_id"] = resultID
	if len(meta) > 0 {
		payload["meta"] = meta
		taskPayload["meta"] = meta
	}
	s.saveFinalResultTaskSnapshot(ctx, requestID, resultID, taskPayload)
	return s.writeStreamOutput(ctx, requestID, payload)
}

func (s Service) writeFinalResultProgress(ctx context.Context, requestID string, resultID string, text string, progress int) error {
	if progress < 0 {
		progress = 0
	}
	if progress > 100 {
		progress = 100
	}
	return s.writeStreamOutput(ctx, requestID, map[string]any{
		"event":          finalResultEventProgress,
		"semantic_event": stream.EventResultProgress,
		"event_type":     stream.EventTypeProgress,
		"result_id":      resultID,
		"text":           strings.TrimSpace(text),
		"progress":       progress,
	})
}

func finalTaskSemanticEvent(state finalTaskState) string {
	switch strings.TrimSpace(state.Status) {
	case finalTaskStatusSucceeded, finalTaskStatusFailed:
		return stream.EventTaskDone
	default:
		return stream.EventTaskProgress
	}
}

func finalResultCard(resultID string, resultMode string, output map[string]any, states []finalTaskState) map[string]any {
	cardText := "内容已生成，点击查看结果。"
	card := map[string]any{
		"event":          finalResultEventCard,
		"semantic_event": stream.EventResultCreated,
		"event_type":     stream.EventTypeResult,
		"kind":           agentaction.KindFinal,
		"result_id":      resultID,
		"result_mode":    resultMode,
		"text":           cardText,
		"content": map[string]any{
			"format": "markdown",
			"text":   cardText,
		},
		"result": output,
		"tasks":  finalTaskStateMaps(states),
	}
	copyFinalResultTiming(card, output)
	if suggestions, exists := output["suggestions"]; exists {
		card["suggestions"] = suggestions
	}
	if title := firstText(output["title"], normalizeMap(output["content"])["title"]); title != "" {
		card["title"] = title
	}
	return card
}

func attachFinalResultTiming(output map[string]any, startedAt time.Time, finishedAt time.Time) {
	if len(output) == 0 || startedAt.IsZero() || finishedAt.IsZero() {
		return
	}
	latencyMs := finishedAt.Sub(startedAt).Milliseconds()
	if latencyMs < 0 {
		latencyMs = 0
	}
	output["started_at"] = startedAt.Format(time.RFC3339Nano)
	output["started_at_ms"] = startedAt.UnixMilli()
	output["finished_at"] = finishedAt.Format(time.RFC3339Nano)
	output["finished_at_ms"] = finishedAt.UnixMilli()
	output["latency"] = latencyMs
	output["latency_ms"] = latencyMs
}

func copyFinalResultTiming(target map[string]any, source map[string]any) {
	if len(target) == 0 || len(source) == 0 {
		return
	}
	for _, key := range []string{"started_at", "started_at_ms", "finished_at", "finished_at_ms", "latency", "latency_ms"} {
		if value, exists := source[key]; exists {
			target[key] = value
		}
	}
}

func finalTaskStateMaps(states []finalTaskState) []map[string]any {
	if len(states) == 0 {
		return nil
	}
	rows := make([]map[string]any, 0, len(states))
	for _, state := range states {
		rows = append(rows, state.Map())
	}
	return rows
}

func (state finalTaskState) Map() map[string]any {
	row := map[string]any{
		"id":             state.ID,
		"placeholder_id": state.PlaceholderID,
		"title":          state.Title,
		"kind":           state.Kind,
		"power":          state.Power,
		"execution":      state.Execution,
		"status":         state.Status,
		"sort":           state.Sort,
	}
	if state.Progress >= 0 {
		row["progress"] = state.Progress
	}
	if text := finalTaskDisplayText(state.Text); text != "" {
		row["text"] = text
	}
	if strings.TrimSpace(state.Error) != "" {
		row["error"] = state.Error
	}
	if len(state.Output) > 0 {
		row["output"] = state.Output
	}
	return row
}

func mergeFinalResultSnapshotTask(raw any, task map[string]any) []map[string]any {
	rows := finalResultSnapshotTaskRows(raw)
	if len(rows) == 0 {
		return []map[string]any{cloneMap(task)}
	}
	taskID := finalResultSnapshotTaskID(task)
	if taskID == "" {
		return rows
	}
	for index, row := range rows {
		if finalResultSnapshotTaskID(row) != taskID {
			continue
		}
		next := cloneMap(row)
		for key, value := range task {
			next[key] = value
		}
		rows[index] = next
		return rows
	}
	return append(rows, cloneMap(task))
}

func finalTaskDisplayText(text string) string {
	text = strings.TrimSpace(text)
	if text == "" {
		return ""
	}
	generic := []string{
		"图片生成中，请稍后",
		"素材生成中，请稍后",
		"内容生成中，请稍后",
		"生成中，请稍后",
	}
	for _, item := range generic {
		if strings.Contains(text, item) {
			return ""
		}
	}
	return text
}

func finalResultSnapshotTaskRows(raw any) []map[string]any {
	items := normalizeAnySlice(raw)
	rows := make([]map[string]any, 0, len(items))
	for _, item := range items {
		row := normalizeMap(item)
		if len(row) > 0 {
			rows = append(rows, cloneMap(row))
		}
	}
	return rows
}

func finalResultSnapshotTaskID(row map[string]any) string {
	return strings.TrimSpace(firstText(row["id"], row["task_id"], row["taskId"], row["placeholder_id"], row["placeholderId"]))
}

type knowledgeSearchCall struct {
	baseID  uint64
	query   string
	nodeIDs []uint64
}

func (s Service) triggerRefluxIfNeeded(ctx context.Context, exec runExecution, history []any, output map[string]any) {
	answer := strings.TrimSpace(frontstream.InputText(output["text"]))
	if answer == "" {
		return
	}
	calls := extractKnowledgeSearchCalls(history)
	if len(calls) == 0 {
		return
	}
	ks := agentknowledge.NewService()
	for _, call := range calls {
		if call.query == "" || len(call.nodeIDs) == 0 || call.baseID == 0 {
			continue
		}
		_, _, err := ks.RefluxQA(ctx, call.baseID, 0, call.query, answer, call.nodeIDs)
		if err != nil {
			continue
		}
	}
}

func extractKnowledgeSearchCalls(history []any) []knowledgeSearchCall {
	var calls []knowledgeSearchCall
	for _, item := range history {
		entry, ok := item.(map[string]any)
		if !ok {
			continue
		}
		if strings.TrimSpace(frontstream.InputText(entry["type"])) != "tool_observation" {
			continue
		}
		if strings.TrimSpace(frontstream.InputText(entry["tool"])) != agenttool.NameKnowledgeSearch {
			continue
		}
		output, ok := entry["output"].(map[string]any)
		if !ok {
			continue
		}
		result, ok := output["result"].(map[string]any)
		if !ok {
			continue
		}
		query := strings.TrimSpace(frontstream.InputText(result["query"]))
		baseID := uint64(frontstream.InputInt64(result["knowledge_base_id"], 0))
		if query == "" || baseID == 0 {
			continue
		}
		var nodeIDs []uint64
		if raw, ok := result["hit_node_ids"].([]any); ok {
			for _, id := range raw {
				nodeIDs = append(nodeIDs, uint64(frontstream.InputInt64(id, 0)))
			}
		}
		if len(nodeIDs) == 0 {
			continue
		}
		calls = append(calls, knowledgeSearchCall{
			baseID:  baseID,
			query:   query,
			nodeIDs: nodeIDs,
		})
	}
	return calls
}

func finalTaskTitle(task agentaction.AbilityTask) string {
	return firstText(task.Title, task.Kind, task.Action.Power, "素材任务")
}

func finalTaskProgress(meta map[string]any) int {
	if len(meta) == 0 {
		return -1
	}
	if progress := int(frontstream.InputInt64(meta["progress"], -1)); progress >= 0 {
		return progress
	}
	nested := normalizeMap(meta["meta"])
	if progress := int(frontstream.InputInt64(nested["progress"], -1)); progress >= 0 {
		return progress
	}
	return int(frontstream.InputInt64(nested["percent"], -1))
}

func mergeFinalTaskProgress(current int, incoming int) int {
	if incoming < 0 {
		return current
	}
	if current < 0 || incoming > current {
		return incoming
	}
	return current
}

func finalResultID(exec runExecution) string {
	if strings.TrimSpace(exec.RequestID) != "" {
		return strings.TrimSpace(exec.RequestID)
	}
	return fmt.Sprintf("run-%d", exec.RunID)
}

func finalTaskRequestID(parentID string, taskID string) string {
	return strings.TrimSpace(parentID) + "-task-" + safeFinalTaskID(taskID)
}

func finalTaskTimeout(exec runExecution, taskCount int) time.Duration {
	seconds := exec.Agent.TimeoutSeconds
	if seconds <= 0 {
		seconds = 300
	}
	if seconds < 300 {
		seconds = 300
	}
	if taskCount > 1 {
		seconds += (taskCount - 1) * 60
	}
	if seconds > 1800 {
		seconds = 1800
	}
	return time.Duration(seconds) * time.Second
}

func safeFinalTaskID(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return "task"
	}
	replacer := strings.NewReplacer(" ", "-", "\t", "-", "\n", "-", "\r", "-", "/", "-", "\\", "-", ":", "-")
	return replacer.Replace(value)
}

var (
	finalTaskStreamRegistry   sync.Map
	finalTaskCancelRegistry   sync.Map
	finalTaskInflightRegistry sync.Map
)

type finalTaskInflightCall struct {
	done   chan struct{}
	result finalTaskRunResult
}

func registerFinalTaskCancel(parentID string, cancel context.CancelFunc) func() {
	parentID = strings.TrimSpace(parentID)
	if parentID == "" || cancel == nil {
		return func() {}
	}
	finalTaskCancelRegistry.Store(parentID, cancel)
	return func() {
		finalTaskCancelRegistry.Delete(parentID)
	}
}

func cancelFinalTaskContext(parentID string) bool {
	value, exists := finalTaskCancelRegistry.Load(strings.TrimSpace(parentID))
	if !exists {
		return false
	}
	cancel, _ := value.(context.CancelFunc)
	if cancel == nil {
		return false
	}
	cancel()
	finalTaskCancelRegistry.Delete(strings.TrimSpace(parentID))
	return true
}

func registerFinalTaskStream(parentID string, childID string) func() {
	parentID = strings.TrimSpace(parentID)
	childID = strings.TrimSpace(childID)
	if parentID == "" || childID == "" {
		return func() {}
	}
	value, _ := finalTaskStreamRegistry.LoadOrStore(parentID, &sync.Map{})
	children, _ := value.(*sync.Map)
	if children == nil {
		return func() {}
	}
	children.Store(childID, struct{}{})
	return func() {
		children.Delete(childID)
	}
}

func (s Service) stopFinalTaskStreams(ctx context.Context, parentID string) bool {
	stopped := cancelFinalTaskContext(parentID)
	value, exists := finalTaskStreamRegistry.Load(strings.TrimSpace(parentID))
	if !exists {
		return stopped
	}
	children, _ := value.(*sync.Map)
	if children == nil {
		return stopped
	}
	children.Range(func(key, _ any) bool {
		childID := strings.TrimSpace(fmt.Sprint(key))
		if childID != "" {
			_ = s.gateway.StopStream(ctx, childID)
			stopped = true
		}
		children.Delete(key)
		return true
	})
	finalTaskStreamRegistry.Delete(strings.TrimSpace(parentID))
	return stopped
}
