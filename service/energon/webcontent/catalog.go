package webcontent

import (
	"context"
	"fmt"
	"strings"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

type Catalog struct {
	Param energonmodel.Param
	Power energonmodel.Power
}

func EnsureCatalog(ctx context.Context, spec PlatformSpec) (Catalog, error) {
	param, err := ensureInputParam(ctx, spec)
	if err != nil {
		return Catalog{}, err
	}
	power, err := ensurePower(ctx, spec)
	if err != nil {
		return Catalog{}, err
	}
	if err := ensurePowerParam(ctx, spec, power.ID, param.ID); err != nil {
		return Catalog{}, err
	}
	return Catalog{Param: param, Power: power}, nil
}

func ensureInputParam(ctx context.Context, spec PlatformSpec) (energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	values := map[string]any{
		"name":           spec.InputParamName,
		"type":           "textarea",
		"usage":          1,
		"value_type":     "string",
		"upload_rule_id": 0,
		"max_files":      0,
		"default_value":  "",
		"status":         1,
		"sort":           10,
	}
	if row := model.Find(ctx, map[string]any{"key": spec.InputParamKey}); row != nil {
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		updated := model.Find(ctx, map[string]any{"id": row.ID})
		if updated != nil {
			return *updated, nil
		}
	}
	values["key"] = spec.InputParamKey
	values["cate_id"] = 1
	values["created_at"] = time.Now()
	id := uint64(model.Insert(ctx, values))
	if id == 0 {
		return energonmodel.Param{}, fmt.Errorf("创建%s导入参数失败", spec.Name)
	}
	row := model.Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Param{}, fmt.Errorf("读取%s导入参数失败", spec.Name)
	}
	return *row, nil
}

func ensurePower(ctx context.Context, spec PlatformSpec) (energonmodel.Power, error) {
	model := energonmodel.NewPowerModel()
	values := map[string]any{
		"name":        spec.PowerName,
		"icon":        spec.PowerIcon,
		"output_type": energonmodel.OutputTypeGeneral,
		"kind":        spec.PowerKind,
		"prompt":      "",
		"source_rule": 1,
		"status":      1,
	}
	row := model.Find(ctx, map[string]any{"key": spec.PowerKey})
	if row == nil && strings.TrimSpace(spec.LegacyPowerKey) != "" {
		row = model.Find(ctx, map[string]any{"key": spec.LegacyPowerKey})
	}
	if row != nil {
		values["key"] = spec.PowerKey
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		updated := model.Find(ctx, map[string]any{"id": row.ID})
		if updated != nil && updated.Key == spec.PowerKey {
			return *updated, nil
		}
		return energonmodel.Power{}, fmt.Errorf("更新%s能力失败", spec.Name)
	}
	values["key"] = spec.PowerKey
	values["cate_id"] = 1
	values["created_at"] = time.Now()
	id := uint64(model.Insert(ctx, values))
	if id == 0 {
		return energonmodel.Power{}, fmt.Errorf("创建%s能力失败", spec.Name)
	}
	row = model.Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Power{}, fmt.Errorf("读取%s能力失败", spec.Name)
	}
	return *row, nil
}

func ensurePowerParam(ctx context.Context, spec PlatformSpec, powerID uint64, paramID uint64) error {
	model := energonmodel.NewPowerParamModel()
	filter := map[string]any{"power_id": powerID, "param_id": paramID}
	values := map[string]any{"show": 1, "status": 1, "sort": 10}
	if row := model.Find(ctx, filter); row != nil {
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		return nil
	}
	values["power_id"] = powerID
	values["param_id"] = paramID
	values["created_at"] = time.Now()
	if model.Insert(ctx, values) == 0 {
		return fmt.Errorf("关联%s能力参数失败", spec.Name)
	}
	return nil
}
