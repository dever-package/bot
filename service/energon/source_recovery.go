package energon

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botschedule "github.com/dever-package/bot/service/energon/schedule"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
	"github.com/dever-package/bot/service/worker"
	"github.com/google/uuid"
	"github.com/shemic/dever/orm"
)

type storedSourceRequest struct {
	GatewayRequest
	SilentCompletion bool `json:"silent_completion"`
}

func decodeSourceRequest(value string) (GatewayRequest, error) {
	var stored storedSourceRequest
	if err := json.Unmarshal([]byte(value), &stored); err != nil {
		return GatewayRequest{}, err
	}
	stored.GatewayRequest.AllowSilentTextCompletion = stored.SilentCompletion
	return stored.GatewayRequest, nil
}

func saveSourceRequest(ctx context.Context, raw GatewayRequest) (err error) {
	defer botschedule.StorageError(&err)
	// Authorization is reconstructed from the selected account at execution time.
	raw.Headers = nil
	if err = validateExecutionSnapshot(raw); err != nil {
		return err
	}
	encoded, err := json.Marshal(storedSourceRequest{GatewayRequest: raw, SilentCompletion: raw.AllowSilentTextCompletion})
	if err != nil {
		return err
	}
	model := botmodel.NewExecutionModel()
	row := model.Find(ctx, map[string]any{"request_id": raw.RequestID})
	if row == nil {
		return fmt.Errorf("来源调用尚未登记")
	}
	if row.Request != "" && row.Request != "{}" {
		return nil
	}
	values := map[string]any{"request": string(encoded), "updated_at": time.Now()}
	if row.RunID != 0 || row.NodeRunID != 0 {
		values["user_id"] = raw.Billing.UserID
	}
	model.Update(ctx, map[string]any{"id": row.ID}, values)
	return nil
}

// Redis is an admission index. Rebuild its unfinished task occupancy from SQL
// before accepting new work after a Redis restart or flush.
func restoreSourceOccupancy(ctx context.Context, broker *botschedule.Broker) (err error) {
	defer botschedule.StorageError(&err)
	if err := reconcileFinishedSources(ctx, broker); err != nil {
		return err
	}
	ready := broker.Prefix + ":ready"
	if value, err := broker.Client.Exists(ctx, ready).Result(); err != nil {
		return err
	} else if value == 1 {
		return nil
	}
	lock := broker.Prefix + ":rebuild"
	token := uuid.NewString()
	for {
		ok, err := broker.Client.SetNX(ctx, lock, token, 30*time.Second).Result()
		if err != nil {
			return err
		}
		if ok {
			break
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(100 * time.Millisecond):
		}
		if n, err := broker.Client.Exists(ctx, ready).Result(); err != nil {
			return err
		} else if n == 1 {
			return nil
		}
	}
	defer func() {
		cleanup, done := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer done()
		_, releaseErr := broker.Client.Eval(cleanup, `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0`, []string{lock}, token).Result()
		err = errors.Join(err, releaseErr)
	}()
	for _, snapshot := range botmodel.NewExecutionModel().Select(ctx, map[string]any{"task_outstanding": true, "remote_terminal": false}) {
		if err := orm.Transaction(ctx, func(tx context.Context) error {
			model := botmodel.NewExecutionModel()
			// Serialize adoption with terminal release. A completed task must never be
			// reintroduced into Redis by an earlier SQL snapshot.
			if model.Update(tx, map[string]any{"id": snapshot.ID, "task_outstanding": true}, map[string]any{"updated_at": time.Now()}) != 1 {
				return nil
			}
			row := model.Find(tx, map[string]any{"id": snapshot.ID})
			if row.AccountID == 0 {
				return nil
			}
			_, err := broker.Adopt(tx, row.RequestID, row.Owner, row.AccountID)
			return err
		}); err != nil {
			return err
		}
	}

	// A lost rebuild lease cannot certify the rebuilt index as ready.
	result, err := broker.Client.Eval(ctx, `if redis.call('GET',KEYS[1])~=ARGV[1] then return 0 end redis.call('SET',KEYS[2],'1');return 1`, []string{lock, ready}, token).Int()
	if err != nil {
		return err
	}
	if result != 1 {
		return fmt.Errorf("来源调度索引重建租约已失效")
	}
	return nil
}

