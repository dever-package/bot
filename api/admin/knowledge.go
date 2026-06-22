package api

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	frontstream "github.com/dever-package/front/service/stream"
)

type Knowledge struct{}

var knowledgeRunner = knowledgeservice.NewService()

func (Knowledge) GetFileManagerData(c *server.Context) error {
	baseID := uint64(frontstream.InputInt64(c.Input("knowledge_base_id"), 0))
	if baseID == 0 {
		baseID = uint64(frontstream.InputInt64(c.Input("base_id"), 0))
	}
	data, err := knowledgeRunner.KnowledgeFileData(
		c.Context(),
		baseID,
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetFileContent(c *server.Context) error {
	return readKnowledgeFile(c)
}

func (Knowledge) GetDocDetail(c *server.Context) error {
	return readKnowledgeFile(c)
}

func (Knowledge) GetFileIndexDetail(c *server.Context) error {
	data, err := knowledgeRunner.ReadKnowledgeFileIndexDetail(
		c.Context(),
		inputBaseID(c),
		c.Input("id"),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetIndexOverview(c *server.Context) error {
	data, err := knowledgeRunner.ReadKnowledgeIndexOverview(c.Context(), inputBaseID(c))
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetGraph(c *server.Context) error {
	data, err := knowledgeRunner.ReadKnowledgeGraph(
		c.Context(),
		inputBaseID(c),
		int(frontstream.InputInt64(c.Input("limit"), 0)),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetNodeSearch(c *server.Context) error {
	limit := frontstream.InputInt64(c.Input("limit"), 0)
	data, err := knowledgeRunner.SearchKnowledgeNodes(
		c.Context(),
		inputBaseID(c),
		c.Input("query"),
		int(limit),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetTree(c *server.Context) error {
	data, err := knowledgeRunner.ListKnowledgeTree(
		c.Context(),
		inputBaseID(c),
		uint64(frontstream.InputInt64(c.Input("parent_id"), 0)),
		int(frontstream.InputInt64(c.Input("depth"), 2)),
		int(frontstream.InputInt64(c.Input("limit"), 120)),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetNodeOpen(c *server.Context) error {
	nodeID := uint64(frontstream.InputInt64(c.Input("node_id"), 0))
	if nodeID == 0 {
		nodeID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	data, err := knowledgeRunner.OpenKnowledgeNode(c.Context(), nodeID)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetNodeExpand(c *server.Context) error {
	nodeID := uint64(frontstream.InputInt64(c.Input("node_id"), 0))
	if nodeID == 0 {
		nodeID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	depth := int(frontstream.InputInt64(c.Input("depth"), 1))
	data, err := knowledgeRunner.ExpandKnowledgeNode(c.Context(), nodeID, depth)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetNodeRelated(c *server.Context) error {
	nodeID := uint64(frontstream.InputInt64(c.Input("node_id"), 0))
	if nodeID == 0 {
		nodeID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	limit := int(frontstream.InputInt64(c.Input("limit"), 10))
	data, err := knowledgeRunner.FindRelatedKnowledge(c.Context(), nodeID, inputEdgeTypes(c), limit)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) GetRetrieveDebug(c *server.Context) error {
	data, err := knowledgeRunner.DebugRetrieve(c.Context(), knowledgeservice.RetrieveDebugRequest{
		AgentID: uint64(frontstream.InputInt64(c.Input("agent_id"), 0)),
		BaseID:  inputBaseID(c),
		Query:   c.Input("query"),
		Limit:   int(frontstream.InputInt64(c.Input("limit"), 0)),
	})
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostCreateDir(c *server.Context) error {
	return createKnowledgeFile(c, "folder")
}

func (Knowledge) PostCreateDoc(c *server.Context) error {
	return createKnowledgeFile(c, "file")
}

func (Knowledge) PostRenameDir(c *server.Context) error {
	return renameKnowledgeFile(c)
}

func (Knowledge) PostDeleteDir(c *server.Context) error {
	return deleteKnowledgeFiles(c)
}

func (Knowledge) PostMoveDir(c *server.Context) error {
	return moveKnowledgeFiles(c)
}

func (Knowledge) PostSaveDoc(c *server.Context) error {
	return saveKnowledgeFile(c)
}

func readKnowledgeFile(c *server.Context) error {
	data, err := knowledgeRunner.ReadKnowledgeFileNode(
		c.Context(),
		inputBaseID(c),
		c.Input("id"),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostCreateFile(c *server.Context) error {
	return createKnowledgeFile(c, "")
}

func createKnowledgeFile(c *server.Context, fallbackType string) error {
	if isKnowledgeMultipartRequest(c) {
		return createKnowledgeFileFromMultipart(c)
	}
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	fileType := botapi.TextFromBody(body, "type")
	if fileType == "" {
		fileType = fallbackType
	}
	data, err := knowledgeRunner.CreateKnowledgeFileNode(
		c.Context(),
		knowledgeservice.KnowledgeCreateInput{
			BaseID:        botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
			ParentID:      botapi.TextFromBody(body, "parent", "parent_id", "dir_id"),
			Name:          botapi.TextFromBody(body, "name", "title", "file_name", "dir_name"),
			Type:          fileType,
			ContentBase64: knowledgeContentBase64FromBody(body),
		},
	)
	return knowledgeJSON(c, data, err)
}

func createKnowledgeFileFromMultipart(c *server.Context) error {
	raw, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		return c.Error("当前环境不支持文件上传")
	}
	fileHeader, err := raw.FormFile("file")
	if err != nil {
		return c.Error("上传文件不能为空")
	}
	file, err := fileHeader.Open()
	if err != nil {
		return c.Error("读取上传文件失败")
	}
	defer file.Close()

	partNumber, err := positiveIntFormValue(c, "part_number", 1)
	if err != nil {
		return c.Error(err)
	}
	totalParts, err := positiveIntFormValue(c, "total_parts", 1)
	if err != nil {
		return c.Error(err)
	}
	data, err := knowledgeRunner.SaveKnowledgeUploadPart(
		c.Context(),
		knowledgeservice.KnowledgeUploadPartInput{
			BaseID:     inputBaseID(c),
			ParentID:   c.Input("parent"),
			Name:       c.Input("name"),
			UploadID:   c.Input("upload_id"),
			PartNumber: partNumber,
			TotalParts: totalParts,
			Source:     file,
		},
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostSaveFile(c *server.Context) error {
	return saveKnowledgeFile(c)
}

func saveKnowledgeFile(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := knowledgeRunner.SaveKnowledgeFileNode(
		c.Context(),
		knowledgeservice.KnowledgeSaveInput{
			BaseID:  botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
			ID:      botapi.TextFromBody(body, "id", "doc_id"),
			Content: rawTextFromBody(body, "content"),
		},
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostRenameFile(c *server.Context) error {
	return renameKnowledgeFile(c)
}

func renameKnowledgeFile(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := knowledgeRunner.RenameKnowledgeFileNode(
		c.Context(),
		knowledgeservice.KnowledgeRenameInput{
			BaseID: botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
			ID:     botapi.TextFromBody(body, "id", "doc_id", "dir_id"),
			Name:   botapi.TextFromBody(body, "name", "title", "file_name", "dir_name"),
		},
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostDeleteFiles(c *server.Context) error {
	return deleteKnowledgeFiles(c)
}

func deleteKnowledgeFiles(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := knowledgeRunner.DeleteKnowledgeFileNodes(
		c.Context(),
		botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
		stringSliceFromBodyKeys(body, "ids", "id", "doc_id", "dir_id"),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostMoveFiles(c *server.Context) error {
	return moveKnowledgeFiles(c)
}

func moveKnowledgeFiles(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	input := knowledgeMoveInputFromBody(body)
	var data knowledgeservice.KnowledgeFileOperationResult
	if strings.EqualFold(botapi.TextFromBody(body, "operation", "action"), "copy") {
		data, err = knowledgeRunner.CopyKnowledgeFileNodes(c.Context(), input)
	} else {
		data, err = knowledgeRunner.MoveKnowledgeFileNodes(c.Context(), input)
	}
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostCopyFiles(c *server.Context) error {
	return copyKnowledgeFiles(c)
}

func copyKnowledgeFiles(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := knowledgeRunner.CopyKnowledgeFileNodes(c.Context(), knowledgeMoveInputFromBody(body))
	return knowledgeJSON(c, data, err)
}

func knowledgeMoveInputFromBody(body map[string]any) knowledgeservice.KnowledgeMoveInput {
	return knowledgeservice.KnowledgeMoveInput{
		BaseID: botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
		IDs:    stringSliceFromBodyKeys(body, "ids", "id", "doc_id", "dir_id"),
		Target: botapi.TextFromBody(body, "target", "target_id", "parent", "parent_id"),
	}
}

func (Knowledge) GetDownloadFile(c *server.Context) error {
	file, err := knowledgeRunner.ResolveKnowledgeFileContent(c.Context(), inputBaseID(c), c.Input("id"))
	if err != nil {
		return c.Error(err, http.StatusNotFound)
	}
	raw, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		return c.Error("当前环境不支持文件下载")
	}
	raw.Status(fiber.StatusOK)
	raw.Set("X-Content-Type-Options", "nosniff")
	if file.MimeType != "" {
		raw.Set(fiber.HeaderContentType, file.MimeType)
	}
	if strings.TrimSpace(c.Input("preview")) == "1" {
		if !isSafeKnowledgeInlinePreview(file.Name, file.MimeType) {
			return raw.Download(file.Path, file.Name)
		}
		raw.Set(fiber.HeaderContentDisposition, "inline")
		return raw.SendFile(file.Path)
	}
	return raw.Download(file.Path, file.Name)
}

func isSafeKnowledgeInlinePreview(name string, mimeType string) bool {
	mimeType = strings.ToLower(strings.TrimSpace(strings.Split(mimeType, ";")[0]))
	ext := strings.ToLower(filepath.Ext(strings.TrimSpace(name)))
	if ext == ".svg" || ext == ".html" || ext == ".htm" || ext == ".js" || ext == ".mjs" || ext == ".xml" {
		return false
	}
	if strings.HasPrefix(mimeType, "image/") {
		return mimeType != "image/svg+xml"
	}
	switch mimeType {
	case "application/pdf", "application/json", "text/plain", "text/markdown", "text/csv":
		return true
	default:
		return false
	}
}

func (Knowledge) PostFeedback(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeRunner.FeedbackNode(
		c.Context(),
		botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
		botapi.Uint64FromBody(body, "node_id", "id"),
		frontstream.InputText(body["feedback"]),
	)
	return knowledgeJSON(c, map[string]any{"success": true}, err)
}

func (Knowledge) GetRetrieveLogs(c *server.Context) error {
	data, err := knowledgeRunner.ListRetrieveLogs(
		c.Context(),
		inputBaseID(c),
		int(frontstream.InputInt64(c.Input("limit"), 50)),
	)
	return knowledgeJSON(c, data, err)
}

func (Knowledge) PostRefluxQA(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	docID, nodeID, err := knowledgeRunner.RefluxQA(
		c.Context(),
		botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
		uint64(frontstream.InputInt64(body["dir_id"], 0)),
		frontstream.InputText(body["query"]),
		frontstream.InputText(body["answer"]),
		uint64SliceFromBody(body, "source_node_ids"),
	)
	return knowledgeJSON(c, map[string]any{
		"doc_id":  docID,
		"node_id": nodeID,
	}, err)
}

func (Knowledge) PostIndexBase(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeservice.StartBaseIndex(c.Context(), botapi.Uint64FromBody(body, "knowledge_base_id", "base_id", "id"))
	return knowledgeJSON(c, map[string]any{"index_status": "running"}, err)
}

func (Knowledge) PostBatchReindex(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	docIDs := uint64SliceFromBody(body, "doc_ids")
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "ids")
	}
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "id")
	}
	err = knowledgeRunner.BatchReindex(
		c.Context(),
		botapi.Uint64FromBody(body, "knowledge_base_id", "base_id"),
		docIDs,
	)
	return knowledgeJSON(c, map[string]any{"success": err == nil}, err)
}

func (Knowledge) PostSetExpiration(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	docIDs := uint64SliceFromBody(body, "doc_ids")
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "ids")
	}
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "id")
	}
	if len(docIDs) == 0 {
		return c.Error("文档ID不能为空")
	}
	expiresAtStr := nullableTextFromBody(body, "expires_at")
	var expiresAt *time.Time
	if expiresAtStr != "" {
		t, err := time.Parse(time.RFC3339, expiresAtStr)
		if err != nil {
			t, err = time.Parse("2006-01-02 15:04:05", expiresAtStr)
			if err != nil {
				return c.Error("过期时间格式无效，请使用 RFC3339 或 YYYY-MM-DD HH:MM:SS")
			}
		}
		expiresAt = &t
	}
	if len(docIDs) == 1 {
		err = knowledgeRunner.SetDocExpiration(c.Context(), docIDs[0], expiresAt)
	} else {
		err = knowledgeRunner.BatchSetDocExpiration(c.Context(), docIDs, expiresAt)
	}
	return knowledgeJSON(c, map[string]any{"success": err == nil}, err)
}

func (Knowledge) PostReviewDoc(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	docIDs := uint64SliceFromBody(body, "doc_ids")
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "ids")
	}
	if len(docIDs) == 0 {
		docIDs = uint64SliceFromBody(body, "id")
	}
	if len(docIDs) == 0 {
		return c.Error("文档ID不能为空")
	}
	status := botapi.TextFromBody(body, "review_status", "status")
	if status == "" {
		return c.Error("审核状态不能为空")
	}
	reviewerID := uint64(frontstream.InputInt64(body["reviewer_id"], 0))
	if reviewerID == 0 {
		reviewerID = uint64(frontstream.InputInt64(body["user_id"], 0))
	}
	if len(docIDs) == 1 {
		err = knowledgeRunner.ReviewDoc(c.Context(), docIDs[0], status, reviewerID)
	} else {
		err = knowledgeRunner.BatchReviewDocs(c.Context(), docIDs, status, reviewerID)
	}
	return knowledgeJSON(c, map[string]any{"success": err == nil}, err)
}

func (Knowledge) GetExpiredDocs(c *server.Context) error {
	baseID := uint64(frontstream.InputInt64(c.Input("knowledge_base_id"), 0))
	if baseID == 0 {
		baseID = uint64(frontstream.InputInt64(c.Input("base_id"), 0))
	}
	docs, total, err := knowledgeRunner.ListExpiredDocs(
		c.Context(),
		baseID,
		int(frontstream.InputInt64(c.Input("page"), 1)),
		int(frontstream.InputInt64(c.Input("pageSize"), 20)),
	)
	return knowledgeJSON(c, map[string]any{
		"list":  docs,
		"total": total,
	}, err)
}

func bindKnowledgeBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func isKnowledgeMultipartRequest(c *server.Context) bool {
	raw, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		return false
	}
	return strings.Contains(strings.ToLower(raw.Get(fiber.HeaderContentType)), "multipart/form-data")
}

func positiveIntFormValue(c *server.Context, key string, fallback int) (int, error) {
	value := strings.TrimSpace(c.Input(key))
	if value == "" {
		return fallback, nil
	}
	number, err := strconv.Atoi(value)
	if err != nil || number <= 0 {
		return 0, errInvalidPositiveInt(key)
	}
	return number, nil
}

func errInvalidPositiveInt(key string) error {
	return fmt.Errorf("%s 无效", key)
}

func inputBaseID(c *server.Context) uint64 {
	baseID := uint64(frontstream.InputInt64(c.Input("knowledge_base_id"), 0))
	if baseID == 0 {
		baseID = uint64(frontstream.InputInt64(c.Input("base_id"), 0))
	}
	return baseID
}

func inputEdgeTypes(c *server.Context) []string {
	raw := strings.TrimSpace(c.Input("edge_types"))
	if raw == "" {
		raw = strings.TrimSpace(c.Input("edge_type"))
	}
	if raw == "" {
		return nil
	}
	parts := strings.Split(raw, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if value := strings.TrimSpace(part); value != "" {
			result = append(result, value)
		}
	}
	return result
}

func stringSliceFromBody(body map[string]any, key string) []string {
	raw, ok := body[key]
	if !ok {
		return nil
	}
	result := make([]string, 0)
	switch values := raw.(type) {
	case []any:
		for _, value := range values {
			if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
				result = append(result, text)
			}
		}
	case []string:
		for _, value := range values {
			if text := strings.TrimSpace(value); text != "" {
				result = append(result, text)
			}
		}
	default:
		if text := strings.TrimSpace(frontstream.InputText(raw)); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func uint64SliceFromBody(body map[string]any, key string) []uint64 {
	raw, ok := body[key]
	if !ok {
		return nil
	}
	switch values := raw.(type) {
	case []any:
		result := make([]uint64, 0, len(values))
		for _, value := range values {
			result = append(result, uint64(frontstream.InputInt64(value, 0)))
		}
		return result
	case []uint64:
		return values
	default:
		return nil
	}
}

func stringSliceFromBodyKeys(body map[string]any, keys ...string) []string {
	for _, key := range keys {
		if values := stringSliceFromBody(body, key); len(values) > 0 {
			return values
		}
	}
	return nil
}

func knowledgeContentBase64FromBody(body map[string]any) string {
	if encoded := botapi.TextFromBody(body, "content_base64", "contentBase64"); encoded != "" {
		return encoded
	}
	content := rawTextFromBody(body, "content")
	if content == "" {
		return ""
	}
	return base64.StdEncoding.EncodeToString([]byte(content))
}

func rawTextFromBody(body map[string]any, key string) string {
	value, ok := body[key]
	if !ok || value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return text
	}
	return frontstream.InputText(value)
}

func nullableTextFromBody(body map[string]any, keys ...string) string {
	text := strings.TrimSpace(botapi.TextFromBody(body, keys...))
	switch strings.ToLower(text) {
	case "", "null", "undefined":
		return ""
	default:
		return text
	}
}

func knowledgeJSON(c *server.Context, data any, err error) error {
	if err != nil {
		return c.JSONPayload(200, map[string]any{
			"status": 2,
			"code":   1,
			"data":   map[string]any{},
			"msg":    err.Error(),
		})
	}
	return c.JSONPayload(200, map[string]any{
		"status": 1,
		"code":   0,
		"data":   data,
		"msg":    "",
	})
}
