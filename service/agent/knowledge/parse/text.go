package parse

import "fmt"

func parseText(req Request, content string) Result {
	content = normalizeText(content)
	nodes := make([]Node, 0)
	chunks := splitLongText(content, req.MaxNodeLength)
	for index, chunk := range chunks {
		nodes = append(nodes, Node{
			Type:      NodeTypeParagraph,
			Title:     paragraphTitle(chunk, index+1),
			Content:   chunk,
			PlainText: chunk,
			LineStart: index + 1,
			LineEnd:   index + 1,
		})
	}
	return Result{
		PlainText: content,
		Markdown:  content,
		Outline:   nodes,
		Raw: map[string]any{
			"parser": "text",
		},
	}
}

func paragraphTitle(content string, index int) string {
	if title := firstLine(content); title != "" {
		return title
	}
	return fmt.Sprintf("段落 %d", index)
}
