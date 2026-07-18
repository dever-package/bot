package knowledge

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	maxBatchReindex               = 500
	maxBatchReindexWorkers        = 4
	maxGlobalDocumentIndexWorkers = 8
	largeKnowledgeDocumentBytes   = 16 * 1024 * 1024
)

var (
	globalDocumentIndexSlots = make(chan struct{}, maxGlobalDocumentIndexWorkers)
	largeDocumentIndexSlot   = make(chan struct{}, 1)
)

func acquireDocumentIndexSlot(ctx context.Context, size int64) (func(), error) {
	large := size >= largeKnowledgeDocumentBytes
	if large {
		select {
		case largeDocumentIndexSlot <- struct{}{}:
		case <-ctx.Done():
			return nil, ctx.Err()
		}
	}
	select {
	case globalDocumentIndexSlots <- struct{}{}:
		return func() {
			<-globalDocumentIndexSlots
			if large {
				<-largeDocumentIndexSlot
			}
		}, nil
	case <-ctx.Done():
		if large {
			<-largeDocumentIndexSlot
		}
		return nil, ctx.Err()
	}
}

func (s Service) BatchReindex(ctx context.Context, baseID uint64, docIDs []uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	if len(docIDs) == 0 {
		return fmt.Errorf("请选择要重索引的文档")
	}
	docIDs = uniqueUint64s(docIDs, maxBatchReindex+1)
	if len(docIDs) > maxBatchReindex {
		return fmt.Errorf("批量重索引最多 %d 个文档", maxBatchReindex)
	}
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id":                docIDs,
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.size",
		"page":     1,
		"pageSize": len(docIDs),
	})
	if len(docs) != len(docIDs) {
		return fmt.Errorf("部分文档不存在或不属于当前知识库")
	}
	workerID, claimed := claimKnowledgeIndexLease(ctx, baseID)
	if !claimed {
		return fmt.Errorf("知识库正在索引中，请稍后再试")
	}
	go s.runBatchReindex(baseID, workerID, docs)
	return nil
}

func (s Service) runBatchReindex(baseID uint64, workerID string, docs []*agentmodel.KnowledgeDoc) {
	run := newKnowledgeIndexRun(baseID, workerID)
	status := agentmodel.KnowledgeIndexStatusSuccess
	message := ""
	defer func() {
		if recovered := recover(); recovered != nil {
			status = agentmodel.KnowledgeIndexStatusFailed
			message = appendIndexWarning(message, fmt.Sprintf("%v", recovered))
		}
		run.finish(status, message)
		StartLightPendingIndex(context.Background(), baseID)
	}()
	base := agentmodel.NewKnowledgeBaseModel().Find(run.ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		status = agentmodel.KnowledgeIndexStatusFailed
		message = "知识库不存在"
		return
	}
	if err := s.runBatchReindexWorkers(run.ctx, docs); err != nil {
		message = err.Error()
	}
	if run.ctx.Err() == nil && isConceptGraphEnabled(base.ConceptGraphEnabled) && base.IndexPowerID > 0 {
		s.autoDiscoverRelations(run.ctx, *base)
	}
	if run.ctx.Err() == nil {
		s.refreshDirectorySummaries(run.ctx, baseID, 0)
	}
	status = finalBaseIndexStatus(context.Background(), baseID, message)
}

func (s Service) runBatchReindexWorkers(ctx context.Context, docs []*agentmodel.KnowledgeDoc) error {
	docIDs := reindexDocIDs(docs)
	if len(docIDs) == 0 {
		return fmt.Errorf("未找到要重索引的文档")
	}
	workerCount := maxBatchReindexWorkers
	if len(docIDs) < workerCount {
		workerCount = len(docIDs)
	}
	jobs := make(chan uint64)
	errs := make(chan error, len(docIDs)+1)
	var wg sync.WaitGroup
	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			svc := NewService()
			for docID := range jobs {
				if _, err := svc.indexDocument(ctx, docID, false); err != nil {
					errs <- fmt.Errorf("文档 %d 重索引失败: %w", docID, err)
				}
			}
		}()
	}
	dispatchCanceled := false
	for _, docID := range docIDs {
		select {
		case jobs <- docID:
		case <-ctx.Done():
			dispatchCanceled = true
		}
		if dispatchCanceled {
			break
		}
	}
	close(jobs)
	wg.Wait()
	if dispatchCanceled && ctx.Err() != nil {
		errs <- ctx.Err()
	}
	close(errs)
	return joinBatchReindexErrors(errs)
}

