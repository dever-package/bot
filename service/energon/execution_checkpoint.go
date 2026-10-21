package energon

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/google/uuid"
)

func executionError(err error) error {
	if err == nil || botprotocol.PreventsReplay(err) {
		return err
	}
	return &botprotocol.ContentResultError{Cause: err}
}
func prepareExecution(ctx context.Context, requestID string) (*bottask.ExecutionCheckpoint, error) {
	store := bottask.Store(ctx)
	if store == nil {
		return nil, nil
	}
	checkpoint, err := store.Load(ctx, requestID)
	if err != nil || checkpoint != nil {
		return checkpoint, err
	}
	now := time.Now()
	return store.Save(ctx, bottask.ExecutionChange{Checkpoint: bottask.ExecutionCheckpoint{Version: 1, RequestID: requestID, Attempt: 1, SubmissionToken: uuid.NewString(), Stage: bottask.ExecutionPrepared, StartedAt: now, Deadline: now.Add(time.Hour)}})
}
func (s GatewayService) selectExecutionTarget(ctx context.Context, requestID string, powerID uint64, targetID uint64) (*bottask.ExecutionCheckpoint, error) {
	store := bottask.Store(ctx)
	if store == nil {
		return nil, nil
	}
	checkpoint, err := prepareExecution(ctx, requestID)
	if err != nil {
		return nil, err
	}
	if checkpoint.TargetID != 0 && (checkpoint.TargetID != targetID || checkpoint.PowerID != powerID) {
		return nil, executionError(fmt.Errorf("原任务来源恢复受阻，不能切换来源重新生成"))
	}
	return checkpoint, nil
}
func (s GatewayService) restoreExecutionSelection(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (selectedTarget, error) {
	checkpoint, err := s.selectExecutionTarget(ctx, req.RequestID, selected.Power.ID, selected.PowerTarget.ID)
	if err != nil || checkpoint == nil || checkpoint.TargetID == 0 {
		return selected, err
	}
	if checkpoint.ProviderID != selected.Provider.ID || checkpoint.ServiceID != selected.Service.ID {
		return selected, executionError(fmt.Errorf("原任务来源已改变，无法恢复查询"))
	}
	if checkpoint.AccountID == 0 {
		return selected, nil
	}
	account, ok := s.repo.Account(ctx, checkpoint.AccountID)
	if !ok || !isActive(account.Status) || account.ProviderID != selected.Provider.ID || checkpoint.ProviderID != selected.Provider.ID || checkpoint.ServiceID != selected.Service.ID {
		return selected, executionError(fmt.Errorf("原任务来源或账号已不可用，无法恢复查询"))
	}
	selected.Account = account
	selected.Provider = withAccountHost(selected.Provider, account)
	return selected, nil
}
func beginRemoteExecution(ctx context.Context, prepared remoteCallPreparation) (*bottask.ExecutionCheckpoint, error) {
	checkpoint, err := prepareExecution(ctx, prepared.Request.RequestID)
	if err != nil || checkpoint == nil {
		return checkpoint, err
	}
	if time.Now().After(checkpoint.Deadline) {
		return nil, executionError(fmt.Errorf("能力已超过原任务恢复期限，未重新提交"))
	}
	if checkpoint.Stage != bottask.ExecutionPrepared {
		if checkpoint.RemoteTaskID == "" && checkpoint.Result == nil {
			return nil, executionError(fmt.Errorf("能力提交结果待确认，未重新提交；请核对原任务"))
		}
		return checkpoint, nil
	}
	selected := prepared.Selected
	checkpoint.PowerID = selected.Power.ID
	checkpoint.TargetID = selected.PowerTarget.ID
	checkpoint.ProviderID = selected.Provider.ID
	checkpoint.AccountID = selected.Account.ID
	checkpoint.ServiceID = selected.Service.ID
	checkpoint.EndpointID = selected.ServiceEndpoint.ID
	checkpoint.ServiceAPI = selected.ServiceAPI
	checkpoint.Protocol = prepared.Adapter.Name()
	checkpoint.Mapped = prepared.NativeInput.Mapped
	if err := validateExecutionSnapshot(checkpoint.Mapped); err != nil {
		return nil, err
	}
	checkpoint.BillingKey = prepared.Request.Billing.BusinessKey
	checkpoint.Stage = bottask.ExecutionSubmitting
	return bottask.Store(ctx).Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint})
}
func validateExecutionSnapshot(value any) error {
	encoded, err := json.Marshal(value)
	if err != nil {
		return err
	}
	if len(encoded) > 1024*1024 {
		return fmt.Errorf("能力恢复参数超过 1 MiB，请使用已上传的媒体引用")
	}
	var check func(any) error
	check = func(value any) error {
		switch current := value.(type) {
		case map[string]any:
			for key, entry := range current {
				switch strings.ToLower(key) {
				case "authorization", "api_key", "apikey", "access_token", "secret", "password":
					return fmt.Errorf("能力恢复参数包含认证字段 %s，请使用来源账号配置", key)
				}
				if strings.EqualFold(key, "NativeKey") || strings.EqualFold(key, "ParamKey") {
					switch strings.ToLower(fmt.Sprint(entry)) {
					case "authorization", "api_key", "apikey", "access_token", "secret", "password":
						return fmt.Errorf("能力恢复参数包含认证映射，请使用来源账号配置")
					}
				}
				if err := check(entry); err != nil {
					return err
				}
			}
		case []any:
			for _, entry := range current {
				if err := check(entry); err != nil {
					return err
				}
			}
		case string:
			if strings.HasPrefix(current, "data:") {
				return fmt.Errorf("能力恢复需要已上传的媒体引用，不能保存内联媒体")
			}
		}
		return nil
	}
	var decoded any
	if err := json.Unmarshal(encoded, &decoded); err != nil {
		return err
	}
	return check(decoded)
}
func saveExecutionResult(ctx context.Context, requestID string, result botprotocol.Output, persisted bool, usage ...tokenUsage) error {
	store := bottask.Store(ctx)
	if store == nil {
		return nil
	}
	checkpoint, err := store.Load(context.WithoutCancel(ctx), requestID)
	if err != nil {
		return err
	}
	if checkpoint == nil {
		return fmt.Errorf("能力结果缺少提交检查点")
	}
	if !persisted {
		// 内存文件未入库前不冒充可恢复结果；重启后只查询原 taskID 重新取文件。
		if hasEphemeralExecutionMedia(result) {
			return nil
		}
		checkpoint.Result = result
		if len(usage) > 0 {
			checkpoint.Usage = usage[0].Map()
		}
		checkpoint, err = store.Save(context.WithoutCancel(ctx), bottask.ExecutionChange{Checkpoint: *checkpoint, FactsOnly: true})
		if err != nil {
			return err
		}
		if checkpoint.Stage == bottask.ExecutionPersisted || checkpoint.Stage == bottask.ExecutionFinalized {
			return nil
		}
		checkpoint.Stage = bottask.ExecutionResultReady
	} else {
		checkpoint.Persisted = result
		checkpoint.Stage = bottask.ExecutionPersisted
	}
	_, err = store.Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint})
	return err
}

