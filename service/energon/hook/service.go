package hook

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botcapacity "github.com/dever-package/bot/service/energon/capacity"
	botinput "github.com/dever-package/bot/service/energon/input"
	botpricing "github.com/dever-package/bot/service/energon/pricing"
)

type ServiceHook struct{}

func (ServiceHook) ProviderAttachServicePricingForm(c *server.Context, params []any) any {
	record := serviceFormRecord(params)
	record["context_window_tokens"] = botcapacity.Format(util.ToIntDefault(record["context_window_tokens"], 0))
	record["max_output_tokens"] = botcapacity.Format(util.ToIntDefault(record["max_output_tokens"], 0))
	attachServiceParamConditionPaths(c, record)
	endpoints := normalizeChildRecordRows(record["endpoints"])
	if len(endpoints) == 0 {
		return record
	}
	endpointIDs := make([]any, 0, len(endpoints))
	for _, endpoint := range endpoints {
		if endpointID := util.ToUint64(endpoint["id"]); endpointID > 0 {
			endpointIDs = append(endpointIDs, endpointID)
		}
	}
	if len(endpointIDs) == 0 {
		return record
	}
	priceRows := botmodel.NewServicePriceModel().SelectMap(c.Context(), map[string]any{
		"service_endpoint_id": endpointIDs,
	})
	priceIDs := make([]any, 0, len(priceRows))
	for _, price := range priceRows {
		if priceID := util.ToUint64(price["id"]); priceID > 0 {
			priceIDs = append(priceIDs, priceID)
		}
	}
	itemsByPrice := map[uint64][]map[string]any{}
	if len(priceIDs) > 0 {
		itemRows := botmodel.NewServicePriceItemModel().SelectMap(c.Context(), map[string]any{
			"service_price_id": priceIDs,
		}, map[string]any{"order": "sort asc,id asc"})
		for _, item := range itemRows {
			priceID := util.ToUint64(item["service_price_id"])
			itemsByPrice[priceID] = append(itemsByPrice[priceID], item)
		}
	}
	pricesByEndpoint := map[uint64][]map[string]any{}
	for _, price := range priceRows {
		priceID := util.ToUint64(price["id"])
		price["items"] = itemsByPrice[priceID]
		endpointID := util.ToUint64(price["service_endpoint_id"])
		pricesByEndpoint[endpointID] = append(pricesByEndpoint[endpointID], price)
	}
	localService := strings.HasPrefix(strings.ToLower(util.ToStringTrimmed(record["path"])), localServicePathPrefix)
	for _, endpoint := range endpoints {
		prices := pricesByEndpoint[util.ToUint64(endpoint["id"])]
		endpoint["prices"] = prices
		endpoint["price_summary"] = formatServicePriceSummary(prices, localService)
	}
	record["endpoints"] = anyChildRows(endpoints)
	return record
}

func (ServiceHook) ProviderBeforeSaveService(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialEnergonRecord(record)
	current := currentServiceRecord(c, record)
	ensureServiceIsManuallyManaged(c, record, current)
	normalizeServiceAccount(c, record, current, partial)

	trimEnergonStringField(record, "name", partial)
	if shouldNormalizeEnergonField(record, "type", partial) {
		record["type"] = strings.TrimSpace(util.ToString(record["type"]))
	}
	if shouldNormalizeEnergonField(record, "path", partial) {
		record["path"] = strings.TrimSpace(util.ToString(record["path"]))
	}
	normalizeServiceModelLimits(record, current, partial)
	normalizeServiceImageOutput(record, current, partial)
	ensureDefaultRecordSort(record, partial)
	ensureDefaultRecordStatus(record, partial)

	serviceID := util.ToUint64(record["id"])
	if rawEndpoints, exists := record["endpoints"]; exists {
		endpoints := normalizeServiceEndpointRows(c, serviceID, rawEndpoints)
		record["endpoints"] = endpoints
		if len(endpoints) == 0 {
			panicServiceEndpointField("服务接口必须至少配置一个")
		}
	} else if !partial {
		panicServiceEndpointField("服务接口必须至少配置一个")
	}
	if rawParams, exists := record["params"]; exists {
		record["params"] = normalizeServiceParamRows(c, serviceID, rawParams)
	}

	return record
}

