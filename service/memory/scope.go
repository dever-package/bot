package memory

import (
	"context"
	"fmt"
	"strings"

	deverjwt "github.com/shemic/dever/auth/jwt"

	memorymodel "github.com/dever-package/bot/model/memory"
)

func memoryMatchesScope(row memorymodel.Memory, request MemoryListRequest) bool {
	scope := strings.ToLower(strings.TrimSpace(request.Scope))
	switch scope {
	case memoryScopeAll:
		return true
	case memorymodel.ScopeGlobal:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeGlobal
	case memorymodel.ScopeAgent:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeAgent && strings.TrimSpace(row.AgentKey) == strings.TrimSpace(request.AgentKey)
	case memorymodel.ScopeSession:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeSession && request.SessionID > 0 && row.SessionID == request.SessionID
	case memorymodel.ScopeContext, memoryScopeCurrent, "":
		return memoryMatchesRequestContext(row, request)
	default:
		return memoryMatchesRequestContext(row, request)
	}
}

func memoryMatchesRequestContext(row memorymodel.Memory, request MemoryListRequest) bool {
	switch normalizeStoredMemoryScope(row) {
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(request.AgentKey) &&
			NormalizeContextKey(row.ContextKey, row.AgentKey) == NormalizeContextKey(request.ContextKey, request.AgentKey)
	case memorymodel.ScopeSession:
		return request.SessionID > 0 && row.SessionID == request.SessionID
	default:
		return false
	}
}

func resolveMemoryScope(scope string, contextKey string, agentKey string, sessionID uint64) string {
	if normalized := normalizeMemoryScope(scope); normalized != "" {
		return normalized
	}
	if strings.TrimSpace(contextKey) != "" {
		return memorymodel.ScopeContext
	}
	if strings.TrimSpace(agentKey) != "" {
		return memorymodel.ScopeAgent
	}
	if sessionID > 0 {
		return memorymodel.ScopeSession
	}
	return memorymodel.ScopeGlobal
}

func normalizeMemoryScope(scope string) string {
	switch strings.ToLower(strings.TrimSpace(scope)) {
	case memorymodel.ScopeGlobal, memorymodel.ScopeAgent, memorymodel.ScopeContext, memorymodel.ScopeSession:
		return strings.ToLower(strings.TrimSpace(scope))
	default:
		return ""
	}
}

func normalizeStoredMemoryScope(row memorymodel.Memory) string {
	return normalizeMemoryScope(row.Scope)
}

func normalizeMemorySource(source string) string {
	switch strings.ToLower(strings.TrimSpace(source)) {
	case memorymodel.SourceAuto, memorymodel.SourceLLM:
		return strings.ToLower(strings.TrimSpace(source))
	default:
		return memorymodel.SourceManual
	}
}

func normalizeMemoryKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "working", "episodic", "semantic", "procedural", "persona", "content":
		return strings.ToLower(strings.TrimSpace(kind))
	default:
		return ""
	}
}

func normalizeMemoryTags(tags []string) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(tags))
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		if tag == "" {
			continue
		}
		if _, exists := seen[tag]; exists {
			continue
		}
		seen[tag] = struct{}{}
		result = append(result, tag)
	}
	return result
}

func memoryStatusFilter(status string) int16 {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "disabled", "inactive", "archived", "2":
		return memorymodel.StatusDisabled
	case "all":
		return 0
	default:
		return memorymodel.StatusEnabled
	}
}

func clampMemoryImportance(value int) int {
	if value <= 0 {
		return 60
	}
	if value > 100 {
		return 100
	}
	return value
}

func clampMemoryConfidence(value float64) float64 {
	if value <= 0 {
		return 1
	}
	if value > 1 {
		return 1
	}
	return value
}

func currentMemoryOwner(ctx context.Context) (memoryOwner, error) {
	uid, ok := deverjwt.ActiveInt64(ctx)
	if !ok || uid <= 0 {
		return memoryOwner{}, fmt.Errorf("登录账号无效")
	}
	return memoryOwner{OwnerType: memorymodel.OwnerTypeAdmin, OwnerID: uint64(uid)}, nil
}
