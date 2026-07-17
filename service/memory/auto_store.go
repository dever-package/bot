package memory

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryAutoRememberScore = 0.75
	memoryAutoUpdateScore   = 0.85
)

type CandidateRequest struct {
	Session         agentmodel.Session
	SourceMessageID uint64
	Candidate       Candidate
}

func (s Service) ReviewCandidate(ctx context.Context, request CandidateRequest) map[string]any {
	candidate := normalizeCandidate(request.Candidate)
	if candidate.Operation == "delete" {
		return s.forgetCandidate(ctx, request.Session, request.SourceMessageID, candidate)
	}
	if candidate.Operation != "upsert" || candidate.Title == "" || candidate.Content == "" || hasSensitiveMemoryContent(candidate.Content) {
		return nil
	}
	score := scoreMemoryCandidate(candidate)
	if !shouldAutoRememberMemory(candidate, score) {
		return nil
	}
	owner := memoryOwner{OwnerType: request.Session.OwnerType, OwnerID: request.Session.OwnerID}
	if existing := s.findRelatedMemory(ctx, owner, request.Session, candidate); existing != nil {
		if TextSimilar(existing.Content, candidate.Content) {
			response, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(request.Session, request.SourceMessageID, candidate))
			if err != nil {
				return nil
			}
			return memoryReview("deduped", "已更新长期记忆权重。", response, request.SourceMessageID)
		}
		if !shouldAutoUpdateMemory(candidate, score) {
			return nil
		}
		memory := s.updateExistingMemory(ctx, existing.ID, request.Session, request.SourceMessageID, candidate, score)
		if len(memory) == 0 {
			return nil
		}
		return map[string]any{
			"status": "updated", "text": fmt.Sprintf("已自动更新长期记忆：%s", candidate.Title),
			"memory": memory, "source_message_id": request.SourceMessageID,
		}
	}
	response, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(request.Session, request.SourceMessageID, candidate))
	if err != nil {
		return nil
	}
	status := "saved"
	text := fmt.Sprintf("已自动记住：%s", candidate.Title)
	if deduped, _ := response["deduped"].(bool); deduped {
		status = "deduped"
		text = "已更新长期记忆权重。"
	}
	return memoryReview(status, text, response, request.SourceMessageID)
}

func (s Service) forgetCandidate(ctx context.Context, session agentmodel.Session, sourceMessageID uint64, candidate Candidate) map[string]any {
	if candidate.MemoryID == 0 || !candidate.Explicit {
		return nil
	}
	row := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
		"id": candidate.MemoryID, "owner_type": session.OwnerType, "owner_id": session.OwnerID,
		"status": memorymodel.StatusEnabled,
	})
	if row == nil || !memoryMatchesRuntimeSession(*row, session) {
		return nil
	}
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"status": memorymodel.StatusDisabled, "updated_at": time.Now(),
	})
	return map[string]any{
		"status": "forgot", "text": "已按本轮要求清理相关记忆。",
		"memory_id": row.ID, "source_message_id": sourceMessageID,
	}
}

func normalizeCandidate(candidate Candidate) Candidate {
	candidate.Operation = strings.ToLower(strings.TrimSpace(candidate.Operation))
	if candidate.Operation != "upsert" && candidate.Operation != "delete" {
		candidate.Operation = "noop"
	}
	candidate.Key = normalizeMemoryKey(candidate.Key)
	candidate.Scope = normalizeLongTermMemoryScope(candidate.Scope)
	candidate.Kind = normalizeMemoryKind(candidate.Kind)
	if candidate.Kind == "" {
		candidate.Kind = "semantic"
	}
	candidate.Content = limitMemoryText(normalizeAutoMemoryContent(candidate.Content), 600)
	if candidate.Title == "" {
		candidate.Title = memoryTitle(candidate.Kind, candidate.Content)
	}
	candidate.Title = limitMemoryText(candidate.Title, 255)
	candidate.Importance = clampMemoryImportance(candidate.Importance)
	candidate.Confidence = clampCandidateConfidence(candidate.Confidence)
	candidate.Source = normalizeMemorySource(candidate.Source)
	return candidate
}

func scoreMemoryCandidate(candidate Candidate) float64 {
	if candidate.Explicit {
		return 1
	}
	return candidate.Confidence
}

