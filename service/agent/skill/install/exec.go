package install

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	agentskill "my/package/bot/service/agent/skill"
	frontstream "my/package/front/service/stream"
)

func (s Service) execute(exec skillInstallExecution) {
	ctx, cancel := context.WithTimeout(context.Background(), agentskill.TimeoutSec*time.Second)
	defer cancel()

	defer func() {
		if recovered := recover(); recovered != nil {
			s.fail(context.Background(), &exec, fmt.Errorf("%v", recovered))
		}
	}()

	startedAt := time.Now()
	s.updateInstall(ctx, exec.ID, map[string]any{
		"status":     agentmodel.SkillInstallStatusInstalling,
		"started_at": startedAt,
	})
	s.status(ctx, &exec, "正在准备技能安装任务")

	tmpDir := filepath.Join(agentskill.TmpRoot, fmt.Sprintf("install-%d", exec.ID))
	_ = os.RemoveAll(tmpDir)
	if err := os.MkdirAll(tmpDir, 0o755); err != nil {
		s.fail(ctx, &exec, err)
		return
	}
	defer os.RemoveAll(tmpDir)

	source, err := s.prepareSkillSource(ctx, &exec, tmpDir)
	if err != nil {
		s.fail(ctx, &exec, err)
		return
	}

	parsed, err := agentskill.ParseFile(source.FilePath)
	if err != nil {
		s.fail(ctx, &exec, err)
		return
	}
	if parsed.Key == "" {
		s.fail(ctx, &exec, fmt.Errorf("技能标识不能为空，请检查 SKILL.md frontmatter"))
		return
	}
	if parsed.Name == "" {
		parsed.Name = parsed.Key
	}

	finalDir := filepath.Join(agentskill.Root, parsed.Key)
	if !agentskill.IsSafePath(finalDir) {
		s.fail(ctx, &exec, fmt.Errorf("技能安装目录不安全: %s", finalDir))
		return
	}
	if _, err := os.Stat(finalDir); err == nil {
		s.fail(ctx, &exec, fmt.Errorf("技能已存在: %s", parsed.Key))
		return
	}
	if err := os.MkdirAll(agentskill.Root, 0o755); err != nil {
		s.fail(ctx, &exec, err)
		return
	}
	if err := os.Rename(source.Directory, finalDir); err != nil {
		s.fail(ctx, &exec, err)
		return
	}

	entryFile := filepath.Base(source.FilePath)
	if entryFile == "" || entryFile == "." {
		entryFile = agentskill.EntryFile
	}
	manifest := agentskill.CloneMap(parsed.Manifest)
	manifest["source_url"] = source.SourceURL
	manifestText := agentskill.JSONText(manifest)
	skillID := uint64(agentmodel.NewSkillModel().Insert(ctx, map[string]any{
		"cate_id":      exec.CateID,
		"key":          parsed.Key,
		"name":         parsed.Name,
		"description":  parsed.Description,
		"source_url":   source.SourceURL,
		"install_path": filepath.ToSlash(finalDir),
		"entry_file":   entryFile,
		"manifest":     manifestText,
		"content_hash": parsed.Hash,
		"status":       defaultStatus,
		"sort":         defaultSort,
		"created_at":   time.Now(),
	}))
	if skillID == 0 {
		s.fail(ctx, &exec, fmt.Errorf("写入技能记录失败"))
		return
	}
	if exec.AutoAddToPack && exec.TargetPackID > 0 {
		ensureSkillInPack(ctx, exec.TargetPackID, skillID)
	}

	finishedAt := time.Now()
	s.log(&exec, "安装成功: %s (%s)", parsed.Name, parsed.Key)
	s.updateInstall(ctx, exec.ID, map[string]any{
		"status":      agentmodel.SkillInstallStatusSuccess,
		"skill_id":    skillID,
		"target_path": filepath.ToSlash(finalDir),
		"plan":        agentskill.JSONText(map[string]any{"install_type": exec.InstallType, "entry_file": entryFile}),
		"log":         exec.Log.String(),
		"finished_at": finishedAt,
		"error":       "",
	})
	_ = s.writePayload(ctx, exec.RequestID, frontstream.ResponsePayload(exec.RequestID, "result", map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       fmt.Sprintf("技能安装成功：%s（%s）。", parsed.Name, parsed.Key),
		"install_id": exec.ID,
		"skill_id":   skillID,
		"skill_key":  parsed.Key,
	}, "", 1))
}

func (s Service) fail(ctx context.Context, exec *skillInstallExecution, err error) {
	message := "技能安装失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	s.log(exec, "安装失败: %s", message)
	s.updateInstall(ctx, exec.ID, map[string]any{
		"status":      agentmodel.SkillInstallStatusFail,
		"log":         exec.Log.String(),
		"error":       message,
		"finished_at": finishedAt,
	})
	_ = s.writePayload(ctx, exec.RequestID, frontstream.ResponsePayload(exec.RequestID, "result", map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       "技能安装失败：" + message,
		"install_id": exec.ID,
		"error":      message,
	}, message, 2))
}

func (s Service) status(ctx context.Context, exec *skillInstallExecution, text string) {
	s.log(exec, "%s", text)
	s.updateInstall(ctx, exec.ID, map[string]any{"log": exec.Log.String()})
	_ = s.writePayload(ctx, exec.RequestID, frontstream.ResponsePayload(exec.RequestID, "stream", map[string]any{
		"event": "status",
		"text":  text,
	}, "", 1))
}

func (s Service) log(exec *skillInstallExecution, format string, args ...any) {
	if exec == nil {
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
	exec.Log.WriteString(time.Now().Format("15:04:05"))
	exec.Log.WriteString(" ")
	exec.Log.WriteString(line)
	exec.Log.WriteString("\n")
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

func (s Service) writePayload(ctx context.Context, requestID string, payload map[string]any) error {
	_, err := s.streams.WritePayload(ctx, requestID, payload)
	return err
}
