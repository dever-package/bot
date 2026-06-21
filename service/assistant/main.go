package assistant

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
	deverjwt "github.com/shemic/dever/auth/jwt"
)

const (
	defaultMessageLimit = 80
	defaultMemoryLimit  = 20
	maxMessageLimit     = 200
	maxMemoryLimit      = 50
)

type Service struct{}

type ResolveRequest struct {
	SessionID  uint64
	ContextKey string
	AgentKey   string
	Title      string
	NewSession bool
	Limit      int
	Page       int
	PageSize   int
	Keyword    string
	Status     string
}

type MessageRequest struct {
	SessionID     uint64
	ContextKey    string
	AgentKey      string
	Role          string
	Kind          string
	Text          string
	Content       any
	Output        any
	RequestID     string
	Status        int16
	MemoryEnabled bool
}

type MemoryRequest struct {
	Kind       string
	Title      string
	Content    string
	Tags       []string
	Importance int
	Scope      string
	ContextKey string
	AgentKey   string
	SessionID  uint64
	Source     string
	Confidence float64
}

type MemoryListRequest struct {
	Limit      int
	Page       int
	PageSize   int
	Keyword    string
	Kind       string
	Status     string
	ContextKey string
	AgentKey   string
	Scope      string
	SessionID  uint64
}

type MemoryUpdateRequest struct {
	ID         uint64
	Kind       string
	Title      string
	Content    string
	Tags       []string
	Importance int
	Status     int16
	Scope      string
	ContextKey string
	AgentKey   string
	SessionID  uint64
	Confidence float64
}

type MemoryForgetRequest struct {
	ID   uint64
	Hard bool
}

type MemoryChoiceRequest struct {
	CandidateID     uint64
	MemoryID        uint64
	SourceMessageID uint64
	Choice          string
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

type ownerScope struct {
	OwnerType string
	OwnerID   uint64
}

func NewService() Service {
	return Service{}
}

func (s Service) ResolveSession(ctx context.Context, req ResolveRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	if req.SessionID > 0 {
		session, err := s.requireSession(ctx, owner, req.SessionID)
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"session":  sessionMap(*session),
			"messages": s.sessionMessages(ctx, session.ID, req.Limit),
			"memories": s.sessionMemoryRows(ctx, owner, *session, defaultMemoryLimit),
		}, nil
	}
	session := s.resolveSession(ctx, owner, req)
	messages := s.sessionMessages(ctx, session.ID, req.Limit)
	memories := s.sessionMemoryRows(ctx, owner, session, defaultMemoryLimit)
	return map[string]any{
		"session":  sessionMap(session),
		"messages": messages,
		"memories": memories,
	}, nil
}

func (s Service) StartSession(ctx context.Context, req ResolveRequest) (map[string]any, error) {
	req.NewSession = true
	return s.ResolveSession(ctx, req)
}

func (s Service) ReviewSessions(ctx context.Context, req ResolveRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	page, pageSize := normalizePage(req.Page, req.PageSize)
	filter := map[string]any{
		"owner_type":  owner.OwnerType,
		"owner_id":    owner.OwnerID,
		"context_key": normalizeContextKey(req.ContextKey, req.AgentKey),
		"agent_key":   strings.TrimSpace(req.AgentKey),
	}
	if status := sessionStatusFilter(req.Status); status > 0 {
		filter["status"] = status
	}
	if keyword := strings.TrimSpace(req.Keyword); keyword != "" {
		filter["title"] = map[string]any{"LIKE": "%" + keyword + "%"}
	}

	model := assistantmodel.NewSessionModel()
	total := model.Count(ctx, filter)
	rows := model.Select(
		ctx,
		filter,
		map[string]any{
			"order":    "main.last_message_at desc,main.id desc",
			"page":     page,
			"pageSize": pageSize,
		},
	)
	sessions := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		sessions = append(sessions, sessionMap(*row))
	}
	return map[string]any{
		"sessions":   sessions,
		"pagination": paginationMap(page, pageSize, total),
	}, nil
}

