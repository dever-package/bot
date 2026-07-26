package maintenance

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

const (
	builtinParamCateCommonID = 1
	imageParamKey            = "image"
	imagesParamKey           = "images"
)

// EnsureEnergonImageParams upgrades databases that already contain the old
// multi-file image parameter. Provider mappings remain the source of truth for
// deciding whether a capability displays the single-image or multi-image field.
func EnsureEnergonImageParams(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置图片参数失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	imageParam, imagesParam, err := ensureBuiltinImageParams(ctx)
	if err != nil {
		return err
	}

	paramSorts := normalizeBuiltinParamSorts(ctx)
	migrateServiceImageParams(ctx, imageParam.ID, imagesParam.ID)
	migrateEndpointImageParams(ctx, imageParam.ID, imagesParam.ID)
	normalizeBuiltinServiceParamSorts(ctx, paramSorts)
	migratePowerImageParams(ctx, imageParam.ID, imagesParam.ID)
	normalizeBuiltinPowerParamSorts(ctx, paramSorts)
	return nil
}

func ensureBuiltinImageParams(ctx context.Context) (*energonmodel.Param, *energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	imageParam := findBuiltinParam(ctx, energonmodel.ParamImageID, imageParamKey)
	if imageParam == nil {
		id := uint64(model.Insert(ctx, newImageParamValues(
			imageParamKey,
			"添加图片",
			"file",
			1,
			energonmodel.ParamSortImage,
			builtinParamCateCommonID,
		)))
		if id == 0 {
			return nil, nil, fmt.Errorf("创建内置单图参数失败")
		}
		imageParam = model.Find(ctx, map[string]any{"id": id})
	} else {
		model.Update(ctx, map[string]any{"id": imageParam.ID}, map[string]any{
			"name":           "添加图片",
			"key":            imageParamKey,
			"type":           "file",
			"usage":          int16(1),
			"value_type":     "string",
			"upload_rule_id": uint64(1),
			"max_files":      1,
			"sort":           energonmodel.ParamSortImage,
		})
	}
	if imageParam == nil {
		return nil, nil, fmt.Errorf("读取内置单图参数失败")
	}

	imagesParam := findBuiltinParam(ctx, energonmodel.ParamImagesID, imagesParamKey)
	if imagesParam == nil {
		id := uint64(model.Insert(ctx, newImageParamValues(
			imagesParamKey,
			"添加多图",
			"files",
			9,
			energonmodel.ParamSortImages,
			imageParam.CateID,
		)))
		if id == 0 {
			return nil, nil, fmt.Errorf("创建内置多图参数失败")
		}
		imagesParam = model.Find(ctx, map[string]any{"id": id})
	} else {
		model.Update(ctx, map[string]any{"id": imagesParam.ID}, map[string]any{
			"name":           "添加多图",
			"key":            imagesParamKey,
			"type":           "files",
			"usage":          int16(1),
			"value_type":     "string",
			"upload_rule_id": uint64(1),
			"max_files":      9,
			"sort":           energonmodel.ParamSortImages,
		})
	}
	if imagesParam == nil {
		return nil, nil, fmt.Errorf("读取内置多图参数失败")
	}

	return imageParam, imagesParam, nil
}

func findBuiltinParam(ctx context.Context, preferredID uint64, key string) *energonmodel.Param {
	model := energonmodel.NewParamModel()
	if row := model.Find(ctx, map[string]any{"id": preferredID}); row != nil && row.Key == key {
		return row
	}
	return model.Find(ctx, map[string]any{"key": key})
}

func newImageParamValues(key string, name string, fieldType string, maxFiles int, sort int, cateID uint64) map[string]any {
	if cateID == 0 {
		cateID = builtinParamCateCommonID
	}
	return map[string]any{
		"name":           name,
		"key":            key,
		"type":           fieldType,
		"usage":          int16(1),
		"value_type":     "string",
		"cate_id":        cateID,
		"upload_rule_id": uint64(1),
		"max_files":      maxFiles,
		"default_value":  "",
		"status":         int16(1),
		"sort":           sort,
		"created_at":     time.Now(),
	}
}

func normalizeBuiltinParamSorts(ctx context.Context) map[uint64]int {
	model := energonmodel.NewParamModel()
	sorts := map[uint64]int{}
	for _, param := range model.Select(ctx, map[string]any{}) {
		sort, ok := energonmodel.BuiltinParamSortByKey(param.Key)
		if !ok {
			continue
		}
		sorts[param.ID] = sort
		if param.Sort != sort {
			model.Update(ctx, map[string]any{"id": param.ID}, map[string]any{"sort": sort})
		}
	}
	return sorts
}

