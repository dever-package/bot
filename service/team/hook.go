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

func (TeamHook) ProviderBeforeSaveTeam(c *server.Context, params []any) any {
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
	if rawRows, exists := record["asset_cates"]; exists {
		record["asset_cates"] = normalizeTeamAssetCateRows(c.Context(), util.ToUint64(record["id"]), rawRows)
	}
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

func (TeamHook) ProviderBeforeSaveAssetCate(c *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	trimTeamStringField(record, "name", partial)
	if !partial && util.ToUint64(record["team_id"]) == 0 {
		panicTeamField("form.team_id", "团队不能为空。")
	}
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "资产分类名称不能为空。")
	}
	if shouldNormalizeTeamField(record, "name", partial) || shouldNormalizeTeamField(record, "team_id", partial) {
		validateAssetCateNameUnique(c.Context(), record, partial)
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func validateAssetCateNameUnique(ctx context.Context, record map[string]any, partial bool) {
	teamID := util.ToUint64(record["team_id"])
	name := util.ToStringTrimmed(record["name"])
	if partial {
		currentID := util.ToUint64(record["id"])
		if currentID > 0 && (teamID == 0 || name == "") {
			current := teammodel.NewAssetCateModel().Find(ctx, map[string]any{"id": currentID})
			if current != nil {
				if teamID == 0 {
					teamID = current.TeamID
				}
				if name == "" {
					name = current.Name
				}
			}
		}
	}
	if teamID == 0 || name == "" {
		return
	}
	existing := teammodel.NewAssetCateModel().Find(ctx, map[string]any{
		"team_id": teamID,
		"name":    name,
	})
	if existing == nil || existing.ID == util.ToUint64(record["id"]) {
		return
	}
	panicTeamField("form.name", "该团队下已存在同名资产分类。")
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
	if shouldNormalizeTeamField(record, "asset_cate_id", partial) {
		normalizeRoleAssetCate(c.Context(), record)
	}
	if shouldNormalizeTeamField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func normalizeRoleAssetCate(ctx context.Context, record map[string]any) {
	assetCateID := util.ToUint64(record["asset_cate_id"])
	if assetCateID == 0 {
		record["asset_cate_id"] = 0
		return
	}
	teamID := util.ToUint64(record["team_id"])
	row := teammodel.NewAssetCateModel().Find(ctx, map[string]any{
		"id": assetCateID,
	})
	if row == nil || row.Status != teammodel.StatusEnabled {
		panicTeamField("form.asset_cate_id", "资产分类不存在或已停用。")
	}
	if teamID > 0 && row.TeamID != teamID {
		panicTeamField("form.asset_cate_id", "资产分类不属于当前团队。")
	}
}

func normalizeTeamAssetCateRows(ctx context.Context, teamID uint64, value any) []any {
	rows := normalizeTeamChildRows(value)
	if len(rows) == 0 {
		return []any{}
	}

	existingByID, existingIDByName := existingTeamAssetCates(ctx, teamID)
	seenNames := map[string]struct{}{}
	result := make([]any, 0, len(rows))
	for index, row := range rows {
		next := util.CloneMap(row)
		name := util.ToStringTrimmed(next["name"])
		if name == "" {
			panicTeamField("form.asset_cates", "资产分类名称不能为空。")
		}
		if _, exists := seenNames[name]; exists {
			panicTeamField("form.asset_cates", "资产分类名称不能重复。")
		}
		seenNames[name] = struct{}{}

		next["name"] = name
		if teamID > 0 {
			next["team_id"] = teamID
			rowID := util.ToUint64(next["id"])
			if rowID > 0 {
				if _, exists := existingByID[rowID]; !exists {
					panicTeamField("form.asset_cates", "资产分类不属于当前团队。")
				}
			} else if existingID := existingIDByName[name]; existingID > 0 {
				next["id"] = existingID
			}
		}
		defaultTeamInt16Field(next, "status", defaultTeamStatus, false)
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		result = append(result, next)
	}
	return result
}

func existingTeamAssetCates(ctx context.Context, teamID uint64) (map[uint64]teammodel.AssetCate, map[string]uint64) {
	byID := map[uint64]teammodel.AssetCate{}
	byName := map[string]uint64{}
	if teamID == 0 {
		return byID, byName
	}
	rows := teammodel.NewAssetCateModel().Select(ctx, map[string]any{"team_id": teamID})
	for _, row := range rows {
		if row == nil {
			continue
		}
		byID[row.ID] = *row
		byName[row.Name] = row.ID
	}
	return byID, byName
}

func normalizeTeamChildRows(value any) []map[string]any {
	if rows, ok := value.([]map[string]any); ok {
		return rows
	}
	rawRows, ok := value.([]any)
	if !ok {
		return nil
	}
	rows := make([]map[string]any, 0, len(rawRows))
	for _, item := range rawRows {
		row, ok := item.(map[string]any)
		if !ok || len(row) == 0 {
			continue
		}
		rows = append(rows, row)
	}
	return rows
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