func (s Service) ClearSession(ctx context.Context, sessionID uint64) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := s.requireSession(ctx, owner, sessionID)
	if err != nil {
		return nil, err
	}
	assistantmodel.NewMessageModel().Delete(ctx, map[string]any{"session_id": session.ID})
	now := time.Now()
	assistantmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{
		"message_count":   0,
		"last_message_at": now,
	})
	session.MessageCount = 0
	session.LastMessageAt = now
	return map[string]any{
		"session":  sessionMap(*session),
		"messages": []any{},
		"memories": s.sessionMemoryRows(ctx, owner, *session, defaultMemoryLimit),
	}, nil
}

func (s Service) ArchiveSession(ctx context.Context, sessionID uint64) error {
	return s.updateSessionStatus(ctx, sessionID, assistantmodel.SessionStatusArchived)
}

func (s Service) RestoreSession(ctx context.Context, sessionID uint64) error {
	return s.updateSessionStatus(ctx, sessionID, assistantmodel.SessionStatusActive)
}

func (s Service) RenameSession(ctx context.Context, sessionID uint64, title string) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := s.requireSession(ctx, owner, sessionID)
	if err != nil {
		return nil, err
	}
	title = limitText(title, 255)
	if title == "" {
		return nil, fmt.Errorf("会话标题不能为空")
	}
	assistantmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{
		"title":        title,
		"title_source": assistantmodel.TitleSourceManual,
	})
	session.Title = title
	session.TitleSource = assistantmodel.TitleSourceManual
	return map[string]any{"session": sessionMap(*session)}, nil
}

func (s Service) updateSessionStatus(ctx context.Context, sessionID uint64, status int16) error {
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	session, err := s.requireSession(ctx, owner, sessionID)
	if err != nil {
		return err
	}
	assistantmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{
		"status": status,
	})
	return nil
}

func (s Service) RecordMessage(ctx context.Context, req MessageRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := s.resolveMessageSession(ctx, owner, req)
	if err != nil {
		return nil, err
	}
	role := normalizeRole(req.Role)
	if role == "" {
		return nil, fmt.Errorf("消息角色不能为空")
	}
	kind := strings.TrimSpace(req.Kind)
	if kind == "" {
		kind = "chat"
	}
	status := req.Status
	if status == 0 {
		status = assistantmodel.MessageStatusNormal
	}
	now := time.Now()
	messageID := uint64(assistantmodel.NewMessageModel().Insert(ctx, map[string]any{
		"session_id": session.ID,
		"role":       role,
		"kind":       kind,
		"text":       strings.TrimSpace(req.Text),
		"content":    jsonText(req.Content, "{}"),
		"output":     jsonText(req.Output, "{}"),
		"request_id": strings.TrimSpace(req.RequestID),
		"status":     status,
		"created_at": now,
	}))
	if messageID == 0 {
		return nil, fmt.Errorf("保存消息失败")
	}
	s.touchSession(ctx, session, role, req.Text, now)
	message := assistantmodel.NewMessageModel().Find(ctx, map[string]any{"id": messageID})
	if role == "assistant" && status == assistantmodel.MessageStatusNormal {
		if req.MemoryEnabled {
			if review := s.extractSessionMemory(ctx, owner, *session, messageID); len(review) > 0 {
				output := mergeMessageOutput(req.Output, map[string]any{"memory_review": review})
				assistantmodel.NewMessageModel().Update(ctx, map[string]any{"id": messageID}, map[string]any{
					"output": jsonText(output, "{}"),
				})
				message = assistantmodel.NewMessageModel().Find(ctx, map[string]any{"id": messageID})
			}
		}
		s.generateSessionTitleAsync(owner, *session)
	}
	return map[string]any{
		"session": sessionMap(*session),
		"message": messageMap(message),
	}, nil
}

func (s Service) ReviewMemories(ctx context.Context, req MemoryListRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	rows, total, page, pageSize := s.reviewMemoryRows(ctx, owner, req)
	return map[string]any{
		"memories":   rows,
		"pagination": paginationMap(page, pageSize, total),
	}, nil
}

func (s Service) Remember(ctx context.Context, req MemoryRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	return s.rememberForOwner(ctx, owner, req)
}

