package assistant

import (
	"context"
	"fmt"
	"strings"
	"time"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
)

func shouldEvaluateMemory(text string) bool {
	text = normalizeMemoryContent(text)
	if text == "" || len([]rune(text)) > 1200 || hasSensitiveMemoryContent(text) {
		return false
	}
	return explicitMemoryContent(text) != "" || looksLikeLongTermMemory(text)
}

func (s Service) handleMemoryCandidate(ctx context.Context, owner ownerScope, session assistantmodel.Session, sourceMessageID uint64, candidate memoryCandidate) map[string]any {
	candidate = normalizeCandidate(session, candidate)
	if candidate.Title == "" || candidate.Content == "" || hasSensitiveMemoryContent(candidate.Content) {
		return nil
	}
	score := scoreMemoryCandidate(candidate)
	existing := s.findSimilarMemory(ctx, owner, candidate.Scope, session.ContextKey, session.AgentKey, session.ID, candidate.Title, candidate.Content)
	if existing != nil && memoryConflicts(*existing, candidate) {
		return s.createMemoryCandidateReview(ctx, owner, session, sourceMessageID, candidate, existing, score, "conflict")
	}
	if score >= memoryAutoSaveScore {
		resp, err := s.rememberForOwner(ctx, owner, MemoryRequest{
			Kind:       candidate.Kind,
			Title:      candidate.Title,
			Content:    candidate.Content,
			Tags:       candidate.Tags,
			Importance: candidate.Importance,
			Scope:      candidate.Scope,
			ContextKey: session.ContextKey,
			AgentKey:   session.AgentKey,
			SessionID:  session.ID,
			Source:     candidate.Source,
			Confidence: candidate.Confidence,
		})
		if err != nil {
			return nil
		}
		memory := map[string]any{}
		if mapped, ok := resp["memory"].(map[string]any); ok {
			memory = mapped
		}
		return map[string]any{
			"status":            "saved",
			"text":              fmt.Sprintf("已记住：%s", candidate.Title),
			"memory":            memory,
			"source_message_id": sourceMessageID,
			"actions": []map[string]any{
				{"key": "undo", "label": "撤销", "memory_id": memory["id"]},
			},
		}
	}
	if candidate.Explicit || score >= memoryConfirmationScore || existing != nil {
		return s.createMemoryCandidateReview(ctx, owner, session, sourceMessageID, candidate, existing, score, "confirm")
	}
	return nil
}

func normalizeCandidate(session assistantmodel.Session, candidate memoryCandidate) memoryCandidate {
	candidate.Kind = normalizeMemoryKind(candidate.Kind)
	if candidate.Kind == "" {
		candidate.Kind = inferMemoryKind(candidate.Content)
	}
	candidate.Content = limitText(normalizeMemoryContent(candidate.Content), 600)
	if candidate.Title == "" {
		candidate.Title = memoryTitle(candidate.Kind, candidate.Content)
	}
	candidate.Title = limitText(candidate.Title, 255)
	candidate.Importance = clampMemoryImportance(candidate.Importance)
	candidate.Confidence = clampCandidateConfidence(candidate.Confidence)
	candidate.Scope = resolveMemoryScope(candidate.Scope, session.ContextKey, session.AgentKey, session.ID)
	candidate.Source = normalizeMemorySource(candidate.Source)
	return candidate
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

func scoreMemoryCandidate(candidate memoryCandidate) float64 {
	score := candidate.Confidence * 0.45
	if candidate.Explicit {
		score += 0.22
	}
	if looksLikeLongTermMemory(candidate.Content) {
		score += 0.18
	}
	if len([]rune(candidate.Content)) >= 12 && len([]rune(candidate.Content)) <= 260 {
		score += 0.1
	}
	if candidate.Scope == memorymodel.ScopeContext || candidate.Scope == memorymodel.ScopeAgent {
		score += 0.05
	}
	if score > 1 {
		return 1
	}
	return score
}

func memoryConflicts(existing memorymodel.Memory, candidate memoryCandidate) bool {
	current := normalizeMemoryComparable(existing.Content)
	next := normalizeMemoryComparable(candidate.Content)
	if current == "" || next == "" {
		return false
	}
	if memorySimilar(current, next) {
		return false
	}
	title := normalizeMemoryComparable(existing.Title)
	nextTitle := normalizeMemoryComparable(candidate.Title)
	return title != "" && nextTitle != "" && memoryBigramSimilarity(title, nextTitle) >= 0.65
}

func (s Service) createMemoryCandidateReview(ctx context.Context, owner ownerScope, session assistantmodel.Session, sourceMessageID uint64, candidate memoryCandidate, existing *memorymodel.Memory, score float64, reviewType string) map[string]any {
	now := time.Now()
	existingID := uint64(0)
	existingMap := map[string]any{}
	if existing != nil {
		existingID = existing.ID
		existingMap = memoryMap(existing)
	}
	id := uint64(memorymodel.NewCandidateModel().Insert(ctx, map[string]any{
		"owner_type":        owner.OwnerType,
		"owner_id":          owner.OwnerID,
		"agent_key":         strings.TrimSpace(session.AgentKey),
		"context_key":       normalizeContextKey(session.ContextKey, session.AgentKey),
		"session_id":        session.ID,
		"source_message_id": sourceMessageID,
		"existing_id":       existingID,
		"scope":             candidate.Scope,
		"kind":              candidate.Kind,
		"title":             candidate.Title,
		"content":           candidate.Content,
		"reason":            candidate.Reason,
		"tags":              jsonText(candidate.Tags, "[]"),
		"source":            candidate.Source,
		"confidence":        candidate.Confidence,
		"score":             score,
		"status":            memorymodel.CandidateStatusPending,
		"created_at":        now,
	}))
	if id == 0 {
		return nil
	}
	actions := []map[string]any{
		{"key": memorymodel.CandidateActionRemember, "label": "记住"},
		{"key": memorymodel.CandidateActionSession, "label": "仅本次使用"},
		{"key": memorymodel.CandidateActionIgnore, "label": "不要记住"},
	}
	if reviewType == "conflict" {
		actions = []map[string]any{
			{"key": memorymodel.CandidateActionUpdate, "label": "更新记忆"},
			{"key": memorymodel.CandidateActionKeepOld, "label": "保留原记忆"},
			{"key": memorymodel.CandidateActionSession, "label": "仅本次使用"},
		}
	}
	return map[string]any{
		"status":            "pending",
		"type":              reviewType,
		"candidate_id":      id,
		"source_message_id": sourceMessageID,
		"title":             candidate.Title,
		"content":           candidate.Content,
		"scope":             candidate.Scope,
		"kind":              candidate.Kind,
		"confidence":        candidate.Confidence,
		"score":             score,
		"reason":            candidate.Reason,
		"existing":          existingMap,
		"actions":           actions,
	}
}
