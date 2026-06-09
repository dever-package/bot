package knowledge

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"mime"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

const (
	knowledgeStorageRoot = "data/knowledge"
	maxEditableFileBytes = 5 * 1024 * 1024
)

type KnowledgeFileData struct {
	Base  map[string]any      `json:"base"`
	Files []KnowledgeFileNode `json:"files"`
	Drive map[string]any      `json:"drive"`
}

type KnowledgeFileOperationResult struct {
	KnowledgeFileData
	NewID  string   `json:"new_id,omitempty"`
	NewIDs []string `json:"new_ids,omitempty"`
}

type KnowledgeFileNode struct {
	ID     string    `json:"id"`
	Name   string    `json:"name,omitempty"`
	Type   string    `json:"type"`
	Size   int64     `json:"size,omitempty"`
	Date   time.Time `json:"date"`
	Ext    string    `json:"ext,omitempty"`
	DocID  uint64    `json:"doc_id,omitempty"`
	DirID  uint64    `json:"dir_id,omitempty"`
	Status string    `json:"index_status,omitempty"`
}

type KnowledgeFileContent struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Content     string `json:"content"`
	Editable    bool   `json:"editable"`
	MimeType    string `json:"mime_type"`
	Size        int64  `json:"size"`
	DocID       uint64 `json:"doc_id,omitempty"`
	IndexStatus string `json:"index_status,omitempty"`
}

type KnowledgeCreateInput struct {
	BaseID        uint64
	ParentID      string
	Name          string
	Type          string
	ContentBase64 string
}

type KnowledgeRenameInput struct {
	BaseID uint64
	ID     string
	Name   string
}

type KnowledgeMoveInput struct {
	BaseID uint64
	IDs    []string
	Target string
}

type KnowledgeSaveInput struct {
	BaseID  uint64
	ID      string
	Content string
}

func (s Service) KnowledgeFileData(ctx context.Context, baseID uint64) (KnowledgeFileData, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeFileData{}, err
	}
	if err := ensureDatabaseDirsOnDisk(ctx, base.ID, root); err != nil {
		return KnowledgeFileData{}, err
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileData{}, err
	}
	files, used, err := walkKnowledgeFileNodes(ctx, base.ID, root)
	if err != nil {
		return KnowledgeFileData{}, err
	}
	return KnowledgeFileData{
		Base: map[string]any{
			"id":     base.ID,
			"name":   strings.TrimSpace(base.Name),
			"status": base.Status,
			"root":   filepath.ToSlash(root),
		},
		Files: files,
		Drive: map[string]any{
			"used": used,
		},
	}, nil
}

func (s Service) ReadKnowledgeFileNode(ctx context.Context, baseID uint64, id string) (KnowledgeFileContent, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeFileContent{}, err
	}
	filePath, relPath, err := knowledgeIDPath(root, id)
	if err != nil {
		return KnowledgeFileContent{}, err
	}
	info, err := os.Stat(filePath)
	if err != nil {
		return KnowledgeFileContent{}, fmt.Errorf("文件不存在")
	}
	if info.IsDir() {
		return KnowledgeFileContent{}, fmt.Errorf("请选择文件")
	}
	mimeType := detectMimeType(filePath, nil)
	content := ""
	editable := isEditableKnowledgeFile(filePath, mimeType, info.Size())
	if editable {
		raw, err := os.ReadFile(filePath)
		if err != nil {
			return KnowledgeFileContent{}, fmt.Errorf("读取文件失败: %w", err)
		}
		content = string(raw)
	}
	doc := findDocByStoragePath(ctx, base.ID, relPath)
	return KnowledgeFileContent{
		ID:          knowledgeFileID(relPath),
		Name:        filepath.Base(filePath),
		Content:     content,
		Editable:    editable,
		MimeType:    mimeType,
		Size:        info.Size(),
		DocID:       docID(doc),
		IndexStatus: docIndexStatus(doc),
	}, nil
}

