package artifact

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type jobExecutor struct {
	repository jobRepository
	artifacts  Service
	documents  runtimedocument.Service
	gateway    energonservice.GatewayService
}

func newJobExecutor() jobExecutor {
	return jobExecutor{
		repository: jobRepository{},
		artifacts:  NewService(),
		documents:  runtimedocument.NewService(),
		gateway:    energonservice.NewGatewayService(),
	}
}

func (executor jobExecutor) Execute(ctx context.Context, lease runtimequeue.Lease) error {
	executionCtx, executionCancel := executionContext(ctx)
	defer executionCancel()
	ctx = executionCtx
	candidate := executor.repository.find(ctx, lease.ID)
	if candidate == nil || isTerminalJobStatus(candidate.Status) {
		return nil
	}
	now := time.Now()
	if !executor.repository.claim(ctx, *candidate, lease.WorkerID, now) {
		return nil
	}
	job := executor.repository.find(ctx, lease.ID)
	if job == nil {
		return fmt.Errorf("素材任务不存在")
	}
	workerCtx, cancel := context.WithCancel(ctx)
	defer cancel()
	heartbeatDone := make(chan struct{})
	runtimeasync.Start("智能体素材任务心跳", func() {
		executor.heartbeat(workerCtx, *job, lease.WorkerID, heartbeatDone, cancel)
	}, func(heartbeatErr error) {
		cancel()
		dlog.ErrorFields("agent_artifact_heartbeat", "智能体素材任务心跳异常", dlog.Fields{
			"job_id": job.ID, "worker_id": lease.WorkerID, "error": heartbeatErr.Error(),
		})
	})
	err := executor.executeTool(workerCtx, *job)
	close(heartbeatDone)
	if err == nil {
		return executor.finishSuccess(*job, lease.WorkerID)
	}
	pendingCtx, pendingCancel := maintenanceContext()
	pending := executor.jobArtifacts(pendingCtx, *job)
	pendingCancel()
	// Generated files and document write-back have different retry lifecycles.
	// Once files are ready, keep retrying only the cheap write-back operation.
	if isDocumentArtifactJob(*job) && artifactBatchReady(pending) {
		if job.Attempt < artifactWritebackMaxAttempts {
			return executor.retryWriteback(*job, lease.WorkerID, err)
		}
		return executor.failWriteback(*job, lease.WorkerID, err)
	}
	if job.Attempt < artifactJobMaxAttempts {
		return executor.retry(*job, lease.WorkerID, err, true)
	}
	failCtx, failCancel := maintenanceContext()
	executor.artifacts.FailBatch(failCtx, pending, err.Error())
	failCancel()
	finishCtx, finishCancel := maintenanceContext()
	finished := executor.repository.finish(finishCtx, *job, lease.WorkerID, agentmodel.ArtifactJobStatusFailed, err.Error())
	finishCancel()
	if !finished {
		return fmt.Errorf("保存素材任务失败状态失败: %w", err)
	}
	if isDocumentArtifactJob(*job) {
		documentCtx, documentCancel := maintenanceContext()
		_, documentErr := executor.documents.MarkBlockFailed(documentCtx, job.BlockID, err.Error())
		documentCancel()
		if documentErr != nil {
			return documentErr
		}
	}
	dlog.ErrorFields("agent_artifact_failed", "智能体素材任务最终失败", dlog.Fields{
		"job_id": job.ID, "document_id": job.DocumentID, "block_id": job.BlockID,
		"tool_name": job.ToolName, "attempt": job.Attempt, "error": err.Error(),
	})
	return nil
}

func (executor jobExecutor) finishSuccess(job agentmodel.ArtifactJob, workerID string) error {
	finishCtx, finishCancel := maintenanceContext()
	finished := executor.repository.finish(finishCtx, job, workerID, agentmodel.ArtifactJobStatusSuccess, "")
	finishCancel()
	if !finished {
		return fmt.Errorf("完成素材任务状态失败")
	}
	if !isDocumentArtifactJob(job) {
		return nil
	}
	refreshCtx, refreshCancel := maintenanceContext()
	_, refreshErr := executor.documents.RefreshStatus(refreshCtx, job.DocumentID)
	refreshCancel()
	if refreshErr == nil {
		return nil
	}
	finishedJob := job
	finishedJob.Status = agentmodel.ArtifactJobStatusSuccess
	reopenCtx, reopenCancel := maintenanceContext()
	reopened := executor.repository.reopen(reopenCtx, finishedJob, time.Now())
	reopenCancel()
	if reopened {
		dispatchJob(job.ID)
	}
	return fmt.Errorf("刷新素材文档状态失败: %w", refreshErr)
}

