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

func (s Service) refreshDirectorySummaries(ctx context.Context, baseID uint64, dirID uint64) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return
	}
	dirIDs := []uint64{dirID}
	if dirID > 0 {
		dirIDs = descendantDirIDs(ctx, baseID, dirID)
	} else {
		dirIDs = allDirectoryIDs(ctx, baseID)
	}
	for i := len(dirIDs) - 1; i >= 0; i-- {
		refreshDirectorySummary(ctx, base, dirIDs[i])
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

func refreshDirectorySummary(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64) {
	if dirID == 0 {
		return
	}
	childDirs := agentmodel.NewKnowledgeDirModel().Select(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"parent_id":         dirID,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.name, main.summary, main.keywords",
		"order": "main.sort asc, main.id asc",
	})
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"dir_id":            dirID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title, main.summary, main.keywords",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": 40,
	})
	if base.IndexPowerID > 0 && len(docs) >= 3 {
		go generateLLMDirectorySummary(context.Background(), base, dirID, childDirs, docs)
	}
	parts := make([]string, 0, len(childDirs)+len(docs)+1)
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

func generateLLMDirectorySummary(ctx context.Context, base *agentmodel.KnowledgeBase, dirID uint64, childDirs []*agentmodel.KnowledgeDir, docs []*agentmodel.KnowledgeDoc) {
	powerKey, err := knowledgeIndexPowerKey(ctx, base.IndexPowerID)
	if err != nil {
		return
	}
	dir := agentmodel.NewKnowledgeDirModel().Find(ctx, map[string]any{"id": dirID})
	if dir == nil {
		return
	}
	source := buildDirectorySummarySource(dir, childDirs, docs)
	if strings.TrimSpace(source) == "" {
		return
	}
	prompt := strings.Join([]string{
		"你是企业知识库的目录摘要生成器。",
		"基于该目录下的子目录和文档信息，生成一段简洁的目录摘要（200字以内）。",
		"要求：概括该目录的核心内容和用途，语言简洁，便于检索时快速判断是否相关。",
		"只基于输入内容生成，不要编造。",
	}, "\n")
	srv := NewService()
	resp := srv.gateway().Request(ctx, energonservice.GatewayRequest{
		Body: map[string]any{
			"mode":  "normalize",
			"power": powerKey,
			"set": map[string]any{
				"role": prompt,
			},
			"input": map[string]any{
				"text": source,
			},
			"options": map[string]any{
				"temperature": 0.1,
				"stream":      false,
			},
		},
	})
	payload := resp.Payload()
	if util.ToIntDefault(payload["status"], 0) == 2 {
		return
	}
	llmSummary := strings.TrimSpace(gatewayOutputText(payload))
	if llmSummary == "" {
		return
	}
	agentmodel.NewKnowledgeDirModel().Update(ctx, map[string]any{"id": dirID}, map[string]any{
		"summary": truncateText(llmSummary, 2000),
	})
}

func buildDirectorySummarySource(dir *agentmodel.KnowledgeDir, childDirs []*agentmodel.KnowledgeDir, docs []*agentmodel.KnowledgeDoc) string {
	lines := []string{"目录：" + strings.TrimSpace(dir.Name)}
	if len(childDirs) > 0 {
		dirLines := make([]string, 0, len(childDirs))
		for _, d := range childDirs {
			if d == nil || strings.TrimSpace(d.Name) == "" {
				continue
			}
			line := strings.TrimSpace(d.Name)
			if strings.TrimSpace(d.Summary) != "" {
				line += "： " + strings.TrimSpace(d.Summary)
			}
			dirLines = append(dirLines, line)
		}
		if len(dirLines) > 0 {
			lines = append(lines, "子目录：\n"+strings.Join(dirLines, "\n"))
		}
	}
	if len(docs) > 0 {
		docLines := make([]string, 0, len(docs))
		for _, doc := range docs {
			if doc == nil || strings.TrimSpace(doc.Title) == "" {
				continue
			}
			line := strings.TrimSpace(doc.Title)
			if strings.TrimSpace(doc.Summary) != "" {
				line += "： " + strings.TrimSpace(doc.Summary)
			}
			docLines = append(docLines, line)
		}
		if len(docLines) > 0 {
			lines = append(lines, "文档：\n"+strings.Join(docLines, "\n"))
		}
	}
	return strings.Join(lines, "\n\n")
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