func (s Service) CreateKnowledgeFileNode(ctx context.Context, input KnowledgeCreateInput) (KnowledgeFileOperationResult, error) {
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	parentPath, parentRel, err := knowledgeIDPath(root, input.ParentID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	if err := ensureInsideKnowledgeRoot(root, parentPath); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	name, err := normalizeFileName(input.Name)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	target := filepath.Join(parentPath, name)
	if err := ensureInsideKnowledgeRoot(root, target); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	if _, err := os.Stat(target); err == nil {
		return KnowledgeFileOperationResult{}, fmt.Errorf("同名文件或文件夹已存在")
	}
	newID := knowledgeFileID(joinDirPath(parentRel, name))
	if normalizeFileType(input.Type) == "folder" {
		if err := os.MkdirAll(target, 0o755); err != nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("创建文件夹失败: %w", err)
		}
	} else {
		raw, err := decodeOptionalBase64(input.ContentBase64)
		if err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		if err := os.MkdirAll(parentPath, 0o755); err != nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("创建父目录失败: %w", err)
		}
		if isKnowledgeZipUpload(name, raw) {
			if err := extractKnowledgeZip(root, parentPath, raw); err != nil {
				return KnowledgeFileOperationResult{}, err
			}
			newID = knowledgeFileID(parentRel)
		} else if err := os.WriteFile(target, raw, 0o644); err != nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("创建文件失败: %w", err)
		}
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	data, err := s.KnowledgeFileData(ctx, base.ID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	return KnowledgeFileOperationResult{KnowledgeFileData: data, NewID: newID}, nil
}

