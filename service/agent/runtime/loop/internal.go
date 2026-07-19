package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/server"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

type InternalRequest struct {
	AgentID       uint64
	AgentIdentity string
	RequestID     string
	Method        string
	Host          string
	Path          string
	Headers       map[string]string
	Input         map[string]any
	History       []any
	Server        *server.Context
	OnRunCreated  func(runID uint64, requestID string)
	OnStream      func(payload map[string]any)
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
	completion := make(chan runCompletion, 1)
	execution, err := s.prepareStatelessExecution(ctx, statelessRequest{
		RequestID: requestID,
		TaskRequest: TaskRequest{
			AgentIdentity: agentIdentity,
			Input:         request.Input,
			History:       request.History,
			Method:        request.Method,
			Host:          request.Host,
			Path:          request.Path,
			Headers:       request.Headers,
			Server:        request.Server,
		},
		OnStream: request.OnStream,
	})
	if err != nil {
		return InternalResult{}, err
	}
	execution.completion = completion
	execution.workerID = "direct:" + uuid.NewString()
	execution.version = 2
	notifyRunCreated(request.OnRunCreated, execution.runID, execution.requestID)
	now := time.Now()
	execution.claimedAt = now
	started, err := s.repository.StartDirectRun(ctx, execution.runID, execution.workerID, now, now.Add(runtimeLeaseDuration))
	if err != nil || !started {
		if err == nil {
			err = fmt.Errorf("启动内部智能体运行失败")
		}
		s.failExecutionStart(execution, err)
		execution.close()
		return InternalResult{}, err
	}
	controller := s.runs.Start(requestID, ctx, chatTimeout(execution.agent.TimeoutSeconds))
	heartbeatDone := make(chan struct{})
	defer close(heartbeatDone)
	runtimeasync.Start("内部智能体运行租约心跳", func() {
		s.heartbeatRun(controller, execution, heartbeatDone)
	}, func(heartbeatErr error) {
		controller.Stop("lease_lost")
		dlog.ErrorFields("agent_internal_heartbeat", "内部智能体运行心跳异常", dlog.Fields{
			"run_id": execution.runID, "request_id": execution.requestID, "error": heartbeatErr.Error(),
		})
	})
	if err := s.mountExecutionTools(controller.Context(), &execution, request.Server, nil); err != nil {
		controller.Stop("fail")
		s.runs.Remove(requestID)
		s.failExecutionStart(execution, err)
		execution.close()
		return InternalResult{}, err
	}
	if _, err := s.startExecutionStream(ctx, execution); err != nil {
		controller.Stop("fail")
		s.runs.Remove(requestID)
		s.failExecutionStart(execution, err)
		execution.close()
		return InternalResult{}, err
	}
	s.run(controller, execution)
	result, err := waitInternalCompletion(completion, controller.Context())
	if err != nil {
		return InternalResult{
			RequestID: execution.requestID,
			RunID:     execution.runID,
		}, err
	}
	response := InternalResult{
		Output:    result.Output,
		Summary:   result.Text,
		RequestID: execution.requestID,
		RunID:     execution.runID,
	}
	if result.Status != runStatusSuccess {
		message := strings.TrimSpace(result.Message)
		if message == "" {
			message = "内部智能体运行失败"
		}
		return response, fmt.Errorf("%s", message)
	}
	return response, nil
}

func waitInternalCompletion(completion <-chan runCompletion, runContext context.Context) (runCompletion, error) {
	// A successful finish publishes completion before the run context is closed.
	// Prefer that buffered result when both signals become ready together.
	select {
	case result := <-completion:
		return result, nil
	default:
	}
	select {
	case result := <-completion:
		return result, nil
	case <-runContext.Done():
		return runCompletion{}, fmt.Errorf("内部智能体运行未完成: %w", runContext.Err())
	}
}

func notifyRunCreated(callback func(uint64, string), runID uint64, requestID string) {
	if callback == nil {
		return
	}
	defer func() {
		_ = recover()
	}()
	callback(runID, requestID)
}
