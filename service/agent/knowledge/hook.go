package knowledge

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	frontaction "github.com/dever-package/front/service/action"
)

type KnowledgeHook struct{}

const (
	knowledgeIndexConfigChangedKey     = "_knowledge_index_config_changed"
	knowledgePreviousEmbeddingPowerKey = "_knowledge_previous_embedding_power_id"
)

func (KnowledgeHook) ProviderBeforeSaveKnowledgeCate(_ *server.Context, params []any) any {
	record := cloneRecord(params)
	keepRecordFields(record, knowledgeCateSaveFields)
	partial := isPartialRecord(record)
	trimField(record, "name", partial)
	if !partial && trimText(record["name"]) == "" {
		panic(frontaction.NewFieldError("form.name", "分类名称不能为空。"))
	}
	defaultInt16OnCreateOrPresent(record, "status", 1, partial)
	defaultIntOnCreateOrPresent(record, "sort", 100, partial)
	return record
}

func (KnowledgeHook) ProviderBeforeSaveKnowledgeParserService(c *server.Context, params []any) any {
	record := cloneRecord(params)
	keepRecordFields(record, knowledgeParserServiceSaveFields)
	partial := isPartialRecord(record)

	trimField(record, "name", partial)
	if !partial && trimText(record["name"]) == "" {
		panic(frontaction.NewFieldError("form.name", "服务名称不能为空。"))
	}
	if shouldNormalize(record, "provider", partial) {
		record["provider"] = normalizeParserProvider(record["provider"])
	}
	if shouldNormalize(record, "host", partial) {
		record["host"] = normalizeParserHost(record["host"])
	}
	if !partial && trimText(record["host"]) == "" {
		panic(frontaction.NewFieldError("form.host", "服务地址不能为空。"))
	}
	keepExistingParserAPIKey(c.Context(), record, partial)
	if !partial && trimText(record["api_key"]) == "" {
		panic(frontaction.NewFieldError("form.api_key", "APIKey 不能为空。"))
	}
	defaultInt16(record, "status", 1, partial)
	defaultInt(record, "sort", 100, partial)
	return record
}

func (KnowledgeHook) ProviderAttachKnowledgeParserServiceList(c *server.Context, params []any) any {
	payload := cloneRecord(params)
	rows := mapRows(payload["rows"])
	if len(rows) == 0 {
		return rows
	}

	serviceIDs := rowIDs(rows)
	if len(serviceIDs) == 0 {
		return rows
	}

	services := agentmodel.NewKnowledgeParserServiceModel().Select(c.Context(), map[string]any{
		"id": serviceIDs,
	})
	apiKeyStatus := map[uint64]bool{}
	for _, service := range services {
		if strings.TrimSpace(service.APIKey) != "" {
			apiKeyStatus[service.ID] = true
		}
	}
	for _, row := range rows {
		if apiKeyStatus[util.ToUint64(row["id"])] {
			row["api_key_status"] = "已配置"
		} else {
			row["api_key_status"] = "未配置"
		}
	}
	return rows
}

