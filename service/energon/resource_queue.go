package energon

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botschedule "github.com/dever-package/bot/service/energon/schedule"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/google/uuid"
)

type sourceCallKey struct{}
type sourceCall struct {
	id, owner   string
	version     int64
	selected    selectedTarget
	async       bool
	broker      *botschedule.Broker
	lease       *botschedule.Lease
	mu          sync.Mutex
	terminal    bool
	finish      func()
	cancel      context.CancelFunc
	notify      func(string) error
	checkSubmit func(context.Context) error
}

func (c *sourceCall) update(ctx context.Context, values map[string]any) (err error) {
	defer botschedule.StorageError(&err)
	values["updated_at"] = time.Now()
	if botmodel.NewExecutionModel().Update(ctx, map[string]any{"request_id": c.id, "owner": c.owner, "version": c.version}, values) != 1 {
		return &bottask.ExecutionHandoff{Cause: fmt.Errorf("来源调用已由其他执行者接管")}
	}
	return nil
}
func (c *sourceCall) fence(ctx context.Context) (err error) {
	defer botschedule.StorageError(&err)
	row := botmodel.NewExecutionModel().Find(ctx, map[string]any{"request_id": c.id})
	if row != nil && row.CancelRequested && !sourceObservation(ctx) {
		return context.Canceled
	}
	return c.update(ctx, map[string]any{"expires_at": time.Now().Add(45 * time.Second)})
}

func claimSourceCall(ctx context.Context, id string, async bool) (call *sourceCall, row *botmodel.Execution, err error) {
	defer botschedule.StorageError(&err)
	model := botmodel.NewExecutionModel()
	row = model.Find(ctx, map[string]any{"request_id": id})
	if row == nil {
		return nil, nil, fmt.Errorf("来源调用尚未登记")
	}
	if row.CancelRequested && !sourceObservation(ctx) {
		return nil, nil, context.Canceled
	}
	now := time.Now()
	if row.Owner != "" && row.ExpiresAt != nil && row.ExpiresAt.After(now) {
		return nil, nil, &bottask.ExecutionHandoff{Cause: fmt.Errorf("原来源调用仍在执行: %s", id)}
	}
	call = &sourceCall{id: id, owner: uuid.NewString(), version: row.Version + 1, async: async}
	if model.Update(ctx, map[string]any{"id": row.ID, "version": row.Version}, map[string]any{"owner": call.owner, "version": call.version, "expires_at": now.Add(45 * time.Second), "updated_at": now}) != 1 {
		return nil, nil, &bottask.ExecutionHandoff{Cause: fmt.Errorf("来源调用已被接管")}
	}
	return call, row, nil
}

