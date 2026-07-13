package reference

import (
	"encoding/json"
	"fmt"
	"strings"
)

const maxReferences = 20

func ParseInput(input map[string]any) (Input, error) {
	text := strings.TrimSpace(textValue(input["text"]))
	content, hasContent := parseContent(input["content"])
	if !hasContent {
		content = plainContent(text)
	}
	parts, references, displayText, err := normalizeParts(content.Parts)
	if err != nil {
		return Input{}, err
	}
	if displayText == "" {
		displayText = text
	}
	if displayText == "" && len(references) == 0 {
		return Input{}, fmt.Errorf("请输入消息或选择引用内容")
	}
	if len(parts) == 0 && displayText != "" {
		parts = []Part{{Type: "text", Text: displayText}}
	}
	return Input{
		Text: displayText,
		Content: Content{
			Version:             ContentVersion,
			Parts:               parts,
			InteractionResponse: content.InteractionResponse,
		},
		References: references,
	}, nil
}

func ModelInput(source map[string]any, input Input) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		if key != "content" {
			result[key] = value
		}
	}
	result["text"] = input.Text
	if input.Content.InteractionResponse != nil {
		result["interaction_response"] = input.Content.InteractionResponse.Value()
	}
	return result
}

func (content Content) Value() map[string]any {
	parts := make([]map[string]any, 0, len(content.Parts))
	for _, part := range content.Parts {
		current := map[string]any{"type": part.Type}
		if part.Text != "" {
			current["text"] = part.Text
		}
		if part.RefType != "" {
			current["ref_type"] = part.RefType
		}
		if part.RefID > 0 {
			current["ref_id"] = part.RefID
		}
		if part.Label != "" {
			current["label"] = part.Label
		}
		if part.Usage != "" {
			current["usage"] = part.Usage
		}
		parts = append(parts, current)
	}
	result := map[string]any{"version": ContentVersion, "parts": parts}
	if content.InteractionResponse != nil {
		result["interaction_response"] = content.InteractionResponse.Value()
	}
	return result
}

func (response InteractionResponse) Value() map[string]any {
	return map[string]any{
		"interaction_id": strings.TrimSpace(response.InteractionID),
		"data":           response.Data,
	}
}

func ReferencesFromContent(value any) []Reference {
	content, ok := parseContent(value)
	if !ok {
		return nil
	}
	_, references, _, _ := normalizeParts(content.Parts)
	return references
}

func InteractionResponsePrompt(value any) string {
	content, ok := parseContent(value)
	if !ok || content.InteractionResponse == nil {
		return ""
	}
	raw, err := json.Marshal(content.InteractionResponse.Value())
	if err != nil {
		return ""
	}
	return "interaction_response:\n" + string(raw)
}

func parseContent(value any) (Content, bool) {
	if value == nil {
		return Content{}, false
	}
	if raw, ok := value.(string); ok {
		var decoded any
		if json.Unmarshal([]byte(raw), &decoded) != nil {
			return Content{}, false
		}
		value = decoded
	}
	mapped, ok := value.(map[string]any)
	if !ok || intValue(mapped["version"]) != ContentVersion {
		return Content{}, false
	}
	items, ok := mapped["parts"].([]any)
	if !ok {
		return Content{}, false
	}
	parts := make([]Part, 0, len(items))
	for _, item := range items {
		current, currentOK := item.(map[string]any)
		if !currentOK {
			continue
		}
		parts = append(parts, Part{
			Type:    strings.ToLower(strings.TrimSpace(textValue(current["type"]))),
			Text:    rawText(current["text"]),
			RefType: normalizeType(textValue(current["ref_type"])),
			RefID:   uint64Value(current["ref_id"]),
			Label:   cleanLabel(textValue(current["label"])),
			Usage:   strings.TrimSpace(textValue(current["usage"])),
		})
	}
	return Content{
		Version:             ContentVersion,
		Parts:               parts,
		InteractionResponse: parseInteractionResponse(mapped["interaction_response"]),
	}, true
}

func parseInteractionResponse(value any) *InteractionResponse {
	mapped, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	interactionID := strings.TrimSpace(textValue(mapped["interaction_id"]))
	if interactionID == "" {
		return nil
	}
	data, _ := mapped["data"].(map[string]any)
	if data == nil {
		data = map[string]any{}
	}
	return &InteractionResponse{InteractionID: interactionID, Data: data}
}

func rawText(value any) string {
	if value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return text
	}
	return fmt.Sprint(value)
}

func normalizeParts(parts []Part) ([]Part, []Reference, string, error) {
	result := make([]Part, 0, len(parts))
	references := make([]Reference, 0)
	seen := map[string]struct{}{}
	var text strings.Builder
	for _, part := range parts {
		switch part.Type {
		case "text":
			if part.Text == "" {
				continue
			}
			result = appendTextPart(result, part.Text)
			text.WriteString(part.Text)
		case "reference":
			part.RefType = normalizeType(part.RefType)
			part.Label = cleanLabel(part.Label)
			if part.RefType == "" || part.RefID == 0 {
				return nil, nil, "", fmt.Errorf("引用内容不完整")
			}
			if part.Label == "" {
				part.Label = fmt.Sprintf("%s %d", part.RefType, part.RefID)
			}
			part.Text = ""
			result = append(result, part)
			text.WriteString("@" + part.Label)
			key := fmt.Sprintf("%s:%d", part.RefType, part.RefID)
			if _, exists := seen[key]; exists {
				continue
			}
			if len(references) >= maxReferences {
				return nil, nil, "", fmt.Errorf("一次最多引用 %d 项内容", maxReferences)
			}
			seen[key] = struct{}{}
			references = append(references, Reference{Type: part.RefType, ID: part.RefID, Label: part.Label, Usage: part.Usage})
		}
	}
	return result, references, strings.TrimSpace(text.String()), nil
}

func appendTextPart(parts []Part, text string) []Part {
	if len(parts) > 0 && parts[len(parts)-1].Type == "text" {
		parts[len(parts)-1].Text += text
		return parts
	}
	return append(parts, Part{Type: "text", Text: text})
}

func plainContent(text string) Content {
	if strings.TrimSpace(text) == "" {
		return Content{Version: ContentVersion, Parts: []Part{}}
	}
	return Content{Version: ContentVersion, Parts: []Part{{Type: "text", Text: text}}}
}

func normalizeType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case TypeMessage, TypeArtifact, TypeUploadFile, TypeSession:
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func cleanLabel(value string) string {
	value = strings.TrimSpace(strings.Join(strings.Fields(value), " "))
	runes := []rune(value)
	if len(runes) > 80 {
		return string(runes[:80])
	}
	return value
}
