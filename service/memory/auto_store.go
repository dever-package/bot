package memory

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryAutoRememberScore = 0.55
	memoryAutoUpdateScore   = 0.7
)

type CandidateRequest struct {
	Session         agentmodel.Session
	SourceMessageID uint64
	Candidate       Candidate
}

func (s Service) ReviewCandidate(ctx context.Context, request CandidateRequest) map[string]any {
	candidate := normalizeCandidate(request.Candidate)
	if candidate.Title == "" || candidate.Content == "" || hasSensitiveMemoryContent(candidate.Content) {
		return nil
	}
	score := scoreMemoryCandidate(candidate)
	if !shouldAutoRememberMemory(candidate, score) {
		return nil
	}
	owner := memoryOwner{OwnerType: request.Session.OwnerType, OwnerID: request.Session.OwnerID}
	if existing := s.findRelatedMemory(ctx, owner, request.Session, candidate); existing != nil {
		if TextSimilar(existing.Content, candidate.Content) {
			response, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(request.Session, candidate))
			if err != nil {
				return nil
			}
			return memoryReview("deduped", "已更新长期记忆权重。", response, request.SourceMessageID)
		}
		if !shouldAutoUpdateMemory(candidate, score) {
			return nil
		}
		memory := s.updateExistingMemory(ctx, existing.ID, request.Session, candidate, score)
		if len(memory) == 0 {
			return nil
		}
		return map[string]any{
			"status": "updated", "text": fmt.Sprintf("已自动更新长期记忆：%s", candidate.Title),
			"memory": memory, "source_message_id": request.SourceMessageID,
		}
	}
	response, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(request.Session, candidate))
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

func (s Service) ForgetForSession(ctx context.Context, session agentmodel.Session, target string) {
	target = NormalizeComparableText(target)
	if target == "" {
		return
	}
	rows := memorymodel.NewMemoryModel().Select(ctx, map[string]any{
		"owner_type": session.OwnerType, "owner_id": session.OwnerID,
		"status": memorymodel.StatusEnabled,
	}, map[string]any{"order": "main.importance desc,main.id desc", "limit": 120})
	for _, row := range rows {
		if row == nil || !memoryMatchesRuntimeSession(*row, session) {
			continue
		}
		if TextSimilar(target, row.Title+" "+row.Content) {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{"status": memorymodel.StatusDisabled})
		}
	}
}

func normalizeCandidate(candidate Candidate) Candidate {
	candidate.Kind = normalizeMemoryKind(candidate.Kind)
	if candidate.Kind == "" {
		candidate.Kind = inferMemoryKind(candidate.Content)
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
	score := candidate.Confidence * 0.45
	if candidate.Explicit {
		score += 0.22
	}
	if looksLikeLongTermMemory(candidate.Content) {
		score += 0.18
	}
	if length := len([]rune(candidate.Content)); length >= 12 && length <= 260 {
		score += 0.1
	}
	score += 0.05
	if score > 1 {
		return 1
	}
	return score
}

func shouldAutoRememberMemory(candidate Candidate, score float64) bool {
	return candidate.Explicit ||
		(candidate.Source == memorymodel.SourceLLM && candidate.Confidence >= 0.65) ||
		score >= memoryAutoRememberScore || looksLikeLongTermMemory(candidate.Content)
}

func shouldAutoUpdateMemory(candidate Candidate, score float64) bool {
	return candidate.Explicit || candidate.Confidence >= 0.75 || score >= memoryAutoUpdateScore
}

func clampCandidateConfidence(value float64) float64 {
	if value <= 0 {
		return 0.65
	}
	if value > 1 {
		return 1
	}
	return value
}

func (s Service) findRelatedMemory(ctx context.Context, owner memoryOwner, session agentmodel.Session, candidate Candidate) *memorymodel.Memory {
	rows := memorymodel.NewMemoryModel().Select(ctx, map[string]any{
		"owner_type": owner.OwnerType, "owner_id": owner.OwnerID, "status": memorymodel.StatusEnabled,
	}, map[string]any{"order": "main.importance desc,main.id desc", "limit": 120})
	for _, row := range rows {
		if row == nil || !memoryMatchesRuntimeSession(*row, session) {
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

func (s Service) updateExistingMemory(ctx context.Context, id uint64, session agentmodel.Session, candidate Candidate, score float64) map[string]any {
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": id}, map[string]any{
		"scope": memorymodel.ScopeContext, "agent_key": strings.TrimSpace(session.AgentKey),
		"context_key": NormalizeContextKey(session.ContextKey, session.AgentKey), "session_id": session.ID,
		"kind": candidate.Kind, "title": candidate.Title, "content": candidate.Content,
		"tags": encodeMemoryJSON(candidate.Tags, "[]"), "source": candidate.Source,
		"confidence": candidate.Confidence,
		"importance": clampMemoryImportance(firstPositive(candidate.Importance, int(score*100))),
		"status":     memorymodel.StatusEnabled,
	})
	return MemoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id}))
}

func memoryRequestFromCandidate(session agentmodel.Session, candidate Candidate) MemoryRequest {
	return MemoryRequest{
		Kind: candidate.Kind, Title: candidate.Title, Content: candidate.Content,
		Tags: candidate.Tags, Importance: candidate.Importance,
		Scope: memorymodel.ScopeContext, ContextKey: session.ContextKey,
		AgentKey: session.AgentKey, SessionID: session.ID,
		Source: candidate.Source, Confidence: candidate.Confidence,
	}
}

func memoryMatchesRuntimeSession(row memorymodel.Memory, session agentmodel.Session) bool {
	switch normalizeStoredMemoryScope(row) {
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