func (s Service) RenameKnowledgeFileNode(ctx context.Context, input KnowledgeRenameInput) (KnowledgeFileOperationResult, error) {
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	oldPath, _, err := knowledgeIDPath(root, input.ID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	name, err := normalizeFileName(input.Name)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	newPath := filepath.Join(filepath.Dir(oldPath), name)
	if err := ensureInsideKnowledgeRoot(root, newPath); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	if oldPath == newPath {
		data, err := s.KnowledgeFileData(ctx, base.ID)
		return KnowledgeFileOperationResult{KnowledgeFileData: data, NewID: input.ID}, err
	}
	if _, err := os.Stat(newPath); err == nil {
		return KnowledgeFileOperationResult{}, fmt.Errorf("同名文件或文件夹已存在")
	}
	if err := os.Rename(oldPath, newPath); err != nil {
		return KnowledgeFileOperationResult{}, fmt.Errorf("重命名失败: %w", err)
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	data, err := s.KnowledgeFileData(ctx, base.ID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	return KnowledgeFileOperationResult{KnowledgeFileData: data, NewID: idFromFilePath(root, newPath)}, nil
}

func (s Service) DeleteKnowledgeFileNodes(ctx context.Context, baseID uint64, ids []string) (KnowledgeFileData, error) {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeFileData{}, err
	}
	for _, id := range ids {
		filePath, _, err := knowledgeIDPath(root, id)
		if err != nil {
			return KnowledgeFileData{}, err
		}
		if sameCleanPath(filePath, root) {
			return KnowledgeFileData{}, fmt.Errorf("不能删除知识库根目录")
		}
		if err := os.RemoveAll(filePath); err != nil {
			return KnowledgeFileData{}, fmt.Errorf("删除失败: %w", err)
		}
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileData{}, err
	}
	return s.KnowledgeFileData(ctx, base.ID)
}

func (s Service) MoveKnowledgeFileNodes(ctx context.Context, input KnowledgeMoveInput) (KnowledgeFileOperationResult, error) {
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	targetPath, _, err := knowledgeIDPath(root, input.Target)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	targetInfo, err := os.Stat(targetPath)
	if err != nil || !targetInfo.IsDir() {
		return KnowledgeFileOperationResult{}, fmt.Errorf("目标文件夹不存在")
	}
	newIDs := make([]string, 0, len(input.IDs))
	for _, id := range input.IDs {
		sourcePath, _, err := knowledgeIDPath(root, id)
		if err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		if sameCleanPath(sourcePath, root) {
			return KnowledgeFileOperationResult{}, fmt.Errorf("不能移动知识库根目录")
		}
		targetFile := filepath.Join(targetPath, filepath.Base(sourcePath))
		if err := ensureInsideKnowledgeRoot(root, targetFile); err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		if isPathAncestor(sourcePath, targetFile) {
			return KnowledgeFileOperationResult{}, fmt.Errorf("不能移动到自身或子目录下")
		}
		if _, err := os.Stat(targetFile); err == nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("目标文件夹下已存在同名文件")
		}
		if err := os.Rename(sourcePath, targetFile); err != nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("移动失败: %w", err)
		}
		newIDs = append(newIDs, idFromFilePath(root, targetFile))
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	data, err := s.KnowledgeFileData(ctx, base.ID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	return KnowledgeFileOperationResult{KnowledgeFileData: data, NewIDs: newIDs}, nil
}

func (s Service) CopyKnowledgeFileNodes(ctx context.Context, input KnowledgeMoveInput) (KnowledgeFileOperationResult, error) {
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	targetPath, _, err := knowledgeIDPath(root, input.Target)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	targetInfo, err := os.Stat(targetPath)
	if err != nil || !targetInfo.IsDir() {
		return KnowledgeFileOperationResult{}, fmt.Errorf("目标文件夹不存在")
	}
	newIDs := make([]string, 0, len(input.IDs))
	for _, id := range input.IDs {
		sourcePath, _, err := knowledgeIDPath(root, id)
		if err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		if sameCleanPath(sourcePath, root) {
			return KnowledgeFileOperationResult{}, fmt.Errorf("不能复制知识库根目录")
		}
		targetFile := filepath.Join(targetPath, filepath.Base(sourcePath))
		if err := ensureInsideKnowledgeRoot(root, targetFile); err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		if isPathAncestor(sourcePath, targetFile) {
			return KnowledgeFileOperationResult{}, fmt.Errorf("不能复制到自身或子目录下")
		}
		if _, err := os.Stat(targetFile); err == nil {
			return KnowledgeFileOperationResult{}, fmt.Errorf("目标文件夹下已存在同名文件")
		}
		if err := copyKnowledgePath(sourcePath, targetFile); err != nil {
			return KnowledgeFileOperationResult{}, err
		}
		newIDs = append(newIDs, idFromFilePath(root, targetFile))
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	data, err := s.KnowledgeFileData(ctx, base.ID)
	if err != nil {
		return KnowledgeFileOperationResult{}, err
	}
	return KnowledgeFileOperationResult{KnowledgeFileData: data, NewIDs: newIDs}, nil
}

func (s Service) SaveKnowledgeFileNode(ctx context.Context, input KnowledgeSaveInput) (KnowledgeFileContent, error) {
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeFileContent{}, err
	}
	filePath, relPath, err := knowledgeIDPath(root, input.ID)
	if err != nil {
		return KnowledgeFileContent{}, err
	}
	info, err := os.Stat(filePath)
	if err != nil {
		return KnowledgeFileContent{}, fmt.Errorf("文件不存在")
	}
	if info.IsDir() {
		return KnowledgeFileContent{}, fmt.Errorf("请选择文件")
	}
	if !isEditableKnowledgeFile(filePath, detectMimeType(filePath, nil), int64(len(input.Content))) {
		return KnowledgeFileContent{}, fmt.Errorf("该文件不支持在线编辑")
	}
	if err := os.WriteFile(filePath, []byte(input.Content), 0o644); err != nil {
		return KnowledgeFileContent{}, fmt.Errorf("保存文件失败: %w", err)
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileContent{}, err
	}
	doc := findDocByStoragePath(ctx, base.ID, relPath)
	if doc != nil {
		agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
			"content":       input.Content,
			"content_hash":  contentHash(input.Content),
			"index_status":  agentmodel.KnowledgeIndexStatusPending,
			"error_message": "",
			"chunk_count":   0,
		})
	}
	return s.ReadKnowledgeFileNode(ctx, base.ID, knowledgeFileID(relPath))
}

func (s Service) ResolveKnowledgeFileNode(ctx context.Context, baseID uint64, id string) (string, string, error) {
	_, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return "", "", err
	}
	filePath, _, err := knowledgeIDPath(root, id)
	if err != nil {
		return "", "", err
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return "", "", fmt.Errorf("文件不存在")
	}
	return filePath, filepath.Base(filePath), nil
}

