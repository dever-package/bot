package knowledge

import (
	"context"
	"fmt"
	"time"

	agentmodel "my/package/bot/model/agent"
)

func (s Service) IndexDirectory(ctx context.Context, baseID uint64, dirID uint64) (IndexResult, error) {
	if baseID == 0 {
		return IndexResult{}, fmt.Errorf("知识库不能为空")
	}
	if err := validateDocDir(ctx, baseID, dirID); err != nil {
		return IndexResult{}, err
	}
	dirIDs := []uint64{dirID}
	if dirID > 0 {
		dirIDs = descendantDirIDs(ctx, baseID, dirID)
	}
	total := IndexResult{BaseID: baseID, StartedAt: time.Now()}
	for _, currentDirID := range dirIDs {
		rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"dir_id":            currentDirID,
			"status":            1,
			"index_status":      []string{agentmodel.KnowledgeIndexStatusPending, agentmodel.KnowledgeIndexStatusFailed},
		})
		for _, row := range rows {
			if row == nil {
				continue
			}
			result, err := s.IndexDocument(ctx, row.ID)
			total.ChunkCount += result.ChunkCount
			total.Indexed += result.Indexed
			total.Failed += result.Failed
			if err != nil && total.Error == "" {
				total.Error = err.Error()
			}
		}
	}
	total.FinishedAt = time.Now()
	if total.Indexed == 0 && total.Failed == 0 && total.Error == "" {
		s.refreshBaseStats(ctx, baseID, agentmodel.KnowledgeIndexStatusSuccess, "")
	}
	if total.Error != "" {
		return total, fmt.Errorf("%s", total.Error)
	}
	return total, nil
}
