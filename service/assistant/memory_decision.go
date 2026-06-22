package assistant

import (
	"context"
	"fmt"
	"strings"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryAutoRememberScore = 0.55
	memoryAutoUpdateScore   = 0.7
)

func shouldEvaluateMemory(text string) bool {
	text = normalizeMemoryContent(text)
	if text == "" || len([]rune(text)) > 1200 || hasSensitiveMemoryContent(text) {
		return false
	}
	return explicitMemoryContent(text) != "" || looksLikeLongTermMemory(text)
}

func (s Service) rememberMemoryCandidate(ctx context.Context, owner ownerScope, session assistantmodel.Session, sourceMessageID uint64, candidate memoryCandidate) map[string]any {
	candidate = normalizeCandidate(candidate)
	if candidate.Title == "" || candidate.Content == "" || hasSensitiveMemoryContent(candidate.Content) {
		return nil
	}
	score := scoreMemoryCandidate(candidate)
	if !shouldAutoRememberMemory(candidate, score) {
		return nil
	}
	if existing := s.findRelatedMemory(ctx, owner, session, candidate); existing != nil {
		if memorySimilar(existing.Content, candidate.Content) {
			resp, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(session, candidate))
			if err != nil {
				return nil
			}
			return memoryReview("deduped", "已更新长期记忆权重。", resp, sourceMessageID)
		}
		if shouldAutoUpdateMemory(candidate, score) {
			memory := s.updateExistingMemory(ctx, existing.ID, session, candidate, score)
			if len(memory) == 0 {
				return nil
			}
			return map[string]any{
				"status":            "updated",
				"text":              fmt.Sprintf("已自动更新长期记忆：%s", candidate.Title),
				"memory":            memory,
				"source_message_id": sourceMessageID,
			}
		}
		return nil
	}
	resp, err := s.rememberForOwner(ctx, owner, memoryRequestFromCandidate(session, candidate))
	if err != nil {
		return nil
	}
	status := "saved"
	text := fmt.Sprintf("已自动记住：%s", candidate.Title)
	if deduped, _ := resp["deduped"].(bool); deduped {
		status = "deduped"
		text = "已更新长期记忆权重。"
	}
	return memoryReview(status, text, resp, sourceMessageID)
}

func normalizeCandidate(candidate memoryCandidate) memoryCandidate {
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
	candidate.Scope = memorymodel.ScopeContext
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
	if candidate.Scope == memorymodel.ScopeContext {
		score += 0.05
	}
	if score > 1 {
		return 1
	}
	return score
}

func shouldAutoRememberMemory(candidate memoryCandidate, score float64) bool {
	if candidate.Explicit {
		return true
	}
	if candidate.Source == memorymodel.SourceLLM && candidate.Confidence >= 0.65 {
		return true
	}
	if score >= memoryAutoRememberScore {
		return true
	}
	return looksLikeLongTermMemory(candidate.Content)
}

func shouldAutoUpdateMemory(candidate memoryCandidate, score float64) bool {
	return candidate.Explicit || candidate.Confidence >= 0.75 || score >= memoryAutoUpdateScore
}

func (s Service) findRelatedMemory(ctx context.Context, owner ownerScope, session assistantmodel.Session, candidate memoryCandidate) *memorymodel.Memory {
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
		if memorySimilar(row.Title+" "+row.Content, candidate.Title+" "+candidate.Content) {
			return row
		}
		if strings.TrimSpace(row.Kind) == strings.TrimSpace(candidate.Kind) &&
			memoryBigramSimilarity(normalizeMemoryComparable(row.Title), normalizeMemoryComparable(candidate.Title)) >= 0.65 {
			return row
		}
	}
	return nil
}

func (s Service) updateExistingMemory(ctx context.Context, id uint64, session assistantmodel.Session, candidate memoryCandidate, score float64) map[string]any {
	memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": id}, map[string]any{
		"scope":       memorymodel.ScopeContext,
		"agent_key":   strings.TrimSpace(session.AgentKey),
		"context_key": normalizeContextKey(session.ContextKey, session.AgentKey),
		"session_id":  session.ID,
		"kind":        candidate.Kind,
		"title":       candidate.Title,
		"content":     candidate.Content,
		"tags":        jsonText(candidate.Tags, "[]"),
		"source":      candidate.Source,
		"confidence":  candidate.Confidence,
		"importance":  clampMemoryImportance(firstPositive(candidate.Importance, int(score*100))),
		"status":      memorymodel.StatusEnabled,
	})
	return memoryMap(memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": id}))
}

func memoryRequestFromCandidate(session assistantmodel.Session, candidate memoryCandidate) MemoryRequest {
	return MemoryRequest{
		Kind:       candidate.Kind,
		Title:      candidate.Title,
		Content:    candidate.Content,
		Tags:       candidate.Tags,
		Importance: candidate.Importance,
		Scope:      memorymodel.ScopeContext,
		ContextKey: session.ContextKey,
		AgentKey:   session.AgentKey,
		SessionID:  session.ID,
		Source:     candidate.Source,
		Confidence: candidate.Confidence,
	}
}

func memoryReview(status string, text string, resp map[string]any, sourceMessageID uint64) map[string]any {
	memory := map[string]any{}
	if mapped, ok := resp["memory"].(map[string]any); ok {
		memory = mapped
	}
	return map[string]any{
		"status":            status,
		"text":              text,
		"memory":            memory,
		"source_message_id": sourceMessageID,
	}
}
