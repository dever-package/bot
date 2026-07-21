package project

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	teamservice "github.com/dever-package/bot/service/team"
)

type CanvasRunRequest struct {
	ProjectID   uint64
	AssetCateID uint64
	StartNodeID string
	RequestID   string
	SingleNode  bool
	Canvas      map[string]any
	Input       map[string]any
}

type canvasRunNode struct {
	ID               string
	Type             string
	Title            string
	StoryboardTitle  string
	GroupTitle       string
	Kind             string
	OutputType       string
	GroupID          string
	AssetCateID      uint64
	FunctionKey      string
	FlowID           uint64
	PowerID          uint64
	PowerKey         string
	PowerKind        string
	AgentID          uint64
	RoleID           uint64
	Asset            map[string]any
	AssetID          uint64
	AssetVersionID   uint64
	ComposerPrompt   string
	VideoComposition map[string]any
	StoryboardItem   map[string]any
	SelectedTarget   uint64
	ParamValues      map[string]any
	PersistsResult   bool
}

type canvasRunEdge struct {
	ID   string
	From string
	To   string
}

type canvasNodeResult struct {
	NodeKey string
	Payload map[string]any
}

type canvasExecutionPlan struct {
	Start    canvasRunNode
	Nodes    []canvasRunNode
	Edges    []canvasRunEdge
	Incoming map[string][]string
	Outgoing map[string][]string
	Order    []string
}

func (s WorkspaceService) RunCanvas(ctx context.Context, req CanvasRunRequest) (map[string]any, error) {
	if req.ProjectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	if strings.TrimSpace(req.StartNodeID) == "" {
		return nil, fmt.Errorf("开始节点不能为空")
	}
	project, err := requireProject(ctx, req.ProjectID)
	if err != nil {
		return nil, err
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID != "" {
		return withWorkspaceAssetLock(ctx, project.ID, []string{"canvas_execute", requestID}, func() (map[string]any, error) {
			return s.runCanvasWithProject(ctx, req, project.ID, project.TeamID, project.ReleaseID, requestID)
		})
	}
	return s.runCanvasWithProject(ctx, req, project.ID, project.TeamID, project.ReleaseID, requestID)
}

func (s WorkspaceService) runCanvasWithProject(ctx context.Context, req CanvasRunRequest, projectID uint64, teamID uint64, releaseID uint64, requestID string) (map[string]any, error) {
	if existing := findWorkspaceRunByRequestID(ctx, projectID, requestID); existing != nil {
		if execution := workspaceExecutionByRunID(ctx, existing.ID); execution != nil {
			return workspaceExecutionPayload(ctx, execution), nil
		}
		return s.workspaceRunPayload(ctx, projectID, existing), nil
	}
	nodes, edges, err := parseCanvasRunGraph(req.Canvas)
	if err != nil {
		return nil, err
	}
	nodesByID := canvasRunNodeMap(nodes)
	if err := validateCanvasGroups(nodesByID, edges); err != nil {
		return nil, err
	}
	if err := validateCanvasRunGraph(nodesByID, edges); err != nil {
		return nil, err
	}
	startNode, ok := nodesByID[strings.TrimSpace(req.StartNodeID)]
	if !ok {
		return nil, fmt.Errorf("开始节点不存在")
	}
	if !req.SingleNode && !isCanvasStartNode(startNode) {
		return nil, fmt.Errorf("请选择开始节点运行")
	}
	if err := validateReachableCanvasGroups(nodesByID, edges, req.StartNodeID, req.SingleNode); err != nil {
		return nil, err
	}
	req.Canvas, edges = prepareCanvasRunGraph(
		req.Canvas,
		nodesByID,
		edges,
		req.StartNodeID,
		req.SingleNode,
	)
	if err := validateCanvasRunGraph(nodesByID, edges); err != nil {
		return nil, err
	}
	plan := buildCanvasRunExecutionPlan(req.StartNodeID, nodesByID, edges, req.SingleNode)
	if req.SingleNode && startNode.Type == "group" && len(filterRunnableCanvasNodes(plan.Nodes)) == 0 {
		return nil, fmt.Errorf("分组内暂无可运行节点")
	}
	if !req.SingleNode && len(plan.Nodes) == 0 {
		return nil, fmt.Errorf("开始节点没有连接后续节点")
	}
	if !req.SingleNode || startNode.Type == "group" {
		if err := validateCanvasExecutionPlan(plan); err != nil {
			return nil, err
		}
	}
	run, err := createWorkspaceRun(ctx, projectID, teamID, releaseID, requestID, req, canvasRunPlan(plan))
	if err != nil {
		return nil, err
	}
	req.RequestID = run.RequestID
	flowRunID, nodeRuns, err := createWorkspaceCanvasRuns(ctx, projectID, teamID, run.ID, run.RequestID, req, plan)
	if err != nil {
		finishWorkspaceRun(ctx, run.ID, teammodel.RunStatusFail, map[string]any{
			"run_id":     run.ID,
			"request_id": run.RequestID,
			"status":     teammodel.RunStatusFail,
			"error":      err.Error(),
		}, err.Error())
		return nil, err
	}
	executionID := createWorkspaceExecution(ctx, workspaceExecutionCreate{
		ProjectID:   projectID,
		AssetCateID: req.AssetCateID,
		TeamID:      teamID,
		ReleaseID:   releaseID,
		RunID:       run.ID,
		FlowRunID:   flowRunID,
		RequestID:   run.RequestID,
		StartNodeID: req.StartNodeID,
		SingleNode:  req.SingleNode,
		Status:      teammodel.RunStatusRunning,
		Input:       map[string]any{"input": cloneInput(req.Input), "canvas": req.Canvas},
		Plan:        canvasRunPlan(plan),
		Total:       len(filterRunnableCanvasNodes(plan.Nodes)),
	})
	if executionID == 0 {
		err := fmt.Errorf("创建画布执行失败")
		finishWorkspaceRun(ctx, run.ID, teammodel.RunStatusFail, map[string]any{
			"run_id":     run.ID,
			"request_id": run.RequestID,
			"status":     teammodel.RunStatusFail,
			"error":      err.Error(),
		}, err.Error())
		return nil, err
	}
	go s.executeCanvasRunAsync(detachedWorkspaceContext(ctx), req, run.ID, plan, flowRunID, nodeRuns)
	if execution := workspaceExecutionByRunID(ctx, run.ID); execution != nil {
		return workspaceExecutionPayload(ctx, execution), nil
	}
	return s.workspaceRunPayload(ctx, projectID, run), nil
}

func (s WorkspaceService) executeCanvasRun(ctx context.Context, req CanvasRunRequest, run *teammodel.Run, plan canvasExecutionPlan, flowRunID uint64, nodeRuns map[string]uint64) (map[string]any, error) {
	runnableNodes := filterRunnableCanvasNodes(plan.Nodes)
	return s.executeCanvasRunnableNodes(ctx, req, run, plan, runnableNodes, flowRunID, nodeRuns, nil)
}

func (s WorkspaceService) executeCanvasRunAsync(ctx context.Context, req CanvasRunRequest, runID uint64, plan canvasExecutionPlan, flowRunID uint64, nodeRuns map[string]uint64) {
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if run == nil {
		return
	}
	result, err := withWorkspaceRunLock(ctx, run.ProjectID, run.ID, func() (map[string]any, error) {
		return s.executeCanvasRun(ctx, req, run, plan, flowRunID, nodeRuns)
	})
	if err != nil {
		output := map[string]any{
			"run_id":     run.ID,
			"request_id": run.RequestID,
			"status":     teammodel.RunStatusFail,
			"error":      err.Error(),
		}
		finishWorkspaceRun(ctx, run.ID, teammodel.RunStatusFail, output, err.Error())
		s.writeWorkspaceRunResult(ctx, run, output, err.Error(), 2)
		return
	}
	switch canvasRunStatus(result) {
	case teammodel.RunStatusRunning:
		go s.watchWorkspaceRun(detachedWorkspaceContext(ctx), run.ID, 0)
	case teammodel.RunStatusWaiting:
		updateWorkspaceExecutionStatus(ctx, run.ID, teammodel.RunStatusWaiting, "")
	}
}

func (s WorkspaceService) executeCanvasRunnableNodes(ctx context.Context, req CanvasRunRequest, run *teammodel.Run, plan canvasExecutionPlan, runnableNodes []canvasRunNode, flowRunID uint64, nodeRuns map[string]uint64, existingResults []canvasNodeResult) (map[string]any, error) {
	if plan.Start.Type == "group" {
		return s.executeCanvasGroupRunnableNodes(ctx, req, run, plan, runnableNodes, flowRunID, nodeRuns, existingResults)
	}
	if len(runnableNodes) == 0 {
		return s.finishCanvasRunnableNodes(ctx, req, run, plan, teammodel.RunStatusSuccess, nil, existingResults, flowRunID), nil
	}

	results := make([]canvasNodeResult, 0, len(existingResults)+len(runnableNodes))
	results = append(results, existingResults...)
	status := "success"
	var lastPayload map[string]any
	executedGroups := map[string]bool{}
	if len(results) > 0 {
		lastPayload = results[len(results)-1].Payload
	}
	for _, node := range runnableNodes {
		if node.GroupID != "" {
			if executedGroups[node.GroupID] {
				continue
			}
			executedGroups[node.GroupID] = true
			batch := s.executeCanvasGroupNodeBatch(
				ctx,
				req,
				run,
				plan,
				canvasRunnableNodesInGroup(runnableNodes, node.GroupID),
				flowRunID,
				nodeRuns,
				results,
			)
			results = batch.Results
			lastPayload = batch.LastPayload
			status = batch.Status
			if canvasRunShouldStop(status) {
				break
			}
			continue
		}
		execution := s.executeCanvasRunnableNode(ctx, req, run, plan, node, flowRunID, nodeRuns[node.ID], results)
		lastPayload = execution.Payload
		results = append(results, canvasNodeResult{
			NodeKey: node.ID,
			Payload: execution.Payload,
		})
		status = execution.Status
		if execution.Err != nil {
			break
		}
		if canvasRunShouldStop(status) {
			break
		}
	}
	return s.finishCanvasRunnableNodes(ctx, req, run, plan, status, lastPayload, results, flowRunID), nil
}

func (s WorkspaceService) finishCanvasRunnableNodes(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	plan canvasExecutionPlan,
	status string,
	lastPayload map[string]any,
	results []canvasNodeResult,
	flowRunID uint64,
) map[string]any {
	if workspaceRunCanceled(ctx, run.ID) {
		status = teammodel.RunStatusCanceled
		lastPayload = map[string]any{
			"run_id":     run.ID,
			"request_id": run.RequestID,
			"status":     teammodel.RunStatusCanceled,
		}
	}
	summary := canvasRunSummary(req, status, run, lastPayload, results, canvasRunPlan(plan), flowRunID)
	if plan.Start.Type == "group" {
		summary["output"] = canvasGroupRunOutput(plan, results)
	}
	summary["node_runs"] = workspaceNodeRunPayloads(ctx, run.ID)
	errorText := textValue(valueAtPath(lastPayload, "error"))
	finishWorkspaceRun(ctx, run.ID, status, summary, errorText)
	finishWorkspaceFlowRun(ctx, flowRunID, status, summary, errorText)
	resultStatus := 1
	if status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled {
		resultStatus = 2
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending {
		s.writeWorkspaceRunResult(ctx, run, summary, errorText, resultStatus)
	}
	return summary
}

type canvasRunnableNodeResult struct {
	Node    canvasRunNode
	Payload map[string]any
	Status  string
	Err     error
}

func (s WorkspaceService) executeCanvasRunnableNode(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	plan canvasExecutionPlan,
	node canvasRunNode,
	flowRunID uint64,
	nodeRunID uint64,
	results []canvasNodeResult,
) canvasRunnableNodeResult {
	if workspaceRunCanceled(ctx, run.ID) {
		return s.canceledCanvasRunnableNodeResult(ctx, req, run, node, nodeRunID)
	}
	inputContext, _, _ := canvasNodePreviousOutput(ctx, run.ProjectID, req, node.ID, results)
	markWorkspaceNodeRun(ctx, nodeRunID, teammodel.RunStatusRunning, map[string]any{
		"input":            req.Input,
		"node":             canvasRunNodeInput(node),
		"previous_output":  inputContext,
		"execution_plan":   canvasRunPlan(plan),
		"workspace_run_id": run.ID,
	}, nil, "", 0)
	recordWorkspaceNodeExecution(ctx, workspaceNodeExecution{
		ExecutionID:    workspaceExecutionIDByRunID(ctx, run.ID),
		ProjectID:      run.ProjectID,
		AssetCateID:    firstUint64(node.AssetCateID, req.AssetCateID),
		RunID:          run.ID,
		FlowRunID:      flowRunID,
		NodeRunID:      nodeRunID,
		RequestID:      run.RequestID,
		NodeKey:        node.ID,
		NodeType:       node.Type,
		FunctionKey:    node.FunctionKey,
		ChildRequestID: canvasChildRequestID(run.RequestID, node.ID),
		Status:         teammodel.RunStatusRunning,
		Input:          map[string]any{"input": req.Input, "node": canvasRunNodeInput(node), "previous_output": inputContext},
		StartedAt:      time.Now(),
	})
	s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_started", teammodel.RunStatusRunning, nil)
	if workspaceRunCanceled(ctx, run.ID) {
		return s.canceledCanvasRunnableNodeResult(ctx, req, run, node, nodeRunID)
	}
	payload, runErr := s.runCanvasNode(ctx, run.ProjectID, req, run, node, nodeRunID, results)
	if workspaceRunCanceled(ctx, run.ID) {
		return s.canceledCanvasRunnableNodeResult(ctx, req, run, node, nodeRunID)
	}
	if payload == nil {
		payload = map[string]any{}
	}
	status := canvasRunStatus(payload)
	if runErr != nil {
		status = teammodel.RunStatusFail
		payload["error"] = runErr.Error()
		s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, status, payload, runErr)
		s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", status, payload)
		return canvasRunnableNodeResult{Node: node, Payload: payload, Status: status, Err: runErr}
	}
	s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, status, payload, nil)
	if status == teammodel.RunStatusWaiting {
		s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "waiting", status, payload)
	} else if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending {
		s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", status, payload)
	}
	return canvasRunnableNodeResult{Node: node, Payload: payload, Status: status}
}

