package loop

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type toolArtifactBatch struct {
	service runtimeartifact.Service
	pending []agentmodel.Artifact
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
	selected, err := runtimeprovider.SelectedMediaReferences(arguments, execution.mediaReferences)
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

func (batch toolArtifactBatch) complete(ctx context.Context, result runtimeprovider.Result) runtimeprovider.Result {
	if len(batch.pending) == 0 {
		return result
	}
	content, _ := result.Content.(map[string]any)
	result.Content = batch.service.CompleteBatch(ctx, batch.pending, content)
	if output, ok := result.Content.(map[string]any); ok {
		result.ModelResult = runtimeartifact.ModelOutput(output)
	}
	return result
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
