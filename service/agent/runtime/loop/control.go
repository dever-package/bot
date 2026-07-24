package loop

import (
	"context"
	"strings"
	"sync"
	"time"
)

type runController struct {
	ctx           context.Context
	cancel        context.CancelFunc
	cancelCause   context.CancelCauseFunc
	timeoutCancel context.CancelFunc

	mu             sync.Mutex
	childRequestID string
	stopReason     string
}

type runStopCause string

func (cause runStopCause) Error() string {
	return string(cause)
}

func newRunController(parent context.Context, timeout time.Duration) *runController {
	if parent == nil {
		parent = context.Background()
	}
	causeContext, cancelCause := context.WithCancelCause(parent)
	ctx, timeoutCancel := context.WithTimeout(causeContext, timeout)
	cancel := func() {
		cancelCause(context.Canceled)
		timeoutCancel()
	}
	return &runController{
		ctx:           ctx,
		cancel:        cancel,
		cancelCause:   cancelCause,
		timeoutCancel: timeoutCancel,
	}
}

func (controller *runController) Context() context.Context {
	return controller.ctx
}

func (controller *runController) SetChild(requestID string) {
	controller.mu.Lock()
	controller.childRequestID = strings.TrimSpace(requestID)
	controller.mu.Unlock()
}

func (controller *runController) ClearChild(requestID string) {
	controller.mu.Lock()
	if controller.childRequestID == strings.TrimSpace(requestID) {
		controller.childRequestID = ""
	}
	controller.mu.Unlock()
}

func (controller *runController) Stop(reason string) string {
	reason = strings.TrimSpace(reason)
	controller.mu.Lock()
	if controller.stopReason == "" {
		controller.stopReason = reason
	}
	childRequestID := controller.childRequestID
	controller.mu.Unlock()
	controller.cancelCause(runStopCause(reason))
	controller.timeoutCancel()
	return childRequestID
}

func (controller *runController) StopReason() string {
	controller.mu.Lock()
	reason := controller.stopReason
	controller.mu.Unlock()
	if reason == "" {
		if cause, ok := context.Cause(controller.ctx).(runStopCause); ok {
			reason = string(cause)
		}
	}
	return reason
}

type runRegistry struct {
	items sync.Map
}

var sharedRuns = &runRegistry{}

func newRunRegistry() *runRegistry {
	return sharedRuns
}

func (registry *runRegistry) Start(requestID string, parent context.Context, timeout time.Duration) *runController {
	controller := newRunController(parent, timeout)
	registry.items.Store(strings.TrimSpace(requestID), controller)
	return controller
}

func (registry *runRegistry) Find(requestID string) *runController {
	value, exists := registry.items.Load(strings.TrimSpace(requestID))
	if !exists {
		return nil
	}
	controller, _ := value.(*runController)
	return controller
}

func (registry *runRegistry) Remove(requestID string) {
	registry.items.Delete(strings.TrimSpace(requestID))
}
