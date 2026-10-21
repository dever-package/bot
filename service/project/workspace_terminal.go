package project

import (
	"context"
	"fmt"
	"reflect"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/orm"
)

type workspaceExecutionLeaseKey struct{}
type workspaceExecutionLease struct {
	RunID   uint64
	Owner   string
	Version int
}

func withWorkspaceExecutionLease(ctx context.Context, run *teammodel.Run) context.Context {
	return context.WithValue(ctx, workspaceExecutionLeaseKey{}, workspaceExecutionLease{run.ID, run.ExecutionOwner, run.ExecutionVersion})
}

// The no-op mutation takes the Run row lock before the first read. Every owned
// result/terminal write uses Run → NodeRun/Execution, including cancellation.
func lockWorkspaceRun(ctx context.Context, runID uint64) *teammodel.Run {
	model := teammodel.NewRunModel()
	model.Update(ctx, map[string]any{"id": runID}, map[string]any{"id": runID})
	return model.Find(ctx, map[string]any{"id": runID})
}

func requireWorkspaceExecutionLease(ctx context.Context, run *teammodel.Run) error {
	lease, ok := ctx.Value(workspaceExecutionLeaseKey{}).(workspaceExecutionLease)
	if !ok || run == nil || lease.RunID != run.ID || lease.Owner == "" || lease.Owner != run.ExecutionOwner || lease.Version != run.ExecutionVersion || run.ExecutionExpiresAt == nil || !run.ExecutionExpiresAt.After(time.Now()) {
		return fmt.Errorf("画布执行租约已失效")
	}
	return nil
}

func workspaceRecordTransaction(ctx context.Context, write func(context.Context) error) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = workspaceNodeExecutionPanicError(recovered)
		}
	}()
	return orm.Transaction(ctx, write)
}

// A terminal Run is authoritative. Repeating this function only repairs its
// projection; it never replaces a committed result or turns cancellation back on.
func finishWorkspaceRun(ctx context.Context, runID uint64, status string, output map[string]any, errorText string) error {
	if runID == 0 {
		return fmt.Errorf("画布运行不存在")
	}
	var statusErr error
	err := workspaceRecordTransaction(ctx, func(tx context.Context) error {
		run := lockWorkspaceRun(tx, runID)
		if run == nil || !isWorkspaceCanvasRun(run) {
			return fmt.Errorf("画布运行不存在")
		}
		if canvasRunStatusFinished(run.Status) {
			if err := persistWorkspaceRunProjections(tx, run); err != nil {
				return err
			}
			if status != "" && status != run.Status {
				statusErr = fmt.Errorf("画布运行已结束：%s", run.Status)
			}
			return nil
		}
		if err := requireWorkspaceExecutionLease(tx, run); err != nil {
			return err
		}
		status = normalizeWorkspaceExecutionStatus(status)
		if status == "" {
			status = teammodel.RunStatusSuccess
		}
		now := time.Now()
		record := map[string]any{"status": status, "output": jsonText(output, "{}"), "error": strings.TrimSpace(errorText), "updated_at": now}
		if canvasRunStatusFinished(status) {
			record["finished_at"] = now
		}
		if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending {
			record["execution_owner"] = ""
			record["execution_expires_at"] = nil
		}
		if teammodel.NewRunModel().Update(tx, map[string]any{"id": run.ID, "status": run.Status, "execution_version": run.ExecutionVersion}, record) != 1 {
			return fmt.Errorf("提交画布运行结果失败")
		}
		run.Status, run.Output, run.Error, run.UpdatedAt = status, jsonText(output, "{}"), strings.TrimSpace(errorText), now
		if canvasRunStatusFinished(status) {
			run.FinishedAt = &now
		}
		return persistWorkspaceRunProjections(tx, run)
	})
	if err != nil {
		return err
	}
	return statusErr
}

// Run 持有锁和租约；Execution、画布 FlowRun 都只是该事实的持久投影。
func persistWorkspaceRunProjections(ctx context.Context, run *teammodel.Run) error {
	if err := persistWorkspaceExecutionProjection(ctx, run); err != nil {
		return err
	}
	model := teammodel.NewFlowRunModel()
	filters := map[string]any{"run_id": run.ID, "project_id": run.ProjectID, "request_id": run.RequestID, "flow_id": 0}
	flow := model.Find(ctx, filters)
	// 启动可能在 FlowRun 创建前失败，不为缺失的投影创建运行。
	if flow == nil {
		return nil
	}
	if flow.Status == run.Status && flow.Output == run.Output && flow.Error == run.Error && reflect.DeepEqual(flow.FinishedAt, run.FinishedAt) {
		return nil
	}
	filters["id"] = flow.ID
	if model.Update(ctx, filters, map[string]any{"status": run.Status, "output": run.Output, "error": run.Error, "updated_at": run.UpdatedAt, "finished_at": run.FinishedAt}) != 1 {
		return fmt.Errorf("提交画布流程结果失败")
	}
	return nil
}

func persistWorkspaceExecutionProjection(ctx context.Context, run *teammodel.Run) error {
	execution := workspaceExecutionByRunID(ctx, run.ID)
	// Creation can fail before an Execution exists. There is then no projection to repair.
	if execution == nil {
		return nil
	}
	projected := projectWorkspaceExecution(execution, run)
	if projected == execution {
		if canvasRunStatusFinished(execution.Status) {
			return nil
		}
		copied := *execution
		copied.Status, copied.Output, copied.Error, copied.UpdatedAt = run.Status, run.Output, run.Error, run.UpdatedAt
		projected = &copied
	}
	if reflect.DeepEqual(*projected, *execution) {
		return nil
	}
	record := map[string]any{"status": projected.Status, "output": projected.Output, "error": projected.Error, "executed": projected.Executed, "total": projected.Total, "updated_at": projected.UpdatedAt, "finished_at": projected.FinishedAt}
	if workspacemodel.NewExecutionModel().Update(ctx, map[string]any{"id": execution.ID, "run_id": run.ID, "project_id": run.ProjectID}, record) != 1 {
		return fmt.Errorf("提交画布执行结果失败")
	}
	return nil
}

func reportWorkspacePersistenceError(runID uint64, err error) {
	if err != nil {
		dlog.ErrorFields("workspace_run_commit", "画布运行状态保存失败，等待后台核对", dlog.Fields{"run_id": runID, "error": err.Error()})
	}
}
