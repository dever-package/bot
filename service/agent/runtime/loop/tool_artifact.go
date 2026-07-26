package loop

import (
	"context"
	"strings"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func isDocumentArtifactTool(state *runState, definition runtimeprovider.Definition) bool {
	return state != nil && state.isDocumentWriter() && runtimeartifact.IsSupportedKind(definition.Kind)
}

type toolArtifactBatch struct {
	service runtimeartifact.Service
	pending []agentmodel.Artifact
}

func shouldEnqueueArtifact(execution execution, definition runtimeprovider.Definition) bool {
	return (execution.persistChat || execution.documentWriter) &&
		execution.sessionID > 0 &&
		execution.assistantMessageID > 0 &&
		runtimeartifact.IsSupportedKind(definition.Kind)
}

func (s Service) enqueueMessageArtifact(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
) toolStepResult {
	batch, batchErr := s.beginToolArtifactBatch(ctx, state.execution, call, definition, 0, 0)
	startedOutput := batch.startedOutput(ctx)
	startedEvent := toolStartedOutput(call, definition, startedOutput)
	state.RecordToolActivity(startedEvent)
	_ = s.writeExecutionOutput(ctx, state.execution, startedEvent)

	if batchErr != nil {
		result := buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, batchErr)
		finishedEvent := toolFinishedOutput(call, definition, result.result, batchErr)
		state.RecordToolActivity(finishedEvent)
		_ = s.writeExecutionOutput(ctx, state.execution, finishedEvent)
		return result
	}
	if recovered, ok := batch.recoveredResult(ctx); ok {
		result := buildToolStepResult(state.execution.registry, call, definition, recovered, nil)
		finishedEvent := toolFinishedOutput(call, definition, recovered, nil)
		state.RecordToolActivity(finishedEvent)
		_ = s.writeExecutionOutput(ctx, state.execution, finishedEvent)
		return result
	}

	job, jobErr := s.enqueueArtifactJob(ctx, state, call, definition, 0, 0, false)
	if jobErr != nil {
		failedContent := batch.fail(ctx, jobErr.Error())
		toolResult := runtimeprovider.Result{Content: failedContent}
		result := buildToolStepResult(state.execution.registry, call, definition, toolResult, jobErr)
		finishedEvent := toolFinishedOutput(call, definition, toolResult, jobErr)
		state.RecordToolActivity(finishedEvent)
		_ = s.writeExecutionOutput(ctx, state.execution, finishedEvent)
		return result
	}

	content := cloneMap(startedOutput)
	if content == nil {
		content = map[string]any{}
	}
	content["job_id"] = job.ID
	content["status"] = "generating"
	modelResult := runtimeartifact.ModelOutput(content)
	modelResult["job_id"] = job.ID
	modelResult["status"] = "generating"
	toolResult := runtimeprovider.Result{
		Content:     content,
		ModelResult: modelResult,
	}
	queuedEvent := toolQueuedOutput(call, definition, content)
	state.RecordToolActivity(queuedEvent)
	_ = s.writeExecutionOutput(ctx, state.execution, queuedEvent)
	result := buildToolStepResult(state.execution.registry, call, definition, toolResult, nil)
	result.title = "后台生成素材: " + toolTitle(definition, call.Name)
	return result
}

