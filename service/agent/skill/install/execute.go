package install

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	agentskill "my/package/bot/service/agent/skill"
	frontstream "my/package/front/service/stream"
)

func (s Service) execute(execInfo skillInstallExecution) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	defer func() {
		if recovered := recover(); recovered != nil {
			s.fail(context.Background(), &execInfo, fmt.Errorf("%v", recovered))
		}
	}()

	startedAt := time.Now()
	s.updateInstall(ctx, execInfo.ID, map[string]any{
		"status":     agentmodel.SkillInstallStatusInstalling,
		"started_at": startedAt,
	})
	s.status(ctx, &execInfo, "正在准备技能安装任务")

	tmpDir, err := os.MkdirTemp("", fmt.Sprintf("bot-skill-install-%d-", execInfo.ID))
	if err != nil {
		s.fail(ctx, &execInfo, err)
		return
	}
	defer os.RemoveAll(tmpDir)

	plan, err := s.buildInstallPlan(ctx, &execInfo)
	if err != nil {
		s.fail(ctx, &execInfo, plannerError(execInfo.Input, err))
		return
	}
	s.updateInstall(ctx, execInfo.ID, map[string]any{
		"plan": agentskill.JSONText(plan),
		"log":  execInfo.logText(),
	})

	sourceURL, err := s.executePlan(ctx, &execInfo, tmpDir, plan)
	if err != nil {
		s.fail(ctx, &execInfo, err)
		return
	}
	sources, err := collectSkillSources(tmpDir, plan, sourceURL)
	if err != nil {
		s.fail(ctx, &execInfo, err)
		return
	}
	installs, err := parseSkillSources(sources)
	if err != nil {
		s.fail(ctx, &execInfo, err)
		return
	}
	if err := os.MkdirAll(agentskill.Root, 0o755); err != nil {
		s.fail(ctx, &execInfo, err)
		return
	}

	installedSkills := make([]map[string]any, 0, len(installs))
	skillIDs := make([]uint64, 0, len(installs))
	targetPaths := make([]string, 0, len(installs))
	for _, install := range installs {
		skill, err := s.saveInstalledSkill(ctx, &execInfo, install)
		if err != nil {
			s.fail(ctx, &execInfo, err)
			return
		}
		if id := skillUint64(skill, "id"); id > 0 {
			skillIDs = append(skillIDs, id)
		}
		if path := skillValue(skill, "path"); path != "" {
			targetPaths = append(targetPaths, path)
		}
		installedSkills = append(installedSkills, skill)
	}

	result := skillInstallResult(execInfo.ID, installedSkills)
	finishedAt := time.Now()
	s.updateInstall(ctx, execInfo.ID, map[string]any{
		"status":      agentmodel.SkillInstallStatusSuccess,
		"skill_id":    firstUint64(skillIDs),
		"target_path": firstString(targetPaths),
		"result":      agentskill.JSONText(result),
		"log":         execInfo.logText(),
		"finished_at": finishedAt,
		"error":       "",
	})
	_, _ = s.streams.WritePayload(ctx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "result", result, "", 1))
}

func (s Service) executePlan(ctx context.Context, execInfo *skillInstallExecution, workDir string, plan installPlan) (string, error) {
	sourceURL := ""
	for index, step := range plan.Steps {
		s.status(ctx, execInfo, fmt.Sprintf("正在执行安装计划 %d/%d：%s", index+1, len(plan.Steps), planStepLabel(step)))
		switch step.Type {
		case stepTypeDownload:
			downloadedURL, err := downloadPlanStep(ctx, workDir, step)
			if err != nil {
				return sourceURL, err
			}
			if sourceURL == "" {
				sourceURL = downloadedURL
			}
			s.log(execInfo, "下载完成: %s", downloadedURL)
		case stepTypeCommand:
			commandDir, err := safeWorkPath(workDir, step.Dir)
			if err != nil {
				return sourceURL, err
			}
			s.status(ctx, execInfo, "正在执行安装命令，命令输出会实时显示")
			stopHeartbeat := s.heartbeat(ctx, execInfo, "仍在执行安装命令，请稍后")
			_, err = runInstallCommand(ctx, commandDir, step.Command, func(line string) {
				s.commandOutput(ctx, execInfo, line)
			})
			stopHeartbeat()
			if err != nil {
				return sourceURL, err
			}
		default:
			return sourceURL, fmt.Errorf("不支持的安装步骤: %s", step.Type)
		}
	}
	if sourceURL == "" {
		sourceURL = firstHTTPURL(execInfo.Input)
	}
	return sourceURL, nil
}

