package knowledge

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
	"unicode/utf8"

	agentmodel "github.com/dever-package/bot/model/agent"
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
	Content         string `json:"content"`
	OffsetBytes     int64  `json:"offset_bytes"`
	NextOffsetBytes int64  `json:"next_offset_bytes,omitempty"`
	TotalBytes      int64  `json:"total_bytes"`
	Truncated       bool   `json:"truncated"`
}

type KnowledgeRuntimeFileSearchHit struct {
	KnowledgeRuntimeFile
	Preview string  `json:"preview"`
	Score   float64 `json:"score"`
}

func (s Service) OpenKnowledgeInitFile(ctx context.Context, baseID uint64, maxChars int) (KnowledgeRuntimeFileContent, bool, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, false, err
	}
	if base.Status != 1 {
		return KnowledgeRuntimeFileContent{}, false, fmt.Errorf("知识库不存在或已停用")
	}
	doc := findDocByStoragePath(ctx, base.ID, "init.md")
	if !knowledgeDocGovernanceAvailableAt(doc, base.ReviewRequired, time.Now()) {
		return KnowledgeRuntimeFileContent{}, false, nil
	}
	file, exists := runtimeFileFromDoc(root, doc)
	if !exists {
		return KnowledgeRuntimeFileContent{}, false, nil
	}
	content, err := s.ReadKnowledgeRuntimeFile(ctx, base.ID, file.ID, maxChars)
	return content, true, err
}

func (s Service) ListKnowledgeRuntimeFiles(ctx context.Context, baseID uint64, limit int) ([]KnowledgeRuntimeFile, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return nil, err
	}
	if base.Status != 1 {
		return nil, fmt.Errorf("知识库不存在或已停用")
	}
	limit = normalizeRuntimeFileLimit(limit, defaultRuntimeFileLimit, maxRuntimeFileLimit)
	files := runtimeKnowledgeDirectories(ctx, base.ID, limit)
	files = append(files, runtimeKnowledgeDocuments(ctx, base, root, limit)...)
	sort.SliceStable(files, func(left int, right int) bool {
		return files[left].Path < files[right].Path
	})
	if len(files) > limit {
		files = files[:limit]
	}
	return files, nil
}

func runtimeKnowledgeDirectories(ctx context.Context, baseID uint64, limit int) []KnowledgeRuntimeFile {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.name, main.path",
		"order":    "main.path asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	result := make([]KnowledgeRuntimeFile, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		path := NormalizeDirPath(row.Path)
		if path == "" {
			continue
		}
		result = append(result, KnowledgeRuntimeFile{
			ID:    knowledgeFileID(path),
			Path:  path,
			Name:  strings.TrimSpace(firstNonEmpty(row.Name, filepath.Base(path))),
			Type:  "folder",
			DirID: row.ID,
		})
	}
	return result
}

func runtimeKnowledgeDocuments(ctx context.Context, base *agentmodel.KnowledgeBase, root string, limit int) []KnowledgeRuntimeFile {
	if base == nil || limit <= 0 {
		return nil
	}
	const pageSize = 250
	result := make([]KnowledgeRuntimeFile, 0, limit)
	var afterID uint64
	now := time.Now()
	for len(result) < limit {
		filters := map[string]any{
			"knowledge_base_id": base.ID,
			"status":            1,
		}
		if afterID > 0 {
			filters["id"] = map[string]any{"gt": afterID}
		}
		rows := agentmodel.NewKnowledgeDocModel().Select(ctx, filters, map[string]any{
			"field":    "main.id, main.dir_id, main.storage_path, main.mime_type, main.size, main.index_status, main.source_type, main.status, main.expires_at, main.review_status",
			"order":    "main.id asc",
			"page":     1,
			"pageSize": pageSize,
		})
		if len(rows) == 0 {
			break
		}
		afterID = rows[len(rows)-1].ID
		for _, row := range rows {
			if !knowledgeDocGovernanceAvailableAt(row, base.ReviewRequired, now) {
				continue
			}
			if file, ok := runtimeFileFromDoc(root, row); ok {
				result = append(result, file)
				if len(result) >= limit {
					break
				}
			}
		}
		if len(rows) < pageSize {
			break
		}
	}
	return result
}

func (s Service) SearchKnowledgeRuntimeFiles(ctx context.Context, baseID uint64, query string, limit int) ([]KnowledgeRuntimeFileSearchHit, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, fmt.Errorf("搜索内容不能为空")
	}
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return nil, err
	}
	if base.Status != 1 {
		return nil, fmt.Errorf("知识库不存在或已停用")
	}
	limit = normalizeRuntimeFileLimit(limit, 8, 20)
	candidateLimit := limit * 4
	if candidateLimit > 50 {
		candidateLimit = 50
	}
	result, err := s.SearchKnowledgeNodes(ctx, base.ID, query, candidateLimit)
	if err != nil {
		return nil, err
	}
	return runtimeFileSearchHits(ctx, root, base.ID, result.Nodes, limit), nil
}

