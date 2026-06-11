package parse

import (
	"regexp"
	"strings"
)

var (
	htmlScriptPattern = regexp.MustCompile(`(?is)<(script|style)[^>]*>.*?</(script|style)>`)
	htmlTagPattern    = regexp.MustCompile(`(?s)<[^>]+>`)
	htmlSpacePattern  = regexp.MustCompile(`\s+`)
)

func parseHTML(req Request, content string) Result {
	content = normalizeText(content)
	plain := htmlPlainText(content)
	nodes := make([]Node, 0)
	for index, chunk := range splitLongText(plain, req.MaxNodeLength) {
		nodes = append(nodes, Node{
			Type:      NodeTypeParagraph,
			Title:     paragraphTitle(chunk, index+1),
			Content:   chunk,
			PlainText: chunk,
		})
	}
	return Result{
		PlainText: plain,
		Markdown:  plain,
		Outline:   nodes,
		Raw: map[string]any{
			"parser": "html",
		},
	}
}

func htmlPlainText(content string) string {
	content = htmlScriptPattern.ReplaceAllString(content, " ")
	content = strings.ReplaceAll(content, "<br>", "\n")
	content = strings.ReplaceAll(content, "<br/>", "\n")
	content = strings.ReplaceAll(content, "<br />", "\n")
	content = strings.ReplaceAll(content, "</p>", "\n\n")
	content = strings.ReplaceAll(content, "</div>", "\n")
	content = strings.ReplaceAll(content, "</h1>", "\n\n")
	content = strings.ReplaceAll(content, "</h2>", "\n\n")
	content = strings.ReplaceAll(content, "</h3>", "\n\n")
	content = htmlTagPattern.ReplaceAllString(content, " ")
	content = strings.NewReplacer(
		"&nbsp;", " ",
		"&lt;", "<",
		"&gt;", ">",
		"&amp;", "&",
		"&quot;", "\"",
		"&#39;", "'",
	).Replace(content)
	content = htmlSpacePattern.ReplaceAllString(content, " ")
	return normalizeText(content)
}
