package knowledge

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	agentprompt "my/package/bot/service/agent/prompt"
)

func trimText(value any) string {
	return util.ToStringTrimmed(value)
}

func normalizeCollection(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return defaultQdrantCollection()
	}
	return value
}

func knowledgeCollectionName(cateID uint64) string {
	if cateID == 0 {
		cateID = agentmodel.DefaultKnowledgeCateID
	}
	return fmt.Sprintf("%s_%d", agentmodel.DefaultKnowledgeCollectionPrefix, cateID)
}

func isConceptGraphEnabled(value int16) bool {
	return value == 1
}

func countInt(value int64) int {
	if value <= 0 {
		return 0
	}
	return int(value)
}

func normalizeNodeMaxLength(value any) int {
	size := util.ToIntDefault(value, defaultNodeMaxLength)
	if size < 200 {
		return 200
	}
	if size > 4000 {
		return 4000
	}
	return size
}

func normalizeNodeSplitOverlap(value any, maxLength int) int {
	overlap := util.ToIntDefault(value, defaultNodeOverlap)
	if overlap < 0 {
		return 0
	}
	limit := maxLength / 2
	if overlap > limit {
		return limit
	}
	return overlap
}

func normalizeRetrieveLimit(value any) int {
	limit := util.ToIntDefault(value, defaultRetrieveLimit)
	if limit <= 0 {
		return defaultRetrieveLimit
	}
	if limit > 50 {
		return 50
	}
	return limit
}

func normalizeScoreThreshold(value any) float64 {
	score := floatValue(value)
	if score < 0 {
		return 0
	}
	if score > 1 {
		return 1
	}
	if score == 0 {
		return defaultScoreThreshold
	}
	return score
}

func normalizeOverrideScoreThreshold(value any, fallback float64) float64 {
	score := floatValue(value)
	if score <= 0 {
		return fallback
	}
	if score > 1 {
		return 1
	}
	return score
}

func normalizeMaxContextChars(value any) int {
	chars := util.ToIntDefault(value, defaultMaxContextChars)
	if chars <= 0 {
		return defaultMaxContextChars
	}
	if chars < 1000 {
		return 1000
	}
	if chars > 50000 {
		return 50000
	}
	return chars
}

func normalizeIndexStatus(value any) string {
	switch strings.ToLower(strings.TrimSpace(util.ToString(value))) {
	case "running":
		return "running"
	case "success":
		return "success"
	case "failed", "fail":
		return "failed"
	default:
		return "pending"
	}
}

func contentHash(value string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(value)))
	return hex.EncodeToString(sum[:])
}

func pointID(chunkID uint64) uint64 {
	return chunkID
}

func keywordText(value string) string {
	tokens := queryTerms(value)
	if len(tokens) == 0 {
		return ""
	}
	if len(tokens) > 80 {
		tokens = tokens[:80]
	}
	return strings.Join(tokens, " ")
}

func keywordNodeFilters(baseID uint64, keyword string, dirIDs ...uint64) any {
	keyword = strings.TrimSpace(keyword)
	filter := map[string]any{"knowledge_base_id": baseID, "index_status": "success", "status": 1}
	if len(dirIDs) > 0 {
		ids := make([]uint64, 0, len(dirIDs))
		for _, id := range dirIDs {
			if id > 0 {
				ids = append(ids, id)
			}
		}
		if len(ids) > 0 {
			filter["dir_id"] = ids
		}
	}
	if baseID == 0 || keyword == "" {
		return filter
	}
	terms := queryTerms(keyword)
	if len(terms) == 0 {
		terms = []string{keyword}
	}
	// search_text concatenates title+path+summary+content+plain_text.
	// Only keywords is separate. Two LIKE fields suffice.
	conditions := make([]any, 0, len(terms)*2+1)
	for _, term := range terms {
		pattern := "%" + term + "%"
		conditions = append(conditions,
			map[string]any{"main.search_text": map[string]any{"like": pattern}},
			map[string]any{"main.keywords": map[string]any{"like": pattern}},
		)
	}
	pattern := "%" + keyword + "%"
	conditions = append(conditions,
		map[string]any{"main.search_text": map[string]any{"like": pattern}},
	)
	filter["or"] = conditions
	return filter
}

