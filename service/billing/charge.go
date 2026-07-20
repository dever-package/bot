package billing

import (
	"context"
	"fmt"
	"math"
	"math/big"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	usermodel "github.com/dever-package/user/model"
	userservice "github.com/dever-package/user/service"
)

type PreparePowerChargeRequest struct {
	Billing       botprotocol.BillingContext
	RequestID     string
	PowerID       uint64
	PowerName     string
	PowerTargetID uint64
}

type PreparedPowerCharge struct {
	Enabled bool
	Charge  billingmodel.PowerCharge
	Billing botprotocol.BillingContext
}

type FinishPowerChargeRequest struct {
	ChargeID uint64
	RunID    uint64
	Success  bool
	Canceled bool
	Error    error
}

const maxBillablePointAmount = 100_000_000

func PreparePowerCharge(ctx context.Context, request PreparePowerChargeRequest) (PreparedPowerCharge, error) {
	request.Billing.Scene = normalizeChargeScene(request.Billing.Scene)
	request.RequestID = strings.TrimSpace(request.RequestID)
	businessKey, err := normalizeChargeBusinessKey(request.Billing.BusinessKey, request.RequestID)
	if err != nil {
		return PreparedPowerCharge{}, err
	}
	request.Billing.BusinessKey = businessKey
	request.PowerName = strings.TrimSpace(request.PowerName)
	if !request.Billing.Billable {
		request.Billing.Billable = false
		return PreparedPowerCharge{Billing: request.Billing}, nil
	}

	rule, err := ResolveChargeRule(ctx, request.Billing.UserID, request.PowerID)
	if err != nil {
		return PreparedPowerCharge{}, err
	}
	if !rule.Enabled {
		request.Billing.Billable = false
		return PreparedPowerCharge{Billing: request.Billing}, nil
	}
	if existing := findPowerChargeByBusinessKey(ctx, request.Billing.BusinessKey); existing != nil {
		return resumePreparedPowerCharge(ctx, *existing, request)
	}

	quote, quoteErr := QuotePowerReserve(ctx, request.PowerID, request.PowerTargetID)
	if quoteErr != nil {
		charge, insertErr := createPowerCharge(ctx, request, rule, PowerReserveQuote{}, billingmodel.ChargeStatusPricingError, quoteErr.Error())
		if insertErr == nil && charge.ID > 0 {
			return PreparedPowerCharge{}, fmt.Errorf("能力暂时无法计费：%w", quoteErr)
		}
		if insertErr != nil {
			return PreparedPowerCharge{}, insertErr
		}
		return PreparedPowerCharge{}, quoteErr
	}
	reservedPoints, err := chargePointAmount(quote.CostMicros, rule.SaleRatioBasisPoints, rule.PointExchangeRate)
	if err != nil {
		return PreparedPowerCharge{}, err
	}
	charge, err := createPowerCharge(ctx, request, rule, quote, billingmodel.ChargeStatusPreparing, "")
	if err != nil {
		if existing := findPowerChargeByBusinessKey(ctx, request.Billing.BusinessKey); existing != nil {
			return resumePreparedPowerCharge(ctx, *existing, request)
		}
		return PreparedPowerCharge{}, err
	}
	if charge.ReservedPoints != reservedPoints {
		return PreparedPowerCharge{}, fmt.Errorf("能力计费预占快照不一致")
	}
	return activatePreparedPowerCharge(ctx, charge, request)
}

