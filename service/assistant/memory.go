package assistant

import (
	"context"
	"regexp"
	"strings"
	"time"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
	memoryservice "github.com/dever-package/bot/service/memory"
)

const (
	memoryReviewMaxRows        = 500
	memoryLLMExtractionTimeout = 20 * time.Second
)

var sensitiveMemoryPatterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|cookie|authorization|bearer|private[_-]?key|密码|密钥|私钥|令牌|凭证)`),
	regexp.MustCompile(`-----BEGIN [A-Z ]+PRIVATE KEY-----`),
	regexp.MustCompile(`(?i)\b[A-Za-z0-9_\-]{36,}\b`),
}

func (s Service) sessionMemoryRows(ctx context.Context, owner ownerScope, session assistantmodel.Session, limit int) []map[string]any {
	rows := memoryservice.NewService().RuntimeRows(ctx, memoryservice.RuntimeRequest{
		OwnerType:  owner.OwnerType,
		OwnerID:    owner.OwnerID,
		AgentKey:   session.AgentKey,
		ContextKey: session.ContextKey,
		SessionID:  session.ID,
		Limit:      limit,
	})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, memoryMap(row))
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

	if strings.ToLower(strings.TrimSpace(req.Scope)) == memoryScopeAll {
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

func (s Service) extractSessionMemory(ctx context.Context, owner ownerScope, session assistantmodel.Session, sourceMessageID uint64) map[string]any {
	userText := latestUserMessageText(ctx, session.ID)
	if userText == "" {
		return nil
	}
	if target, ok := forgetMemoryInstruction(userText); ok {
		s.forgetSimilarMemories(ctx, owner, session, target)
		return map[string]any{
			"status": "forgot",
			"text":   "已按本轮要求清理相关记忆。",
		}
	}
	if !shouldEvaluateMemory(userText) {
		return nil
	}
	candidates := s.extractMemoryCandidatesWithLLM(ctx, session, userText)
	if len(candidates) == 0 {
		candidates = extractMemoryCandidates(userText)
	}
	for _, candidate := range candidates {
		review := s.rememberMemoryCandidate(ctx, owner, session, sourceMessageID, candidate)
		if len(review) > 0 {
			return review
		}
	}
	return nil
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
	Scope      string
	Source     string
	Confidence float64
	Reason     string
	Explicit   bool
}

func extractMemoryCandidates(text string) []memoryCandidate {
	text = normalizeMemoryContent(text)
	if text == "" || len([]rune(text)) > 900 || hasSensitiveMemoryContent(text) {
		return nil
	}
	explicit := explicitMemoryContent(text)
	content := explicit
	importance := 80
	explicitSignal := explicit != ""
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
		Source:     memorymodel.SourceAuto,
		Confidence: 0.68,
		Reason:     "命中长期记忆规则",
		Explicit:   explicitSignal,
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
	target = memoryservice.NormalizeComparableText(target)
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
		if row == nil || !memoryMatchesRuntimeSession(*row, session) {
			continue
		}
		current := memoryservice.NormalizeComparableText(row.Title + " " + row.Content)
		if memoryservice.TextSimilar(target, current) {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
				"status": memorymodel.StatusDisabled,
			})
		}
	}
}

func (s Service) findSimilarMemory(ctx context.Context, owner ownerScope, scope string, contextKey string, agentKey string, sessionID uint64, title string, content string) *memorymodel.Memory {
	probe := memoryservice.NormalizeComparableText(title + " " + content)
	if probe == "" {
		return nil
	}
	req := MemoryListRequest{ContextKey: contextKey, AgentKey: agentKey, Scope: scope, SessionID: sessionID}
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
		if row == nil || !memoryMatchesScope(*row, req) {
			continue
		}
		current := memoryservice.NormalizeComparableText(row.Title + " " + row.Content)
		if memoryservice.TextSimilar(probe, current) {
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
	return memoryMatchesScope(row, req)
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
	signals := []string{
		"以后", "每次", "总是", "默认", "必须", "不许", "禁止",
		"规范", "规则", "约束", "偏好", "习惯", "希望", "喜欢",
		"回复", "语气", "风格", "用中文", "长期记忆",
		"不要默认", "不要再", "不需要兼容",
	}
	for _, signal := range signals {
		if strings.Contains(text, signal) {
			return true
		}
	}
	return false
}

func looksLikeTemporaryTaskMemory(text string) bool {
	if containsAny(text, []string{"以后", "每次", "默认", "长期", "记住"}) {
		return false
	}
	temporarySignals := []string{"本次", "现在", "这次", "当前任务", "这回"}
	taskSignals := []string{"生成", "写", "做", "帮我", "我要", "要求", "小红书", "图文", "文案", "图片"}
	return containsAny(text, temporarySignals) && containsAny(text, taskSignals)
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
