package energon

import (
	"context"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func unconfirmedSubmission(checkpoint *bottask.ExecutionCheckpoint) bool {
	return checkpoint.Stage == bottask.ExecutionSubmitting && checkpoint.RemoteTaskID == "" && checkpoint.SubmissionResponse == nil && checkpoint.RemoteResponse == nil && checkpoint.Result == nil && checkpoint.Persisted == nil
}

func (s GatewayService) resumeInterruptedSource(ctx context.Context, req *botprotocol.ShemicRequest, checkpoint *bottask.ExecutionCheckpoint) (*bottask.ExecutionCheckpoint, error) {
	if !checkpoint.RetryableSubmission || !unconfirmedSubmission(checkpoint) || checkpoint.Failure != "" {
		return checkpoint, nil
	}
	if time.Now().Before(checkpoint.SubmissionDeadline) {
		message := "原调用已中断，等待请求超时后自动恢复"
		_ = s.writeStreamOutput(ctx, req.RequestID, botprotocol.Output{"event": "status", "text": message, "meta": map[string]any{"execution_phase": "queued"}})
		return checkpoint, &bottask.ExecutionHandoff{Cause: fmt.Errorf("%s", message)}
	}
	if checkpoint.ResponseStarted || checkpoint.Attempt >= bottask.MaxSubmissionAttempts || !time.Now().Before(checkpoint.Deadline) {
		message := "来源调用中断，已用完一次恢复重试"
		if checkpoint.ResponseStarted {
			message = "来源流式输出已中断，保留已收到的内容，请重新执行"
		} else if !time.Now().Before(checkpoint.Deadline) {
			message = "来源调用已超过原任务恢复期限"
		}
		if checkpoint.LastError != "" {
			message += ": " + checkpoint.LastError
		}
		return checkpoint, ctx.Value(sourceCallKey{}).(*sourceCall).rejectUnsent(ctx, fmt.Errorf("%s", message))
	}
	checkpoint, err := bottask.Store(ctx).Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint, Retry: true})
	if err == nil {
		_ = s.writeStreamOutput(ctx, req.RequestID, botprotocol.Output{"event": "status", "text": "原调用已中断，正在进行一次恢复重试", "meta": map[string]any{"execution_phase": "queued"}})
	}
	return checkpoint, err
}

func finishInterruptedSource(ctx context.Context, row botmodel.Execution, checkpoint *bottask.ExecutionCheckpoint) error {
	ctx = context.WithValue(ctx, sourceObserveKey{}, true)
	ctx = bottask.WithExecutionStore(ctx, bottask.DatabaseStore{RunID: row.RunID, NodeRunID: row.NodeRunID, UserID: row.UserID, AdminID: row.AdminID})
	call, _, err := claimSourceCall(ctx, row.RequestID, false)
	if err != nil {
		return err
	}
	ctx = bottask.WithExecutionFence(ctx, call.fence)
	ctx = bottask.WithExecutionAttempt(ctx, row.RequestID, checkpoint.SubmissionToken)
	cause := context.Canceled
	if checkpoint.Failure != "" {
		cause = fmt.Errorf("%s", checkpoint.Failure)
	} else if !row.CancelRequested {
		cause = fmt.Errorf("来源调用已超过原任务恢复期限: %s", checkpoint.LastError)
	}
	return call.fail(ctx, cause)
}
