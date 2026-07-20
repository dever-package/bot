package billing

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	billingmodel "github.com/dever-package/bot/model/billing"
	botpricing "github.com/dever-package/bot/service/energon/pricing"
	frontaction "github.com/dever-package/front/service/action"
)

type BillingHook struct{}

func (BillingHook) ProviderBeforeSavePolicy(_ *server.Context, params []any) any {
	record := billingPolicyPayload(params)
	record["id"] = billingmodel.DefaultPolicyID

	usdToCNYRate := strings.TrimPrefix(strings.TrimSpace(util.ToString(record["usd_to_cny_rate"])), "+")
	rateMicros, err := botpricing.ParseExchangeRateMicros(usdToCNYRate)
	if err != nil || rateMicros <= 0 {
		message := "美元兑人民币汇率必须大于 0。"
		if err != nil {
			message = err.Error() + "。"
		}
		panic(frontaction.NewFieldError("form.usd_to_cny_rate", message))
	}
	record["usd_to_cny_rate"] = usdToCNYRate
	return record
}

func billingPolicyPayload(params []any) map[string]any {
	if len(params) == 0 {
		return map[string]any{}
	}
	record, ok := params[0].(map[string]any)
	if !ok || record == nil {
		return map[string]any{}
	}
	return util.CloneMap(record)
}