func (KnowledgeHook) ProviderBeforeSaveKnowledgeBase(c *server.Context, params []any) any {
	record := cloneRecord(params)
	keepRecordFields(record, knowledgeBaseSaveFields)
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
	if existingBase != nil && existingBase.CateID != cateID {
		panic(frontaction.NewFieldError("form.cate_id", "知识库创建后不能修改分类；如需调整，请新建知识库并迁移文件。"))
	}
	if !partial || shouldNormalize(record, "cate_id", partial) || shouldNormalize(record, "collection", partial) {
		record["collection"] = knowledgeCollectionName(cateID)
	}
	if shouldNormalize(record, "parser_service_id", partial) {
		parserServiceID, err := normalizeKnowledgeParserServiceID(c.Context(), record["parser_service_id"])
		if err != nil {
			panic(frontaction.NewFieldError("form.parser_service_id", err.Error()))
		}
		record["parser_service_id"] = parserServiceID
		if err := validateKnowledgeParserService(c.Context(), parserServiceID); err != nil {
			panic(frontaction.NewFieldError("form.parser_service_id", err.Error()))
		}
	}
	if shouldNormalize(record, "concept_graph_enabled", partial) {
		record["concept_graph_enabled"] = normalizeKnowledgeMode(record["concept_graph_enabled"])
	}
	if shouldNormalize(record, "review_required", partial) {
		record["review_required"] = util.ToBool(record["review_required"])
	}
	knowledgeMode := knowledgeModeValue(record, existingBase)
	applyKnowledgeMode := !partial || shouldNormalize(record, "concept_graph_enabled", partial)
	if applyKnowledgeMode && knowledgeMode == agentmodel.KnowledgeModeLight {
		record["index_power_id"] = uint64(0)
		record["embedding_power_id"] = uint64(0)
		record["graph_depth"] = agentmodel.DefaultKnowledgeGraphDepth
		record["score_threshold"] = agentmodel.DefaultKnowledgeScoreThreshold
	}
	if shouldNormalize(record, "index_power_id", partial) {
		indexPowerID := util.ToUint64(record["index_power_id"])
		record["index_power_id"] = indexPowerID
		if indexPowerID > 0 {
			if err := validateKnowledgePower(c.Context(), indexPowerID, "text", "索引模型"); err != nil {
				panic(frontaction.NewFieldError("form.index_power_id", err.Error()))
			}
		}
	}
	if applyKnowledgeMode && knowledgeMode == agentmodel.KnowledgeModeAdvanced && knowledgeIndexPowerIDValue(record, existingBase) == 0 {
		panic(frontaction.NewFieldError("form.index_power_id", "智能增强需要选择索引模型。"))
	}
	if shouldNormalize(record, "embedding_power_id", partial) {
		embeddingPowerID := util.ToUint64(record["embedding_power_id"])
		record["embedding_power_id"] = embeddingPowerID
		if embeddingPowerID > 0 {
			if err := validateKnowledgePower(c.Context(), embeddingPowerID, "embeddings", "向量能力"); err != nil {
				panic(frontaction.NewFieldError("form.embedding_power_id", err.Error()))
			}
		}
	}
	if err := validateKnowledgeCategoryEmbeddingPower(
		c.Context(),
		cateID,
		util.ToUint64(record["id"]),
		knowledgeEmbeddingPowerIDValue(record, existingBase),
	); err != nil {
		panic(frontaction.NewFieldError("form.embedding_power_id", err.Error()))
	}
	defaultInt16(record, "concept_graph_enabled", int16(agentmodel.KnowledgeModeLight), partial)
	if shouldNormalize(record, "node_max_length", partial) {
		record["node_max_length"] = normalizeNodeMaxLength(record["node_max_length"])
	}
	nodeMaxLength := util.ToIntDefault(record["node_max_length"], 0)
	if nodeMaxLength <= 0 && existingBase != nil {
		nodeMaxLength = existingBase.NodeMaxLength
	}
	if nodeMaxLength <= 0 {
		nodeMaxLength = agentmodel.DefaultKnowledgeNodeMaxLength
	}
	if shouldNormalize(record, "node_split_overlap", partial) {
		record["node_split_overlap"] = normalizeNodeSplitOverlap(record["node_split_overlap"], nodeMaxLength)
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
	if shouldNormalize(record, "graph_depth", partial) {
		record["graph_depth"] = normalizeGraphDepth(record["graph_depth"])
	}
	defaultInt16(record, "status", 1, partial)
	defaultInt(record, "sort", 100, partial)
	if existingBase != nil && knowledgeBaseIndexConfigChanged(record, existingBase) {
		if activeKnowledgeIndexLease(c.Context(), existingBase.ID) {
			panic(frontaction.NewFieldError("form.concept_graph_enabled", "知识库正在索引中，请完成后再修改索引配置。"))
		}
		record[knowledgeIndexConfigChangedKey] = true
	}
	if existingBase != nil && knowledgeEmbeddingPowerIDValue(record, existingBase) != existingBase.EmbeddingPowerID {
		record[knowledgePreviousEmbeddingPowerKey] = existingBase.EmbeddingPowerID
	}
	return record
}

func normalizeKnowledgeMode(value any) int16 {
	switch int16(util.ToIntDefault(value, int(agentmodel.KnowledgeModeLight))) {
	case agentmodel.KnowledgeModeAdvanced:
		return agentmodel.KnowledgeModeAdvanced
	default:
		return agentmodel.KnowledgeModeLight
	}
}

func knowledgeModeValue(record map[string]any, existing *agentmodel.KnowledgeBase) int16 {
	if value, exists := record["concept_graph_enabled"]; exists {
		return normalizeKnowledgeMode(value)
	}
	if existing != nil {
		return normalizeKnowledgeMode(existing.ConceptGraphEnabled)
	}
	return agentmodel.KnowledgeModeLight
}

func knowledgeIndexPowerIDValue(record map[string]any, existing *agentmodel.KnowledgeBase) uint64 {
	if value, exists := record["index_power_id"]; exists {
		return util.ToUint64(value)
	}
	if existing != nil {
		return existing.IndexPowerID
	}
	return 0
}

func knowledgeEmbeddingPowerIDValue(record map[string]any, existing *agentmodel.KnowledgeBase) uint64 {
	if value, exists := record["embedding_power_id"]; exists {
		return util.ToUint64(value)
	}
	if existing != nil {
		return existing.EmbeddingPowerID
	}
	return 0
}

func validateKnowledgeCategoryEmbeddingPower(ctx context.Context, cateID uint64, baseID uint64, powerID uint64) error {
	if cateID == 0 || powerID == 0 {
		return nil
	}
	filters := map[string]any{
		"cate_id":            cateID,
		"embedding_power_id": map[string]any{"gt": 0},
	}
	if baseID > 0 {
		filters["id"] = map[string]any{"neq": baseID}
	}
	other := agentmodel.NewKnowledgeBaseModel().Find(ctx, filters)
	if other != nil && other.EmbeddingPowerID != powerID {
		return fmt.Errorf("同一知识库分类共享向量集合，必须使用相同的向量能力。")
	}
	return nil
}

func knowledgeBaseIndexConfigChanged(record map[string]any, existing *agentmodel.KnowledgeBase) bool {
	if existing == nil {
		return false
	}
	return recordUint64(record, "parser_service_id", existing.ParserServiceID) != existing.ParserServiceID ||
		recordUint64(record, "index_power_id", existing.IndexPowerID) != existing.IndexPowerID ||
		recordInt16(record, "concept_graph_enabled", existing.ConceptGraphEnabled) != existing.ConceptGraphEnabled ||
		recordUint64(record, "embedding_power_id", existing.EmbeddingPowerID) != existing.EmbeddingPowerID ||
		recordInt(record, "node_max_length", existing.NodeMaxLength) != existing.NodeMaxLength ||
		recordInt(record, "node_split_overlap", existing.NodeSplitOverlap) != existing.NodeSplitOverlap
}

func recordUint64(record map[string]any, field string, fallback uint64) uint64 {
	if value, exists := record[field]; exists {
		return util.ToUint64(value)
	}
	return fallback
}

func recordInt(record map[string]any, field string, fallback int) int {
	if value, exists := record[field]; exists {
		return util.ToIntDefault(value, fallback)
	}
	return fallback
}

func recordInt16(record map[string]any, field string, fallback int16) int16 {
	return int16(recordInt(record, field, int(fallback)))
}

func markKnowledgeBaseIndexPending(ctx context.Context, baseID uint64) {
	if baseID == 0 {
		return
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusPending,
		"error_message": "",
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusPending,
		"error_message": "",
	})
}

