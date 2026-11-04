package hook

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
)

func normalizeParamGroupRecord(c *server.Context, record map[string]any, partial bool) {
	typeValue, hasType := record["type"]
	members, hasMembers := record["members"]
	if partial && !hasType && !hasMembers {
		return
	}
	groupID := util.ToUint64(record["id"])
	if !hasType {
		current := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": groupID})
		typeValue = current["type"]
	}
	paramType := botinput.NormalizeParamControlType(util.ToStringTrimmed(typeValue))
	if paramType != botmodel.ParamTypeGroup {
		record["members"] = []any{}
		return
	}
	record["type"] = paramType
	if groupID > 0 {
		reference := botmodel.NewParamGroupMemberModel().FindMap(c.Context(), map[string]any{"param_id": groupID})
		if len(reference) > 0 {
			panicParamField("form.type", "该参数已被参数组引用，不能改为参数组。")
		}
	}
	if hasMembers || !partial {
		record["members"] = normalizeParamGroupMembers(c, groupID, members)
	}
}

func normalizeParamGroupMembers(c *server.Context, groupID uint64, value any) []any {
	rows := normalizeChildRecordRows(value)
	if len(rows) == 0 {
		return []any{}
	}
	ids := make([]uint64, 0, len(rows))
	seen := make(map[uint64]bool, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["param_id"])
		if id == 0 {
			panicParamField("form.members", "组内参数必须选择已有参数。")
		}
		if id == groupID {
			panicParamField("form.members", "参数组不能添加自身。")
		}
		if seen[id] {
			panicParamField("form.members", "组内参数不能重复。")
		}
		seen[id] = true
		ids = append(ids, id)
	}
	params := botmodel.NewParamModel().SelectMap(c.Context(), map[string]any{"id": uint64IDsToAny(ids)})
	for _, param := range params {
		if util.ToStringTrimmed(param["type"]) == botmodel.ParamTypeGroup {
			panicParamField("form.members", "组内参数不能选择参数组。")
		}
	}
	if len(params) != len(ids) {
		panicParamField("form.members", "组内参数选择的参数不存在。")
	}
	existingIDs := make(map[uint64]uint64)
	if groupID > 0 {
		for _, member := range botmodel.NewParamGroupMemberModel().SelectMap(c.Context(), map[string]any{"group_id": groupID}) {
			existingIDs[util.ToUint64(member["param_id"])] = util.ToUint64(member["id"])
		}
	}
	result := make([]any, 0, len(rows))
	for index, row := range rows {
		paramID := util.ToUint64(row["param_id"])
		sort := util.ToIntDefault(row["sort"], index+1)
		if sort <= 0 {
			sort = index + 1
		}
		member := map[string]any{"param_id": paramID, "sort": sort,
			"required": normalizePowerParamRequired(util.ToIntDefault(row["required"], int(powerParamOptional)))}
		if id := existingIDs[paramID]; id > 0 {
			member["id"] = id
		}
		result = append(result, member)
	}
	return result
}
