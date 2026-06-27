package agentcontext

import (
	"context"

	agentprompt "github.com/dever-package/bot/service/agent/prompt"
)

func (a Assembler) Build(ctx context.Context, req Request) Bundle {
	if req.Scene == "" {
		req.Scene = SceneAgent
	}
	collected := a.collect(ctx, req)
	options := resolveRuntimeOptions(collected.RuntimeConfig, req.Agent, req.Options)
	plan := a.buildPlan(ctx, req, collected)
	catalog, selection := a.selectAndLoadSkills(ctx, req, collected, plan)
	memories := a.collectMemories(ctx, req, collected.Baseline, plan, a.budget)
	promptInput := buildPromptInput(req, collected, plan, catalog, promptMemories(memories), options)
	runtimePrompt, promptSections := agentprompt.BuildRuntimePromptWithStats(promptInput)
	modelHistory := BuildModelHistory(req.History, a.budget)

	bundle := Bundle{
		RuntimePrompt:  runtimePrompt,
		RuntimeOptions: options,
		ModelHistory:   modelHistory,
		PromptInput:    promptInput,
		PromptSections: promptSections,
		SkillCatalog:   catalog,
		SkillSelection: selection,
		KnowledgeBases: collected.KnowledgeBases,
		Memories:       memories,
		ContextNotes:   collected.ContextNotes,
		Baseline:       collected.Baseline,
	}
	bundle.Diagnostics = newDiagnostics(req, options, plan, catalog, selection, bundle)
	return bundle
}
