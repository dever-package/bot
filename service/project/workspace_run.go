package project

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
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
	ID             string
	Type           string
	Title          string
	Kind           string
	AssetCateID    uint64
	FunctionKey    string
	FlowID         uint64
	PowerID        uint64
	PowerKey       string
	PowerKind      string
	AgentID        uint64
	RoleID         uint64
	Asset          map[string]any
	AssetID        uint64
	AssetVersionID uint64
	ComposerPrompt string
	SelectedTarget uint64
	ParamValues    map[string]any
	PersistsResult bool
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
	plan := buildCanvasRunExecutionPlan(req.StartNodeID, nodesByID, edges, req.SingleNode)
	if !req.SingleNode && len(plan.Nodes) == 0 {
		return nil, fmt.Errorf("开始节点没有连接后续节点")
	}
	if !req.SingleNode {
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
	if len(runnableNodes) == 0 {
		summary := canvasRunSummary(req, "success", run, nil, existingResults, canvasRunPlan(plan), flowRunID)
		summary["node_runs"] = workspaceNodeRunPayloads(ctx, run.ID)
		finishWorkspaceRun(ctx, run.ID, teammodel.RunStatusSuccess, summary, "")
		finishWorkspaceFlowRun(ctx, flowRunID, teammodel.RunStatusSuccess, summary, "")
		return summary, nil
	}

	results := make([]canvasNodeResult, 0, len(existingResults)+len(runnableNodes))
	results = append(results, existingResults...)
	status := "success"
	var lastPayload map[string]any
	if len(results) > 0 {
		lastPayload = results[len(results)-1].Payload
	}
	for _, node := range runnableNodes {
		nodeRunID := nodeRuns[node.ID]
		inputContext := canvasNodePreviousOutput(ctx, run.ProjectID, req, node.ID, results)
		markWorkspaceNodeRun(ctx, nodeRunID, teammodel.RunStatusRunning, map[string]any{
			"input":            req.Input,
			"node":             canvasRunNodeInput(node),
			"previous_output":  inputContext,
			"execution_plan":   canvasRunPlan(plan),
			"workspace_run_id": run.ID,
		}, nil, "", 0)
		recordWorkspaceNodeExecution(ctx, workspaceNodeExecution{
			ExecutionID: workspaceExecutionIDByRunID(ctx, run.ID),
			ProjectID:   run.ProjectID,
			AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
			RunID:       run.ID,
			FlowRunID:   flowRunID,
			NodeRunID:   nodeRunID,
			RequestID:   run.RequestID,
			NodeKey:     node.ID,
			NodeType:    node.Type,
			FunctionKey: node.FunctionKey,
			Status:      teammodel.RunStatusRunning,
			Input:       map[string]any{"input": req.Input, "node": canvasRunNodeInput(node), "previous_output": inputContext},
			StartedAt:   time.Now(),
		})
		s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_started", teammodel.RunStatusRunning, nil)
		payload, runErr := s.runCanvasNode(ctx, run.ProjectID, req, run, node, nodeRunID, results)
		if payload == nil {
			payload = map[string]any{}
		}
		lastPayload = payload
		results = append(results, canvasNodeResult{
			NodeKey: node.ID,
			Payload: payload,
		})
		status = canvasRunStatus(payload)
		if runErr != nil {
			status = "fail"
			payload["error"] = runErr.Error()
			s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, status, payload, runErr)
			s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", status, payload)
			break
		}
		s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, status, payload, nil)
		if status == teammodel.RunStatusWaiting {
			s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "waiting", status, payload)
		} else if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending {
			s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", status, payload)
		}
		if canvasRunShouldStop(status) {
			break
		}
	}
	summary := canvasRunSummary(req, status, run, lastPayload, results, canvasRunPlan(plan), flowRunID)
	summary["node_runs"] = workspaceNodeRunPayloads(ctx, run.ID)
	finishWorkspaceRun(ctx, run.ID, status, summary, textValue(valueAtPath(lastPayload, "error")))
	finishWorkspaceFlowRun(ctx, flowRunID, status, summary, textValue(valueAtPath(lastPayload, "error")))
	resultStatus := 1
	if status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled {
		resultStatus = 2
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending {
		s.writeWorkspaceRunResult(ctx, run, summary, textValue(valueAtPath(lastPayload, "error")), resultStatus)
	}
	return summary, nil
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
		Input:          map[string]any{"input": req.Input, "node": node},
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
	if node.Type == "agent" && node.AgentID > 0 {
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
	previousOutput := canvasNodePreviousOutput(ctx, projectID, req, node.ID, results)
	switch node.Type {
	case "asset":
		return canvasAssetRunPayload(ctx, projectID, req, run, node, nodeRunID), nil
	case "power":
		return s.runCanvasPowerNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	case "agent":
		return s.runCanvasAgentNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	case "flow":
		return s.runCanvasFlowNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	case "function":
		return s.runCanvasFunctionNode(ctx, projectID, req, run, node, nodeRunID, previousOutput)
	default:
		return nil, fmt.Errorf("节点类型不支持执行")
	}
}

func (s WorkspaceService) runCanvasPowerNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any) (map[string]any, error) {
	if node.PowerID == 0 && node.PowerKey == "" {
		return nil, fmt.Errorf("能力节点未配置能力")
	}
	input := mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt)
	params := cloneInput(node.ParamValues)
	if canvasContextText(input["text"]) != "" && canvasContextText(params["text"]) == "" {
		delete(params, "text")
	}
	result, err := s.project.RunCanvasPower(ctx, projectID, teamservice.CanvasPowerRunRequest{
		FlowID:         node.FlowID,
		AssetCateID:    firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:        node.ID,
		NodeName:       node.Title,
		Kind:           node.Kind,
		PowerID:        node.PowerID,
		PowerKey:       node.PowerKey,
		SourceTargetID: node.SelectedTarget,
		RequestID:      canvasChildRequestID(req.RequestID, node.ID),
		Input:          input,
		Params:         params,
	})
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	result, err = s.saveWorkspaceCanvasMaterial(ctx, projectID, req, run, node, nodeRunID, result)
	return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
}

