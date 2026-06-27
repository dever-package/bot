package agent

import (
	"context"
	"strconv"
	"strings"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonservice "github.com/dever-package/bot/service/energon"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	runStatusRunning  = "running"
	runStatusSuccess  = "success"
	runStatusFail     = "fail"
	runStatusCanceled = "canceled"

	stepStatusSuccess = "success"
	stepStatusFail    = "fail"
	stepStatusWarning = "warning"

	defaultAgentStreamBlockMs = 1000

	maxStepContentRunes        = 20000
	maxStepPayloadPreviewRunes = 12000
	maxStepPayloadBytes        = 128 * 1024
)

type Service struct {
	repo    Repo
	gateway energonservice.GatewayService
	streams frontstream.Service
}

func NewService() Service {
	return Service{
		repo:    NewRepo(),
		gateway: energonservice.NewGatewayService(),
		streams: frontstream.New("agent"),
	}
}

func agentIdentity(agent agentmodel.Agent) string {
	if key := strings.TrimSpace(agent.Key); key != "" {
		return key
	}
	if agent.ID > 0 {
		return strconv.FormatUint(agent.ID, 10)
	}
	return strings.TrimSpace(agent.Name)
}

type RunRequest struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
	Body    map[string]any
	Server  *server.Context
}

type parsedRunRequest struct {
	AgentIdentity      string
	Input              map[string]any
	History            []any
	Options            map[string]any
	SourceTargetID     uint64
	AssistantSessionID uint64
	MemoryEnabled      bool
}

type runTracker struct {
	repo      Repo
	runID     uint64
	requestID string
	seq       int
}

func (t *runTracker) Step(ctx context.Context, stepType string, title string, content string, payload any, status string) {
	t.seq++
	t.repo.InsertStep(ctx, stepRecord{
		RunID:     t.runID,
		RequestID: t.requestID,
		Seq:       t.seq,
		Type:      stepType,
		Title:     title,
		Content:   compactStepContent(content),
		Payload:   compactStepPayload(jsonText(payload)),
		Status:    status,
	})
}

func compactStepContent(content string) string {
	return truncateRunesWithNotice(content, maxStepContentRunes)
}

func compactStepPayload(payload string) string {
	payload = strings.TrimSpace(payload)
	if payload == "" || len(payload) <= maxStepPayloadBytes {
		return payload
	}
	return jsonText(map[string]any{
		"truncated":      true,
		"original_bytes": len(payload),
		"preview":        truncateRunesWithNotice(payload, maxStepPayloadPreviewRunes),
	})
}

func truncateRunesWithNotice(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 || value == "" {
		return ""
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return string(runes[:limit]) + "\n\n...内容过长，已截断。"
}
