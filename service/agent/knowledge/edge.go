package knowledge

import (
	"context"
	"fmt"
	"net/url"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

var (
	markdownLocalLinkPattern = regexp.MustCompile(`!?\[([^\]\n]*)\]\(([^)\n]+)\)`)
	wikiLocalLinkPattern     = regexp.MustCompile(`!?\[\[([^\]\n]+)\]\]`)
)

type knowledgeReferenceLink struct {
	Raw      string
	Label    string
	Target   string
	Embedded bool
}

func insertNodeReferenceEdges(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, fromNodeID uint64, content string) {
	if fromNodeID == 0 || strings.TrimSpace(content) == "" {
		return
	}
	links := extractLocalReferenceLinks(content)
	if len(links) == 0 {
		return
	}
	for _, link := range links {
		targetDoc := resolveReferenceDoc(ctx, base.ID, doc, link.Target)
		if targetDoc == nil {
			insertUnresolvedReferenceEdge(ctx, base.ID, doc.ID, fromNodeID, link)
			continue
		}
		targetNodeID := docRootNodeID(ctx, targetDoc.ID)
		if targetNodeID == 0 || targetNodeID == fromNodeID {
			insertUnresolvedReferenceEdge(ctx, base.ID, doc.ID, fromNodeID, link)
			continue
		}
		edgeType, label := referenceEdgeType(link, targetDoc)
		insertKnowledgeEdge(ctx, knowledgeEdgeInput{
			BaseID:     base.ID,
			DocID:      doc.ID,
			FromNodeID: fromNodeID,
			ToNodeID:   targetNodeID,
			EdgeType:   edgeType,
			Label:      label,
			Summary:    fmt.Sprintf("引用文件：%s", targetDoc.Title),
			Evidence:   link.Raw,
			Weight:     0.8,
			Confidence: 0.9,
			Metadata: map[string]any{
				"target":        link.Target,
				"target_doc_id": targetDoc.ID,
				"embedded":      link.Embedded,
			},
		})
	}
}

func insertUnresolvedReferenceEdge(ctx context.Context, baseID uint64, docID uint64, fromNodeID uint64, link knowledgeReferenceLink) {
	insertKnowledgeEdge(ctx, knowledgeEdgeInput{
		BaseID:     baseID,
		DocID:      docID,
		FromNodeID: fromNodeID,
		EdgeType:   agentmodel.KnowledgeEdgeTypeReferences,
		Label:      firstNonEmpty(link.Label, link.Target, "未解析引用"),
		Summary:    "引用目标暂未匹配到知识库文档",
		Evidence:   link.Raw,
		Weight:     0.3,
		Confidence: 0.4,
		Metadata: map[string]any{
			"target":   link.Target,
			"embedded": link.Embedded,
			"resolved": false,
		},
	})
}

func extractLocalReferenceLinks(content string) []knowledgeReferenceLink {
	links := make([]knowledgeReferenceLink, 0)
	for _, match := range wikiLocalLinkPattern.FindAllStringSubmatch(content, -1) {
		if len(match) < 2 {
			continue
		}
		raw := match[0]
		body := strings.TrimSpace(match[1])
		target, label, _ := strings.Cut(body, "|")
		target = normalizeReferenceTarget(target)
		if target == "" || isExternalReferenceTarget(target) {
			continue
		}
		links = append(links, knowledgeReferenceLink{
			Raw:      raw,
			Label:    strings.TrimSpace(firstNonEmpty(label, target)),
			Target:   target,
			Embedded: strings.HasPrefix(raw, "!"),
		})
	}
	for _, match := range markdownLocalLinkPattern.FindAllStringSubmatch(content, -1) {
		if len(match) < 3 {
			continue
		}
		raw := match[0]
		target := normalizeReferenceTarget(match[2])
		if target == "" || isExternalReferenceTarget(target) {
			continue
		}
		links = append(links, knowledgeReferenceLink{
			Raw:      raw,
			Label:    strings.TrimSpace(firstNonEmpty(match[1], target)),
			Target:   target,
			Embedded: strings.HasPrefix(raw, "!"),
		})
	}
	return uniqueReferenceLinks(links)
}

func uniqueReferenceLinks(links []knowledgeReferenceLink) []knowledgeReferenceLink {
	result := make([]knowledgeReferenceLink, 0, len(links))
	seen := map[string]struct{}{}
	for _, link := range links {
		key := fmt.Sprintf("%t:%s", link.Embedded, strings.ToLower(link.Target))
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, link)
	}
	return result
}

