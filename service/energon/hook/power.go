package hook

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
)

type PowerHook struct{}

func (PowerHook) ProviderBeforeSavePower(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["key"] = util.ToStringTrimmed(record["key"])
	record["kind"] = strings.TrimSpace(util.ToString(record["kind"]))
	record["source_rule"] = normalizePowerSourceRule(util.ToIntDefault(record["source_rule"], int(powerSourceRuleFirst)))
	ensureDefaultCategory(record)
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	if rawTargets, exists := record["targets"]; exists {
		record["targets"] = normalizePowerTargetRows(c, rawTargets)
	}
	if rawParams, exists := record["params"]; exists {
		record["params"] = normalizePowerParamRows(c, rawParams)
	}

	return record
}

func normalizePowerSourceRule(value int) int16 {
	if int16(value) == powerSourceRulePick {
		return powerSourceRulePick
	}
	return powerSourceRuleFirst
}

func normalizePowerParamShow(value int) int16 {
	if int16(value) == powerParamShowSource {
		return powerParamShowSource
	}
	return powerParamShowAlways
}

func normalizePowerParamRequired(value int) int16 {
	if int16(value) == powerParamOptional {
		return powerParamOptional
	}
	return powerParamRequired
}

func normalizePowerTargetRows(c *server.Context, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rawItems))
	seen := map[uint64]struct{}{}
	for index, row := range rawItems {
		next := util.CloneMap(row)
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		if util.ToIntDefault(next["status"], 0) <= 0 {
			next["status"] = defaultRecordStatus
		}

		serviceID := util.ToUint64(next["service_id"])
		if serviceID == 0 {
			panicPowerTargetField("能力来源必须选择来源服务")
		}
		if _, exists := seen[serviceID]; exists {
			panicPowerTargetField("能力来源不能重复选择同一个来源服务")
		}
		seen[serviceID] = struct{}{}

		serviceRow := botmodel.NewServiceModel().FindMap(c.Context(), map[string]any{"id": serviceID})
		if len(serviceRow) == 0 {
			panicPowerTargetField("能力来源选择的来源服务不存在")
		}
		if !isActive(int16(util.ToIntDefault(serviceRow["status"], 0))) {
			panicPowerTargetField("能力来源选择的来源服务未开启")
		}

		items = append(items, next)
	}
	return items
}

func normalizePowerParamRows(c *server.Context, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rawItems))
	for index, row := range rawItems {
		next := util.CloneMap(row)
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		next["status"] = normalizePowerParamRequired(util.ToIntDefault(next["status"], int(powerParamRequired)))
		next["show"] = normalizePowerParamShow(util.ToIntDefault(next["show"], int(powerParamShowAlways)))

		paramID := util.ToUint64(next["param_id"])
		if paramID == 0 {
			panicPowerParamField("能力参数必须选择内部参数")
		}

		paramRow := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
		if len(paramRow) == 0 {
			panicPowerParamField("能力参数选择的内部参数不存在")
		}

		items = append(items, next)
	}
	return items
}
