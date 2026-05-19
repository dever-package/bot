package action

import "strings"

const (
	richImageNode = "editorMediaImage"
	richVideoNode = "editorMediaVideo"
	richAudioNode = "editorMediaAudio"
)

func ensureAgentRichContent(output map[string]any) {
	content := cloneMap(normalizeMap(output["content"]))
	text := strings.TrimSpace(firstText(output["text"], content["text"]))
	media := collectRichMedia(output, content, text)
	rich := normalizeMap(firstPresent(output, "rich"))
	if len(rich) == 0 {
		rich = normalizeMap(content["rich"])
	}
	if len(rich) == 0 {
		rich = buildRichDoc(text, media)
	} else {
		rich = appendMissingRichMedia(rich, media)
	}
	rich = normalizeRichDoc(rich)

	if text != "" {
		output["text"] = text
		content["text"] = text
	}
	if len(rich) > 0 {
		output["rich"] = rich
		content["format"] = "rich_json"
		content["rich"] = rich
	}
	for _, key := range resultMediaKeys {
		if values := media[key]; len(values) > 0 {
			output[key] = values
			content[key] = values
		}
	}
	if len(content) > 0 {
		output["content"] = content
	}
}

func collectRichMedia(output map[string]any, content map[string]any, text string) map[string][]string {
	media := map[string][]string{}
	for _, key := range resultMediaKeys {
		media[key] = appendUniqueStrings(media[key], normalizeActionMediaList(content[key], key)...)
		media[key] = appendUniqueStrings(media[key], normalizeActionMediaList(output[key], key)...)
	}
	media["images"] = appendUniqueStrings(media["images"], markdownImageURLs(text)...)
	return media
}

func buildRichDoc(text string, media map[string][]string) map[string]any {
	nodes := make([]any, 0)
	seenMedia := map[string]struct{}{}
	for i, lines := 0, strings.Split(normalizeLineBreaks(text), "\n"); i < len(lines); {
		line := strings.TrimSpace(lines[i])
		if line == "" {
			i++
			continue
		}
		if isMarkdownRule(line) {
			nodes = append(nodes, map[string]any{"type": "horizontalRule"})
			i++
			continue
		}
		if alt, url, ok := markdownImage(line); ok {
			nodes = appendRichMediaNode(nodes, "image", url, alt, seenMedia)
			i++
			continue
		}
		if item, ok := markdownBulletItem(line); ok {
			list, next := richList(lines, i, false, item)
			nodes = append(nodes, list)
			i = next
			continue
		}
		if item, ok := markdownOrderedItem(line); ok {
			list, next := richList(lines, i, true, item)
			nodes = append(nodes, list)
			i = next
			continue
		}
		if heading, ok := markdownHeading(line); ok {
			nodes = append(nodes, richTextNode("heading", map[string]any{"level": 2}, heading))
			i++
			continue
		}
		nodes = append(nodes, richTextNode("paragraph", nil, line))
		i++
	}
	nodes = appendRichMediaNodes(nodes, "image", media["images"], seenMedia)
	nodes = appendRichMediaNodes(nodes, "video", media["videos"], seenMedia)
	nodes = appendRichMediaNodes(nodes, "audio", media["audios"], seenMedia)
	nodes = appendFileNodes(nodes, media["files"], seenMedia)
	if len(nodes) == 0 {
		return nil
	}
	return map[string]any{
		"type":    "doc",
		"content": nodes,
	}
}

func appendMissingRichMedia(doc map[string]any, media map[string][]string) map[string]any {
	if len(doc) == 0 || doc["type"] != "doc" {
		return doc
	}
	nodes := richContent(doc)
	seen := map[string]struct{}{}
	collectRichMediaURLs(doc, seen)
	nodes = appendRichMediaNodes(nodes, "image", media["images"], seen)
	nodes = appendRichMediaNodes(nodes, "video", media["videos"], seen)
	nodes = appendRichMediaNodes(nodes, "audio", media["audios"], seen)
	nodes = appendFileNodes(nodes, media["files"], seen)
	doc["content"] = nodes
	return doc
}

