package project

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
)

func (s WorkspaceService) refreshWorkspaceRun(ctx context.Context, run *teammodel.Run) {
	if run == nil || run.ProjectID == 0 || run.ID == 0 {
		return
	}
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	if input == nil {
		return
	}
	plan := mapValue(input["execution_plan"])
	if plan == nil {
		return
	}
	canvas := mapValue(input["canvas"])
	req := CanvasRunRequest{
		ProjectID:   run.ProjectID,
		AssetCateID: uint64Value(input["_asset_cate_id"]),
		StartNodeID: textValue(input["_start_node_id"]),
		RequestID:   run.RequestID,
		SingleNode:  boolValue(input["_single_node"]),
		Canvas:      canvas,
		Input:       mapValue(input["input"]),
	}
	fullNodesByID := map[string]canvasRunNode{}
	if canvas != nil {
		nodes, _, err := parseCanvasRunGraph(canvas)
		if err == nil {
			fullNodesByID = canvasRunNodeMap(nodes)
		}
	}
	parentNodeRuns := workspaceNodeRunIDMap(ctx, run.ID)
	nodeResults := workspaceNodeResults(ctx, run.ProjectID, run.ID)
	completed := map[string]bool{}
	resultByNode := map[string]map[string]any{}
	for _, result := range nodeResults {
		nodeKey := textValue(result["node_key"])
		if nodeKey == "" {
			continue
		}
		resultByNode[nodeKey] = result
		if status := textValue(result["status"]); status == teammodel.RunStatusSuccess || status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled {
			completed[nodeKey] = true
		}
	}
	nodes := sliceValue(plan["nodes"])
	for _, raw := range nodes {
		node := mapValue(raw)
		nodeKey := textValue(node["id"])
		if nodeKey == "" || completed[nodeKey] {
			continue
		}
		childRequestID := canvasChildRequestID(run.RequestID, nodeKey)
		childRunID := firstUint64(
			workspaceNodeExecutionChildRunID(ctx, run.ProjectID, run.ID, nodeKey),
			workspaceChildRunID(run.ID, resultByNode[nodeKey]),
		)
		childStatus, ok := s.finishedWorkspaceChildRun(ctx, run.ProjectID, childRunID, childRequestID)
		if !ok {
			continue
		}
		fullNode := fullNodesByID[nodeKey]
		if fullNode.ID == "" {
			fullNode = canvasRunNode{
				ID:             nodeKey,
				Type:           textValue(node["type"]),
				Title:          textValue(node["title"]),
				FunctionKey:    textValue(node["function_key"]),
				AssetCateID:    uint64Value(firstPresent(input["_asset_cate_id"], node["asset_cate_id"])),
				PersistsResult: boolValue(node["persists_result"]),
			}
		}
		parentNodeRunID := parentNodeRuns[nodeKey]
		payload := s.workspaceChildNodePayload(ctx, run, fullNode, parentNodeRunID, childRunID, childStatus)
		if childStatus == teammodel.RunStatusSuccess {
			if saved, err := s.saveWorkspaceCanvasMaterial(ctx, run.ProjectID, req, run, fullNode, parentNodeRunID, payload); err == nil {
				payload = saved
			}
		}
		s.recordCanvasNodeRunResult(ctx, req, run, fullNode, parentNodeRunID, childStatus, payload, nil)
		nodeResults = workspaceNodeResults(ctx, run.ProjectID, run.ID)
		if childStatus == teammodel.RunStatusWaiting {
			s.finishWorkspaceRunFromNodeResults(ctx, run, input, plan, nodeResults)
			return
		}
		if childStatus == teammodel.RunStatusFail || childStatus == teammodel.RunStatusCanceled {
			s.finishWorkspaceRunFromNodeResults(ctx, run, input, plan, nodeResults)
			return
		}
	}
	if s.continueWorkspaceRunAfterBlockedNode(ctx, run, input, plan, nodeResults) {
		return
	}
	s.finishWorkspaceRunFromNodeResults(ctx, run, input, plan, nodeResults)
}