func (s Service) ReadKnowledgeRuntimeFile(ctx context.Context, baseID uint64, idOrPath string, maxChars int) (KnowledgeRuntimeFileContent, error) {
	return s.ReadKnowledgeRuntimeFileRange(ctx, baseID, idOrPath, 0, maxChars)
}

func (s Service) ReadKnowledgeRuntimeFileRange(ctx context.Context, baseID uint64, idOrPath string, offsetBytes int64, maxChars int) (KnowledgeRuntimeFileContent, error) {
	base, err := activeRuntimeKnowledgeBase(ctx, baseID)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	id, err := normalizeRuntimeFileID(idOrPath)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	doc := findDocByStoragePath(ctx, base.ID, runtimePathFromID(id))
	if !knowledgeDocGovernanceAvailableAt(doc, base.ReviewRequired, time.Now()) {
		return KnowledgeRuntimeFileContent{}, fmt.Errorf("知识库文件未通过审核、已过期或已停用")
	}
	filePath, err := knowledgeDocFilePath(ctx, base.ID, doc.StoragePath)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return KnowledgeRuntimeFileContent{}, fmt.Errorf("文件不存在")
	}
	mimeType := strings.TrimSpace(doc.MimeType)
	if mimeType == "" {
		mimeType = detectMimeType(filePath, nil)
	}
	if !isRuntimeReadableKnowledgeText(filePath, mimeType) {
		return KnowledgeRuntimeFileContent{}, fmt.Errorf("文件不是可直接读取的文本文件")
	}
	if base.ReviewRequired && !runtimeKnowledgeFileHashMatches(doc, filePath, info) {
		return KnowledgeRuntimeFileContent{}, fmt.Errorf("知识库文件内容已变化，请同步并重新审核")
	}
	maxChars = normalizeRuntimeFileReadChars(maxChars)
	text, actualOffset, nextOffset, truncated, err := readRuntimeKnowledgeTextPage(filePath, offsetBytes, maxChars)
	if err != nil {
		return KnowledgeRuntimeFileContent{}, err
	}
	return KnowledgeRuntimeFileContent{
		KnowledgeRuntimeFile: KnowledgeRuntimeFile{
			ID:          id,
			Path:        runtimePathFromID(id),
			Name:        filepath.Base(filePath),
			Type:        "file",
			Ext:         strings.TrimPrefix(strings.ToLower(filepath.Ext(filePath)), "."),
			MimeType:    mimeType,
			Size:        info.Size(),
			Editable:    isEditableKnowledgeFile(filePath, mimeType, info.Size()),
			DocID:       doc.ID,
			DirID:       doc.DirID,
			IndexStatus: doc.IndexStatus,
			SourceType:  doc.SourceType,
		},
		Content:         text,
		OffsetBytes:     actualOffset,
		NextOffsetBytes: nextOffset,
		TotalBytes:      info.Size(),
		Truncated:       truncated,
	}, nil
}

func runtimeKnowledgeFileHashMatches(doc *agentmodel.KnowledgeDoc, filePath string, info os.FileInfo) bool {
	if doc == nil || strings.TrimSpace(doc.ContentHash) == "" {
		return false
	}
	if doc.Size != info.Size() {
		return false
	}
	modifiedAt := info.ModTime().UnixNano()
	if doc.FileModifiedAt > 0 && doc.FileModifiedAt != modifiedAt {
		return false
	}
	if info.Size() > maxEditableFileBytes && doc.FileModifiedAt == modifiedAt {
		return true
	}
	return doc.ContentHash == fileContentHash(filePath, info)
}

func activeRuntimeKnowledgeBase(ctx context.Context, baseID uint64) (*agentmodel.KnowledgeBase, error) {
	if baseID == 0 {
		return nil, fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return nil, fmt.Errorf("知识库不存在或已停用")
	}
	return base, nil
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

func runtimeFileSearchHits(ctx context.Context, root string, baseID uint64, nodes []KnowledgeNodeResult, limit int) []KnowledgeRuntimeFileSearchHit {
	docIDs := make([]uint64, 0, len(nodes))
	for _, node := range nodes {
		if node.DocID > 0 {
			docIDs = append(docIDs, node.DocID)
		}
	}
	docIDs = uniqueUint64s(docIDs, 0)
	if len(docIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id":                docIDs,
		"knowledge_base_id": baseID,
	}, map[string]any{
		"page":     1,
		"pageSize": len(docIDs),
	})
	docs := make(map[uint64]*agentmodel.KnowledgeDoc, len(rows))
	for _, row := range rows {
		if row != nil {
			docs[row.ID] = row
		}
	}
	hits := make([]KnowledgeRuntimeFileSearchHit, 0, limit)
	seen := make(map[uint64]struct{}, len(docIDs))
	for _, node := range nodes {
		if _, exists := seen[node.DocID]; exists {
			continue
		}
		file, ok := runtimeFileFromDoc(root, docs[node.DocID])
		if !ok {
			continue
		}
		seen[node.DocID] = struct{}{}
		hits = append(hits, KnowledgeRuntimeFileSearchHit{
			KnowledgeRuntimeFile: file,
			Preview:              truncateText(firstNonEmpty(node.Summary, node.PlainText, node.Content), runtimeFilePreviewChars),
			Score:                node.Score,
		})
		if len(hits) >= limit {
			break
		}
	}
	return hits
}

