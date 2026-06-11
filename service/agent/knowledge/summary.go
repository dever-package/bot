package knowledge

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	energonservice "my/package/bot/service/energon"
	frontstream "my/package/front/service/stream"
)

const maxSummarySourceChars = 12000

type knowledgeSummary struct {
	Summary  string   `json:"summary"`
	Keywords []string `json:"keywords"`
}

func (s Service) refreshDocumentSummary(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) error {
	content := strings.TrimSpace(doc.Content)
	if content == "" {
		content = documentNodeSource(ctx, doc.ID)
	}
	if content == "" {
		return nil
	}
	summary, err := s.generateKnowledgeSummary(ctx, base, doc.Title, content)
	if err != nil {
		return err
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"summary":  summary.Summary,
		"keywords": strings.Join(summary.Keywords, ", "),
	})
	return nil
}

func (s Service) refreshDirectorySummaries(ctx context.Context, baseID uint64, dirID uint64) {
	dirIDs := []uint64{dirID}
	if dirID > 0 {
		dirIDs = descendantDirIDs(ctx, baseID, dirID)
	} else {
		dirIDs = allDirectoryIDs(ctx, baseID)
	}
	for i := len(dirIDs) - 1; i >= 0; i-- {
		refreshDirectorySummary(ctx, baseID, dirIDs[i])
	}
}

func allDirectoryIDs(ctx context.Context, baseID uint64) []uint64 {
	rows := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field": "main.id",
		"order": "main.depth desc, main.id desc",
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			ids = append(ids, row.ID)
		}
	}
	return ids
}

func refreshDirectorySummary(ctx context.Context, baseID uint64, dirID uint64) {
	if dirID == 0 {
		return
	}
	childDirs := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         dirID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.summary, main.keywords",
		"order": "main.sort asc, main.id asc",
	})
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"dir_id":            dirID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title, main.summary, main.keywords",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": 40,
	})
	parts := make([]string, 0, len(childDirs)+len(docs))
	keywords := make([]string, 0)
	for _, dir := range childDirs {
		if dir == nil {
			continue
		}
		if summary := strings.TrimSpace(dir.Summary); summary != "" {
			parts = append(parts, strings.TrimSpace(dir.Name)+"： "+summary)
		}
		keywords = append(keywords, splitSummaryKeywords(dir.Keywords)...)
	}
	for _, doc := range docs {
		if doc == nil {
			continue
		}
		if summary := strings.TrimSpace(doc.Summary); summary != "" {
			parts = append(parts, strings.TrimSpace(doc.Title)+"： "+summary)
		}
		keywords = append(keywords, splitSummaryKeywords(doc.Keywords)...)
	}
	agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{"id": dirID}, map[string]any{
		"summary":  truncateText(strings.Join(parts, "\n"), 3000),
		"keywords": strings.Join(uniqueSummaryKeywords(keywords, 60), ", "),
	})
}

func (s Service) generateKnowledgeSummary(ctx context.Context, base agentmodel.KnowledgeBase, title string, content string) (knowledgeSummary, error) {
	powerKey, err := knowledgeIndexPowerKey(ctx, base.IndexPowerID)
	if err != nil {
		return knowledgeSummary{}, err
	}
	source := truncateText(strings.TrimSpace(content), maxSummarySourceChars)
	prompt := strings.Join([]string{
		"请为知识库文档生成可用于检索规划的结构化摘要。",
		"要求：",
		"1. 只基于原文，不要编造。",
		"2. summary 用 120-300 字中文概括核心内容、结论、事实和可复用信息。",
		"3. keywords 返回 5-12 个关键词或实体名。",
		"4. 只输出 JSON，不要 Markdown 代码块。",
	}, "\n")
	resp := s.gateway().Request(ctx, energonservice.GatewayRequest{
		Body: map[string]any{
			"mode":  "normalize",
			"power": powerKey,
			"set": map[string]any{
				"role": prompt,
			},
			"input": map[string]any{
				"text": fmt.Sprintf("标题：%s\n\n原文：\n%s", strings.TrimSpace(title), source),
			},
			"options": map[string]any{
				"temperature": 0.2,
				"stream":      false,
			},
		},
	})
	payload := resp.Payload()
	if util.ToIntDefault(payload["status"], 0) == 2 {
		message := strings.TrimSpace(frontstream.InputText(payload["msg"]))
		if message == "" {
			message = "生成知识摘要失败"
		}
		return knowledgeSummary{}, fmt.Errorf("%s", message)
	}
	return parseKnowledgeSummary(gatewayOutputText(payload)), nil
}

