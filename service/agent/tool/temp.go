package tool

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

func executeWriteTempFile(_ context.Context, req Request) (map[string]any, error) {
	pathText := inputText(firstPresent(req.Action.Input, "path", "file", "name"))
	if pathText == "" {
		return nil, fmt.Errorf("写入临时文件需要提供 path")
	}
	content := inputText(firstPresent(req.Action.Input, "content", "text", "body"))
	if len([]byte(content)) > maxTempFileBytes {
		return nil, fmt.Errorf("临时文件内容超过 %d 字节", maxTempFileBytes)
	}
	path, relative, err := safeTempPath(req.TempRoot, pathText)
	if err != nil {
		return nil, err
	}
	if err := ensureDirectory(filepath.Dir(path)); err != nil {
		return nil, err
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		return nil, err
	}
	return map[string]any{
		"path": relative,
		"size": len([]byte(content)),
		"text": "已写入临时文件: " + relative,
	}, nil
}

func executeReadTempFile(_ context.Context, req Request) (map[string]any, error) {
	pathText := inputText(firstPresent(req.Action.Input, "path", "file", "name"))
	if pathText == "" {
		return nil, fmt.Errorf("读取临时文件需要提供 path")
	}
	path, relative, err := safeTempPath(req.TempRoot, pathText)
	if err != nil {
		return nil, err
	}
	info, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	if info.IsDir() {
		return nil, fmt.Errorf("不能读取目录: %s", relative)
	}
	content, truncated, err := readLimited(path, maxTempFileBytes)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"path":      relative,
		"size":      info.Size(),
		"content":   string(content),
		"truncated": truncated,
		"text":      string(content),
	}, nil
}
