package protocol

import (
	"errors"
	"fmt"
)

type RemoteTaskError struct {
	TaskID string
	Cause  error
}

func (failure *RemoteTaskError) Error() string {
	if failure.TaskID != "" {
		return fmt.Sprintf("ComfyUI 任务 %s 已提交，未自动重新生成：%v", failure.TaskID, failure.Cause)
	}
	return fmt.Sprintf("ComfyUI 任务已提交或提交状态无法确认，未自动重新生成：%v", failure.Cause)
}

func (failure *RemoteTaskError) Unwrap() error { return failure.Cause }

func PreventsReplay(err error) bool {
	var failure *RemoteTaskError
	var contentFailure *ContentResultError
	return errors.As(err, &failure) || errors.As(err, &contentFailure)
}

// ContentResultError forbids replay after a model has returned a content result.
type ContentResultError struct{ Cause error }

func (e *ContentResultError) Error() string { return e.Cause.Error() }
func (e *ContentResultError) Unwrap() error { return e.Cause }
