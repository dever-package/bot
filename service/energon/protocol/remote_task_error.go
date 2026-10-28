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

// WritingResultError 表示一个明确完成、但未通过写作结果校验的请求；不是重放许可。
const WritingResultFailureCode = "invalid_completed_writing_result"

type WritingResultError struct {
	RequestID string
	Cause     error
}

func (e *WritingResultError) Error() string     { return e.Cause.Error() }
func (e *WritingResultError) Unwrap() error     { return &ContentResultError{Cause: e.Cause} }
func (e *WritingResultError) ErrorCode() string { return WritingResultFailureCode }

// 只沿单一原因链识别；混合了结算/存储失败的 joined error 不可发起内容修正。
func IsWritingResultError(err error, requestID string) bool {
	for err != nil {
		if failure, ok := err.(*WritingResultError); ok {
			return requestID != "" && failure.RequestID == requestID
		}
		wrapped, ok := err.(interface{ Unwrap() error })
		if !ok {
			return false
		}
		err = wrapped.Unwrap()
	}
	return false
}
func RestoreWritingResultError(requestID, code, message string) error {
	cause := fmt.Errorf("%s", message)
	if requestID != "" && code == WritingResultFailureCode {
		return &WritingResultError{RequestID: requestID, Cause: cause}
	}
	return cause
}