func reindexDocIDs(docs []*agentmodel.KnowledgeDoc) []uint64 {
	ids := make([]uint64, 0, len(docs))
	seen := map[uint64]struct{}{}
	for _, doc := range docs {
		if doc == nil || doc.ID == 0 {
			continue
		}
		if _, exists := seen[doc.ID]; exists {
			continue
		}
		seen[doc.ID] = struct{}{}
		ids = append(ids, doc.ID)
	}
	return ids
}

func joinBatchReindexErrors(errs <-chan error) error {
	messages := make([]string, 0)
	for err := range errs {
		if err != nil {
			messages = append(messages, err.Error())
		}
	}
	if len(messages) == 0 {
		return nil
	}
	if len(messages) > 5 {
		messages = append(messages[:5], fmt.Sprintf("另有 %d 个文档失败", len(messages)-5))
	}
	return fmt.Errorf("%s", strings.Join(messages, "；"))
}

func StartLightPendingIndex(ctx context.Context, baseID uint64) {
	if baseID == 0 {
		return
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return
	}
	if base.ConceptGraphEnabled != agentmodel.KnowledgeModeLight {
		recoverInterruptedAdvancedIndex(ctx, base)
		return
	}
	pendingDocs := pendingKnowledgeDocs(ctx, baseID)
	hasRunningDocs := hasRunningKnowledgeDocs(ctx, baseID)
	if len(pendingDocs) == 0 && !hasRunningDocs && base.IndexStatus != agentmodel.KnowledgeIndexStatusRunning {
		return
	}
	workerID, claimed := claimKnowledgeIndexLease(ctx, baseID)
	if !claimed {
		return
	}
	if len(pendingKnowledgeDocs(ctx, baseID)) == 0 {
		finishKnowledgeIndexLease(ctx, baseID, workerID, finalBaseIndexStatus(ctx, baseID, ""), "")
		return
	}
	go runLightPendingIndex(baseID, workerID)
}

func recoverInterruptedAdvancedIndex(ctx context.Context, base *agentmodel.KnowledgeBase) {
	if base == nil || base.ID == 0 {
		return
	}
	if base.IndexStatus != agentmodel.KnowledgeIndexStatusRunning && !hasRunningKnowledgeDocs(ctx, base.ID) {
		return
	}
	workerID, claimed := claimKnowledgeIndexLease(ctx, base.ID)
	if !claimed {
		return
	}
	if len(pendingKnowledgeDocs(ctx, base.ID)) > 0 {
		finishKnowledgeIndexLease(
			ctx,
			base.ID,
			workerID,
			agentmodel.KnowledgeIndexStatusPending,
			"上一次索引中断，请重新索引",
		)
		return
	}
	finishKnowledgeIndexLease(ctx, base.ID, workerID, finalBaseIndexStatus(ctx, base.ID, ""), "")
}

func runLightPendingIndex(baseID uint64, workerID string) {
	bg := context.Background()
	run := newKnowledgeIndexRun(baseID, workerID)
	status := agentmodel.KnowledgeIndexStatusSuccess
	errorMessage := ""
	defer func() {
		if recovered := recover(); recovered != nil {
			status = agentmodel.KnowledgeIndexStatusFailed
			errorMessage = appendIndexWarning(errorMessage, fmt.Sprintf("%v", recovered))
		}
		run.finish(status, errorMessage)
		if len(pendingKnowledgeDocs(bg, baseID)) > 0 {
			StartLightPendingIndex(bg, baseID)
		}
	}()
	svc := NewService()
	indexed := false
	for {
		if run.ctx.Err() != nil {
			errorMessage = appendIndexWarning(errorMessage, run.ctx.Err().Error())
			break
		}
		docs := pendingKnowledgeDocs(bg, baseID)
		if len(docs) == 0 {
			break
		}
		if err := svc.runBatchReindexWorkers(run.ctx, docs); err != nil {
			errorMessage = appendIndexWarning(errorMessage, err.Error())
		}
		indexed = true
	}
	if indexed && run.ctx.Err() == nil {
		svc.refreshDirectorySummaries(run.ctx, baseID, 0)
	}
	status = finalBaseIndexStatus(bg, baseID, errorMessage)
}

