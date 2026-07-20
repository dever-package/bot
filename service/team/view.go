package team

import teammodel "github.com/dever-package/bot/model/team"

func runToMap(run teammodel.Run) map[string]any {
	return map[string]any{
		"id":               run.ID,
		"request_id":       run.RequestID,
		"project_id":       run.ProjectID,
		"body_id":          run.BodyID,
		"team_id":          run.TeamID,
		"release_id":       run.ReleaseID,
		"agent_run_id":     run.AgentRunID,
		"agent_session_id": run.AgentSessionID,
		"child_request_id": run.ChildRequestID,
		"interaction":      jsonMap(run.Interaction),
		"input":            jsonMap(run.Input),
		"output":           jsonMap(run.Output),
		"error":            run.Error,
		"status":           run.Status,
		"started_at":       run.StartedAt,
		"finished_at":      run.FinishedAt,
		"created_at":       run.CreatedAt,
	}
}

func flowRunsToMaps(rows []teammodel.FlowRun, flowNames map[uint64]string) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"request_id":  row.RequestID,
			"project_id":  row.ProjectID,
			"team_id":     row.TeamID,
			"flow_id":     row.FlowID,
			"flow_name":   flowNames[row.FlowID],
			"input":       jsonMap(row.Input),
			"output":      jsonMap(row.Output),
			"error":       row.Error,
			"status":      row.Status,
			"started_at":  row.StartedAt,
			"finished_at": row.FinishedAt,
			"created_at":  row.CreatedAt,
		})
	}
	return result
}

func nodeRunsToMaps(rows []teammodel.NodeRun, flowNames map[uint64]string, nodeNames map[uint64]string) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":               row.ID,
			"run_id":           row.RunID,
			"flow_run_id":      row.FlowRunID,
			"request_id":       row.RequestID,
			"project_id":       row.ProjectID,
			"team_id":          row.TeamID,
			"flow_id":          row.FlowID,
			"flow_name":        flowNames[row.FlowID],
			"node_id":          row.NodeID,
			"node_key":         row.NodeKey,
			"node_name":        nodeNames[row.NodeID],
			"node_type":        row.NodeType,
			"input":            jsonMap(row.Input),
			"output":           jsonMap(row.Output),
			"error":            row.Error,
			"status":           row.Status,
			"agent_run_id":     row.AgentRunID,
			"agent_session_id": row.AgentSessionID,
			"child_request_id": row.ChildRequestID,
			"interaction":      jsonMap(row.Interaction),
			"started_at":       row.StartedAt,
			"finished_at":      row.FinishedAt,
			"created_at":       row.CreatedAt,
		})
	}
	return result
}

func nodeInteractionsToMaps(rows []teammodel.NodeRun, flowNames map[uint64]string, nodeNames map[uint64]string) []map[string]any {
	result := make([]map[string]any, 0)
	for _, row := range rows {
		interaction := jsonMap(row.Interaction)
		if row.Status != teammodel.RunStatusWaiting || len(interaction) == 0 {
			continue
		}
		result = append(result, map[string]any{
			"node_run_id": row.ID,
			"run_id":      row.RunID,
			"flow_run_id": row.FlowRunID,
			"flow_id":     row.FlowID,
			"flow_name":   flowNames[row.FlowID],
			"node_id":     row.NodeID,
			"node_key":    row.NodeKey,
			"node_name":   nodeNames[row.NodeID],
			"node_type":   row.NodeType,
			"interaction": interaction,
		})
	}
	return result
}

func runInteractionToMap(run teammodel.Run) map[string]any {
	interaction := jsonMap(run.Interaction)
	if run.Status != teammodel.RunStatusWaiting || len(interaction) == 0 {
		return nil
	}
	return map[string]any{
		"run_id":      run.ID,
		"node_run_id": uint64(0),
		"node_type":   teammodel.NodeTypeRole,
		"interaction": interaction,
	}
}

func blackboardRowsToMaps(rows []teammodel.Blackboard) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"flow_run_id": row.FlowRunID,
			"team_id":     row.TeamID,
			"flow_id":     row.FlowID,
			"key":         row.Key,
			"value":       jsonValue(row.Value),
			"source_kind": row.SourceKind,
			"source_id":   row.SourceID,
			"created_at":  row.CreatedAt,
		})
	}
	return result
}

func messagesToMaps(rows []teammodel.Message) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"flow_run_id": row.FlowRunID,
			"node_run_id": row.NodeRunID,
			"team_id":     row.TeamID,
			"flow_id":     row.FlowID,
			"node_id":     row.NodeID,
			"type":        row.Type,
			"role":        row.Role,
			"content":     jsonValue(row.Content),
			"created_at":  row.CreatedAt,
		})
	}
	return result
}

func approvalsToMaps(rows []teammodel.Approval) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"flow_run_id": row.FlowRunID,
			"node_run_id": row.NodeRunID,
			"team_id":     row.TeamID,
			"flow_id":     row.FlowID,
			"node_id":     row.NodeID,
			"title":       row.Title,
			"content":     jsonValue(row.Content),
			"comment":     row.Comment,
			"decision":    row.Decision,
			"status":      row.Status,
			"created_at":  row.CreatedAt,
		})
	}
	return result
}
