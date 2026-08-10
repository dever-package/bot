package team

import (
	"sync"

	teammodel "github.com/dever-package/bot/model/team"
)

const releaseGraphCacheLimit = 128

type releaseGraphCacheKey struct {
	ReleaseID uint64
	Version   int
}

type releaseGraphStore struct {
	mu      sync.RWMutex
	entries map[releaseGraphCacheKey]runtimeGraph
	order   []releaseGraphCacheKey
}

var immutableReleaseGraphs = releaseGraphStore{
	entries: map[releaseGraphCacheKey]runtimeGraph{},
}

func cachedRuntimeGraph(release teammodel.TeamRelease, load func() (runtimeGraph, error)) (runtimeGraph, error) {
	if release.ID == 0 {
		return load()
	}
	key := releaseGraphCacheKey{ReleaseID: release.ID, Version: release.Version}
	if graph, exists := immutableReleaseGraphs.get(key); exists {
		return graph, nil
	}

	graph, err := load()
	if err != nil {
		return runtimeGraph{}, err
	}
	return immutableReleaseGraphs.putIfAbsent(key, graph), nil
}

func (cache *releaseGraphStore) get(key releaseGraphCacheKey) (runtimeGraph, bool) {
	cache.mu.RLock()
	graph, exists := cache.entries[key]
	cache.mu.RUnlock()
	return graph, exists
}

func (cache *releaseGraphStore) putIfAbsent(key releaseGraphCacheKey, graph runtimeGraph) runtimeGraph {
	cache.mu.Lock()
	defer cache.mu.Unlock()
	if current, exists := cache.entries[key]; exists {
		return current
	}
	if len(cache.entries) >= releaseGraphCacheLimit && len(cache.order) > 0 {
		oldest := cache.order[0]
		cache.order = cache.order[1:]
		delete(cache.entries, oldest)
	}
	cache.entries[key] = graph
	cache.order = append(cache.order, key)
	return graph
}