func (s Service) UpdateMemory(ctx context.Context, req MemoryUpdateRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	if req.ID == 0 {
		return nil, fmt.Errorf("记忆ID不能为空")
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
		"id":         req.ID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
	})
	if row == nil {
		return nil, fmt.Errorf("记忆不存在")
	}
	values := map[string]any{}
	if title := strings.TrimSpace(req.Title); title != "" {
		values["title"] = limitText(title, 255)
	}
	if content := strings.TrimSpace(req.Content); content != "" {
		values["content"] = content
	}
	if kind := normalizeMemoryKind(req.Kind); kind != "" {
		values["kind"] = kind
	}
	if req.Importance > 0 {
		values["importance"] = clampMemoryImportance(req.Importance)
	}
	if req.Status == memorymodel.StatusEnabled || req.Status == memorymodel.StatusDisabled {
		values["status"] = req.Status
	}
	if scope := normalizeMemoryScope(req.Scope, req.ContextKey, req.AgentKey, req.SessionID); scope != "" {
		values["scope"] = scope
	}
	if req.ContextKey != "" {
		values["context_key"] = normalizeContextKey(req.ContextKey, req.AgentKey)
	}
	if req.AgentKey != "" {
		values["agent_key"] = strings.TrimSpace(req.AgentKey)
	}
	if req.SessionID > 0 {
		values["session_id"] = req.SessionID
	}
	if req.Confidence > 0 {
		values["confidence"] = clampConfidence(req.Confidence)
	}
	if req.Tags != nil {
		values["tags"] = jsonText(normalizeMemoryTags(req.Tags), "[]")
	}
	if len(values) == 0 {
		return map[string]any{"memory": memoryMap(row)}, nil
	}
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, values)
	row = memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": row.ID})
	return map[string]any{"memory": memoryMap(row)}, nil
}

func (s Service) rememberForOwner(ctx context.Context, owner ownerScope, req MemoryRequest) (map[string]any, error) {
	title := strings.TrimSpace(req.Title)
	content := strings.TrimSpace(req.Content)
	if title == "" {
		return nil, fmt.Errorf("记忆标题不能为空")
	}
	if content == "" {
		return nil, fmt.Errorf("记忆内容不能为空")
	}
	kind := normalizeMemoryKind(req.Kind)
	if kind == "" {
		kind = "semantic"
	}
	importance := clampMemoryImportance(req.Importance)
	scope := resolveMemoryScope(req.Scope, req.ContextKey, req.AgentKey, req.SessionID)
	agentKey := strings.TrimSpace(req.AgentKey)
	contextKey := normalizeContextKey(req.ContextKey, req.AgentKey)
	source := normalizeMemorySource(req.Source)
	confidence := clampConfidence(req.Confidence)
	tags := normalizeMemoryTags(req.Tags)
	if existing := s.findSimilarMemory(ctx, owner, scope, contextKey, agentKey, req.SessionID, title, content); existing != nil {
		if importance > existing.Importance {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
				"importance": importance,
			})
			existing.Importance = importance
		}
		return map[string]any{"memory": memoryMap(existing), "deduped": true}, nil
	}
	id := uint64(memorymodel.NewMemoryModel().Insert(ctx, map[string]any{
		"owner_type":  owner.OwnerType,
		"owner_id":    owner.OwnerID,
		"scope":       scope,
		"agent_key":   agentKey,
		"context_key": contextKey,
		"session_id":  req.SessionID,
		"kind":        kind,
		"title":       title,
		"content":     content,
		"tags":        jsonText(tags, "[]"),
		"source":      source,
		"confidence":  confidence,
		"importance":  importance,
		"status":      memorymodel.StatusEnabled,
		"created_at":  time.Now(),
	}))
	if id == 0 {
		return nil, fmt.Errorf("保存记忆失败")
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id})
	return map[string]any{"memory": memoryMap(row)}, nil
}

func (s Service) ForgetMemory(ctx context.Context, req MemoryForgetRequest) error {
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
		"id":         req.ID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
	})
	if row == nil {
		return fmt.Errorf("记忆不存在")
	}
	if req.Hard {
		memorymodel.NewMemoryModel().Delete(ctx, map[string]any{"id": row.ID})
		return nil
	}
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"status": memorymodel.StatusDisabled,
	})
	return nil
}

