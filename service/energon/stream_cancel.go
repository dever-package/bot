package energon

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	bottask "my/package/bot/service/energon/task"
)

type streamCancelRegistry struct {
	mu    sync.Mutex
	items map[string]streamCancelState
}

type streamCancelState struct {
	Cancelable   bool
	Cancelled    bool
	RemoteCancel func(context.Context) error
}

func newStreamCancelRegistry() *streamCancelRegistry {
	return &streamCancelRegistry{items: map[string]streamCancelState{}}
}

func (r *streamCancelRegistry) Init(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	r.mu.Lock()
	r.items[requestID] = streamCancelState{}
	r.mu.Unlock()
}

func (r *streamCancelRegistry) Remove(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	r.mu.Lock()
	delete(r.items, requestID)
	r.mu.Unlock()
}

func (r *streamCancelRegistry) SetCancelable(requestID string, cancelable bool) {
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

func (r *streamCancelRegistry) IsCancelable(requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	r.mu.Lock()
	state, ok := r.items[requestID]
	r.mu.Unlock()
	return ok && state.Cancelable
}

func (r *streamCancelRegistry) SetRemoteCancel(requestID string, cancel func(context.Context) error) {
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

func (r *streamCancelRegistry) MarkCancelled(requestID string) bool {
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

func (r *streamCancelRegistry) IsCancelled(requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	r.mu.Lock()
	state, ok := r.items[requestID]
	r.mu.Unlock()
	return ok && state.Cancelled
}

func (r *streamCancelRegistry) CancelRemote(ctx context.Context, requestID string) error {
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

func (s GatewayService) StopStream(ctx context.Context, requestID string) botprotocol.Response {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("request_id 不能为空"))
	}
	if !s.streamCancels.MarkCancelled(requestID) {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("当前任务不支持取消或已结束"))
	}
	remoteErr := s.streamCancels.CancelRemote(ctx, requestID)
	cancelledLocal := s.tasks.Cancel(ctx, requestID)
	if remoteErr != nil {
		return botprotocol.BuildErrorResponse(requestID, remoteErr)
	}
	if !cancelledLocal {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("当前任务已结束"))
	}

	resp := botprotocol.BuildStreamResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "任务已取消",
	})
	_ = s.writeStream(ctx, requestID, resp)
	result := botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "任务已取消",
	})
	_ = s.writeStream(ctx, requestID, result)
	return result
}

func supportsStreamCancel(adapter botprotocol.Adapter, input botprotocol.NativeInput) bool {
	if cancelSupport, ok := adapter.(bottask.CancelSupportAdapter); ok {
		return cancelSupport.SupportsCancel(input)
	}
	return false
}

func cancelableMeta(cancelable bool) map[string]any {
	return map[string]any{"cancelable": cancelable}
}
