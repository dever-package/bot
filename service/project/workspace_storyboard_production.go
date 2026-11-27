package project

import (
	"context"
	"fmt"
	"reflect"
	"strconv"
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
		if len(node.StoryboardVideoPlan.targets) == 0 {
			node.StoryboardVideoPlan.openingUsage = textValue(prepared["video_opening_usage"])
			for _, target := range sliceValue(prepared["video_source_target_ids"]) {
				node.StoryboardVideoPlan.targets = append(node.StoryboardVideoPlan.targets, uint64Value(target))
			}
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
	shotID := firstText(node.StoryboardItem["item_id"], node.StoryboardItem["itemId"])
	mode, err := energonservice.StoryboardVideoFrameMode(document, shotID)
	if err != nil {
		return node, err
	}
	if len(node.StoryboardVideoPlan.targets) == 0 {
		plan, err := planCanvasStoryboardVideoSource(ctx, node, mode)
		if err != nil {
			return node, err
		}
		node.StoryboardVideoPlan = plan
	}
	plan := node.StoryboardVideoPlan
	node.StoryboardItem = cloneInput(node.StoryboardItem)
	node.StoryboardItem["shot_image_mode"] = mode
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
	snapshot := mapValue(prepared.StoryboardItem[canvasStoryboardProductionPreparedKey])
	snapshot["video_source_target_ids"] = targets
	snapshot["video_opening_usage"] = plan.openingUsage
	return prepared, nil
}

// Source failover can use the same frame inputs, not a different dependency graph.
type canvasStoryboardVideoPlan struct {
	requestedImageReferences bool
	requestedFrames          bool
	selectedSource           bool
	openingUsage             string
	referenceMode            bool
	targets                  []uint64
}

func canvasStoryboardVideoFrameMode(node canvasRunNode) string {
	return botmodel.NormalizeStoryboardVideoFrameMode(firstText(node.StoryboardItem["shot_image_mode"], node.StoryboardItem["shotImageMode"]))
}

func (plan *canvasStoryboardVideoPlan) consider(targetID uint64, params []energoninput.PowerParam, mode string, sharedOpening bool) error {
	var first, last, images, referenceMode bool
	var imageLimit int
	for _, param := range params {
		if param.Key == "referenceMode" {
			referenceMode = true
		}
		if !energoninput.MediaParamSupports(param, "image") {
			continue
		}
		frames := param.ActiveWhenKey != "referenceMode" || param.ActiveWhenValue == botmodel.ReferenceModeFrames
		switch param.Key {
		case canvasMediaUsageFirstFrame:
			first = frames
		case canvasMediaUsageLastFrame:
			last = frames
		case canvasMediaUsageReference:
			images = param.ActiveWhenKey != "referenceMode" || param.ActiveWhenValue == botmodel.ReferenceModeReferences
			imageLimit = param.MaxFiles
		}
	}
	openingUsage := canvasMediaUsageFirstFrame
	if plan.requestedImageReferences || plan.selectedSource && images && !first && !last && (!referenceMode || !plan.requestedFrames) {
		if !images || mode == botmodel.StoryboardShotImageFirstLast && imageLimit == 1 {
			return fmt.Errorf("所选来源不能按参考图模式接收本镜规划图片")
		}
		openingUsage = canvasMediaUsageReference
	} else if mode == botmodel.StoryboardShotImageFirstLast {
		if !first || !last {
			return fmt.Errorf("此镜头需要锁定首尾帧，请选择支持独立首尾帧的视频来源")
		}
	} else if !first {
		if sharedOpening {
			return fmt.Errorf("连续运镜需要锁定与上一镜共用的首帧，请选择支持独立首帧的视频来源")
		}
		if !images {
			return fmt.Errorf("当前视频来源无法接收开场图片，请选择支持首帧或参考图的来源")
		}
		openingUsage = canvasMediaUsageReference
	}
	if len(plan.targets) == 0 {
		plan.openingUsage = openingUsage
		plan.referenceMode = referenceMode
	}
	if plan.openingUsage == openingUsage && plan.referenceMode == referenceMode {
		plan.targets = append(plan.targets, targetID)
	}
	return nil
}

func planCanvasStoryboardVideoSource(ctx context.Context, node canvasRunNode, mode string) (canvasStoryboardVideoPlan, error) {
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
	plan := canvasStoryboardVideoPlan{
		requestedImageReferences: textValue(node.ParamValues["referenceMode"]) == botmodel.ReferenceModeReferences,
		requestedFrames:          textValue(node.ParamValues["referenceMode"]) == botmodel.ReferenceModeFrames,
		selectedSource:           node.SelectedTarget != 0,
	}
	var sourceErr error
	sharedOpening := firstText(node.StoryboardItem["shared_start_shot_id"], node.StoryboardItem["sharedStartShotId"]) != ""
	for _, source := range sources {
		if node.SelectedTarget != 0 && source.TargetID != node.SelectedTarget {
			continue
		}
		form, err := gateway.PowerTargetParamConfig(ctx, power.Key, source.TargetID)
		if err != nil {
			return plan, err
		}
		if err := plan.consider(source.TargetID, form.Params, mode, sharedOpening); err != nil {
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
	var plan canvasStoryboardVideoPlan
	optionsByTarget := map[uint64][]string{}
	for _, source := range form.Sources {
		if target != 0 && source.TargetID != target {
			continue
		}
		var options []string
		for _, value := range source.SupportedOptions[botmodel.ParamDurationKey] {
			if seconds, err := strconv.Atoi(value); err == nil && seconds >= board.StoryboardMinShotDuration {
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
		if err := plan.consider(source.TargetID, targetForm.Params, botmodel.StoryboardShotImageFirstFrame, false); err == nil {
			optionsByTarget[source.TargetID] = options
		}
	}
	if len(plan.targets) > 0 {
		input[botmodel.StoryboardDurationOptionsInputKey] = optionsByTarget[plan.targets[0]]
	}
	return nil
}

func prepareCanvasStoryboardVideoReferences(node canvasRunNode, references []energoninput.MediaReference) ([]energoninput.MediaReference, error) {
	if canvasStoryboardItemType(node) != "shot" {
		return references, nil
	}
	openingIndex, closingIndex, first, last := 0, 0, 0, 0
	for index, reference := range references {
		if reference.Kind != "image" {
			continue
		}
		switch reference.Usage {
		case canvasMediaUsageFirstFrame:
			openingIndex = index
			first++
		case canvasMediaUsageLastFrame:
			closingIndex = index
			last++
		}
	}
	if canvasStoryboardVideoFrameMode(node) == botmodel.StoryboardShotImageFirstLast {
		if first != 1 || last != 1 {
			return nil, fmt.Errorf("镜头视频需要各一张首图和尾图，请先生成镜头参考图")
		}
	} else if first != 1 || last != 0 {
		return nil, fmt.Errorf("此镜头只需要一张开场图，不使用尾图")
	}
	if node.StoryboardVideoPlan.openingUsage != canvasMediaUsageReference {
		return references, nil
	}
	opening := references[openingIndex]
	opening.Usage = canvasMediaUsageReference
	ordered := make([]energoninput.MediaReference, 0, len(references))
	ordered = append(ordered, opening)
	if last == 1 {
		closing := references[closingIndex]
		closing.Usage = canvasMediaUsageReference
		ordered = append(ordered, closing)
	}
	for index, reference := range references {
		if index != openingIndex && (last == 0 || index != closingIndex) {
			ordered = append(ordered, reference)
		}
	}
	return ordered, nil
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

type StoryboardVideoPromptPreviewRequest struct {
	AssetID        uint64
	VersionID      uint64
	ShotID         string
	PromptOverride string
}

// PreviewStoryboardVideoPrompt runs the same prompt projection as production,
// without selecting a source, creating a run or invoking a model.
func (s Service) PreviewStoryboardVideoPrompt(ctx context.Context, projectID uint64, req StoryboardVideoPromptPreviewRequest) (map[string]any, error) {
	data, err := s.AssetVersionDetail(ctx, projectID, req.AssetID, req.VersionID)
	if err != nil {
		return nil, err
	}
	document, ok := storyboardDocument(mapValue(data["version"])["content"])
	if !ok {
		return nil, fmt.Errorf("分镜脚本版本不存在")
	}
	node, err := prepareCanvasStoryboardProductionNodeFromDocument(canvasRunNode{
		StoryboardPromptOverride: req.PromptOverride,
		StoryboardItem: map[string]any{
			"item_type": "shot",
			"item_id":   req.ShotID,
		},
	}, document)
	if err != nil {
		return nil, err
	}
	return map[string]any{"prompt": node.ComposerPrompt}, nil
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
	itemID := firstText(node.StoryboardItem["item_id"], node.StoryboardItem["itemId"])
	if itemType == "shot_image" {
		itemID = firstText(node.StoryboardItem["shot_id"], node.StoryboardItem["shotId"])
	}
	mode := firstText(node.StoryboardItem["shot_image_mode"], node.StoryboardItem["shotImageMode"])
	if itemType == "shot" && node.StoryboardVideoPlan.openingUsage == canvasMediaUsageReference {
		mode = botmodel.StoryboardShotImageReferences
	}
	projection, err := energonservice.BuildStoryboardProductionPrompt(
		document,
		energonservice.StoryboardProductionPromptRequest{
			ItemType:       itemType,
			ItemID:         itemID,
			ShotImageMode:  mode,
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
	switch canvasStoryboardItemType(node) {
	case "shot", "shot_image":
		return strings.TrimSpace(node.StoryboardPromptOverride)
	}
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
