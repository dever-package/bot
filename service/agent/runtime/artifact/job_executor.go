package artifact

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
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
	go executor.heartbeat(workerCtx, *job, lease.WorkerID, heartbeatDone, cancel)
	err := executor.executeTool(workerCtx, *job)
	close(heartbeatDone)
	if err == nil {
		executor.repository.finish(context.Background(), *job, lease.WorkerID, agentmodel.ArtifactJobStatusSuccess, "")
		_, _ = executor.documents.RefreshStatus(context.Background(), job.DocumentID)
		return nil
	}
	if job.Attempt < artifactJobMaxAttempts {
		pending := executor.artifacts.repository.byBlock(context.Background(), job.BlockID)
		executor.artifacts.ResetBatch(context.Background(), pending)
		executor.repository.retry(context.Background(), *job, lease.WorkerID, err.Error())
		executor.documents.Publish(context.Background(), job.DocumentID, "artifact_progress", map[string]any{
			"block_id": job.BlockID,
			"status":   "retrying",
		})
		return nil
	}
	pending := executor.artifacts.repository.byBlock(context.Background(), job.BlockID)
	executor.artifacts.FailBatch(context.Background(), pending, err.Error())
	executor.repository.finish(context.Background(), *job, lease.WorkerID, agentmodel.ArtifactJobStatusFailed, err.Error())
	executor.documents.MarkBlockFailed(context.Background(), job.BlockID, err.Error())
	return nil
}

func (executor jobExecutor) executeTool(ctx context.Context, job agentmodel.ArtifactJob) error {
	pending := executor.artifacts.repository.byBlock(ctx, job.BlockID)
	if artifactBatchReady(pending) {
		executor.documents.MarkBlockReady(ctx, job.BlockID, Payloads(ctx, pending))
		return nil
	}
	snapshot, arguments, err := decodeJob(job)
	if err != nil {
		return err
	}
	mounted, err := runtimetool.Mount(ctx, runtimetool.MountRequest{
		Agent:      snapshot.Agent,
		Gateway:    executor.gateway,
		References: snapshot.MediaReferences,
		Method:     snapshot.Transport.Method,
		Host:       snapshot.Transport.Host,
		Path:       snapshot.Transport.Path,
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
	content, _ := result.Content.(map[string]any)
	executor.artifacts.CompleteBatch(ctx, pending, content)
	current := executor.artifacts.repository.byBlock(ctx, job.BlockID)
	if !artifactBatchReady(current) {
		return fmt.Errorf("素材生成结果不完整")
	}
	executor.documents.MarkBlockReady(ctx, job.BlockID, Payloads(ctx, current))
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
		event := strings.TrimSpace(botprotocol.AsText(output["event"]))
		if event == "" {
			event = "progress"
		}
		executor.documents.Publish(context.Background(), job.DocumentID, "artifact_progress", map[string]any{
			"block_id": job.BlockID,
			"progress": output["progress"],
			"text":     strings.TrimSpace(botprotocol.AsText(output["text"])),
			"source":   event,
		})
		return nil
	}
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
			if !executor.repository.renew(context.Background(), job.ID, workerID, time.Now()) {
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