func (s WorkspaceService) canceledCanvasRunnableNodeResult(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	node canvasRunNode,
	nodeRunID uint64,
) canvasRunnableNodeResult {
	payload := canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
		"status": teammodel.RunStatusCanceled,
	})
	s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, teammodel.RunStatusCanceled, payload, nil)
	s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", teammodel.RunStatusCanceled, payload)
	return canvasRunnableNodeResult{
		Node:    node,
		Payload: payload,
		Status:  teammodel.RunStatusCanceled,
	}
}

func (s WorkspaceService) recordCanvasNodeRunResult(ctx context.Context, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, status string, payload map[string]any, runErr error) {
	executionStatus := status
	if runErr != nil {
		executionStatus = teammodel.RunStatusFail
	}
	errorText := ""
	if runErr != nil {
		errorText = runErr.Error()
	}
	nodeRun := firstCanvasNodeResult(payload)
	if nodeRunID > 0 {
		nodeRun["node_run_id"] = nodeRunID
	}
	markWorkspaceNodeRun(ctx, nodeRunID, executionStatus, nil, payload, errorText, uint64Value(nodeRun["agent_run_id"]))
	assetID, versionID := nodeExecutionAssetRefs(payload)
	approval := canvasPayloadApproval(payload)
	nodeExecution := workspaceNodeExecution{
		ExecutionID:    workspaceExecutionIDByRunID(ctx, run.ID),
		ProjectID:      run.ProjectID,
		AssetCateID:    firstUint64(node.AssetCateID, req.AssetCateID),
		RunID:          run.ID,
		FlowRunID:      firstUint64(uint64Value(payload["flow_run_id"]), workspaceFlowRunID(ctx, run.ID)),
		NodeRunID:      nodeRunID,
		AgentRunID:     uint64Value(nodeRun["agent_run_id"]),
		RequestID:      run.RequestID,
		NodeKey:        node.ID,
		NodeType:       node.Type,
		FunctionKey:    node.FunctionKey,
		Status:         executionStatus,
		Input:          map[string]any{"input": req.Input, "node": canvasRunNodeInput(node)},
		Output:         payload,
		Error:          errorText,
		AssetID:        assetID,
		VersionID:      versionID,
		ChildRunID:     uint64Value(firstPresent(payload["child_run_id"], nodeRun["child_run_id"])),
		ChildRequestID: firstText(payload["child_request_id"], nodeRun["child_request_id"]),
		ApprovalID:     uint64Value(firstPresent(valueAtPath(approval, "id"), payload["approval_id"], nodeRun["approval_id"], valueAtPath(nodeRun, "approval", "id"))),
	}
	if executionStatus != teammodel.RunStatusRunning && executionStatus != teammodel.RunStatusPending {
		nodeExecution.FinishedAt = time.Now()
	}
	recordWorkspaceNodeExecution(ctx, nodeExecution)
	if node.Type == "agent" && node.AgentID > 0 && executionStatus == teammodel.RunStatusSuccess {
		appendWorkspaceAgentMemory(ctx, workspaceAgentMemoryEntry{
			ProjectID:   run.ProjectID,
			AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
			AgentID:     node.AgentID,
			NodeKey:     node.ID,
			Role:        "assistant",
			Content:     firstPresent(nodeRun["output"], payload["output"], payload),
			RunID:       run.ID,
			NodeRunID:   nodeRunID,
			AgentRunID:  uint64Value(nodeRun["agent_run_id"]),
		})
	}
}

