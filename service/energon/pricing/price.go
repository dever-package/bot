package pricing

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/big"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

const (
	moneyScale       int64 = 1_000_000
	tokenPricingUnit int64 = 1_000_000
)

type Usage struct {
	PromptTokens     int64
	CompletionTokens int64
	CachedTokens     int64
}

type Quote struct {
	ServicePriceID   uint64
	Mode             string
	SourceCurrency   string
	SourceCostMicros int64
	ExchangeRate     string
	Currency         string
	Status           string
	CostMicros       int64
	MaxCostMicros    int64
	Snapshot         string
	Error            string
}

type priceSnapshot struct {
	PriceID  uint64              `json:"price_id"`
	Source   string              `json:"source,omitempty"`
	Mode     string              `json:"mode"`
	Currency string              `json:"currency"`
	MaxCost  string              `json:"max_cost"`
	Items    []priceItemSnapshot `json:"items"`
}

type priceItemSnapshot struct {
	Type      string `json:"type"`
	UnitSize  int64  `json:"unit_size"`
	UnitPrice string `json:"unit_price"`
}

func Calculate(ctx context.Context, endpointID uint64, usage Usage) Quote {
	price := botmodel.NewServicePriceModel().Find(ctx, map[string]any{
		"service_endpoint_id": endpointID,
		"status":              1,
	})
	if price == nil || price.ID == 0 {
		source := "unconfigured_price"
		if isLocalServiceEndpoint(ctx, endpointID) {
			source = "local_processor"
		}
		return ApplySettlement(ctx, zeroCostQuote(source))
	}

	items := botmodel.NewServicePriceItemModel().Select(ctx, map[string]any{
		"service_price_id": price.ID,
		"status":           1,
	})
	quote := calculateQuote(*price, items, usage)
	if quote.Status == botmodel.CostPricingInvalidPrice {
		return quote
	}
	return ApplySettlement(ctx, quote)
}

func isLocalServiceEndpoint(ctx context.Context, endpointID uint64) bool {
	endpoint := botmodel.NewServiceEndpointModel().Find(ctx, map[string]any{"id": endpointID})
	if endpoint == nil || endpoint.ServiceID == 0 {
		return false
	}
	service := botmodel.NewServiceModel().Find(ctx, map[string]any{"id": endpoint.ServiceID})
	if service == nil || service.ProviderID == 0 {
		return false
	}
	provider := botmodel.NewProviderModel().Find(ctx, map[string]any{"id": service.ProviderID})
	return provider != nil && strings.EqualFold(strings.TrimSpace(provider.Protocol), "local")
}

func zeroCostQuote(source string) Quote {
	snapshot, err := json.Marshal(priceSnapshot{
		Source:   source,
		Mode:     botmodel.ServicePriceModeRequest,
		Currency: botmodel.ServicePriceCurrencyCNY,
		MaxCost:  "0",
		Items: []priceItemSnapshot{
			{Type: botmodel.ServicePriceItemRequest, UnitSize: 1, UnitPrice: "0"},
		},
	})
	if err != nil {
		snapshot = []byte("{}")
	}
	return Quote{
		Mode:       botmodel.ServicePriceModeRequest,
		Currency:   botmodel.ServicePriceCurrencyCNY,
		Status:     botmodel.CostPricingPriced,
		Snapshot:   string(snapshot),
		CostMicros: 0,
	}
}

