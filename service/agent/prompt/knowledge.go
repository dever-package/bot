package prompt

import (
	"fmt"
	"strings"
)

func normalizeKnowledgeBaseRuntime(rows []KnowledgeBaseRuntime) []KnowledgeBaseRuntime {
	result := make([]KnowledgeBaseRuntime, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		if row.ID == 0 {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		name := strings.TrimSpace(row.Name)
		if name == "" {
			name = fmt.Sprintf("知识库 #%d", row.ID)
		}
		result = append(result, KnowledgeBaseRuntime{
			ID:     row.ID,
			Name:   name,
			Prompt: strings.TrimSpace(row.Prompt),
		})
	}
	return result
}