func normalizeRichDoc(doc map[string]any) map[string]any {
	if len(doc) == 0 {
		return doc
	}
	return normalizeRichNode(doc)
}

func normalizeRichNode(node map[string]any) map[string]any {
	switch strings.TrimSpace(firstText(node["type"])) {
	case "image", "mediaImage":
		node["type"] = richImageNode
	case "video", "mediaVideo":
		node["type"] = richVideoNode
	case "audio", "mediaAudio":
		node["type"] = richAudioNode
	}

	if content := normalizeRichNodeContent(node["content"]); len(content) > 0 {
		node["content"] = content
	}
	return node
}

func normalizeRichNodeContent(value any) []any {
	nodes := richContent(map[string]any{"content": value})
	for index, item := range nodes {
		if node, ok := item.(map[string]any); ok {
			nodes[index] = normalizeRichNode(node)
		}
	}
	return nodes
}

func richContent(doc map[string]any) []any {
	switch content := doc["content"].(type) {
	case []any:
		return append([]any{}, content...)
	case []map[string]any:
		nodes := make([]any, 0, len(content))
		for _, node := range content {
			nodes = append(nodes, node)
		}
		return nodes
	default:
		return []any{}
	}
}

func collectRichMediaURLs(value any, seen map[string]struct{}) {
	switch current := value.(type) {
	case map[string]any:
		if attrs := normalizeMap(current["attrs"]); attrs != nil {
			if src := strings.TrimSpace(firstText(attrs["src"])); src != "" {
				seen[src] = struct{}{}
			}
		}
		collectRichMediaURLs(current["content"], seen)
	case []any:
		for _, item := range current {
			collectRichMediaURLs(item, seen)
		}
	case []map[string]any:
		for _, item := range current {
			collectRichMediaURLs(item, seen)
		}
	}
}

func richList(lines []string, start int, ordered bool, firstItem string) (map[string]any, int) {
	items := make([]any, 0)
	for i := start; i < len(lines); i++ {
		line := strings.TrimSpace(lines[i])
		item := ""
		ok := false
		if i == start {
			item, ok = firstItem, true
		} else if ordered {
			item, ok = markdownOrderedItem(line)
		} else {
			item, ok = markdownBulletItem(line)
		}
		if !ok {
			return richListNode(ordered, items), i
		}
		items = append(items, map[string]any{
			"type":    "listItem",
			"content": []any{richTextNode("paragraph", nil, item)},
		})
	}
	return richListNode(ordered, items), len(lines)
}

func richListNode(ordered bool, items []any) map[string]any {
	nodeType := "bulletList"
	if ordered {
		nodeType = "orderedList"
	}
	return map[string]any{
		"type":    nodeType,
		"content": items,
	}
}

func richTextNode(nodeType string, attrs map[string]any, text string) map[string]any {
	node := map[string]any{"type": nodeType}
	if len(attrs) > 0 {
		node["attrs"] = attrs
	}
	if content := richInlineText(text); len(content) > 0 {
		node["content"] = content
	}
	return node
}

func richInlineText(text string) []any {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	nodes := make([]any, 0)
	for text != "" {
		start := strings.Index(text, "**")
		if start < 0 {
			nodes = appendTextNode(nodes, text, false)
			break
		}
		if start > 0 {
			nodes = appendTextNode(nodes, text[:start], false)
		}
		text = text[start+2:]
		end := strings.Index(text, "**")
		if end < 0 {
			nodes = appendTextNode(nodes, "**"+text, false)
			break
		}
		nodes = appendTextNode(nodes, text[:end], true)
		text = text[end+2:]
	}
	return nodes
}

func appendTextNode(nodes []any, text string, bold bool) []any {
	if text == "" {
		return nodes
	}
	node := map[string]any{
		"type": "text",
		"text": text,
	}
	if bold {
		node["marks"] = []any{map[string]any{"type": "bold"}}
	}
	return append(nodes, node)
}