func normalizeServiceImageOutput(record map[string]any, current map[string]any, partial bool) {
	serviceType := strings.ToLower(util.ToStringTrimmed(record["type"]))
	if serviceType == "" {
		serviceType = strings.ToLower(util.ToStringTrimmed(current["type"]))
	}
	_, typeProvided := record["type"]
	currentType := strings.ToLower(util.ToStringTrimmed(current["type"]))
	typeChanged := typeProvided && currentType != "" && serviceType != currentType
	if serviceType != "image" {
		if !partial || typeChanged || shouldNormalizeEnergonField(record, "image_output_mode", partial) {
			record["image_output_mode"] = botmodel.ImageOutputModeSingle
		}
		if !partial || typeChanged || shouldNormalizeEnergonField(record, "max_images_per_request", partial) {
			record["max_images_per_request"] = 0
		}
		return
	}

	mode := strings.ToLower(util.ToStringTrimmed(current["image_output_mode"]))
	if mode == "" {
		mode = botmodel.ImageOutputModeSingle
	}
	if shouldNormalizeEnergonField(record, "image_output_mode", partial) || typeChanged {
		mode = strings.ToLower(util.ToStringTrimmed(record["image_output_mode"]))
		if mode == "" {
			mode = botmodel.ImageOutputModeSingle
		}
	}
	if mode != botmodel.ImageOutputModeSingle && mode != botmodel.ImageOutputModeGroup {
		panicParamField("form.image_output_mode", "图片输出模式无效。")
	}
	record["image_output_mode"] = mode

	if mode == botmodel.ImageOutputModeSingle {
		record["max_images_per_request"] = 0
		return
	}
	maxImages := util.ToIntDefault(current["max_images_per_request"], 0)
	if shouldNormalizeEnergonField(record, "max_images_per_request", partial) || typeChanged {
		maxImages = util.ToIntDefault(record["max_images_per_request"], 0)
	}
	if maxImages != 0 && (maxImages < botmodel.StoryboardGridMinImages || maxImages > botmodel.StoryboardGridMaxImages) {
		panicParamField("form.max_images_per_request", fmt.Sprintf("单次最多图片数必须为 0，或 %d～%d。", botmodel.StoryboardGridMinImages, botmodel.StoryboardGridMaxImages))
	}
	record["max_images_per_request"] = maxImages
}

func serviceFormRecord(params []any) map[string]any {
	payload := cloneEnergonRecord(params)
	if record, ok := payload["record"].(map[string]any); ok {
		return util.CloneMap(record)
	}
	return payload
}

func attachServiceParamConditionPaths(c *server.Context, record map[string]any) {
	rows := normalizeChildRecordRows(record["params"])
	if len(rows) == 0 {
		return
	}
	for _, row := range rows {
		controllerID := util.ToUint64(row["active_when_param_id"])
		value := util.ToStringTrimmed(row["active_when_value"])
		if controllerID == 0 || value == "" {
			row["active_when_path"] = []any{}
			continue
		}
		controller := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": controllerID})
		row["active_when_path"] = botinput.EncodeServiceParamConditionPath(
			util.ToUint64(controller["cate_id"]),
			controllerID,
			value,
		)
	}
	record["params"] = anyChildRows(rows)
}

