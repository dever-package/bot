package draft

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxDraftTestOutputBytes = 512 * 1024
	minDraftTestOutputBytes = 4 * 1024
	maxDraftTestArgs        = 32
	maxDraftTestArgRunes    = 512
)

func (Service) Test(ctx context.Context, req Request) Result {
	if err := validateDraftTestArgs(req.Args); err != nil {
		return failResult(err.Error(), nil)
	}
	snapshot, issues, err := loadAndValidateExecutable(ctx, req.ID)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		result["repairable"] = true
		if err := saveValidationResult(ctx, snapshot, result); err != nil {
			return failResult(err.Error(), result)
		}
		return failResult("技能内容检查未通过，不能测试", result)
	}
	scripts, err := selectedDraftTestScripts(snapshot, req.Script, req.Target)
	if err != nil {
		return failResult(err.Error(), nil)
	}

	tempRoot, err := os.MkdirTemp("", "dever-skill-draft-test-*")
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer os.RemoveAll(tempRoot)
	skillRoot := filepath.Join(tempRoot, "skill")
	if err := writeDraftFiles(skillRoot, snapshot); err != nil {
		return failResult(err.Error(), nil)
	}
	baseSandboxConfig := runtimetool.SandboxConfig(runtimeconfig.Load(ctx))
	dependencies, err := agentskill.PrepareDependencies(ctx, baseSandboxConfig, skillRoot)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	entry := agentskill.Entry{
		SourceType:  "custom",
		Manifest:    agentskill.JSONText(snapshot.Manifest),
		InstallPath: skillRoot,
	}
	sandboxConfig, err := sandbox.IsolatedConfig(
		baseSandboxConfig,
		agentskill.ManifestCapabilities(entry).Has(agentskill.CapabilityNetwork),
	)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if err := agentskill.ValidateManifestFiles(skillRoot, snapshot.Manifest); err != nil {
		return failResult(err.Error(), nil)
	}
	if err := agentskill.ValidateTree(skillRoot); err != nil {
		return failResult("技能测试目录检查失败: "+err.Error(), nil)
	}
	scriptSandboxConfig := draftTestSandboxConfig(sandboxConfig, len(scripts))

	manifestText := agentskill.JSONText(snapshot.Manifest)
	configSkillID := draftConfigSkillID(ctx, snapshot)
	overrides := draftConfigOverrides(req.Config)
	tests := make([]any, 0, len(scripts))
	for _, script := range scripts {
		configTarget := script.TargetKey
		if configTarget == "" {
			configTarget = strings.TrimSpace(req.Target)
		}
		configEnv, err := agentskill.LoadConfigEnv(ctx, configSkillID, manifestText, configTarget)
		if err != nil {
			return failResult(err.Error(), nil)
		}
		configEnv, missing, err := agentskill.ApplyConfigOverrides(configEnv, manifestText, configTarget, overrides)
		if err != nil {
			return failResult(err.Error(), nil)
		}
		if len(missing) > 0 {
			payload := draftTestPayload(snapshot, tests, nil, dependencies, false)
			payload["missing_config"] = missing
			payload["target"] = configTarget
			if err := saveValidationResult(ctx, snapshot, payload); err != nil {
				return failResult(err.Error(), payload)
			}
			return failResult("技能测试缺少必要配置: "+strings.Join(missing, ", "), payload)
		}

		runResult, err := sandbox.Run(ctx, scriptSandboxConfig, sandbox.Request{
			SkillRoot: skillRoot, TempRoot: tempRoot, ScriptRelative: script.Path,
			Args: req.Args, Env: configEnv.Env, Timeout: req.Timeout,
		})
		if err != nil {
			test := map[string]any{
				"script": script.Path, "target": script.TargetKey, "config_target": configTarget,
				"exit_code": -1,
				"error":     agentskill.RedactSecrets(err.Error(), configEnv.Secrets),
			}
			tests = append(tests, test)
			payload := draftTestPayload(snapshot, tests, nil, dependencies, false)
			if saveErr := saveValidationResult(ctx, snapshot, payload); saveErr != nil {
				return failResult(saveErr.Error(), payload)
			}
			return failResult("技能脚本测试执行失败", payload)
		}
		runResult.Stdout = agentskill.RedactSecrets(runResult.Stdout, configEnv.Secrets)
		runResult.Stderr = agentskill.RedactSecrets(runResult.Stderr, configEnv.Secrets)
		runResult.Error = agentskill.RedactSecrets(runResult.Error, configEnv.Secrets)
		test := map[string]any{
			"script": script.Path, "target": script.TargetKey, "config_target": configTarget, "runner": runResult.Runner,
			"exit_code": runResult.ExitCode, "duration_ms": runResult.DurationMS,
			"stdout": runResult.Stdout, "stderr": runResult.Stderr,
			"error": runResult.Error, "truncated": runResult.Truncated,
		}
		tests = append(tests, test)
		if runResult.ExitCode != 0 || strings.TrimSpace(runResult.Error) != "" {
			payload := draftTestPayload(snapshot, tests, nil, dependencies, false)
			payload["repairable"] = true
			if err := saveValidationResult(ctx, snapshot, payload); err != nil {
				return failResult(err.Error(), payload)
			}
			return failResult("技能脚本测试未通过", payload)
		}
	}

	mcpTests, mcpErr := testDraftMCP(ctx, snapshot, skillRoot, tempRoot, sandboxConfig, req)
	if mcpErr != nil {
		payload := draftTestPayload(snapshot, tests, mcpTests, dependencies, false)
		if err := saveValidationResult(ctx, snapshot, payload); err != nil {
			return failResult(err.Error(), payload)
		}
		return failResult(mcpErr.Error(), payload)
	}
	passed := draftTestsCoverManifest(snapshot, tests) && draftMCPTestsCoverManifest(snapshot, mcpTests)
	payload := draftTestPayload(snapshot, tests, mcpTests, dependencies, passed)
	if err := saveValidationResult(ctx, snapshot, payload); err != nil {
		return failResult(err.Error(), payload)
	}
	if !passed {
		payload["repairable"] = true
		return failResult("尚未覆盖全部技能可执行入口", payload)
	}
	return okResult(fmt.Sprintf("技能测试通过（%d 个脚本，%d 个 MCP 服务）", len(tests), len(mcpTests)), payload)
}

