package knowledge

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	knowledgeStorageRoot             = "data/knowledge"
	maxEditableFileBytes             = 5 * 1024 * 1024
	maxKnowledgeUploadPartBytes      = 10 * 1024 * 1024
	maxKnowledgeUploadTotalBytes     = 100 * 1024 * 1024
	maxKnowledgeUploadParts          = 200
	maxKnowledgeZipEntries           = 2000
	maxKnowledgeZipUncompressedBytes = 100 * 1024 * 1024
	knowledgeUploadTempDirName       = ".upload"
)

var editableKnowledgeFileExts = map[string]bool{
	"conf":     true,
	"css":      true,
	"csv":      true,
	"env":      true,
	"go":       true,
	"htm":      true,
	"html":     true,
	"ini":      true,
	"java":     true,
	"js":       true,
	"json":     true,
	"jsx":      true,
	"log":      true,
	"markdown": true,
	"md":       true,
	"php":      true,
	"py":       true,
	"sh":       true,
	"sql":      true,
	"tsx":      true,
	"ts":       true,
	"txt":      true,
	"xml":      true,
	"yaml":     true,
	"yml":      true,
}

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
	ID         string    `json:"id"`
	Name       string    `json:"name,omitempty"`
	Type       string    `json:"type"`
	Size       int64     `json:"size,omitempty"`
	Date       time.Time `json:"date"`
	Ext        string    `json:"ext,omitempty"`
	DocID      uint64    `json:"doc_id,omitempty"`
	DirID      uint64    `json:"dir_id,omitempty"`
	Status     string    `json:"index_status,omitempty"`
	SourceType string    `json:"source_type,omitempty"`
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
	SourceType  string `json:"source_type,omitempty"`
}

type KnowledgeResolvedFile struct {
	Path     string
	Name     string
	MimeType string
}

type KnowledgeCreateInput struct {
	BaseID        uint64
	ParentID      string
	Name          string
	Type          string
	ContentBase64 string
}

type KnowledgeUploadPartInput struct {
	BaseID     uint64
	ParentID   string
	Name       string
	UploadID   string
	PartNumber int
	TotalParts int
	Source     io.Reader
}