func (s Service) StartKnowledgeFileIndex(ctx context.Context, baseID uint64, id string) error {
	base, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return err
	}
	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return err
	}
	filePath, relPath, err := knowledgeIDPath(root, id)
	if err != nil {
		return err
	}
	if sameCleanPath(filePath, root) {
		return StartBaseIndex(ctx, base.ID)
	}
	info, err := os.Stat(filePath)
	if err != nil {
		return fmt.Errorf("文件或文件夹不存在")
	}
	if info.IsDir() {
		dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
			"knowledge_base_id": base.ID,
			"path":              NormalizeDirPath(relPath),
		})
		if dir == nil {
			return fmt.Errorf("知识目录不存在")
		}
		return StartDirectoryIndex(ctx, base.ID, dir.ID)
	}
	doc := findDocByStoragePath(ctx, base.ID, relPath)
	if doc == nil {
		return fmt.Errorf("知识文档不存在")
	}
	return StartDocumentIndex(ctx, doc.ID)
}

func knowledgeStorageBase(ctx context.Context, baseID uint64) (*agentmodel.KnowledgeBase, string, error) {
	if baseID == 0 {
		return nil, "", fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return nil, "", fmt.Errorf("知识库不存在")
	}
	cateName := "默认分类"
	if base.CateID > 0 {
		if cate := agentmodel.NewKnowledgeCateModel().Find(ctx, map[string]any{"id": base.CateID}); cate != nil {
			cateName = strings.TrimSpace(cate.Name)
		}
	}
	root := filepath.Join(knowledgeStorageRoot, safeKnowledgePathName(cateName, base.CateID), safeKnowledgePathName(base.Name, base.ID))
	if err := os.MkdirAll(root, 0o755); err != nil {
		return nil, "", fmt.Errorf("创建知识库目录失败: %w", err)
	}
	return base, filepath.Clean(root), nil
}

func syncKnowledgeFilesystem(ctx context.Context, base *agentmodel.KnowledgeBase, root string) error {
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	if err := os.MkdirAll(root, 0o755); err != nil {
		return err
	}
	activeDirs := map[string]uint64{}
	activeDocs := map[string]uint64{}
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if sameCleanPath(path, root) {
			return nil
		}
		if entry.Type()&os.ModeSymlink != 0 {
			return nil
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		if entry.IsDir() {
			dirID, _, err := EnsureDirPath(ctx, base.ID, filepath.ToSlash(rel))
			if err != nil {
				return err
			}
			activeDirs[filepath.ToSlash(rel)] = dirID
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		doc, err := ensureKnowledgeFileDoc(ctx, base.ID, root, filepath.ToSlash(rel), info)
		if err != nil {
			return err
		}
		activeDocs[filepath.ToSlash(rel)] = doc.ID
		return nil
	})
	if err != nil {
		return err
	}
	deleteMissingDocs(ctx, base.ID, activeDocs)
	deleteMissingDirs(ctx, base.ID, activeDirs)
	refreshDirDocCounts(ctx, base.ID)
	refreshBaseDocCount(ctx, base.ID)
	return nil
}

func ensureDatabaseDirsOnDisk(ctx context.Context, baseID uint64, root string) error {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	dirsByID := make(map[uint64]*agentmodel.KnowledgeDir, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		dirsByID[row.ID] = row
	}
	for _, row := range rows {
		if row == nil {
			continue
		}
		relPath := knowledgeDirStoragePath(row, dirsByID, baseID)
		if relPath == "" {
			continue
		}
		dirPath := filepath.Join(root, filepath.FromSlash(relPath))
		if err := ensureInsideKnowledgeRoot(root, dirPath); err != nil {
			return err
		}
		if err := os.MkdirAll(dirPath, 0o755); err != nil {
			return fmt.Errorf("同步知识目录失败: %w", err)
		}
	}
	return nil
}

func knowledgeDirStoragePath(
	dir *agentmodel.KnowledgeDir,
	dirsByID map[uint64]*agentmodel.KnowledgeDir,
	baseID uint64,
) string {
	if dir == nil || dir.KnowledgeBaseID != baseID {
		return ""
	}
	if path := NormalizeDirPath(dir.Path); path != "" {
		return path
	}
	names := make([]string, 0)
	visited := make(map[uint64]bool, len(dirsByID))
	for current := dir; current != nil; current = dirsByID[current.ParentID] {
		if current.KnowledgeBaseID != baseID || visited[current.ID] {
			return ""
		}
		visited[current.ID] = true
		name := strings.TrimSpace(current.Name)
		if name == "" {
			return ""
		}
		names = append([]string{name}, names...)
		if current.ParentID == 0 {
			break
		}
	}
	return NormalizeDirPath(strings.Join(names, "/"))
}

