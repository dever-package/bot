package hook

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
)

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
