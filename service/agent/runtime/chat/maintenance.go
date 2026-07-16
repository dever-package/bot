package chat

import (
	"context"
	"strconv"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

const (
	chatMaintenanceConcurrency = 4
	chatMaintenanceQueueSize   = 256
)

var chatMaintenanceExecutor = runtimeasync.NewExecutor(runtimeasync.ExecutorConfig{
	Concurrency: chatMaintenanceConcurrency,
	QueueSize:   chatMaintenanceQueueSize,
	OnError: func(err error) {
		dlog.ErrorFields("agent_chat_maintenance", "智能体会话后台任务异常", dlog.Fields{"error": err.Error()})
	},
})

func submitChatMaintenance(kind string, id uint64, timeout time.Duration, run func(context.Context)) {
	if id == 0 || run == nil {
		return
	}
	key := kind + ":" + strconv.FormatUint(id, 10)
	accepted := chatMaintenanceExecutor.Submit(key, kind, func() {
		ctx, cancel := runtimeasync.Detached(timeout)
		defer cancel()
		run(ctx)
	})
	if !accepted {
		dlog.ErrorFields("agent_chat_maintenance_queue", "智能体会话后台任务队列已满", dlog.Fields{
			"kind": kind, "id": id,
		})
	}
}
