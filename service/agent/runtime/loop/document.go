package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
)

func (s Service) prepareDocumentModelStep(ctx context.Context, state *runState, result modelStepResult) error {
	if state.documentID == 0 {
		call, found := startDocumentCall(result.ToolCalls)
		if !found {
			return nil
		}
		arguments, err := botprotocol.ToolCallArguments(call)
		if err != nil {
			return fmt.Errorf("解析图文文档参数失败: %w", err)
		}
		document, err := runtimedocument.NewService().Start(ctx, runtimedocument.StartRequest{
			SessionID: state.execution.sessionID,
			MessageID: state.execution.assistantMessageID,
			RunID:     state.execution.runID,
			Title:     strings.TrimSpace(botprotocol.AsText(arguments["title"])),
			Meta: map[string]any{
				"purpose": strings.TrimSpace(botprotocol.AsText(arguments["purpose"])),
			},
		})
		if err != nil {
			return err
		}
		state.documentID = document.ID
		_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
			"event":    "document_start",
			"document": s.documentPayload(ctx, document.ID),
		})
	}

	if state.documentTextStep >= state.modelStep || strings.TrimSpace(result.Text) == "" {
		return nil
	}
	block, err := runtimedocument.NewService().AppendText(ctx, runtimedocument.AppendTextRequest{
		DocumentID: state.documentID,
		SourceKey:  fmt.Sprintf("model:%d", state.modelStep),
		Text:       result.Text,
		Meta:       map[string]any{"model_step": state.modelStep},
	})
	if err != nil {
		return err
	}
	state.documentTextStep = state.modelStep
	if block.ID > 0 {
		_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
			"event":       "block_commit",
			"document_id": state.documentID,
			"block":       runtimedocument.BuildBlockPayload(block, nil),
		})
	}
	return nil
}

func startDocumentCall(calls []botprotocol.ToolCall) (botprotocol.ToolCall, bool) {
	for _, call := range calls {
		if strings.EqualFold(strings.TrimSpace(call.Name), runtimeprovider.StartDocumentToolName) {
			return call, true
		}
	}
	return botprotocol.ToolCall{}, false
}

func (s Service) scheduleDocumentArtifact(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
) toolStepResult {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return documentArtifactError(call, definition, err, nil)
	}
	documents := runtimedocument.NewService()
	block, err := documents.AppendMedia(ctx, runtimedocument.AppendMediaRequest{
		DocumentID: state.documentID,
		SourceKey:  "tool:" + strings.TrimSpace(call.ID),
		Kind:       definition.Kind,
		Meta: map[string]any{
			"tool_name":  call.Name,
			"tool_title": toolTitle(definition, call.Name),
			"arguments":  arguments,
		},
	})
	if err != nil {
		return documentArtifactError(call, definition, err, nil)
	}
	batch, err := s.beginToolArtifactBatch(ctx, state.execution, call, definition, state.documentID, block.ID)
	if err != nil {
		documents.MarkBlockFailed(ctx, block.ID, err.Error())
		return documentArtifactError(call, definition, err, map[string]any{
			"document_id": state.documentID,
			"block_id":    block.ID,
		})
	}
	started := batch.startedOutput(ctx)
	if started == nil {
		started = map[string]any{}
	}
	started["document_id"] = state.documentID
	started["block_id"] = block.ID
	documents.Publish(ctx, state.documentID, "media_block_append", map[string]any{
		"block":     runtimedocument.BuildBlockPayload(block, nil),
		"artifacts": started["artifacts"],
	})
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":       "media_block_append",
		"document_id": state.documentID,
		"block":       runtimedocument.BuildBlockPayload(block, nil),
		"artifacts":   started["artifacts"],
		"meta":        toolEventMeta(call, definition, "running", started),
	})

	job, err := runtimeartifact.NewService().EnqueueJob(ctx, runtimeartifact.JobRequest{
		DocumentID: state.documentID,
		BlockID:    block.ID,
		SessionID:  state.execution.sessionID,
		MessageID:  state.execution.assistantMessageID,
		RunID:      state.execution.runID,
		Call:       call,
		Kind:       definition.Kind,
		Arguments:  arguments,
		Snapshot: runtimeartifact.JobSnapshot{
			Agent: state.execution.agent,
			Transport: runtimeartifact.JobTransport{
				Method: state.execution.transport.Method,
				Host:   state.execution.transport.Host,
				Path:   state.execution.transport.Path,
			},
			MediaReferences: append([]runtimeprovider.MediaReference(nil), state.execution.mediaReferences...),
		},
	})
	if err != nil {
		batch.fail(ctx, err.Error())
		documents.MarkBlockFailed(ctx, block.ID, err.Error())
		return documentArtifactError(call, definition, err, map[string]any{
			"document_id": state.documentID,
			"block_id":    block.ID,
			"artifacts":   batch.startedOutput(ctx)["artifacts"],
		})
	}

	content := map[string]any{
		"document_id": state.documentID,
		"block_id":    block.ID,
		"job_id":      job.ID,
		"status":      "generating",
	}
	result := runtimeprovider.Result{
		Text:        "素材已按当前位置加入文档并在后台生成。请立即继续输出下一段正文；不要等待素材完成。",
		Content:     content,
		ModelResult: content,
	}
	return toolStepResult{
		result:  result,
		content: result.ModelContent(),
		typeKey: "tool",
		title:   "后台生成素材: " + toolTitle(definition, call.Name),
		status:  stepStatusSuccess,
		payload: map[string]any{
			"tool_call": firstToolCallValue(call),
			"output":    content,
			"artifacts": started["artifacts"],
		},
	}
}

