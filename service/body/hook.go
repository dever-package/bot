package body

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	bodymodel "my/package/bot/model/body"
	energonmodel "my/package/bot/model/energon"
	teammodel "my/package/bot/model/team"
	frontaction "my/package/front/service/action"
)

const (
	defaultStatus = int16(1)
	defaultSort   = 100
)

type CanvasHook struct{}

func (CanvasHook) ProviderBeforeSaveCanvas(c *server.Context, params []any) any {
	record := cloneBodyRecord(params)
	if len(record) == 0 {
		return record
	}

	partial := isPartialBodyRecord(record)
	trimBodyStringField(record, "name", partial)
	trimBodyStringField(record, "config", partial)
	if !partial && record["name"] == "" {
		panicBodyField("form.name", "画布名称不能为空。")
	}
	if shouldNormalizeBodyField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultBodyInt16Field(record, "status", defaultStatus, partial)
	defaultBodyIntField(record, "sort", defaultSort, partial)

	canvasID := util.ToUint64(record["id"])
	if rawRows, exists := record["powers"]; exists {
		record["powers"] = normalizeCanvasPowerRows(c, canvasID, rawRows)
	}
	if rawRows, exists := record["agents"]; exists {
		record["agents"] = normalizeCanvasAgentRows(c, canvasID, rawRows)
	}
	if rawRows, exists := record["teams"]; exists {
		record["teams"] = normalizeCanvasTeamRows(c, canvasID, rawRows)
	}

	return record
}

func normalizeCanvasPowerRows(c *server.Context, canvasID uint64, value any) []any {
	rows := normalizeBodyChildRows(value)
	if len(rows) == 0 {
		return []any{}
	}

	existingIDs := existingCanvasPowerIDs(c, canvasID)
	seen := map[uint64]struct{}{}
	result := make([]any, 0, len(rows))
	for index, row := range rows {
		next := util.CloneMap(row)
		powerID := canvasChildRelationID(next, "power_id")
		if powerID == 0 {
			panicBodyField("form.powers", "画布能力必须选择能力。")
		}
		next["power_id"] = powerID
		if _, exists := seen[powerID]; exists {
			panicBodyField("form.powers", "画布能力不能重复选择同一个能力。")
		}
		seen[powerID] = struct{}{}

		power := energonmodel.NewPowerModel().Find(c.Context(), map[string]any{"id": powerID})
		if power == nil || power.Status != defaultStatus {
			panicBodyField("form.powers", "画布能力选择的能力不存在或未开启。")
		}
		if id := existingIDs[powerID]; id > 0 && util.ToUint64(next["id"]) == 0 {
			next["id"] = id
		}
		normalizeCanvasChildRow(next, index)
		result = append(result, next)
	}
	return result
}

func normalizeCanvasAgentRows(c *server.Context, canvasID uint64, value any) []any {
	rows := normalizeBodyChildRows(value)
	if len(rows) == 0 {
		return []any{}
	}

	existingIDs := existingCanvasAgentIDs(c, canvasID)
	seen := map[uint64]struct{}{}
	result := make([]any, 0, len(rows))
	for index, row := range rows {
		next := util.CloneMap(row)
		agentID := canvasChildRelationID(next, "agent_id")
		if agentID == 0 {
			panicBodyField("form.agents", "画布智能体必须选择智能体。")
		}
		next["agent_id"] = agentID
		if _, exists := seen[agentID]; exists {
			panicBodyField("form.agents", "画布智能体不能重复选择同一个智能体。")
		}
		seen[agentID] = struct{}{}

		agent := agentmodel.NewAgentModel().Find(c.Context(), map[string]any{"id": agentID})
		if agent == nil || agent.Status != defaultStatus {
			panicBodyField("form.agents", "画布智能体选择的智能体不存在或未开启。")
		}
		if id := existingIDs[agentID]; id > 0 && util.ToUint64(next["id"]) == 0 {
			next["id"] = id
		}
		normalizeCanvasChildRow(next, index)
		result = append(result, next)
	}
	return result
}

func normalizeCanvasTeamRows(c *server.Context, canvasID uint64, value any) []any {
	rows := normalizeBodyChildRows(value)
	if len(rows) == 0 {
		return []any{}
	}

	existingIDs := existingCanvasTeamIDs(c, canvasID)
	seen := map[uint64]struct{}{}
	result := make([]any, 0, len(rows))
	for index, row := range rows {
		next := util.CloneMap(row)
		teamID := canvasChildRelationID(next, "team_id")
		if teamID == 0 {
			panicBodyField("form.teams", "画布团队必须选择团队。")
		}
		next["team_id"] = teamID
		if _, exists := seen[teamID]; exists {
			panicBodyField("form.teams", "画布团队不能重复选择同一个团队。")
		}
		seen[teamID] = struct{}{}

		team := teammodel.NewTeamModel().Find(c.Context(), map[string]any{"id": teamID})
		releaseID := canvasTeamReleaseID(c, team)
		if team == nil || team.Status != teammodel.StatusEnabled || releaseID == 0 {
			panicBodyField("form.teams", "画布团队必须选择已发布过且开启的团队。")
		}
		next["release_id"] = releaseID
		if id := existingIDs[teamID]; id > 0 && util.ToUint64(next["id"]) == 0 {
			next["id"] = id
		}
		normalizeCanvasChildRow(next, index)
		result = append(result, next)
	}
	return result
}

