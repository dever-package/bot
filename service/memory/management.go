package memory

import (
	"context"
	"fmt"
	"strings"
	"time"

	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryScopeCurrent = "current"
	memoryScopeAll     = "all"
)

type MemoryRequest struct {
	Key             string
	Kind            string
	Title           string
	Content         string
	Tags            []string
	Importance      int
	Scope           string
	ContextKey      string
	AgentKey        string
	SessionID       uint64
	Source          string
	Confidence      float64
	SourceMessageID uint64
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
	Key        string
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

type memoryOwner struct {
	OwnerType string
	OwnerID   uint64
}

func (s Service) ReviewMemories(ctx context.Context, request MemoryListRequest) (map[string]any, error) {
	owner, err := currentMemoryOwner(ctx)
	if err != nil {
		return nil, err
	}
	rows, total, page, pageSize := s.reviewMemoryRows(ctx, owner, request)
	return map[string]any{
		"memories":   rows,
		"pagination": memoryPaginationMap(page, pageSize, total),
	}, nil
}

func (s Service) Remember(ctx context.Context, request MemoryRequest) (map[string]any, error) {
	owner, err := currentMemoryOwner(ctx)
	if err != nil {
		return nil, err
	}
	return s.rememberForOwner(ctx, owner, request)
}

func (Service) UpdateMemory(ctx context.Context, request MemoryUpdateRequest) (map[string]any, error) {
	owner, err := currentMemoryOwner(ctx)
	if err != nil {
		return nil, err
	}
	if request.ID == 0 {
		return nil, fmt.Errorf("记忆ID不能为空")
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
		"id": request.ID, "owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
	})
	if row == nil {
		return nil, fmt.Errorf("记忆不存在")
	}
	values := map[string]any{}
	key := row.Key
	if requestedKey := normalizeMemoryKey(request.Key); requestedKey != "" {
		values["key"] = requestedKey
		key = requestedKey
	}
	title := row.Title
	if requestedTitle := strings.TrimSpace(request.Title); requestedTitle != "" {
		title = requestedTitle
	}
	content := row.Content
	if requestedContent := strings.TrimSpace(request.Content); requestedContent != "" {
		content = requestedContent
	}
	tags := storedMemoryTags(row.Tags)
	if request.Tags != nil {
		tags = request.Tags
	}
	title, content, tags, err = prepareMemoryFields(title, content, tags)
	contentChanged := strings.TrimSpace(request.Title) != "" || strings.TrimSpace(request.Content) != "" || request.Tags != nil
	if err != nil && (contentChanged || request.Status != memorymodel.StatusDisabled) {
		return nil, err
	}
	if strings.TrimSpace(request.Title) != "" {
		values["title"] = title
	}
	if strings.TrimSpace(request.Content) != "" {
		values["content"] = content
	}
	if kind := normalizeMemoryKind(request.Kind); kind != "" {
		values["kind"] = kind
	}
	if request.Importance > 0 {
		values["importance"] = clampMemoryImportance(request.Importance)
	}
	if request.Status == memorymodel.StatusEnabled || request.Status == memorymodel.StatusDisabled {
		values["status"] = request.Status
	}
	scope := normalizeStoredMemoryScope(*row)
	agentKey := row.AgentKey
	contextKey := row.ContextKey
	sessionID := row.SessionID
	if requestedScope := normalizeMemoryScope(request.Scope); requestedScope != "" {
		scope = requestedScope
		agentKey = strings.TrimSpace(request.AgentKey)
		contextKey = request.ContextKey
		sessionID = request.SessionID
		values["scope"] = scope
		for field, value := range memoryScopeValues(scope, contextKey, agentKey, sessionID) {
			values[field] = value
		}
	} else {
		if request.ContextKey != "" {
			contextKey = request.ContextKey
		}
		if request.AgentKey != "" {
			agentKey = strings.TrimSpace(request.AgentKey)
		}
		if request.SessionID > 0 {
			sessionID = request.SessionID
		}
		if request.ContextKey != "" || request.AgentKey != "" || request.SessionID > 0 {
			for field, value := range memoryScopeValues(scope, contextKey, agentKey, sessionID) {
				values[field] = value
			}
		}
	}
	if request.Confidence > 0 {
		values["confidence"] = clampMemoryConfidence(request.Confidence)
	}
	if request.Tags != nil {
		values["tags"] = encodeMemoryJSON(tags, "[]")
	}
	if len(values) > 0 {
		scopeValues := memoryScopeValues(scope, contextKey, agentKey, sessionID)
		values["dedupe_key"] = memoryDedupeColumn(memoryDedupeKey(owner, scope, scopeValues, key, title, content))
		values["updated_at"] = time.Now()
		if _, updateErr := updateMemoryRecord(ctx, row.ID, values); updateErr != nil {
			return nil, updateErr
		}
		row = memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": row.ID})
	}
	return map[string]any{"memory": MemoryMap(row)}, nil
}

func (Service) ForgetMemory(ctx context.Context, request MemoryForgetRequest) error {
	owner, err := currentMemoryOwner(ctx)
	if err != nil {
		return err
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
		"id": request.ID, "owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
	})
	if row == nil {
		return fmt.Errorf("记忆不存在")
	}
	if request.Hard {
		_, err = deleteMemoryRecord(ctx, row.ID)
		return err
	}
	_, err = updateMemoryRecord(ctx, row.ID, map[string]any{
		"status": memorymodel.StatusDisabled, "updated_at": time.Now(),
	})
	return err
}

