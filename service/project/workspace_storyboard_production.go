package project

import (
	"context"
	"fmt"
	"reflect"
	"slices"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	botmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	teamservice "github.com/dever-package/bot/service/team"
)

const canvasStoryboardProductionPreparedKey = "_production_prepared"

func prepareCanvasStoryboardProductionNode(
	ctx context.Context,
	projectID uint64,
	canvas map[string]any,
	node canvasRunNode,
) (canvasRunNode, error) {
	itemType := canvasStoryboardItemType(node)
	if !canvasStoryboardProductionItemType(itemType) {
		return node, nil
	}
	if prepared := mapValue(node.StoryboardItem[canvasStoryboardProductionPreparedKey]); prepared != nil {
		node.ImageSequenceFixedConstraints = canvasStringList(prepared["image_sequence_fixed_constraints"])
		for _, target := range sliceValue(prepared["video_source_target_ids"]) {
			node.StoryboardVideoPlan.targets = append(node.StoryboardVideoPlan.targets, uint64Value(target))
		}
		return node, nil
	}

	sourceNodeID := canvasStoryboardSourceNodeID(node)
	if sourceNodeID == "" {
		return node, fmt.Errorf("分镜制作节点缺少来源节点")
	}
	document, err := canvasStoryboardProductionDocument(ctx, projectID, sourceNodeID, canvas)
	if err != nil {
		return node, err
	}
	if err := validateCanvasStorySettingReferences(ctx, projectID, node, canvas, nil); err != nil {
		return node, err
	}
	return prepareCanvasStoryboardSourceParams(ctx, node, document)
}

func prepareCanvasStoryboardSourceParams(ctx context.Context, node canvasRunNode, document map[string]any) (canvasRunNode, error) {
	if canvasStoryboardItemType(node) != "shot" {
		return prepareCanvasStoryboardProductionNodeFromDocument(node, document)
	}
	if len(node.StoryboardVideoPlan.targets) == 0 {
		plan, err := planCanvasStoryboardVideoSource(ctx, node)
		if err != nil {
			return node, err
		}
		node.StoryboardVideoPlan = plan
	}
	plan := node.StoryboardVideoPlan
	node.StoryboardItem = cloneInput(node.StoryboardItem)
	node.StoryboardItem["shot_image_mode"] = plan.mode
	prepared, err := prepareCanvasStoryboardProductionNodeFromDocument(node, document)
	if err != nil {
		return node, err
	}
	if !plan.referenceMode {
		delete(prepared.ParamValues, "referenceMode")
	}
	targets := make([]any, len(plan.targets))
	for i, target := range plan.targets {
		targets[i] = target
	}
	mapValue(prepared.StoryboardItem[canvasStoryboardProductionPreparedKey])["video_source_target_ids"] = targets
	return prepared, nil
}

// Source failover can use the same frame inputs, not a different dependency graph.
type canvasStoryboardVideoPlan struct {
	mode          string
	referenceMode bool
	targets       []uint64
}

func (plan *canvasStoryboardVideoPlan) consider(node canvasRunNode, targetID uint64, params []energoninput.PowerParam) error {
	mode, err := canvasStoryboardVideoSourceMode(node, params)
	if err != nil {
		return err
	}
	referenceMode := slices.ContainsFunc(params, func(param energoninput.PowerParam) bool { return param.Key == "referenceMode" })
	wanted := canvasStoryboardShotImageMode(node.StoryboardItem)
	rank := func(candidate string) int {
		switch candidate {
		case wanted:
			return 3
		case botmodel.StoryboardShotImageFirstFrame:
			return 2
		case botmodel.StoryboardShotImageReferences:
			return 1
		default:
			return 0
		}
	}
	if len(plan.targets) == 0 || rank(mode) > rank(plan.mode) {
		*plan = canvasStoryboardVideoPlan{mode: mode, referenceMode: referenceMode}
	}
	if plan.mode == mode && plan.referenceMode == referenceMode {
		plan.targets = append(plan.targets, targetID)
	}
	return nil
}

