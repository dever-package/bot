package knowledge

import (
	"context"
	"strings"
	"sync"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const conceptSourcePageSize = 1000

const knowledgeConceptMutationLockCount = 64

var knowledgeConceptMutationLocks [knowledgeConceptMutationLockCount]sync.Mutex

func lockKnowledgeConceptMutation(baseID uint64) func() {
	lock := &knowledgeConceptMutationLocks[baseID%knowledgeConceptMutationLockCount]
	lock.Lock()
	return lock.Unlock
}

func upsertKnowledgeConceptSource(ctx context.Context, baseID uint64, conceptNodeID uint64, docID uint64, sourceNodeID uint64, concept extractedConcept) {
	if baseID == 0 || conceptNodeID == 0 || docID == 0 {
		return
	}
	model := agentmodel.NewKnowledgeConceptSourceModel()
	filters := map[string]any{
		"concept_node_id": conceptNodeID,
		"doc_id":          docID,
		"source_node_id":  sourceNodeID,
	}
	values := map[string]any{
		"knowledge_base_id": baseID,
		"description":       truncateText(strings.TrimSpace(concept.Description), 800),
		"evidence":          truncateText(strings.TrimSpace(concept.Evidence), 1000),
		"keywords":          strings.Join(uniqueSummaryKeywords(concept.Keywords, 20), " "),
		"confidence":        normalizedConfidence(concept.Confidence, 0.75),
		"status":            1,
	}
	if existing := model.Find(ctx, filters); existing != nil {
		model.Update(ctx, map[string]any{"id": existing.ID}, values)
		return
	}
	values["concept_node_id"] = conceptNodeID
	values["doc_id"] = docID
	values["source_node_id"] = sourceNodeID
	model.Insert(ctx, withCreatedAt(values))
}

func migrateLegacyKnowledgeConceptSources(ctx context.Context, baseID uint64, conceptNodeID uint64, row *agentmodel.KnowledgeNode) {
	if row == nil || baseID == 0 || conceptNodeID == 0 {
		return
	}
	legacyDocIDs := uint64SliceFromMeta(parseMetadataMap(row.Metadata), "sources")
	if len(legacyDocIDs) == 0 {
		return
	}
	concept := extractedConcept{
		Name:        strings.TrimSpace(row.Title),
		Description: strings.TrimSpace(firstNonEmpty(row.Summary, row.Title)),
		Evidence:    strings.TrimSpace(firstNonEmpty(row.Content, row.PlainText, row.Summary)),
		Keywords:    splitSummaryKeywords(row.Keywords),
		Confidence:  0.5,
	}
	for _, docID := range uniqueUint64s(legacyDocIDs, 0) {
		upsertKnowledgeConceptSource(ctx, baseID, conceptNodeID, docID, 0, concept)
	}
}

func migrateLegacyKnowledgeConceptSourcesForIDs(ctx context.Context, baseID uint64, conceptIDs []uint64) {
	conceptIDs = uniqueUint64s(conceptIDs, 0)
	if baseID == 0 || len(conceptIDs) == 0 {
		return
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":                conceptIDs,
		"knowledge_base_id": baseID,
		"doc_id":            0,
		"node_type":         agentmodel.KnowledgeNodeTypeConcept,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title, main.summary, main.content, main.plain_text, main.keywords, main.metadata",
		"page":     1,
		"pageSize": len(conceptIDs),
	})
	for _, row := range rows {
		if row == nil {
			continue
		}
		metadata := parseMetadataMap(row.Metadata)
		if len(uint64SliceFromMeta(metadata, "sources")) == 0 {
			continue
		}
		migrateLegacyKnowledgeConceptSources(ctx, baseID, row.ID, row)
		delete(metadata, "sources")
		agentmodel.NewKnowledgeNodeModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"metadata": jsonText(metadata),
		})
	}
}

func clearKnowledgeConceptSourcesForDoc(ctx context.Context, baseID uint64, docID uint64) {
	if docID == 0 {
		return
	}
	unlock := lockKnowledgeConceptMutation(baseID)
	defer unlock()
	conceptIDs := knowledgeConceptIDsForDoc(ctx, baseID, docID)
	legacyConceptIDs := clearLegacyKnowledgeConceptSourceForDoc(ctx, baseID, docID)
	migrateLegacyKnowledgeConceptSourcesForIDs(ctx, baseID, legacyConceptIDs)
	agentmodel.NewKnowledgeConceptSourceModel().Delete(ctx, map[string]any{"doc_id": docID})
	pruneOrphanKnowledgeConcepts(ctx, baseID, append(conceptIDs, legacyConceptIDs...))
}