func testDraftMCP(ctx context.Context, snapshot draftSnapshot, skillRoot string, tempRoot string, sandboxConfig sandbox.Config, req Request) ([]any, error) {
	manifestText := agentskill.JSONText(snapshot.Manifest)
	if agentskill.ManifestMCPCount(manifestText) == 0 {
		return []any{}, nil
	}
	configEnv, err := agentskill.LoadConfigEnv(ctx, draftConfigSkillID(ctx, snapshot), manifestText, strings.TrimSpace(req.Target))
	if err != nil {
		return nil, err
	}
	configEnv, missing, err := agentskill.ApplyConfigOverrides(configEnv, manifestText, strings.TrimSpace(req.Target), draftConfigOverrides(req.Config))
	if err != nil {
		return nil, err
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("技能 MCP 测试缺少必要配置: %s", strings.Join(missing, ", "))
	}
	entry := agentskill.Entry{
		Key: snapshot.Row.Key, SourceType: "custom", InstallPath: skillRoot, Manifest: manifestText,
	}
	results, err := runtimeprovider.SmokeTestMCPServers(ctx, runtimeprovider.SkillRuntime{
		TempRoot: tempRoot, Sandbox: sandboxConfig,
	}, entry, configEnv.Env)
	if err != nil {
		return results, fmt.Errorf("%s", agentskill.RedactSecrets(err.Error(), configEnv.Secrets))
	}
	return results, nil
}

