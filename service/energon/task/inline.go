package task

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
)

type InlineQueue struct {
	handler Handler
	timeout time.Duration
	jobs    chan inlineJob
	mu      sync.Mutex
	active  map[string]*inlineJobState
	closing bool
	idle    chan struct{}
}

type inlineJob struct {
	ctx   context.Context
	job   Job
	state *inlineJobState
}

type inlineJobState struct {
	cancel context.CancelFunc
}

func NewInlineQueue(handler Handler, timeout time.Duration) *InlineQueue {
	config := botruntimeconfig.Load()
	queue := &InlineQueue{
		handler: handler,
		timeout: timeout,
		jobs:    make(chan inlineJob, config.QueueCapacity),
		active:  map[string]*inlineJobState{},
		idle:    make(chan struct{}),
	}
	for index := 0; index < config.WorkerConcurrency; index++ {
		go queue.runWorker()
	}
	return queue
}

func (q *InlineQueue) Push(ctx context.Context, job Job) error {
	if q.handler == nil {
		return fmt.Errorf("任务处理器未初始化")
	}

	parent := context.WithoutCancel(ctx)
	if Store(ctx) != nil {
		parent = ctx
	}
	runCtx, cancel := context.WithCancel(parent)
	state := &inlineJobState{cancel: cancel}
	q.mu.Lock()
	defer q.mu.Unlock()
	if q.closing {
		cancel()
		return &ExecutionHandoff{Cause: fmt.Errorf("服务正在交接任务，暂不接收新调用")}
	}
	requestID := strings.TrimSpace(job.RequestID)
	if requestID == "" {
		cancel()
		return fmt.Errorf("任务请求身份不能为空")
	}
	if _, exists := q.active[requestID]; exists {
		cancel()
		err := fmt.Errorf("原任务的本地执行仍在交接: %s", requestID)
		if Store(ctx) != nil {
			return &ExecutionHandoff{Cause: err}
		}
		return err
	}
	q.active[requestID] = state
	queued := inlineJob{ctx: runCtx, job: job, state: state}
	select {
	case q.jobs <- queued:
		return nil
	default:
		delete(q.active, requestID)
		cancel()
		return fmt.Errorf("生成任务队列已满，请稍后重试")
	}

}

func (q *InlineQueue) Cancel(_ context.Context, requestID string) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return false
	}

	q.mu.Lock()
	state, ok := q.active[requestID]
	q.mu.Unlock()
	if !ok {
		return false
	}
	state.cancel()
	return true
}

func (q *InlineQueue) runWorker() {
	for queued := range q.jobs {
		q.runJob(queued)
	}
}

func (q *InlineQueue) runJob(queued inlineJob) {
	defer q.unregister(queued.job.RequestID, queued.state)
	defer queued.state.cancel()
	if queued.ctx.Err() != nil {
		SignalHandoff(queued.ctx)
		return
	}

	runCtx := queued.ctx
	cancel := func() {}
	if q.timeout > 0 {
		runCtx, cancel = context.WithTimeout(queued.ctx, q.timeout)
	}
	defer cancel()
	_ = q.handler.HandleTask(runCtx, queued.job)
}

func (q *InlineQueue) unregister(requestID string, state *inlineJobState) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	q.mu.Lock()
	if q.active[requestID] == state {
		delete(q.active, requestID)
		if q.closing && len(q.active) == 0 {
			select {
			case <-q.idle:
			default:
				close(q.idle)
			}
		}
	}
	q.mu.Unlock()
}

// Shutdown drains short requests, then cancels local observation without invoking remote cancellation.
func (q *InlineQueue) Shutdown(ctx context.Context) error {
	q.mu.Lock()
	if !q.closing {
		q.closing = true
		close(q.jobs)
		if len(q.active) == 0 {
			close(q.idle)
		}
	}
	idle := q.idle
	q.mu.Unlock()
	grace := time.NewTimer(3 * time.Second)
	defer grace.Stop()
	select {
	case <-idle:
		return nil
	case <-ctx.Done():
	case <-grace.C:
	}
	q.mu.Lock()
	for _, state := range q.active {
		state.cancel()
	}
	q.mu.Unlock()
	select {
	case <-idle:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(time.Second):
		return nil
	}
}
