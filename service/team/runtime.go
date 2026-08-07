package team

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	"github.com/dever-package/bot/service/stream"
)

func (s Service) RunTeam(ctx context.Context, req RunRequest) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, req.TeamID)
	if err != nil {
		return nil, err
	}
	mode := strings.TrimSpace(req.Mode)
	if mode == "" {
		mode = "team"
	}
	var release *teammodel.TeamRelease
	if mode != "debug_team" {
		release, err = s.runnableRelease(ctx, team, req.ReleaseID)
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
	attachRunBilling(runInput, req.Billing)
	releaseID := uint64(0)
	version := 0
	if release != nil {
		releaseID = release.ID
		version = release.Version
	}
	now := time.Now()
	runRecord := map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"team_id":    team.ID,
		"release_id": releaseID,
		"input":      jsonText(runInput),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	}
	attachRunScope(ctx, runRecord)
	runID := s.repo.InsertRun(ctx, runRecord)
	if runID == 0 {
		return nil, fmt.Errorf("创建团队运行失败")
	}
	s.writeRunEvent(ctx, teammodel.Run{
		ID:        runID,
		RequestID: requestID,
		ProjectID: req.ProjectID,
		TeamID:    team.ID,
		ReleaseID: releaseID,
		Status:    teammodel.RunStatusRunning,
		StartedAt: now,
		CreatedAt: now,
	}, stream.EventRunStarted, map[string]any{
		"feature": stream.FeatureTeam,
		"scope":   "run",
		"mode":    mode,
		"input":   runInput,
		"version": version,
		"team": map[string]any{
			"id":   team.ID,
			"name": team.Name,
		},
	})
	s.runAsync(context.Background(), runID, func(ctx context.Context) {
		s.executeTeamRun(ctx, runID)
	})
	return map[string]any{
		"request_id": requestID,
		"run_id":     runID,
		"status":     teammodel.RunStatusRunning,
		"release_id": releaseID,
		"version":    version,
		"team": map[string]any{
			"id":   team.ID,
			"name": team.Name,
		},
	}, nil
}

