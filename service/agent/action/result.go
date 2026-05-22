package action

import (
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
)

const (
	KindFinal = "final_result"
	KindTool  = "tool_result"
)

func ExtractAgentResult(text string) (string, map[string]any, bool) {
	clean, payload, ok := extractJSONFence(text, []string{"agent-result", "agent-output"}, validAgentResult)
	if ok {
		return clean, payload, true
	}
	if payload, ok := extractJSONObject(text, validAgentResult); ok {
		return "", payload, true
	}
	return text, nil, false
}

func validAgentResult(result map[string]any) bool {
	if len(result) == 0 {
		return false
	}
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == KindFinal || kind == KindTool {
		return true
	}
	if _, ok := result["suggestions"]; ok {
		return true
	}
	if _, ok := result["content"]; ok {
		return true
	}
	if hasResultOutputField(result) || hasResultOutputField(normalizeMap(result["content"])) {
		return true
	}
	return strings.TrimSpace(firstText(result["text"])) != ""
}

func ApplyAgentResult(output map[string]any, result map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == "" {
		kind = KindFinal
	}
	next["kind"] = kind
	next["event"] = "final"

	clearResultOutputFields(next)
	contentMap := map[string]any{}
	if content, exists := result["content"]; exists {
		contentMap = normalizeAgentResultContent(content)
	}
	if len(contentMap) > 0 {
		next["content"] = contentMap
	} else if content, exists := result["content"]; exists {
		next["content"] = content
	}
	copyResultOutputFields(next, contentMap)
	copyResultOutputFields(next, result)
	if text := agentResultText(result); text != "" {
		next["text"] = text
	} else if strings.TrimSpace(fallbackText) != "" {
		next["text"] = strings.TrimSpace(fallbackText)
	} else {
		delete(next, "text")
	}
	if suggestions := NormalizeSuggestions(result["suggestions"]); len(suggestions) > 0 {
		next["suggestions"] = suggestions
	}
	copyResultTaskFields(next, result, contentMap)
	next["result_mode"] = inferAgentResultMode(result, contentMap)
	delete(next, "reasoning")
	return EnsureAgentRichOutput(next)
}

var resultMediaKeys = []string{"images", "videos", "audios", "files"}

func clearResultOutputFields(target map[string]any) {
	for _, key := range []string{"title", "rich", "json", "value", "content"} {
		delete(target, key)
	}
	for _, key := range resultMediaKeys {
		delete(target, key)
	}
}

func hasResultOutputField(source map[string]any) bool {
	if len(source) == 0 {
		return false
	}
	for _, key := range []string{"title", "rich", "json", "value"} {
		if resultFieldHasValue(source[key]) {
			return true
		}
	}
	for _, key := range resultMediaKeys {
		if len(normalizeActionMediaList(source[key], key)) > 0 {
			return true
		}
	}
	return false
}

func copyResultOutputFields(target map[string]any, source map[string]any) {
	if len(source) == 0 {
		return
	}
	for _, key := range []string{"title", "rich", "json"} {
		copyResultValue(target, source, key)
	}
	if !resultFieldHasValue(target["rich"]) {
		if rich := normalizeMap(source["value"]); len(rich) > 0 {
			target["rich"] = rich
		}
	}
	for _, key := range resultMediaKeys {
		copyResultMedia(target, source, key)
	}
}

func copyResultTaskFields(target map[string]any, sources ...map[string]any) {
	for _, source := range sources {
		if len(source) == 0 {
			continue
		}
		for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
			value, exists := source[key]
			if !exists || !resultFieldHasValue(value) {
				continue
			}
			target["tasks"] = value
			return
		}
	}
}

func inferAgentResultMode(result map[string]any, content map[string]any) string {
	if mode := normalizeAgentResultMode(firstText(
		result["result_mode"],
		result["display_mode"],
		content["result_mode"],
		content["display_mode"],
	)); mode != "" {
		return mode
	}

	if hasAbilityTaskField(result) || hasAbilityTaskField(content) {
		return "artifact"
	}
	if strings.EqualFold(strings.TrimSpace(firstText(content["format"])), "rich_json") {
		return "artifact"
	}
	if hasArtifactOutputField(result) || hasArtifactOutputField(content) {
		return "artifact"
	}
	return "inline"
}