func keywordCandidateLimit(limit int, focused bool, query string) int {
	candidateLimit := focusedRetrieveLimit(limit, focused)
	if len(queryTerms(query)) > 1 {
		candidateLimit *= 3
	} else {
		candidateLimit *= 2
	}
	if candidateLimit < defaultRetrieveLimit {
		candidateLimit = defaultRetrieveLimit
	}
	if candidateLimit > 120 {
		return 120
	}
	return candidateLimit
}

func keywordNodeScore(row *agentmodel.KnowledgeNode, query string) float64 {
	terms := queryTerms(query)
	if len(terms) == 0 {
		return 0
	}
	title := strings.ToLower(strings.TrimSpace(row.Title))
	path := strings.ToLower(strings.TrimSpace(row.Path))
	summary := strings.ToLower(strings.TrimSpace(row.Summary))
	content := strings.ToLower(strings.TrimSpace(firstNonEmpty(row.PlainText, row.Content)))
	searchText := strings.ToLower(strings.TrimSpace(row.SearchText))
	keywords := strings.ToLower(strings.TrimSpace(row.Keywords))
	score := 0.0
	for _, term := range terms {
		term = strings.ToLower(term)
		if term == "" {
			continue
		}
		if title == term {
			score += 0.3
		} else if strings.Contains(title, term) {
			score += 0.22
		}
		if pathSegmentMatched(term, path) || strings.Contains(path, term) {
			score += 0.18
		}
		if strings.Contains(keywords, term) {
			score += 0.14
		}
		if strings.Contains(summary, term) {
			score += 0.1
		}
		if strings.Contains(searchText, term) {
			score += 0.07
		}
		if strings.Contains(content, term) {
			score += 0.05
		}
	}
	if strings.Contains(searchText, strings.ToLower(strings.TrimSpace(query))) {
		score += 0.12
	}
	switch row.NodeType {
	case agentmodel.KnowledgeNodeTypeDoc, agentmodel.KnowledgeNodeTypeHeading, agentmodel.KnowledgeNodeTypePage:
		score += 0.04
	}
	return score
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func firstPositive(values ...int) int {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}

func nonEmptyStrings(values ...string) []string {
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.Trim(strings.TrimSpace(value), "/")
		if value != "" {
			result = append(result, value)
		}
	}
	return result
}

func jsonText(value any) string {
	raw, err := json.Marshal(value)
	if err != nil {
		return "{}"
	}
	return string(raw)
}

func floatValue(value any) float64 {
	switch current := value.(type) {
	case float64:
		if math.IsNaN(current) || math.IsInf(current, 0) {
			return 0
		}
		return current
	case float32:
		return float64(current)
	case int:
		return float64(current)
	case int64:
		return float64(current)
	case uint64:
		return float64(current)
	case string:
		parsed, _ := strconv.ParseFloat(strings.TrimSpace(current), 64)
		return parsed
	default:
		return 0
	}
}

func uint64Value(value any) uint64 {
	return util.ToUint64(value)
}

func textLength(value string) int {
	return utf8.RuneCountInString(value)
}

func truncateText(value string, limit int) string {
	if limit <= 0 {
		return ""
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return string(runes[:limit])
}

type candidateDir struct {
	ID   uint64
	Path string
	Name string
}

func candidateKnowledgeDirs(ctx context.Context, baseID uint64, query string) []candidateDir {
	query = strings.TrimSpace(query)
	if baseID == 0 || query == "" {
		return nil
	}
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.path",
		"order": "main.depth desc, main.id asc",
	})
	result := make([]candidateDir, 0)
	for _, row := range rows {
		if row == nil {
			continue
		}
		name := strings.TrimSpace(row.Name)
		path := strings.TrimSpace(row.Path)
		if name == "" && path == "" {
			continue
		}
		if (name != "" && strings.Contains(query, name)) || (path != "" && strings.Contains(query, path)) || pathSegmentMatched(query, path) {
			result = append(result, candidateDir{ID: row.ID, Name: name, Path: path})
		}
	}
	return result
}