func planStepLabel(step installPlanStep) string {
	switch step.Type {
	case stepTypeDownload:
		return "下载技能来源"
	case stepTypeCommand:
		return "执行安装命令"
	default:
		return step.Type
	}
}

func (s Service) fail(ctx context.Context, execInfo *skillInstallExecution, err error) {
	message := "技能安装失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	s.log(execInfo, "安装失败: %s", message)
	s.updateInstall(ctx, execInfo.ID, map[string]any{
		"status":      agentmodel.SkillInstallStatusFail,
		"log":         execInfo.logText(),
		"error":       message,
		"finished_at": finishedAt,
	})
	_, _ = s.streams.WritePayload(ctx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "result", map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       "技能安装失败：" + message,
		"install_id": execInfo.ID,
		"error":      message,
	}, message, 2))
}

func (s Service) status(ctx context.Context, execInfo *skillInstallExecution, text string) {
	s.log(execInfo, "%s", text)
	s.updateInstall(ctx, execInfo.ID, map[string]any{"log": execInfo.logText()})
	s.pushStatus(ctx, execInfo, "status", text)
}

func (s Service) pushStatus(ctx context.Context, execInfo *skillInstallExecution, event string, text string) {
	if execInfo == nil {
		return
	}
	_, _ = s.streams.WritePayload(ctx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "stream", map[string]any{
		"event": event,
		"text":  text,
	}, "", 1))
}

func (s Service) heartbeat(ctx context.Context, execInfo *skillInstallExecution, text string) func() {
	done := make(chan struct{})
	go func() {
		ticker := time.NewTicker(15 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-done:
				return
			case <-ticker.C:
				s.pushStatus(ctx, execInfo, "status", text)
			}
		}
	}()
	return func() {
		close(done)
	}
}

func (s Service) log(execInfo *skillInstallExecution, format string, args ...any) {
	if execInfo == nil {
		return
	}
	line := format
	if len(args) > 0 {
		line = fmt.Sprintf(format, args...)
	}
	line = strings.TrimSpace(line)
	if line == "" {
		return
	}
	execInfo.LogMu.Lock()
	defer execInfo.LogMu.Unlock()
	execInfo.Log.WriteString(time.Now().Format("15:04:05"))
	execInfo.Log.WriteString(" ")
	execInfo.Log.WriteString(line)
	execInfo.Log.WriteString("\n")
}

func (s Service) commandOutput(ctx context.Context, execInfo *skillInstallExecution, line string) {
	line = strings.TrimSpace(stripANSI(line))
	if line == "" {
		return
	}
	s.log(execInfo, "%s", line)
	s.updateInstall(ctx, execInfo.ID, map[string]any{"log": execInfo.logText()})
	_, _ = s.streams.WritePayload(ctx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "stream", map[string]any{
		"event": "log",
		"text":  line,
	}, "", 1))
}

func (execInfo *skillInstallExecution) logText() string {
	if execInfo == nil {
		return ""
	}
	execInfo.LogMu.Lock()
	defer execInfo.LogMu.Unlock()
	return execInfo.Log.String()
}

func (s Service) updateInstall(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	defer func() {
		_ = recover()
	}()
	agentmodel.NewSkillInstallModel().Update(ctx, map[string]any{"id": id}, record)
}
