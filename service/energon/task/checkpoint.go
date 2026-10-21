package task

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/google/uuid"
)

type ExecutionStage string

const (
	ExecutionPrepared    ExecutionStage = "prepared"
	ExecutionSubmitting  ExecutionStage = "submitting"
	ExecutionSubmitted   ExecutionStage = "submitted"
	ExecutionResultReady ExecutionStage = "result_ready"
	ExecutionPersisted   ExecutionStage = "persisted"
	ExecutionFinalized   ExecutionStage = "finalized"
)

// ExecutionCheckpoint stores business references, never credential-bearing HTTP requests.
type ExecutionCheckpoint struct {
	Version         int                     `json:"version"`
	RequestID       string                  `json:"request_id"`
	Attempt         int                     `json:"attempt"`
	SubmissionToken string                  `json:"submission_token"`
	Stage           ExecutionStage          `json:"stage"`
	StartedAt       time.Time               `json:"started_at"`
	Deadline        time.Time               `json:"deadline"`
	PowerID         uint64                  `json:"power_id,omitempty"`
	TargetID        uint64                  `json:"target_id,omitempty"`
	ProviderID      uint64                  `json:"provider_id,omitempty"`
	AccountID       uint64                  `json:"account_id,omitempty"`
	ServiceID       uint64                  `json:"service_id,omitempty"`
	EndpointID      uint64                  `json:"endpoint_id,omitempty"`
	ServiceAPI      string                  `json:"service_api,omitempty"`
	Protocol        string                  `json:"protocol,omitempty"`
	Mapped          botprotocol.MappedInput `json:"mapped,omitempty"`
	RemoteTaskID    string                  `json:"remote_task_id,omitempty"`
	Usage           map[string]any          `json:"usage,omitempty"`
	LastError       string                  `json:"last_error,omitempty"`
	Failure         string                  `json:"failure,omitempty"`
	Result          botprotocol.Output      `json:"result,omitempty"`
	Persisted       botprotocol.Output      `json:"persisted,omitempty"`
	BillingTargetID *uint64                 `json:"billing_target_id,omitempty"`
	BillingKey      string                  `json:"billing_key,omitempty"`
}

// ExecutionHandoff preserves the original reservation while another lease resumes work.
type ExecutionHandoff struct{ Cause error }

func (e *ExecutionHandoff) Error() string              { return e.Cause.Error() }
func (e *ExecutionHandoff) Unwrap() error              { return e.Cause }
func (e *ExecutionHandoff) DeferPowerSettlement() bool { return true }

type ExecutionChange struct {
	Checkpoint ExecutionCheckpoint
	// FactsOnly admits late immutable task/result receipts without granting execution rights.
	FactsOnly bool
}
type ExecutionStore interface {
	Load(context.Context, string) (*ExecutionCheckpoint, error)
	Save(context.Context, ExecutionChange) (*ExecutionCheckpoint, error)
	CommitResult(context.Context, ExecutionChange, func(context.Context) error) (*ExecutionCheckpoint, error)
}
type executionStoreKey struct{}
type executionSession struct {
	store       ExecutionStore
	notice      sync.Once
	handoff     chan struct{}
	handoffOnce sync.Once
}

func WithExecutionStore(ctx context.Context, store ExecutionStore) context.Context {
	return context.WithValue(ctx, executionStoreKey{}, &executionSession{store: store, handoff: make(chan struct{})})
}
func Store(ctx context.Context) ExecutionStore {
	session, _ := ctx.Value(executionStoreKey{}).(*executionSession)
	if session == nil {
		return nil
	}
	return session.store
}