func (s Service) enqueueDocumentArtifact(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
) toolStepResult {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, err)
	}
	if err = state.execution.registry.ValidateArguments(call.Name, arguments); err != nil {
		return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, err)
	}

	documents := runtimedocument.NewService()
	block := agentmodel.DocumentBlock{}
	batch := toolArtifactBatch{}
	job := agentmodel.ArtifactJob{}
	err = orm.Transaction(ctx, func(tx context.Context) error {
		tx = runtimedocument.DeferStream(tx)
		block, err = documents.AppendMedia(tx, runtimedocument.AppendMediaRequest{
			DocumentID: state.documentID,
			SourceKey:  "tool:" + strings.TrimSpace(call.ID),
			Kind:       definition.Kind,
			Meta: map[string]any{
				"tool_name":       call.Name,
				"tool_title":      toolTitle(definition, call.Name),
				"arguments":       arguments,
				"requested_count": toolRequestedCount(call, definition),
			},
		})
		if err != nil {
			return err
		}
		batch, err = s.beginToolArtifactBatch(tx, state.execution, call, definition, state.documentID, block.ID)
		if err != nil {
			return err
		}
		job, err = s.enqueueArtifactJob(tx, state, call, definition, state.documentID, block.ID, true)
		return err
	})
	if err != nil {
		return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, err)
	}

	started := batch.startedOutput(ctx)
	if started == nil {
		started = map[string]any{}
	}
	started["document_id"] = state.documentID
	started["block_id"] = block.ID
	started["job_id"] = job.ID
	started["status"] = "generating"
	blockPayload := runtimedocument.BuildBlockPayload(block, artifactValues(started["artifacts"]))
	documents.Publish(ctx, state.documentID, "media_block_append", map[string]any{
		"block":     blockPayload,
		"artifacts": started["artifacts"],
	})
	_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{
		"event":       "media_block_append",
		"document_id": state.documentID,
		"block":       blockPayload,
		"artifacts":   started["artifacts"],
		"meta":        toolEventMeta(call, definition, "running", started),
	})
	runtimeartifact.NewService().DispatchJob(job.ID)

	modelResult := runtimeartifact.ModelOutput(started)
	modelResult["document_id"] = state.documentID
	modelResult["block_id"] = block.ID
	modelResult["job_id"] = job.ID
	modelResult["status"] = "generating"
	toolResult := runtimeprovider.Result{Content: started, ModelResult: modelResult}
	result := buildToolStepResult(state.execution.registry, call, definition, toolResult, nil)
	result.title = "后台生成文档素材: " + toolTitle(definition, call.Name)
	return result
}

func (s Service) enqueueArtifactJob(
	ctx context.Context,
	state *runState,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
	documentID uint64,
	blockID uint64,
	deferDispatch bool,
) (agentmodel.ArtifactJob, error) {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return agentmodel.ArtifactJob{}, err
	}
	return runtimeartifact.NewService().EnqueueJob(ctx, runtimeartifact.JobRequest{
		DocumentID:    documentID,
		BlockID:       blockID,
		SessionID:     state.execution.sessionID,
		MessageID:     state.execution.assistantMessageID,
		RunID:         state.execution.runID,
		Call:          call,
		Kind:          definition.Kind,
		Arguments:     arguments,
		DeferDispatch: deferDispatch,
		Snapshot: runtimeartifact.JobSnapshot{
			Agent:   state.execution.agent,
			Scope:   state.execution.scope,
			Billing: state.execution.billing,
			Transport: runtimeartifact.JobTransport{
				Method: state.execution.transport.Method,
				Host:   state.execution.transport.Host,
				Path:   state.execution.transport.Path,
			},
			MediaReferences: append([]runtimeprovider.MediaReference(nil), state.execution.mediaReferences...),
		},
	})
}

func (s Service) beginToolArtifactBatch(
	ctx context.Context,
	execution execution,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
	documentID uint64,
	blockID uint64,
) (toolArtifactBatch, error) {
	batch := toolArtifactBatch{service: runtimeartifact.NewService()}
	if execution.sessionID == 0 || execution.assistantMessageID == 0 || !runtimeartifact.IsSupportedKind(definition.Kind) {
		return batch, nil
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return batch, err
	}
	if err = execution.registry.ValidateArguments(call.Name, arguments); err != nil {
		return batch, err
	}
	selected, err := runtimeprovider.ArtifactReferences(arguments, execution.mediaReferences)
	if err != nil {
		return batch, err
	}
	sourceIDs := make([]uint64, 0, len(selected))
	seriesID := uint64(0)
	for _, current := range selected {
		if current.ArtifactID > 0 {
			sourceIDs = append(sourceIDs, current.ArtifactID)
		}
		if seriesID == 0 && current.SeriesID > 0 {
			seriesID = current.SeriesID
		}
	}
	profile := cloneToolArguments(arguments)
	delete(profile, runtimeprovider.MediaReferencesArgument)
	delete(profile, runtimeprovider.MediaSeriesModeArgument)
	delete(profile, runtimeprovider.MediaArtifactTitleArgument)
	if key := strings.TrimSpace(definition.ActivityCountKey); key != "" {
		delete(profile, key)
	}
	profile["tool_name"] = call.Name
	profile["tool_kind"] = definition.Kind
	profile["artifact_name"] = toolArtifactName(arguments, definition)
	batch.pending, err = batch.service.BeginBatch(ctx, runtimeartifact.BatchRequest{
		SessionID:         execution.sessionID,
		MessageID:         execution.assistantMessageID,
		RunID:             execution.runID,
		DocumentID:        documentID,
		BlockID:           blockID,
		Kind:              definition.Kind,
		Count:             toolRequestedCount(call, definition),
		Name:              toolArtifactName(arguments, definition),
		BatchKey:          call.ID,
		SeriesID:          seriesID,
		SourceArtifactIDs: sourceIDs,
		Profile:           profile,
	})
	return batch, err
}

