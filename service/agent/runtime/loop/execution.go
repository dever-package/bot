package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type executionSpec struct {
	Agent                 agentmodel.Agent
	Power                 energonmodel.Power
	ModelLimits           energonservice.ModelLimits
	SessionID             uint64
	AssistantMessageID    uint64
	Prompt                string
	Input                 map[string]any
	RecordInput           map[string]any
	InputText             string
	History               []any
	Transport             modelTransport
	PersistChat           bool
	OnStream              func(map[string]any)
	MediaReferences       []runtimeprovider.MediaReference
	Scope                 runtimescope.Scope
	Billing               botprotocol.BillingContext
	RequestedAt           time.Time
	PriorKnowledgeUsed    bool
	PriorKnowledgeNodeIDs []uint64
	PriorLoadedSkills     []agentmodel.LoadedSkillRef
	RequiredToolName      string
	DocumentID            uint64
	DocumentWriter        bool
}

func (s Service) createExecution(ctx context.Context, requestID string, spec executionSpec) (_ execution, resultErr error) {
	defer func() {
		if resultErr != nil && spec.PersistChat {
			s.completeRunTurn(requestID, runStatusFail, "", nil, resultErr.Error())
		}
	}()
	startedAt := time.Now()
	requestedAt := spec.RequestedAt
	if requestedAt.IsZero() {
		requestedAt = startedAt
	}
	runtimeAgent := spec.Agent
	runtimeConfig := runtimeconfig.Load(ctx)
	// The assembled prompt is persisted separately and is the only prompt used
	// after preparation. Avoid copying the original setting into every snapshot.
	runtimeAgent.Prompt = ""
	current := execution{
		requestID:            requestID,
		requestedAt:          requestedAt,
		startedAt:            startedAt,
		agent:                runtimeAgent,
		power:                spec.Power,
		modelLimits:          spec.ModelLimits,
		workingContextTokens: runtimeConfig.WorkingContextTokens,
		sessionID:            spec.SessionID,
		assistantMessageID:   spec.AssistantMessageID,
		prompt:               spec.Prompt,
		input:                spec.Input,
		history:              spec.History,
		transport:            spec.Transport,
		persistChat:          spec.PersistChat,
		onStream:             spec.OnStream,
		mediaReferences:      append([]runtimeprovider.MediaReference(nil), spec.MediaReferences...),
		snapshotHistoryLen:   len(spec.History),
		snapshotMediaLen:     len(spec.MediaReferences),
		scope:                spec.Scope,
		billing:              spec.Billing,
		priorKnowledgeUsed:   spec.PriorKnowledgeUsed,
		documentID:           spec.DocumentID,
		documentWriter:       spec.DocumentWriter,
	}
	current.checkpoint = initialCheckpoint(current)
	current.checkpoint.RequiredToolName = strings.TrimSpace(spec.RequiredToolName)
	current.checkpoint.KnowledgeNodeIDs = sortedKnowledgeNodeIDs(knowledgeNodeIDSet(spec.PriorKnowledgeNodeIDs))
	current.checkpoint.LoadedSkills = agentmodel.NormalizeLoadedSkillRefs(spec.PriorLoadedSkills)
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
	inputStepTitle := "用户输入"
	if runtimeEventType(spec.Input) == runtimeEventSessionStarted {
		inputStepTitle = "会话开始"
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
		Title:   inputStepTitle,
		Content: spec.InputText,
		Payload: encodeJSON(map[string]any{
			"history_count": len(spec.History),
			"timing":        preparationTiming(requestedAt, startedAt),
		}, "{}"),
		Status: stepStatusSuccess,
	})
	if err != nil {
		current.close()
		return execution{}, err
	}
	current.runID = runID
	current.billing.RunID = runID
	return current, nil
}

func (s Service) enqueueExecution(ctx context.Context, execution execution) error {
	dispatcher := s.executionDispatcher()
	if dispatcher == nil {
		return fmt.Errorf("智能体运行调度器未初始化")
	}
	queued, err := s.repository.EnqueueRun(ctx, execution.runID, time.Now())
	if err != nil {
		return err
	}
	if !queued {
		return fmt.Errorf("智能体运行入队失败")
	}
	if err := dispatcher.Dispatch(ctx, execution.runID); err != nil {
		logDispatchDeliveryError(execution.runID, err)
	}
	return nil
}

func (s Service) executionDispatcher() runtimequeue.Dispatcher {
	if s.dispatcher != nil {
		return s.dispatcher
	}
	// The global dispatcher keeps a value copy of Service as its executor. That
	// copy is created before NewService assigns dispatcher, so child runs must
	// resolve the already-started durable dispatcher instead of using the empty
	// copied field.
	return defaultRunDispatcher(s, newRunBacklog())
}

func (s Service) failExecutionStart(execution execution, err error) {
	message := "智能体运行失败"
	if err != nil {
		message = err.Error()
	}
	finishedAt := time.Now()
	ctx, cancel := maintenanceContext()
	defer cancel()
	_, _ = s.finishRunAndChat(ctx, execution.runID, execution.workerID, execution.persistChat, runResult{
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
