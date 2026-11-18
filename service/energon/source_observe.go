package energon

import (
	"context"
	"errors"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	bottask "github.com/dever-package/bot/service/energon/task"
)

type sourceObserveKey struct{}

func sourceObservation(ctx context.Context) bool {
	value, _ := ctx.Value(sourceObserveKey{}).(bool)
	return value
}

// Source observation is independent of a completed/stopped business run. It
// only queries the accepted remote ID and records immutable terminal facts.
func (s GatewayService) observeSource(ctx context.Context, row botmodel.Execution, cp bottask.ExecutionCheckpoint) (err error) {
	ctx = context.WithValue(ctx, sourceObserveKey{}, true)
	ctx = bottask.WithExecutionStore(ctx, bottask.DatabaseStore{RunID: row.RunID, NodeRunID: row.NodeRunID, UserID: row.UserID, AdminID: row.AdminID})
	raw, err := decodeSourceRequest(row.Request)
	if err != nil {
		return err
	}
	preparedRaw, mode, err := prepareGatewayRequest(raw)
	if err != nil {
		return err
	}
	req, err := s.normalizeGatewayRequest(preparedRaw, mode)
	if err != nil {
		return err
	}
	power, ok := s.repo.Power(ctx, cp.PowerID)
	if !ok {
		return fmt.Errorf("原任务能力已不存在")
	}
	target, ok := s.repo.FindPowerTarget(ctx, cp.TargetID)
	if !ok {
		return fmt.Errorf("原任务来源绑定已不存在")
	}
	selected, err := s.selectTarget(ctx, power, target, req.RequestID)
	if err != nil {
		return err
	}
	prepared, _, err := s.prepareRemoteCall(ctx, req, selected)
	if err != nil {
		return err
	}
	ctx, _, err = s.acquireRemoteResource(ctx, prepared)
	if err != nil {
		return err
	}
	defer finishSourceCall(ctx)
	if row.CancelRequested {
		if err := s.cancelRemoteSourceTask(ctx, prepared, cp.RemoteTaskID); err != nil {
			return errors.Join(err, ctx.Value(sourceCallKey{}).(*sourceCall).update(context.WithoutCancel(ctx), map[string]any{"last_error": err.Error()}))
		}
	}
	_, err = s.tasks.ObserveTerminal(ctx, bottask.StreamJob{Input: prepared.NativeInput, Adapter: prepared.Adapter, Client: s.client, Request: prepared.NativeRequest}, cp.RemoteTaskID)
	receipt, loadErr := bottask.Store(ctx).Load(context.WithoutCancel(ctx), row.RequestID)
	if loadErr != nil {
		return errors.Join(err, loadErr)
	}
	if receipt.RemoteResponse == nil {
		return err
	}
	if receipt.RemoteFailure != "" || row.CancelRequested || time.Now().After(cp.Deadline) || (!cp.ExecutionDeadline.IsZero() && time.Now().After(cp.ExecutionDeadline)) {
		phase := "failed"
		if row.CancelRequested {
			phase = "canceled"
		}
		return errors.Join(err, ctx.Value(sourceCallKey{}).(*sourceCall).update(context.WithoutCancel(ctx), map[string]any{"phase": phase}))
	}
	return nil
}
