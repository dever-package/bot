package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
	"github.com/shemic/dever/orm"
)

var errDocumentWriterStatusPersistence = errors.New("文档子运行终态尚未持久化")

const documentWriterStartedEvent = "document_writer_started"

func (state *runState) isDocumentWriter() bool {
	return state != nil && state.execution.documentWriter && state.documentID > 0
}

func (state *runState) documentWriteID() uint64 {
	if !state.isDocumentWriter() {
		return 0
	}
	return state.documentID
}

func (s Service) executeComposeDocumentStep(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
) toolStepResult {
	if state.pendingIndex < len(state.pendingTools)-1 {
		return composeDocumentError(call, fmt.Errorf("compose_document 必须是本轮最后一个工具调用"))
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return composeDocumentError(call, err)
	}
	suggestionMode := agentmodel.NormalizeSuggestionMode(state.execution.agent.SuggestionMode)
	input, err := runtimeprovider.ParseComposeDocument(arguments, suggestionMode)
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
				"purpose":            input.Purpose,
				"source":             runtimeprovider.ComposeDocumentToolName,
				"intro":              intro,
				"media_requirements": input.MediaRequirements,
				"required_media":     input.RequiredMediaCounts(),
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
	state.documentDeliveryReady = false
	state.documentTextSourceKey = ""
	payload := documents.Payload(ctx, document, nil)
	documents.Publish(ctx, document.ID, "document_start", map[string]any{"document": payload})
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":    "document_start",
		"document": payload,
	})

	writer, writerErr := s.runDocumentWriter(ctx, state, call, input, document)
	if writerErr != nil {
		state.documentDeliveryReady = false
		if suggestionMode == agentmodel.SuggestionModeAfterResult {
			state.requireTool(runtimeprovider.PresentSuggestionsToolName)
			return composeDocumentWriterError(call, document.ID, writerErr)
		}
		presentation := runtimeprovider.DocumentFailurePresentation(
			input.Title,
			suggestionMode == agentmodel.SuggestionModeInstant,
		)
		return composeDocumentTerminalStep(call, document, writer, presentation, suggestionMode, writerErr)
	}
	state.documentDeliveryReady = true
	if suggestionMode != agentmodel.SuggestionModeAfterResult {
		presentation := runtimeprovider.DocumentCompletionPresentation(
			input.Title,
			writer.Status,
			writer.Coverage.RequiredTotal(),
		)
		if input.FollowUp != nil {
			presentation.Items = append([]map[string]any(nil), input.FollowUp.Items...)
		}
		return composeDocumentTerminalStep(call, document, writer, presentation, suggestionMode, nil)
	}
	state.requireTool(runtimeprovider.PresentSuggestionsToolName)
	content := composeDocumentResultContent(document, writer)
	content["completion_message"] = runtimeprovider.DocumentCompletionPresentation(
		input.Title,
		writer.Status,
		writer.Coverage.RequiredTotal(),
	).Message
	content["presentation_tool"] = runtimeprovider.PresentSuggestionsToolName
	modelResult := composeDocumentModelResult(content, writer)
	result := runtimeprovider.Result{
		Content:     content,
		ModelResult: modelResult,
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

func composeDocumentTerminalStep(
	call botprotocol.ToolCall,
	document agentmodel.Document,
	writer documentWriterResult,
	presentation runtimeprovider.SuggestionPresentation,
	suggestionMode string,
	writerErr error,
) toolStepResult {
	content := composeDocumentResultContent(document, writer)
	content["suggestion_mode"] = suggestionMode
	content["completion_message"] = presentation.Message
	status := stepStatusSuccess
	if writerErr != nil {
		content["status"] = agentmodel.DocumentStatusFailed
		content["error"] = writerErr.Error()
		status = stepStatusWarning
	}
	modelResult := composeDocumentModelResult(content, writer)
	result := runtimeprovider.Result{
		Text:         presentation.Message,
		Content:      content,
		ModelResult:  modelResult,
		Presentation: presentation.Output(),
		Terminal:     true,
	}
	return toolStepResult{
		result:      result,
		receiptable: true,
		content:     result.ModelContent(),
		typeKey:     "document",
		title:       "生成完整图文",
		status:      status,
		payload:     map[string]any{"tool_call": firstToolCallValue(call), "output": content},
	}
}

func composeDocumentResultContent(document agentmodel.Document, writer documentWriterResult) map[string]any {
	return map[string]any{
		"document_id":    document.ID,
		"writer_run_id":  writer.RunID,
		"title":          document.Title,
		"status":         writer.Status,
		"media_coverage": writer.Coverage.Payload(),
	}
}

func composeDocumentModelResult(content map[string]any, writer documentWriterResult) map[string]any {
	modelResult := cloneMap(content)
	if strings.TrimSpace(writer.Text) != "" {
		modelResult["document_body"] = writer.Text
	}
	return modelResult
}

type documentWriterResult struct {
	RunID    uint64
	Status   string
	Text     string
	Coverage runtimedocument.MediaCoverage
}

func (s Service) runDocumentWriter(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
	input runtimeprovider.ComposeDocumentInput,
	document agentmodel.Document,
) (documentWriterResult, error) {
	requestID := documentWriterRequestID(state.execution.requestID, call.ID)
	var row *agentmodel.Run
	for row == nil {
		var err error
		row, err = state.repository.FindRunByRequestIDOptional(ctx, requestID)
		if err != nil {
			if waitErr := waitDocumentWriterRetry(ctx); waitErr != nil {
				return documentWriterResult{}, waitErr
			}
			continue
		}
		if row != nil {
			break
		}
		execution, createErr := s.createDocumentWriterExecution(ctx, state, input, document, requestID)
		if createErr != nil {
			row, err = state.repository.FindRunByRequestIDOptional(ctx, requestID)
			if err != nil || row == nil {
				if waitErr := waitDocumentWriterRetry(ctx); waitErr != nil {
					return documentWriterResult{}, waitErr
				}
				continue
			}
		} else {
			if _, err = s.startExecutionStream(ctx, execution); err != nil {
				s.failExecutionStart(execution, err)
			} else if err = s.enqueueExecution(ctx, execution); err != nil {
				s.failExecutionStart(execution, err)
			}
			execution.close()
			row = &agentmodel.Run{ID: execution.runID, RequestID: execution.requestID, Status: runStatusPending}
		}
	}
	return s.waitDocumentWriter(ctx, state, row.ID, document.ID)
}

func (s Service) createDocumentWriterExecution(
	ctx context.Context,
	state *runState,
	input runtimeprovider.ComposeDocumentInput,
	document agentmodel.Document,
	requestID string,
) (execution, error) {
	history := documentWriterInheritedHistory(state)
	inputValue := runtimeEventInput(documentWriterStartedEvent, map[string]any{
		"document_id":          document.ID,
		"title":                input.Title,
		"purpose":              input.Purpose,
		"content_requirements": input.ContentRequirements,
		"media_requirements":   input.MediaRequirements,
		"output_contract":      runtimeprovider.ComposeDocumentOutputContract,
	})
	return s.createExecution(ctx, requestID, executionSpec{
		Agent:                 state.execution.agent,
		Power:                 state.execution.power,
		ModelLimits:           state.execution.modelLimits,
		SessionID:             state.execution.sessionID,
		AssistantMessageID:    state.execution.assistantMessageID,
		Prompt:                state.execution.prompt,
		Input:                 inputValue,
		RecordInput:           inputValue,
		InputText:             "生成文档：" + input.Title,
		History:               history,
		Transport:             state.execution.transport,
		PersistChat:           false,
		MediaReferences:       append([]runtimeprovider.MediaReference(nil), state.execution.mediaReferences...),
		Scope:                 state.execution.scope,
		Billing:               state.execution.billing,
		RequestedAt:           time.Now(),
		PriorKnowledgeUsed:    state.knowledgeUsed,
		PriorKnowledgeNodeIDs: sortedKnowledgeNodeIDs(state.knowledgeNodeIDs),
		PriorLoadedSkills:     append([]agentmodel.LoadedSkillRef(nil), state.loaded...),
		DocumentID:            document.ID,
		DocumentWriter:        true,
	})
}

func documentWriterInheritedHistory(state *runState) []any {
	if state == nil {
		return nil
	}
	priorHistory, _ := splitCurrentRunHistory(state.execution, state.history)
	return append([]any(nil), priorHistory...)
}

func (s Service) waitDocumentWriter(
	ctx context.Context,
	state *runState,
	runID uint64,
	documentID uint64,
) (documentWriterResult, error) {
	for {
		row, err := state.repository.FindRunByID(ctx, runID)
		if err != nil {
			if waitErr := waitDocumentWriterRetry(ctx); waitErr != nil {
				return documentWriterResult{}, waitErr
			}
			continue
		}
		if isTerminalRunStatus(row.Status) {
			result, resultErr := s.documentWriterTerminalResult(state, row, documentID)
			if !errors.Is(resultErr, errDocumentWriterStatusPersistence) {
				return result, resultErr
			}
			if waitErr := waitDocumentWriterRetry(ctx); waitErr != nil {
				return documentWriterResult{}, waitErr
			}
			continue
		}
		if waitErr := waitDocumentWriterRetry(ctx); waitErr != nil {
			return documentWriterResult{}, waitErr
		}
	}
}

func (s Service) documentWriterTerminalResult(state *runState, row agentmodel.Run, documentID uint64) (documentWriterResult, error) {
	ctx, cancel, err := documentMaintenanceContext(state)
	if err != nil {
		return documentWriterResult{}, fmt.Errorf("%w: %v", errDocumentWriterStatusPersistence, err)
	}
	defer cancel()
	documents := runtimedocument.NewService()
	if row.Status != runStatusSuccess {
		message := strings.TrimSpace(row.Error)
		if message == "" {
			message = "文档子运行失败"
		}
		if err = persistDocumentWriterFailure(ctx, documents, documentID, message); err != nil {
			return documentWriterResult{}, err
		}
		return documentWriterResult{RunID: row.ID}, fmt.Errorf("%s", message)
	}
	text := strings.TrimSpace(documents.Text(ctx, documentID))
	if text == "" {
		if err = persistDocumentWriterFailure(ctx, documents, documentID, "文档子运行未生成正文"); err != nil {
			return documentWriterResult{}, err
		}
		return documentWriterResult{RunID: row.ID}, fmt.Errorf("文档子运行未生成正文")
	}
	document := documents.Find(ctx, documentID)
	if document == nil {
		return documentWriterResult{RunID: row.ID}, fmt.Errorf("%w: 读取文档子运行结果失败", errDocumentWriterStatusPersistence)
	}
	if document.Status == agentmodel.DocumentStatusWriting {
		document, err = documents.MarkContentComplete(ctx, documentID)
		if err != nil {
			return documentWriterResult{RunID: row.ID}, fmt.Errorf("%w: 补全文档子运行终态失败: %v", errDocumentWriterStatusPersistence, err)
		}
		if document == nil {
			return documentWriterResult{RunID: row.ID}, fmt.Errorf("%w: 补全文档子运行终态后记录不存在", errDocumentWriterStatusPersistence)
		}
	}
	switch document.Status {
	case agentmodel.DocumentStatusGenerating,
		agentmodel.DocumentStatusReady,
		agentmodel.DocumentStatusPartialFailed:
		return documentWriterResult{
			RunID:    row.ID,
			Status:   document.Status,
			Text:     text,
			Coverage: documents.MediaCoverage(ctx, documentID),
		}, nil
	case agentmodel.DocumentStatusFailed:
		return documentWriterResult{RunID: row.ID}, fmt.Errorf("文档子运行生成失败")
	default:
		return documentWriterResult{RunID: row.ID}, fmt.Errorf("%w: 文档子运行状态无效: %s", errDocumentWriterStatusPersistence, document.Status)
	}
}

func persistDocumentWriterFailure(
	ctx context.Context,
	documents runtimedocument.Service,
	documentID uint64,
	message string,
) error {
	if document := documents.Find(ctx, documentID); document != nil && document.Status == agentmodel.DocumentStatusFailed {
		return nil
	}
	if _, err := documents.MarkFailed(ctx, documentID, message); err != nil {
		return fmt.Errorf("%w: %v", errDocumentWriterStatusPersistence, err)
	}
	return nil
}

func waitDocumentWriterRetry(ctx context.Context) error {
	timer := time.NewTimer(250 * time.Millisecond)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

func documentWriterRequestID(parentRequestID string, toolCallID string) string {
	value := strings.TrimSpace(parentRequestID) + ":document_writer:" + strings.TrimSpace(toolCallID)
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(value)).String()
}

func (s Service) persistSynchronousDocumentText(ctx context.Context, state *runState, text string) error {
	if !state.isDocumentWriter() || strings.TrimSpace(text) == "" {
		return nil
	}
	documents := runtimedocument.NewService()
	block, _, err := documents.BeginTextStream(ctx, runtimedocument.AppendTextRequest{
		DocumentID: state.documentID,
		SourceKey:  currentDocumentTextSourceKey(state),
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
	return strings.TrimSpace(currentDocumentText(ctx, documentID)) != ""
}

func documentHasFailed(ctx context.Context, documentID uint64) bool {
	document := runtimedocument.NewService().Find(ctx, documentID)
	return document != nil && document.Status == agentmodel.DocumentStatusFailed
}

func currentDocumentText(ctx context.Context, documentID uint64) string {
	if documentID == 0 {
		return ""
	}
	return runtimedocument.NewService().Text(ctx, documentID)
}

func documentModelTextSourceKey(modelStep int) string {
	return fmt.Sprintf("%s%d", documentTextSourceKeyPrefix, modelStep)
}

func currentDocumentTextSourceKey(state *runState) string {
	if state == nil {
		return ""
	}
	if sourceKey := strings.TrimSpace(state.documentTextSourceKey); sourceKey != "" {
		return sourceKey
	}
	return documentModelTextSourceKey(state.modelStep)
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

func composeDocumentWriterError(call botprotocol.ToolCall, documentID uint64, err error) toolStepResult {
	result := composeDocumentError(call, err)
	result.content = toolErrorContent(err.Error())
	result.payload = map[string]any{
		"tool_call":   firstToolCallValue(call),
		"document_id": documentID,
		"error":       err.Error(),
	}
	return result
}

func (s Service) prepareDocumentResult(state *runState, runStatus string, failureMessage string) error {
	if state == nil || state.documentID == 0 {
		return nil
	}
	ctx, cancel, err := documentMaintenanceContext(state)
	if err != nil {
		return err
	}
	defer cancel()
	documents := runtimedocument.NewService()
	document := documents.Find(ctx, state.documentID)
	if state.isDocumentWriter() {
		if runStatus == runStatusSuccess {
			document, err = documents.MarkContentComplete(ctx, state.documentID)
		} else {
			document, err = documents.MarkFailed(ctx, state.documentID, failureMessage)
		}
		if err != nil {
			return err
		}
	}
	if document == nil {
		return fmt.Errorf("读取图文文档失败")
	}
	if state.isDocumentWriter() && runStatus == runStatusSuccess {
		text := strings.TrimSpace(documents.Text(ctx, state.documentID))
		if text == "" {
			return fmt.Errorf("图文文档正文为空")
		}
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

func documentMaintenanceContext(state *runState) (context.Context, context.CancelFunc, error) {
	ctx, cancel := maintenanceContext()
	if state == nil {
		return ctx, cancel, nil
	}
	serverContext, err := state.execution.scope.Server(ctx, nil)
	if err != nil {
		cancel()
		return ctx, cancel, err
	}
	if serverContext != nil {
		ctx = serverContext.Context()
	}
	return ctx, cancel, nil
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