func (s GatewayService) recoverSources(ctx context.Context) (err error) {
	var maintenanceErr error
	defer func() { err = errors.Join(err, maintenanceErr) }()
	defer botschedule.StorageError(&err)
	broker, brokerErr := botschedule.ProjectBroker(ctx)
	if brokerErr != nil && !errors.Is(brokerErr, botschedule.ErrRedisDisabled) {
		maintenanceErr = brokerErr
	}
	if brokerErr == nil {
		if err := reconcileFinishedSources(ctx, broker); err != nil {
			maintenanceErr = err
		}
	}
	// Parent runs keep their own business lease and finalization policy. The
	// source worker only resumes standalone calls; both paths claim the same row.
	cursor := uint64(0)
	for {
		rows := botmodel.NewExecutionModel().Select(ctx, map[string]any{"id": map[string]any{"gt": cursor}, "or": []any{map[string]any{"phase": []string{"prepared", "queued", "running", "submitted", "fetching", "unknown"}}, map[string]any{"task_outstanding": true}}}, map[string]any{"limit": 100, "order": "id asc"})
		if len(rows) == 0 {
			return nil
		}
		cursor = rows[len(rows)-1].ID
		for _, row := range rows {
			if err := s.recoverSource(ctx, *row); err != nil {
				maintenanceErr = errors.Join(maintenanceErr, fmt.Errorf("恢复来源调用 %s: %w", row.RequestID, err))
			}
		}
		if len(rows) < 100 {
			return nil
		}
	}
}

func (s GatewayService) recoverSource(ctx context.Context, row botmodel.Execution) error {
	if row.ExpiresAt != nil && row.ExpiresAt.After(time.Now()) {
		return nil
	}
	if row.ExpiresAt == nil && row.Phase == "prepared" && time.Since(row.CreatedAt) < 45*time.Second {
		return nil
	}
	var cp bottask.ExecutionCheckpoint
	if err := json.Unmarshal([]byte(row.Checkpoint), &cp); err != nil {
		return err
	}
	if cp.Persisted != nil {
		return nil
	}
	if (unconfirmedSubmission(&cp) && !time.Now().Before(cp.SubmissionDeadline) && (row.CancelRequested || cp.Failure != "" || !time.Now().Before(cp.Deadline))) || (cp.Stage == bottask.ExecutionPrepared && !time.Now().Before(cp.Deadline)) {
		err := finishInterruptedSource(ctx, row, &cp)
		var handoff *bottask.ExecutionHandoff
		if errors.As(err, &handoff) {
			return nil
		}
		return err
	}
	// Composite children resume through their parent, but their canceled or
	// expired reservations can be settled from the receipt alone.
	if row.Request == "{}" || row.Request == "" {
		return nil
	}
	if cp.RemoteTaskID != "" && cp.RemoteResponse == nil && (row.RunID != 0 || row.CancelRequested || cp.Failure != "" || time.Now().After(cp.Deadline) || (!cp.ExecutionDeadline.IsZero() && time.Now().After(cp.ExecutionDeadline))) {
		worker.Go(ctx, func(jobCtx context.Context) {
			if err := s.observeSource(jobCtx, row, cp); err != nil {
				slog.Error("原来源任务观察暂未完成", "request_id", row.RequestID, "error", err)
			}
		})
		return nil
	}
	if cp.Failure != "" || row.RunID != 0 || row.CancelRequested {
		return nil
	}
	if time.Now().After(cp.Deadline) && !unconfirmedSubmission(&cp) && cp.Result == nil && cp.SubmissionResponse == nil && cp.RemoteResponse == nil {
		return nil
	}
	if cp.RetryableSubmission && unconfirmedSubmission(&cp) {
		if time.Now().Before(cp.SubmissionDeadline) {
			return nil
		}
	} else if cp.Stage != bottask.ExecutionPrepared && cp.RemoteTaskID == "" && cp.Result == nil && cp.SubmissionResponse == nil {
		// These sources execute synchronously and cannot look up an interrupted call.
		// Keep their ambiguous receipt for reconciliation without repeating the work.
		if cp.Protocol == botprocessor.ProtocolLocal || cp.Protocol == botwebcontent.Protocol {
			return nil
		}
		adapter, err := s.registry.Get(cp.Protocol)
		if err != nil {
			return err
		}
		if _, supported := adapter.(bottask.SubmissionLookupAdapter); !supported {
			return nil
		}
	}
	request, err := decodeSourceRequest(row.Request)
	if err != nil {
		return err
	}
	// Recovery retries admission of an already accepted request. Queue saturation
	// must not turn that durable request into a new caller's terminal rejection.
	request.Body = botprotocol.NormalizeRequestBody(request.Body)
	ctx = bottask.WithDefaultStoreFor(ctx, request.Billing.UserID, request.AdminID)
	bottask.BindRootRequest(ctx, row.RootRequestID)
	_, err = botstream.Start(ctx, s.streams, s.streamCancels, s.tasks, request.RequestID, newStreamJob(request))
	var handoff *bottask.ExecutionHandoff
	if errors.As(err, &handoff) {
		return nil
	}
	return err
}