type KnowledgeUploadPartResult struct {
	KnowledgeFileOperationResult
	Complete   bool   `json:"complete"`
	UploadID   string `json:"upload_id"`
	PartNumber int    `json:"part_number"`
	TotalParts int    `json:"total_parts"`
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
			"id":           base.ID,
			"name":         strings.TrimSpace(base.Name),
			"status":       base.Status,
			"index_status": base.IndexStatus,
			"root":         filepath.ToSlash(root),
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
		SourceType:  docSourceType(doc),
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
		if int64(len(raw)) > maxKnowledgeUploadTotalBytes {
			return KnowledgeFileOperationResult{}, fmt.Errorf("上传文件超过 %d MB 限制", maxKnowledgeUploadTotalBytes/1024/1024)
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

func (s Service) SaveKnowledgeUploadPart(ctx context.Context, input KnowledgeUploadPartInput) (KnowledgeUploadPartResult, error) {
	if input.Source == nil {
		return KnowledgeUploadPartResult{}, fmt.Errorf("上传分片不能为空")
	}
	base, root, err := knowledgeStorageBase(ctx, input.BaseID)
	if err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	parentPath, parentRel, err := knowledgeIDPath(root, input.ParentID)
	if err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	if err := ensureInsideKnowledgeRoot(root, parentPath); err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	if input.PartNumber <= 0 || input.TotalParts <= 0 || input.PartNumber > input.TotalParts {
		return KnowledgeUploadPartResult{}, fmt.Errorf("上传分片序号无效")
	}
	if input.TotalParts > maxKnowledgeUploadParts {
		return KnowledgeUploadPartResult{}, fmt.Errorf("上传分片数量超过 %d 个限制", maxKnowledgeUploadParts)
	}
	uploadID, err := normalizeKnowledgeUploadID(input.UploadID)
	if err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	name, err := normalizeFileName(input.Name)
	if err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	if err := saveKnowledgeUploadPart(root, uploadID, input.PartNumber, input.Source); err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	if size, err := knowledgeUploadStoredBytes(root, uploadID); err != nil {
		return KnowledgeUploadPartResult{}, err
	} else if size > maxKnowledgeUploadTotalBytes {
		_ = os.RemoveAll(knowledgeUploadDir(root, uploadID))
		return KnowledgeUploadPartResult{}, fmt.Errorf("上传文件超过 %d MB 限制", maxKnowledgeUploadTotalBytes/1024/1024)
	}
	result := KnowledgeUploadPartResult{
		UploadID:   uploadID,
		PartNumber: input.PartNumber,
		TotalParts: input.TotalParts,
		Complete:   false,
	}
	if input.PartNumber != input.TotalParts || !knowledgeUploadPartsComplete(root, uploadID, input.TotalParts) {
		return result, nil
	}

	data, newID, err := s.completeKnowledgeUploadParts(ctx, base, root, parentPath, parentRel, name, uploadID, input.TotalParts)
	if err != nil {
		return KnowledgeUploadPartResult{}, err
	}
	result.KnowledgeFileOperationResult = KnowledgeFileOperationResult{KnowledgeFileData: data, NewID: newID}
	result.Complete = true
	return result, nil
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
	oldInfo, err := os.Stat(oldPath)
	if err != nil {
		return KnowledgeFileOperationResult{}, fmt.Errorf("读取文件失败: %w", err)
	}
	if err := os.Rename(oldPath, newPath); err != nil {
		return KnowledgeFileOperationResult{}, fmt.Errorf("重命名失败: %w", err)
	}
	if err := migrateRenamedKnowledgeRecords(ctx, base.ID, root, oldPath, newPath, oldInfo.IsDir()); err != nil {
		return KnowledgeFileOperationResult{}, err
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

func migrateRenamedKnowledgeRecords(ctx context.Context, baseID uint64, root string, oldPath string, newPath string, isDir bool) error {
	oldRel, err := relativeKnowledgePath(root, oldPath)
	if err != nil {
		return err
	}
	newRel, err := relativeKnowledgePath(root, newPath)
	if err != nil {
		return err
	}
	if oldRel == "" || newRel == "" || oldRel == newRel {
		return nil
	}
	if isDir {
		return migrateRenamedKnowledgeDir(ctx, baseID, oldRel, newRel)
	}
	return migrateRenamedKnowledgeDoc(ctx, baseID, oldRel, newRel)
}

func migrateRenamedKnowledgeDoc(ctx context.Context, baseID uint64, oldRel string, newRel string) error {
	doc := findDocByStoragePath(ctx, baseID, oldRel)
	if doc == nil {
		return nil
	}
	dirPath := NormalizeDirPath(filepath.ToSlash(filepath.Dir(newRel)))
	if dirPath == "." {
		dirPath = ""
	}
	dirID, _, err := EnsureDirPath(ctx, baseID, dirPath)
	if err != nil {
		return err
	}
	name := filepath.Base(newRel)
	values := map[string]any{
		"dir_id":       dirID,
		"title":        name,
		"file_name":    name,
		"storage_path": newRel,
	}
	if knowledgeDocIndexMetadataMatches(ctx, doc.ID, dirID, name) {
		values["index_status"] = agentmodel.KnowledgeIndexStatusSuccess
		values["index_stage"] = agentmodel.KnowledgeIndexStageComplete
		values["index_stage_detail"] = ""
		values["error_message"] = ""
	} else {
		values["index_status"] = agentmodel.KnowledgeIndexStatusPending
		values["index_stage"] = agentmodel.KnowledgeIndexStagePending
		values["index_stage_detail"] = ""
		values["error_message"] = ""
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, values)
	return nil
}

func migrateRenamedKnowledgeDir(ctx context.Context, baseID uint64, oldRel string, newRel string) error {
	oldRel = NormalizeDirPath(oldRel)
	newRel = NormalizeDirPath(newRel)
	if oldRel == "" || newRel == "" {
		return nil
	}
	if _, _, err := EnsureDirPath(ctx, baseID, newRel); err != nil {
		return err
	}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	for _, doc := range rows {
		if doc == nil {
			continue
		}
		path := docStoragePath(ctx, doc)
		if path != oldRel && !strings.HasPrefix(path, oldRel+"/") {
			continue
		}
		nextPath := newRel + strings.TrimPrefix(path, oldRel)
		if err := migrateRenamedKnowledgeDoc(ctx, baseID, path, nextPath); err != nil {
			return err
		}
	}
	return nil
}

func knowledgeDocIndexMetadataMatches(ctx context.Context, docID uint64, dirID uint64, title string) bool {
	if docID == 0 {
		return false
	}
	docPath := strings.Trim(strings.Join(nonEmptyStrings(KnowledgeDirPath(ctx, dirID), title), "/"), "/")
	return agentmodel.NewKnowledgeNodeModel().Count(ctx, map[string]any{
		"doc_id":       docID,
		"node_key":     "doc",
		"path":         docPath,
		"title":        title,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	}) > 0
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
	if !isEditableKnowledgeFile(filePath, detectMimeType(filePath, nil), info.Size()) {
		return KnowledgeFileContent{}, fmt.Errorf("该文件不支持在线编辑")
	}
	if int64(len(input.Content)) > maxEditableFileBytes || !isUTF8TextContent([]byte(input.Content)) {
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
		clearKnowledgeDocumentIndex(ctx, base.ID, doc.ID)
		markKnowledgeDocPending(ctx, doc.ID, map[string]any{
			"content":      input.Content,
			"summary":      "",
			"keywords":     "",
			"content_hash": contentHash(input.Content),
		})
	}
	return s.ReadKnowledgeFileNode(ctx, base.ID, knowledgeFileID(relPath))
}

func (s Service) ResolveKnowledgeFileNode(ctx context.Context, baseID uint64, id string) (string, string, error) {
	file, err := s.ResolveKnowledgeFileContent(ctx, baseID, id)
	if err != nil {
		return "", "", err
	}
	return file.Path, file.Name, nil
}

func (s Service) ResolveKnowledgeFileContent(ctx context.Context, baseID uint64, id string) (KnowledgeResolvedFile, error) {
	_, root, err := knowledgeStorageBase(ctx, baseID)
	if err != nil {
		return KnowledgeResolvedFile{}, err
	}
	filePath, _, err := knowledgeIDPath(root, id)
	if err != nil {
		return KnowledgeResolvedFile{}, err
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return KnowledgeResolvedFile{}, fmt.Errorf("文件不存在")
	}
	return KnowledgeResolvedFile{
		Path:     filePath,
		Name:     filepath.Base(filePath),
		MimeType: detectMimeType(filePath, nil),
	}, nil
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
	root := stableKnowledgeStorageRoot(base.CateID, base.ID)
	for _, legacyRoot := range deterministicLegacyKnowledgeStorageRoots(cateName, base.CateID, base.Name, base.ID) {
		if err := migrateLegacyKnowledgeStorageRoot(legacyRoot, root); err != nil {
			return nil, "", err
		}
	}
	for _, legacyRoot := range discoveredLegacyKnowledgeStorageRoots(ctx, base.ID, root) {
		if err := migrateLegacyKnowledgeStorageRoot(legacyRoot, root); err != nil {
			return nil, "", err
		}
	}
	if err := os.MkdirAll(root, 0o755); err != nil {
		return nil, "", fmt.Errorf("创建知识库目录失败: %w", err)
	}
	return base, filepath.Clean(root), nil
}

func stableKnowledgeStorageRoot(cateID uint64, baseID uint64) string {
	return filepath.Join(knowledgeStorageRoot, fmt.Sprintf("%d", cateID), fmt.Sprintf("%d", baseID))
}

func discoveredLegacyKnowledgeStorageRoots(ctx context.Context, baseID uint64, stableRoot string) []string {
	roots := legacyKnowledgeStorageRootsByDocs(ctx, baseID, stableRoot)
	roots = append(roots, legacyKnowledgeStorageRootsByDirs(ctx, baseID, stableRoot)...)
	return uniqueCleanPaths(roots)
}

func deterministicLegacyKnowledgeStorageRoots(cateName string, cateID uint64, baseName string, baseID uint64) []string {
	legacyCateName := safeKnowledgePathName(cateName, cateID)
	legacyBaseName := safeKnowledgePathName(baseName, baseID)
	baseIDName := fmt.Sprintf("%d", baseID)
	roots := []string{
		filepath.Join(knowledgeStorageRoot, legacyCateName, legacyBaseName),
		filepath.Join(knowledgeStorageRoot, legacyCateName, baseIDName),
		filepath.Join(knowledgeStorageRoot, legacyCateName, safeKnowledgePathName("", baseID)),
		filepath.Join(knowledgeStorageRoot, fmt.Sprintf("%d", cateID), legacyBaseName),
		filepath.Join(knowledgeStorageRoot, fmt.Sprintf("%d", cateID), fmt.Sprintf("base-%d", baseID)),
		filepath.Join(knowledgeStorageRoot, fmt.Sprintf("cate-%d", cateID), fmt.Sprintf("base-%d", baseID)),
		filepath.Join(knowledgeStorageRoot, fmt.Sprintf("cate-%d", cateID), legacyBaseName),
		filepath.Join(knowledgeStorageRoot, fmt.Sprintf("cate-%d", cateID), baseIDName),
	}
	entries, err := os.ReadDir(knowledgeStorageRoot)
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() {
				continue
			}
			cateDir := filepath.Join(knowledgeStorageRoot, entry.Name())
			roots = append(roots,
				filepath.Join(cateDir, legacyBaseName),
				filepath.Join(cateDir, baseIDName),
				filepath.Join(cateDir, safeKnowledgePathName("", baseID)),
				filepath.Join(cateDir, fmt.Sprintf("base-%d", baseID)),
			)
		}
	}
	return uniqueCleanPaths(roots)
}

type knowledgeStoredDocFile struct {
	StoragePath string
	ContentHash string
	Size        int64
}

func legacyKnowledgeStorageRootsByDocs(ctx context.Context, baseID uint64, stableRoot string) []string {
	docs := storedKnowledgeDocFiles(ctx, baseID)
	if len(docs) == 0 {
		return nil
	}
	roots := make([]string, 0)
	for _, candidateRoot := range knowledgeStorageCandidateRoots(stableRoot) {
		if knowledgeStorageRootHasStoredDoc(candidateRoot, docs) {
			roots = append(roots, candidateRoot)
		}
	}
	return roots
}

func storedKnowledgeDocFiles(ctx context.Context, baseID uint64) []knowledgeStoredDocFile {
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.storage_path, main.content_hash, main.size",
		"page":     1,
		"pageSize": 1000,
	})
	files := make([]knowledgeStoredDocFile, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		storagePath := NormalizeDirPath(row.StoragePath)
		if storagePath == "" {
			continue
		}
		files = append(files, knowledgeStoredDocFile{
			StoragePath: storagePath,
			ContentHash: strings.TrimSpace(row.ContentHash),
			Size:        row.Size,
		})
	}
	return files
}

