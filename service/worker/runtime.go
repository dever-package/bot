package worker

import (
	"context"
	"errors"
	"fmt"
	"sync"
)

type jobContextKey struct{}

type backgroundLoop struct {
	name string
	run  func(context.Context)
}

type process struct {
	ctx      context.Context
	stop     context.CancelFunc
	jobsCtx  context.Context
	stopJobs context.CancelFunc
	loops    sync.WaitGroup
	jobs     sync.WaitGroup
	draining bool
	failures chan error
}

var lifecycle struct {
	sync.Mutex
	loops   []backgroundLoop
	current *process
}

// Register installs a database consumer. HTTP processes register consumers but
// never start them; the worker entry point owns their lifetime.
func Register(name string, run func(context.Context)) {
	lifecycle.Lock()
	defer lifecycle.Unlock()
	loop := backgroundLoop{name: name, run: run}
	lifecycle.loops = append(lifecycle.loops, loop)
	if current := lifecycle.current; current != nil && !current.draining {
		current.startLoop(loop)
	}
}

func Active() bool {
	lifecycle.Lock()
	defer lifecycle.Unlock()
	return lifecycle.current != nil
}

func Owns(ctx context.Context) bool {
	lifecycle.Lock()
	defer lifecycle.Unlock()
	return lifecycle.current != nil && ctx.Value(jobContextKey{}) == lifecycle.current
}

// Start is also used by embedded execution hosts and integration fixtures.
// A process has one lifetime; stop consumers before waiting for their jobs.
func Start(ctx context.Context) func(context.Context) error {
	lifecycle.Lock()
	defer lifecycle.Unlock()
	if lifecycle.current != nil {
		panic("Bot worker 已启动")
	}
	loopCtx, stop := context.WithCancel(ctx)
	jobsCtx, stopJobs := context.WithCancel(context.Background())
	current := &process{ctx: loopCtx, stop: stop, jobsCtx: jobsCtx, stopJobs: stopJobs, failures: make(chan error, 1)}
	lifecycle.current = current
	for _, loop := range lifecycle.loops {
		current.startLoop(loop)
	}
	return current.shutdown
}

func (current *process) startLoop(loop backgroundLoop) {
	current.loops.Add(1)
	go func() {
		defer current.loops.Done()
		defer func() {
			if failure := recover(); failure != nil {
				current.fail(fmt.Errorf("%s: %v", loop.name, failure))
			}
		}()
		loop.run(current.ctx)
	}()
}

// Go accounts for real work, including child calls created while a parent is
// draining. Cancellation of an HTTP observer never owns the job's lifetime.
func Go(ctx context.Context, run func(context.Context)) bool {
	lifecycle.Lock()
	current := lifecycle.current
	if current == nil || current.draining && ctx.Value(jobContextKey{}) != current {
		lifecycle.Unlock()
		return false
	}
	current.jobs.Add(1)
	lifecycle.Unlock()
	parent := ctx
	if ctx.Value(jobContextKey{}) != current {
		parent = context.WithoutCancel(ctx)
	}
	jobCtx, cancel := context.WithCancel(parent)
	stop := context.AfterFunc(current.jobsCtx, cancel)
	go func() {
		defer current.jobs.Done()
		defer stop()
		defer cancel()
		defer func() {
			if failure := recover(); failure != nil {
				cause, ok := failure.(error)
				if !ok {
					cause = fmt.Errorf("%v", failure)
				}
				if jobCtx.Err() != nil && errors.Is(cause, jobCtx.Err()) {
					return
				}
				current.fail(fmt.Errorf("Worker 执行异常: %w", cause))
			}
		}()
		run(context.WithValue(jobCtx, jobContextKey{}, current))
	}()
	return true
}

func (current *process) fail(err error) {
	select {
	case current.failures <- err:
	default:
	}
	current.stop()
}

func (current *process) shutdown(ctx context.Context) error {
	lifecycle.Lock()
	current.draining = true
	current.stop()
	lifecycle.Unlock()
	done := make(chan struct{})
	go func() {
		current.loops.Wait()
		current.jobs.Wait()
		close(done)
	}()
	var err error
	select {
	case <-done:
	case <-ctx.Done():
		err = ctx.Err()
		current.stopJobs()
		<-done
	}
	current.stopJobs()
	lifecycle.Lock()
	lifecycle.current = nil
	lifecycle.Unlock()
	select {
	case failure := <-current.failures:
		err = errors.Join(err, failure)
	default:
	}
	return err
}
