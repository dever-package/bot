package energon

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	frontaction "my/package/front/service/action"
)

const (
	paramRuleDirect      int16  = 1
	paramRuleOptionMap   int16  = 2
	paramRuleFileMap     int16  = 3
	paramRuleComboMap    int16  = 4
	paramRuleFixedMap    int16  = 5
	defaultRecordStatus  int16  = 1
	defaultRecordSort           = 100
	defaultCategoryID    uint64 = 1
	paramUsageMain       int16  = 1
	paramUsageToolbar    int16  = 2
	powerParamShowAlways int16  = 1
	powerParamShowSource int16  = 2
	powerParamRequired   int16  = 1
	powerParamOptional   int16  = 2
	powerSourceRuleFirst int16  = 1
	powerSourceRulePick  int16  = 2
	defaultMaxFiles             = 5
	defaultUploadRuleID  uint64 = 1
	endpointParamModeAll        = "all"
	endpointParamModeAny        = "any"
)

type ParamHook struct{}

type ProviderHook struct{}

func (ProviderHook) ProviderBeforeSaveProvider(_ *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["protocol"] = strings.TrimSpace(util.ToString(record["protocol"]))
	record["host"] = util.ToStringTrimmed(record["host"])
	ensureDefaultCategory(record)
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	return record
}

func (ProviderHook) ProviderBeforeDeleteProvider(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	providerIDs := collectDeleteIDs(record)
	if len(providerIDs) == 0 {
		return record
	}

	serviceRows := botmodel.NewServiceModel().SelectMap(c.Context(), map[string]any{
		"provider_id": uint64IDsToAny(providerIDs),
	})
	serviceIDs := collectRowIDs(serviceRows, "id")
	if len(serviceIDs) > 0 {
		deleteServiceReferences(c, serviceIDs)
	}

	return record
}

func (ParamHook) ProviderBeforeSaveParam(_ *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["key"] = util.ToStringTrimmed(record["key"])
	record["default_value"] = util.ToStringTrimmed(record["default_value"])
	paramType := normalizeParamControlType(util.ToStringTrimmed(record["type"]))
	record["type"] = paramType
	record["value_type"] = normalizeParamValueType(util.ToStringTrimmed(record["value_type"]))
	ensureDefaultCategory(record)

	usage := int16(util.ToIntDefault(record["usage"], int(paramUsageMain)))
	if usage != paramUsageMain && usage != paramUsageToolbar {
		usage = paramUsageMain
	}
	record["usage"] = usage

	if util.ToIntDefault(record["sort"], 0) <= 0 {
		record["sort"] = defaultRecordSort
	}
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	switch paramType {
	case "file":
		if util.ToUint64(record["upload_rule_id"]) == 0 {
			record["upload_rule_id"] = defaultUploadRuleID
		}
		record["max_files"] = 0
		record["options"] = []any{}
	case "files":
		if util.ToUint64(record["upload_rule_id"]) == 0 {
			record["upload_rule_id"] = defaultUploadRuleID
		}
		maxFiles := util.ToIntDefault(record["max_files"], 0)
		if maxFiles <= 0 {
			maxFiles = defaultMaxFiles
		}
		record["max_files"] = maxFiles
		record["options"] = []any{}
	case "option", "multi_option":
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = normalizeParamOptionRows(record["options"])
	case "hidden":
		if record["default_value"] == "" {
			panicParamField("form.default_value", "隐藏框必须填写默认值")
		}
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	case "description":
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	default:
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	}

	return record
}

func (ParamHook) ProviderBeforeDeleteParam(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	paramIDs := collectDeleteIDs(record)
	if len(paramIDs) == 0 {
		return record
	}

	filters := map[string]any{"param_id": uint64IDsToAny(paramIDs)}
	botmodel.NewServiceParamModel().Delete(c.Context(), filters)
	botmodel.NewPowerParamModel().Delete(c.Context(), filters)
	return record
}

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

func ensureDefaultCategory(record map[string]any) {
	if util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultCategoryID
	}
}