func (s WorkspaceService) runCanvasNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, results []canvasNodeResult) (map[string]any, error) {
	previousOutput, mediaReferences, err := canvasNodePreviousOutput(ctx, projectID, req, node.ID, results)
	if err != nil {
		return nil, err
	}
	switch node.Type {
	case "asset":
		return canvasAssetRunPayload(ctx, projectID, req, run, node, nodeRunID), nil
	case "power":
		return s.runCanvasPowerNode(ctx, projectID, req, run, node, nodeRunID, previousOutput, mediaReferences)
	case "agent":
		return s.runCanvasAgentNode(ctx, projectID, req, run, node, nodeRunID, previousOutput, mediaReferences)
	case "flow":
		return s.runCanvasFlowNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	case "function":
		return s.runCanvasFunctionNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	default:
		return nil, fmt.Errorf("节点类型不支持执行")
	}
}

func (s WorkspaceService) runCanvasPowerNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any, mediaReferences []energoninput.MediaReference) (map[string]any, error) {
	if node.PowerID == 0 && node.PowerKey == "" {
		return nil, fmt.Errorf("能力节点未配置能力")
	}
	input := mergeCanvasPromptInput(req.Input, previousOutput, node.ComposerPrompt)
	params := cloneInput(node.ParamValues)
	outputType := energonmodel.NormalizeOutputType(node.OutputType)
	if outputType == energonmodel.OutputTypeLipSync {
		var err error
		input, params, err = prepareCanvasLipSyncInput(
			ctx,
			projectID,
			req,
			node,
			previousOutput,
			input,
			params,
		)
		if err != nil {
			return nil, err
		}
	}
	if outputType == energonmodel.OutputTypeVideoCompose {
		composition, err := resolveCanvasVideoComposition(ctx, projectID, node.VideoComposition)
		if err != nil {
			return nil, err
		}
		params["composition"] = composition
		if len(sliceValue(params["videos"])) == 0 {
			params["videos"] = canvasVideoCompositionURLs(composition)
		}
	}
	if canvasContextText(input["prompt"]) != "" && canvasContextText(params["prompt"]) == "" {
		delete(params, "prompt")
	}
	result, err := s.project.RunCanvasPower(ctx, projectID, teamservice.CanvasPowerRunRequest{
		FlowID:          node.FlowID,
		AssetCateID:     firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:         node.ID,
		NodeName:        node.Title,
		Kind:            node.Kind,
		PowerID:         node.PowerID,
		PowerKey:        node.PowerKey,
		SourceTargetID:  node.SelectedTarget,
		RequestID:       canvasChildRequestID(req.RequestID, node.ID),
		Input:           input,
		Params:          params,
		MediaReferences: mediaReferences,
		OnStream: func(payload map[string]any) {
			s.forwardWorkspaceNodeStream(ctx, run, node, nodeRunID, payload)
		},
	})
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	result, err = s.saveWorkspaceCanvasMaterial(ctx, projectID, req, run, node, nodeRunID, result)
	return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
}

func (s WorkspaceService) runCanvasAgentNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any, mediaReferences []energoninput.MediaReference) (map[string]any, error) {
	if node.AgentID == 0 {
		return nil, fmt.Errorf("智能体节点未配置智能体")
	}
	input := mergeCanvasChatInput(req.Input, previousOutput, node.ComposerPrompt)
	delete(input, "workspace_agent_history")
	applyCanvasAgentTurnInput(input, req.Input)
	if node.RoleID > 0 {
		input["role_id"] = node.RoleID
	}
	assetCateID := firstUint64(node.AssetCateID, req.AssetCateID)
	history := workspaceAgentHistory(ctx, projectID, assetCateID, node.ID, node.AgentID)
	result, err := s.project.RunCanvasAgent(ctx, projectID, CanvasAgentRunRequest{
		FlowID:          node.FlowID,
		AssetCateID:     assetCateID,
		NodeKey:         node.ID,
		NodeName:        node.Title,
		RoleID:          node.RoleID,
		AgentID:         node.AgentID,
		RequestID:       canvasChildRequestID(req.RequestID, node.ID),
		Input:           input,
		MediaReferences: mediaReferences,
		History:         history,
		OnStream: func(payload map[string]any) {
			s.forwardWorkspaceNodeStream(ctx, run, node, nodeRunID, payload)
		},
	})
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	agentRunID := uint64Value(result["run_id"])
	result["agent_run_id"] = agentRunID
	result, err = s.saveWorkspaceCanvasMaterial(ctx, projectID, req, run, node, nodeRunID, result)
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	if canvasRunStatus(result) == teammodel.RunStatusCanceled {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), nil
	}
	appendWorkspaceAgentMemory(ctx, workspaceAgentMemoryEntry{
		ProjectID:   projectID,
		AssetCateID: assetCateID,
		AgentID:     node.AgentID,
		NodeKey:     node.ID,
		Role:        "user",
		Content:     workspaceAgentUserInput(input),
		RunID:       run.ID,
		NodeRunID:   nodeRunID,
		AgentRunID:  agentRunID,
	})
	return canvasNodeRunPayload(req, run, node, nodeRunID, result), nil
}

func applyCanvasAgentTurnInput(input map[string]any, base map[string]any) {
	turn := mapValue(base["_agent_turn_input"])
	delete(input, "_agent_turn_input")
	if len(turn) == 0 {
		return
	}
	for key, value := range turn {
		input[key] = value
	}
	if content := mapValue(turn["content"]); content != nil {
		if response := mapValue(content["interaction_response"]); response != nil {
			input["interaction_response"] = response
		}
		delete(input, "content")
	}
}

func (s WorkspaceService) runCanvasFlowNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any) (map[string]any, error) {
	if node.FlowID == 0 {
		return nil, fmt.Errorf("流程节点未配置流程")
	}
	result, err := s.project.RunFlow(ctx, projectID, teamservice.RunRequest{
		FlowID:    node.FlowID,
		RequestID: canvasChildRequestID(req.RequestID, node.ID),
		Input:     mergeCanvasPromptInput(req.Input, previousOutput, node.ComposerPrompt),
		Mode:      "flow",
	})
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	result = s.waitCanvasFlowNodeResult(ctx, projectID, req, run, node, nodeRunID, result)
	if canvasRunStatus(result) == teammodel.RunStatusSuccess {
		var saveErr error
		result, saveErr = s.saveWorkspaceCanvasMaterial(ctx, projectID, req, run, node, nodeRunID, result)
		if saveErr != nil {
			return canvasNodeRunPayload(req, run, node, nodeRunID, result), saveErr
		}
	}
	return canvasNodeRunPayload(req, run, node, nodeRunID, result), nil
}

func (s WorkspaceService) waitCanvasFlowNodeResult(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, started map[string]any) map[string]any {
	requestID := firstText(started["request_id"], canvasChildRequestID(req.RequestID, node.ID))
	runID := uint64Value(started["run_id"])
	if requestID == "" && runID == 0 {
		return started
	}
	const attempts = 120
	const interval = 500 * time.Millisecond
	for attempt := 0; attempt < attempts; attempt++ {
		status, err := s.project.RunStatus(ctx, projectID, runID, requestID)
		if err != nil {
			break
		}
		childRun := mapValue(status["run"])
		runStatus := textValue(childRun["status"])
		switch runStatus {
		case teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled, teammodel.RunStatusWaiting:
			return s.canvasFlowStatusPayload(ctx, projectID, req, run, node, nodeRunID, status, runStatus)
		}
		select {
		case <-ctx.Done():
			return started
		case <-time.After(interval):
		}
	}
	return started
}

