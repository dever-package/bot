package team

import (
	"context"
	"fmt"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/shemic/dever/orm"
)

// Run locks always precede child, blackboard and asset writes. Owner identities are unique per claim.
func withRunExecutionCommit(ctx context.Context, runID uint64, write func(context.Context) error) (err error) {
	defer runtimeStorageError(&err)
	return orm.Transaction(ctx, func(tx context.Context) error {
		current := teammodel.NewRunModel().Find(tx, map[string]any{"id": runID})
		if current == nil {
			return fmt.Errorf("运行不存在")
		}
		if err := lockRunExecution(tx, runID, runExecutionOwner(ctx), current.ExecutionVersion); err != nil {
			return err
		}
		return write(tx)
	})
}
func lockRunExecution(ctx context.Context, runID uint64, owner string, version int) error {
	if owner == "" {
		return &bottask.ExecutionHandoff{Cause: fmt.Errorf("运行缺少有效执行租约")}
	}
	filters := map[string]any{"id": runID, "execution_owner": owner, "execution_version": version, "execution_expires_at": map[string]any{"gt": time.Now()}, "status": []string{teammodel.RunStatusRunning, teammodel.RunStatusPending}}
	if teammodel.NewRunModel().Update(ctx, filters, map[string]any{"updated_at": time.Now()}) != 1 {
		return &bottask.ExecutionHandoff{Cause: fmt.Errorf("运行已停止或执行租约已失效")}
	}
	return nil
}