func (s WorkspaceService) runCanvasAgentNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any) (map[string]any, error) {
	if node.AgentID == 0 {
		return nil, fmt.Errorf("智能体节点未配置智能体")
	}
	input := mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt)
	if history := workspaceAgentHistory(ctx, projectID, firstUint64(node.AssetCateID, req.AssetCateID), node.ID, node.AgentID); len(history) > 0 {
		input["workspace_agent_history"] = history
	}
	if node.RoleID > 0 {
		input["role_id"] = node.RoleID
	}
	result, err := s.project.RunCanvasAgent(ctx, projectID, CanvasAgentRunRequest{
		FlowID:      node.FlowID,
		AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:     node.ID,
		NodeName:    node.Title,
		AgentID:     node.AgentID,
		RequestID:   canvasChildRequestID(req.RequestID, node.ID),
		Input:       input,
	})
	if err != nil {
		return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
	}
	result, err = s.saveWorkspaceCanvasMaterial(ctx, projectID, req, run, node, nodeRunID, result)
	return canvasNodeRunPayload(req, run, node, nodeRunID, result), err
}

func (s WorkspaceService) runCanvasFlowNode(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, previousOutput any) (map[string]any, error) {
	if node.FlowID == 0 {
		return nil, fmt.Errorf("流程节点未配置流程")
	}
	result, err := s.project.RunFlow(ctx, projectID, teamservice.RunRequest{
		FlowID:    node.FlowID,
		RequestID: canvasChildRequestID(req.RequestID, node.ID),
		Input:     mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt),
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
		result, err := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
			AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
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
			Name:    workspaceCanvasAssetName(canvasRunNodeTitle(node), node.ID),
			Kind:    firstText(node.Kind, "mixed"),
			Role:    "content",
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
			ID:             textValue(row["id"]),
			Type:           textValue(row["type"]),
			Title:          textValue(row["title"]),
			Kind:           textValue(row["kind"]),
			AssetCateID:    uint64Value(row["asset_cate_id"]),
			FunctionKey:    textValue(valueAtPath(row, "function_option", "key")),
			FlowID:         uint64Value(valueAtPath(row, "flow", "id")),
			PowerID:        uint64Value(valueAtPath(row, "power", "id")),
			PowerKey:       textValue(valueAtPath(row, "power", "key")),
			PowerKind:      textValue(valueAtPath(row, "power", "kind")),
			AgentID:        uint64Value(valueAtPath(row, "role", "agent_id")),
			RoleID:         uint64Value(valueAtPath(row, "role", "id")),
			Asset:          mapValue(row["asset"]),
			AssetID:        uint64Value(valueAtPath(row, "asset", "id")),
			AssetVersionID: uint64Value(valueAtPath(row, "asset", "version_id")),
			ComposerPrompt: textValue(valueAtPath(row, "composer_draft", "prompt")),
			SelectedTarget: uint64Value(valueAtPath(row, "composer_draft", "selected_target_id")),
			ParamValues:    mapValue(valueAtPath(row, "composer_draft", "param_values")),
		}
		node.PersistsResult = canvasRunNodePersistsResult(node.Type, node.FunctionKey)
		if node.ID == "" || node.Type == "" {
			return nil, nil, fmt.Errorf("画布节点格式错误")
		}
		nodes = append(nodes, node)
	}
	edges := make([]canvasRunEdge, 0, len(edgesRaw))
	for _, raw := range edgesRaw {
		row := mapValue(raw)
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
	case "asset", "power", "agent", "flow":
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
	upstream := upstreamCanvasNodeIDs(nodeID, canvas)
	if len(upstream) == 0 {
		return lastCanvasOutput(results, "")
	}
	outputs := make([]any, 0, len(upstream))
	for _, upstreamID := range upstream {
		if output := lastCanvasOutput(results, upstreamID); output != nil {
			outputs = append(outputs, output)
			continue
		}
		if output := staticCanvasNodeOutput(ctx, projectID, upstreamID, canvas); output != nil {
			outputs = append(outputs, output)
		}
	}
	if len(outputs) == 0 {
		return lastCanvasOutput(results, "")
	}
	if len(outputs) == 1 {
		return outputs[0]
	}
	return map[string]any{"sources": outputs}
}