func FinishPowerCharge(ctx context.Context, request FinishPowerChargeRequest) error {
	if request.ChargeID == 0 {
		return nil
	}
	charge, err := claimPowerChargeSettlement(ctx, request)
	if err != nil || charge == nil || isTerminalChargeStatus(charge.Status) {
		return err
	}
	request = finishRequestFromCharge(*charge)

	costs := energonmodel.NewCostRecordModel().Select(ctx, map[string]any{
		"power_charge_id": charge.ID,
	}, map[string]any{"order": "id asc"})
	totalCost, successCost, successRecord, costErr := summarizeChargeCosts(costs, charge.Currency)
	if costErr != nil {
		return failChargePricing(ctx, *charge, totalCost, costErr)
	}
	if !request.Success {
		return releaseFailedPowerCharge(ctx, *charge, totalCost, request)
	}
	if successRecord == nil {
		return failChargePricing(ctx, *charge, totalCost, fmt.Errorf("成功调用没有可结算的供应商成本"))
	}

	saleMicros, err := chargeSaleMicros(successCost, charge.SaleRatioBasisPoints)
	if err != nil {
		return failChargePricing(ctx, *charge, totalCost, err)
	}
	requestedPoints, err := chargePointAmount(successCost, charge.SaleRatioBasisPoints, charge.PointExchangeRate)
	if err != nil {
		return failChargePricing(ctx, *charge, totalCost, err)
	}
	settleTarget := requestedPoints
	configBreach := successCost > charge.ReservedCostMicros || requestedPoints > charge.ReservedPoints
	if settleTarget > charge.ReservedPoints {
		settleTarget = charge.ReservedPoints
	}
	settledPoints := 0
	if charge.PointHoldID > 0 {
		settled, settleErr := userservice.SettlePoints(ctx, userservice.PointSettleRequest{
			BusinessKey:  charge.BusinessKey,
			Amount:       settleTarget,
			Remark:       chargePointRemark(*charge),
			AllowPartial: true,
		})
		if settleErr != nil {
			return failChargeSettlement(ctx, *charge, totalCost, successCost, successRecord.ID, saleMicros, requestedPoints, settleErr)
		}
		settledPoints = settled.SettledAmount
	}
	uncollected := requestedPoints - settledPoints
	if uncollected < 0 {
		uncollected = 0
	}
	status := billingmodel.ChargeStatusSettled
	if requestedPoints == 0 {
		status = billingmodel.ChargeStatusFree
	} else if uncollected > 0 {
		status = billingmodel.ChargeStatusPartial
	}
	breachValue := int16(2)
	if configBreach {
		breachValue = 1
	}
	now := time.Now()
	return completePowerChargeSettlement(ctx, *charge, map[string]any{
		"success_cost_record_id": successRecord.ID,
		"success_cost_micros":    successCost,
		"total_cost_micros":      totalCost,
		"sale_micros":            saleMicros,
		"profit_micros":          saleMicros - totalCost,
		"requested_points":       requestedPoints,
		"settled_points":         settledPoints,
		"uncollected_points":     uncollected,
		"config_breach":          breachValue,
		"status":                 status,
		"error":                  "",
		"updated_at":             now,
	})
}

func claimPowerChargeSettlement(ctx context.Context, request FinishPowerChargeRequest) (*billingmodel.PowerCharge, error) {
	model := billingmodel.NewPowerChargeModel()
	charge := model.Find(ctx, map[string]any{"id": request.ChargeID})
	if charge == nil || charge.ID == 0 {
		return nil, fmt.Errorf("能力计费单不存在")
	}
	if isTerminalChargeStatus(charge.Status) {
		return charge, nil
	}
	if charge.Status == billingmodel.ChargeStatusSettling {
		if strings.TrimSpace(charge.FinishStatus) == "" {
			return nil, fmt.Errorf("能力计费单缺少完成意图")
		}
		return charge, nil
	}
	if charge.Status != billingmodel.ChargeStatusRunning && charge.Status != billingmodel.ChargeStatusPreparing {
		return nil, fmt.Errorf("能力计费单状态无法结算: %s", charge.Status)
	}

	finishStatus := billingmodel.ChargeFinishFailed
	if request.Canceled {
		finishStatus = billingmodel.ChargeFinishCanceled
	} else if request.Success {
		finishStatus = billingmodel.ChargeFinishSuccess
	}
	now := time.Now()
	updates := map[string]any{
		"status":        billingmodel.ChargeStatusSettling,
		"finish_status": finishStatus,
		"finish_error":  firstChargeError(request.Error, ""),
		"finalizing_at": now,
		"updated_at":    now,
	}
	if request.RunID > 0 && charge.RunID == 0 {
		updates["run_id"] = request.RunID
	}
	updated := model.Update(ctx, map[string]any{
		"id":     charge.ID,
		"status": charge.Status,
	}, updates, false)
	latest := model.Find(ctx, map[string]any{"id": charge.ID})
	if latest == nil || latest.ID == 0 {
		return nil, fmt.Errorf("能力计费单不存在")
	}
	if updated == 0 && latest.Status != billingmodel.ChargeStatusSettling && !isTerminalChargeStatus(latest.Status) {
		return nil, fmt.Errorf("能力计费单状态已变化，稍后重试")
	}
	return latest, nil
}