func clearLegacyKnowledgeConceptSourceForDoc(ctx context.Context, baseID uint64, docID uint64) []uint64 {
	if baseID == 0 || docID == 0 {
		return nil
	}
	conceptIDs := legacyKnowledgeConceptIDsForDoc(ctx, baseID, docID)
	if len(conceptIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":                conceptIDs,
		"knowledge_base_id": baseID,
		"doc_id":            0,
		"node_type":         agentmodel.KnowledgeNodeTypeConcept,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.metadata",
		"page":     1,
		"pageSize": len(conceptIDs),
	})
	affected := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		metadata := parseMetadataMap(row.Metadata)
		sources := uint64SliceFromMeta(metadata, "sources")
		remaining := make([]uint64, 0, len(sources))
		removed := false
		for _, sourceDocID := range sources {
			if sourceDocID == docID {
				removed = true
				continue
			}
			if sourceDocID > 0 {
				remaining = append(remaining, sourceDocID)
			}
		}
		if !removed {
			continue
		}
		affected = append(affected, row.ID)
		if len(remaining) == 0 {
			delete(metadata, "sources")
		} else {
			metadata["sources"] = uniqueUint64s(remaining, 0)
		}
		agentmodel.NewKnowledgeNodeModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"metadata": jsonText(metadata),
		})
	}
	return uniqueUint64s(affected, 0)
}

func legacyKnowledgeConceptIDsForDoc(ctx context.Context, baseID uint64, docID uint64) []uint64 {
	rows := agentmodel.NewKnowledgeEdgeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"doc_id":            docID,
		"status":            1,
	}, map[string]any{
		"field":    "main.from_node_id, main.to_node_id",
		"page":     1,
		"pageSize": conceptSourcePageSize,
	})
	ids := make([]uint64, 0, len(rows)*2)
	for _, row := range rows {
		if row == nil {
			continue
		}
		ids = append(ids, row.FromNodeID, row.ToNodeID)
	}
	return uniqueUint64s(ids, 0)
}

func knowledgeConceptIDsForDoc(ctx context.Context, baseID uint64, docID uint64) []uint64 {
	filters := map[string]any{"doc_id": docID}
	if baseID > 0 {
		filters["knowledge_base_id"] = baseID
	}
	rows := agentmodel.NewKnowledgeConceptSourceModel().Select(ctx, filters, map[string]any{
		"field":    "main.id, main.concept_node_id",
		"page":     1,
		"pageSize": conceptSourcePageSize,
	})
	result := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ConceptNodeID > 0 {
			result = append(result, row.ConceptNodeID)
		}
	}
	return uniqueUint64s(result, 0)
}

func pruneOrphanKnowledgeConcepts(ctx context.Context, baseID uint64, conceptIDs []uint64) {
	conceptIDs = uniqueUint64s(conceptIDs, 0)
	if len(conceptIDs) == 0 {
		return
	}
	for _, conceptID := range conceptIDs {
		if agentmodel.NewKnowledgeConceptSourceModel().Find(ctx, map[string]any{
			"concept_node_id": conceptID,
			"status":          1,
		}) != nil {
			continue
		}
		agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"from_node_id":      conceptID,
		})
		agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"to_node_id":        conceptID,
		})
		agentmodel.NewKnowledgeNodeModel().Delete(ctx, map[string]any{
			"id":        conceptID,
			"node_type": agentmodel.KnowledgeNodeTypeConcept,
			"doc_id":    0,
			"status":    1,
		})
	}
}

type knowledgeConceptSourceAvailability struct {
	available map[uint64]*agentmodel.KnowledgeConceptSource
	recorded  map[uint64]struct{}
}

