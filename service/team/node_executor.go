package team

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	memorymodel "github.com/dever-package/bot/model/memory"
	teammodel "github.com/dever-package/bot/model/team"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	assetservice "github.com/dever-package/bot/service/asset"
	memoryservice "github.com/dever-package/bot/service/memory"
	"github.com/dever-package/bot/service/stream"
)

type resolvedNodeAgent struct {
	AgentID uint64
	Role    *teammodel.Role
}

const (
	knowledgeQueryInputLimit    = 6000
	knowledgeInitTextLimit      = 1600
	knowledgeFileTextLimit      = 1200
	knowledgeFileReadLimit      = 2400
	knowledgeFileReadTotalLimit = 6000
	knowledgeFileReadMaxHits    = 3
)

func (s Service) executeNodeDAG(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge) (string, map[string]any, error) {
	nodeByID := map[uint64]teammodel.FlowNode{}
	incoming := map[uint64][]teammodel.FlowNodeEdge{}
	for _, node := range nodes {
		nodeByID[node.ID] = node
	}
	for _, edge := range edges {
		incoming[edge.ToNodeID] = append(incoming[edge.ToNodeID], edge)
	}
	completed := s.completedNodes(ctx, flowRun.ID)
	skipped := map[uint64]bool{}
	for len(completed)+len(skipped) < len(nodes) {
		if s.runCanceled(ctx, run.ID) {
			return teammodel.RunStatusCanceled, s.repo.ListBlackboard(ctx, flowRun.ID), fmt.Errorf("运行已取消")
		}
		blackboard := s.repo.ListBlackboard(ctx, flowRun.ID)
		ready := make([]teammodel.FlowNode, 0)
		hasWaiting := false
		for _, node := range nodes {
			if completed[node.ID] {
				continue
			}
			if skipped[node.ID] {
				continue
			}
			if nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID); nodeRun != nil && nodeRun.Status == teammodel.RunStatusWaiting {
				hasWaiting = true
				continue
			}
			if nodeReady(node.ID, incoming, completed, skipped, blackboard, nodeByID) {
				ready = append(ready, node)
			}
		}
		if len(ready) == 0 {
			if hasWaiting {
				return teammodel.RunStatusWaiting, blackboard, runWaitError{message: "等待交互"}
			}
			marked := markSkippedNodes(nodes, incoming, completed, skipped, blackboard, nodeByID)
			if marked {
				continue
			}
			return teammodel.RunStatusFail, blackboard, fmt.Errorf("节点 DAG 无可执行节点")
		}
		results := s.executeReadyNodes(ctx, run, flowRun, team, roles, flow, ready, incoming, nodeByID)
		for _, result := range results {
			if result.status == teammodel.RunStatusSuccess {
				completed[result.nodeID] = true
			}
		}
		for _, result := range results {
			if result.status == teammodel.RunStatusWaiting {
				continue
			}
			if result.err != nil {
				return result.status, s.repo.ListBlackboard(ctx, flowRun.ID), result.err
			}
			if result.status != teammodel.RunStatusSuccess {
				return result.status, s.repo.ListBlackboard(ctx, flowRun.ID), fmt.Errorf("节点执行失败: %s", result.nodeName)
			}
		}
	}
	return teammodel.RunStatusSuccess, s.repo.ListBlackboard(ctx, flowRun.ID), nil
}

type nodeExecutionResult struct {
	nodeID   uint64
	nodeName string
	status   string
	err      error
}

func (s Service) executeReadyNodes(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, ready []teammodel.FlowNode, incoming map[uint64][]teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) []nodeExecutionResult {
	results := make([]nodeExecutionResult, len(ready))
	var wg sync.WaitGroup
	for index, node := range ready {
		s.writeEdgeActiveEvents(ctx, run, flowRun, flow, node, incoming[node.ID], nodeByID)
		index := index
		node := node
		wg.Add(1)
		go func() {
			defer wg.Done()
			defer func() {
				if recovered := recover(); recovered != nil {
					results[index] = nodeExecutionResult{
						nodeID:   node.ID,
						nodeName: node.Name,
						status:   teammodel.RunStatusFail,
						err:      runtimePanicError(recovered),
					}
				}
			}()
			status, err := s.executeNode(ctx, run, flowRun, team, roles, flow, node, incoming[node.ID], nodeByID)
			results[index] = nodeExecutionResult{
				nodeID:   node.ID,
				nodeName: node.Name,
				status:   status,
				err:      err,
			}
		}()
	}
	wg.Wait()
	return results
}

func (s Service) completedNodes(ctx context.Context, flowRunID uint64) map[uint64]bool {
	result := map[uint64]bool{}
	rows := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"flow_run_id": flowRunID})
	for _, row := range rows {
		if row != nil && row.Status == teammodel.RunStatusSuccess {
			result[row.NodeID] = true
		}
	}
	return result
}

func nodeReady(nodeID uint64, incoming map[uint64][]teammodel.FlowNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]teammodel.FlowNode) bool {
	edges := incoming[nodeID]
	if len(edges) == 0 {
		return true
	}
	if nodeByID[nodeID].Type == teammodel.NodeTypeMerge {
		hasCompletedInput := false
		for _, edge := range edges {
			if skipped[edge.FromNodeID] {
				continue
			}
			if !completed[edge.FromNodeID] {
				return false
			}
			if !edgeConditionPassed(edge.Condition, nodeByID[edge.FromNodeID], blackboard) {
				return false
			}
			hasCompletedInput = true
		}
		return hasCompletedInput
	}
	for _, edge := range edges {
		if skipped[edge.FromNodeID] {
			return false
		}
		if !completed[edge.FromNodeID] {
			return false
		}
		if !edgeConditionPassed(edge.Condition, nodeByID[edge.FromNodeID], blackboard) {
			return false
		}
	}
	return true
}