func expandedCandidateDirs(ctx context.Context, baseID uint64, query string, depth int) []candidateDir {
	roots := candidateKnowledgeDirs(ctx, baseID, query)
	return expandCandidateDirs(ctx, baseID, roots, depth)
}

func candidateKnowledgeDirsByIDs(ctx context.Context, baseID uint64, ids []uint64) []candidateDir {
	if baseID == 0 || len(ids) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"id":                ids,
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.path",
		"order": "main.depth desc, main.id asc",
	})
	result := make([]candidateDir, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, candidateDirFromDir(row))
		}
	}
	return result
}

func candidateKnowledgeDirsByDocIDs(ctx context.Context, baseID uint64, docIDs []uint64) []candidateDir {
	if baseID == 0 || len(docIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id":                docIDs,
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.dir_id",
	})
	dirIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.DirID > 0 {
			dirIDs = append(dirIDs, row.DirID)
		}
	}
	return candidateKnowledgeDirsByIDs(ctx, baseID, uniqueUint64s(dirIDs, 0))
}

func knowledgeDocTitlesByIDs(ctx context.Context, baseID uint64, docIDs []uint64) []string {
	if baseID == 0 || len(docIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id":                docIDs,
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title",
		"page":     1,
		"pageSize": 30,
	})
	titles := make([]string, 0, len(rows))
	for _, row := range rows {
		if row != nil && strings.TrimSpace(row.Title) != "" {
			titles = append(titles, strings.TrimSpace(row.Title))
		}
	}
	return titles
}

func expandCandidateDirs(ctx context.Context, baseID uint64, roots []candidateDir, depth int) []candidateDir {
	if len(roots) == 0 || depth <= 0 {
		return roots
	}
	result := append([]candidateDir{}, roots...)
	seen := map[uint64]struct{}{}
	for _, dir := range roots {
		if dir.ID > 0 {
			seen[dir.ID] = struct{}{}
		}
	}
	for _, dir := range roots {
		for _, expanded := range relatedKnowledgeDirs(ctx, baseID, dir.ID, depth) {
			if expanded.ID == 0 {
				continue
			}
			if _, exists := seen[expanded.ID]; exists {
				continue
			}
			seen[expanded.ID] = struct{}{}
			result = append(result, expanded)
		}
	}
	return result
}

func relatedKnowledgeDirs(ctx context.Context, baseID uint64, rootID uint64, depth int) []candidateDir {
	if baseID == 0 || rootID == 0 || depth <= 0 {
		return nil
	}
	result := make([]candidateDir, 0)
	current := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
		"id":                rootID,
		"knowledge_base_id": baseID,
		"status":            1,
	})
	for i := 0; i < depth && current != nil && current.ParentID > 0; i++ {
		parent := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{
			"id":                current.ParentID,
			"knowledge_base_id": baseID,
			"status":            1,
		})
		if parent == nil {
			break
		}
		result = append(result, candidateDirFromDir(parent))
		current = parent
	}
	result = append(result, childCandidateDirs(ctx, baseID, rootID, depth)...)
	return result
}

func childCandidateDirs(ctx context.Context, baseID uint64, parentID uint64, depth int) []candidateDir {
	if baseID == 0 || parentID == 0 || depth <= 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         parentID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.path",
		"order": "main.sort asc, main.id asc",
	})
	result := make([]candidateDir, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, candidateDirFromDir(row))
		result = append(result, childCandidateDirs(ctx, baseID, row.ID, depth-1)...)
	}
	return result
}

func candidateDirFromDir(dir *agentmodel.KnowledgeDir) candidateDir {
	if dir == nil {
		return candidateDir{}
	}
	return candidateDir{
		ID:   dir.ID,
		Name: strings.TrimSpace(dir.Name),
		Path: strings.TrimSpace(dir.Path),
	}
}

func candidateDirIDs(rows []candidateDir) []uint64 {
	ids := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		if row.ID == 0 {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		ids = append(ids, row.ID)
	}
	return ids
}

