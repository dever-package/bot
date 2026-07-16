package tool

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
)

const (
	powerConfigConcurrency = 4
	mountPreparationTTL    = 2 * time.Minute
	mountPreparationMax    = 256
	mountWarmTimeout       = 30 * time.Second
)

type powerMountCandidate struct {
	row    energonmodel.Power
	config energonservice.PowerParamConfig
	err    error
}

type mountPreparation struct {
	knowledgeBases  []knowledgeservice.KnowledgeBaseRuntime
	skillEntries    []agentskill.Entry
	skillConfig     agentmodel.RuntimeConfig
	powerCandidates []powerMountCandidate
}

type cachedMountPreparation struct {
	value     mountPreparation
	expiresAt time.Time
}

type mountPreparationFlight struct {
	done  chan struct{}
	value mountPreparation
	err   error
}

var mountPreparationCache = struct {
	sync.Mutex
	values  map[string]cachedMountPreparation
	flights map[string]*mountPreparationFlight
}{
	values:  map[string]cachedMountPreparation{},
	flights: map[string]*mountPreparationFlight{},
}

var mountWarmExecutor = runtimeasync.NewExecutor(runtimeasync.ExecutorConfig{
	Concurrency: 4,
	QueueSize:   64,
})

// WarmMount overlaps read-only tool metadata loading with chat context
// assembly. Mount still creates a fresh registry and binds request references.
func WarmMount(ctx context.Context, request MountRequest) {
	_, _ = prepareMount(ctx, request)
}

// WarmMountAsync detaches read-only metadata warming from the HTTP request.
// The durable worker may outlive that request and should still reuse the
// preparation result instead of loading knowledge, skills and powers again.
func WarmMountAsync(request MountRequest) {
	mountWarmExecutor.Submit(mountPreparationKey(request.Agent), "预热智能体工具", func() {
		ctx, cancel := context.WithTimeout(context.Background(), mountWarmTimeout)
		defer cancel()
		WarmMount(ctx, request)
	})
}

func prepareMount(ctx context.Context, request MountRequest) (mountPreparation, error) {
	cacheKey := mountPreparationKey(request.Agent)
	for {
		if prepared, exists := loadMountPreparation(cacheKey); exists {
			return prepared, nil
		}
		flight, owner := startMountPreparation(cacheKey)
		if owner {
			prepared, err := loadMountPreparationData(ctx, request)
			finishMountPreparation(cacheKey, flight, prepared, err, err == nil && ctx.Err() == nil && mountPreparationReusable(prepared))
			return prepared, err
		}
		select {
		case <-flight.done:
			if flight.err != nil && ctx.Err() == nil &&
				(errors.Is(flight.err, context.Canceled) || errors.Is(flight.err, context.DeadlineExceeded)) {
				continue
			}
			return cloneMountPreparation(flight.value), flight.err
		case <-ctx.Done():
			return mountPreparation{}, ctx.Err()
		}
	}
}

func loadMountPreparationData(ctx context.Context, request MountRequest) (mountPreparation, error) {
	prepared := mountPreparation{}
	var group runtimeasync.Group
	if request.Agent.KnowledgeCateID > 0 {
		group.Go("读取智能体知识库", func() error {
			prepared.knowledgeBases = knowledgeservice.NewService().KnowledgeBasesByCate(ctx, request.Agent.KnowledgeCateID)
			return nil
		})
	}
	if request.Agent.SkillPackID > 0 {
		group.Go("读取智能体技能方案", func() error {
			prepared.skillEntries = agentskill.EntriesByPack(ctx, request.Agent.SkillPackID)
			prepared.skillConfig = runtimeConfig(ctx)
			return nil
		})
	}
	if request.Agent.PowerCateID > 0 {
		group.Go("读取智能体工具能力", func() (err error) {
			prepared.powerCandidates, err = loadPowerCandidates(ctx, request)
			return err
		})
	}
	if err := group.Wait(); err != nil {
		return mountPreparation{}, err
	}
	if request.Agent.KnowledgeCateID > 0 && len(prepared.knowledgeBases) == 0 {
		return mountPreparation{}, fmt.Errorf("智能体知识库分类 %d 没有可用知识库", request.Agent.KnowledgeCateID)
	}
	return prepared, nil
}

func mountPreparationKey(agent agentmodel.Agent) string {
	return fmt.Sprintf("%d:%d:%d:%d:%d", agent.ID, agent.LLMPowerID, agent.PowerCateID, agent.KnowledgeCateID, agent.SkillPackID)
}

func mountPreparationReusable(prepared mountPreparation) bool {
	for _, candidate := range prepared.powerCandidates {
		if candidate.err != nil {
			return false
		}
	}
	return true
}

