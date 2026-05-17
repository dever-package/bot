package protocol

import (
	"fmt"
	"strings"
)

var setPromptKeys = []string{"id", "role", "skills"}

func BuildOpenAIMessages(body map[string]any) []any {
	if body == nil {
		return nil
	}

	parts := normalizeRequestParts(body)
	return BuildOpenAIMessagesFromParts(parts.Set, parts.History, parts.Input, PromptOptions{})
}

func BuildOpenAIMessagesFromParts(set map[string]any, history []any, input map[string]any, options PromptOptions) []any {
	messages := make([]any, 0)
	if systemPrompt := buildSystemPrompt(set); systemPrompt != "" {
		messages = append(messages, map[string]any{
			"role":    "system",
			"content": systemPrompt,
		})
	}

	for _, item := range history {
		if message := buildOpenAIHistoryMessage(item, options); message != nil {
			messages = append(messages, message)
		}
	}

	if message := buildOpenAIInputMessage(input, "user", options); message != nil {
		messages = append(messages, message)
	}
	return messages
}

func buildOpenAIHistoryMessage(value any, options PromptOptions) map[string]any {
	if value == nil {
		return nil
	}

	if mapped, ok := value.(map[string]any); ok {
		role := "user"
		if currentRole := strings.TrimSpace(asText(mapped["role"])); currentRole != "" {
			role = currentRole
		}
		input := make(map[string]any, len(mapped))
		for key, current := range mapped {
			if key != "role" {
				input[key] = current
			}
		}
		return buildOpenAIInputMessage(input, role, options)
	}

	return buildOpenAIInputMessage(map[string]any{"text": value}, "user", options)
}

func buildOpenAIInputMessage(input map[string]any, role string, options PromptOptions) map[string]any {
	if len(input) == 0 {
		return nil
	}
	role = strings.TrimSpace(role)
	if role == "" {
		role = "user"
	}
	content := buildOpenAIContent(input, role, options)
	if isEmptyContent(content) {
		return nil
	}
	return map[string]any{
		"role":    role,
		"content": content,
	}
}

func buildOpenAIContent(input map[string]any, role string, options PromptOptions) any {
	if len(input) == 0 {
		return nil
	}

	options.TextTitle = openAIPromptTextTitle(role)
	prompt := BuildPromptContent(input, options)
	text := prompt.TextWithMediaReferences(MediaReferenceOptions{
		Videos: true,
		Audios: true,
		Files:  true,
	})
	if len(prompt.Images) == 0 {
		return text
	}

	parts := make([]any, 0, 1+len(prompt.Images))
	if text != "" {
		parts = append(parts, map[string]any{"type": "text", "text": text})
	}
	for _, url := range prompt.Images {
		parts = append(parts, map[string]any{
			"type": "image_url",
			"image_url": map[string]any{
				"url": url,
			},
		})
	}
	return parts
}

func openAIPromptTextTitle(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "assistant":
		return "助手回复"
	case "system":
		return "系统输入"
	default:
		return "用户输入"
	}
}

func buildSystemPrompt(value any) string {
	items := normalizeAnyList(value)
	if len(items) == 0 {
		if mapped := normalizeMap(value); len(mapped) > 0 {
			items = []any{mapped}
		}
	}

	parts := make([]string, 0, len(items))
	for _, item := range items {
		switch current := item.(type) {
		case string:
			if text := strings.TrimSpace(current); text != "" {
				parts = append(parts, text)
			}
		case map[string]any:
			for _, key := range setPromptKeys {
				if text := strings.TrimSpace(asText(current[key])); text != "" {
					parts = append(parts, fmt.Sprintf("%s: %s", key, text))
				}
			}
		}
	}
	return strings.Join(parts, "\n")
}

func extractOpenAIContentValue(mapped map[string]any) (any, bool) {
	choices := normalizeAnyList(mapped["choices"])
	if len(choices) == 0 {
		return nil, false
	}

	choice, _ := choices[0].(map[string]any)
	if choice == nil {
		return nil, false
	}
	if message, ok := choice["message"].(map[string]any); ok {
		if content, exists := message["content"]; exists {
			return content, true
		}
	}
	if delta, ok := choice["delta"].(map[string]any); ok {
		if content, exists := delta["content"]; exists {
			return content, true
		}
	}
	if text, exists := choice["text"]; exists {
		return text, true
	}
	return nil, false
}
