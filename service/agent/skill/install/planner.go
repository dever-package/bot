package install

import (
	"context"
	"fmt"
	"os/exec"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentsetting "github.com/dever-package/bot/service/agent/setting"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func (s Service) buildInstallPlan(ctx context.Context, execInfo *skillInstallExecution) (installPlan, error) {
	if plan, ok := latestReusableInstallPlan(ctx, execInfo.TargetSkillID, execInfo.Input); ok {
		s.status(ctx, execInfo, "已复用最近一次成功安装计划")
		s.log(execInfo, "安装计划: %s", strings.TrimSpace(plan.Summary))
		return plan, nil
	}
	if plan, ok := directCommandPlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别技能安装命令，使用受控命令计划")
		return plan, nil
	}
	if plan, ok := directSkillHubPlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别 SkillHub 技能来源，使用标准安装计划")
		return plan, nil
	}
	if plan, ok := directGitHubTreePlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别 GitHub 技能子目录，使用官方 skills CLI 安装计划")
		return plan, nil
	}
	if plan, ok := directGitHubPlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别 GitHub 技能来源，使用直接下载计划")
		return plan, nil
	}
	if plan, ok := directURLPlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别技能文件或压缩包，使用直接下载计划")
		return plan, nil
	}
	agentsetting.EnsureBuiltinAgents(ctx)
	s.status(ctx, execInfo, "正在生成技能安装计划")
	s.status(ctx, execInfo, "正在调用技能安装规划器")
	result, err := s.runInstallPlanner(ctx, execInfo, "planner", plannerInput(execInfo, ""))
	if err != nil {
		return installPlan{}, err
	}
	s.status(ctx, execInfo, "技能安装规划器已返回安装计划")
	plan, err := parseInstallPlanResult(result.Output, result.Summary)
	if err == nil {
		s.log(execInfo, "安装计划: %s", strings.TrimSpace(plan.Summary))
		return plan, nil
	}

	s.status(ctx, execInfo, "安装计划未通过校验，正在请求规划器修正")
	repaired, repairErr := s.runInstallPlanner(ctx, execInfo, "planner-repair", plannerInput(execInfo, err.Error()))
	if repairErr != nil {
		return installPlan{}, fmt.Errorf("安装计划修正失败: %w", repairErr)
	}
	plan, repairErr = parseInstallPlanResult(repaired.Output, repaired.Summary)
	if repairErr != nil {
		return installPlan{}, fmt.Errorf("安装计划修正后仍无效: %w", repairErr)
	}
	s.log(execInfo, "安装计划: %s", strings.TrimSpace(plan.Summary))
	return plan, nil
}

func (s Service) runInstallPlanner(
	ctx context.Context,
	execInfo *skillInstallExecution,
	requestSuffix string,
	input string,
) (runtimeloop.InternalResult, error) {
	stopHeartbeat := s.heartbeat(ctx, execInfo, "仍在生成技能安装计划，请稍后")
	defer stopHeartbeat()
	return runtimeloop.NewService().RunInternal(ctx, runtimeloop.InternalRequest{
		AgentIdentity:    agentmodel.SkillInstallerAgentKey,
		RequestID:        execInfo.RequestID + "-" + requestSuffix,
		RequiredToolName: runtimeprovider.SkillInstallPlanToolName,
		Input:            map[string]any{"text": input},
	})
}

func plannerInput(execInfo *skillInstallExecution, validationError string) string {
	input := map[string]any{
		"install_input": execInfo.Input,
		"execution_context": map[string]any{
			"target_root":      agentskill.Root,
			"entry_file":       agentskill.EntryFile,
			"target_pack_id":   execInfo.TargetPackID,
			"cate_id":          execInfo.CateID,
			"auto_add_to_pack": execInfo.AutoAddToPack,
			"capabilities":     probeInstallCapabilities(),
		},
	}
	if validationError = strings.TrimSpace(validationError); validationError != "" {
		input["validation_error"] = validationError
	}
	return agentskill.JSONText(input)
}

func probeInstallCapabilities() map[string]bool {
	names := []string{"git", "npm", "npx", "pnpm", "yarn", "bun", "bunx"}
	result := make(map[string]bool, len(names)+2)
	for _, name := range names {
		_, err := exec.LookPath(name)
		result[name] = err == nil
	}
	// SkillHub commands bootstrap the CLI inside the isolated install workspace.
	result["skillhub"] = true
	result["skillhub_auto_bootstrap"] = true
	return result
}

func latestReusableInstallPlan(ctx context.Context, skillID uint64, installInput string) (installPlan, bool) {
	if skillID == 0 {
		return installPlan{}, false
	}
	installInput = strings.TrimSpace(installInput)
	if installInput == "" {
		return installPlan{}, false
	}
	filters := []map[string]any{
		{
			"skill_id":      skillID,
			"install_input": installInput,
			"status":        agentmodel.SkillInstallStatusSuccess,
		},
		// Multi-skill installs persist only the first skill ID on the run record.
		// The original input identifies the same reusable plan for the other skills.
		{
			"install_input": installInput,
			"status":        agentmodel.SkillInstallStatusSuccess,
		},
	}
	seen := map[uint64]struct{}{}
	for _, filter := range filters {
		rows := agentmodel.NewSkillInstallModel().Select(ctx, filter, map[string]any{
			"order": "main.created_at desc,main.id desc",
			"limit": 10,
		})
		for _, row := range rows {
			if row == nil || strings.TrimSpace(row.Plan) == "" {
				continue
			}
			if _, exists := seen[row.ID]; exists {
				continue
			}
			seen[row.ID] = struct{}{}
			plan, err := parseInstallPlanText(row.Plan)
			if err == nil {
				return plan, true
			}
		}
	}
	return installPlan{}, false
}
