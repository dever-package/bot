package parse

import (
	"fmt"
	"regexp"
	"strings"
)

var markdownHeadingPattern = regexp.MustCompile(`^(#{1,6})\s+(.+)$`)

func parseMarkdown(req Request, content string) Result {
	content = normalizeText(content)
	root := []*Node{}
	stack := []*Node{}
	currentLines := make([]string, 0)
	currentLineStart := 1
	lines := strings.Split(content, "\n")

	flushParagraph := func(lineEnd int) {
		text := strings.TrimSpace(strings.Join(currentLines, "\n"))
		currentLines = currentLines[:0]
		if text == "" {
			return
		}
		nodes := paragraphNodes(text, req.MaxNodeLength, currentLineStart, lineEnd)
		if len(stack) == 0 {
			for index := range nodes {
				node := nodes[index]
				root = append(root, &node)
			}
			return
		}
		parent := stack[len(stack)-1]
		parent.Children = append(parent.Children, nodes...)
	}

	for index, line := range lines {
		lineNo := index + 1
		if match := markdownHeadingPattern.FindStringSubmatch(strings.TrimSpace(line)); len(match) == 3 {
			flushParagraph(lineNo - 1)
			level := len(match[1])
			node := Node{
				Type:      NodeTypeHeading,
				Title:     strings.TrimSpace(match[2]),
				Level:     level,
				LineStart: lineNo,
				LineEnd:   lineNo,
			}
			for len(stack) > 0 && stack[len(stack)-1].Level >= level {
				stack = stack[:len(stack)-1]
			}
			nodePtr := &node
			if len(stack) == 0 {
				root = append(root, nodePtr)
				stack = append(stack, nodePtr)
			} else {
				parent := stack[len(stack)-1]
				parent.Children = append(parent.Children, node)
				stack = append(stack, &parent.Children[len(parent.Children)-1])
			}
			continue
		}
		if len(currentLines) == 0 {
			currentLineStart = lineNo
		}
		currentLines = append(currentLines, line)
	}
	flushParagraph(len(lines))
	return Result{
		PlainText: markdownPlainText(content),
		Markdown:  content,
		Outline:   dereferenceNodes(root),
		Raw: map[string]any{
			"parser": "markdown",
		},
	}
}

func dereferenceNodes(nodes []*Node) []Node {
	result := make([]Node, 0, len(nodes))
	for _, node := range nodes {
		if node != nil {
			result = append(result, *node)
		}
	}
	return result
}

func paragraphNodes(text string, limit int, lineStart int, lineEnd int) []Node {
	result := make([]Node, 0)
	for index, chunk := range splitLongText(text, limit) {
		title := firstLine(chunk)
		if title == "" {
			title = fmt.Sprintf("段落 %d", index+1)
		}
		result = append(result, Node{
			Type:      markdownBlockType(chunk),
			Title:     title,
			Content:   chunk,
			PlainText: markdownPlainText(chunk),
			LineStart: lineStart,
			LineEnd:   lineEnd,
		})
	}
	return result
}

func markdownBlockType(text string) string {
	trimmed := strings.TrimSpace(text)
	if strings.HasPrefix(trimmed, "```") {
		return NodeTypeCode
	}
	if strings.HasPrefix(trimmed, "|") && strings.Contains(trimmed, "\n|") {
		return NodeTypeTable
	}
	if strings.HasPrefix(trimmed, "![") {
		return NodeTypeImage
	}
	return NodeTypeParagraph
}

func markdownPlainText(text string) string {
	text = markdownHeadingPattern.ReplaceAllString(text, "$2")
	text = strings.ReplaceAll(text, "`", "")
	text = strings.ReplaceAll(text, "**", "")
	text = strings.ReplaceAll(text, "__", "")
	return normalizeText(text)
}
