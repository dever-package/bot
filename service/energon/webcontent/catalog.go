package webcontent

import (
	"context"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

type Catalog struct {
	Param energonmodel.Param
	Power energonmodel.Power
}

func EnsureCatalog(ctx context.Context) (Catalog, error) {
	param, err := ensureInputParam(ctx)
	if err != nil {
		return Catalog{}, err
	}
	power, err := ensurePower(ctx)
	if err != nil {
		return Catalog{}, err
	}
	if err := ensurePowerParam(ctx, power.ID, param.ID); err != nil {
		return Catalog{}, err
	}
	return Catalog{Param: param, Power: power}, nil
}

func ensureInputParam(ctx context.Context) (energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	values := map[string]any{
		"name":           InputParamName,
		"type":           "textarea",
		"usage":          1,
		"value_type":     "string",
		"upload_rule_id": 0,
		"max_files":      0,
		"default_value":  "",
		"status":         1,
		"sort":           10,
	}
	row := model.Find(ctx, map[string]any{"key": InputParamKey})
	if row == nil {
		row = model.Find(ctx, map[string]any{"key": LegacyDouyinInputParamKey})
	}
	if row != nil {
		values["key"] = InputParamKey
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		updated := model.Find(ctx, map[string]any{"id": row.ID})
		if updated != nil && updated.Key == InputParamKey {
			return *updated, nil
		}
	}
	values["key"] = InputParamKey
	values["cate_id"] = 1
	values["created_at"] = time.Now()
	id := uint64(model.Insert(ctx, values))
	if id == 0 {
		return energonmodel.Param{}, fmt.Errorf("创建内容采集参数失败")
	}
	row = model.Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Param{}, fmt.Errorf("读取内容采集参数失败")
	}
	return *row, nil
}

func ensurePower(ctx context.Context) (energonmodel.Power, error) {
	model := energonmodel.NewPowerModel()
	values := map[string]any{
		"name":        PowerName,
		"icon":        PowerIcon,
		"output_type": energonmodel.OutputTypeGeneral,
		"kind":        PowerKind,
		"prompt":      "",
		"source_rule": 1,
		"status":      1,
	}
	row := model.Find(ctx, map[string]any{"key": PowerKey})
	if row == nil {
		for _, legacyKey := range LegacyPowerKeys() {
			row = model.Find(ctx, map[string]any{"key": legacyKey})
			if row != nil {
				break
			}
		}
	}
	if row != nil {
		values["key"] = PowerKey
		model.Update(ctx, map[string]any{"id": row.ID}, values)
		updated := model.Find(ctx, map[string]any{"id": row.ID})
		if updated != nil && updated.Key == PowerKey {
			return *updated, nil
		}
		return energonmodel.Power{}, fmt.Errorf("更新内容采集能力失败")
	}
	values["key"] = PowerKey
	values["cate_id"] = 1
	values["created_at"] = time.Now()
	id := uint64(model.Insert(ctx, values))
	if id == 0 {
		return energonmodel.Power{}, fmt.Errorf("创建内容采集能力失败")
	}
	row = model.Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Power{}, fmt.Errorf("读取内容采集能力失败")
	}
	return *row, nil
}

func ensurePowerParam(ctx context.Context, powerID uint64, paramID uint64) error {
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
		return fmt.Errorf("关联内容采集能力参数失败")
	}
	return nil
}