func runtimeFileFromDoc(root string, doc *agentmodel.KnowledgeDoc) (KnowledgeRuntimeFile, bool) {
	if doc == nil {
		return KnowledgeRuntimeFile{}, false
	}
	relPath := NormalizeDirPath(doc.StoragePath)
	if relPath == "" {
		return KnowledgeRuntimeFile{}, false
	}
	filePath := filepath.Join(root, filepath.FromSlash(relPath))
	if err := ensureInsideKnowledgeRoot(root, filePath); err != nil {
		return KnowledgeRuntimeFile{}, false
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return KnowledgeRuntimeFile{}, false
	}
	mimeType := strings.TrimSpace(doc.MimeType)
	if mimeType == "" {
		mimeType = detectMimeType(filePath, nil)
	}
	return KnowledgeRuntimeFile{
		ID:          knowledgeFileID(relPath),
		Path:        relPath,
		Name:        filepath.Base(filePath),
		Type:        "file",
		Ext:         strings.TrimPrefix(strings.ToLower(filepath.Ext(filePath)), "."),
		MimeType:    mimeType,
		Size:        info.Size(),
		Editable:    isEditableKnowledgeFile(filePath, mimeType, info.Size()),
		DocID:       doc.ID,
		DirID:       doc.DirID,
		IndexStatus: doc.IndexStatus,
		SourceType:  doc.SourceType,
	}, true
}

func isRuntimeReadableKnowledgeText(filePath string, mimeType string) bool {
	ext := strings.ToLower(filepath.Ext(filePath))
	knownText := editableKnowledgeFileExts[strings.TrimPrefix(ext, ".")]
	normalizedMime := strings.ToLower(strings.TrimSpace(mimeType))
	if !knownText && !strings.HasPrefix(normalizedMime, "text/") && normalizedMime != "application/octet-stream" {
		return false
	}
	file, err := os.Open(filePath)
	if err != nil {
		return false
	}
	defer file.Close()
	sample := make([]byte, 64*1024)
	read, err := file.Read(sample)
	if err != nil && err != io.EOF {
		return false
	}
	return isUTF8TextContent(sample[:read])
}

func readRuntimeKnowledgeTextPage(filePath string, offsetBytes int64, maxChars int) (string, int64, int64, bool, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", 0, 0, false, fmt.Errorf("读取文件失败: %w", err)
	}
	defer file.Close()
	info, err := file.Stat()
	if err != nil {
		return "", 0, 0, false, fmt.Errorf("读取文件失败: %w", err)
	}
	if offsetBytes < 0 {
		offsetBytes = 0
	}
	if offsetBytes > info.Size() {
		offsetBytes = info.Size()
	}
	actualOffset, err := alignUTF8FileOffset(file, offsetBytes, info.Size())
	if err != nil {
		return "", 0, 0, false, err
	}
	if _, err := file.Seek(actualOffset, io.SeekStart); err != nil {
		return "", 0, 0, false, fmt.Errorf("读取文件失败: %w", err)
	}
	reader := bufio.NewReader(file)
	var content strings.Builder
	currentOffset := actualOffset
	for count := 0; count < maxChars; count++ {
		value, size, readErr := reader.ReadRune()
		if readErr == io.EOF {
			break
		}
		if readErr != nil {
			return "", 0, 0, false, fmt.Errorf("读取文件失败: %w", readErr)
		}
		if value == utf8.RuneError && size == 1 {
			return "", 0, 0, false, fmt.Errorf("文件不是有效的 UTF-8 文本")
		}
		content.WriteRune(value)
		currentOffset += int64(size)
	}
	truncated := currentOffset < info.Size()
	nextOffset := int64(0)
	if truncated {
		nextOffset = currentOffset
	}
	return content.String(), actualOffset, nextOffset, truncated, nil
}

func alignUTF8FileOffset(file *os.File, offset int64, size int64) (int64, error) {
	if offset <= 0 || offset >= size {
		return offset, nil
	}
	buffer := []byte{0}
	for offset < size {
		if _, err := file.ReadAt(buffer, offset); err != nil {
			return 0, fmt.Errorf("读取文件失败: %w", err)
		}
		if buffer[0]&0xc0 != 0x80 {
			return offset, nil
		}
		offset++
	}
	return size, nil
}
