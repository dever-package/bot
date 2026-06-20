package parse

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

const defaultMaxNodeLength = 1200

var textExts = map[string]bool{
	".conf": true, ".csv": true, ".env": true, ".ini": true, ".log": true,
	".sql": true, ".txt": true, ".xml": true, ".yaml": true, ".yml": true,
}

var markdownExts = map[string]bool{
	".md": true, ".markdown": true,
}

var codeExts = map[string]bool{
	".css": true, ".go": true, ".java": true, ".js": true, ".jsx": true,
	".php": true, ".py": true, ".sh": true, ".ts": true, ".tsx": true, ".vue": true,
}

func CanParseLocally(name string, mimeType string) bool {
	ext := strings.ToLower(filepath.Ext(strings.TrimSpace(name)))
	if markdownExts[ext] || textExts[ext] || codeExts[ext] {
		return true
	}
	switch ext {
	case ".json", ".htm", ".html":
		return true
	}
	mimeType = strings.ToLower(strings.TrimSpace(mimeType))
	return strings.HasPrefix(mimeType, "text/") ||
		strings.Contains(mimeType, "json") ||
		strings.Contains(mimeType, "xml")
}

func NeedsParserService(name string, mimeType string) bool {
	return SupportsMinerU(name, mimeType)
}

func ParseFile(req Request) (Result, error) {
	req.Name = strings.TrimSpace(req.Name)
	if req.MaxNodeLength <= 0 {
		req.MaxNodeLength = defaultMaxNodeLength
	}
	req.NodeOverlap = normalizeNodeOverlap(req.NodeOverlap, req.MaxNodeLength)
	content := req.Content
	if content == "" && strings.TrimSpace(req.Path) != "" {
		raw, err := os.ReadFile(req.Path)
		if err != nil {
			return Result{}, fmt.Errorf("读取文档失败: %w", err)
		}
		if utf8.Valid(raw) {
			content = string(raw)
		}
	}
	ext := strings.ToLower(filepath.Ext(req.Name))
	if ext == "" && strings.TrimSpace(req.Path) != "" {
		ext = strings.ToLower(filepath.Ext(req.Path))
	}
	if markdownExts[ext] {
		return parseMarkdown(req, content), nil
	}
	if ext == ".json" {
		return parseJSON(req, content), nil
	}
	if ext == ".htm" || ext == ".html" {
		return parseHTML(req, content), nil
	}
	if codeExts[ext] {
		return parseCode(req, content), nil
	}
	if textExts[ext] || strings.HasPrefix(strings.ToLower(req.MimeType), "text/") {
		return parseText(req, content), nil
	}
	return Result{}, fmt.Errorf("该文件类型暂不支持索引")
}
