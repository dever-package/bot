package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/shemic/dever/server"

	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/dever-package/bot/service/worker"
)

type InternalRequest struct {
	AgentID          uint64
	AgentIdentity    string
	RequestID        string
	RequiredToolName string
	Method           string
	Host             string
	Path             string
	Headers          map[string]string
	Input            map[string]any
	MediaReferences  []energoninput.MediaReference
	History          []any
	Billing          botprotocol.BillingContext
	Server           *server.Context
	OnRunCreated     func(runID uint64, requestID string)
	OnStream         func(payload map[string]any)
}

type InternalResult struct {
	Output    map[string]any
	Summary   string
	RequestID string
	RunID     uint64
}

func (s Service) RunInternal(ctx context.Context, request InternalRequest) (InternalResult, error) {
	requestID := strings.TrimSpace(request.RequestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	agentIdentity := strings.TrimSpace(request.AgentIdentity)
	if agentIdentity == "" {
		agentIdentity = fmt.Sprintf("%d", request.AgentID)
	}
	existing, err := s.repository.FindRunByRequestIDOptional(ctx, requestID)
	if err != nil {
		return InternalResult{}, err
	}
	if existing != nil {
		snapshot, err := decodeSnapshot(existing.Snapshot)
		if err != nil {
			return InternalResult{}, err
		}
		agent, err := runtimecontext.ResolveAgent(ctx, agentIdentity)
		if err != nil {
			return InternalResult{}, err
		}
		if existing.AgentID != agent.ID || snapshot.Scope != runtimescope.FromContext(requestContext(ctx, request.Server)) || snapshot.Billing.ProjectID != request.Billing.ProjectID {
			return InternalResult{}, fmt.Errorf("请求标识已属于其他智能体运行")
		}
		notifyRunCreated(request.OnRunCreated, existing.ID, requestID)
		if existing.Status == runStatusPending && worker.Active() {
			// A draining parent may need a child that was prepared before the
			// consumer stopped polling. Dispatch it through the existing queue.
			if err := s.executionDispatcher().Dispatch(ctx, existing.ID); err != nil {
				return InternalResult{}, err
			}
		}
		return s.observeInternal(ctx, existing.ID, requestID, request.OnStream)
	}
	execution, err := s.prepareStatelessExecution(ctx, statelessRequest{
		RequestID:        requestID,
		RequiredToolName: strings.TrimSpace(request.RequiredToolName),
		TaskRequest: TaskRequest{
			AgentIdentity:   agentIdentity,
			Input:           request.Input,
			MediaReferences: request.MediaReferences,
			History:         request.History,
			Billing:         request.Billing,
			Method:          request.Method,
			Host:            request.Host,
			Path:            request.Path,
			Headers:         request.Headers,
			Server:          request.Server,
		},
	})
	if err != nil {
		return InternalResult{}, err
	}
	defer execution.close()
	notifyRunCreated(request.OnRunCreated, execution.runID, execution.requestID)
	if _, err := s.startExecutionStream(ctx, execution); err != nil {
		s.failExecutionStart(execution, err)
		return InternalResult{}, err
	}
	if err := s.enqueueExecution(ctx, execution); err != nil {
		s.failExecutionStart(execution, err)
		return InternalResult{}, err
	}
	return s.observeInternal(ctx, execution.runID, execution.requestID, request.OnStream)
}

// An internal caller observes the same durable job as API callers. Losing the
// observer does not stop execution, and a draining parent may still enqueue it.
func (s Service) observeInternal(ctx context.Context, runID uint64, requestID string, onStream func(map[string]any)) (InternalResult, error) {
	result := InternalResult{RunID: runID, RequestID: requestID}
	ticker := time.NewTicker(200 * time.Millisecond)
	defer ticker.Stop()
	lastID := "0-0"
	for {
		run, err := s.repository.FindRunByID(ctx, runID)
		if err != nil {
			return result, err
		}
		if onStream != nil {
			for {
				entries, err := s.streams.Read(ctx, requestID, lastID, 128, -1)
				if err != nil {
					return result, err
				}
				for _, entry := range entries {
					notifyStream(onStream, entry.Payload)
					lastID = entry.ID
				}
				if len(entries) < 128 {
					break
				}
			}
		}
		if isTerminalRunStatus(run.Status) {
			result.Output = decodeOutput(run.Output)
			result.Summary = strings.TrimSpace(botprotocol.AsText(result.Output["text"]))
			if run.Status != runStatusSuccess {
				return result, fmt.Errorf("内部智能体运行失败: %s", run.Error)
			}
			return result, nil
		}
		select {
		case <-ctx.Done():
			return result, ctx.Err()
		case <-ticker.C:
		}
	}
}

func notifyRunCreated(callback func(uint64, string), runID uint64, requestID string) {
	if callback == nil {
		return
	}
	callback(runID, requestID)
}