func (s Service) rememberForOwner(ctx context.Context, owner memoryOwner, request MemoryRequest) (map[string]any, error) {
	title, content, tags, err := prepareMemoryFields(request.Title, request.Content, request.Tags)
	if err != nil {
		return nil, err
	}
	if title == "" {
		return nil, fmt.Errorf("记忆标题不能为空")
	}
	if content == "" {
		return nil, fmt.Errorf("记忆内容不能为空")
	}
	request.Title = title
	request.Content = content
	request.Tags = tags
	kind := normalizeMemoryKind(request.Kind)
	if kind == "" {
		kind = "semantic"
	}
	scope := resolveMemoryScope(request.Scope, request.ContextKey, request.AgentKey, request.SessionID)
	key := normalizeMemoryKey(request.Key)
	scopeValues := memoryScopeValues(scope, request.ContextKey, request.AgentKey, request.SessionID)
	dedupeKey := memoryDedupeKey(owner, scope, scopeValues, key, title, content)
	if key != "" {
		if existing := s.findMemoryByKey(ctx, owner, scope, scopeValues, key); existing != nil {
			values := memoryContentValues(request, key, scope, scopeValues, dedupeKey)
			if _, updateErr := updateMemoryRecord(ctx, existing.ID, values); updateErr != nil {
				return nil, updateErr
			}
			return map[string]any{
				"memory":  MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": existing.ID})),
				"deduped": true,
			}, nil
		}
	}
	if existing := findMemoryByDedupeKey(ctx, dedupeKey); existing != nil {
		values := memoryContentValues(request, key, scope, scopeValues, dedupeKey)
		if _, updateErr := updateMemoryRecord(ctx, existing.ID, values); updateErr != nil {
			return nil, updateErr
		}
		return map[string]any{
			"memory":  MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": existing.ID})),
			"deduped": true,
		}, nil
	}
	contextKey, _ := scopeValues["context_key"].(string)
	if existing := s.findSimilarMemory(ctx, owner, scope, contextKey, request.AgentKey, request.SessionID, title, content); existing != nil {
		values := map[string]any{
			"dedupe_key": memoryDedupeColumn(dedupeKey),
			"updated_at": time.Now(),
		}
		importance := clampMemoryImportance(request.Importance)
		if importance > existing.Importance {
			values["importance"] = importance
		}
		if _, updateErr := updateMemoryRecord(ctx, existing.ID, values); updateErr != nil {
			return nil, updateErr
		}
		return map[string]any{
			"memory":  MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": existing.ID})),
			"deduped": true,
		}, nil
	}
	record := map[string]any{
		"owner_type":        owner.OwnerType,
		"owner_id":          owner.OwnerID,
		"scope":             scope,
		"key":               key,
		"dedupe_key":        memoryDedupeColumn(dedupeKey),
		"kind":              kind,
		"title":             title,
		"content":           content,
		"tags":              encodeMemoryJSON(tags, "[]"),
		"source":            normalizeMemorySource(request.Source),
		"confidence":        clampMemoryConfidence(request.Confidence),
		"importance":        clampMemoryImportance(request.Importance),
		"source_message_id": request.SourceMessageID,
		"status":            memorymodel.StatusEnabled,
		"created_at":        time.Now(),
		"updated_at":        time.Now(),
	}
	for field, value := range scopeValues {
		record[field] = value
	}
	id, insertErr := insertMemoryRecord(ctx, record)
	if insertErr != nil || id == 0 {
		if existing := findMemoryByDedupeKey(ctx, dedupeKey); existing != nil {
			values := memoryContentValues(request, key, scope, scopeValues, dedupeKey)
			if _, updateErr := updateMemoryRecord(ctx, existing.ID, values); updateErr != nil {
				return nil, updateErr
			}
			return map[string]any{
				"memory":  MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": existing.ID})),
				"deduped": true,
			}, nil
		}
		if insertErr != nil {
			return nil, insertErr
		}
		return nil, fmt.Errorf("保存记忆失败")
	}
	return map[string]any{"memory": MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id}))}, nil
}

func memoryContentValues(request MemoryRequest, key string, scope string, scopeValues map[string]any, dedupeKey *string) map[string]any {
	values := map[string]any{
		"scope": scope, "key": key, "kind": firstMemoryKind(request.Kind),
		"dedupe_key": memoryDedupeColumn(dedupeKey),
		"title":      request.Title, "content": request.Content,
		"tags":   encodeMemoryJSON(request.Tags, "[]"),
		"source": normalizeMemorySource(request.Source), "confidence": clampMemoryConfidence(request.Confidence),
		"importance": clampMemoryImportance(request.Importance), "status": memorymodel.StatusEnabled,
		"source_message_id": request.SourceMessageID, "updated_at": time.Now(),
	}
	for field, value := range scopeValues {
		values[field] = value
	}
	return values
}

func firstMemoryKind(kind string) string {
	if kind = normalizeMemoryKind(kind); kind != "" {
		return kind
	}
	return "semantic"
}
