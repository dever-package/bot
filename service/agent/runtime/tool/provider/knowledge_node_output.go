package provider

import (
	"fmt"
	"strings"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
)

const knowledgeDebugPreviewRunes = 240

type knowledgeNodeView struct {
	ID            uint64              `json:"id"`
	BaseID        uint64              `json:"knowledge_base_id"`
	DirID         uint64              `json:"dir_id,omitempty"`
	DirPath       string              `json:"dir_path,omitempty"`
	DocID         uint64              `json:"doc_id,omitempty"`
	ParentID      uint64              `json:"parent_id,omitempty"`
	NodeType      string              `json:"node_type,omitempty"`
	Title         string              `json:"title,omitempty"`
	Path          string              `json:"path,omitempty"`
	Summary       string              `json:"summary,omitempty"`
	Preview       string              `json:"preview,omitempty"`
	Text          string              `json:"text,omitempty"`
	Keywords      []string            `json:"keywords,omitempty"`
	PageStart     int                 `json:"page_start,omitempty"`
	PageEnd       int                 `json:"page_end,omitempty"`
	LineStart     int                 `json:"line_start,omitempty"`
	LineEnd       int                 `json:"line_end,omitempty"`
	Score         float64             `json:"score,omitempty"`
	ChildrenCount int                 `json:"children_count,omitempty"`
	Children      []knowledgeNodeView `json:"children,omitempty"`
}

func knowledgeTreeViews(nodes []knowledgeservice.KnowledgeTreeNode) []knowledgeNodeView {
	result := make([]knowledgeNodeView, 0, len(nodes))
	for _, node := range nodes {
		view := knowledgeNodeViewFromResult(node.KnowledgeNodeResult, 240, false)
		view.ChildrenCount = node.ChildrenCount
		view.Children = knowledgeTreeViews(node.Children)
		result = append(result, view)
	}
	return result
}

func knowledgeNodeViews(nodes []knowledgeservice.KnowledgeNodeResult, previewRunes int, includeText bool) []knowledgeNodeView {
	result := make([]knowledgeNodeView, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, knowledgeNodeViewFromResult(node, previewRunes, includeText))
	}
	return result
}

func knowledgeNodeViewFromResult(node knowledgeservice.KnowledgeNodeResult, previewRunes int, includeText bool) knowledgeNodeView {
	text := firstKnowledgeNodeText(node.PlainText, node.Content)
	view := knowledgeNodeView{
		ID:        node.ID,
		BaseID:    node.BaseID,
		DirID:     node.DirID,
		DirPath:   strings.TrimSpace(node.DirPath),
		DocID:     node.DocID,
		ParentID:  node.ParentID,
		NodeType:  strings.TrimSpace(node.NodeType),
		Title:     strings.TrimSpace(node.Title),
		Path:      strings.TrimSpace(node.Path),
		Summary:   strings.TrimSpace(node.Summary),
		Preview:   truncateRunes(firstKnowledgeNodeText(node.Summary, text), previewRunes),
		Keywords:  node.Keywords,
		PageStart: node.PageStart,
		PageEnd:   node.PageEnd,
		LineStart: node.LineStart,
		LineEnd:   node.LineEnd,
		Score:     node.Score,
	}
	if includeText {
		view.Text = truncateRunes(text, previewRunes)
	}
	return view
}

func knowledgeNodeName(node knowledgeservice.KnowledgeNodeResult) string {
	return firstKnowledgeNodeText(node.Title, node.Path, fmt.Sprintf("#%d", node.ID))
}

func firstKnowledgeNodeText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}

func knowledgeDebugSnippets(snippets []knowledgeservice.RetrievedSnippet) []map[string]any {
	result := make([]map[string]any, 0, len(snippets))
	for _, snippet := range snippets {
		result = append(result, map[string]any{
			"knowledge_base_id": snippet.BaseID,
			"knowledge_base":    snippet.BaseName,
			"dir_id":            snippet.DirID,
			"dir_path":          snippet.DirPath,
			"doc_id":            snippet.DocID,
			"node_id":           snippet.NodeID,
			"title":             snippet.Title,
			"content":           truncateRunes(snippet.Content, knowledgeDebugPreviewRunes),
			"score":             snippet.Score,
			"source":            snippet.Source,
		})
	}
	return result
}
