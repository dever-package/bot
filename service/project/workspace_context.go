package project

import (
	"context"
	"time"
)

type workspaceDetachedContext struct {
	context.Context
}

func detachedWorkspaceContext(ctx context.Context) context.Context {
	if ctx == nil {
		return context.Background()
	}
	return workspaceDetachedContext{Context: ctx}
}

func (workspaceDetachedContext) Deadline() (time.Time, bool) {
	return time.Time{}, false
}

func (workspaceDetachedContext) Done() <-chan struct{} {
	return nil
}

func (workspaceDetachedContext) Err() error {
	return nil
}