func normalizeParserProvider(value any) string {
	provider := strings.ToLower(strings.TrimSpace(util.ToString(value)))
	if provider == "" {
		return agentmodel.KnowledgeParserProviderMinerU
	}
	if provider != agentmodel.KnowledgeParserProviderMinerU {
		panic(frontaction.NewFieldError("form.provider", "当前仅支持 MinerU 服务。"))
	}
	return provider
}

func normalizeKnowledgeParserServiceID(ctx context.Context, value any) (uint64, error) {
	if emptyRelationValue(value) {
		return 0, nil
	}
	if id := relationValueID(value); id > 0 {
		return id, nil
	}
	if name := relationValueLabel(value); name != "" {
		row := agentmodel.NewKnowledgeParserServiceModel().Find(ctx, map[string]any{"name": name})
		if row != nil {
			return row.ID, nil
		}
	}
	return 0, fmt.Errorf("文档解析服务不存在。")
}

func emptyRelationValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64:
		return util.ToUint64(current) == 0
	case map[string]any:
		return relationValueID(current) == 0 && relationValueLabel(current) == ""
	default:
		return false
	}
}

func relationValueID(value any) uint64 {
	if id := util.ToUint64(value); id > 0 {
		return id
	}
	row, ok := value.(map[string]any)
	if !ok {
		return 0
	}
	for _, key := range []string{"id", "value", "raw_id"} {
		if id := util.ToUint64(row[key]); id > 0 {
			return id
		}
	}
	return 0
}

func relationValueLabel(value any) string {
	row, ok := value.(map[string]any)
	if !ok {
		return strings.TrimSpace(util.ToString(value))
	}
	for _, key := range []string{"name", "label", "value"} {
		label := strings.TrimSpace(util.ToString(row[key]))
		if label != "" {
			return label
		}
	}
	return ""
}

func validateKnowledgeParserService(ctx context.Context, serviceID uint64) error {
	if serviceID == 0 {
		return nil
	}
	row := agentmodel.NewKnowledgeParserServiceModel().Find(ctx, map[string]any{"id": serviceID})
	if row == nil {
		return fmt.Errorf("文档解析服务不存在。")
	}
	if row.Status != 1 {
		return fmt.Errorf("文档解析服务已停用。")
	}
	return nil
}

func normalizeParserHost(value any) string {
	return strings.TrimRight(strings.TrimSpace(util.ToString(value)), "/")
}

