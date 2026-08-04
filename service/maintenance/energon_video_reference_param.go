package maintenance

import (
	"context"
	"fmt"
	"strings"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

const (
	videoPowerKey                = "video"
	referenceModeParamKey        = "referenceMode"
	firstFrameParamKey           = "firstFrame"
	lastFrameParamKey            = "lastFrame"
	doubaoVideoEndpointAPI       = "doubao-seedance-1-5-pro-251215"
	doubaoVideoFastEndpointAPI   = "doubao-seedance-2-0-fast-260128"
	runningHubVideoImageEndpoint = "kling-v3.0-pro/image-to-video"
)

type builtinServiceParamSpec struct {
	ParamID           uint64
	ActiveWhenParamID uint64
	ActiveWhenValue   string
	ParamRule         int16
	Key               string
	Name              string
	Mapping           string
	FixedValueType    string
	FileValueFormat   string
	Sort              int
}

// EnsureEnergonVideoReferenceParams upgrades the built-in video capability to
// switch between frame inputs and reference-material inputs explicitly.
// Service parameter mappings remain the only source of provider-native fields.
func EnsureEnergonVideoReferenceParams(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置视频参考参数失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	referenceMode, firstFrame, lastFrame, err := ensureBuiltinVideoReferenceParams(ctx)
	if err != nil {
		return err
	}

	migrateBuiltinVideoPowerParams(ctx, referenceMode.ID, firstFrame.ID, lastFrame.ID)
	migrateDoubaoVideoReferenceParams(ctx, referenceMode.ID, firstFrame.ID, lastFrame.ID)
	migrateDoubaoVideoFastReferenceParams(ctx, referenceMode.ID, firstFrame.ID, lastFrame.ID)
	migrateRunningHubVideoReferenceParam(ctx, referenceMode.ID, firstFrame.ID)

	paramSorts := normalizeBuiltinParamSorts(ctx)
	normalizeBuiltinServiceParamSorts(ctx, paramSorts)
	normalizeBuiltinPowerParamSorts(ctx, paramSorts)
	return nil
}

func ensureBuiltinVideoReferenceParams(ctx context.Context) (*energonmodel.Param, *energonmodel.Param, *energonmodel.Param, error) {
	imageParam := findBuiltinParam(ctx, energonmodel.ParamImageID, imageParamKey)
	cateID := builtinParamCateCommonID
	if imageParam != nil && imageParam.CateID > 0 {
		cateID = imageParam.CateID
	}
	referenceMode, err := ensureBuiltinReferenceModeParam(ctx, cateID)
	if err != nil {
		return nil, nil, nil, err
	}

	firstFrame, err := ensureBuiltinVideoReferenceParam(
		ctx,
		energonmodel.ParamFirstFrameID,
		firstFrameParamKey,
		"首帧",
		energonmodel.ParamSortFirstFrame,
		cateID,
	)
	if err != nil {
		return nil, nil, nil, err
	}
	lastFrame, err := ensureBuiltinVideoReferenceParam(
		ctx,
		energonmodel.ParamLastFrameID,
		lastFrameParamKey,
		"尾帧",
		energonmodel.ParamSortLastFrame,
		cateID,
	)
	if err != nil {
		return nil, nil, nil, err
	}
	return referenceMode, firstFrame, lastFrame, nil
}

func ensureBuiltinReferenceModeParam(ctx context.Context, cateID uint64) (*energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	param := findBuiltinParam(ctx, energonmodel.ParamReferenceModeID, referenceModeParamKey)
	values := map[string]any{
		"name":           "参考方式",
		"key":            referenceModeParamKey,
		"type":           "option",
		"preview_type":   "none",
		"usage":          int16(1),
		"value_type":     "string",
		"cate_id":        cateID,
		"upload_rule_id": uint64(0),
		"max_files":      0,
		"default_value":  energonmodel.ReferenceModeFrames,
		"status":         int16(1),
		"sort":           energonmodel.ParamSortReferenceMode,
	}
	if param == nil {
		values["created_at"] = time.Now()
		id := uint64(model.Insert(ctx, values))
		if id == 0 {
			return nil, fmt.Errorf("创建内置参考方式参数失败")
		}
		param = model.Find(ctx, map[string]any{"id": id})
	} else {
		model.Update(ctx, map[string]any{"id": param.ID}, values)
		param = model.Find(ctx, map[string]any{"id": param.ID})
	}
	if param == nil {
		return nil, fmt.Errorf("读取内置参考方式参数失败")
	}
	if err := ensureReferenceModeOptions(ctx, param.ID); err != nil {
		return nil, err
	}
	return param, nil
}

func ensureReferenceModeOptions(ctx context.Context, paramID uint64) error {
	model := energonmodel.NewParamOptionModel()
	options := []struct {
		name  string
		value string
		sort  int
	}{
		{name: "首尾帧", value: energonmodel.ReferenceModeFrames, sort: 1},
		{name: "参考素材", value: energonmodel.ReferenceModeReferences, sort: 2},
	}
	for _, option := range options {
		filter := map[string]any{"param_id": paramID, "value": option.value}
		values := map[string]any{"name": option.name, "sort": option.sort}
		if existing := model.Find(ctx, filter); existing != nil {
			model.Update(ctx, map[string]any{"id": existing.ID}, values)
			continue
		}
		values["param_id"] = paramID
		values["value"] = option.value
		if model.Insert(ctx, values) == 0 {
			return fmt.Errorf("创建内置参考方式选项“%s”失败", option.name)
		}
	}
	return nil
}

func ensureBuiltinVideoReferenceParam(
	ctx context.Context,
	preferredID uint64,
	key string,
	name string,
	sort int,
	cateID uint64,
) (*energonmodel.Param, error) {
	model := energonmodel.NewParamModel()
	param := findBuiltinParam(ctx, preferredID, key)
	values := newImageParamValues(key, name, "file", 1, sort, cateID)
	delete(values, "created_at")
	if param == nil {
		values["created_at"] = time.Now()
		id := uint64(model.Insert(ctx, values))
		if id == 0 {
			return nil, fmt.Errorf("创建内置%s参数失败", name)
		}
		param = model.Find(ctx, map[string]any{"id": id})
	} else {
		model.Update(ctx, map[string]any{"id": param.ID}, values)
		param = model.Find(ctx, map[string]any{"id": param.ID})
	}
	if param == nil {
		return nil, fmt.Errorf("读取内置%s参数失败", name)
	}
	return param, nil
}

func migrateBuiltinVideoPowerParams(
	ctx context.Context,
	referenceModeParamID uint64,
	firstFrameParamID uint64,
	lastFrameParamID uint64,
) {
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"key": videoPowerKey})
	if power == nil {
		return
	}

	model := energonmodel.NewPowerParamModel()
	legacy := model.Find(ctx, map[string]any{
		"power_id": power.ID,
		"param_id": energonmodel.ParamImageID,
	})
	firstFrame := model.Find(ctx, map[string]any{
		"power_id": power.ID,
		"param_id": firstFrameParamID,
	})
	if legacy != nil {
		if firstFrame == nil {
			model.Update(ctx, map[string]any{"id": legacy.ID}, map[string]any{
				"param_id": firstFrameParamID,
				"show":     energonmodel.PowerParamShowBySource,
				"status":   int16(2),
				"sort":     energonmodel.ParamSortFirstFrame,
			})
		} else {
			model.Delete(ctx, map[string]any{"id": legacy.ID})
		}
	}

	ensurePowerParam(ctx, power.ID, referenceModeParamID, energonmodel.PowerParamShowBySource, 1, energonmodel.ParamSortReferenceMode)
	ensurePowerParam(ctx, power.ID, firstFrameParamID, energonmodel.PowerParamShowBySource, 2, energonmodel.ParamSortFirstFrame)
	ensurePowerParam(ctx, power.ID, lastFrameParamID, energonmodel.PowerParamShowBySource, 2, energonmodel.ParamSortLastFrame)
	ensurePowerParam(ctx, power.ID, energonmodel.ParamImagesID, energonmodel.PowerParamShowBySource, 2, energonmodel.ParamSortImages)
}

