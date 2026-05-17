package agent

import (
	"context"
	"strings"
	"time"

	frontstream "my/package/front/service/stream"
)

func (s Service) Run(ctx context.Context, req RunRequest) map[string]any {
	parsed, err := parseRunRequest(req.Body)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	agent, err := s.repo.FindAgent(ctx, parsed.AgentIdentity)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}
	power, err := s.repo.FindPower(ctx, agent.LLMPowerID)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	requestID := resolveRequestID(req)
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"agent_id":   agent.ID,
		"agent_key":  agent.Key,
		"input": jsonText(map[string]any{
			"input":   parsed.Input,
			"history": parsed.History,
		}),
		"skills":          "[]",
		"runtime_context": "",
		"output":          "",
		"error":           "",
		"status":          runStatusRunning,
		"step_count":      0,
		"latency":         0,
		"started_at":      now,
		"created_at":      now,
	})
	if runID == 0 {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "创建智能体运行记录失败", 2)
	}

	startPayload := frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  "智能体运行已开始",
		"meta": map[string]any{
			"cancelable":    true,
			"agent":         agent.Key,
			"run_id":        runID,
			"started_at":    now.Format(time.RFC3339Nano),
			"started_at_ms": now.UnixMilli(),
		},
	}, "", 1)
	_ = s.writePayload(ctx, requestID, startPayload)

	go s.execute(runExecution{
		Request:   req,
		Parsed:    parsed,
		Agent:     agent,
		Power:     power,
		RunID:     runID,
		RequestID: requestID,
		StartedAt: now,
	})

	return startPayload
}

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
}

func (s Service) Stop(ctx context.Context, requestID string) map[string]any {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "request_id 不能为空", 2)
	}
	resp := s.gateway.StopStream(ctx, requestID)
	payload := resp.Payload()
	if int(frontstream.InputInt64(payload["status"], 0)) != 2 {
		now := time.Now()
		s.repo.UpdateRunByRequestID(ctx, requestID, map[string]any{
			"status":      runStatusCanceled,
			"finished_at": now,
		})
		_ = s.writeStreamOutput(ctx, requestID, cancelOutput())
		_ = s.writeCancelResult(ctx, requestID)
	}
	return payload
}