func ensureKnowledgeFileDoc(ctx context.Context, baseID uint64, root string, relPath string, info os.FileInfo) (*agentmodel.KnowledgeDoc, error) {
	relPath = NormalizeDirPath(relPath)
	if relPath == "" {
		return nil, fmt.Errorf("文件路径不能为空")
	}
	dirPath := NormalizeDirPath(filepath.ToSlash(filepath.Dir(relPath)))
	if dirPath == "." {
		dirPath = ""
	}
	dirID, _, err := EnsureDirPath(ctx, baseID, dirPath)
	if err != nil {
		return nil, err
	}
	name := filepath.Base(relPath)
	content := ""
	contentHashValue := ""
	filePath := filepath.Join(root, filepath.FromSlash(relPath))
	editable := isEditableKnowledgeFile(filePath, detectMimeType(filePath, nil), info.Size())
	if editable {
		raw, err := os.ReadFile(filePath)
		if err == nil && utf8.Valid(raw) {
			content = string(raw)
			contentHashValue = contentHash(content)
		}
	}
	mimeType := detectMimeType(filePath, nil)
	values := map[string]any{
		"knowledge_base_id": baseID,
		"dir_id":            dirID,
		"title":             name,
		"file_name":         name,
		"storage_path":      relPath,
		"mime_type":         mimeType,
		"size":              info.Size(),
		"index_status":      agentmodel.KnowledgeIndexStatusPending,
		"error_message":     "",
		"chunk_count":       0,
		"status":            1,
	}
	if editable {
		values["content"] = content
		values["content_hash"] = contentHashValue
	} else {
		values["content"] = ""
		values["content_hash"] = ""
	}
	doc := findDocByStoragePath(ctx, baseID, relPath)
	if doc == nil {
		id := util.ToUint64(agentmodel.NewKnowledgeDocModel().Insert(ctx, withCreatedAt(values)))
		if id == 0 {
			return nil, fmt.Errorf("同步知识文档失败")
		}
		return agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": id}), nil
	}
	needsIndex := strings.TrimSpace(doc.StoragePath) != relPath
	if editable {
		needsIndex = needsIndex || strings.TrimSpace(doc.ContentHash) != contentHashValue
	} else {
		needsIndex = needsIndex || doc.Size != info.Size()
		if !needsIndex {
			delete(values, "content")
			delete(values, "content_hash")
		} else {
			values["content"] = ""
			values["content_hash"] = ""
		}
	}
	if !needsIndex {
		delete(values, "index_status")
		delete(values, "error_message")
		delete(values, "chunk_count")
	}
	values["status"] = 1
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, values)
	return agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": doc.ID}), nil
}

func walkKnowledgeFileNodes(ctx context.Context, baseID uint64, root string) ([]KnowledgeFileNode, int64, error) {
	dirs := map[string]*agentmodel.KnowledgeDir{}
	dirRows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{"knowledge_base_id": baseID})
	dirsByID := make(map[uint64]*agentmodel.KnowledgeDir, len(dirRows))
	for _, dir := range dirRows {
		if dir == nil {
			continue
		}
		dirsByID[dir.ID] = dir
	}
	for _, dir := range dirRows {
		dirPath := knowledgeDirStoragePath(dir, dirsByID, baseID)
		if dirPath != "" {
			dirs[dirPath] = dir
		}
	}
	docs := map[string]*agentmodel.KnowledgeDoc{}
	for _, doc := range agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{"knowledge_base_id": baseID}) {
		if doc != nil {
			docs[docStoragePath(ctx, doc)] = doc
		}
	}
	files := make([]KnowledgeFileNode, 0)
	seen := make(map[string]bool)
	var used int64
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if sameCleanPath(path, root) {
			return nil
		}
		if entry.Type()&os.ModeSymlink != 0 {
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		rel = NormalizeDirPath(rel)
		if rel == "" {
			return nil
		}
		seen[rel] = true
		item := KnowledgeFileNode{
			ID:   knowledgeFileID(rel),
			Name: filepath.Base(path),
			Type: "file",
			Size: info.Size(),
			Date: info.ModTime(),
			Ext:  fileExtension(path),
		}
		if entry.IsDir() {
			item.Type = "folder"
			item.Size = 0
			if dir := dirs[rel]; dir != nil {
				item.DirID = dir.ID
			}
		} else {
			used += info.Size()
			if doc := docs[rel]; doc != nil {
				item.DocID = doc.ID
				item.Status = strings.TrimSpace(doc.IndexStatus)
			}
		}
		files = append(files, item)
		return nil
	})
	for rel, dir := range dirs {
		if seen[rel] {
			continue
		}
		files = append(files, KnowledgeFileNode{
			ID:    knowledgeFileID(rel),
			Name:  strings.TrimSpace(dir.Name),
			Type:  "folder",
			Size:  0,
			Date:  dir.CreatedAt,
			DirID: dir.ID,
		})
	}
	sort.SliceStable(files, func(i, j int) bool {
		return files[i].ID < files[j].ID
	})
	return files, used, err
}

