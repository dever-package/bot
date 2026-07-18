package knowledge

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type knowledgeBaseAvailability struct {
	active         bool
	reviewRequired bool
}

func unavailableKnowledgeDocIDs(ctx context.Context, docIDs []uint64) map[uint64]struct{} {
	docIDs = uniqueUint64s(docIDs, 0)
	invalid := make(map[uint64]struct{})
	if len(docIDs) == 0 {
		return invalid
	}

	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id": docIDs,
	}, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.status, main.index_status, main.expires_at, main.review_status",
		"page":     1,
		"pageSize": len(docIDs),
	})
	baseIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.KnowledgeBaseID > 0 {
			baseIDs = append(baseIDs, row.KnowledgeBaseID)
		}
	}
	baseAvailability := knowledgeBaseAvailabilityByID(ctx, baseIDs)
	found := make(map[uint64]struct{}, len(rows))
	now := time.Now()
	for _, row := range rows {
		if row == nil {
			continue
		}
		found[row.ID] = struct{}{}
		base := baseAvailability[row.KnowledgeBaseID]
		if !base.active || !knowledgeDocAvailableAt(row, base.reviewRequired, now) {
			invalid[row.ID] = struct{}{}
		}
	}
	for _, docID := range docIDs {
		if _, ok := found[docID]; !ok {
			invalid[docID] = struct{}{}
		}
	}
	return invalid
}

func knowledgeDocAvailableAt(row *agentmodel.KnowledgeDoc, reviewRequired bool, now time.Time) bool {
	return knowledgeDocGovernanceAvailableAt(row, reviewRequired, now) &&
		row.IndexStatus == agentmodel.KnowledgeIndexStatusSuccess
}

func knowledgeDocGovernanceAvailableAt(row *agentmodel.KnowledgeDoc, reviewRequired bool, now time.Time) bool {
	if row == nil {
		return false
	}
	if row.Status != 1 {
		return false
	}
	reviewStatus := knowledgeDocReviewStatusAt(row, now)
	if reviewStatus == agentmodel.KnowledgeReviewStatusRejected {
		return false
	}
	if reviewStatus == agentmodel.KnowledgeReviewStatusExpired {
		return false
	}
	if reviewRequired && reviewStatus != agentmodel.KnowledgeReviewStatusApproved {
		return false
	}
	return true
}

func knowledgeDocReviewStatusAt(row *agentmodel.KnowledgeDoc, now time.Time) string {
	if row == nil {
		return agentmodel.KnowledgeReviewStatusPending
	}
	if row.ExpiresAt != nil && row.ExpiresAt.Before(now) {
		return agentmodel.KnowledgeReviewStatusExpired
	}
	status := row.ReviewStatus
	if status == "" {
		return agentmodel.KnowledgeReviewStatusPending
	}
	return status
}

func knowledgeBaseAvailabilityByID(ctx context.Context, baseIDs []uint64) map[uint64]knowledgeBaseAvailability {
	baseIDs = uniqueUint64s(baseIDs, 0)
	result := make(map[uint64]knowledgeBaseAvailability, len(baseIDs))
	if len(baseIDs) == 0 {
		return result
	}
	rows := agentmodel.NewKnowledgeBaseModel().Select(ctx, map[string]any{"id": baseIDs}, map[string]any{
		"field":    "main.id, main.review_required, main.status",
		"page":     1,
		"pageSize": len(baseIDs),
	})
	for _, row := range rows {
		if row == nil {
			continue
		}
		result[row.ID] = knowledgeBaseAvailability{
			active:         row.Status == 1,
			reviewRequired: row.ReviewRequired,
		}
	}
	return result
}

func availableKnowledgeNode(ctx context.Context, nodeID uint64) *agentmodel.KnowledgeNode {
	if nodeID == 0 {
		return nil
	}
	row := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{
		"id":           nodeID,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	})
	nodes := filterAvailableKnowledgeNodes(ctx, []*agentmodel.KnowledgeNode{row})
	if len(nodes) == 0 {
		return nil
	}
	return nodes[0]
}

func filterAvailableKnowledgeNodes(ctx context.Context, rows []*agentmodel.KnowledgeNode) []*agentmodel.KnowledgeNode {
	if len(rows) == 0 {
		return rows
	}
	docIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if row.DocID > 0 {
			docIDs = append(docIDs, row.DocID)
		}
	}
	invalidDocs := unavailableKnowledgeDocIDs(ctx, docIDs)
	result := make([]*agentmodel.KnowledgeNode, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if row.Status != 1 {
			continue
		}
		if row.IndexStatus != agentmodel.KnowledgeIndexStatusSuccess {
			continue
		}
		if _, invalid := invalidDocs[row.DocID]; invalid {
			continue
		}
		result = append(result, row)
	}
	return result
}

func filterAvailableKnowledgeEdges(ctx context.Context, rows []*agentmodel.KnowledgeEdge) []*agentmodel.KnowledgeEdge {
	if len(rows) == 0 {
		return rows
	}
	docIDs := make([]uint64, 0, len(rows))
	nodeIDs := make([]uint64, 0, len(rows)*2)
	for _, row := range rows {
		if row == nil {
			continue
		}
		if row.DocID > 0 {
			docIDs = append(docIDs, row.DocID)
		}
		nodeIDs = append(nodeIDs, row.FromNodeID, row.ToNodeID)
	}
	invalidDocs := unavailableKnowledgeDocIDs(ctx, docIDs)
	availableNodes := availableKnowledgeNodeIDSet(ctx, nodeIDs)
	result := make([]*agentmodel.KnowledgeEdge, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if _, invalid := invalidDocs[row.DocID]; invalid {
			continue
		}
		if row.FromNodeID == 0 || row.ToNodeID == 0 {
			continue
		}
		if _, ok := availableNodes[row.FromNodeID]; !ok {
			continue
		}
		if _, ok := availableNodes[row.ToNodeID]; !ok {
			continue
		}
		result = append(result, row)
	}
	return result
}

func availableKnowledgeNodeIDSet(ctx context.Context, nodeIDs []uint64) map[uint64]struct{} {
	nodeIDs = uniqueUint64s(nodeIDs, 0)
	result := make(map[uint64]struct{}, len(nodeIDs))
	if len(nodeIDs) == 0 {
		return result
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":           nodeIDs,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	}, map[string]any{
		"field":    "main.id, main.doc_id, main.index_status, main.status",
		"page":     1,
		"pageSize": len(nodeIDs),
	})
	for _, row := range filterAvailableKnowledgeNodes(ctx, rows) {
		if row != nil && row.ID > 0 {
			result[row.ID] = struct{}{}
		}
	}
	return result
}