func migrateDoubaoVideoReferenceParams(ctx context.Context, referenceModeParamID uint64, firstFrameParamID uint64, lastFrameParamID uint64) {
	for _, endpoint := range serviceEndpointsByAPI(ctx, energonmodel.ServiceDoubaoVideoID, doubaoVideoEndpointAPI) {
		deleteManagedServiceParamKeys(ctx, endpoint.ServiceID, []string{
			"content[1-2].type",
			"content[1-2].image_url.url",
			"content[1-2].role",
		})
		upsertBuiltinServiceParams(ctx, endpoint.ServiceID, []builtinServiceParamSpec{
			{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1].type", Mapping: "image_url", Sort: 20},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[1].image_url.url", Name: "首帧", Mapping: "[1]", Sort: energonmodel.ParamSortFirstFrame}, referenceModeParamID, energonmodel.ReferenceModeFrames),
			{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1].role", Mapping: "first_frame", Sort: 23},
			{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[2].type", Mapping: "image_url", Sort: 24},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[2].image_url.url", Name: "尾帧", Mapping: "[1]", Sort: energonmodel.ParamSortLastFrame}, referenceModeParamID, energonmodel.ReferenceModeFrames),
			{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[2].role", Mapping: "last_frame", Sort: 26},
		})
	}
}