func planCanvasStoryboardVideoSource(ctx context.Context, node canvasRunNode) (canvasStoryboardVideoPlan, error) {
	ctx = energonservice.WithPowerRequestCache(ctx)
	power, ok := (teamservice.Repo{}).FindPowerOption(ctx, node.PowerID, node.PowerKey)
	if !ok {
		return canvasStoryboardVideoPlan{}, fmt.Errorf("生成能力不存在")
	}
	gateway := energonservice.NewGatewayService()
	sources, err := gateway.CompatiblePowerSourcesForOptions(ctx, power.Key, node.SourceRequirements)
	if err != nil {
		return canvasStoryboardVideoPlan{}, err
	}
	var plan canvasStoryboardVideoPlan
	var sourceErr error
	for _, source := range sources {
		if node.SelectedTarget != 0 && source.TargetID != node.SelectedTarget {
			continue
		}
		form, err := gateway.PowerTargetParamConfig(ctx, power.Key, source.TargetID)
		if err != nil {
			return plan, err
		}
		if err := plan.consider(node, source.TargetID, form.Params); err != nil {
			sourceErr = err
		}
	}
	if len(plan.targets) > 0 {
		return plan, nil
	}
	if sourceErr != nil {
		return plan, sourceErr
	}
	if durations := node.SourceRequirements[botmodel.ParamDurationKey]; len(durations) > 0 {
		return plan, fmt.Errorf("没有同时支持 %s 秒的可用视频来源", strings.Join(durations, "、"))
	}
	return plan, fmt.Errorf("没有可用的视频来源")
}

// Read the same duration mappings that source selection uses. Before a new
// storyboard has video nodes, use the configured first usable video source.
func applyCanvasStoryboardVideoDurationOptions(ctx context.Context, input map[string]any, board canvasRunNode, canvas map[string]any) error {
	delete(input, botmodel.StoryboardDurationOptionsInputKey)
	if botmodel.NormalizeOutputType(board.OutputType) != botmodel.OutputTypeStoryboard || board.StoryboardWorkType == botmodel.StoryboardWorkTypeMV {
		return nil
	}
	var key string
	var target uint64
	repo := teamservice.Repo{}
	for _, raw := range sliceValue(canvas["nodes"]) {
		row := mapValue(raw)
		item := mapValue(row["storyboard_item"])
		if textValue(item["source_node_id"]) != board.ID || textValue(item["item_type"]) != "shot" {
			continue
		}
		option := mapValue(row["power"])
		power, ok := repo.FindPowerOption(ctx, uint64Value(option["id"]), textValue(option["key"]))
		if !ok {
			continue
		}
		key = power.Key
		target = uint64Value(valueAtPath(row, "composer_draft", "selected_target_id"))
		if target != 0 {
			break
		}
	}
	if key == "" {
		for _, power := range repo.ListPowers(ctx) {
			if power.Kind == "video" && botmodel.NormalizeOutputType(power.OutputType) == botmodel.OutputTypeGeneral {
				key = power.Key
				break
			}
		}
	}
	if key == "" {
		return nil
	}
	ctx = energonservice.WithPowerRequestCache(ctx)
	gateway := energonservice.NewGatewayService()
	form, err := gateway.PowerParamConfig(ctx, key, target)
	if err != nil {
		return err
	}
	shot := canvasRunNode{StoryboardItem: map[string]any{"shot_image_mode": botmodel.StoryboardShotImageFirstLast}}
	var plan canvasStoryboardVideoPlan
	optionsByTarget := map[uint64][]any{}
	for _, source := range form.Sources {
		if target != 0 && source.TargetID != target {
			continue
		}
		var options []any
		for _, value := range source.SupportedOptions[botmodel.ParamDurationKey] {
			if seconds, ok := storyboardInteger(value); ok && seconds >= board.StoryboardMinShotDuration {
				options = append(options, value)
			}
		}
		if len(options) == 0 {
			continue
		}
		targetForm, err := gateway.PowerTargetParamConfig(ctx, key, source.TargetID)
		if err != nil {
			return err
		}
		if err := plan.consider(shot, source.TargetID, targetForm.Params); err == nil {
			optionsByTarget[source.TargetID] = options
		}
	}
	if len(plan.targets) > 0 {
		input[botmodel.StoryboardDurationOptionsInputKey] = optionsByTarget[plan.targets[0]]
	}
	return nil
}

func canvasStoryboardVideoSourceMode(node canvasRunNode, params []energoninput.PowerParam) (string, error) {
	mode := canvasStoryboardShotImageMode(node.StoryboardItem)
	if mode == botmodel.StoryboardShotImageNone {
		return mode, nil
	}
	hasFirst, hasLast, hasImages := false, false, false
	for _, param := range params {
		if !energoninput.MediaParamSupports(param, "image") {
			continue
		}
		switch param.Key {
		case canvasMediaUsageFirstFrame:
			hasFirst = true
		case canvasMediaUsageLastFrame:
			hasLast = true
		case canvasMediaUsageReference:
			hasImages = energoninput.NormalizeParamControlType(param.Type) == "files" && (param.MaxFiles == 0 || param.MaxFiles >= 2)
		}
	}
	if hasFirst && hasLast {
		return mode, nil
	}
	if hasFirst {
		return botmodel.StoryboardShotImageFirstFrame, nil
	}
	if firstText(node.StoryboardItem["shared_start_shot_id"], node.StoryboardItem["sharedStartShotId"]) != "" {
		return "", fmt.Errorf("当前视频来源不支持原生首帧，无法从上一镜实际尾帧续拍")
	}
	if hasImages {
		return botmodel.StoryboardShotImageReferences, nil
	}
	return "", fmt.Errorf("当前视频来源无法接收本镜规划图，需要首尾帧或多图参考参数")
}

