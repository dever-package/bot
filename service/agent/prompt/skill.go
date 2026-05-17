package prompt

import (
	"strings"

	agentskill "my/package/bot/service/agent/skill"
)

func skillPrompt(catalog agentskill.Catalog) string {
	sections := make([]string, 0, 2)
	sections = appendNonEmpty(sections, catalog.Metadata)
	sections = appendNonEmpty(sections, catalog.LoadedContent)
	return strings.Join(sections, "\n\n")
}