func (s Service) RuntimeMemories(ctx context.Context, sessionID uint64, limit int) []RuntimeMemory {
	if sessionID == 0 {
		return []RuntimeMemory{}
	}
	session := assistantmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": assistantmodel.SessionStatusActive,
	})
	if session == nil {
		return []RuntimeMemory{}
	}
	rows := memorymodel.NewMemoryModel().Select(
		ctx,
		map[string]any{
			"owner_type": session.OwnerType,
			"owner_id":   session.OwnerID,
			"status":     memorymodel.StatusEnabled,
		},
		map[string]any{
			"order": "main.importance desc,main.id desc",
			"limit": clampLimit(limit, defaultMemoryLimit, maxMemoryLimit) * 3,
		},
	)
	maxRows := clampLimit(limit, defaultMemoryLimit, maxMemoryLimit)
	result := make([]RuntimeMemory, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if !memoryMatchesSession(*row, *session) {
			continue
		}
		result = append(result, RuntimeMemory{
			ID:         row.ID,
			Kind:       row.Kind,
			Title:      row.Title,
			Content:    row.Content,
			Tags:       row.Tags,
			Importance: row.Importance,
			Scope:      displayMemoryScope(*row),
		})
		if len(result) >= maxRows {
			break
		}
	}
	return result
}

func (s Service) resolveSession(ctx context.Context, owner ownerScope, req ResolveRequest) assistantmodel.Session {
	contextKey := normalizeContextKey(req.ContextKey, req.AgentKey)
	agentKey := strings.TrimSpace(req.AgentKey)
	now := time.Now()
	if !req.NewSession {
		rows := assistantmodel.NewSessionModel().Select(
			ctx,
			map[string]any{
				"owner_type":  owner.OwnerType,
				"owner_id":    owner.OwnerID,
				"context_key": contextKey,
				"agent_key":   agentKey,
				"status":      assistantmodel.SessionStatusActive,
			},
			map[string]any{
				"order": "main.last_message_at desc,main.id desc",
				"limit": 1,
			},
		)
		if len(rows) > 0 && rows[0] != nil {
			return *rows[0]
		}
	}
	title := strings.TrimSpace(req.Title)
	if title == "" {
		title = "新会话"
	}
	id := uint64(assistantmodel.NewSessionModel().Insert(ctx, map[string]any{
		"owner_type":      owner.OwnerType,
		"owner_id":        owner.OwnerID,
		"context_key":     contextKey,
		"agent_key":       agentKey,
		"title":           title,
		"title_source":    assistantmodel.TitleSourceAuto,
		"status":          assistantmodel.SessionStatusActive,
		"message_count":   0,
		"last_message_at": now,
		"created_at":      now,
	}))
	if id == 0 {
		return assistantmodel.Session{}
	}
	row := assistantmodel.NewSessionModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return assistantmodel.Session{ID: id, OwnerType: owner.OwnerType, OwnerID: owner.OwnerID, ContextKey: contextKey, AgentKey: agentKey, Title: title, TitleSource: assistantmodel.TitleSourceAuto, Status: assistantmodel.SessionStatusActive, LastMessageAt: now, CreatedAt: now}
	}
	return *row
}

func (s Service) resolveMessageSession(ctx context.Context, owner ownerScope, req MessageRequest) (*assistantmodel.Session, error) {
	if req.SessionID > 0 {
		return s.requireSession(ctx, owner, req.SessionID)
	}
	session := s.resolveSession(ctx, owner, ResolveRequest{ContextKey: req.ContextKey, AgentKey: req.AgentKey})
	if session.ID == 0 {
		return nil, fmt.Errorf("会话不存在")
	}
	return &session, nil
}

func (s Service) requireSession(ctx context.Context, owner ownerScope, sessionID uint64) (*assistantmodel.Session, error) {
	row := assistantmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         sessionID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
		"status":     assistantmodel.SessionStatusActive,
	})
	if row == nil {
		return nil, fmt.Errorf("会话不存在")
	}
	return row, nil
}