func knowledgeStorageRootHasStoredDoc(root string, docs []knowledgeStoredDocFile) bool {
	for _, doc := range docs {
		if storedDocFileExists(root, doc) {
			return true
		}
	}
	return false
}

func storedDocFileExists(root string, doc knowledgeStoredDocFile) bool {
	relPath := NormalizeDirPath(doc.StoragePath)
	if relPath == "" {
		return false
	}
	filePath := filepath.Join(root, filepath.FromSlash(relPath))
	if err := ensureInsideKnowledgeRoot(root, filePath); err != nil {
		return false
	}
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		return false
	}
	if doc.ContentHash == "" && doc.Size <= 0 {
		return false
	}
	if doc.ContentHash != "" && isEditableKnowledgeFile(filePath, detectMimeType(filePath, nil), info.Size()) {
		raw, err := os.ReadFile(filePath)
		return err == nil && utf8.Valid(raw) && contentHash(string(raw)) == doc.ContentHash
	}
	if doc.Size > 0 && info.Size() != doc.Size {
		return false
	}
	return true
}

func legacyKnowledgeStorageRootsByDirs(ctx context.Context, baseID uint64, stableRoot string) []string {
	dirPaths := storedKnowledgeDirPaths(ctx, baseID)
	if len(dirPaths) == 0 {
		return nil
	}
	roots := make([]string, 0)
	for _, candidateRoot := range knowledgeStorageCandidateRoots(stableRoot) {
		if !knowledgeStorageRootHasRegularFile(candidateRoot) {
			continue
		}
		if knowledgeStorageRootHasStoredDir(candidateRoot, dirPaths) {
			roots = append(roots, candidateRoot)
		}
	}
	return roots
}

