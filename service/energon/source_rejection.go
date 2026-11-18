package energon

import (
	"context"
	"errors"
	"fmt"
	botschedule "github.com/dever-package/bot/service/energon/schedule"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	bottask "github.com/dever-package/bot/service/energon/task"
)

type submissionNotSent struct{ cause error }

func (err *submissionNotSent) Error() string { return err.cause.Error() }
func (err *submissionNotSent) Unwrap() error { return err.cause }
func wasNotSubmitted(err error) bool         { var failure *submissionNotSent; return errors.As(err, &failure) }

// This records a proven local rejection, without authorizing any business
// settlement or reviving a stopped parent run.
func (c *sourceCall) rejectUnsent(ctx context.Context, cause error) (err error) {
	return executionError(&submissionNotSent{cause: errors.Join(cause, c.fail(ctx, cause))})
}

func (c *sourceCall) fail(ctx context.Context, cause error) (err error) {
	defer botschedule.StorageError(&err)
	cleanup, cancel := context.WithTimeout(context.WithoutCancel(ctx), 10*time.Second)
	defer cancel()
	cleanup = context.WithValue(cleanup, sourceObserveKey{}, true)
	row := botmodel.NewExecutionModel().Find(cleanup, map[string]any{"request_id": c.id})
	if row == nil {
		return fmt.Errorf("来源回执已不存在")
	}
	store := bottask.DatabaseStore{RunID: row.RunID, NodeRunID: row.NodeRunID, UserID: row.UserID, AdminID: row.AdminID}
	cp, saveErr := store.Load(cleanup, c.id)
	if saveErr == nil {
		if cp.SubmissionResponse != nil || cp.RemoteTaskID != "" || cp.RemoteResponse != nil || cp.Result != nil || cp.Persisted != nil {
			return &bottask.ExecutionHandoff{Cause: fmt.Errorf("来源已有回执，继续原任务收尾")}
		}
		if cp.Failure == "" {
			cp.Failure = cause.Error()
		}
		cp.LastError = cause.Error()
		_, saveErr = store.Save(bottask.WithExecutionFence(cleanup, c.fence), bottask.ExecutionChange{Checkpoint: *cp})
	}
	if saveErr != nil {
		return saveErr
	}
	finishErr := c.complete(cleanup)
	phase := "failed"
	if row.CancelRequested {
		phase = "canceled"
	}
	stateErr := c.update(cleanup, map[string]any{"phase": phase, "last_error": cause.Error(), "expires_at": time.Now()})
	return errors.Join(finishErr, stateErr)
}
