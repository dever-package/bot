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

type Service struct {
	streams frontstream.Service
}

type RunRequest struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
	Body    map[string]any
}

type skillInstallRequest struct {
	Input         string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
}

type skillInstallExecution struct {
	Request       RunRequest
	ID            uint64
	RequestID     string
	Input         string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
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
	recoverInterruptedInstalls()
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
		if isFinalInstallStatus(existing.Status) {
			status := 1
			if existing.Status == agentmodel.SkillInstallStatusFail {
				status = 2
			}
			return frontstream.ResponsePayload(requestID, "result", installResultOutput(existing), existing.Error, status)
		}
		return installStartPayload(requestID, existing.ID, "技能安装任务已存在")
	}
	now := time.Now()
	installID := uint64(agentmodel.NewSkillInstallModel().Insert(ctx, map[string]any{
		"cate_id":          parsed.CateID,
		"target_pack_id":   parsed.TargetPackID,
		"auto_add_to_pack": agentskill.BoolInt16(parsed.AutoAddToPack),
		"install_input":    parsed.Input,
		"status":           agentmodel.SkillInstallStatusPending,
		"request_id":       requestID,
		"created_at":       now,
	}))
	if installID == 0 {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "创建技能安装记录失败", 2)
	}

	startPayload := installStartPayload(requestID, installID, "技能安装已开始")
	_, _ = s.streams.WritePayload(ctx, requestID, startPayload)

	go s.execute(skillInstallExecution{
		Request:       req,
		ID:            installID,
		RequestID:     requestID,
		Input:         parsed.Input,
		CateID:        parsed.CateID,
		TargetPackID:  parsed.TargetPackID,
		AutoAddToPack: parsed.AutoAddToPack,
		StartedAt:     now,
	})

	return startPayload
}

func installRequestLockKey(requestID string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(requestID)))
	return fmt.Sprintf("install-request-%02x", sum[0])
}

func installStartPayload(requestID string, installID uint64, text string) map[string]any {
	return frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  text,
		"meta": map[string]any{
			"cancelable": false,
			"install_id": installID,
		},
	}, "", 1)
}

func (s Service) Stop(_ context.Context, requestID string) map[string]any {
	return frontstream.ResponsePayload(requestID, "result", map[string]any{
		"event": "final",
		"text":  "技能安装任务暂不支持取消。",
	}, "", 1)
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
	if len(value) <= 64 {
		return value
	}
	sum := sha256.Sum256([]byte(value))
	return fmt.Sprintf("request-%x", sum[:28])
}
