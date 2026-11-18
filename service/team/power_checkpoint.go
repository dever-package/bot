package team

import (
	"context"
	"errors"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	bottask "github.com/dever-package/bot/service/energon/task"
)

type powerCheckpointStore struct {
	runID, nodeRunID uint64
	owner            string
	version          int
}

func (store powerCheckpointStore) databaseStore() bottask.DatabaseStore {
	return bottask.DatabaseStore{RunID: store.runID, NodeRunID: store.nodeRunID,
		Guard: func(tx context.Context, factsOnly bool) error {
			if factsOnly {
				if teammodel.NewRunModel().Update(tx, map[string]any{"id": store.runID}, map[string]any{"updated_at": time.Now()}) != 1 {
					return fmt.Errorf("能力所属运行不存在")
				}
			} else if err := lockRunExecution(tx, store.runID, store.owner, store.version); err != nil {
				return err
			}
			node := teammodel.NewNodeRunModel().Find(tx, map[string]any{"id": store.nodeRunID, "run_id": store.runID})
			if node == nil {
				return fmt.Errorf("能力节点不存在")
			}
			if !factsOnly && teamRunTerminal(node.Status) {
				return fmt.Errorf("能力节点已经结束")
			}
			return nil
		}, AfterSave: func(tx context.Context, checkpoint *bottask.ExecutionCheckpoint, factsOnly bool) error {
			updates := map[string]any{"updated_at": time.Now()}
			if !factsOnly {
				updates["error"] = checkpoint.LastError
			}
			if teammodel.NewNodeRunModel().Update(tx, map[string]any{"id": store.nodeRunID, "run_id": store.runID}, updates) != 1 {
				return fmt.Errorf("保存能力节点回执引用失败")
			}
			return nil
		}}
}
func (store powerCheckpointStore) Load(ctx context.Context, id string) (*bottask.ExecutionCheckpoint, error) {
	return store.databaseStore().Load(ctx, id)
}
func (store powerCheckpointStore) Save(ctx context.Context, change bottask.ExecutionChange) (*bottask.ExecutionCheckpoint, error) {
	return store.databaseStore().Save(ctx, change)
}
func (store powerCheckpointStore) CommitResult(ctx context.Context, change bottask.ExecutionChange, record func(context.Context) error) (*bottask.ExecutionCheckpoint, error) {
	return store.databaseStore().CommitResult(ctx, change, record)
}
func (s Service) powerExecutionContext(ctx context.Context, runID, nodeRunID uint64) (context.Context, error) {
	if runID == 0 || nodeRunID == 0 {
		return ctx, nil
	}
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return ctx, fmt.Errorf("能力所属运行不存在")
	}
	return bottask.WithExecutionStore(ctx, powerCheckpointStore{runID: runID, nodeRunID: nodeRunID, owner: runExecutionOwner(ctx), version: run.ExecutionVersion}), nil
}

func powerExecutionHandedOff(err error) bool {
	var handoff *bottask.ExecutionHandoff
	return errors.As(err, &handoff)
}
func (s Service) canvasPowerHasCheckpoint(ctx context.Context, runID uint64) bool {
	return energonmodel.NewExecutionModel().Find(ctx, map[string]any{"run_id": runID}) != nil
}

// Dever ORM raises storage failures as panics; the capability boundary returns them after transaction rollback.
func runtimeStorageError(err *error) {
	if recovered := recover(); recovered != nil {
		*err = fmt.Errorf("运行提交存储失败: %v", recovered)
	}
}

func (s Service) deferPowerFinalization(ctx context.Context, runID, nodeRunID uint64, requestID string, cause error) error {
	checkpointCtx, err := s.powerExecutionContext(ctx, runID, nodeRunID)
	if err != nil {
		return errors.Join(cause, err)
	}
	return bottask.DeferFinalization(checkpointCtx, requestID, cause)
}
