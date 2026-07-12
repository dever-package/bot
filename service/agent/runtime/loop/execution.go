package loop

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

type executionSpec struct {
	Agent              agentmodel.Agent
	Power              energonmodel.Power
	SessionID          uint64
	UserMessageID      uint64
	AssistantMessageID uint64
	Prompt             string
	Input              map[string]any
	RecordInput        map[string]any
	InputText          string
	History            []any
	Registry           *runtimetool.Registry
	Warnings           []string
	Transport          modelTransport
	PersistChat        bool
	OnStream           func(map[string]any)
	Cleanup            func()
	MediaReferences    []runtimeprovider.MediaReference
}

func (s Service) createExecution(ctx context.Context, requestID string, spec executionSpec) (execution, error) {
	startedAt := time.Now()
	current := execution{
		requestID:          requestID,
		startedAt:          startedAt,
		agent:              spec.Agent,
		power:              spec.Power,
		sessionID:          spec.SessionID,
		userMessageID:      spec.UserMessageID,
		assistantMessageID: spec.AssistantMessageID,
		prompt:             spec.Prompt,
		input:              spec.Input,
		history:            spec.History,
		registry:           spec.Registry,
		transport:          spec.Transport,
		persistChat:        spec.PersistChat,
		onStream:           spec.OnStream,
		cleanup:            spec.Cleanup,
		mediaReferences:    append([]runtimeprovider.MediaReference(nil), spec.MediaReferences...),
	}
	recordInput := spec.RecordInput
	if recordInput == nil {
		recordInput = spec.Input
	}
	runID, err := s.repository.CreateRun(ctx, runRecord{
		RequestID:      requestID,
		AgentID:        spec.Agent.ID,
		SessionID:      spec.SessionID,
		Input:          encodeJSON(recordInput, "{}"),
		RuntimeContext: spec.Prompt,
		StartedAt:      startedAt,
	})
	if err != nil {
		current.close()
		if spec.PersistChat {
			s.completeRunTurn(requestID, runStatusFail, "", nil, err.Error())
		}
		return execution{}, err
	}
	current.runID = runID
	if err := s.repository.CreateStep(ctx, stepRecord{
		RunID:     runID,
		RequestID: requestID,
		Seq:       1,
		Type:      "input",
		Title:     "用户输入",
		Content:   spec.InputText,
		Payload: encodeJSON(map[string]any{
			"history_count": len(spec.History),
			"tools":         spec.Registry.Names(),
			"warnings":      spec.Warnings,
		}, "{}"),
		Status: stepStatusSuccess,
	}); err != nil {
		s.failExecutionStart(current, err)
		current.close()
		return execution{}, err
	}
	return current, nil
}

func (s Service) failExecutionStart(execution execution, err error) {
	message := "智能体运行失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	_ = s.repository.CreateStep(context.Background(), stepRecord{
		RunID: execution.runID, RequestID: execution.requestID, Seq: 2,
		Type: "error", Title: "启动失败", Content: message, Payload: "{}", Status: stepStatusFail,
	})
	_ = s.repository.FinishRun(context.Background(), execution.runID, runResult{
		Status: runStatusFail,
		Output: encodeJSON(map[string]any{"event": "error", "text": "", "error": message}, "{}"),
		Error:  message, StepCount: 2,
		Latency: finishedAt.Sub(execution.startedAt).Milliseconds(), FinishedAt: finishedAt,
	})
	if execution.persistChat {
		s.completeRunTurn(execution.requestID, runStatusFail, "", nil, message)
	}
}
