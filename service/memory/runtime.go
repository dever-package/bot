package memory

import (
	"context"
	"sort"
	"strings"
	"unicode"

	agentmodel "github.com/dever-package/bot/model/agent"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	defaultRuntimeMemoryLimit   = 20
	maxRuntimeMemoryLimit       = 50
	runtimeMemoryCandidateLimit = 300
	runtimeMemoryCoreLimit      = 3
	runtimeMemoryMinRelevance   = 0.25
)

type RuntimeRequest struct {
	OwnerType       string
	OwnerID         uint64
	AgentKey        string
	ContextKey      string
	SessionID       uint64
	Query           string
	Limit           int
	IncludeGlobal   bool
	IncludeAgent    bool
	IncludeUnscoped bool
}

type RuntimeMemory struct {
	ID         uint64 `json:"id"`
	Kind       string `json:"kind"`
	Title      string `json:"title"`
	Content    string `json:"content"`
	Tags       string `json:"tags"`
	Importance int    `json:"importance"`
	Scope      string `json:"scope"`
}

type scoredRuntimeMemory struct {
	row       *memorymodel.Memory
	score     float64
	relevance float64
	core      bool
}

func (Service) RuntimeMemoriesBySession(ctx context.Context, sessionID uint64, query string, limit int) []RuntimeMemory {
	if sessionID == 0 {
		return []RuntimeMemory{}
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return []RuntimeMemory{}
	}
	return NewService().RuntimeMemories(ctx, RuntimeRequest{
		OwnerType:     session.OwnerType,
		OwnerID:       session.OwnerID,
		AgentKey:      session.AgentKey,
		ContextKey:    session.ContextKey,
		SessionID:     session.ID,
		Query:         query,
		Limit:         limit,
		IncludeGlobal: true,
		IncludeAgent:  true,
	})
}

func (s Service) RuntimeMemories(ctx context.Context, req RuntimeRequest) []RuntimeMemory {
	rows := s.RuntimeRows(ctx, req)
	result := make([]RuntimeMemory, 0, len(rows))
	for _, row := range rows {
		result = append(result, RuntimeMemory{
			ID:         row.ID,
			Kind:       row.Kind,
			Title:      row.Title,
			Content:    row.Content,
			Tags:       row.Tags,
			Importance: row.Importance,
			Scope:      displayRuntimeMemoryScope(*row),
		})
	}
	return result
}

func (Service) RuntimeRows(ctx context.Context, req RuntimeRequest) []*memorymodel.Memory {
	limit := clampRuntimeMemoryLimit(req.Limit)
	if limit <= 0 || strings.TrimSpace(req.OwnerType) == "" || req.OwnerID == 0 {
		return []*memorymodel.Memory{}
	}
	filter := runtimeMemoryFilter(req)
	if len(filter) == 0 {
		return []*memorymodel.Memory{}
	}
	rows := memorymodel.NewMemoryModel().Select(
		ctx,
		filter,
		map[string]any{
			"order": "main.importance desc,main.id desc",
			"limit": runtimeMemoryCandidateLimit,
		},
	)
	return rankRuntimeMemoryRows(rows, req, limit)
}

func runtimeMemoryFilter(req RuntimeRequest) map[string]any {
	filter := map[string]any{
		"owner_type": strings.TrimSpace(req.OwnerType),
		"owner_id":   req.OwnerID, "status": memorymodel.StatusEnabled,
	}
	conditions := make([]any, 0, 5)
	if req.IncludeGlobal {
		conditions = append(conditions, map[string]any{"main.scope": memorymodel.ScopeGlobal})
	}
	agentKey := strings.TrimSpace(req.AgentKey)
	if req.IncludeAgent && agentKey != "" {
		conditions = append(conditions, map[string]any{
			"main.scope": memorymodel.ScopeAgent, "main.agent_key": agentKey,
		})
	}
	if agentKey != "" {
		conditions = append(conditions, map[string]any{
			"main.scope": memorymodel.ScopeContext, "main.agent_key": agentKey,
			"main.context_key": NormalizeContextKey(req.ContextKey, agentKey),
		})
	}
	if req.SessionID > 0 {
		conditions = append(conditions, map[string]any{
			"main.scope": memorymodel.ScopeSession, "main.session_id": req.SessionID,
		})
	}
	if req.IncludeUnscoped {
		conditions = append(conditions, map[string]any{"main.scope": ""})
	}
	if len(conditions) == 0 {
		return nil
	}
	filter["or"] = conditions
	return filter
}

