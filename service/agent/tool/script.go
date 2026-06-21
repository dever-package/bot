package tool

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	agentskill "github.com/dever-package/bot/service/agent/skill"
	"github.com/dever-package/bot/service/agent/tool/sandbox"
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
	target := inputText(firstPresent(req.Action.Input, "target", "target_key", "targetKey"))
	if err := ensureScriptAllowed(entry, relative, target); err != nil {
		return nil, err
	}
	if missing := agentskill.MissingRequiredConfig(ctx, entry.ID, entry.Manifest, target); len(missing) > 0 {
		return map[string]any{
			"kind":     "missing_config",
			"skill":    entry.Key,
			"target":   target,
			"required": missing,
			"message":  "该技能需要补充配置后才能运行。",
			"text":     "该技能需要补充配置后才能运行: " + strings.Join(missing, ", "),
		}, nil
	}
	info, err := os.Stat(scriptPath)
	if err != nil {
		return nil, err
	}
	if info.IsDir() {
		return nil, fmt.Errorf("不能执行目录: %s", relative)
	}

	configEnv, err := agentskill.LoadConfigEnv(ctx, entry.ID, target)
	if err != nil {
		return nil, err
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
		Env:            configEnv.Env,
		Timeout:        timeout,
	})
	if err != nil {
		return nil, err
	}
	scriptResult.Stdout = agentskill.RedactSecrets(scriptResult.Stdout, configEnv.Secrets)
	scriptResult.Stderr = agentskill.RedactSecrets(scriptResult.Stderr, configEnv.Secrets)
	scriptResult.Error = agentskill.RedactSecrets(scriptResult.Error, configEnv.Secrets)

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

func ensureScriptAllowed(entry agentskill.Entry, relative string, target string) error {
	scripts := agentskill.ManifestScripts(entry.Manifest)
	if len(scripts) == 0 {
		return nil
	}
	relative = strings.TrimPrefix(strings.TrimSpace(relative), "/")
	for _, script := range scripts {
		if strings.TrimSpace(script.TargetKey) != "" && script.TargetKey != strings.TrimSpace(target) {
			continue
		}
		if strings.TrimPrefix(strings.TrimSpace(script.Path), "/") == relative {
			return nil
		}
		if script.Key != "" && script.Key == relative {
			return nil
		}
	}
	return fmt.Errorf("脚本未在 manifest.scripts 中声明: %s", relative)
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
