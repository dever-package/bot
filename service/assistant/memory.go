package assistant

import (
	"context"
	"regexp"
	"strings"
	"time"
	"unicode"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const memoryReviewMaxRows = 500

var sensitiveMemoryPatterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|cookie|authorization|bearer|private[_-]?key|密码|密钥|私钥|令牌|凭证)`),
	regexp.MustCompile(`-----BEGIN [A-Z ]+PRIVATE KEY-----`),
	regexp.MustCompile(`(?i)\b[A-Za-z0-9_\-]{36,}\b`),
}

func (s Service) sessionMemoryRows(ctx context.Context, owner ownerScope, session assistantmodel.Session, limit int) []map[string]any {
	rows := memorymodel.NewMemoryModel().Select(
		ctx,
		map[string]any{
			"owner_type": owner.OwnerType,
			"owner_id":   owner.OwnerID,
			"status":     memorymodel.StatusEnabled,
		},
		map[string]any{
			"order": "main.importance desc,main.id desc",
			"limit": clampLimit(limit, defaultMemoryLimit, maxMemoryLimit) * 3,
		},
	)
	maxRows := clampLimit(limit, defaultMemoryLimit, maxMemoryLimit)
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil || !memoryMatchesSession(*row, session) {
			continue
		}
		result = append(result, memoryMap(row))
		if len(result) >= maxRows {
			break
		}
	}
	return result
}

func (s Service) reviewMemoryRows(ctx context.Context, owner ownerScope, req MemoryListRequest) ([]map[string]any, int64, int, int) {
	page, pageSize := normalizePage(req.Page, firstPositive(req.PageSize, req.Limit, 10))
	filter := map[string]any{
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
	}
	if status := memoryStatusFilter(req.Status); status > 0 {
		filter["status"] = status
	} else if strings.TrimSpace(req.Status) == "" {
		filter["status"] = memorymodel.StatusEnabled
	}
	if kind := normalizeMemoryKind(req.Kind); kind != "" {
		filter["kind"] = kind
	}
	if keyword := strings.TrimSpace(req.Keyword); keyword != "" {
		like := "%" + keyword + "%"
		filter["or"] = []map[string]any{
			{"title": map[string]any{"LIKE": like}},
			{"content": map[string]any{"LIKE": like}},
		}
	}

	if memoryScope(req.Scope) == "all" {
		model := memorymodel.NewMemoryModel()
		total := model.Count(ctx, filter)
		rows := model.Select(ctx, filter, map[string]any{
			"order":    "main.importance desc,main.id desc",
			"page":     page,
			"pageSize": pageSize,
		})
		return memoryMaps(rows), total, page, pageSize
	}

	rows := memorymodel.NewMemoryModel().Select(ctx, filter, map[string]any{
		"order": "main.importance desc,main.id desc",
		"limit": memoryReviewMaxRows,
	})
	filtered := make([]*memorymodel.Memory, 0, len(rows))
	for _, row := range rows {
		if row == nil || !memoryMatchesListRequest(*row, req) {
			continue
		}
		filtered = append(filtered, row)
	}
	start := (page - 1) * pageSize
	if start >= len(filtered) {
		return []map[string]any{}, int64(len(filtered)), page, pageSize
	}
	end := start + pageSize
	if end > len(filtered) {
		end = len(filtered)
	}
	return memoryMaps(filtered[start:end]), int64(len(filtered)), page, pageSize
}

func (s Service) extractSessionMemoryAsync(owner ownerScope, session assistantmodel.Session) {
	if session.ID == 0 {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		s.extractSessionMemory(ctx, owner, session)
	}()
}

func (s Service) extractSessionMemory(ctx context.Context, owner ownerScope, session assistantmodel.Session) {
	userText := latestUserMessageText(ctx, session.ID)
	if userText == "" {
		return
	}
	if target, ok := forgetMemoryInstruction(userText); ok {
		s.forgetSimilarMemories(ctx, owner, session, target)
		return
	}
	for _, candidate := range extractMemoryCandidates(userText) {
		candidate.Tags = append(candidate.Tags, "source:auto")
		_, _ = s.rememberForOwner(ctx, owner, MemoryRequest{
			Kind:       candidate.Kind,
			Title:      candidate.Title,
			Content:    candidate.Content,
			Tags:       candidate.Tags,
			Importance: candidate.Importance,
			ContextKey: session.ContextKey,
			AgentKey:   session.AgentKey,
		})
	}
}

func latestUserMessageText(ctx context.Context, sessionID uint64) string {
	rows := assistantmodel.NewMessageModel().Select(
		ctx,
		map[string]any{
			"session_id": sessionID,
			"status":     assistantmodel.MessageStatusNormal,
		},
		map[string]any{
			"order": "main.id desc",
			"limit": 8,
		},
	)
	for _, row := range rows {
		if row != nil && row.Role == "user" {
			return strings.TrimSpace(row.Text)
		}
	}
	return ""
}

type memoryCandidate struct {
	Kind       string
	Title      string
	Content    string
	Tags       []string
	Importance int
}

func extractMemoryCandidates(text string) []memoryCandidate {
	text = normalizeMemoryContent(text)
	if text == "" || len([]rune(text)) > 900 || hasSensitiveMemoryContent(text) {
		return nil
	}
	explicit := explicitMemoryContent(text)
	content := explicit
	importance := 80
	if content == "" {
		if !looksLikeLongTermMemory(text) {
			return nil
		}
		content = text
		importance = 65
	}
	content = limitText(content, 420)
	kind := inferMemoryKind(content)
	return []memoryCandidate{{
		Kind:       kind,
		Title:      memoryTitle(kind, content),
		Content:    content,
		Importance: importance,
	}}
}

func explicitMemoryContent(text string) string {
	markers := []string{"请记住", "帮我记住", "你要记住", "需要记住", "记住：", "记住:", "记住"}
	for _, marker := range markers {
		index := strings.Index(text, marker)
		if index < 0 {
			continue
		}
		content := strings.TrimSpace(text[index+len(marker):])
		content = strings.TrimLeft(content, " ：:，,。")
		if content != "" {
			return content
		}
	}
	return ""
}

func forgetMemoryInstruction(text string) (string, bool) {
	if strings.Contains(text, "不要记住") || strings.Contains(text, "别记住") || strings.Contains(text, "不用记住") {
		return strings.TrimSpace(text), true
	}
	markers := []string{"忘掉", "忘记", "删除记忆", "清除记忆"}
	for _, marker := range markers {
		index := strings.Index(text, marker)
		if index < 0 {
			continue
		}
		target := strings.TrimSpace(text[index+len(marker):])
		target = strings.TrimLeft(target, " ：:，,。")
		if target == "" {
			target = strings.TrimSpace(text)
		}
		return target, true
	}
	return "", false
}

func (s Service) forgetSimilarMemories(ctx context.Context, owner ownerScope, session assistantmodel.Session, target string) {
	target = normalizeMemoryComparable(target)
	if target == "" {
		return
	}
	rows := memorymodel.NewMemoryModel().Select(
		ctx,
		map[string]any{
			"owner_type": owner.OwnerType,
			"owner_id":   owner.OwnerID,
			"status":     memorymodel.StatusEnabled,
		},
		map[string]any{
			"order": "main.importance desc,main.id desc",
			"limit": 120,
		},
	)
	for _, row := range rows {
		if row == nil || !memoryMatchesSession(*row, session) {
			continue
		}
		current := normalizeMemoryComparable(row.Title + " " + row.Content)
		if memorySimilar(target, current) {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
				"status": memorymodel.StatusDisabled,
			})
		}
	}
}

func (s Service) findSimilarMemory(ctx context.Context, owner ownerScope, contextKey string, agentKey string, title string, content string) *memorymodel.Memory {
	probe := normalizeMemoryComparable(title + " " + content)
	if probe == "" {
		return nil
	}
	req := MemoryListRequest{ContextKey: contextKey, AgentKey: agentKey, Scope: "current"}
	rows := memorymodel.NewMemoryModel().Select(
		ctx,
		map[string]any{
			"owner_type": owner.OwnerType,
			"owner_id":   owner.OwnerID,
			"status":     memorymodel.StatusEnabled,
		},
		map[string]any{
			"order": "main.importance desc,main.id desc",
			"limit": 120,
		},
	)
	for _, row := range rows {
		if row == nil || !memoryMatchesListRequest(*row, req) {
			continue
		}
		current := normalizeMemoryComparable(row.Title + " " + row.Content)
		if memorySimilar(probe, current) {
			return row
		}
	}
	return nil
}

func memoryMaps(rows []*memorymodel.Memory) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, memoryMap(row))
	}
	return result
}

func memoryMatchesListRequest(row memorymodel.Memory, req MemoryListRequest) bool {
	scope := memoryScope(req.Scope)
	tags := memoryTags(row.Tags)
	switch scope {
	case "global":
		return !hasScopedMemoryTags(tags)
	case "current":
		contextTag := "context:" + normalizeContextKey(req.ContextKey, req.AgentKey)
		agentTag := ""
		if strings.TrimSpace(req.AgentKey) != "" {
			agentTag = "agent:" + strings.TrimSpace(req.AgentKey)
		}
		if len(tags) == 0 {
			return true
		}
		hasScoped := false
		for _, tag := range tags {
			if strings.HasPrefix(tag, "context:") || strings.HasPrefix(tag, "agent:") {
				hasScoped = true
			}
			if tag == contextTag || (agentTag != "" && tag == agentTag) {
				return true
			}
		}
		return !hasScoped
	default:
		return true
	}
}

func hasScopedMemoryTags(tags []string) bool {
	for _, tag := range tags {
		if strings.HasPrefix(tag, "context:") || strings.HasPrefix(tag, "agent:") {
			return true
		}
	}
	return false
}

func memoryScope(scope string) string {
	switch strings.ToLower(strings.TrimSpace(scope)) {
	case "all":
		return "all"
	case "global":
		return "global"
	default:
		return "current"
	}
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

func normalizeMemoryKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "working", "episodic", "semantic", "procedural", "persona", "content":
		return strings.ToLower(strings.TrimSpace(kind))
	default:
		return ""
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

func firstPositive(values ...int) int {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}

func normalizeMemoryContent(text string) string {
	text = strings.TrimSpace(text)
	text = strings.ReplaceAll(text, "\r\n", "\n")
	lines := strings.Split(text, "\n")
	cleaned := make([]string, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "参考资料：") {
			continue
		}
		cleaned = append(cleaned, line)
	}
	return strings.Join(cleaned, "\n")
}

func hasSensitiveMemoryContent(text string) bool {
	for _, pattern := range sensitiveMemoryPatterns {
		if pattern.MatchString(text) {
			return true
		}
	}
	return false
}

func looksLikeLongTermMemory(text string) bool {
	signals := []string{"以后", "每次", "总是", "默认", "必须", "不许", "不要", "禁止", "规范", "规则", "约束", "偏好", "习惯", "希望", "长期记忆"}
	for _, signal := range signals {
		if strings.Contains(text, signal) {
			return true
		}
	}
	return false
}

func inferMemoryKind(content string) string {
	switch {
	case containsAny(content, []string{"偏好", "习惯", "喜欢", "希望", "回复", "语气", "风格", "不要默认认同", "迎合"}):
		return "persona"
	case containsAny(content, []string{"流程", "步骤", "规范", "规则", "必须", "禁止", "不许", "默认", "每次", "以后"}):
		return "procedural"
	case containsAny(content, []string{"项目", "系统", "框架", "组件", "站点", "权限"}):
		return "semantic"
	default:
		return "semantic"
	}
}

func memoryTitle(kind string, content string) string {
	prefix := map[string]string{
		"persona":    "用户偏好",
		"procedural": "工作规则",
		"semantic":   "长期事实",
		"episodic":   "重要事件",
		"content":    "内容摘要",
		"working":    "工作记忆",
	}[kind]
	if prefix == "" {
		prefix = "长期记忆"
	}
	return prefix + "：" + limitText(strings.Join(strings.Fields(content), " "), 32)
}

func containsAny(text string, values []string) bool {
	for _, value := range values {
		if strings.Contains(text, value) {
			return true
		}
	}
	return false
}

func normalizeMemoryComparable(text string) string {
	var builder strings.Builder
	for _, current := range strings.ToLower(text) {
		if unicode.IsLetter(current) || unicode.IsDigit(current) {
			builder.WriteRune(current)
		}
	}
	return builder.String()
}

func memorySimilar(left string, right string) bool {
	left = normalizeMemoryComparable(left)
	right = normalizeMemoryComparable(right)
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
	return memoryBigramSimilarity(left, right) >= 0.82
}

func memoryBigramSimilarity(left string, right string) float64 {
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
