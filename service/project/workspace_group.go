package project

import (
	"context"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
)

const (
	canvasGroupsExpandedKey      = "_groups_expanded"
	canvasGroupExecutionParallel = 4
)

func validateCanvasGroups(nodes map[string]canvasRunNode, edges []canvasRunEdge) error {
	for _, node := range nodes {
		if node.Type == "group" && node.GroupID != "" {
			return fmt.Errorf("分组不能嵌套")
		}
		if node.GroupID == "" {
			continue
		}
		group, ok := nodes[node.GroupID]
		if !ok || group.Type != "group" {
			return fmt.Errorf("节点 %s 引用了不存在的分组", canvasRunNodeTitle(node))
		}
	}
	for _, edge := range edges {
		source, sourceOK := nodes[edge.From]
		target, targetOK := nodes[edge.To]
		if !sourceOK || !targetOK {
			continue
		}
		if edge.LogicalFrom != "" && edge.LogicalFrom != edge.From {
			logicalSource, ok := nodes[edge.LogicalFrom]
			if !ok || source.Type != "group" || logicalSource.GroupID != source.ID {
				return fmt.Errorf("分组连线来源无效")
			}
		}
		if edge.LogicalTo != "" && edge.LogicalTo != edge.To {
			logicalTarget, ok := nodes[edge.LogicalTo]
			if !ok || target.Type != "group" || logicalTarget.GroupID != target.ID {
				return fmt.Errorf("分组连线目标无效")
			}
		}
		if source.Type == "group" && target.GroupID == source.ID {
			return fmt.Errorf("分组边界不能直接连接自己的成员")
		}
		if target.Type == "group" && source.GroupID == target.ID {
			return fmt.Errorf("分组成员不能直接连接自己的分组边界")
		}
		if source.GroupID == target.GroupID {
			continue
		}
		if source.Type != "group" && source.GroupID != "" {
			return fmt.Errorf("组内节点不能直接连接组外节点")
		}
		if target.Type != "group" && target.GroupID != "" {
			return fmt.Errorf("组外节点不能直接连接组内节点")
		}
	}
	return nil
}

func validateReachableCanvasGroups(
	nodes map[string]canvasRunNode,
	edges []canvasRunEdge,
	startNodeID string,
	singleNode bool,
) error {
	start := nodes[startNodeID]
	if singleNode && start.Type != "group" {
		return nil
	}
	reachable := map[string]bool{startNodeID: true}
	if !singleNode {
		outgoing := map[string][]string{}
		for _, edge := range edges {
			outgoing[edge.From] = append(outgoing[edge.From], edge.To)
		}
		reachableNodes, _ := canvasReachableExecutionNodes(startNodeID, nodes, outgoing)
		for nodeID := range reachableNodes {
			reachable[nodeID] = true
		}
	}
	runnableMembers := map[string]bool{}
	for _, node := range nodes {
		if node.GroupID != "" && isRunnableCanvasNode(node) {
			runnableMembers[node.GroupID] = true
		}
	}
	for nodeID := range reachable {
		node := nodes[nodeID]
		if node.Type == "group" && !runnableMembers[node.ID] {
			return fmt.Errorf("分组 %s 内暂无可运行节点", canvasRunNodeTitle(node))
		}
	}
	return nil
}

func prepareCanvasRunGraph(
	canvas map[string]any,
	nodes map[string]canvasRunNode,
	edges []canvasRunEdge,
	startNodeID string,
	singleNode bool,
) (map[string]any, []canvasRunEdge) {
	omitGroupOutputs := ""
	if singleNode && nodes[startNodeID].Type == "group" {
		omitGroupOutputs = startNodeID
	}
	expanded := expandCanvasGroupEdges(canvas, nodes, edges, omitGroupOutputs)
	runtimeCanvas := cloneCanvasObject(canvas)
	runtimeCanvas[canvasGroupsExpandedKey] = true
	runtimeCanvas["edges"] = canvasRunEdgesPayload(expanded)
	return runtimeCanvas, expanded
}