func executionResultData(checkpoint *bottask.ExecutionCheckpoint) any {
	if checkpoint.Persisted != nil {
		return checkpoint.Persisted
	}
	return checkpoint.Result
}
func (s GatewayService) resolveExecutionStream(ctx context.Context, checkpoint *bottask.ExecutionCheckpoint, job bottask.StreamJob) (bottask.StreamResult, error) {
	if checkpoint != nil && checkpoint.RemoteTaskID != "" {
		return s.tasks.ResumePolling(ctx, job, checkpoint.RemoteTaskID)
	}
	return s.tasks.ResolveStream(ctx, job)
}

// invokeExecution observes live events and durable receipts independently; Redis failure is not a stop request.
func (s GatewayService) invokeExecution(ctx context.Context, request GatewayRequest, options InvokeOptions) (result InvokeResult, resultErr error) {
	defer func() {
		// 取消可能落在 ctx 检查与回执读取之间；存储返回的错误仍属于原任务交接。
		var handoff *bottask.ExecutionHandoff
		if resultErr != nil && s.executionHandedOff(ctx, request.RequestID, resultErr) && !errors.As(resultErr, &handoff) {
			resultErr = &bottask.ExecutionHandoff{Cause: resultErr}
		}
	}()
	checkpoint, err := prepareExecution(ctx, request.RequestID)
	if err != nil {
		return InvokeResult{}, executionError(err)
	}
	if checkpoint.Persisted != nil {
		return InvokeResult{RequestID: request.RequestID, Output: checkpoint.Persisted}, nil
	}
	if checkpoint.Failure != "" {
		return InvokeResult{}, executionError(fmt.Errorf("%s", checkpoint.Failure))
	}
	response := s.Request(ctx, request)
	select {
	case <-bottask.Handoff(ctx):
		return InvokeResult{}, &bottask.ExecutionHandoff{Cause: fmt.Errorf("执行进程正在交接原任务")}
	default:
	}
	if response.Status != botprotocol.ResponseStatusSuccess {
		return InvokeResult{RequestID: request.RequestID, Frame: response.Payload()}, gatewayFrameError(response.Payload(), "能力执行失败")
	}
	if botstream.FrameType(response.Payload()) == botprotocol.ResponseTypeResult {
		return InvokeResult{RequestID: request.RequestID, Output: botstream.FrameOutput(response.Payload())}, nil
	}
	lastID := options.InitialLastID
	if lastID == "" {
		lastID = "0-0"
	}
	for {
		select {
		case <-ctx.Done():
			return InvokeResult{}, &bottask.ExecutionHandoff{Cause: ctx.Err()}
		case <-bottask.Handoff(ctx):
			return InvokeResult{}, &bottask.ExecutionHandoff{Cause: fmt.Errorf("执行进程正在交接原任务")}
		default:
		}
		checkpoint, err = bottask.Store(ctx).Load(ctx, request.RequestID)
		if err != nil {
			return InvokeResult{}, executionError(err)
		}
		if checkpoint.Persisted != nil {
			return InvokeResult{RequestID: request.RequestID, Output: checkpoint.Persisted, LastID: lastID}, nil
		}
		if checkpoint.Failure != "" {
			return InvokeResult{}, executionError(fmt.Errorf("%s", checkpoint.Failure))
		}
		if time.Now().After(checkpoint.Deadline) {
			return InvokeResult{}, executionError(fmt.Errorf("能力执行超过原任务期限"))
		}
		entries, readErr := s.ReadStream(ctx, request.RequestID, lastID, 64, time.Second)
		if readErr != nil {
			bottask.NotificationFailed(ctx, request.RequestID, readErr)
			select {
			case <-ctx.Done():
			case <-time.After(time.Second):
			}
			continue
		}
		for _, entry := range entries {
			lastID = entry.ID
			if options.OnOutput != nil {
				output := botstream.FrameOutput(entry.Payload)
				if len(output) > 0 {
					if err := options.OnOutput(ctx, output); err != nil {
						return InvokeResult{}, err
					}
				}
			}
			if botstream.FrameType(entry.Payload) == botprotocol.ResponseTypeResult && botstream.FrameStatus(entry.Payload) != botprotocol.ResponseStatusSuccess {
				return InvokeResult{RequestID: request.RequestID, Frame: entry.Payload}, gatewayFrameError(entry.Payload, "能力执行失败")
			}
		}
	}
}
func powerOutputFromData(data any) botprotocol.Output {
	return botstream.FrameOutput(botprotocol.BuildSuccessResponse("", data).Payload())
}

