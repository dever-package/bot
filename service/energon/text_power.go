package energon

import (
	"context"
	"fmt"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
)

func ResolveGeneralTextPower(ctx context.Context, powerID uint64) (energonmodel.Power, error) {
	if powerID == 0 {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力不能为空")
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	return validateGeneralTextPower(power)
}

func ResolveGeneralTextPowerByKey(ctx context.Context, powerKey string) (energonmodel.Power, error) {
	powerKey = strings.TrimSpace(powerKey)
	if powerKey == "" {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力标识不能为空")
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"key": powerKey})
	return validateGeneralTextPower(power)
}

func ResolveDefaultGeneralTextPower(ctx context.Context) (energonmodel.Power, error) {
	return ResolveGeneralTextPowerByKey(ctx, energonmodel.DefaultLLMPowerKey)
}

func validateGeneralTextPower(power *energonmodel.Power) (energonmodel.Power, error) {
	if power == nil {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力不存在")
	}
	if power.Status != StatusActive {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力已停用: %s", power.Name)
	}
	if !strings.EqualFold(strings.TrimSpace(power.Kind), "text") {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力必须是文本类型: %s", power.Name)
	}
	if !energonmodel.IsGeneralTextPower(*power) {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力必须是通用文本能力: %s", power.Name)
	}
	return *power, nil
}