func expandCanvasGroupEdges(
	canvas map[string]any,
	nodes map[string]canvasRunNode,
	edges []canvasRunEdge,
	omitGroupOutputs string,
) []canvasRunEdge {
	members := map[string][]canvasRunNode{}
	for groupID, memberIDs := range canvasGroupMemberNodeIDs(canvas) {
		for _, memberID := range memberIDs {
			if member, ok := nodes[memberID]; ok {
				members[groupID] = append(members[groupID], member)
			}
		}
	}

	result := make([]canvasRunEdge, 0, len(edges)+len(nodes))
	seen := map[string]bool{}
	appendEdge := func(edge canvasRunEdge) {
		if edge.From == "" || edge.To == "" || edge.From == edge.To {
			return
		}
		key := edge.From + "\x00" + edge.To + "\x00" + edge.Purpose + "\x00" + edge.MediaUsage
		if seen[key] {
			return
		}
		seen[key] = true
		if strings.TrimSpace(edge.ID) == "" {
			edge.ID = "group-edge-" + edge.From + "-" + edge.To
		}
		result = append(result, edge)
	}

	for _, edge := range edges {
		source := nodes[edge.From]
		if source.Type == "group" {
			if source.ID == omitGroupOutputs {
				continue
			}
			if logicalSource, ok := nodes[edge.LogicalFrom]; edge.LogicalFrom != "" &&
				edge.LogicalFrom != source.ID &&
				ok &&
				logicalSource.GroupID == source.ID {
				appendEdge(canvasRunEdge{
					ID:         edge.ID,
					From:       logicalSource.ID,
					To:         edge.To,
					Purpose:    edge.Purpose,
					MediaUsage: edge.MediaUsage,
				})
				continue
			}
			for _, member := range members[source.ID] {
				appendEdge(canvasRunEdge{
					ID:         "group-output-" + member.ID + "-" + edge.To,
					From:       member.ID,
					To:         edge.To,
					Purpose:    edge.Purpose,
					MediaUsage: edge.MediaUsage,
				})
			}
			continue
		}
		appendEdge(edge)
	}
	for groupID, groupMembers := range members {
		for _, member := range groupMembers {
			appendEdge(canvasRunEdge{
				ID:      "group-input-" + groupID + "-" + member.ID,
				From:    groupID,
				To:      member.ID,
				Purpose: canvasEdgePurposeDependency,
			})
		}
	}
	return result
}

func canvasRunEdgesPayload(edges []canvasRunEdge) []any {
	result := make([]any, 0, len(edges))
	for _, edge := range edges {
		row := map[string]any{
			"id":      edge.ID,
			"from":    edge.From,
			"to":      edge.To,
			"purpose": edge.Purpose,
		}
		if edge.MediaUsage != "" {
			row["media_usage"] = edge.MediaUsage
		}
		result = append(result, row)
	}
	return result
}

func canvasGroupMemberNodeIDs(canvas map[string]any) map[string][]string {
	result := map[string][]string{}
	for _, raw := range sliceValue(canvas["nodes"]) {
		node := mapValue(raw)
		groupID := textValue(node["group_id"])
		nodeID := textValue(node["id"])
		if groupID == "" || nodeID == "" {
			continue
		}
		result[groupID] = append(result[groupID], nodeID)
	}
	return result
}

func mergeCanvasContextOutputs(values ...any) any {
	result := make([]any, 0, len(values))
	for _, value := range values {
		if value == nil {
			continue
		}
		switch textValue(valueAtPath(value, "type")) {
		case "group_output", "reference_output":
			result = append(result, value)
			continue
		}
		if sources := sliceValue(valueAtPath(value, "sources")); len(sources) > 0 {
			result = append(result, sources...)
			continue
		}
		result = append(result, value)
	}
	if len(result) == 0 {
		return nil
	}
	if len(result) == 1 {
		return result[0]
	}
	return map[string]any{"sources": result}
}

func (s WorkspaceService) executeCanvasGroupRunnableNodes(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	plan canvasExecutionPlan,
	runnableNodes []canvasRunNode,
	flowRunID uint64,
	nodeRuns map[string]uint64,
	existingResults []canvasNodeResult,
) (map[string]any, error) {
	batch := s.executeCanvasGroupNodeBatch(
		ctx,
		req,
		run,
		plan,
		runnableNodes,
		flowRunID,
		nodeRuns,
		existingResults,
	)
	return s.finishCanvasRunnableNodes(
		ctx,
		req,
		run,
		plan,
		batch.Status,
		batch.LastPayload,
		batch.Results,
		flowRunID,
	), nil
}

type canvasGroupNodeBatch struct {
	Status      string
	LastPayload map[string]any
	Results     []canvasNodeResult
}