func markSkippedNodes(nodes []teammodel.FlowNode, incoming map[uint64][]teammodel.FlowNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]teammodel.FlowNode) bool {
	marked := false
	for _, node := range nodes {
		if completed[node.ID] || skipped[node.ID] {
			continue
		}
		edges := incoming[node.ID]
		if len(edges) == 0 {
			continue
		}
		resolved := true
		for _, edge := range edges {
			if !completed[edge.FromNodeID] && !skipped[edge.FromNodeID] {
				resolved = false
				break
			}
		}
		if resolved && !nodeReady(node.ID, incoming, completed, skipped, blackboard, nodeByID) {
			skipped[node.ID] = true
			marked = true
		}
	}
	return marked
}

func edgeConditionPassed(condition string, fromNode teammodel.FlowNode, blackboard map[string]any) bool {
	condition = strings.ToLower(strings.TrimSpace(condition))
	if condition == "" || condition == "always" || condition == "completed" || condition == "success" {
		return true
	}
	output := nodeOutput(fromNode, blackboard)
	switch condition {
	case "passed":
		return boolValue(output["passed"])
	case "failed":
		value, exists := output["passed"]
		return exists && !boolValue(value)
	case "approved":
		return strings.EqualFold(textValue(output["decision"]), "approved")
	case "rejected":
		return strings.EqualFold(textValue(output["decision"]), "rejected")
	default:
		return true
	}
}

func nodeOutput(node teammodel.FlowNode, blackboard map[string]any) map[string]any {
	config := jsonMap(node.Config)
	for _, key := range nodeOutputKeys(node, config) {
		if value, ok := blackboard[key]; ok {
			return mapValue(value)
		}
	}
	return map[string]any{}
}

func (s Service) executeNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (string, error) {
	blackboard := s.repo.ListBlackboard(ctx, flowRun.ID)
	config := jsonMap(node.Config)
	input := s.nodeInput(ctx, flowRun.ID, config, blackboard, incoming, nodeByID)
	nodeRunID := s.repo.FindOrCreateNodeRun(ctx, run, flowRun, node, input)
	nodeRun := s.repo.FindNodeRun(ctx, nodeRunID)
	if nodeRun == nil {
		return teammodel.RunStatusFail, fmt.Errorf("创建节点运行失败")
	}
	startedAt := time.Now()
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"input":      jsonText(input),
		"error":      "",
		"started_at": startedAt,
	})
	nodeRun.Status = teammodel.RunStatusRunning
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeStarted, map[string]any{
		"input":      input,
		"started_at": startedAt.Format(time.RFC3339Nano),
	})

	output, status, agentRunID, err := s.runNodeByType(ctx, run, flowRun, team, roles, flow, node, config, input, blackboard, incoming, nodeByID)
	if s.runCanceled(ctx, run.ID) {
		status = teammodel.RunStatusCanceled
		err = context.Canceled
	}
	finishedAt := time.Now()
	record := map[string]any{
		"status":       status,
		"output":       jsonText(output),
		"agent_run_id": agentRunID,
		"error":        "",
	}
	if status != teammodel.RunStatusWaiting {
		record["finished_at"] = finishedAt
	}
	if err != nil && status != teammodel.RunStatusWaiting {
		record["error"] = err.Error()
	}
	if !s.repo.UpdateNodeRunUnlessCanceled(ctx, nodeRun.ID, record) {
		current := s.repo.FindNodeRun(ctx, nodeRun.ID)
		if current != nil && current.Status == teammodel.RunStatusCanceled {
			status = teammodel.RunStatusCanceled
			err = context.Canceled
		}
	}
	nodeRun.Status = status
	nodeRun.AgentRunID = agentRunID
	if status == teammodel.RunStatusSuccess {
		s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeOutput, map[string]any{
			"output": output,
		})
	}
	event := stream.EventNodeFinished
	if status == teammodel.RunStatusWaiting {
		event = stream.EventWaiting
	}
	fields := map[string]any{
		"output":       output,
		"agent_run_id": agentRunID,
		"error":        nodeExecutionError(status, err),
	}
	if status != teammodel.RunStatusWaiting {
		fields["finished_at"] = finishedAt.Format(time.RFC3339Nano)
	}
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, event, fields)
	if status == teammodel.RunStatusSuccess {
		for _, key := range nodeOutputKeys(node, config) {
			s.writeBlackboard(ctx, run, flowRun, key, output, "node", nodeRun.ID)
		}
		s.repo.InsertMessage(ctx, map[string]any{
			"run_id":      run.ID,
			"flow_run_id": flowRun.ID,
			"node_run_id": nodeRun.ID,
			"team_id":     team.ID,
			"flow_id":     flow.ID,
			"node_id":     node.ID,
			"type":        "artifact",
			"role":        node.Type,
			"content":     jsonText(output),
		})
	}
	return status, err
}

func nodeExecutionError(status string, err error) string {
	if status == teammodel.RunStatusWaiting {
		return ""
	}
	return errorText(err)
}

func (s Service) nodeInput(ctx context.Context, flowRunID uint64, config map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) map[string]any {
	keys := stringSlice(config["input_keys"])
	result := map[string]any{}
	if len(keys) == 0 {
		for key, value := range blackboard {
			result[key] = value
		}
	} else {
		for _, key := range keys {
			if value, exists := blackboard[key]; exists {
				result[key] = value
			}
		}
	}
	for _, edge := range incoming {
		fromNode := nodeByID[edge.FromNodeID]
		output := s.resolvedNodeOutput(ctx, flowRunID, fromNode, blackboard)
		if fromNode.ID == 0 || len(output) == 0 {
			continue
		}
		if fromNode.NodeKey != "" {
			result[fromNode.NodeKey] = output
		}
		result[fmt.Sprintf("node_%d", edge.FromNodeID)] = output
	}
	return result
}