func deleteMissingDocs(ctx context.Context, baseID uint64, activeDocs map[string]uint64) {
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{"knowledge_base_id": baseID})
	for _, row := range rows {
		if row == nil {
			continue
		}
		path := docStoragePath(ctx, row)
		if path != "" {
			if _, ok := activeDocs[path]; ok {
				continue
			}
		}
		agentmodel.NewKnowledgeChunkModel().Delete(ctx, map[string]any{"doc_id": row.ID})
		agentmodel.NewKnowledgeDocModel().Delete(ctx, map[string]any{"id": row.ID})
	}
}

func deleteMissingDirs(ctx context.Context, baseID uint64, activeDirs map[string]uint64) {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{"knowledge_base_id": baseID}, map[string]any{
		"order": "main.depth desc, main.id desc",
	})
	for _, row := range rows {
		if row == nil || strings.TrimSpace(row.Path) == "" {
			continue
		}
		if _, ok := activeDirs[strings.TrimSpace(row.Path)]; ok {
			continue
		}
		agentmodel.NewKnowledgeDirModel().Delete(ctx, map[string]any{"id": row.ID})
	}
}

func refreshDirDocCounts(ctx context.Context, baseID uint64) {
	counts := docCountsByDir(ctx, baseID)
	for _, dir := range agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{"knowledge_base_id": baseID}) {
		if dir == nil {
			continue
		}
		agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{"id": dir.ID}, map[string]any{
			"doc_count": counts[dir.ID],
		})
	}
}

func refreshBaseDocCount(ctx context.Context, baseID uint64) {
	docCount := agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	chunkCount := agentmodel.NewKnowledgeChunkModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"doc_count":   docCount,
		"chunk_count": chunkCount,
	})
}

func docStoragePath(_ context.Context, doc *agentmodel.KnowledgeDoc) string {
	if doc == nil {
		return ""
	}
	return NormalizeDirPath(doc.StoragePath)
}

func findDocByStoragePath(ctx context.Context, baseID uint64, relPath string) *agentmodel.KnowledgeDoc {
	relPath = NormalizeDirPath(relPath)
	if relPath == "" {
		return nil
	}
	if doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"storage_path":      relPath,
	}); doc != nil {
		return doc
	}
	return nil
}

func knowledgeIDPath(root string, id string) (string, string, error) {
	rel, err := cleanKnowledgeID(id)
	if err != nil {
		return "", "", err
	}
	path := filepath.Join(root, filepath.FromSlash(rel))
	if err := ensureInsideKnowledgeRoot(root, path); err != nil {
		return "", "", err
	}
	return filepath.Clean(path), rel, nil
}

func cleanKnowledgeID(id string) (string, error) {
	id = strings.TrimSpace(strings.ReplaceAll(id, "\\", "/"))
	if id == "" || id == "/" {
		return "", nil
	}
	id = strings.TrimPrefix(id, "/")
	cleaned := filepath.ToSlash(filepath.Clean(id))
	if cleaned == "." {
		return "", nil
	}
	if strings.HasPrefix(cleaned, "../") || cleaned == ".." || strings.HasPrefix(cleaned, "/") {
		return "", fmt.Errorf("文件路径无效")
	}
	for _, part := range strings.Split(cleaned, "/") {
		if strings.TrimSpace(part) == "" || part == "." || part == ".." {
			return "", fmt.Errorf("文件路径无效")
		}
	}
	return cleaned, nil
}