func shouldAutoRememberMemory(candidate Candidate, score float64) bool {
	return candidate.Explicit || (candidate.Source == memorymodel.SourceLLM && score >= memoryAutoRememberScore)
}

func shouldAutoUpdateMemory(candidate Candidate, score float64) bool {
	return candidate.Explicit || score >= memoryAutoUpdateScore
}

func clampCandidateConfidence(value float64) float64 {
	if value <= 0 {
		return 0
	}
	if value > 1 {
		return 1
	}
	return value
}

func (s Service) findRelatedMemory(ctx context.Context, owner memoryOwner, session agentmodel.Session, candidate Candidate) *memorymodel.Memory {
	scopeValues := memoryScopeValues(candidate.Scope, session.ContextKey, session.AgentKey, session.ID)
	if candidate.Key != "" {
		return s.findMemoryByKey(ctx, owner, candidate.Scope, scopeValues, candidate.Key)
	}
	rows := memorymodel.NewMemoryModel().Select(ctx, memoryScopeFilter(owner, candidate.Scope, scopeValues), map[string]any{
		"order": "main.importance desc,main.id desc", "limit": 200,
	})
	for _, row := range rows {
		if row == nil {
			continue
		}
		if TextSimilar(row.Title+" "+row.Content, candidate.Title+" "+candidate.Content) ||
			(strings.TrimSpace(row.Kind) == strings.TrimSpace(candidate.Kind) &&
				TextSimilarity(NormalizeComparableText(row.Title), NormalizeComparableText(candidate.Title)) >= 0.65) {
			return row
		}
	}
	return nil
}

func (s Service) updateExistingMemory(ctx context.Context, id uint64, session agentmodel.Session, sourceMessageID uint64, candidate Candidate, score float64) map[string]any {
	values := map[string]any{
		"scope": candidate.Scope, "key": candidate.Key,
		"kind": candidate.Kind, "title": candidate.Title, "content": candidate.Content,
		"tags": encodeMemoryJSON(candidate.Tags, "[]"), "source": candidate.Source,
		"confidence":        candidate.Confidence,
		"importance":        clampMemoryImportance(firstPositive(candidate.Importance, int(score*100))),
		"source_message_id": sourceMessageID, "status": memorymodel.StatusEnabled,
		"updated_at": time.Now(),
	}
	for field, value := range memoryScopeValues(candidate.Scope, session.ContextKey, session.AgentKey, session.ID) {
		values[field] = value
	}
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": id}, values)
	return MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id}))
}

func memoryRequestFromCandidate(session agentmodel.Session, sourceMessageID uint64, candidate Candidate) MemoryRequest {
	return MemoryRequest{
		Key: candidate.Key, Kind: candidate.Kind, Title: candidate.Title, Content: candidate.Content,
		Tags: candidate.Tags, Importance: candidate.Importance,
		Scope: candidate.Scope, ContextKey: session.ContextKey,
		AgentKey: session.AgentKey, SessionID: session.ID,
		Source: candidate.Source, Confidence: candidate.Confidence,
		SourceMessageID: sourceMessageID,
	}
}

func normalizeLongTermMemoryScope(scope string) string {
	switch normalizeMemoryScope(scope) {
	case memorymodel.ScopeGlobal:
		return memorymodel.ScopeGlobal
	case memorymodel.ScopeAgent:
		return memorymodel.ScopeAgent
	default:
		return memorymodel.ScopeContext
	}
}

func memoryMatchesRuntimeSession(row memorymodel.Memory, session agentmodel.Session) bool {
	switch normalizeStoredMemoryScope(row) {
	case memorymodel.ScopeGlobal:
		return true
	case memorymodel.ScopeAgent:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(session.AgentKey)
	case memorymodel.ScopeContext:
		return strings.TrimSpace(row.AgentKey) == strings.TrimSpace(session.AgentKey) &&
			NormalizeContextKey(row.ContextKey, row.AgentKey) == NormalizeContextKey(session.ContextKey, session.AgentKey)
	case memorymodel.ScopeSession:
		return row.SessionID > 0 && row.SessionID == session.ID
	default:
		return false
	}
}

func memoryReview(status string, text string, response map[string]any, sourceMessageID uint64) map[string]any {
	memory, _ := response["memory"].(map[string]any)
	if memory == nil {
		memory = map[string]any{}
	}
	return map[string]any{
		"status": status, "text": text, "memory": memory, "source_message_id": sourceMessageID,
	}
}
