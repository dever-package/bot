package hook

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

func deleteServiceReferences(c *server.Context, serviceIDs []uint64) {
	filters := map[string]any{"service_id": uint64IDsToAny(serviceIDs)}
	botmodel.NewServiceEndpointModel().Delete(c.Context(), filters)
	botmodel.NewServiceParamModel().Delete(c.Context(), filters)
	botmodel.NewPowerTargetModel().Delete(c.Context(), filters)
}

func collectDeleteIDs(record map[string]any) []uint64 {
	return botinput.NormalizeUint64List(record["id"])
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