func idFromFilePath(root string, path string) string {
	rel, err := filepath.Rel(root, path)
	if err != nil {
		return "/"
	}
	return knowledgeFileID(filepath.ToSlash(rel))
}

func ensureInsideKnowledgeRoot(root string, path string) error {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return err
	}
	pathAbs, err := filepath.Abs(path)
	if err != nil {
		return err
	}
	if pathAbs == rootAbs || strings.HasPrefix(pathAbs, rootAbs+string(os.PathSeparator)) {
		return nil
	}
	return fmt.Errorf("文件路径越界")
}

func ensureNoSymlinkPath(root string, path string) error {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return err
	}
	pathAbs, err := filepath.Abs(path)
	if err != nil {
		return err
	}
	rel, err := filepath.Rel(rootAbs, pathAbs)
	if err != nil {
		return err
	}
	current := rootAbs
	for _, part := range strings.Split(filepath.ToSlash(rel), "/") {
		if part == "" || part == "." {
			continue
		}
		current = filepath.Join(current, part)
		info, err := os.Lstat(current)
		if err == nil && info.Mode()&os.ModeSymlink != 0 {
			return fmt.Errorf("路径包含软链接")
		}
		if err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}

func normalizeFileName(name string) (string, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return "", fmt.Errorf("名称不能为空")
	}
	if name == "." || name == ".." || strings.Contains(name, "/") || strings.Contains(name, "\\") {
		return "", fmt.Errorf("名称无效")
	}
	if strings.ContainsAny(name, "\x00:*?\"<>|") {
		return "", fmt.Errorf("名称包含非法字符")
	}
	return name, nil
}

func normalizeFileType(fileType string) string {
	if strings.EqualFold(strings.TrimSpace(fileType), "folder") {
		return "folder"
	}
	return "file"
}

func safeKnowledgePathName(name string, id uint64) string {
	name = strings.TrimSpace(name)
	replacer := strings.NewReplacer("/", "_", "\\", "_", ":", "_", "*", "_", "?", "_", "\"", "_", "<", "_", ">", "_", "|", "_", "\x00", "_")
	name = replacer.Replace(name)
	name = strings.Trim(name, " .")
	if name == "" {
		name = fmt.Sprintf("knowledge_%d", id)
	}
	return name
}

func knowledgeFileID(relPath string) string {
	relPath = NormalizeDirPath(relPath)
	if relPath == "" {
		return "/"
	}
	return "/" + relPath
}

func decodeOptionalBase64(value string) ([]byte, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return []byte{}, nil
	}
	raw, err := base64.StdEncoding.DecodeString(value)
	if err != nil {
		return nil, fmt.Errorf("文件内容解析失败")
	}
	return raw, nil
}

func isKnowledgeZipUpload(name string, raw []byte) bool {
	return len(raw) > 0 && strings.EqualFold(filepath.Ext(name), ".zip")
}

func extractKnowledgeZip(root string, parentPath string, raw []byte) error {
	reader, err := zip.NewReader(bytes.NewReader(raw), int64(len(raw)))
	if err != nil {
		return fmt.Errorf("解压 zip 失败: %w", err)
	}
	for _, file := range reader.File {
		relPath, ok := cleanZipEntryPath(file.Name)
		if !ok {
			continue
		}
		target := filepath.Join(parentPath, filepath.FromSlash(relPath))
		if err := ensureInsideKnowledgeRoot(root, target); err != nil {
			return err
		}
		if err := ensureNoSymlinkPath(root, target); err != nil {
			return err
		}
		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(target, 0o755); err != nil {
				return fmt.Errorf("创建 zip 目录失败: %w", err)
			}
			continue
		}
		if _, err := os.Stat(target); err == nil {
			return fmt.Errorf("zip 内文件已存在: %s", relPath)
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return fmt.Errorf("创建 zip 目标目录失败: %w", err)
		}
		source, err := file.Open()
		if err != nil {
			return fmt.Errorf("读取 zip 文件失败: %w", err)
		}
		if err := writeKnowledgeZipFile(target, source); err != nil {
			source.Close()
			return err
		}
		source.Close()
	}
	return nil
}