func finishRequestFromCharge(charge billingmodel.PowerCharge) FinishPowerChargeRequest {
	var finishErr error
	if message := strings.TrimSpace(charge.FinishError); message != "" {
		finishErr = fmt.Errorf("%s", message)
	}
	return FinishPowerChargeRequest{
		ChargeID: charge.ID,
		RunID:    charge.RunID,
		Success:  charge.FinishStatus == billingmodel.ChargeFinishSuccess,
		Canceled: charge.FinishStatus == billingmodel.ChargeFinishCanceled,
		Error:    finishErr,
	}
}

func completePowerChargeSettlement(ctx context.Context, charge billingmodel.PowerCharge, updates map[string]any) error {
	updated := billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
		"id":     charge.ID,
		"status": billingmodel.ChargeStatusSettling,
	}, updates, false)
	if updated > 0 {
		return nil
	}
	latest := billingmodel.NewPowerChargeModel().Find(ctx, map[string]any{"id": charge.ID})
	if latest != nil && isTerminalChargeStatus(latest.Status) {
		return nil
	}
	return fmt.Errorf("能力计费单结算状态保存失败")
}

func activatePreparedPowerCharge(ctx context.Context, charge billingmodel.PowerCharge, request PreparePowerChargeRequest) (PreparedPowerCharge, error) {
	if charge.Status != billingmodel.ChargeStatusPreparing {
		return PreparedPowerCharge{}, fmt.Errorf("能力计费单不在可启动状态")
	}
	holdID := uint64(0)
	if charge.ReservedPoints > 0 {
		hold, err := userservice.ReservePoints(ctx, userservice.PointReserveRequest{
			BusinessKey:   charge.BusinessKey,
			BusinessType:  "ability",
			UserID:        charge.UserID,
			PointConfigID: charge.PointConfigID,
			Amount:        charge.ReservedPoints,
			Remark:        chargePointRemark(charge),
		})
		if err != nil {
			billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
				"id":     charge.ID,
				"status": billingmodel.ChargeStatusPreparing,
			}, map[string]any{
				"status":     billingmodel.ChargeStatusFailed,
				"error":      err.Error(),
				"updated_at": time.Now(),
			}, false)
			return PreparedPowerCharge{}, err
		}
		if hold.Status != usermodel.PointHoldStatusActive {
			return PreparedPowerCharge{}, fmt.Errorf("积分预占已结束，不能重复发起能力调用")
		}
		holdID = hold.ID
	}
	updated := billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
		"id":     charge.ID,
		"status": billingmodel.ChargeStatusPreparing,
	}, map[string]any{
		"point_hold_id": holdID,
		"status":        billingmodel.ChargeStatusRunning,
		"updated_at":    time.Now(),
	}, false)
	if updated == 0 {
		return PreparedPowerCharge{}, fmt.Errorf("该能力调用正在执行，请勿重复提交")
	}
	charge.PointHoldID = holdID
	charge.Status = billingmodel.ChargeStatusRunning
	return preparedChargePayload(charge, request), nil
}

func resumePreparedPowerCharge(ctx context.Context, charge billingmodel.PowerCharge, request PreparePowerChargeRequest) (PreparedPowerCharge, error) {
	if !samePowerChargeRequest(charge, request) {
		return PreparedPowerCharge{}, fmt.Errorf("能力计费业务键已被其他调用使用")
	}
	switch charge.Status {
	case billingmodel.ChargeStatusPreparing:
		return activatePreparedPowerCharge(ctx, charge, request)
	case billingmodel.ChargeStatusRunning:
		return rejectRepeatedRunningCharge(ctx, charge)
	case billingmodel.ChargeStatusPricingError, billingmodel.ChargeStatusFailed:
		return PreparedPowerCharge{}, fmt.Errorf("能力计费准备失败：%s", strings.TrimSpace(charge.Error))
	default:
		return PreparedPowerCharge{}, fmt.Errorf("该能力调用已经完成，不能重复执行")
	}
}

func rejectRepeatedRunningCharge(ctx context.Context, charge billingmodel.PowerCharge) (PreparedPowerCharge, error) {
	if charge.PointHoldID == 0 {
		return PreparedPowerCharge{}, fmt.Errorf("该能力调用正在执行，请勿重复提交")
	}
	hold, found := userservice.FindPointHold(ctx, charge.BusinessKey)
	if !found || hold.ID != charge.PointHoldID {
		return PreparedPowerCharge{}, fmt.Errorf("该能力调用的积分预占状态异常，请勿重复提交")
	}
	if hold.Status == usermodel.PointHoldStatusExpired || hold.Status == usermodel.PointHoldStatusReleased {
		billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
			"id":     charge.ID,
			"status": billingmodel.ChargeStatusRunning,
		}, map[string]any{
			"status":     billingmodel.ChargeStatusReleased,
			"error":      "积分预占已失效，能力调用不能继续执行",
			"updated_at": time.Now(),
		}, false)
		return PreparedPowerCharge{}, fmt.Errorf("积分预占已失效，请重新发起能力调用")
	}
	return PreparedPowerCharge{}, fmt.Errorf("该能力调用正在执行，请勿重复提交")
}

