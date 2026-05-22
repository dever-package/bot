package brain

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	brainmodel "my/package/bot/model/brain"
)

func (s Service) RunBrain(ctx context.Context, req RunRequest) (map[string]any, error) {
	brain, err := s.repo.FindBrain(ctx, req.BrainID)
	if err != nil {
		return nil, err
	}
	release, err := s.runnableBrainRelease(ctx, brain)
	if err != nil {
		return nil, err
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"brain_id":   brain.ID,
		"release_id": release.ID,
		"input":      jsonText(req.Input),
		"output":     "{}",
		"error":      "",
		"status":     brainmodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	})
	if runID == 0 {
		return nil, fmt.Errorf("创建大脑运行失败")
	}
	go s.executeBrainRun(context.Background(), runID)
	return map[string]any{
		"request_id": requestID,
		"run_id":     runID,
		"status":     brainmodel.RunStatusRunning,
		"release_id": release.ID,
		"version":    release.Version,
		"brain": map[string]any{
			"id":   brain.ID,
			"name": brain.Name,
			"key":  brain.Key,
		},
	}, nil
}

func (s Service) RunThink(ctx context.Context, req RunRequest) (map[string]any, error) {
	var brain brainmodel.Brain
	var err error
	if req.BrainID > 0 {
		brain, err = s.repo.FindBrain(ctx, req.BrainID)
	} else {
		think, findErr := s.repo.FindThink(ctx, req.ThinkID)
		if findErr != nil {
			return nil, findErr
		}
		brain, err = s.repo.FindBrain(ctx, think.BrainID)
	}
	if err != nil {
		return nil, err
	}
	release, err := s.runnableBrainRelease(ctx, brain)
	if err != nil {
		return nil, err
	}
	graph, err := runtimeGraphFromRelease(*release)
	if err != nil {
		return nil, err
	}
	think := graph.findThink(req.ThinkID)
	if think.ID == 0 {
		return nil, fmt.Errorf("当前思维还没有发布，不能运行")
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	runInput := map[string]any{}
	for key, value := range req.Input {
		runInput[key] = value
	}
	runInput["_mode"] = "think"
	runInput["_think_id"] = think.ID
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"brain_id":   brain.ID,
		"release_id": release.ID,
		"input":      jsonText(runInput),
		"output":     "{}",
		"error":      "",
		"status":     brainmodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	})
	if runID == 0 {
		return nil, fmt.Errorf("创建思维运行失败")
	}
	go s.executeSingleThinkRun(context.Background(), runID, think.ID, req.Input)
	return map[string]any{
		"request_id": requestID,
		"run_id":     runID,
		"think_id":   think.ID,
		"status":     brainmodel.RunStatusRunning,
		"release_id": release.ID,
		"version":    release.Version,
	}, nil
}

func (s Service) ResumeRun(ctx context.Context, runID uint64) (map[string]any, error) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	if run.Status != brainmodel.RunStatusWaiting {
		return nil, fmt.Errorf("只有等待人工的运行可以恢复")
	}
	go s.executeBrainRun(context.Background(), run.ID)
	return map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"status":     brainmodel.RunStatusRunning,
	}, nil
}

func (s Service) StopRun(ctx context.Context, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveRun(ctx, runID, requestID)
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	now := time.Now()
	s.repo.UpdateRun(ctx, run.ID, map[string]any{
		"status":      brainmodel.RunStatusCanceled,
		"finished_at": now,
	})
	return map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"status":     brainmodel.RunStatusCanceled,
	}, nil
}

func (s Service) RunStatus(ctx context.Context, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveRun(ctx, runID, requestID)
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	return map[string]any{
		"run":        runToMap(*run),
		"think_runs": thinkRunsToMaps(s.repo.ListThinkRuns(ctx, run.ID)),
		"node_runs":  nodeRunsToMaps(s.repo.ListNodeRuns(ctx, run.ID)),
		"blackboard": blackboardRowsToMaps(s.repo.ListBlackboardRows(ctx, run.ID)),
		"messages":   messagesToMaps(s.repo.ListMessages(ctx, run.ID)),
		"approvals":  approvalsToMaps(s.repo.ListApprovals(ctx, run.ID)),
	}, nil
}

func (s Service) resolveRun(ctx context.Context, runID uint64, requestID string) *brainmodel.Run {
	if runID > 0 {
		return s.repo.FindRun(ctx, runID)
	}
	return s.repo.FindRunByRequestID(ctx, requestID)
}