func loadMountPreparation(key string) (mountPreparation, bool) {
	mountPreparationCache.Lock()
	entry, exists := mountPreparationCache.values[key]
	if exists && time.Now().After(entry.expiresAt) {
		delete(mountPreparationCache.values, key)
		exists = false
	}
	mountPreparationCache.Unlock()
	if !exists {
		return mountPreparation{}, false
	}
	return cloneMountPreparation(entry.value), true
}

func startMountPreparation(key string) (*mountPreparationFlight, bool) {
	mountPreparationCache.Lock()
	defer mountPreparationCache.Unlock()
	if flight, exists := mountPreparationCache.flights[key]; exists {
		return flight, false
	}
	flight := &mountPreparationFlight{done: make(chan struct{})}
	mountPreparationCache.flights[key] = flight
	return flight, true
}

func finishMountPreparation(key string, flight *mountPreparationFlight, prepared mountPreparation, err error, reusable bool) {
	now := time.Now()
	mountPreparationCache.Lock()
	defer mountPreparationCache.Unlock()
	if reusable && len(mountPreparationCache.values) >= mountPreparationMax {
		for currentKey, entry := range mountPreparationCache.values {
			if now.After(entry.expiresAt) {
				delete(mountPreparationCache.values, currentKey)
			}
		}
	}
	if reusable && len(mountPreparationCache.values) >= mountPreparationMax {
		for currentKey := range mountPreparationCache.values {
			delete(mountPreparationCache.values, currentKey)
			break
		}
	}
	if reusable {
		mountPreparationCache.values[key] = cachedMountPreparation{
			value:     cloneMountPreparation(prepared),
			expiresAt: now.Add(mountPreparationTTL),
		}
	}
	if current, exists := mountPreparationCache.flights[key]; exists && current == flight {
		flight.value = cloneMountPreparation(prepared)
		flight.err = err
		delete(mountPreparationCache.flights, key)
		close(flight.done)
	}
}

func cloneMountPreparation(source mountPreparation) mountPreparation {
	result := source
	result.knowledgeBases = append([]knowledgeservice.KnowledgeBaseRuntime(nil), source.knowledgeBases...)
	result.skillEntries = make([]agentskill.Entry, len(source.skillEntries))
	for index, entry := range source.skillEntries {
		entry.Triggers = append([]string(nil), entry.Triggers...)
		entry.Domains = append([]string(nil), entry.Domains...)
		entry.Targets = append([]string(nil), entry.Targets...)
		result.skillEntries[index] = entry
	}
	result.powerCandidates = make([]powerMountCandidate, len(source.powerCandidates))
	for index, candidate := range source.powerCandidates {
		candidate.config.Sources = append([]energonservice.PowerSource(nil), candidate.config.Sources...)
		candidate.config.Params = append([]energonservice.PowerParam(nil), candidate.config.Params...)
		for paramIndex := range candidate.config.Params {
			candidate.config.Params[paramIndex].Options = append(
				[]energonservice.PowerParamOption(nil),
				candidate.config.Params[paramIndex].Options...,
			)
		}
		result.powerCandidates[index] = candidate
	}
	return result
}

func loadPowerCandidates(ctx context.Context, request MountRequest) ([]powerMountCandidate, error) {
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{
		"cate_id": request.Agent.PowerCateID,
		"status":  1,
	}, map[string]any{"order": "main.id asc"})
	candidates := make([]powerMountCandidate, 0, len(rows))
	for _, row := range rows {
		if row == nil || row.ID == request.Agent.LLMPowerID || strings.EqualFold(strings.TrimSpace(row.Kind), "embeddings") {
			continue
		}
		candidates = append(candidates, powerMountCandidate{row: *row})
	}
	if err := loadPowerConfigs(ctx, request.Gateway, candidates); err != nil {
		return nil, err
	}
	return candidates, nil
}

func loadPowerConfigs(ctx context.Context, gateway energonservice.GatewayService, candidates []powerMountCandidate) error {
	if len(candidates) == 0 {
		return nil
	}
	limit := make(chan struct{}, powerConfigConcurrency)
	var group runtimeasync.Group
	for index := range candidates {
		current := index
		group.Go("读取工具能力参数", func() error {
			select {
			case limit <- struct{}{}:
				defer func() { <-limit }()
			case <-ctx.Done():
				candidates[current].err = ctx.Err()
				return nil
			}
			candidates[current].config, candidates[current].err = gateway.PowerParamConfig(
				ctx,
				candidates[current].row.Key,
				0,
			)
			return nil
		})
	}
	return group.Wait()
}
