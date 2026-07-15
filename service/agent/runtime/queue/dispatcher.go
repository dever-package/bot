package queue

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Candidate struct {
	ID uint64
}

type Lease struct {
	ID       uint64
	WorkerID string
}

type Executor interface {
	Execute(context.Context, Lease) error
}

type Backlog interface {
	ListRunnable(context.Context, int) ([]Candidate, error)
}

type Dispatcher interface {
	Dispatch(context.Context, uint64) error
	Cancel(context.Context, uint64) error
}

type Config struct {
	Name             string
	Concurrency      int
	PollInterval     time.Duration
	ShouldIgnore     func(error) bool
	OnPollError      func(error)
	OnExecutionError func(Lease, error)
}

type databaseDispatcher struct {
	backlog     Backlog
	executor    Executor
	config      Config
	instanceID  string
	wake        chan struct{}
	slots       chan struct{}
	active      sync.Map
	lastPollLog time.Time
}

func NewDatabaseDispatcher(backlog Backlog, executor Executor, config Config) Dispatcher {
	config = normalizeConfig(config)
	dispatcher := &databaseDispatcher{
		backlog:    backlog,
		executor:   executor,
		config:     config,
		instanceID: uuid.NewString(),
		wake:       make(chan struct{}, 1),
		slots:      make(chan struct{}, config.Concurrency),
	}
	go dispatcher.loop()
	dispatcher.notify()
	return dispatcher
}

func normalizeConfig(config Config) Config {
	if config.Concurrency < 1 {
		config.Concurrency = 1
	}
	if config.PollInterval <= 0 {
		config.PollInterval = time.Second
	}
	if config.Name == "" {
		config.Name = "runtime_queue"
	}
	return config
}

func (dispatcher *databaseDispatcher) Dispatch(_ context.Context, _ uint64) error {
	dispatcher.notify()
	return nil
}

func (dispatcher *databaseDispatcher) Cancel(_ context.Context, _ uint64) error {
	dispatcher.notify()
	return nil
}

func (dispatcher *databaseDispatcher) notify() {
	select {
	case dispatcher.wake <- struct{}{}:
	default:
	}
}

func (dispatcher *databaseDispatcher) loop() {
	ticker := time.NewTicker(dispatcher.config.PollInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
		case <-dispatcher.wake:
		}
		dispatcher.poll()
	}
}

func (dispatcher *databaseDispatcher) poll() {
	defer func() {
		if recovered := recover(); recovered != nil {
			dispatcher.reportPollError(fmt.Errorf("%v", recovered))
		}
	}()
	capacity := cap(dispatcher.slots) - len(dispatcher.slots)
	if capacity <= 0 {
		return
	}
	candidates, err := dispatcher.backlog.ListRunnable(context.Background(), capacity)
	if err != nil {
		dispatcher.reportPollError(err)
		return
	}
	for _, candidate := range candidates {
		if candidate.ID == 0 {
			continue
		}
		if _, running := dispatcher.active.Load(candidate.ID); running {
			continue
		}
		workerID := fmt.Sprintf("%s:%s:%d:%s", dispatcher.config.Name, dispatcher.instanceID, candidate.ID, uuid.NewString())
		dispatcher.slots <- struct{}{}
		dispatcher.active.Store(candidate.ID, workerID)
		go dispatcher.execute(Lease{ID: candidate.ID, WorkerID: workerID})
	}
}

func (dispatcher *databaseDispatcher) execute(lease Lease) {
	defer func() {
		if recovered := recover(); recovered != nil {
			dispatcher.reportExecutionError(lease, fmt.Errorf("%v", recovered))
		}
		dispatcher.active.Delete(lease.ID)
		<-dispatcher.slots
		dispatcher.notify()
	}()
	if err := dispatcher.executor.Execute(context.Background(), lease); err != nil {
		if dispatcher.config.ShouldIgnore != nil && dispatcher.config.ShouldIgnore(err) {
			return
		}
		dispatcher.reportExecutionError(lease, err)
	}
}

func (dispatcher *databaseDispatcher) reportPollError(err error) {
	if err == nil || dispatcher.config.OnPollError == nil {
		return
	}
	if time.Since(dispatcher.lastPollLog) < 30*time.Second {
		return
	}
	dispatcher.lastPollLog = time.Now()
	dispatcher.config.OnPollError(err)
}

func (dispatcher *databaseDispatcher) reportExecutionError(lease Lease, err error) {
	if err == nil || dispatcher.config.OnExecutionError == nil {
		return
	}
	dispatcher.config.OnExecutionError(lease, err)
}