func storedKnowledgeDirPaths(ctx context.Context, baseID uint64) []string {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.path",
		"page":     1,
		"pageSize": 1000,
	})
	paths := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		path := NormalizeDirPath(row.Path)
		if path != "" {
			paths = append(paths, path)
		}
	}
	return paths
}

func knowledgeStorageCandidateRoots(stableRoot string) []string {
	cateEntries, err := os.ReadDir(knowledgeStorageRoot)
	if err != nil {
		return nil
	}
	roots := make([]string, 0)
	for _, cateEntry := range cateEntries {
		if !cateEntry.IsDir() {
			continue
		}
		cateRoot := filepath.Join(knowledgeStorageRoot, cateEntry.Name())
		baseEntries, err := os.ReadDir(cateRoot)
		if err != nil {
			continue
		}
		for _, baseEntry := range baseEntries {
			if !baseEntry.IsDir() {
				continue
			}
			candidateRoot := filepath.Join(cateRoot, baseEntry.Name())
			if sameCleanPath(candidateRoot, stableRoot) {
				continue
			}
			roots = append(roots, candidateRoot)
		}
	}
	return roots
}

func knowledgeStorageRootHasStoredDir(root string, dirPaths []string) bool {
	for _, dirPath := range dirPaths {
		dirPath = NormalizeDirPath(dirPath)
		if dirPath == "" {
			continue
		}
		path := filepath.Join(root, filepath.FromSlash(dirPath))
		if err := ensureInsideKnowledgeRoot(root, path); err != nil {
			continue
		}
		info, err := os.Stat(path)
		if err == nil && info.IsDir() {
			return true
		}
	}
	return false
}

