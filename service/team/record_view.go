package team

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	teammodel "github.com/dever-package/bot/model/team"
)

// RecordViewService attaches compact display relations to team record lists.
type RecordViewService struct{}

func (RecordViewService) ProviderAttachRunList(c *server.Context, params []any) any {
	rows := teamRecordRows(params)
	names := loadTeamRecordNames(teamRecordContext(c), "team_id", rows, func(ctx context.Context, ids []uint64) []map[string]any {
		return teammodel.NewTeamModel().SelectMap(ctx, map[string]any{"id": ids}, map[string]any{
			"field": "main.id,main.name",
		})
	})
	attachTeamRecordNames(rows, "team_id", "team", "团队", names)
	return rows
}

func (RecordViewService) ProviderAttachNodeRunList(c *server.Context, params []any) any {
	rows := teamRecordRows(params)
	ctx := teamRecordContext(c)
	flowNames := loadTeamRecordNames(ctx, "flow_id", rows, func(ctx context.Context, ids []uint64) []map[string]any {
		return teammodel.NewFlowModel().SelectMap(ctx, map[string]any{"id": ids}, map[string]any{
			"field": "main.id,main.name",
		})
	})
	nodeNames := loadTeamRecordNames(ctx, "node_id", rows, func(ctx context.Context, ids []uint64) []map[string]any {
		return teammodel.NewFlowNodeModel().SelectMap(ctx, map[string]any{"id": ids}, map[string]any{
			"field": "main.id,main.name",
		})
	})
	attachTeamRecordNames(rows, "flow_id", "flow", "工作流", flowNames)
	attachTeamRecordNames(rows, "node_id", "node", "节点", nodeNames)
	return rows
}

func teamRecordRows(params []any) []map[string]any {
	payload := cloneTeamRecord(params)
	return normalizeTeamChildRows(payload["rows"])
}

func teamRecordContext(c *server.Context) context.Context {
	if c != nil {
		return c.Context()
	}
	return context.Background()
}

func loadTeamRecordNames(
	ctx context.Context,
	idField string,
	rows []map[string]any,
	load func(context.Context, []uint64) []map[string]any,
) map[uint64]string {
	ids := teamRecordIDs(rows, idField)
	if len(ids) == 0 {
		return map[uint64]string{}
	}
	loaded := load(ctx, ids)
	names := make(map[uint64]string, len(loaded))
	for _, row := range loaded {
		if id := util.ToUint64(row["id"]); id > 0 {
			names[id] = strings.TrimSpace(util.ToString(row["name"]))
		}
	}
	return names
}

func teamRecordIDs(rows []map[string]any, field string) []uint64 {
	seen := make(map[uint64]struct{})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row[field])
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

func attachTeamRecordNames(
	rows []map[string]any,
	idField string,
	relationField string,
	kind string,
	names map[uint64]string,
) {
	for _, row := range rows {
		id := util.ToUint64(row[idField])
		row[relationField] = map[string]any{
			"id":   id,
			"name": teamRecordName(kind, id, names[id]),
		}
	}
}

func teamRecordName(kind string, id uint64, name string) string {
	if strings.TrimSpace(name) != "" {
		return strings.TrimSpace(name)
	}
	if id == 0 {
		return "未关联" + kind
	}
	return fmt.Sprintf("%s #%d（已删除）", kind, id)
}
