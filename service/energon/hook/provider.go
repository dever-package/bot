package hook

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
)

type ProviderHook struct{}

func (ProviderHook) ProviderBeforeSaveProvider(_ *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["protocol"] = strings.ToLower(strings.TrimSpace(util.ToString(record["protocol"])))
	record["processor"] = strings.ToLower(util.ToStringTrimmed(record["processor"]))
	record["host"] = util.ToStringTrimmed(record["host"])
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
	}
	ensureDefaultCategory(record)
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	return record
}

func (ProviderHook) ProviderAfterSaveProvider(c *server.Context, params []any) any {
	payload := cloneEnergonRecord(params)
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
