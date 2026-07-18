package memory

import (
	"context"
	"fmt"
	"strings"
	"unicode"

	deverjwt "github.com/shemic/dever/auth/jwt"

	memorymodel "github.com/dever-package/bot/model/memory"
)

func memoryListScopeConditions(request MemoryListRequest) []any {
	scope := strings.ToLower(strings.TrimSpace(request.Scope))
	switch scope {
	case memorymodel.ScopeGlobal:
		return []any{memoryScopeCondition(map[string]any{"main.scope": memorymodel.ScopeGlobal})}
	case memorymodel.ScopeAgent:
		return []any{memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeAgent, "main.agent_key": strings.TrimSpace(request.AgentKey),
		})}
	case memorymodel.ScopeSession:
		if request.SessionID == 0 {
			return []any{memoryScopeCondition(map[string]any{"main.id": uint64(0)})}
		}
		return []any{memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeSession, "main.session_id": request.SessionID,
		})}
	case memorymodel.ScopeContext, memoryScopeCurrent, "":
		return currentMemoryScopeConditions(request)
	default:
		return currentMemoryScopeConditions(request)
	}
}

func currentMemoryScopeConditions(request MemoryListRequest) []any {
	agentKey := strings.TrimSpace(request.AgentKey)
	conditions := []any{memoryScopeCondition(map[string]any{
		"main.scope":       memorymodel.ScopeContext,
		"main.agent_key":   agentKey,
		"main.context_key": NormalizeContextKey(request.ContextKey, agentKey),
	})}
	if request.SessionID > 0 {
		conditions = append(conditions, memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeSession, "main.session_id": request.SessionID,
		}))
	}
	return conditions
}

func memoryScopeCondition(fields map[string]any) any {
	return map[string]any{"and": fields}
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

func normalizeMemoryKey(value string) string {
	var builder strings.Builder
	for _, current := range strings.ToLower(strings.TrimSpace(value)) {
		if unicode.IsLetter(current) && current <= unicode.MaxASCII || unicode.IsDigit(current) || current == '.' || current == '_' || current == '-' {
			builder.WriteRune(current)
		}
	}
	return limitMemoryText(strings.Trim(builder.String(), ".-_"), 160)
}

func memoryScopeValues(scope string, contextKey string, agentKey string, sessionID uint64) map[string]any {
	agentKey = strings.TrimSpace(agentKey)
	values := map[string]any{"agent_key": "", "context_key": "", "session_id": uint64(0)}
	switch scope {
	case memorymodel.ScopeAgent:
		values["agent_key"] = agentKey
	case memorymodel.ScopeContext:
		values["agent_key"] = agentKey
		values["context_key"] = NormalizeContextKey(contextKey, agentKey)
	case memorymodel.ScopeSession:
		values["agent_key"] = agentKey
		values["context_key"] = NormalizeContextKey(contextKey, agentKey)
		values["session_id"] = sessionID
	}
	return values
}

func memoryScopeFilter(owner memoryOwner, scope string, values map[string]any) map[string]any {
	filter := map[string]any{
		"owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
		"scope": scope, "status": memorymodel.StatusEnabled,
	}
	for _, field := range []string{"agent_key", "context_key", "session_id"} {
		filter[field] = values[field]
	}
	return filter
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
	result := make([]string, 0, min(len(tags), memoryTagCount))
	for _, tag := range tags {
		tag = limitMemoryText(tag, memoryTagLimit)
		if tag == "" {
			continue
		}
		if _, exists := seen[tag]; exists {
			continue
		}
		seen[tag] = struct{}{}
		result = append(result, tag)
		if len(result) >= memoryTagCount {
			break
		}
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
