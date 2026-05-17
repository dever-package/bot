package action

import (
	"strings"
)

const InteractionFenceLang = "agent-interaction"

func ExtractInteraction(text string) (string, map[string]any, bool) {
	return extractJSONFence(text, []string{InteractionFenceLang, "json"}, validInteraction)
}

func validInteraction(interaction map[string]any) bool {
	if len(interaction) == 0 {
		return false
	}
	interactionType := strings.ToLower(strings.TrimSpace(firstText(interaction["type"])))
	if interactionType == "" {
		return false
	}
	if interactionType == "power_params" {
		return strings.TrimSpace(firstText(interaction["power"])) != ""
	}
	_, hasFields := interaction["fields"]
	return hasFields
}
