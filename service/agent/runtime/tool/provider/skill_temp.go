package provider

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func writeTempFileTool(loaded map[string]agentskill.Entry, runtime SkillRuntime) Tool {
	return Tool{
		Definition: Definition{
			Name:        "write_temp_file",
			Description: "写入本次运行的临时文本文件。",
			Parameters: objectParameters(map[string]any{
				"skill":   skillProperty(),
				"path":    map[string]any{"type": "string", "description": "文件相对路径"},
				"content": map[string]any{"type": "string", "description": "文件内容"},
			}, "path", "content"),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			content := argumentText(call.Arguments, "content")
			if len([]byte(content)) > maxTempFileBytes {
				return Result{}, fmt.Errorf("临时文件超过 %d 字节", maxTempFileBytes)
			}
			path, relative, err := safeRelativePath(runtime.TempRoot, argumentText(call.Arguments, "path"))
			if err != nil {
				return Result{}, err
			}
			if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
				return Result{}, err
			}
			if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
				return Result{}, err
			}
			return Result{Text: "已写入临时文件: " + relative, Content: map[string]any{
				"skill": entry.Key, "path": relative, "size": len([]byte(content)),
			}}, nil
		},
	}
}

func readTempFileTool(loaded map[string]agentskill.Entry, runtime SkillRuntime) Tool {
	return Tool{
		Definition: Definition{
			Name:        "read_temp_file",
			Description: "读取本次运行的临时文本文件。",
			Parameters: objectParameters(map[string]any{
				"skill": skillProperty(),
				"path":  map[string]any{"type": "string", "description": "文件相对路径"},
			}, "path"),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			path, relative, err := safeRelativePath(runtime.TempRoot, argumentText(call.Arguments, "path"))
			if err != nil {
				return Result{}, err
			}
			info, err := os.Stat(path)
			if err != nil {
				return Result{}, err
			}
			if info.IsDir() {
				return Result{}, fmt.Errorf("不能读取目录: %s", relative)
			}
			content, truncated, err := readLimitedFile(path, maxTempFileBytes)
			if err != nil {
				return Result{}, err
			}
			text := string(content)
			return Result{Text: text, Content: map[string]any{
				"skill": entry.Key, "path": relative, "size": info.Size(), "content": text, "truncated": truncated,
			}}, nil
		},
	}
}
