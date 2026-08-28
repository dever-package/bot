package tool

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

type AgentReadiness struct {
	PowerCount         int      `json:"power_count"`
	SkillCount         int      `json:"skill_count"`
	KnowledgeBaseCount int      `json:"knowledge_base_count"`
	Warnings           []string `json:"warnings"`
}

func BuildAgentReadiness(
	agent agentmodel.Agent,
	powerCount int,
	knowledgeBaseCount int,
	skillCount int,
	warnings ...string,
) AgentReadiness {
	result := AgentReadiness{
		PowerCount:         max(0, powerCount),
		KnowledgeBaseCount: max(0, knowledgeBaseCount),
		SkillCount:         max(0, skillCount),
	}
	result.Warnings = appendUniqueWarnings(nil, warnings...)
	if agent.PowerCateID > 0 && result.PowerCount == 0 {
		result.Warnings = appendDefaultReadinessWarning(result.Warnings, "工具能力分类", "工具能力分类当前没有可用能力")
	}
	if agent.KnowledgeCateID > 0 && result.KnowledgeBaseCount == 0 {
		result.Warnings = appendDefaultReadinessWarning(result.Warnings, "知识库分类", "知识库分类当前没有可用知识库")
	}
	if agent.SkillPackID > 0 && result.SkillCount == 0 {
		result.Warnings = appendDefaultReadinessWarning(result.Warnings, "技能方案", "技能方案当前没有可用技能")
	}
	return result
}

// BuildMountReadiness describes the catalogs selected for this runtime turn.
// A restricted empty policy selects no ordinary Power catalog, so mounting
// cannot infer category readiness; configuration readiness is checked earlier.
func BuildMountReadiness(
	agent agentmodel.Agent,
	policy PowerPolicy,
	powerCount int,
	knowledgeBaseCount int,
	skillCount int,
	warnings ...string,
) AgentReadiness {
	policy = policy.Normalize()
	if policy.Restricted && len(policy.AllowedPowerIDs) == 0 {
		agent.PowerCateID = 0
	}
	return BuildAgentReadiness(
		agent,
		powerCount,
		knowledgeBaseCount,
		skillCount,
		warnings...,
	)
}

func InspectAgentReadiness(
	ctx context.Context,
	agent agentmodel.Agent,
	powers []energonmodel.Power,
) AgentReadiness {
	knowledgeBaseCount := 0
	if agent.KnowledgeCateID > 0 {
		knowledgeBaseCount = len(knowledgeservice.NewService().KnowledgeBasesByCate(ctx, agent.KnowledgeCateID))
	}
	skillCount := 0
	warnings := []string(nil)
	if agent.SkillPackID > 0 {
		entries, err := agentskill.EntriesByPack(ctx, agent.SkillPackID)
		if err == nil {
			skillCount = len(entries)
		} else {
			warnings = append(warnings, "技能方案读取失败: "+err.Error())
		}
	}
	return BuildAgentReadiness(agent, len(powers), knowledgeBaseCount, skillCount, warnings...)
}

func appendDefaultReadinessWarning(current []string, prefix string, fallback string) []string {
	for _, warning := range current {
		if strings.HasPrefix(warning, prefix) {
			return current
		}
	}
	return appendUniqueWarnings(current, fallback)
}

func appendUniqueWarnings(current []string, values ...string) []string {
	seen := make(map[string]struct{}, len(current)+len(values))
	result := make([]string, 0, len(current)+len(values))
	for _, value := range append(append([]string(nil), current...), values...) {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