func (s WorkspaceService) executeCanvasGroupNodeBatch(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	plan canvasExecutionPlan,
	runnableNodes []canvasRunNode,
	flowRunID uint64,
	nodeRuns map[string]uint64,
	existingResults []canvasNodeResult,
) canvasGroupNodeBatch {
	if len(runnableNodes) == 0 {
		return canvasGroupNodeBatch{
			Status:  teammodel.RunStatusSuccess,
			Results: append([]canvasNodeResult{}, existingResults...),
		}
	}

	results := append([]canvasNodeResult{}, existingResults...)
	nodeByID := make(map[string]canvasRunNode, len(runnableNodes))
	statusByID := map[string]string{}
	for _, node := range runnableNodes {
		nodeByID[node.ID] = node
	}
	for _, result := range existingResults {
		statusByID[result.NodeKey] = canvasRunStatus(result.Payload)
	}
	pending := map[string]bool{}
	for _, node := range runnableNodes {
		if !canvasRunStatusFinished(statusByID[node.ID]) {
			pending[node.ID] = true
		}
	}
	var lastPayload map[string]any
	var errorPayload map[string]any
	if len(results) > 0 {
		lastPayload = results[len(results)-1].Payload
		for _, result := range results {
			status := canvasRunStatus(result.Payload)
			if status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled {
				errorPayload = result.Payload
				break
			}
		}
	}

	for len(pending) > 0 {
		if workspaceRunCanceled(ctx, run.ID) {
			return canvasGroupNodeBatch{
				Status:      teammodel.RunStatusCanceled,
				LastPayload: map[string]any{"status": teammodel.RunStatusCanceled},
				Results:     results,
			}
		}
		blocked := make([]canvasRunNode, 0)
		ready := make([]canvasRunNode, 0)
		for _, node := range runnableNodes {
			if !pending[node.ID] {
				continue
			}
			dependencyFailed := false
			dependenciesReady := true
			for _, upstreamID := range canvasRunnableNodeDependencyIDs(req, plan, node) {
				if _, tracked := nodeByID[upstreamID]; !tracked {
					continue
				}
				switch statusByID[upstreamID] {
				case teammodel.RunStatusSuccess:
				case teammodel.RunStatusFail, teammodel.RunStatusCanceled:
					dependencyFailed = true
				default:
					dependenciesReady = false
				}
			}
			if dependencyFailed {
				blocked = append(blocked, node)
			} else if dependenciesReady {
				ready = append(ready, node)
			}
		}

		for _, node := range blocked {
			blockedErr := fmt.Errorf("上游节点运行失败，当前节点未执行")
			payload := canvasNodeRunPayload(req, run, node, nodeRuns[node.ID], map[string]any{
				"status": teammodel.RunStatusFail,
				"error":  blockedErr.Error(),
			})
			s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRuns[node.ID], teammodel.RunStatusFail, payload, blockedErr)
			s.writeWorkspaceNodeEvent(ctx, run, node, nodeRuns[node.ID], "node_finished", teammodel.RunStatusFail, payload)
			results = append(results, canvasNodeResult{NodeKey: node.ID, Payload: payload})
			statusByID[node.ID] = teammodel.RunStatusFail
			delete(pending, node.ID)
			lastPayload = payload
			if errorPayload == nil {
				errorPayload = payload
			}
		}

		if len(ready) == 0 {
			if len(blocked) > 0 {
				continue
			}
			break
		}
		if req.ExecutionScope == canvasExecutionScopeStoryboardFrame {
			ready = interleaveCanvasStoryboardReadyNodes(ready)
		}

		snapshot := append([]canvasNodeResult{}, results...)
		completed := make(chan canvasRunnableNodeResult, len(ready))
		jobs := make(chan canvasRunNode, len(ready))
		for _, node := range ready {
			jobs <- node
		}
		close(jobs)
		workerCount := canvasGroupExecutionParallel
		if len(ready) < workerCount {
			workerCount = len(ready)
		}
		for worker := 0; worker < workerCount; worker++ {
			go func() {
				for node := range jobs {
					completed <- s.executeCanvasGroupReadyNode(
						ctx,
						req,
						run,
						plan,
						node,
						flowRunID,
						nodeRuns[node.ID],
						snapshot,
					)
				}
			}()
		}
		completedByID := make(map[string]canvasRunnableNodeResult, len(ready))
		for range ready {
			execution := <-completed
			completedByID[execution.Node.ID] = execution
		}
		for _, node := range ready {
			execution := completedByID[node.ID]
			results = append(results, canvasNodeResult{
				NodeKey: node.ID,
				Payload: execution.Payload,
			})
			statusByID[node.ID] = execution.Status
			delete(pending, node.ID)
			lastPayload = execution.Payload
			if (execution.Status == teammodel.RunStatusFail || execution.Status == teammodel.RunStatusCanceled) && errorPayload == nil {
				errorPayload = execution.Payload
			}
		}
	}

	status := canvasGroupRunStatus(statusByID, pending)
	if workspaceRunCanceled(ctx, run.ID) {
		status = teammodel.RunStatusCanceled
	}
	if (status == teammodel.RunStatusFail || status == teammodel.RunStatusCanceled) && errorPayload != nil {
		lastPayload = errorPayload
	}
	return canvasGroupNodeBatch{
		Status:      status,
		LastPayload: lastPayload,
		Results:     results,
	}
}

