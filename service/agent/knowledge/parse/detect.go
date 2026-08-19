package parse

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

const defaultMaxNodeLength = 1200

const streamingParseThresholdBytes = 8 * 1024 * 1024

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
	return localParserForMIME(mimeType) != nil
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
		if info, err := os.Stat(req.Path); err == nil && info.Size() > streamingParseThresholdBytes {
			return parseStreamedTextFile(req)
		}
		raw, err := os.ReadFile(req.Path)
		if err != nil {
			return Result{}, fmt.Errorf("读取文档失败: %w", err)
		}
		if !utf8.Valid(raw) {
			return Result{}, fmt.Errorf("文档不是有效的 UTF-8 文本")
		}
		content = string(raw)
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
	if textExts[ext] {
		return parseText(req, content), nil
	}
	if parser := localParserForMIME(req.MimeType); parser != nil {
		return parser(req, content), nil
	}
	return Result{}, fmt.Errorf("该文件类型暂不支持索引")
}

func localParserForMIME(mimeType string) func(Request, string) Result {
	mimeType = strings.ToLower(strings.TrimSpace(strings.SplitN(mimeType, ";", 2)[0]))
	if strings.Contains(mimeType, "json") {
		return parseJSON
	}
	if strings.HasPrefix(mimeType, "text/") || strings.Contains(mimeType, "xml") {
		return parseText
	}
	return nil
}
