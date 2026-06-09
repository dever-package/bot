package knowledge

import (
	"context"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	frontaction "my/package/front/service/action"
)

type KnowledgeHook struct{}

func (KnowledgeHook) ProviderBeforeSaveKnowledgeCate(_ *server.Context, params []any) any {
	record := cloneRecord(params)
	partial := isPartialRecord(record)
	trimField(record, "name", partial)
	if !partial && trimText(record["name"]) == "" {
		panic(frontaction.NewFieldError("form.name", "分类名称不能为空。"))
	}
	defaultInt16(record, "status", 1, partial)
	defaultInt(record, "sort", 100, partial)
	return record
}

func (KnowledgeHook) ProviderBeforeSaveKnowledgeBase(c *server.Context, params []any) any {
	record := cloneRecord(params)
	partial := isPartialRecord(record)

	trimField(record, "name", partial)
	if !partial && trimText(record["name"]) == "" {
		panic(frontaction.NewFieldError("form.name", "知识库名称不能为空。"))
	}
	if shouldNormalize(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = agentmodel.DefaultKnowledgeCateID
	}
	existingBase := existingKnowledgeBase(c.Context(), util.ToUint64(record["id"]))
	cateID := knowledgeBaseCateID(record, existingBase)
	if !partial || shouldNormalize(record, "cate_id", partial) || shouldNormalize(record, "collection", partial) {
		record["collection"] = knowledgeCollectionName(cateID)
	}
	if shouldNormalize(record, "vector_enabled", partial) {
		record["vector_enabled"] = normalizeVectorEnabled(record["vector_enabled"])
	}
	vectorEnabled := knowledgeBaseVectorEnabled(record, existingBase)
	embeddingChanged := !partial || shouldNormalize(record, "embedding_power_id", partial) || shouldNormalize(record, "vector_enabled", partial)
	if !vectorEnabled {
		if embeddingChanged {
			record["embedding_power_id"] = 0
		}
	} else if embeddingChanged {
		ensureKnowledgeBaseEmbeddingWithFallback(c.Context(), record, existingBase)
		if err := validateKnowledgeBaseEmbedding(c.Context(), record); err != nil {
			panic(frontaction.NewFieldError("form.embedding_power_id", err.Error()))
		}
	}
	if shouldNormalize(record, "chunk_size", partial) {
		record["chunk_size"] = normalizeChunkSize(record["chunk_size"])
	}
	chunkSize := util.ToIntDefault(record["chunk_size"], agentmodel.DefaultKnowledgeChunkSize)
	if shouldNormalize(record, "chunk_overlap", partial) {
		record["chunk_overlap"] = normalizeChunkOverlap(record["chunk_overlap"], chunkSize)
	}
	if shouldNormalize(record, "retrieve_limit", partial) {
		record["retrieve_limit"] = normalizeRetrieveLimit(record["retrieve_limit"])
	}
	if shouldNormalize(record, "score_threshold", partial) {
		record["score_threshold"] = normalizeScoreThreshold(record["score_threshold"])
	}
	if shouldNormalize(record, "max_context_chars", partial) {
		record["max_context_chars"] = normalizeMaxContextChars(record["max_context_chars"])
	}
	if shouldNormalize(record, "index_status", partial) {
		record["index_status"] = normalizeIndexStatus(record["index_status"])
	}
	defaultInt16(record, "status", 1, partial)
	defaultInt(record, "sort", 100, partial)
	return record
}

func existingKnowledgeBase(ctx context.Context, baseID uint64) *agentmodel.KnowledgeBase {
	if baseID == 0 {
		return nil
	}
	return agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
}

func knowledgeBaseCateID(record map[string]any, existing *agentmodel.KnowledgeBase) uint64 {
	cateID := util.ToUint64(record["cate_id"])
	if cateID == 0 && existing != nil {
		cateID = existing.CateID
	}
	if cateID == 0 {
		return agentmodel.DefaultKnowledgeCateID
	}
	return cateID
}

func knowledgeBaseVectorEnabled(record map[string]any, existing *agentmodel.KnowledgeBase) bool {
	if _, exists := record["vector_enabled"]; exists {
		return isVectorEnabled(normalizeVectorEnabled(record["vector_enabled"]))
	}
	if existing != nil {
		return isVectorEnabled(existing.VectorEnabled)
	}
	return false
}

