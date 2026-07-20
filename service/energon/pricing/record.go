package pricing

import (
	"context"
	"fmt"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type AttemptRecordRequest struct {
	Log               botmodel.Log
	Billing           botprotocol.BillingContext
	ServiceEndpointID uint64
	CallStatus        string
	Usage             Usage
}

func RecordAttempt(ctx context.Context, request AttemptRecordRequest) (record botmodel.CostRecord) {
	if request.Log.ID == 0 || request.ServiceEndpointID == 0 {
		return botmodel.CostRecord{}
	}
	quote := Calculate(ctx, request.ServiceEndpointID, request.Usage)
	businessKey := strings.TrimSpace(request.Billing.BusinessKey)
	if businessKey == "" {
		businessKey = request.Log.RequestID
	}
	scene := strings.TrimSpace(request.Billing.Scene)
	if scene == "" {
		scene = "system"
	}
	billable := int16(2)
	if request.Billing.Billable {
		billable = 1
	}
	sourceCurrency := quote.SourceCurrency
	if sourceCurrency == "" {
		sourceCurrency = NormalizeCurrency(quote.Currency)
	}
	exchangeRate := quote.ExchangeRate
	if exchangeRate == "" && sourceCurrency == botmodel.ServicePriceCurrencyCNY {
		exchangeRate = "1"
	}
	settlementCurrency := quote.Currency
	if quote.SourceCurrency == "" {
		settlementCurrency = botmodel.ServicePriceCurrencyCNY
	}
	record = botmodel.CostRecord{
		LogID:             request.Log.ID,
		PowerChargeID:     request.Billing.ChargeID,
		RequestID:         request.Log.RequestID,
		BusinessKey:       businessKey,
		Scene:             scene,
		Billable:          billable,
		UserID:            request.Billing.UserID,
		TeamID:            request.Billing.TeamID,
		ProjectID:         request.Billing.ProjectID,
		SessionID:         request.Billing.SessionID,
		RunID:             request.Billing.RunID,
		PowerID:           request.Log.PowerID,
		PowerName:         request.Log.PowerName,
		PowerTargetID:     request.Log.PowerTargetID,
		ProviderID:        request.Log.ProviderID,
		ProviderName:      request.Log.ProviderName,
		AccountID:         request.Log.AccountID,
		ServiceID:         request.Log.ServiceID,
		ServiceName:       request.Log.ServiceName,
		ServiceEndpointID: request.ServiceEndpointID,
		ServiceAPI:        request.Log.ServiceApi,
		ServicePriceID:    quote.ServicePriceID,
		CallStatus:        request.CallStatus,
		PricingStatus:     quote.Status,
		PricingMode:       quote.Mode,
		SourceCurrency:    sourceCurrency,
		SourceCostMicros:  quote.SourceCostMicros,
		ExchangeRate:      exchangeRate,
		Currency:          settlementCurrency,
		PromptTokens:      request.Usage.PromptTokens,
		CompletionTokens:  request.Usage.CompletionTokens,
		CachedTokens:      request.Usage.CachedTokens,
		CostMicros:        quote.CostMicros,
		PricingSnapshot:   quote.Snapshot,
		Error:             quote.Error,
		CreatedAt:         time.Now(),
	}
	id, err := insertCostRecord(ctx, map[string]any{
		"log_id":              record.LogID,
		"power_charge_id":     record.PowerChargeID,
		"request_id":          record.RequestID,
		"business_key":        record.BusinessKey,
		"scene":               record.Scene,
		"billable":            record.Billable,
		"user_id":             record.UserID,
		"team_id":             record.TeamID,
		"project_id":          record.ProjectID,
		"session_id":          record.SessionID,
		"run_id":              record.RunID,
		"power_id":            record.PowerID,
		"power_name":          record.PowerName,
		"power_target_id":     record.PowerTargetID,
		"provider_id":         record.ProviderID,
		"provider_name":       record.ProviderName,
		"account_id":          record.AccountID,
		"service_id":          record.ServiceID,
		"service_name":        record.ServiceName,
		"service_endpoint_id": record.ServiceEndpointID,
		"service_api":         record.ServiceAPI,
		"service_price_id":    record.ServicePriceID,
		"call_status":         record.CallStatus,
		"pricing_status":      record.PricingStatus,
		"pricing_mode":        record.PricingMode,
		"source_currency":     record.SourceCurrency,
		"source_cost_micros":  record.SourceCostMicros,
		"exchange_rate":       record.ExchangeRate,
		"currency":            record.Currency,
		"prompt_tokens":       record.PromptTokens,
		"completion_tokens":   record.CompletionTokens,
		"cached_tokens":       record.CachedTokens,
		"cost_micros":         record.CostMicros,
		"pricing_snapshot":    record.PricingSnapshot,
		"error":               record.Error,
		"created_at":          record.CreatedAt,
	})
	if err != nil {
		if existing := botmodel.NewCostRecordModel().Find(ctx, map[string]any{"log_id": record.LogID}); existing != nil {
			return *existing
		}
		if request.Billing.Billable {
			panic(fmt.Errorf("可计费调用成本记录保存失败: %w", err))
		}
		dlog.ErrorFields("energon_cost_record", "非计费调用成本记录保存失败", dlog.Fields{
			"log_id": record.LogID,
			"error":  err.Error(),
		})
		return record
	}
	record.ID = id
	return record
}

func insertCostRecord(ctx context.Context, values map[string]any) (id uint64, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			if recoveredErr, ok := recovered.(error); ok {
				err = recoveredErr
				return
			}
			err = fmt.Errorf("%v", recovered)
		}
	}()
	id = util.ToUint64(botmodel.NewCostRecordModel().Insert(ctx, values))
	if id == 0 {
		return 0, fmt.Errorf("成本记录保存失败")
	}
	return id, nil
}