func rankRuntimeMemoryRows(rows []*memorymodel.Memory, req RuntimeRequest, limit int) []*memorymodel.Memory {
	if limit <= 0 {
		return []*memorymodel.Memory{}
	}
	query := strings.TrimSpace(req.Query)
	core := make([]scoredRuntimeMemory, 0, runtimeMemoryCoreLimit)
	relevant := make([]scoredRuntimeMemory, 0, len(rows))
	for _, row := range rows {
		if row == nil || !memoryMatchesRuntimeRequest(*row, req) {
			continue
		}
		item := scoredRuntimeMemory{
			row: row, score: runtimeMemoryScore(*row, query),
			relevance: runtimeMemoryRelevance(*row, query),
			core:      isCoreRuntimeMemory(*row),
		}
		if item.core {
			core = append(core, item)
		} else if query == "" || item.relevance >= runtimeMemoryMinRelevance {
			relevant = append(relevant, item)
		}
	}
	sortRuntimeMemories(core)
	sortRuntimeMemories(relevant)
	if len(core) > runtimeMemoryCoreLimit {
		core = core[:runtimeMemoryCoreLimit]
	}
	selected := append(core, relevant...)
	if len(selected) > limit {
		selected = selected[:limit]
	}
	result := make([]*memorymodel.Memory, 0, len(selected))
	for _, item := range selected {
		result = append(result, item.row)
	}
	return result
}

func sortRuntimeMemories(rows []scoredRuntimeMemory) {
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].score == rows[j].score {
			return rows[i].row.ID > rows[j].row.ID
		}
		return rows[i].score > rows[j].score
	})
}

func memoryMatchesRuntimeRequest(row memorymodel.Memory, req RuntimeRequest) bool {
	switch normalizeRuntimeMemoryScope(row) {
	case memorymodel.ScopeGlobal:
		return req.IncludeGlobal
	case memorymodel.ScopeAgent:
		return req.IncludeAgent && strings.TrimSpace(row.AgentKey) == strings.TrimSpace(req.AgentKey)
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(req.AgentKey) &&
			NormalizeContextKey(row.ContextKey, row.AgentKey) == NormalizeContextKey(req.ContextKey, req.AgentKey)
	case memorymodel.ScopeSession:
		return req.SessionID > 0 && row.SessionID > 0 && row.SessionID == req.SessionID
	default:
		return req.IncludeUnscoped && strings.TrimSpace(row.Scope) == ""
	}
}

func runtimeMemoryScore(row memorymodel.Memory, query string) float64 {
	score := float64(clampRuntimeMemoryImportance(row.Importance)) / 100 * 0.35
	score += runtimeMemoryConfidence(row.Confidence) * 0.2
	score += runtimeMemoryKindBoost(row.Kind)
	switch normalizeRuntimeMemoryScope(row) {
	case memorymodel.ScopeSession:
		score += 0.12
	case memorymodel.ScopeContext:
		score += 0.08
	}
	score += runtimeMemoryRelevance(row, query) * 0.54
	return score
}

func runtimeMemoryRelevance(row memorymodel.Memory, query string) float64 {
	query = NormalizeComparableText(query)
	if query == "" {
		return 1
	}
	title := memoryTextScore(query, row.Title)
	content := memoryTextScore(query, row.Content)
	tags := memoryTextScore(query, row.Tags)
	return title*0.3 + content*0.6 + tags*0.1
}

