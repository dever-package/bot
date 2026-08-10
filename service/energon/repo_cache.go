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
