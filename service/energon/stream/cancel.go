package stream

import (
	"context"
	"strings"
	"sync"
	"time"
)

type CancelRegistry struct {
	mu    sync.Mutex
	items map[string]cancelState
}

type cancelState struct {
	Cancelable   bool
	Cancelled    bool
	RemoteCancel func(context.Context) error
}

func NewCancelRegistry() *CancelRegistry {
	return &CancelRegistry{items: map[string]cancelState{}}
}

func (r *CancelRegistry) Init(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	r.mu.Lock()
	r.items[requestID] = cancelState{}
	r.mu.Unlock()
}

func (r *CancelRegistry) Remove(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	r.mu.Lock()
	delete(r.items, requestID)
	r.mu.Unlock()
}

func (r *CancelRegistry) SetCancelable(requestID string, cancelable bool) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	r.mu.Lock()
	state := r.items[requestID]
	state.Cancelable = cancelable
	r.items[requestID] = state
	r.mu.Unlock()
}

func (r *CancelRegistry) IsCancelled(requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	r.mu.Lock()
	state, ok := r.items[requestID]
	r.mu.Unlock()
	return ok && state.Cancelled
}

func (r *CancelRegistry) SetRemoteCancel(requestID string, cancel func(context.Context) error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || cancel == nil {
		return
	}

	r.mu.Lock()
	state := r.items[requestID]
	state.RemoteCancel = cancel
	r.items[requestID] = state
	r.mu.Unlock()
}

func (r *CancelRegistry) MarkCancelled(requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	state, ok := r.items[requestID]
	if !ok || !state.Cancelable {
		return false
	}
	state.Cancelled = true
	r.items[requestID] = state
	return true
}

func (r *CancelRegistry) CancelRemote(ctx context.Context, requestID string) error {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}

	r.mu.Lock()
	state, ok := r.items[requestID]
	cancel := state.RemoteCancel
	r.mu.Unlock()
	if !ok || cancel == nil {
		return nil
	}

	cancelCtx, cancelTimeout := context.WithTimeout(ctx, 5*time.Second)
	defer cancelTimeout()
	return cancel(cancelCtx)
}
