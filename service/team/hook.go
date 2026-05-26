package team

import (
	"context"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	teammodel "my/package/bot/model/team"
	frontaction "my/package/front/service/action"
)

const (
	defaultTeamCateID = teammodel.DefaultTeamCateID
	defaultTeamStatus = teammodel.StatusEnabled
	defaultTeamSort   = 100
)

type TeamHook struct{}

func (TeamHook) ProviderBeforeSaveTeam(_ *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)

	trimTeamStringField(record, "name", partial)
	trimTeamStringField(record, "description", partial)
	trimTeamStringField(record, "config", partial)
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "团队名称不能为空。")
	}
	if shouldNormalizeTeamField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultTeamCateID
	}
	if shouldNormalizeTeamField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func (TeamHook) ProviderBeforeSaveTeamCate(_ *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	trimTeamStringField(record, "name", partial)
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "分类名称不能为空。")
	}
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func (TeamHook) ProviderBeforeSaveRole(c *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	trimTeamStringField(record, "role_type", partial)
	trimTeamStringField(record, "role_key", partial)
	trimTeamStringField(record, "name", partial)
	trimTeamStringField(record, "assignment", partial)
	trimTeamStringField(record, "config", partial)
	hydrateExistingRoleContext(c.Context(), record, partial)
	if shouldNormalizeTeamField(record, "role_type", partial) {
		record["role_type"] = normalizeRoleType(util.ToStringTrimmed(record["role_type"]))
	}
	if !partial && util.ToUint64(record["team_id"]) == 0 {
		panicTeamField("form.team_id", "团队不能为空。")
	}
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "角色名称不能为空。")
	}
	if !partial && util.ToUint64(record["agent_id"]) == 0 {
		panicTeamField("form.agent_id", "智能体不能为空。")
	}
	if shouldNormalizeTeamField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func hydrateExistingRoleContext(ctx context.Context, record map[string]any, partial bool) {
	roleID := util.ToUint64(record["id"])
	if roleID == 0 {
		return
	}
	if partial && util.ToUint64(record["team_id"]) > 0 && util.ToStringTrimmed(record["role_type"]) != "" {
		return
	}
	if util.ToUint64(record["team_id"]) > 0 && util.ToStringTrimmed(record["role_type"]) != "" {
		return
	}

	current := teammodel.NewRoleModel().Find(ctx, map[string]any{"id": roleID})
	if current == nil {
		return
	}
	if util.ToUint64(record["team_id"]) == 0 {
		record["team_id"] = current.TeamID
	}
	if util.ToStringTrimmed(record["role_type"]) == "" {
		record["role_type"] = current.RoleType
	}
}

func cloneTeamRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func trimTeamStringField(record map[string]any, field string, partial bool) {
	if !shouldNormalizeTeamField(record, field, partial) {
		return
	}
	record[field] = util.ToStringTrimmed(record[field])
}

func defaultTeamInt16Field(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalizeTeamField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultTeamIntField(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalizeTeamField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldNormalizeTeamField(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func isPartialTeamRecord(record map[string]any) bool {
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

func panicTeamField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}