func (s WorkspaceService) canvasFlowStatusPayload(ctx context.Context, projectID uint64, req CanvasRunRequest, parentRun *teammodel.Run, node canvasRunNode, parentNodeRunID uint64, status map[string]any, runStatus string) map[string]any {
	run := mapValue(status["run"])
	nodeRun := latestWorkspaceChildNodeRun(status)
	output := firstPresent(valueAtPath(run, "output"), status)
	asset, version := latestWorkspaceChildAsset(ctx, projectID, uint64Value(nodeRun["id"]))
	runID := uint64Value(run["id"])
	requestID := firstText(run["request_id"], canvasChildRequestID(req.RequestID, node.ID))
	releaseID := uint64Value(run["release_id"])
	nodeResult := map[string]any{
		"node_key":         node.ID,
		"node_type":        node.Type,
		"node_run_id":      firstUint64(parentNodeRunID, uint64Value(nodeRun["id"])),
		"run_id":           firstUint64(parentRunID(parentRun), runID),
		"child_run_id":     runID,
		"child_request_id": requestID,
		"request_id":       requestID,
		"release_id":       firstUint64(parentReleaseID(parentRun), releaseID),
		"status":           runStatus,
		"output":           output,
		"asset":            asset,
		"version":          version,
		"result": map[string]any{
			"output":       output,
			"status":       runStatus,
			"run_id":       runID,
			"child_run_id": runID,
			"request_id":   requestID,
			"release_id":   releaseID,
		},
		"persists_result": asset != nil || version != nil,
		"agent_run_id":    uint64Value(nodeRun["agent_run_id"]),
	}
	if approval := pendingWorkspaceApproval(status, uint64Value(nodeRun["id"])); approval != nil {
		nodeResult["approval"] = approval
		nodeResult["result"] = map[string]any{
			"output":       output,
			"status":       runStatus,
			"run_id":       runID,
			"child_run_id": runID,
			"request_id":   requestID,
			"release_id":   releaseID,
			"approval":     approval,
		}
	}
	if interaction := pendingWorkspaceInteraction(status, uint64Value(nodeRun["id"])); interaction != nil {
		nodeResult["interaction"] = interaction
		nodeResult["result"] = mergeMap(mapValue(nodeResult["result"]), map[string]any{
			"interaction": interaction,
		})
	}
	return map[string]any{
		"run_id":           firstUint64(parentRunID(parentRun), runID),
		"request_id":       firstText(parentRequestID(parentRun), requestID),
		"release_id":       firstUint64(parentReleaseID(parentRun), releaseID),
		"child_run_id":     uint64Value(run["id"]),
		"child_request_id": requestID,
		"status":           runStatus,
		"output":           output,
		"node_results":     []map[string]any{nodeResult},
	}
}

func (s WorkspaceService) runCanvasFunctionNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any) (map[string]any, error) {
	switch node.FunctionKey {
	case "display":
		if previousOutput == nil {
			return nil, fmt.Errorf("展示节点没有可展示的上游结果")
		}
		return canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
			"status": "success",
			"output": previousOutput,
			"result": map[string]any{"output": previousOutput},
		}), nil
	case "save":
		if previousOutput == nil {
			return nil, fmt.Errorf("保存节点没有可保存的上游结果")
		}
		if workspaceRunCanceled(ctx, run.ID) {
			return canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
				"status": teammodel.RunStatusCanceled,
			}), nil
		}
		assetCateID := firstUint64(node.AssetCateID, req.AssetCateID)
		if assetCateID == 0 {
			return canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
				"status": "success",
				"output": previousOutput,
				"result": map[string]any{"output": previousOutput},
			}), nil
		}
		result, err := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
			AssetCateID: assetCateID,
			FlowID:      node.FlowID,
			RunID:       run.ID,
			NodeRunID:   nodeRunID,
			ReleaseID:   run.ReleaseID,
			RequestID:   run.RequestID,
			NodeKey:     node.ID,
			Source: map[string]any{
				"source_request_id": run.RequestID,
				"source_node_key":   node.ID,
				"source_node_type":  node.Type,
				"source_status":     "success",
			},
			Name:    workspaceCanvasAssetName(node),
			Kind:    firstText(node.Kind, assetmodel.KindRichText),
			Role:    assetmodel.RoleWork,
			Content: previousOutput,
		})
		if err != nil {
			return nil, err
		}
		asset := mapValue(result["asset"])
		return canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
			"status":  "success",
			"output":  firstPresent(valueAtPath(asset, "version", "content"), previousOutput),
			"asset":   asset,
			"version": mapValue(asset["version"]),
			"result": map[string]any{
				"output": firstPresent(valueAtPath(asset, "version", "content"), previousOutput),
				"asset":  asset,
			},
		}), nil
	default:
		return nil, fmt.Errorf("当前功能节点不支持自动执行")
	}
}

func parseCanvasRunGraph(canvas map[string]any) ([]canvasRunNode, []canvasRunEdge, error) {
	nodesRaw, _ := canvas["nodes"].([]any)
	edgesRaw, _ := canvas["edges"].([]any)
	nodes := make([]canvasRunNode, 0, len(nodesRaw))
	for _, raw := range nodesRaw {
		row := mapValue(raw)
		node := canvasRunNode{
			ID:               textValue(row["id"]),
			Type:             textValue(row["type"]),
			Title:            textValue(row["title"]),
			Kind:             textValue(row["kind"]),
			OutputType:       textValue(row["output_type"]),
			GroupID:          textValue(row["group_id"]),
			AssetCateID:      uint64Value(row["asset_cate_id"]),
			FunctionKey:      textValue(valueAtPath(row, "function_option", "key")),
			FlowID:           uint64Value(valueAtPath(row, "flow", "id")),
			PowerID:          uint64Value(valueAtPath(row, "power", "id")),
			PowerKey:         textValue(valueAtPath(row, "power", "key")),
			PowerKind:        textValue(valueAtPath(row, "power", "kind")),
			AgentID:          uint64Value(valueAtPath(row, "role", "agent_id")),
			RoleID:           uint64Value(valueAtPath(row, "role", "id")),
			Asset:            mapValue(row["asset"]),
			AssetID:          uint64Value(valueAtPath(row, "asset", "id")),
			AssetVersionID:   uint64Value(valueAtPath(row, "asset", "version_id")),
			ComposerPrompt:   textValue(valueAtPath(row, "composer_draft", "prompt")),
			VideoComposition: mapValue(valueAtPath(row, "composer_draft", "video_composition")),
			StoryboardItem:   mapValue(firstPresent(row["storyboard_item"], row["storyboardItem"])),
			SelectedTarget:   uint64Value(valueAtPath(row, "composer_draft", "selected_target_id")),
			ParamValues:      mapValue(valueAtPath(row, "composer_draft", "param_values")),
		}
		if node.Type == "power" && node.PowerKind != "" {
			node.Kind = node.PowerKind
		}
		node.PersistsResult = canvasRunNodePersistsResult(node.Type, node.FunctionKey)
		if node.ID == "" || node.Type == "" {
			return nil, nil, fmt.Errorf("画布节点格式错误")
		}
		nodes = append(nodes, node)
	}
	enrichCanvasRunNodeContext(nodes)
	edges := make([]canvasRunEdge, 0, len(edgesRaw))
	for _, raw := range edgesRaw {
		row := mapValue(raw)
		if !canvasEdgeRuns(row) {
			continue
		}
		edge := canvasRunEdge{
			ID:   textValue(row["id"]),
			From: textValue(firstPresent(row["from"], row["source"])),
			To:   textValue(firstPresent(row["to"], row["target"])),
		}
		if edge.From != "" && edge.To != "" {
			edges = append(edges, edge)
		}
	}
	return nodes, edges, nil
}

func enrichCanvasRunNodeContext(nodes []canvasRunNode) {
	nodesByID := canvasRunNodeMap(nodes)
	for index := range nodes {
		node := &nodes[index]
		if group := nodesByID[strings.TrimSpace(node.GroupID)]; group.ID != "" {
			node.GroupTitle = canvasRunNodeTitle(group)
		}
		sourceNodeID := firstText(
			node.StoryboardItem["source_node_id"],
			node.StoryboardItem["sourceNodeId"],
		)
		if storyboard := nodesByID[sourceNodeID]; storyboard.ID != "" {
			node.StoryboardTitle = canvasRunNodeTitle(storyboard)
		}
	}
}

func filterRunnableCanvasNodes(nodes []canvasRunNode) []canvasRunNode {
	result := make([]canvasRunNode, 0, len(nodes))
	for _, node := range nodes {
		if isRunnableCanvasNode(node) {
			result = append(result, node)
		}
	}
	return result
}

func isRunnableCanvasNode(node canvasRunNode) bool {
	switch node.Type {
	case "power":
		return node.PowerID > 0 || strings.TrimSpace(node.PowerKey) != ""
	case "asset", "agent", "flow":
		return true
	case "function":
		return node.FunctionKey == "save" || node.FunctionKey == "display"
	default:
		return false
	}
}

func canvasNodeStopsRun(node canvasRunNode) bool {
	return node.Type == "function" && (node.FunctionKey == "save" || node.FunctionKey == "display")
}

func previousCanvasOutput(ctx context.Context, projectID uint64, nodeID string, results []canvasNodeResult, canvas map[string]any) any {
	return previousCanvasOutputExcluding(ctx, projectID, nodeID, results, canvas, nil)
}

