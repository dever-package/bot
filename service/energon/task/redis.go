package task

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/redis/go-redis/v9"
)

const DefaultRedisQueueKey = "energon:task:queue"

type RedisQueue struct {
	client *redis.Client
	key    string
}

func NewRedisQueue(client *redis.Client, key string) RedisQueue {
	key = strings.TrimSpace(key)
	if key == "" {
		key = DefaultRedisQueueKey
	}
	return RedisQueue{
		client: client,
		key:    key,
	}
}

func (q RedisQueue) Push(ctx context.Context, job Job) error {
	if q.client == nil {
		return fmt.Errorf("Redis 任务队列未初始化")
	}
	payload, err := json.Marshal(job)
	if err != nil {
		return err
	}
	return q.client.LPush(ctx, q.key, string(payload)).Err()
}