func (s WorkspaceService) executeCanvasGroupReadyNode(
	ctx context.Context,
	req CanvasRunRequest,
	run *teammodel.Run,
	plan canvasExecutionPlan,
	node canvasRunNode,
	flowRunID uint64,
	nodeRunID uint64,
	results []canvasNodeResult,
) (execution canvasRunnableNodeResult) {
	defer func() {
		if recovered := recover(); recovered != nil {
			if workspaceRunCanceled(ctx, run.ID) {
				execution = s.canceledCanvasRunnableNodeResult(ctx, req, run, node, nodeRunID)
				return
			}
			runErr := fmt.Errorf("节点执行异常: %v", recovered)
			payload := canvasNodeRunPayload(req, run, node, nodeRunID, map[string]any{
				"status": teammodel.RunStatusFail,
				"error":  runErr.Error(),
			})
			execution = canvasRunnableNodeResult{
				Node:    node,
				Payload: payload,
				Status:  teammodel.RunStatusFail,
				Err:     runErr,
			}
			func() {
				defer func() { _ = recover() }()
				s.recordCanvasNodeRunResult(ctx, req, run, node, nodeRunID, teammodel.RunStatusFail, payload, runErr)
				s.writeWorkspaceNodeEvent(ctx, run, node, nodeRunID, "node_finished", teammodel.RunStatusFail, payload)
			}()
		}
	}()
	return s.executeCanvasRunnableNode(ctx, req, run, plan, node, flowRunID, nodeRunID, results)
}

func canvasRunnableNodesInGroup(nodes []canvasRunNode, groupID string) []canvasRunNode {
	result := make([]canvasRunNode, 0)
	for _, node := range nodes {
		if node.GroupID == groupID {
			result = append(result, node)
		}
	}
	return result
}

func canvasGroupRunStatus(statusByID map[string]string, pending map[string]bool) string {
	hasFail := false
	hasCanceled := false
	hasWaiting := false
	hasRunning := false
	for _, status := range statusByID {
		switch status {
		case teammodel.RunStatusWaiting:
			hasWaiting = true
		case teammodel.RunStatusRunning, teammodel.RunStatusPending:
			hasRunning = true
		case teammodel.RunStatusFail:
			hasFail = true
		case teammodel.RunStatusCanceled:
			hasCanceled = true
		}
	}
	if hasRunning {
		return teammodel.RunStatusRunning
	}
	if hasWaiting {
		return teammodel.RunStatusWaiting
	}
	if len(pending) > 0 {
		return teammodel.RunStatusRunning
	}
	if hasFail {
		return teammodel.RunStatusFail
	}
	if hasCanceled {
		return teammodel.RunStatusCanceled
	}
	return teammodel.RunStatusSuccess
}

func canvasGroupRunOutput(plan canvasExecutionPlan, results []canvasNodeResult) map[string]any {
	runnable := map[string]canvasRunNode{}
	for _, node := range plan.Nodes {
		if isRunnableCanvasNode(node) {
			runnable[node.ID] = node
		}
	}
	terminal := map[string]bool{}
	for nodeID := range runnable {
		terminal[nodeID] = true
		for _, targetID := range plan.Outgoing[nodeID] {
			if _, ok := runnable[targetID]; ok {
				terminal[nodeID] = false
				break
			}
		}
	}
	sources := make([]map[string]any, 0, len(terminal))
	for _, node := range plan.Nodes {
		if !terminal[node.ID] {
			continue
		}
		result := lastCanvasNodeResult(results, node.ID)
		output := firstPresent(result["output"], valueAtPath(result, "result", "output"))
		if output == nil {
			continue
		}
		sources = append(sources, canvasRunNodeGroupOutputSource(node, result, output))
	}
	return map[string]any{
		"type":     "group_output",
		"group_id": plan.Start.ID,
		"sources":  sources,
	}
}

