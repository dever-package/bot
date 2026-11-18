package task

import (
	"context"
	"fmt"
)

type fenceKey struct{}
type detachedKey struct{}
type attemptKey struct{}
type executionAttempt struct{ requestID, token string }

func WithExecutionAttempt(ctx context.Context, id, token string) context.Context {
	return context.WithValue(ctx, attemptKey{}, executionAttempt{id, token})
}

func checkExecutionAttempt(ctx context.Context, checkpoint *ExecutionCheckpoint) error {
	attempt, ok := ctx.Value(attemptKey{}).(executionAttempt)
	if ok && attempt.requestID == checkpoint.RequestID && attempt.token != checkpoint.SubmissionToken {
		return &ExecutionHandoff{Cause: fmt.Errorf("原执行尝试已结束，不能覆盖恢复重试的回执")}
	}
	return nil
}

func WithExecutionFence(ctx context.Context, fence func(context.Context) error) context.Context {
	return context.WithValue(ctx, fenceKey{}, fence)
}
func checkExecutionFence(ctx context.Context) error {
	if fence, ok := ctx.Value(fenceKey{}).(func(context.Context) error); ok {
		return fence(ctx)
	}
	return nil
}
func DetachedExecution(ctx context.Context) bool {
	detached, _ := ctx.Value(detachedKey{}).(bool)
	return detached
}