func (s Service) runNodeByType(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (map[string]any, string, uint64, error) {
	switch node.Type {
	case teammodel.NodeTypeAgent, teammodel.NodeTypeRole:
		return s.runAgentNode(ctx, run, flowRun, team, roles, flow, node, config, input)
	case teammodel.NodeTypePower:
		return s.runPowerNode(ctx, run, flowRun, flow, node, config, input)
	case teammodel.NodeTypeTeam:
		return s.runSubTeamNode(ctx, run, flowRun, team, flow, node, config, input)
	case teammodel.NodeTypeContext:
		return s.runContextNode(ctx, run, node, config)
	case teammodel.NodeTypeKnowledge:
		return s.runKnowledgeNode(ctx, node, config, input)
	case teammodel.NodeTypeCondition:
		return runConditionNode(config, input), teammodel.RunStatusSuccess, 0, nil
	case teammodel.NodeTypeMerge:
		return s.runMergeNode(ctx, flowRun.ID, node, config, input, blackboard, incoming, nodeByID), teammodel.RunStatusSuccess, 0, nil
	case teammodel.NodeTypeHumanApproval:
		return s.waitHumanNode(ctx, run, flowRun, team, flow, node, config, input)
	case teammodel.NodeTypeSave:
		return s.runSaveNode(ctx, run, flowRun, team, flow, node, blackboard, incoming, nodeByID)
	default:
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("不支持的节点类型: %s", node.Type)
	}
}

func (s Service) runAgentNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	executor, err := s.resolveNodeAgent(ctx, team.ID, roles, node, config)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	return s.executeAgentNode(ctx, run, flowRun, team, flow, node, config, input, executor)
}

func (s Service) runKnowledgeNode(ctx context.Context, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	baseID := uint64Value(config["knowledge_base_id"])
	if baseID == 0 {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("知识库节点未选择知识库: %s", node.Name)
	}
	displayQuery := firstText(config["query"], config["goal"], node.Name)
	query := buildKnowledgeNodeQuery(node, config, input)
	if query == "" {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("知识库节点查询内容不能为空: %s", node.Name)
	}
	limit := intValue(config["retrieve_limit"], 0)
	result, err := s.knowledge.SearchKnowledgeNodes(ctx, baseID, query, limit)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	fileHits, fileErr := s.knowledge.SearchKnowledgeRuntimeFiles(ctx, baseID, query, limit)
	fileContents, fileReadErrs := s.readKnowledgeFileHitContents(ctx, baseID, fileHits)
	initContent, initFound, initErr := s.knowledge.OpenKnowledgeInitFile(ctx, baseID, knowledgeInitTextLimit)
	nodes := knowledgeNodeOutputs(result.Nodes)
	files := knowledgeFileHitOutputs(fileHits, fileContents)
	return map[string]any{
		"kind":              "knowledge",
		"knowledge_base_id": baseID,
		"query":             query,
		"text":              knowledgeCombinedText(displayQuery, result.Nodes, fileHits, fileContents, initContent, initFound),
		"nodes":             nodes,
		"files":             files,
		"init":              knowledgeInitOutput(initContent, initFound),
		"source_counts": map[string]any{
			"nodes":      len(nodes),
			"files":      len(files),
			"file_texts": len(fileContents),
			"init":       initFound,
		},
		"warnings":   knowledgeNodeWarnings(append([]error{fileErr, initErr}, fileReadErrs...)...),
		"count":      len(nodes),
		"file_count": len(files),
	}, teammodel.RunStatusSuccess, 0, nil
}

func (s Service) readKnowledgeFileHitContents(ctx context.Context, baseID uint64, hits []knowledgeservice.KnowledgeRuntimeFileSearchHit) ([]knowledgeservice.KnowledgeRuntimeFileContent, []error) {
	contents := make([]knowledgeservice.KnowledgeRuntimeFileContent, 0, knowledgeFileReadMaxHits)
	errors := make([]error, 0)
	remaining := knowledgeFileReadTotalLimit
	for _, hit := range hits {
		if len(contents) >= knowledgeFileReadMaxHits || remaining <= 0 {
			break
		}
		readLimit := knowledgeFileReadLimit
		if readLimit > remaining {
			readLimit = remaining
		}
		content, err := s.knowledge.ReadKnowledgeRuntimeFile(ctx, baseID, hit.ID, readLimit)
		if err != nil {
			errors = append(errors, fmt.Errorf("读取原文 %s 失败: %w", hit.Path, err))
			continue
		}
		if strings.TrimSpace(content.Content) == "" {
			continue
		}
		contents = append(contents, content)
		remaining -= knowledgeTextLength(content.Content)
	}
	return contents, errors
}

func buildKnowledgeNodeQuery(node teammodel.FlowNode, config map[string]any, input map[string]any) string {
	query := firstText(config["query"], config["goal"], node.Name)
	if len(input) == 0 {
		return query
	}
	inputText := knowledgeNodeInputText(input)
	if inputText == "" {
		inputText = jsonText(input)
	}
	if query == "" {
		return inputText
	}
	return strings.TrimSpace(query + "\n\n上游输入：\n" + inputText)
}

func knowledgeNodeInputText(input map[string]any) string {
	parts := make([]string, 0, len(input))
	for _, key := range sortedAnyMapKeys(input) {
		text := mergeNodeReadableTextDepth(input[key], 1)
		if text == "" {
			text = mergeNodeScalarText(input[key])
		}
		if text == "" {
			continue
		}
		parts = append(parts, fmt.Sprintf("%s：%s", key, text))
	}
	return truncateKnowledgeNodeText(strings.Join(parts, "\n\n"), knowledgeQueryInputLimit)
}

func knowledgeNodeOutputs(nodes []knowledgeservice.KnowledgeNodeResult) []map[string]any {
	result := make([]map[string]any, 0, len(nodes))
	for _, node := range nodes {
		text := knowledgeNodeContent(node, knowledgeFileTextLimit)
		if node.ID == 0 && text == "" {
			continue
		}
		result = append(result, map[string]any{
			"id":                node.ID,
			"title":             knowledgeNodeTitle(node),
			"text":              text,
			"score":             node.Score,
			"doc_id":            node.DocID,
			"knowledge_base_id": node.BaseID,
		})
	}
	return result
}

