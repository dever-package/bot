package body

import (
	"regexp"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	bodymodel "github.com/dever-package/bot/model/body"
	skillservice "github.com/dever-package/bot/service/agent/skill"
)

var accountConfigKeyPattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,63}$`)

type AccountHook struct{}

func (AccountHook) ProviderAttachAccountForm(c *server.Context, params []any) any {
	payload := cloneBodyRecord(params)
	record := payload
	if loaded, ok := payload["record"].(map[string]any); ok {
		record = util.CloneMap(loaded)
	}

	provider := bodymodel.NormalizeAccountProvider(util.ToStringTrimmed(record["provider"]))
	if provider == "" && util.ToUint64(record["id"]) == 0 {
		provider = bodymodel.AccountProviderFeishu
		record["provider"] = provider
	}
	record["configs"] = accountConfigFormRows(c, util.ToUint64(record["id"]), provider)
	return record
}

func (AccountHook) ProviderBeforeSaveAccount(c *server.Context, params []any) any {
	record := cloneBodyRecord(params)
	if len(record) == 0 {
		return record
	}

	partial := isPartialBodyRecord(record) || isSparseAccountUpdate(record)
	trimBodyStringField(record, "provider", partial)
	trimBodyStringField(record, "name", partial)
	trimBodyStringField(record, "icon", partial)

	provider := resolveAccountProvider(c, record, partial)
	validateAccountFields(record, provider, partial)
	if configs, exists := record["configs"]; exists {
		record["configs"] = normalizeAccountConfigRows(c, util.ToUint64(record["id"]), provider, configs)
	} else if !partial && util.ToUint64(record["id"]) == 0 {
		panicBodyField("form.configs", "账号配置不能为空。")
	}

	if partial {
		defaultBodyInt16Field(record, "status", defaultStatus, true)
		defaultBodyIntField(record, "sort", defaultSort, true)
	} else if util.ToUint64(record["id"]) == 0 {
		record["status"] = defaultStatus
		record["sort"] = defaultSort
	} else {
		delete(record, "status")
		delete(record, "sort")
	}
	return record
}

func isSparseAccountUpdate(record map[string]any) bool {
	if util.ToUint64(record["id"]) == 0 {
		return false
	}
	_, hasConfigs := record["configs"]
	return !hasConfigs
}

func resolveAccountProvider(c *server.Context, record map[string]any, partial bool) string {
	if shouldNormalizeBodyField(record, "provider", partial) {
		provider := bodymodel.NormalizeAccountProvider(util.ToStringTrimmed(record["provider"]))
		record["provider"] = provider
		return provider
	}
	if id := util.ToUint64(record["id"]); id > 0 {
		if existing := bodymodel.NewAccountModel().Find(c.Context(), map[string]any{"id": id}); existing != nil {
			return bodymodel.NormalizeAccountProvider(existing.Provider)
		}
	}
	return ""
}

func validateAccountFields(record map[string]any, provider string, partial bool) {
	if (!partial || shouldNormalizeBodyField(record, "provider", partial)) && provider == "" {
		panicBodyField("form.provider", "请选择账号类型。")
	}

	name := util.ToStringTrimmed(record["name"])
	if (!partial || shouldNormalizeBodyField(record, "name", partial)) && name == "" {
		panicBodyField("form.name", "按钮名称不能为空。")
	}
	if len([]rune(name)) > 96 {
		panicBodyField("form.name", "按钮名称不能超过 96 个字符。")
	}
}

func accountConfigFormRows(c *server.Context, accountID uint64, provider string) []any {
	rows := selectAccountConfigs(c.Context(), []uint64{accountID})
	result := make([]any, 0, len(rows)+2)
	keys := map[string]struct{}{}
	for _, row := range rows {
		if row == nil {
			continue
		}
		key := strings.ToLower(strings.TrimSpace(row.Key))
		value := strings.TrimSpace(row.Value)
		if isSecretAccountConfigKey(key) {
			value = ""
		}
		result = append(result, map[string]any{
			"id":         row.ID,
			"account_id": row.AccountID,
			"key":        key,
			"value":      value,
		})
		keys[key] = struct{}{}
	}
	for _, key := range requiredAccountConfigKeys(provider) {
		if _, exists := keys[key]; exists {
			continue
		}
		result = append(result, map[string]any{
			"id":         0,
			"account_id": accountID,
			"key":        key,
			"value":      "",
		})
	}
	return result
}

func normalizeAccountConfigRows(
	c *server.Context,
	accountID uint64,
	provider string,
	value any,
) []any {
	rows := normalizeBodyChildRows(value)
	existingRows := selectAccountConfigs(c.Context(), []uint64{accountID})
	existingByID := make(map[uint64]*bodymodel.AccountConfig, len(existingRows))
	existingByKey := make(map[string]*bodymodel.AccountConfig, len(existingRows))
	for _, row := range existingRows {
		if row == nil {
			continue
		}
		existingByID[row.ID] = row
		existingByKey[strings.ToLower(strings.TrimSpace(row.Key))] = row
	}

	result := make([]any, 0, len(rows))
	seen := make(map[string]struct{}, len(rows))
	for _, raw := range rows {
		key := strings.ToLower(util.ToStringTrimmed(raw["key"]))
		if !accountConfigKeyPattern.MatchString(key) {
			panicBodyField("form.configs", "配置 Key 必须以小写字母开头，且只能包含小写字母、数字和下划线。")
		}
		if _, exists := seen[key]; exists {
			panicBodyField("form.configs", "配置 Key 不能重复。")
		}
		seen[key] = struct{}{}

		id := util.ToUint64(raw["id"])
		existing := existingByID[id]
		if id > 0 && existing == nil {
			panicBodyField("form.configs", "账号配置不存在或不属于当前账号。")
		}
		if matched := existingByKey[key]; matched != nil {
			if existing != nil && matched.ID != existing.ID {
				panicBodyField("form.configs", "配置 Key 已存在。")
			}
			if existing == nil {
				existing = matched
				id = matched.ID
			}
		}

		configValue := util.ToStringTrimmed(raw["value"])
		if isSecretAccountConfigKey(key) {
			configValue = normalizeAccountSecretValue(existing, configValue)
		} else if configValue == "" {
			panicBodyField("form.configs", "配置 Value 不能为空。")
		}
		if len([]byte(configValue)) > 16384 {
			panicBodyField("form.configs", "配置 Value 不能超过 16384 字节。")
		}

		result = append(result, map[string]any{
			"id":    id,
			"key":   key,
			"value": configValue,
		})
	}
	for _, key := range requiredAccountConfigKeys(provider) {
		if _, exists := seen[key]; !exists {
			panicBodyField("form.configs", "当前账号类型缺少必要配置："+key+"。")
		}
	}
	return result
}

func normalizeAccountSecretValue(existing *bodymodel.AccountConfig, value string) string {
	if value == "" {
		if existing == nil || strings.TrimSpace(existing.Value) == "" {
			panicBodyField("form.configs", "密钥配置不能为空。")
		}
		return existing.Value
	}
	if len([]byte(value)) > 4096 {
		panicBodyField("form.configs", "密钥配置不能超过 4096 字节。")
	}
	encrypted, err := skillservice.EncryptSecret(value)
	if err != nil {
		panicBodyField("form.configs", "密钥配置加密失败，请检查服务端密钥配置。")
	}
	return encrypted
}

func requiredAccountConfigKeys(provider string) []string {
	if provider == bodymodel.AccountProviderFeishu {
		return []string{
			bodymodel.AccountConfigKeyAppID,
			bodymodel.AccountConfigKeyAppSecret,
		}
	}
	return nil
}

func isSecretAccountConfigKey(key string) bool {
	return key == bodymodel.AccountConfigKeyAppSecret
}

func normalizeBodyChildRows(value any) []map[string]any {
	result := make([]map[string]any, 0)
	switch rows := value.(type) {
	case []any:
		for _, item := range rows {
			if row, ok := item.(map[string]any); ok {
				result = append(result, util.CloneMap(row))
			}
		}
	case []map[string]any:
		for _, row := range rows {
			result = append(result, util.CloneMap(row))
		}
	}
	return result
}