func normalizeReferenceTarget(target string) string {
	target = strings.TrimSpace(target)
	target = strings.Trim(target, "<>")
	if decoded, err := url.PathUnescape(target); err == nil {
		target = decoded
	}
	if index := strings.IndexAny(target, "#?"); index >= 0 {
		target = target[:index]
	}
	if isExternalReferenceTarget(target) {
		return target
	}
	return NormalizeDirPath(target)
}

func isExternalReferenceTarget(target string) bool {
	lower := strings.ToLower(strings.TrimSpace(target))
	return strings.HasPrefix(lower, "http://") ||
		strings.HasPrefix(lower, "https://") ||
		strings.HasPrefix(lower, "mailto:") ||
		strings.HasPrefix(lower, "tel:") ||
		strings.HasPrefix(lower, "data:")
}

func resolveReferenceDoc(ctx context.Context, baseID uint64, sourceDoc agentmodel.KnowledgeDoc, target string) *agentmodel.KnowledgeDoc {
	target = NormalizeDirPath(target)
	if target == "" {
		return nil
	}
	candidates := referenceTargetCandidates(sourceDoc, target)
	for _, candidate := range candidates {
		if doc := findDocByStoragePath(ctx, baseID, candidate); doc != nil && doc.Status == 1 {
			return doc
		}
	}
	return nil
}

func referenceTargetCandidates(sourceDoc agentmodel.KnowledgeDoc, target string) []string {
	candidates := []string{target}
	currentDir := NormalizeDirPath(filepath.ToSlash(filepath.Dir(sourceDoc.StoragePath)))
	if currentDir != "" && currentDir != "." {
		candidates = append(candidates, NormalizeDirPath(currentDir+"/"+target))
	}
	result := make([]string, 0, len(candidates))
	seen := map[string]struct{}{}
	for _, candidate := range candidates {
		candidate = NormalizeDirPath(candidate)
		if candidate == "" {
			continue
		}
		if _, exists := seen[candidate]; exists {
			continue
		}
		seen[candidate] = struct{}{}
		result = append(result, candidate)
	}
	return result
}

func loadConceptNodeIDs(ctx context.Context, baseID uint64) map[string]uint64 {
	if baseID == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"node_type":         agentmodel.KnowledgeNodeTypeConcept,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.title",
		"page":  1,
		"pageSize": 200,
	})
	if len(rows) == 0 {
		return nil
	}
	result := make(map[string]uint64, len(rows))
	for _, row := range rows {
		if row == nil || row.ID == 0 {
			continue
		}
		name := strings.TrimSpace(row.Title)
		if name == "" {
			continue
		}
		if _, exists := result[name]; !exists {
			result[name] = row.ID
		}
	}
	return result
}

func insertNodeMentionEdges(ctx context.Context, base agentmodel.KnowledgeBase, doc agentmodel.KnowledgeDoc, fromNodeID uint64, plainText string, conceptNodes map[string]uint64) {
	if fromNodeID == 0 || len(conceptNodes) == 0 || strings.TrimSpace(plainText) == "" {
		return
	}
	for name, toNodeID := range conceptNodes {
		if toNodeID == 0 || toNodeID == fromNodeID {
			continue
		}
		if !strings.Contains(plainText, name) {
			continue
		}
		insertKnowledgeEdge(ctx, knowledgeEdgeInput{
			BaseID:     base.ID,
			DocID:      doc.ID,
			FromNodeID: fromNodeID,
			ToNodeID:   toNodeID,
			EdgeType:   agentmodel.KnowledgeEdgeTypeMentions,
			Label:      name,
			Summary:    fmt.Sprintf("提及概念：%s", name),
			Evidence:   truncateText(plainText, 200),
			Weight:     0.6,
			Confidence: 0.8,
			Metadata: map[string]any{
				"source": "mention_scan",
			},
		})
	}
}

