package maintenance

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
)

type builtinVideoDurationSpec struct {
	endpointAPI string
	mapping     string
}

// EnsureEnergonVideoDurationParams upgrades existing databases because model
// seeds only initialize new service-parameter rows.
func EnsureEnergonVideoDurationParams(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置视频时长配置失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	duration := energonmodel.NewParamModel().Find(ctx, map[string]any{
		"key": energonmodel.ParamDurationKey,
	})
	if duration == nil {
		return fmt.Errorf("内置视频时长参数尚未初始化")
	}

	specs := []builtinVideoDurationSpec{
		{
			endpointAPI: doubaoVideoEndpointAPI,
			mapping:     energonmodel.DoubaoVideoDurationMapping,
		},
		{
			endpointAPI: doubaoVideo2EndpointAPI,
			mapping:     energonmodel.DoubaoVideoFastDurationMapping,
		},
	}
	for _, spec := range specs {
		updatedServices := map[uint64]bool{}
		for _, endpoint := range energonmodel.NewServiceEndpointModel().Select(ctx, map[string]any{
			"api": spec.endpointAPI,
		}) {
			if endpoint.ServiceID == 0 || updatedServices[endpoint.ServiceID] {
				continue
			}
			updatedServices[endpoint.ServiceID] = true
			upsertBuiltinServiceParam(ctx, endpoint.ServiceID, builtinServiceParamSpec{
				ParamID:   duration.ID,
				ParamRule: energonmodel.ServiceParamRuleOption,
				Key:       energonmodel.ParamDurationKey,
				Name:      "时长",
				Mapping:   spec.mapping,
				Sort:      energonmodel.ParamSortDuration,
			})
		}
	}
	return nil
}
