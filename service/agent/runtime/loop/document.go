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

type persistedDocumentArtifact struct {
	call       botprotocol.ToolCall
	definition runtimeprovider.Definition
	block      agentmodel.DocumentBlock
	batch      toolArtifactBatch
	job        agentmodel.ArtifactJob
}

type persistedDocumentBlock struct {
	block         agentmodel.DocumentBlock
	artifactIndex int
}

func (s Service) executeComposeDocumentStep(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
) toolStepResult {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return composeDocumentError(call, err)
	}
	artifactTools := state.execution.registry.DefinitionsByKind("image", "video", "audio", "file")
	input, err := runtimeprovider.ParseComposeDocument(arguments, artifactTools)
	if err != nil {
		return composeDocumentError(call, err)
	}
	mediaDefinitions := make(map[int]runtimeprovider.Definition)
	for index, current := range input.Blocks {
		if current.Type == "text" {
			continue
		}
		definition, exists := state.execution.registry.Definition(current.Tool)
		if !exists || !runtimeartifact.IsSupportedKind(definition.Kind) {
			return composeDocumentError(call, fmt.Errorf("图文素材工具已不可用: %s", current.Tool))
		}
		if err = state.execution.registry.ValidateArguments(current.Tool, current.Arguments); err != nil {
			return composeDocumentError(call, fmt.Errorf("第 %d 个内容块参数无效: %w", index+1, err))
		}
		mediaDefinitions[index] = definition
	}
	intro := strings.TrimSpace(state.pendingModelText)
	if intro == "" {
		intro = runtimeprovider.ComposeDocumentIntro(input.Title)
	}

	documents := runtimedocument.NewService()
	document := agentmodel.Document{}
	blocks := make([]persistedDocumentBlock, 0, len(input.Blocks))
	artifacts := make([]persistedDocumentArtifact, 0, len(mediaDefinitions))
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
		for index, current := range input.Blocks {
			sourceKey := fmt.Sprintf("compose:block:%d", index+1)
			if current.Type == "text" {
				block, appendErr := documents.AppendText(tx, runtimedocument.AppendTextRequest{
					DocumentID: document.ID,
					SourceKey:  sourceKey,
					Text:       current.Text,
					Meta:       map[string]any{"compose_index": index + 1},
				})
				if appendErr != nil {
					return appendErr
				}
				if block.ID > 0 {
					blocks = append(blocks, persistedDocumentBlock{block: block, artifactIndex: -1})
				}
				continue
			}

			definition := mediaDefinitions[index]
			artifactCall := botprotocol.ToolCall{
				ID:        fmt.Sprintf("compose:%d:%d", state.execution.runID, index+1),
				Type:      "function",
				Name:      current.Tool,
				Arguments: encodeJSON(current.Arguments, "{}"),
			}
			block, appendErr := documents.AppendMedia(tx, runtimedocument.AppendMediaRequest{
				DocumentID: document.ID,
				SourceKey:  sourceKey,
				Kind:       definition.Kind,
				Meta: map[string]any{
					"compose_index": index + 1,
					"tool_name":     current.Tool,
					"tool_title":    toolTitle(definition, current.Tool),
					"arguments":     current.Arguments,
				},
			})
			if appendErr != nil {
				return appendErr
			}
			batch, batchErr := s.beginToolArtifactBatch(tx, state.execution, artifactCall, definition, document.ID, block.ID)
			if batchErr != nil {
				return batchErr
			}
			job, enqueueErr := s.enqueueArtifactJob(tx, state, artifactCall, definition, document.ID, block.ID, true)
			if enqueueErr != nil {
				return enqueueErr
			}
			artifacts = append(artifacts, persistedDocumentArtifact{
				call: artifactCall, definition: definition, block: block, batch: batch, job: job,
			})
			blocks = append(blocks, persistedDocumentBlock{block: block, artifactIndex: len(artifacts) - 1})
		}
		return nil
	})
	if err != nil {
		return composeDocumentError(call, err)
	}
	state.documentID = document.ID
	s.resetVisibleOutput(ctx, state)
	emptyPayload := documents.PayloadFromSnapshot(runtimedocument.Snapshot{Document: document}, nil)
	documents.Publish(ctx, document.ID, "document_start", map[string]any{"document": emptyPayload})
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":    "document_start",
		"document": emptyPayload,
	})

	jobs := make([]map[string]any, 0, len(artifacts))
	artifactService := runtimeartifact.NewService()
	for _, persisted := range blocks {
		blockPayload := runtimedocument.BuildBlockPayload(persisted.block, nil)
		if persisted.artifactIndex < 0 {
			documents.Publish(ctx, document.ID, "block_commit", map[string]any{"block": blockPayload})
			_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
				"event": "block_commit", "document_id": document.ID, "block": blockPayload,
			})
			continue
		}
		artifact := artifacts[persisted.artifactIndex]
		started := artifact.batch.startedOutput(ctx)
		if started == nil {
			started = map[string]any{}
		}
		started["document_id"] = document.ID
		started["block_id"] = artifact.block.ID
		documents.Publish(ctx, document.ID, "media_block_append", map[string]any{
			"block": blockPayload, "artifacts": started["artifacts"],
		})
		_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
			"event":       "media_block_append",
			"document_id": document.ID,
			"block":       blockPayload,
			"artifacts":   started["artifacts"],
			"meta":        toolEventMeta(artifact.call, artifact.definition, "running", started),
		})
		jobs = append(jobs, map[string]any{
			"job_id": artifact.job.ID, "block_id": artifact.block.ID,
			"kind": artifact.definition.Kind, "status": "pending",
		})
	}
	if len(artifacts) > 0 {
		artifactService.DispatchJob(artifacts[0].job.ID)
	}

	content := map[string]any{
		"document_id":   document.ID,
		"block_count":   len(input.Blocks),
		"pending_jobs":  len(jobs),
		"failed_blocks": 0,
		"jobs":          jobs,
	}
	result := runtimeprovider.Result{
		Content:     content,
		ModelResult: map[string]any{"document_id": document.ID, "submitted": true},
		Terminal:    true,
	}
	return toolStepResult{
		result:      result,
		receiptable: true,
		content:     result.ModelContent(),
		typeKey:     "document",
		title:       "提交完整图文",
		status:      stepStatusSuccess,
		payload:     map[string]any{"tool_call": firstToolCallValue(call), "output": content},
	}
}

func (s Service) resetVisibleOutput(ctx context.Context, state *runState) {
	state.lastText = ""
	state.pendingModelText = ""
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event": "reset",
		"text":  "",
	})
}

func composeDocumentError(call botprotocol.ToolCall, err error) toolStepResult {
	return toolStepResult{
		result:      runtimeprovider.Result{},
		err:         err,
		receiptable: true,
		content:     toolErrorContent(err.Error()),
		typeKey:     "document",
		title:       "提交完整图文",
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
