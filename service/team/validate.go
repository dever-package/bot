package team

import (
	"context"
	"fmt"

	teammodel "my/package/bot/model/team"
)

func (s Service) ValidateFlowGraph(ctx context.Context, teamID uint64) (map[string]any, error) {
	if _, err := s.repo.FindTeam(ctx, teamID); err != nil {
		return nil, err
	}
	flows := s.repo.ListFlows(ctx, teamID, true)
	edges := s.repo.ListFlowEdges(ctx, teamID, true)
	issues := validateFlowGraph(flows, edges)
	return validationResult(issues), nil
}

func (s Service) ValidateFlowNodeGraph(ctx context.Context, flowID uint64) (map[string]any, error) {
	if _, err := s.repo.FindFlow(ctx, flowID); err != nil {
		return nil, err
	}
	nodes := s.repo.ListFlowNodes(ctx, flowID, true)
	edges := s.repo.ListFlowNodeEdges(ctx, flowID, true)
	issues := validateFlowNodeGraph(nodes, edges)
	return validationResult(issues), nil
}

func validateTeamRoles(roles []teammodel.Role) []string {
	if len(roles) == 0 {
		return []string{"至少需要创建一个团队角色"}
	}
	return nil
}

func validateFlowGraph(flows []teammodel.Flow, edges []teammodel.FlowEdge) []string {
	issues := []string{}
	flowByID := map[uint64]teammodel.Flow{}
	keySeen := map[string]bool{}
	for _, flow := range flows {
		if flow.Key == "" {
			issues = append(issues, fmt.Sprintf("工作流 %d 缺少标识", flow.ID))
		}
		if keySeen[flow.Key] {
			issues = append(issues, fmt.Sprintf("工作流标识重复: %s", flow.Key))
		}
		keySeen[flow.Key] = true
		flowByID[flow.ID] = flow
	}
	for _, edge := range edges {
		if edge.FromFlowID == edge.ToFlowID {
			issues = append(issues, "工作流关系不能连接自身")
		}
		if flowByID[edge.FromFlowID].ID == 0 {
			issues = append(issues, fmt.Sprintf("工作流关系 %d 的上游不存在", edge.ID))
		}
		if flowByID[edge.ToFlowID].ID == 0 {
			issues = append(issues, fmt.Sprintf("工作流关系 %d 的下游不存在", edge.ID))
		}
	}
	if hasCycle(flowIDs(flows), flowEdgePairs(edges)) {
		issues = append(issues, "工作流关系存在循环，第一版只允许 DAG")
	}
	return issues
}

