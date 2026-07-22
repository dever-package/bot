package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
	"github.com/shemic/dever/orm"
)

func (s Service) executeComposeDocumentStep(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
) toolStepResult {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return composeDocumentError(call, err)
	}
	input, err := runtimeprovider.ParseComposeDocument(arguments)
	if err != nil {
		return composeDocumentError(call, err)
	}
	if state.documentID > 0 {
		return composeDocumentError(call, fmt.Errorf("当前运行已经开始生成图文文档"))
	}
	intro := strings.TrimSpace(state.pendingModelText)
	if intro == "" {
		intro = runtimeprovider.ComposeDocumentIntro(input.Title)
	}

	documents := runtimedocument.NewService()
	document := agentmodel.Document{}
	err = orm.Transaction(ctx, func(tx context.Context) error {
		tx = runtimedocument.DeferStream(tx)
		document, err = documents.Start(tx, runtimedocument.StartRequest{
			SessionID: state.execution.sessionID,
			MessageID: state.execution.assistantMessageID,
			RunID:     state.execution.runID,
			Title:     input.Title,
			Meta: map[string]any{
				"purpose": input.Purpose,
				"source":  runtimeprovider.ComposeDocumentToolName,
				"intro":   intro,
			},
		})
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return composeDocumentError(call, err)
	}
	state.documentID = document.ID
	payload := documents.Payload(ctx, document, nil)
	documents.Publish(ctx, document.ID, "document_start", map[string]any{"document": payload})
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":    "document_start",
		"document": payload,
	})

	content := map[string]any{
		"document_id":  document.ID,
		"status":       agentmodel.DocumentStatusWriting,
		"write_target": "document",
	}
	result := runtimeprovider.Result{
		Content: content,
		ModelResult: map[string]any{
			"document_id":  document.ID,
			"status":       agentmodel.DocumentStatusWriting,
			"write_target": "document",
		},
	}
	return toolStepResult{
		result:      result,
		receiptable: true,
		content:     result.ModelContent(),
		typeKey:     "document",
		title:       "开始生成图文",
		status:      stepStatusSuccess,
		payload:     map[string]any{"tool_call": firstToolCallValue(call), "output": content},
	}
}

func (s Service) persistSynchronousDocumentText(ctx context.Context, state *runState, text string) error {
	if state == nil || state.documentID == 0 || strings.TrimSpace(text) == "" {
		return nil
	}
	documents := runtimedocument.NewService()
	block, _, err := documents.BeginTextStream(ctx, runtimedocument.AppendTextRequest{
		DocumentID: state.documentID,
		SourceKey:  fmt.Sprintf("%s%d", documentTextSourceKeyPrefix, state.modelStep),
		Text:       text,
		Meta:       map[string]any{"model_step": state.modelStep},
	})
	if err != nil {
		return err
	}
	return s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":       "block_commit",
		"document_id": state.documentID,
		"block":       runtimedocument.BuildBlockPayload(block, nil),
	})
}

func documentHasText(ctx context.Context, documentID uint64) bool {
	return documentID > 0 && strings.TrimSpace(runtimedocument.NewService().Text(ctx, documentID)) != ""
}

func composeDocumentError(call botprotocol.ToolCall, err error) toolStepResult {
	return toolStepResult{
		result:      runtimeprovider.Result{},
		err:         err,
		receiptable: true,
		content:     toolErrorContent(err.Error()),
		typeKey:     "document",
		title:       "开始生成图文",
		status:      stepStatusWarning,
		payload:     map[string]any{"tool_call": firstToolCallValue(call), "error": err.Error()},
	}
}

func (s Service) finalizeDocument(state *runState) error {
	if state == nil || state.documentID == 0 {
		return nil
	}
	ctx, cancel := maintenanceContext()
	defer cancel()
	serverContext, err := state.execution.scope.Server(ctx, nil)
	if err != nil {
		return err
	}
	if serverContext != nil {
		ctx = serverContext.Context()
	}
	documents := runtimedocument.NewService()
	document, err := documents.MarkContentComplete(ctx, state.documentID)
	if err != nil {
		return err
	}
	if document == nil {
		return fmt.Errorf("完成图文文档失败")
	}
	if text := strings.TrimSpace(documents.Text(ctx, state.documentID)); text != "" {
		state.finalText = text
	}
	if state.finalOutput == nil {
		state.finalOutput = map[string]any{}
	}
	state.finalOutput["text"] = state.finalText
	state.finalOutput["document"] = s.documentPayload(ctx, document.ID)
	if state.finalOutput["document"] == nil {
		state.finalOutput["document"] = map[string]any{
			"id":     document.ID,
			"status": document.Status,
			"stream": runtimedocument.StreamRequestID(document.ID),
		}
	}
	return nil
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
