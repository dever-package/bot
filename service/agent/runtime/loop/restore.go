package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) ExecuteRun(ctx context.Context, lease RunLease) error {
	workerID := strings.TrimSpace(lease.WorkerID)
	if workerID == "" {
		workerID = "runtime:" + uuid.NewString()
	}
	candidate, err := s.repository.FindRunByID(ctx, lease.RunID)
	if err != nil {
		return err
	}
	if isTerminalRunStatus(candidate.Status) {
		return nil
	}
	now := time.Now()
	claimed, err := s.repository.ClaimRun(ctx, candidate, workerID, now, now.Add(runtimeLeaseDuration))
	if err != nil {
		return err
	}
	if !claimed {
		current, findErr := s.repository.FindRunByID(ctx, lease.RunID)
		if findErr == nil && isTerminalRunStatus(current.Status) {
			return nil
		}
		return errRunLeaseLost
	}
	row, err := s.repository.FindRunByID(ctx, lease.RunID)
	if err != nil {
		return err
	}
	snapshot, err := decodeSnapshot(row.Snapshot)
	if err != nil {
		s.failClaimedRun(row, workerID, err)
		return err
	}
	checkpoint, err := decodeCheckpoint(row.Checkpoint)
	if err != nil {
		s.failClaimedRun(row, workerID, err)
		return err
	}
	references := appendMediaReferences(snapshot.MediaReferences, checkpoint.MediaReferences)
	mounted, err := runtimetool.Mount(ctx, runtimetool.MountRequest{
		Agent:          snapshot.Agent,
		Gateway:        s.gateway,
		References:     references,
		EnableDocument: snapshot.PersistChat && snapshot.AssistantMessageID > 0,
		Method:         snapshot.Transport.Method,
		Host:           snapshot.Transport.Host,
		Path:           snapshot.Transport.Path,
	})
	if err != nil {
		s.failClaimedRun(row, workerID, err)
		return err
	}
	if err := restoreLoadedSkills(ctx, mounted.Registry, checkpoint.LoadedSkills, row.RequestID); err != nil {
		mounted.Close()
		s.failClaimedRun(row, workerID, err)
		return err
	}
	execution := execution{
		runID:              row.ID,
		version:            row.Version,
		workerID:           workerID,
		requestID:          row.RequestID,
		startedAt:          row.StartedAt,
		agent:              snapshot.Agent,
		power:              snapshot.Power,
		sessionID:          snapshot.SessionID,
		userMessageID:      snapshot.UserMessageID,
		assistantMessageID: snapshot.AssistantMessageID,
		prompt:             snapshot.Prompt,
		input:              snapshot.Input,
		history:            snapshot.History,
		registry:           mounted.Registry,
		transport: modelTransport{
			Method: snapshot.Transport.Method,
			Host:   snapshot.Transport.Host,
			Path:   snapshot.Transport.Path,
		},
		persistChat:     snapshot.PersistChat,
		cleanup:         mounted.Close,
		mediaReferences: references,
		checkpoint:      checkpoint,
	}
	if row.Attempt > 1 {
		_ = s.writeExecutionOutput(context.Background(), execution, map[string]any{
			"event": "reset",
			"text":  checkpoint.LastText,
			"meta": map[string]any{
				"attempt": row.Attempt,
			},
		})
	}
	controller := s.runs.Start(row.RequestID, context.Background(), remainingChatTimeout(row.StartedAt, snapshot.Agent.TimeoutSeconds))
	heartbeatDone := make(chan struct{})
	go s.heartbeatRun(controller, execution, heartbeatDone)
	s.run(controller, execution)
	close(heartbeatDone)
	return nil
}

func restoreLoadedSkills(ctx context.Context, registry *runtimetool.Registry, keys []string, requestID string) error {
	for _, key := range keys {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		call := botprotocol.ToolCall{
			ID:        "restore_" + strings.ReplaceAll(uuid.NewSHA1(uuid.NameSpaceOID, []byte(requestID+":"+key)).String(), "-", ""),
			Type:      "function",
			Name:      "load_skill",
			Arguments: encodeJSON(map[string]any{"key": key}, "{}"),
		}
		if _, err := registry.Execute(ctx, call, call.ID, nil); err != nil {
			return fmt.Errorf("恢复技能 %s 失败: %w", key, err)
		}
	}
	return nil
}

func (s Service) heartbeatRun(controller *runController, execution execution, done <-chan struct{}) {
	ticker := time.NewTicker(runtimeHeartbeatInterval)
	defer ticker.Stop()
	for {
		select {
		case <-done:
			return
		case <-controller.Context().Done():
			return
		case <-ticker.C:
			now := time.Now()
			renewed, err := s.repository.RenewLease(
				context.Background(), execution.runID, execution.workerID, now, now.Add(runtimeLeaseDuration),
			)
			if err != nil {
				continue
			}
			if renewed {
				continue
			}
			reason := "lease_lost"
			if row, findErr := s.repository.FindRunByID(context.Background(), execution.runID); findErr == nil && row.CancelRequested {
				reason = "canceled"
			}
			childRequestID := controller.Stop(reason)
			if childRequestID != "" {
				_ = s.gateway.StopStream(context.Background(), childRequestID)
			}
			return
		}
	}
}

func (s Service) failClaimedRun(row agentmodel.Run, workerID string, runErr error) {
	message := "恢复智能体运行失败"
	if runErr != nil {
		message = runErr.Error()
	}
	now := time.Now()
	output := map[string]any{
		"event": "error",
		"text":  "",
		"error": message,
	}
	finished, _ := s.finishRunAndChat(context.Background(), row.ID, workerID, row.SessionID > 0, runResult{
		Status:     runStatusFail,
		Output:     encodeJSON(output, "{}"),
		Error:      message,
		StepCount:  row.StepCount,
		Latency:    now.Sub(row.StartedAt).Milliseconds(),
		FinishedAt: now,
	}, runtimechat.RunTurnCompletion{
		RequestID: row.RequestID,
		Status:    runStatusFail,
		Output:    output,
		Error:     message,
	})
	if !finished {
		return
	}
	execution := execution{runID: row.ID, version: row.Version, requestID: row.RequestID}
	_ = s.writeExecutionResult(context.Background(), execution, output, message, botprotocol.ResponseStatusFail)
}

func deterministicToolRequestID(requestID string, call botprotocol.ToolCall) string {
	value := strings.TrimSpace(requestID) + ":" + strings.TrimSpace(call.ID)
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(value)).String()
}
