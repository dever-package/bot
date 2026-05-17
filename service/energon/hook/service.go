package hook

import (
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

type ServiceHook struct{}

func (ServiceHook) ProviderBeforeSaveService(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["type"] = strings.TrimSpace(util.ToString(record["type"]))
	record["path"] = strings.TrimSpace(util.ToString(record["path"]))
	if util.ToIntDefault(record["sort"], 0) <= 0 {
		record["sort"] = defaultRecordSort
	}
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	serviceID := util.ToUint64(record["id"])
	if rawEndpoints, exists := record["endpoints"]; exists {
		endpoints := normalizeServiceEndpointRows(c, serviceID, rawEndpoints)
		record["endpoints"] = endpoints
		if len(endpoints) == 0 {
			panicServiceEndpointField("服务接口必须至少配置一个")
		}
	} else {
		panicServiceEndpointField("服务接口必须至少配置一个")
	}
	if rawParams, exists := record["params"]; exists {
		record["params"] = normalizeServiceParamRows(c, serviceID, rawParams)
	}

	return record
}

func normalizeServiceParamRows(c *server.Context, serviceID uint64, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]map[string]any, 0, len(rawItems))
	naturalRows := make([]naturalKeyedChildRow, 0, len(rawItems))
	seen := map[string]struct{}{}
	existingIDs := existingServiceParamIDsByKey(c, serviceID)
	for index, row := range rawItems {
		next := util.CloneMap(row)
		next["key"] = util.ToStringTrimmed(next["key"])
		next["name"] = util.ToStringTrimmed(next["name"])
		delete(next, "value")
		delete(next, "default_value")
		delete(next, "usage")
		delete(next, "value_type")
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		if util.ToIntDefault(next["status"], 0) <= 0 {
			next["status"] = defaultRecordStatus
		}

		rule := int16(util.ToIntDefault(next["param_rule"], int(paramRuleDirect)))
		if rule == 0 {
			rule = paramRuleDirect
		}
		next["param_rule"] = rule

		paramID := util.ToUint64(next["param_id"])
		if rule == paramRuleFixedMap {
			paramID = 0
			next["param_id"] = 0
		}
		if rule != paramRuleFixedMap && paramID == 0 {
			panicServiceParamField("服务参数必须选择内部参数")
		}

		paramRow := map[string]any{}
		if paramID > 0 {
			paramRow = botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
			if len(paramRow) == 0 {
				panicServiceParamField("服务参数选择的内部参数不存在")
			}
		}
		if util.ToStringTrimmed(next["key"]) == "" {
			next["key"] = serviceParamDefaultKey(paramRow)
		}
		if util.ToStringTrimmed(next["key"]) == "" {
			panicServiceParamField("服务参数必须填写字段标识")
		}
		naturalKey := serviceParamNaturalKey(paramID, util.ToStringTrimmed(next["key"]))
		if _, exists := seen[naturalKey]; exists {
			panicServiceParamField("服务参数不能重复配置同一个内部参数和字段标识")
		}
		seen[naturalKey] = struct{}{}

		next["mapping"] = normalizeServiceParamMapping(c, paramRow, rule, serviceParamMappingInput(paramID, rule, next))
		delete(next, "combo_param_ids")
		delete(next, "combo_params")

		items = append(items, next)
		naturalRows = append(naturalRows, naturalKeyedChildRow{
			row:        next,
			naturalKey: naturalKey,
			originalID: util.ToUint64(row["id"]),
		})
	}
	assignNaturalKeyedChildIDs(naturalRows, existingIDs)
	return anyChildRows(items)
}

func existingServiceParamIDsByKey(c *server.Context, serviceID uint64) map[string]uint64 {
	if serviceID == 0 {
		return nil
	}

	rows := botmodel.NewServiceParamModel().SelectMap(c.Context(), map[string]any{
		"service_id": serviceID,
	})
	result := make(map[string]uint64, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		paramID := util.ToUint64(row["param_id"])
		key := util.ToStringTrimmed(row["key"])
		if id == 0 || key == "" {
			continue
		}
		result[serviceParamNaturalKey(paramID, key)] = id
	}
	return result
}

func serviceParamNaturalKey(paramID uint64, key string) string {
	return fmt.Sprintf("%d:%s", paramID, strings.TrimSpace(key))
}

func normalizeServiceEndpointRows(c *server.Context, serviceID uint64, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]map[string]any, 0, len(rawItems))
	naturalRows := make([]naturalKeyedChildRow, 0, len(rawItems))
	seenAPI := map[string]struct{}{}
	existingIDs := existingServiceEndpointIDsByAPI(c, serviceID)
	for index, row := range rawItems {
		next := util.CloneMap(row)
		next["api"] = util.ToStringTrimmed(next["api"])
		if util.ToStringTrimmed(next["api"]) == "" {
			panicServiceEndpointField("服务接口必须填写接口标识")
		}
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		if util.ToIntDefault(next["status"], 0) <= 0 {
			next["status"] = defaultRecordStatus
		}

		apiKey := strings.ToLower(util.ToStringTrimmed(next["api"]))
		if _, exists := seenAPI[apiKey]; exists {
			panicServiceEndpointField("服务接口不能重复配置同一个接口标识")
		}
		seenAPI[apiKey] = struct{}{}

		next["param_mode"] = botinput.NormalizeEndpointParamMode(util.ToStringTrimmed(next["param_mode"]))
		next["param_ids"] = mustJSONString(normalizeEndpointParamRows(c, next["param_ids"]))

		items = append(items, next)
		naturalRows = append(naturalRows, naturalKeyedChildRow{
			row:        next,
			naturalKey: apiKey,
			originalID: util.ToUint64(row["id"]),
		})
	}
	assignNaturalKeyedChildIDs(naturalRows, existingIDs)
	return anyChildRows(items)
}

func existingServiceEndpointIDsByAPI(c *server.Context, serviceID uint64) map[string]uint64 {
	if serviceID == 0 {
		return nil
	}

	rows := botmodel.NewServiceEndpointModel().SelectMap(c.Context(), map[string]any{
		"service_id": serviceID,
	})
	result := make(map[string]uint64, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		api := strings.ToLower(util.ToStringTrimmed(row["api"]))
		if id == 0 || api == "" {
			continue
		}
		result[api] = id
	}
	return result
}

func normalizeEndpointParamRows(c *server.Context, value any) []map[string]any {
	raw := decodeMappingArray(value)
	result := make([]map[string]any, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		paramID := botinput.EndpointParamID(item)
		if paramID == 0 {
			continue
		}
		if _, exists := seen[paramID]; exists {
			continue
		}
		paramRow := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
		if len(paramRow) == 0 {
			panicServiceEndpointField("服务接口关联的内部参数不存在")
		}
		seen[paramID] = struct{}{}
		result = append(result, map[string]any{
			"param_id": paramID,
			"sort":     len(result) + 1,
		})
	}
	return result
}

func serviceParamDefaultKey(paramRow map[string]any) string {
	if key := util.ToStringTrimmed(paramRow["key"]); key != "" {
		return key
	}
	return util.ToStringTrimmed(paramRow["name"])
}