func calculateQuote(price botmodel.ServicePrice, items []*botmodel.ServicePriceItem, usage Usage) Quote {
	mode := NormalizeMode(price.Mode)
	currency := strings.ToUpper(strings.TrimSpace(price.Currency))
	if currency == "" {
		currency = botmodel.ServicePriceCurrencyCNY
	}
	quote := Quote{
		ServicePriceID: price.ID,
		Mode:           mode,
		Currency:       currency,
		Status:         botmodel.CostPricingInvalidPrice,
		Snapshot:       encodeSnapshot(price, items),
	}

	maxCost, err := ParseMoneyMicros(price.MaxCost)
	if err != nil {
		quote.Error = "预授权成本上限无效: " + err.Error()
		return quote
	}
	quote.MaxCostMicros = maxCost

	prices, err := activeItemPrices(items)
	if err != nil {
		quote.Error = err.Error()
		return quote
	}

	switch mode {
	case botmodel.ServicePriceModeRequest:
		requestPrice, ok := prices[botmodel.ServicePriceItemRequest]
		if !ok {
			quote.Error = "按次计价缺少单次请求价格"
			return quote
		}
		quote.CostMicros = requestPrice
	case botmodel.ServicePriceModeToken:
		inputPrice, hasInput := prices[botmodel.ServicePriceItemInputToken]
		outputPrice, hasOutput := prices[botmodel.ServicePriceItemOutputToken]
		if !hasInput || !hasOutput {
			quote.Error = "按 Token 计价必须配置输入和输出 Token 价格"
			return quote
		}
		if usage.PromptTokens <= 0 && usage.CompletionTokens <= 0 {
			quote.Status = botmodel.CostPricingMissingUsage
			quote.Error = "按 Token 计价未获取到 Token 用量"
			return quote
		}
		cachedPrice := inputPrice
		if configured, ok := prices[botmodel.ServicePriceItemCachedToken]; ok {
			cachedPrice = configured
		}
		cachedTokens := clampCachedTokens(usage.CachedTokens, usage.PromptTokens)
		inputTokens := maxInt64(usage.PromptTokens-cachedTokens, 0)
		inputCost, inputErr := ceilProportionalCost(inputTokens, inputPrice, tokenPricingUnit)
		cachedCost, cachedErr := ceilProportionalCost(cachedTokens, cachedPrice, tokenPricingUnit)
		outputCost, outputErr := ceilProportionalCost(maxInt64(usage.CompletionTokens, 0), outputPrice, tokenPricingUnit)
		if err := firstError(inputErr, cachedErr, outputErr); err != nil {
			quote.Error = err.Error()
			return quote
		}
		if inputCost > math.MaxInt64-cachedCost || inputCost+cachedCost > math.MaxInt64-outputCost {
			quote.Error = "成本计算结果超出范围"
			return quote
		}
		quote.CostMicros = inputCost + cachedCost + outputCost
	default:
		quote.Error = "不支持的计价方式"
		return quote
	}

	quote.Status = botmodel.CostPricingPriced
	quote.Error = ""
	return quote
}

func NormalizeMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case botmodel.ServicePriceModeRequest:
		return botmodel.ServicePriceModeRequest
	case botmodel.ServicePriceModeToken:
		return botmodel.ServicePriceModeToken
	default:
		return ""
	}
}

func NormalizeItemType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case botmodel.ServicePriceItemRequest:
		return botmodel.ServicePriceItemRequest
	case botmodel.ServicePriceItemInputToken:
		return botmodel.ServicePriceItemInputToken
	case botmodel.ServicePriceItemCachedToken:
		return botmodel.ServicePriceItemCachedToken
	case botmodel.ServicePriceItemOutputToken:
		return botmodel.ServicePriceItemOutputToken
	default:
		return ""
	}
}

func UnitSize(itemType string) int64 {
	if NormalizeItemType(itemType) == botmodel.ServicePriceItemRequest {
		return 1
	}
	return tokenPricingUnit
}

func ParseMoneyMicros(value string) (int64, error) {
	return parseDecimalMicros(value, "金额")
}

func ParseExchangeRateMicros(value string) (int64, error) {
	return parseDecimalMicros(value, "汇率")
}

