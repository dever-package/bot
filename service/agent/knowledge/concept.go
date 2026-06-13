package knowledge

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	energonservice "my/package/bot/service/energon"
	frontstream "my/package/front/service/stream"
)

const (
	maxConceptSourceNodes = 24
	maxConceptSourceChars = 14000
	maxExtractedConcepts  = 24
	maxExtractedRelations = 36
)

type conceptExtractionResult struct {
	Concepts  []extractedConcept  `json:"concepts"`
	Relations []extractedRelation `json:"relations"`
}

type extractedConcept struct {
	Name        string   `json:"name"`
	Type        string   `json:"type"`
	Description string   `json:"description"`
	Keywords    []string `json:"keywords"`
	Evidence    string   `json:"evidence"`
	SourceNode  string   `json:"source_node"`
	Confidence  float64  `json:"confidence"`
}

type extractedRelation struct {
	From       string  `json:"from"`
	To         string  `json:"to"`
	EdgeType   string  `json:"edge_type"`
	Label      string  `json:"label"`
	Summary    string  `json:"summary"`
	Evidence   string  `json:"evidence"`
	SourceNode string  `json:"source_node"`
	Confidence float64 `json:"confidence"`
}

func (s Service) extractDocumentConceptGraph(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) error {
	sourceNodes := conceptSourceNodes(ctx, doc.ID)
	if len(sourceNodes) == 0 {
		return nil
	}
	result, err := s.generateConceptGraph(ctx, base, doc, sourceNodes)
	if err != nil {
		return err
	}
	if len(result.Concepts) == 0 && len(result.Relations) == 0 {
		return nil
	}
	result.Concepts = mergeRelationConcepts(result.Concepts, result.Relations)
	sourceNodeByKey := mapConceptSourceNodes(sourceNodes)
	conceptIDs := upsertConceptNodes(ctx, base, doc, result.Concepts, sourceNodeByKey)
	insertConceptEdges(ctx, base, doc, result, conceptIDs, sourceNodeByKey)
	return nil
}

func (s Service) extractDocumentConceptGraphAsync(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) {
	_ = s.extractDocumentConceptGraphWithStage(ctx, base, doc)
}

func (s Service) extractDocumentConceptGraphWithStage(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc) error {
	markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusRunning, "")
	err := s.extractDocumentConceptGraph(ctx, base, doc)
	if err != nil {
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusFailed, err.Error())
	} else {
		markDocumentIndexStage(ctx, doc.ID, agentmodel.KnowledgeIndexStageGraph, agentmodel.KnowledgeIndexStatusSuccess, "")
	}
	return err
}

func conceptSourceNodes(ctx context.Context, docID uint64) []*agentmodel.KnowledgeNode {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"doc_id":       docID,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"node_type": []string{
			agentmodel.KnowledgeNodeTypeDoc,
			agentmodel.KnowledgeNodeTypeHeading,
			agentmodel.KnowledgeNodeTypePage,
		},
		"status": 1,
	}, map[string]any{
		"field":    "main.id, main.node_type, main.title, main.path, main.summary, main.plain_text, main.content, main.sort",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": maxConceptSourceNodes,
	})
	result := make([]*agentmodel.KnowledgeNode, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		text := strings.TrimSpace(firstNonEmpty(row.Summary, row.PlainText, row.Content))
		if text == "" {
			continue
		}
		result = append(result, row)
	}
	return result
}

