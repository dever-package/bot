package project

import (
	"context"
	"strings"
	"time"

	workspacemodel "my/package/bot/model/workspace"
)

const workspaceAgentMemoryLimit = 12

type workspaceAgentMemoryEntry struct {
	ProjectID   uint64
	AssetCateID uint64
	AgentID     uint64
	NodeKey     string
	Role        string
	Content     any
	RunID       uint64
	NodeRunID   uint64
	AgentRunID  uint64
}

func appendWorkspaceAgentMemory(ctx context.Context, entry workspaceAgentMemoryEntry) {
	if entry.ProjectID == 0 || entry.AgentID == 0 || strings.TrimSpace(entry.NodeKey) == "" {
		return
	}
	role := strings.TrimSpace(entry.Role)
	content := map[string]any{
		"role":      role,
		"content":   entry.Content,
		"createdAt": time.Now().UTC().Format(time.RFC3339Nano),
	}
	if role == "" {
		delete(content, "role")
	}
	workspacemodel.NewAgentMemoryModel().Insert(ctx, map[string]any{
		"project_id":    entry.ProjectID,
		"asset_cate_id": entry.AssetCateID,
		"agent_id":      entry.AgentID,
		"node_key":      strings.TrimSpace(entry.NodeKey),
		"role":          role,
		"content":       jsonText(content, "{}"),
		"run_id":        entry.RunID,
		"node_run_id":   entry.NodeRunID,
		"agent_run_id":  entry.AgentRunID,
		"created_at":    time.Now(),
	})
}

func workspaceAgentHistory(ctx context.Context, projectID uint64, assetCateID uint64, nodeKey string, agentID uint64) []any {
	if projectID == 0 || agentID == 0 || strings.TrimSpace(nodeKey) == "" {
		return []any{}
	}
	rows := workspacemodel.NewAgentMemoryModel().Select(
		ctx,
		map[string]any{
			"project_id":    projectID,
			"asset_cate_id": assetCateID,
			"node_key":      strings.TrimSpace(nodeKey),
			"agent_id":      agentID,
		},
		map[string]any{
			"order": "main.id desc",
			"limit": workspaceAgentMemoryLimit,
		},
	)
	result := make([]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		row := rows[index]
		if row == nil {
			continue
		}
		value := jsonValue(row.Content, map[string]any{})
		if value != nil {
			result = append(result, value)
		}
	}
	return result
}
