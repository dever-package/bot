package provider

import (
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxSkillFileBytes = 256 * 1024
	maxTempFileBytes  = 256 * 1024
	maxSkillFiles     = 200
	maxSkillListDepth = 4
	maxScriptArgs     = 32
	maxScriptArgRunes = 512
)

type skillContentBudget struct {
	mu        sync.Mutex
	remaining int
}

func newSkillContentBudget(limit int) *skillContentBudget {
	if limit <= 0 {
		limit = agentskill.DefaultLimits().LoadedContentMaxRunes
	}
	return &skillContentBudget{remaining: limit}
}

func (budget *skillContentBudget) paginate(content string, offset int, limit int) (agentskill.TextPage, int, error) {
	budget.mu.Lock()
	defer budget.mu.Unlock()
	if budget.remaining <= 0 {
		return agentskill.TextPage{}, 0, fmt.Errorf("本轮技能正文读取已达到累计上限")
	}
	if limit <= 0 || limit > budget.remaining {
		limit = budget.remaining
	}
	page, err := agentskill.PaginateText(content, offset, limit)
	if err != nil {
		return agentskill.TextPage{}, budget.remaining, err
	}
	budget.remaining -= len([]rune(page.Content))
	return page, budget.remaining, nil
}

func runtimeSkillTools(loaded map[string]agentskill.Entry, runtime SkillRuntime, limits agentskill.Limits, budget *skillContentBudget) []Tool {
	tools := make([]Tool, 0, 8)
	capabilities := loadedSkillCapabilities(loaded)
	if capabilities.Has(agentskill.CapabilityFiles) {
		tools = append(tools, listSkillFilesTool(loaded), readSkillFileTool(loaded, limits.SkillFileMaxBytes, budget))
	}
	if capabilities.Has(agentskill.CapabilityTemp) {
		tools = append(tools, writeTempFileTool(loaded, runtime), readTempFileTool(loaded, runtime))
	}
	if capabilities.Has(agentskill.CapabilityScript) {
		tools = append(tools, runSkillScriptTool(loaded, runtime))
	}
	if capabilities.Has(agentskill.CapabilityHTTP) {
		tools = append(tools, httpRequestTool(loaded), curlRequestTool(loaded))
	}
	if capabilities.Has(agentskill.CapabilityMCP) {
		tools = append(tools, mcpCallTool(loaded, runtime))
	}
	return skillActivityTools(tools)
}

func loadedSkillCapabilities(loaded map[string]agentskill.Entry) agentskill.CapabilitySet {
	result := agentskill.CapabilitySet{}
	for _, entry := range loaded {
		for capability := range agentskill.ManifestCapabilities(entry) {
			result[capability] = struct{}{}
		}
	}
	return result
}

func requireSkillCapability(entry agentskill.Entry, capability string) error {
	if agentskill.ManifestCapabilities(entry).Has(capability) {
		return nil
	}
	return fmt.Errorf("技能 %s 未声明 %s 能力", entry.Key, capability)
}

func skillTempRoot(runtime SkillRuntime, entry agentskill.Entry) (string, error) {
	key := agentskill.NormalizeKey(entry.Key)
	if key == "" {
		return "", fmt.Errorf("技能临时目录缺少有效标识")
	}
	root, _, err := agentskill.ResolveRelativePath(runtime.TempRoot, key)
	if err != nil {
		return "", err
	}
	if err := os.MkdirAll(root, 0o755); err != nil {
		return "", err
	}
	root, _, err = agentskill.ResolveRelativePath(runtime.TempRoot, key)
	return root, err
}

func skillSandboxConfig(entry agentskill.Entry, config sandbox.Config) (sandbox.Config, error) {
	return sandbox.IsolatedConfig(
		config,
		agentskill.ManifestCapabilities(entry).Has(agentskill.CapabilityNetwork),
	)
}

func skillActivityTools(tools []Tool) []Tool {
	for index := range tools {
		tools[index] = skillActivityTool(tools[index])
	}
	return tools
}

func skillActivityTool(tool Tool) Tool {
	tool.Definition.Kind = "skill"
	if skillToolHasExternalSideEffect(tool.Definition.Name) {
		tool.Definition.Execution.PreventDuplicateRecovery = true
	}
	if strings.TrimSpace(tool.Definition.Title) == "" {
		tool.Definition.Title = skillActivityTitle(tool.Definition.Name)
	}
	return tool
}

func skillToolHasExternalSideEffect(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "run_skill_script", "http_request", "curl_request", "mcp_call":
		return true
	default:
		return false
	}
}

func skillActivityTitle(name string) string {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "load_skill":
		return "技能加载"
	case "search_skills":
		return "技能查找"
	case "list_skill_files":
		return "技能目录读取"
	case "read_skill_file", "read_temp_file":
		return "技能文件读取"
	case "write_temp_file":
		return "技能文件准备"
	case "run_skill_script":
		return "技能执行"
	case "http_request", "curl_request":
		return "技能请求"
	case "mcp_call":
		return "技能工具调用"
	default:
		return "技能调用"
	}
}

func loadedSkill(loaded map[string]agentskill.Entry, arguments map[string]any) (agentskill.Entry, error) {
	rawIdentity := strings.TrimSpace(argumentText(arguments, "skill"))
	if rawIdentity == "" && len(loaded) == 1 {
		for _, entry := range loaded {
			return entry, nil
		}
	}
	if entry, exists := loaded[rawIdentity]; exists {
		return entry, nil
	}
	identity := agentskill.NormalizeKey(rawIdentity)
	if identity == "" {
		return agentskill.Entry{}, fmt.Errorf("工具调用需要指定已加载技能 skill")
	}
	matches := make([]agentskill.Entry, 0, 1)
	for _, entry := range loaded {
		if agentskill.NormalizeKey(entry.Key) == identity || agentskill.NormalizeKey(entry.Name) == identity {
			matches = append(matches, entry)
		}
	}
	if len(matches) == 1 {
		return matches[0], nil
	}
	if len(matches) > 1 {
		return agentskill.Entry{}, fmt.Errorf("技能名称存在歧义，请使用完整技能 key: %s", rawIdentity)
	}
	return agentskill.Entry{}, fmt.Errorf("技能未在本轮加载: %s", rawIdentity)
}

func skillProperty() map[string]any {
	return map[string]any{
		"type":        "string",
		"description": "已加载的技能；只有一个时可省略",
	}
}

func objectParameters(properties map[string]any, required ...string) map[string]any {
	result := map[string]any{
		"type":                 "object",
		"properties":           properties,
		"additionalProperties": false,
	}
	if len(required) > 0 {
		items := make([]any, 0, len(required))
		for _, key := range required {
			items = append(items, key)
		}
		result["required"] = items
	}
	return result
}

func argumentMap(arguments map[string]any, keys ...string) map[string]any {
	for _, key := range keys {
		if value, ok := arguments[key].(map[string]any); ok {
			return value
		}
	}
	return map[string]any{}
}

func argumentValue(arguments map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := arguments[key]; exists {
			return value
		}
	}
	return nil
}

func truncateRunes(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return strings.TrimSpace(string(runes[:limit])) + "..."
}
