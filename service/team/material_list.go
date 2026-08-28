package team

import (
	"context"
	"strconv"
	"strings"

	frontmeta "github.com/dever-package/front/service/meta"
	frontpage "github.com/dever-package/front/service/page"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	teammodel "github.com/dever-package/bot/model/team"
)

const materialPackItemModelName = "bot.team.NewMaterialPackItemModel"

type materialPackItemListSource interface {
	SelectMap(context.Context, any, ...map[string]any) []map[string]any
	Count(context.Context, any, ...map[string]any) int64
}

type materialPackItemListModel struct {
	source          materialPackItemListSource
	materialFilters map[string]any
	materialJoin    []map[string]any
}

func (MaterialHook) ProviderLoadMaterialPackListOptions(c *server.Context, _ []any) any {
	itemOptions := teammodel.NewMaterialPackItemModel().Config().Options
	materialOptions := teammodel.NewMaterialModel().Config().Options

	return map[string]any{
		"status":        itemOptions["status"],
		"kind":          materialOptions["kind"],
		"material_cate": loadMaterialCateOptions(c),
	}
}

func (MaterialHook) ProviderLoadMaterialPackItemTable(c *server.Context, _ []any) any {
	if c == nil {
		return emptyMaterialPackItemTable()
	}

	listModel := newMaterialPackItemListModel(c.Input("kind"), c.Input("keyword"))
	rows, total, page, pageSize, err := frontpage.QueryModelListWithQuery(
		c.Context(),
		listModel,
		map[string]any{
			"filterFields": []any{"pack_id", "status"},
			"order":        "sort asc,id asc",
		},
		map[string]string{
			"pack_id":  resolveMaterialPackItemListPackID(c),
			"status":   c.Input("status"),
			"page":     c.Input("page"),
			"pageSize": c.Input("pageSize"),
		},
	)
	if err != nil {
		panic(err)
	}

	rows = frontmeta.AttachRelations(c.Context(), materialPackItemModelName, rows)
	rows = attachMaterialPackItemListRows(rows)
	return map[string]any{
		"list":     rows,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	}
}

func resolveMaterialPackItemListPackID(c *server.Context) string {
	if packID := strings.TrimSpace(c.Input("pack_id")); packID != "" {
		return packID
	}

	rows := teammodel.NewMaterialPackModel().SelectMap(c.Context(), nil, map[string]any{
		"field":    "main.id",
		"order":    "main.sort asc,main.id asc",
		"page":     1,
		"pageSize": 1,
	})
	if len(rows) == 0 {
		return "0"
	}
	return strconv.FormatUint(util.ToUint64(rows[0]["id"]), 10)
}

func newMaterialPackItemListModel(kind string, keyword string) materialPackItemListModel {
	materialModel := teammodel.NewMaterialModel()
	return materialPackItemListModel{
		source:          teammodel.NewMaterialPackItemModel(),
		materialFilters: buildMaterialPackItemRelationFilters(kind, keyword),
		materialJoin: []map[string]any{
			{
				"type":  "inner",
				"table": materialModel.Config().Table,
				"on":    "t0.id = main.material_id",
			},
		},
	}
}

func buildMaterialPackItemRelationFilters(kind string, keyword string) map[string]any {
	filters := map[string]any{}
	if kind = strings.ToLower(strings.TrimSpace(kind)); kind != "" && kind != "__all__" {
		filters["t0.kind"] = kind
	}
	if keyword = normalizeMaterialPackItemKeyword(keyword); keyword != "" {
		filters["t0.name"] = map[string]any{"like": "%" + keyword + "%"}
	}
	return filters
}

func normalizeMaterialPackItemKeyword(keyword string) string {
	runes := []rune(strings.TrimSpace(keyword))
	if len(runes) > 100 {
		runes = runes[:100]
	}
	return string(runes)
}

func (m materialPackItemListModel) SelectMap(
	ctx context.Context,
	filters any,
	options ...map[string]any,
) []map[string]any {
	return m.source.SelectMap(
		ctx,
		m.withMaterialFilters(filters),
		m.withMaterialJoin(options),
	)
}

func (m materialPackItemListModel) Count(
	ctx context.Context,
	filters any,
	options ...map[string]any,
) int64 {
	return m.source.Count(
		ctx,
		m.withMaterialFilters(filters),
		m.withMaterialJoin(options),
	)
}

func (m materialPackItemListModel) withMaterialFilters(filters any) any {
	if len(m.materialFilters) == 0 {
		return filters
	}
	if current, ok := filters.(map[string]any); ok && len(current) == 0 {
		return m.materialFilters
	}
	if filters == nil {
		return m.materialFilters
	}
	return map[string]any{
		"and": []any{filters, m.materialFilters},
	}
}

func (m materialPackItemListModel) withMaterialJoin(options []map[string]any) map[string]any {
	var result map[string]any
	if len(options) > 0 {
		result = util.CloneMap(options[0])
	}
	if len(m.materialFilters) == 0 {
		return result
	}
	if result == nil {
		result = map[string]any{}
	}
	result["join"] = m.materialJoin
	return result
}

func attachMaterialPackItemListRows(rows []map[string]any) []map[string]any {
	for _, row := range rows {
		material, _ := row["material"].(map[string]any)
		row["kind_label"] = teammodel.MaterialKindLabel(util.ToStringTrimmed(material["kind"]))
	}
	return rows
}

func emptyMaterialPackItemTable() map[string]any {
	return map[string]any{
		"list":     []map[string]any{},
		"total":    int64(0),
		"page":     1,
		"pageSize": 10,
	}
}
