package install

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "my/package/bot/model/agent"
	agentskill "my/package/bot/service/agent/skill"
	frontstream "my/package/front/service/stream"
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
	InstallType   string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
}

type skillInstallExecution struct {
	ID            uint64
	RequestID     string
	Input         string
	InstallType   string
	CateID        uint64
	TargetPackID  uint64
	AutoAddToPack bool
	StartedAt     time.Time
	Log           strings.Builder
}

type installedSkillSource struct {
	Directory string
	FilePath  string
	SourceURL string
}

func NewService() Service {
	return Service{streams: frontstream.New("skill_install")}
}

func (s Service) Run(ctx context.Context, req RunRequest) map[string]any {
	parsed, err := parseSkillInstallRequest(req.Body)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	requestID := resolveRequestID(req)
	now := time.Now()
	installID := uint64(agentmodel.NewSkillInstallModel().Insert(ctx, map[string]any{
		"cate_id":          parsed.CateID,
		"target_pack_id":   parsed.TargetPackID,
		"auto_add_to_pack": agentskill.BoolInt16(parsed.AutoAddToPack),
		"action":           agentmodel.SkillInstallActionInstall,
		"install_type":     parsed.InstallType,
		"install_input":    parsed.Input,
		"status":           agentmodel.SkillInstallStatusPending,
		"request_id":       requestID,
		"created_at":       now,
	}))
	if installID == 0 {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "创建技能安装记录失败", 2)
	}

	startPayload := frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  "技能安装已开始",
		"meta": map[string]any{
			"cancelable": false,
			"install_id": installID,
		},
	}, "", 1)
	_ = s.writePayload(ctx, requestID, startPayload)

	go s.execute(skillInstallExecution{
		ID:            installID,
		RequestID:     requestID,
		Input:         parsed.Input,
		InstallType:   parsed.InstallType,
		CateID:        parsed.CateID,
		TargetPackID:  parsed.TargetPackID,
		AutoAddToPack: parsed.AutoAddToPack,
		StartedAt:     now,
	})

	return startPayload
}

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
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
			return strings.TrimSpace(value)
		}
	}
	return uuid.NewString()
}

func NormalizeInstallType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "command", "url", "prompt":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "prompt"
	}
}