func normalizeServiceModelLimits(record map[string]any, current map[string]any, partial bool) {
	serviceType := strings.ToLower(util.ToStringTrimmed(record["type"]))
	if serviceType == "" {
		serviceType = strings.ToLower(util.ToStringTrimmed(current["type"]))
	}
	_, typeProvided := record["type"]
	currentType := strings.ToLower(util.ToStringTrimmed(current["type"]))
	typeChanged := typeProvided && currentType != "" && serviceType != currentType
	if serviceType != "text" {
		if !partial || typeChanged || shouldNormalizeEnergonField(record, "context_window_tokens", partial) {
			record["context_window_tokens"] = 0
		}
		if !partial || typeChanged || shouldNormalizeEnergonField(record, "max_output_tokens", partial) {
			record["max_output_tokens"] = 0
		}
		return
	}
	if partial && typeChanged {
		if _, exists := record["context_window_tokens"]; !exists {
			record["context_window_tokens"] = 0
		}
		if _, exists := record["max_output_tokens"]; !exists {
			record["max_output_tokens"] = 0
		}
	}

	contextTokens := util.ToIntDefault(current["context_window_tokens"], 0)
	if shouldNormalizeEnergonField(record, "context_window_tokens", partial) {
		parsed, err := botcapacity.Parse(record["context_window_tokens"])
		if err != nil {
			panicParamField("form.context_window_tokens", err.Error()+"。")
		}
		contextTokens = parsed
		record["context_window_tokens"] = parsed
	}
	outputTokens := util.ToIntDefault(current["max_output_tokens"], 0)
	if shouldNormalizeEnergonField(record, "max_output_tokens", partial) {
		parsed, err := botcapacity.Parse(record["max_output_tokens"])
		if err != nil {
			panicParamField("form.max_output_tokens", err.Error()+"。")
		}
		outputTokens = parsed
		record["max_output_tokens"] = parsed
	}
	if contextTokens > 0 && outputTokens > 0 && outputTokens >= contextTokens {
		panicParamField("form.max_output_tokens", "单次最大输出 Token 数必须小于上下文窗口。")
	}
}

func currentServiceRecord(c *server.Context, record map[string]any) map[string]any {
	serviceID := util.ToUint64(record["id"])
	if serviceID == 0 {
		return map[string]any{}
	}
	return botmodel.NewServiceModel().FindMap(c.Context(), map[string]any{"id": serviceID})
}

func normalizeServiceAccount(c *server.Context, record map[string]any, current map[string]any, partial bool) {
	_, providerChanged := record["provider_id"]
	_, accountChanged := record["account_id"]
	if partial && !providerChanged && !accountChanged {
		return
	}

	providerID := util.ToUint64(record["provider_id"])
	if providerID == 0 {
		providerID = util.ToUint64(current["provider_id"])
	}
	accountID := util.ToUint64(record["account_id"])
	if !accountChanged {
		accountID = util.ToUint64(current["account_id"])
	}

	provider := botmodel.NewProviderModel().Find(c.Context(), map[string]any{"id": providerID})
	if provider == nil {
		panicParamField("form.provider_id", "选择的来源不存在，请重新选择。")
	}
	if strings.EqualFold(strings.TrimSpace(provider.Protocol), "local") {
		record["account_id"] = uint64(0)
		return
	}
	if accountID == 0 {
		if !partial || accountChanged {
			record["account_id"] = uint64(0)
		}
		return
	}

	account := botmodel.NewAccountModel().Find(c.Context(), map[string]any{"id": accountID})
	if account == nil {
		panicParamField("form.account_id", "选择的鉴权账号不存在，请重新选择。")
	}
	if account.ProviderID != providerID {
		panicParamField("form.account_id", "鉴权账号不属于当前来源，请重新选择。")
	}
	if !isActive(account.Status) {
		panicParamField("form.account_id", "选择的鉴权账号已停用，请先启用或更换账号。")
	}
	record["account_id"] = account.ID
}

