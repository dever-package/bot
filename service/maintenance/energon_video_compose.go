package maintenance

import (
	"context"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

const (
	ffmpegProcessorKey = "ffmpeg"
	ffmpegComposePath  = "local://ffmpeg/compose"
	ffmpegComposeAPI   = "compose"
	videoComposeKey    = "video-compose"
)

type composeParamSpec struct {
	Key      string
	Name     string
	Required int16
	Sort     int
}

var composeParamSpecs = []composeParamSpec{
	{Key: "videos", Name: "视频片段", Required: 2, Sort: 10},
	{Key: "audio", Name: "背景音频", Required: 2, Sort: 20},
	{Key: "subtitles", Name: "字幕文件", Required: 2, Sort: 30},
	{Key: "resolution", Name: "输出分辨率", Required: 2, Sort: 40},
	{Key: "fps", Name: "输出帧率", Required: 2, Sort: 50},
}

// EnsureEnergonVideoComposePower upgrades existing databases using stable
// business keys. Built-in seed IDs may already belong to user-created records.
func EnsureEnergonVideoComposePower(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置视频合成能力失败: %v", recovered)
		}
	}()

	providerID, err := ensureFFmpegProvider(ctx)
	if err != nil {
		return err
	}
	serviceID, err := ensureFFmpegComposeService(ctx, providerID)
	if err != nil {
		return err
	}
	params, err := composeParams(ctx)
	if err != nil {
		return err
	}
	ensureFFmpegServiceParams(ctx, serviceID, params)
	ensureFFmpegComposeEndpoint(ctx, serviceID)

	powerID, err := ensureVideoComposePower(ctx)
	if err != nil {
		return err
	}
	ensureVideoComposeTarget(ctx, powerID, serviceID)
	ensureVideoComposeParams(ctx, powerID, params)
	return nil
}

func ensureFFmpegProvider(ctx context.Context) (uint64, error) {
	model := energonmodel.NewProviderModel()
	if row := model.Find(ctx, map[string]any{"processor": ffmpegProcessorKey}); row != nil {
		return row.ID, nil
	}
	id := uint64(model.Insert(ctx, map[string]any{
		"cate_id":    1,
		"name":       "FFmpeg 本地合成",
		"protocol":   "local",
		"processor":  ffmpegProcessorKey,
		"host":       "",
		"status":     1,
		"created_at": time.Now(),
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建 FFmpeg 本地来源失败")
	}
	return id, nil
}

func ensureFFmpegComposeService(ctx context.Context, providerID uint64) (uint64, error) {
	model := energonmodel.NewServiceModel()
	filter := map[string]any{"provider_id": providerID, "path": ffmpegComposePath}
	if row := model.Find(ctx, filter); row != nil {
		return row.ID, nil
	}
	id := uint64(model.Insert(ctx, map[string]any{
		"provider_id": providerID,
		"name":        "FFmpeg 视频合成",
		"type":        "video",
		"path":        ffmpegComposePath,
		"sort":        10,
		"status":      1,
		"created_at":  time.Now(),
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建 FFmpeg 视频合成服务失败")
	}
	return id, nil
}

func composeParams(ctx context.Context) (map[string]energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	params := make(map[string]energonmodel.Param, len(composeParamSpecs))
	for _, spec := range composeParamSpecs {
		row := model.Find(ctx, map[string]any{"key": spec.Key})
		if row == nil {
			return nil, fmt.Errorf("视频合成参数 %s 尚未初始化", spec.Key)
		}
		params[spec.Key] = *row
	}
	return params, nil
}

func ensureFFmpegServiceParams(
	ctx context.Context,
	serviceID uint64,
	params map[string]energonmodel.Param,
) {
	model := energonmodel.NewServiceParamModel()
	for _, spec := range composeParamSpecs {
		param := params[spec.Key]
		filter := map[string]any{
			"service_id": serviceID,
			"param_id":   param.ID,
			"key":        spec.Key,
		}
		if model.Find(ctx, filter) != nil {
			continue
		}
		model.Insert(ctx, map[string]any{
			"service_id":       serviceID,
			"param_id":         param.ID,
			"param_rule":       1,
			"key":              spec.Key,
			"name":             spec.Name,
			"mapping":          "",
			"fixed_value_type": "string",
			"status":           1,
			"sort":             spec.Sort,
			"created_at":       time.Now(),
		})
	}
}

func ensureFFmpegComposeEndpoint(ctx context.Context, serviceID uint64) {
	model := energonmodel.NewServiceEndpointModel()
	filter := map[string]any{"service_id": serviceID, "api": ffmpegComposeAPI}
	values := map[string]any{
		"param_mode": "all",
		"param_ids":  "[]",
		"status":     1,
		"sort":       1,
	}
	if row := model.Find(ctx, filter); row != nil {
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		return
	}
	values["service_id"] = serviceID
	values["api"] = ffmpegComposeAPI
	values["created_at"] = time.Now()
	model.Insert(ctx, values)
}

func ensureVideoComposePower(ctx context.Context) (uint64, error) {
	model := energonmodel.NewPowerModel()
	if row := model.Find(ctx, map[string]any{"key": videoComposeKey}); row != nil {
		if energonmodel.NormalizeOutputType(row.OutputType) != energonmodel.OutputTypeVideoCompose {
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
				"output_type": energonmodel.OutputTypeVideoCompose,
			})
		}
		return row.ID, nil
	}
	id := uint64(model.Insert(ctx, map[string]any{
		"cate_id":     1,
		"key":         videoComposeKey,
		"name":        "视频合成",
		"icon":        "clapperboard",
		"output_type": energonmodel.OutputTypeVideoCompose,
		"kind":        "video",
		"prompt":      "",
		"source_rule": 1,
		"status":      1,
		"created_at":  time.Now(),
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建视频合成能力失败")
	}
	return id, nil
}

func ensureVideoComposeTarget(ctx context.Context, powerID uint64, serviceID uint64) {
	model := energonmodel.NewPowerTargetModel()
	filter := map[string]any{"power_id": powerID, "service_id": serviceID}
	if model.Find(ctx, filter) != nil {
		return
	}
	model.Insert(ctx, map[string]any{
		"power_id":   powerID,
		"service_id": serviceID,
		"sort":       1,
		"status":     1,
		"created_at": time.Now(),
	})
}

func ensureVideoComposeParams(
	ctx context.Context,
	powerID uint64,
	params map[string]energonmodel.Param,
) {
	model := energonmodel.NewPowerParamModel()
	for index, spec := range composeParamSpecs {
		param := params[spec.Key]
		filter := map[string]any{"power_id": powerID, "param_id": param.ID}
		values := map[string]any{
			"show":   1,
			"status": spec.Required,
			"sort":   index + 1,
		}
		if row := model.Find(ctx, filter); row != nil {
			model.Update(ctx, map[string]any{"id": row.ID}, values)
			continue
		}
		values["power_id"] = powerID
		values["param_id"] = param.ID
		values["created_at"] = time.Now()
		model.Insert(ctx, values)
	}
}