func commitExecutionResult(ctx context.Context, requestID string, result botprotocol.Output, record func(context.Context) error) error {
	store := bottask.Store(ctx)
	checkpoint, err := store.Load(ctx, requestID)
	if err != nil {
		return err
	}
	if checkpoint == nil {
		return fmt.Errorf("能力结果缺少提交检查点")
	}
	if checkpoint.Persisted != nil {
		return nil
	}
	checkpoint.Persisted = result
	checkpoint.LastError = ""
	checkpoint.Stage = bottask.ExecutionPersisted
	_, err = store.CommitResult(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint}, record)
	return err
}

// PrepareExecution persists the stable identity before billing reservation and queue submission.
func PrepareExecution(ctx context.Context, requestID string) error {
	_, err := prepareExecution(ctx, requestID)
	return err
}

func hasEphemeralExecutionMedia(value any) bool {
	if _, binary := botprovider.AsBinaryPayload(value); binary {
		return true
	}
	if _, binary := botprovider.AsBinaryMediaOutput(value); binary {
		return true
	}
	switch current := value.(type) {
	case botprotocol.Output:
		return hasEphemeralExecutionMedia(map[string]any(current))
	case map[string]any:
		for key, entry := range current {
			switch key {
			case "images", "image", "videos", "video", "audios", "audio", "files", "file", "b64_json":
				if hasEncodedMediaReference(entry) {
					return true
				}
			}
			if hasEphemeralExecutionMedia(entry) {
				return true
			}
		}
	case []any:
		for _, entry := range current {
			if hasEphemeralExecutionMedia(entry) {
				return true
			}
		}
	case []string:
		for _, entry := range current {
			if hasEphemeralExecutionMedia(entry) {
				return true
			}
		}
	case []botprovider.BinaryPayload, []byte:
		return true
	case string:
		return strings.HasPrefix(strings.ToLower(strings.TrimSpace(current)), "data:")
	}
	return false
}

func hasEncodedMediaReference(value any) bool {
	switch current := value.(type) {
	case string:
		_, _, decoded, _ := decodeGeneratedMedia(current)
		return decoded
	case []string:
		for _, entry := range current {
			if hasEncodedMediaReference(entry) {
				return true
			}
		}
	case []any:
		for _, entry := range current {
			if hasEncodedMediaReference(entry) {
				return true
			}
		}
	}
	return false
}

// 交接不代表一次新的供应商失败；显式用户取消仍沿用原失败计费政策。
func (s GatewayService) executionHandedOff(ctx context.Context, requestID string, err error) bool {
	if bottask.Store(ctx) == nil || (s.streamCancels != nil && s.streamCancels.IsCancelled(requestID)) {
		return false
	}
	var handoff *bottask.ExecutionHandoff
	return ctx.Err() != nil || errors.As(err, &handoff)
}

func (s GatewayService) deferFinalizationError(ctx context.Context, requestID string, cause error) error {
	if s.streamCancels != nil && s.streamCancels.IsCancelled(requestID) {
		return cause
	}
	return bottask.DeferFinalization(ctx, requestID, cause)
}
