package skill

import (
	"encoding/json"
	"strings"
)

// MarkdownFrontMatter returns a deterministic YAML frontmatter block. JSON
// quoted strings are valid YAML scalars and safely preserve user text.
func MarkdownFrontMatter(key string, name string, description string) string {
	return strings.Join([]string{
		"---",
		"key: " + markdownScalar(key),
		"name: " + markdownScalar(name),
		"description: " + markdownScalar(description),
		"---",
	}, "\n")
}

func markdownScalar(value string) string {
	raw, _ := json.Marshal(strings.TrimSpace(value))
	return string(raw)
}
