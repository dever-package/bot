package agentcontext

import (
	"sync"
	"time"
)

var defaultCache = NewCache()

type Cache struct {
	mu   sync.Mutex
	rows map[string]cacheEntry
}

type cacheEntry struct {
	value     any
	expiresAt time.Time
}

func NewCache() *Cache {
	return &Cache{rows: map[string]cacheEntry{}}
}

func (c *Cache) Get(key string) (any, bool) {
	if c == nil || key == "" {
		return nil, false
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	entry, exists := c.rows[key]
	if !exists {
		return nil, false
	}
	if time.Now().After(entry.expiresAt) {
		delete(c.rows, key)
		return nil, false
	}
	return entry.value, true
}

func (c *Cache) Set(key string, value any, ttl time.Duration) {
	if c == nil || key == "" || ttl <= 0 {
		return
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	c.rows[key] = cacheEntry{value: value, expiresAt: time.Now().Add(ttl)}
}
