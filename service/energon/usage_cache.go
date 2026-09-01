package energon

import (
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"errors"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	devercache "github.com/shemic/dever/cache"
	deverconfig "github.com/shemic/dever/config"
)

const (
	usageStatisticsShortCacheTTL      = 2 * time.Minute
	usageStatisticsCacheTimeout       = 300 * time.Millisecond
	usageStatisticsCacheMaxEntries    = 256
	usageStatisticsCacheRedisPoolSize = 8
	usageStatisticsCacheRedisCooldown = 30 * time.Second
	usageStatisticsCacheVersion       = "bot:energon:usage:v3"
)

type usageShortCache[T any] struct {
	local *devercache.VersionedCache[string, T]
}

type usageRedisStore struct {
	once             sync.Once
	client           *redis.Client
	prefix           string
	availabilityMu   sync.RWMutex
	unavailableUntil time.Time
}

type usageRedisLoadResult struct {
	Payload  []byte
	Hit      bool
	Writable bool
}

var usageStatisticsRedis usageRedisStore

func newUsageShortCache[T any]() *usageShortCache[T] {
	return &usageShortCache[T]{
		local: devercache.New[string, T](
			devercache.WithTTL(usageStatisticsShortCacheTTL),
			devercache.WithMaxEntries(usageStatisticsCacheMaxEntries),
		),
	}
}

func (current *usageShortCache[T]) load(
	ctx context.Context,
	key string,
	loader func() (T, error),
) (T, error) {
	return current.local.GetOrSet(key, func() (T, error) {
		redisResult := usageStatisticsRedis.load(ctx, key)
		if redisResult.Hit {
			var cached T
			if json.Unmarshal(redisResult.Payload, &cached) == nil {
				return cached, nil
			}
		}

		value, err := loader()
		if err != nil {
			return value, err
		}
		if redisResult.Writable {
			if payload, marshalErr := json.Marshal(value); marshalErr == nil {
				usageStatisticsRedis.store(ctx, key, payload)
			}
		}
		return value, nil
	})
}

func (store *usageRedisStore) load(ctx context.Context, key string) usageRedisLoadResult {
	client, redisKey := store.resolve(key)
	if client == nil || !store.available(time.Now()) {
		return usageRedisLoadResult{}
	}
	requestContext, cancel := usageStatisticsCacheContext(ctx)
	defer cancel()
	payload, err := client.Get(requestContext, redisKey).Bytes()
	if errors.Is(err, redis.Nil) {
		return usageRedisLoadResult{Writable: true}
	}
	if err != nil {
		if !errors.Is(err, context.Canceled) {
			store.markUnavailable(time.Now())
		}
		return usageRedisLoadResult{}
	}
	return usageRedisLoadResult{Payload: payload, Hit: true, Writable: true}
}

func (store *usageRedisStore) store(ctx context.Context, key string, payload []byte) {
	client, redisKey := store.resolve(key)
	if client == nil || !store.available(time.Now()) {
		return
	}
	requestContext, cancel := usageStatisticsCacheContext(ctx)
	defer cancel()
	err := client.Set(requestContext, redisKey, payload, usageStatisticsShortCacheTTL).Err()
	if err != nil && !errors.Is(err, context.Canceled) {
		store.markUnavailable(time.Now())
	}
}

func (store *usageRedisStore) available(now time.Time) bool {
	store.availabilityMu.RLock()
	unavailableUntil := store.unavailableUntil
	store.availabilityMu.RUnlock()
	return unavailableUntil.IsZero() || !now.Before(unavailableUntil)
}

func (store *usageRedisStore) markUnavailable(now time.Time) {
	store.availabilityMu.Lock()
	store.unavailableUntil = now.Add(usageStatisticsCacheRedisCooldown)
	store.availabilityMu.Unlock()
}

func (store *usageRedisStore) resolve(key string) (*redis.Client, string) {
	store.once.Do(store.initialize)
	if store.client == nil {
		return nil, ""
	}
	return store.client, store.prefix + ":" + key
}

func (store *usageRedisStore) initialize() {
	config, err := deverconfig.Load("")
	if err != nil || config == nil || !config.Redis.Enable || strings.TrimSpace(config.Redis.Addr) == "" {
		return
	}
	poolSize := config.Redis.PoolSize
	if poolSize <= 0 || poolSize > usageStatisticsCacheRedisPoolSize {
		poolSize = usageStatisticsCacheRedisPoolSize
	}
	minIdleConnections := config.Redis.MinIdleConns
	if minIdleConnections < 0 {
		minIdleConnections = 0
	}
	if minIdleConnections > 1 {
		minIdleConnections = 1
	}
	maxRetries := config.Redis.MaxRetries
	if maxRetries <= 0 {
		maxRetries = -1
	} else if maxRetries > 1 {
		maxRetries = 1
	}

	options := &redis.Options{
		Addr:                  strings.TrimSpace(config.Redis.Addr),
		Username:              strings.TrimSpace(config.Redis.Username),
		Password:              config.Redis.Password,
		DB:                    config.Redis.DB,
		PoolSize:              poolSize,
		MinIdleConns:          minIdleConnections,
		MaxRetries:            maxRetries,
		DialTimeout:           usageStatisticsCacheDuration(config.Redis.DialTimeout.Duration()),
		ReadTimeout:           usageStatisticsCacheDuration(config.Redis.ReadTimeout.Duration()),
		WriteTimeout:          usageStatisticsCacheDuration(config.Redis.WriteTimeout.Duration()),
		PoolTimeout:           usageStatisticsCacheTimeout,
		ContextTimeoutEnabled: true,
	}
	if config.Redis.UseTLS {
		options.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
	}
	store.client = redis.NewClient(options)
	store.prefix = strings.Trim(strings.TrimSpace(config.Redis.Prefix), ":")
	if store.prefix != "" {
		store.prefix += ":"
	}
	store.prefix += usageStatisticsCacheVersion
}

func usageStatisticsCacheContext(ctx context.Context) (context.Context, context.CancelFunc) {
	if ctx == nil {
		ctx = context.Background()
	}
	return context.WithTimeout(ctx, usageStatisticsCacheTimeout)
}

func usageStatisticsCacheDuration(configured time.Duration) time.Duration {
	if configured <= 0 || configured > usageStatisticsCacheTimeout {
		return usageStatisticsCacheTimeout
	}
	return configured
}

func usageStatisticsSnapshotTime(now time.Time) time.Time {
	seconds := int64(usageStatisticsShortCacheTTL / time.Second)
	return time.Unix(now.Unix()/seconds*seconds, 0).In(time.Local)
}

func usageStatisticsCacheKey(scope string, now time.Time, values ...string) string {
	parts := make([]string, 0, len(values)+2)
	parts = append(parts, strings.TrimSpace(scope))
	parts = append(parts, strconv.FormatInt(usageStatisticsSnapshotTime(now).Unix(), 10))
	parts = append(parts, values...)
	digest := sha256.Sum256([]byte(strings.Join(parts, "\x00")))
	return strings.TrimSpace(scope) + ":" + hex.EncodeToString(digest[:16])
}
