package brain

import brainmodel "my/package/bot/model/brain"

func runToMap(run brainmodel.Run) map[string]any {
	return map[string]any{
		"id":          run.ID,
		"request_id":  run.RequestID,
		"brain_id":    run.BrainID,
		"release_id":  run.ReleaseID,
		"input":       jsonMap(run.Input),
		"output":      jsonMap(run.Output),
		"error":       run.Error,
		"status":      run.Status,
		"started_at":  run.StartedAt,
		"finished_at": run.FinishedAt,
		"created_at":  run.CreatedAt,
	}
}

func thinkRunsToMaps(rows []brainmodel.ThinkRun) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"request_id":  row.RequestID,
			"brain_id":    row.BrainID,
			"think_id":    row.ThinkID,
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

func nodeRunsToMaps(rows []brainmodel.NodeRun) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":           row.ID,
			"run_id":       row.RunID,
			"think_run_id": row.ThinkRunID,
			"request_id":   row.RequestID,
			"brain_id":     row.BrainID,
			"think_id":     row.ThinkID,
			"node_id":      row.NodeID,
			"node_key":     row.NodeKey,
			"node_type":    row.NodeType,
			"input":        jsonMap(row.Input),
			"output":       jsonMap(row.Output),
			"error":        row.Error,
			"status":       row.Status,
			"agent_run_id": row.AgentRunID,
			"started_at":   row.StartedAt,
			"finished_at":  row.FinishedAt,
			"created_at":   row.CreatedAt,
		})
	}
	return result
}

func blackboardRowsToMaps(rows []brainmodel.Blackboard) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":           row.ID,
			"run_id":       row.RunID,
			"think_run_id": row.ThinkRunID,
			"brain_id":     row.BrainID,
			"think_id":     row.ThinkID,
			"key":          row.Key,
			"value":        jsonValue(row.Value),
			"source_kind":  row.SourceKind,
			"source_id":    row.SourceID,
			"created_at":   row.CreatedAt,
		})
	}
	return result
}

func messagesToMaps(rows []brainmodel.Message) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":           row.ID,
			"run_id":       row.RunID,
			"think_run_id": row.ThinkRunID,
			"node_run_id":  row.NodeRunID,
			"brain_id":     row.BrainID,
			"think_id":     row.ThinkID,
			"node_id":      row.NodeID,
			"type":         row.Type,
			"role":         row.Role,
			"content":      jsonValue(row.Content),
			"created_at":   row.CreatedAt,
		})
	}
	return result
}

func approvalsToMaps(rows []brainmodel.Approval) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":           row.ID,
			"run_id":       row.RunID,
			"think_run_id": row.ThinkRunID,
			"node_run_id":  row.NodeRunID,
			"brain_id":     row.BrainID,
			"think_id":     row.ThinkID,
			"node_id":      row.NodeID,
			"title":        row.Title,
			"content":      jsonValue(row.Content),
			"comment":      row.Comment,
			"decision":     row.Decision,
			"status":       row.Status,
			"created_at":   row.CreatedAt,
		})
	}
	return result
}