func normalizeParamControlType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "textarea", "text", "string":
		return "textarea"
	case "input", "number":
		return "input"
	case "switch", "bool", "boolean":
		return "switch"
	case "option", "multi_option", "file", "files", "hidden", "description":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "input"
	}
}

func normalizeParamValueType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "number", "int", "integer", "float", "double":
		return "number"
	default:
		return "string"
	}
}

func normalizeParamOptionRows(value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rawItems))
	for _, row := range rawItems {
		name := util.ToStringTrimmed(row["name"])
		value := util.ToStringTrimmed(row["value"])
		if name == "" && value == "" {
			continue
		}
		if name == "" {
			name = value
		}

		next := util.CloneMap(row)
		next["name"] = name
		next["value"] = value
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = defaultRecordSort
		}
		items = append(items, next)
	}
	return items
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

		next["param_mode"] = normalizeEndpointParamMode(util.ToStringTrimmed(next["param_mode"]))
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

type naturalKeyedChildRow struct {
	row        map[string]any
	naturalKey string
	originalID uint64
}

func assignNaturalKeyedChildIDs(rows []naturalKeyedChildRow, existingIDs map[string]uint64) {
	if len(rows) == 0 {
		return
	}

	// Relation 保存会先 upsert 再删除旧子记录；自然键复用原 ID 可避免唯一键短暂冲突。
	usedIDs := map[uint64]struct{}{}
	pendingRows := make([]naturalKeyedChildRow, 0, len(rows))
	for _, row := range rows {
		if id := existingIDs[row.naturalKey]; id > 0 {
			row.row["id"] = id
			usedIDs[id] = struct{}{}
			continue
		}
		pendingRows = append(pendingRows, row)
	}

	for _, row := range pendingRows {
		if row.originalID > 0 {
			if _, used := usedIDs[row.originalID]; !used {
				row.row["id"] = row.originalID
				usedIDs[row.originalID] = struct{}{}
				continue
			}
		}

		delete(row.row, "id")
	}
}

func anyChildRows(rows []map[string]any) []any {
	result := make([]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, row)
	}
	return result
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

func normalizeEndpointParamMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case endpointParamModeAny:
		return endpointParamModeAny
	default:
		return endpointParamModeAll
	}
}

