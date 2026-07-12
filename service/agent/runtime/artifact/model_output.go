package artifact

func ModelOutput(output map[string]any) map[string]any {
	result := cloneMap(output)
	artifacts := mapList(result["artifacts"])
	compact := make([]map[string]any, 0, len(artifacts))
	for _, artifact := range artifacts {
		compact = append(compact, map[string]any{
			"artifact_id": artifact["artifact_id"],
			"series_id":   artifact["series_id"],
			"kind":        artifact["kind"],
			"label":       artifact["label"],
			"status":      artifact["status"],
			"error":       artifact["error"],
		})
	}
	if len(compact) > 0 {
		result["artifacts"] = compact
	}
	return result
}
