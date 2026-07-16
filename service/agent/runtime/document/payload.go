package document

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func (s Service) Payload(ctx context.Context, row agentmodel.Document, artifacts ArtifactPayloadMap) Payload {
	blocks := s.repository.blocks(ctx, row.ID)
	return buildPayload(row, blocks, artifacts)
}

func (s Service) PayloadFromSnapshot(snapshot Snapshot, artifacts ArtifactPayloadMap) Payload {
	return buildPayload(snapshot.Document, snapshot.Blocks, artifacts)
}

func (s Service) MessagePayloadMap(ctx context.Context, messageIDs []uint64, artifacts ArtifactPayloadMap) map[uint64]Payload {
	documents := s.repository.byMessages(ctx, messageIDs)
	documentIDs := make([]uint64, 0, len(documents))
	for _, row := range documents {
		documentIDs = append(documentIDs, row.ID)
	}
	blocksByDocument := map[uint64][]agentmodel.DocumentBlock{}
	for _, block := range s.repository.blocksByDocuments(ctx, documentIDs) {
		blocksByDocument[block.DocumentID] = append(blocksByDocument[block.DocumentID], block)
	}
	result := make(map[uint64]Payload, len(documents))
	for _, row := range documents {
		result[row.MessageID] = buildPayload(row, blocksByDocument[row.ID], artifacts)
	}
	return result
}

func buildPayload(row agentmodel.Document, blocks []agentmodel.DocumentBlock, artifacts ArtifactPayloadMap) Payload {
	blockPayloads := make([]BlockPayload, 0, len(blocks))
	pendingJobs := 0
	hasFailedMedia := false
	for _, block := range blocks {
		payload := blockPayload(block, artifacts[block.ID])
		blockPayloads = append(blockPayloads, payload)
		if payload.Type != agentmodel.DocumentBlockTypeMedia {
			continue
		}
		switch payload.Status {
		case agentmodel.DocumentBlockStatusGenerating:
			pendingJobs++
		case agentmodel.DocumentBlockStatusFailed:
			hasFailedMedia = true
		}
	}
	status := projectedDocumentStatus(row.Status, pendingJobs, hasFailedMedia)
	return Payload{
		ID:              row.ID,
		SessionID:       row.SessionID,
		MessageID:       row.MessageID,
		RunID:           row.RunID,
		Title:           row.Title,
		Status:          status,
		BlockCount:      len(blockPayloads),
		PendingJobCount: pendingJobs,
		Meta:            decodeMap(row.Meta),
		Blocks:          blockPayloads,
		CreatedAt:       timeText(row.CreatedAt),
		UpdatedAt:       timeText(row.UpdatedAt),
		CompletedAt:     optionalTimeText(row.CompletedAt),
	}
}

func blockPayload(row agentmodel.DocumentBlock, artifacts []map[string]any) BlockPayload {
	if artifacts == nil {
		artifacts = []map[string]any{}
	}
	return BlockPayload{
		ID:        row.ID,
		Seq:       row.Seq,
		Type:      row.Type,
		Format:    row.Format,
		MediaKind: row.MediaKind,
		Text:      row.Text,
		Status:    projectedBlockStatus(row, artifacts),
		Meta:      decodeMap(row.Meta),
		Artifacts: artifacts,
	}
}

func projectedDocumentStatus(status string, pendingJobs int, hasFailedMedia bool) string {
	if status == agentmodel.DocumentStatusWriting {
		return status
	}
	if pendingJobs > 0 {
		return agentmodel.DocumentStatusGenerating
	}
	if hasFailedMedia {
		return agentmodel.DocumentStatusPartialFailed
	}
	if status == agentmodel.DocumentStatusPartialFailed {
		return status
	}
	return agentmodel.DocumentStatusReady
}

func projectedBlockStatus(row agentmodel.DocumentBlock, artifacts []map[string]any) string {
	if row.Type != agentmodel.DocumentBlockTypeMedia || len(artifacts) == 0 {
		return row.Status
	}
	failed := false
	for _, artifact := range artifacts {
		switch strings.ToLower(strings.TrimSpace(textValue(artifact["status"]))) {
		case "generating", "pending", "running":
			return agentmodel.DocumentBlockStatusGenerating
		case "ready", "success":
			if !hasArtifactURL(artifact) {
				return agentmodel.DocumentBlockStatusGenerating
			}
		case "failed", "fail":
			failed = true
		default:
			return agentmodel.DocumentBlockStatusGenerating
		}
	}
	if failed {
		return agentmodel.DocumentBlockStatusFailed
	}
	return agentmodel.DocumentBlockStatusReady
}

func hasArtifactURL(artifact map[string]any) bool {
	for _, key := range []string{"url", "preview_url", "open_url"} {
		if strings.TrimSpace(textValue(artifact[key])) != "" {
			return true
		}
	}
	return false
}

func textValue(value any) string {
	text, _ := value.(string)
	return text
}

func BuildBlockPayload(row agentmodel.DocumentBlock, artifacts []map[string]any) BlockPayload {
	return blockPayload(row, artifacts)
}