func (executor jobExecutor) failWriteback(job agentmodel.ArtifactJob, workerID string, runErr error) error {
	if !isDocumentArtifactJob(job) {
		return fmt.Errorf("普通消息素材不存在文档回写阶段: %w", runErr)
	}
	finishCtx, finishCancel := maintenanceContext()
	finished := executor.repository.finish(finishCtx, job, workerID, agentmodel.ArtifactJobStatusFailed, runErr.Error())
	finishCancel()
	if !finished {
		return fmt.Errorf("保存素材回写失败状态失败: %w", runErr)
	}
	documentCtx, documentCancel := maintenanceContext()
	_, documentErr := executor.documents.MarkBlockFailed(documentCtx, job.BlockID, runErr.Error())
	documentCancel()
	if documentErr != nil {
		return documentErr
	}
	dlog.ErrorFields("agent_artifact_writeback_failed", "素材已生成但文档回写达到重试上限", dlog.Fields{
		"job_id": job.ID, "document_id": job.DocumentID, "block_id": job.BlockID,
		"tool_name": job.ToolName, "attempt": job.Attempt, "error": runErr.Error(),
	})
	return nil
}

func (executor jobExecutor) retry(job agentmodel.ArtifactJob, workerID string, runErr error, resetArtifacts bool) error {
	if resetArtifacts {
		resetCtx, resetCancel := maintenanceContext()
		pending := executor.jobArtifacts(resetCtx, job)
		executor.artifacts.ResetBatch(resetCtx, pending)
		resetCancel()
	}
	retryCtx, retryCancel := maintenanceContext()
	retried := executor.repository.retry(retryCtx, job, workerID, runErr.Error())
	retryCancel()
	if !retried {
		return fmt.Errorf("保存素材任务重试状态失败: %w", runErr)
	}
	executor.publishDocumentProgress(job, "retrying", nil)
	dlog.ErrorFields("agent_artifact_retry", "智能体素材任务执行失败，将自动重试", dlog.Fields{
		"job_id": job.ID, "document_id": job.DocumentID, "block_id": job.BlockID,
		"tool_name": job.ToolName, "attempt": job.Attempt, "error": runErr.Error(),
	})
	return nil
}

func (executor jobExecutor) retryWriteback(job agentmodel.ArtifactJob, workerID string, runErr error) error {
	if !isDocumentArtifactJob(job) {
		return fmt.Errorf("普通消息素材不存在文档回写重试: %w", runErr)
	}
	retryCtx, retryCancel := maintenanceContext()
	retried := executor.repository.retryWriteback(retryCtx, job, workerID, runErr.Error())
	retryCancel()
	if !retried {
		return fmt.Errorf("保存素材回写重试状态失败: %w", runErr)
	}
	executor.publishDocumentProgress(job, "writeback_retrying", nil)
	dlog.ErrorFields("agent_artifact_writeback_retry", "素材已生成，文档回写将自动重试", dlog.Fields{
		"job_id": job.ID, "document_id": job.DocumentID, "block_id": job.BlockID,
		"tool_name": job.ToolName, "attempt": job.Attempt, "error": runErr.Error(),
	})
	return nil
}

func (executor jobExecutor) executeTool(ctx context.Context, job agentmodel.ArtifactJob) error {
	jobCtx, serverContext, snapshot, arguments, err := restoreJobRuntime(ctx, job)
	if err != nil {
		return err
	}
	ctx = jobCtx
	pending := executor.jobArtifacts(ctx, job)
	if artifactBatchReady(pending) {
		return executor.writeBackArtifacts(ctx, job, pending)
	}
	mounted, err := runtimetool.Mount(ctx, runtimetool.MountRequest{
		Agent:      snapshot.Agent,
		Gateway:    executor.gateway,
		References: snapshot.MediaReferences,
		Billing:    snapshot.Billing,
		Method:     snapshot.Transport.Method,
		Host:       snapshot.Transport.Host,
		Path:       snapshot.Transport.Path,
		Server:     serverContext,
	})
	if err != nil {
		return err
	}
	defer mounted.Close()
	definition, exists := mounted.Registry.Definition(job.ToolName)
	if !exists || !IsSupportedKind(definition.Kind) {
		return fmt.Errorf("素材工具已不可用: %s", job.ToolName)
	}
	call := botprotocol.ToolCall{ID: job.ToolCallID, Type: "function", Name: job.ToolName, Arguments: encodeJSON(arguments, "{}")}
	result, err := mounted.Registry.Execute(ctx, call, job.RequestID, executor.progressWriter(job))
	if err != nil {
		return err
	}
	if _, err = executor.artifacts.CompleteBatch(ctx, pending, result.Content); err != nil {
		return err
	}
	current := executor.jobArtifacts(ctx, job)
	if !artifactBatchReady(current) {
		return fmt.Errorf("素材生成结果不完整")
	}
	return executor.writeBackArtifacts(ctx, job, current)
}