func (s WorkspaceService) SyncCanvasRunProgress(ctx context.Context, projectID uint64, runID uint64, requestID string) *teammodel.Run {
	run := findWorkspaceRunForStatus(ctx, projectID, runID, requestID)
	if run == nil {
		return nil
	}
	if !workspaceRunCanSyncProgress(run) {
		return run
	}
	_, _ = withWorkspaceRunLock(ctx, run.ProjectID, run.ID, func() (struct{}, error) {
		if refreshed := teammodel.NewRunModel().Find(ctx, map[string]any{"id": run.ID}); workspaceRunCanSyncProgress(refreshed) {
			s.refreshWorkspaceRun(ctx, refreshed)
		}
		return struct{}{}, nil
	})
	if refreshed := teammodel.NewRunModel().Find(ctx, map[string]any{"id": run.ID}); refreshed != nil {
		return refreshed
	}
	return run
}

func workspaceRunCanSyncProgress(run *teammodel.Run) bool {
	if run == nil {
		return false
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning:
		return true
	default:
		return false
	}
}

func workspaceChildRunID(parentRunID uint64, result map[string]any) uint64 {
	if result == nil {
		return 0
	}
	runID := firstUint64(
		uint64Value(result["child_run_id"]),
		uint64Value(valueAtPath(result, "result", "child_run_id")),
		uint64Value(result["run_id"]),
		uint64Value(valueAtPath(result, "result", "run_id")),
	)
	if runID == parentRunID {
		return 0
	}
	return runID
}

func (s WorkspaceService) finishedWorkspaceChildRun(ctx context.Context, projectID uint64, runID uint64, requestID string) (string, bool) {
	if runID == 0 && requestID == "" {
		return "", false
	}
	status, err := s.project.RunStatus(ctx, projectID, runID, requestID)
	if err != nil {
		return "", false
	}
	run := mapValue(status["run"])
	if run == nil {
		return "", false
	}
	runStatus := textValue(run["status"])
	switch runStatus {
	case teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled, teammodel.RunStatusWaiting:
		return runStatus, true
	default:
		return runStatus, false
	}
}

func (s WorkspaceService) workspaceChildNodePayload(ctx context.Context, run *teammodel.Run, node canvasRunNode, parentNodeRunID uint64, childRunID uint64, status string) map[string]any {
	nodeKey := node.ID
	childRequestID := canvasChildRequestID(run.RequestID, nodeKey)
	childStatus, err := s.project.RunStatus(ctx, run.ProjectID, childRunID, childRequestID)
	if err != nil {
		return canvasNodeRunPayload(CanvasRunRequest{RequestID: run.RequestID}, run, canvasRunNode{
			ID:   nodeKey,
			Type: node.Type,
		}, parentNodeRunID, map[string]any{
			"status": status,
			"error":  err.Error(),
		})
	}
	childRun := mapValue(childStatus["run"])
	output := firstPresent(valueAtPath(childRun, "output"), childStatus)
	nodeResult := workspaceChildNodeResult(ctx, run.ProjectID, run, node, parentNodeRunID, status, childStatus, output)
	return map[string]any{
		"run_id":       run.ID,
		"child_run_id": uint64Value(childRun["id"]),
		"request_id":   run.RequestID,
		"release_id":   run.ReleaseID,
		"status":       status,
		"output":       output,
		"node_results": []map[string]any{nodeResult},
	}
}

