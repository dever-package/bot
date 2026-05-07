package energon

import (
	"sort"

	botmodel "my/package/bot/model/energon"
)

type Dispatcher struct{}

func NewDispatcher() Dispatcher {
	return Dispatcher{}
}

func (Dispatcher) OrderPowerTargets(items []botmodel.PowerTarget) []botmodel.PowerTarget {
	result := make([]botmodel.PowerTarget, 0, len(items))
	for _, item := range items {
		if isActive(item.Status) {
			result = append(result, item)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}