func (s Service) RunFlow(ctx context.Context, req RunRequest) (map[string]any, error) {
	var team teammodel.Team
	var err error
	if req.TeamID > 0 {
		team, err = s.repo.FindTeam(ctx, req.TeamID)
	} else {
		flow, findErr := s.repo.FindFlow(ctx, req.FlowID)
		if findErr != nil {
			return nil, findErr
		}
		team, err = s.repo.FindTeam(ctx, flow.TeamID)
	}
	if err != nil {
		return nil, err
	}
	mode := strings.TrimSpace(req.Mode)
	if mode == "" {
		mode = "flow"
	}
	releaseID := uint64(0)
	version := 0
	var flow teammodel.Flow
	if mode == "debug_flow" {
		flow, err = s.repo.FindFlow(ctx, req.FlowID)
		if err != nil {
			return nil, err
		}
		if flow.TeamID != team.ID {
			return nil, fmt.Errorf("工作流不属于当前团队")
		}
	} else {
		release, releaseErr := s.runnableRelease(ctx, team, req.ReleaseID)
		if releaseErr != nil {
			return nil, releaseErr
		}
		graph, graphErr := runtimeGraphFromRelease(*release)
		if graphErr != nil {
			return nil, graphErr
		}
		flow = graph.findFlow(req.FlowID)
		if flow.ID == 0 {
			return nil, fmt.Errorf("当前工作流还没有发布，不能运行")
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
	runInput["_flow_id"] = flow.ID
	attachRunBilling(runInput, req.Billing)
	now := time.Now()
	runRecord := map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"team_id":    team.ID,
		"release_id": releaseID,
		"input":      jsonText(runInput),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	}
	attachRunScope(ctx, runRecord)
	runID := s.repo.InsertRun(ctx, runRecord)
	if runID == 0 {
		return nil, fmt.Errorf("创建工作流运行失败")
	}
	s.writeRunEvent(ctx, teammodel.Run{
		ID:        runID,
		RequestID: requestID,
		ProjectID: req.ProjectID,
		TeamID:    team.ID,
		ReleaseID: releaseID,
		Status:    teammodel.RunStatusRunning,
		StartedAt: now,
		CreatedAt: now,
	}, stream.EventRunStarted, map[string]any{
		"feature": stream.FeatureFlow,
		"scope":   "run",
		"mode":    mode,
		"input":   runInput,
		"version": version,
		"flow": map[string]any{
			"id":   flow.ID,
			"name": flow.Name,
			"key":  flow.Key,
		},
	})
	s.runAsync(context.Background(), runID, func(ctx context.Context) {
		s.executeSingleFlowRun(ctx, runID, flow.ID, req.Input)
	})
	return map[string]any{
		"request_id": requestID,
		"run_id":     runID,
		"flow_id":    flow.ID,
		"status":     teammodel.RunStatusRunning,
		"release_id": releaseID,
		"version":    version,
	}, nil
}

func (s Service) continueWaitingRun(ctx context.Context, run teammodel.Run, flowRun *teammodel.FlowRun) {
	s.continueRunExecution(ctx, run, flowRun)
}

func (s Service) continueRunExecution(ctx context.Context, run teammodel.Run, flowRun *teammodel.FlowRun) {
	if isCanvasPowerRun(run) {
		s.failInterruptedCanvasPowerRun(ctx, run)
		return
	}
	runInput := jsonMap(run.Input)
	if isSingleFlowRunMode(runInput) {
		flowID := uint64Value(runInput["_flow_id"])
		input := executionInput(runInput)
		if flowRun != nil {
			flowID = flowRun.FlowID
			input = jsonMap(flowRun.Input)
		}
		s.runAsync(ctx, run.ID, func(ctx context.Context) {
			s.executeSingleFlowRun(ctx, run.ID, flowID, input)
		})
		return
	}
	s.runAsync(ctx, run.ID, func(ctx context.Context) {
		s.executeTeamRun(ctx, run.ID)
	})
}

func isSingleFlowRunMode(input map[string]any) bool {
	mode := strings.ToLower(strings.TrimSpace(textValue(input["_mode"])))
	return mode == "flow" || mode == "debug_flow" || mode == "sub_flow"
}

func (s Service) StopRun(ctx context.Context, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveRun(ctx, runID, requestID)
	return s.stopResolvedRun(ctx, run)
}

func (s Service) StopProjectRun(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveProjectRun(ctx, projectID, runID, requestID)
	return s.stopResolvedRun(ctx, run)
}

func (s Service) StopBodyRun(ctx context.Context, bodyID uint64, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveBodyRun(ctx, bodyID, runID, requestID)
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	_ = s.gateway.StopStream(ctx, run.RequestID)
	return s.stopResolvedRun(ctx, run)
}

func (s Service) stopResolvedRun(ctx context.Context, run *teammodel.Run) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	if teamRunTerminal(run.Status) {
		return s.resolvedRunSnapshot(ctx, run)
	}
	now := time.Now()
	if !s.repo.CancelRunIfActive(ctx, run.ID, now) {
		return s.resolvedRunSnapshot(ctx, s.repo.FindRun(ctx, run.ID))
	}
	run.Status = teammodel.RunStatusCanceled
	if run.ChildRequestID != "" {
		s.agent.StopTask(run.ChildRequestID)
		_ = s.gateway.StopStream(ctx, run.ChildRequestID)
	}
	for _, nodeRun := range s.repo.ListNodeRuns(ctx, run.ID) {
		if nodeRun.Status != teammodel.RunStatusPending && nodeRun.Status != teammodel.RunStatusRunning && nodeRun.Status != teammodel.RunStatusWaiting {
			continue
		}
		if nodeRun.ChildRequestID != "" {
			switch nodeRun.NodeType {
			case teammodel.NodeTypeAgent, teammodel.NodeTypeRole:
				s.agent.StopTask(nodeRun.ChildRequestID)
			case teammodel.NodeTypePower:
				_ = s.gateway.StopStream(ctx, nodeRun.ChildRequestID)
			}
		}
		s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
			"status":      teammodel.RunStatusCanceled,
			"error":       "运行已取消",
			"finished_at": time.Now(),
		})
	}
	s.writeRunEvent(ctx, *run, stream.EventRunFinished, map[string]any{
		"scope":       "run",
		"finished_at": now.Format(time.RFC3339Nano),
	})
	s.writeRunResult(ctx, *run)
	return map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"status":     teammodel.RunStatusCanceled,
	}, nil
}

func (s Service) RunStatus(ctx context.Context, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveRun(ctx, runID, requestID)
	return s.resolvedRunSnapshot(ctx, run)
}

func (s Service) ProjectRunStatus(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	run := s.resolveProjectRun(ctx, projectID, runID, requestID)
	return s.resolvedRunSnapshot(ctx, run)
}