func canvasTeamReleaseID(c *server.Context, team *teammodel.Team) uint64 {
	if team == nil {
		return 0
	}
	if team.CurrentReleaseID > 0 {
		release := teammodel.NewTeamReleaseModel().Find(c.Context(), map[string]any{"id": team.CurrentReleaseID})
		if release != nil && release.TeamID == team.ID && release.Status == teammodel.TeamReleaseStatusCurrent {
			return release.ID
		}
	}
	release := teammodel.NewTeamReleaseModel().Find(c.Context(), map[string]any{
		"team_id": team.ID,
		"status":  teammodel.TeamReleaseStatusCurrent,
	})
	if release == nil {
		return 0
	}
	return release.ID
}

func normalizeCanvasChildRow(row map[string]any, index int) {
	if util.ToIntDefault(row["status"], 0) <= 0 {
		row["status"] = defaultStatus
	}
	row["sort"] = index + 1
	if strings.TrimSpace(util.ToString(row["config"])) == "" {
		row["config"] = "{}"
	}
}

func canvasChildRelationID(row map[string]any, field string) uint64 {
	if id := util.ToUint64(row[field]); id > 0 {
		return id
	}
	if id := lastUint64FromSlice(row[field]); id > 0 {
		return id
	}

	relationField := strings.TrimSuffix(field, "_id")
	if relationField == field {
		return 0
	}
	if relation, ok := row[relationField].(map[string]any); ok {
		if id := util.ToUint64(relation["id"]); id > 0 {
			return id
		}
		return lastUint64FromSlice(relation["id"])
	}
	return 0
}

func lastUint64FromSlice(value any) uint64 {
	switch rows := value.(type) {
	case []any:
		for index := len(rows) - 1; index >= 0; index-- {
			if id := util.ToUint64(rows[index]); id > 0 {
				return id
			}
		}
	case []string:
		for index := len(rows) - 1; index >= 0; index-- {
			if id := util.ToUint64(rows[index]); id > 0 {
				return id
			}
		}
	case []uint64:
		for index := len(rows) - 1; index >= 0; index-- {
			if rows[index] > 0 {
				return rows[index]
			}
		}
	case []int:
		for index := len(rows) - 1; index >= 0; index-- {
			if rows[index] > 0 {
				return uint64(rows[index])
			}
		}
	case []float64:
		for index := len(rows) - 1; index >= 0; index-- {
			if rows[index] > 0 {
				return uint64(rows[index])
			}
		}
	}
	return 0
}

func existingCanvasPowerIDs(c *server.Context, canvasID uint64) map[uint64]uint64 {
	result := map[uint64]uint64{}
	if canvasID == 0 {
		return result
	}
	rows := bodymodel.NewCanvasPowerModel().Select(c.Context(), map[string]any{"canvas_id": canvasID})
	for _, row := range rows {
		if row != nil && row.PowerID > 0 {
			result[row.PowerID] = row.ID
		}
	}
	return result
}

func existingCanvasAgentIDs(c *server.Context, canvasID uint64) map[uint64]uint64 {
	result := map[uint64]uint64{}
	if canvasID == 0 {
		return result
	}
	rows := bodymodel.NewCanvasAgentModel().Select(c.Context(), map[string]any{"canvas_id": canvasID})
	for _, row := range rows {
		if row != nil && row.AgentID > 0 {
			result[row.AgentID] = row.ID
		}
	}
	return result
}

func existingCanvasTeamIDs(c *server.Context, canvasID uint64) map[uint64]uint64 {
	result := map[uint64]uint64{}
	if canvasID == 0 {
		return result
	}
	rows := bodymodel.NewCanvasTeamModel().Select(c.Context(), map[string]any{"canvas_id": canvasID})
	for _, row := range rows {
		if row != nil && row.TeamID > 0 {
			result[row.TeamID] = row.ID
		}
	}
	return result
}

func normalizeBodyChildRows(value any) []map[string]any {
	switch rows := value.(type) {
	case []map[string]any:
		result := make([]map[string]any, 0, len(rows))
		for _, row := range rows {
			if row != nil {
				result = append(result, row)
			}
		}
		return result
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, item := range rows {
			if row, ok := item.(map[string]any); ok && row != nil {
				result = append(result, row)
			}
		}
		return result
	default:
		return nil
	}
}

func cloneBodyRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func trimBodyStringField(record map[string]any, field string, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	record[field] = util.ToStringTrimmed(record[field])
}

func defaultBodyInt16Field(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultBodyIntField(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldNormalizeBodyField(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func isPartialBodyRecord(record map[string]any) bool {
	switch value := record["_partial"].(type) {
	case bool:
		return value
	case string:
		normalized := strings.ToLower(strings.TrimSpace(value))
		return normalized == "1" || normalized == "true" || normalized == "yes"
	case int:
		return value != 0
	case int64:
		return value != 0
	case float64:
		return value != 0
	default:
		return false
	}
}

func panicBodyField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}