func MergeExecutionCheckpoint(current *ExecutionCheckpoint, change ExecutionChange) (*ExecutionCheckpoint, error) {
	incoming := change.Checkpoint
	if incoming.Version != 1 || incoming.RequestID == "" || incoming.Attempt < 1 || incoming.SubmissionToken == "" {
		return nil, fmt.Errorf("能力检查点身份无效")
	}
	if current == nil {
		if change.FactsOnly || incoming.Stage != ExecutionPrepared {
			return nil, fmt.Errorf("能力检查点尚未准备")
		}
		return &incoming, nil
	}
	if current.RequestID != incoming.RequestID || current.Attempt != incoming.Attempt || current.SubmissionToken != incoming.SubmissionToken {
		return nil, fmt.Errorf("能力提交回执身份冲突")
	}
	if !current.StartedAt.Equal(incoming.StartedAt) || !current.Deadline.Equal(incoming.Deadline) || current.Version != incoming.Version {
		return nil, fmt.Errorf("能力检查点期限或版本不可改变")
	}
	if current.BillingTargetID != nil && (incoming.BillingTargetID == nil || *current.BillingTargetID != *incoming.BillingTargetID) {
		return nil, fmt.Errorf("能力原计费来源不可改变")
	}
	next := *current
	if change.FactsOnly {
		if incoming.TargetID != current.TargetID || incoming.AccountID != current.AccountID || incoming.ProviderID != current.ProviderID || incoming.ServiceID != current.ServiceID {
			return nil, fmt.Errorf("能力提交来源冲突")
		}
		if incoming.RemoteTaskID != "" {
			if current.RemoteTaskID != "" && current.RemoteTaskID != incoming.RemoteTaskID {
				return nil, fmt.Errorf("能力远端任务号冲突")
			}
			next.RemoteTaskID = incoming.RemoteTaskID
		}
		if incoming.Result != nil {
			if current.Result != nil && !equivalentJSON(current.Result, incoming.Result) {
				return nil, fmt.Errorf("能力结果回执冲突")
			}
			next.Result = incoming.Result
			if current.Usage != nil && !equivalentJSON(current.Usage, incoming.Usage) {
				return nil, fmt.Errorf("能力用量回执冲突")
			}
			next.Usage = incoming.Usage
		}
		return &next, nil
	}
	if stageOrder(incoming.Stage) < stageOrder(current.Stage) || stageOrder(incoming.Stage) == 0 {
		return nil, fmt.Errorf("能力检查点不能倒退")
	}
	if current.TargetID != 0 && (current.TargetID != incoming.TargetID || current.AccountID != incoming.AccountID || current.ServiceID != incoming.ServiceID || current.ProviderID != incoming.ProviderID || current.EndpointID != incoming.EndpointID) {
		return nil, fmt.Errorf("能力恢复不能更换来源或账号")
	}
	if incoming.RemoteTaskID != current.RemoteTaskID && current.RemoteTaskID != "" {
		return nil, fmt.Errorf("能力远端任务号不可替换")
	}
	if current.Result != nil && !equivalentJSON(current.Result, incoming.Result) {
		return nil, fmt.Errorf("能力结果回执不可替换")
	}
	if current.Failure != "" && current.Failure != incoming.Failure {
		return nil, fmt.Errorf("能力失败回执不可替换")
	}
	if current.Persisted != nil && !equivalentJSON(current.Persisted, incoming.Persisted) {
		return nil, fmt.Errorf("能力保存结果不可替换")
	}
	return &incoming, nil
}
func equivalentJSON(a, b any) bool {
	left, err := json.Marshal(a)
	if err != nil {
		return false
	}
	right, err := json.Marshal(b)
	return err == nil && bytes.Equal(left, right)
}
func stageOrder(stage ExecutionStage) int {
	switch stage {
	case ExecutionPrepared:
		return 1
	case ExecutionSubmitting:
		return 2
	case ExecutionSubmitted:
		return 3
	case ExecutionResultReady:
		return 4
	case ExecutionPersisted:
		return 5
	case ExecutionFinalized:
		return 6
	}
	return 0
}

func NotificationFailed(ctx context.Context, requestID string, err error) bool {
	session, _ := ctx.Value(executionStoreKey{}).(*executionSession)
	if session == nil || err == nil {
		return false
	}
	session.notice.Do(func() {
		slog.Warn("能力实时通知不可用，执行继续并由持久状态核对", "request_id", requestID, "error", err)
	})
	return true
}

func SignalHandoff(ctx context.Context) {
	session, _ := ctx.Value(executionStoreKey{}).(*executionSession)
	if session != nil {
		session.handoffOnce.Do(func() { close(session.handoff) })
	}
}
func Handoff(ctx context.Context) <-chan struct{} {
	session, _ := ctx.Value(executionStoreKey{}).(*executionSession)
	if session == nil {
		return nil
	}
	return session.handoff
}

// ChildRequestID keeps a composite phase bound to its original durable receipt.
func ChildRequestID(parentID, phase string) string {
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(parentID+":"+phase)).String()
}

// DeferFinalization returns the real local failure while preserving the receipt and reservation.
func DeferFinalization(ctx context.Context, requestID string, cause error) error {
	store := Store(ctx)
	if cause == nil || store == nil {
		return cause
	}
	checkpoint, loadErr := store.Load(context.WithoutCancel(ctx), requestID)
	if loadErr == nil && checkpoint == nil {
		return cause
	}
	if loadErr == nil && checkpoint != nil {
		if time.Now().After(checkpoint.Deadline) {
			return cause
		}
		checkpoint.LastError = cause.Error()
		_, loadErr = store.Save(context.WithoutCancel(ctx), ExecutionChange{Checkpoint: *checkpoint})
	}
	if loadErr != nil {
		cause = errors.Join(cause, loadErr)
	}
	slog.Warn("能力结果收尾暂未完成，将沿原检查点恢复", "request_id", requestID, "error", cause)
	return &ExecutionHandoff{Cause: cause}
}
