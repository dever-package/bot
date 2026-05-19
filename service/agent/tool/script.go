package tool

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"my/package/bot/service/agent/tool/sandbox"
)

func executeRunSkillScript(ctx context.Context, req Request) (map[string]any, error) {
	entry, err := resolveSkill(req.Loaded, req.Action.Skill)
	if err != nil {
		return nil, err
	}
	script := inputText(firstPresent(req.Action.Input, "script", "path", "file"))
	if script == "" {
		return nil, fmt.Errorf("执行技能脚本需要提供 script")
	}
	args, err := normalizeArgs(firstPresent(req.Action.Input, "args", "arguments"))
	if err != nil {
		return nil, err
	}
	scriptPath, relative, err := safeSkillPath(entry, script)
	if err != nil {
		return nil, err
	}
	if !strings.HasPrefix(relative, "scripts/") {
		return nil, fmt.Errorf("只允许执行技能 scripts/ 目录下的脚本")
	}
	if blockedSkillRelative(relative) {
		return nil, fmt.Errorf("不允许执行隐藏或依赖目录内的技能脚本")
	}
	info, err := os.Stat(scriptPath)
	if err != nil {
		return nil, err
	}
	if info.IsDir() {
		return nil, fmt.Errorf("不能执行目录: %s", relative)
	}

	workDir, _, err := safeSkillPath(entry, ".")
	if err != nil {
		return nil, err
	}
	timeout := scriptRequestTimeout(firstPresent(req.Action.Input, "timeout_seconds", "timeoutSeconds"))
	scriptResult, err := sandbox.Run(ctx, req.Options.ScriptSandbox, sandbox.Request{
		SkillRoot:      workDir,
		TempRoot:       req.TempRoot,
		ScriptRelative: relative,
		Args:           args,
		Timeout:        timeout,
	})
	if err != nil {
		return nil, err
	}

	text := firstScriptText(scriptResult.Stdout, scriptResult.Stderr, scriptResult.Error)
	result := map[string]any{
		"runner":      scriptResult.Runner,
		"script":      relative,
		"exit_code":   scriptResult.ExitCode,
		"duration_ms": scriptResult.DurationMS,
		"stdout":      scriptResult.Stdout,
		"stderr":      scriptResult.Stderr,
		"truncated":   scriptResult.Truncated,
		"text":        text,
	}
	if scriptResult.Error != "" {
		result["error"] = scriptResult.Error
	}
	return result, nil
}

func scriptRequestTimeout(value any) time.Duration {
	timeoutSec := inputInt(value, 0)
	if timeoutSec <= 0 {
		return 0
	}
	return time.Duration(timeoutSec) * time.Second
}

func firstScriptText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}
