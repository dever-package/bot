package install

import (
	"context"
	"net/url"
	"os/exec"
	"regexp"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	agentsetting "github.com/dever-package/bot/service/agent/setting"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func (s Service) buildInstallPlan(ctx context.Context, execInfo *skillInstallExecution) (installPlan, error) {
	if plan, ok := directGitHubPlan(execInfo.Input); ok {
		s.status(ctx, execInfo, "已识别 GitHub 技能来源，使用直接下载计划")
		return plan, nil
	}
	agentsetting.EnsureBuiltinAgents(ctx)
	s.status(ctx, execInfo, "正在生成技能安装计划")
	input := plannerInput(execInfo)
	s.status(ctx, execInfo, "正在调用技能安装规划器")
	stopHeartbeat := s.heartbeat(ctx, execInfo, "仍在生成技能安装计划，请稍后")
	result, err := runtimeloop.NewService().RunInternal(ctx, runtimeloop.InternalRequest{
		AgentIdentity: agentmodel.SkillInstallerAgentKey,
		RequestID:     execInfo.RequestID + "-planner",
		Input:         map[string]any{"text": input},
	})
	stopHeartbeat()
	if err != nil {
		return installPlan{}, err
	}
	s.status(ctx, execInfo, "技能安装规划器已返回安装计划")
	plan, err := parseInstallPlanResult(result.Output, result.Summary)
	if err != nil {
		return installPlan{}, err
	}
	s.log(execInfo, "安装计划: %s", strings.TrimSpace(plan.Summary))
	return plan, nil
}

func plannerInput(execInfo *skillInstallExecution) string {
	return agentskill.JSONText(map[string]any{
		"task":          "根据内置智能体设定生成技能安装计划",
		"install_input": execInfo.Input,
		"execution_context": map[string]any{
			"target_root":      agentskill.Root,
			"entry_file":       agentskill.EntryFile,
			"target_pack_id":   execInfo.TargetPackID,
			"cate_id":          execInfo.CateID,
			"auto_add_to_pack": execInfo.AutoAddToPack,
			"capabilities":     probeInstallCapabilities(),
		},
	})
}

func probeInstallCapabilities() map[string]bool {
	names := []string{"git", "npm", "npx", "pnpm", "yarn", "bun", "bunx", "skillhub"}
	result := make(map[string]bool, len(names))
	for _, name := range names {
		_, err := exec.LookPath(name)
		result[name] = err == nil
	}
	return result
}

func directGitHubPlan(input string) (installPlan, bool) {
	link := firstHTTPURL(input)
	if link == "" || !directGitHubDownloadURL(link) || len(githubArchiveCandidates(link)) == 0 {
		return installPlan{}, false
	}
	link = publicSourceURL(link)
	if link == "" {
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

func directGitHubDownloadURL(rawURL string) bool {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil {
		return false
	}
	host := strings.TrimPrefix(strings.ToLower(parsed.Hostname()), "www.")
	if host != "github.com" {
		return false
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(parts) == 2 {
		return parts[0] != "" && strings.TrimSuffix(parts[1], ".git") != ""
	}
	return len(parts) >= 5 && parts[0] != "" && parts[1] != "" && parts[2] == "archive"
}

func firstHTTPURL(input string) string {
	match := regexp.MustCompile(`https?://[^\s\])>，。；;、]+`).FindString(input)
	if match == "" {
		return ""
	}
	return strings.Trim(match, " \t\r\n，。；;、()[]{}<>\"'")
}