func pendingKnowledgeDocs(ctx context.Context, baseID uint64) []*agentmodel.KnowledgeDoc {
	if baseID == 0 {
		return nil
	}
	return agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusPending,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.size",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": maxBatchReindex,
	})
}

func StartBaseIndex(ctx context.Context, baseID uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	workerID, claimed := claimKnowledgeIndexLease(ctx, baseID)
	if !claimed {
		return fmt.Errorf("知识库正在索引中，请稍后再试")
	}
	go runBaseIndex(baseID, workerID)
	return nil
}

type KnowledgeIndexRecoveryResult struct {
	Scanned   int `json:"scanned"`
	Resumed   int `json:"resumed"`
	Finalized int `json:"finalized"`
}

// RecoverInterruptedIndexes 恢复进程中断后租约已过期的索引任务。
func RecoverInterruptedIndexes(ctx context.Context) KnowledgeIndexRecoveryResult {
	result := KnowledgeIndexRecoveryResult{}
	const recoveryBatchSize = 20
	bases := agentmodel.NewKnowledgeBaseModel().Select(ctx, map[string]any{
		"index_status": agentmodel.KnowledgeIndexStatusRunning,
		"status":       1,
		"or": []any{
			map[string]any{"index_lease_expires_at": nil},
			map[string]any{"index_lease_expires_at": map[string]any{"lte": time.Now()}},
		},
	}, map[string]any{
		"field":    "main.id, main.index_status, main.status",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": recoveryBatchSize,
	})
	for _, base := range bases {
		if ctx.Err() != nil || base == nil || base.ID == 0 {
			continue
		}
		result.Scanned++
		interruptedDocs := runningKnowledgeDocs(ctx, base.ID)
		workerID, claimed := claimKnowledgeIndexLease(ctx, base.ID)
		if !claimed {
			continue
		}
		if len(interruptedDocs) == 0 {
			finishKnowledgeIndexLease(ctx, base.ID, workerID, finalBaseIndexStatus(ctx, base.ID, ""), "")
			result.Finalized++
			continue
		}
		result.Resumed++
		go NewService().runBatchReindex(base.ID, workerID, interruptedDocs)
	}
	return result
}

func runningKnowledgeDocs(ctx context.Context, baseID uint64) []*agentmodel.KnowledgeDoc {
	if baseID == 0 {
		return nil
	}
	return agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusRunning,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.size",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": maxBatchReindex,
	})
}

func runBaseIndex(baseID uint64, workerID string) {
	run := newKnowledgeIndexRun(baseID, workerID)
	status := agentmodel.KnowledgeIndexStatusSuccess
	errorMessage := ""
	defer func() {
		if recovered := recover(); recovered != nil {
			status = agentmodel.KnowledgeIndexStatusFailed
			errorMessage = appendIndexWarning(errorMessage, fmt.Sprintf("%v", recovered))
		}
		run.finish(status, errorMessage)
		StartLightPendingIndex(context.Background(), baseID)
	}()
	if _, err := NewService().RebuildBase(run.ctx, baseID); err != nil {
		status = agentmodel.KnowledgeIndexStatusFailed
		errorMessage = err.Error()
	}
}

func recoverInterruptedKnowledgeIndex(ctx context.Context, baseID uint64) {
	if baseID == 0 {
		return
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusRunning,
		"status":            1,
	}, map[string]any{
		"index_status":       agentmodel.KnowledgeIndexStatusPending,
		"index_stage":        agentmodel.KnowledgeIndexStagePending,
		"index_stage_detail": "",
		"error_message":      "",
	})
}
