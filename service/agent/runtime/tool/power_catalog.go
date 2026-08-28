package tool

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

// AgentPowerCatalog applies the agent's configured Power category boundary.
func AgentPowerCatalog(agent agentmodel.Agent, powers []energonmodel.Power) []energonmodel.Power {
	if agent.PowerCateID == 0 {
		return nil
	}
	result := make([]energonmodel.Power, 0, len(powers))
	for _, power := range powers {
		if power.CateID == agent.PowerCateID && power.ID != agent.LLMPowerID {
			result = append(result, power)
		}
	}
	return result
}

// ResolveAgentPowerCatalog also rejects categories that no longer exist or are disabled.
func ResolveAgentPowerCatalog(ctx context.Context, agent agentmodel.Agent, powers []energonmodel.Power) []energonmodel.Power {
	if agent.PowerCateID == 0 {
		return nil
	}
	category := energonmodel.NewPowerCateModel().Find(ctx, map[string]any{
		"id":     agent.PowerCateID,
		"status": 1,
	})
	if category == nil {
		return nil
	}
	return AgentPowerCatalog(agent, powers)
}
