package install

import (
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	agentskill "my/package/bot/service/agent/skill"
)

func parseSkillInstallRequest(body map[string]any) (skillInstallRequest, error) {
	if body == nil {
		body = map[string]any{}
	}
	input := agentskill.NormalizeInput(body["input"])
	text := strings.TrimSpace(agentskill.PrimaryInputText(input))
	if text == "" {
		return skillInstallRequest{}, fmt.Errorf("安装输入不能为空")
	}
	installContext := agentskill.NormalizeMap(input["context"])
	installType := NormalizeInstallType(agentskill.FirstText(installContext["install_type"], installContext["installType"], body["install_type"], body["installType"]))
	if installType == "prompt" {
		installType = detectSkillInstallType(text)
	}
	cateID := util.ToUint64(agentskill.FirstPresent(installContext, "cate_id", "cateId"))
	if cateID == 0 {
		cateID = util.ToUint64(agentskill.FirstPresent(body, "cate_id", "cateId"))
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
		InstallType:   installType,
		CateID:        cateID,
		TargetPackID:  packID,
		AutoAddToPack: autoAdd,
	}, nil
}

func detectSkillInstallType(input string) string {
	text := strings.TrimSpace(input)
	lower := strings.ToLower(text)
	if strings.HasPrefix(lower, "http://") || strings.HasPrefix(lower, "https://") {
		return "url"
	}
	for _, prefix := range []string{"npx ", "pnpm ", "npm ", "yarn ", "git ", "bunx "} {
		if strings.HasPrefix(lower, prefix) {
			return "command"
		}
	}
	return "prompt"
}