func previousCanvasOutputExcluding(
	ctx context.Context,
	projectID uint64,
	nodeID string,
	results []canvasNodeResult,
	canvas map[string]any,
	excludedUpstreamIDs map[string]bool,
) any {
	upstream := upstreamCanvasNodeIDs(nodeID, canvas)
	if len(upstream) == 0 {
		if len(excludedUpstreamIDs) > 0 {
			return nil
		}
		return lastCanvasOutput(results, "")
	}
	outputs := make([]any, 0, len(upstream))
	targetGroupID := textValue(canvasNodeByID(nodeID, canvas)["group_id"])
	groupSources := map[string][]map[string]any{}
	groupOrder := make([]string, 0)
	for _, upstreamID := range upstream {
		if excludedUpstreamIDs[upstreamID] {
			continue
		}
		upstreamNode := canvasNodeByID(upstreamID, canvas)
		if textValue(upstreamNode["type"]) == "group" {
			if output := canvasGroupPreviousOutput(ctx, projectID, upstreamID, results, canvas); output != nil {
				outputs = append(outputs, output)
			}
			continue
		}
		output := lastCanvasOutput(results, upstreamID)
		if output == nil {
			output = staticCanvasNodeOutput(ctx, projectID, upstreamID, canvas)
		}
		if output == nil {
			continue
		}
		upstreamGroupID := textValue(upstreamNode["group_id"])
		if upstreamGroupID != "" && upstreamGroupID != targetGroupID {
			if _, ok := groupSources[upstreamGroupID]; !ok {
				groupOrder = append(groupOrder, upstreamGroupID)
			}
			groupSources[upstreamGroupID] = append(
				groupSources[upstreamGroupID],
				canvasGroupOutputSource(upstreamNode, lastCanvasNodeResult(results, upstreamID), output),
			)
			continue
		}
		outputs = append(outputs, output)
	}
	for _, groupID := range groupOrder {
		outputs = append(outputs, map[string]any{
			"type":     "group_output",
			"group_id": groupID,
			"sources":  groupSources[groupID],
		})
	}
	if len(outputs) == 0 {
		return nil
	}
	if len(outputs) == 1 {
		return outputs[0]
	}
	return map[string]any{"sources": outputs}
}

func canvasNodePreviousOutput(ctx context.Context, projectID uint64, req CanvasRunRequest, nodeID string, results []canvasNodeResult) (any, []energoninput.MediaReference, error) {
	referenceOutput, mediaReferences, err := canvasPromptReferenceOutput(ctx, projectID, nodeID, results, req.Canvas)
	if err != nil {
		return nil, nil, err
	}
	if req.SingleNode {
		if manualContext := manualCanvasInputContext(req.Input); manualContext != nil {
			allowedSourceNodeIDs := canvasNodeSourceNodeIDs(nodeID, req.Canvas)
			manualContext = filterCanvasContextSources(manualContext, allowedSourceNodeIDs)
			startNode := canvasNodeByID(req.StartNodeID, req.Canvas)
			excludedUpstreamIDs := manualCanvasContextNodeIDs(manualContext)
			if textValue(startNode["type"]) == "group" {
				excludedUpstreamIDs[req.StartNodeID] = true
			}
			previousOutput := previousCanvasOutputExcluding(
				ctx,
				projectID,
				nodeID,
				results,
				req.Canvas,
				excludedUpstreamIDs,
			)
			return mergeCanvasContextOutputs(
				manualContext,
				referenceOutput,
				filterCanvasContextSources(previousOutput, allowedSourceNodeIDs),
			), mediaReferences, nil
		}
	}
	output := previousCanvasOutput(ctx, projectID, nodeID, results, req.Canvas)
	output = filterCanvasContextSources(output, canvasNodeSourceNodeIDs(nodeID, req.Canvas))
	return mergeCanvasContextOutputs(referenceOutput, output), mediaReferences, nil
}

func canvasNodeSourceNodeIDs(nodeID string, canvas map[string]any) map[string]bool {
	node := canvasNodeByID(nodeID, canvas)
	metadata := mapValue(firstPresent(node["storyboard_item"], node["storyboardItem"]))
	result := map[string]bool{}
	for _, raw := range sliceValue(firstPresent(metadata["source_node_ids"], metadata["sourceNodeIds"])) {
		if sourceNodeID := textValue(raw); sourceNodeID != "" {
			result[sourceNodeID] = true
		}
	}
	return result
}

func filterCanvasContextSources(value any, allowedNodeIDs map[string]bool) any {
	if value == nil || len(allowedNodeIDs) == 0 {
		return value
	}
	filtered, keep := filterCanvasContextValue(value, allowedNodeIDs)
	if !keep {
		return nil
	}
	return filtered
}

func filterCanvasContextValue(value any, allowedNodeIDs map[string]bool) (any, bool) {
	if row := mapValue(value); row != nil {
		if nodeID := firstText(row["node_id"], row["nodeId"]); nodeID != "" {
			return row, allowedNodeIDs[nodeID]
		}
		if _, hasSources := row["sources"]; hasSources {
			filteredSources := make([]any, 0)
			for _, source := range sliceValue(row["sources"]) {
				filtered, keep := filterCanvasContextValue(source, allowedNodeIDs)
				if keep {
					filteredSources = append(filteredSources, filtered)
				}
			}
			if len(filteredSources) == 0 {
				return nil, false
			}
			filteredRow := cloneInput(row)
			filteredRow["sources"] = filteredSources
			return filteredRow, true
		}
		return row, true
	}
	if values := sliceValue(value); values != nil {
		filteredValues := make([]any, 0, len(values))
		for _, current := range values {
			filtered, keep := filterCanvasContextValue(current, allowedNodeIDs)
			if keep {
				filteredValues = append(filteredValues, filtered)
			}
		}
		return filteredValues, len(filteredValues) > 0
	}
	return value, true
}

func canvasPromptReferenceOutput(
	ctx context.Context,
	projectID uint64,
	nodeID string,
	_ []canvasNodeResult,
	canvas map[string]any,
) (any, []energoninput.MediaReference, error) {
	node := canvasNodeByID(nodeID, canvas)
	content := mapValue(valueAtPath(node, "composer_draft", "prompt_content"))
	structured, err := canvasStructuredPromptReferences(content)
	if err != nil {
		return nil, nil, err
	}
	dependencies, err := canvasStoryboardSourceReferences(node, canvas)
	if err != nil {
		return nil, nil, err
	}
	structured = mergeCanvasPromptReferences(dependencies, structured)
	if len(structured) == 0 {
		return nil, nil, nil
	}
	sources := make([]any, 0, len(structured))
	mediaReferences := make([]energoninput.MediaReference, 0, len(structured))
	for _, reference := range structured {
		if reference.AssetID > 0 {
			asset, output, err := resolveCanvasReferenceAsset(ctx, projectID, reference)
			if err != nil {
				return nil, nil, err
			}
			if mediaReference, ok := energoninput.MediaReferenceFromContent(
				"asset",
				reference.AssetID,
				textValue(asset["kind"]),
				output,
				reference.Usage,
			); ok {
				mediaReferences = append(mediaReferences, mediaReference)
			}
			sources = append(sources, newCanvasGroupOutputSource(
				fmt.Sprintf("asset:%d", reference.AssetID),
				firstText(asset["name"], reference.Label, fmt.Sprintf("内容 %d", reference.AssetID)),
				textValue(asset["kind"]),
				"",
				reference.AssetID,
				uint64Value(asset["version_id"]),
				output,
			))
			continue
		}
	}
	if len(sources) == 0 {
		return nil, mediaReferences, nil
	}
	return map[string]any{
		"type":    "reference_output",
		"sources": sources,
	}, mediaReferences, nil
}

func canvasStoryboardSourceReferences(node map[string]any, canvas map[string]any) ([]canvasPromptReference, error) {
	metadata := mapValue(firstPresent(node["storyboard_item"], node["storyboardItem"]))
	itemType := firstText(metadata["item_type"], metadata["itemType"])
	if itemType != "shot_image" && itemType != "shot" {
		return nil, nil
	}

	result := []canvasPromptReference{}
	for _, sourceNodeID := range canvasStringList(firstPresent(
		metadata["source_node_ids"],
		metadata["sourceNodeIds"],
	)) {
		sourceNode := canvasNodeByID(sourceNodeID, canvas)
		if sourceNode == nil {
			return nil, fmt.Errorf("分镜来源节点不存在: %s", sourceNodeID)
		}
		resultRef := mapValue(firstPresent(sourceNode["result_ref"], sourceNode["resultRef"]))
		asset := mapValue(sourceNode["asset"])
		assetID := firstUint64(
			uint64Value(resultRef["asset_id"]),
			uint64Value(resultRef["assetId"]),
			uint64Value(asset["id"]),
		)
		versionID := firstUint64(
			uint64Value(resultRef["version_id"]),
			uint64Value(resultRef["versionId"]),
			uint64Value(asset["version_id"]),
			uint64Value(asset["versionId"]),
			uint64Value(valueAtPath(asset, "version", "id")),
		)
		if assetID == 0 || versionID == 0 {
			return nil, fmt.Errorf(
				"分镜来源“%s”尚未生成",
				firstText(sourceNode["title"], sourceNodeID),
			)
		}
		result = append(result, canvasPromptReference{
			AssetID:   assetID,
			VersionID: versionID,
			Label:     firstText(sourceNode["title"], sourceNodeID),
		})
	}
	return result, nil
}

