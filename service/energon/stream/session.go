package stream

import (
	"context"
	"fmt"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	bottask "my/package/bot/service/energon/task"
	frontstream "my/package/front/service/stream"
)

const (
	WorkerTimeout     = 10 * time.Minute
	startWriteTimeout = 3 * time.Second
)

func Start(
	ctx context.Context,
	store frontstream.Service,
	cancels *CancelRegistry,
	tasks bottask.Service,
	requestID string,
	job bottask.Job,
) botprotocol.Response {
	cancels.Init(requestID)

	now := time.Now()
	start := botprotocol.BuildStreamResponse(requestID, botprotocol.Output{
		"event": "start",
		"text":  "等待生成结果",
		"meta": map[string]any{
			"stream_key":    Key(requestID),
			"cancelable":    false,
			"started_at":    now.Format(time.RFC3339Nano),
			"started_at_ms": now.UnixMilli(),
		},
	})

	writeCtx, cancel := context.WithTimeout(ctx, startWriteTimeout)
	defer cancel()
	if _, err := store.WritePayload(writeCtx, requestID, start.Payload()); err != nil {
		return botprotocol.BuildErrorResponse(requestID, err)
	}

	if err := tasks.Submit(ctx, job); err != nil {
		cancels.Remove(requestID)
		return botprotocol.BuildErrorResponse(requestID, err)
	}
	return start
}

func Read(
	ctx context.Context,
	store frontstream.Service,
	requestID string,
	lastID string,
	count int64,
	block time.Duration,
) ([]Entry, error) {
	return store.Read(ctx, requestID, lastID, count, block)
}

func Stop(
	ctx context.Context,
	store frontstream.Service,
	cancels *CancelRegistry,
	tasks bottask.Service,
	requestID string,
) botprotocol.Response {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("request_id 不能为空"))
	}
	if !cancels.MarkCancelled(requestID) {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("当前任务不支持取消或已结束"))
	}
	remoteErr := cancels.CancelRemote(ctx, requestID)
	cancelledLocal := tasks.Cancel(ctx, requestID)
	if remoteErr != nil {
		return botprotocol.BuildErrorResponse(requestID, remoteErr)
	}
	if !cancelledLocal {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("当前任务已结束"))
	}

	resp := botprotocol.BuildStreamResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "任务已取消",
	})
	_ = Write(ctx, store, requestID, resp)
	result := botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "任务已取消",
	})
	_ = Write(ctx, store, requestID, result)
	return result
}

func Write(ctx context.Context, store frontstream.Service, requestID string, resp botprotocol.Response) error {
	_, err := store.WritePayload(ctx, requestID, resp.Payload())
	return err
}
