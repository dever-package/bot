package assistant

import (
	"context"
	"fmt"
	"strings"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	memorymodel "github.com/dever-package/bot/model/memory"
)

func (s Service) ChooseMemory(ctx context.Context, req MemoryChoiceRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	choice := strings.ToLower(strings.TrimSpace(req.Choice))
	if choice == "undo" {
		if req.MemoryID == 0 {
			return nil, fmt.Errorf("记忆ID不能为空")
		}
		if err := s.ForgetMemory(ctx, MemoryForgetRequest{ID: req.MemoryID}); err != nil {
			return nil, err
		}
		result := map[string]any{
			"status":  "undone",
			"text":    "已撤销这条记忆。",
			"actions": []any{},
		}
		s.updateMessageMemoryReview(ctx, owner, req.SourceMessageID, result)
		return result, nil
	}
	if req.CandidateID == 0 {
		return nil, fmt.Errorf("候选记忆ID不能为空")
	}
	row := memorymodel.NewCandidateModel().Find(ctx, map[string]any{
		"id":         req.CandidateID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
		"status":     memorymodel.CandidateStatusPending,
	})
	if row == nil {
		return nil, fmt.Errorf("候选记忆不存在或已处理")
	}
	switch choice {
	case memorymodel.CandidateActionRemember:
		memory, err := s.acceptMemoryCandidate(ctx, owner, *row, false)
		if err != nil {
			return nil, err
		}
		result := memoryChoiceReview(row, "accepted", "已记住这条记忆。", memory)
		s.updateMessageMemoryReview(ctx, owner, row.SourceMessageID, result)
		return result, nil
	case memorymodel.CandidateActionUpdate:
		memory, err := s.acceptMemoryCandidate(ctx, owner, *row, true)
		if err != nil {
			return nil, err
		}
		result := memoryChoiceReview(row, "updated", "已更新记忆。", memory)
		s.updateMessageMemoryReview(ctx, owner, row.SourceMessageID, result)
		return result, nil
	case memorymodel.CandidateActionSession:
		memory, err := s.acceptSessionMemoryCandidate(ctx, owner, *row)
		if err != nil {
			return nil, err
		}
		result := memoryChoiceReview(row, "session_only", "已设为仅本次使用。", memory)
		s.updateMessageMemoryReview(ctx, owner, row.SourceMessageID, result)
		return result, nil
	case memorymodel.CandidateActionKeepOld:
		memorymodel.NewCandidateModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": memorymodel.CandidateStatusRejected,
		})
		result := memoryChoiceReview(row, "kept_old", "已保留原记忆。", nil)
		s.updateMessageMemoryReview(ctx, owner, row.SourceMessageID, result)
		return result, nil
	case memorymodel.CandidateActionIgnore:
		memorymodel.NewCandidateModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": memorymodel.CandidateStatusRejected,
		})
		result := memoryChoiceReview(row, "rejected", "已忽略这条候选记忆。", nil)
		s.updateMessageMemoryReview(ctx, owner, row.SourceMessageID, result)
		return result, nil
	default:
		return nil, fmt.Errorf("不支持的记忆操作")
	}
}

func (s Service) acceptSessionMemoryCandidate(ctx context.Context, owner ownerScope, row memorymodel.Candidate) (map[string]any, error) {
	resp, err := s.rememberForOwner(ctx, owner, MemoryRequest{
		Kind:       row.Kind,
		Title:      row.Title,
		Content:    row.Content,
		Tags:       memoryTags(row.Tags),
		Importance: clampMemoryImportance(int(row.Score * 100)),
		Scope:      memorymodel.ScopeSession,
		ContextKey: row.ContextKey,
		AgentKey:   row.AgentKey,
		SessionID:  row.SessionID,
		Source:     row.Source,
		Confidence: row.Confidence,
	})
	if err != nil {
		return nil, err
	}
	memorymodel.NewCandidateModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"status": memorymodel.CandidateStatusAccepted,
	})
	if memory, ok := resp["memory"].(map[string]any); ok {
		return memory, nil
	}
	return map[string]any{}, nil
}

func memoryChoiceReview(row *memorymodel.Candidate, status string, text string, memory map[string]any) map[string]any {
	result := map[string]any{
		"status":            status,
		"text":              text,
		"candidate_id":      row.ID,
		"source_message_id": row.SourceMessageID,
		"title":             row.Title,
		"content":           row.Content,
		"scope":             row.Scope,
		"kind":              row.Kind,
		"actions":           []any{},
	}
	if memory != nil {
		result["memory"] = memory
	}
	return result
}

func (s Service) updateMessageMemoryReview(ctx context.Context, owner ownerScope, sourceMessageID uint64, review map[string]any) {
	if sourceMessageID == 0 || len(review) == 0 {
		return
	}
	message := assistantmodel.NewMessageModel().Find(ctx, map[string]any{"id": sourceMessageID})
	if message == nil {
		return
	}
	session := assistantmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         message.SessionID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
	})
	if session == nil {
		return
	}
	output := mergeMessageOutput(message.Output, map[string]any{"memory_review": review})
	assistantmodel.NewMessageModel().Update(ctx, map[string]any{"id": message.ID}, map[string]any{
		"output": jsonText(output, "{}"),
	})
}

func (s Service) acceptMemoryCandidate(ctx context.Context, owner ownerScope, row memorymodel.Candidate, updateExisting bool) (map[string]any, error) {
	if updateExisting && row.ExistingID > 0 {
		existing := memorymodel.NewMemoryModel().Find(ctx, map[string]any{
			"id":         row.ExistingID,
			"owner_type": owner.OwnerType,
			"owner_id":   owner.OwnerID,
		})
		if existing != nil {
			memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
				"scope":       row.Scope,
				"agent_key":   row.AgentKey,
				"context_key": row.ContextKey,
				"session_id":  row.SessionID,
				"kind":        row.Kind,
				"title":       row.Title,
				"content":     row.Content,
				"tags":        row.Tags,
				"source":      normalizeMemorySource(row.Source),
				"confidence":  row.Confidence,
				"importance":  clampMemoryImportance(int(row.Score * 100)),
				"status":      memorymodel.StatusEnabled,
			})
			memorymodel.NewCandidateModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
				"status": memorymodel.CandidateStatusAccepted,
			})
			updated := memorymodel.NewMemoryModel().Find(ctx, map[string]any{"id": existing.ID})
			return memoryMap(updated), nil
		}
	}
	resp, err := s.rememberForOwner(ctx, owner, MemoryRequest{
		Kind:       row.Kind,
		Title:      row.Title,
		Content:    row.Content,
		Tags:       memoryTags(row.Tags),
		Importance: clampMemoryImportance(int(row.Score * 100)),
		Scope:      row.Scope,
		ContextKey: row.ContextKey,
		AgentKey:   row.AgentKey,
		SessionID:  row.SessionID,
		Source:     row.Source,
		Confidence: row.Confidence,
	})
	if err != nil {
		return nil, err
	}
	memorymodel.NewCandidateModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"status": memorymodel.CandidateStatusAccepted,
	})
	if memory, ok := resp["memory"].(map[string]any); ok {
		return memory, nil
	}
	return map[string]any{}, nil
}