func mergeCanvasPromptReferences(dependencies []canvasPromptReference, explicit []canvasPromptReference) []canvasPromptReference {
	if len(dependencies) == 0 {
		return explicit
	}
	result := make([]canvasPromptReference, 0, len(dependencies)+len(explicit))
	usedExplicit := make([]bool, len(explicit))
	for _, dependency := range dependencies {
		matched := false
		for index, reference := range explicit {
			if reference.AssetID != dependency.AssetID {
				continue
			}
			reference.VersionID = dependency.VersionID
			if reference.Label == "" {
				reference.Label = dependency.Label
			}
			result = append(result, reference)
			usedExplicit[index] = true
			matched = true
		}
		if !matched {
			result = append(result, dependency)
		}
	}
	for index, reference := range explicit {
		if !usedExplicit[index] {
			result = append(result, reference)
		}
	}
	return result
}

type canvasPromptReference struct {
	AssetID   uint64
	VersionID uint64
	Label     string
	Usage     string
}

func canvasStructuredPromptReferences(content map[string]any) ([]canvasPromptReference, error) {
	if uint64Value(content["version"]) != 1 {
		return nil, nil
	}
	result := []canvasPromptReference{}
	used := map[string]bool{}
	for _, raw := range sliceValue(content["parts"]) {
		part := mapValue(raw)
		if textValue(part["type"]) != "reference" {
			continue
		}
		refType := textValue(part["ref_type"])
		if refType != "asset" {
			return nil, fmt.Errorf("项目提示词只支持引用已保存资产")
		}
		if trigger := textValue(part["ref_trigger"]); trigger != "" && trigger != "@" {
			return nil, fmt.Errorf("项目资产引用必须使用 @ 触发符")
		}
		refID := uint64Value(part["ref_id"])
		if refID == 0 {
			return nil, fmt.Errorf("资产引用缺少资产标识")
		}
		usage := textValue(part["usage"])
		key := fmt.Sprintf("%s:%d:%s", refType, refID, usage)
		if used[key] {
			continue
		}
		used[key] = true
		result = append(result, canvasPromptReference{
			AssetID:   refID,
			VersionID: uint64Value(part["ref_version_id"]),
			Label:     textValue(part["label"]),
			Usage:     usage,
		})
	}
	return result, nil
}

func resolveCanvasReferenceAsset(ctx context.Context, projectID uint64, reference canvasPromptReference) (map[string]any, any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, nil, err
	}
	resolved, err := assetservice.NewService().RequireCurrentReference(
		ctx, project.TeamID, reference.AssetID, reference.VersionID,
	)
	if err != nil {
		return nil, nil, err
	}
	output := resolved.Content
	if output == nil {
		return nil, nil, fmt.Errorf("引用资产 %d 没有可用内容", reference.AssetID)
	}
	return assetservice.AssetToMap(resolved.Asset), output, nil
}

func manualCanvasContextNodeIDs(context any) map[string]bool {
	result := map[string]bool{}
	for _, raw := range sliceValue(valueAtPath(context, "sources")) {
		source := mapValue(raw)
		nodeID := firstText(source["node_id"], source["nodeId"])
		if nodeID != "" {
			result[nodeID] = true
		}
	}
	return result
}

func upstreamCanvasNodeIDs(nodeID string, canvas map[string]any) []string {
	edgesRaw, _ := canvas["edges"].([]any)
	result := []string{}
	for _, raw := range edgesRaw {
		row := mapValue(raw)
		if !canvasEdgeRuns(row) {
			continue
		}
		to := textValue(firstPresent(row["to"], row["target"]))
		if to != nodeID {
			continue
		}
		if from := textValue(firstPresent(row["from"], row["source"])); from != "" {
			result = append(result, from)
		}
	}
	return result
}

func canvasEdgeRuns(edge map[string]any) bool {
	return strings.ToLower(textValue(firstPresent(edge["execution_mode"], edge["executionMode"]))) != "manual"
}

func lastCanvasOutput(results []canvasNodeResult, nodeID string) any {
	for index := len(results) - 1; index >= 0; index-- {
		result := results[index]
		if nodeID != "" && result.NodeKey != nodeID {
			continue
		}
		if output := firstPresent(result.Payload["output"], valueAtPath(result.Payload, "result", "output"), valueAtPath(result.Payload, "asset", "version", "content")); output != nil {
			return output
		}
	}
	return nil
}

func staticCanvasNodeOutput(ctx context.Context, projectID uint64, nodeID string, canvas map[string]any) any {
	node := canvasNodeByID(nodeID, canvas)
	if node == nil {
		return nil
	}
	asset := hydrateCanvasAsset(ctx, projectID, mapValue(node["asset"]))
	return firstPresent(
		node["result_output"],
		valueAtPath(node, "result", "output"),
		valueAtPath(node, "result_ref", "output"),
		canvasOutputFromResultRef(ctx, projectID, mapValue(node["result_ref"])),
		valueAtPath(asset, "version", "content"),
		asset,
	)
}

func canvasNodeByID(nodeID string, canvas map[string]any) map[string]any {
	for _, raw := range sliceValue(canvas["nodes"]) {
		node := mapValue(raw)
		if node != nil && textValue(node["id"]) == nodeID {
			return node
		}
	}
	return nil
}

func hydrateCanvasAsset(ctx context.Context, projectID uint64, asset map[string]any) map[string]any {
	if asset == nil || valueAtPath(asset, "version", "content") != nil {
		return asset
	}
	assetID := uint64Value(asset["id"])
	if projectID == 0 || assetID == 0 {
		return asset
	}
	service := assetservice.NewService()
	row := service.FindProjectAsset(ctx, projectID, assetID)
	if row == nil {
		return asset
	}
	versionID := uint64Value(asset["version_id"])
	if versionID == 0 {
		versionID = row.VersionID
	}
	version := service.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != row.ID {
		version = service.FindVersion(ctx, row.VersionID)
	}
	detail := service.AssetDetailMap(ctx, *row, version)
	return mergeMap(asset, detail)
}

func canvasOutputFromResultRef(ctx context.Context, projectID uint64, ref map[string]any) any {
	if ref == nil {
		return nil
	}
	if assetID := uint64Value(ref["asset_id"]); assetID > 0 {
		asset := hydrateCanvasAsset(ctx, projectID, map[string]any{
			"id":         assetID,
			"version_id": uint64Value(ref["version_id"]),
		})
		if output := valueAtPath(asset, "version", "content"); output != nil {
			return output
		}
	}
	if nodeRunID := uint64Value(ref["node_run_id"]); nodeRunID > 0 {
		nodeRun := teammodel.NewNodeRunModel().Find(ctx, map[string]any{
			"id":         nodeRunID,
			"project_id": projectID,
		})
		if nodeRun != nil {
			output := jsonValue(nodeRun.Output, map[string]any{})
			return firstPresent(valueAtPath(output, "output"), output)
		}
	}
	if runID := uint64Value(ref["run_id"]); runID > 0 {
		run := teammodel.NewRunModel().Find(ctx, map[string]any{
			"id":         runID,
			"project_id": projectID,
		})
		if run != nil {
			output := jsonValue(run.Output, map[string]any{})
			return firstPresent(valueAtPath(output, "output"), output)
		}
	}
	if requestID := firstText(ref["request_id"]); requestID != "" {
		run := teammodel.NewRunModel().Find(ctx, map[string]any{
			"project_id": projectID,
			"request_id": requestID,
		})
		if run != nil {
			output := jsonValue(run.Output, map[string]any{})
			return firstPresent(valueAtPath(output, "output"), output)
		}
	}
	return nil
}

func mergeCanvasPromptInput(base map[string]any, previousOutput any, prompt string) map[string]any {
	return mergeCanvasInput(base, previousOutput, prompt, "prompt")
}

func mergeCanvasChatInput(base map[string]any, previousOutput any, prompt string) map[string]any {
	return mergeCanvasInput(base, previousOutput, prompt, "text")
}