func (s Service) sessionMessages(ctx context.Context, sessionID uint64, limit int) []map[string]any {
	if sessionID == 0 {
		return []map[string]any{}
	}
	rows := assistantmodel.NewMessageModel().Select(
		ctx,
		map[string]any{"session_id": sessionID},
		map[string]any{
			"order": "main.id desc",
			"limit": clampLimit(limit, defaultMessageLimit, maxMessageLimit),
		},
	)
	result := make([]map[string]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		result = append(result, messageMap(rows[index]))
	}
	return result
}

func (s Service) touchSession(ctx context.Context, session *assistantmodel.Session, role string, text string, now time.Time) {
	session.MessageCount++
	session.LastMessageAt = now
	values := map[string]any{
		"message_count":   session.MessageCount,
		"last_message_at": now,
	}
	if role == "user" && strings.TrimSpace(text) != "" && (session.Title == "" || session.Title == "新会话") {
		session.Title = shortTitle(text)
		values["title"] = session.Title
		values["title_source"] = assistantmodel.TitleSourceAuto
		session.TitleSource = assistantmodel.TitleSourceAuto
	}
	assistantmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, values)
}

func currentOwner(ctx context.Context) (ownerScope, error) {
	uid, ok := deverjwt.ActiveInt64(ctx)
	if !ok || uid <= 0 {
		return ownerScope{}, fmt.Errorf("登录账号无效")
	}
	return ownerScope{OwnerType: assistantmodel.OwnerTypeAdmin, OwnerID: uint64(uid)}, nil
}

func normalizeContextKey(contextKey string, agentKey string) string {
	contextKey = strings.TrimSpace(contextKey)
	if contextKey != "" {
		return limitText(contextKey, 128)
	}
	agentKey = strings.TrimSpace(agentKey)
	if agentKey != "" {
		return limitText("agent:"+agentKey, 128)
	}
	return "agent"
}

func normalizeRole(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "user", "assistant", "system", "tool":
		return strings.ToLower(strings.TrimSpace(role))
	default:
		return ""
	}
}

func normalizeMemoryTags(tags []string) []string {
	seen := map[string]bool{}
	result := make([]string, 0, len(tags))
	add := func(tag string) {
		tag = strings.TrimSpace(tag)
		if tag == "" || seen[tag] {
			return
		}
		seen[tag] = true
		result = append(result, tag)
	}
	for _, tag := range tags {
		add(tag)
	}
	return result
}

func memoryMatchesSession(row memorymodel.Memory, session assistantmodel.Session) bool {
	scope := normalizeStoredMemoryScope(row)
	switch scope {
	case memorymodel.ScopeGlobal:
		return true
	case memorymodel.ScopeAgent:
		return strings.TrimSpace(row.AgentKey) == "" || strings.TrimSpace(row.AgentKey) == strings.TrimSpace(session.AgentKey)
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(session.AgentKey) &&
			normalizeContextKey(row.ContextKey, row.AgentKey) == normalizeContextKey(session.ContextKey, session.AgentKey)
	case memorymodel.ScopeSession:
		return row.SessionID > 0 && row.SessionID == session.ID
	}

	// Legacy rows before explicit scope are still readable through old tag scoping.
	tags := memoryTags(row.Tags)
	if len(tags) == 0 {
		return true
	}
	contextTag := "context:" + normalizeContextKey(session.ContextKey, session.AgentKey)
	agentTag := ""
	if strings.TrimSpace(session.AgentKey) != "" {
		agentTag = "agent:" + strings.TrimSpace(session.AgentKey)
	}
	hasScopedTag := false
	for _, tag := range tags {
		if strings.HasPrefix(tag, "context:") || strings.HasPrefix(tag, "agent:") {
			hasScopedTag = true
		}
		if tag == contextTag || (agentTag != "" && tag == agentTag) {
			return true
		}
	}
	return !hasScopedTag
}