func migrateDoubaoVideoFastReferenceParams(ctx context.Context, referenceModeParamID uint64, firstFrameParamID uint64, lastFrameParamID uint64) {
	imagesParam := findBuiltinParam(ctx, energonmodel.ParamImagesID, imagesParamKey)
	videoParam := findBuiltinParam(ctx, 0, "video")
	audioParam := findBuiltinParam(ctx, 0, "audio")
	if imagesParam == nil || videoParam == nil || audioParam == nil {
		return
	}
	for _, endpoint := range serviceEndpointsByAPI(ctx, energonmodel.ServiceDoubaoVideoFastID, doubaoVideoFastEndpointAPI) {
		upsertBuiltinServiceParams(ctx, endpoint.ServiceID, []builtinServiceParamSpec{
			{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1].type", Mapping: "image_url", Sort: 20},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[1].image_url.url", Name: "首帧", Mapping: "[1]", Sort: energonmodel.ParamSortFirstFrame}, referenceModeParamID, energonmodel.ReferenceModeFrames),
			{ParamID: firstFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1].role", Mapping: "first_frame", Sort: 23},
			{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[2].type", Mapping: "image_url", Sort: 24},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[2].image_url.url", Name: "尾帧", Mapping: "[1]", Sort: energonmodel.ParamSortLastFrame}, referenceModeParamID, energonmodel.ReferenceModeFrames),
			{ParamID: lastFrameParamID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[2].role", Mapping: "last_frame", Sort: 26},
			{ParamID: imagesParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1-9].type", Mapping: "image_url", Sort: 10},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: imagesParam.ID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[1-9].image_url.url", Name: "参考图片", Mapping: "[1,2,3,4,5,6,7,8,9]", Sort: energonmodel.ParamSortImages}, referenceModeParamID, energonmodel.ReferenceModeReferences),
			{ParamID: imagesParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[1-9].role", Mapping: "reference_image", Sort: 12},
			{ParamID: videoParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[10].type", Mapping: "video_url", Sort: 60},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: videoParam.ID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[10].video_url.url", Name: "参考视频", Mapping: "[1]", Sort: energonmodel.ParamSortVideo}, referenceModeParamID, energonmodel.ReferenceModeReferences),
			{ParamID: videoParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[10].role", Mapping: "reference_video", Sort: 62},
			{ParamID: audioParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[11].type", Mapping: "audio_url", Sort: 70},
			withBuiltinServiceParamCondition(builtinServiceParamSpec{ParamID: audioParam.ID, ParamRule: energonmodel.ServiceParamRuleAttachment, Key: "content[11].audio_url.url", Name: "参考音频", Mapping: "[1]", Sort: energonmodel.ParamSortAudio}, referenceModeParamID, energonmodel.ReferenceModeReferences),
			{ParamID: audioParam.ID, ParamRule: energonmodel.ServiceParamRuleFixed, Key: "content[11].role", Mapping: "reference_audio", Sort: 72},
		})
	}
}

