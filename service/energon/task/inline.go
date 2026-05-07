package task

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"
)

type InlineQueue struct {
	handler Handler
	timeout time.Duration
	mu      sync.Mutex
	running map[string]context.CancelFunc
}

func NewInlineQueue(handler Handler, timeout time.Duration) *InlineQueue {
	return &InlineQueue{
		handler: handler,
		timeout: timeout,
		running: map[string]context.CancelFunc{},
	}
}

func (q *InlineQueue) Push(ctx context.Context, job Job) error {
	if q.handler == nil {
		return fmt.Errorf("任务处理器未初始化")
	}

	runCtx, cancel := q.jobContext()
	q.register(job.RequestID, cancel)
	go func() {
		defer q.unregister(job.RequestID)
		defer cancel()

		_ = q.handler.HandleTask(runCtx, job)
	}()
	return nil
}

func (q *InlineQueue) Cancel(_ context.Context, requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	q.mu.Lock()
	cancel, ok := q.running[requestID]
	q.mu.Unlock()
	if !ok {
		return false
	}
	cancel()
	return true
}

func (q *InlineQueue) jobContext() (context.Context, context.CancelFunc) {
	baseCtx, baseCancel := context.WithCancel(context.Background())
	if q.timeout <= 0 {
		return baseCtx, baseCancel
	}

	runCtx, timeoutCancel := context.WithTimeout(baseCtx, q.timeout)
	return runCtx, func() {
		timeoutCancel()
		baseCancel()
	}
}

func (q *InlineQueue) register(requestID string, cancel context.CancelFunc) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || cancel == nil {
		return
	}

	q.mu.Lock()
	q.running[requestID] = cancel
	q.mu.Unlock()
}

func (q *InlineQueue) unregister(requestID string) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	q.mu.Lock()
	delete(q.running, requestID)
	q.mu.Unlock()
}