func appendRichMediaNodes(nodes []any, kind string, urls []string, seen map[string]struct{}) []any {
	for _, url := range urls {
		nodes = appendRichMediaNode(nodes, kind, url, "", seen)
	}
	return nodes
}

func appendRichMediaNode(nodes []any, kind string, url string, alt string, seen map[string]struct{}) []any {
	url = strings.TrimSpace(url)
	if url == "" {
		return nodes
	}
	if _, exists := seen[url]; exists {
		return nodes
	}
	seen[url] = struct{}{}
	attrs := map[string]any{
		"src":      url,
		"maxWidth": richMediaMaxWidth(kind),
	}
	if kind == "image" {
		attrs["alt"] = alt
		attrs["title"] = alt
	}
	return append(nodes, map[string]any{
		"type":  richMediaNodeName(kind),
		"attrs": attrs,
	})
}

func appendFileNodes(nodes []any, urls []string, seen map[string]struct{}) []any {
	for _, url := range urls {
		url = strings.TrimSpace(url)
		if url == "" {
			continue
		}
		if _, exists := seen[url]; exists {
			continue
		}
		seen[url] = struct{}{}
		nodes = append(nodes, richTextNode("paragraph", nil, "文件："+url))
	}
	return nodes
}

func richMediaNodeName(kind string) string {
	switch kind {
	case "video":
		return richVideoNode
	case "audio":
		return richAudioNode
	default:
		return richImageNode
	}
}

func richMediaMaxWidth(kind string) string {
	if kind == "audio" {
		return "384px"
	}
	return "50%"
}

func markdownImageURLs(text string) []string {
	urls := make([]string, 0)
	for _, line := range strings.Split(normalizeLineBreaks(text), "\n") {
		if _, url, ok := markdownImage(strings.TrimSpace(line)); ok {
			urls = append(urls, url)
		}
	}
	return urls
}

func markdownImage(line string) (string, string, bool) {
	if !strings.HasPrefix(line, "![") || !strings.HasSuffix(line, ")") {
		return "", "", false
	}
	endAlt := strings.Index(line, "](")
	if endAlt < 0 {
		return "", "", false
	}
	alt := strings.TrimSpace(line[2:endAlt])
	url := strings.TrimSpace(line[endAlt+2 : len(line)-1])
	if cut := strings.Index(url, " \""); cut > 0 {
		url = strings.TrimSpace(url[:cut])
	}
	return alt, url, url != ""
}

func markdownHeading(line string) (string, bool) {
	level := 0
	for level < len(line) && level < 6 && line[level] == '#' {
		level++
	}
	if level == 0 || len(line) <= level {
		return "", false
	}
	if line[level] == ' ' {
		return strings.TrimSpace(line[level+1:]), true
	}
	if level > 1 {
		return strings.TrimSpace(line[level:]), true
	}
	return "", false
}

func markdownBulletItem(line string) (string, bool) {
	if len(line) < 3 || line[1] != ' ' {
		return "", false
	}
	switch line[0] {
	case '-', '*', '+':
		return strings.TrimSpace(line[2:]), true
	default:
		return "", false
	}
}

func markdownOrderedItem(line string) (string, bool) {
	index := 0
	for index < len(line) && line[index] >= '0' && line[index] <= '9' {
		index++
	}
	if index == 0 || index+1 >= len(line) {
		return "", false
	}
	if (line[index] != '.' && line[index] != ')') || line[index+1] != ' ' {
		return "", false
	}
	return strings.TrimSpace(line[index+2:]), true
}

func isMarkdownRule(line string) bool {
	switch line {
	case "---", "***", "___":
		return true
	default:
		return false
	}
}

func normalizeLineBreaks(text string) string {
	text = strings.ReplaceAll(text, "\r\n", "\n")
	return strings.ReplaceAll(text, "\r", "\n")
}