func mergeCanvasInput(base map[string]any, previousOutput any, prompt string, promptKey string) map[string]any {
	input := cloneInput(base)
	manualContext := manualCanvasInputContext(input)
	delete(input, "_manual_input_context")
	delete(input, "manual_input_context")
	delete(input, "manual_node_id")
	delete(input, "start_node_id")
	delete(input, "startNodeId")
	delete(input, "node_id")
	delete(input, "nodeId")
	if previousOutput == nil {
		previousOutput = manualContext
	}
	if previousOutput != nil {
		input["previous_output"] = previousOutput
		if mediaContext, keep := canvasExecutionMediaContext(previousOutput); keep {
			mergeCanvasContextMedia(input, mediaContext)
		}
	}
	prompt = strings.TrimSpace(prompt)
	if prompt != "" {
		input[promptKey] = prompt
	} else if canvasContextText(input[promptKey]) == "" {
		if contextText := canvasContextText(previousOutput); contextText != "" {
			input[promptKey] = contextText
		}
	}
	return input
}

func canvasExecutionMediaContext(value any) (any, bool) {
	if row := mapValue(value); row != nil {
		if strings.EqualFold(textValue(row["type"]), "reference_output") {
			return nil, false
		}
		if _, hasSources := row["sources"]; hasSources {
			filtered := make([]any, 0)
			for _, source := range sliceValue(row["sources"]) {
				current, keep := canvasExecutionMediaContext(source)
				if keep {
					filtered = append(filtered, current)
				}
			}
			next := cloneInput(row)
			next["sources"] = filtered
			return next, len(filtered) > 0 || len(row) > 1
		}
		return row, true
	}
	if values := sliceValue(value); values != nil {
		filtered := make([]any, 0, len(values))
		for _, current := range values {
			next, keep := canvasExecutionMediaContext(current)
			if keep {
				filtered = append(filtered, next)
			}
		}
		return filtered, len(filtered) > 0
	}
	return value, value != nil
}

var canvasContextMediaFields = []struct {
	plural    string
	singular  string
	mediaType string
}{
	{plural: "images", singular: "image", mediaType: botprotocol.MediaTypeImage},
	{plural: "videos", singular: "video", mediaType: botprotocol.MediaTypeVideo},
	{plural: "audios", singular: "audio", mediaType: botprotocol.MediaTypeAudio},
	{plural: "files", singular: "file", mediaType: botprotocol.MediaTypeFile},
}

func mergeCanvasContextMedia(input map[string]any, context any) {
	media := botprotocol.ExtractMediaOutput(context, "")
	for _, field := range canvasContextMediaFields {
		incoming := botprotocol.NormalizeMediaList(media[field.plural], field.mediaType)
		if len(incoming) == 0 {
			continue
		}
		if merged := mergeCanvasMediaURLs(input[field.plural], input[field.singular], incoming, field.mediaType); len(merged) > 0 {
			input[field.plural] = merged
		}
	}
}

func mergeCanvasMediaURLs(plural any, singular any, incoming []string, mediaType string) []string {
	result := botprotocol.NormalizeMediaList(plural, mediaType)
	seen := make(map[string]struct{}, len(result)+len(incoming))
	for _, value := range result {
		if value = strings.TrimSpace(value); value != "" {
			seen[value] = struct{}{}
		}
	}
	for _, value := range botprotocol.NormalizeMediaList(singular, mediaType) {
		if value = strings.TrimSpace(value); value != "" {
			seen[value] = struct{}{}
		}
	}
	for _, value := range incoming {
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

func manualCanvasInputContext(input map[string]any) any {
	if input == nil {
		return nil
	}
	context := firstPresent(input["_manual_input_context"], input["manual_input_context"])
	if context == nil {
		return nil
	}
	if row := mapValue(context); row != nil {
		if canvasContextText(row["text"]) != "" || len(sliceValue(row["sources"])) > 0 {
			return row
		}
		return nil
	}
	if text := canvasContextText(context); text != "" {
		return text
	}
	return nil
}

func canvasContextText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	case map[string]any:
		for _, key := range []string{"text", "prompt", "description", "output", "content"} {
			if text := canvasContextText(current[key]); text != "" {
				return text
			}
		}
		if resultText := canvasContextText(valueAtPath(current, "result", "output")); resultText != "" {
			return resultText
		}
		if previewText := canvasContextText(valueAtPath(current, "preview", "text")); previewText != "" {
			return previewText
		}
		if sources := sliceValue(current["sources"]); len(sources) > 0 {
			parts := make([]string, 0, len(sources))
			for _, source := range sources {
				if text := canvasContextText(source); text != "" {
					parts = append(parts, text)
				}
			}
			return strings.TrimSpace(strings.Join(parts, "\n\n"))
		}
		return ""
	case []any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			if text := canvasContextText(item); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.TrimSpace(strings.Join(parts, "\n\n"))
	default:
		return strings.TrimSpace(textValue(current))
	}
}

func (s WorkspaceService) saveWorkspaceCanvasMaterial(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, payload map[string]any) (map[string]any, error) {
	if payload == nil {
		payload = map[string]any{}
	}
	if workspaceRunCanceled(ctx, run.ID) {
		payload["status"] = teammodel.RunStatusCanceled
		return payload, nil
	}
	if canvasRunStatus(payload) != teammodel.RunStatusSuccess {
		return payload, nil
	}
	output := firstPresent(payload["output"], valueAtPath(payload, "result", "output"), valueAtPath(payload, "asset", "version", "content"))
	if !assetservice.HasContent(output) {
		return payload, nil
	}
	source := map[string]any{
		"source_request_id": firstText(payload["request_id"], canvasChildRequestID(run.RequestID, node.ID)),
		"source_run_id":     uint64Value(payload["run_id"]),
		"source_node_key":   node.ID,
		"source_node_type":  node.Type,
		"source_status":     canvasRunStatus(payload),
	}
	if prompt := strings.TrimSpace(node.ComposerPrompt); prompt != "" {
		source["prompt"] = prompt
	}
	result, err := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
		AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
		FlowID:      node.FlowID,
		RunID:       run.ID,
		NodeRunID:   nodeRunID,
		ReleaseID:   run.ReleaseID,
		RequestID:   run.RequestID,
		NodeKey:     node.ID,
		Source:      source,
		Name:        workspaceCanvasAssetName(node),
		Kind:        firstText(node.Kind, node.PowerKind, assetmodel.KindRichText),
		Role:        assetmodel.RoleMaterial,
		Content:     output,
	})
	if err != nil {
		return payload, err
	}
	asset := mapValue(result["asset"])
	if asset != nil {
		payload["asset"] = asset
		payload["version"] = mapValue(asset["version"])
		// The asset stores a display document; downstream nodes need the original
		// runtime protocol so media and agent interaction fields are not flattened.
		payload["output"] = output
	}
	return payload, nil
}

func workspaceCanvasAssetName(node canvasRunNode) string {
	nodeTitle := canvasRunNodeTitle(node)
	if nodeTitle == "" {
		nodeTitle = "画布结果"
	}
	if strings.TrimSpace(node.StoryboardTitle) == "" {
		return truncateWorkspaceAssetName(nodeTitle)
	}
	parts := make([]string, 0, 3)
	for _, part := range []string{node.StoryboardTitle, node.GroupTitle, nodeTitle} {
		part = strings.TrimSpace(part)
		if part == "" || (len(parts) > 0 && parts[len(parts)-1] == part) {
			continue
		}
		parts = append(parts, part)
	}
	return truncateWorkspaceAssetName(strings.Join(parts, " · "))
}

func truncateWorkspaceAssetName(name string) string {
	const maxLen = 128
	runes := []rune(name)
	if len(runes) <= maxLen {
		return name
	}
	return string(runes[:maxLen])
}

func canvasAssetRunPayload(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64) map[string]any {
	asset := hydrateCanvasAsset(ctx, projectID, node.Asset)
	output := firstPresent(valueAtPath(asset, "version", "content"), asset)
	return canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
		"status": "success",
		"output": output,
		"asset":  asset,
		"result": map[string]any{"output": output},
	})
}

