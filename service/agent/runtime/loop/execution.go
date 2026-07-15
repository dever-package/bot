package loop

import (
	"context"
	"fmt"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
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
	current.checkpoint = initialCheckpoint(current)
	snapshot, err := encodeSnapshot(snapshotFromExecution(current))
	if err != nil {
		current.close()
		return execution{}, err
	}
	checkpoint, err := encodeCheckpoint(current.checkpoint)
	if err != nil {
		current.close()
		return execution{}, err
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
		Snapshot:       snapshot,
		Checkpoint:     checkpoint,
		StartedAt:      startedAt,
	}, stepRecord{
		Seq:     1,
		Type:    "input",
		Title:   "用户输入",
		Content: spec.InputText,
		Payload: encodeJSON(map[string]any{
			"history_count": len(spec.History),
			"tools":         spec.Registry.Names(),
			"warnings":      spec.Warnings,
		}, "{}"),
		Status: stepStatusSuccess,
	})
	if err != nil {
		current.close()
		if spec.PersistChat {
			s.completeRunTurn(requestID, runStatusFail, "", nil, err.Error())
		}
		return execution{}, err
	}
	current.runID = runID
	return current, nil
}

func (s Service) enqueueExecution(ctx context.Context, execution execution) error {
	if s.dispatcher == nil {
		return fmt.Errorf("智能体运行调度器未初始化")
	}
	queued, err := s.repository.EnqueueRun(ctx, execution.runID, time.Now())
	if err != nil {
		return err
	}
	if !queued {
		return fmt.Errorf("智能体运行入队失败")
	}
	if err := s.dispatcher.Dispatch(ctx, execution.runID); err != nil {
		logDispatchDeliveryError(execution.runID, err)
	}
	return nil
}

func (s Service) failExecutionStart(execution execution, err error) {
	message := "智能体运行失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	_, _ = s.finishRunAndChat(context.Background(), execution.runID, execution.workerID, execution.persistChat, runResult{
		Status: runStatusFail,
		Output: encodeJSON(map[string]any{"event": "error", "text": "", "error": message}, "{}"),
		Error:  message, StepCount: 1,
		Latency: finishedAt.Sub(execution.startedAt).Milliseconds(), FinishedAt: finishedAt,
	}, runtimechat.RunTurnCompletion{
		RequestID: execution.requestID,
		Status:    runStatusFail,
		Error:     message,
	})
}
