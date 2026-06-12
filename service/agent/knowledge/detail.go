package knowledge

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	agentmodel "my/package/bot/model/agent"
)

const (
	indexDetailNodeLimit         = 80
	indexDetailEdgeLimit         = 80
	indexDetailNodePreviewLength = 700
	indexDetailEdgePreviewLength = 700
)

type KnowledgeFileIndexDetail struct {
	ID           string                   `json:"id"`
	Name         string                   `json:"name"`
	DocID        uint64                   `json:"doc_id"`
	DirID        uint64                   `json:"dir_id"`
	DirPath      string                   `json:"dir_path"`
	SourceType   string                   `json:"source_type"`
	IndexStatus  string                   `json:"index_status"`
	IndexStage   string                   `json:"index_stage"`
	IndexVersion int                      `json:"index_version"`
	Stages       indexStageDetail         `json:"stages"`
	ErrorMessage string                   `json:"error_message,omitempty"`
	NodeCount    int                      `json:"node_count"`
	Summary      string                   `json:"summary"`
	Keywords     []string                 `json:"keywords"`
	Nodes        []KnowledgeFileIndexNode `json:"nodes"`
	Edges        []KnowledgeFileIndexEdge `json:"edges"`
}

type KnowledgeFileIndexNode struct {
	ID             uint64   `json:"id"`
	Sort           int      `json:"sort"`
	NodeType       string   `json:"node_type"`
	Title          string   `json:"title"`
	Path           string   `json:"path"`
	ContentPreview string   `json:"content_preview"`
	Keywords       []string `json:"keywords"`
	IndexStatus    string   `json:"index_status"`
	ErrorMessage   string   `json:"error_message,omitempty"`
}

type KnowledgeFileIndexEdge struct {
	ID          uint64  `json:"id"`
	Subject     string  `json:"subject"`
	Predicate   string  `json:"predicate"`
	Object      string  `json:"object"`
	EdgeType    string  `json:"edge_type"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
	Evidence    string  `json:"evidence"`
	Confidence  float64 `json:"confidence"`
}

func (s Service) ReadKnowledgeFileIndexDetail(ctx context.Context, baseID uint64, id string) (KnowledgeFileIndexDetail, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeFileIndexDetail{}, err
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileIndexDetail{}, err
	}
	filePath, relPath, err := knowledgeIDPath(root, id)
	if err != nil {
		return KnowledgeFileIndexDetail{}, err
	}
	info, err := os.Stat(filePath)
	if err != nil {
		return KnowledgeFileIndexDetail{}, fmt.Errorf("文件不存在")
	}
	if info.IsDir() {
		return KnowledgeFileIndexDetail{}, fmt.Errorf("请选择文件")
	}
	doc := findDocByStoragePath(ctx, base.ID, relPath)
	if doc == nil {
		return KnowledgeFileIndexDetail{}, fmt.Errorf("知识文档不存在")
	}
	return knowledgeFileIndexDetail(ctx, knowledgeFileID(relPath), filepath.Base(filePath), doc), nil
}

func knowledgeFileIndexDetail(ctx context.Context, id string, name string, doc *agentmodel.KnowledgeDoc) KnowledgeFileIndexDetail {
	nodes := knowledgeFileIndexNodes(ctx, doc.ID)
	edges := knowledgeFileIndexEdges(ctx, doc.ID)
	nodeCount := len(nodes)
	if doc.NodeCount > nodeCount {
		nodeCount = doc.NodeCount
	}
	return KnowledgeFileIndexDetail{
		ID:           id,
		Name:         name,
		DocID:        doc.ID,
		DirID:        doc.DirID,
		DirPath:      KnowledgeDirPath(ctx, doc.DirID),
		SourceType:   strings.TrimSpace(doc.SourceType),
		IndexStatus:  strings.TrimSpace(doc.IndexStatus),
		IndexStage:   strings.TrimSpace(doc.IndexStage),
		IndexVersion: doc.IndexVersion,
		Stages:       parseIndexStageDetail(doc.IndexStageDetail),
		ErrorMessage: strings.TrimSpace(doc.ErrorMessage),
		NodeCount:    nodeCount,
		Summary:      strings.TrimSpace(doc.Summary),
		Keywords:     keywordList(doc.Keywords, 30),
		Nodes:        nodes,
		Edges:        edges,
	}
}

func knowledgeFileIndexNodes(ctx context.Context, docID uint64) []KnowledgeFileIndexNode {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"doc_id": docID,
		"status": 1,
	}, map[string]any{
		"field":    "main.id, main.sort, main.node_type, main.title, main.path, main.content, main.plain_text, main.summary, main.keywords, main.index_status, main.error_message",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": indexDetailNodeLimit,
	})
	result := make([]KnowledgeFileIndexNode, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, KnowledgeFileIndexNode{
			ID:             row.ID,
			Sort:           row.Sort,
			NodeType:       strings.TrimSpace(row.NodeType),
			Title:          strings.TrimSpace(row.Title),
			Path:           strings.TrimSpace(row.Path),
			ContentPreview: truncateText(firstNonEmpty(row.Summary, row.PlainText, row.Content), indexDetailNodePreviewLength),
			Keywords:       keywordList(row.Keywords, 12),
			IndexStatus:    strings.TrimSpace(row.IndexStatus),
			ErrorMessage:   strings.TrimSpace(row.ErrorMessage),
		})
	}
	return result
}

func knowledgeFileIndexEdges(ctx context.Context, docID uint64) []KnowledgeFileIndexEdge {
	rows := agentmodel.NewKnowledgeEdgeModel().Select(ctx, map[string]any{
		"doc_id": docID,
		"status": 1,
	}, map[string]any{
		"field":    "main.id, main.edge_type, main.label, main.summary, main.evidence, main.confidence, main.from_node_id, main.to_node_id",
		"order":    "main.confidence desc, main.id desc",
		"page":     1,
		"pageSize": indexDetailEdgeLimit,
	})
	result := make([]KnowledgeFileIndexEdge, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, KnowledgeFileIndexEdge{
			ID:          row.ID,
			Subject:     fmt.Sprintf("node:%d", row.FromNodeID),
			Predicate:   strings.TrimSpace(row.EdgeType),
			Object:      fmt.Sprintf("node:%d", row.ToNodeID),
			EdgeType:    strings.TrimSpace(row.EdgeType),
			Label:       strings.TrimSpace(row.Label),
			Description: truncateText(strings.TrimSpace(row.Summary), indexDetailEdgePreviewLength),
			Evidence:    truncateText(strings.TrimSpace(row.Evidence), indexDetailEdgePreviewLength),
			Confidence:  row.Confidence,
		})
	}
	return result
}

func keywordList(value string, limit int) []string {
	return uniqueSummaryKeywords(splitSummaryKeywords(value), limit)
}
