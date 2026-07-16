package async

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"
)

// Group runs independent preparation work concurrently while converting a
// goroutine panic into the same error path used by ordinary failures.
type Group struct {
	wait  sync.WaitGroup
	mu    sync.Mutex
	first error
}

func (group *Group) Go(name string, run func() error) {
	if run == nil {
		return
	}
	group.wait.Add(1)
	go func() {
		defer group.wait.Done()
		if err := Run(name, run); err != nil {
			group.mu.Lock()
			if group.first == nil {
				group.first = err
			}
			group.mu.Unlock()
		}
	}()
}

func (group *Group) Wait() error {
	group.wait.Wait()
	group.mu.Lock()
	defer group.mu.Unlock()
	return group.first
}

func Run(name string, run func() error) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			label := strings.TrimSpace(name)
			if label == "" {
				label = "异步任务"
			}
			err = fmt.Errorf("%s异常: %v", label, recovered)
		}
	}()
	return run()
}

func Start(name string, run func(), onError func(error)) {
	if run == nil {
		return
	}
	go func() {
		err := Run(name, func() error {
			run()
			return nil
		})
		if err != nil && onError != nil {
			onError(err)
		}
	}()
}

func Detached(timeout time.Duration) (context.Context, context.CancelFunc) {
	if timeout <= 0 {
		timeout = 10 * time.Second
	}
	return context.WithTimeout(context.Background(), timeout)
}

type ExecutorConfig struct {
	Concurrency int
	QueueSize   int
	OnError     func(error)
}

type Executor struct {
	config  ExecutorConfig
	once    sync.Once
	queue   chan executorTask
	mu      sync.Mutex
	pending map[string]struct{}
}

type executorTask struct {
	key  string
	name string
	run  func()
}

func NewExecutor(config ExecutorConfig) *Executor {
	if config.Concurrency < 1 {
		config.Concurrency = 1
	}
	if config.QueueSize < config.Concurrency {
		config.QueueSize = config.Concurrency
	}
	return &Executor{
		config:  config,
		queue:   make(chan executorTask, config.QueueSize),
		pending: map[string]struct{}{},
	}
}

// Submit is non-blocking. A non-empty key coalesces duplicate maintenance work
// until the queued task finishes.
func (executor *Executor) Submit(key string, name string, run func()) bool {
	if executor == nil || run == nil {
		return false
	}
	executor.start()
	key = strings.TrimSpace(key)
	if key != "" {
		executor.mu.Lock()
		if _, exists := executor.pending[key]; exists {
			executor.mu.Unlock()
			return true
		}
		executor.pending[key] = struct{}{}
		executor.mu.Unlock()
	}
	task := executorTask{key: key, name: name, run: run}
	select {
	case executor.queue <- task:
		return true
	default:
		executor.release(key)
		return false
	}
}

func (executor *Executor) start() {
	executor.once.Do(func() {
		for index := 0; index < executor.config.Concurrency; index++ {
			Start("后台任务执行器", executor.worker, executor.config.OnError)
		}
	})
}

func (executor *Executor) worker() {
	for task := range executor.queue {
		err := Run(task.name, func() error {
			task.run()
			return nil
		})
		executor.release(task.key)
		if err != nil && executor.config.OnError != nil {
			executor.config.OnError(err)
		}
	}
}

func (executor *Executor) release(key string) {
	if key == "" {
		return
	}
	executor.mu.Lock()
	delete(executor.pending, key)
	executor.mu.Unlock()
}