func (s Service) generateConceptGraph(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, nodes []*agentmodel.KnowledgeNode) (conceptExtractionResult, error) {
	powerKey, err := knowledgeIndexPowerKey(ctx, base.IndexPowerID)
	if err != nil {
		return conceptExtractionResult{}, err
	}
	source := conceptGraphSource(doc, nodes)
	if strings.TrimSpace(source) == "" {
		return conceptExtractionResult{}, nil
	}
	prompt := strings.Join([]string{
		"你是企业知识库的关系图谱抽取器。",
		"只基于输入内容抽取稳定、可复用、对检索有帮助的概念和关系，不要编造。",
		"输出 JSON，不要 Markdown 代码块。",
		"JSON 结构：",
		`{"concepts":[{"name":"","type":"","description":"","keywords":[],"evidence":"","source_node":"","confidence":0.0}],"relations":[{"from":"","to":"","edge_type":"","label":"","summary":"","evidence":"","source_node":"","confidence":0.0}]}`,
		"规则：",
		"1. concepts 最多 24 个，name 必须是原文能支持的实体、术语、模块、规则、流程、能力或关键主题。",
		"2. relations 最多 36 条，只允许 edge_type 使用 mentions、defines、depends_on、concept。",
		"3. defines 表示节点定义概念；mentions 表示节点提及概念；depends_on 表示概念依赖另一个概念；concept 表示两个概念有明确语义关联。",
		"4. 每个 concept/relation 都必须给 evidence；没有证据不要返回。",
		"5. source_node 填输入中的节点编号，例如 node:123。",
	}, "\n")
	resp := s.gateway().Request(ctx, energonservice.GatewayRequest{
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
		message := strings.TrimSpace(frontstream.InputText(payload["msg"]))
		if message == "" {
			message = "抽取知识图谱失败"
		}
		return conceptExtractionResult{}, fmt.Errorf("%s", message)
	}
	return parseConceptExtraction(gatewayOutputText(payload)), nil
}

func conceptGraphSource(doc agentmodel.KnowledgeDoc, nodes []*agentmodel.KnowledgeNode) string {
	lines := []string{
		"文档：" + strings.TrimSpace(doc.Title),
		"路径：" + strings.TrimSpace(doc.StoragePath),
	}
	for _, node := range nodes {
		if node == nil {
			continue
		}
		text := truncateText(strings.TrimSpace(firstNonEmpty(node.Summary, node.PlainText, node.Content)), 1200)
		if text == "" {
			continue
		}
		lines = append(lines, fmt.Sprintf(
			"node:%d\n类型：%s\n标题：%s\n路径：%s\n内容：%s",
			node.ID,
			strings.TrimSpace(node.NodeType),
			strings.TrimSpace(node.Title),
			strings.TrimSpace(node.Path),
			text,
		))
	}
	return truncateText(strings.Join(lines, "\n\n"), maxConceptSourceChars)
}

func parseConceptExtraction(text string) conceptExtractionResult {
	text = trimJSONFence(strings.TrimSpace(text))
	result := conceptExtractionResult{}
	if text == "" {
		return result
	}
	if err := json.Unmarshal([]byte(text), &result); err != nil {
		raw := map[string]any{}
		if err := json.Unmarshal([]byte(text), &raw); err == nil {
			result = looseConceptExtraction(raw)
		}
	}
	result.Concepts = normalizeExtractedConcepts(result.Concepts)
	result.Relations = normalizeExtractedRelations(result.Relations)
	return result
}

func looseConceptExtraction(raw map[string]any) conceptExtractionResult {
	result := conceptExtractionResult{}
	for _, item := range anySlice(raw["concepts"]) {
		row := mapFromAny(item)
		result.Concepts = append(result.Concepts, extractedConcept{
			Name:        frontstream.InputText(row["name"]),
			Type:        frontstream.InputText(row["type"]),
			Description: frontstream.InputText(row["description"]),
			Keywords:    conceptKeywordListFromAny(row["keywords"]),
			Evidence:    frontstream.InputText(row["evidence"]),
			SourceNode:  frontstream.InputText(row["source_node"]),
			Confidence:  floatValue(row["confidence"]),
		})
	}
	for _, item := range anySlice(raw["relations"]) {
		row := mapFromAny(item)
		result.Relations = append(result.Relations, extractedRelation{
			From:       frontstream.InputText(row["from"]),
			To:         frontstream.InputText(row["to"]),
			EdgeType:   frontstream.InputText(row["edge_type"]),
			Label:      frontstream.InputText(row["label"]),
			Summary:    frontstream.InputText(row["summary"]),
			Evidence:   frontstream.InputText(row["evidence"]),
			SourceNode: frontstream.InputText(row["source_node"]),
			Confidence: floatValue(row["confidence"]),
		})
	}
	return result
}

func normalizeExtractedConcepts(values []extractedConcept) []extractedConcept {
	result := make([]extractedConcept, 0, len(values))
	seen := map[string]int{}
	for _, value := range values {
		value.Name = normalizeConceptName(value.Name)
		value.Type = truncateText(strings.TrimSpace(value.Type), 64)
		value.Description = truncateText(strings.TrimSpace(value.Description), 800)
		value.Evidence = truncateText(strings.TrimSpace(value.Evidence), 1000)
		value.SourceNode = strings.TrimSpace(value.SourceNode)
		value.Keywords = uniqueSummaryKeywords(value.Keywords, 12)
		value.Confidence = normalizedConfidence(value.Confidence, 0.75)
		if value.Name == "" || value.Evidence == "" {
			continue
		}
		key := conceptIdentity(value.Name)
		if index, exists := seen[key]; exists {
			result[index] = mergeExtractedConcept(result[index], value)
			continue
		}
		seen[key] = len(result)
		result = append(result, value)
		if len(result) >= maxExtractedConcepts {
			break
		}
	}
	return result
}

func mergeExtractedConcept(a extractedConcept, b extractedConcept) extractedConcept {
	if len([]rune(b.Description)) > len([]rune(a.Description)) {
		a.Description = b.Description
	}
	if len([]rune(b.Evidence)) > len([]rune(a.Evidence)) {
		a.Evidence = b.Evidence
	}
	if b.Confidence > a.Confidence {
		a.Confidence = b.Confidence
	}
	if a.Type == "" {
		a.Type = b.Type
	}
	a.Keywords = uniqueSummaryKeywords(append(a.Keywords, b.Keywords...), 12)
	if a.SourceNode == "" {
		a.SourceNode = b.SourceNode
	}
	return a
}

func normalizeExtractedRelations(values []extractedRelation) []extractedRelation {
	result := make([]extractedRelation, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value.From = normalizeConceptName(value.From)
		value.To = normalizeConceptName(value.To)
		value.EdgeType = normalizeConceptEdgeType(value.EdgeType)
		value.Label = truncateText(strings.TrimSpace(firstNonEmpty(value.Label, value.EdgeType)), 128)
		value.Summary = truncateText(strings.TrimSpace(value.Summary), 800)
		value.Evidence = truncateText(strings.TrimSpace(value.Evidence), 1000)
		value.SourceNode = strings.TrimSpace(value.SourceNode)
		value.Confidence = normalizedConfidence(value.Confidence, 0.7)
		if value.From == "" || value.To == "" || value.Evidence == "" || value.From == value.To {
			continue
		}
		key := strings.ToLower(value.From + "|" + value.EdgeType + "|" + value.To)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, value)
		if len(result) >= maxExtractedRelations {
			break
		}
	}
	return result
}

