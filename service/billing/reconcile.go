package billing

import (
	"context"
	"errors"
	"fmt"
	"time"

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
)

const (
	defaultChargeReconcileLimit = 200
	maxChargeReconcileLimit     = 1000
	preparingChargeStaleAfter   = 5 * time.Minute
	runningChargeStaleAfter     = 30 * time.Minute
	settlingChargeRetryAfter    = time.Minute
)

type ChargeReconcileStats struct {
	Scanned   int `json:"scanned"`
	Recovered int `json:"recovered"`
	Skipped   int `json:"skipped"`
	Failed    int `json:"failed"`
}

func ReconcilePowerCharges(ctx context.Context, now time.Time, limit int) (ChargeReconcileStats, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	if now.IsZero() {
		now = time.Now()
	}
	limit = normalizeChargeReconcileLimit(limit)
	rows := billingmodel.NewPowerChargeModel().Select(ctx, map[string]any{
		"status": []string{
			billingmodel.ChargeStatusPreparing,
			billingmodel.ChargeStatusRunning,
			billingmodel.ChargeStatusSettling,
		},
	}, map[string]any{"order": "updated_at asc,id asc", "limit": limit})
	stats := ChargeReconcileStats{Scanned: len(rows)}
	var resultErr error
	for _, charge := range rows {
		if charge == nil || !chargeNeedsReconcile(*charge, now) {
			stats.Skipped++
			continue
		}
		request := reconcileFinishRequest(ctx, *charge)
		if err := FinishPowerCharge(ctx, request); err != nil {
			stats.Failed++
			resultErr = errors.Join(resultErr, fmt.Errorf("计费单 %d 恢复失败: %w", charge.ID, err))
			continue
		}
		stats.Recovered++
	}
	return stats, resultErr
}

func chargeNeedsReconcile(charge billingmodel.PowerCharge, now time.Time) bool {
	updatedAt := charge.UpdatedAt
	if updatedAt.IsZero() {
		updatedAt = charge.CreatedAt
	}
	switch charge.Status {
	case billingmodel.ChargeStatusPreparing:
		return !updatedAt.After(now.Add(-preparingChargeStaleAfter))
	case billingmodel.ChargeStatusRunning:
		return !updatedAt.After(now.Add(-runningChargeStaleAfter))
	case billingmodel.ChargeStatusSettling:
		if charge.FinalizingAt != nil && !charge.FinalizingAt.IsZero() {
			updatedAt = *charge.FinalizingAt
		}
		return !updatedAt.After(now.Add(-settlingChargeRetryAfter))
	default:
		return false
	}
}

func reconcileFinishRequest(ctx context.Context, charge billingmodel.PowerCharge) FinishPowerChargeRequest {
	if charge.Status == billingmodel.ChargeStatusSettling {
		return finishRequestFromCharge(charge)
	}
	success := false
	if charge.Status == billingmodel.ChargeStatusRunning {
		success = energonmodel.NewCostRecordModel().Count(ctx, map[string]any{
			"power_charge_id": charge.ID,
			"call_status":     "success",
		}) > 0
	}
	message := "能力调用超时未完成，恢复任务释放预占积分"
	if success {
		message = ""
	}
	return FinishPowerChargeRequest{
		ChargeID: charge.ID,
		RunID:    charge.RunID,
		Success:  success,
		Error:    errorFromText(message),
	}
}

func errorFromText(message string) error {
	if message == "" {
		return nil
	}
	return fmt.Errorf("%s", message)
}

func normalizeChargeReconcileLimit(limit int) int {
	if limit <= 0 {
		return defaultChargeReconcileLimit
	}
	if limit > maxChargeReconcileLimit {
		return maxChargeReconcileLimit
	}
	return limit
}
