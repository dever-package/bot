package skill

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode"
	"unicode/utf8"
)

const (
	maxManifestScripts          = 64
	maxManifestConfig           = 128
	maxManifestMCP              = 32
	maxManifestStringItems      = 128
	maxManifestStringRunes      = 256
	maxManifestIdentityRunes    = 128
	maxManifestCommandRunes     = 512
	maxManifestMCPTools         = 128
	maxManifestMCPArgs          = 64
	maxManifestMCPArgumentRunes = 512
)

// ManifestIssues is the single semantic validation entry for installed and
// custom skills. Filesystem checks remain in ValidateManifestFiles.
func ManifestIssues(manifest map[string]any) []string {
	if manifest == nil {
		return []string{"manifest 必须是 JSON 对象"}
	}
	issues := make([]string, 0)
	if _, exists := manifest["builtin_methods"]; exists {
		issues = append(issues, "manifest 不能声明平台内置方法")
	}
	for _, key := range []string{"value", "value_encrypted", "secret", "api_key", "cookie", "token"} {
		if _, exists := manifest[key]; exists {
			issues = append(issues, "manifest 顶层不能包含真实配置值: "+key)
		}
	}
	capabilities, explicit, capabilityIssues := validateManifestCapabilities(manifest["capabilities"])
	issues = append(issues, capabilityIssues...)
	issues = append(issues, validateManifestStringList(manifest, "triggers")...)
	issues = append(issues, validateManifestStringList(manifest, "targets")...)
	issues = append(issues, validateManifestStringList(manifest, "domains")...)

	scriptCount, scriptIssues := validateManifestScripts(manifest["scripts"])
	issues = append(issues, scriptIssues...)
	mcpCount, mcpIssues := validateManifestMCP(manifest["mcp"])
	issues = append(issues, mcpIssues...)
	issues = append(issues, validateManifestConfig(manifest["config"])...)
	if !explicit && (scriptCount > 0 || mcpCount > 0) {
		issues = append(issues, "声明 scripts 或 mcp 时必须显式声明 capabilities")
	}

	if explicit && scriptCount > 0 && !capabilities.Has(CapabilityScript) {
		issues = append(issues, "manifest.scripts 已声明，但 capabilities 缺少 script")
	}
	if explicit && mcpCount > 0 && !capabilities.Has(CapabilityMCP) {
		issues = append(issues, "manifest.mcp 已声明，但 capabilities 缺少 mcp")
	}
	if explicit && capabilities.Has(CapabilityScript) && scriptCount == 0 {
		issues = append(issues, "capabilities 包含 script，但 manifest.scripts 为空")
	}
	if explicit && capabilities.Has(CapabilityMCP) && mcpCount == 0 {
		issues = append(issues, "capabilities 包含 mcp，但 manifest.mcp 为空")
	}
	return issues
}

func ValidateManifest(manifest map[string]any) error {
	issues := ManifestIssues(manifest)
	if len(issues) == 0 {
		return nil
	}
	return fmt.Errorf("manifest 检查失败: %s", strings.Join(issues, "；"))
}

func ValidateManifestText(raw string) error {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if err := ValidateStoredBytes("manifest", raw, MaxManifestBytes); err != nil {
		return err
	}
	manifest := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &manifest); err != nil {
		return fmt.Errorf("manifest 必须是 JSON 对象")
	}
	return ValidateManifest(manifest)
}

func ValidateManifestFiles(root string, manifest map[string]any) error {
	if err := ValidateManifest(manifest); err != nil {
		return err
	}
	for _, relative := range ManifestExecutablePaths(JSONText(manifest)) {
		path, normalized, err := ResolveRelativePath(root, relative)
		if err != nil {
			return fmt.Errorf("manifest 引用路径不安全 %s: %w", relative, err)
		}
		info, err := os.Stat(path)
		if err != nil {
			return fmt.Errorf("manifest 引用文件不存在 %s: %w", normalized, err)
		}
		if !info.Mode().IsRegular() {
			return fmt.Errorf("manifest 引用路径不是普通文件: %s", normalized)
		}
	}
	return nil
}