func mergeRelationConcepts(concepts []extractedConcept, relations []extractedRelation) []extractedConcept {
	seen := map[string]struct{}{}
	result := make([]extractedConcept, 0, len(concepts))
	for _, concept := range concepts {
		key := strings.ToLower(concept.Name)
		if key == "" {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, concept)
	}
	for _, relation := range relations {
		for _, name := range []string{relation.From, relation.To} {
			key := strings.ToLower(name)
			if key == "" {
				continue
			}
			if _, exists := seen[key]; exists {
				continue
			}
			seen[key] = struct{}{}
			result = append(result, extractedConcept{
				Name:        name,
				Type:        "relation",
				Description: truncateText(firstNonEmpty(relation.Summary, relation.Label), 800),
				Evidence:    relation.Evidence,
				SourceNode:  relation.SourceNode,
				Confidence:  relation.Confidence,
			})
			if len(result) >= maxExtractedConcepts {
				return result
			}
		}
	}
	return result
}

func upsertConceptNodes(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, concepts []extractedConcept, sourceNodeByKey map[string]*agentmodel.KnowledgeNode) map[string]uint64 {
	result := map[string]uint64{}
	for _, concept := range concepts {
		nodeID := upsertConceptNode(ctx, base, concept, doc.ID)
		if nodeID == 0 {
			continue
		}
		result[concept.Name] = nodeID
		if sourceNode := sourceNodeByKey[concept.SourceNode]; sourceNode != nil {
			edgeType := agentmodel.KnowledgeEdgeTypeMentions
			if strings.EqualFold(concept.Type, "definition") || strings.Contains(concept.Description, "定义") {
				edgeType = agentmodel.KnowledgeEdgeTypeDefines
			}
			insertKnowledgeEdge(ctx, knowledgeEdgeInput{
				BaseID:     base.ID,
				DocID:      doc.ID,
				FromNodeID: sourceNode.ID,
				ToNodeID:   nodeID,
				EdgeType:   edgeType,
				Label:      concept.Name,
				Summary:    concept.Description,
				Evidence:   concept.Evidence,
				Weight:     0.75,
				Confidence: concept.Confidence,
				Metadata: map[string]any{
					"source":       "llm_concept",
					"concept_type": concept.Type,
					"keywords":     concept.Keywords,
				},
			})
		}
	}
	return result
}