func normalizeAgentResultMode(mode string) string {
	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "artifact", "detail", "drawer":
		return "artifact"
	case "inline":
		return "inline"
	default:
		return ""
	}
}

func hasAbilityTaskField(source map[string]any) bool {
	if len(source) == 0 {
		return false
	}
	for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
		if resultFieldHasValue(source[key]) {
			return true
		}
	}
	return false
}

func hasArtifactOutputField(source map[string]any) bool {
	if len(source) == 0 {
		return false
	}
	for _, key := range []string{"rich", "json", "value"} {
		if resultFieldHasValue(source[key]) {
			return true
		}
	}
	for _, key := range resultMediaKeys {
		if len(normalizeActionMediaList(source[key], key)) > 0 {
			return true
		}
	}
	return false
}

func copyResultValue(target map[string]any, source map[string]any, key string) {
	value, exists := source[key]
	if !exists || !resultFieldHasValue(value) || resultFieldHasValue(target[key]) {
		return
	}
	target[key] = value
}

func copyResultMedia(target map[string]any, source map[string]any, key string) {
	if len(normalizeActionMediaList(target[key], key)) > 0 {
		return
	}
	if values := normalizeActionMediaList(source[key], key); len(values) > 0 {
		target[key] = values
	}
}

func resultFieldHasValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case []string:
		return len(current) > 0
	case map[string]any:
		return len(current) > 0
	default:
		return true
	}
}

func NormalizeAgentFinalOutput(output map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	if strings.TrimSpace(firstText(next["kind"], next["type"])) == "" {
		next["kind"] = KindFinal
	}
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
	}
	if strings.TrimSpace(firstText(next["text"])) == "" && strings.TrimSpace(fallbackText) != "" {
		next["text"] = strings.TrimSpace(fallbackText)
	}
	normalizeOutputMediaFields(next)
	delete(next, "reasoning")
	return next
}

func NormalizeToolResultOutput(output map[string]any, _ string) map[string]any {
	next := cloneMap(output)
	next["kind"] = KindTool
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
	}
	normalizeOutputMediaFields(next)
	delete(next, "reasoning")
	return next
}

func EnsureAgentRichOutput(output map[string]any) map[string]any {
	next := cloneMap(output)
	normalizeOutputMediaFields(next)
	ensureAgentRichContent(next)
	return next
}

func HasDisplayOutput(output map[string]any) bool {
	if len(output) == 0 {
		return false
	}
	content := normalizeMap(output["content"])
	for _, source := range []map[string]any{output, content} {
		if len(source) == 0 {
			continue
		}
		if strings.TrimSpace(firstText(source["text"], source["title"], source["error"])) != "" {
			return true
		}
		for _, key := range []string{"rich", "json", "value"} {
			if resultFieldHasValue(source[key]) {
				return true
			}
		}
		for _, key := range resultMediaKeys {
			if len(normalizeActionMediaList(source[key], key)) > 0 {
				return true
			}
		}
	}
	return false
}

func normalizeOutputMediaFields(output map[string]any) {
	for _, key := range resultMediaKeys {
		if values := normalizeActionMediaList(output[key], key); len(values) > 0 {
			output[key] = values
		}
	}
}

func normalizeActionMediaList(value any, key string) []string {
	mediaType := strings.TrimSuffix(key, "s")
	values := botprotocol.NormalizeMediaList(value, mediaType)
	if len(values) > 0 {
		return values
	}
	return botprotocol.NormalizeStringList(value)
}

func normalizeResultKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "tool", "tool_result", "call_power", "power_result":
		return KindTool
	case "final", "result", "final_result", "answer":
		return KindFinal
	default:
		return strings.ToLower(strings.TrimSpace(value))
	}
}

func agentResultText(result map[string]any) string {
	if text := scalarText(result["text"]); text != "" {
		return text
	}
	contentMap := normalizeAgentResultContent(result["content"])
	if len(contentMap) == 0 {
		return ""
	}
	return scalarText(contentMap["text"])
}