func samePowerChargeRequest(charge billingmodel.PowerCharge, request PreparePowerChargeRequest) bool {
	return charge.UserID == request.Billing.UserID &&
		charge.TeamID == request.Billing.TeamID &&
		charge.ProjectID == request.Billing.ProjectID &&
		charge.SessionID == request.Billing.SessionID &&
		charge.RunID == request.Billing.RunID &&
		charge.PowerID == request.PowerID &&
		charge.PowerTargetID == request.PowerTargetID &&
		charge.Scene == request.Billing.Scene
}

func preparedChargePayload(charge billingmodel.PowerCharge, request PreparePowerChargeRequest) PreparedPowerCharge {
	billing := request.Billing
	billing.Billable = true
	billing.ChargeID = charge.ID
	billing.BusinessKey = charge.BusinessKey
	return PreparedPowerCharge{Enabled: true, Charge: charge, Billing: billing}
}

func createPowerCharge(ctx context.Context, request PreparePowerChargeRequest, rule ChargeRule, quote PowerReserveQuote, status string, errorText string) (billingmodel.PowerCharge, error) {
	if strings.TrimSpace(quote.Currency) == "" {
		quote.Currency = energonmodel.ServicePriceCurrencyCNY
	}
	reservedPoints, err := chargePointAmount(quote.CostMicros, rule.SaleRatioBasisPoints, rule.PointExchangeRate)
	if err != nil {
		return billingmodel.PowerCharge{}, err
	}
	now := time.Now()
	record := map[string]any{
		"business_key":            request.Billing.BusinessKey,
		"request_id":              request.RequestID,
		"scene":                   request.Billing.Scene,
		"user_id":                 request.Billing.UserID,
		"team_id":                 request.Billing.TeamID,
		"project_id":              request.Billing.ProjectID,
		"session_id":              request.Billing.SessionID,
		"run_id":                  request.Billing.RunID,
		"power_id":                request.PowerID,
		"power_name":              request.PowerName,
		"power_target_id":         request.PowerTargetID,
		"rule_source":             rule.Source,
		"billing_benefit_id":      rule.BillingBenefitID,
		"user_identity_id":        rule.UserIdentityID,
		"identity_id":             rule.IdentityID,
		"identity_name":           rule.IdentityName,
		"level_id":                rule.LevelID,
		"level_name":              rule.LevelName,
		"level":                   rule.Level,
		"scope":                   rule.Scope,
		"point_config_id":         rule.PointConfigID,
		"point_name":              rule.PointName,
		"point_symbol":            rule.PointSymbol,
		"point_symbol_position":   rule.PointSymbolPosition,
		"point_exchange_rate":     rule.PointExchangeRate,
		"sale_ratio":              rule.SaleRatio,
		"sale_ratio_basis_points": rule.SaleRatioBasisPoints,
		"currency":                quote.Currency,
		"reserved_cost_micros":    quote.CostMicros,
		"reserved_points":         reservedPoints,
		"point_hold_id":           0,
		"success_cost_record_id":  0,
		"success_cost_micros":     0,
		"total_cost_micros":       0,
		"sale_micros":             0,
		"profit_micros":           0,
		"requested_points":        0,
		"settled_points":          0,
		"uncollected_points":      0,
		"config_breach":           2,
		"status":                  status,
		"finish_status":           "",
		"finish_error":            "",
		"rule_snapshot":           rule.Snapshot,
		"error":                   strings.TrimSpace(errorText),
		"created_at":              now,
		"updated_at":              now,
	}
	id, err := insertPowerCharge(ctx, record)
	if err != nil {
		return billingmodel.PowerCharge{}, err
	}
	charge := billingmodel.NewPowerChargeModel().Find(ctx, map[string]any{"id": id})
	if charge == nil {
		return billingmodel.PowerCharge{}, fmt.Errorf("能力计费单保存失败")
	}
	return *charge, nil
}