func validateManifestCapabilities(raw any) (CapabilitySet, bool, []string) {
	if raw == nil {
		return CapabilitySet{}, false, nil
	}
	values, valid := manifestTextValues(raw, true)
	if !valid {
		return CapabilitySet{}, true, []string{"manifest.capabilities 必须是字符串数组"}
	}
	set := CapabilitySet{}
	issues := make([]string, 0)
	for _, value := range values {
		name := strings.ToLower(strings.TrimSpace(value))
		if !knownCapability(name) {
			issues = append(issues, "manifest.capabilities 包含未知能力: "+value)
			continue
		}
		if set.Has(name) {
			issues = append(issues, "manifest.capabilities 包含重复能力: "+name)
			continue
		}
		set[name] = struct{}{}
	}
	return set, true, issues
}

func validateManifestStringList(manifest map[string]any, key string) []string {
	raw, exists := manifest[key]
	if !exists {
		return nil
	}
	values, valid := manifestTextValues(raw, false)
	if !valid {
		return []string{fmt.Sprintf("manifest.%s 必须是字符串数组", key)}
	}
	if len(values) > maxManifestStringItems {
		return []string{fmt.Sprintf("manifest.%s 数量超过限制: %d > %d", key, len(values), maxManifestStringItems)}
	}
	seen := map[string]struct{}{}
	issues := make([]string, 0)
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			issues = append(issues, fmt.Sprintf("manifest.%s 不能包含空值", key))
			continue
		}
		if utf8.RuneCountInString(value) > maxManifestStringRunes {
			issues = append(issues, fmt.Sprintf("manifest.%s 包含超过 %d 个字符的值", key, maxManifestStringRunes))
			continue
		}
		if _, exists := seen[value]; exists {
			issues = append(issues, fmt.Sprintf("manifest.%s 包含重复值: %s", key, value))
			continue
		}
		seen[value] = struct{}{}
	}
	return issues
}

func validateManifestScripts(raw any) (int, []string) {
	if raw == nil {
		return 0, nil
	}
	items, ok := raw.([]any)
	if !ok {
		return 0, []string{"manifest.scripts 必须是数组"}
	}
	if len(items) > maxManifestScripts {
		return 0, []string{fmt.Sprintf("manifest.scripts 数量超过限制: %d > %d", len(items), maxManifestScripts)}
	}
	seenIdentity := map[string]struct{}{}
	seenPath := map[string]struct{}{}
	issues := make([]string, 0)
	validCount := 0
	for index, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d] 必须是对象", index))
			continue
		}
		path := cleanManifestRelativePath(FirstText(FirstPresent(mapped, "path", "file")))
		if utf8.RuneCountInString(path) > maxManifestCommandRunes {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].path 不能超过 %d 个字符", index, maxManifestCommandRunes))
			continue
		}
		if err := validateManifestScriptPath(path); err != nil {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].path 无效: %s", index, err.Error()))
			continue
		}
		target := FirstText(FirstPresent(mapped, "target_key", "targetKey", "target"))
		key := FirstText(FirstPresent(mapped, "key", "name"))
		if key == "" {
			key = path
		}
		if utf8.RuneCountInString(key) > maxManifestIdentityRunes {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].key 不能超过 %d 个字符", index, maxManifestIdentityRunes))
			continue
		}
		if utf8.RuneCountInString(target) > maxManifestIdentityRunes {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].target_key 不能超过 %d 个字符", index, maxManifestIdentityRunes))
			continue
		}
		identity := target + "\x00" + key
		if _, exists := seenIdentity[identity]; exists {
			issues = append(issues, fmt.Sprintf("manifest.scripts 包含重复入口: %s", key))
			continue
		}
		pathIdentity := target + "\x00" + path
		if _, exists := seenPath[pathIdentity]; exists {
			issues = append(issues, fmt.Sprintf("manifest.scripts 包含重复路径: %s", path))
			continue
		}
		seenIdentity[identity] = struct{}{}
		seenPath[pathIdentity] = struct{}{}
		validCount++
	}
	return validCount, issues
}