func mergeCandidateDirs(groups ...[]candidateDir) []candidateDir {
	result := make([]candidateDir, 0)
	seen := map[uint64]struct{}{}
	for _, group := range groups {
		for _, dir := range group {
			if dir.ID == 0 {
				continue
			}
			if _, exists := seen[dir.ID]; exists {
				continue
			}
			seen[dir.ID] = struct{}{}
			result = append(result, dir)
		}
	}
	return result
}

func uniqueUint64s(values []uint64, limit int) []uint64 {
	seen := map[uint64]struct{}{}
	result := make([]uint64, 0, len(values))
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
		if limit > 0 && len(result) >= limit {
			break
		}
	}
	return result
}

func plannedQueries(query string, plan retrievalPlan) []string {
	values := append([]string{query}, plan.Queries...)
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		key := strings.ToLower(value)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, value)
		if len(result) >= 5 {
			break
		}
	}
	return result
}

func pathSegmentMatched(query string, path string) bool {
	query = strings.ToLower(strings.TrimSpace(query))
	path = strings.ToLower(strings.TrimSpace(path))
	for _, segment := range strings.Split(path, "/") {
		segment = strings.TrimSpace(segment)
		if segment != "" && strings.Contains(query, segment) {
			return true
		}
	}
	return false
}

func queryTerms(query string) []string {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return nil
	}
	seen := map[string]struct{}{}
	terms := make([]string, 0, 8)
	addTerm := func(term string) {
		term = strings.Trim(term, " \t\r\n-_./\\|:：,，;；!！?？()（）[]【】{}<>《》\"'`")
		if textLength(term) < 2 && !containsCJK(term) {
			return
		}
		if _, exists := seen[term]; exists {
			return
		}
		seen[term] = struct{}{}
		terms = append(terms, term)
	}
	for _, term := range strings.FieldsFunc(query, isQuerySeparator) {
		addTerm(term)
	}
	if len([]rune(query)) <= 32 {
		addTerm(query)
	}
	return terms
}

func isQuerySeparator(r rune) bool {
	return unicode.IsSpace(r) || strings.ContainsRune("/\\|,，;；:：!！?？()（）[]【】{}<>《》\"'`", r)
}

func containsCJK(value string) bool {
	for _, r := range value {
		if unicode.Is(unicode.Han, r) || unicode.Is(unicode.Hiragana, r) || unicode.Is(unicode.Katakana, r) || unicode.Is(unicode.Hangul, r) {
			return true
		}
	}
	return false
}