func lastCanvasNodeResult(results []canvasNodeResult, nodeID string) map[string]any {
	for index := len(results) - 1; index >= 0; index-- {
		if results[index].NodeKey != nodeID {
			continue
		}
		return firstCanvasNodeResult(results[index].Payload)
	}
	return map[string]any{}
}

func canvasGroupOutputSource(node map[string]any, result map[string]any, output any) map[string]any {
	return newCanvasGroupOutputSource(
		textValue(node["id"]),
		firstText(node["title"], node["id"]),
		textValue(node["kind"]),
		textValue(node["output_type"]),
		uint64Value(firstPresent(valueAtPath(result, "asset", "id"), valueAtPath(node, "asset", "id"))),
		uint64Value(firstPresent(
			valueAtPath(result, "version", "id"),
			valueAtPath(result, "asset", "version", "id"),
			valueAtPath(node, "asset", "version", "id"),
			valueAtPath(node, "asset", "version_id"),
		)),
		output,
	)
}

func canvasRunNodeGroupOutputSource(node canvasRunNode, result map[string]any, output any) map[string]any {
	return newCanvasGroupOutputSource(
		node.ID,
		canvasRunNodeTitle(node),
		node.Kind,
		node.OutputType,
		uint64Value(valueAtPath(result, "asset", "id")),
		uint64Value(firstPresent(valueAtPath(result, "version", "id"), valueAtPath(result, "asset", "version", "id"))),
		output,
	)
}

func newCanvasGroupOutputSource(
	nodeID string,
	title string,
	kind string,
	outputType string,
	assetID uint64,
	versionID uint64,
	output any,
) map[string]any {
	return map[string]any{
		"node_id":     nodeID,
		"title":       title,
		"kind":        kind,
		"output_type": outputType,
		"asset_id":    assetID,
		"version_id":  versionID,
		"output":      output,
	}
}

func canvasGroupRunOutputFromRecords(
	groupID string,
	plan map[string]any,
	nodeResults []map[string]any,
) map[string]any {
	runnable := map[string]map[string]any{}
	for _, raw := range sliceValue(plan["nodes"]) {
		node := mapValue(raw)
		if node == nil {
			continue
		}
		typeName := textValue(node["type"])
		functionKey := textValue(node["function_key"])
		if canvasRunNodePersistsResult(typeName, functionKey) ||
			(typeName == "function" && functionKey == "display") {
			runnable[textValue(node["id"])] = node
		}
	}
	outgoing := mapValue(plan["outgoing"])
	resultByNode := map[string]map[string]any{}
	for _, result := range nodeResults {
		resultByNode[textValue(result["node_key"])] = result
	}
	sources := []map[string]any{}
	for _, raw := range sliceValue(plan["nodes"]) {
		node := mapValue(raw)
		nodeID := textValue(node["id"])
		if _, ok := runnable[nodeID]; !ok {
			continue
		}
		terminal := true
		for _, targetRaw := range sliceValue(outgoing[nodeID]) {
			if _, ok := runnable[textValue(targetRaw)]; ok {
				terminal = false
				break
			}
		}
		if !terminal {
			continue
		}
		result := resultByNode[nodeID]
		output := firstPresent(result["output"], valueAtPath(result, "result", "output"))
		if output == nil {
			continue
		}
		sources = append(sources, canvasGroupOutputSource(node, result, output))
	}
	return map[string]any{
		"type":     "group_output",
		"group_id": groupID,
		"sources":  sources,
	}
}

func canvasGroupPreviousOutput(
	ctx context.Context,
	projectID uint64,
	groupID string,
	results []canvasNodeResult,
	canvas map[string]any,
) any {
	if len(upstreamCanvasNodeIDs(groupID, canvas)) == 0 {
		return nil
	}
	return previousCanvasOutput(ctx, projectID, groupID, results, canvas)
}
