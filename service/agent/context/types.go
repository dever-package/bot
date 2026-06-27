package agentcontext

import (
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	agenttool "github.com/dever-package/bot/service/agent/tool"
	memoryservice "github.com/dever-package/bot/service/memory"
)

type Scene string

const (
	SceneAgent          Scene = "agent"
	SceneInternal       Scene = "internal"
	SceneCanvas         Scene = "canvas"
	SceneTeamRole       Scene = "team_role"
	SceneAdminAssistant Scene = "admin_assistant"
)

type Request struct {
	Scene              Scene
	Method             string
	Host               string
	Path               string
	Headers            map[string]string
	Agent              agentmodel.Agent
	Power              energonmodel.Power
	Input              map[string]any
	History            []any
	Options            map[string]any
	SourceTargetID     uint64
	AssistantSessionID uint64
	Memory             MemoryRequest
}

type MemoryRequest struct {
	Enabled         bool
	OwnerType       string
	OwnerID         uint64
	AgentKey        string
	ContextKey      string
	SessionID       uint64
	IncludeGlobal   bool
	IncludeAgent    bool
	IncludeUnscoped bool
}

type RuntimeOptions struct {
	MaxSteps            int
	AsyncMaxConcurrency int
	Tool                agenttool.Options
}

type Bundle struct {
	RuntimePrompt  string
	RuntimeOptions RuntimeOptions
	ModelHistory   []any
	PromptInput    agentprompt.RuntimeInput
	PromptSections []agentprompt.SectionStat
	SkillCatalog   agentskill.Catalog
	SkillSelection agentskill.SelectionResult
	KnowledgeBases []agentknowledge.AgentKnowledgeBaseRuntime
	Memories       []memoryservice.RuntimeMemory
	ContextNotes   []ContextNote
	Baseline       Baseline
	Diagnostics    Diagnostics
}

type ContextNote struct {
	Role string
	Text string
}

type Baseline struct {
	Found        bool
	ResultID     string
	Title        string
	Format       string
	Summary      string
	TaskCount    int
	Suggestions  int
	Placeholders []string
	Output       map[string]any
}

type Plan struct {
	IncludeHistory        bool
	IncludeBaseline       bool
	IncludeKnowledgeTools bool
	IncludeMemory         bool
	SkillKeys             []string
	SkillsPlanned         bool
	Intent                string
	ResourceNeed          string
	EditScope             string
	ResponseModeHint      string
	TaskFrame             TaskFrame
	Reason                string
	Source                string
}

type TaskFrame struct {
	Goal            string
	Deliverable     string
	Constraints     []string
	Inputs          []string
	Missing         []string
	NonGoals        []string
	OutputMode      string
	SuccessCriteria []string
}

type Budget struct {
	HistoryRows             int
	HistoryValueRunes       int
	HistoryTotalRunes       int
	BaselineSummaryRunes    int
	MemoryQueryRunes        int
	PlannerInputRunes       int
	SkillSelectorInputRunes int
}

type Diagnostics struct {
	Scene              string                    `json:"scene"`
	Plan               Plan                      `json:"plan"`
	Budget             Budget                    `json:"budget"`
	RuntimeOptions     map[string]any            `json:"runtime_options"`
	SkillPackID        uint64                    `json:"skill_pack_id"`
	SkillAvailable     []string                  `json:"skill_available"`
	SkillSelected      []string                  `json:"skill_selected"`
	SkillLoaded        []string                  `json:"skill_loaded"`
	SkillWarning       string                    `json:"skill_warning,omitempty"`
	KnowledgeBaseCount int                       `json:"knowledge_base_count"`
	KnowledgeMode      string                    `json:"knowledge_mode"`
	ResourceMode       string                    `json:"resource_mode"`
	MemoryCount        int                       `json:"memory_count"`
	MemoryMode         string                    `json:"memory_mode"`
	HistoryCount       int                       `json:"history_count"`
	HistoryMode        string                    `json:"history_mode"`
	ContextNoteCount   int                       `json:"context_note_count"`
	BaselineFound      bool                      `json:"baseline_found"`
	BaselineMode       string                    `json:"baseline_mode"`
	RuntimePromptRunes int                       `json:"runtime_prompt_runes"`
	RuntimePromptBytes int                       `json:"runtime_prompt_bytes"`
	PromptSections     []agentprompt.SectionStat `json:"prompt_sections,omitempty"`
	ModelHistoryCount  int                       `json:"model_history_count"`
	Warnings           []string                  `json:"warnings,omitempty"`
	CreatedAt          time.Time                 `json:"created_at"`
}

func DefaultBudget() Budget {
	return defaultBudget()
}