func ensureServiceIsManuallyManaged(c *server.Context, record map[string]any, current map[string]any) {
	providerIDs := make([]uint64, 0, 2)
	if providerID := util.ToUint64(record["provider_id"]); providerID > 0 {
		providerIDs = append(providerIDs, providerID)
	}
	if providerID := util.ToUint64(current["provider_id"]); providerID > 0 {
		providerIDs = append(providerIDs, providerID)
	}

	for _, providerID := range providerIDs {
		provider := botmodel.NewProviderModel().FindMap(c.Context(), map[string]any{"id": providerID})
		if strings.EqualFold(util.ToStringTrimmed(provider["protocol"]), "local") {
			panicParamField("form.provider_id", "本地处理器服务由系统自动维护，只能查看详情。")
		}
	}
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
			next["fixed_value_type"] = botinput.NormalizeFixedValueType(util.ToStringTrimmed(next["fixed_value_type"]))
		} else {
			next["fixed_value_type"] = "string"
		}
		if rule != paramRuleFixedMap && paramID == 0 {
			panicParamListField("服务参数必须选择内部参数")
		}

		paramRow := map[string]any{}
		if paramID > 0 {
			paramRow = botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
			if len(paramRow) == 0 {
				panicParamListField("服务参数选择的内部参数不存在")
			}
		}
		normalizeServiceParamCondition(c, next, paramID)
		if util.ToStringTrimmed(next["key"]) == "" {
			next["key"] = serviceParamDefaultKey(paramRow)
		}
		if util.ToStringTrimmed(next["key"]) == "" {
			panicParamListField("服务参数必须填写字段标识")
		}
		if rule == paramRuleFixedMap {
			next["file_value_format"] = botmodel.ServiceParamFileValueFormatURL
		} else {
			next["file_value_format"] = normalizeServiceParamFileValueFormat(paramRow, next["file_value_format"])
		}
		naturalKey := serviceParamNaturalKey(paramID, util.ToStringTrimmed(next["key"]))
		if _, exists := seen[naturalKey]; exists {
			panicParamListField("服务参数不能重复配置同一个内部参数和字段标识")
		}
		seen[naturalKey] = struct{}{}

		next["mapping"] = normalizeServiceParamMapping(c, paramRow, rule, serviceParamMappingInput(paramID, rule, next))
		if rule == paramRuleFixedMap {
			validateFixedServiceParamMapping(util.ToStringTrimmed(next["fixed_value_type"]), next["mapping"])
		}
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

