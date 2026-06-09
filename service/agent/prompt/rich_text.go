package prompt

import (
	"encoding/json"
	"fmt"
	"strings"
)

func promptTextFromRichText(raw string) string {
	return TextFromRichText(raw)
}

func TextFromRichText(raw string) string {
	text := strings.TrimSpace(raw)
	if text == "" || !strings.HasPrefix(text, "{") {
		return text
	}

	var doc map[string]any
	if err := json.Unmarshal([]byte(text), &doc); err != nil {
		return text
	}
	if strings.TrimSpace(toString(doc["type"])) != "doc" {
		return text
	}

	normalized := strings.TrimSpace(richTextNodeText(doc))
	if normalized == "" {
		return text
	}
	return normalized
}

func richTextNodeText(node map[string]any) string {
	switch strings.TrimSpace(toString(node["type"])) {
	case "doc":
		return joinRichTextBlocks(node["content"], "\n")
	case "text":
		return toString(node["text"])
	case "hardBreak":
		return "\n"
	case "heading", "paragraph", "blockquote":
		return joinRichTextInline(node["content"])
	case "bulletList", "orderedList":
		return joinRichTextList(node["content"])
	case "listItem":
		content := strings.TrimSpace(joinRichTextBlocks(node["content"], "\n"))
		if content == "" {
			return ""
		}
		return "- " + content
	case "table":
		return joinRichTextBlocks(node["content"], "\n")
	case "tableRow":
		return joinRichTextBlocks(node["content"], "\t")
	case "tableCell", "tableHeader":
		return joinRichTextBlocks(node["content"], " ")
	case "editorMediaImage":
		return richTextMediaText("图片", node["attrs"])
	case "editorMediaVideo":
		return richTextMediaText("视频", node["attrs"])
	case "editorMediaAudio":
		return richTextMediaText("音频", node["attrs"])
	default:
		return joinRichTextBlocks(node["content"], "\n")
	}
}

func joinRichTextInline(content any) string {
	nodes, ok := content.([]any)
	if !ok {
		return ""
	}

	parts := make([]string, 0, len(nodes))
	for _, item := range nodes {
		child, ok := item.(map[string]any)
		if !ok {
			continue
		}
		text := richTextNodeText(child)
		if text == "" {
			continue
		}
		parts = append(parts, text)
	}
	return strings.TrimSpace(strings.Join(parts, ""))
}

func joinRichTextBlocks(content any, separator string) string {
	nodes, ok := content.([]any)
	if !ok {
		return ""
	}

	parts := make([]string, 0, len(nodes))
	for _, item := range nodes {
		child, ok := item.(map[string]any)
		if !ok {
			continue
		}
		text := strings.TrimSpace(richTextNodeText(child))
		if text == "" {
			continue
		}
		parts = append(parts, text)
	}
	return strings.TrimSpace(strings.Join(parts, separator))
}

func joinRichTextList(content any) string {
	nodes, ok := content.([]any)
	if !ok {
		return ""
	}

	parts := make([]string, 0, len(nodes))
	for _, item := range nodes {
		child, ok := item.(map[string]any)
		if !ok {
			continue
		}
		text := strings.TrimSpace(richTextNodeText(child))
		if text == "" {
			continue
		}
		parts = append(parts, text)
	}
	return strings.TrimSpace(strings.Join(parts, "\n"))
}

func richTextMediaText(label string, attrs any) string {
	attrMap, ok := attrs.(map[string]any)
	if !ok {
		return ""
	}

	title := strings.TrimSpace(toString(attrMap["title"]))
	if title == "" {
		title = strings.TrimSpace(toString(attrMap["alt"]))
	}
	src := strings.TrimSpace(toString(attrMap["src"]))
	if title != "" && src != "" {
		return fmt.Sprintf("[%s: %s %s]", label, title, src)
	}
	if title != "" {
		return fmt.Sprintf("[%s: %s]", label, title)
	}
	if src != "" {
		return fmt.Sprintf("[%s: %s]", label, src)
	}
	return ""
}

func toString(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
