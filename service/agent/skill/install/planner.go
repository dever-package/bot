package install

import (
	"context"
	"fmt"
	"os/exec"
	"regexp"
	"strings"

	agentmodel "my/package/bot/model/agent"
	agentruntime "my/package/bot/service/agent"
	agentskill "my/package/bot/service/agent/skill"
)

func (s Service) buildInstallPlan(ctx context.Context, execInfo *skillInstallExecution) (installPlan, error) {
	s.status(ctx, execInfo, "正在生成技能安装计划")
	input := plannerInput(execInfo)
	s.status(ctx, execInfo, "正在调用技能安装规划器")
	stopHeartbeat := s.heartbeat(ctx, execInfo, "仍在生成技能安装计划，请稍后")
	result, err := agentruntime.NewService().RunInternal(ctx, agentruntime.InternalRunRequest{
		AgentKey:  agentmodel.SkillInstallerAgentKey,
		RequestID: execInfo.RequestID + "-planner",
		Method:    execInfo.Request.Method,
		Host:      execInfo.Request.Host,
		Path:      execInfo.Request.Path,
		Headers:   execInfo.Request.Headers,
		Input:     map[string]any{"text": input},
		Options:   map[string]any{"stream": true},
	})
	stopHeartbeat()
	if err != nil {
		if plan, ok := fallbackGitHubPlan(execInfo.Input); ok {
			s.log(execInfo, "规划器调用失败，使用 GitHub 下载兜底计划: %s", err.Error())
			return plan, nil
		}
		return installPlan{}, err
	}
	s.status(ctx, execInfo, "技能安装规划器已返回安装计划")
	plan, err := parseInstallPlanResult(result.Output, result.Summary)
	if err != nil {
		if plan, ok := fallbackGitHubPlan(execInfo.Input); ok {
			s.log(execInfo, "规划器输出无法解析，使用 GitHub 下载兜底计划: %s", err.Error())
			return plan, nil
		}
		return installPlan{}, err
	}
	s.log(execInfo, "安装计划: %s", strings.TrimSpace(plan.Summary))
	return plan, nil
}

func plannerInput(execInfo *skillInstallExecution) string {
	capabilities := probeInstallCapabilities()
	context := map[string]any{
		"target_root":      agentskill.Root,
		"entry_file":       agentskill.EntryFile,
		"target_pack_id":   execInfo.TargetPackID,
		"cate_id":          execInfo.CateID,
		"auto_add_to_pack": execInfo.AutoAddToPack,
		"capabilities":     capabilities,
	}
	return strings.Join([]string{
		"请为以下技能安装输入生成一个 skill_install_plan。",
		"",
		"安装输入:",
		execInfo.Input,
		"",
		"执行上下文:",
		agentskill.JSONText(context),
		"",
		"要求:",
		"- 只输出 ```skill-install-plan fenced JSON。",
		"- GitHub 仓库优先用 download 步骤；如果用户给的是仓库主页，可转成 archive zip 下载地址。",
		"- npx、skillhub、curl 等安装说明用 command 步骤，但命令必须把技能安装到当前工作目录、SKILLS_DIR 或 SKILLS_HOME。",
		"- 需要 SkillHub 时直接使用 skillhub install <技能名>，执行层会自动补装 SkillHub CLI。",
		"- 如果一个仓库可能包含多个技能，collect.mode 使用 all。",
	}, "\n")
}

func probeInstallCapabilities() map[string]bool {
	names := []string{"bash", "curl", "git", "node", "npm", "npx", "pnpm", "yarn", "bunx", "skillhub", "unzip", "tar"}
	result := make(map[string]bool, len(names))
	for _, name := range names {
		_, err := exec.LookPath(name)
		result[name] = err == nil
	}
	return result
}

func plannerError(input string, err error) error {
	if err == nil {
		return nil
	}
	input = strings.TrimSpace(input)
	if input == "" {
		return err
	}
	return fmt.Errorf("%w；安装输入：%s", err, input)
}

func fallbackGitHubPlan(input string) (installPlan, bool) {
	link := firstHTTPURL(input)
	if link == "" || len(githubArchiveCandidates(link)) == 0 {
		return installPlan{}, false
	}
	plan := installPlan{
		Kind:    planKind,
		Version: 1,
		Summary: "通过 GitHub 仓库下载技能",
		Steps: []installPlanStep{
			{Type: stepTypeDownload, URL: link, Extract: true},
		},
		Collect: installPlanCollect{
			Entry: agentskill.EntryFile,
			Roots: []string{"."},
			Mode:  collectModeAll,
		},
	}
	return plan, plan.NormalizeAndValidate() == nil
}

func firstHTTPURL(input string) string {
	match := regexp.MustCompile(`https?://[^\s\])>，。；;、]+`).FindString(input)
	if match == "" {
		return ""
	}
	return strings.Trim(match, " \t\r\n，。；;、()[]{}<>\"'")
}
