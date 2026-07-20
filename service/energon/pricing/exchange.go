package pricing

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
)

const settlementCurrency = energonmodel.ServicePriceCurrencyCNY

func NormalizeCurrency(value string) string {
	currency := strings.ToUpper(strings.TrimSpace(value))
	if currency == "" {
		return energonmodel.ServicePriceCurrencyCNY
	}
	return currency
}

func IsSupportedCurrency(value string) bool {
	switch NormalizeCurrency(value) {
	case energonmodel.ServicePriceCurrencyCNY, energonmodel.ServicePriceCurrencyUSD:
		return true
	default:
		return false
	}
}

func ValidateCurrency(ctx context.Context, value string) error {
	currency := NormalizeCurrency(value)
	if !IsSupportedCurrency(currency) {
		return fmt.Errorf("不支持的成本币种: %s", currency)
	}
	_, _, err := resolveSettlementRate(ctx, currency)
	return err
}

func ApplySettlement(ctx context.Context, quote Quote) Quote {
	sourceCurrency := NormalizeCurrency(quote.Currency)
	sourceCostMicros := quote.CostMicros
	sourceMaxCostMicros := quote.MaxCostMicros
	quote.SourceCurrency = sourceCurrency
	quote.SourceCostMicros = sourceCostMicros
	quote.Currency = settlementCurrency
	quote.CostMicros = 0
	quote.MaxCostMicros = 0

	rate, rateMicros, err := resolveSettlementRate(ctx, sourceCurrency)
	if err != nil {
		quote.Status = settlementFailureStatus(sourceCurrency)
		quote.Error = err.Error()
		return quote
	}
	quote.ExchangeRate = rate

	settlementCost, err := convertMicros(sourceCostMicros, rateMicros)
	if err != nil {
		quote.Status = energonmodel.CostPricingInvalidPrice
		quote.Error = "结算成本无效: " + err.Error()
		return quote
	}
	settlementMaxCost, err := convertMicros(sourceMaxCostMicros, rateMicros)
	if err != nil {
		quote.Status = energonmodel.CostPricingInvalidPrice
		quote.Error = "结算预授权成本无效: " + err.Error()
		return quote
	}
	quote.CostMicros = settlementCost
	quote.MaxCostMicros = settlementMaxCost
	return quote
}

func resolveSettlementRate(ctx context.Context, currency string) (string, int64, error) {
	switch currency {
	case energonmodel.ServicePriceCurrencyCNY:
		return "1", moneyScale, nil
	case energonmodel.ServicePriceCurrencyUSD:
		policy := billingmodel.NewPolicyModel().Find(ctx, map[string]any{"id": billingmodel.DefaultPolicyID})
		rate := billingmodel.DefaultUSDToCNYRate
		if policy != nil {
			rate = strings.TrimSpace(policy.USDToCNYRate)
		}
		rateMicros, err := ParseExchangeRateMicros(rate)
		if err != nil || rateMicros <= 0 {
			return "", 0, fmt.Errorf("美元兑人民币汇率未配置或无效")
		}
		return rate, rateMicros, nil
	default:
		return "", 0, fmt.Errorf("不支持的成本币种: %s", currency)
	}
}

func settlementFailureStatus(currency string) string {
	if currency == energonmodel.ServicePriceCurrencyUSD {
		return energonmodel.CostPricingMissingExchangeRate
	}
	return energonmodel.CostPricingInvalidPrice
}

func convertMicros(value int64, rateMicros int64) (int64, error) {
	if value < 0 {
		return 0, fmt.Errorf("成本不能小于 0")
	}
	if value == 0 {
		return 0, nil
	}
	if rateMicros <= 0 {
		return 0, fmt.Errorf("结算汇率必须大于 0")
	}
	numerator := new(big.Int).Mul(big.NewInt(value), big.NewInt(rateMicros))
	numerator.Add(numerator, big.NewInt(moneyScale-1))
	numerator.Div(numerator, big.NewInt(moneyScale))
	if !numerator.IsInt64() {
		return 0, fmt.Errorf("结算成本超出范围")
	}
	return numerator.Int64(), nil
}
