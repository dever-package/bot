package brain

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	brainmodel "my/package/bot/model/brain"
	assetservice "my/package/bot/service/asset"
)

func (s Service) RunBrain(ctx context.Context, req RunRequest) (map[string]any, error) {
	brain, err := s.repo.FindBrain(ctx, req.BrainID)
	if err != nil {
		return nil, err
	}
	mode := strings.TrimSpace(req.Mode)
	if mode == "" {
		mode = "brain"
	}
	var release *brainmodel.BrainRelease
	if mode != "debug_brain" {
		release, err = s.runnableRelease(ctx, brain, req.ReleaseID)
		if err != nil {
			return nil, err
		}
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	runInput := cloneInput(req.Input)
	runInput["_mode"] = mode
	releaseID := uint64(0)
	version := 0
	if release != nil {
		releaseID = release.ID
		version = release.Version
	}
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"brain_id":   brain.ID,
		"release_id": releaseID,
		"input":      jsonText(runInput),
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
		"release_id": releaseID,
		"version":    version,
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
	mode := strings.TrimSpace(req.Mode)
	if mode == "" {
		mode = "think"
	}
	releaseID := uint64(0)
	version := 0
	var think brainmodel.Think
	if mode == "debug_think" {
		think, err = s.repo.FindThink(ctx, req.ThinkID)
		if err != nil {
			return nil, err
		}
		if think.BrainID != brain.ID {
			return nil, fmt.Errorf("思维不属于当前大脑")
		}
	} else {
		release, releaseErr := s.runnableRelease(ctx, brain, req.ReleaseID)
		if releaseErr != nil {
			return nil, releaseErr
		}
		graph, graphErr := runtimeGraphFromRelease(*release)
		if graphErr != nil {
			return nil, graphErr
		}
		think = graph.findThink(req.ThinkID)
		if think.ID == 0 {
			return nil, fmt.Errorf("当前思维还没有发布，不能运行")
		}
		releaseID = release.ID
		version = release.Version
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	runInput := cloneInput(req.Input)
	runInput["_mode"] = mode
	runInput["_think_id"] = think.ID
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"brain_id":   brain.ID,
		"release_id": releaseID,
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
		"release_id": releaseID,
		"version":    version,
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
	return s.stopResolvedRun(ctx, run)
}

func (s Service) StopProjectRun(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveProjectRun(ctx, projectID, runID, requestID)
	return s.stopResolvedRun(ctx, run)
}

func (s Service) stopResolvedRun(ctx context.Context, run *brainmodel.Run) (map[string]any, error) {
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
	return s.resolvedRunStatus(ctx, run)
}

func (s Service) ProjectRunStatus(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveProjectRun(ctx, projectID, runID, requestID)
	return s.resolvedRunStatus(ctx, run)
}

func (s Service) resolvedRunStatus(ctx context.Context, run *brainmodel.Run) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	thinkRuns := s.repo.ListThinkRuns(ctx, run.ID)
	nodeRuns := s.repo.ListNodeRuns(ctx, run.ID)
	thinkNames := s.thinkNameMap(ctx, thinkRuns, nodeRuns)
	nodeNames := s.nodeNameMap(ctx, nodeRuns)
	return map[string]any{
		"run":        runToMap(*run),
		"think_runs": thinkRunsToMaps(thinkRuns, thinkNames),
		"node_runs":  nodeRunsToMaps(nodeRuns, thinkNames, nodeNames),
		"agent_runs": s.agent.RunTraces(ctx, agentRunIDsFromNodeRuns(nodeRuns)),
		"blackboard": blackboardRowsToMaps(s.repo.ListBlackboardRows(ctx, run.ID)),
		"messages":   messagesToMaps(s.repo.ListMessages(ctx, run.ID)),
		"approvals":  approvalsToMaps(s.repo.ListApprovals(ctx, run.ID)),
	}, nil
}

func (s Service) thinkNameMap(ctx context.Context, thinkRuns []brainmodel.ThinkRun, nodeRuns []brainmodel.NodeRun) map[uint64]string {
	ids := make([]uint64, 0, len(thinkRuns)+len(nodeRuns))
	for _, row := range thinkRuns {
		ids = append(ids, row.ThinkID)
	}
	for _, row := range nodeRuns {
		ids = append(ids, row.ThinkID)
	}
	result := map[uint64]string{}
	for _, think := range s.repo.ListThinksByIDs(ctx, ids) {
		result[think.ID] = think.Name
	}
	return result
}

func (s Service) nodeNameMap(ctx context.Context, nodeRuns []brainmodel.NodeRun) map[uint64]string {
	ids := make([]uint64, 0, len(nodeRuns))
	for _, row := range nodeRuns {
		ids = append(ids, row.NodeID)
	}
	result := map[uint64]string{}
	for _, node := range s.repo.ListThinkNodesByIDs(ctx, ids) {
		result[node.ID] = node.Name
	}
	return result
}

func agentRunIDsFromNodeRuns(rows []brainmodel.NodeRun) []uint64 {
	result := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row.AgentRunID > 0 {
			result = append(result, row.AgentRunID)
		}
	}
	return result
}

