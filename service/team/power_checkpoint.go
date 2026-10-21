package team

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/shemic/dever/orm"
)

type powerCheckpointStore struct {
	runID, nodeRunID uint64
	owner            string
	version          int
}
type nodeExecutionCheckpoints struct {
	Version  int                                    `json:"version"`
	Requests map[string]bottask.ExecutionCheckpoint `json:"requests"`
}

func decodeNodeExecutionCheckpoints(raw string) (nodeExecutionCheckpoints, error) {
	checkpoints := nodeExecutionCheckpoints{Version: 1, Requests: map[string]bottask.ExecutionCheckpoint{}}
	if raw == "" || raw == "{}" {
		return checkpoints, nil
	}
	if err := json.Unmarshal([]byte(raw), &checkpoints); err != nil {
		return checkpoints, fmt.Errorf("能力检查点损坏: %w", err)
	}
	if checkpoints.Version != 1 || checkpoints.Requests == nil {
		return checkpoints, fmt.Errorf("能力检查点版本不支持")
	}
	return checkpoints, nil
}
func (store powerCheckpointStore) Load(ctx context.Context, requestID string) (checkpoint *bottask.ExecutionCheckpoint, err error) {
	defer runtimeStorageError(&err)
	node := teammodel.NewNodeRunModel().Find(ctx, map[string]any{"id": store.nodeRunID, "run_id": store.runID})
	if node == nil {
		return nil, fmt.Errorf("能力节点不存在")
	}
	checkpoints, err := decodeNodeExecutionCheckpoints(node.ExecutionCheckpoint)
	if err != nil {
		return nil, err
	}
	entry, exists := checkpoints.Requests[requestID]
	if !exists {
		return nil, nil
	}
	return &entry, nil
}
func (store powerCheckpointStore) Save(ctx context.Context, change bottask.ExecutionChange) (*bottask.ExecutionCheckpoint, error) {
	return store.CommitResult(ctx, change, nil)
}
func (store powerCheckpointStore) CommitResult(ctx context.Context, change bottask.ExecutionChange, record func(context.Context) error) (saved *bottask.ExecutionCheckpoint, err error) {
	defer runtimeStorageError(&err)
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if change.FactsOnly {
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
		if !change.FactsOnly && teamRunTerminal(node.Status) {
			return fmt.Errorf("能力节点已经结束")
		}
		checkpoints, err := decodeNodeExecutionCheckpoints(node.ExecutionCheckpoint)
		if err != nil {
			return err
		}
		var current *bottask.ExecutionCheckpoint
		if entry, exists := checkpoints.Requests[change.Checkpoint.RequestID]; exists {
			current = &entry
		}
		saved, err = bottask.MergeExecutionCheckpoint(current, change)
		if err != nil {
			return err
		}
		if record != nil {
			if err := record(tx); err != nil {
				return err
			}
		}
		checkpoints.Requests[saved.RequestID] = *saved
		encoded, err := json.Marshal(checkpoints)
		if err != nil {
			return err
		}
		if teammodel.NewNodeRunModel().Update(tx, map[string]any{"id": node.ID, "run_id": store.runID}, checkpointNodeUpdates(*saved, string(encoded), change.FactsOnly)) != 1 {
			return fmt.Errorf("保存能力检查点失败")
		}
		return nil
	})
	return saved, err
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
	for _, node := range s.repo.ListNodeRuns(ctx, runID) {
		checkpoints, err := decodeNodeExecutionCheckpoints(node.ExecutionCheckpoint)
		if err == nil && len(checkpoints.Requests) > 0 {
			return true
		}
	}
	return false
}

// Dever ORM raises storage failures as panics; the capability boundary returns them after transaction rollback.
func runtimeStorageError(err *error) {
	if recovered := recover(); recovered != nil {
		*err = fmt.Errorf("运行提交存储失败: %v", recovered)
	}
}

func checkpointNodeUpdates(checkpoint bottask.ExecutionCheckpoint, encoded string, factsOnly bool) map[string]any {
	updates := map[string]any{"execution_checkpoint": encoded, "updated_at": time.Now()}
	if !factsOnly {
		updates["error"] = checkpoint.LastError
	}
	return updates
}

func (s Service) deferPowerFinalization(ctx context.Context, runID, nodeRunID uint64, requestID string, cause error) error {
	checkpointCtx, err := s.powerExecutionContext(ctx, runID, nodeRunID)
	if err != nil {
		return errors.Join(cause, err)
	}
	return bottask.DeferFinalization(checkpointCtx, requestID, cause)
}
