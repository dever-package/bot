package parse

import (
	"fmt"
	"path/filepath"
	"strings"
)

func parseCode(req Request, content string) Result {
	content = normalizeText(content)
	title := req.Name
	if title == "" {
		title = "代码"
	}
	nodes := make([]Node, 0)
	chunks := splitLongText(content, req.MaxNodeLength)
	for index, chunk := range chunks {
		nodeTitle := title
		if len(chunks) > 1 {
			nodeTitle = fmt.Sprintf("%s #%d", title, index+1)
		}
		nodes = append(nodes, Node{
			Type:      NodeTypeCode,
			Title:     nodeTitle,
			Content:   chunk,
			PlainText: chunk,
			LineStart: index + 1,
			LineEnd:   index + 1,
			Metadata: map[string]any{
				"language": codeLanguage(req.Name),
			},
		})
	}
	return Result{
		PlainText: content,
		Markdown:  content,
		Outline:   nodes,
		Raw: map[string]any{
			"parser": "code",
		},
	}
}

func codeLanguage(name string) string {
	ext := strings.TrimPrefix(strings.ToLower(filepath.Ext(name)), ".")
	if ext == "" {
		return "text"
	}
	return ext
}
