package maintenance

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
)

// EnsureEnergonImage2SizeMapping upgrades existing databases because model
// seeds only initialize new rows. The endpoint API is the stable business key.
func EnsureEnergonImage2SizeMapping(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级 image2 尺寸配置失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	resolution := energonmodel.NewParamModel().Find(ctx, map[string]any{"key": "resolution"})
	if resolution == nil {
		return fmt.Errorf("内置分辨率参数尚未初始化")
	}

	updatedServices := map[uint64]bool{}
	for _, endpoint := range energonmodel.NewServiceEndpointModel().Select(ctx, map[string]any{
		"api": energonmodel.ServiceEndpointGPTImage2API,
	}) {
		if endpoint.ServiceID == 0 || updatedServices[endpoint.ServiceID] {
			continue
		}
		updatedServices[endpoint.ServiceID] = true
		upsertBuiltinServiceParam(ctx, endpoint.ServiceID, builtinServiceParamSpec{
			ParamID:   resolution.ID,
			ParamRule: energonmodel.ServiceParamRuleCombo,
			Key:       "size",
			Mapping:   energonmodel.GPTImage2SizeMapping,
			Sort:      energonmodel.ParamSortResolution,
		})
	}
	return nil
}
