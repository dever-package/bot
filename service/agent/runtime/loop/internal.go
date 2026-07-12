package loop

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/google/uuid"

	"github.com/shemic/dever/server"
)

type InternalRequest struct {
	AgentID      uint64
	RequestID    string
	Method       string
	Host         string
	Path         string
	Headers      map[string]string
	Input        map[string]any
	History      []any
	Server       *server.Context
	OnRunCreated func(runID uint64, requestID string)
	OnStream     func(payload map[string]any)
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
	completion := make(chan runCompletion, 1)
	execution, err := s.prepareStatelessExecution(ctx, statelessRequest{
		RequestID: requestID,
		TaskRequest: TaskRequest{
			AgentIdentity: strconv.FormatUint(request.AgentID, 10),
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
	notifyRunCreated(request.OnRunCreated, execution.runID, execution.requestID)
	controller := s.runs.Start(requestID, ctx, chatTimeout(execution.agent.TimeoutSeconds))
	if _, err := s.startExecutionStream(ctx, execution); err != nil {
		controller.Stop("fail")
		s.runs.Remove(requestID)
		s.failExecutionStart(execution, err)
		execution.close()
		return InternalResult{}, err
	}
	s.run(controller, execution)
	result := <-completion
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

func notifyRunCreated(callback func(uint64, string), runID uint64, requestID string) {
	if callback == nil {
		return
	}
	defer func() {
		_ = recover()
	}()
	callback(runID, requestID)
}