func (s Service) BodyRunStatus(ctx context.Context, bodyID uint64, runID uint64, requestID string) (map[string]any, error) {
	return s.resolvedRunSnapshot(ctx, s.resolveBodyRun(ctx, bodyID, runID, requestID))
}

func (s Service) RunDetail(ctx context.Context, runID uint64, requestID string) (map[string]any, error) {
	return s.resolvedRunStatus(ctx, s.resolveRun(ctx, runID, requestID))
}

func (s Service) ProjectRunDetail(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	return s.resolvedRunStatus(ctx, s.resolveProjectRun(ctx, projectID, runID, requestID))
}

func (s Service) BodyRunDetail(ctx context.Context, bodyID uint64, runID uint64, requestID string) (map[string]any, error) {
	return s.resolvedRunStatus(ctx, s.resolveBodyRun(ctx, bodyID, runID, requestID))
}

func (s Service) WaitProjectRunStatus(ctx context.Context, projectID uint64, runID uint64, requestID string, timeout time.Duration) (map[string]any, error) {
	run := s.resolveProjectRun(ctx, projectID, runID, requestID)
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	requestID = run.RequestID
	if timeout <= 0 {
		timeout = time.Minute
	}
	deadline := time.Now().Add(timeout)
	lastID := "0-0"
	for {
		run = s.resolveProjectRun(ctx, projectID, run.ID, requestID)
		if run == nil {
			return nil, fmt.Errorf("运行不存在")
		}
		if runReachedBlockingBoundary(run.Status) {
			return s.resolvedRunSnapshot(ctx, run)
		}
		block := remainingRunWait(deadline, 5*time.Second)
		if block <= 0 {
			return resolvedRunState(run)
		}
		entries, err := s.ReadStream(ctx, requestID, lastID, 100, block)
		if err != nil {
			select {
			case <-ctx.Done():
				return resolvedRunState(run)
			case <-time.After(remainingRunWait(deadline, time.Second)):
			}
			continue
		}
		for _, entry := range entries {
			if entry.ID != "" {
				lastID = entry.ID
			}
		}
		select {
		case <-ctx.Done():
			return resolvedRunState(run)
		default:
		}
	}
}

func (s Service) resolvedRunStatus(ctx context.Context, run *teammodel.Run) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	s.recoverRunExecution(run)
	flowRuns := s.repo.ListFlowRuns(ctx, run.ID)
	nodeRuns := s.repo.ListNodeRuns(ctx, run.ID)
	flowNames := s.flowNameMap(ctx, flowRuns, nodeRuns)
	nodeNames := s.nodeNameMap(ctx, nodeRuns)
	interactions := nodeInteractionsToMaps(nodeRuns, flowNames, nodeNames)
	if interaction := runInteractionToMap(*run); len(interaction) > 0 {
		interactions = append(interactions, interaction)
	}
	return map[string]any{
		"view":         runViewDetail,
		"run":          runToMap(*run),
		"flow_runs":    flowRunsToMaps(flowRuns, flowNames),
		"node_runs":    nodeRunsToMaps(nodeRuns, flowNames, nodeNames),
		"interactions": interactions,
		"agent_runs":   s.agent.RunTraces(ctx, agentRunIDs(*run, nodeRuns)),
		"blackboard":   blackboardRowsToMaps(s.repo.ListBlackboardRows(ctx, run.ID)),
		"messages":     messagesToMaps(s.repo.ListMessages(ctx, run.ID)),
		"approvals":    approvalsToMaps(s.repo.ListApprovals(ctx, run.ID)),
	}, nil
}

func (s Service) flowNameMap(ctx context.Context, flowRuns []teammodel.FlowRun, nodeRuns []teammodel.NodeRun) map[uint64]string {
	ids := make([]uint64, 0, len(flowRuns)+len(nodeRuns))
	for _, row := range flowRuns {
		ids = append(ids, row.FlowID)
	}
	for _, row := range nodeRuns {
		ids = append(ids, row.FlowID)
	}
	result := map[uint64]string{}
	for _, flow := range s.repo.ListFlowsByIDs(ctx, ids) {
		result[flow.ID] = flow.Name
	}
	return result
}

func (s Service) nodeNameMap(ctx context.Context, nodeRuns []teammodel.NodeRun) map[uint64]string {
	ids := make([]uint64, 0, len(nodeRuns))
	for _, row := range nodeRuns {
		ids = append(ids, row.NodeID)
	}
	result := map[uint64]string{}
	for _, node := range s.repo.ListFlowNodesByIDs(ctx, ids) {
		result[node.ID] = node.Name
	}
	return result
}