func cleanZipEntryPath(name string) (string, bool) {
	name = strings.TrimSpace(strings.ReplaceAll(name, "\\", "/"))
	name = strings.TrimPrefix(name, "/")
	if name == "" || strings.HasPrefix(name, "__MACOSX/") || strings.HasSuffix(name, "/.DS_Store") {
		return "", false
	}
	cleaned := filepath.ToSlash(filepath.Clean(name))
	if cleaned == "." || cleaned == ".." || strings.HasPrefix(cleaned, "../") {
		return "", false
	}
	return cleaned, true
}

func writeKnowledgeZipFile(target string, source io.Reader) error {
	out, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return fmt.Errorf("创建 zip 文件失败: %w", err)
	}
	defer out.Close()
	if _, err := io.Copy(out, source); err != nil {
		return fmt.Errorf("写入 zip 文件失败: %w", err)
	}
	return nil
}

func detectMimeType(path string, content []byte) string {
	ext := strings.ToLower(filepath.Ext(path))
	if mimeType := mime.TypeByExtension(ext); mimeType != "" {
		return strings.Split(mimeType, ";")[0]
	}
	if len(content) > 0 {
		return ""
	}
	return "application/octet-stream"
}

func isEditableKnowledgeFile(path string, mimeType string, size int64) bool {
	if size > maxEditableFileBytes {
		return false
	}
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(path), "."))
	switch ext {
	case "txt", "md", "markdown", "json", "yaml", "yml", "csv", "xml", "html", "htm", "css", "js", "ts", "tsx", "jsx", "go", "py", "java", "php", "sql", "sh", "conf", "ini", "env", "log":
		return true
	}
	return strings.HasPrefix(strings.ToLower(mimeType), "text/")
}

func fileExtension(path string) string {
	ext := strings.TrimPrefix(strings.ToLower(filepath.Ext(path)), ".")
	if ext == "" {
		return "file"
	}
	return ext
}

func sameCleanPath(a string, b string) bool {
	aAbs, aErr := filepath.Abs(a)
	bAbs, bErr := filepath.Abs(b)
	if aErr != nil || bErr != nil {
		return filepath.Clean(a) == filepath.Clean(b)
	}
	return aAbs == bAbs
}

func isPathAncestor(parent string, child string) bool {
	parentAbs, err := filepath.Abs(parent)
	if err != nil {
		return false
	}
	childAbs, err := filepath.Abs(child)
	if err != nil {
		return false
	}
	return childAbs == parentAbs || strings.HasPrefix(childAbs, parentAbs+string(os.PathSeparator))
}

func copyKnowledgePath(source string, target string) error {
	info, err := os.Stat(source)
	if err != nil {
		return fmt.Errorf("复制来源不存在")
	}
	if info.IsDir() {
		return copyKnowledgeDir(source, target)
	}
	return copyKnowledgeFile(source, target)
}

func copyKnowledgeDir(source string, target string) error {
	return filepath.WalkDir(source, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.Type()&os.ModeSymlink != 0 {
			return fmt.Errorf("不支持复制软链接")
		}
		rel, err := filepath.Rel(source, path)
		if err != nil {
			return err
		}
		targetPath := filepath.Join(target, rel)
		if entry.IsDir() {
			return os.MkdirAll(targetPath, 0o755)
		}
		return copyKnowledgeFile(path, targetPath)
	})
}

func copyKnowledgeFile(source string, target string) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return fmt.Errorf("创建目标目录失败: %w", err)
	}
	in, err := os.Open(source)
	if err != nil {
		return fmt.Errorf("打开复制来源失败: %w", err)
	}
	defer in.Close()
	out, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return fmt.Errorf("创建复制目标失败: %w", err)
	}
	defer out.Close()
	if _, err := io.Copy(out, in); err != nil {
		return fmt.Errorf("复制文件失败: %w", err)
	}
	return nil
}

func docID(doc *agentmodel.KnowledgeDoc) uint64 {
	if doc == nil {
		return 0
	}
	return doc.ID
}

func docIndexStatus(doc *agentmodel.KnowledgeDoc) string {
	if doc == nil {
		return ""
	}
	return strings.TrimSpace(doc.IndexStatus)
}
