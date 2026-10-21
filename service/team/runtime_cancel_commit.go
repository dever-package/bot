package team

import (
	"context"
	"fmt"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	"github.com/shemic/dever/orm"
)

// Explicit cancellation shares the Run → NodeRun/Execution lock order with the owning
// workspace finalizer. A completed result wins before any cancellation effects.
func cancelRunAndWorkspaceExecution(ctx context.Context, runID uint64, now time.Time) (canceled bool, err error) {
	if runID == 0 {
		return false, nil
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			canceled = false
			err = fmt.Errorf("取消运行失败: %v", recovered)
		}
	}()
	err = orm.Transaction(ctx, func(tx context.Context) error {
		model := teammodel.NewRunModel()
		model.Update(tx, map[string]any{"id": runID}, map[string]any{"id": runID})
		run := model.Find(tx, map[string]any{"id": runID})
		if run == nil || teamRunTerminal(run.Status) {
			return nil
		}
		fields := map[string]any{"status": teammodel.RunStatusCanceled, "finished_at": now, "updated_at": now, "execution_owner": "", "execution_expires_at": nil}
		workspace := textValue(jsonMap(run.Input)["_mode"]) == "workspace_canvas"
		if workspace {
			output := jsonMap(run.Output)
			output["status"] = teammodel.RunStatusCanceled
			run.Output = jsonText(output)
			fields["output"], fields["error"] = run.Output, ""
		}
		if model.Update(tx, map[string]any{"id": run.ID, "status": []string{teammodel.RunStatusPending, teammodel.RunStatusRunning, teammodel.RunStatusWaiting}}, fields) != 1 {
			return fmt.Errorf("取消运行状态提交失败")
		}
		if workspace {
			flowModel := teammodel.NewFlowRunModel()
			flowFilters := map[string]any{"run_id": run.ID, "project_id": run.ProjectID, "request_id": run.RequestID, "flow_id": 0}
			if flow := flowModel.Find(tx, flowFilters); flow != nil {
				flowFilters["id"] = flow.ID
				if flowModel.Update(tx, flowFilters, map[string]any{"status": teammodel.RunStatusCanceled, "output": run.Output, "error": "", "finished_at": now, "updated_at": now}) != 1 {
					return fmt.Errorf("取消画布流程状态提交失败")
				}
			}
			if err := cancelWorkspaceNodeRecords(tx, run, now); err != nil {
				return err
			}
			execution := workspacemodel.NewExecutionModel().Find(tx, map[string]any{"run_id": run.ID, "project_id": run.ProjectID})
			if execution != nil {
				if workspacemodel.NewExecutionModel().Update(tx, map[string]any{"id": execution.ID}, map[string]any{"status": teammodel.RunStatusCanceled, "error": "", "output": run.Output, "finished_at": now, "updated_at": now}) != 1 {
					return fmt.Errorf("取消画布执行状态提交失败")
				}
			}
		}
		if isCanvasPowerRun(*run) {
			if err := cancelCanvasPowerRecords(tx, run.ID, now); err != nil {
				return err
			}
		}
		canceled = true
		return nil
	})
	if err != nil {
		canceled = false
	}
	return canceled, err
}

// The workspace owns a pair of node records. Preserve terminal node facts and
// cancel only active nodes while the same parent Run lock is held.
func cancelWorkspaceNodeRecords(ctx context.Context, run *teammodel.Run, now time.Time) error {
	nodeRuns := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": run.ID})
	byID := make(map[uint64]*teammodel.NodeRun, len(nodeRuns))
	active := []string{teammodel.RunStatusPending, teammodel.RunStatusRunning, teammodel.RunStatusWaiting}
	for _, node := range nodeRuns {
		if node == nil {
			continue
		}
		byID[node.ID] = node
		if teamRunTerminal(node.Status) {
			continue
		}
		if teammodel.NewNodeRunModel().Update(ctx, map[string]any{"id": node.ID, "run_id": run.ID, "status": active}, map[string]any{"status": teammodel.RunStatusCanceled, "error": "运行已取消", "finished_at": now, "updated_at": now}) != 1 {
			return fmt.Errorf("取消画布节点运行提交失败")
		}
		node.Status, node.Error, node.FinishedAt = teammodel.RunStatusCanceled, "运行已取消", &now
	}
	for _, execution := range workspacemodel.NewNodeExecutionModel().Select(ctx, map[string]any{"run_id": run.ID, "project_id": run.ProjectID, "status": active}) {
		if execution == nil {
			continue
		}
		record := map[string]any{"status": teammodel.RunStatusCanceled, "error": "运行已取消", "finished_at": now, "updated_at": now}
		if node := byID[execution.NodeRunID]; node != nil && teamRunTerminal(node.Status) {
			record["status"], record["error"], record["output"], record["finished_at"] = node.Status, node.Error, node.Output, node.FinishedAt
		}
		if workspacemodel.NewNodeExecutionModel().Update(ctx, map[string]any{"id": execution.ID, "run_id": run.ID, "status": active}, record) != 1 {
			return fmt.Errorf("取消画布节点执行提交失败")
		}
	}
	return nil
}

// 画布能力也按 Run → NodeRun/FlowRun 原子取消；已完成节点保留原事实。
func cancelCanvasPowerRecords(ctx context.Context, runID uint64, now time.Time) error {
	record := map[string]any{"status": teammodel.RunStatusCanceled, "error": "运行已取消", "finished_at": now, "updated_at": now}
	for _, node := range teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID}) {
		if node == nil || teamRunTerminal(node.Status) {
			continue
		}
		if teammodel.NewNodeRunModel().Update(ctx, map[string]any{"id": node.ID, "run_id": runID, "status": node.Status}, record) != 1 {
			return fmt.Errorf("取消能力节点运行提交失败")
		}
	}
	for _, flow := range teammodel.NewFlowRunModel().Select(ctx, map[string]any{"run_id": runID}) {
		if flow == nil || teamRunTerminal(flow.Status) {
			continue
		}
		if teammodel.NewFlowRunModel().Update(ctx, map[string]any{"id": flow.ID, "run_id": runID, "status": flow.Status}, record) != 1 {
			return fmt.Errorf("取消能力流程运行提交失败")
		}
	}
	return nil
}