func migrateRunningHubVideoReferenceParam(ctx context.Context, referenceModeParamID uint64, firstFrameParamID uint64) {
	for _, endpoint := range serviceEndpointsByAPI(ctx, energonmodel.ServiceRunningHubVideoID, runningHubVideoImageEndpoint) {
		upsertBuiltinServiceParams(ctx, endpoint.ServiceID, []builtinServiceParamSpec{
			withBuiltinServiceParamCondition(builtinServiceParamSpec{
				ParamID:         firstFrameParamID,
				ParamRule:       energonmodel.ServiceParamRuleAttachment,
				Key:             "firstImageUrl",
				Name:            "首帧",
				Mapping:         "[1]",
				FileValueFormat: energonmodel.ServiceParamFileValueFormatDataURL,
				Sort:            energonmodel.ParamSortFirstFrame,
			}, referenceModeParamID, energonmodel.ReferenceModeFrames),
		})
		if paramIDs, changed := replaceEndpointParamID(endpoint.ParamIds, energonmodel.ParamImageID, firstFrameParamID); changed {
			energonmodel.NewServiceEndpointModel().Update(ctx, map[string]any{"id": endpoint.ID}, map[string]any{"param_ids": paramIDs})
		}
	}
}

func serviceEndpointsByAPI(ctx context.Context, serviceID uint64, api string) []*energonmodel.ServiceEndpoint {
	api = strings.TrimSpace(api)
	if serviceID == 0 || api == "" {
		return nil
	}
	return energonmodel.NewServiceEndpointModel().Select(ctx, map[string]any{
		"service_id": serviceID,
		"api":        api,
	})
}

func deleteManagedServiceParamKeys(ctx context.Context, serviceID uint64, keys []string) {
	managed := make(map[string]bool, len(keys))
	for _, key := range keys {
		managed[key] = true
	}
	model := energonmodel.NewServiceParamModel()
	for _, relation := range model.Select(ctx, map[string]any{"service_id": serviceID}) {
		if managed[relation.Key] {
			model.Delete(ctx, map[string]any{"id": relation.ID})
		}
	}
}

func upsertBuiltinServiceParams(ctx context.Context, serviceID uint64, specs []builtinServiceParamSpec) {
	for _, spec := range specs {
		upsertBuiltinServiceParam(ctx, serviceID, spec)
	}
}

func withBuiltinServiceParamCondition(spec builtinServiceParamSpec, paramID uint64, value string) builtinServiceParamSpec {
	spec.ActiveWhenParamID = paramID
	spec.ActiveWhenValue = value
	return spec
}

func upsertBuiltinServiceParam(ctx context.Context, serviceID uint64, spec builtinServiceParamSpec) {
	model := energonmodel.NewServiceParamModel()
	var current *energonmodel.ServiceParam
	for _, relation := range model.Select(ctx, map[string]any{"service_id": serviceID}) {
		if relation.Key != spec.Key {
			continue
		}
		if relation.ParamID == spec.ParamID && current == nil {
			current = relation
			continue
		}
		model.Delete(ctx, map[string]any{"id": relation.ID})
	}

	fixedValueType := strings.TrimSpace(spec.FixedValueType)
	if fixedValueType == "" {
		fixedValueType = energonmodel.ServiceParamFixedValueTypeString
	}
	fileValueFormat := strings.TrimSpace(spec.FileValueFormat)
	if fileValueFormat == "" {
		fileValueFormat = energonmodel.ServiceParamFileValueFormatURL
	}
	values := map[string]any{
		"service_id":           serviceID,
		"param_id":             spec.ParamID,
		"active_when_param_id": spec.ActiveWhenParamID,
		"active_when_value":    spec.ActiveWhenValue,
		"param_rule":           spec.ParamRule,
		"key":                  spec.Key,
		"name":                 spec.Name,
		"mapping":              spec.Mapping,
		"fixed_value_type":     fixedValueType,
		"file_value_format":    fileValueFormat,
		"status":               int16(1),
		"sort":                 spec.Sort,
	}
	if current != nil {
		model.Update(ctx, map[string]any{"id": current.ID}, values)
		return
	}
	values["created_at"] = time.Now()
	model.Insert(ctx, values)
}
