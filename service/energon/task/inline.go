package task

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
	"github.com/dever-package/bot/service/worker"
)

type InlineQueue struct {
	handler  Handler
	timeout  time.Duration
	capacity int
	mu       sync.Mutex
	active   map[string]*inlineJobState
	closing  bool
	idle     chan struct{}
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
		handler:  handler,
		timeout:  timeout,
		capacity: config.QueueCapacity,
		active:   map[string]*inlineJobState{},
		idle:     make(chan struct{}),
	}
	return queue
}

func (q *InlineQueue) Push(ctx context.Context, job Job) error {
	if q.handler == nil {
		return fmt.Errorf("任务处理器未初始化")
	}
	if !worker.Active() {
		if Store(ctx) == nil {
			return fmt.Errorf("来源调用必须先持久化才能交给 Worker")
		}
		return nil
	}

	parent := context.WithoutCancel(ctx)
	if Store(ctx) != nil && !DetachedExecution(ctx) {
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
	if len(q.active) >= q.capacity {
		cancel()
		return fmt.Errorf("生成任务队列已满，请稍后重试")
	}
	q.active[requestID] = state
	queued := inlineJob{ctx: runCtx, job: job, state: state}
	if !worker.Go(parent, func(jobCtx context.Context) {
		taskCtx, taskCancel := context.WithCancel(jobCtx)
		stopCancel := context.AfterFunc(runCtx, taskCancel)
		defer stopCancel()
		defer taskCancel()
		queued.ctx = taskCtx
		q.runJob(queued)
	}) {
		delete(q.active, requestID)
		cancel()
		return &ExecutionHandoff{Cause: fmt.Errorf("Worker 正在排空，原任务等待接管")}
	}
	return nil
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

// Shutdown stops admission and waits for the caller's drain deadline. Remote
// work is never canceled merely because this process is being replaced.
func (q *InlineQueue) Shutdown(ctx context.Context) error {
	q.mu.Lock()
	if !q.closing {
		q.closing = true
		if len(q.active) == 0 {
			close(q.idle)
		}
	}
	idle := q.idle
	q.mu.Unlock()
	select {
	case <-idle:
		return nil
	case <-ctx.Done():
	}
	q.mu.Lock()
	for _, state := range q.active {
		state.cancel()
	}
	q.mu.Unlock()
	return ctx.Err()
}
