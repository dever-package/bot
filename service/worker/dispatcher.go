package worker

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

type Candidate struct {
	ID  uint64
	Key string
}

type Lease struct {
	ID       uint64
	WorkerID string
	Key      string
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
	Name               string
	Concurrency        int
	PerKeyConcurrency  int
	CandidateScanLimit int
	PollInterval       time.Duration
	PollTimeout        time.Duration
	ShouldIgnore       func(error) bool
	OnPollError        func(error)
	OnExecutionError   func(Lease, error)
}

type databaseDispatcher struct {
	backlog     Backlog
	executor    Executor
	config      Config
	instanceID  string
	wake        chan struct{}
	slots       chan struct{}
	active      sync.Map
	keyMu       sync.Mutex
	keyActive   map[string]int
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
		keyActive:  map[string]int{},
	}
	Register(config.Name, dispatcher.loop)
	dispatcher.notify()
	return dispatcher
}

func normalizeConfig(config Config) Config {
	if config.Concurrency < 1 {
		config.Concurrency = 1
	}
	if config.PerKeyConcurrency < 0 {
		config.PerKeyConcurrency = 0
	}
	if config.CandidateScanLimit < config.Concurrency {
		config.CandidateScanLimit = config.Concurrency
	}
	if config.PollInterval <= 0 {
		config.PollInterval = time.Second
	}
	if config.PollTimeout <= 0 {
		config.PollTimeout = 10 * time.Second
	}
	if config.Name == "" {
		config.Name = "runtime_queue"
	}
	return config
}

func (dispatcher *databaseDispatcher) Dispatch(ctx context.Context, id uint64) error {
	if !Active() {
		return nil
	}
	if id != 0 {
		dispatcher.start(ctx, Candidate{ID: id})
		return nil
	}
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

func (dispatcher *databaseDispatcher) loop(ctx context.Context) {
	ticker := time.NewTicker(dispatcher.config.PollInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		case <-dispatcher.wake:

		}
		dispatcher.poll(ctx)
	}
}

func (dispatcher *databaseDispatcher) poll(ctx context.Context) {
	defer func() {
		if recovered := recover(); recovered != nil {
			dispatcher.reportPollError(fmt.Errorf("%v", recovered))
		}
	}()
	capacity := cap(dispatcher.slots) - len(dispatcher.slots)
	if capacity <= 0 {
		return
	}
	ctx, cancel := context.WithTimeout(ctx, dispatcher.config.PollTimeout)
	defer cancel()
	limit := capacity
	if dispatcher.config.CandidateScanLimit > limit {
		limit = dispatcher.config.CandidateScanLimit
	}
	candidates, err := dispatcher.backlog.ListRunnable(ctx, limit)
	if err != nil {
		dispatcher.reportPollError(err)
		return
	}
	for _, candidate := range candidates {
		if !dispatcher.start(ctx, candidate) {
			return
		}
	}
}

func (dispatcher *databaseDispatcher) start(ctx context.Context, candidate Candidate) bool {
	if candidate.ID == 0 {
		return true
	}
	workerID := fmt.Sprintf("%s:%s:%d:%s", dispatcher.config.Name, dispatcher.instanceID, candidate.ID, uuid.NewString())
	if _, running := dispatcher.active.LoadOrStore(candidate.ID, workerID); running {
		return true
	}
	candidate.Key = normalizeCandidateKey(candidate.Key)
	if !dispatcher.reserveKey(candidate.Key) {
		dispatcher.active.Delete(candidate.ID)
		return true
	}
	select {
	case dispatcher.slots <- struct{}{}:
		lease := Lease{ID: candidate.ID, WorkerID: workerID, Key: candidate.Key}
		if !Go(ctx, func(jobCtx context.Context) {
			dispatcher.execute(jobCtx, lease)
		}) {
			<-dispatcher.slots
			dispatcher.releaseKey(candidate.Key)
			dispatcher.active.Delete(candidate.ID)
			return false
		}
		return true
	default:
		dispatcher.releaseKey(candidate.Key)
		dispatcher.active.Delete(candidate.ID)
		return false
	}
}

func (dispatcher *databaseDispatcher) execute(ctx context.Context, lease Lease) {
	defer func() {
		dispatcher.active.Delete(lease.ID)
		<-dispatcher.slots
		dispatcher.releaseKey(lease.Key)
		dispatcher.notify()
	}()
	if err := runtimeasync.Run(dispatcher.config.Name+" 任务执行", func() error { return dispatcher.executor.Execute(ctx, lease) }); err != nil {
		if dispatcher.config.ShouldIgnore != nil && dispatcher.config.ShouldIgnore(err) {
			return
		}
		dispatcher.reportExecutionError(lease, err)
	}
}

func (dispatcher *databaseDispatcher) reserveKey(key string) bool {
	if key == "" || dispatcher.config.PerKeyConcurrency <= 0 {
		return true
	}
	dispatcher.keyMu.Lock()
	defer dispatcher.keyMu.Unlock()
	if dispatcher.keyActive[key] >= dispatcher.config.PerKeyConcurrency {
		return false
	}
	dispatcher.keyActive[key]++
	return true
}

func (dispatcher *databaseDispatcher) releaseKey(key string) {
	if key == "" || dispatcher.config.PerKeyConcurrency <= 0 {
		return
	}
	dispatcher.keyMu.Lock()
	defer dispatcher.keyMu.Unlock()
	if dispatcher.keyActive[key] <= 1 {
		delete(dispatcher.keyActive, key)
		return
	}
	dispatcher.keyActive[key]--
}

func normalizeCandidateKey(key string) string {
	return strings.ToLower(strings.TrimSpace(key))
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
