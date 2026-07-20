package loop

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	dlog "github.com/shemic/dever/log"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) Execute(ctx context.Context, lease runtimequeue.Lease) error {
	prepareCtx, prepareCancel := operationContext(ctx, runtimeMaintenanceTimeout)
	defer prepareCancel()
	workerID := strings.TrimSpace(lease.WorkerID)
	if workerID == "" {
		workerID = "runtime:" + uuid.NewString()
	}
	candidate, err := s.repository.FindRunByID(prepareCtx, lease.ID)
	if err != nil {
		return err
	}
	if isTerminalRunStatus(candidate.Status) {
		return nil
	}
	now := time.Now()
	claimed, err := s.repository.ClaimRun(prepareCtx, candidate, workerID, now, now.Add(runtimeLeaseDuration))
	if err != nil {
		return err
	}
	if !claimed {
		current, findErr := s.repository.FindRunByID(prepareCtx, lease.ID)
		if findErr == nil && isTerminalRunStatus(current.Status) {
			return nil
		}
		return errRunLeaseLost
	}
	row, err := s.repository.FindRunByID(prepareCtx, lease.ID)
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
	history := append(append([]any(nil), snapshot.History...), checkpoint.HistoryDelta...)
	snapshotReferences := appendMediaReferences(nil, snapshot.MediaReferences)
	references := appendMediaReferences(snapshotReferences, checkpoint.MediaDelta)
	execution := execution{
		runID:              row.ID,
		version:            row.Version,
		workerID:           workerID,
		requestID:          row.RequestID,
		requestedAt:        snapshot.RequestedAt,
		startedAt:          row.StartedAt,
		claimedAt:          now,
		agent:              snapshot.Agent,
		power:              snapshot.Power,
		sessionID:          snapshot.SessionID,
		assistantMessageID: snapshot.AssistantMessageID,
		prompt:             snapshot.Prompt,
		input:              snapshot.Input,
		history:            history,
		transport: modelTransport{
			Method: snapshot.Transport.Method,
			Host:   snapshot.Transport.Host,
			Path:   snapshot.Transport.Path,
		},
		persistChat:        snapshot.PersistChat,
		mediaReferences:    references,
		priorKnowledgeUsed: false,
		snapshotHistoryLen: len(snapshot.History),
		snapshotMediaLen:   len(snapshotReferences),
		scope:              runtimescope.RestoreSession(prepareCtx, snapshot.Scope, snapshot.SessionID),
		billing:            snapshot.Billing,
		checkpoint:         checkpoint,
	}
	execution.billing.RunID = row.ID
	if execution.billing.SessionID == 0 {
		execution.billing.SessionID = snapshot.SessionID
	}
	prepareCancel()
	controller := s.runs.Start(row.RequestID, context.Background(), remainingChatTimeout(row.StartedAt, snapshot.Agent.TimeoutSeconds))
	heartbeatDone := make(chan struct{})
	runtimeasync.Start("智能体运行租约心跳", func() {
		s.heartbeatRun(controller, execution, heartbeatDone)
	}, func(heartbeatErr error) {
		controller.Stop("lease_lost")
		dlog.ErrorFields("agent_runtime_heartbeat", "智能体运行心跳异常", dlog.Fields{
			"run_id": row.ID, "request_id": row.RequestID, "error": heartbeatErr.Error(),
		})
	})
	defer close(heartbeatDone)
	if err := s.mountExecutionTools(controller.Context(), &execution, nil, checkpoint.LoadedSkills); err != nil {
		controller.Stop("fail")
		s.runs.Remove(row.RequestID)
		s.failClaimedRun(row, workerID, err)
		return err
	}
	if row.Attempt > 1 {
		writeCtx, writeCancel := maintenanceContext()
		_ = s.writeExecutionOutput(writeCtx, execution, map[string]any{
			"event": "reset",
			"text":  checkpoint.LastText,
			"meta": map[string]any{
				"attempt": row.Attempt,
			},
		})
		writeCancel()
	}
	s.run(controller, execution)
	return nil
}

