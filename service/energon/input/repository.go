package input

import (
	"context"

	botmodel "my/package/bot/model/energon"
)

type Repository interface {
	ParamMap(ctx context.Context) map[uint64]botmodel.Param
	PowerParamsByPower(ctx context.Context, powerID uint64) []botmodel.PowerParam
	ServiceParamsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceParam
	ServiceEndpointsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceEndpoint
	ParamOptionsByParam(ctx context.Context, paramID uint64) []botmodel.ParamOption
}

type Target struct {
	PowerID   uint64
	ServiceID uint64
}
