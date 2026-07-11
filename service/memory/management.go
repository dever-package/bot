package memory

import (
	"context"
	"fmt"
	"strings"
	"time"

	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryScopeCurrent  = "current"
	memoryScopeAll      = "all"
	memoryReviewMaxRows = 500
)

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
	if title := strings.TrimSpace(request.Title); title != "" {
		values["title"] = limitMemoryText(title, 255)
	}
	if content := strings.TrimSpace(request.Content); content != "" {
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
	if scope := normalizeMemoryScope(request.Scope); scope != "" {
		values["scope"] = scope
	}
	if request.ContextKey != "" {
		values["context_key"] = NormalizeContextKey(request.ContextKey, request.AgentKey)
	}
	if request.AgentKey != "" {
		values["agent_key"] = strings.TrimSpace(request.AgentKey)
	}
	if request.SessionID > 0 {
		values["session_id"] = request.SessionID
	}
	if request.Confidence > 0 {
		values["confidence"] = clampMemoryConfidence(request.Confidence)
	}
	if request.Tags != nil {
		values["tags"] = encodeMemoryJSON(normalizeMemoryTags(request.Tags), "[]")
	}
	if len(values) > 0 {
		memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, values)
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
		memorymodel.NewMemoryModel().Delete(ctx, map[string]any{"id": row.ID})
		return nil
	}
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{"status": memorymodel.StatusDisabled})
	return nil
}

func (s Service) rememberForOwner(ctx context.Context, owner memoryOwner, request MemoryRequest) (map[string]any, error) {
	title := strings.TrimSpace(request.Title)
	content := strings.TrimSpace(request.Content)
	if title == "" {
		return nil, fmt.Errorf("记忆标题不能为空")
	}
	if content == "" {
		return nil, fmt.Errorf("记忆内容不能为空")
	}
	kind := normalizeMemoryKind(request.Kind)
	if kind == "" {
		kind = "semantic"
	}
	scope := resolveMemoryScope(request.Scope, request.ContextKey, request.AgentKey, request.SessionID)
	contextKey := NormalizeContextKey(request.ContextKey, request.AgentKey)
	if existing := s.findSimilarMemory(ctx, owner, scope, contextKey, request.AgentKey, request.SessionID, title, content); existing != nil {
		importance := clampMemoryImportance(request.Importance)
		if importance > existing.Importance {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": existing.ID}, map[string]any{"importance": importance})
			existing.Importance = importance
		}
		return map[string]any{"memory": MemoryMap(existing), "deduped": true}, nil
	}
	id := uint64(memorymodel.NewMemoryModel().Insert(ctx, map[string]any{
		"owner_type":  owner.OwnerType,
		"owner_id":    owner.OwnerID,
		"scope":       scope,
		"agent_key":   strings.TrimSpace(request.AgentKey),
		"context_key": contextKey,
		"session_id":  request.SessionID,
		"kind":        kind,
		"title":       limitMemoryText(title, 255),
		"content":     content,
		"tags":        encodeMemoryJSON(normalizeMemoryTags(request.Tags), "[]"),
		"source":      normalizeMemorySource(request.Source),
		"confidence":  clampMemoryConfidence(request.Confidence),
		"importance":  clampMemoryImportance(request.Importance),
		"status":      memorymodel.StatusEnabled,
		"created_at":  time.Now(),
	}))
	if id == 0 {
		return nil, fmt.Errorf("保存记忆失败")
	}
	return map[string]any{"memory": MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id}))}, nil
}
