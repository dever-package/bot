package loop

import (
	"context"
	"strings"
	"sync"
	"time"
)

type runController struct {
	ctx    context.Context
	cancel context.CancelFunc

	mu             sync.Mutex
	childRequestID string
	stopReason     string
}

func newRunController(parent context.Context, timeout time.Duration) *runController {
	if parent == nil {
		parent = context.Background()
	}
	ctx, cancel := context.WithTimeout(parent, timeout)
	return &runController{ctx: ctx, cancel: cancel}
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
	controller.mu.Lock()
	if controller.stopReason == "" {
		controller.stopReason = strings.TrimSpace(reason)
	}
	childRequestID := controller.childRequestID
	controller.mu.Unlock()
	controller.cancel()
	return childRequestID
}

func (controller *runController) StopReason() string {
	controller.mu.Lock()
	reason := controller.stopReason
	controller.mu.Unlock()
	return reason
}

type runRegistry struct {
	items sync.Map
}

func newRunRegistry() *runRegistry {
	return &runRegistry{}
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