func normalizeEndpointParamRows(c *server.Context, value any) []map[string]any {
	raw := decodeMappingArray(value)
	result := make([]map[string]any, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		paramID := endpointParamID(item)
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

func endpointParamID(value any) uint64 {
	if row, ok := value.(map[string]any); ok {
		return util.ToUint64(row["param_id"])
	}
	return util.ToUint64(value)
}

func normalizeChildRecordRows(value any) []map[string]any {
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

func serviceParamDefaultKey(paramRow map[string]any) string {
	if key := util.ToStringTrimmed(paramRow["key"]); key != "" {
		return key
	}
	return util.ToStringTrimmed(paramRow["name"])
}

func normalizeServiceParamMapping(c *server.Context, paramRow map[string]any, rule int16, value any) string {
	paramType := normalizeParamControlType(util.ToStringTrimmed(paramRow["type"]))
	switch rule {
	case paramRuleDirect:
		return ""
	case paramRuleOptionMap:
		if paramType != "option" && paramType != "multi_option" {
			panicServiceParamField("选项映射只支持单选或多选参数")
		}
		mappings := decodeServiceParamOptionMappings(value)
		if len(mappings) == 0 {
			panicServiceParamField("选项映射必须选择至少一个参数选项")
		}
		optionIDs := serviceParamOptionMappingIDs(mappings)
		if !paramOptionsExist(c, util.ToUint64(paramRow["id"]), optionIDs) {
			panicServiceParamField("选项映射包含无效的参数选项")
		}
		return mustJSONString(serviceParamOptionMappingRows(mappings))
	case paramRuleFileMap:
		if paramType != "file" && paramType != "files" {
			panicServiceParamField("附件映射只支持单文件或多文件参数")
		}
		indexes := normalizeIntArray(value)
		if len(indexes) == 0 {
			panicServiceParamField("附件映射必须选择至少一个文件序号")
		}
		maxIndex := 1
		if paramType == "files" {
			maxIndex = util.ToIntDefault(paramRow["max_files"], 0)
			if maxIndex <= 0 {
				maxIndex = defaultMaxFiles
			}
		}
		for _, index := range indexes {
			if index < 1 || index > maxIndex {
				panicServiceParamField(fmt.Sprintf("附件映射序号必须在 1 到 %d 之间", maxIndex))
			}
		}
		return mustJSONString(indexes)
	case paramRuleComboMap:
		return mustJSONString(normalizeServiceParamComboMapping(c, value))
	case paramRuleFixedMap:
		return normalizeFixedServiceParamMapping(value)
	default:
		panicServiceParamField("未知的服务参数映射规则")
	}
	return ""
}

func serviceParamMappingInput(paramID uint64, rule int16, row map[string]any) any {
	value := row["mapping"]
	if rule != paramRuleComboMap {
		return value
	}

	extraParamIDs := normalizeComboParamIDs(row)
	if len(extraParamIDs) == 0 {
		return value
	}

	mapping := decodeMappingObject(value)
	mapping["params"] = append([]uint64{paramID}, extraParamIDs...)
	return mapping
}

func normalizeComboParamIDs(row map[string]any) []uint64 {
	if ids := normalizeUint64List(row["combo_param_ids"]); len(ids) > 0 {
		return ids
	}

	rows := decodeMappingArray(row["combo_params"])
	result := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, item := range rows {
		paramID := serviceParamComboParamID(item)
		if paramID == 0 {
			continue
		}
		if _, exists := seen[paramID]; exists {
			continue
		}
		seen[paramID] = struct{}{}
		result = append(result, paramID)
	}
	return result
}

func serviceParamComboParamID(value any) uint64 {
	if row, ok := value.(map[string]any); ok {
		return util.ToUint64(row["param_id"])
	}
	return util.ToUint64(value)
}

func normalizeFixedServiceParamMapping(value any) string {
	text := util.ToStringTrimmed(value)
	if text == "" {
		panicServiceParamField("固定值映射必须填写字段值")
	}
	return text
}

func normalizeServiceParamComboMapping(c *server.Context, value any) map[string]any {
	mapping := decodeServiceParamComboMapping(value)
	if len(mapping.ParamIDs) < 2 {
		panicServiceParamField("组合映射必须包含主参数和至少一个参与参数")
	}

	validateComboMappingParams(c, mapping.ParamIDs)

	if len(mapping.Rows) == 0 {
		panicServiceParamField("组合映射必须配置至少一条字段值")
	}

	seenRows := map[string]struct{}{}
	optionIDsByParam := map[uint64][]uint64{}
	seenOptionIDsByParam := map[uint64]map[uint64]struct{}{}
	for _, row := range mapping.Rows {
		if strings.TrimSpace(row.NativeValue) == "" {
			panicServiceParamField("组合映射的字段值不能为空")
		}
		signature := make([]string, 0, len(mapping.ParamIDs))
		for _, paramID := range mapping.ParamIDs {
			optionID := row.Values[paramID]
			if optionID == 0 {
				panicServiceParamField("组合映射每一行都必须选择所有参与参数的选项")
			}
			optionIDsByParam[paramID], seenOptionIDsByParam[paramID] = appendUniqueUint64(
				optionIDsByParam[paramID],
				seenOptionIDsByParam[paramID],
				optionID,
			)
			signature = append(signature, util.ToString(optionID))
		}
		key := strings.Join(signature, "|")
		if _, exists := seenRows[key]; exists {
			panicServiceParamField("组合映射不能重复配置相同的参数组合")
		}
		seenRows[key] = struct{}{}
	}

	for paramID, optionIDs := range optionIDsByParam {
		if !paramOptionsExist(c, paramID, optionIDs) {
			panicServiceParamField("组合映射包含无效的参数选项")
		}
	}

	return serviceParamComboMappingPayload(mapping)
}

func validateComboMappingParams(c *server.Context, paramIDs []uint64) {
	for _, paramID := range paramIDs {
		paramRow := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
		if len(paramRow) == 0 {
			panicServiceParamField("组合映射选择的参与参数不存在")
		}
		if !isOptionParamType(util.ToStringTrimmed(paramRow["type"])) {
			panicServiceParamField("组合映射的参与参数只支持单选或多选参数")
		}
	}
}

func appendUniqueUint64(items []uint64, seen map[uint64]struct{}, value uint64) ([]uint64, map[uint64]struct{}) {
	if value == 0 {
		return items, seen
	}
	if seen == nil {
		seen = map[uint64]struct{}{}
	}
	if _, exists := seen[value]; exists {
		return items, seen
	}
	seen[value] = struct{}{}
	return append(items, value), seen
}

func normalizeUint64Array(value any) []uint64 {
	raw := decodeMappingArray(value)
	result := make([]uint64, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		id := util.ToUint64(item)
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}

func paramOptionsExist(c *server.Context, paramID uint64, optionIDs []uint64) bool {
	if paramID == 0 || len(optionIDs) == 0 {
		return false
	}

	filterIDs := make([]any, 0, len(optionIDs))
	for _, id := range optionIDs {
		filterIDs = append(filterIDs, id)
	}
	rows := botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{
		"param_id": paramID,
		"id":       filterIDs,
	})
	return len(rows) == len(optionIDs)
}

func normalizeIntArray(value any) []int {
	raw := decodeMappingArray(value)
	result := make([]int, 0, len(raw))
	seen := map[int]struct{}{}
	for _, item := range raw {
		index := util.ToIntDefault(item, 0)
		if index <= 0 {
			continue
		}
		if _, exists := seen[index]; exists {
			continue
		}
		seen[index] = struct{}{}
		result = append(result, index)
	}
	return result
}

func decodeMappingArray(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	case []map[string]any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			if item != nil {
				result = append(result, item)
			}
		}
		return result
	case []uint64:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case []int:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case string:
		trimmed := strings.TrimSpace(current)
		if trimmed == "" {
			return nil
		}
		var result []any
		if err := json.Unmarshal([]byte(trimmed), &result); err == nil {
			return result
		}
		return []any{trimmed}
	default:
		if current == nil {
			return nil
		}
		return []any{current}
	}
}

func mustJSONString(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		panic(err.Error())
	}
	return string(encoded)
}

