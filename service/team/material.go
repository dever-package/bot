package team

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	teammodel "github.com/dever-package/bot/model/team"
)

type MaterialHook struct{}

func (MaterialHook) ProviderLoadMaterialCates(c *server.Context, _ []any) any {
	rows := teammodel.NewMaterialCateModel().SelectMap(c.Context(), map[string]any{
		"status": teammodel.StatusEnabled,
	}, map[string]any{
		"field": "main.id, main.name, main.kind, main.status, main.sort",
		"order": "main.sort asc, main.id asc",
	})
	return normalizeMaterialCateOptions(rows)
}

func normalizeMaterialCateOptions(rows []map[string]any) []map[string]any {
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		name := util.ToStringTrimmed(row["name"])
		options = append(options, map[string]any{
			"id":     util.ToUint64(row["id"]),
			"value":  name,
			"name":   name,
			"kind":   teammodel.NormalizeMaterialKind(util.ToStringTrimmed(row["kind"])),
			"status": util.ToIntDefault(row["status"], 0),
			"sort":   util.ToIntDefault(row["sort"], 0),
		})
	}
	return options
}

func (MaterialHook) ProviderBeforeSaveMaterialCate(c *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	trimTeamStringField(record, "name", partial)
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "素材分类名称不能为空。")
	}
	if shouldNormalizeTeamField(record, "kind", partial) {
		nextKind := teammodel.NormalizeMaterialKind(util.ToStringTrimmed(record["kind"]))
		if c != nil && util.ToUint64(record["id"]) > 0 {
			current := teammodel.NewMaterialCateModel().Find(c.Context(), map[string]any{"id": util.ToUint64(record["id"])})
			if current != nil && materialCateKindChanged(current.Kind, nextKind) {
				panicTeamField("form.kind", "已有素材分类不能修改类型。")
			}
		}
		record["kind"] = nextKind
	}
	defaultTeamInt16FieldOnCreateOrPresent(record, "status", defaultTeamStatus, partial)
	defaultTeamIntFieldOnCreateOrPresent(record, "sort", defaultTeamSort, partial)
	return record
}

func materialCateKindChanged(current string, next string) bool {
	return teammodel.NormalizeMaterialKind(current) != teammodel.NormalizeMaterialKind(next)
}

