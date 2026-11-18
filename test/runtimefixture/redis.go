package runtimefixture

import (
	"context"
	"fmt"
	"github.com/dever-package/bot/service/energon/schedule"
	"github.com/google/uuid"
	"github.com/shemic/dever/config"
	"os"
	"strings"
	"testing"
	"time"
)

func Redis(t *testing.T) *schedule.Broker {
	t.Helper()
	path := os.Getenv("BOT_TEST_REDIS_CONFIG")
	if path == "" {
		t.Skip("set BOT_TEST_REDIS_CONFIG to run against isolated keys on real Redis")
	}
	cfg, err := config.Load(path)
	if err != nil {
		t.Fatal(err)
	}
	broker, err := schedule.NewBroker(cfg.Redis)
	if err != nil {
		t.Fatal(err)
	}
	broker.Prefix = strings.Trim(cfg.Redis.Prefix, ":") + ":test:{schedule-" + uuid.NewString() + "}"
	ctx := context.Background()
	if err := broker.Client.Set(ctx, broker.Prefix+":ready", "1", time.Hour).Err(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		cleanup, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		var cursor uint64
		for {
			keys, next, err := broker.Client.Scan(cleanup, cursor, broker.Prefix+":*", 100).Result()
			if err != nil {
				t.Error(err)
				break
			}
			if len(keys) > 0 {
				if err := broker.Client.Del(cleanup, keys...).Err(); err != nil {
					t.Error(err)
				}
			}
			cursor = next
			if cursor == 0 {
				break
			}
		}
		if err := broker.Client.Close(); err != nil {
			t.Error(err)
		}
	})
	return broker
}

// AccountUsage inspects the real admission index without adding a runtime API.
func AccountUsage(ctx context.Context, broker *schedule.Broker, id uint64) (map[string]int64, error) {
	active, err := broker.Client.SCard(ctx, fmt.Sprintf("%s:active:%d", broker.Prefix, id)).Result()
	if err != nil {
		return nil, err
	}
	waiting, err := broker.Client.ZCard(ctx, fmt.Sprintf("%s:queue:%d", broker.Prefix, id)).Result()
	if err != nil {
		return nil, err
	}
	return map[string]int64{"active_tasks": active, "waiting_tasks": waiting}, nil
}
