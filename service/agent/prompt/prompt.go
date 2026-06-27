package prompt

import (
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

type RuntimeInput struct {
	Mode           string
	TaskFrame      TaskFrameRuntime
	PublicSettings []agentmodel.Setting
	AgentSettings  []agentmodel.AgentSetting
	KnowledgeBases []KnowledgeBaseRuntime
	Memory         []MemorySnippet
	Powers         []energonmodel.Power
	SkillCatalog   agentskill.Catalog
	Tools          ToolRuntime
	Result         ResultRuntime
	History        []any
	ContextNotes   []string
	BaselinePrompt string
}

type ToolRuntime struct {
	RunSkillScriptEnabled bool
	ScriptSandboxDriver   string
	ScriptNetworkMode     string
}

type ResultRuntime struct {
	AsyncMaxConcurrency int
}

type SectionStat struct {
	Key   string `json:"key"`
	Title string `json:"title"`
	Runes int    `json:"runes"`
	Bytes int    `json:"bytes"`
}

type TaskFrameRuntime struct {
	Goal            string
	Deliverable     string
	Constraints     []string
	Inputs          []string
	Missing         []string
	NonGoals        []string
	OutputMode      string
	SuccessCriteria []string
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
	prompt, _ := BuildRuntimePromptWithStats(input)
	return prompt
}

func BuildRuntimePromptWithStats(input RuntimeInput) (string, []SectionStat) {
	sections := runtimeSections(input)
	parts := make([]string, 0, len(sections))
	stats := make([]SectionStat, 0, len(sections))
	for _, section := range sections {
		content := strings.TrimSpace(section.Content)
		if content == "" {
			continue
		}
		parts = append(parts, content)
		stats = append(stats, SectionStat{
			Key:   section.Key,
			Title: section.Title,
			Runes: len([]rune(content)),
			Bytes: len(content),
		})
	}
	return strings.Join(parts, "\n\n"), stats
}

type promptSection struct {
	Key     string
	Title   string
	Content string
}

func runtimeSections(input RuntimeInput) []promptSection {
	mode := normalizeRuntimePromptMode(input.Mode)
	sections := make([]promptSection, 0, 10)

	sections = appendPromptSection(sections, "settings", "基础设置", settingPrompt(input.PublicSettings, input.AgentSettings))
	sections = appendPromptSection(sections, "chat_style", "普通对话风格", chatStylePrompt(mode))
	sections = appendPromptSection(sections, "knowledge_tools", "知识库工具", knowledgeToolPrompt(input.KnowledgeBases))
	if shouldIncludePowerPrompt(mode) {
		sections = appendPromptSection(sections, "powers", "内部能力", powerPrompt(input.Powers))
	}
	sections = appendPromptSection(sections, "skills", "技能正文", skillPrompt(input.SkillCatalog, input.Tools))
	if shouldIncludeResultPrompt(mode) {
		sections = appendPromptSection(sections, "result_protocol", "最终结果协议", resultPrompt(input.Result))
	}
	if shouldIncludeInteractionPrompt(mode) {
		sections = appendPromptSection(sections, "interaction_protocol", "用户补充信息协议", interactionPrompt())
	}

	sections = appendPromptSection(sections, "baseline", "上一版结果", input.BaselinePrompt)
	sections = appendPromptSection(sections, "memory", "长期记忆", memoryPrompt(input.Memory))
	sections = appendPromptSection(sections, "context_notes", "上下文摘要", contextNotesPrompt(input.ContextNotes))
	if len(input.ContextNotes) == 0 && input.BaselinePrompt == "" {
		sections = appendPromptSection(sections, "history", "历史摘要", historyPrompt(input.History))
	}
	sections = appendPromptSection(sections, "task_frame", "任务理解", taskFramePrompt(input.TaskFrame))
	return sections
}

func appendPromptSection(sections []promptSection, key string, title string, content string) []promptSection {
	if strings.TrimSpace(content) == "" {
		return sections
	}
	return append(sections, promptSection{Key: key, Title: title, Content: content})
}

func normalizeRuntimePromptMode(mode string) string {
	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "chat", "interaction", "final_result", "action":
		return strings.ToLower(strings.TrimSpace(mode))
	case "final", "result":
		return "final_result"
	default:
		return "auto"
	}
}

func shouldIncludePowerPrompt(mode string) bool {
	switch normalizeRuntimePromptMode(mode) {
	case "chat", "interaction":
		return false
	default:
		return true
	}
}

func shouldIncludeResultPrompt(mode string) bool {
	switch normalizeRuntimePromptMode(mode) {
	case "chat", "interaction":
		return false
	default:
		return true
	}
}

func shouldIncludeInteractionPrompt(mode string) bool {
	return normalizeRuntimePromptMode(mode) == "interaction"
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