func agentRunIDs(run teammodel.Run, rows []teammodel.NodeRun) []uint64 {
	result := make([]uint64, 0, len(rows)+1)
	if run.AgentRunID > 0 {
		result = append(result, run.AgentRunID)
	}
	for _, row := range rows {
		if row.AgentRunID > 0 {
			result = append(result, row.AgentRunID)
		}
	}
	return result
}

func (s Service) resolveRun(ctx context.Context, runID uint64, requestID string) *teammodel.Run {
	if runID > 0 {
		return s.repo.FindRun(ctx, runID)
	}
	return s.repo.FindRunByRequestID(ctx, requestID)
}

func (s Service) resolveProjectRun(ctx context.Context, projectID uint64, runID uint64, requestID string) *teammodel.Run {
	if projectID == 0 {
		return nil
	}
	if runID > 0 {
		return s.repo.FindRunInProject(ctx, runID, projectID)
	}
	return s.repo.FindRunByRequestIDInProject(ctx, requestID, projectID)
}

func (s Service) resolveBodyRun(ctx context.Context, bodyID uint64, runID uint64, requestID string) *teammodel.Run {
	if bodyID == 0 {
		return nil
	}
	if runID > 0 {
		return s.repo.FindRunInBody(ctx, runID, bodyID)
	}
	return s.repo.FindRunByRequestIDInBody(ctx, requestID, bodyID)
}

func (s Service) executeTeamRun(ctx context.Context, runID uint64) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return
	}
	if run.Status == teammodel.RunStatusCanceled {
		return
	}
	graph, err := s.runtimeGraphForRun(ctx, *run)
	if err != nil {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, err)
		return
	}
	runInput := jsonMap(run.Input)
	input := executionInput(runInput)
	if issues := validateFlowGraph(graph.Flows, graph.FlowEdges); len(issues) > 0 {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, errors.New(strings.Join(issues, "；")))
		return
	}
	status, output, err := s.executeFlowDAG(ctx, *run, graph, input)
	if err != nil {
		s.finishRun(ctx, run.ID, status, output, err)
		return
	}
	s.finishRun(ctx, run.ID, status, output, nil)
}

func (s Service) executeSingleFlowRun(ctx context.Context, runID uint64, flowID uint64, input map[string]any) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return
	}
	if run.Status == teammodel.RunStatusCanceled {
		return
	}
	graph, err := s.runtimeGraphForRun(ctx, *run)
	if err != nil {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, err)
		return
	}
	flow := graph.findFlow(flowID)
	if flow.ID == 0 {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, fmt.Errorf("发布版本中不存在当前工作流"))
		return
	}
	status, output, err := s.executeFlowWithGraph(
		ctx,
		*run,
		graph.Team,
		graph.Roles,
		flow,
		input,
		graph.NodesByFlowID[flow.ID],
		graph.NodeEdgesByFlowID[flow.ID],
	)
	if err != nil {
		s.finishRun(ctx, run.ID, status, output, err)
		return
	}
	s.finishRun(ctx, run.ID, status, output, nil)
}

func (s Service) executeFlowDAG(ctx context.Context, run teammodel.Run, graph runtimeGraph, input map[string]any) (string, map[string]any, error) {
	incoming := map[uint64][]teammodel.FlowEdge{}
	for _, edge := range graph.FlowEdges {
		incoming[edge.ToFlowID] = append(incoming[edge.ToFlowID], edge)
	}
	completed := map[uint64]map[string]any{}
	failed := map[uint64]bool{}
	skipped := map[uint64]bool{}
	for len(completed)+len(failed)+len(skipped) < len(graph.Flows) {
		if s.runCanceled(ctx, run.ID) {
			return teammodel.RunStatusCanceled, completedOutput(completed), fmt.Errorf("运行已取消")
		}
		ready := make([]teammodel.Flow, 0)
		hasWaiting := false
		for _, flow := range graph.Flows {
			if _, ok := completed[flow.ID]; ok {
				continue
			}
			if failed[flow.ID] {
				continue
			}
			if skipped[flow.ID] {
				continue
			}
			flowRunID := s.repo.FindOrCreateFlowRun(ctx, run, flow, input)
			current := s.repo.FindFlowRun(ctx, flowRunID)
			if current != nil && current.Status == teammodel.RunStatusSuccess {
				completed[flow.ID] = jsonMap(current.Output)
				continue
			}
			if current != nil && current.Status == teammodel.RunStatusWaiting {
				hasWaiting = true
				continue
			}
			if flowReady(flow.ID, incoming, completed, skipped) {
				ready = append(ready, flow)
			}
		}
		if len(ready) == 0 {
			if hasWaiting {
				return teammodel.RunStatusWaiting, completedOutput(completed), runWaitError{message: "等待交互"}
			}
			if markSkippedFlows(graph.Flows, incoming, completed, skipped) {
				continue
			}
			return teammodel.RunStatusFail, completedOutput(completed), fmt.Errorf("工作流 DAG 无可执行节点")
		}
		results := s.executeReadyFlows(ctx, run, graph, input, ready, incoming, completed)
		for _, result := range results {
			if result.status == teammodel.RunStatusSuccess {
				completed[result.flowID] = result.output
			}
		}
		for _, result := range results {
			if result.status == teammodel.RunStatusWaiting {
				continue
			}
			if result.err != nil {
				failed[result.flowID] = true
				return result.status, completedOutput(completed), result.err
			}
			if result.status != teammodel.RunStatusSuccess {
				failed[result.flowID] = true
				return result.status, completedOutput(completed), fmt.Errorf("工作流执行失败: %s", result.flowName)
			}
		}
	}
	return teammodel.RunStatusSuccess, completedOutput(completed), nil
}

