package log

import (
	"context"
	"time"

	botmodel "my/package/bot/model/energon"
)

type Service struct{}

func NewService() Service {
	return Service{}
}

func (Service) Record(ctx context.Context, item botmodel.Log) (record botmodel.Log) {
	if item.CreatedAt.IsZero() {
		item.CreatedAt = time.Now()
	}
	record = item
	defer func() {
		_ = recover()
	}()
	id := botmodel.NewLogModel().Insert(ctx, map[string]any{
		"request_id":      item.RequestID,
		"mode":            item.Mode,
		"protocol":        item.Protocol,
		"power_id":        item.PowerID,
		"power_key":       item.PowerKey,
		"power_name":      item.PowerName,
		"power_target_id": item.PowerTargetID,
		"power_params":    item.PowerParams,
		"provider_id":     item.ProviderID,
		"provider_name":   item.ProviderName,
		"account_id":      item.AccountID,
		"account_name":    item.AccountName,
		"service_id":      item.ServiceID,
		"service_name":    item.ServiceName,
		"service_api":     item.ServiceApi,
		"status":          item.Status,
		"latency":         item.Latency,
		"result":          item.Result,
		"created_at":      item.CreatedAt,
	})
	record.ID = uint64(id)
	return record
}
