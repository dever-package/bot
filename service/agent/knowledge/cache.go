package knowledge

import (
	"hash/fnv"
	"sync"
	"time"
)

const (
	graphCacheTTL     = 30 * time.Second
	graphCacheMaxKeys = 500
)

type graphCacheEntry struct {
	plan      retrievalPlan
	expiresAt time.Time
}

var (
	graphCache     map[uint64]*graphCacheEntry
	graphCacheMu   sync.RWMutex
	graphCacheKeys []uint64 // FIFO eviction order
	graphCacheInit sync.Once
)

func ensureGraphCache() {
	graphCacheInit.Do(func() {
		graphCache = make(map[uint64]*graphCacheEntry, 256)
	})
}

func graphCacheKey(baseID uint64, query string) uint64 {
	h := fnv.New64a()
	h.Write([]byte(query))
	return baseID ^ h.Sum64()
}

func graphCacheGet(baseID uint64, query string) (retrievalPlan, bool) {
	ensureGraphCache()
	key := graphCacheKey(baseID, query)
	graphCacheMu.RLock()
	entry, exists := graphCache[key]
	graphCacheMu.RUnlock()
	if !exists || time.Now().After(entry.expiresAt) {
		if exists {
			graphCacheDelete(key)
		}
		return retrievalPlan{}, false
	}
	return entry.plan, true
}

func graphCacheSet(baseID uint64, query string, plan retrievalPlan) {
	if plan.Error != "" {
		return
	}
	if len(plan.Queries) == 0 && len(plan.DocIDs) == 0 {
		return
	}
	ensureGraphCache()
	key := graphCacheKey(baseID, query)
	graphCacheMu.Lock()
	defer graphCacheMu.Unlock()
	if _, exists := graphCache[key]; exists {
		graphCache[key] = &graphCacheEntry{
			plan:      plan,
			expiresAt: time.Now().Add(graphCacheTTL),
		}
		return
	}
	if len(graphCache) >= graphCacheMaxKeys && len(graphCacheKeys) > 0 {
		evictKey := graphCacheKeys[0]
		graphCacheKeys = graphCacheKeys[1:]
		delete(graphCache, evictKey)
	}
	graphCache[key] = &graphCacheEntry{
		plan:      plan,
		expiresAt: time.Now().Add(graphCacheTTL),
	}
	graphCacheKeys = append(graphCacheKeys, key)
}

func graphCacheDelete(key uint64) {
	graphCacheMu.Lock()
	delete(graphCache, key)
	graphCacheMu.Unlock()
	for i, k := range graphCacheKeys {
		if k == key {
			graphCacheKeys = append(graphCacheKeys[:i], graphCacheKeys[i+1:]...)
			break
		}
	}
}