func knowledgeStorageRootHasRegularFile(root string) bool {
	found := false
	_ = filepath.WalkDir(root, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return filepath.SkipDir
		}
		if sameCleanPath(path, root) {
			return nil
		}
		if entry.IsDir() && sameCleanPath(path, filepath.Join(root, knowledgeUploadTempDirName)) {
			return filepath.SkipDir
		}
		if !entry.IsDir() && entry.Type()&os.ModeSymlink == 0 {
			found = true
			return filepath.SkipAll
		}
		return nil
	})
	return found
}

func uniqueCleanPaths(paths []string) []string {
	result := make([]string, 0, len(paths))
	seen := make(map[string]struct{}, len(paths))
	for _, path := range paths {
		path = filepath.Clean(path)
		if path == "." || path == "" {
			continue
		}
		if _, exists := seen[path]; exists {
			continue
		}
		seen[path] = struct{}{}
		result = append(result, path)
	}
	return result
}

func migrateLegacyKnowledgeStorageRoot(legacyRoot string, stableRoot string) error {
	legacyRoot = filepath.Clean(legacyRoot)
	stableRoot = filepath.Clean(stableRoot)
	if legacyRoot == stableRoot {
		return nil
	}
	if _, err := os.Stat(legacyRoot); err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("读取旧知识库目录失败: %w", err)
	}
	if _, err := os.Stat(stableRoot); err == nil {
		if err := mergeKnowledgeStorageDirs(legacyRoot, stableRoot); err != nil {
			return err
		}
		return pruneEmptyKnowledgeStorageDirs(legacyRoot)
	} else if !os.IsNotExist(err) {
		return fmt.Errorf("读取知识库目录失败: %w", err)
	}
	if err := os.MkdirAll(filepath.Dir(stableRoot), 0o755); err != nil {
		return fmt.Errorf("创建知识库目录失败: %w", err)
	}
	if err := os.Rename(legacyRoot, stableRoot); err == nil {
		return nil
	}
	if err := mergeKnowledgeStorageDirs(legacyRoot, stableRoot); err != nil {
		return err
	}
	return os.RemoveAll(legacyRoot)
}

func mergeKnowledgeStorageDirs(sourceRoot string, targetRoot string) error {
	return filepath.WalkDir(sourceRoot, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if sameCleanPath(path, sourceRoot) {
			return os.MkdirAll(targetRoot, 0o755)
		}
		rel, err := filepath.Rel(sourceRoot, path)
		if err != nil {
			return err
		}
		target := filepath.Join(targetRoot, rel)
		if entry.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		if _, err := os.Stat(target); err == nil {
			return nil
		} else if !os.IsNotExist(err) {
			return err
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		if err := os.Rename(path, target); err == nil {
			return nil
		}
		return copyKnowledgeStorageFile(path, target)
	})
}