func (s Service) gateway() energonservice.GatewayService {
	return energonservice.NewGatewayService()
}

func knowledgeIndexPowerKey(ctx context.Context, powerID uint64) (string, error) {
	if powerID == 0 {
		powerID = agentmodel.DefaultKnowledgeIndexPowerID
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	if power == nil || power.Status != 1 {
		return "", fmt.Errorf("索引模型不可用")
	}
	key := strings.TrimSpace(power.Key)
	if key == "" {
		return "", fmt.Errorf("索引模型标识为空")
	}
	return key, nil
}

func parseKnowledgeSummary(text string) knowledgeSummary {
	text = trimJSONFence(strings.TrimSpace(text))
	result := knowledgeSummary{}
	if text != "" {
		if err := json.Unmarshal([]byte(text), &result); err != nil {
			result = parseLooseKnowledgeSummary(text)
		}
	}
	result.Summary = strings.TrimSpace(result.Summary)
	if result.Summary == "" {
		result.Summary = truncateText(text, 800)
	}
	result.Keywords = uniqueSummaryKeywords(result.Keywords, 20)
	return result
}

func parseLooseKnowledgeSummary(text string) knowledgeSummary {
	raw := map[string]any{}
	if err := json.Unmarshal([]byte(text), &raw); err != nil {
		return knowledgeSummary{}
	}
	result := knowledgeSummary{
		Summary: strings.TrimSpace(frontstream.InputText(raw["summary"])),
	}
	switch keywords := raw["keywords"].(type) {
	case []any:
		for _, keyword := range keywords {
			result.Keywords = append(result.Keywords, frontstream.InputText(keyword))
		}
	case []string:
		result.Keywords = append(result.Keywords, keywords...)
	default:
		result.Keywords = splitSummaryKeywords(frontstream.InputText(keywords))
	}
	return result
}

func gatewayOutputText(payload map[string]any) string {
	output := mapFromAny(payload["output"])
	if text := strings.TrimSpace(frontstream.InputText(output["text"])); text != "" {
		return text
	}
	if text := outputJSONText(output["json"]); text != "" {
		return text
	}
	return strings.TrimSpace(frontstream.InputText(payload["data"]))
}

func outputJSONText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return ""
		}
		return strings.TrimSpace(string(raw))
	}
}

func mapFromAny(value any) map[string]any {
	switch current := value.(type) {
	case nil:
		return map[string]any{}
	case map[string]any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return map[string]any{}
		}
		result := map[string]any{}
		if err := json.Unmarshal(raw, &result); err != nil {
			return map[string]any{}
		}
		return result
	}
}

func documentNodeSource(ctx context.Context, docID uint64) string {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"doc_id":       docID,
		"status":       1,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
	}, map[string]any{
		"field":    "main.plain_text, main.content, main.summary",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": 8,
	})
	parts := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if text := firstNonEmpty(row.Summary, row.PlainText, row.Content); text != "" {
			parts = append(parts, text)
		}
	}
	return strings.Join(parts, "\n\n")
}

func trimJSONFence(value string) string {
	value = strings.TrimSpace(value)
	value = strings.TrimPrefix(value, "```json")
	value = strings.TrimPrefix(value, "```")
	value = strings.TrimSuffix(value, "```")
	return strings.TrimSpace(value)
}

func splitSummaryKeywords(value string) []string {
	return strings.FieldsFunc(value, func(r rune) bool {
		return strings.ContainsRune(",，;；、\n\t ", r)
	})
}

func uniqueSummaryKeywords(values []string, limit int) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		item := strings.TrimSpace(util.ToString(value))
		if item == "" {
			continue
		}
		if _, exists := seen[item]; exists {
			continue
		}
		seen[item] = struct{}{}
		result = append(result, item)
		if limit > 0 && len(result) >= limit {
			break
		}
	}
	return result
}