func validateManifestConfig(raw any) []string {
	if raw == nil {
		return nil
	}
	items, ok := raw.([]any)
	if !ok {
		return []string{"manifest.config 必须是数组"}
	}
	if len(items) > maxManifestConfig {
		return []string{fmt.Sprintf("manifest.config 数量超过限制: %d > %d", len(items), maxManifestConfig)}
	}
	seen := map[string]struct{}{}
	issues := make([]string, 0)
	for index, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			issues = append(issues, fmt.Sprintf("manifest.config[%d] 必须是对象", index))
			continue
		}
		key := FirstText(mapped["key"])
		if !IsValidConfigEnvName(key) {
			issues = append(issues, fmt.Sprintf("manifest.config[%d].key 不是有效环境变量名", index))
			continue
		}
		target := FirstText(FirstPresent(mapped, "target_key", "targetKey", "target"))
		if utf8.RuneCountInString(target) > maxManifestIdentityRunes {
			issues = append(issues, fmt.Sprintf("manifest.config[%d].target_key 不能超过 %d 个字符", index, maxManifestIdentityRunes))
			continue
		}
		name := FirstText(mapped["name"])
		if utf8.RuneCountInString(name) > MaxNameRunes {
			issues = append(issues, fmt.Sprintf("manifest.config[%d].name 不能超过 %d 个字符", index, MaxNameRunes))
			continue
		}
		identity := manifestConfigIdentity(target, key)
		if _, exists := seen[identity]; exists {
			issues = append(issues, fmt.Sprintf("manifest.config 包含重复配置: %s", key))
			continue
		}
		seen[identity] = struct{}{}
		if rawType, exists := mapped["type"]; exists {
			configType := strings.ToLower(strings.TrimSpace(FirstText(rawType)))
			if configType != "" && configType != "text" && configType != "secret" {
				issues = append(issues, fmt.Sprintf("manifest.config[%d].type 只允许 text 或 secret", index))
			}
		}
		for _, valueKey := range []string{"value", "value_encrypted", "secret_value"} {
			if _, exists := mapped[valueKey]; exists {
				issues = append(issues, fmt.Sprintf("manifest.config[%d] 不能包含真实配置值: %s", index, valueKey))
			}
		}
	}
	return issues
}

func validateManifestMCP(raw any) (int, []string) {
	if raw == nil {
		return 0, nil
	}
	items := manifestMCPItems(raw)
	if items == nil {
		return 0, []string{"manifest.mcp 必须是对象或对象数组"}
	}
	if len(items) > maxManifestMCP {
		return 0, []string{fmt.Sprintf("manifest.mcp 数量超过限制: %d > %d", len(items), maxManifestMCP)}
	}
	seen := map[string]struct{}{}
	issues := make([]string, 0)
	validCount := 0
	for index, item := range items {
		key := FirstText(FirstPresent(item, "key", "name"))
		command := FirstText(FirstPresent(item, "command", "cmd"))
		tools, toolsValid := manifestTextValues(item["tools"], false)
		if key == "" {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].key 不能为空", index))
		} else if utf8.RuneCountInString(key) > maxManifestIdentityRunes {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].key 不能超过 %d 个字符", index, maxManifestIdentityRunes))
		}
		if command == "" {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].command 不能为空", index))
		} else if utf8.RuneCountInString(command) > maxManifestCommandRunes {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].command 不能超过 %d 个字符", index, maxManifestCommandRunes))
		} else if err := validateManifestMCPCommand(command); err != nil {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].command 无效: %s", index, err.Error()))
		}
		if !toolsValid || len(tools) == 0 {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].tools 必须是非空字符串数组", index))
		} else if len(tools) > maxManifestMCPTools {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].tools 数量不能超过 %d", index, maxManifestMCPTools))
		} else if firstEmptyText(tools) {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].tools 不能包含空值", index))
		} else if manifestTextTooLong(tools, maxManifestIdentityRunes) {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].tools 单项不能超过 %d 个字符", index, maxManifestIdentityRunes))
		} else if duplicate := firstDuplicateText(tools); duplicate != "" {
			issues = append(issues, fmt.Sprintf("manifest.mcp[%d].tools 包含重复工具: %s", index, duplicate))
		}
		if _, exists := seen[key]; key != "" && exists {
			issues = append(issues, "manifest.mcp 包含重复服务: "+key)
		} else if key != "" {
			seen[key] = struct{}{}
		}
		if args, valid := manifestTextValues(item["args"], false); item["args"] != nil {
			switch {
			case !valid:
				issues = append(issues, fmt.Sprintf("manifest.mcp[%d].args 必须是字符串数组", index))
			case len(args) > maxManifestMCPArgs:
				issues = append(issues, fmt.Sprintf("manifest.mcp[%d].args 数量不能超过 %d", index, maxManifestMCPArgs))
			case manifestTextTooLong(args, maxManifestMCPArgumentRunes):
				issues = append(issues, fmt.Sprintf("manifest.mcp[%d].args 单项不能超过 %d 个字符", index, maxManifestMCPArgumentRunes))
			}
		}
		if key != "" && command != "" && toolsValid && len(tools) > 0 {
			validCount++
		}
	}
	return validCount, issues
}

