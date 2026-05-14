package agent

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
)

const skillCatalogPath = "data/skills/main/SKILLS.md"

type skillCatalog struct {
	Path    string
	Content string
	Warning string
}

type instructionSnippet struct {
	Title   string
	Content string
}

func loadSkillCatalog() skillCatalog {
	raw, err := os.ReadFile(skillCatalogPath)
	if err != nil {
		return skillCatalog{
			Path:    skillCatalogPath,
			Warning: "未读取到本地技能目录，已继续执行: " + err.Error(),
		}
	}
	content := strings.TrimSpace(string(raw))
	for _, path := range skillPaths(content) {
		skillContent, err := os.ReadFile(path)
		if err != nil {
			content += "\n\n---\nSkill 文件读取失败: " + path + "\n" + err.Error()
			continue
		}
		content += "\n\n---\nSkill 文件: " + path + "\n" + strings.TrimSpace(string(skillContent))
	}
	return skillCatalog{
		Path:    skillCatalogPath,
		Content: content,
	}
}

func buildAgentContext(
	publicSettings []agentmodel.Setting,
	agentSettings []agentmodel.AgentSetting,
	knowledge []agentmodel.AgentKnowledge,
	catalog skillCatalog,
	powers []energonmodel.Power,
	history []any,
) string {
	sections := make([]string, 0, 8)
	if text := instructionSection("通用规则", publicSettingSnippets(publicSettings)); text != "" {
		sections = append(sections, text)
	}
	if text := instructionSection("智能体设定", agentSettingSnippets(agentSettings)); text != "" {
		sections = append(sections, text)
	}
	if text := instructionSection("智能体资料", knowledgeSnippets(knowledge)); text != "" {
		sections = append(sections, text)
	}
	if text := powerCatalogInstruction(powers); text != "" {
		sections = append(sections, text)
	}
	if strings.TrimSpace(catalog.Content) != "" {
		sections = append(sections, "本地技能目录:\n"+catalog.Content)
	}
	if text := historyInstruction(history); text != "" {
		sections = append(sections, text)
	}
	return strings.Join(sections, "\n\n")
}

func publicSettingSnippets(settings []agentmodel.Setting) []instructionSnippet {
	items := make([]instructionSnippet, 0, len(settings))
	for _, setting := range settings {
		content := strings.TrimSpace(setting.Content)
		if content == "" {
			continue
		}
		title := strings.TrimSpace(setting.Name)
		if title == "" {
			title = fmt.Sprintf("通用规则 #%d", setting.ID)
		}
		items = append(items, instructionSnippet{Title: title, Content: content})
	}
	return items
}

func agentSettingSnippets(settings []agentmodel.AgentSetting) []instructionSnippet {
	items := make([]instructionSnippet, 0, len(settings))
	for _, setting := range settings {
		content := strings.TrimSpace(setting.Content)
		if content == "" {
			continue
		}
		settingType := strings.TrimSpace(setting.Type)
		if settingType == "" {
			settingType = "other"
		}
		status := ""
		if setting.Status != 1 {
			status = "，状态: 停用"
		}
		items = append(items, instructionSnippet{
			Title:   fmt.Sprintf("智能体设定（ID: %d，类型: %s%s）", setting.ID, settingType, status),
			Content: content,
		})
	}
	return items
}

func knowledgeSnippets(rows []agentmodel.AgentKnowledge) []instructionSnippet {
	items := make([]instructionSnippet, 0, len(rows))
	for _, row := range rows {
		content := strings.TrimSpace(row.Content)
		if content == "" {
			continue
		}
		title := strings.TrimSpace(row.Name)
		if title == "" {
			title = fmt.Sprintf("资料 #%d", row.ID)
		}
		if row.Type != "" {
			title = fmt.Sprintf("%s（%s）", title, row.Type)
		}
		items = append(items, instructionSnippet{Title: title, Content: content})
	}
	return items
}

func instructionSection(title string, snippets []instructionSnippet) string {
	if len(snippets) == 0 {
		return ""
	}
	parts := make([]string, 0, len(snippets)+1)
	parts = append(parts, title+":")
	for _, snippet := range snippets {
		parts = append(parts, fmt.Sprintf("## %s\n%s", snippet.Title, snippet.Content))
	}
	return strings.Join(parts, "\n\n")
}

func skillPaths(content string) []string {
	baseDir := filepath.Dir(skillCatalogPath)
	paths := make([]string, 0)
	for _, line := range strings.Split(content, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "- path:") {
			continue
		}
		path := strings.TrimSpace(strings.TrimPrefix(line, "- path:"))
		if path == "" {
			continue
		}
		if !filepath.IsAbs(path) {
			path = filepath.Join(baseDir, path)
		}
		paths = append(paths, filepath.Clean(path))
	}
	return paths
}

func powerCatalogInstruction(powers []energonmodel.Power) string {
	rows := make([]string, 0, len(powers))
	for _, power := range powers {
		if strings.TrimSpace(power.Key) == "" {
			continue
		}
		rows = append(rows, fmt.Sprintf("- key: %s, name: %s, kind: %s", power.Key, power.Name, power.Kind))
	}
	if len(rows) == 0 {
		return ""
	}
	return "可调用能力:\n" + strings.Join(rows, "\n")
}

func historyInstruction(history []any) string {
	if len(history) == 0 {
		return ""
	}
	content, err := json.MarshalIndent(history, "", "  ")
	if err != nil || len(content) == 0 {
		return ""
	}
	return strings.Join([]string{
		"当前临时上下文:",
		"以下内容来自本次测试弹窗内的多轮对话、用户提交的交互表单、选项和上传结果。它只用于当前运行，不代表长期记忆。",
		string(content),
	}, "\n")
}