func isCoreRuntimeMemory(row memorymodel.Memory) bool {
	kind := normalizeRuntimeMemoryKind(row.Kind)
	return (kind == "persona" || kind == "procedural") &&
		clampRuntimeMemoryImportance(row.Importance) >= 85 && runtimeMemoryConfidence(row.Confidence) >= 0.8
}

func memoryTextScore(query string, text string) float64 {
	current := NormalizeComparableText(text)
	if query == "" || current == "" {
		return 0
	}
	if query == current || strings.Contains(current, query) || strings.Contains(query, current) {
		return 1
	}
	return TextSimilarity(query, current)
}

func runtimeMemoryConfidence(value float64) float64 {
	if value <= 0 {
		return 0.5
	}
	if value > 1 {
		return 1
	}
	return value
}

func runtimeMemoryKindBoost(kind string) float64 {
	switch normalizeRuntimeMemoryKind(kind) {
	case "procedural":
		return 0.12
	case "persona":
		return 0.1
	case "semantic":
		return 0.06
	default:
		return 0.03
	}
}

func normalizeRuntimeMemoryScope(row memorymodel.Memory) string {
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

func displayRuntimeMemoryScope(row memorymodel.Memory) string {
	return normalizeRuntimeMemoryScope(row)
}

func normalizeRuntimeMemoryKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "working", "episodic", "semantic", "procedural", "persona", "content":
		return strings.ToLower(strings.TrimSpace(kind))
	default:
		return ""
	}
}

func clampRuntimeMemoryImportance(value int) int {
	if value <= 0 {
		return 60
	}
	if value > 100 {
		return 100
	}
	return value
}

func clampRuntimeMemoryLimit(value int) int {
	if value <= 0 {
		value = defaultRuntimeMemoryLimit
	}
	if value > maxRuntimeMemoryLimit {
		return maxRuntimeMemoryLimit
	}
	return value
}

func NormalizeContextKey(contextKey string, agentKey string) string {
	contextKey = strings.TrimSpace(contextKey)
	if contextKey != "" {
		return limitRuntimeMemoryText(contextKey, 128)
	}
	agentKey = strings.TrimSpace(agentKey)
	if agentKey != "" {
		return limitRuntimeMemoryText("agent:"+agentKey, 128)
	}
	return "agent"
}

func limitRuntimeMemoryText(text string, limit int) string {
	text = strings.TrimSpace(text)
	if limit <= 0 {
		return text
	}
	runes := []rune(text)
	if len(runes) <= limit {
		return text
	}
	return strings.TrimSpace(string(runes[:limit]))
}

func NormalizeComparableText(text string) string {
	var builder strings.Builder
	for _, current := range strings.ToLower(text) {
		if unicode.IsLetter(current) || unicode.IsDigit(current) {
			builder.WriteRune(current)
		}
	}
	return builder.String()
}

func TextSimilar(left string, right string) bool {
	left = NormalizeComparableText(left)
	right = NormalizeComparableText(right)
	if left == "" || right == "" {
		return false
	}
	if left == right {
		return true
	}
	if len(left) >= 16 && strings.Contains(right, left) {
		return true
	}
	if len(right) >= 16 && strings.Contains(left, right) {
		return true
	}
	return TextSimilarity(left, right) >= 0.82
}

func TextSimilarity(left string, right string) float64 {
	left = NormalizeComparableText(left)
	right = NormalizeComparableText(right)
	leftSet := bigramSet(left)
	rightSet := bigramSet(right)
	if len(leftSet) == 0 || len(rightSet) == 0 {
		return 0
	}
	intersection := 0
	for key := range leftSet {
		if rightSet[key] {
			intersection++
		}
	}
	return float64(intersection*2) / float64(len(leftSet)+len(rightSet))
}

func bigramSet(text string) map[string]bool {
	runes := []rune(text)
	if len(runes) < 2 {
		if text == "" {
			return map[string]bool{}
		}
		return map[string]bool{text: true}
	}
	result := make(map[string]bool, len(runes)-1)
	for i := 0; i < len(runes)-1; i++ {
		result[string(runes[i:i+2])] = true
	}
	return result
}