func knowledgeFileHitOutputs(hits []knowledgeservice.KnowledgeRuntimeFileSearchHit, contents []knowledgeservice.KnowledgeRuntimeFileContent) []map[string]any {
	contentByID := knowledgeFileContentByID(contents)
	result := make([]map[string]any, 0, len(hits))
	for _, hit := range hits {
		if strings.TrimSpace(hit.Path) == "" {
			continue
		}
		item := map[string]any{
			"id":           hit.ID,
			"path":         hit.Path,
			"name":         hit.Name,
			"preview":      truncateKnowledgeNodeText(hit.Preview, knowledgeFileTextLimit),
			"score":        hit.Score,
			"doc_id":       hit.DocID,
			"index_status": hit.IndexStatus,
			"source_type":  hit.SourceType,
		}
		if content, ok := contentByID[hit.ID]; ok {
			item["text"] = truncateKnowledgeNodeText(content.Content, knowledgeFileReadLimit)
			item["truncated"] = content.Truncated
		}
		result = append(result, item)
	}
	return result
}

func knowledgeFileContentByID(contents []knowledgeservice.KnowledgeRuntimeFileContent) map[string]knowledgeservice.KnowledgeRuntimeFileContent {
	result := make(map[string]knowledgeservice.KnowledgeRuntimeFileContent, len(contents))
	for _, content := range contents {
		if strings.TrimSpace(content.ID) != "" {
			result[content.ID] = content
		}
	}
	return result
}

func knowledgeInitOutput(content knowledgeservice.KnowledgeRuntimeFileContent, found bool) map[string]any {
	if !found {
		return nil
	}
	return map[string]any{
		"id":        content.ID,
		"path":      content.Path,
		"name":      content.Name,
		"text":      truncateKnowledgeNodeText(content.Content, knowledgeInitTextLimit),
		"truncated": content.Truncated,
	}
}

func knowledgeNodeWarnings(errors ...error) []string {
	warnings := make([]string, 0, len(errors))
	for _, err := range errors {
		if err == nil {
			continue
		}
		warnings = append(warnings, err.Error())
	}
	return warnings
}