// All providers, including managed local sources, enter here once per leaf call.
func (s GatewayService) acquireSource(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget, async bool) (runCtx context.Context, finish func(), err error) {
	call, row, err := claimSourceCall(ctx, req.RequestID, async)
	if err != nil {
		return ctx, nil, err
	}
	runCtx, cancel := context.WithCancel(ctx)
	call.cancel = cancel
	call.notify = func(text string) error {
		return s.writeStreamOutput(runCtx, req.RequestID, botprotocol.Output{"event": "status", "text": text, "meta": map[string]any{"execution_phase": "queued"}})
	}
	runCtx = context.WithValue(runCtx, sourceCallKey{}, call)
	runCtx = bottask.WithTerminalHook(runCtx, call.complete)
	runCtx = bottask.WithExecutionFence(runCtx, call.fence)
	finished := false
	retainTask := row.TaskOutstanding
	defer func() {
		if !finished {
			cancel()
			cleanup, done := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
			defer done()
			if call.lease != nil && !retainTask {
				err = errors.Join(err, call.lease.Release(cleanup))
			}
			err = errors.Join(err, call.update(cleanup, map[string]any{"expires_at": time.Now()}))
		}
	}()
	cp, err := bottask.Store(ctx).Load(ctx, req.RequestID)
	if err != nil {
		return ctx, nil, err
	}
	runCtx = bottask.WithExecutionAttempt(runCtx, req.RequestID, cp.SubmissionToken)
	if selected.Account.ID > 0 {
		call.broker, err = botschedule.ProjectBroker(runCtx)
		// An unlimited account does not require Redis when Redis is disabled.
		if errors.Is(err, botschedule.ErrRedisDisabled) && selected.Account.Concurrency == 0 {
			accounts, loadErr := serviceAccounts(runCtx, selected.Provider, selected.Service)
			if loadErr != nil {
				return ctx, nil, loadErr
			}
			if len(accounts) == 1 {
				err = nil
			}
		}
		if err != nil {
			return ctx, nil, err
		}
	}
	if call.broker != nil {
		if err = restoreSourceOccupancy(runCtx, call.broker); err != nil {
			return ctx, nil, err
		}
		call.lease, err = call.broker.Adopt(runCtx, req.RequestID, call.owner, selected.Account.ID)
		if err != nil {
			return ctx, nil, err
		}
	}
	cp, err = s.resumeInterruptedSource(runCtx, req, cp)
	if err != nil {
		return ctx, nil, err
	}
	runCtx = bottask.WithExecutionAttempt(runCtx, req.RequestID, cp.SubmissionToken)
	if cp.Stage == bottask.ExecutionPrepared {
		retainTask = false
	}
	call.terminal = cp.Result != nil || cp.Persisted != nil || cp.RemoteResponse != nil || cp.SubmissionResponse != nil && !async
	if call.broker != nil {
		if call.lease != nil && (call.terminal || cp.Stage == bottask.ExecutionPrepared) {
			// A prepared checkpoint proves submission never started. Replace the
			// previous worker's admission, then wait using the current account limit.
			if err = call.lease.Release(runCtx); err != nil {
				return ctx, nil, err
			}
			call.lease = nil
		}
		if !call.terminal && cp.Stage == bottask.ExecutionPrepared {
			if err = call.update(runCtx, map[string]any{"phase": "queued", "queued_at": time.Now(), "provider_id": selected.Provider.ID, "account_id": 0, "service_id": selected.Service.ID}); err != nil {
				return ctx, nil, err
			}
			heartbeatDone := make(chan struct{})
			go call.heartbeat(runCtx, cancel, heartbeatDone)
			defer close(heartbeatDone)
			var accounts []botmodel.Account
			refresh := func(ctx context.Context) ([]botschedule.Account, error) {
				if row := botmodel.NewExecutionModel().Find(ctx, map[string]any{"request_id": call.id}); row != nil && row.CancelRequested {
					return nil, context.Canceled
				}
				if err := restoreSourceOccupancy(ctx, call.broker); err != nil {
					return nil, err
				}
				service := botmodel.NewServiceModel().Find(ctx, map[string]any{"id": selected.Service.ID, "status": StatusActive})
				if service == nil || service.ProviderID != selected.Provider.ID || service.Path != selected.Service.Path {
					return nil, fmt.Errorf("来源服务已停用、删除或改变，未提交原调用")
				}
				var loadErr error
				accounts, loadErr = serviceAccounts(ctx, selected.Provider, *service)
				if loadErr != nil {
					return nil, loadErr
				}
				candidates := make([]botschedule.Account, 0, len(accounts))
				for _, account := range accounts {
					// A recovery retry retains the original receipt's account.
					if cp.TargetID == 0 || cp.AccountID == account.ID {
						candidates = append(candidates, botschedule.Account{ID: account.ID, Limit: account.Concurrency})
					}
				}
				return candidates, nil
			}
			call.lease, err = call.broker.Acquire(runCtx, req.RequestID, call.owner, "service:"+repoID(selected.Service.ID), nil, func(position int) {
				if notifyErr := call.update(runCtx, map[string]any{"queue_position": position}); notifyErr != nil {
					slog.Error("保存账号排队状态失败", "request_id", call.id, "error", notifyErr)
					cancel()
					return
				}
				_ = s.writeStreamOutput(runCtx, req.RequestID, botprotocol.Output{"event": "status", "text": fmt.Sprintf("等待可用账号，排队位置 %d", position), "meta": map[string]any{"execution_phase": "queued", "queue_position": position}})
			}, refresh)
			if err != nil {
				return ctx, nil, err
			}
			for _, account := range accounts {
				if account.ID == call.lease.AccountID() {
					provider, exists := s.repo.FindProvider(runCtx, selected.Provider.ID)
					if !exists {
						return ctx, nil, fmt.Errorf("来源已删除，未提交原调用")
					}
					selected.Provider = withAccountHost(provider, account)
					selected.Account = account
					break
				}
			}
		}
	}

	if call.terminal {
		call.selected = selected
		if err = call.update(runCtx, map[string]any{"task_outstanding": false}); err != nil {
			return ctx, nil, err
		}
	} else {
		call.selected, err = currentSourceSelection(runCtx, selected)
		if err != nil {
			return ctx, nil, err
		}
		if err = call.update(runCtx, map[string]any{"task_outstanding": true, "account_id": call.selected.Account.ID, "phase": "running", "queue_position": 0}); err != nil {
			return ctx, nil, err
		}
	}
	call.checkSubmit = func(checkCtx context.Context) error {
		if err := call.fence(checkCtx); err != nil {
			return err
		}
		fresh, err := currentSourceSelection(checkCtx, call.selected)
		if err != nil {
			return err
		}
		if err := validateServiceAccount(checkCtx, fresh); err != nil {
			return err
		}
		if fresh.Account.Key != call.selected.Account.Key {
			return fmt.Errorf("来源账号凭证已变更，未提交原调用")
		}
		return nil
	}
	heartbeatDone := make(chan struct{})
	go call.heartbeat(runCtx, cancel, heartbeatDone)
	var once sync.Once
	finish = func() {
		once.Do(func() {
			close(heartbeatDone)
			cleanup, done := context.WithTimeout(context.WithoutCancel(ctx), 10*time.Second)
			defer done()
			checkpoint, loadErr := bottask.Store(ctx).Load(cleanup, req.RequestID)
			if loadErr == nil && checkpoint != nil && (checkpoint.Result != nil || checkpoint.Persisted != nil || checkpoint.RemoteResponse != nil || checkpoint.Stage == bottask.ExecutionPrepared) {
				loadErr = call.complete(cleanup)
			}
			if loadErr != nil {
				slog.Error("来源调用收尾失败，保留原占位", "request_id", call.id, "error", loadErr)
			}
			values := map[string]any{"expires_at": time.Now()}
			if checkpoint != nil && checkpoint.Failure != "" {
				values["phase"] = "failed"
			}
			call.mu.Lock()
			terminal := call.terminal
			call.mu.Unlock()
			if !terminal {
				values["phase"] = "unknown"
				if checkpoint != nil && checkpoint.RemoteTaskID != "" {
					values["phase"] = "submitted"
				}
			}
			if closeErr := call.update(cleanup, values); closeErr != nil {
				slog.Error("释放来源执行租约失败", "request_id", call.id, "error", closeErr)
			}
			cancel()
		})
	}
	call.finish = finish
	finished = true
	return runCtx, func() {
		if err := call.complete(context.WithoutCancel(runCtx)); err != nil {
			slog.Error("释放账号并发名额失败", "request_id", call.id, "error", err)
		}
	}, nil
}

