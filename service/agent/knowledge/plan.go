package knowledge

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonservice "github.com/dever-package/bot/service/energon"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	maxPlanDirectoryRows = 80
	maxPlanCatalogChars  = 12000
)

func (s Service) queryRewrite(ctx context.Context, binding agentKnowledgeBinding, query string) []string {
	query = strings.TrimSpace(query)
	if query == "" || binding.Base.IndexPowerID == 0 {
		return nil
	}
	powerKey, err := knowledgeIndexPowerKey(ctx, binding.Base.IndexPowerID)
	if err != nil {
		return nil
	}
	resp := s.gateway().Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": powerKey,
			"set": map[string]any{
				"role": queryRewriteRole(),
			},
			"input": map[string]any{
				"text": query,
			},
			"options": map[string]any{
				"stream":      false,
				"temperature": 0,
			},
		},
	})
	payload := resp.Payload()
	output := mapFromAny(payload["output"])
	raw := strings.TrimSpace(firstPlannerText(output["text"], outputJSONText(output["json"])))
	if util.ToIntDefault(payload["status"], 0) == 2 || raw == "" {
		return nil
	}
	return parseQueryRewriteResult(raw)
}

func queryRewriteRole() string {
	return "你是知识库检索的查询改写器。将用户自然语言问题转写成3-5个适合关键词检索的短查询词。只输出JSON数组，不要Markdown。格式: [\"查询词1\", \"查询词2\", \"查询词3\"]"
}

func parseQueryRewriteResult(raw string) []string {
	raw = strings.TrimSpace(raw)
	raw = trimJSONFence(raw)
	var result []string
	if err := json.Unmarshal([]byte(raw), &result); err != nil {
		return nil
	}
	cleaned := make([]string, 0, len(result))
	for _, q := range result {
		if strings.TrimSpace(q) != "" {
			cleaned = append(cleaned, strings.TrimSpace(q))
		}
	}
	if len(cleaned) == 0 {
		return nil
	}
	return cleaned
}

func (s Service) planRetrieval(ctx context.Context, binding agentKnowledgeBinding, query string) retrievalPlan {
	query = strings.TrimSpace(query)
	if query == "" || binding.Base.IndexPowerID == 0 {
		return retrievalPlan{}
	}
	catalog := planDirectoryCatalog(ctx, binding.BaseID)
	if strings.TrimSpace(catalog) == "" {
		return retrievalPlan{}
	}
	powerKey, err := knowledgeIndexPowerKey(ctx, binding.Base.IndexPowerID)
	if err != nil {
		return retrievalPlan{Error: err.Error()}
	}
	resp := s.gateway().Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": powerKey,
			"set": map[string]any{
				"role": retrievalPlannerRole(),
			},
			"input": map[string]any{
				"text": retrievalPlannerPrompt(query, catalog),
			},
			"options": map[string]any{
				"stream":      false,
				"temperature": 0,
			},
		},
	})
	payload := resp.Payload()
	output := mapFromAny(payload["output"])
	raw := strings.TrimSpace(firstPlannerText(output["text"], outputJSONText(output["json"])))
	if util.ToIntDefault(payload["status"], 0) == 2 {
		return retrievalPlan{
			Raw:   raw,
			Error: firstPlannerText(payload["msg"], output["error"], "知识库规划检索失败"),
		}
	}
	plan, err := parseRetrievalPlan(raw, output)
	if err != nil {
		plan.Raw = raw
		plan.Error = err.Error()
		return plan
	}
	plan.Raw = raw
	plan.DirIDs = planDirIDsByPath(ctx, binding.BaseID, plan.DirPaths)
	return plan
}

func retrievalPlannerRole() string {
	return strings.Join([]string{
		"你是企业知识库检索规划器。",
		"根据用户问题和知识库目录摘要，选择最可能相关的目录路径和检索关键词。",
		"只允许使用目录摘要中出现过的 dir_paths，不要编造目录。",
		"queries 返回 1-4 个适合全文检索的短查询词或短句。",
		"dir_paths 返回 0-6 个目录路径；不确定时可以返回空数组。",
		"只输出 JSON，不要 Markdown 或解释。",
		"格式: {\"queries\":[\"关键词\"],\"dir_paths\":[\"目录/路径\"],\"reason\":\"简短原因\"}",
	}, "\n")
}

func retrievalPlannerPrompt(query string, catalog string) string {
	return strings.Join([]string{
		"用户问题:",
		query,
		"",
		"知识库目录摘要:",
		catalog,
	}, "\n")
}

