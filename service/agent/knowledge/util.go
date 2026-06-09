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

func isVectorEnabled(value int16) bool {
	return value == 1
}

func normalizeVectorEnabled(value any) int16 {
	switch current := value.(type) {
	case bool:
		if current {
			return 1
		}
		return 2
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "on":
			return 1
		case "2", "false", "no", "off", "":
			return 2
		}
	}
	if util.ToIntDefault(value, 0) == 1 {
		return 1
	}
	return 2
}

func normalizeChunkSize(value any) int {
	size := util.ToIntDefault(value, defaultChunkSize)
	if size < 200 {
		return 200
	}
	if size > 4000 {
		return 4000
	}
	return size
}

func normalizeChunkOverlap(value any, chunkSize int) int {
	overlap := util.ToIntDefault(value, defaultChunkOverlap)
	if overlap < 0 {
		return 0
	}
	limit := chunkSize / 2
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

func normalizeIndexContent(content string) string {
	return strings.TrimSpace(agentprompt.TextFromRichText(content))
}

func searchableChunkText(dirPath string, title string, content string) string {
	parts := make([]string, 0, 3)
	if strings.TrimSpace(dirPath) != "" {
		parts = append(parts, "目录："+strings.ReplaceAll(strings.TrimSpace(dirPath), "/", " / "))
	}
	if strings.TrimSpace(title) != "" {
		parts = append(parts, "文档："+strings.TrimSpace(title))
	}
	parts = append(parts, "内容：\n"+strings.TrimSpace(content))
	return strings.TrimSpace(strings.Join(parts, "\n"))
}

func keywordChunkFilters(baseID uint64, keyword string, dirIDs ...uint64) any {
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
	pattern := "%" + keyword + "%"
	filter["or"] = []any{
		map[string]any{"main.title": map[string]any{"like": pattern}},
		map[string]any{"main.dir_path": map[string]any{"like": pattern}},
		map[string]any{"main.content": map[string]any{"like": pattern}},
	}
	return filter
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

func pathSegmentMatched(query string, path string) bool {
	for _, segment := range strings.Split(path, "/") {
		segment = strings.TrimSpace(segment)
		if segment != "" && strings.Contains(query, segment) {
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
		if row.ChunkID == 0 {
			result = append(result, row)
			continue
		}
		if index, exists := seen[row.ChunkID]; exists {
			if row.Score > result[index].Score {
				result[index] = row
			}
			continue
		}
		seen[row.ChunkID] = len(result)
		result = append(result, row)
	}
	return result
}

func rankKnowledgeSnippets(rows []agentprompt.KnowledgeSnippet, query string, dirs []candidateDir) []agentprompt.KnowledgeSnippet {
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