func knowledgeCombinedText(query string, nodes []knowledgeservice.KnowledgeNodeResult, files []knowledgeservice.KnowledgeRuntimeFileSearchHit, fileContents []knowledgeservice.KnowledgeRuntimeFileContent, init knowledgeservice.KnowledgeRuntimeFileContent, initFound bool) string {
	query = strings.TrimSpace(query)
	sections := make([]string, 0, 4)
	if query != "" {
		sections = append(sections, "查询："+query)
	}
	if initFound && strings.TrimSpace(init.Content) != "" {
		sections = append(sections, "入口说明:\n"+truncateKnowledgeNodeText(init.Content, knowledgeInitTextLimit))
	}
	if len(nodes) > 0 {
		sections = append(sections, "索引命中:\n"+knowledgeIndexedNodeText(nodes))
	}
	if len(fileContents) > 0 {
		sections = append(sections, "原文内容:\n"+knowledgeFileContentText(fileContents))
	} else if len(files) > 0 {
		sections = append(sections, "原文命中:\n"+knowledgeFileHitText(files))
	}
	if len(sections) == 0 || (len(nodes) == 0 && len(files) == 0 && !initFound) {
		if query == "" {
			return "暂时没有找到相关内容。"
		}
		return fmt.Sprintf("未找到与「%s」相关的内容。", query)
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeFileContentText(files []knowledgeservice.KnowledgeRuntimeFileContent) string {
	sections := make([]string, 0, len(files))
	for index, file := range files {
		lines := []string{fmt.Sprintf("%d. %s", index+1, file.Path)}
		if content := truncateKnowledgeNodeText(file.Content, knowledgeFileReadLimit); content != "" {
			lines = append(lines, content)
		}
		sections = append(sections, strings.Join(lines, "\n"))
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeIndexedNodeText(nodes []knowledgeservice.KnowledgeNodeResult) string {
	sections := make([]string, 0, len(nodes))
	for index, node := range nodes {
		title := knowledgeNodeTitle(node)
		content := knowledgeNodeContent(node, knowledgeFileTextLimit)
		lines := []string{fmt.Sprintf("%d. %s", index+1, title)}
		if content != "" {
			lines = append(lines, content)
		}
		sections = append(sections, strings.Join(lines, "\n"))
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeFileHitText(files []knowledgeservice.KnowledgeRuntimeFileSearchHit) string {
	sections := make([]string, 0, len(files))
	for index, hit := range files {
		lines := []string{fmt.Sprintf("%d. %s", index+1, hit.Path)}
		if preview := truncateKnowledgeNodeText(hit.Preview, knowledgeFileTextLimit); preview != "" {
			lines = append(lines, preview)
		}
		sections = append(sections, strings.Join(lines, "\n"))
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeTextLength(value string) int {
	return len([]rune(value))
}

func knowledgeNodeTitle(node knowledgeservice.KnowledgeNodeResult) string {
	for _, value := range []string{node.Title, node.Path, node.DirPath} {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	if node.ID > 0 {
		return fmt.Sprintf("知识节点 #%d", node.ID)
	}
	return "知识内容"
}

func knowledgeNodeContent(node knowledgeservice.KnowledgeNodeResult, limit int) string {
	content := firstText(node.PlainText, node.Content, node.Summary)
	return truncateKnowledgeNodeText(content, limit)
}

func truncateKnowledgeNodeText(text string, limit int) string {
	text = strings.TrimSpace(text)
	if limit <= 0 {
		return text
	}
	runes := []rune(text)
	if len(runes) <= limit {
		return text
	}
	return strings.TrimSpace(string(runes[:limit])) + "..."
}

func (s Service) forwardAgentNodeStream(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, node teammodel.FlowNode, nodeRun *teammodel.NodeRun, agentRunID uint64, payload map[string]any) {
	if nodeRun == nil || len(payload) == 0 {
		return
	}
	if textValue(payload["type"]) == "result" {
		return
	}
	output := mapValue(payload["output"])
	if len(output) == 0 {
		return
	}
	fields := map[string]any{
		"output":            output,
		"agent_run_id":      agentRunID,
		"agent_request_id":  textValue(payload["request_id"]),
		"agent_stream_type": textValue(payload["type"]),
	}
	if textValue(payload["msg"]) != "" && intValue(payload["status"], 1) == 2 {
		fields["error"] = textValue(payload["msg"])
	}
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeOutput, fields)
}

func agentNodeInteraction(output map[string]any) map[string]any {
	if len(output) == 0 {
		return nil
	}
	if !strings.EqualFold(textValue(output["event"]), "interaction") {
		return nil
	}
	interaction := mapValue(output["interaction"])
	if textValue(interaction["type"]) == "" {
		return nil
	}
	return interaction
}

func (s Service) resolveNodeAgent(ctx context.Context, teamID uint64, roles []teammodel.Role, node teammodel.FlowNode, config map[string]any) (resolvedNodeAgent, error) {
	if node.Type == teammodel.NodeTypeAgent && node.AgentID > 0 {
		return resolvedNodeAgent{AgentID: node.AgentID}, nil
	}
	roleID := firstUint64(node.RoleID, uint64Value(config["role_id"]), uint64Value(config["roleId"]))
	roleKey := firstText(node.RoleKey, config["role_key"], config["roleKey"])
	roleType := firstText(config["role_type"], config["roleType"])
	roleTeamID := firstUint64(uint64Value(config["role_team_id"]), uint64Value(config["roleTeamId"]), teamID)
	runtimeRoles := roles
	if roleTeamID != teamID {
		runtimeRoles = nil
	}
	role, ok := s.resolveTeamRole(ctx, roleTeamID, runtimeRoles, roleID, roleKey, roleType, node.Type == teammodel.NodeTypeRole)
	if !ok {
		if node.AgentID > 0 {
			return resolvedNodeAgent{AgentID: node.AgentID}, nil
		}
		if node.Type == teammodel.NodeTypeRole {
			return resolvedNodeAgent{}, fmt.Errorf("角色节点未绑定可用角色: %s", node.Name)
		}
		return resolvedNodeAgent{}, fmt.Errorf("节点未绑定智能体或角色: %s", node.Name)
	}
	if role.AgentID == 0 {
		return resolvedNodeAgent{}, fmt.Errorf("角色未绑定智能体: %s", role.Name)
	}
	return resolvedNodeAgent{
		AgentID: role.AgentID,
		Role:    role,
	}, nil
}

func (s Service) resolveTeamRole(ctx context.Context, teamID uint64, roles []teammodel.Role, roleID uint64, roleKey string, roleType string, allowDefault bool) (*teammodel.Role, bool) {
	if role, ok := findRuntimeRole(roles, roleID, roleKey, roleType, allowDefault); ok {
		return role, true
	}
	if len(roles) > 0 {
		return nil, false
	}
	if role, ok := s.repo.FindRole(ctx, teamID, roleID, roleKey); ok {
		return role, true
	}
	if strings.TrimSpace(roleType) != "" {
		return s.repo.FindDefaultRole(ctx, teamID, roleType)
	}
	if allowDefault {
		return s.repo.FindDefaultRole(ctx, teamID, teammodel.RoleTypeWorker)
	}
	return nil, false
}

func findRuntimeRole(roles []teammodel.Role, roleID uint64, roleKey string, roleType string, allowDefault bool) (*teammodel.Role, bool) {
	if len(roles) == 0 {
		return nil, false
	}
	roleKey = strings.TrimSpace(roleKey)
	for index := range roles {
		role := &roles[index]
		if role.Status != teammodel.StatusEnabled {
			continue
		}
		if roleID > 0 && role.ID == roleID {
			return role, true
		}
		if roleKey != "" && role.RoleKey == roleKey {
			return role, true
		}
	}
	hasRoleType := strings.TrimSpace(roleType) != ""
	if !hasRoleType && !allowDefault {
		return nil, false
	}
	roleType = normalizeRoleType(roleType)
	var first *teammodel.Role
	for index := range roles {
		role := &roles[index]
		if role.Status != teammodel.StatusEnabled || role.RoleType != roleType {
			continue
		}
		if roleSortBefore(role, first) {
			first = role
		}
	}
	return first, first != nil
}

func roleInputPayload(role *teammodel.Role) map[string]any {
	if role == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":         role.ID,
		"type":       role.RoleType,
		"key":        role.RoleKey,
		"name":       role.Name,
		"agent_id":   role.AgentID,
		"assignment": role.Assignment,
	}
}

func runConditionNode(config map[string]any, input map[string]any) map[string]any {
	sourceKey := firstText(config["source_key"], config["input_key"])
	operator := strings.ToLower(firstText(config["operator"], "exists"))
	expected := config["value"]
	var actual any = input
	if sourceKey != "" {
		actual = input[sourceKey]
	}
	passed := false
	switch operator {
	case "exists":
		passed = actual != nil && textValue(actual) != ""
	case "equals":
		passed = textValue(actual) == textValue(expected)
	case "not_equals":
		passed = textValue(actual) != textValue(expected)
	case "contains":
		passed = strings.Contains(textValue(actual), textValue(expected))
	case "approved":
		passed = strings.EqualFold(textValue(actual), "approved")
	case "rejected":
		passed = strings.EqualFold(textValue(actual), "rejected")
	case "truthy", "passed":
		passed = boolValue(actual)
	case "falsy", "failed":
		passed = !boolValue(actual)
	default:
		passed = actual != nil
	}
	return map[string]any{
		"passed":   passed,
		"operator": operator,
		"actual":   actual,
		"expected": expected,
	}
}

type mergeNodeSource struct {
	Key   string
	Title string
	Value any
}

func (s Service) runMergeNode(ctx context.Context, flowRunID uint64, node teammodel.FlowNode, config map[string]any, input map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) map[string]any {
	sources, missingSources := s.collectMergeNodeSources(ctx, flowRunID, node, config, input, blackboard, incoming, nodeByID)
	incomingSourceCount := len(incoming) - len(missingSources)
	merged := map[string]any{}
	sourcePayloads := make([]map[string]any, 0, len(sources))
	for _, source := range sources {
		text := mergeNodeReadableText(source.Value)
		merged[source.Key] = source.Value
		sourcePayload := map[string]any{
			"key":     source.Key,
			"title":   source.Title,
			"content": source.Value,
		}
		if text != "" {
			sourcePayload["text"] = text
		}
		sourcePayloads = append(sourcePayloads, sourcePayload)
	}
	return map[string]any{
		"title":   firstText(config["title"], node.Name, "合并上下文"),
		"kind":    "merged_context",
		"text":    mergeNodeMarkdown(sources),
		"sources": sourcePayloads,
		"merged":  merged,
		"meta": map[string]any{
			"incoming_count":        len(incoming),
			"incoming_source_count": incomingSourceCount,
			"source_count":          len(sourcePayloads),
			"missing_source_count":  len(missingSources),
			"missing_sources":       missingSources,
		},
	}
}

func (s Service) collectMergeNodeSources(ctx context.Context, flowRunID uint64, node teammodel.FlowNode, config map[string]any, input map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) ([]mergeNodeSource, []map[string]any) {
	ownKey := firstText(config["output_key"], node.NodeKey)
	incomingKeys := map[string]bool{}
	incomingSources := make([]mergeNodeSource, 0, len(incoming))
	missingSources := make([]map[string]any, 0)
	for _, edge := range incoming {
		fromNode := nodeByID[edge.FromNodeID]
		if fromNode.ID == 0 {
			missingSources = append(missingSources, map[string]any{
				"node_id": edge.FromNodeID,
				"reason":  "上游节点不存在",
			})
			continue
		}
		fromConfig := jsonMap(fromNode.Config)
		key := nodeMergeSourceKey(fromNode)
		for _, outputKey := range nodeOutputKeys(fromNode, fromConfig) {
			incomingKeys[outputKey] = true
		}
		output := s.resolvedNodeOutput(ctx, flowRunID, fromNode, blackboard)
		if mergeNodeValueEmpty(output) {
			missingSources = append(missingSources, map[string]any{
				"node_id":   fromNode.ID,
				"node_key":  fromNode.NodeKey,
				"node_name": fromNode.Name,
				"reason":    "上游节点没有输出",
			})
			continue
		}
		incomingSources = append(incomingSources, mergeNodeSource{
			Key:   key,
			Title: firstText(fromNode.Name, key),
			Value: output,
		})
	}

	result := make([]mergeNodeSource, 0, len(input)+len(incomingSources))
	added := map[string]bool{}
	addSource := func(source mergeNodeSource) {
		source.Key = strings.TrimSpace(source.Key)
		if source.Key == "" || source.Key == ownKey || added[source.Key] || mergeNodeValueEmpty(source.Value) {
			return
		}
		source.Title = firstText(source.Title, source.Key)
		result = append(result, source)
		added[source.Key] = true
	}

	inputKeys := stringSlice(config["input_keys"])
	if len(inputKeys) > 0 {
		for _, key := range inputKeys {
			value, exists := input[key]
			if !exists {
				value = blackboard[key]
			}
			addSource(mergeNodeSource{Key: key, Title: key, Value: value})
		}
	} else {
		for _, key := range sortedAnyMapKeys(input) {
			if incomingKeys[key] || isMergeNodeControlKey(key) {
				continue
			}
			addSource(mergeNodeSource{Key: key, Title: key, Value: input[key]})
		}
	}
	for _, source := range incomingSources {
		addSource(source)
	}
	return result, missingSources
}

func (s Service) resolvedNodeOutput(ctx context.Context, flowRunID uint64, node teammodel.FlowNode, blackboard map[string]any) map[string]any {
	if node.ID == 0 {
		return map[string]any{}
	}
	if nodeRun := s.repo.FindNodeRunByNode(ctx, flowRunID, node.ID); nodeRun != nil && nodeRun.Status == teammodel.RunStatusSuccess {
		if output := mapValue(jsonValue(nodeRun.Output)); len(output) > 0 {
			return output
		}
	}
	return nodeOutput(node, blackboard)
}

func nodeOutputKeys(node teammodel.FlowNode, config map[string]any) []string {
	keys := []string{}
	appendKey := func(key string) {
		key = strings.TrimSpace(key)
		if key == "" {
			return
		}
		for _, exists := range keys {
			if exists == key {
				return
			}
		}
		keys = append(keys, key)
	}
	appendKey(node.NodeKey)
	if node.ID > 0 {
		appendKey(fmt.Sprintf("node_%d", node.ID))
	}
	appendKey(textValue(config["output_key"]))
	return keys
}

func nodeMergeSourceKey(node teammodel.FlowNode) string {
	return firstText(node.NodeKey, fmt.Sprintf("node_%d", node.ID))
}

func mergeNodeMarkdown(sources []mergeNodeSource) string {
	parts := make([]string, 0, len(sources))
	for _, source := range sources {
		text := mergeNodeReadableText(source.Value)
		if text == "" {
			continue
		}
		parts = append(parts, fmt.Sprintf("## %s\n\n%s", source.Title, text))
	}
	return strings.Join(parts, "\n\n")
}

func mergeNodeReadableText(value any) string {
	return strings.TrimSpace(mergeNodeReadableTextDepth(value, 0))
}

func mergeNodeReadableTextDepth(value any, depth int) string {
	if depth > 6 || value == nil {
		return ""
	}
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current)
	case []any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			if text := mergeNodeReadableTextDepth(item, depth+1); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "\n\n")
	case map[string]any:
		if len(current) == 0 {
			return ""
		}
		for _, key := range []string{"text", "markdown", "goal", "summary", "description"} {
			if text := mergeNodeScalarText(current[key]); text != "" {
				return text
			}
		}
		for _, key := range []string{"content", "result", "output", "data", "value", "merged"} {
			if text := mergeNodeReadableTextDepth(current[key], depth+1); text != "" {
				return text
			}
		}
		parts := make([]string, 0, len(current))
		for _, key := range sortedAnyMapKeys(current) {
			if isMergeNodeStructuralKey(key) {
				continue
			}
			if text := mergeNodeReadableTextDepth(current[key], depth+1); text != "" {
				parts = append(parts, fmt.Sprintf("%s：%s", key, text))
			}
		}
		return strings.Join(parts, "\n\n")
	default:
		return mergeNodeScalarText(current)
	}
}

func mergeNodeScalarText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	case bool:
		return fmt.Sprint(current)
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64:
		return fmt.Sprint(current)
	default:
		return ""
	}
}

func mergeNodeValueEmpty(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case map[string]any:
		return len(current) == 0
	case []any:
		return len(current) == 0
	default:
		return false
	}
}

func sortedAnyMapKeys(row map[string]any) []string {
	keys := make([]string, 0, len(row))
	for key := range row {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func isMergeNodeControlKey(key string) bool {
	key = strings.TrimSpace(key)
	return key == ""
}

func isMergeNodeStructuralKey(key string) bool {
	switch strings.TrimSpace(key) {
	case "_debug_asset", "agent_run_id", "asset", "version", "id", "kind", "status", "created_at", "updated_at":
		return true
	default:
		return isMergeNodeControlKey(key)
	}
}

func (s Service) waitHumanNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID)
	if nodeRun == nil {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("人工节点运行记录不存在")
	}
	if approval := s.repo.FindPendingApprovalByNodeRun(ctx, nodeRun.ID); approval != nil {
		return map[string]any{"approval_id": approval.ID, "pending": true}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
	}
	sourceKey := firstText(config["source_key"], config["body_key"])
	content := input
	if sourceKey != "" {
		content = map[string]any{sourceKey: input[sourceKey]}
	}
	title := firstText(config["title"], node.Name)
	approvalID := s.repo.InsertApproval(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"node_run_id": nodeRun.ID,
		"team_id":     team.ID,
		"flow_id":     flow.ID,
		"node_id":     node.ID,
		"title":       title,
		"content":     jsonText(content),
		"comment":     "",
		"decision":    "pending",
		"status":      teammodel.RunStatusPending,
	})
	return map[string]any{"approval_id": approvalID, "pending": true}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
}