func summarizeChargeCosts(costs []*energonmodel.CostRecord, expectedCurrency string) (int64, int64, *energonmodel.CostRecord, error) {
	total := int64(0)
	successCost := int64(0)
	var success *energonmodel.CostRecord
	var pricingErr error
	expectedCurrency = normalizedChargeCurrency(expectedCurrency)
	for _, cost := range costs {
		if cost == nil {
			continue
		}
		if cost.PricingStatus != energonmodel.CostPricingPriced {
			message := strings.TrimSpace(cost.Error)
			if message == "" {
				message = cost.PricingStatus
			}
			if pricingErr == nil {
				pricingErr = fmt.Errorf("供应商成本记录 %d 无法计价：%s", cost.ID, message)
			}
			continue
		}
		if currency := normalizedChargeCurrency(cost.Currency); currency != expectedCurrency {
			if pricingErr == nil {
				pricingErr = fmt.Errorf("供应商成本记录 %d 的结算币种 %s 与预授权币种 %s 不一致", cost.ID, currency, expectedCurrency)
			}
			continue
		}
		if cost.CostMicros > 0 && total > math.MaxInt64-cost.CostMicros {
			return 0, 0, nil, fmt.Errorf("供应商总成本超出范围")
		}
		total += cost.CostMicros
		if cost.CallStatus == "success" {
			success = cost
			successCost = cost.CostMicros
		}
	}
	if pricingErr != nil {
		return total, successCost, success, pricingErr
	}
	return total, successCost, success, nil
}

func normalizedChargeCurrency(value string) string {
	value = strings.ToUpper(strings.TrimSpace(value))
	if value == "" {
		return energonmodel.ServicePriceCurrencyCNY
	}
	return value
}

func releaseFailedPowerCharge(ctx context.Context, charge billingmodel.PowerCharge, totalCost int64, request FinishPowerChargeRequest) error {
	if charge.PointHoldID > 0 {
		if err := releaseChargePointHold(ctx, charge, firstChargeError(request.Error, "能力调用未成功，释放预占积分")); err != nil {
			return recordChargeSettlementError(ctx, charge, err)
		}
	}
	status := billingmodel.ChargeStatusFailed
	if request.Canceled {
		status = billingmodel.ChargeStatusReleased
	}
	return completePowerChargeSettlement(ctx, charge, map[string]any{
		"total_cost_micros": totalCost,
		"profit_micros":     -totalCost,
		"status":            status,
		"error":             firstChargeError(request.Error, "能力调用未成功"),
		"updated_at":        time.Now(),
	})
}

func failChargePricing(ctx context.Context, charge billingmodel.PowerCharge, totalCost int64, pricingErr error) error {
	if charge.PointHoldID > 0 {
		if err := releaseChargePointHold(ctx, charge, "能力调用计价失败，释放预占积分"); err != nil {
			return recordChargeSettlementError(ctx, charge, fmt.Errorf("计价失败且释放积分预占失败: %w", err))
		}
	}
	if err := completePowerChargeSettlement(ctx, charge, map[string]any{
		"total_cost_micros": totalCost,
		"profit_micros":     -totalCost,
		"status":            billingmodel.ChargeStatusPricingError,
		"error":             pricingErr.Error(),
		"updated_at":        time.Now(),
	}); err != nil {
		return err
	}
	return pricingErr
}

func failChargeSettlement(ctx context.Context, charge billingmodel.PowerCharge, totalCost int64, successCost int64, successRecordID uint64, saleMicros int64, requestedPoints int, settleErr error) error {
	billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
		"id":     charge.ID,
		"status": billingmodel.ChargeStatusSettling,
	}, map[string]any{
		"success_cost_record_id": successRecordID,
		"success_cost_micros":    successCost,
		"total_cost_micros":      totalCost,
		"sale_micros":            saleMicros,
		"profit_micros":          saleMicros - totalCost,
		"requested_points":       requestedPoints,
		"uncollected_points":     requestedPoints,
		"error":                  settleErr.Error(),
		"updated_at":             time.Now(),
	}, false)
	return settleErr
}

func recordChargeSettlementError(ctx context.Context, charge billingmodel.PowerCharge, settleErr error) error {
	if settleErr == nil {
		return nil
	}
	billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{
		"id":     charge.ID,
		"status": billingmodel.ChargeStatusSettling,
	}, map[string]any{
		"error":      settleErr.Error(),
		"updated_at": time.Now(),
	}, false)
	return settleErr
}

