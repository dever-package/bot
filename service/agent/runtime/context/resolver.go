package runtimecontext

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
)

func ResolveAgent(ctx context.Context, identity string) (agentmodel.Agent, error) {
	identity = strings.TrimSpace(identity)
	if identity == "" {
		return agentmodel.Agent{}, fmt.Errorf("智能体不能为空")
	}

	model := agentmodel.NewAgentModel()
	var row *agentmodel.Agent
	if id, err := strconv.ParseUint(identity, 10, 64); err == nil && id > 0 {
		row = model.Find(ctx, map[string]any{"id": id})
	}
	if row == nil {
		row = model.Find(ctx, map[string]any{"key": identity})
	}
	if row == nil {
		if builtinID := builtinAgentID(identity); builtinID > 0 {
			row = model.Find(ctx, map[string]any{"id": builtinID})
		}
	}
	if row == nil {
		row = model.Find(ctx, map[string]any{"name": identity})
	}
	if row == nil {
		return agentmodel.Agent{}, fmt.Errorf("未找到智能体: %s", identity)
	}
	if row.Status != 1 {
		return agentmodel.Agent{}, fmt.Errorf("智能体已停用: %s", row.Name)
	}
	if row.LLMPowerID == 0 {
		return agentmodel.Agent{}, fmt.Errorf("智能体未配置 LLM 能力")
	}
	return *row, nil
}

func ResolveTextPower(ctx context.Context, id uint64) (energonmodel.Power, error) {
	return energonservice.ResolveGeneralTextPower(ctx, id)
}

func builtinAgentID(identity string) uint64 {
	switch strings.TrimSpace(identity) {
	case agentmodel.FrontAssistantAgentKey:
		return agentmodel.FrontAssistantAgentID
	case agentmodel.SkillInstallerAgentKey:
		return agentmodel.SkillInstallerAgentID
	case agentmodel.SkillCreatorAgentKey:
		return agentmodel.SkillCreatorAgentID
	default:
		return 0
	}
}