func docRootNodeID(ctx context.Context, docID uint64) uint64 {
	if docID == 0 {
		return 0
	}
	node := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{
		"doc_id":    docID,
		"node_key":  "doc",
		"node_type": agentmodel.KnowledgeNodeTypeDoc,
		"status":    1,
	})
	if node == nil {
		return 0
	}
	return node.ID
}

func referenceEdgeType(link knowledgeReferenceLink, targetDoc *agentmodel.KnowledgeDoc) (string, string) {
	label := firstNonEmpty(link.Label, link.Target, "引用")
	if link.Embedded || strings.HasPrefix(strings.ToLower(targetDoc.MimeType), "image/") {
		return agentmodel.KnowledgeEdgeTypeAsset, label
	}
	return agentmodel.KnowledgeEdgeTypeReferences, label
}

type knowledgeEdgeInput struct {
	BaseID     uint64
	DocID      uint64
	FromNodeID uint64
	ToNodeID   uint64
	EdgeType   string
	Label      string
	Summary    string
	Evidence   string
	Weight     float64
	Confidence float64
	Metadata   map[string]any
}

func insertKnowledgeEdge(ctx context.Context, input knowledgeEdgeInput) uint64 {
	if input.BaseID == 0 || input.FromNodeID == 0 || strings.TrimSpace(input.EdgeType) == "" {
		return 0
	}
	if existing := findKnowledgeEdge(ctx, input); existing != nil {
		updateKnowledgeEdge(ctx, existing.ID, input)
		return existing.ID
	}
	return insertKnowledgeEdgeRecord(ctx, input)
}

func findKnowledgeEdge(ctx context.Context, input knowledgeEdgeInput) *agentmodel.KnowledgeEdge {
	filter := map[string]any{
		"knowledge_base_id": input.BaseID,
		"from_node_id":      input.FromNodeID,
		"to_node_id":        input.ToNodeID,
		"edge_type":         strings.TrimSpace(input.EdgeType),
		"doc_id":            input.DocID,
		"status":            1,
	}
	return agentmodel.NewKnowledgeEdgeModel().Find(ctx, filter)
}

func updateKnowledgeEdge(ctx context.Context, edgeID uint64, input knowledgeEdgeInput) {
	if edgeID == 0 {
		return
	}
	agentmodel.NewKnowledgeEdgeModel().Update(ctx, map[string]any{"id": edgeID}, map[string]any{
		"label":      truncateText(strings.TrimSpace(input.Label), 128),
		"summary":    strings.TrimSpace(input.Summary),
		"evidence":   strings.TrimSpace(input.Evidence),
		"weight":     input.Weight,
		"confidence": input.Confidence,
		"metadata":   jsonText(input.Metadata),
		"status":     1,
	})
}

func insertKnowledgeEdgeRecord(ctx context.Context, input knowledgeEdgeInput) uint64 {
	return util.ToUint64(agentmodel.NewKnowledgeEdgeModel().Insert(ctx, withCreatedAt(map[string]any{
		"knowledge_base_id": input.BaseID,
		"from_node_id":      input.FromNodeID,
		"to_node_id":        input.ToNodeID,
		"doc_id":            input.DocID,
		"edge_type":         strings.TrimSpace(input.EdgeType),
		"label":             truncateText(strings.TrimSpace(input.Label), 128),
		"summary":           strings.TrimSpace(input.Summary),
		"evidence":          strings.TrimSpace(input.Evidence),
		"weight":            input.Weight,
		"confidence":        input.Confidence,
		"metadata":          jsonText(input.Metadata),
		"status":            1,
	})))
}
