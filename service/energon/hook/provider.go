package hook

import (
	"net/url"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
)

type ProviderHook struct{}

func (ProviderHook) ProviderBeforeSaveProvider(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialEnergonRecord(record)

	trimEnergonStringField(record, "name", partial)
	if shouldNormalizeEnergonField(record, "protocol", partial) {
		record["protocol"] = strings.ToLower(strings.TrimSpace(util.ToString(record["protocol"])))
	}
	if shouldNormalizeEnergonField(record, "processor", partial) {
		record["processor"] = strings.ToLower(util.ToStringTrimmed(record["processor"]))
	}
	trimEnergonStringField(record, "host", partial)
	if !partial {
		if record["protocol"] == botprocessor.ProtocolLocal {
			record["host"] = ""
			processorKey := util.ToStringTrimmed(record["processor"])
			if processorKey == "" {
				panicParamField("form.processor", "本地来源必须选择处理器。")
			}
			if _, ok := localProcessorRegistry.Manifest(processorKey); !ok {
				panicParamField("form.processor", "选择的本地处理器不存在。")
			}
			record["accounts"] = []any{}
		} else {
			record["processor"] = ""
			if rawAccounts, exists := record["accounts"]; exists {
				record["accounts"] = normalizeProviderAccountRows(c, util.ToUint64(record["id"]), rawAccounts)
			}
		}
	} else if rawAccounts, exists := record["accounts"]; exists {
		record["accounts"] = normalizeProviderAccountRows(c, util.ToUint64(record["id"]), rawAccounts)
	}
	ensureDefaultCategory(record, partial)
	ensureDefaultRecordStatus(record, partial)

	return record
}

func normalizeProviderAccountRows(c *server.Context, providerID uint64, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	existingRows := existingProviderAccountRows(c, providerID)
	if len(rawItems) == 0 {
		ensureProviderAccountsNotBound(c, existingRows, nil)
		return []any{}
	}

	existingIDsByKey := make(map[string]uint64, len(existingRows))
	existingIDSet := make(map[uint64]struct{}, len(existingRows))
	for _, row := range existingRows {
		id := util.ToUint64(row["id"])
		key := util.ToStringTrimmed(row["key"])
		if id == 0 {
			continue
		}
		existingIDSet[id] = struct{}{}
		if key != "" {
			existingIDsByKey[key] = id
		}
	}

	items := make([]map[string]any, 0, len(rawItems))
	naturalRows := make([]naturalKeyedChildRow, 0, len(rawItems))
	seenKeys := map[string]struct{}{}
	for index, row := range rawItems {
		next := util.CloneMap(row)
		next["name"] = util.ToStringTrimmed(next["name"])
		if util.ToStringTrimmed(next["name"]) == "" {
			panicParamField("form.accounts", "来源账号必须填写账号名称。")
		}

		key := util.ToStringTrimmed(next["key"])
		if key == "" {
			panicParamField("form.accounts", "来源账号必须填写密钥。")
		}
		if strings.ContainsAny(key, "\r\n") {
			panicParamField("form.accounts", "来源账号密钥不能包含换行。")
		}
		if _, exists := seenKeys[key]; exists {
			panicParamField("form.accounts", "同一来源不能重复配置相同密钥。")
		}
		seenKeys[key] = struct{}{}
		next["key"] = key
		next["scope"] = botmodel.NormalizeAccountScope(util.ToIntDefault(next["scope"], int(botmodel.AccountScopeCommon)))
		next["host"] = normalizeAccountHost(next["host"])
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		if util.ToIntDefault(next["status"], 0) <= 0 {
			next["status"] = defaultRecordStatus
		}
		delete(next, "provider_id")

		originalID := util.ToUint64(row["id"])
		if providerID == 0 {
			originalID = 0
			delete(next, "id")
		} else if originalID > 0 {
			if _, exists := existingIDSet[originalID]; !exists {
				panicParamField("form.accounts", "来源账号不属于当前来源，请刷新后重试。")
			}
		}
		items = append(items, next)
		naturalRows = append(naturalRows, naturalKeyedChildRow{
			row:        next,
			naturalKey: key,
			originalID: originalID,
		})
	}

	assignNaturalKeyedChildIDs(naturalRows, existingIDsByKey)
	ensureProviderAccountsNotBound(c, existingRows, items)
	return anyChildRows(items)
}

func normalizeAccountHost(value any) string {
	host := util.ToStringTrimmed(value)
	if host == "" {
		return ""
	}
	parsed, err := url.Parse(host)
	if err != nil || parsed.Host == "" || parsed.User != nil || parsed.RawQuery != "" || parsed.Fragment != "" {
		panicParamField("form.accounts", "账号主机必须是有效的 HTTP(S) 地址，且不能包含账号、查询参数或锚点。")
	}
	scheme := strings.ToLower(strings.TrimSpace(parsed.Scheme))
	if scheme != "http" && scheme != "https" {
		panicParamField("form.accounts", "账号主机必须以 http:// 或 https:// 开头。")
	}
	return host
}

func existingProviderAccountRows(c *server.Context, providerID uint64) []map[string]any {
	if providerID == 0 {
		return nil
	}
	return botmodel.NewAccountModel().SelectMap(c.Context(), map[string]any{"provider_id": providerID})
}

func ensureProviderAccountsNotBound(c *server.Context, existingAccounts []map[string]any, accounts []map[string]any) {
	if len(existingAccounts) == 0 {
		return
	}
	retainedIDs := make(map[uint64]struct{}, len(accounts))
	for _, account := range accounts {
		if id := util.ToUint64(account["id"]); id > 0 {
			retainedIDs[id] = struct{}{}
		}
	}
	removedIDs := make([]any, 0)
	for _, account := range existingAccounts {
		id := util.ToUint64(account["id"])
		if id == 0 {
			continue
		}
		if _, retained := retainedIDs[id]; !retained {
			removedIDs = append(removedIDs, id)
		}
	}
	if len(removedIDs) == 0 {
		return
	}
	services := botmodel.NewServiceModel().SelectMap(c.Context(), map[string]any{"account_id": removedIDs})
	if len(services) == 0 {
		return
	}
	name := util.ToStringTrimmed(services[0]["name"])
	if name == "" {
		name = "已有来源服务"
	}
	panicParamField("form.accounts", "账号已被来源服务“"+name+"”使用，请先修改服务的鉴权账号。")
}

func (ProviderHook) ProviderAfterSaveProvider(c *server.Context, params []any) any {
	payload := cloneEnergonRecord(params)
	if sourcePayload, ok := payload["payload"].(map[string]any); ok && isPartialEnergonRecord(sourcePayload) {
		_, protocolChanged := sourcePayload["protocol"]
		_, processorChanged := sourcePayload["processor"]
		if !protocolChanged && !processorChanged {
			return nil
		}
	}
	providerID := savedProviderID(payload)
	if providerID == 0 {
		return nil
	}
	provider := botmodel.NewProviderModel().Find(c.Context(), map[string]any{"id": providerID})
	if provider == nil {
		return nil
	}
	if strings.EqualFold(strings.TrimSpace(provider.Protocol), botprocessor.ProtocolLocal) {
		if err := syncLocalProcessorServices(c, *provider); err != nil {
			panic(err.Error())
		}
		return nil
	}
	deleteLocalProcessorServices(c, provider.ID)
	return nil
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
