package maintenance

import (
	"context"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

const (
	storyboardGridPowerKey         = "storyboard-grid"
	storyboardGridManualSourceRule = int16(2)
)

type storyboardGridParamSpec struct {
	Key      string
	Show     int16
	Required int16
	Sort     int
}

type storyboardGridTargetSpec struct {
	EndpointAPI string
	Sort        int
}

var storyboardGridParamSpecs = []storyboardGridParamSpec{
	{Key: "prompt", Show: energonmodel.PowerParamShowAlways, Required: 1, Sort: energonmodel.ParamSortPrompt},
	{Key: "image", Show: energonmodel.PowerParamShowBySource, Required: 2, Sort: energonmodel.ParamSortImage},
	{Key: "images", Show: energonmodel.PowerParamShowBySource, Required: 2, Sort: energonmodel.ParamSortImages},
	{Key: "resolution", Show: energonmodel.PowerParamShowAlways, Required: 1, Sort: energonmodel.ParamSortResolution},
	{Key: "aspectRatio", Show: energonmodel.PowerParamShowBySource, Required: 1, Sort: energonmodel.ParamSortAspectRatio},
}

var storyboardGridTargetSpecs = []storyboardGridTargetSpec{
	{EndpointAPI: energonmodel.ServiceEndpointDoubaoSeedream5API, Sort: 1},
	{EndpointAPI: energonmodel.ServiceEndpointDoubaoSeedream45API, Sort: 2},
	{EndpointAPI: energonmodel.ServiceEndpointGPTImage2API, Sort: 3},
}

// EnsureEnergonStoryboardGridPower backfills the built-in seed for databases
// created before the storyboard-grid capability was introduced.
func EnsureEnergonStoryboardGridPower(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置宫格图片能力失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	powerID, err := ensureStoryboardGridPower(ctx)
	if err != nil {
		return err
	}
	if err := ensureStoryboardGridParams(ctx, powerID); err != nil {
		return err
	}
	return ensureStoryboardGridTargets(ctx, powerID)
}

func ensureStoryboardGridPower(ctx context.Context) (uint64, error) {
	model := energonmodel.NewPowerModel()
	if row := model.Find(ctx, map[string]any{"key": storyboardGridPowerKey}); row != nil {
		if energonmodel.NormalizeOutputType(row.OutputType) != energonmodel.OutputTypeStoryboardGrid ||
			row.SourceRule != storyboardGridManualSourceRule {
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
				"output_type": energonmodel.OutputTypeStoryboardGrid,
				"source_rule": storyboardGridManualSourceRule,
			})
		}
		return row.ID, nil
	}

	id := uint64(model.Insert(ctx, map[string]any{
		"cate_id":     uint64(1),
		"key":         storyboardGridPowerKey,
		"name":        "宫格图片",
		"icon":        "image",
		"output_type": energonmodel.OutputTypeStoryboardGrid,
		"kind":        "image",
		"description": "描述希望生成的一组连续画面、故事分镜或广告画面。",
		"prompt":      "",
		"source_rule": storyboardGridManualSourceRule,
		"status":      int16(1),
		"created_at":  time.Now(),
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建内置宫格图片能力失败")
	}
	return id, nil
}

func ensureStoryboardGridParams(ctx context.Context, powerID uint64) error {
	paramModel := energonmodel.NewParamModel()
	for _, spec := range storyboardGridParamSpecs {
		param := paramModel.Find(ctx, map[string]any{"key": spec.Key})
		if param == nil {
			return fmt.Errorf("宫格图片参数 %s 尚未初始化", spec.Key)
		}
		ensurePowerParam(ctx, powerID, param.ID, spec.Show, spec.Required, spec.Sort)
	}
	return nil
}

func ensureStoryboardGridTargets(ctx context.Context, powerID uint64) error {
	endpointModel := energonmodel.NewServiceEndpointModel()
	for _, spec := range storyboardGridTargetSpecs {
		endpoint := endpointModel.Find(ctx, map[string]any{"api": spec.EndpointAPI})
		if endpoint == nil || endpoint.ServiceID == 0 {
			return fmt.Errorf("宫格图片来源接口 %s 尚未初始化", spec.EndpointAPI)
		}
		ensureStoryboardGridTarget(ctx, powerID, endpoint.ServiceID, spec.Sort)
	}
	return nil
}

func ensureStoryboardGridTarget(ctx context.Context, powerID uint64, serviceID uint64, sort int) {
	model := energonmodel.NewPowerTargetModel()
	filter := map[string]any{"power_id": powerID, "service_id": serviceID}
	if row := model.Find(ctx, filter); row != nil {
		if row.Sort != sort {
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"sort": sort})
		}
		return
	}
	model.Insert(ctx, map[string]any{
		"power_id":   powerID,
		"service_id": serviceID,
		"sort":       sort,
		"status":     int16(1),
		"created_at": time.Now(),
	})
}