func validateDraftTestArgs(args []string) error {
	if len(args) > maxDraftTestArgs {
		return fmt.Errorf("脚本参数超过 %d 个", maxDraftTestArgs)
	}
	for _, arg := range args {
		if len([]rune(arg)) > maxDraftTestArgRunes {
			return fmt.Errorf("脚本参数不能超过 %d 个字符", maxDraftTestArgRunes)
		}
	}
	return nil
}

func draftTestSandboxConfig(config sandbox.Config, scriptCount int) sandbox.Config {
	if scriptCount <= 0 {
		return config
	}
	perStream := maxDraftTestOutputBytes / (scriptCount * 2)
	if perStream < minDraftTestOutputBytes {
		perStream = minDraftTestOutputBytes
	}
	if config.OutputMaxBytes <= 0 || config.OutputMaxBytes > perStream {
		config.OutputMaxBytes = perStream
	}
	return config
}

func selectedDraftTestScripts(snapshot draftSnapshot, requested string, target string) ([]agentskill.ScriptSpec, error) {
	scripts := agentskill.ManifestScripts(agentskill.JSONText(snapshot.Manifest))
	requested = strings.TrimPrefix(strings.TrimSpace(requested), "/")
	target = strings.TrimSpace(target)
	if requested == "" {
		return scripts, nil
	}
	matches := make([]agentskill.ScriptSpec, 0, 1)
	for _, script := range scripts {
		if script.Key != requested && strings.TrimPrefix(script.Path, "/") != requested {
			continue
		}
		if target != "" && script.TargetKey != "" && script.TargetKey != target {
			continue
		}
		matches = append(matches, script)
	}
	if len(matches) == 0 {
		return nil, fmt.Errorf("脚本未在 manifest.scripts 中声明: %s", requested)
	}
	if len(matches) > 1 {
		return nil, fmt.Errorf("脚本入口存在多个目标，请指定 target: %s", requested)
	}
	return matches, nil
}

func draftConfigOverrides(values []TestConfigValue) []agentskill.ConfigOverride {
	result := make([]agentskill.ConfigOverride, 0, len(values))
	for _, value := range values {
		result = append(result, agentskill.ConfigOverride{
			Key: value.Key, TargetKey: value.TargetKey, Value: value.Value,
		})
	}
	return result
}

func draftTestPayload(snapshot draftSnapshot, tests []any, mcpTests []any, dependencies []any, passed bool) map[string]any {
	payload := map[string]any{
		"tests": tests, "mcp_tests": mcpTests, "dependencies": dependencies,
		"test_passed": passed, "test_hash": draftSnapshotHash(snapshot),
	}
	if len(tests) > 0 {
		payload["test"] = tests[len(tests)-1]
	}
	return payload
}

func draftTestsCoverManifest(snapshot draftSnapshot, tests []any) bool {
	required := agentskill.ManifestScripts(agentskill.JSONText(snapshot.Manifest))
	if len(required) == 0 {
		return len(tests) == 0
	}
	if len(tests) != len(required) {
		return false
	}
	passed := map[string]struct{}{}
	for _, item := range tests {
		test, ok := item.(map[string]any)
		if !ok || intFromAny(test["exit_code"]) != 0 || strings.TrimSpace(fmt.Sprint(test["error"])) != "" {
			return false
		}
		passed[draftTestIdentity(strings.TrimSpace(fmt.Sprint(test["target"])), strings.TrimSpace(fmt.Sprint(test["script"])))] = struct{}{}
	}
	for _, script := range required {
		if _, exists := passed[draftTestIdentity(script.TargetKey, script.Path)]; !exists {
			return false
		}
	}
	return true
}

func draftMCPTestsCoverManifest(snapshot draftSnapshot, tests []any) bool {
	required := agentskill.ManifestMCPCount(agentskill.JSONText(snapshot.Manifest))
	if required == 0 {
		return len(tests) == 0
	}
	return len(tests) == required
}

func draftTestIdentity(target string, script string) string {
	return strings.TrimSpace(target) + "\x00" + filepath.ToSlash(strings.TrimPrefix(strings.TrimSpace(script), "/"))
}
