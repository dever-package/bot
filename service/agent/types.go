package agent

import (
	"context"
	"strconv"
	"strings"

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
}

type parsedRunRequest struct {
	AgentIdentity  string
	Input          map[string]any
	History        []any
	Options        map[string]any
	SourceTargetID uint64
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
		Content:   content,
		Payload:   jsonText(payload),
		Status:    status,
	})
}
