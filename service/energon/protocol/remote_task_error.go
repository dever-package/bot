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
	return errors.As(err, &failure)
}