func keepExistingParserAPIKey(ctx context.Context, record map[string]any, partial bool) {
	if !shouldNormalize(record, "api_key", partial) {
		return
	}
	record["api_key"] = strings.TrimSpace(util.ToString(record["api_key"]))
	if record["api_key"] != "" {
		return
	}
	serviceID := util.ToUint64(record["id"])
	if serviceID == 0 {
		return
	}
	existing := agentmodel.NewKnowledgeParserServiceModel().Find(ctx, map[string]any{"id": serviceID})
	if existing != nil {
		record["api_key"] = existing.APIKey
	}
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

func validateKnowledgePower(ctx context.Context, powerID uint64, kind string, label string) error {
	if powerID == 0 {
		return fmt.Errorf("%s不能为空。", label)
	}
	row := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	if row == nil {
		return fmt.Errorf("%s不存在。", label)
	}
	if row.Status != 1 {
		return fmt.Errorf("%s已停用。", label)
	}
	if strings.ToLower(strings.TrimSpace(row.Kind)) != kind {
		return fmt.Errorf("%s必须选择%s类型能力。", label, knowledgePowerKindLabel(kind))
	}
	return nil
}

func knowledgePowerKindLabel(kind string) string {
	switch kind {
	case "text":
		return "文本"
	case "embeddings":
		return "向量"
	default:
		return kind
	}
}

func (KnowledgeHook) ProviderAfterSaveKnowledgeBase(c *server.Context, params []any) any {
	payload := cloneRecord(params)
	baseID := savedRecordID(payload)
	if baseID == 0 {
		return nil
	}
	syncKnowledgeBaseVectorConfig(c.Context(), baseID, payload)
	record, hasRecord := firstPayloadRecord(payload)
	if hasRecord && util.ToBool(record[knowledgeIndexConfigChangedKey]) {
		markKnowledgeBaseIndexPending(c.Context(), baseID)
	}
	if hasRecord {
		if previousPowerID, changed := record[knowledgePreviousEmbeddingPowerKey]; changed {
			base := existingKnowledgeBase(c.Context(), baseID)
			if base != nil {
				if err := resetKnowledgeBaseVectorsForEmbeddingChange(c.Context(), *base, util.ToUint64(previousPowerID)); err != nil {
					agentmodel.NewKnowledgeBaseModel().Update(c.Context(), map[string]any{"id": baseID}, map[string]any{
						"error_message": "清理旧向量索引失败: " + err.Error(),
					})
				}
			}
		}
	}
	StartLightPendingIndex(c.Context(), baseID)
	return nil
}

func syncKnowledgeBaseVectorConfig(ctx context.Context, baseID uint64, payload map[string]any) {
	record, ok := firstPayloadRecord(payload)
	if !ok {
		return
	}

	update := map[string]any{}
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

func normalizeGraphDepth(value any) int {
	depth := util.ToIntDefault(value, agentmodel.DefaultKnowledgeGraphDepth)
	if depth < 0 {
		return 0
	}
	if depth > 3 {
		return 3
	}
	return depth
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

func mapRows(value any) []map[string]any {
	switch rows := value.(type) {
	case []map[string]any:
		return rows
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, item := range rows {
			row, ok := item.(map[string]any)
			if ok {
				result = append(result, row)
			}
		}
		return result
	default:
		return nil
	}
}

func rowIDs(rows []map[string]any) []uint64 {
	seen := map[uint64]struct{}{}
	result := make([]uint64, 0, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}

var (
	knowledgeCateSaveFields = fieldSet(
		"id",
		"_partial",
		"name",
		"status",
		"sort",
	)
	knowledgeParserServiceSaveFields = fieldSet(
		"id",
		"_partial",
		"name",
		"provider",
		"host",
		"api_key",
		"status",
		"sort",
	)
	knowledgeBaseSaveFields = fieldSet(
		"id",
		"_partial",
		"cate_id",
		"name",
		"parser_service_id",
		"index_power_id",
		"concept_graph_enabled",
		"review_required",
		"embedding_power_id",
		"node_max_length",
		"node_split_overlap",
		"retrieve_limit",
		"score_threshold",
		"max_context_chars",
		"graph_depth",
		"status",
		"sort",
	)
)

func fieldSet(fields ...string) map[string]struct{} {
	result := make(map[string]struct{}, len(fields))
	for _, field := range fields {
		result[field] = struct{}{}
	}
	return result
}

func keepRecordFields(record map[string]any, allowed map[string]struct{}) {
	for field := range record {
		if _, ok := allowed[field]; !ok {
			delete(record, field)
		}
	}
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

func defaultInt16OnCreateOrPresent(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldDefaultOnCreateOrPresent(record, field, partial) {
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

func defaultIntOnCreateOrPresent(record map[string]any, field string, fallback int, partial bool) {
	if !shouldDefaultOnCreateOrPresent(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldDefaultOnCreateOrPresent(record map[string]any, field string, partial bool) bool {
	if partial {
		_, exists := record[field]
		return exists
	}
	if _, exists := record[field]; exists {
		return true
	}
	return util.ToUint64(record["id"]) == 0
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
