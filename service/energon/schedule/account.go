package schedule

import (
	"context"
	"crypto/tls"
	_ "embed"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/shemic/dever/config"
)

var ErrRedisDisabled = errors.New("账号并发控制和多账号调度需要启用项目 Redis")

//go:embed account.lua
var accountScript string

type Broker struct {
	Client redis.UniversalClient
	Prefix string
}

type Lease struct {
	broker    *Broker
	id, token string
	accountID uint64
	pool      string
}

// Account contains admission data only; credentials never enter Redis.
type Account struct {
	ID    uint64
	Limit int
}

func (lease *Lease) AccountID() uint64 { return lease.accountID }

func NewBroker(cfg config.Redis) (*Broker, error) {
	if !cfg.Enable || strings.TrimSpace(cfg.Addr) == "" {
		return nil, ErrRedisDisabled
	}
	options := &redis.Options{Addr: cfg.Addr, Username: cfg.Username, Password: cfg.Password, DB: cfg.DB, PoolSize: cfg.PoolSize, MinIdleConns: cfg.MinIdleConns, MaxRetries: cfg.MaxRetries, DialTimeout: cfg.DialTimeout.Duration(), ReadTimeout: cfg.ReadTimeout.Duration(), WriteTimeout: cfg.WriteTimeout.Duration()}
	if cfg.UseTLS {
		options.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
	}
	return &Broker{Client: redis.NewClient(options), Prefix: strings.Trim(cfg.Prefix, ":") + ":{energon-accounts}"}, nil
}

func (b *Broker) Acquire(ctx context.Context, id, token, pool string, accounts []Account, notify func(int), refresh func(context.Context) ([]Account, error)) (result *Lease, err error) {
	lease := &Lease{broker: b, id: id, token: token, pool: pool}
	acquired := false
	defer func() {
		if !acquired {
			cleanup, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
			defer cancel()
			_, cleanupErr := lease.command(cleanup, "cancel")
			err = errors.Join(err, cleanupErr)
		}
	}()
	lastPosition := 0
	for {
		if refresh != nil {
			accounts, err = refresh(ctx)
			if err != nil {
				return nil, err
			}
		}
		if len(accounts) == 0 {
			return nil, fmt.Errorf("来源服务没有可用账号")
		}
		result, acquireErr := lease.command(ctx, "acquire", accounts...)
		if acquireErr != nil {
			return nil, fmt.Errorf("等待账号并发名额失败: %w", acquireErr)
		}
		if result[0] == 1 {
			lease.accountID = uint64(result[1])
			acquired = true
			return lease, nil
		}
		if position := int(result[1]); notify != nil && position > 0 && position != lastPosition {
			notify(position)
			lastPosition = position
		}
		timer := time.NewTimer(200 * time.Millisecond)
		select {
		case <-ctx.Done():
			timer.Stop()
			return nil, fmt.Errorf("等待账号并发名额结束: %w", ctx.Err())
		case <-timer.C:
		}
	}
}

// Adoption follows the SQL execution fence. An unfinished remote task keeps its
// slot even when the previous process exits or the configured limit is lowered.
func (b *Broker) Adopt(ctx context.Context, id, token string, accountID uint64) (*Lease, error) {
	lease := &Lease{broker: b, id: id, token: token, accountID: accountID}
	_, err := lease.command(ctx, "adopt")
	return lease, err
}

func (lease *Lease) command(ctx context.Context, action string, accounts ...Account) ([]int64, error) {
	args := []any{action, lease.id, lease.token, lease.accountID, lease.pool}
	for _, account := range accounts {
		args = append(args, account.ID, account.Limit)
	}
	return lease.broker.Client.Eval(ctx, accountScript, []string{lease.broker.Prefix}, args...).Int64Slice()
}

func (lease *Lease) Release(ctx context.Context) error {
	_, err := lease.command(ctx, "release")
	return err
}

func (lease *Lease) Verify(ctx context.Context) error {
	result, err := lease.command(ctx, "verify")
	if err != nil {
		return err
	}
	if result[0] != 1 {
		return fmt.Errorf("账号并发占位已由其他执行者接管，未向上游提交")
	}
	return nil
}

func (b *Broker) ActiveTasks(ctx context.Context) (map[string]string, error) {
	return b.Client.HGetAll(ctx, b.Prefix+":task-index").Result()
}

func (b *Broker) ReleaseTask(ctx context.Context, id, token string) error {
	return (&Lease{broker: b, id: id, token: token}).Release(ctx)
}

func StorageError(err *error) {
	if recovered := recover(); recovered != nil {
		if cause, ok := recovered.(error); ok {
			*err = fmt.Errorf("来源任务存储失败: %w", cause)
		} else {
			*err = fmt.Errorf("来源任务存储失败: %v", recovered)
		}
	}
}
