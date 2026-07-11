package agent

func cloneOptionRows(rows []map[string]any) []map[string]any {
	cloned := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		next := make(map[string]any, len(row))
		for key, value := range row {
			next[key] = value
		}
		cloned = append(cloned, next)
	}
	return cloned
}
