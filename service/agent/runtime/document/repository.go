package document

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type repository struct{}

func (repository) create(ctx context.Context, values map[string]any) (agentmodel.Document, error) {
	id := uint64(agentmodel.NewDocumentModel().Insert(ctx, values))
	if id == 0 {
		return agentmodel.Document{}, fmt.Errorf("创建智能体文档失败")
	}
	row := agentmodel.NewDocumentModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return agentmodel.Document{}, fmt.Errorf("读取智能体文档失败")
	}
	return *row, nil
}

func (repository) update(ctx context.Context, id uint64, values map[string]any) *agentmodel.Document {
	if id == 0 {
		return nil
	}
	values["updated_at"] = time.Now()
	agentmodel.NewDocumentModel().Update(ctx, map[string]any{"id": id}, values)
	return agentmodel.NewDocumentModel().Find(ctx, map[string]any{"id": id})
}

func (repository) find(ctx context.Context, id uint64) *agentmodel.Document {
	if id == 0 {
		return nil
	}
	return agentmodel.NewDocumentModel().Find(ctx, map[string]any{"id": id})
}

func (repository) byMessage(ctx context.Context, messageID uint64) *agentmodel.Document {
	if messageID == 0 {
		return nil
	}
	return agentmodel.NewDocumentModel().Find(ctx, map[string]any{"message_id": messageID})
}

func (repository) byMessages(ctx context.Context, messageIDs []uint64) []agentmodel.Document {
	messageIDs = uniqueIDs(messageIDs)
	if len(messageIDs) == 0 {
		return []agentmodel.Document{}
	}
	rows := agentmodel.NewDocumentModel().Select(ctx, map[string]any{"message_id": messageIDs}, map[string]any{
		"order": "main.message_id asc,main.id asc",
	})
	result := make([]agentmodel.Document, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (repository) createBlock(ctx context.Context, values map[string]any) (agentmodel.DocumentBlock, error) {
	id := uint64(agentmodel.NewDocumentBlockModel().Insert(ctx, values))
	if id == 0 {
		return agentmodel.DocumentBlock{}, fmt.Errorf("创建智能体文档内容失败")
	}
	row := agentmodel.NewDocumentBlockModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return agentmodel.DocumentBlock{}, fmt.Errorf("读取智能体文档内容失败")
	}
	return *row, nil
}

func (repository) updateBlock(ctx context.Context, id uint64, values map[string]any) *agentmodel.DocumentBlock {
	if id == 0 {
		return nil
	}
	values["updated_at"] = time.Now()
	agentmodel.NewDocumentBlockModel().Update(ctx, map[string]any{"id": id}, values)
	return agentmodel.NewDocumentBlockModel().Find(ctx, map[string]any{"id": id})
}

func (repository) findBlock(ctx context.Context, id uint64) *agentmodel.DocumentBlock {
	if id == 0 {
		return nil
	}
	return agentmodel.NewDocumentBlockModel().Find(ctx, map[string]any{"id": id})
}

func (repository) blockBySource(ctx context.Context, documentID uint64, sourceKey string) *agentmodel.DocumentBlock {
	if documentID == 0 || strings.TrimSpace(sourceKey) == "" {
		return nil
	}
	return agentmodel.NewDocumentBlockModel().Find(ctx, map[string]any{
		"document_id": documentID,
		"source_key":  strings.TrimSpace(sourceKey),
	})
}

func (repository) blocks(ctx context.Context, documentID uint64) []agentmodel.DocumentBlock {
	if documentID == 0 {
		return []agentmodel.DocumentBlock{}
	}
	return collectBlocks(agentmodel.NewDocumentBlockModel().Select(ctx, map[string]any{
		"document_id": documentID,
	}, map[string]any{"order": "main.seq asc,main.id asc"}))
}

func (repository) blocksByDocuments(ctx context.Context, documentIDs []uint64) []agentmodel.DocumentBlock {
	documentIDs = uniqueIDs(documentIDs)
	if len(documentIDs) == 0 {
		return []agentmodel.DocumentBlock{}
	}
	return collectBlocks(agentmodel.NewDocumentBlockModel().Select(ctx, map[string]any{
		"document_id": documentIDs,
	}, map[string]any{"order": "main.document_id asc,main.seq asc,main.id asc"}))
}

func (repository) nextSeq(ctx context.Context, documentID uint64) int {
	rows := agentmodel.NewDocumentBlockModel().Select(ctx, map[string]any{"document_id": documentID}, map[string]any{
		"order": "main.seq desc,main.id desc",
		"limit": 1,
	})
	if len(rows) == 0 || rows[0] == nil {
		return 1
	}
	return rows[0].Seq + 1
}

func (repository) jobs(ctx context.Context, documentID uint64) []agentmodel.ArtifactJob {
	if documentID == 0 {
		return []agentmodel.ArtifactJob{}
	}
	rows := agentmodel.NewArtifactJobModel().Select(ctx, map[string]any{"document_id": documentID}, map[string]any{
		"order": "main.id asc",
	})
	result := make([]agentmodel.ArtifactJob, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func collectBlocks(rows []*agentmodel.DocumentBlock) []agentmodel.DocumentBlock {
	result := make([]agentmodel.DocumentBlock, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func uniqueIDs(values []uint64) []uint64 {
	seen := make(map[uint64]struct{}, len(values))
	result := make([]uint64, 0, len(values))
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