func restoreLoadedSkills(
	ctx context.Context,
	registry *runtimetool.Registry,
	references []agentmodel.LoadedSkillRef,
	history []any,
	requestID string,
) ([]agentmodel.LoadedSkillRef, []any, error) {
	restored := make([]agentmodel.LoadedSkillRef, 0, len(references))
	addedHistory := make([]any, 0, len(references)*2)
	for _, reference := range agentmodel.NormalizeLoadedSkillRefs(references) {
		key := strings.TrimSpace(reference.Key)
		if key == "" {
			continue
		}
		arguments := map[string]any{"key": key}
		if loadedSkillHistoryCurrent(history, reference) {
			arguments[runtimeprovider.SkillRestoreContentHashArgument] = reference.ContentHash
		}
		call := botprotocol.ToolCall{
			ID:        "restore_" + strings.ReplaceAll(uuid.NewString(), "-", ""),
			Type:      "function",
			Name:      "load_skill",
			Arguments: encodeJSON(arguments, "{}"),
		}
		result, err := registry.Execute(ctx, call, requestID, nil)
		if err != nil {
			return nil, nil, fmt.Errorf("恢复技能 %s 失败: %w", key, err)
		}
		current := agentmodel.LoadedSkillRef{
			Key:         key,
			ContentHash: toolResultText(result.Content, "content_hash"),
		}
		restored = append(restored, current)
		if loadedSkillHistoryCurrent(history, current) {
			continue
		}
		historyCall := call
		historyCall.Arguments = encodeJSON(map[string]any{"key": key}, "{}")
		addedHistory = append(addedHistory,
			assistantToolHistoryMessage("", []botprotocol.ToolCall{historyCall}),
			toolHistoryMessage(historyCall, result.ModelContent()),
		)
	}
	return agentmodel.NormalizeLoadedSkillRefs(restored), addedHistory, nil
}

func loadedSkillHistoryCurrent(history []any, reference agentmodel.LoadedSkillRef) bool {
	if strings.TrimSpace(reference.ContentHash) == "" {
		return false
	}
	for index := len(history) - 1; index >= 0; index-- {
		message, ok := history[index].(map[string]any)
		if !ok || historyMessageRole(message) != "tool" || toolResultText(message, "name") != "load_skill" {
			continue
		}
		content := toolResultText(message, "content")
		var payload map[string]any
		if json.Unmarshal([]byte(content), &payload) != nil {
			continue
		}
		result, _ := payload["result"].(map[string]any)
		if !strings.EqualFold(toolResultText(result, "key"), reference.Key) {
			continue
		}
		return toolResultText(result, "content_hash") == reference.ContentHash
	}
	return false
}

func toolResultText(value any, key string) string {
	mapped, _ := value.(map[string]any)
	return strings.TrimSpace(botprotocol.AsText(mapped[key]))
}

func (s Service) heartbeatRun(controller *runController, execution execution, done <-chan struct{}) {
	ticker := time.NewTicker(runtimeHeartbeatInterval)
	defer ticker.Stop()
	renewFailures := 0
	for {
		select {
		case <-done:
			return
		case <-controller.Context().Done():
			return
		case <-ticker.C:
			now := time.Now()
			maintenanceCtx, cancel := maintenanceContext()
			renewed, err := s.repository.RenewLease(
				maintenanceCtx, execution.runID, execution.workerID, now, now.Add(runtimeLeaseDuration),
			)
			cancel()
			if err != nil {
				renewFailures++
				if renewFailures < 3 {
					continue
				}
				dlog.ErrorFields("agent_runtime_lease", "智能体运行连续续租失败，停止当前 Worker", dlog.Fields{
					"run_id": execution.runID, "request_id": execution.requestID, "error": err.Error(),
				})
				s.stopRunForLease(controller, "lease_lost")
				return
			}
			renewFailures = 0
			if renewed {
				continue
			}
			reason := "lease_lost"
			findCtx, findCancel := maintenanceContext()
			row, findErr := s.repository.FindRunByID(findCtx, execution.runID)
			findCancel()
			if findErr == nil && row.CancelRequested {
				reason = "canceled"
			}
			s.stopRunForLease(controller, reason)
			return
		}
	}
}

func (s Service) stopRunForLease(controller *runController, reason string) {
	childRequestID := controller.Stop(reason)
	if childRequestID == "" {
		return
	}
	stopCtx, stopCancel := stopContext()
	defer stopCancel()
	_ = s.gateway.StopStream(stopCtx, childRequestID)
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
	execution := execution{runID: row.ID, version: row.Version, requestID: row.RequestID}
	resultCtx, resultCancel := maintenanceContext()
	resultErr := s.writeExecutionResult(resultCtx, execution, output, message, botprotocol.ResponseStatusFail)
	resultCancel()
	if resultErr != nil {
		dlog.ErrorFields("agent_runtime_restore_finish", "恢复失败终态投递失败，等待租约恢复", dlog.Fields{
			"run_id": row.ID, "request_id": row.RequestID, "error": resultErr.Error(),
		})
		return
	}
	finishCtx, finishCancel := maintenanceContext()
	finished, finishErr := s.finishRunAndChat(finishCtx, row.ID, workerID, row.SessionID > 0, runResult{
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
	finishCancel()
	if finishErr != nil || !finished {
		if finishErr == nil {
			finishErr = errRunLeaseLost
		}
		dlog.ErrorFields("agent_runtime_restore_finish", "保存恢复失败终态失败，等待租约恢复", dlog.Fields{
			"run_id": row.ID, "request_id": row.RequestID, "error": finishErr.Error(),
		})
	}
}

func deterministicToolRequestID(requestID string, call botprotocol.ToolCall) string {
	value := strings.TrimSpace(requestID) + ":" + strings.TrimSpace(call.ID)
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(value)).String()
}