func (c *sourceCall) heartbeat(ctx context.Context, cancel context.CancelFunc, done <-chan struct{}) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-done:
			return
		case <-ticker.C:
			if err := c.fence(ctx); err != nil {
				slog.Error("续期来源执行租约失败", "request_id", c.id, "error", err)
				cancel()
				return
			}
		}
	}
}
func (c *sourceCall) complete(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.terminal && c.lease == nil {
		return nil
	}
	// The SQL fact permits the reconciler to finish release after a process exit.
	if !c.terminal {
		if err := c.update(ctx, map[string]any{"task_outstanding": false, "phase": "fetching"}); err != nil {
			return err
		}
		c.terminal = true
	}
	if c.lease != nil {
		if err := c.lease.Release(ctx); err != nil {
			slog.Warn("远端终态已保存，来源占位等待索引核对回收", "request_id", c.id, "error", err)
			return nil
		}
		c.lease = nil
	}
	return nil
}
func (s GatewayService) acquireRemoteResource(ctx context.Context, prepared remoteCallPreparation) (context.Context, func(), error) {
	return s.acquireSource(ctx, prepared.Request, prepared.Selected, bottask.IsPolling(prepared.Adapter, prepared.NativeInput))
}

func finishSourceCall(ctx context.Context) {
	if call, ok := ctx.Value(sourceCallKey{}).(*sourceCall); ok && call.finish != nil {
		call.finish()
	}
}