func (s Service) resolveRun(ctx context.Context, runID uint64, requestID string) *brainmodel.Run {
	if runID > 0 {
		return s.repo.FindRun(ctx, runID)
	}
	return s.repo.FindRunByRequestID(ctx, requestID)
}

func (s Service) resolveProjectRun(ctx context.Context, projectID uint64, runID uint64, requestID string) *brainmodel.Run {
	if projectID == 0 {
		return nil
	}
	if runID > 0 {
		return s.repo.FindRunInProject(ctx, runID, projectID)
	}
	return s.repo.FindRunByRequestIDInProject(ctx, requestID, projectID)
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
	input := executionInput(jsonMap(run.Input))
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
		graph.NodesByThinkID[think.ID],
		graph.NodeEdgesByThinkID[think.ID],
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
				graph.NodesByThinkID[think.ID],
				graph.NodeEdgesByThinkID[think.ID],
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

func (s Service) executeThinkWithGraph(ctx context.Context, run brainmodel.Run, brain brainmodel.Brain, think brainmodel.Think, input map[string]any, nodes []brainmodel.ThinkNode, edges []brainmodel.ThinkNodeEdge) (string, map[string]any, error) {
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

	if issues := validateThinkNodeGraph(nodes, edges); len(issues) > 0 {
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
	var assetErr error
	if status == brainmodel.RunStatusSuccess {
		assetErr = s.saveFinalRunAsset(ctx, runID, output)
	}
	record := map[string]any{
		"status": status,
		"output": jsonText(output),
	}
	if status != brainmodel.RunStatusWaiting {
		record["finished_at"] = time.Now()
	}
	if err != nil {
		record["error"] = err.Error()
	} else if assetErr != nil {
		record["error"] = assetErr.Error()
	}
	s.repo.UpdateRun(ctx, runID, record)
}

func cloneInput(input map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range input {
		result[key] = value
	}
	return result
}

func executionInput(input map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range input {
		if strings.HasPrefix(key, "_") {
			continue
		}
		result[key] = value
	}
	return result
}

func (s Service) saveFinalRunAsset(ctx context.Context, runID uint64, output map[string]any) error {
	if len(output) == 0 {
		return nil
	}
	run := s.repo.FindRun(ctx, runID)
	if run == nil || run.ProjectID == 0 {
		return nil
	}
	input := jsonMap(run.Input)
	mode := firstText(input["_mode"])
	if mode != "brain" && mode != "think" {
		return nil
	}
	thinkID := uint64(0)
	name := "大脑运行结果"
	if mode == "think" {
		thinkID = uint64Value(input["_think_id"])
		name = "思维运行结果"
		if thinkID > 0 {
			if think, err := s.repo.FindThink(ctx, thinkID); err == nil {
				name = fmt.Sprintf("%s 运行结果", think.Name)
			}
		}
	}
	_, _, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID: run.ProjectID,
		BrainID:   run.BrainID,
		ThinkID:   thinkID,
		RunID:     run.ID,
		ReleaseID: run.ReleaseID,
		Name:      name,
		Kind:      finalAssetKind(output),
		Content:   output,
	})
	return err
}

func finalAssetKind(output map[string]any) string {
	if kind := firstText(output["kind"], output["content_type"], output["type"]); kind != "" {
		return kind
	}
	if _, ok := output["image"]; ok {
		return "image"
	}
	if _, ok := output["images"]; ok {
		return "image"
	}
	if _, ok := output["video"]; ok {
		return "video"
	}
	if _, ok := output["videos"]; ok {
		return "video"
	}
	if _, ok := output["audio"]; ok {
		return "audio"
	}
	if _, ok := output["audios"]; ok {
		return "audio"
	}
	if len(output) > 1 {
		return "mixed"
	}
	return "text"
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