func (s Service) runSubTeamNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	targetTeamID := firstUint64(node.SubTeamID, uint64Value(config["sub_team_id"]), run.TeamID)
	if targetTeamID == 0 {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("团队节点未绑定团队: %s", node.Name)
	}
	subFlowID := firstUint64(uint64Value(config["sub_flow_id"]), uint64Value(config["flow_id"]))
	releaseID := uint64Value(config["release_id"])
	result, status, err := s.executeSubTeamWorkflow(ctx, run, flow, targetTeamID, subFlowID, releaseID, input)
	if err != nil {
		return result, status, 0, err
	}
	return result, status, 0, nil
}

func (s Service) executeSubTeamWorkflow(ctx context.Context, run teammodel.Run, currentFlow teammodel.Flow, targetTeamID uint64, subFlowID uint64, releaseID uint64, input map[string]any) (map[string]any, string, error) {
	graph, err := s.subTeamRuntimeGraph(ctx, run, targetTeamID, releaseID)
	if err != nil {
		return nil, teammodel.RunStatusFail, err
	}
	if subFlowID == 0 && targetTeamID == run.TeamID {
		return nil, teammodel.RunStatusFail, fmt.Errorf("团队节点未选择工作流，不能递归执行当前团队")
	}
	if subFlowID > 0 {
		subFlow := graph.findFlow(subFlowID)
		if subFlow.ID == 0 {
			return nil, teammodel.RunStatusFail, fmt.Errorf("团队工作流不存在或未发布")
		}
		if targetTeamID == run.TeamID && subFlow.ID == currentFlow.ID {
			return nil, teammodel.RunStatusFail, fmt.Errorf("团队节点不能执行当前工作流本身")
		}
		status, output, err := s.executeFlowWithGraph(
			ctx,
			run,
			graph.Team,
			graph.Roles,
			subFlow,
			input,
			graph.NodesByFlowID[subFlow.ID],
			graph.NodeEdgesByFlowID[subFlow.ID],
		)
		finalOutput := subFlowTerminalOutput(
			graph.NodesByFlowID[subFlow.ID],
			graph.NodeEdgesByFlowID[subFlow.ID],
			output,
		)
		return subTeamWorkflowOutput(graph.Team.ID, subFlow.ID, subFlow.Name, finalOutput, output), status, err
	}
	status, output, err := s.executeFlowDAG(ctx, run, graph, input)
	return subTeamWorkflowOutput(graph.Team.ID, 0, "", output, output), status, err
}

