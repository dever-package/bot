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
	params := cloneMap(content.Params)
	if explicit, ok := input["params"].(map[string]any); ok {
		params = cloneMap(explicit)
	}
	return Input{
		Text: displayText,
		Content: Content{
			Version:             ContentVersion,
			Parts:               parts,
			Params:              params,
			InteractionResponse: content.InteractionResponse,
		},
		Params:     params,
		References: references,
	}, nil
}

func ModelInput(source map[string]any, input Input, references []map[string]any) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		switch key {
		case "content", "params", "references", "runtime_context", "runtime_event", "interaction_response":
			continue
		default:
			result[key] = value
		}
	}
	result["prompt"] = strings.TrimSpace(input.Text)
	if len(references) > 0 {
		result["references"] = references
	}
	for key, value := range input.Params {
		if key == "" || key == "text" || key == "prompt" || key == "content" {
			continue
		}
		result[key] = value
	}
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
		if part.Trigger != "" {
			current["ref_trigger"] = part.Trigger
		}
		if part.VersionID > 0 {
			current["ref_version_id"] = part.VersionID
		}
		if part.MediaURL != "" {
			current["ref_media_url"] = part.MediaURL
		}
		if part.MediaIndex > 0 {
			current["ref_media_index"] = part.MediaIndex
		}
		if part.MediaCount > 0 {
			current["ref_media_count"] = part.MediaCount
		}
		if len(part.MediaItems) > 0 {
			current["ref_media_items"] = part.MediaItems
		}
		parts = append(parts, current)
	}
	result := map[string]any{"version": ContentVersion, "parts": parts}
	if len(content.Params) > 0 {
		result["params"] = cloneMap(content.Params)
	}
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

func ContentContext(value any) map[string]any {
	content, ok := parseContent(value)
	if !ok {
		return nil
	}
	result := map[string]any{}
	if len(content.Params) > 0 {
		result["params"] = cloneMap(content.Params)
	}
	if content.InteractionResponse != nil {
		result["interaction_response"] = content.InteractionResponse.Value()
	}
	if len(result) == 0 {
		return nil
	}
	return result
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
			Type:       strings.ToLower(strings.TrimSpace(textValue(current["type"]))),
			Text:       rawText(current["text"]),
			RefType:    normalizeType(textValue(current["ref_type"])),
			RefID:      uint64Value(current["ref_id"]),
			Label:      cleanLabel(textValue(current["label"])),
			Usage:      strings.TrimSpace(textValue(current["usage"])),
			Trigger:    normalizeTrigger(textValue(current["ref_trigger"])),
			VersionID:  uint64Value(current["ref_version_id"]),
			MediaURL:   strings.TrimSpace(textValue(current["ref_media_url"])),
			MediaIndex: intValue(current["ref_media_index"]),
			MediaCount: intValue(current["ref_media_count"]),
			MediaItems: parseMediaSelectionItems(current["ref_media_items"]),
		})
	}
	return Content{
		Version:             ContentVersion,
		Parts:               parts,
		Params:              mapValue(mapped["params"]),
		InteractionResponse: parseInteractionResponse(mapped["interaction_response"]),
	}, true
}

func mapValue(value any) map[string]any {
	mapped, _ := value.(map[string]any)
	return cloneMap(mapped)
}

func cloneMap(value map[string]any) map[string]any {
	if len(value) == 0 {
		return map[string]any{}
	}
	result := make(map[string]any, len(value))
	for key, current := range value {
		result[key] = current
	}
	return result
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
			part.MediaURL = strings.TrimSpace(part.MediaURL)
			if part.MediaIndex < 0 {
				part.MediaIndex = 0
			}
			if part.MediaCount < 0 {
				part.MediaCount = 0
			}
			part.MediaItems = normalizeMediaSelectionItems(part.MediaItems)
			if part.RefType == "" || part.RefID == 0 {
				return nil, nil, "", fmt.Errorf("引用内容不完整")
			}
			if part.Label == "" {
				part.Label = fmt.Sprintf("%s %d", part.RefType, part.RefID)
			}
			part.Text = ""
			part.Trigger = normalizeReferenceTrigger(part.RefType, part.Trigger)
			if part.RefType == TypeAsset && part.VersionID == 0 {
				return nil, nil, "", fmt.Errorf("资产引用缺少版本")
			}
			result = append(result, part)
			text.WriteString(part.Trigger + part.Label)
			key := fmt.Sprintf(
				"%s:%d:%d:%s:%s:%d:%s",
				part.RefType,
				part.RefID,
				part.VersionID,
				part.Usage,
				part.MediaURL,
				part.MediaIndex,
				mediaSelectionItemsKey(part.MediaItems),
			)
			if _, exists := seen[key]; exists {
				continue
			}
			if len(references) >= maxReferences {
				return nil, nil, "", fmt.Errorf("一次最多引用 %d 项内容", maxReferences)
			}
			seen[key] = struct{}{}
			references = append(references, Reference{Type: part.RefType, ID: part.RefID, Label: part.Label, Usage: part.Usage, Trigger: part.Trigger, VersionID: part.VersionID, MediaURL: part.MediaURL, MediaIndex: part.MediaIndex, MediaCount: part.MediaCount, MediaItems: part.MediaItems})
		}
	}
	return result, references, strings.TrimSpace(text.String()), nil
}

func parseMediaSelectionItems(value any) []MediaSelectionItem {
	items, _ := value.([]any)
	result := make([]MediaSelectionItem, 0, len(items))
	for _, raw := range items {
		row, _ := raw.(map[string]any)
		result = append(result, MediaSelectionItem{
			URL:   strings.TrimSpace(textValue(row["url"])),
			Index: intValue(row["index"]),
			Usage: strings.TrimSpace(textValue(row["usage"])),
		})
	}
	return normalizeMediaSelectionItems(result)
}

func normalizeMediaSelectionItems(items []MediaSelectionItem) []MediaSelectionItem {
	result := make([]MediaSelectionItem, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, item := range items {
		item.URL = strings.TrimSpace(item.URL)
		item.Usage = strings.TrimSpace(item.Usage)
		if item.Index < 0 {
			item.Index = 0
		}
		if item.URL == "" && item.Index == 0 {
			continue
		}
		key := fmt.Sprintf("%d:%s", item.Index, item.URL)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, item)
	}
	return result
}

func mediaSelectionItemsKey(items []MediaSelectionItem) string {
	parts := make([]string, 0, len(items))
	for _, item := range items {
		parts = append(parts, fmt.Sprintf("%d:%s:%s", item.Index, item.URL, item.Usage))
	}
	return strings.Join(parts, "\x1e")
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
	case TypeMessage, TypeArtifact, TypeUploadFile, TypeSession, TypeAsset:
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func normalizeTrigger(value string) string {
	value = strings.TrimSpace(value)
	if len([]rune(value)) == 1 {
		return value
	}
	return ""
}

func normalizeReferenceTrigger(referenceType string, trigger string) string {
	if referenceType == TypeAsset {
		return "@"
	}
	if referenceType == TypeMessage || referenceType == TypeArtifact || referenceType == TypeUploadFile || referenceType == TypeSession {
		return "#"
	}
	return normalizeTrigger(trigger)
}

func cleanLabel(value string) string {
	value = strings.TrimSpace(strings.Join(strings.Fields(value), " "))
	runes := []rune(value)
	if len(runes) > 80 {
		return string(runes[:80])
	}
	return value
}