func validateFlowNodeGraph(nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge) []string {
	issues := []string{}
	if len(nodes) == 0 {
		return []string{"至少需要创建一个节点"}
	}
	nodeByID := map[uint64]teammodel.FlowNode{}
	incomingCount := map[uint64]int{}
	keySeen := map[string]bool{}
	for _, node := range nodes {
		if node.NodeKey == "" {
			issues = append(issues, fmt.Sprintf("节点 %d 缺少标识", node.ID))
		}
		if keySeen[node.NodeKey] {
			issues = append(issues, fmt.Sprintf("节点标识重复: %s", node.NodeKey))
		}
		keySeen[node.NodeKey] = true
		nodeByID[node.ID] = node
		switch node.Type {
		case teammodel.NodeTypeAgent:
			config := jsonMap(node.Config)
			if node.AgentID == 0 && node.RoleID == 0 && node.RoleKey == "" && firstText(config["role_type"], config["roleType"]) == "" {
				issues = append(issues, fmt.Sprintf("智能体节点 %s 未绑定智能体或角色", node.Name))
			}
		case teammodel.NodeTypeRole:
			config := jsonMap(node.Config)
			if node.RoleID == 0 && node.RoleKey == "" && firstText(config["role_type"], config["roleType"]) == "" {
				issues = append(issues, fmt.Sprintf("角色节点 %s 未绑定角色", node.Name))
			}
		case teammodel.NodeTypePower:
			if node.PowerID == 0 {
				issues = append(issues, fmt.Sprintf("能力节点 %s 未绑定能力", node.Name))
			}
		case teammodel.NodeTypeContext:
			if node.AssetCateID == 0 {
				issues = append(issues, fmt.Sprintf("上下文节点 %s 未选择资产分类", node.Name))
			}
		}
	}
	for _, edge := range edges {
		incomingCount[edge.ToNodeID]++
		if edge.FromNodeID == edge.ToNodeID {
			issues = append(issues, "节点关系不能连接自身")
		}
		if nodeByID[edge.FromNodeID].ID == 0 {
			issues = append(issues, fmt.Sprintf("节点关系 %d 的上游不存在", edge.ID))
		}
		if nodeByID[edge.ToNodeID].ID == 0 {
			issues = append(issues, fmt.Sprintf("节点关系 %d 的下游不存在", edge.ID))
		}
	}
	for _, node := range nodes {
		switch node.Type {
		case teammodel.NodeTypeSave:
			if incomingCount[node.ID] != 1 {
				issues = append(issues, fmt.Sprintf("保存节点 %s 需要且只需要一个上游节点", node.Name))
			}
		}
	}
	if hasCycle(nodeIDs(nodes), nodeEdgePairs(edges)) {
		issues = append(issues, "节点关系存在循环，第一版只允许 DAG")
	}
	return issues
}

func validatePowerNodeScope(nodes []teammodel.FlowNode, teamPowers []teammodel.TeamPower) []string {
	if len(teamPowers) == 0 {
		return nil
	}
	issues := []string{}
	for _, node := range nodes {
		if node.Type != teammodel.NodeTypePower {
			continue
		}
		if !powerAllowedByScope(teamPowers, node.PowerID) {
			issues = append(issues, fmt.Sprintf("能力节点 %s 不在团队能力范围内", node.Name))
		}
	}
	return issues
}

func validationResult(issues []string) map[string]any {
	return map[string]any{
		"valid":  len(issues) == 0,
		"issues": issues,
	}
}

func flowIDs(flows []teammodel.Flow) []uint64 {
	result := make([]uint64, 0, len(flows))
	for _, flow := range flows {
		result = append(result, flow.ID)
	}
	return result
}

func flowEdgePairs(edges []teammodel.FlowEdge) [][2]uint64 {
	result := make([][2]uint64, 0, len(edges))
	for _, edge := range edges {
		result = append(result, [2]uint64{edge.FromFlowID, edge.ToFlowID})
	}
	return result
}

func nodeIDs(nodes []teammodel.FlowNode) []uint64 {
	result := make([]uint64, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, node.ID)
	}
	return result
}

func nodeEdgePairs(edges []teammodel.FlowNodeEdge) [][2]uint64 {
	result := make([][2]uint64, 0, len(edges))
	for _, edge := range edges {
		result = append(result, [2]uint64{edge.FromNodeID, edge.ToNodeID})
	}
	return result
}

func hasCycle(ids []uint64, pairs [][2]uint64) bool {
	graph := map[uint64][]uint64{}
	indegree := map[uint64]int{}
	for _, id := range ids {
		indegree[id] = 0
	}
	for _, pair := range pairs {
		from, to := pair[0], pair[1]
		if from == 0 || to == 0 {
			continue
		}
		if _, exists := indegree[from]; !exists {
			continue
		}
		if _, exists := indegree[to]; !exists {
			continue
		}
		graph[from] = append(graph[from], to)
		indegree[to]++
	}
	queue := make([]uint64, 0, len(indegree))
	for id, degree := range indegree {
		if degree == 0 {
			queue = append(queue, id)
		}
	}
	visited := 0
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		visited++
		for _, next := range graph[current] {
			indegree[next]--
			if indegree[next] == 0 {
				queue = append(queue, next)
			}
		}
	}
	return visited != len(indegree)
}