func (s Service) subTeamRuntimeGraph(ctx context.Context, run teammodel.Run, targetTeamID uint64, releaseID uint64) (runtimeGraph, error) {
	targetTeam, err := s.repo.FindTeam(ctx, targetTeamID)
	if err != nil {
		return runtimeGraph{}, err
	}
	if releaseID > 0 {
		release, releaseErr := s.runnableRelease(ctx, targetTeam, releaseID)
		if releaseErr != nil {
			return runtimeGraph{}, releaseErr
		}
		return runtimeGraphFromRelease(*release)
	}
	if run.ReleaseID == 0 {
		return s.currentRuntimeGraph(ctx, targetTeam), nil
	}
	if targetTeamID == run.TeamID {
		return s.runtimeGraphForRun(ctx, run)
	}
	release, releaseErr := s.runnableRelease(ctx, targetTeam, 0)
	if releaseErr != nil {
		return runtimeGraph{}, releaseErr
	}
	return runtimeGraphFromRelease(*release)
}

func subFlowTerminalOutput(nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge, blackboard map[string]any) map[string]any {
	if len(nodes) == 0 || len(blackboard) == 0 {
		return blackboard
	}
	outgoing := map[uint64]bool{}
	for _, edge := range edges {
		outgoing[edge.FromNodeID] = true
	}
	terminalNodes := make([]teammodel.FlowNode, 0)
	for _, node := range nodes {
		if !outgoing[node.ID] {
			terminalNodes = append(terminalNodes, node)
		}
	}
	if len(terminalNodes) == 0 {
		return blackboard
	}
	if len(terminalNodes) == 1 {
		if output := nodeOutput(terminalNodes[0], blackboard); len(output) > 0 {
			return output
		}
		return blackboard
	}
	result := map[string]any{}
	for _, node := range terminalNodes {
		output := nodeOutput(node, blackboard)
		if len(output) == 0 {
			continue
		}
		result[firstText(node.Name, node.NodeKey)] = output
	}
	if len(result) == 0 {
		return blackboard
	}
	return result
}

