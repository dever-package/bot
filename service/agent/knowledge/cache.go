package knowledge

import (
	"strings"
	"sync"
	"time"
)

const (
	graphCacheTTL     = 30 * time.Second
	graphCacheMaxKeys = 500
)

type expiringCacheEntry[T any] struct {
	value     T
	expiresAt time.Time
}

type expiringCache[K comparable, V any] struct {
	mu      sync.RWMutex
	entries map[K]expiringCacheEntry[V]
	order   []K
	ttl     time.Duration
	maxKeys int
}

func newExpiringCache[K comparable, V any](ttl time.Duration, maxKeys int) *expiringCache[K, V] {
	return &expiringCache[K, V]{
		entries: make(map[K]expiringCacheEntry[V], maxKeys),
		ttl:     ttl,
		maxKeys: maxKeys,
	}
}

func (cache *expiringCache[K, V]) get(key K) (V, bool) {
	cache.mu.RLock()
	entry, exists := cache.entries[key]
	cache.mu.RUnlock()
	if !exists {
		var zero V
		return zero, false
	}
	if time.Now().Before(entry.expiresAt) {
		return entry.value, true
	}
	cache.delete(key)
	var zero V
	return zero, false
}

func (cache *expiringCache[K, V]) set(key K, value V) {
	cache.mu.Lock()
	defer cache.mu.Unlock()
	entry := expiringCacheEntry[V]{value: value, expiresAt: time.Now().Add(cache.ttl)}
	if _, exists := cache.entries[key]; exists {
		cache.entries[key] = entry
		return
	}
	if len(cache.entries) >= cache.maxKeys && len(cache.order) > 0 {
		oldest := cache.order[0]
		cache.order = cache.order[1:]
		delete(cache.entries, oldest)
	}
	cache.entries[key] = entry
	cache.order = append(cache.order, key)
}

func (cache *expiringCache[K, V]) delete(key K) {
	cache.mu.Lock()
	defer cache.mu.Unlock()
	if _, exists := cache.entries[key]; !exists {
		return
	}
	delete(cache.entries, key)
	for index, current := range cache.order {
		if current == key {
			cache.order = append(cache.order[:index], cache.order[index+1:]...)
			break
		}
	}
}

func (cache *expiringCache[K, V]) deleteWhere(match func(K) bool) {
	cache.mu.Lock()
	defer cache.mu.Unlock()
	kept := make([]K, 0, len(cache.order))
	for _, key := range cache.order {
		if match(key) {
			delete(cache.entries, key)
			continue
		}
		kept = append(kept, key)
	}
	cache.order = kept
}

type graphPlanCacheKey struct {
	BaseID uint64
	Query  string
}

var graphPlans = newExpiringCache[graphPlanCacheKey, retrievalPlan](graphCacheTTL, graphCacheMaxKeys)

func graphCacheKey(baseID uint64, query string) graphPlanCacheKey {
	return graphPlanCacheKey{
		BaseID: baseID,
		Query:  strings.ToLower(strings.Join(strings.Fields(query), " ")),
	}
}

func graphCacheGet(baseID uint64, query string) (retrievalPlan, bool) {
	return graphPlans.get(graphCacheKey(baseID, query))
}

func graphCacheSet(baseID uint64, query string, plan retrievalPlan) {
	if plan.Error != "" {
		return
	}
	if len(plan.Queries) == 0 && len(plan.DocIDs) == 0 {
		return
	}
	graphPlans.set(graphCacheKey(baseID, query), plan)
}

func invalidateKeywordCache(baseID uint64) {
	if baseID == 0 {
		return
	}
	graphPlans.deleteWhere(func(key graphPlanCacheKey) bool {
		return key.BaseID == baseID
	})
	keywordCandidates.deleteWhere(func(key keywordCandidateCacheKey) bool {
		return key.BaseID == baseID
	})
}