func (batch toolArtifactBatch) startedOutput(ctx context.Context) map[string]any {
	if len(batch.pending) == 0 {
		return nil
	}
	return map[string]any{"artifacts": runtimeartifact.Payloads(ctx, batch.pending)}
}

func (batch toolArtifactBatch) recoveredResult(ctx context.Context) (runtimeprovider.Result, bool) {
	if len(batch.pending) == 0 {
		return runtimeprovider.Result{}, false
	}
	for _, artifact := range batch.pending {
		if artifact.Status != agentmodel.ArtifactStatusReady || artifact.FileID == 0 {
			return runtimeprovider.Result{}, false
		}
	}
	output := map[string]any{"artifacts": runtimeartifact.Payloads(ctx, batch.pending)}
	return runtimeprovider.Result{
		Content:     output,
		ModelResult: runtimeartifact.ModelOutput(output),
	}, true
}

func (batch toolArtifactBatch) complete(ctx context.Context, result runtimeprovider.Result) (runtimeprovider.Result, error) {
	if len(batch.pending) == 0 {
		return result, nil
	}
	content, err := batch.service.CompleteBatch(ctx, batch.pending, result.Content)
	if err != nil {
		return result, err
	}
	result.Content = content
	if output, ok := result.Content.(map[string]any); ok {
		result.ModelResult = runtimeartifact.ModelOutput(output)
	}
	return result, nil
}

func (batch toolArtifactBatch) fail(ctx context.Context, message string) map[string]any {
	if len(batch.pending) == 0 {
		return nil
	}
	return map[string]any{"artifacts": batch.service.FailBatch(ctx, batch.pending, message)}
}

func toolResultMediaReferences(content any) []runtimeprovider.MediaReference {
	output, ok := content.(map[string]any)
	if !ok {
		return nil
	}
	values, ok := output["artifacts"].([]map[string]any)
	if !ok {
		if items, currentOK := output["artifacts"].([]any); currentOK {
			values = make([]map[string]any, 0, len(items))
			for _, item := range items {
				if mapped, mappedOK := item.(map[string]any); mappedOK {
					values = append(values, mapped)
				}
			}
		}
	}
	result := make([]runtimeprovider.MediaReference, 0, len(values))
	for _, artifact := range values {
		artifactID := runtimeprovider.ArgumentUint64(artifact, "artifact_id")
		url := strings.TrimSpace(botprotocol.AsText(artifact["url"]))
		if artifactID == 0 || url == "" || botprotocol.AsText(artifact["status"]) != "ready" {
			continue
		}
		result = append(result, runtimeprovider.MediaReference{
			ReferenceType: "artifact",
			ReferenceID:   artifactID,
			ArtifactID:    artifactID,
			FileID:        runtimeprovider.ArgumentUint64(artifact, "file_id"),
			SeriesID:      runtimeprovider.ArgumentUint64(artifact, "series_id"),
			Kind:          strings.TrimSpace(botprotocol.AsText(artifact["kind"])),
			Name:          strings.TrimSpace(botprotocol.AsText(artifact["name"])),
			Label:         strings.TrimSpace(botprotocol.AsText(artifact["label"])),
			URL:           url,
		})
	}
	return result
}

func appendMediaReferences(current []runtimeprovider.MediaReference, values []runtimeprovider.MediaReference) []runtimeprovider.MediaReference {
	seen := make(map[uint64]struct{}, len(current))
	for _, reference := range current {
		if reference.ArtifactID > 0 {
			seen[reference.ArtifactID] = struct{}{}
		}
	}
	for _, reference := range values {
		if len(current) >= runtimeprovider.MaxRuntimeMediaReferences {
			break
		}
		if reference.ArtifactID == 0 {
			continue
		}
		if _, exists := seen[reference.ArtifactID]; exists {
			continue
		}
		seen[reference.ArtifactID] = struct{}{}
		current = append(current, reference)
	}
	return current
}

func toolArtifactName(arguments map[string]any, definition runtimeprovider.Definition) string {
	if value := runtimeprovider.MediaArtifactTitle(arguments); value != "" {
		return value
	}
	if key := strings.TrimSpace(definition.ActivityPromptKey); key != "" {
		if value := strings.TrimSpace(botprotocol.AsText(arguments[key])); value != "" {
			return value
		}
	}
	return strings.TrimSpace(definition.Title)
}

func cloneToolArguments(source map[string]any) map[string]any {
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}
