package assistant

import (
	"strings"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryScopeCurrent = "current"
	memoryScopeAll     = "all"
)

func resolveMemoryScope(scope string, contextKey string, agentKey string, sessionID uint64) string {
	if normalized := normalizeMemoryScope(scope, contextKey, agentKey, sessionID); normalized != "" {
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

func normalizeMemoryScope(scope string, contextKey string, agentKey string, sessionID uint64) string {
	switch strings.ToLower(strings.TrimSpace(scope)) {
	case memorymodel.ScopeGlobal:
		return memorymodel.ScopeGlobal
	case memorymodel.ScopeAgent:
		return memorymodel.ScopeAgent
	case memorymodel.ScopeContext:
		return memorymodel.ScopeContext
	case memorymodel.ScopeSession:
		return memorymodel.ScopeSession
	default:
		return ""
	}
}

func normalizeStoredMemoryScope(row memorymodel.Memory) string {
	switch strings.ToLower(strings.TrimSpace(row.Scope)) {
	case memorymodel.ScopeGlobal:
		return memorymodel.ScopeGlobal
	case memorymodel.ScopeAgent:
		return memorymodel.ScopeAgent
	case memorymodel.ScopeContext:
		return memorymodel.ScopeContext
	case memorymodel.ScopeSession:
		return memorymodel.ScopeSession
	default:
		return ""
	}
}

func displayMemoryScope(row memorymodel.Memory) string {
	if scope := normalizeStoredMemoryScope(row); scope != "" {
		return scope
	}
	return ""
}

func normalizeMemorySource(source string) string {
	switch strings.ToLower(strings.TrimSpace(source)) {
	case memorymodel.SourceAuto:
		return memorymodel.SourceAuto
	case memorymodel.SourceLLM:
		return memorymodel.SourceLLM
	default:
		return memorymodel.SourceManual
	}
}

func clampConfidence(value float64) float64 {
	if value <= 0 {
		return 1
	}
	if value > 1 {
		return 1
	}
	return value
}

func memoryMatchesScope(row memorymodel.Memory, req MemoryListRequest) bool {
	scope := strings.ToLower(strings.TrimSpace(req.Scope))
	switch scope {
	case memoryScopeAll:
		return true
	case memorymodel.ScopeGlobal:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeGlobal
	case memorymodel.ScopeAgent:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeAgent &&
			strings.TrimSpace(row.AgentKey) == strings.TrimSpace(req.AgentKey)
	case memorymodel.ScopeContext, memoryScopeCurrent, "":
		return memoryMatchesRequestContext(row, req)
	case memorymodel.ScopeSession:
		return normalizeStoredMemoryScope(row) == memorymodel.ScopeSession && row.SessionID > 0 && row.SessionID == req.SessionID
	default:
		return memoryMatchesRequestContext(row, req)
	}
}

func memoryMatchesRequestContext(row memorymodel.Memory, req MemoryListRequest) bool {
	scope := normalizeStoredMemoryScope(row)
	switch scope {
	case memorymodel.ScopeGlobal:
		return false
	case memorymodel.ScopeAgent:
		return false
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(req.AgentKey) &&
			normalizeContextKey(row.ContextKey, row.AgentKey) == normalizeContextKey(req.ContextKey, req.AgentKey)
	case memorymodel.ScopeSession:
		return req.SessionID > 0 && row.SessionID == req.SessionID
	}

	return false
}

func memoryMatchesRuntimeSession(row memorymodel.Memory, session assistantmodel.Session) bool {
	scope := normalizeStoredMemoryScope(row)
	switch scope {
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(session.AgentKey) &&
			normalizeContextKey(row.ContextKey, row.AgentKey) == normalizeContextKey(session.ContextKey, session.AgentKey)
	case memorymodel.ScopeSession:
		return row.SessionID > 0 && row.SessionID == session.ID
	default:
		return false
	}
}