func normalizeAgentResultContent(value any) map[string]any {
	if content := cloneMap(normalizeMap(value)); len(content) > 0 {
		return content
	}
	if text := scalarText(value); text != "" {
		return map[string]any{
			"format": "markdown",
			"text":   text,
		}
	}
	nodes := normalizeAgentResultRichNodes(value)
	if len(nodes) == 0 {
		return map[string]any{}
	}
	content := map[string]any{
		"format": "rich_json",
		"rich": map[string]any{
			"type":    "doc",
			"content": nodes,
		},
	}
	if text := strings.TrimSpace(richNodesText(nodes)); text != "" {
		content["text"] = text
	}
	return content
}

func normalizeAgentResultRichNodes(value any) []any {
	switch current := value.(type) {
	case []any:
		nodes := make([]any, 0, len(current))
		for _, item := range current {
			nodes = appendAgentResultRichNode(nodes, item)
		}
		return nodes
	case []map[string]any:
		nodes := make([]any, 0, len(current))
		for _, item := range current {
			nodes = appendAgentResultRichNode(nodes, item)
		}
		return nodes
	default:
		return nil
	}
}

func appendAgentResultRichNode(nodes []any, value any) []any {
	if text := scalarText(value); text != "" {
		return append(nodes, richTextNode("paragraph", nil, text))
	}
	node := cloneMap(normalizeMap(value))
	if len(node) == 0 {
		return nodes
	}
	if strings.TrimSpace(firstText(node["type"])) == "text" {
		if text := strings.TrimSpace(firstText(node["text"])); text != "" {
			return append(nodes, richTextNode("paragraph", nil, text))
		}
		return nodes
	}
	return append(nodes, normalizeRichNode(node))
}

func scalarText(value any) string {
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current)
	case []byte:
		return strings.TrimSpace(string(current))
	default:
		return ""
	}
}

func richNodesText(nodes []any) string {
	parts := make([]string, 0)
	for _, node := range nodes {
		collectRichNodeText(node, &parts)
	}
	return strings.Join(parts, "\n\n")
}

func collectRichNodeText(value any, parts *[]string) {
	switch current := value.(type) {
	case map[string]any:
		if strings.TrimSpace(firstText(current["type"])) == "text" {
			if text := strings.TrimSpace(firstText(current["text"])); text != "" {
				*parts = append(*parts, text)
			}
			return
		}
		collectRichNodeText(current["content"], parts)
	case []any:
		for _, item := range current {
			collectRichNodeText(item, parts)
		}
	case []map[string]any:
		for _, item := range current {
			collectRichNodeText(item, parts)
		}
	}
}

func NormalizeSuggestions(value any) []map[string]any {
	switch values := value.(type) {
	case []any:
		result := make([]map[string]any, 0, len(values))
		for _, item := range values {
			if suggestion := normalizeAgentSuggestion(item); len(suggestion) > 0 {
				result = append(result, suggestion)
			}
		}
		return result
	case []map[string]any:
		result := make([]map[string]any, 0, len(values))
		for _, item := range values {
			if suggestion := normalizeAgentSuggestion(item); len(suggestion) > 0 {
				result = append(result, suggestion)
			}
		}
		return result
	default:
		if text := strings.TrimSpace(firstText(value)); text != "" {
			return []map[string]any{{"label": text, "prompt": text}}
		}
		return nil
	}
}

func normalizeAgentSuggestion(value any) map[string]any {
	mapped := normalizeMap(value)
	if len(mapped) == 0 {
		if text := strings.TrimSpace(firstText(value)); text != "" {
			return map[string]any{"label": text, "prompt": text}
		}
		return nil
	}
	label := strings.TrimSpace(firstText(mapped["label"], mapped["name"], mapped["title"]))
	prompt := strings.TrimSpace(firstText(mapped["prompt"], mapped["text"], mapped["value"], mapped["input"]))
	if label == "" {
		label = prompt
	}
	if prompt == "" {
		prompt = label
	}
	if label == "" || prompt == "" {
		return nil
	}
	return map[string]any{
		"label":  label,
		"prompt": prompt,
	}
}
