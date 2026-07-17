package setting

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

func normalizeAgentParamRows(c *server.Context, agentID uint64, value any) []any {
	rawRows := normalizeAgentChildRows(value)
	if len(rawRows) == 0 {
		return []any{}
	}

	existingByID, existingIDByParam := existingAgentParams(c, agentID)
	rows := make([]any, 0, len(rawRows))
	seenParamIDs := make(map[uint64]struct{}, len(rawRows))
	seenKeys := make(map[string]struct{}, len(rawRows))
	for index, row := range rawRows {
		paramID := util.ToUint64(row["param_id"])
		if paramID == 0 {
			panicAgentField("form.params", "请选择输入参数。")
		}
		if _, exists := seenParamIDs[paramID]; exists {
			panicAgentField("form.params", "同一个输入参数不能重复添加。")
		}

		param := energonmodel.NewParamModel().Find(c.Context(), map[string]any{"id": paramID})
		if param == nil || param.Status != 1 {
			panicAgentField("form.params", "输入参数不存在或已停用。")
		}
		if energoninput.IsPromptParam(*param) {
			panicAgentField("form.params", "主聊天文本是内置输入，不需要重复配置。")
		}
		paramType := energoninput.NormalizeParamControlType(param.Type)
		if (paramType == "file" || paramType == "files") && param.UploadRuleID == 0 {
			panicAgentField("form.params", "文件参数必须先配置上传规则。")
		}
		key := strings.ToLower(strings.TrimSpace(param.Key))
		if _, exists := seenKeys[key]; exists {
			panicAgentField("form.params", "输入参数标识不能重复。")
		}

		required := normalizeAgentParamRequired(row["required"])
		if !energoninput.ParamRequiresInput(*param) {
			required = 2
		}
		next := map[string]any{
			"param_id": paramID,
			"required": required,
			"sort":     util.ToIntDefault(row["sort"], 0),
		}
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		if agentID > 0 {
			next["agent_id"] = agentID
			rowID := util.ToUint64(row["id"])
			if rowID > 0 {
				if _, exists := existingByID[rowID]; !exists {
					panicAgentField("form.params", "输入参数不属于当前智能体。")
				}
				next["id"] = rowID
			}
			if existingID := existingIDByParam[paramID]; existingID > 0 {
				next["id"] = existingID
			}
		}
		seenParamIDs[paramID] = struct{}{}
		seenKeys[key] = struct{}{}
		rows = append(rows, next)
	}
	return rows
}

func existingAgentParams(c *server.Context, agentID uint64) (map[uint64]agentmodel.AgentParam, map[uint64]uint64) {
	byID := map[uint64]agentmodel.AgentParam{}
	byParam := map[uint64]uint64{}
	if agentID == 0 {
		return byID, byParam
	}
	for _, row := range agentmodel.NewAgentParamModel().Select(c.Context(), map[string]any{"agent_id": agentID}) {
		if row == nil || row.ParamID == 0 {
			continue
		}
		byID[row.ID] = *row
		byParam[row.ParamID] = row.ID
	}
	return byID, byParam
}

func normalizeAgentParamRequired(value any) int16 {
	if util.ToIntDefault(value, 0) == 1 {
		return 1
	}
	return 2
}