func copyKnowledgeStorageFile(source string, target string) error {
	in, err := os.Open(source)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.OpenFile(target, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	if _, err := io.Copy(out, in); err != nil {
		_ = out.Close()
		return err
	}
	return out.Close()
}

func pruneEmptyKnowledgeStorageDirs(root string) error {
	dirs := make([]string, 0)
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			if os.IsNotExist(walkErr) {
				return nil
			}
			return walkErr
		}
		if entry.IsDir() {
			dirs = append(dirs, path)
		}
		return nil
	})
	if err != nil {
		return err
	}
	sort.Slice(dirs, func(i, j int) bool {
		return len(dirs[i]) > len(dirs[j])
	})
	for _, dir := range dirs {
		if err := os.Remove(dir); err != nil && !os.IsNotExist(err) {
			entries, readErr := os.ReadDir(dir)
			if readErr == nil && len(entries) > 0 {
				continue
			}
			return err
		}
	}
	return nil
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
		if entry.IsDir() && sameCleanPath(path, filepath.Join(root, knowledgeUploadTempDirName)) {
			return filepath.SkipDir
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
		"knowledge_base_id":  baseID,
		"dir_id":             dirID,
		"title":              name,
		"file_name":          name,
		"storage_path":       relPath,
		"mime_type":          mimeType,
		"size":               info.Size(),
		"summary":            "",
		"keywords":           "",
		"index_status":       agentmodel.KnowledgeIndexStatusPending,
		"index_stage":        agentmodel.KnowledgeIndexStagePending,
		"index_stage_detail": "",
		"index_version":      1,
		"error_message":      "",
		"node_count":         0,
		"status":             1,
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
		delete(values, "index_stage")
		delete(values, "index_stage_detail")
		delete(values, "index_version")
		delete(values, "error_message")
		delete(values, "node_count")
		delete(values, "summary")
		delete(values, "keywords")
	} else {
		clearKnowledgeDocumentIndex(ctx, baseID, doc.ID)
		values["index_version"] = nextDocIndexVersion(doc.IndexVersion)
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
		if entry.IsDir() && sameCleanPath(path, filepath.Join(root, knowledgeUploadTempDirName)) {
			return filepath.SkipDir
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
				item.SourceType = strings.TrimSpace(doc.SourceType)
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
		clearKnowledgeDocumentIndex(ctx, baseID, row.ID)
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
	nodeCount := agentmodel.NewKnowledgeNodeModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"doc_count":  docCount,
		"node_count": nodeCount,
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

func relativeKnowledgePath(root string, path string) (string, error) {
	if err := ensureInsideKnowledgeRoot(root, path); err != nil {
		return "", err
	}
	rel, err := filepath.Rel(root, path)
	if err != nil {
		return "", err
	}
	return cleanKnowledgeID(filepath.ToSlash(rel))
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
	if int64(len(raw)) > maxKnowledgeUploadTotalBytes {
		return fmt.Errorf("zip 文件超过 %d MB 限制", maxKnowledgeUploadTotalBytes/1024/1024)
	}
	reader, err := zip.NewReader(bytes.NewReader(raw), int64(len(raw)))
	if err != nil {
		return fmt.Errorf("解压 zip 失败: %w", err)
	}
	if len(reader.File) > maxKnowledgeZipEntries {
		return fmt.Errorf("zip 条目超过 %d 个限制", maxKnowledgeZipEntries)
	}
	var extractedBytes int64
	var extractedFiles int
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
		if !file.FileInfo().Mode().IsRegular() {
			return fmt.Errorf("zip 不支持非普通文件: %s", relPath)
		}
		if extractedFiles >= maxKnowledgeZipEntries {
			return fmt.Errorf("zip 文件条目超过 %d 个限制", maxKnowledgeZipEntries)
		}
		if int64(file.UncompressedSize64) > maxKnowledgeZipUncompressedBytes-extractedBytes {
			return fmt.Errorf("zip 解压后文件超过 %d MB 限制", maxKnowledgeZipUncompressedBytes/1024/1024)
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
		written, err := writeKnowledgeZipFile(target, source, maxKnowledgeZipUncompressedBytes-extractedBytes)
		if err != nil {
			source.Close()
			return err
		}
		source.Close()
		extractedBytes += written
		extractedFiles++
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

func writeKnowledgeZipFile(target string, source io.Reader, maxBytes int64) (int64, error) {
	if maxBytes <= 0 {
		return 0, fmt.Errorf("zip 解压后文件超过 %d MB 限制", maxKnowledgeZipUncompressedBytes/1024/1024)
	}
	out, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return 0, fmt.Errorf("创建 zip 文件失败: %w", err)
	}
	defer out.Close()
	written, err := io.Copy(out, io.LimitReader(source, maxBytes+1))
	if err != nil {
		return written, fmt.Errorf("写入 zip 文件失败: %w", err)
	}
	if written > maxBytes {
		_ = os.Remove(target)
		return written, fmt.Errorf("zip 解压后文件超过 %d MB 限制", maxKnowledgeZipUncompressedBytes/1024/1024)
	}
	return written, nil
}

func (s Service) completeKnowledgeUploadParts(
	ctx context.Context,
	base *agentmodel.KnowledgeBase,
	root string,
	parentPath string,
	parentRel string,
	name string,
	uploadID string,
	totalParts int,
) (KnowledgeFileData, string, error) {
	uploadDir := knowledgeUploadDir(root, uploadID)
	defer os.RemoveAll(uploadDir)

	if err := os.MkdirAll(parentPath, 0o755); err != nil {
		return KnowledgeFileData{}, "", fmt.Errorf("创建父目录失败: %w", err)
	}
	target := filepath.Join(parentPath, name)
	if err := ensureInsideKnowledgeRoot(root, target); err != nil {
		return KnowledgeFileData{}, "", err
	}
	if _, err := os.Stat(target); err == nil {
		return KnowledgeFileData{}, "", fmt.Errorf("同名文件或文件夹已存在")
	}

	merged, err := mergeKnowledgeUploadParts(root, uploadID, totalParts)
	if err != nil {
		return KnowledgeFileData{}, "", err
	}

	newID := knowledgeFileID(joinDirPath(parentRel, name))
	if isKnowledgeUploadZip(name, merged) {
		raw, err := os.ReadFile(merged)
		if err != nil {
			return KnowledgeFileData{}, "", fmt.Errorf("读取上传 zip 失败: %w", err)
		}
		if err := extractKnowledgeZip(root, parentPath, raw); err != nil {
			return KnowledgeFileData{}, "", err
		}
		newID = knowledgeFileID(parentRel)
	} else if err := moveKnowledgeUploadFile(merged, target); err != nil {
		return KnowledgeFileData{}, "", err
	}
	if err := os.RemoveAll(uploadDir); err != nil {
		return KnowledgeFileData{}, "", fmt.Errorf("清理上传临时文件失败: %w", err)
	}

	if err := syncKnowledgeFilesystem(ctx, base, root); err != nil {
		return KnowledgeFileData{}, "", err
	}
	data, err := s.KnowledgeFileData(ctx, base.ID)
	if err != nil {
		return KnowledgeFileData{}, "", err
	}
	return data, newID, nil
}

func normalizeKnowledgeUploadID(uploadID string) (string, error) {
	uploadID = strings.TrimSpace(uploadID)
	if uploadID == "" {
		return "", fmt.Errorf("上传会话不能为空")
	}
	for _, r := range uploadID {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			continue
		}
		return "", fmt.Errorf("上传会话无效")
	}
	return uploadID, nil
}

func knowledgeUploadDir(root string, uploadID string) string {
	return filepath.Join(root, knowledgeUploadTempDirName, uploadID)
}

func knowledgeUploadPartPath(root string, uploadID string, partNumber int) string {
	return filepath.Join(knowledgeUploadDir(root, uploadID), fmt.Sprintf("part-%06d.tmp", partNumber))
}

func knowledgeUploadMergedPath(root string, uploadID string) string {
	return filepath.Join(knowledgeUploadDir(root, uploadID), "merged.bin")
}

func saveKnowledgeUploadPart(root string, uploadID string, partNumber int, source io.Reader) error {
	partPath := knowledgeUploadPartPath(root, uploadID, partNumber)
	if err := os.MkdirAll(filepath.Dir(partPath), 0o755); err != nil {
		return fmt.Errorf("创建上传分片目录失败: %w", err)
	}
	out, err := os.Create(partPath)
	if err != nil {
		return fmt.Errorf("写入上传分片失败: %w", err)
	}
	written, err := io.Copy(out, io.LimitReader(source, maxKnowledgeUploadPartBytes+1))
	if err != nil {
		out.Close()
		return fmt.Errorf("保存上传分片失败: %w", err)
	}
	if written > maxKnowledgeUploadPartBytes {
		out.Close()
		_ = os.Remove(partPath)
		return fmt.Errorf("上传分片超过 %d MB 限制", maxKnowledgeUploadPartBytes/1024/1024)
	}
	if err := out.Close(); err != nil {
		return fmt.Errorf("保存上传分片失败: %w", err)
	}
	return nil
}

func knowledgeUploadStoredBytes(root string, uploadID string) (int64, error) {
	uploadDir := knowledgeUploadDir(root, uploadID)
	entries, err := os.ReadDir(uploadDir)
	if err != nil {
		return 0, fmt.Errorf("读取上传分片目录失败: %w", err)
	}
	var total int64
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasPrefix(entry.Name(), "part-") {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			return 0, fmt.Errorf("读取上传分片失败: %w", err)
		}
		total += info.Size()
		if total > maxKnowledgeUploadTotalBytes {
			return total, nil
		}
	}
	return total, nil
}

func knowledgeUploadPartsComplete(root string, uploadID string, totalParts int) bool {
	for partNumber := 1; partNumber <= totalParts; partNumber++ {
		if _, err := os.Stat(knowledgeUploadPartPath(root, uploadID, partNumber)); err != nil {
			return false
		}
	}
	return true
}

func mergeKnowledgeUploadParts(root string, uploadID string, totalParts int) (string, error) {
	mergedPath := knowledgeUploadMergedPath(root, uploadID)
	if err := os.MkdirAll(filepath.Dir(mergedPath), 0o755); err != nil {
		return "", fmt.Errorf("创建上传合并目录失败: %w", err)
	}
	out, err := os.Create(mergedPath)
	if err != nil {
		return "", fmt.Errorf("创建上传合并文件失败: %w", err)
	}
	defer out.Close()
	var mergedBytes int64
	for partNumber := 1; partNumber <= totalParts; partNumber++ {
		partPath := knowledgeUploadPartPath(root, uploadID, partNumber)
		in, err := os.Open(partPath)
		if err != nil {
			return "", fmt.Errorf("上传分片缺失")
		}
		remaining := maxKnowledgeUploadTotalBytes - mergedBytes
		if remaining <= 0 {
			_ = in.Close()
			return "", fmt.Errorf("上传文件超过 %d MB 限制", maxKnowledgeUploadTotalBytes/1024/1024)
		}
		copied, copyErr := io.Copy(out, io.LimitReader(in, remaining+1))
		_ = in.Close()
		if copyErr != nil {
			return "", fmt.Errorf("合并上传分片失败: %w", copyErr)
		}
		mergedBytes += copied
		if mergedBytes > maxKnowledgeUploadTotalBytes {
			return "", fmt.Errorf("上传文件超过 %d MB 限制", maxKnowledgeUploadTotalBytes/1024/1024)
		}
	}
	return mergedPath, nil
}

func isKnowledgeUploadZip(name string, path string) bool {
	if !strings.EqualFold(filepath.Ext(name), ".zip") {
		return false
	}
	info, err := os.Stat(path)
	return err == nil && info.Size() > 0
}

func moveKnowledgeUploadFile(source string, target string) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return fmt.Errorf("创建目标目录失败: %w", err)
	}
	if err := os.Rename(source, target); err == nil {
		return nil
	}
	return copyKnowledgeFile(source, target)
}