func canvasNodePreviousOutput(ctx context.Context, projectID uint64, req CanvasRunRequest, nodeID string, results []canvasNodeResult) any {
	output := previousCanvasOutput(ctx, projectID, nodeID, results, req.Canvas)
	if output != nil || !req.SingleNode {
		return output
	}
	return manualCanvasInputContext(req.Input)
}

func upstreamCanvasNodeIDs(nodeID string, canvas map[string]any) []string {
	edgesRaw, _ := canvas["edges"].([]any)
	result := []string{}
	for _, raw := range edgesRaw {
		row := mapValue(raw)
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
		valueAtPath(asset, "version", "content"),
		canvasOutputFromResultRef(ctx, projectID, mapValue(node["result_ref"])),
		node["result_output"],
		valueAtPath(node, "result", "output"),
		valueAtPath(node, "result_ref", "output"),
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

func mergeCanvasInput(base map[string]any, previousOutput any, prompt string) map[string]any {
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
	}
	prompt = strings.TrimSpace(prompt)
	if prompt != "" {
		input["prompt"] = prompt
		input["text"] = prompt
	} else if canvasContextText(input["text"]) == "" {
		if contextText := canvasContextText(previousOutput); contextText != "" {
			input["text"] = contextText
		}
	}
	return input
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
	if canvasRunStatus(payload) != teammodel.RunStatusSuccess {
		return payload, nil
	}
	output := firstPresent(payload["output"], valueAtPath(payload, "result", "output"), valueAtPath(payload, "asset", "version", "content"))
	if output == nil {
		return payload, nil
	}
	result, err := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
		AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
		FlowID:      node.FlowID,
		RunID:       run.ID,
		NodeRunID:   nodeRunID,
		ReleaseID:   run.ReleaseID,
		RequestID:   run.RequestID,
		NodeKey:     node.ID,
		Source: map[string]any{
			"source_request_id": firstText(payload["request_id"], canvasChildRequestID(run.RequestID, node.ID)),
			"source_run_id":     uint64Value(payload["run_id"]),
			"source_node_key":   node.ID,
			"source_node_type":  node.Type,
			"source_status":     canvasRunStatus(payload),
		},
		Name:    workspaceCanvasAssetName(canvasRunNodeTitle(node), node.ID),
		Kind:    firstText(node.Kind, node.PowerKind, "mixed"),
		Role:    "material",
		Content: output,
	})
	if err != nil {
		return payload, err
	}
	asset := mapValue(result["asset"])
	if asset != nil {
		payload["asset"] = asset
		payload["version"] = mapValue(asset["version"])
		payload["output"] = firstPresent(valueAtPath(asset, "version", "content"), output)
	}
	return payload, nil
}

func workspaceCanvasAssetName(name string, nodeID string) string {
	name = strings.TrimSpace(name)
	if name == "" {
		name = "画布结果"
	}
	nodeID = strings.TrimSpace(nodeID)
	if nodeID == "" {
		return truncateWorkspaceAssetName(name)
	}
	suffix := nodeID
	if len(suffix) > 12 {
		suffix = suffix[:12]
	}
	return truncateWorkspaceAssetName(fmt.Sprintf("%s [%s]", name, suffix))
}

func truncateWorkspaceAssetName(name string) string {
	const maxLen = 128
	if len(name) <= maxLen {
		return name
	}
	return name[:maxLen]
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
	case "fail", "running", "pending", "waiting":
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
