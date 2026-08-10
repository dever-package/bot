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

	runCtx, cancel := context.WithCancel(context.Background())
	state := &inlineJobState{cancel: cancel}
	if !q.register(job.RequestID, state) {
		cancel()
		return fmt.Errorf("任务已在运行: %s", strings.TrimSpace(job.RequestID))
	}

	queued := inlineJob{ctx: runCtx, job: job, state: state}
	select {
	case q.jobs <- queued:
		return nil
	default:
		q.unregister(job.RequestID, state)
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

func (q *InlineQueue) register(requestID string, state *inlineJobState) bool {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || state == nil || state.cancel == nil {
		return false
	}

	q.mu.Lock()
	defer q.mu.Unlock()
	if _, exists := q.active[requestID]; exists {
		return false
	}
	q.active[requestID] = state
	return true
}

func (q *InlineQueue) unregister(requestID string, state *inlineJobState) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return
	}

	q.mu.Lock()
	if q.active[requestID] == state {
		delete(q.active, requestID)
	}
	q.mu.Unlock()
}
