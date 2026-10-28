package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

const (
	runViewState   = "state"
	runViewSummary = "summary"
	runViewDetail  = "detail"
)

// ProjectRunProgress 保留健康运行的轻量行；阻塞边界才携带完整快照。
type ProjectRunProgress struct {
	Run      *teammodel.Run
	Snapshot map[string]any
}

// ProjectRunProgresses 在本次刷新内批量读取状态及租约，按需恢复中断执行。
func (s Service) ProjectRunProgresses(ctx context.Context, projectID uint64, runIDs []uint64, requestIDs []string) []ProjectRunProgress {
	rows := s.repo.findRunProgressRowsInProject(ctx, projectID, runIDs, requestIDs)
	progresses := make([]ProjectRunProgress, 0, len(rows))
	for _, run := range rows {
		if run == nil {
			continue
		}
		progresses = append(progresses, s.projectRunProgress(ctx, projectID, run))
	}
	return progresses
}

func (s Service) projectRunProgress(ctx context.Context, projectID uint64, run *teammodel.Run) ProjectRunProgress {
	progress := ProjectRunProgress{Run: run}
	if !runNeedsProgressSnapshot(run.Status) && !teamRunExecutionOrphaned(run, time.Now()) {
		return progress
	}
	// 重新读取完整行后再分类，避免恢复已结束或租约已续期的运行。
	current := s.repo.FindRunInProject(ctx, run.ID, projectID)
	if current == nil {
		return progress
	}
	progress.Run = current
	s.recoverRunExecution(current)
	if !runNeedsProgressSnapshot(current.Status) {
		return progress
	}
	progress.Snapshot, _ = s.resolvedRunSnapshot(ctx, current)
	return progress
}

func runNeedsProgressSnapshot(status string) bool {
	switch strings.TrimSpace(status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning:
		return false
	default:
		return true
	}
}

func (s Service) resolvedRunSnapshot(ctx context.Context, run *teammodel.Run) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	flowRuns := s.repo.ListFlowRunSummaries(ctx, run.ID)
	nodeRuns := s.repo.ListNodeRunSummaries(ctx, run.ID)
	flowNames := s.flowNameMap(ctx, flowRuns, nodeRuns)
	nodeNames := s.nodeNameMap(ctx, nodeRuns)
	interactions := nodeInteractionsToMaps(nodeRuns, flowNames, nodeNames)
	if interaction := runInteractionToMap(*run); len(interaction) > 0 {
		interactions = append(interactions, interaction)
	}
	return map[string]any{
		"view":         runViewSummary,
		"run":          runSnapshotToMap(*run),
		"flow_runs":    flowRunSummariesToMaps(flowRuns, flowNames),
		"node_runs":    nodeRunSummariesToMaps(nodeRuns, flowNames, nodeNames),
		"interactions": interactions,
		"approvals":    approvalsToMaps(s.repo.ListPendingApprovals(ctx, run.ID)),
	}, nil
}

func resolvedRunState(run *teammodel.Run) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	return map[string]any{
		"view": runViewState,
		"run":  runStateToMap(*run),
	}, nil
}

func runStateToMap(run teammodel.Run) map[string]any {
	return map[string]any{
		"id":          run.ID,
		"request_id":  run.RequestID,
		"project_id":  run.ProjectID,
		"body_id":     run.BodyID,
		"team_id":     run.TeamID,
		"release_id":  run.ReleaseID,
		"status":      run.Status,
		"error":       run.Error,
		"started_at":  run.StartedAt,
		"finished_at": run.FinishedAt,
		"created_at":  run.CreatedAt,
		"updated_at":  run.UpdatedAt,
	}
}

func runSnapshotToMap(run teammodel.Run) map[string]any {
	result := runStateToMap(run)
	result["agent_run_id"] = run.AgentRunID
	result["agent_session_id"] = run.AgentSessionID
	result["child_request_id"] = run.ChildRequestID
	result["interaction"] = jsonMap(run.Interaction)
	if teamRunTerminal(run.Status) || isWritingRun(run) {
		result["output"] = jsonMap(run.Output)
		if isWritingRun(run) {
			output := mapValue(result["output"])
			projection := mapValue(output["writing"])
			if projection != nil {
				projection["checkpoint"] = writingPublicCheckpoint(writingCheckpointFor(run))
				projection["run_status"] = run.Status
			}
		}
	}
	return result
}

func flowRunSummariesToMaps(rows []teammodel.FlowRun, flowNames map[uint64]string) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":          row.ID,
			"run_id":      row.RunID,
			"request_id":  row.RequestID,
			"project_id":  row.ProjectID,
			"team_id":     row.TeamID,
			"flow_id":     row.FlowID,
			"flow_name":   flowNames[row.FlowID],
			"error":       row.Error,
			"status":      row.Status,
			"started_at":  row.StartedAt,
			"finished_at": row.FinishedAt,
			"created_at":  row.CreatedAt,
			"updated_at":  row.UpdatedAt,
		})
	}
	return result
}

func nodeRunSummariesToMaps(rows []teammodel.NodeRun, flowNames map[uint64]string, nodeNames map[uint64]string) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":               row.ID,
			"run_id":           row.RunID,
			"flow_run_id":      row.FlowRunID,
			"request_id":       row.RequestID,
			"project_id":       row.ProjectID,
			"team_id":          row.TeamID,
			"flow_id":          row.FlowID,
			"flow_name":        flowNames[row.FlowID],
			"node_id":          row.NodeID,
			"node_key":         row.NodeKey,
			"node_name":        nodeNames[row.NodeID],
			"node_type":        row.NodeType,
			"error":            row.Error,
			"status":           row.Status,
			"agent_run_id":     row.AgentRunID,
			"agent_session_id": row.AgentSessionID,
			"child_request_id": row.ChildRequestID,
			"interaction":      jsonMap(row.Interaction),
			"started_at":       row.StartedAt,
			"finished_at":      row.FinishedAt,
			"created_at":       row.CreatedAt,
			"updated_at":       row.UpdatedAt,
		})
	}
	return result
}

func runReachedBlockingBoundary(status string) bool {
	return status == teammodel.RunStatusWaiting || teamRunTerminal(status)
}

func remainingRunWait(deadline time.Time, maximum time.Duration) time.Duration {
	remaining := time.Until(deadline)
	if remaining <= 0 {
		return 0
	}
	if remaining < maximum {
		return remaining
	}
	return maximum
}
