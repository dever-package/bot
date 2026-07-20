package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	frontstream "github.com/dever-package/front/service/stream"
)

type AgentSessionRequest struct {
	AgentIdentity string
	SessionID     uint64
	ContextKey    string
	Title         string
}

type ObserveRunRequest struct {
	RequestID string
	LastID    string
	Block     time.Duration
	OnPayload func(map[string]any)
}

type ObserveRunResult struct {
	RequestID string
	LastID    string
	RunID     uint64
	Output    map[string]any
}

func (s Service) EnsureSession(ctx context.Context, request AgentSessionRequest) (agentmodel.Session, error) {
	agent, err := runtimecontext.ResolveAgent(ctx, request.AgentIdentity)
	if err != nil {
		return agentmodel.Session{}, err
	}
	return s.chat.EnsureSession(ctx, runtimechat.SessionRequest{
		SessionID:  request.SessionID,
		ContextKey: request.ContextKey,
		AgentKey:   agent.Key,
		Title:      request.Title,
	})
}

func (s Service) ObserveRun(ctx context.Context, request ObserveRunRequest) (ObserveRunResult, error) {
	requestID := strings.TrimSpace(request.RequestID)
	if requestID == "" {
		return ObserveRunResult{}, fmt.Errorf("智能体运行请求ID不能为空")
	}
	lastID := strings.TrimSpace(request.LastID)
	if lastID == "" {
		lastID = "0-0"
	}
	block := request.Block
	if block <= 0 {
		block = streamReadBlock
	}
	result := ObserveRunResult{RequestID: requestID, LastID: lastID}
	for {
		entries, err := s.ReadStream(ctx, requestID, lastID, 64, block)
		if err != nil {
			return result, err
		}
		for _, entry := range entries {
			lastID = entry.ID
			result.LastID = lastID
			payload := entry.Payload
			if request.OnPayload != nil {
				request.OnPayload(payload)
			}
			output, _ := payload["output"].(map[string]any)
			if output == nil {
				output = map[string]any{}
			}
			if result.RunID == 0 {
				meta, _ := output["meta"].(map[string]any)
				result.RunID = uint64(frontstream.InputInt64(meta["run_id"], 0))
			}
			if !strings.EqualFold(strings.TrimSpace(frontstream.InputText(payload["type"])), "result") {
				continue
			}
			result.Output = output
			if int(frontstream.InputInt64(payload["status"], 1)) != 1 {
				message := strings.TrimSpace(frontstream.InputText(payload["msg"]))
				if message == "" {
					message = "智能体运行失败"
				}
				return result, fmt.Errorf("%s", message)
			}
			return result, nil
		}
		select {
		case <-ctx.Done():
			return result, ctx.Err()
		default:
		}
	}
}
