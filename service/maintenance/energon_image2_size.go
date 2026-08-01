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

	return ensureEnergonImageSizeMappings(ctx, []imageSizeMappingSpec{{
		endpointAPI: energonmodel.ServiceEndpointGPTImage2API,
		mapping:     energonmodel.GPTImage2SizeMapping,
	}})
}

// EnsureEnergonSeedreamSizeMapping keeps existing Seedream services aligned
// with the built-in automatic aspect-ratio mappings.
func EnsureEnergonSeedreamSizeMapping(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级 Seedream 尺寸配置失败: %v", recovered)
		}
	}()

	return ensureEnergonImageSizeMappings(ctx, []imageSizeMappingSpec{
		{
			endpointAPI: energonmodel.ServiceEndpointDoubaoSeedream45API,
			mapping:     energonmodel.DoubaoSeedreamSizeMapping,
		},
		{
			endpointAPI: energonmodel.ServiceEndpointDoubaoSeedream5API,
			mapping:     energonmodel.DoubaoSeedreamSizeMapping,
		},
	})
}

type imageSizeMappingSpec struct {
	endpointAPI string
	mapping     string
}

func ensureEnergonImageSizeMappings(ctx context.Context, specs []imageSizeMappingSpec) error {
	ctx = normalizeContext(ctx)
	resolution := energonmodel.NewParamModel().Find(ctx, map[string]any{"key": "resolution"})
	if resolution == nil {
		return fmt.Errorf("内置分辨率参数尚未初始化")
	}
	aspectRatio := energonmodel.NewParamModel().Find(ctx, map[string]any{"key": "aspectRatio"})
	if aspectRatio == nil {
		return fmt.Errorf("内置比例参数尚未初始化")
	}
	if err := ensureAutomaticAspectRatioOption(ctx, aspectRatio.ID); err != nil {
		return err
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
				ParamID:   resolution.ID,
				ParamRule: energonmodel.ServiceParamRuleCombo,
				Key:       "size",
				Mapping:   spec.mapping,
				Sort:      energonmodel.ParamSortResolution,
			})
		}
	}
	return nil
}

func ensureAutomaticAspectRatioOption(ctx context.Context, aspectRatioParamID uint64) error {
	model := energonmodel.NewParamOptionModel()
	filter := map[string]any{
		"param_id": aspectRatioParamID,
		"value":    "auto",
	}
	if existing := model.Find(ctx, filter); existing != nil {
		if existing.ID != energonmodel.ParamOptionAspectRatioAutoID {
			return fmt.Errorf("内置自动比例选项 ID 异常: 当前为 %d，期望为 %d", existing.ID, energonmodel.ParamOptionAspectRatioAutoID)
		}
		model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
			"name": "自动",
			"sort": 0,
		})
		return nil
	}

	if occupied := model.Find(ctx, map[string]any{"id": energonmodel.ParamOptionAspectRatioAutoID}); occupied != nil {
		return fmt.Errorf("内置自动比例选项 ID %d 已被“%s”占用", occupied.ID, occupied.Name)
	}
	if model.Insert(ctx, map[string]any{
		"id":       energonmodel.ParamOptionAspectRatioAutoID,
		"param_id": aspectRatioParamID,
		"name":     "自动",
		"value":    "auto",
		"sort":     0,
	}) == 0 {
		return fmt.Errorf("创建内置自动比例选项失败")
	}
	return nil
}