func subTeamWorkflowOutput(teamID uint64, flowID uint64, flowName string, output map[string]any, blackboard map[string]any) map[string]any {
	return map[string]any{
		"team_id":    teamID,
		"flow_id":    flowID,
		"flow_name":  flowName,
		"output":     output,
		"blackboard": blackboard,
	}
}

func (s Service) runContextNode(ctx context.Context, run teammodel.Run, node teammodel.FlowNode, config map[string]any) (map[string]any, string, uint64, error) {
	assetCateID := firstUint64(node.AssetCateID, uint64Value(config["asset_cate_id"]))
	if assetCateID == 0 {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("上下文节点未选择资产分类: %s", node.Name)
	}
	if isDebugRun(run) {
		return map[string]any{
			"asset_cate_id": assetCateID,
			"debug":         true,
			"content":       fmt.Sprintf("调试模式上下文：资产分类 %d", assetCateID),
		}, teammodel.RunStatusSuccess, 0, nil
	}
	if run.ProjectID == 0 {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("上下文节点需要项目运行环境: %s", node.Name)
	}
	asset, version := s.asset.LatestProjectAssetByCate(ctx, run.ProjectID, assetCateID)
	if asset == nil || version == nil {
		if !contextNodeRequired(config) {
			return map[string]any{
				"asset_cate_id": assetCateID,
				"missing":       true,
			}, teammodel.RunStatusSuccess, 0, nil
		}
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("上下文节点未找到该资产分类下的产物: %s", node.Name)
	}
	return map[string]any{
		"asset":   assetservice.AssetToMap(*asset),
		"version": assetservice.VersionToMap(*version),
		"content": jsonValue(version.Content),
	}, teammodel.RunStatusSuccess, 0, nil
}

func contextNodeRequired(config map[string]any) bool {
	if value, exists := config["required"]; exists {
		return boolValue(value)
	}
	if value, exists := config["optional"]; exists {
		return !boolValue(value)
	}
	return true
}

func (s Service) runSaveNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (map[string]any, string, uint64, error) {
	body, err := singleIncomingNodeOutput("保存", incoming, nodeByID, blackboard)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	if node.AssetCateID == 0 {
		return body, teammodel.RunStatusSuccess, 0, nil
	}
	assetName := firstText(valueAtPath(body, "title"), flow.Name)
	nodeRunID := s.currentNodeRunID(ctx, flowRun.ID, node.ID)
	if isDebugRun(run) {
		return debugSaveOutput(assetName, firstText(valueAtPath(body, "kind"), assetmodel.KindRichText), node.AssetCateID, body), teammodel.RunStatusSuccess, 0, nil
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:   run.ProjectID,
		TeamID:      team.ID,
		FlowID:      flow.ID,
		AssetCateID: node.AssetCateID,
		RunID:       run.ID,
		NodeRunID:   nodeRunID,
		ReleaseID:   run.ReleaseID,
		RequestID:   run.RequestID,
		NodeKey:     node.NodeKey,
		Name:        assetName,
		Kind:        firstText(valueAtPath(body, "kind"), assetmodel.KindRichText),
		Role:        assetmodel.RoleWork,
		Content:     body,
	})
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	memoryTitle := fmt.Sprintf("%s 记忆", node.Name)
	memoryID := s.memory.Save(ctx, memoryservice.SaveRequest{
		OwnerType:  memorymodel.OwnerTypeTeam,
		OwnerID:    team.ID,
		ProjectID:  run.ProjectID,
		TeamID:     team.ID,
		FlowID:     flow.ID,
		RunID:      run.ID,
		NodeRunID:  nodeRunID,
		AssetID:    asset.ID,
		VersionID:  version.ID,
		Kind:       "episodic",
		Title:      memoryTitle,
		Content:    jsonText(body),
		Tags:       "[]",
		Importance: 50,
	})
	return map[string]any{
		"asset_id":   asset.ID,
		"version_id": version.ID,
		"memory_id":  memoryID,
	}, teammodel.RunStatusSuccess, 0, nil
}

func isDebugRun(run teammodel.Run) bool {
	mode := strings.ToLower(strings.TrimSpace(textValue(jsonMap(run.Input)["_mode"])))
	return strings.HasPrefix(mode, "debug_")
}

func debugSaveOutput(name string, kind string, assetCateID uint64, body map[string]any) map[string]any {
	output := make(map[string]any, len(body)+1)
	for key, value := range body {
		output[key] = value
	}
	output["_debug_asset"] = map[string]any{
		"name":          name,
		"kind":          kind,
		"asset_cate_id": assetCateID,
	}
	return output
}

func singleIncomingNodeOutput(label string, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode, blackboard map[string]any) (map[string]any, error) {
	if len(incoming) != 1 {
		return nil, fmt.Errorf("%s节点需要且只需要一个上游节点", label)
	}
	fromNode := nodeByID[incoming[0].FromNodeID]
	if fromNode.ID == 0 {
		return nil, fmt.Errorf("%s节点的上游节点不存在", label)
	}
	return nodeOutput(fromNode, blackboard), nil
}

func (s Service) writeBlackboard(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, key string, value any, sourceKind string, sourceID uint64) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}
	s.repo.UpsertBlackboard(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"team_id":     run.TeamID,
		"flow_id":     flowRun.FlowID,
		"key":         key,
		"value":       jsonText(value),
		"source_kind": sourceKind,
		"source_id":   sourceID,
	})
}

func (s Service) currentNodeRunID(ctx context.Context, flowRunID uint64, nodeID uint64) uint64 {
	if row := s.repo.FindNodeRunByNode(ctx, flowRunID, nodeID); row != nil {
		return row.ID
	}
	return 0
}

func valueAtPath(raw any, key string) any {
	row := mapValue(raw)
	if len(row) == 0 {
		return nil
	}
	return row[key]
}
