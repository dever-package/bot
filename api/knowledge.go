package api

import (
	"encoding/base64"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/shemic/dever/server"

	knowledgeservice "my/package/bot/service/agent/knowledge"
	frontstream "my/package/front/service/stream"
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
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	fileType := textFromBody(body, "type")
	if fileType == "" {
		fileType = fallbackType
	}
	data, err := knowledgeRunner.CreateKnowledgeFileNode(
		c.Context(),
		knowledgeservice.KnowledgeCreateInput{
			BaseID:        uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
			ParentID:      textFromBody(body, "parent", "parent_id", "dir_id"),
			Name:          textFromBody(body, "name", "title", "file_name", "dir_name"),
			Type:          fileType,
			ContentBase64: knowledgeContentBase64FromBody(body),
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
			BaseID:  uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
			ID:      textFromBody(body, "id", "doc_id"),
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
			BaseID: uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
			ID:     textFromBody(body, "id", "doc_id", "dir_id"),
			Name:   textFromBody(body, "name", "title", "file_name", "dir_name"),
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
		uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
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
	if strings.EqualFold(textFromBody(body, "operation", "action"), "copy") {
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
		BaseID: uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
		IDs:    stringSliceFromBodyKeys(body, "ids", "id", "doc_id", "dir_id"),
		Target: textFromBody(body, "target", "target_id", "parent", "parent_id"),
	}
}

func (Knowledge) GetDownloadFile(c *server.Context) error {
	filePath, filename, err := knowledgeRunner.ResolveKnowledgeFileNode(c.Context(), inputBaseID(c), c.Input("id"))
	if err != nil {
		return c.Error(err, http.StatusNotFound)
	}
	raw, ok := c.Raw.(*fiber.Ctx)
	if !ok {
		return c.Error("当前环境不支持文件下载")
	}
	return raw.Download(filePath, filename)
}

func (Knowledge) PostIndexFile(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeRunner.StartKnowledgeFileIndex(
		c.Context(),
		uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
		textFromBody(body, "id"),
	)
	return knowledgeJSON(c, map[string]any{"index_status": "running"}, err)
}

func (Knowledge) PostIndexDirectory(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeservice.StartDirectoryIndex(
		c.Context(),
		uint64ValueFromBody(body, "knowledge_base_id", "base_id"),
		uint64ValueFromBody(body, "dir_id", "id"),
	)
	return knowledgeJSON(c, map[string]any{"index_status": "running"}, err)
}

func (Knowledge) PostIndexDocument(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeservice.StartDocumentIndex(c.Context(), uint64ValueFromBody(body, "doc_id", "id"))
	return knowledgeJSON(c, map[string]any{"index_status": "running"}, err)
}

func (Knowledge) PostIndexBase(c *server.Context) error {
	body, err := bindKnowledgeBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = knowledgeservice.StartBaseIndex(c.Context(), uint64ValueFromBody(body, "knowledge_base_id", "base_id", "id"))
	return knowledgeJSON(c, map[string]any{"index_status": "running"}, err)
}

func bindKnowledgeBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func inputBaseID(c *server.Context) uint64 {
	baseID := uint64(frontstream.InputInt64(c.Input("knowledge_base_id"), 0))
	if baseID == 0 {
		baseID = uint64(frontstream.InputInt64(c.Input("base_id"), 0))
	}
	return baseID
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

func stringSliceFromBodyKeys(body map[string]any, keys ...string) []string {
	for _, key := range keys {
		if values := stringSliceFromBody(body, key); len(values) > 0 {
			return values
		}
	}
	return nil
}

func knowledgeContentBase64FromBody(body map[string]any) string {
	if encoded := textFromBody(body, "content_base64", "contentBase64"); encoded != "" {
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
