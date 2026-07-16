package artifact

import (
	"context"
	"time"

	dlog "github.com/shemic/dever/log"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
)

const (
	artifactReconcileLimit    = 500
	artifactReconcileInterval = 2 * time.Minute
)

func runJobReconciler() {
	reconcileArtifactStateSafely()
	ticker := time.NewTicker(artifactReconcileInterval)
	defer ticker.Stop()
	for range ticker.C {
		reconcileArtifactStateSafely()
	}
}

func reconcileArtifactStateSafely() {
	if err := runtimeasync.Run("智能体素材状态对账", func() error {
		reconcileArtifactState()
		return nil
	}); err != nil {
		dlog.ErrorFields("agent_artifact_reconcile", "智能体素材状态对账失败", dlog.Fields{"error": err.Error()})
	}
}

func reconcileArtifactState() {
	ctx, cancel := reconcileContext()
	defer cancel()
	repository := jobRepository{}
	executor := jobExecutor{
		artifacts: NewService(),
		documents: runtimedocument.NewService(),
	}
	blocks := inconsistentMediaBlocks(ctx, artifactReconcileLimit)
	if len(blocks) > 0 {
		reconcileMediaBlocks(ctx, repository, executor, blocks)
	}
	refreshGeneratingDocuments(ctx, executor.documents, artifactReconcileLimit)
}

func inconsistentMediaBlocks(ctx context.Context, limit int) []agentmodel.DocumentBlock {
	rows := agentmodel.NewDocumentBlockModel().Select(ctx, map[string]any{
		"type":   agentmodel.DocumentBlockTypeMedia,
		"status": agentmodel.DocumentBlockStatusGenerating,
	}, map[string]any{"order": "main.updated_at asc,main.id asc", "limit": limit})
	result := make([]agentmodel.DocumentBlock, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func reconcileMediaBlocks(ctx context.Context, repository jobRepository, executor jobExecutor, blocks []agentmodel.DocumentBlock) {
	blockIDs := make([]uint64, 0, len(blocks))
	for _, block := range blocks {
		blockIDs = append(blockIDs, block.ID)
	}
	jobs := repository.listByBlocks(ctx, blockIDs, []string{
		agentmodel.ArtifactJobStatusSuccess,
		agentmodel.ArtifactJobStatusFailed,
	})
	jobsByBlock := make(map[uint64]agentmodel.ArtifactJob, len(jobs))
	for _, job := range jobs {
		if _, exists := jobsByBlock[job.BlockID]; !exists {
			jobsByBlock[job.BlockID] = job
		}
	}
	artifactsByBlock := make(map[uint64][]agentmodel.Artifact, len(blockIDs))
	for _, current := range executor.artifacts.repository.byBlocks(ctx, blockIDs) {
		artifactsByBlock[current.BlockID] = append(artifactsByBlock[current.BlockID], current)
	}

	now := time.Now()
	for _, block := range blocks {
		job, exists := jobsByBlock[block.ID]
		if !exists {
			continue
		}
		artifacts := artifactsByBlock[block.ID]
		if job.Status == agentmodel.ArtifactJobStatusFailed {
			message := job.Error
			if message == "" {
				message = "素材生成失败"
			}
			_, _ = executor.documents.MarkBlockFailed(ctx, block.ID, message)
			continue
		}
		if job.Status == agentmodel.ArtifactJobStatusSuccess && artifactBatchReady(artifacts) {
			if executor.markJobBlockReady(ctx, job, artifacts) == nil {
				continue
			}
		}
		if !repository.reopen(ctx, job, now) {
			continue
		}
		if !artifactBatchReady(artifacts) {
			executor.artifacts.ResetBatch(ctx, artifacts)
		}
		dispatchJob(job.ID)
	}
}

func refreshGeneratingDocuments(ctx context.Context, documents runtimedocument.Service, limit int) {
	rows := agentmodel.NewDocumentModel().Select(ctx, map[string]any{
		"status": agentmodel.DocumentStatusGenerating,
	}, map[string]any{"order": "main.updated_at asc,main.id asc", "limit": limit})
	for _, row := range rows {
		if row != nil {
			_, _ = documents.RefreshStatus(ctx, row.ID)
		}
	}
}