func migrateServiceImageParams(ctx context.Context, imageParamID uint64, imagesParamID uint64) {
	model := energonmodel.NewServiceParamModel()
	for _, relation := range model.Select(ctx, map[string]any{"param_id": imageParamID}) {
		if isSingleImageMapping(relation) {
			if relation.Sort != energonmodel.ParamSortImage {
				model.Update(ctx, map[string]any{"id": relation.ID}, map[string]any{"sort": energonmodel.ParamSortImage})
			}
			continue
		}
		moveServiceParam(ctx, relation, imagesParamID, energonmodel.ParamSortImages)
	}
}

func isSingleImageMapping(relation *energonmodel.ServiceParam) bool {
	return relation.ParamRule == energonmodel.ServiceParamRuleAttachment &&
		strings.Join(strings.Fields(relation.Mapping), "") == "[1]"
}

func moveServiceParam(ctx context.Context, relation *energonmodel.ServiceParam, paramID uint64, sort int) {
	model := energonmodel.NewServiceParamModel()
	filter := map[string]any{
		"service_id": relation.ServiceID,
		"param_id":   paramID,
		"key":        relation.Key,
	}
	if existing := model.Find(ctx, filter); existing != nil && existing.ID != relation.ID {
		model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{"sort": sort})
		model.Delete(ctx, map[string]any{"id": relation.ID})
		return
	}
	model.Update(ctx, map[string]any{"id": relation.ID}, map[string]any{
		"param_id": paramID,
		"sort":     sort,
	})
}

func migrateEndpointImageParams(ctx context.Context, imageParamID uint64, imagesParamID uint64) {
	serviceParams := energonmodel.NewServiceParamModel()
	supports := map[uint64]imageParamSupport{}
	for _, relation := range serviceParams.Select(ctx, map[string]any{"status": 1}) {
		support := supports[relation.ServiceID]
		switch relation.ParamID {
		case imageParamID:
			support.single = true
		case imagesParamID:
			support.multi = true
		}
		supports[relation.ServiceID] = support
	}

	endpointModel := energonmodel.NewServiceEndpointModel()
	for serviceID, support := range supports {
		if !support.multi || support.single {
			continue
		}
		for _, endpoint := range endpointModel.Select(ctx, map[string]any{"service_id": serviceID}) {
			paramIDs, changed := replaceEndpointParamID(endpoint.ParamIds, imageParamID, imagesParamID)
			if changed {
				endpointModel.Update(ctx, map[string]any{"id": endpoint.ID}, map[string]any{"param_ids": paramIDs})
			}
		}
	}
}

func replaceEndpointParamID(value string, from uint64, to uint64) (string, bool) {
	var rows []map[string]json.RawMessage
	if err := json.Unmarshal([]byte(value), &rows); err != nil {
		return value, false
	}
	changed := false
	for _, row := range rows {
		var paramID uint64
		if err := json.Unmarshal(row["param_id"], &paramID); err != nil || paramID != from {
			continue
		}
		replacement, _ := json.Marshal(to)
		row["param_id"] = replacement
		changed = true
	}
	if !changed {
		return value, false
	}
	encoded, err := json.Marshal(rows)
	if err != nil {
		return value, false
	}
	return string(encoded), true
}

func normalizeBuiltinServiceParamSorts(ctx context.Context, paramSorts map[uint64]int) {
	skipServices := videoComposeServiceIDs(ctx)
	model := energonmodel.NewServiceParamModel()
	for _, relation := range model.Select(ctx, map[string]any{}) {
		if skipServices[relation.ServiceID] {
			continue
		}
		sort, ok := paramSorts[relation.ParamID]
		if ok && relation.Sort != sort {
			model.Update(ctx, map[string]any{"id": relation.ID}, map[string]any{"sort": sort})
		}
	}
}

func videoComposeServiceIDs(ctx context.Context) map[uint64]bool {
	result := map[uint64]bool{}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"key": videoComposeKey})
	if power == nil {
		return result
	}
	for _, target := range energonmodel.NewPowerTargetModel().Select(ctx, map[string]any{"power_id": power.ID}) {
		result[target.ServiceID] = true
	}
	return result
}
