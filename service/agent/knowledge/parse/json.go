package parse

import (
	"encoding/json"
	"fmt"
	"strings"
)

func parseJSON(req Request, content string) Result {
	content = normalizeText(content)
	var payload any
	if err := json.Unmarshal([]byte(content), &payload); err != nil {
		return parseCode(req, content)
	}
	root := jsonNode("$", payload, 0)
	plain := jsonPlainText(payload)
	return Result{
		PlainText: plain,
		Markdown:  content,
		Outline:   []Node{root},
		Raw: map[string]any{
			"parser": "json",
		},
	}
}

func jsonNode(path string, value any, depth int) Node {
	node := Node{
		Type:      NodeTypeHeading,
		Title:     path,
		PlainText: jsonScalarText(value),
		Level:     depth + 1,
		Metadata: map[string]any{
			"json_path": path,
		},
	}
	switch current := value.(type) {
	case map[string]any:
		node.PlainText = ""
		for key, child := range current {
			node.Children = append(node.Children, jsonNode(path+"."+key, child, depth+1))
		}
	case []any:
		node.PlainText = ""
		for index, child := range current {
			node.Children = append(node.Children, jsonNode(fmt.Sprintf("%s[%d]", path, index), child, depth+1))
		}
	default:
		node.Type = NodeTypeParagraph
		node.Content = jsonScalarText(current)
		node.PlainText = node.Content
	}
	return node
}

func jsonScalarText(value any) string {
	switch current := value.(type) {
	case nil:
		return "null"
	case string:
		return current
	default:
		raw, _ := json.Marshal(current)
		return string(raw)
	}
}

func jsonPlainText(value any) string {
	lines := make([]string, 0)
	collectJSONText("$", value, &lines)
	return strings.Join(lines, "\n")
}

func collectJSONText(path string, value any, lines *[]string) {
	switch current := value.(type) {
	case map[string]any:
		for key, child := range current {
			collectJSONText(path+"."+key, child, lines)
		}
	case []any:
		for index, child := range current {
			collectJSONText(fmt.Sprintf("%s[%d]", path, index), child, lines)
		}
	default:
		*lines = append(*lines, path+": "+jsonScalarText(current))
	}
}