func detectMimeType(path string, content []byte) string {
	ext := strings.ToLower(filepath.Ext(path))
	if mimeType := mime.TypeByExtension(ext); mimeType != "" {
		return strings.Split(mimeType, ";")[0]
	}
	if len(content) > 0 {
		return http.DetectContentType(content)
	}
	file, err := os.Open(path)
	if err != nil {
		return "application/octet-stream"
	}
	defer file.Close()
	buffer := make([]byte, 512)
	read, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return "application/octet-stream"
	}
	if read > 0 {
		return http.DetectContentType(buffer[:read])
	}
	return "application/octet-stream"
}

func isEditableKnowledgeFile(path string, mimeType string, size int64) bool {
	if size > maxEditableFileBytes {
		return false
	}
	if editableKnowledgeFileExts[strings.ToLower(strings.TrimPrefix(filepath.Ext(path), "."))] {
		return true
	}
	normalizedMimeType := strings.ToLower(strings.TrimSpace(mimeType))
	if strings.HasPrefix(normalizedMimeType, "text/") {
		return true
	}
	if normalizedMimeType != "" && normalizedMimeType != "application/octet-stream" {
		return false
	}
	return isUTF8TextFile(path, size)
}

func isUTF8TextFile(path string, size int64) bool {
	if size > maxEditableFileBytes {
		return false
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return false
	}
	return isUTF8TextContent(raw)
}

func isUTF8TextContent(raw []byte) bool {
	if len(raw) == 0 {
		return true
	}
	if bytes.Contains(raw, []byte{0}) {
		return false
	}
	if !utf8.Valid(raw) {
		return false
	}
	var controlCount int
	for _, value := range raw {
		if value < 0x20 && value != '\n' && value != '\r' && value != '\t' && value != '\f' {
			controlCount += 1
		}
	}
	return controlCount == 0
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

func docSourceType(doc *agentmodel.KnowledgeDoc) string {
	if doc == nil {
		return "upload"
	}
	sourceType := strings.TrimSpace(doc.SourceType)
	if sourceType == "" {
		return "upload"
	}
	return sourceType
}
