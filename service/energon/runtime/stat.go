package runtime

import (
	"context"
	"time"

	botmodel "my/package/bot/model/energon"
)

type StatService struct{}

func NewStatService() StatService {
	return StatService{}
}

func (StatService) Average(ctx context.Context, serviceID uint64) (avg int64) {
	if serviceID == 0 {
		return 0
	}
	defer func() {
		if recover() != nil {
			avg = 0
		}
	}()
	row := botmodel.NewServiceRuntimeStatModel().Find(ctx, map[string]any{"service_id": serviceID})
	if row == nil {
		return 0
	}
	return row.Avg
}

func (StatService) Record(ctx context.Context, serviceID uint64, duration time.Duration) {
	if serviceID == 0 || duration <= 0 {
		return
	}
	durationMS := duration.Milliseconds()
	if durationMS <= 0 {
		durationMS = 1
	}

	defer func() {
		_ = recover()
	}()

	model := botmodel.NewServiceRuntimeStatModel()
	row := model.Find(ctx, map[string]any{"service_id": serviceID})
	if row == nil || row.ID == 0 {
		model.Insert(ctx, map[string]any{
			"service_id": serviceID,
			"avg":        durationMS,
			"last":       durationMS,
			"created_at": time.Now(),
		})
		return
	}

	model.Update(ctx, map[string]any{"service_id": serviceID}, map[string]any{
		"avg":  mergeAverage(row.Avg, durationMS),
		"last": durationMS,
	})
}

func mergeAverage(current int64, next int64) int64 {
	if next <= 0 {
		return current
	}
	if current <= 0 {
		return next
	}
	return (current + next) / 2
}
