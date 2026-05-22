package brain

import (
	"context"
	"fmt"

	brainmodel "my/package/bot/model/brain"
)

func (s Service) ValidateThinkGraph(ctx context.Context, brainID uint64) (map[string]any, error) {
	if _, err := s.repo.FindBrain(ctx, brainID); err != nil {
		return nil, err
	}
	thinks := s.repo.ListThinks(ctx, brainID, true)
	edges := s.repo.ListThinkEdges(ctx, brainID, true)
	issues := validateThinkGraph(thinks, edges)
	return validationResult(issues), nil
}

func (s Service) ValidateFlowGraph(ctx context.Context, thinkID uint64) (map[string]any, error) {
	think, err := s.repo.FindThink(ctx, thinkID)
	if err != nil {
		return nil, err
	}
	if normalizeThinkType(think.Type) != brainmodel.ThinkTypeFlow {
		return nil, fmt.Errorf("创作没有流程节点可校验")
	}
	nodes := s.repo.ListFlowNodes(ctx, thinkID, true)
	edges := s.repo.ListFlowNodeEdges(ctx, thinkID, true)
	issues := validateFlowGraph(nodes, edges)
	return validationResult(issues), nil
}

func validateThinkGraph(thinks []brainmodel.Think, edges []brainmodel.ThinkEdge) []string {
	issues := []string{}
	if len(thinks) == 0 {
		return []string{"至少需要创建一个思维"}
	}
	thinkByID := map[uint64]brainmodel.Think{}
	keySeen := map[string]bool{}
	for _, think := range thinks {
		if think.Key == "" {
			issues = append(issues, fmt.Sprintf("思维 %d 缺少标识", think.ID))
		}
		if keySeen[think.Key] {
			issues = append(issues, fmt.Sprintf("思维标识重复: %s", think.Key))
		}
		keySeen[think.Key] = true
		thinkByID[think.ID] = think
	}
	for _, edge := range edges {
		if edge.FromThinkID == edge.ToThinkID {
			issues = append(issues, "思维关系不能连接自身")
		}
		if thinkByID[edge.FromThinkID].ID == 0 {
			issues = append(issues, fmt.Sprintf("思维关系 %d 的上游不存在", edge.ID))
		}
		if thinkByID[edge.ToThinkID].ID == 0 {
			issues = append(issues, fmt.Sprintf("思维关系 %d 的下游不存在", edge.ID))
		}
	}
	if hasCycle(thinkIDs(thinks), thinkEdgePairs(edges)) {
		issues = append(issues, "思维关系存在循环，第一版只允许 DAG")
	}
	return issues
}

func validateFlowGraph(nodes []brainmodel.ThinkFlowNode, edges []brainmodel.ThinkFlowNodeEdge) []string {
	issues := []string{}
	if len(nodes) == 0 {
		return []string{"至少需要创建一个节点"}
	}
	nodeByID := map[uint64]brainmodel.ThinkFlowNode{}
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
		case brainmodel.NodeTypeAgent:
			if node.AgentID == 0 {
				issues = append(issues, fmt.Sprintf("智能体节点 %s 未绑定智能体", node.Name))
			}
		case brainmodel.NodeTypePower:
			config := jsonMap(node.Config)
			if textValue(config["power_key"]) == "" && uint64Value(config["power_id"]) == 0 {
				issues = append(issues, fmt.Sprintf("能力节点 %s 未绑定能力", node.Name))
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
		case brainmodel.NodeTypeSave:
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

func validationResult(issues []string) map[string]any {
	return map[string]any{
		"valid":  len(issues) == 0,
		"issues": issues,
	}
}

func thinkIDs(thinks []brainmodel.Think) []uint64 {
	result := make([]uint64, 0, len(thinks))
	for _, think := range thinks {
		result = append(result, think.ID)
	}
	return result
}

func thinkEdgePairs(edges []brainmodel.ThinkEdge) [][2]uint64 {
	result := make([][2]uint64, 0, len(edges))
	for _, edge := range edges {
		result = append(result, [2]uint64{edge.FromThinkID, edge.ToThinkID})
	}
	return result
}

func nodeIDs(nodes []brainmodel.ThinkFlowNode) []uint64 {
	result := make([]uint64, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, node.ID)
	}
	return result
}

func nodeEdgePairs(edges []brainmodel.ThinkFlowNodeEdge) [][2]uint64 {
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
