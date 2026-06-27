package agentcontext

import (
	"time"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func newDiagnostics(req Request, options RuntimeOptions, plan Plan, catalog agentskill.Catalog, selection agentskill.SelectionResult, bundle Bundle) Diagnostics {
	warnings := make([]string, 0, 2)
	for _, warning := range []string{catalog.Warning, selection.Warning} {
		if warning != "" {
			warnings = append(warnings, warning)
		}
	}
	return Diagnostics{
		Scene:  string(req.Scene),
		Plan:   plan,
		Budget: DefaultBudget(),
		RuntimeOptions: map[string]any{
			"max_steps":             options.MaxSteps,
			"async_max_concurrency": options.AsyncMaxConcurrency,
			"script_sandbox":        options.Tool.ScriptSandbox.Driver,
			"script_network":        options.Tool.ScriptSandbox.NetworkMode,
			"script_timeout_ms":     options.Tool.ScriptSandbox.Timeout.Milliseconds(),
		},
		SkillPackID:        catalog.PackID,
		SkillAvailable:     catalog.AvailableKeys(),
		SkillSelected:      selection.Keys,
		SkillLoaded:        catalog.LoadedKeys(),
		SkillWarning:       firstNonEmpty(selection.Warning, catalog.Warning),
		KnowledgeBaseCount: len(bundle.KnowledgeBases),
		KnowledgeMode:      knowledgeMode(plan.IncludeKnowledgeTools),
		ResourceMode:       resourceMode(plan),
		MemoryCount:        len(bundle.Memories),
		MemoryMode:         memoryMode(req, plan, len(bundle.Memories)),
		HistoryCount:       len(req.History),
		HistoryMode:        includeMode(plan.IncludeHistory),
		ContextNoteCount:   len(bundle.ContextNotes),
		BaselineFound:      bundle.Baseline.Found,
		BaselineMode:       includeMode(plan.IncludeBaseline),
		RuntimePromptRunes: len([]rune(bundle.RuntimePrompt)),
		RuntimePromptBytes: len(bundle.RuntimePrompt),
		PromptSections:     bundle.PromptSections,
		ModelHistoryCount:  len(bundle.ModelHistory),
		Warnings:           warnings,
		CreatedAt:          time.Now(),
	}
}

func knowledgeMode(enabled bool) string {
	if enabled {
		return "agentic_tools"
	}
	return "skipped"
}

func resourceMode(plan Plan) string {
	if plan.ResourceNeed != "" {
		return plan.ResourceNeed
	}
	if plan.IncludeKnowledgeTools || plan.IncludeMemory || len(plan.SkillKeys) > 0 || plan.IncludeBaseline {
		return "mixed"
	}
	return "none"
}

func memoryMode(req Request, plan Plan, count int) string {
	if !req.Memory.Enabled {
		return "disabled"
	}
	if !memoryAllowedForScene(req.Scene) {
		return "scene_disallowed"
	}
	if !plan.IncludeMemory {
		return "planner_skipped"
	}
	if count == 0 {
		return "enabled_empty"
	}
	return "loaded"
}

func includeMode(enabled bool) string {
	if enabled {
		return "included"
	}
	return "skipped"
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