type flowExecutionResult struct {
	flowID   uint64
	flowName string
	status   string
	output   map[string]any
	err      error
}

func (s Service) executeReadyFlows(ctx context.Context, run teammodel.Run, graph runtimeGraph, input map[string]any, ready []teammodel.Flow, incoming map[uint64][]teammodel.FlowEdge, completed map[uint64]map[string]any) []flowExecutionResult {
	results := make([]flowExecutionResult, len(ready))
	var wg sync.WaitGroup
	for index, flow := range ready {
		index := index
		flow := flow
		flowInput := buildFlowInput(input, incoming[flow.ID], completed)
		wg.Add(1)
		go func() {
			defer wg.Done()
			defer func() {
				if recovered := recover(); recovered != nil {
					results[index] = flowExecutionResult{
						flowID:   flow.ID,
						flowName: flow.Name,
						status:   teammodel.RunStatusFail,
						err:      runtimePanicError(recovered),
					}
				}
			}()
			status, output, err := s.executeFlowWithGraph(
				ctx,
				run,
				graph.Team,
				graph.Roles,
				flow,
				flowInput,
				graph.NodesByFlowID[flow.ID],
				graph.NodeEdgesByFlowID[flow.ID],
			)
			results[index] = flowExecutionResult{
				flowID:   flow.ID,
				flowName: flow.Name,
				status:   status,
				output:   output,
				err:      err,
			}
		}()
	}
	wg.Wait()
	return results
}

func (s Service) runCanceled(ctx context.Context, runID uint64) bool {
	run := s.repo.FindRun(ctx, runID)
	return run != nil && run.Status == teammodel.RunStatusCanceled
}

func (s Service) executeFlowWithGraph(ctx context.Context, run teammodel.Run, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, input map[string]any, nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge) (string, map[string]any, error) {
	flowRunID := s.repo.FindOrCreateFlowRun(ctx, run, flow, input)
	flowRun := s.repo.FindFlowRun(ctx, flowRunID)
	if flowRun == nil {
		return teammodel.RunStatusFail, nil, fmt.Errorf("创建工作流运行失败")
	}
	now := time.Now()
	s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
	})
	flowRun.Status = teammodel.RunStatusRunning
	s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventFlowStarted, map[string]any{
		"input":      input,
		"started_at": now.Format(time.RFC3339Nano),
	})
	executionInput := cloneInput(input)
	for key, value := range executionInput {
		s.writeBlackboard(ctx, run, *flowRun, key, value, "input", 0)
	}

	if issues := validateFlowNodeGraph(nodes, edges); len(issues) > 0 {
		err := errors.New(strings.Join(issues, "；"))
		s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status":      teammodel.RunStatusFail,
			"error":       err.Error(),
			"finished_at": time.Now(),
		})
		flowRun.Status = teammodel.RunStatusFail
		s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventFlowFinished, map[string]any{
			"error": err.Error(),
		})
		return teammodel.RunStatusFail, nil, err
	}

	status, output, err := s.executeNodeDAG(ctx, run, *flowRun, team, roles, flow, nodes, edges)
	if status == teammodel.RunStatusWaiting {
		if !s.repo.UpdateRunUnlessCanceled(ctx, run.ID, map[string]any{
			"status": teammodel.RunStatusWaiting,
		}) {
			return teammodel.RunStatusCanceled, output, context.Canceled
		}
		s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusWaiting,
			"error":  "",
		})
		flowRun.Status = teammodel.RunStatusWaiting
		s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventWaiting, map[string]any{
			"output": output,
			"error":  "",
		})
		return status, output, err
	}
	record := map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"finished_at": time.Now(),
	}
	if err != nil && status != teammodel.RunStatusWaiting {
		record["error"] = err.Error()
	}
	s.repo.UpdateFlowRun(ctx, flowRun.ID, record)
	flowRun.Status = status
	s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventFlowFinished, map[string]any{
		"output":      output,
		"error":       errorText(err),
		"finished_at": time.Now().Format(time.RFC3339Nano),
	})
	return status, output, err
}

