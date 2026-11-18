package energon

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botschedule "github.com/dever-package/bot/service/energon/schedule"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/dever-package/bot/service/worker"
	"github.com/shemic/dever/orm"
)

func (s GatewayService) CancelSource(ctx context.Context, id string) (err error) {
	defer botschedule.StorageError(&err)
	err = s.cancelOneSource(ctx, id)
	for _, child := range botmodel.NewExecutionModel().Select(ctx, map[string]any{"root_request_id": id, "request_id": map[string]any{"ne": id}}) {
		if child.Phase == "succeeded" || child.Phase == "failed" && !child.TaskOutstanding || child.Phase == "canceled" && !child.TaskOutstanding {
			continue
		}
		err = errors.Join(err, s.cancelOneSource(ctx, child.RequestID))
	}
	return err
}
func (s GatewayService) cancelOneSource(ctx context.Context, id string) (err error) {
	defer botschedule.StorageError(&err)
	if id == "" {
		return fmt.Errorf("调用ID不能为空")
	}
	model := botmodel.NewExecutionModel()
	var row *botmodel.Execution
	var cp bottask.ExecutionCheckpoint
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if model.Update(tx, map[string]any{"request_id": id}, map[string]any{"updated_at": time.Now()}) != 1 {
			return fmt.Errorf("来源调用不存在")
		}
		row = model.Find(tx, map[string]any{"request_id": id})
		if err := json.Unmarshal([]byte(row.Checkpoint), &cp); err != nil {
			return err
		}
		if cp.Persisted != nil || cp.Failure != "" {
			return fmt.Errorf("来源调用已经结束")
		}
		values := map[string]any{"cancel_requested": true, "updated_at": time.Now()}
		if cp.Stage == bottask.ExecutionPrepared {
			cp.Failure = "调用已取消"
			saved, err := json.Marshal(cp)
			if err != nil {
				return err
			}
			values["checkpoint"] = string(saved)
			values["phase"] = "canceled"
		}
		model.Update(tx, map[string]any{"id": row.ID}, values)
		return nil
	})
	if err != nil {
		return err
	}
	if !worker.Active() {
		return nil
	}
	// Cancel a known remote ID without acquiring another account slot.
	// An acknowledgement does not release its task slot; observation waits for a terminal receipt.
	if cp.RemoteTaskID != "" && cp.RemoteResponse == nil {
		raw, err := decodeSourceRequest(row.Request)
		if err != nil {
			return err
		}
		req, err := s.normalizeGatewayRequest(raw, ModeNormalize)
		if err != nil {
			return err
		}
		power, ok := s.repo.Power(ctx, cp.PowerID)
		if !ok {
			return fmt.Errorf("原调用能力不存在")
		}
		target, ok := s.repo.FindPowerTarget(ctx, cp.TargetID)
		if !ok {
			return fmt.Errorf("原调用来源不存在")
		}
		restoreCtx := bottask.WithExecutionStore(ctx, bottask.DatabaseStore{RunID: row.RunID, NodeRunID: row.NodeRunID, UserID: row.UserID, AdminID: row.AdminID})
		selected, err := s.selectTarget(restoreCtx, power, target, req.RequestID)
		if err != nil {
			return err
		}
		prepared, _, err := s.prepareRemoteCall(restoreCtx, req, selected)
		if err != nil {
			return err
		}
		cancelCtx, cancel := context.WithCancel(ctx)
		defer cancel()
		call := &sourceCall{id: id, owner: row.Owner, version: row.Version, async: true, cancel: cancel}
		cancelCtx = context.WithValue(cancelCtx, sourceCallKey{}, call)
		if err := s.cancelRemoteSourceTask(cancelCtx, prepared, cp.RemoteTaskID); err != nil {
			return err
		}
	}
	if s.streamCancels != nil {
		s.streamCancels.MarkCancelled(id)
	}
	s.tasks.Cancel(ctx, id)
	return nil
}

func (s GatewayService) cancelRemoteSourceTask(ctx context.Context, prepared remoteCallPreparation, taskID string) error {
	remote, supported := prepared.Adapter.(bottask.RemoteCancelAdapter)
	capability, declared := prepared.Adapter.(bottask.CancelSupportAdapter)
	if !supported || declared && !capability.SupportsCancel(prepared.NativeInput) {
		return nil
	}
	return remote.CancelTask(botprovider.WithOperation(ctx, "cancel"), prepared.NativeInput, taskID, s.client)
}

func sourceCancelResponse(id string, err error) botprotocol.Response {
	if err != nil {
		return botprotocol.BuildErrorResponse(id, err)
	}
	return botprotocol.BuildSuccessResponse(id, botprotocol.Output{"event": "cancel", "text": "已停止等待，已提交的任务正在确认结束"})
}