func parseDecimalMicros(value string, name string) (int64, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0, fmt.Errorf("%s不能为空", name)
	}
	if strings.HasPrefix(value, "+") {
		value = strings.TrimPrefix(value, "+")
	}
	if strings.HasPrefix(value, "-") {
		return 0, fmt.Errorf("%s不能小于 0", name)
	}
	parts := strings.Split(value, ".")
	if len(parts) > 2 || parts[0] == "" {
		return 0, fmt.Errorf("%s格式无效", name)
	}
	if !isDigits(parts[0]) {
		return 0, fmt.Errorf("%s格式无效", name)
	}
	fraction := ""
	if len(parts) == 2 {
		fraction = parts[1]
		if fraction == "" || len(fraction) > 6 || !isDigits(fraction) {
			return 0, fmt.Errorf("%s最多支持 6 位小数", name)
		}
	}
	whole, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || whole > math.MaxInt64/moneyScale {
		return 0, fmt.Errorf("%s超出范围", name)
	}
	for len(fraction) < 6 {
		fraction += "0"
	}
	fractionMicros := int64(0)
	if fraction != "" {
		fractionMicros, err = strconv.ParseInt(fraction, 10, 64)
		if err != nil {
			return 0, fmt.Errorf("%s格式无效", name)
		}
	}
	if whole == math.MaxInt64/moneyScale && fractionMicros > math.MaxInt64%moneyScale {
		return 0, fmt.Errorf("%s超出范围", name)
	}
	return whole*moneyScale + fractionMicros, nil
}

func activeItemPrices(items []*botmodel.ServicePriceItem) (map[string]int64, error) {
	result := make(map[string]int64, len(items))
	for _, item := range items {
		if item == nil || item.Status != 1 {
			continue
		}
		itemType := NormalizeItemType(item.Type)
		if itemType == "" {
			return nil, fmt.Errorf("存在无效价格项")
		}
		if _, exists := result[itemType]; exists {
			return nil, fmt.Errorf("价格项重复: %s", itemType)
		}
		price, err := ParseMoneyMicros(item.UnitPrice)
		if err != nil {
			return nil, fmt.Errorf("价格项 %s 无效: %w", itemType, err)
		}
		result[itemType] = price
	}
	return result, nil
}

func encodeSnapshot(price botmodel.ServicePrice, items []*botmodel.ServicePriceItem) string {
	snapshot := priceSnapshot{
		PriceID:  price.ID,
		Mode:     NormalizeMode(price.Mode),
		Currency: strings.ToUpper(strings.TrimSpace(price.Currency)),
		MaxCost:  strings.TrimSpace(price.MaxCost),
		Items:    make([]priceItemSnapshot, 0, len(items)),
	}
	for _, item := range items {
		if item == nil || item.Status != 1 {
			continue
		}
		snapshot.Items = append(snapshot.Items, priceItemSnapshot{
			Type: NormalizeItemType(item.Type), UnitSize: item.UnitSize, UnitPrice: strings.TrimSpace(item.UnitPrice),
		})
	}
	raw, err := json.Marshal(snapshot)
	if err != nil {
		return "{}"
	}
	return string(raw)
}

func ceilProportionalCost(quantity int64, unitPrice int64, unitSize int64) (int64, error) {
	if quantity <= 0 || unitPrice <= 0 {
		return 0, nil
	}
	if unitSize <= 0 {
		return 0, fmt.Errorf("计价单位必须大于 0")
	}
	numerator := new(big.Int).Mul(big.NewInt(quantity), big.NewInt(unitPrice))
	numerator.Add(numerator, big.NewInt(unitSize-1))
	numerator.Div(numerator, big.NewInt(unitSize))
	if !numerator.IsInt64() {
		return 0, fmt.Errorf("成本计算结果超出范围")
	}
	return numerator.Int64(), nil
}

func clampCachedTokens(cached int64, prompt int64) int64 {
	if cached < 0 {
		return 0
	}
	if prompt > 0 && cached > prompt {
		return prompt
	}
	return cached
}

func maxInt64(left int64, right int64) int64 {
	if left > right {
		return left
	}
	return right
}

func firstError(values ...error) error {
	for _, err := range values {
		if err != nil {
			return err
		}
	}
	return nil
}

func isDigits(value string) bool {
	if value == "" {
		return false
	}
	for _, current := range value {
		if current < '0' || current > '9' {
			return false
		}
	}
	return true
}
