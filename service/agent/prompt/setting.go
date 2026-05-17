package prompt

import (
	"fmt"
	"strings"

	agentmodel "my/package/bot/model/agent"
)

func settingPrompt(publicSettings []agentmodel.Setting, agentSettings []agentmodel.AgentSetting) string {
	sections := make([]string, 0, 2)
	sections = appendNonEmpty(sections, snippetSection("规则", publicSettingSnippets(publicSettings)))
	sections = appendNonEmpty(sections, snippetSection("智能体设定", agentSettingSnippets(agentSettings)))
	return strings.Join(sections, "\n\n")
}

func publicSettingSnippets(settings []agentmodel.Setting) []snippet {
	items := make([]snippet, 0, len(settings))
	for _, setting := range settings {
		content := strings.TrimSpace(setting.Content)
		if content == "" {
			continue
		}
		title := strings.TrimSpace(setting.Name)
		if title == "" {
			title = fmt.Sprintf("规则 #%d", setting.ID)
		}
		items = append(items, snippet{Title: title, Content: content})
	}
	return items
}

func agentSettingSnippets(settings []agentmodel.AgentSetting) []snippet {
	items := make([]snippet, 0, len(settings))
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
		items = append(items, snippet{
			Title:   fmt.Sprintf("智能体设定（ID: %d，类型: %s%s）", setting.ID, settingType, status),
			Content: content,
		})
	}
	return items
}
