package energon

// PromptInput builds the canonical current-turn input expected by Energon services.
func PromptInput(prompt string) map[string]any {
	return map[string]any{"prompt": prompt}
}
