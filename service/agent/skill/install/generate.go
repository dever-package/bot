package install

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	agentskill "my/package/bot/service/agent/skill"
)

func writeGeneratedSkill(tmpDir string, installID uint64, sourceURL string, content string) (installedSkillSource, error) {
	name := generatedSkillName(content, installID)
	key := generatedSkillKey(sourceURL, name, installID)
	skillDir := filepath.Join(tmpDir, key)
	if err := os.MkdirAll(skillDir, 0o755); err != nil {
		return installedSkillSource{}, err
	}
	bodyContent := strings.TrimSpace(content)
	if sourceURL != "" {
		bodyContent = strings.TrimSpace(stripHTML(content))
	}
	if len([]rune(bodyContent)) > 12000 {
		bodyContent = string([]rune(bodyContent)[:12000])
	}
	body := generatedSkillContent(key, name, sourceURL, bodyContent)
	filePath := filepath.Join(skillDir, agentskill.EntryFile)
	if err := os.WriteFile(filePath, []byte(body), 0o644); err != nil {
		return installedSkillSource{}, err
	}
	return installedSkillSource{
		Directory: skillDir,
		FilePath:  filePath,
		SourceURL: sourceURL,
	}, nil
}

func generatedSkillName(content string, installID uint64) string {
	text := stripHTML(content)
	for _, line := range strings.Split(text, "\n") {
		line = strings.TrimSpace(strings.Trim(line, "#*- "))
		if line != "" {
			if len([]rune(line)) > 40 {
				line = string([]rune(line)[:40])
			}
			return line
		}
	}
	return fmt.Sprintf("技能 %d", installID)
}

func generatedSkillKey(sourceURL string, name string, installID uint64) string {
	if sourceURL != "" {
		parts := strings.Split(strings.Trim(strings.TrimSpace(sourceURL), "/"), "/")
		for index := len(parts) - 1; index >= 0; index-- {
			if key := agentskill.NormalizeKey(parts[index]); key != "" {
				return key
			}
		}
	}
	if key := agentskill.NormalizeKey(name); key != "" {
		return key
	}
	return fmt.Sprintf("skill-%d", installID)
}

func generatedSkillContent(key string, name string, sourceURL string, content string) string {
	description := "通过后台技能安装记录生成的技能。"
	trigger := strings.TrimSpace(name)
	if trigger == "" {
		trigger = key
	}
	sourceLine := ""
	if sourceURL != "" {
		sourceLine = "\nsource_url: " + sourceURL
	}
	return strings.Join([]string{
		"---",
		"key: " + key,
		"name: " + quoteSkillYAML(name),
		"description: " + quoteSkillYAML(description),
		"triggers:",
		"  - " + quoteSkillYAML(trigger),
		sourceLine,
		"---",
		"",
		"# " + name,
		"",
		"## 安装来源",
		"",
		strings.TrimSpace(content),
		"",
		"## 使用要求",
		"",
		"- 根据用户任务判断是否需要使用本技能。",
		"- 如果本技能内容不足以完成任务，先向用户收集必要信息。",
	}, "\n")
}

func quoteSkillYAML(value string) string {
	value = strings.ReplaceAll(value, `"`, `\"`)
	return `"` + value + `"`
}

func stripHTML(content string) string {
	text := regexp.MustCompile(`(?is)<script.*?</script>|<style.*?</style>`).ReplaceAllString(content, "\n")
	text = regexp.MustCompile(`(?is)<[^>]+>`).ReplaceAllString(text, "\n")
	text = strings.ReplaceAll(text, "&nbsp;", " ")
	text = strings.ReplaceAll(text, "&amp;", "&")
	text = strings.ReplaceAll(text, "&lt;", "<")
	text = strings.ReplaceAll(text, "&gt;", ">")
	return text
}