func (s WorkspaceService) continueWorkspaceRunAfterBlockedNode(ctx context.Context, run *teammodel.Run, input map[string]any, plan map[string]any, nodeResults []map[string]any) bool {
	if run == nil {
		return false
	}
	runStatus := textValue(run.Status)
	if runStatus != teammodel.RunStatusWaiting && runStatus != teammodel.RunStatusRunning {
		return false
	}
	if workspaceRunStatusFromNodeResults(plan, nodeResults) != teammodel.RunStatusRunning {
		return false
	}
	if workspaceHasActiveNodeExecution(ctx, run.ProjectID, run.ID) {
		return false
	}
	canvas := mapValue(input["canvas"])
	if canvas == nil {
		return false
	}
	nodes, edges, err := parseCanvasRunGraph(canvas)
	if err != nil {
		return false
	}
	nodesByID := canvasRunNodeMap(nodes)
	execPlan := buildCanvasRunExecutionPlan(textValue(input["_start_node_id"]), nodesByID, edges, boolValue(input["_single_node"]))
	runnableNodes := filterRunnableCanvasNodes(execPlan.Nodes)
	done := map[string]bool{}
	existingResults := make([]canvasNodeResult, 0, len(nodeResults))
	for _, result := range nodeResults {
		nodeKey := textValue(result["node_key"])
		status := textValue(result["status"])
		if nodeKey == "" {
			continue
		}
		if status == teammodel.RunStatusSuccess {
			done[nodeKey] = true
			existingResults = append(existingResults, canvasNodeResult{
				NodeKey: nodeKey,
				Payload: map[string]any{
					"status":       status,
					"run_id":       result["run_id"],
					"request_id":   result["request_id"],
					"flow_run_id":  result["flow_run_id"],
					"release_id":   result["release_id"],
					"output":       result["output"],
					"asset":        result["asset"],
					"version":      result["version"],
					"node_results": []map[string]any{result},
				},
			})
			continue
		}
		if status == teammodel.RunStatusWaiting {
			return false
		}
		done[nodeKey] = true
	}
	pendingNodes := make([]canvasRunNode, 0, len(runnableNodes))
	for _, node := range runnableNodes {
		if !done[node.ID] {
			pendingNodes = append(pendingNodes, node)
		}
	}
	if len(pendingNodes) == 0 {
		return false
	}
	req := CanvasRunRequest{
		ProjectID:   run.ProjectID,
		AssetCateID: uint64Value(input["_asset_cate_id"]),
		StartNodeID: textValue(input["_start_node_id"]),
		RequestID:   run.RequestID,
		SingleNode:  boolValue(input["_single_node"]),
		Canvas:      canvas,
		Input:       mapValue(input["input"]),
	}
	flowRunID := workspaceFlowRunID(ctx, run.ID)
	nodeRuns := workspaceNodeRunIDMap(ctx, run.ID)
	_, err = s.executeCanvasRunnableNodes(ctx, req, run, execPlan, pendingNodes, flowRunID, nodeRuns, existingResults)
	return err == nil
}

func workspaceChildNodeResult(ctx context.Context, projectID uint64, parentRun *teammodel.Run, node canvasRunNode, parentNodeRunID uint64, status string, childStatus map[string]any, output any) map[string]any {
	childRun := mapValue(childStatus["run"])
	nodeRun := latestWorkspaceChildNodeRun(childStatus)
	asset, version := latestWorkspaceChildAsset(ctx, projectID, uint64Value(nodeRun["id"]))
	runID := uint64Value(childRun["id"])
	requestID := textValue(childRun["request_id"])
	releaseID := uint64Value(childRun["release_id"])
	result := map[string]any{
		"node_key":     node.ID,
		"node_type":    node.Type,
		"node_run_id":  firstUint64(parentNodeRunID, uint64Value(nodeRun["id"])),
		"run_id":       parentRunID(parentRun),
		"child_run_id": runID,
		"request_id":   requestID,
		"release_id":   firstUint64(parentReleaseID(parentRun), releaseID),
		"status":       status,
		"output":       output,
		"asset":        asset,
		"version":      version,
		"result": map[string]any{
			"output":       output,
			"status":       status,
			"run_id":       runID,
			"child_run_id": runID,
			"request_id":   requestID,
			"release_id":   releaseID,
		},
		"persists_result": asset != nil || version != nil,
		"agent_run_id":    uint64Value(nodeRun["agent_run_id"]),
	}
	if approval := pendingWorkspaceApproval(childStatus, uint64Value(nodeRun["id"])); approval != nil {
		result["approval"] = approval
		result["result"] = map[string]any{
			"output":       output,
			"status":       status,
			"run_id":       runID,
			"child_run_id": runID,
			"request_id":   requestID,
			"release_id":   releaseID,
			"approval":     approval,
		}
	}
	return result
}

func latestWorkspaceChildNodeRun(childStatus map[string]any) map[string]any {
	var selected map[string]any
	for _, raw := range sliceValue(childStatus["node_runs"]) {
		row := mapValue(raw)
		if row == nil {
			continue
		}
		if selected == nil || uint64Value(row["id"]) > uint64Value(selected["id"]) {
			selected = row
		}
	}
	if selected == nil {
		return map[string]any{}
	}
	return selected
}

func pendingWorkspaceApproval(childStatus map[string]any, nodeRunID uint64) map[string]any {
	for _, raw := range sliceValue(childStatus["approvals"]) {
		row := mapValue(raw)
		if row == nil || textValue(row["status"]) != teammodel.RunStatusPending {
			continue
		}
		if nodeRunID > 0 && uint64Value(row["node_run_id"]) != nodeRunID {
			continue
		}
		return row
	}
	return nil
}