func planDirectoryCatalog(ctx context.Context, baseID uint64) string {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.name, main.path, main.summary, main.keywords",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": maxPlanDirectoryRows,
	})
	parts := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		path := strings.TrimSpace(row.Path)
		if path == "" {
			path = strings.TrimSpace(row.Name)
		}
		if path == "" {
			continue
		}
		line := "- " + path
		if keywords := strings.TrimSpace(row.Keywords); keywords != "" {
			line += "\n  关键词: " + keywords
		}
		if summary := strings.TrimSpace(row.Summary); summary != "" {
			line += "\n  摘要: " + summary
		}
		parts = append(parts, line)
	}
	return truncateText(strings.Join(parts, "\n"), maxPlanCatalogChars)
}

func parseRetrievalPlan(raw string, output map[string]any) (retrievalPlan, error) {
	if mapped := mapFromAny(output["json"]); len(mapped) > 0 {
		return retrievalPlanFromMap(mapped), nil
	}
	raw = trimJSONFence(strings.TrimSpace(raw))
	if raw == "" {
		return retrievalPlan{}, nil
	}
	payload := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return retrievalPlan{}, fmt.Errorf("知识库规划检索 JSON 解析失败: %s", err.Error())
	}
	return retrievalPlanFromMap(payload), nil
}

func retrievalPlanFromMap(payload map[string]any) retrievalPlan {
	plan := retrievalPlan{
		Queries:  stringListFromAny(payload["queries"], 4),
		DirPaths: stringListFromAny(firstExisting(payload, "dir_paths", "dirPaths", "directories"), 6),
		Reason:   strings.TrimSpace(frontstream.InputText(payload["reason"])),
	}
	return plan
}

func retrievalPlanMatch(binding agentKnowledgeBinding, plan retrievalPlan) []map[string]any {
	return retrievalPlanMatchWithSource(binding, "planner", plan)
}

func retrievalPlanMatchWithSource(binding agentKnowledgeBinding, source string, plan retrievalPlan) []map[string]any {
	if len(plan.Queries) == 0 && len(plan.DirIDs) == 0 && len(plan.DocIDs) == 0 && strings.TrimSpace(plan.Error) == "" {
		return nil
	}
	return []map[string]any{{
		"source":            strings.TrimSpace(source),
		"knowledge_base_id": binding.BaseID,
		"knowledge_base":    binding.Base.Name,
		"queries":           plan.Queries,
		"dir_ids":           plan.DirIDs,
		"doc_ids":           plan.DocIDs,
		"dir_paths":         plan.DirPaths,
		"reason":            plan.Reason,
		"error":             plan.Error,
	}}
}

func mergeRetrievalPlans(plans ...retrievalPlan) retrievalPlan {
	result := retrievalPlan{}
	for _, plan := range plans {
		result.Queries = append(result.Queries, plan.Queries...)
		result.DirIDs = append(result.DirIDs, plan.DirIDs...)
		result.DocIDs = append(result.DocIDs, plan.DocIDs...)
		result.DirPaths = append(result.DirPaths, plan.DirPaths...)
		if result.Reason == "" {
			result.Reason = plan.Reason
		}
		if result.Raw == "" {
			result.Raw = plan.Raw
		}
		if result.Error == "" {
			result.Error = plan.Error
		}
	}
	return normalizeRetrievalPlan(result)
}

func normalizeRetrievalPlan(plan retrievalPlan) retrievalPlan {
	plan.Queries = uniqueSummaryKeywords(plan.Queries, 8)
	plan.DirPaths = uniqueSummaryKeywords(plan.DirPaths, 8)
	plan.DirIDs = uniqueUint64s(plan.DirIDs, 20)
	plan.DocIDs = uniqueUint64s(plan.DocIDs, 30)
	return plan
}

func planDirIDsByPath(ctx context.Context, baseID uint64, paths []string) []uint64 {
	if baseID == 0 || len(paths) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	dirByPath := make(map[string]uint64, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if path := NormalizeDirPath(row.Path); path != "" {
			dirByPath[path] = row.ID
		}
	}
	ids := make([]uint64, 0, len(paths))
	seen := map[uint64]struct{}{}
	for _, path := range paths {
		id := dirByPath[NormalizeDirPath(path)]
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		ids = append(ids, id)
	}
	return ids
}

func firstExisting(values map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := values[key]; exists {
			return value
		}
	}
	return nil
}

func firstPlannerText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return ""
}

func stringListFromAny(value any, limit int) []string {
	result := make([]string, 0)
	switch current := value.(type) {
	case []any:
		for _, item := range current {
			result = append(result, frontstream.InputText(item))
		}
	case []string:
		result = append(result, current...)
	default:
		result = splitSummaryKeywords(frontstream.InputText(current))
	}
	return uniqueSummaryKeywords(result, limit)
}