func canvasNodeRunPayload(req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, payload map[string]any) map[string]any {
	if payload == nil {
		payload = map[string]any{}
	}
	output := firstPresent(payload["output"], valueAtPath(payload, "result", "output"), valueAtPath(payload, "asset", "version", "content"), payload)
	status := canvasRunStatus(payload)
	childNodeResult := firstCanvasNodeResult(payload)
	payloadRunID := uint64Value(payload["run_id"])
	parentID := parentRunID(run)
	childRunID := uint64Value(firstPresent(payload["child_run_id"], childNodeResult["child_run_id"], valueAtPath(childNodeResult, "result", "child_run_id")))
	if childRunID == 0 && node.Type == "flow" && payloadRunID > 0 && payloadRunID != parentID {
		childRunID = payloadRunID
	}
	childRequestID := firstText(payload["child_request_id"], childNodeResult["child_request_id"], valueAtPath(childNodeResult, "result", "child_request_id"))
	if childRequestID == "" && childRunID > 0 {
		childRequestID = firstText(payload["request_id"], valueAtPath(childNodeResult, "result", "request_id"))
	}
	runID := payloadRunID
	requestID := firstText(payload["request_id"], req.RequestID)
	releaseID := uint64Value(firstPresent(payload["release_id"], valueAtPath(payload, "version", "release_id")))
	if run != nil {
		runID = firstUint64(run.ID, runID)
		requestID = firstText(run.RequestID, requestID)
		releaseID = firstUint64(run.ReleaseID, releaseID)
	}
	nodeResult := map[string]any{
		"node_key":         node.ID,
		"node_type":        node.Type,
		"node_run_id":      firstUint64(nodeRunID, uint64Value(firstPresent(payload["node_run_id"], childNodeResult["node_run_id"], valueAtPath(payload, "version", "node_run_id")))),
		"run_id":           runID,
		"child_run_id":     childRunID,
		"child_request_id": childRequestID,
		"request_id":       requestID,
		"release_id":       releaseID,
		"status":           status,
		"output":           output,
		"asset":            firstPresent(payload["asset"], childNodeResult["asset"]),
		"version":          firstPresent(payload["version"], valueAtPath(payload, "asset", "version"), childNodeResult["version"]),
		"result":           mergeMap(payload, map[string]any{"output": output}),
		"persists_result":  node.PersistsResult || mapValue(firstPresent(payload["asset"], childNodeResult["asset"])) != nil || mapValue(firstPresent(payload["version"], childNodeResult["version"])) != nil,
		"agent_run_id":     uint64Value(firstPresent(payload["agent_run_id"], childNodeResult["agent_run_id"])),
	}
	if sourceSignature := firstText(
		node.StoryboardItem["source_signature"],
		node.StoryboardItem["sourceSignature"],
	); sourceSignature != "" {
		nodeResult["source_signature"] = sourceSignature
	}
	if approval := canvasPayloadApproval(payload); approval != nil {
		nodeResult["approval"] = approval
	}
	result := map[string]any{
		"run_id":           runID,
		"request_id":       requestID,
		"flow_run_id":      uint64Value(payload["flow_run_id"]),
		"release_id":       releaseID,
		"child_run_id":     childRunID,
		"child_request_id": childRequestID,
		"status":           status,
		"executed":         1,
		"output":           payload,
		"node_results":     []map[string]any{nodeResult},
	}
	if status == teammodel.RunStatusWaiting {
		result["pending_node"] = nodeResult
	}
	return result
}

func canvasRunSummary(req CanvasRunRequest, status string, run *teammodel.Run, last map[string]any, results []canvasNodeResult, plan map[string]any, flowRunID uint64) map[string]any {
	nodeResults := make([]any, 0, len(results))
	var pendingNode any
	for _, result := range results {
		for _, item := range sliceValue(result.Payload["node_results"]) {
			nodeResults = append(nodeResults, item)
			if pendingNode == nil {
				row := mapValue(item)
				if row != nil && textValue(row["status"]) == teammodel.RunStatusWaiting {
					pendingNode = row
				}
			}
		}
	}
	if last == nil {
		last = map[string]any{}
	}
	runID := uint64Value(last["run_id"])
	requestID := firstText(last["request_id"], req.RequestID)
	releaseID := uint64Value(last["release_id"])
	if run != nil {
		runID = firstUint64(runID, run.ID)
		requestID = firstText(requestID, run.RequestID)
		releaseID = firstUint64(releaseID, run.ReleaseID)
	}
	summary := map[string]any{
		"run_id":         runID,
		"request_id":     requestID,
		"flow_run_id":    firstUint64(flowRunID, uint64Value(last["flow_run_id"])),
		"release_id":     releaseID,
		"status":         firstText(status, "success"),
		"executed":       len(nodeResults),
		"output":         firstPresent(last["output"], last),
		"node_results":   nodeResults,
		"execution_plan": plan,
	}
	if pendingNode != nil {
		summary["pending_node"] = pendingNode
	}
	return summary
}

func canvasPayloadApproval(payload map[string]any) map[string]any {
	if approval := mapValue(payload["approval"]); approval != nil {
		return approval
	}
	if approval := mapValue(valueAtPath(payload, "result", "approval")); approval != nil {
		return approval
	}
	childNodeResult := firstCanvasNodeResult(payload)
	if approval := mapValue(childNodeResult["approval"]); approval != nil {
		return approval
	}
	if approval := mapValue(valueAtPath(childNodeResult, "result", "approval")); approval != nil {
		return approval
	}
	if approvalID := firstUint64(
		uint64Value(payload["approval_id"]),
		uint64Value(valueAtPath(payload, "result", "approval_id")),
		uint64Value(childNodeResult["approval_id"]),
		uint64Value(valueAtPath(childNodeResult, "result", "approval_id")),
	); approvalID > 0 {
		return map[string]any{"id": approvalID}
	}
	return nil
}

func canvasRunPlan(plan canvasExecutionPlan) map[string]any {
	planNodes := make([]map[string]any, 0, len(plan.Nodes))
	for _, node := range plan.Nodes {
		planNodes = append(planNodes, map[string]any{
			"id":              node.ID,
			"type":            node.Type,
			"title":           canvasRunNodeTitle(node),
			"kind":            node.Kind,
			"output_type":     node.OutputType,
			"group_id":        node.GroupID,
			"function_key":    node.FunctionKey,
			"asset_cate_id":   node.AssetCateID,
			"persists_result": node.PersistsResult,
			"stops_flow":      canvasNodeStopsRun(node),
		})
	}
	planEdges := make([]map[string]any, 0, len(plan.Edges))
	for _, edge := range plan.Edges {
		planEdges = append(planEdges, map[string]any{
			"id":     edge.ID,
			"source": edge.From,
			"target": edge.To,
		})
	}
	return map[string]any{
		"nodes":    planNodes,
		"edges":    planEdges,
		"incoming": plan.Incoming,
		"outgoing": plan.Outgoing,
		"order":    plan.Order,
	}
}

func canvasRunStatus(payload map[string]any) string {
	status := textValue(payload["status"])
	if status == "" {
		return "success"
	}
	switch status {
	case "running", "pending", "waiting", "success", "fail", "canceled":
		return status
	case "cancelled":
		return "canceled"
	}
	return status
}

func canvasRunShouldStop(status string) bool {
	switch status {
	case "fail", "canceled", "running", "pending", "waiting":
		return true
	default:
		return false
	}
}

func mapValue(raw any) map[string]any {
	row, ok := raw.(map[string]any)
	if !ok || row == nil {
		return nil
	}
	return row
}

func sliceValue(raw any) []any {
	switch items := raw.(type) {
	case []any:
		return items
	case []map[string]any:
		result := make([]any, 0, len(items))
		for _, item := range items {
			result = append(result, item)
		}
		return result
	default:
		return nil
	}
}

func textValue(raw any) string {
	if raw == nil {
		return ""
	}
	text := strings.TrimSpace(fmt.Sprint(raw))
	if text == "<nil>" {
		return ""
	}
	return text
}

func uint64Value(raw any) uint64 {
	switch value := raw.(type) {
	case uint64:
		return value
	case uint:
		return uint64(value)
	case uint32:
		return uint64(value)
	case int:
		if value > 0 {
			return uint64(value)
		}
	case int64:
		if value > 0 {
			return uint64(value)
		}
	case float64:
		if value > 0 {
			return uint64(value)
		}
	case string:
		var parsed uint64
		_, _ = fmt.Sscan(strings.TrimSpace(value), &parsed)
		return parsed
	}
	return 0
}

func firstPresent(values ...any) any {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" && text != "<nil>" {
			return text
		}
	}
	return ""
}

func valueAtPath(raw any, path ...string) any {
	current := raw
	for _, key := range path {
		row := mapValue(current)
		if row == nil {
			return nil
		}
		current = row[key]
	}
	return current
}

func mergeMap(base map[string]any, patch map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range base {
		result[key] = value
	}
	for key, value := range patch {
		result[key] = value
	}
	return result
}

func firstCanvasNodeResult(payload map[string]any) map[string]any {
	for _, item := range sliceValue(payload["node_results"]) {
		if row := mapValue(item); row != nil {
			return row
		}
	}
	return map[string]any{}
}

func canvasChildRequestID(parentRequestID string, nodeID string) string {
	parentRequestID = strings.TrimSpace(parentRequestID)
	nodeID = strings.TrimSpace(nodeID)
	if parentRequestID == "" {
		return normalizeWorkspaceRequestID(nodeID)
	}
	if nodeID == "" {
		return normalizeWorkspaceRequestID(parentRequestID)
	}
	sum := sha1.Sum([]byte(nodeID))
	suffix := hex.EncodeToString(sum[:])[:12]
	prefixLimit := 64 - len(suffix) - 1
	if prefixLimit < 1 {
		return suffix
	}
	if len(parentRequestID) > prefixLimit {
		parentRequestID = parentRequestID[:prefixLimit]
	}
	return parentRequestID + "-" + suffix
}
