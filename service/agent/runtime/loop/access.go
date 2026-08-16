package loop

import (
	"context"
	"fmt"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type RunExecutionSelection struct {
	ModelTargetID       uint64
	PowerPolicy         runtimetool.PowerPolicy
	InteractionToolName string
	InteractionToolArgs map[string]any
	MediaReferences     []runtimeprovider.MediaReference
}

func (s Service) RequireSessionScope(ctx context.Context, sessionID uint64, agentKey string, contextKey string) error {
	return s.chat.RequireSessionScope(ctx, sessionID, agentKey, contextKey)
}

func (s Service) RequireRunScope(ctx context.Context, requestID string, agentKey string, contextKey string) error {
	return s.chat.RequireRunScope(ctx, requestID, agentKey, contextKey)
}

func (s Service) RequireRunExecutionSelection(
	ctx context.Context,
	requestID string,
	agentKey string,
	contextKey string,
) (RunExecutionSelection, error) {
	if err := s.chat.RequireRunScope(ctx, requestID, agentKey, contextKey); err != nil {
		return RunExecutionSelection{}, err
	}
	run, err := s.repository.FindRunByRequestID(ctx, requestID)
	if err != nil {
		return RunExecutionSelection{}, err
	}
	snapshot, err := decodeSnapshot(run.Snapshot)
	if err != nil {
		return RunExecutionSelection{}, fmt.Errorf("读取交互来源运行失败: %w", err)
	}
	checkpoint, err := decodeCheckpoint(run.Checkpoint)
	if err != nil {
		return RunExecutionSelection{}, fmt.Errorf("读取交互来源状态失败: %w", err)
	}
	interactionToolName := checkpoint.InteractionToolName
	interactionToolArgs := cloneMap(checkpoint.InteractionToolArgs)
	if interactionToolName == "" {
		interactionToolName, interactionToolArgs = interactionStepExecution(
			s.repository.ListStepsByRun(ctx, []uint64{run.ID})[run.ID],
		)
	}
	mediaReferences := mergeRuntimeMediaReferences(
		snapshot.MediaReferences,
		checkpoint.MediaDelta,
	)
	return RunExecutionSelection{
		ModelTargetID:       snapshot.ModelTargetID,
		PowerPolicy:         snapshot.PowerPolicy.Normalize(),
		InteractionToolName: interactionToolName,
		InteractionToolArgs: interactionToolArgs,
		MediaReferences:     mediaReferences,
	}, nil
}

func (s Service) RequireInteractionRunExecutionSelection(
	ctx context.Context,
	sessionID uint64,
	agentKey string,
	contextKey string,
	interactionID string,
) (RunExecutionSelection, error) {
	source, err := s.chat.RequireInteractionSource(
		ctx,
		sessionID,
		agentKey,
		contextKey,
		interactionID,
	)
	if err != nil {
		return RunExecutionSelection{}, err
	}
	return s.RequireRunExecutionSelection(ctx, source.RequestID, agentKey, contextKey)
}

func interactionStepExecution(steps []agentmodel.Step) (string, map[string]any) {
	for index := len(steps) - 1; index >= 0; index-- {
		if steps[index].Type != "interaction" {
			continue
		}
		payload, _ := decodeJSON(steps[index].Payload).(map[string]any)
		calls := botprotocol.ParseToolCalls([]any{payload["tool_call"]})
		if len(calls) == 0 {
			return "", nil
		}
		arguments, _ := botprotocol.ToolCallArguments(calls[0])
		return calls[0].Name, arguments
	}
	return "", nil
}

func (s Service) RequireDocumentScope(ctx context.Context, documentID uint64, agentKey string, contextKey string) error {
	snapshot, err := s.requireDocumentAccess(ctx, documentID)
	if err != nil {
		return err
	}
	return s.chat.RequireSessionScope(ctx, snapshot.Document.SessionID, agentKey, contextKey)
}

func (s Service) RequireDocumentStreamScope(ctx context.Context, requestID string, agentKey string, contextKey string) error {
	documentID, err := runtimedocument.ParseStreamRequestID(requestID)
	if err != nil {
		return err
	}
	return s.RequireDocumentScope(ctx, documentID, agentKey, contextKey)
}
