package richtext

import (
	"encoding/json"
	"fmt"
	"strings"
)

func PlainText(raw string) string {
	text := strings.TrimSpace(raw)
	if text == "" || !strings.HasPrefix(text, "{") {
		return text
	}
	var document map[string]any
	if err := json.Unmarshal([]byte(text), &document); err != nil || valueText(document["type"]) != "doc" {
		return text
	}
	return strings.TrimSpace(richTextNodeText(document))
}

func richTextNodeText(node map[string]any) string {
	switch strings.TrimSpace(valueText(node["type"])) {
	case "doc":
		return joinRichTextNodes(node["content"], "\n")
	case "text":
		return valueText(node["text"])
	case "hardBreak":
		return "\n"
	case "heading", "paragraph", "blockquote", "codeBlock":
		return joinRichTextInline(node["content"])
	case "bulletList", "orderedList", "table":
		return joinRichTextNodes(node["content"], "\n")
	case "listItem":
		if text := strings.TrimSpace(joinRichTextNodes(node["content"], "\n")); text != "" {
			return "- " + text
		}
	case "tableRow":
		return joinRichTextNodes(node["content"], "\t")
	case "tableCell", "tableHeader":
		return joinRichTextNodes(node["content"], " ")
	case "editorMediaImage":
		return richTextMediaText("图片", node["attrs"])
	case "editorMediaVideo":
		return richTextMediaText("视频", node["attrs"])
	case "editorMediaAudio":
		return richTextMediaText("音频", node["attrs"])
	default:
		return joinRichTextNodes(node["content"], "\n")
	}
	return ""
}

func joinRichTextInline(value any) string {
	nodes, ok := value.([]any)
	if !ok {
		return ""
	}
	var result strings.Builder
	for _, current := range nodes {
		node, currentOK := current.(map[string]any)
		if !currentOK {
			continue
		}
		if strings.TrimSpace(valueText(node["type"])) == "hardBreak" {
			result.WriteByte('\n')
			continue
		}
		result.WriteString(richTextNodeText(node))
	}
	return strings.TrimSpace(result.String())
}

func joinRichTextNodes(value any, separator string) string {
	nodes, ok := value.([]any)
	if !ok {
		return ""
	}
	parts := make([]string, 0, len(nodes))
	for _, current := range nodes {
		node, ok := current.(map[string]any)
		if !ok {
			continue
		}
		if text := strings.TrimSpace(richTextNodeText(node)); text != "" {
			parts = append(parts, text)
		}
	}
	return strings.TrimSpace(strings.Join(parts, separator))
}

func richTextMediaText(label string, value any) string {
	attrs, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	title := strings.TrimSpace(valueText(attrs["title"]))
	if title == "" {
		title = strings.TrimSpace(valueText(attrs["alt"]))
	}
	source := strings.TrimSpace(valueText(attrs["src"]))
	switch {
	case title != "" && source != "":
		return fmt.Sprintf("[%s: %s %s]", label, title, source)
	case title != "":
		return fmt.Sprintf("[%s: %s]", label, title)
	case source != "":
		return fmt.Sprintf("[%s: %s]", label, source)
	default:
		return ""
	}
}

func valueText(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