func upsertConceptNode(ctx context.Context, base agentmodel.KnowledgeBase, concept extractedConcept, docID uint64) uint64 {
	nodeKey := conceptNodeKey(concept.Name)
	if nodeKey == "" {
		return 0
	}
	model := agentmodel.NewKnowledgeNodeModel()
	existing := model.Find(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"doc_id":            0,
		"node_key":          nodeKey,
		"status":            1,
	})
	if existing == nil {
		existing = model.Find(ctx, map[string]any{
			"knowledge_base_id": base.ID,
			"node_key":          nodeKey,
			"status":            1,
		})
	}
	aliases := uniqueSummaryKeywords(append([]string{concept.Name}, concept.Keywords...), 10)
	nowHash := contentHash(concept.Name + concept.Description + concept.Evidence)

	if existing != nil {
		existingMeta := parseMetadataMap(existing.Metadata)
		sources := uint64SliceFromMeta(existingMeta, "sources")
		if docID > 0 {
			hasDoc := false
			for _, sid := range sources {
				if sid == docID {
					hasDoc = true
					break
				}
			}
			if !hasDoc {
				sources = append(sources, docID)
			}
		}
		allKeywords := uniqueSummaryKeywords(append(concept.Keywords, concept.Name, concept.Type), 20)
		allKeywords = uniqueSummaryKeywords(append(allKeywords, aliases...), 20)
		existingMeta["aliases"] = aliases
		existingMeta["concept_type"] = concept.Type
		existingMeta["sources"] = sources
		if existingMeta["description"] == nil {
			existingMeta["description"] = concept.Description
		}

		aliasText := ""
		if len(aliases) > 0 {
			aliasText = "别名：" + strings.Join(aliases, "、")
		}
		values := map[string]any{
			"node_type":    agentmodel.KnowledgeNodeTypeConcept,
			"title":        truncateText(concept.Name, 255),
			"search_text":  searchableNodeText("", "", "概念/"+concept.Name, concept.Name, concept.Description, concept.Evidence) + "\n" + aliasText,
			"keywords":     strings.Join(allKeywords, " "),
			"path":         truncateText("概念/"+concept.Name, 1024),
			"metadata":     jsonText(existingMeta),
			"content_hash": nowHash,
			"index_status": agentmodel.KnowledgeIndexStatusSuccess,
			"doc_id":       0,
			"parent_id":    0,
			"dir_id":       0,
			"parse_id":     0,
			"depth":        0,
			"sort":         9000,
			"status":       1,
		}
		model.Update(ctx, map[string]any{"id": existing.ID}, values)
		return existing.ID
	}
	allKeywords := uniqueSummaryKeywords(append(concept.Keywords, concept.Name, concept.Type), 20)
	allKeywords = uniqueSummaryKeywords(append(allKeywords, aliases...), 20)
	aliasText := ""
	if len(aliases) > 0 {
		aliasText = "别名：" + strings.Join(aliases, "、")
	}
	values := map[string]any{
		"node_type":     agentmodel.KnowledgeNodeTypeConcept,
		"title":         truncateText(concept.Name, 255),
		"summary":       concept.Description,
		"content":       concept.Evidence,
		"plain_text":    concept.Evidence,
		"search_text":   searchableNodeText("", "", "概念/"+concept.Name, concept.Name, concept.Description, concept.Evidence) + "\n" + aliasText,
		"keywords":      strings.Join(allKeywords, " "),
		"path":          truncateText("概念/"+concept.Name, 1024),
		"metadata":      jsonText(map[string]any{"aliases": aliases, "concept_type": concept.Type, "description": concept.Description, "sources": []uint64{docID}}),
		"content_hash":  nowHash,
		"index_status":  agentmodel.KnowledgeIndexStatusSuccess,
		"error_message": "",
		"status":        1,
	}
	values["knowledge_base_id"] = base.ID
	values["dir_id"] = 0
	values["doc_id"] = 0
	values["parse_id"] = 0
	values["parent_id"] = 0
	values["node_key"] = nodeKey
	values["depth"] = 0
	values["sort"] = 9000
	return util.ToUint64(model.Insert(ctx, withCreatedAt(values)))
}