func (s Service) executeBrainRun(ctx context.Context, runID uint64) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return
	}
	if run.Status == brainmodel.RunStatusCanceled {
		return
	}
	graph, err := s.runtimeGraphForRun(ctx, *run)
	if err != nil {
		s.finishRun(ctx, run.ID, brainmodel.RunStatusFail, nil, err)
		return
	}
	if issues := validateThinkGraph(graph.Thinks, graph.ThinkEdges); len(issues) > 0 {
		s.finishRun(ctx, run.ID, brainmodel.RunStatusFail, nil, errors.New(strings.Join(issues, "；")))
		return
	}
	input := jsonMap(run.Input)
	status, output, err := s.executeThinkDAG(ctx, *run, graph, input)
	if err != nil {
		s.finishRun(ctx, run.ID, status, output, err)
		return
	}
	s.finishRun(ctx, run.ID, status, output, nil)
}

func (s Service) executeSingleThinkRun(ctx context.Context, runID uint64, thinkID uint64, input map[string]any) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return
	}
	if run.Status == brainmodel.RunStatusCanceled {
		return
	}
	graph, err := s.runtimeGraphForRun(ctx, *run)
	if err != nil {
		s.finishRun(ctx, run.ID, brainmodel.RunStatusFail, nil, err)
		return
	}
	think := graph.findThink(thinkID)
	if think.ID == 0 {
		s.finishRun(ctx, run.ID, brainmodel.RunStatusFail, nil, fmt.Errorf("发布版本中不存在当前思维"))
		return
	}
	status, output, err := s.executeThinkWithGraph(
		ctx,
		*run,
		graph.Brain,
		think,
		input,
		graph.FlowNodesByThinkID[think.ID],
		graph.FlowEdgesByThinkID[think.ID],
	)
	if err != nil {
		s.finishRun(ctx, run.ID, status, output, err)
		return
	}
	s.finishRun(ctx, run.ID, status, output, nil)
}

func (s Service) executeThinkDAG(ctx context.Context, run brainmodel.Run, graph runtimeGraph, input map[string]any) (string, map[string]any, error) {
	incoming := map[uint64][]brainmodel.ThinkEdge{}
	for _, edge := range graph.ThinkEdges {
		incoming[edge.ToThinkID] = append(incoming[edge.ToThinkID], edge)
	}
	completed := map[uint64]map[string]any{}
	failed := map[uint64]bool{}
	skipped := map[uint64]bool{}
	for len(completed)+len(failed)+len(skipped) < len(graph.Thinks) {
		if s.runCanceled(ctx, run.ID) {
			return brainmodel.RunStatusCanceled, completedOutput(completed), fmt.Errorf("运行已取消")
		}
		ready := make([]brainmodel.Think, 0)
		for _, think := range graph.Thinks {
			if _, ok := completed[think.ID]; ok {
				continue
			}
			if failed[think.ID] {
				continue
			}
			if skipped[think.ID] {
				continue
			}
			thinkRunID := s.repo.FindOrCreateThinkRun(ctx, run, think, input)
			current := s.repo.FindThinkRun(ctx, thinkRunID)
			if current != nil && current.Status == brainmodel.RunStatusSuccess {
				completed[think.ID] = jsonMap(current.Output)
				continue
			}
			if current != nil && current.Status == brainmodel.RunStatusWaiting {
				return brainmodel.RunStatusWaiting, completedOutput(completed), runWaitError{message: "等待人工确认"}
			}
			if thinkReady(think.ID, incoming, completed, skipped) {
				ready = append(ready, think)
			}
		}
		if len(ready) == 0 {
			if markSkippedThinks(graph.Thinks, incoming, completed, skipped) {
				continue
			}
			return brainmodel.RunStatusFail, completedOutput(completed), fmt.Errorf("思维 DAG 无可执行节点")
		}
		for _, think := range ready {
			thinkInput := buildThinkInput(input, incoming[think.ID], completed)
			status, output, err := s.executeThinkWithGraph(
				ctx,
				run,
				graph.Brain,
				think,
				thinkInput,
				graph.FlowNodesByThinkID[think.ID],
				graph.FlowEdgesByThinkID[think.ID],
			)
			if status == brainmodel.RunStatusWaiting {
				return status, completedOutput(completed), err
			}
			if err != nil {
				failed[think.ID] = true
				return status, completedOutput(completed), err
			}
			completed[think.ID] = output
		}
	}
	return brainmodel.RunStatusSuccess, completedOutput(completed), nil
}

func (s Service) runCanceled(ctx context.Context, runID uint64) bool {
	run := s.repo.FindRun(ctx, runID)
	return run != nil && run.Status == brainmodel.RunStatusCanceled
}

