package prompt

import (
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

type RuntimeInput struct {
	PublicSettings []agentmodel.Setting
	AgentSettings  []agentmodel.AgentSetting
	KnowledgeBases []KnowledgeBaseRuntime
	Memory         []MemorySnippet
	Powers         []energonmodel.Power
	SkillCatalog   agentskill.Catalog
	Tools          ToolRuntime
	Result         ResultRuntime
	History        []any
}

type ToolRuntime struct {
	RunSkillScriptEnabled bool
	ScriptSandboxDriver   string
	ScriptNetworkMode     string
}

type ResultRuntime struct {
	AsyncMaxConcurrency int
}

type KnowledgeBaseRuntime struct {
	ID     uint64
	Name   string
	Prompt string
}

type MemorySnippet struct {
	ID         uint64
	Kind       string
	Title      string
	Content    string
	Tags       string
	Importance int
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

type KnowledgeSnippet struct {
	BaseID   uint64  `json:"base_id"`
	BaseName string  `json:"base_name"`
	Prompt   string  `json:"prompt"`
	DirID    uint64  `json:"dir_id"`
	DirPath  string  `json:"dir_path"`
	DocID    uint64  `json:"doc_id"`
	NodeID   uint64  `json:"node_id"`
	Title    string  `json:"title"`
	Content  string  `json:"content"`
	Score    float64 `json:"score"`
	Source   string  `json:"source"`
	SortRank int     `json:"sort_rank"`
	HitCount int     `json:"-"`
	Weight   float64 `json:"-"`
}

func BuildRuntimePrompt(input RuntimeInput) string {
	sections := make([]string, 0, 8)
	sections = appendNonEmpty(sections, settingPrompt(input.PublicSettings, input.AgentSettings))
	sections = appendNonEmpty(sections, memoryPrompt(input.Memory))
	sections = appendNonEmpty(sections, knowledgeToolPrompt(input.KnowledgeBases))
	sections = appendNonEmpty(sections, powerPrompt(input.Powers))
	sections = appendNonEmpty(sections, skillPrompt(input.SkillCatalog, input.Tools))
	sections = appendNonEmpty(sections, resultPrompt(input.Result))
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
			"id":   strconv.FormatUint(input.Agent.ID, 10),
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
