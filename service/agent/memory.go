package agent

import (
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	assistantservice "github.com/dever-package/bot/service/assistant"
)

func promptMemories(rows []assistantservice.RuntimeMemory) []agentprompt.MemorySnippet {
	result := make([]agentprompt.MemorySnippet, 0, len(rows))
	for _, row := range rows {
		result = append(result, agentprompt.MemorySnippet{
			ID:         row.ID,
			Kind:       row.Kind,
			Title:      row.Title,
			Content:    row.Content,
			Tags:       row.Tags,
			Importance: row.Importance,
		})
	}
	return result
}