func normalizeServiceParamCondition(c *server.Context, row map[string]any, ownerParamID uint64) {
	controllerID := util.ToUint64(row["active_when_param_id"])
	value := util.ToStringTrimmed(row["active_when_value"])
	selectedCateID := uint64(0)
	if rawPath, exists := row["active_when_path"]; exists {
		path, err := botinput.DecodeServiceParamConditionPath(rawPath)
		if err != nil {
			panicParamListField(err.Error())
		}
		controllerID = path.ParamID
		value = path.Value
		selectedCateID = path.CateID
	}
	delete(row, "active_when_path")

	if controllerID == 0 {
		row["active_when_param_id"] = uint64(0)
		row["active_when_value"] = ""
		return
	}
	if controllerID == ownerParamID {
		panicParamListField("服务参数不能以自身参数作为生效参数")
	}
	controller := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": controllerID})
	if len(controller) == 0 || !isActive(int16(util.ToIntDefault(controller["status"], 0))) {
		panicParamListField("生效参数不存在或已停用")
	}
	if botinput.NormalizeParamControlType(util.ToStringTrimmed(controller["type"])) != "option" {
		panicParamListField("生效参数必须是单选参数")
	}
	if selectedCateID > 0 && selectedCateID != util.ToUint64(controller["cate_id"]) {
		panicParamListField("生效参数不属于所选参数分类")
	}
	if value == "" {
		panicParamListField("配置生效参数后必须选择参数值")
	}
	if option := botmodel.NewParamOptionModel().Find(c.Context(), map[string]any{
		"param_id": controllerID,
		"value":    value,
	}); option == nil {
		panicParamListField("生效参数值不属于所选参数")
	}
	row["active_when_param_id"] = controllerID
	row["active_when_value"] = value
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
		if rawPrices, exists := next["prices"]; exists {
			next["prices"] = normalizeServicePriceRows(c.Context(), rawPrices)
		}
		delete(next, "price_summary")

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

func normalizeServicePriceRows(ctx context.Context, value any) []any {
	rawPrices := normalizeChildRecordRows(value)
	if len(rawPrices) == 0 {
		return []any{}
	}
	if len(rawPrices) > 1 {
		panicServiceEndpointField("同一个服务接口只能配置一套成本价格")
	}
	price := util.CloneMap(rawPrices[0])
	price["mode"] = botpricing.NormalizeMode(util.ToStringTrimmed(price["mode"]))
	if price["mode"] == "" {
		panicServiceEndpointField("请选择成本计价方式")
	}
	price["currency"] = botpricing.NormalizeCurrency(util.ToStringTrimmed(price["currency"]))
	if err := botpricing.ValidateCurrency(ctx, util.ToStringTrimmed(price["currency"])); err != nil {
		panicServiceEndpointField(err.Error())
	}
	price["max_cost"] = util.ToStringTrimmed(price["max_cost"])
	maxCostMicros, err := botpricing.ParseMoneyMicros(util.ToStringTrimmed(price["max_cost"]))
	if err != nil {
		panicServiceEndpointField("单次预授权成本上限无效：" + err.Error())
	}
	if price["mode"] == botmodel.ServicePriceModeToken && maxCostMicros <= 0 {
		panicServiceEndpointField("按 Token 计价必须配置大于 0 的单次预授权成本上限")
	}
	if util.ToIntDefault(price["status"], 0) <= 0 {
		price["status"] = defaultRecordStatus
	}
	price["items"] = normalizeServicePriceItemRows(util.ToStringTrimmed(price["mode"]), price["items"])
	return []any{price}
}

func normalizeServicePriceItemRows(mode string, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		panicServiceEndpointField("成本价格必须至少配置一个价格项")
	}
	items := make([]map[string]any, 0, len(rawItems))
	seen := map[string]struct{}{}
	active := map[string]struct{}{}
	for index, rawItem := range rawItems {
		item := util.CloneMap(rawItem)
		itemType := botpricing.NormalizeItemType(util.ToStringTrimmed(item["type"]))
		if itemType == "" {
			panicServiceEndpointField("价格项类型无效")
		}
		if _, exists := seen[itemType]; exists {
			panicServiceEndpointField("同一种价格项不能重复配置")
		}
		seen[itemType] = struct{}{}
		item["type"] = itemType
		item["unit_size"] = botpricing.UnitSize(itemType)
		item["unit_price"] = util.ToStringTrimmed(item["unit_price"])
		if _, err := botpricing.ParseMoneyMicros(util.ToStringTrimmed(item["unit_price"])); err != nil {
			panicServiceEndpointField("价格项单价无效：" + err.Error())
		}
		if util.ToIntDefault(item["status"], 0) <= 0 {
			item["status"] = defaultRecordStatus
		}
		if int16(util.ToIntDefault(item["status"], 0)) == defaultRecordStatus {
			active[itemType] = struct{}{}
		}
		if util.ToIntDefault(item["sort"], 0) <= 0 {
			item["sort"] = index + 1
		}
		items = append(items, item)
	}
	if mode == botmodel.ServicePriceModeRequest {
		if len(seen) != 1 {
			panicServiceEndpointField("按次计价只能配置单次请求价格")
		}
		if _, exists := seen[botmodel.ServicePriceItemRequest]; !exists {
			panicServiceEndpointField("按次计价必须配置单次请求价格")
		}
		if _, exists := active[botmodel.ServicePriceItemRequest]; !exists {
			panicServiceEndpointField("按次计价必须启用单次请求价格")
		}
	} else {
		if _, exists := seen[botmodel.ServicePriceItemInputToken]; !exists {
			panicServiceEndpointField("按 Token 计价必须配置输入 Token 价格")
		}
		if _, exists := seen[botmodel.ServicePriceItemOutputToken]; !exists {
			panicServiceEndpointField("按 Token 计价必须配置输出 Token 价格")
		}
		if _, exists := seen[botmodel.ServicePriceItemRequest]; exists {
			panicServiceEndpointField("按 Token 计价不能配置单次请求价格")
		}
		if _, exists := active[botmodel.ServicePriceItemInputToken]; !exists {
			panicServiceEndpointField("按 Token 计价必须启用输入 Token 价格")
		}
		if _, exists := active[botmodel.ServicePriceItemOutputToken]; !exists {
			panicServiceEndpointField("按 Token 计价必须启用输出 Token 价格")
		}
	}
	return anyChildRows(items)
}

func formatServicePriceSummary(prices []map[string]any, localService bool) string {
	if len(prices) == 0 {
		if localService {
			return "本地零成本"
		}
		return "未配置 · 零成本"
	}
	price := prices[0]
	if !isActive(int16(util.ToIntDefault(price["status"], 0))) {
		return "已停用 · 零成本"
	}
	mode := "按次"
	if botpricing.NormalizeMode(util.ToStringTrimmed(price["mode"])) == botmodel.ServicePriceModeToken {
		mode = "按 Token"
	}
	currency := botpricing.NormalizeCurrency(util.ToStringTrimmed(price["currency"]))
	return fmt.Sprintf("%s · %s", mode, currency)
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