func (s Service) finishRun(ctx context.Context, runID uint64, status string, output map[string]any, err error) {
	record := map[string]any{
		"status": status,
		"output": jsonText(output),
	}
	if status != teammodel.RunStatusWaiting {
		record["finished_at"] = time.Now()
	}
	if err != nil {
		record["error"] = err.Error()
	}
	if !s.repo.UpdateRunUnlessCanceled(ctx, runID, record) {
		return
	}
	if run := s.repo.FindRun(ctx, runID); run != nil {
		run.Status = status
		event := stream.EventRunFinished
		if status == teammodel.RunStatusWaiting {
			event = stream.EventWaiting
		}
		s.writeRunEvent(ctx, *run, event, map[string]any{
			"scope":  "run",
			"output": output,
			"error":  nodeExecutionError(status, err),
		})
		s.writeRunResult(ctx, *run)
	}
}

func (s Service) writeRunResult(ctx context.Context, run teammodel.Run) {
	if run.RequestID == "" {
		return
	}
	output, err := s.resolvedRunSnapshot(ctx, &run)
	if firstText(jsonMap(run.Input)["_mode"]) == "workspace_power" {
		output = jsonMap(run.Output)
	}
	status := 1
	msg := ""
	if err != nil {
		status = 2
		msg = err.Error()
		output = map[string]any{}
	} else if run.Status == teammodel.RunStatusFail {
		status = 2
		msg = run.Error
	}
	_ = stream.WriteResult(ctx, s.streams, run.RequestID, output, msg, status)
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

func flowReady(flowID uint64, incoming map[uint64][]teammodel.FlowEdge, completed map[uint64]map[string]any, skipped map[uint64]bool) bool {
	edges := incoming[flowID]
	if len(edges) == 0 {
		return true
	}
	hasCompletedInput := false
	for _, edge := range edges {
		if skipped[edge.FromFlowID] {
			continue
		}
		output, ok := completed[edge.FromFlowID]
		if !ok {
			return false
		}
		if !flowEdgeConditionPassed(edge.Condition, output) {
			return false
		}
		hasCompletedInput = true
	}
	return hasCompletedInput
}

func markSkippedFlows(flows []teammodel.Flow, incoming map[uint64][]teammodel.FlowEdge, completed map[uint64]map[string]any, skipped map[uint64]bool) bool {
	marked := false
	for _, flow := range flows {
		if _, ok := completed[flow.ID]; ok {
			continue
		}
		if skipped[flow.ID] {
			continue
		}
		edges := incoming[flow.ID]
		if len(edges) == 0 {
			continue
		}
		resolved := true
		for _, edge := range edges {
			if _, ok := completed[edge.FromFlowID]; !ok && !skipped[edge.FromFlowID] {
				resolved = false
				break
			}
		}
		if resolved && !flowReady(flow.ID, incoming, completed, skipped) {
			skipped[flow.ID] = true
			marked = true
		}
	}
	return marked
}

func flowEdgeConditionPassed(condition string, output map[string]any) bool {
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

func buildFlowInput(root map[string]any, incoming []teammodel.FlowEdge, completed map[uint64]map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range root {
		result[key] = value
	}
	if len(result) == 0 {
		result["user_input"] = root
	}
	for _, edge := range incoming {
		output, ok := completed[edge.FromFlowID]
		if !ok {
			continue
		}
		result[fmt.Sprintf("flow_%d", edge.FromFlowID)] = output
	}
	return result
}

func completedOutput(completed map[uint64]map[string]any) map[string]any {
	result := map[string]any{}
	for flowID, output := range completed {
		result[fmt.Sprintf("flow_%d", flowID)] = output
	}
	return result
}