func documentArtifactError(call botprotocol.ToolCall, definition runtimeprovider.Definition, err error, output map[string]any) toolStepResult {
	if output == nil {
		output = map[string]any{}
	}
	return toolStepResult{
		err:     err,
		content: toolErrorContent(toolFailureText(definition, err)),
		typeKey: "tool",
		title:   "后台生成素材: " + toolTitle(definition, call.Name),
		status:  stepStatusWarning,
		payload: map[string]any{
			"tool_call": firstToolCallValue(call),
			"output":    output,
			"error":     err.Error(),
		},
	}
}

func (s Service) finalizeDocument(state *runState) {
	if state == nil || state.documentID == 0 {
		return
	}
	ctx := context.Background()
	documents := runtimedocument.NewService()
	document, err := documents.MarkContentComplete(ctx, state.documentID)
	if err != nil || document == nil {
		return
	}
	if text := strings.TrimSpace(documents.Text(ctx, state.documentID)); text != "" {
		state.finalText = text
	}
	if state.finalOutput == nil {
		state.finalOutput = map[string]any{}
	}
	state.finalOutput["text"] = state.finalText
	state.finalOutput["document"] = map[string]any{
		"id":     document.ID,
		"status": document.Status,
		"stream": runtimedocument.StreamRequestID(document.ID),
	}
}

func (s Service) documentPayload(ctx context.Context, documentID uint64) any {
	documents := runtimedocument.NewService()
	snapshot := documents.Snapshot(ctx, documentID)
	if snapshot == nil {
		return nil
	}
	blockIDs := make([]uint64, 0, len(snapshot.Blocks))
	for _, block := range snapshot.Blocks {
		blockIDs = append(blockIDs, block.ID)
	}
	artifacts := runtimeartifact.NewService().BlockPayloadMap(ctx, blockIDs)
	return documents.PayloadFromSnapshot(*snapshot, artifacts)
}

func (s Service) Document(ctx context.Context, documentID uint64) (runtimedocument.Payload, error) {
	snapshot, err := s.requireDocumentAccess(ctx, documentID)
	if err != nil {
		return runtimedocument.Payload{}, err
	}
	blockIDs := make([]uint64, 0, len(snapshot.Blocks))
	for _, block := range snapshot.Blocks {
		blockIDs = append(blockIDs, block.ID)
	}
	artifacts := runtimeartifact.NewService().BlockPayloadMap(ctx, blockIDs)
	documents := runtimedocument.NewService()
	return documents.PayloadFromSnapshot(*snapshot, artifacts), nil
}

func (s Service) ReadDocumentStream(
	ctx context.Context,
	requestID string,
	lastID string,
	count int64,
	block time.Duration,
) ([]frontstream.Entry, error) {
	documentID, err := runtimedocument.ParseStreamRequestID(requestID)
	if err != nil {
		return nil, err
	}
	if _, err = s.requireDocumentAccess(ctx, documentID); err != nil {
		return nil, err
	}
	return runtimedocument.NewService().ReadStream(ctx, documentID, lastID, count, block)
}

func (s Service) requireDocumentAccess(ctx context.Context, documentID uint64) (*runtimedocument.Snapshot, error) {
	snapshot := runtimedocument.NewService().Snapshot(ctx, documentID)
	if snapshot == nil {
		return nil, fmt.Errorf("智能体文档不存在")
	}
	if err := s.chat.RequireSessionAccess(ctx, snapshot.Document.SessionID); err != nil {
		return nil, err
	}
	return snapshot, nil
}
