package energon

import (
	"context"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
)

func PowerTargetIDByRequestID(ctx context.Context, requestID string) uint64 {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return 0
	}
	row := energonmodel.NewLogModel().Find(ctx, map[string]any{
		"request_id": requestID,
		"status":     StatusSuccess,
	})
	if row == nil {
		return 0
	}
	return row.PowerTargetID
}