func (MaterialHook) ProviderBeforeSaveMaterial(c *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	for _, field := range []string{"name", "description", "content", "resource_url"} {
		trimTeamStringField(record, field, partial)
	}
	if shouldNormalizeTeamField(record, "kind", partial) {
		record["kind"] = teammodel.NormalizeMaterialKind(util.ToStringTrimmed(record["kind"]))
	}
	if !partial {
		if util.ToStringTrimmed(record["name"]) == "" {
			panicTeamField("form.name", "素材名称不能为空。")
		}
		if util.ToUint64(record["cate_id"]) == 0 {
			panicTeamField("form.cate_id", "素材分类不能为空。")
		}
		kind := teammodel.NormalizeMaterialKind(util.ToStringTrimmed(record["kind"]))
		if kind == teammodel.MaterialKindPrompt && util.ToStringTrimmed(record["content"]) == "" {
			panicTeamField("form.content", "提示词内容不能为空。")
		}
		if kind != teammodel.MaterialKindPrompt && util.ToStringTrimmed(record["resource_url"]) == "" {
			panicTeamField("form.resource_url", "素材文件不能为空。")
		}
	}
	if c != nil && !partial {
		cate := teammodel.NewMaterialCateModel().Find(c.Context(), map[string]any{
			"id":     util.ToUint64(record["cate_id"]),
			"status": teammodel.StatusEnabled,
		})
		if cate == nil {
			panicTeamField("form.cate_id", "素材分类不存在或已停用。")
		}
		if cate.Kind != teammodel.NormalizeMaterialKind(util.ToStringTrimmed(record["kind"])) {
			panicTeamField("form.cate_id", "素材分类与素材类型不一致。")
		}
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func (MaterialHook) ProviderBeforeSaveMaterialPack(_ *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	trimTeamStringField(record, "name", partial)
	trimTeamStringField(record, "description", partial)
	if !partial && record["name"] == "" {
		panicTeamField("form.name", "素材方案名称不能为空。")
	}
	defaultTeamInt16FieldOnCreateOrPresent(record, "status", defaultTeamStatus, partial)
	defaultTeamIntFieldOnCreateOrPresent(record, "sort", defaultTeamSort, partial)
	if rawItems, exists := record["items"]; exists {
		record["items"] = normalizeMaterialPackItemRows(rawItems)
	}
	return record
}

func (MaterialHook) ProviderBeforeSaveMaterialPackItem(c *server.Context, params []any) any {
	record := cloneTeamRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialTeamRecord(record)
	if !partial && util.ToUint64(record["pack_id"]) == 0 {
		panicTeamField("form.pack_id", "素材方案不能为空。")
	}
	if !partial && util.ToUint64(record["material_id"]) == 0 {
		panicTeamField("form.material_id", "素材不能为空。")
	}
	if c != nil && shouldValidateMaterialPackItem(record, partial) {
		packID, materialID := materialPackItemIdentity(c, record)
		pack := teammodel.NewMaterialPackModel().Find(c.Context(), map[string]any{
			"id":     packID,
			"status": teammodel.StatusEnabled,
		})
		if pack == nil {
			panicTeamField("form.pack_id", "素材方案不存在或已停用。")
		}

		material := teammodel.NewMaterialModel().Find(c.Context(), map[string]any{
			"id":     materialID,
			"status": teammodel.StatusEnabled,
		})
		if material == nil {
			panicTeamField("form.material_id", "素材不存在或已停用。")
		}
		cate := teammodel.NewMaterialCateModel().Find(c.Context(), map[string]any{
			"id":     material.CateID,
			"status": teammodel.StatusEnabled,
		})
		if cate == nil {
			panicTeamField("form.material_id", "素材所属分类不存在或已停用。")
		}
	}
	defaultTeamInt16Field(record, "status", defaultTeamStatus, partial)
	defaultTeamIntField(record, "sort", defaultTeamSort, partial)
	return record
}

func shouldValidateMaterialPackItem(record map[string]any, partial bool) bool {
	if !partial {
		return true
	}
	if _, exists := record["pack_id"]; exists {
		return true
	}
	if _, exists := record["material_id"]; exists {
		return true
	}
	status, exists := record["status"]
	return exists && int16(util.ToInt64(status)) == teammodel.StatusEnabled
}

func materialPackItemIdentity(c *server.Context, record map[string]any) (uint64, uint64) {
	packID := util.ToUint64(record["pack_id"])
	materialID := util.ToUint64(record["material_id"])
	if packID > 0 && materialID > 0 {
		return packID, materialID
	}
	id := util.ToUint64(record["id"])
	if id == 0 {
		return packID, materialID
	}
	row := teammodel.NewMaterialPackItemModel().Find(c.Context(), map[string]any{"id": id})
	if row == nil {
		return packID, materialID
	}
	if packID == 0 {
		packID = row.PackID
	}
	if materialID == 0 {
		materialID = row.MaterialID
	}
	return packID, materialID
}

func (MaterialHook) ProviderAttachMaterialPackItemList(_ *server.Context, params []any) any {
	payload := cloneTeamRecord(params)
	rows := normalizeTeamChildRows(payload["rows"])
	for _, row := range rows {
		material, _ := row["material"].(map[string]any)
		row["kind_label"] = teammodel.MaterialKindLabel(util.ToStringTrimmed(material["kind"]))
	}
	return rows
}

func normalizeMaterialPackItemRows(value any) []any {
	rows := normalizeTeamChildRows(value)
	if len(rows) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rows))
	seen := map[uint64]struct{}{}
	for index, row := range rows {
		materialID := util.ToUint64(row["material_id"])
		if materialID == 0 {
			material, _ := row["material"].(map[string]any)
			materialID = util.ToUint64(material["id"])
		}
		if materialID == 0 {
			continue
		}
		if _, exists := seen[materialID]; exists {
			continue
		}
		seen[materialID] = struct{}{}

		next := util.CloneMap(row)
		next["material_id"] = materialID
		defaultTeamInt16Field(next, "status", defaultTeamStatus, false)
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		items = append(items, next)
	}
	return items
}
