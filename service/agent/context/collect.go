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
	Powers         []energonmodel.Power
	PublicSettings []agentmodel.Setting
	AgentSettings  []agentmodel.AgentSetting
	KnowledgeBases []agentknowledge.AgentKnowledgeBaseRuntime
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
		Powers:         a.repo.ListActiveCallablePowers(ctx, req.Power.ID),
		PublicSettings: a.repo.ListActivePublicSettings(ctx, req.Agent.SettingPackID),
		AgentSettings:  a.repo.ListActiveAgentSettings(ctx, req.Agent.ID),
		KnowledgeBases: a.collectKnowledgeBases(ctx, req),
		SkillLimits:    skillLimits,
		SkillCatalog:   skillCatalog,
		ContextNotes:   BuildHistoryNotes(req.History, a.budget),
		Baseline:       BuildBaseline(req.History, a.budget),
	}
}