func rememberSourceError(ctx context.Context, id string, cause error) (err error) {
	defer botschedule.StorageError(&err)
	if ctx.Err() != nil && !worker.Owns(ctx) {
		bottask.SignalHandoff(ctx)
		return &bottask.ExecutionHandoff{Cause: cause}
	}
	err = cause
	store := bottask.Store(ctx)
	if store == nil {
		return err
	}
	cp, loadErr := store.Load(context.WithoutCancel(ctx), id)
	if loadErr != nil {
		return errors.Join(err, loadErr)
	}
	if cp == nil || cp.Persisted != nil {
		return err
	}
	cp.LastError = cause.Error()
	row := botmodel.NewExecutionModel().Find(context.WithoutCancel(ctx), map[string]any{"request_id": id})
	if row != nil && !row.TaskOutstanding && cp.Result == nil && (cp.RemoteResponse == nil || cp.RemoteFailure != "") && cp.Failure == "" {
		cp.Failure = cause.Error()
	}
	_, loadErr = store.Save(context.WithoutCancel(ctx), bottask.ExecutionChange{Checkpoint: *cp})
	return errors.Join(err, loadErr)
}

// Reconcile the SQL-terminal/Redis-release crash window without expiring live
// upstream tasks. A prepared or queued row is never evidence of completion.
func reconcileFinishedSources(ctx context.Context, broker *botschedule.Broker) (err error) {
	defer botschedule.StorageError(&err)
	acquired, err := broker.Client.SetNX(ctx, broker.Prefix+":reconcile-tick", "1", time.Second).Result()
	if err != nil {
		return err
	}
	if !acquired {
		return nil
	}
	model := botmodel.NewExecutionModel()
	model.Update(ctx, map[string]any{"task_outstanding": true, "remote_terminal": true}, map[string]any{"task_outstanding": false})
	tokens, err := broker.ActiveTasks(ctx)
	if err != nil {
		return err
	}
	if len(tokens) == 0 {
		return nil
	}
	ids := make([]string, 0, len(tokens))
	for id := range tokens {
		ids = append(ids, id)
	}
	for _, row := range model.Select(ctx, map[string]any{"request_id": ids}, map[string]any{"field": "request_id,task_outstanding,remote_terminal,phase"}) {
		terminal := row.RemoteTerminal || !row.TaskOutstanding && (row.Phase == "succeeded" || row.Phase == "failed" || row.Phase == "canceled" || row.Phase == "fetching")
		if terminal {
			if err := broker.ReleaseTask(ctx, row.RequestID, tokens[row.RequestID]); err != nil {
				return err
			}
		}
	}
	return nil
}