func canvasStoryboardModelReferences(node canvasRunNode, references []energoninput.MediaReference) []energoninput.MediaReference {
	if canvasStoryboardItemType(node) != "shot" {
		return references
	}
	mode := canvasStoryboardShotImageMode(node.StoryboardItem)
	result := make([]energoninput.MediaReference, 0, len(references))
	for _, reference := range references {
		if mode == botmodel.StoryboardShotImageFirstFrame && reference.Usage == canvasMediaUsageLastFrame {
			continue
		}
		if mode == botmodel.StoryboardShotImageReferences && (reference.Usage == canvasMediaUsageFirstFrame || reference.Usage == canvasMediaUsageLastFrame) {
			reference.Usage = canvasMediaUsageReference
		}
		result = append(result, reference)
	}
	return result
}

func canvasStoryboardProductionItemType(itemType string) bool {
	switch itemType {
	case "character", "scene", "prop", "shot_image", "shot", "speech":
		return true
	default:
		return false
	}
}

func canvasStoryboardProductionDocument(
	ctx context.Context,
	projectID uint64,
	sourceNodeID string,
	canvas map[string]any,
) (map[string]any, error) {
	source := canvasNodeByID(sourceNodeID, canvas)
	if source == nil {
		return nil, fmt.Errorf("分镜来源节点不存在")
	}
	if canvasStorySettingGroup(sourceNodeID, canvas) != nil {
		return canvasStorySettingProductionDocument(ctx, projectID, source, canvas)
	}
	document, ok := storyboardDocument(firstPresent(
		valueAtPath(source, "asset", "version", "content"),
		firstPresent(source["result_output"], source["resultOutput"]),
		valueAtPath(source, "result", "output"),
		valueAtPath(source, "result_ref", "output"),
	))
	if !ok {
		return nil, fmt.Errorf("分镜来源内容无效，请刷新画布后重试")
	}
	if storyboardStatus(document) != storyboardWorkflowConfirm {
		return nil, fmt.Errorf("分镜脚本尚未确认")
	}
	assetRef := mapValue(source["asset"])
	resultRef := mapValue(firstPresent(source["result_ref"], source["resultRef"]))
	assetID := firstUint64(uint64Value(assetRef["id"]), uint64Value(resultRef["asset_id"]), uint64Value(resultRef["assetId"]))
	assets := assetservice.NewService()
	asset := assets.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil || asset.Status != assetmodel.StatusCurrent || asset.VersionID == 0 {
		return nil, fmt.Errorf("分镜资产不存在，请刷新画布后重试")
	}
	requestedVersionID := firstUint64(
		uint64Value(resultRef["version_id"]),
		uint64Value(resultRef["versionId"]),
		uint64Value(assetRef["version_id"]),
		uint64Value(valueAtPath(assetRef, "version", "id")),
	)
	if requestedVersionID > 0 && requestedVersionID != asset.VersionID {
		return nil, fmt.Errorf("分镜脚本已更新，请刷新画布后重试")
	}
	version := assets.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("分镜当前版本不存在，请刷新画布后重试")
	}
	current, ok := storyboardDocument(assetservice.VersionToMap(*version)["content"])
	if !ok || storyboardStatus(current) != storyboardWorkflowConfirm || !reflect.DeepEqual(document, current) {
		return nil, fmt.Errorf("分镜脚本已更新，请刷新画布后重试")
	}
	if err := validateCanvasStoryboardSettings(ctx, projectID, sourceNodeID, document, canvas); err != nil {
		return nil, err
	}
	return document, nil
}

