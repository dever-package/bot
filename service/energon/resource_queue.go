package energon

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"sync"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
	bottask "github.com/dever-package/bot/service/energon/task"
)

type resourceWaiter struct {
	ready    chan struct{}
	admitted bool
}
type resourcePool struct {
	active  int
	waiting []*resourceWaiter
}
type resourceQueue struct {
	mu    sync.Mutex
	pools map[string]*resourcePool
}

var gatewayResources = resourceQueue{pools: map[string]*resourcePool{}}

func (queue *resourceQueue) acquire(ctx context.Context, key string, limit, capacity int, notify func(int)) (func(), error) {
	waiter := &resourceWaiter{ready: make(chan struct{})}
	queue.mu.Lock()
	pool := queue.pools[key]
	if pool == nil {
		pool = &resourcePool{}
		queue.pools[key] = pool
	}
	if pool.active < limit && len(pool.waiting) == 0 {
		pool.active++
		waiter.admitted = true
		close(waiter.ready)
	} else {
		if len(pool.waiting) >= capacity {
			queue.mu.Unlock()
			return nil, fmt.Errorf("该来源等待队列已满，请稍后重试")
		}
		pool.waiting = append(pool.waiting, waiter)
	}
	position := 0
	if !waiter.admitted {
		position = len(pool.waiting) + pool.active
	}
	queue.mu.Unlock()
	if position > 0 && notify != nil {
		notify(position)
	}
	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-waiter.ready:
			var once sync.Once
			return func() { once.Do(func() { queue.release(key, pool) }) }, nil
		case <-ctx.Done():
			queue.mu.Lock()
			admitted := waiter.admitted
			if !admitted {
				for index, item := range pool.waiting {
					if item == waiter {
						pool.waiting = append(pool.waiting[:index], pool.waiting[index+1:]...)
						break
					}
				}
			}
			queue.mu.Unlock()
			if admitted {
				queue.release(key, pool)
			}
			return nil, ctx.Err()
		case <-ticker.C:
			queue.mu.Lock()
			position = 0
			for index, item := range pool.waiting {
				if item == waiter {
					position = index + 1 + pool.active
					break
				}
			}
			queue.mu.Unlock()
			if position > 0 && notify != nil {
				notify(position)
			}
		}
	}
}
func (queue *resourceQueue) release(key string, pool *resourcePool) {
	queue.mu.Lock()
	defer queue.mu.Unlock()
	if len(pool.waiting) > 0 {
		next := pool.waiting[0]
		pool.waiting = pool.waiting[1:]
		next.admitted = true
		close(next.ready)
	} else {
		pool.active--
		if pool.active == 0 {
			delete(queue.pools, key)
		}
	}
}
func (s GatewayService) acquireRemoteResource(ctx context.Context, prepared remoteCallPreparation) (func(), error) {
	if store := bottask.Store(ctx); store != nil {
		checkpoint, err := store.Load(ctx, prepared.Request.RequestID)
		if err != nil {
			return nil, err
		}
		if checkpoint != nil && checkpoint.Result != nil {
			return func() {}, nil
		}
	}
	release := func() {}
	// ComfyUI accepts queued tasks itself; observing a task must not hold up
	// submissions to its other workers or hide pending tasks from its queue.
	if prepared.Adapter.Name() != botmodel.ProtocolComfyUI {
		config := botruntimeconfig.Load()
		host := strings.TrimRight(strings.ToLower(prepared.NativeRequest.URL), "/")
		if parsed, err := url.Parse(host); err == nil && parsed.Host != "" {
			host = parsed.Host
		}
		kind := prepared.Selected.Power.Kind
		limit := config.WorkerConcurrency
		if _, media := generatedMediaRuleForKind(kind); media {
			limit = config.MediaConcurrency
		}
		acquired, err := gatewayResources.acquire(ctx, fmt.Sprintf("%s:%s", host, kind), limit, config.QueueCapacity, func(position int) {
			_ = s.writeStreamOutput(ctx, prepared.Request.RequestID, botprotocol.Output{"event": "status", "text": fmt.Sprintf("等待执行，前方 %d 个任务", position-1), "meta": map[string]any{"execution_phase": "queued", "queue_position": position}})
		})
		if err != nil {
			return nil, err
		}
		release = acquired
	}
	_ = s.writeStreamOutput(ctx, prepared.Request.RequestID, botprotocol.Output{"event": "status", "text": "正在连接生成服务", "meta": map[string]any{"execution_phase": "submitting", "queue_position": 0}})
	return release, nil
}
