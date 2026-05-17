package prompt

import (
	"strings"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	agentskill "my/package/bot/service/agent/skill"
)

type RuntimeInput struct {
	PublicSettings []agentmodel.Setting
	AgentSettings  []agentmodel.AgentSetting
	Knowledge      []agentmodel.AgentKnowledge
	Powers         []energonmodel.Power
	SkillCatalog   agentskill.Catalog
	History        []any
}

type EnergonBodyInput struct {
	Agent          agentmodel.Agent
	Power          energonmodel.Power
	RuntimePrompt  string
	Input          map[string]any
	History        []any
	Options        map[string]any
	SourceTargetID uint64
}

type snippet struct {
	Title   string
	Content string
}

func BuildRuntimePrompt(input RuntimeInput) string {
	sections := make([]string, 0, 8)
	sections = appendNonEmpty(sections, settingPrompt(input.PublicSettings, input.AgentSettings))
	sections = appendNonEmpty(sections, knowledgePrompt(input.Knowledge))
	sections = appendNonEmpty(sections, powerPrompt(input.Powers))
	sections = appendNonEmpty(sections, skillPrompt(input.SkillCatalog))
	sections = appendNonEmpty(sections, historyPrompt(input.History))
	return strings.Join(sections, "\n\n")
}

func BuildEnergonBody(input EnergonBodyInput) map[string]any {
	options := make(map[string]any, len(input.Options)+2)
	for key, item := range input.Options {
		options[key] = item
	}
	options["stream"] = true
	if input.Agent.Temperature >= 0 {
		options["temperature"] = input.Agent.Temperature
	}

	body := map[string]any{
		"power": input.Power.Key,
		"set": map[string]any{
			"id":   input.Agent.Key,
			"role": input.RuntimePrompt,
		},
		"input":   input.Input,
		"history": input.History,
		"options": options,
	}
	if input.SourceTargetID > 0 {
		body["source_target_id"] = input.SourceTargetID
	}
	return body
}

func appendNonEmpty(sections []string, section string) []string {
	if strings.TrimSpace(section) == "" {
		return sections
	}
	return append(sections, section)
}

func snippetSection(title string, snippets []snippet) string {
	if len(snippets) == 0 {
		return ""
	}
	parts := make([]string, 0, len(snippets)+1)
	parts = append(parts, title+":")
	for _, item := range snippets {
		parts = append(parts, "## "+item.Title+"\n"+item.Content)
	}
	return strings.Join(parts, "\n\n")
}