func availableKnowledgeConceptSources(ctx context.Context, rows []*agentmodel.KnowledgeNode) knowledgeConceptSourceAvailability {
	conceptIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.DocID == 0 && row.NodeType == agentmodel.KnowledgeNodeTypeConcept {
			conceptIDs = append(conceptIDs, row.ID)
		}
	}
	conceptIDs = uniqueUint64s(conceptIDs, 0)
	if len(conceptIDs) == 0 {
		return knowledgeConceptSourceAvailability{}
	}

	sources := selectKnowledgeConceptSources(ctx, conceptIDs)
	docIDs := make([]uint64, 0, len(sources))
	for _, source := range sources {
		if source == nil {
			continue
		}
		docIDs = append(docIDs, source.DocID)
	}
	invalidDocs := unavailableKnowledgeDocIDs(ctx, docIDs)
	result := knowledgeConceptSourceAvailability{
		available: make(map[uint64]*agentmodel.KnowledgeConceptSource, len(conceptIDs)),
		recorded:  make(map[uint64]struct{}, len(conceptIDs)),
	}
	for _, source := range sources {
		if source == nil {
			continue
		}
		result.recorded[source.ConceptNodeID] = struct{}{}
		if source.DocID == 0 {
			continue
		}
		if _, invalid := invalidDocs[source.DocID]; invalid {
			continue
		}
		current := result.available[source.ConceptNodeID]
		if current == nil || source.Confidence > current.Confidence || (source.Confidence == current.Confidence && source.ID > current.ID) {
			result.available[source.ConceptNodeID] = source
		}
	}
	return result
}

func selectKnowledgeConceptSources(ctx context.Context, conceptIDs []uint64) []*agentmodel.KnowledgeConceptSource {
	result := make([]*agentmodel.KnowledgeConceptSource, 0)
	var afterID uint64
	for ctx.Err() == nil {
		filters := map[string]any{
			"concept_node_id": conceptIDs,
			"status":          1,
		}
		if afterID > 0 {
			filters["id"] = map[string]any{"gt": afterID}
		}
		rows := agentmodel.NewKnowledgeConceptSourceModel().Select(ctx, filters, map[string]any{
			"field":    "main.id, main.concept_node_id, main.doc_id, main.source_node_id, main.description, main.evidence, main.keywords, main.confidence, main.status",
			"order":    "main.id asc",
			"page":     1,
			"pageSize": conceptSourcePageSize,
		})
		if len(rows) == 0 {
			break
		}
		afterID = rows[len(rows)-1].ID
		result = append(result, rows...)
		if len(rows) < conceptSourcePageSize {
			break
		}
	}
	return result
}

func applyKnowledgeConceptSource(row *agentmodel.KnowledgeNode, source *agentmodel.KnowledgeConceptSource) *agentmodel.KnowledgeNode {
	if row == nil || source == nil {
		return row
	}
	copyRow := *row
	description := strings.TrimSpace(source.Description)
	evidence := strings.TrimSpace(source.Evidence)
	copyRow.Summary = description
	copyRow.Content = firstNonEmpty(evidence, description, copyRow.Title)
	copyRow.PlainText = copyRow.Content
	copyRow.SearchText = searchableNodeText("", "", copyRow.Path, copyRow.Title, description, evidence)
	copyRow.Keywords = strings.TrimSpace(source.Keywords)
	return &copyRow
}

func legacyKnowledgeConceptAvailable(row *agentmodel.KnowledgeNode, invalidDocs map[uint64]struct{}) bool {
	if row == nil {
		return false
	}
	sources := uint64SliceFromMeta(parseMetadataMap(row.Metadata), "sources")
	for _, docID := range sources {
		if docID == 0 {
			continue
		}
		if _, invalid := invalidDocs[docID]; !invalid {
			return true
		}
	}
	return false
}

func legacyKnowledgeConceptDocIDs(rows []*agentmodel.KnowledgeNode) []uint64 {
	result := make([]uint64, 0)
	for _, row := range rows {
		if row == nil || row.DocID != 0 || row.NodeType != agentmodel.KnowledgeNodeTypeConcept {
			continue
		}
		result = append(result, uint64SliceFromMeta(parseMetadataMap(row.Metadata), "sources")...)
	}
	return uniqueUint64s(result, 0)
}

func sanitizedLegacyKnowledgeConcept(row *agentmodel.KnowledgeNode) *agentmodel.KnowledgeNode {
	if row == nil {
		return nil
	}
	copyRow := *row
	copyRow.Summary = ""
	copyRow.Content = strings.TrimSpace(copyRow.Title)
	copyRow.PlainText = copyRow.Content
	copyRow.SearchText = strings.TrimSpace(strings.Join([]string{copyRow.Title, copyRow.Path, copyRow.Keywords}, "\n"))
	return &copyRow
}