func restoreJobRuntime(
	ctx context.Context,
	job agentmodel.ArtifactJob,
) (context.Context, *server.Context, JobSnapshot, map[string]any, error) {
	snapshot, arguments, err := decodeJob(job)
	if err != nil {
		return ctx, nil, snapshot, nil, err
	}
	snapshot.Scope = runtimescope.RestoreSession(ctx, snapshot.Scope, job.SessionID)
	serverContext, err := snapshot.Scope.Server(ctx, nil)
	if err != nil {
		return ctx, nil, snapshot, nil, err
	}
	if serverContext != nil {
		ctx = serverContext.Context()
	}
	return ctx, serverContext, snapshot, arguments, nil
}

func (executor jobExecutor) markJobBlockReady(ctx context.Context, job agentmodel.ArtifactJob, artifacts []agentmodel.Artifact) error {
	jobCtx, _, _, _, err := restoreJobRuntime(ctx, job)
	if err != nil {
		return err
	}
	return executor.markBlockReady(jobCtx, job.BlockID, artifacts)
}

func (executor jobExecutor) writeBackArtifacts(ctx context.Context, job agentmodel.ArtifactJob, artifacts []agentmodel.Artifact) error {
	if !isDocumentArtifactJob(job) {
		return nil
	}
	return executor.markBlockReady(ctx, job.BlockID, artifacts)
}

func (executor jobExecutor) jobArtifacts(ctx context.Context, job agentmodel.ArtifactJob) []agentmodel.Artifact {
	return executor.artifacts.repository.byRunBatch(ctx, job.RunID, job.ToolCallID)
}

func isDocumentArtifactJob(job agentmodel.ArtifactJob) bool {
	return job.DocumentID > 0 && job.BlockID > 0
}

func (executor jobExecutor) markBlockReady(ctx context.Context, blockID uint64, artifacts []agentmodel.Artifact) error {
	block, err := executor.documents.MarkBlockReady(ctx, blockID, Payloads(ctx, artifacts))
	if err != nil {
		return err
	}
	if block == nil || block.Status != agentmodel.DocumentBlockStatusReady {
		return fmt.Errorf("回写素材文档块失败")
	}
	return nil
}

func artifactBatchReady(artifacts []agentmodel.Artifact) bool {
	if len(artifacts) == 0 {
		return false
	}
	for _, artifact := range artifacts {
		if artifact.Status != agentmodel.ArtifactStatusReady || artifact.FileID == 0 {
			return false
		}
	}
	return true
}

func (executor jobExecutor) progressWriter(job agentmodel.ArtifactJob) runtimeprovider.OutputHandler {
	return func(output map[string]any) error {
		if !isDocumentArtifactJob(job) {
			return nil
		}
		event := strings.TrimSpace(botprotocol.AsText(output["event"]))
		if event == "" {
			event = "progress"
		}
		executor.publishDocumentProgress(job, "", map[string]any{
			"progress": output["progress"],
			"text":     strings.TrimSpace(botprotocol.AsText(output["text"])),
			"source":   event,
		})
		return nil
	}
}

func (executor jobExecutor) publishDocumentProgress(job agentmodel.ArtifactJob, status string, values map[string]any) {
	if !isDocumentArtifactJob(job) {
		return
	}
	payload := map[string]any{"block_id": job.BlockID}
	if strings.TrimSpace(status) != "" {
		payload["status"] = strings.TrimSpace(status)
	}
	for key, value := range values {
		payload[key] = value
	}
	publishCtx, publishCancel := maintenanceContext()
	executor.documents.Publish(publishCtx, job.DocumentID, "artifact_progress", payload)
	publishCancel()
}

func (executor jobExecutor) heartbeat(ctx context.Context, job agentmodel.ArtifactJob, workerID string, done <-chan struct{}, cancel context.CancelFunc) {
	ticker := time.NewTicker(artifactJobHeartbeat)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-done:
			return
		case <-ticker.C:
			renewCtx, renewCancel := maintenanceContext()
			renewed := executor.repository.renew(renewCtx, job.ID, workerID, time.Now())
			renewCancel()
			if !renewed {
				cancel()
				return
			}
		}
	}
}

func decodeJob(job agentmodel.ArtifactJob) (JobSnapshot, map[string]any, error) {
	snapshot := JobSnapshot{}
	if err := json.Unmarshal([]byte(job.Snapshot), &snapshot); err != nil {
		return snapshot, nil, fmt.Errorf("素材任务快照无效: %w", err)
	}
	arguments := map[string]any{}
	if err := json.Unmarshal([]byte(job.Arguments), &arguments); err != nil {
		return snapshot, nil, fmt.Errorf("素材任务参数无效: %w", err)
	}
	return snapshot, arguments, nil
}

func isTerminalJobStatus(status string) bool {
	switch status {
	case agentmodel.ArtifactJobStatusSuccess, agentmodel.ArtifactJobStatusFailed, agentmodel.ArtifactJobStatusCanceled:
		return true
	default:
		return false
	}
}
