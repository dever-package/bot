package install

import (
	"context"
	"crypto/sha256"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	defaultStatus = int16(1)
	defaultSort   = 100
)

var installWorkspaceLimits = agentskill.TreeLimits{
	MaxFiles: 100_000,
	MaxBytes: 1024 * 1024 * 1024,
	MaxDepth: 64,
}

var installSkillSourceLimits = agentskill.TreeLimits{
	MaxFiles: 50_000,
	MaxBytes: 512 * 1024 * 1024,
	MaxDepth: 64,
}

type Service struct {
	streams frontstream.Service
}

type RunRequest struct {
	Headers map[string]string
	Body    map[string]any
}

type skillInstallRequest struct {
	Input         string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
	TargetSkillID uint64
}

type skillInstallExecution struct {
	ID            uint64
	RequestID     string
	Input         string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
	TargetSkillID uint64
	StartedAt     time.Time
	Log           strings.Builder
	LogMu         sync.Mutex
	PersistMu     sync.Mutex
	LastPersisted time.Time
}

type installedSkillSource struct {
	Directory string
	FilePath  string
	SourceURL string
}

type sourceProvenance struct {
	Root string
	URL  string
}

type parsedSkillSource struct {
	Source    installedSkillSource
	Parsed    agentskill.ParsedFile
	FinalDir  string
	EntryFile string
}

func NewService() Service {
	return Service{streams: frontstream.New("skill_install")}
}

func (s Service) Run(ctx context.Context, req RunRequest) map[string]any {
	StartInstallScheduler()
	RecoverInterruptedInstalls(ctx)
	parsed, err := parseSkillInstallRequest(ctx, req.Body)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	requestID := resolveRequestID(req)
	release, err := agentskill.Lock(ctx, installRequestLockKey(requestID))
	if err != nil {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, err.Error(), 2)
	}
	defer release()
	if existing := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"request_id": requestID}); existing != nil {
		return existingInstallPayload(existing)
	}
	now := time.Now()
	installID := uint64(agentmodel.NewSkillInstallModel().Insert(ctx, map[string]any{
		"cate_id":          parsed.CateID,
		"target_pack_id":   parsed.TargetPackID,
		"auto_add_to_pack": agentskill.BoolInt16(parsed.AutoAddToPack),
		"target_skill_id":  parsed.TargetSkillID,
		"install_input":    parsed.Input,
		"status":           agentmodel.SkillInstallStatusPending,
		"request_id":       requestID,
		"created_at":       now,
	}))
	if installID == 0 {
		if existing := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"request_id": requestID}); existing != nil {
			return existingInstallPayload(existing)
		}
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "创建技能安装记录失败", 2)
	}

	startPayload := installStartPayload(requestID, installID, "技能安装已加入队列")
	_, _ = s.streams.WritePayload(ctx, requestID, startPayload)

	if err := wakeInstallScheduler(ctx); err != nil {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{"install_id": installID}, err.Error(), 2)
	}

	return startPayload
}

func existingInstallPayload(existing *agentmodel.SkillInstall) map[string]any {
	if existing == nil {
		return map[string]any{}
	}
	if isFinalInstallStatus(existing.Status) {
		status := 1
		if existing.Status == agentmodel.SkillInstallStatusFail {
			status = 2
		}
		return frontstream.ResponsePayload(existing.RequestID, "result", installResultOutput(existing), existing.Error, status)
	}
	return installStartPayload(existing.RequestID, existing.ID, "技能安装任务已存在")
}

func installRequestLockKey(requestID string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(requestID)))
	return fmt.Sprintf("install-request-%x", sum[:12])
}

func installStartPayload(requestID string, installID uint64, text string) map[string]any {
	return frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  text,
		"meta": map[string]any{
			"cancelable": true,
			"install_id": installID,
		},
	}, "", 1)
}

func (s Service) Stop(ctx context.Context, requestID string) map[string]any {
	requestID = strings.TrimSpace(requestID)
	install := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"request_id": requestID})
	if install == nil {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "技能安装任务不存在", 2)
	}
	if isFinalInstallStatus(install.Status) {
		status := 1
		if install.Status == agentmodel.SkillInstallStatusFail {
			status = 2
		}
		return frontstream.ResponsePayload(requestID, "result", installResultOutput(install), install.Error, status)
	}
	if install.Status == agentmodel.SkillInstallStatusFinalizing {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "技能安装正在提交，不能取消", 2)
	}
	finishedAt := time.Now()
	affected := agentmodel.NewSkillInstallModel().Update(ctx, map[string]any{
		"id": install.ID, "status": install.Status,
	}, map[string]any{
		"status": agentmodel.SkillInstallStatusCanceled, "finished_at": finishedAt, "error": "",
	})
	if affected == 0 {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "技能安装状态已变化，请刷新后重试", 2)
	}
	cancelInstall(ctx, install.ID)
	output := canceledInstallOutput(install.ID)
	_, _ = s.streams.WritePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "result", output, "", 1))
	return frontstream.ResponsePayload(requestID, "result", output, "", 1)
}

func resolveRequestID(req RunRequest) string {
	for _, value := range []string{
		agentskill.HeaderValue(req.Headers, "X-Request-Id"),
		agentskill.HeaderValue(req.Headers, "X-Request-ID"),
	} {
		if strings.TrimSpace(value) != "" {
			return normalizeInstallRequestID(value)
		}
	}
	return uuid.NewString()
}

func normalizeInstallRequestID(value string) string {
	value = strings.TrimSpace(value)
	if len(value) <= 64 && value != "" && strings.IndexFunc(value, func(current rune) bool {
		return !((current >= 'a' && current <= 'z') ||
			(current >= 'A' && current <= 'Z') ||
			(current >= '0' && current <= '9') ||
			current == '-' || current == '_' || current == '.' || current == ':')
	}) < 0 {
		return value
	}
	sum := sha256.Sum256([]byte(value))
	return fmt.Sprintf("request-%x", sum[:28])
}
