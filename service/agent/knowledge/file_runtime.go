package knowledge

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const (
	defaultRuntimeFileLimit     = 120
	maxRuntimeFileLimit         = 300
	defaultRuntimeFileReadChars = 8000
	maxRuntimeFileReadChars     = 24000
	runtimeFilePreviewChars     = 280
)

type KnowledgeRuntimeFile struct {
	ID          string `json:"id"`
	Path        string `json:"path"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Ext         string `json:"ext,omitempty"`
	MimeType    string `json:"mime_type,omitempty"`
	Size        int64  `json:"size,omitempty"`
	Editable    bool   `json:"editable"`
	DocID       uint64 `json:"doc_id,omitempty"`
	DirID       uint64 `json:"dir_id,omitempty"`
	IndexStatus string `json:"index_status,omitempty"`
	SourceType  string `json:"source_type,omitempty"`
}

type KnowledgeRuntimeFileContent struct {
	KnowledgeRuntimeFile
	Content   string `json:"content"`
	Truncated bool   `json:"truncated"`
}

type KnowledgeRuntimeFileSearchHit struct {
	KnowledgeRuntimeFile
	Preview string  `json:"preview"`
	Score   float64 `json:"score"`
}

func (s Service) OpenKnowledgeInitFile(ctx context.Context, baseID uint64, maxChars int) (KnowledgeRuntimeFileContent, bool, error) {
	data, err := s.KnowledgeFileData(ctx, baseID)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, false, err
	}
	root, _ := data.Base["root"].(string)
	for _, node := range data.Files {
		file := runtimeFileFromNode(root, node)
		if file.Type == "file" && strings.EqualFold(file.Path, "init.md") {
			content, err := s.ReadKnowledgeRuntimeFile(ctx, baseID, file.ID, maxChars)
			return content, true, err
		}
	}
	return KnowledgeRuntimeFileContent{}, false, nil
}

func (s Service) ListKnowledgeRuntimeFiles(ctx context.Context, baseID uint64, limit int) ([]KnowledgeRuntimeFile, error) {
	data, err := s.KnowledgeFileData(ctx, baseID)
	if err != nil {
		return nil, err
	}
	root, _ := data.Base["root"].(string)
	limit = normalizeRuntimeFileLimit(limit, defaultRuntimeFileLimit, maxRuntimeFileLimit)
	files := make([]KnowledgeRuntimeFile, 0, len(data.Files))
	for _, node := range data.Files {
		if len(files) >= limit {
			break
		}
		files = append(files, runtimeFileFromNode(root, node))
	}
	return files, nil
}

func (s Service) SearchKnowledgeRuntimeFiles(ctx context.Context, baseID uint64, query string, limit int) ([]KnowledgeRuntimeFileSearchHit, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, fmt.Errorf("搜索内容不能为空")
	}
	terms := queryTerms(query)
	if len(terms) == 0 {
		terms = []string{strings.ToLower(query)}
	}
	data, err := s.KnowledgeFileData(ctx, baseID)
	if err != nil {
		return nil, err
	}
	root, _ := data.Base["root"].(string)
	hits := make([]KnowledgeRuntimeFileSearchHit, 0)
	for _, node := range data.Files {
		file := runtimeFileFromNode(root, node)
		if file.Type != "file" || !file.Editable {
			continue
		}
		content, err := readRuntimeSearchContent(root, file)
		if err != nil {
			continue
		}
		score := runtimeFileMatchScore(file, content, terms)
		if score <= 0 {
			continue
		}
		hits = append(hits, KnowledgeRuntimeFileSearchHit{
			KnowledgeRuntimeFile: file,
			Preview:              runtimeFilePreview(content, terms, runtimeFilePreviewChars),
			Score:                score,
		})
	}
	sort.SliceStable(hits, func(i, j int) bool {
		if hits[i].Score == hits[j].Score {
			return hits[i].Path < hits[j].Path
		}
		return hits[i].Score > hits[j].Score
	})
	limit = normalizeRuntimeFileLimit(limit, 8, 20)
	if len(hits) > limit {
		hits = hits[:limit]
	}
	return hits, nil
}

func (s Service) ReadKnowledgeRuntimeFile(ctx context.Context, baseID uint64, idOrPath string, maxChars int) (KnowledgeRuntimeFileContent, error) {
	id, err := normalizeRuntimeFileID(idOrPath)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	content, err := s.ReadKnowledgeFileNode(ctx, baseID, id)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	if !content.Editable {
		return KnowledgeRuntimeFileContent{}, fmt.Errorf("文件不是可直接读取的文本文件")
	}
	maxChars = normalizeRuntimeFileReadChars(maxChars)
	text := truncateText(content.Content, maxChars)
	return KnowledgeRuntimeFileContent{
		KnowledgeRuntimeFile: KnowledgeRuntimeFile{
			ID:          content.ID,
			Path:        runtimePathFromID(content.ID),
			Name:        content.Name,
			Type:        "file",
			Ext:         strings.TrimPrefix(strings.ToLower(filepath.Ext(content.Name)), "."),
			MimeType:    content.MimeType,
			Size:        content.Size,
			Editable:    content.Editable,
			DocID:       content.DocID,
			IndexStatus: content.IndexStatus,
			SourceType:  content.SourceType,
		},
		Content:   text,
		Truncated: textLength(content.Content) > textLength(text),
	}, nil
}

func runtimeFileFromNode(root string, node KnowledgeFileNode) KnowledgeRuntimeFile {
	file := KnowledgeRuntimeFile{
		ID:          node.ID,
		Path:        runtimePathFromID(node.ID),
		Name:        node.Name,
		Type:        node.Type,
		Ext:         node.Ext,
		Size:        node.Size,
		DocID:       node.DocID,
		DirID:       node.DirID,
		IndexStatus: node.Status,
		SourceType:  node.SourceType,
	}
	if root == "" || node.Type != "file" {
		return file
	}
	path, _, err := knowledgeIDPath(root, node.ID)
	if err != nil {
		return file
	}
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return file
	}
	file.Size = info.Size()
	file.MimeType = detectMimeType(path, nil)
	file.Editable = isEditableKnowledgeFile(path, file.MimeType, info.Size())
	return file
}

func readRuntimeSearchContent(root string, file KnowledgeRuntimeFile) (string, error) {
	if strings.TrimSpace(root) == "" || strings.TrimSpace(file.ID) == "" {
		return "", fmt.Errorf("文件路径为空")
	}
	path, _, err := knowledgeIDPath(root, file.ID)
	if err != nil {
		return "", err
	}
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return "", fmt.Errorf("文件不存在")
	}
	if !isEditableKnowledgeFile(path, file.MimeType, info.Size()) {
		return "", fmt.Errorf("文件不是可读取文本")
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(raw), nil
}

func normalizeRuntimeFileID(value string) (string, error) {
	rel, err := cleanKnowledgeID(value)
	if err != nil {
		return "", err
	}
	if rel == "" {
		return "", fmt.Errorf("文件路径不能为空")
	}
	return knowledgeFileID(rel), nil
}

func runtimePathFromID(id string) string {
	rel, err := cleanKnowledgeID(id)
	if err != nil {
		return strings.TrimPrefix(strings.TrimSpace(id), "/")
	}
	return rel
}

func normalizeRuntimeFileLimit(value int, fallback int, max int) int {
	if value <= 0 {
		value = fallback
	}
	if value > max {
		return max
	}
	return value
}

func normalizeRuntimeFileReadChars(value int) int {
	if value <= 0 {
		return defaultRuntimeFileReadChars
	}
	if value > maxRuntimeFileReadChars {
		return maxRuntimeFileReadChars
	}
	return value
}

func runtimeFileMatchScore(file KnowledgeRuntimeFile, content string, terms []string) float64 {
	name := strings.ToLower(strings.TrimSpace(file.Path + " " + file.Name))
	body := strings.ToLower(content)
	score := 0.0
	for _, term := range terms {
		term = strings.ToLower(strings.TrimSpace(term))
		if term == "" {
			continue
		}
		if strings.Contains(name, term) {
			score += 3
		}
		if strings.Contains(body, term) {
			score += 1
		}
	}
	return score
}

func runtimeFilePreview(content string, terms []string, limit int) string {
	for _, line := range strings.Split(content, "\n") {
		line = strings.TrimSpace(line)
		if line == "" || !containsRuntimeTerm(line, terms) {
			continue
		}
		return truncateText(line, limit)
	}
	return truncateText(strings.TrimSpace(content), limit)
}

func containsRuntimeTerm(value string, terms []string) bool {
	value = strings.ToLower(value)
	for _, term := range terms {
		term = strings.ToLower(strings.TrimSpace(term))
		if term != "" && strings.Contains(value, term) {
			return true
		}
	}
	return false
}
