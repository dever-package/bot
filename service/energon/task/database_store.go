package task

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	"github.com/shemic/dever/orm"
)

// DatabaseStore owns the receipt. A business run supplies its transaction guard,
// so recording the result and charging it retain the parent's execution fence.
type DatabaseStore struct {
	RunID, NodeRunID uint64
	UserID, AdminID  uint64
	Guard            func(context.Context, bool) error
	AfterSave        func(context.Context, *ExecutionCheckpoint, bool) error
}

func WithDefaultStore(ctx context.Context) context.Context { return WithDefaultStoreFor(ctx, 0, 0) }
func WithDefaultStoreFor(ctx context.Context, userID, adminID uint64) context.Context {
	if Store(ctx) != nil {
		return ctx
	}
	return WithExecutionStore(context.WithValue(ctx, detachedKey{}, true), DatabaseStore{UserID: userID, AdminID: adminID})
}

func (s DatabaseStore) Load(ctx context.Context, id string) (checkpoint *ExecutionCheckpoint, err error) {
	defer databaseError(&err)
	row := botmodel.NewExecutionModel().Find(ctx, map[string]any{"request_id": id})
	if row == nil {
		return nil, nil
	}
	if row.RunID != s.RunID || row.NodeRunID != s.NodeRunID || s.RunID == 0 && s.NodeRunID == 0 && (row.UserID != s.UserID || row.AdminID != s.AdminID) {
		return nil, fmt.Errorf("来源调用不属于当前运行")
	}
	var cp ExecutionCheckpoint
	if err := json.Unmarshal([]byte(row.Checkpoint), &cp); err != nil {
		return nil, fmt.Errorf("来源回执损坏: %w", err)
	}
	return &cp, nil
}

func (s DatabaseStore) Save(ctx context.Context, change ExecutionChange) (*ExecutionCheckpoint, error) {
	return s.CommitResult(ctx, change, nil)
}

func (s DatabaseStore) CommitResult(ctx context.Context, change ExecutionChange, record func(context.Context) error) (saved *ExecutionCheckpoint, err error) {
	defer databaseError(&err)
	model := botmodel.NewExecutionModel()
	row := model.Find(ctx, map[string]any{"request_id": change.Checkpoint.RequestID})
	if row == nil {
		cp, mergeErr := MergeExecutionCheckpoint(nil, change)
		if mergeErr != nil {
			return nil, mergeErr
		}
		encoded, encodeErr := json.Marshal(cp)
		if encodeErr != nil {
			return nil, encodeErr
		}
		db, dbErr := orm.Get(model.Config().Database)
		if dbErr != nil {
			return nil, dbErr
		}
		// The unique request key also arbitrates two workers registering the same
		// request before either has selected an account or submitted anything.
		query := `INSERT INTO "` + strings.ReplaceAll(model.Config().Table, `"`, `""`) + `" (request_id,root_request_id,checkpoint,request,run_id,node_run_id,user_id,admin_id,provider_id,account_id,service_id,phase,owner,version,cancel_requested,remote_task_id,remote_terminal,task_outstanding,last_error,updated_at,created_at) VALUES (?,?,?, '{}',?,?,?,?,0,0,0,'prepared','',0,false,'',false,false,'',?,?) ON CONFLICT (request_id) DO NOTHING`
		if _, err := db.ExecContext(ctx, db.Rebind(query), cp.RequestID, RootRequestID(ctx), string(encoded), s.RunID, s.NodeRunID, s.UserID, s.AdminID, time.Now(), time.Now()); err != nil {
			return nil, err
		}
		row = model.Find(ctx, map[string]any{"request_id": cp.RequestID})
		if row == nil {
			return nil, fmt.Errorf("来源调用登记失败")
		}
		if row.Checkpoint != string(encoded) {
			return s.Load(ctx, cp.RequestID)
		}
	}
	if row.RunID != s.RunID || row.NodeRunID != s.NodeRunID || s.RunID == 0 && s.NodeRunID == 0 && (row.UserID != s.UserID || row.AdminID != s.AdminID) {
		return nil, fmt.Errorf("来源调用不属于当前运行")
	}
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if s.Guard != nil {
			if err := s.Guard(tx, change.FactsOnly); err != nil {
				return err
			}
		}
		// Lock this receipt before merging late facts, billing and the next stage.
		if model.Update(tx, map[string]any{"id": row.ID}, map[string]any{"updated_at": time.Now()}) != 1 {
			return fmt.Errorf("来源调用不存在")
		}
		if !change.FactsOnly {
			if err := checkExecutionFence(tx); err != nil {
				return err
			}
		}
		current, loadErr := s.Load(tx, change.Checkpoint.RequestID)
		if loadErr != nil {
			return loadErr
		}
		if err := checkExecutionAttempt(tx, current); err != nil {
			return err
		}
		if record != nil && current.Persisted != nil {
			saved = current
			return nil
		}
		saved, loadErr = MergeExecutionCheckpoint(current, change)
		if loadErr != nil {
			return loadErr
		}
		if record != nil {
			if err := record(tx); err != nil {
				return err
			}
		}
		encoded, encodeErr := json.Marshal(saved)
		if encodeErr != nil {
			return encodeErr
		}
		updates := map[string]any{"last_error": saved.LastError, "checkpoint": string(encoded), "remote_task_id": saved.RemoteTaskID, "remote_terminal": saved.RemoteResponse != nil, "provider_id": saved.ProviderID, "account_id": saved.AccountID, "service_id": saved.ServiceID, "updated_at": time.Now()}
		if change.Retry {
			updates["phase"] = "queued"
			updates["task_outstanding"] = false
		}
		if saved.RemoteTaskID != "" {
			updates["phase"] = "submitted"
		}
		if saved.RemoteResponse != nil || saved.Result != nil {
			updates["phase"] = "fetching"
		}
		if saved.Persisted != nil {
			updates["phase"] = "succeeded"
		}
		if saved.Failure != "" {
			updates["phase"] = "failed"
			live := model.Find(tx, map[string]any{"id": row.ID})
			if live.TaskOutstanding && saved.RemoteResponse == nil {
				updates["phase"] = "unknown"
				if saved.RemoteTaskID != "" {
					updates["phase"] = "submitted"
				}
			}
		}
		if model.Update(tx, map[string]any{"id": row.ID}, updates) != 1 {
			return fmt.Errorf("来源回执保存失败")
		}
		if s.AfterSave != nil {
			return s.AfterSave(tx, saved, change.FactsOnly)
		}
		return nil
	})
	return saved, err
}

func databaseError(err *error) {
	if value := recover(); value != nil {
		if cause, ok := value.(error); ok {
			*err = fmt.Errorf("来源回执存储失败: %w", cause)
		} else {
			*err = fmt.Errorf("来源回执存储失败: %v", value)
		}
	}
}
