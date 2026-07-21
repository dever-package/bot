package install

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	skillInstallTimeout         = 5 * time.Minute
	skillInstallFinalizeTimeout = 10 * time.Second
)

func (s Service) execute(ctx context.Context, execInfo *skillInstallExecution) {
	defer func() {
		if recovered := recover(); recovered != nil {
			s.fail(execInfo, fmt.Errorf("%v", recovered))
		}
	}()

	s.status(ctx, execInfo, "正在准备技能安装任务")

	tmpDir, err := os.MkdirTemp("", fmt.Sprintf("bot-skill-install-%d-", execInfo.ID))
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	defer os.RemoveAll(tmpDir)

	plan, err := s.buildInstallPlan(ctx, execInfo)
	if err != nil {
		s.fail(execInfo, fmt.Errorf("生成技能安装计划失败: %w", err))
		return
	}
	if err := s.updateInstall(ctx, execInfo.ID, map[string]any{
		"plan": agentskill.JSONText(plan),
		"log":  execInfo.logText(),
	}); err != nil {
		s.fail(execInfo, err)
		return
	}

	provenance, err := s.executePlan(ctx, execInfo, tmpDir, plan)
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	if err := agentskill.ValidateTreeLimits(tmpDir, installWorkspaceLimits); err != nil {
		s.fail(execInfo, fmt.Errorf("技能安装工作区超过资源限制: %w", err))
		return
	}
	sources, err := collectSkillSources(tmpDir, plan, provenance, installFallbackSourceURL(execInfo.Input))
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	installs, err := parseSkillSources(sources)
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	installs, err = selectTargetSkill(ctx, execInfo.TargetSkillID, installs)
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	if err := validateInstallConflicts(ctx, installs); err != nil {
		s.fail(execInfo, err)
		return
	}
	if err := agentskill.EnsureRoot(); err != nil {
		s.fail(execInfo, err)
		return
	}
	sandboxConfig := runtimetool.SandboxConfig(runtimeconfig.Load(ctx))
	for index := range installs {
		dependencies, prepareErr := agentskill.PrepareDependencies(ctx, sandboxConfig, installs[index].Source.Directory)
		if prepareErr != nil {
			s.fail(execInfo, prepareErr)
			return
		}
		if len(dependencies) > 0 {
			installs[index].Parsed.Manifest["dependencies"] = dependencies
		} else {
			installs[index].Parsed.Manifest["dependencies"] = []any{}
		}
		installs[index].Parsed.Manifest = installedSkillManifest(
			installs[index].Parsed.Manifest,
			installs[index].Source.SourceURL,
		)
		if validateErr := agentskill.ValidateManifestFiles(installs[index].Source.Directory, installs[index].Parsed.Manifest); validateErr != nil {
			s.fail(execInfo, fmt.Errorf("技能 %s 的 %w", installs[index].Parsed.Key, validateErr))
			return
		}
		contentHash, hashErr := agentskill.SkillContentHash(installs[index].Source.Directory, installs[index].Parsed.Manifest)
		if hashErr != nil {
			s.fail(execInfo, fmt.Errorf("计算技能 %s 版本失败: %w", installs[index].Parsed.Key, hashErr))
			return
		}
		finalDir, pathErr := agentskill.VersionedInstallPath(installs[index].Parsed.Key, contentHash)
		if pathErr != nil {
			s.fail(execInfo, pathErr)
			return
		}
		installs[index].Parsed.Hash = contentHash
		installs[index].FinalDir = finalDir
	}
	if ok, transitionErr := s.updateInstallStatus(ctx, execInfo.ID, agentmodel.SkillInstallStatusInstalling, map[string]any{
		"status": agentmodel.SkillInstallStatusFinalizing,
	}); transitionErr != nil {
		s.fail(execInfo, transitionErr)
		return
	} else if !ok {
		return
	}
	installedSkills, err := s.saveInstalledSkills(ctx, execInfo, installs)
	if err != nil {
		s.fail(execInfo, err)
		return
	}
	result := skillInstallResult(execInfo.ID, installedSkills)
	streamCtx, streamCancel := installFinalizeContext()
	defer streamCancel()
	_, _ = s.streams.WritePayload(streamCtx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "result", result, "", 1))
}