func (s Service) executeThinkWithGraph(ctx context.Context, run brainmodel.Run, brain brainmodel.Brain, think brainmodel.Think, input map[string]any, nodes []brainmodel.ThinkFlowNode, edges []brainmodel.ThinkFlowNodeEdge) (string, map[string]any, error) {
	thinkRunID := s.repo.FindOrCreateThinkRun(ctx, run, think, input)
	thinkRun := s.repo.FindThinkRun(ctx, thinkRunID)
	if thinkRun == nil {
		return brainmodel.RunStatusFail, nil, fmt.Errorf("创建思维运行失败")
	}
	now := time.Now()
	s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
		"status":     brainmodel.RunStatusRunning,
		"started_at": now,
	})
	for key, value := range input {
		s.writeBlackboard(ctx, run, *thinkRun, key, value, "input", 0)
	}

	if normalizeThinkType(think.Type) != brainmodel.ThinkTypeFlow {
		err := fmt.Errorf("创作需要由前端画布运行，不能作为流程直接运行: %s", think.Name)
		s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
			"status":      brainmodel.RunStatusFail,
			"error":       err.Error(),
			"finished_at": time.Now(),
		})
		return brainmodel.RunStatusFail, nil, err
	}

	if issues := validateFlowGraph(nodes, edges); len(issues) > 0 {
		err := errors.New(strings.Join(issues, "；"))
		s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
			"status":      brainmodel.RunStatusFail,
			"error":       err.Error(),
			"finished_at": time.Now(),
		})
		return brainmodel.RunStatusFail, nil, err
	}

	status, output, err := s.executeNodeDAG(ctx, run, *thinkRun, brain, think, nodes, edges)
	if status == brainmodel.RunStatusWaiting {
		s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
			"status": brainmodel.RunStatusWaiting,
		})
		s.repo.UpdateRun(ctx, run.ID, map[string]any{
			"status": brainmodel.RunStatusWaiting,
		})
		return status, output, err
	}
	record := map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"finished_at": time.Now(),
	}
	if err != nil {
		record["error"] = err.Error()
	}
	s.repo.UpdateThinkRun(ctx, thinkRun.ID, record)
	return status, output, err
}

func (s Service) finishRun(ctx context.Context, runID uint64, status string, output map[string]any, err error) {
	record := map[string]any{
		"status": status,
		"output": jsonText(output),
	}
	if status != brainmodel.RunStatusWaiting {
		record["finished_at"] = time.Now()
	}
	if err != nil {
		record["error"] = err.Error()
	}
	s.repo.UpdateRun(ctx, runID, record)
}

func thinkReady(thinkID uint64, incoming map[uint64][]brainmodel.ThinkEdge, completed map[uint64]map[string]any, skipped map[uint64]bool) bool {
	edges := incoming[thinkID]
	if len(edges) == 0 {
		return true
	}
	hasCompletedInput := false
	for _, edge := range edges {
		if skipped[edge.FromThinkID] {
			continue
		}
		output, ok := completed[edge.FromThinkID]
		if !ok {
			return false
		}
		if !thinkEdgeConditionPassed(edge.Condition, output) {
			return false
		}
		hasCompletedInput = true
	}
	return hasCompletedInput
}

func markSkippedThinks(thinks []brainmodel.Think, incoming map[uint64][]brainmodel.ThinkEdge, completed map[uint64]map[string]any, skipped map[uint64]bool) bool {
	marked := false
	for _, think := range thinks {
		if _, ok := completed[think.ID]; ok {
			continue
		}
		if skipped[think.ID] {
			continue
		}
		edges := incoming[think.ID]
		if len(edges) == 0 {
			continue
		}
		resolved := true
		for _, edge := range edges {
			if _, ok := completed[edge.FromThinkID]; !ok && !skipped[edge.FromThinkID] {
				resolved = false
				break
			}
		}
		if resolved && !thinkReady(think.ID, incoming, completed, skipped) {
			skipped[think.ID] = true
			marked = true
		}
	}
	return marked
}

func thinkEdgeConditionPassed(condition string, output map[string]any) bool {
	condition = strings.ToLower(strings.TrimSpace(condition))
	if condition == "" || condition == "always" || condition == "completed" || condition == "success" {
		return true
	}
	switch condition {
	case "passed":
		return boolValue(outputField(output, "passed"))
	case "failed":
		value, exists := outputFieldExists(output, "passed")
		return exists && !boolValue(value)
	case "approved":
		return strings.EqualFold(textValue(outputField(output, "decision")), "approved")
	case "rejected":
		return strings.EqualFold(textValue(outputField(output, "decision")), "rejected")
	default:
		return true
	}
}

func buildThinkInput(root map[string]any, incoming []brainmodel.ThinkEdge, completed map[uint64]map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range root {
		result[key] = value
	}
	if len(result) == 0 {
		result["user_input"] = root
	}
	for _, edge := range incoming {
		output, ok := completed[edge.FromThinkID]
		if !ok {
			continue
		}
		result[fmt.Sprintf("think_%d", edge.FromThinkID)] = output
		for fromKey, toKeyRaw := range jsonMap(edge.InputMapping) {
			toKey := textValue(toKeyRaw)
			if toKey == "" {
				continue
			}
			result[toKey] = output[fromKey]
		}
	}
	return result
}

func completedOutput(completed map[uint64]map[string]any) map[string]any {
	result := map[string]any{}
	for thinkID, output := range completed {
		result[fmt.Sprintf("think_%d", thinkID)] = output
	}
	return result
}
