package maintenance

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
	energonlog "github.com/dever-package/bot/service/energon/log"
)

const energonLogAttributionBatchSize = 500

// MigrateEnergonLogAttribution copies only exact CostRecord-to-Log ownership
// links. Legacy logs without a durable link remain unattributed.
func MigrateEnergonLogAttribution(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移调用日志用户归属失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	costModel := energonmodel.NewCostRecordModel()
	logModel := energonmodel.NewLogModel()
	for page := 1; ; page++ {
		rows := costModel.Select(ctx, map[string]any{
			"log_id": map[string]any{">": uint64(0)},
		}, map[string]any{
			"field":    "main.id,main.log_id,main.user_id,main.team_id,main.project_id,main.scene",
			"order":    "main.id asc",
			"page":     page,
			"pageSize": energonLogAttributionBatchSize,
		})
		for _, row := range rows {
			logID, values, ok := energonlog.AttributionValuesFromCostRecord(row)
			if !ok {
				continue
			}
			logModel.Update(ctx, map[string]any{
				"id":    logID,
				"scene": "",
			}, values)
		}
		if len(rows) < energonLogAttributionBatchSize {
			break
		}
	}
	return nil
}