func focusedRetrieveLimit(limit int, focused bool) int {
	if !focused {
		return limit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	return limit * 2
}

func mergeKnowledgeSnippets(rows []agentprompt.KnowledgeSnippet) []agentprompt.KnowledgeSnippet {
	if len(rows) == 0 {
		return rows
	}
	seen := make(map[uint64]int, len(rows))
	result := make([]agentprompt.KnowledgeSnippet, 0, len(rows))
	for _, row := range rows {
		if row.NodeID == 0 {
			result = append(result, row)
			continue
		}
		if index, exists := seen[row.NodeID]; exists {
			if row.Score > result[index].Score {
				result[index] = row
			}
			continue
		}
		seen[row.NodeID] = len(result)
		result = append(result, row)
	}
	return result
}

const rrfK = 60.0

// rrfScoreSnippets replaces per-source absolute scores with Reciprocal Rank Fusion scores.
// Each source (keyword, vector, planned_doc) independently ranks results, then RRF combines
// ranks across sources: score = Σ(1/(k + rank_i)) where k=60.
// This eliminates the problem of incompatible score ranges across different retrieval methods.
func rrfScoreSnippets(snippets []RetrievedSnippet) []RetrievedSnippet {
	if len(snippets) == 0 {
		return snippets
	}
	type sourceList struct {
		items []RetrievedSnippet
		ranks map[uint64]int
	}
	sources := map[string]*sourceList{}
	for _, s := range snippets {
		src := s.Source
		if sources[src] == nil {
			sources[src] = &sourceList{}
		}
		sources[src].items = append(sources[src].items, s)
	}
	for _, list := range sources {
		// Dedup within source by (base_id, node_id), keep highest score
		seen := map[string]struct{}{}
		unique := make([]RetrievedSnippet, 0, len(list.items))
		for _, item := range list.items {
			key := fmt.Sprintf("%d:%d", item.BaseID, item.NodeID)
			if _, exists := seen[key]; exists {
				continue
			}
			seen[key] = struct{}{}
			unique = append(unique, item)
		}
		list.items = unique
		sort.SliceStable(list.items, func(i, j int) bool {
			return list.items[i].Score > list.items[j].Score
		})
		list.ranks = make(map[uint64]int, len(list.items))
		for i, item := range list.items {
			if item.NodeID > 0 {
				list.ranks[item.NodeID] = i + 1
			}
		}
	}
	for i := range snippets {
		if snippets[i].NodeID == 0 {
			continue
		}
		score := 0.0
		for _, list := range sources {
			if rank, ok := list.ranks[snippets[i].NodeID]; ok {
				score += 1.0 / (rrfK + float64(rank))
			}
		}
		snippets[i].Score = score
	}
	// Scale RRF scores so that a single #1-ranked source contributes ~1.0.
	// This keeps scores in a 0-3 range compatible with rankKnowledgeSnippets boosts.
	scale := rrfK + 1
	for i := range snippets {
		if snippets[i].NodeID > 0 {
			snippets[i].Score *= scale
		}
	}
	return snippets
}

func incomingEdgeCounts(ctx context.Context, baseID uint64, nodeIDs []uint64) map[uint64]int {
	nodeIDs = uniqueUint64s(nodeIDs, 0)
	if baseID == 0 || len(nodeIDs) == 0 {
		return nil
	}
	edges := agentmodel.NewKnowledgeEdgeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"to_node_id":        nodeIDs,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.to_node_id",
	})
	if len(edges) == 0 {
		return nil
	}
	result := make(map[uint64]int, len(nodeIDs))
	for _, edge := range edges {
		if edge == nil || edge.ToNodeID == 0 {
			continue
		}
		result[edge.ToNodeID]++
	}
	return result
}

func backlinkBoost(edgeCount int) float64 {
	if edgeCount <= 0 {
		return 0
	}
	boost := math.Log(float64(edgeCount+1)) / math.Log(11)
	if boost > 1 {
		return 1
	}
	return boost * 0.15
}

func rankKnowledgeSnippets(ctx context.Context, rows []agentprompt.KnowledgeSnippet, query string, dirs []candidateDir, baseID uint64) []agentprompt.KnowledgeSnippet {
	if len(rows) == 0 {
		return rows
	}
	query = strings.TrimSpace(query)
	dirMatches := map[uint64]struct{}{}
	for _, dir := range dirs {
		if dir.ID > 0 {
			dirMatches[dir.ID] = struct{}{}
		}
	}
	nodeIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row.NodeID > 0 {
			nodeIDs = append(nodeIDs, row.NodeID)
		}
	}
	backlinks := incomingEdgeCounts(ctx, baseID, nodeIDs)
	for index := range rows {
		score := rows[index].Score
		if _, matched := dirMatches[rows[index].DirID]; matched {
			score += 0.12
		}
		title := strings.TrimSpace(rows[index].Title)
		if query != "" && title != "" && strings.Contains(query, title) {
			score += 0.08
		}
		dirPath := strings.TrimSpace(rows[index].DirPath)
		if query != "" && dirPath != "" && pathSegmentMatched(query, dirPath) {
			score += 0.05
		}
		if backlinks != nil {
			score += backlinkBoost(backlinks[rows[index].NodeID])
		}
		hitCount := rows[index].HitCount
		if hitCount > 0 {
			boost := 1.0 + math.Log(1.0+float64(hitCount))*0.05
			if boost > 1.2 {
				boost = 1.2
			}
			score *= boost
		}
		if rows[index].Weight != 0 {
			score += rows[index].Weight * 0.2
		}
		rows[index].Score = score
	}
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Score == rows[j].Score {
			return rows[i].SortRank < rows[j].SortRank
		}
		return rows[i].Score > rows[j].Score
	})
	return rows
}