func deleteServiceReferences(c *server.Context, serviceIDs []uint64) {
	filters := map[string]any{"service_id": uint64IDsToAny(serviceIDs)}
	botmodel.NewServiceEndpointModel().Delete(c.Context(), filters)
	botmodel.NewServiceParamModel().Delete(c.Context(), filters)
	botmodel.NewPowerTargetModel().Delete(c.Context(), filters)
}

func collectDeleteIDs(record map[string]any) []uint64 {
	return normalizeUint64Array(record["id"])
}

func collectRowIDs(rows []map[string]any, field string) []uint64 {
	result := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		id := util.ToUint64(row[field])
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}

func uint64IDsToAny(ids []uint64) []any {
	result := make([]any, 0, len(ids))
	for _, id := range ids {
		if id > 0 {
			result = append(result, id)
		}
	}
	return result
}

func cloneEnergonRecord(params []any) map[string]any {
	if len(params) == 0 {
		return map[string]any{}
	}
	record, _ := params[0].(map[string]any)
	if record == nil {
		return map[string]any{}
	}
	return util.CloneMap(record)
}

func panicParamField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}

func panicServiceParamField(message string) {
	panicParamField("form.params", message)
}

func panicServiceEndpointField(message string) {
	panicParamField("form.endpoints", message)
}

func panicPowerTargetField(message string) {
	panicParamField("form.targets", message)
}

func panicPowerParamField(message string) {
	panicParamField("form.params", message)
}
