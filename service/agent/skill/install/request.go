package install

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	agentskill "my/package/bot/service/agent/skill"
)

func parseSkillInstallRequest(ctx context.Context, body map[string]any) (skillInstallRequest, error) {
	if body == nil {
		body = map[string]any{}
	}
	input := agentskill.NormalizeInput(body["input"])
	installContext := agentskill.NormalizeMap(input["context"])
	text := installRequestText(input)
	refreshSkill, err := findRefreshSkill(ctx, body, installContext)
	if err != nil {
		return skillInstallRequest{}, err
	}
	if text == "" && refreshSkill != nil {
		text, err = refreshInstallInput(ctx, refreshSkill)
		if err != nil {
			return skillInstallRequest{}, err
		}
	}
	if text == "" {
		return skillInstallRequest{}, fmt.Errorf("安装输入不能为空")
	}

	cateID := util.ToUint64(agentskill.FirstPresent(installContext, "cate_id", "cateId"))
	if cateID == 0 {
		cateID = util.ToUint64(agentskill.FirstPresent(body, "cate_id", "cateId"))
	}
	if cateID == 0 && refreshSkill != nil {
		cateID = refreshSkill.CateID
	}
	if cateID == 0 {
		cateID = agentmodel.DefaultSkillCateID
	}

	packID := util.ToUint64(agentskill.FirstPresent(installContext, "pack_id", "packId", "target_pack_id", "targetPackId"))
	if packID == 0 {
		packID = util.ToUint64(agentskill.FirstPresent(body, "pack_id", "packId", "target_pack_id", "targetPackId"))
	}

	autoAdd := packID > 0
	if value, ok := agentskill.FirstPresentOK(installContext, "auto_add_to_pack", "autoAddToPack"); ok {
		autoAdd = agentskill.Truthy(value)
	}
	return skillInstallRequest{
		Input:         text,
		CateID:        cateID,
		TargetPackID:  packID,
		AutoAddToPack: autoAdd,
	}, nil
}

func installRequestText(input map[string]any) string {
	return strings.TrimSpace(agentskill.FirstText(
		input["text"],
		input["prompt"],
		input["message"],
		input["command"],
		input["url"],
	))
}

func findRefreshSkill(ctx context.Context, body map[string]any, installContext map[string]any) (*agentmodel.Skill, error) {
	skillID := util.ToUint64(agentskill.FirstPresent(installContext, "skill_id", "skillId"))
	if skillID == 0 {
		skillID = util.ToUint64(agentskill.FirstPresent(body, "skill_id", "skillId"))
	}
	if skillID == 0 {
		return nil, nil
	}
	skill := agentmodel.NewSkillModel().Find(ctx, map[string]any{"id": skillID})
	if skill == nil {
		return nil, fmt.Errorf("技能不存在或已被删除")
	}
	return skill, nil
}

func refreshInstallInput(ctx context.Context, skill *agentmodel.Skill) (string, error) {
	if skill == nil {
		return "", fmt.Errorf("技能不存在或已被删除")
	}
	if input := latestInstallInput(ctx, skill.ID); input != "" {
		return input, nil
	}
	if input := strings.TrimSpace(skill.InstallInput); input != "" {
		return input, nil
	}
	if input := strings.TrimSpace(skill.SourceURL); input != "" {
		return input, nil
	}
	return "", fmt.Errorf("该技能没有可用于更新的安装输入")
}

func latestInstallInput(ctx context.Context, skillID uint64) string {
	if skillID == 0 {
		return ""
	}
	rows := agentmodel.NewSkillInstallModel().Select(ctx, map[string]any{"skill_id": skillID})
	for _, row := range rows {
		if row == nil {
			continue
		}
		if input := strings.TrimSpace(row.InstallInput); input != "" {
			return input
		}
	}
	return ""
}
