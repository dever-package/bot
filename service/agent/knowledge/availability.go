package knowledge

import (
	"context"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func unavailableKnowledgeDocIDs(ctx context.Context, docIDs []uint64) map[uint64]struct{} {
	docIDs = uniqueUint64s(docIDs, 0)
	invalid := make(map[uint64]struct{})
	if len(docIDs) == 0 {
		return invalid
	}

	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id": docIDs,
	}, map[string]any{
		"field":    "main.id, main.status, main.index_status, main.expires_at, main.review_status",
		"page":     1,
		"pageSize": len(docIDs),
	})
	found := make(map[uint64]struct{}, len(rows))
	now := time.Now()
	for _, row := range rows {
		if row == nil {
			continue
		}
		found[row.ID] = struct{}{}
		if !knowledgeDocAvailableAt(row, now) {
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

func knowledgeDocAvailableAt(row *agentmodel.KnowledgeDoc, now time.Time) bool {
	if row == nil {
		return false
	}
	if row.Status != 1 {
		return false
	}
	if row.IndexStatus != agentmodel.KnowledgeIndexStatusSuccess {
		return false
	}
	if row.ReviewStatus == agentmodel.KnowledgeReviewStatusRejected {
		return false
	}
	if row.ReviewStatus == agentmodel.KnowledgeReviewStatusExpired {
		return false
	}
	if row.ExpiresAt != nil && row.ExpiresAt.Before(now) {
		return false
	}
	return true
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