func prepareCanvasStoryboardProductionNodeFromDocument(
	node canvasRunNode,
	document map[string]any,
) (canvasRunNode, error) {
	node.StoryboardItem = cloneInput(node.StoryboardItem)
	itemType := canvasStoryboardItemType(node)
	generatedPrompt := strings.TrimSpace(firstText(
		node.StoryboardItem["generated_prompt"],
		node.StoryboardItem["generatedPrompt"],
	))
	editablePrompt := canvasStoryboardEditablePrompt(node, generatedPrompt)
	projection, err := energonservice.BuildStoryboardProductionPrompt(
		document,
		energonservice.StoryboardProductionPromptRequest{
			ItemType:       itemType,
			ItemID:         firstText(node.StoryboardItem["item_id"], node.StoryboardItem["itemId"]),
			ShotImageMode:  firstText(node.StoryboardItem["shot_image_mode"], node.StoryboardItem["shotImageMode"]),
			FrameRole:      firstText(node.StoryboardItem["frame_role"], node.StoryboardItem["frameRole"]),
			EditablePrompt: editablePrompt,
			NativeAudio: document["work_type"] != botmodel.StoryboardWorkTypeMV &&
				textValue(mapValue(document["production_plan"])["voice_mode"]) == storyboardProductionNative,
			PreviousSceneFrame: itemType == "shot_image" && firstText(
				node.StoryboardItem["continuity_anchor"],
				node.StoryboardItem["continuityAnchor"],
			) != "",
		},
	)
	if err != nil {
		return node, err
	}

	node.ComposerPrompt = projection.Prompt
	node.ImageSequenceFixedConstraints = append([]string(nil), projection.ImageSequenceFixedConstraints...)

	params := cloneInput(node.ParamValues)
	params["prompt"] = projection.Prompt
	if projection.AspectRatio != "" {
		params["aspectRatio"] = projection.AspectRatio
	}
	if projection.Duration > 0 {
		params["duration"] = projection.Duration
	}
	if itemType == "shot" {
		if projection.ReferenceMode == "" {
			delete(params, "referenceMode")
		} else {
			params["referenceMode"] = projection.ReferenceMode
		}
	}
	node.ParamValues = params

	if itemType == "shot_image" && projection.StartFramePrompt != "" && projection.EndFramePrompt != "" {
		node.StoryboardItem = withCanvasStoryboardFramePrompts(
			node.StoryboardItem,
			projection.StartFramePrompt,
			projection.EndFramePrompt,
		)
	}
	// 预检画布会再次解析，恢复和单独执行也必须保留同一份内部投影。
	constraints := make([]any, len(node.ImageSequenceFixedConstraints))
	for index, constraint := range node.ImageSequenceFixedConstraints {
		constraints[index] = constraint
	}
	node.StoryboardItem[canvasStoryboardProductionPreparedKey] = map[string]any{
		"image_sequence_fixed_constraints": constraints,
	}
	if textValue(document["type"]) == botmodel.OutputTypeSetting {
		definition, err := canvasStorySettingDefinition(document, node.StoryboardItem)
		if err != nil {
			return node, err
		}
		mapValue(node.StoryboardItem[canvasStoryboardProductionPreparedKey])["story_setting"] = definition
	}
	return node, nil
}

func canvasStoryboardEditablePrompt(node canvasRunNode, generatedPrompt string) string {
	prompt := strings.TrimSpace(node.ComposerPrompt)
	if prompt == generatedPrompt {
		return ""
	}
	if uint64Value(node.PromptContent["version"]) != 1 {
		return prompt
	}
	// 引用标签由共享编辑器自动插入，不代表用户改写了画面要求。
	var rendered, plain strings.Builder
	for _, raw := range sliceValue(node.PromptContent["parts"]) {
		part := mapValue(raw)
		switch textValue(part["type"]) {
		case "text":
			text, _ := part["text"].(string)
			rendered.WriteString(text)
			plain.WriteString(text)
		case "reference":
			label := textValue(part["label"])
			if !strings.HasPrefix(label, "@") {
				rendered.WriteString("@")
			}
			rendered.WriteString(label)
		}
	}
	if prompt == strings.TrimSpace(rendered.String()) && strings.TrimSpace(plain.String()) == generatedPrompt {
		return ""
	}
	return prompt
}

func withCanvasStoryboardFramePrompts(
	metadata map[string]any,
	startPrompt string,
	endPrompt string,
) map[string]any {
	frames := sliceValue(firstPresent(
		metadata["image_sequence_frames"],
		metadata["imageSequenceFrames"],
	))
	if len(frames) == 0 {
		return metadata
	}
	nextMetadata := cloneInput(metadata)
	nextFrames := make([]any, 0, len(frames))
	for index, raw := range frames {
		frame := cloneInput(mapValue(raw))
		switch index {
		case 0:
			frame["prompt"] = startPrompt
		case 1:
			frame["prompt"] = endPrompt
		}
		nextFrames = append(nextFrames, frame)
	}
	nextMetadata["image_sequence_frames"] = nextFrames
	delete(nextMetadata, "imageSequenceFrames")
	return nextMetadata
}
