package agentcontext

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

type collectedContext struct {
	RuntimeConfig  agentmodel.RuntimeConfig
	CategoryPrompt string
	AgentPrompt    string
	Powers         []energonmodel.Power
	KnowledgeBases []agentknowledge.KnowledgeBaseRuntime
	SkillLimits    agentskill.Limits
	SkillCatalog   agentskill.Catalog
	ContextNotes   []ContextNote
	Baseline       Baseline
}

func (a Assembler) collect(ctx context.Context, req Request) collectedContext {
	runtimeConfig := a.repo.FindRuntimeConfig(ctx)
	skillLimits := agentskill.LimitsFromRuntimeConfig(runtimeConfig)
	skillCatalog := agentskill.BuildCatalog(
		req.Agent.SkillPackID,
		a.repo.ListActiveSkillPackEntries(ctx, req.Agent.SkillPackID),
		skillLimits,
	)
	return collectedContext{
		RuntimeConfig:  runtimeConfig,
		CategoryPrompt: a.repo.FindAgentCatePrompt(ctx, req.Agent.CateID),
		AgentPrompt:    req.Agent.Prompt,
		Powers:         a.repo.ListActiveCallablePowers(ctx, req.Power.ID),
		KnowledgeBases: a.collectKnowledgeBases(ctx, req),
		SkillLimits:    skillLimits,
		SkillCatalog:   skillCatalog,
		ContextNotes:   BuildHistoryNotes(req.History, a.budget),
		Baseline:       BuildBaseline(req.History, a.budget),
	}
}