func ensureKnowledgeBaseEmbeddingWithFallback(ctx context.Context, record map[string]any, existing *agentmodel.KnowledgeBase) {
	if util.ToUint64(record["embedding_power_id"]) == 0 && existing != nil && existing.EmbeddingPowerID > 0 {
		record["embedding_power_id"] = existing.EmbeddingPowerID
	}
	ensureKnowledgeBaseEmbedding(ctx, record)
}

func (KnowledgeHook) ProviderAfterSaveKnowledgeBase(c *server.Context, params []any) any {
	payload := cloneRecord(params)
	baseID := savedRecordID(payload)
	if baseID == 0 {
		return nil
	}
	syncKnowledgeBaseVectorConfig(c.Context(), baseID, payload)
	return nil
}

func syncKnowledgeBaseVectorConfig(ctx context.Context, baseID uint64, payload map[string]any) {
	record, ok := firstPayloadRecord(payload)
	if !ok {
		return
	}

	update := map[string]any{}
	if value, exists := record["vector_enabled"]; exists {
		update["vector_enabled"] = normalizeVectorEnabled(value)
	}
	if value, exists := record["embedding_power_id"]; exists {
		update["embedding_power_id"] = util.ToUint64(value)
	}
	cateID := util.ToUint64(record["cate_id"])
	if cateID == 0 {
		if existing := existingKnowledgeBase(ctx, baseID); existing != nil {
			cateID = existing.CateID
		}
	}
	if cateID > 0 {
		update["collection"] = knowledgeCollectionName(cateID)
	}
	if len(update) == 0 {
		return
	}
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, update)
}

func firstPayloadRecord(payload map[string]any) (map[string]any, bool) {
	for _, key := range []string{"payload", "data", "record"} {
		if record, ok := payload[key].(map[string]any); ok {
			return record, true
		}
	}
	return payload, len(payload) > 0
}

func (KnowledgeHook) ProviderBeforeSaveAgentKnowledgeBase(_ *server.Context, params []any) any {
	record := cloneRecord(params)
	partial := isPartialRecord(record)
	if !partial && util.ToUint64(record["agent_id"]) == 0 {
		panic(frontaction.NewFieldError("form.agent_id", "智能体不能为空。"))
	}
	if !partial && util.ToUint64(record["knowledge_base_id"]) == 0 {
		panic(frontaction.NewFieldError("form.knowledge_base_id", "知识库不能为空。"))
	}
	trimField(record, "prompt", partial)
	if shouldNormalize(record, "retrieve_limit", partial) {
		record["retrieve_limit"] = normalizeOptionalRetrieveLimit(record["retrieve_limit"])
	}
	if shouldNormalize(record, "score_threshold", partial) {
		record["score_threshold"] = normalizeOptionalScoreThreshold(record["score_threshold"])
	}
	defaultInt16(record, "status", 1, partial)
	defaultInt(record, "sort", 100, partial)
	return record
}

func normalizeOptionalRetrieveLimit(value any) int {
	limit := util.ToIntDefault(value, 0)
	if limit <= 0 {
		return 0
	}
	if limit > 50 {
		return 50
	}
	return limit
}

func normalizeOptionalScoreThreshold(value any) float64 {
	score := floatValue(value)
	if score <= 0 {
		return 0
	}
	if score > 1 {
		return 1
	}
	return score
}

func cloneRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func isPartialRecord(record map[string]any) bool {
	switch value := record["_partial"].(type) {
	case bool:
		return value
	case string:
		return value == "1" || value == "true"
	default:
		return false
	}
}

func shouldNormalize(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func trimField(record map[string]any, field string, partial bool) {
	if shouldNormalize(record, field, partial) {
		record[field] = trimText(record[field])
	}
}

func defaultInt16(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalize(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultInt(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalize(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func savedRecordID(payload map[string]any) uint64 {
	if id := util.ToUint64(payload["id"]); id > 0 {
		return id
	}
	for _, key := range []string{"result", "data", "payload"} {
		if record, ok := payload[key].(map[string]any); ok {
			if id := util.ToUint64(record["id"]); id > 0 {
				return id
			}
		}
	}
	return 0
}

func startAsyncDocumentIndex(ctx context.Context, docID uint64) {
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": docID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	go func() {
		runCtx := context.Background()
		result, err := NewService().IndexDocument(runCtx, docID)
		if err != nil && result.DocID == 0 {
			agentmodel.NewKnowledgeDocModel().Update(runCtx, map[string]any{"id": docID}, map[string]any{
				"index_status":  agentmodel.KnowledgeIndexStatusFailed,
				"error_message": err.Error(),
			})
		}
	}()
}
