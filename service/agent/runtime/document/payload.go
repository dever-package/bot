package document

import (
	"context"

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
	for _, block := range blocks {
		blockPayloads = append(blockPayloads, blockPayload(block, artifacts[block.ID]))
	}
	return Payload{
		ID:              row.ID,
		SessionID:       row.SessionID,
		MessageID:       row.MessageID,
		RunID:           row.RunID,
		Title:           row.Title,
		Status:          row.Status,
		BlockCount:      row.BlockCount,
		PendingJobCount: row.PendingJobCount,
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
		Status:    row.Status,
		Meta:      decodeMap(row.Meta),
		Artifacts: artifacts,
	}
}

func BuildBlockPayload(row agentmodel.DocumentBlock, artifacts []map[string]any) BlockPayload {
	return blockPayload(row, artifacts)
}
