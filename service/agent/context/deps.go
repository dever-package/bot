package agentcontext

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
	memoryservice "github.com/dever-package/bot/service/memory"
)

type Repository interface {
	ListActiveCallablePowers(ctx context.Context, excludedID uint64) []energonmodel.Power
	FindActiveTextPowerKey(ctx context.Context, powerID uint64) (string, bool)
	FindRuntimeConfig(ctx context.Context) agentmodel.RuntimeConfig
	ListActivePublicSettings(ctx context.Context, packID uint64) []agentmodel.Setting
	ListActiveAgentSettings(ctx context.Context, agentID uint64) []agentmodel.AgentSetting
	ListActiveSkillPackEntries(ctx context.Context, packID uint64) []agentskill.Entry
}

type Dependencies struct {
	Repo     Repository
	Gateway  energonservice.GatewayService
	Services Services
}

type Services struct {
	Knowledge KnowledgeService
	Memory    MemoryService
}

type KnowledgeService interface {
	AgentKnowledgeBases(ctx context.Context, agentID uint64) []agentknowledge.AgentKnowledgeBaseRuntime
}

type MemoryService interface {
	RuntimeMemoriesBySession(ctx context.Context, sessionID uint64, query string, limit int) []memoryservice.RuntimeMemory
	RuntimeMemories(ctx context.Context, req memoryservice.RuntimeRequest) []memoryservice.RuntimeMemory
}

type Assembler struct {
	repo      Repository
	gateway   energonservice.GatewayService
	knowledge KnowledgeService
	memory    MemoryService
	budget    Budget
	cache     *Cache
}

func NewAssembler(deps Dependencies) Assembler {
	services := deps.Services
	if services.Knowledge == nil {
		services.Knowledge = agentknowledge.NewService()
	}
	if services.Memory == nil {
		services.Memory = memoryservice.NewService()
	}
	return Assembler{
		repo:      deps.Repo,
		gateway:   deps.Gateway,
		knowledge: services.Knowledge,
		memory:    services.Memory,
		budget:    DefaultBudget(),
		cache:     defaultCache,
	}
}