func latestWorkspaceChildAsset(ctx context.Context, projectID uint64, nodeRunID uint64) (map[string]any, map[string]any) {
	if projectID == 0 || nodeRunID == 0 {
		return nil, nil
	}
	var latest *assetmodel.Version
	for _, row := range assetmodel.NewVersionModel().Select(ctx, map[string]any{"node_run_id": nodeRunID}) {
		if row == nil {
			continue
		}
		if latest == nil || row.ID > latest.ID {
			latest = row
		}
	}
	if latest == nil {
		return nil, nil
	}
	asset := assetservice.NewService().FindProjectAsset(ctx, projectID, latest.AssetID)
	if asset == nil {
		return nil, nil
	}
	assetPayload := assetservice.NewService().AssetDetailMap(ctx, *asset, latest)
	versionPayload := assetservice.VersionToMap(*latest)
	assetPayload["version"] = versionPayload
	return assetPayload, versionPayload
}

func (s WorkspaceService) finishWorkspaceRunFromNodeResults(ctx context.Context, run *teammodel.Run, input map[string]any, plan map[string]any, nodeResults []map[string]any) {
	status := workspaceRunStatusFromNodeResults(plan, nodeResults)
	if status == "" || status == teammodel.RunStatusRunning {
		if run != nil && !workspaceHasActiveNodeExecution(ctx, run.ProjectID, run.ID) {
			updateWorkspaceExecutionStatus(ctx, run.ID, teammodel.RunStatusRunning, "")
		}
		return
	}
	output := map[string]any{
		"run_id":         run.ID,
		"request_id":     run.RequestID,
		"release_id":     run.ReleaseID,
		"status":         status,
		"executed":       len(nodeResults),
		"node_results":   nodeResults,
		"node_runs":      workspaceNodeRunPayloads(ctx, run.ID),
		"execution_plan": plan,
		"output":         workspaceRunOutputFromNodeResults(nodeResults),
	}
	if input != nil {
		output["asset_cate_id"] = uint64Value(input["_asset_cate_id"])
		output["start_node_id"] = strings.TrimSpace(textValue(input["_start_node_id"]))
	}
	errorText := workspaceRunErrorFromNodeResults(nodeResults)
	finishWorkspaceRun(ctx, run.ID, status, output, errorText)
	resultStatus := 1
	if status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled {
		resultStatus = 2
	}
	s.writeWorkspaceRunResult(ctx, run, output, errorText, resultStatus)
}

func workspaceRunStatusFromNodeResults(plan map[string]any, nodeResults []map[string]any) string {
	if len(nodeResults) == 0 {
		return teammodel.RunStatusRunning
	}
	for _, result := range nodeResults {
		switch textValue(result["status"]) {
		case teammodel.RunStatusWaiting:
			return teammodel.RunStatusWaiting
		case teammodel.RunStatusFail, teammodel.RunStatusCanceled:
			return textValue(result["status"])
		}
	}
	if len(nodeResults) < len(runnableWorkspaceRunPlanNodes(plan)) {
		return teammodel.RunStatusRunning
	}
	return teammodel.RunStatusSuccess
}

func runnableWorkspaceRunPlanNodes(plan map[string]any) []map[string]any {
	nodes := []map[string]any{}
	for _, raw := range sliceValue(plan["nodes"]) {
		node := mapValue(raw)
		if node == nil {
			continue
		}
		switch textValue(node["type"]) {
		case "asset", "power", "agent", "flow":
			nodes = append(nodes, node)
		case "function":
			key := textValue(node["function_key"])
			if key == "save" || key == "display" {
				nodes = append(nodes, node)
			}
		}
	}
	return nodes
}

func workspaceRunOutputFromNodeResults(nodeResults []map[string]any) any {
	if len(nodeResults) == 0 {
		return map[string]any{}
	}
	return firstPresent(nodeResults[len(nodeResults)-1]["output"], nodeResults[len(nodeResults)-1]["result"])
}

func workspaceRunErrorFromNodeResults(nodeResults []map[string]any) string {
	for _, result := range nodeResults {
		if errText := textValue(valueAtPath(result, "result", "error")); errText != "" {
			return errText
		}
		if textValue(result["status"]) == teammodel.RunStatusFail {
			return fmt.Sprintf("%s 节点运行失败", textValue(result["node_key"]))
		}
	}
	return ""
}
