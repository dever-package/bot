package agent

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const runStepSummaryLimit = 500

// RunViewService loads lightweight data used by the agent run detail page.
type RunViewService struct{}

func (RunViewService) ProviderAttachRunList(c *server.Context, params []any) any {
	rows := agentRunListRows(params)
	ids := agentRunListIDs(rows)
	if len(ids) == 0 {
		return rows
	}

	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
	}
	agents := agentmodel.NewAgentModel().SelectMap(ctx, map[string]any{"id": ids}, map[string]any{
		"field": "main.id,main.name",
	})
	names := make(map[uint64]string, len(agents))
	for _, agent := range agents {
		if id := util.ToUint64(agent["id"]); id > 0 {
			names[id] = strings.TrimSpace(util.ToString(agent["name"]))
		}
	}
	for _, row := range rows {
		id := util.ToUint64(row["agent_id"])
		row["agent"] = map[string]any{
			"id":   id,
			"name": agentRunListName(id, names[id]),
		}
	}
	return rows
}

func (RunViewService) ProviderLoadStepSummaries(c *server.Context, _ []any) any {
	ctx := context.Background()
	runID := uint64(0)
	if c != nil {
		ctx = c.Context()
		runID = util.ToUint64(c.Input("id"))
	}
	if runID == 0 {
		return map[string]any{"list": []map[string]any{}}
	}

	rows := agentmodel.NewStepModel().SelectMap(ctx, map[string]any{"run_id": runID}, map[string]any{
		"field":    "main.id,main.run_id,main.request_id,main.seq,main.type,main.title,main.status,main.created_at",
		"order":    "main.seq asc,main.id asc",
		"pageSize": runStepSummaryLimit,
	})
	return map[string]any{"list": rows}
}

func agentRunListRows(params []any) []map[string]any {
	if len(params) == 0 {
		return []map[string]any{}
	}
	payload, ok := params[0].(map[string]any)
	if !ok {
		return []map[string]any{}
	}
	switch rows := payload["rows"].(type) {
	case []map[string]any:
		return rows
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, value := range rows {
			if row, ok := value.(map[string]any); ok && row != nil {
				result = append(result, row)
			}
		}
		return result
	default:
		return []map[string]any{}
	}
}

func agentRunListIDs(rows []map[string]any) []uint64 {
	seen := make(map[uint64]struct{})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["agent_id"])
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

func agentRunListName(id uint64, name string) string {
	if strings.TrimSpace(name) != "" {
		return strings.TrimSpace(name)
	}
	if id == 0 {
		return "未关联智能体"
	}
	return fmt.Sprintf("智能体 #%d（已删除）", id)
}