func parseMetadataMap(metadata string) map[string]any {
	if strings.TrimSpace(metadata) == "" {
		return map[string]any{}
	}
	var result map[string]any
	if err := json.Unmarshal([]byte(metadata), &result); err != nil {
		return map[string]any{}
	}
	if result == nil {
		return map[string]any{}
	}
	return result
}

func uint64SliceFromMeta(meta map[string]any, key string) []uint64 {
	raw, ok := meta[key]
	if !ok {
		return nil
	}
	switch values := raw.(type) {
	case []any:
		ids := make([]uint64, 0, len(values))
		for _, v := range values {
			ids = append(ids, uint64(frontstream.InputInt64(v, 0)))
		}
		return ids
	case []uint64:
		return values
	default:
		return nil
	}
}

func insertConceptEdges(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, result conceptExtractionResult, conceptIDs map[string]uint64, sourceNodeByKey map[string]*agentmodel.KnowledgeNode) {
	for _, relation := range result.Relations {
		fromID := conceptIDs[relation.From]
		toID := conceptIDs[relation.To]
		if fromID == 0 || toID == 0 {
			continue
		}
		sourceNodeID := fromID
		if sourceNode := sourceNodeByKey[relation.SourceNode]; sourceNode != nil &&
			(relation.EdgeType == agentmodel.KnowledgeEdgeTypeMentions || relation.EdgeType == agentmodel.KnowledgeEdgeTypeDefines) {
			sourceNodeID = sourceNode.ID
		}
		insertKnowledgeEdge(ctx, knowledgeEdgeInput{
			BaseID:     base.ID,
			DocID:      doc.ID,
			FromNodeID: sourceNodeID,
			ToNodeID:   toID,
			EdgeType:   relation.EdgeType,
			Label:      relation.Label,
			Summary:    relation.Summary,
			Evidence:   relation.Evidence,
			Weight:     0.7,
			Confidence: relation.Confidence,
			Metadata: map[string]any{
				"source": "llm_relation",
				"from":   relation.From,
				"to":     relation.To,
			},
		})
	}
}

func mapConceptSourceNodes(nodes []*agentmodel.KnowledgeNode) map[string]*agentmodel.KnowledgeNode {
	result := make(map[string]*agentmodel.KnowledgeNode, len(nodes))
	for _, node := range nodes {
		if node == nil {
			continue
		}
		result[fmt.Sprintf("node:%d", node.ID)] = node
	}
	return result
}

func conceptNodeKey(name string) string {
	name = normalizeConceptName(name)
	if name == "" {
		return ""
	}
	return "concept:" + contentHash(conceptIdentity(name))[:24]
}

func normalizeConceptName(value string) string {
	value = strings.Join(strings.Fields(strings.TrimSpace(value)), " ")
	return truncateText(value, 120)
}

func conceptIdentity(value string) string {
	value = strings.ToLower(normalizeConceptName(value))
	value = strings.NewReplacer(" ", "", "　", "", "-", "", "_", "").Replace(value)
	return value
}

func normalizeConceptEdgeType(value string) string {
	switch strings.TrimSpace(value) {
	case agentmodel.KnowledgeEdgeTypeMentions,
		agentmodel.KnowledgeEdgeTypeDefines,
		agentmodel.KnowledgeEdgeTypeDependsOn,
		agentmodel.KnowledgeEdgeTypeConcept:
		return strings.TrimSpace(value)
	default:
		return agentmodel.KnowledgeEdgeTypeConcept
	}
}

func normalizedConfidence(value float64, fallback float64) float64 {
	if value <= 0 {
		return fallback
	}
	if value > 1 {
		return 1
	}
	return value
}

func anySlice(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	default:
		return nil
	}
}

func conceptKeywordListFromAny(value any) []string {
	switch current := value.(type) {
	case []string:
		return current
	case []any:
		result := make([]string, 0, len(current))
		for _, item := range current {
			if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
				result = append(result, text)
			}
		}
		return result
	default:
		return splitSummaryKeywords(frontstream.InputText(current))
	}
}