func memoryTags(raw string) []string {
	var values []string
	if err := json.Unmarshal([]byte(strings.TrimSpace(raw)), &values); err == nil {
		result := make([]string, 0, len(values))
		for _, value := range values {
			if tag := strings.TrimSpace(value); tag != "" {
				result = append(result, tag)
			}
		}
		return result
	}
	var generic []any
	if err := json.Unmarshal([]byte(strings.TrimSpace(raw)), &generic); err != nil {
		return nil
	}
	result := make([]string, 0, len(generic))
	for _, value := range generic {
		if tag := strings.TrimSpace(fmt.Sprint(value)); tag != "" {
			result = append(result, tag)
		}
	}
	return result
}

func sessionMap(row assistantmodel.Session) map[string]any {
	return map[string]any{
		"id":              row.ID,
		"owner_type":      row.OwnerType,
		"context_key":     row.ContextKey,
		"agent_key":       row.AgentKey,
		"title":           row.Title,
		"title_source":    row.TitleSource,
		"status":          row.Status,
		"message_count":   row.MessageCount,
		"last_message_at": timeText(row.LastMessageAt),
		"created_at":      timeText(row.CreatedAt),
	}
}

func messageMap(row *assistantmodel.Message) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":         row.ID,
		"session_id": row.SessionID,
		"role":       row.Role,
		"kind":       row.Kind,
		"text":       row.Text,
		"content":    jsonValue(row.Content),
		"output":     jsonValue(row.Output),
		"request_id": row.RequestID,
		"status":     row.Status,
		"created_at": timeText(row.CreatedAt),
	}
}

func memoryMap(row *memorymodel.Memory) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":          row.ID,
		"kind":        row.Kind,
		"title":       row.Title,
		"content":     row.Content,
		"tags":        jsonValue(row.Tags),
		"importance":  row.Importance,
		"scope":       displayMemoryScope(*row),
		"agent_key":   row.AgentKey,
		"context_key": row.ContextKey,
		"session_id":  row.SessionID,
		"source":      row.Source,
		"confidence":  row.Confidence,
		"status":      row.Status,
		"created_at":  timeText(row.CreatedAt),
	}
}

func mergeMessageOutput(base any, extras map[string]any) map[string]any {
	result := map[string]any{}
	if mapped, ok := jsonValue(jsonText(base, "{}")).(map[string]any); ok {
		for key, value := range mapped {
			result[key] = value
		}
	}
	for key, value := range extras {
		result[key] = value
	}
	return result
}

func jsonText(value any, fallback string) string {
	if value == nil {
		return fallback
	}
	if text, ok := value.(string); ok {
		text = strings.TrimSpace(text)
		if text == "" {
			return fallback
		}
		if json.Valid([]byte(text)) {
			return text
		}
	}
	raw, err := json.Marshal(value)
	if err != nil || len(raw) == 0 {
		return fallback
	}
	return string(raw)
}

func jsonValue(text string) any {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	var value any
	if err := json.Unmarshal([]byte(text), &value); err != nil {
		return text
	}
	return value
}

func shortTitle(text string) string {
	text = strings.Join(strings.Fields(text), " ")
	return limitText(text, 40)
}

func limitText(text string, limit int) string {
	runes := []rune(strings.TrimSpace(text))
	if limit <= 0 || len(runes) <= limit {
		return string(runes)
	}
	return string(runes[:limit])
}

func timeText(value time.Time) string {
	if value.IsZero() {
		return ""
	}
	return value.Format(time.RFC3339Nano)
}

func normalizePage(page int, pageSize int) (int, int) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 50 {
		pageSize = 50
	}
	return page, pageSize
}

func paginationMap(page int, pageSize int, total int64) map[string]any {
	totalPages := int64(0)
	if pageSize > 0 && total > 0 {
		totalPages = (total + int64(pageSize) - 1) / int64(pageSize)
	}
	return map[string]any{
		"page":        page,
		"page_size":   pageSize,
		"total":       total,
		"total_pages": totalPages,
	}
}

func sessionStatusFilter(status string) int16 {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "", "active", "enabled", "normal":
		return assistantmodel.SessionStatusActive
	case "archived", "archive":
		return assistantmodel.SessionStatusArchived
	case "all", "*":
		return 0
	default:
		return assistantmodel.SessionStatusActive
	}
}

func clampLimit(value int, fallback int, max int) int {
	if value <= 0 {
		value = fallback
	}
	if value > max {
		return max
	}
	return value
}
