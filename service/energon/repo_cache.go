package energon

import (
	"context"
	"sync"
)

type repoRequestCacheKey struct{}

type repoRequestCache struct {
	mu      sync.Mutex
	entries map[string]*repoRequestCacheEntry
}

type repoRequestCacheEntry struct {
	ready  chan struct{}
	value  any
	loaded bool
}

// WithPowerRequestCache 让同一次能力准备中的配置读取和校验共用缓存。
// 返回的 context 只用于当前请求，不得跨请求或任务刷新轮次保存。
func WithPowerRequestCache(ctx context.Context) context.Context {
	return withRepoRequestCache(ctx)
}

func withRepoRequestCache(ctx context.Context) context.Context {
	if ctx == nil {
		ctx = context.Background()
	}
	if _, ok := ctx.Value(repoRequestCacheKey{}).(*repoRequestCache); ok {
		return ctx
	}
	return context.WithValue(ctx, repoRequestCacheKey{}, &repoRequestCache{
		entries: map[string]*repoRequestCacheEntry{},
	})
}

func cachedRepoValue[T any](ctx context.Context, key string, load func() T) T {
	if ctx == nil {
		return load()
	}
	cache, ok := ctx.Value(repoRequestCacheKey{}).(*repoRequestCache)
	if !ok {
		return load()
	}

	var entry *repoRequestCacheEntry
	for {
		cache.mu.Lock()
		if current, exists := cache.entries[key]; exists {
			cache.mu.Unlock()
			<-current.ready
			if current.loaded {
				if typed, valid := current.value.(T); valid {
					return typed
				}
			}
			cache.mu.Lock()
			if cache.entries[key] == current {
				delete(cache.entries, key)
			}
			cache.mu.Unlock()
			continue
		}
		entry = &repoRequestCacheEntry{ready: make(chan struct{})}
		cache.entries[key] = entry
		cache.mu.Unlock()
		break
	}

	completed := false
	defer func() {
		if completed {
			return
		}
		cache.mu.Lock()
		if current := cache.entries[key]; current == entry {
			delete(cache.entries, key)
			close(entry.ready)
		}
		cache.mu.Unlock()
	}()

	value := load()
	cache.mu.Lock()
	entry.value = value
	entry.loaded = true
	close(entry.ready)
	completed = true
	cache.mu.Unlock()
	return value
}

type cachedRepoRecord[T any] struct {
	Value T
	Found bool
}

// 批量预载占用各条目的加载槽，单项读取可复用空结果并等待正在执行的批量查询。
func preloadRepoValues[T any](ctx context.Context, keys []string, load func([]string) map[string]T) {
	if ctx == nil {
		return
	}
	cache, ok := ctx.Value(repoRequestCacheKey{}).(*repoRequestCache)
	if !ok {
		return
	}
	entries := make(map[string]*repoRequestCacheEntry, len(keys))
	missing := make([]string, 0, len(keys))
	cache.mu.Lock()
	for _, key := range keys {
		if _, exists := cache.entries[key]; exists {
			continue
		}
		entry := &repoRequestCacheEntry{ready: make(chan struct{})}
		cache.entries[key] = entry
		entries[key] = entry
		missing = append(missing, key)
	}
	cache.mu.Unlock()
	if len(missing) == 0 {
		return
	}
	completed := false
	defer func() {
		if completed {
			return
		}
		cache.mu.Lock()
		for key, entry := range entries {
			delete(cache.entries, key)
			close(entry.ready)
		}
		cache.mu.Unlock()
	}()
	values := load(missing)
	cache.mu.Lock()
	for key, entry := range entries {
		entry.value = values[key]
		entry.loaded = true
		close(entry.ready)
	}
	completed = true
	cache.mu.Unlock()
}