func releaseChargePointHold(ctx context.Context, charge billingmodel.PowerCharge, remark string) error {
	hold, err := userservice.ReleasePoints(ctx, userservice.PointReleaseRequest{
		BusinessKey: charge.BusinessKey,
		Remark:      remark,
	})
	if err != nil {
		return err
	}
	if hold.Status == usermodel.PointHoldStatusSettled {
		return fmt.Errorf("积分预占已经结算，不能按失败释放")
	}
	if hold.Status != usermodel.PointHoldStatusReleased && hold.Status != usermodel.PointHoldStatusExpired {
		return fmt.Errorf("积分预占释放后状态异常: %d", hold.Status)
	}
	return nil
}

func chargePointAmount(costMicros int64, saleRatioBasisPoints int64, exchangeRate int) (int, error) {
	if costMicros <= 0 || saleRatioBasisPoints <= 0 || exchangeRate <= 0 {
		return 0, nil
	}
	numerator := big.NewInt(costMicros)
	numerator.Mul(numerator, big.NewInt(saleRatioBasisPoints))
	numerator.Mul(numerator, big.NewInt(int64(exchangeRate)))
	value := ceilBigRatio(numerator, big.NewInt(10_000_000_000))
	if value.Sign() < 0 || value.Cmp(big.NewInt(maxBillablePointAmount)) > 0 {
		return 0, fmt.Errorf("积分计费结果超出范围")
	}
	return int(value.Int64()), nil
}

func chargeSaleMicros(costMicros int64, saleRatioBasisPoints int64) (int64, error) {
	if costMicros <= 0 || saleRatioBasisPoints <= 0 {
		return 0, nil
	}
	numerator := big.NewInt(costMicros)
	numerator.Mul(numerator, big.NewInt(saleRatioBasisPoints))
	value := ceilBigRatio(numerator, big.NewInt(10_000))
	if !value.IsInt64() {
		return 0, fmt.Errorf("能力售价超出范围")
	}
	return value.Int64(), nil
}

func ceilBigRatio(numerator *big.Int, denominator *big.Int) *big.Int {
	quotient, remainder := new(big.Int), new(big.Int)
	quotient.QuoRem(numerator, denominator, remainder)
	if remainder.Sign() > 0 {
		quotient.Add(quotient, big.NewInt(1))
	}
	return quotient
}

func findPowerChargeByBusinessKey(ctx context.Context, businessKey string) *billingmodel.PowerCharge {
	if strings.TrimSpace(businessKey) == "" {
		return nil
	}
	return billingmodel.NewPowerChargeModel().Find(ctx, map[string]any{"business_key": businessKey})
}

func insertPowerCharge(ctx context.Context, record map[string]any) (id uint64, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			if recoveredErr, ok := recovered.(error); ok {
				err = recoveredErr
				return
			}
			err = fmt.Errorf("%v", recovered)
		}
	}()
	id = util.ToUint64(billingmodel.NewPowerChargeModel().Insert(ctx, record))
	if id == 0 {
		return 0, fmt.Errorf("能力计费单保存失败")
	}
	return id, nil
}

func normalizeChargeBusinessKey(businessKey string, requestID string) (string, error) {
	businessKey = strings.TrimSpace(businessKey)
	if businessKey == "" {
		businessKey = strings.TrimSpace(requestID)
	}
	if businessKey == "" {
		return "", fmt.Errorf("能力计费业务键不能为空")
	}
	if len(businessKey) > 128 {
		return "", fmt.Errorf("能力计费业务键不能超过 128 个字符")
	}
	return businessKey, nil
}

func normalizeChargeScene(scene string) string {
	scene = strings.TrimSpace(scene)
	if scene == "" {
		return "system"
	}
	return scene
}

func chargePointRemark(charge billingmodel.PowerCharge) string {
	name := strings.TrimSpace(charge.PowerName)
	if name == "" {
		name = "能力调用"
	}
	return "能力计费：" + name
}

func firstChargeError(err error, fallback string) string {
	if err != nil && strings.TrimSpace(err.Error()) != "" {
		return strings.TrimSpace(err.Error())
	}
	return fallback
}

func isTerminalChargeStatus(status string) bool {
	switch strings.TrimSpace(status) {
	case billingmodel.ChargeStatusSettled,
		billingmodel.ChargeStatusFree,
		billingmodel.ChargeStatusReleased,
		billingmodel.ChargeStatusPartial,
		billingmodel.ChargeStatusPricingError,
		billingmodel.ChargeStatusFailed:
		return true
	default:
		return false
	}
}