func (s Service) executePlan(ctx context.Context, execInfo *skillInstallExecution, workDir string, plan installPlan) ([]sourceProvenance, error) {
	sandboxConfig := runtimetool.SandboxConfig(runtimeconfig.Load(ctx))
	provenance := make([]sourceProvenance, 0)
	for index, step := range plan.Steps {
		s.status(ctx, execInfo, fmt.Sprintf("正在执行安装计划 %d/%d：%s", index+1, len(plan.Steps), planStepLabel(step)))
		switch step.Type {
		case stepTypeDownload:
			downloaded, err := downloadPlanStep(ctx, workDir, index, step)
			if err != nil {
				return nil, err
			}
			provenance = append(provenance, downloaded)
			s.log(execInfo, "下载完成: %s", downloaded.URL)
		case stepTypeCommand:
			commandDir, err := safeWorkPath(workDir, step.Dir)
			if err != nil {
				return nil, err
			}
			s.status(ctx, execInfo, "正在执行安装命令，命令输出会实时显示")
			err = func() error {
				stopHeartbeat := s.heartbeat(ctx, execInfo, "仍在执行安装命令，请稍后")
				defer stopHeartbeat()
				_, runErr := runInstallCommand(ctx, sandboxConfig, commandDir, step.Command, func(line string) {
					s.commandOutput(ctx, execInfo, line)
				})
				return runErr
			}()
			if err != nil {
				return nil, err
			}
		default:
			return nil, fmt.Errorf("不支持的安装步骤: %s", step.Type)
		}
	}
	return provenance, nil
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

func (s Service) fail(execInfo *skillInstallExecution, err error) {
	if execInfo == nil {
		return
	}
	message := "技能安装失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	s.log(execInfo, "安装失败: %s", message)
	ctx, cancel := installFinalizeContext()
	defer cancel()
	row := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"id": execInfo.ID})
	if row == nil || row.Status == agentmodel.SkillInstallStatusCanceled || isFinalInstallStatus(row.Status) {
		return
	}
	updated, updateErr := s.updateInstallStatus(ctx, execInfo.ID, row.Status, map[string]any{
		"status":      agentmodel.SkillInstallStatusFail,
		"log":         execInfo.logText(),
		"error":       message,
		"finished_at": finishedAt,
	})
	if updateErr != nil {
		dlog.ErrorFields("skill_install_finalize", "保存技能安装失败状态失败", dlog.Fields{
			"install_id": execInfo.ID, "request_id": execInfo.RequestID, "error": updateErr.Error(),
		})
	}
	if !updated {
		return
	}
	streamCtx, streamCancel := installFinalizeContext()
	defer streamCancel()
	_, _ = s.streams.WritePayload(streamCtx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "result", map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       "技能安装失败：" + message,
		"install_id": execInfo.ID,
		"error":      message,
	}, message, 2))
}

func (s Service) status(ctx context.Context, execInfo *skillInstallExecution, text string) {
	s.log(execInfo, "%s", text)
	s.persistLog(ctx, execInfo, true)
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
	if execInfo.Log.Len() > 32*1024 {
		text := trimCommandOutput(execInfo.Log.String())
		execInfo.Log.Reset()
		execInfo.Log.WriteString(text)
	}
}

func (s Service) commandOutput(ctx context.Context, execInfo *skillInstallExecution, line string) {
	line = strings.TrimSpace(stripANSI(line))
	if line == "" {
		return
	}
	s.log(execInfo, "%s", line)
	s.persistLog(ctx, execInfo, false)
	_, _ = s.streams.WritePayload(ctx, execInfo.RequestID, frontstream.ResponsePayload(execInfo.RequestID, "stream", map[string]any{
		"event": "log",
		"text":  line,
	}, "", 1))
}

func (s Service) persistLog(ctx context.Context, execInfo *skillInstallExecution, force bool) {
	if execInfo == nil {
		return
	}
	execInfo.PersistMu.Lock()
	defer execInfo.PersistMu.Unlock()
	now := time.Now()
	if !force && !execInfo.LastPersisted.IsZero() && now.Sub(execInfo.LastPersisted) < 250*time.Millisecond {
		return
	}
	_ = s.updateInstall(ctx, execInfo.ID, map[string]any{"log": execInfo.logText()})
	execInfo.LastPersisted = now
}

func (execInfo *skillInstallExecution) logText() string {
	if execInfo == nil {
		return ""
	}
	execInfo.LogMu.Lock()
	defer execInfo.LogMu.Unlock()
	return execInfo.Log.String()
}

func installFinalizeContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), skillInstallFinalizeTimeout)
}

func (s Service) updateInstall(ctx context.Context, id uint64, record map[string]any) (err error) {
	if id == 0 || len(record) == 0 {
		return nil
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("更新技能安装记录失败: %v", recovered)
		}
	}()
	if affected := agentmodel.NewSkillInstallModel().Update(ctx, map[string]any{"id": id}, record); affected == 0 {
		return fmt.Errorf("更新技能安装记录失败: %d", id)
	}
	return nil
}

func (s Service) updateInstallStatus(ctx context.Context, id uint64, status string, record map[string]any) (updated bool, err error) {
	if id == 0 || len(record) == 0 {
		return false, nil
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("更新技能安装状态失败: %v", recovered)
		}
	}()
	affected := agentmodel.NewSkillInstallModel().Update(ctx, map[string]any{"id": id, "status": status}, record)
	return affected > 0, nil
}
