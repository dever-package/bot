package prompt

import (
	"fmt"
	"strings"

	agentmodel "my/package/bot/model/agent"
)

func knowledgePrompt(rows []agentmodel.AgentKnowledge) string {
	return snippetSection("智能体资料", knowledgeSnippets(rows))
}

func knowledgeSnippets(rows []agentmodel.AgentKnowledge) []snippet {
	items := make([]snippet, 0, len(rows))
	for _, row := range rows {
		content := strings.TrimSpace(row.Content)
		if content == "" {
			continue
		}
		title := strings.TrimSpace(row.Name)
		if title == "" {
			title = fmt.Sprintf("资料 #%d", row.ID)
		}
		if row.Type != "" {
			title = fmt.Sprintf("%s（%s）", title, row.Type)
		}
		items = append(items, snippet{Title: title, Content: content})
	}
	return items
}
