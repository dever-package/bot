package memory

import (
	"context"
	"sort"
	"strings"
	"unicode"

	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	defaultRuntimeMemoryLimit           = 20
	maxRuntimeMemoryLimit               = 50
	runtimeMemoryCoreCandidateLimit     = 20
	runtimeMemoryPriorityCandidateLimit = 80
	runtimeMemoryRecentCandidateLimit   = 40
	runtimeMemoryKeywordCandidateLimit  = 200
	runtimeMemoryCoreLimit              = 3
	runtimeMemorySearchTermLimit        = 8
	runtimeMemoryMinRelevance           = 0.25
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
	model := memorymodel.NewMemoryModel()
	rows := make([]*memorymodel.Memory, 0, runtimeMemoryCoreCandidateLimit+runtimeMemoryPriorityCandidateLimit+runtimeMemoryRecentCandidateLimit)
	coreFilter := cloneRuntimeMemoryFilter(filter)
	coreFilter["kind"] = []any{"persona", "procedural"}
	coreFilter["importance"] = map[string]any{"gte": 85}
	coreFilter["confidence"] = map[string]any{"gte": 0.8}
	rows = appendUniqueRuntimeMemories(rows, model.Select(ctx, coreFilter, map[string]any{
		"order": "main.importance desc,main.id desc", "limit": runtimeMemoryCoreCandidateLimit,
	}))
	rows = appendUniqueRuntimeMemories(rows, model.Select(ctx, filter, map[string]any{
		"order": "main.importance desc,main.id desc", "limit": runtimeMemoryPriorityCandidateLimit,
	}))
	rows = appendUniqueRuntimeMemories(rows, model.Select(ctx, filter, map[string]any{
		"order": "main.id desc", "limit": runtimeMemoryRecentCandidateLimit,
	}))
	if keywordFilter := runtimeMemoryKeywordFilter(filter, req.Query); len(keywordFilter) > 0 {
		rows = appendUniqueRuntimeMemories(rows, model.Select(ctx, keywordFilter, map[string]any{
			"order": "main.importance desc,main.id desc", "limit": runtimeMemoryKeywordCandidateLimit,
		}))
	}
	return rankRuntimeMemoryRows(rows, req, limit)
}

func appendUniqueRuntimeMemories(current []*memorymodel.Memory, rows []*memorymodel.Memory) []*memorymodel.Memory {
	seen := make(map[uint64]struct{}, len(current)+len(rows))
	for _, row := range current {
		if row != nil {
			seen[row.ID] = struct{}{}
		}
	}
	for _, row := range rows {
		if row == nil {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		current = append(current, row)
	}
	return current
}

func cloneRuntimeMemoryFilter(filter map[string]any) map[string]any {
	result := make(map[string]any, len(filter))
	for key, value := range filter {
		result[key] = value
	}
	return result
}

func runtimeMemoryKeywordFilter(filter map[string]any, query string) map[string]any {
	terms := runtimeMemorySearchTerms(query)
	if len(terms) == 0 {
		return nil
	}
	keywordConditions := make([]any, 0, len(terms)*3)
	for _, term := range terms {
		pattern := "%" + term + "%"
		for _, field := range []string{"main.title", "main.content", "main.tags"} {
			keywordConditions = append(keywordConditions, map[string]any{field: map[string]any{"LIKE": pattern}})
		}
	}
	result := cloneRuntimeMemoryFilter(filter)
	scopeConditions := result["or"]
	delete(result, "or")
	result["and"] = []any{
		map[string]any{"or": scopeConditions},
		map[string]any{"or": keywordConditions},
	}
	return result
}

func runtimeMemorySearchTerms(query string) []string {
	tokens := strings.FieldsFunc(strings.TrimSpace(query), func(current rune) bool {
		return !unicode.IsLetter(current) && !unicode.IsDigit(current)
	})
	result := make([]string, 0, runtimeMemorySearchTermLimit)
	seen := map[string]struct{}{}
	add := func(value string) bool {
		value = strings.TrimSpace(value)
		if value == "" {
			return false
		}
		if _, exists := seen[value]; exists {
			return false
		}
		seen[value] = struct{}{}
		result = append(result, value)
		return len(result) >= runtimeMemorySearchTermLimit
	}
	for _, token := range tokens {
		runes := []rune(token)
		if add(token) {
			break
		}
		if len(runes) <= 2 || !containsHanRune(runes) {
			continue
		}
		for start := 0; start+2 <= len(runes); start++ {
			if add(string(runes[start : start+2])) {
				break
			}
		}
		if len(result) >= runtimeMemorySearchTermLimit {
			break
		}
	}
	return result
}

func containsHanRune(runes []rune) bool {
	for _, current := range runes {
		if unicode.Is(unicode.Han, current) {
			return true
		}
	}
	return false
}

func runtimeMemoryFilter(req RuntimeRequest) map[string]any {
	filter := map[string]any{
		"owner_type": strings.TrimSpace(req.OwnerType),
		"owner_id":   req.OwnerID, "status": memorymodel.StatusEnabled,
	}
	conditions := make([]any, 0, 5)
	if req.IncludeGlobal {
		conditions = append(conditions, memoryScopeCondition(map[string]any{"main.scope": memorymodel.ScopeGlobal}))
	}
	agentKey := strings.TrimSpace(req.AgentKey)
	if req.IncludeAgent && agentKey != "" {
		conditions = append(conditions, memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeAgent, "main.agent_key": agentKey,
		}))
	}
	if agentKey != "" {
		conditions = append(conditions, memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeContext, "main.agent_key": agentKey,
			"main.context_key": NormalizeContextKey(req.ContextKey, agentKey),
		}))
	}
	if req.SessionID > 0 {
		conditions = append(conditions, memoryScopeCondition(map[string]any{
			"main.scope": memorymodel.ScopeSession, "main.session_id": req.SessionID,
		}))
	}
	if req.IncludeUnscoped {
		conditions = append(conditions, memoryScopeCondition(map[string]any{"main.scope": ""}))
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
		if row == nil || !memoryMatchesRuntimeRequest(*row, req) ||
			memoryFieldsContainSensitiveData(row.Title, row.Content, []string{row.Tags}) {
			continue
		}
		row.Content = limitMemoryText(row.Content, memoryContentLimit)
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
	score := float64(clampMemoryImportance(row.Importance)) / 100 * 0.35
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
	tags := memoryTextScore(query, limitMemoryText(row.Tags, memoryTagCount*memoryTagLimit))
	return title*0.3 + content*0.6 + tags*0.1
}

func isCoreRuntimeMemory(row memorymodel.Memory) bool {
	kind := normalizeMemoryKind(row.Kind)
	return (kind == "persona" || kind == "procedural") &&
		clampMemoryImportance(row.Importance) >= 85 && runtimeMemoryConfidence(row.Confidence) >= 0.8
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
	switch normalizeMemoryKind(kind) {
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
