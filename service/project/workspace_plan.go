package project

type canvasExecutionPlan struct {
	Start    canvasRunNode
	Nodes    []canvasRunNode
	Edges    []canvasRunEdge
	Incoming map[string][]string
	Outgoing map[string][]string
	Order    []string
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