func firstEmptyText(values []string) bool {
	for _, value := range values {
		if strings.TrimSpace(value) == "" {
			return true
		}
	}
	return false
}

func manifestTextTooLong(values []string, limit int) bool {
	for _, value := range values {
		if utf8.RuneCountInString(strings.TrimSpace(value)) > limit {
			return true
		}
	}
	return false
}

func manifestMCPItems(raw any) []map[string]any {
	switch value := raw.(type) {
	case map[string]any:
		return []map[string]any{value}
	case []any:
		items := make([]map[string]any, 0, len(value))
		for _, item := range value {
			mapped, ok := item.(map[string]any)
			if !ok {
				return nil
			}
			items = append(items, mapped)
		}
		return items
	default:
		return nil
	}
}

func manifestTextValues(raw any, allowCSV bool) ([]string, bool) {
	values := make([]string, 0)
	appendValue := func(value any) bool {
		text, ok := value.(string)
		if !ok {
			return false
		}
		values = append(values, strings.TrimSpace(text))
		return true
	}
	switch value := raw.(type) {
	case []any:
		for _, item := range value {
			if !appendValue(item) {
				return nil, false
			}
		}
	case []string:
		for _, item := range value {
			values = append(values, strings.TrimSpace(item))
		}
	case string:
		if !allowCSV {
			return nil, false
		}
		for _, item := range strings.Split(value, ",") {
			values = append(values, strings.TrimSpace(item))
		}
	default:
		return nil, false
	}
	return values, true
}

func knownCapability(capability string) bool {
	for _, allowed := range capabilityOrder {
		if capability == allowed {
			return true
		}
	}
	return false
}

func firstDuplicateText(values []string) string {
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			return value
		}
		seen[value] = struct{}{}
	}
	return ""
}

func cleanManifestRelativePath(path string) string {
	path, err := NormalizeRelativePath(path)
	if err != nil {
		return ""
	}
	return path
}

func validateManifestScriptPath(path string) error {
	normalized, err := NormalizeRelativePath(path)
	if err != nil {
		return fmt.Errorf("脚本必须位于 scripts/ 目录")
	}
	if !strings.HasPrefix(normalized, "scripts/") || strings.Contains(normalized, "/.") {
		return fmt.Errorf("脚本必须位于 scripts/ 目录")
	}
	if !supportedManifestScriptExtension(normalized) {
		return fmt.Errorf("脚本扩展名不支持")
	}
	return nil
}

func validateManifestMCPCommand(command string) error {
	command = strings.TrimSpace(command)
	if strings.Contains(command, "/") || strings.HasPrefix(command, ".") {
		return validateManifestScriptPath(command)
	}
	if command == "" || strings.HasPrefix(command, "-") || strings.IndexFunc(command, func(char rune) bool {
		return unicode.IsSpace(char) || unicode.IsControl(char)
	}) >= 0 {
		return fmt.Errorf("外部命令必须是不带参数的可执行文件名")
	}
	return nil
}

func supportedManifestScriptExtension(path string) bool {
	switch strings.ToLower(filepath.Ext(strings.TrimSpace(path))) {
	case ".py", ".js", ".mjs", ".sh", ".bash":
		return true
	default:
		return false
	}
}
