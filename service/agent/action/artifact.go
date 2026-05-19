package action

import "strings"

var agentArtifactKeys = []string{"images", "videos", "audios", "files"}

type ArtifactAccumulator struct {
	values map[string][]string
	blocks []artifactBlock
}

type artifactBlock struct {
	Text  string
	Media map[string][]string
}

func NewArtifactAccumulator() ArtifactAccumulator {
	return ArtifactAccumulator{values: map[string][]string{}}
}

func (a *ArtifactAccumulator) Add(output map[string]any) {
	if len(output) == 0 {
		return
	}
	if a.values == nil {
		a.values = map[string][]string{}
	}
	content := normalizeMap(output["content"])
	text := strings.TrimSpace(firstText(output["text"], content["text"]))
	media := collectRichMedia(output, content, text)
	if text != "" && hasMedia(media) && isToolArtifactOutput(output) {
		text = ""
	}
	for _, key := range agentArtifactKeys {
		values := media[key]
		if len(values) == 0 {
			continue
		}
		a.values[key] = appendUniqueStrings(a.values[key], values...)
	}
	if text != "" || hasMedia(media) {
		a.blocks = append(a.blocks, artifactBlock{
			Text:  text,
			Media: cloneMedia(media),
		})
	}
}

func (a ArtifactAccumulator) MergeInto(output map[string]any) map[string]any {
	next := cloneMap(output)
	content := cloneMap(normalizeMap(next["content"]))
	for _, key := range agentArtifactKeys {
		values := appendUniqueStrings(a.values[key], normalizeActionMediaList(content[key], key)...)
		values = appendUniqueStrings(values, normalizeActionMediaList(next[key], key)...)
		if len(values) > 0 {
			next[key] = values
			content[key] = values
		}
	}
	if rich := a.richDocFor(next, content); len(rich) > 0 {
		next["rich"] = rich
		content["rich"] = rich
		content["format"] = "rich_json"
	}
	if len(content) > 0 {
		next["content"] = content
	}
	return next
}

func (a ArtifactAccumulator) richDocFor(output map[string]any, content map[string]any) map[string]any {
	current := normalizeMap(firstPresent(output, "rich"))
	if len(current) == 0 {
		current = normalizeMap(content["rich"])
	}
	if len(current) > 0 {
		return appendMissingRichMedia(current, a.values)
	}
	if !a.HasAny() {
		return nil
	}
	return a.buildRichDoc(firstText(output["text"], content["text"]))
}

func isToolArtifactOutput(output map[string]any) bool {
	if normalizeResultKind(firstText(output["kind"], output["type"])) == KindTool {
		return true
	}
	meta := normalizeMap(output["meta"])
	return strings.TrimSpace(firstText(meta["action"])) == "call_power"
}

func (a ArtifactAccumulator) buildRichDoc(finalText string) map[string]any {
	nodes := make([]any, 0)
	seen := map[string]struct{}{}
	for _, block := range a.blocks {
		doc := buildRichDoc(block.Text, block.Media)
		for _, node := range richContent(doc) {
			nodes = appendDraftNode(nodes, node, seen)
		}
	}
	if a.shouldAppendFinalText(finalText) {
		doc := buildRichDoc(finalText, nil)
		for _, node := range richContent(doc) {
			nodes = appendDraftNode(nodes, node, seen)
		}
	}
	nodes = appendRichMediaNodes(nodes, "image", a.values["images"], seen)
	nodes = appendRichMediaNodes(nodes, "video", a.values["videos"], seen)
	nodes = appendRichMediaNodes(nodes, "audio", a.values["audios"], seen)
	nodes = appendFileNodes(nodes, a.values["files"], seen)
	if len(nodes) == 0 {
		return nil
	}
	return map[string]any{
		"type":    "doc",
		"content": nodes,
	}
}

func (a ArtifactAccumulator) HasAny() bool {
	for _, key := range agentArtifactKeys {
		if len(a.values[key]) > 0 {
			return true
		}
	}
	if len(a.blocks) > 0 {
		return true
	}
	return false
}

func appendDraftNode(nodes []any, node any, seen map[string]struct{}) []any {
	source := strings.TrimSpace(richMediaSource(node))
	if source == "" {
		return append(nodes, node)
	}
	if _, exists := seen[source]; exists {
		return nodes
	}
	seen[source] = struct{}{}
	return append(nodes, node)
}

func richMediaSource(node any) string {
	current := normalizeMap(node)
	switch current["type"] {
	case richImageNode, richVideoNode, richAudioNode:
	default:
		return ""
	}
	return firstText(normalizeMap(current["attrs"])["src"])
}

func hasMedia(media map[string][]string) bool {
	for _, key := range agentArtifactKeys {
		if len(media[key]) > 0 {
			return true
		}
	}
	return false
}

func cloneMedia(media map[string][]string) map[string][]string {
	result := make(map[string][]string, len(media))
	for key, values := range media {
		if len(values) > 0 {
			result[key] = append([]string{}, values...)
		}
	}
	return result
}

func (a ArtifactAccumulator) shouldAppendFinalText(finalText string) bool {
	finalText = compactArtifactText(finalText)
	if finalText == "" {
		return false
	}
	draftText := compactArtifactText(a.text())
	if draftText == "" {
		return true
	}
	if strings.Contains(draftText, finalText) {
		return false
	}
	if strings.Contains(finalText, draftText) && len([]rune(finalText)) <= len([]rune(draftText))*2 {
		return false
	}
	return true
}

func (a ArtifactAccumulator) text() string {
	parts := make([]string, 0, len(a.blocks))
	for _, block := range a.blocks {
		if text := strings.TrimSpace(block.Text); text != "" {
			parts = append(parts, text)
		}
	}
	return strings.Join(parts, "\n\n")
}

func compactArtifactText(text string) string {
	return strings.Join(strings.Fields(strings.TrimSpace(text)), " ")
}

func appendUniqueStrings(base []string, values ...string) []string {
	seen := make(map[string]struct{}, len(base)+len(values))
	result := make([]string, 0, len(base)+len(values))
	for _, value := range base {
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	for _, value := range values {
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
