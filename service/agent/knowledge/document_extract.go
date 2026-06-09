package knowledge

import (
	"archive/zip"
	"context"
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
)

const maxExtractedTextBytes = 2 * 1024 * 1024

func (s Service) prepareDocumentContent(ctx context.Context, doc *agentmodel.KnowledgeDoc) error {
	if doc == nil {
		return fmt.Errorf("知识文档不存在")
	}
	if normalizeIndexContent(doc.Content) != "" {
		return nil
	}
	content, err := extractStoredDocumentText(ctx, doc)
	if err != nil {
		return err
	}
	content = strings.TrimSpace(content)
	if content == "" {
		return fmt.Errorf("知识库文件未提取到可索引内容")
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"content":      content,
		"content_hash": contentHash(content),
	})
	doc.Content = content
	doc.ContentHash = contentHash(content)
	return nil
}

func extractStoredDocumentText(ctx context.Context, doc *agentmodel.KnowledgeDoc) (string, error) {
	if doc == nil {
		return "", fmt.Errorf("知识文档不存在")
	}
	if strings.TrimSpace(docStoragePath(ctx, doc)) == "" {
		return "", fmt.Errorf("知识库文件路径为空")
	}
	_, root, err := knowledgeStorageBase(ctx, doc.KnowledgeBaseID)
	if err != nil {
		return "", err
	}
	relPath := docStoragePath(ctx, doc)
	localPath, _, err := knowledgeIDPath(root, knowledgeFileID(relPath))
	if err != nil {
		return "", err
	}
	if _, err := os.Stat(localPath); err != nil {
		return "", fmt.Errorf("知识库文件不存在: %w", err)
	}
	return extractDocumentText(localPath, strings.TrimPrefix(filepath.Ext(localPath), "."))
}

func extractDocumentText(localPath string, ext string) (string, error) {
	normalizedExt := strings.ToLower(strings.TrimSpace(ext))
	if normalizedExt == "" {
		normalizedExt = strings.TrimPrefix(strings.ToLower(filepath.Ext(localPath)), ".")
	}
	switch normalizedExt {
	case "txt", "md", "markdown", "csv", "log":
		return readPlainTextFile(localPath)
	case "docx":
		return extractDocxText(localPath)
	case "pdf":
		return extractPDFText(localPath)
	case "doc":
		return "", fmt.Errorf("暂不支持解析 .doc 文件，请先转成 .docx 后上传")
	default:
		return "", fmt.Errorf("暂不支持解析 .%s 文件，请先转成 txt 文本后上传", normalizedExt)
	}
}

func readPlainTextFile(localPath string) (string, error) {
	file, err := os.Open(localPath)
	if err != nil {
		return "", fmt.Errorf("打开上传文件失败: %w", err)
	}
	defer file.Close()

	raw, err := io.ReadAll(io.LimitReader(file, maxExtractedTextBytes+1))
	if err != nil {
		return "", fmt.Errorf("读取上传文件失败: %w", err)
	}
	if len(raw) > maxExtractedTextBytes {
		return "", fmt.Errorf("上传文本超过最大可索引大小")
	}
	return strings.TrimSpace(string(raw)), nil
}

func extractDocxText(localPath string) (string, error) {
	reader, err := zip.OpenReader(localPath)
	if err != nil {
		return "", fmt.Errorf("打开 docx 文件失败: %w", err)
	}
	defer reader.Close()

	for _, file := range reader.File {
		if file.Name != "word/document.xml" {
			continue
		}
		handle, err := file.Open()
		if err != nil {
			return "", fmt.Errorf("读取 docx 正文失败: %w", err)
		}
		defer handle.Close()
		return extractDocxXMLText(handle)
	}
	return "", fmt.Errorf("docx 正文不存在")
}

func extractDocxXMLText(reader io.Reader) (string, error) {
	decoder := xml.NewDecoder(io.LimitReader(reader, maxExtractedTextBytes+1))
	parts := make([]string, 0, 256)
	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return "", fmt.Errorf("解析 docx 正文失败: %w", err)
		}
		switch current := token.(type) {
		case xml.StartElement:
			if current.Name.Local == "tab" {
				parts = append(parts, "\t")
			}
		case xml.CharData:
			text := strings.TrimSpace(string(current))
			if text != "" {
				parts = append(parts, text)
			}
		case xml.EndElement:
			if current.Name.Local == "p" {
				parts = append(parts, "\n")
			}
		}
	}
	return normalizeExtractedText(strings.Join(parts, " ")), nil
}

func extractPDFText(localPath string) (string, error) {
	if _, err := exec.LookPath("pdftotext"); err != nil {
		return "", fmt.Errorf("PDF 解析依赖 pdftotext 未安装，请先安装 poppler-utils 或上传 txt/docx 文件")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	output, err := exec.CommandContext(ctx, "pdftotext", "-layout", "-enc", "UTF-8", localPath, "-").Output()
	if ctx.Err() != nil {
		return "", fmt.Errorf("PDF 解析超时")
	}
	if err != nil {
		return "", fmt.Errorf("PDF 解析失败: %w", err)
	}
	if len(output) > maxExtractedTextBytes {
		return "", fmt.Errorf("PDF 提取文本超过最大可索引大小")
	}
	return normalizeExtractedText(string(output)), nil
}

func normalizeExtractedText(value string) string {
	lines := strings.Split(value, "\n")
	result := make([]string, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" {
			result = append(result, line)
		}
	}
	return strings.Join(result, "\n")
}
