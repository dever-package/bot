package provider

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const maxScriptErrorOutputRunes = 4000

type ScriptExecutionError struct {
	content map[string]any
}

func newScriptExecutionError(skill string, script string, result sandbox.Result, secrets []string) *ScriptExecutionError {
	content := map[string]any{
		"skill": skill, "runner": result.Runner, "script": script,
		"exit_code": result.ExitCode, "duration_ms": result.DurationMS,
	}
	truncated := result.Truncated
	for key, output := range map[string]string{"stdout": result.Stdout, "stderr": result.Stderr, "error": result.Error} {
		output = agentskill.RedactSecrets(output, secrets)
		truncated = truncated || len([]rune(output)) > maxScriptErrorOutputRunes
		content[key] = truncateRunes(output, maxScriptErrorOutputRunes)
	}
	content["truncated"] = truncated
	return &ScriptExecutionError{content: content}
}

func (scriptErr *ScriptExecutionError) Error() string {
	return fmt.Sprintf("技能脚本执行失败（退出码 %v）", scriptErr.content["exit_code"])
}

func (scriptErr *ScriptExecutionError) ModelResult() map[string]any {
	return scriptErr.content
}

func runSkillScriptTool(loaded map[string]agentskill.Entry, runtime SkillRuntime) Tool {
	return Tool{
		Definition: Definition{
			Name:        "run_skill_script",
			Description: "执行已加载技能声明的脚本。",
			Parameters: objectParameters(map[string]any{
				"skill":           skillProperty(),
				"script":          map[string]any{"type": "string", "description": "脚本标识或相对路径"},
				"args":            map[string]any{"type": "array", "items": map[string]any{"type": "string"}, "description": "脚本参数；传入临时文件时使用 write_temp_file 返回的 script_path，不能使用其相对 path 或宿主路径"},
				"target":          map[string]any{"type": "string", "description": "配置目标"},
				"timeout_seconds": map[string]any{"type": "integer", "minimum": 1, "maximum": 60},
			}, "script"),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			if err := requireSkillCapability(entry, agentskill.CapabilityScript); err != nil {
				return Result{}, err
			}
			script, err := resolveSkillScript(entry, argumentText(call.Arguments, "script"), argumentText(call.Arguments, "target"))
			if err != nil {
				return Result{}, err
			}
			args, err := scriptArguments(call.Arguments["args"])
			if err != nil {
				return Result{}, err
			}
			target := argumentText(call.Arguments, "target")
			if missing := agentskill.MissingRequiredConfig(ctx, entry.ID, entry.Manifest, target); len(missing) > 0 {
				text := "该技能需要补充配置后才能运行: " + strings.Join(missing, ", ")
				return BlockedResult(text, "missing_config", map[string]any{
					"kind": "missing_config", "skill": entry.Key, "target": target, "required": missing,
				}), nil
			}
			path, relative, err := safeSkillPath(entry, script.Path)
			if err != nil {
				return Result{}, err
			}
			info, err := os.Stat(path)
			if err != nil {
				return Result{}, err
			}
			if info.IsDir() {
				return Result{}, fmt.Errorf("不能执行目录: %s", relative)
			}
			configEnv, err := agentskill.LoadConfigEnv(ctx, entry.ID, entry.Manifest, target)
			if err != nil {
				return Result{}, err
			}
			timeout := time.Duration(ArgumentInt(call.Arguments, "timeout_seconds", 0)) * time.Second
			tempRoot, err := skillTempRoot(runtime, entry)
			if err != nil {
				return Result{}, err
			}
			sandboxConfig, err := skillSandboxConfig(entry, runtime.Sandbox)
			if err != nil {
				return Result{}, err
			}
			runResult, err := sandbox.Run(ctx, sandboxConfig, sandbox.Request{
				SkillRoot: entry.InstallPath, TempRoot: tempRoot, ScriptRelative: relative,
				Args: args, Env: configEnv.Env, Timeout: timeout,
			})
			if err != nil {
				return Result{}, fmt.Errorf("技能脚本执行失败: %s", agentskill.RedactSecrets(err.Error(), configEnv.Secrets))
			}
			if runResult.ExitCode != 0 || strings.TrimSpace(runResult.Error) != "" {
				return Result{}, newScriptExecutionError(entry.Key, relative, runResult, configEnv.Secrets)
			}
			runResult.Stdout = agentskill.RedactSecrets(runResult.Stdout, configEnv.Secrets)
			runResult.Stderr = agentskill.RedactSecrets(runResult.Stderr, configEnv.Secrets)
			runResult.Error = agentskill.RedactSecrets(runResult.Error, configEnv.Secrets)
			text := firstNonEmpty(runResult.Stdout, runResult.Stderr, runResult.Error)
			content := map[string]any{
				"skill": entry.Key, "runner": runResult.Runner, "script": relative,
				"exit_code": runResult.ExitCode, "duration_ms": runResult.DurationMS,
				"stdout": runResult.Stdout, "stderr": runResult.Stderr, "truncated": runResult.Truncated,
			}
			return Result{Text: text, Content: content}, nil
		},
	}
}

func resolveSkillScript(entry agentskill.Entry, identity string, target string) (agentskill.ScriptSpec, error) {
	scripts := agentskill.ManifestScripts(entry.Manifest)
	identity = strings.TrimPrefix(strings.TrimSpace(identity), "/")
	if identity == "" {
		return agentskill.ScriptSpec{}, fmt.Errorf("script 不能为空")
	}
	for _, script := range scripts {
		if script.TargetKey != "" && script.TargetKey != strings.TrimSpace(target) {
			continue
		}
		if script.Key == identity || strings.TrimPrefix(script.Path, "/") == identity {
			if !strings.HasPrefix(script.Path, "scripts/") || blockedSkillPath(script.Path) {
				return agentskill.ScriptSpec{}, fmt.Errorf("脚本路径不安全: %s", script.Path)
			}
			return script, nil
		}
	}
	return agentskill.ScriptSpec{}, fmt.Errorf("脚本未在 manifest.scripts 中声明: %s", identity)
}

func scriptArguments(value any) ([]string, error) {
	items := argumentStrings(value)
	if len(items) > maxScriptArgs {
		return nil, fmt.Errorf("脚本参数超过 %d 个", maxScriptArgs)
	}
	for _, item := range items {
		if len([]rune(item)) > maxScriptArgRunes {
			return nil, fmt.Errorf("脚本参数过长")
		}
	}
	return items, nil
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return "脚本执行完成"
}
