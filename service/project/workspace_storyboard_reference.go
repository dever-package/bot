package project

import (
	"context"
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type canvasStoryboardReference struct {
	Key       string
	AssetID   uint64
	VersionID uint64
	Label     string
	Kind      string
	Purpose   string
}

func normalizeCanvasStoryboardExecutionPlan(plan canvasExecutionPlan) (canvasExecutionPlan, error) {
	for index, node := range plan.Nodes {
		normalized, err := normalizeCanvasStoryboardRunNode(node)
		if err != nil {
			return plan, fmt.Errorf("节点“%s”：%w", canvasRunNodeTitle(node), err)
		}
		plan.Nodes[index] = normalized
		if plan.Start.ID == normalized.ID {
			plan.Start = normalized
		}
	}
	return plan, nil
}

func normalizeCanvasStoryboardRunNode(node canvasRunNode) (canvasRunNode, error) {
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return node, nil
	}
	workType, err := botmodel.NormalizeStoryboardWorkType(node.StoryboardWorkType)
	if err != nil {
		return node, err
	}
	references, err := parseCanvasStoryboardReferences(
		node.StoryboardReferencesInput,
		node.PromptContent,
		workType,
	)
	if err != nil {
		return node, err
	}
	node.StoryboardWorkType = workType
	node.StoryboardReferences = references
	if workType != botmodel.StoryboardWorkTypeMV {
		node.StoryboardLyricsSourceID = ""
		node.StoryboardRangeStartMS = nil
		node.StoryboardRangeEndMS = nil
	}
	return node, nil
}

func parseCanvasStoryboardReferences(value any, promptContent map[string]any, workType string) ([]canvasStoryboardReference, error) {
	promptReferences, err := canvasStructuredPromptReferences(promptContent)
	if err != nil {
		return nil, err
	}
	promptAssets := make(map[uint64]struct{}, len(promptReferences))
	for _, reference := range promptReferences {
		if reference.ReferenceType == canvasReferenceTypeAsset {
			promptAssets[reference.ReferenceID] = struct{}{}
		}
	}

	result := make([]canvasStoryboardReference, 0)
	usedKeys := map[string]struct{}{}
	usedAssets := map[uint64]struct{}{}
	for index, raw := range sliceValue(value) {
		row := mapValue(raw)
		key := textValue(row["key"])
		assetID := firstUint64(uint64Value(row["asset_id"]), uint64Value(row["assetId"]))
		kind := strings.ToLower(textValue(row["kind"]))
		purpose := strings.ToLower(textValue(row["purpose"]))
		if key == "" || assetID == 0 {
			return nil, fmt.Errorf("分镜参考素材 %d 缺少引用键或资产标识", index+1)
		}
		if _, exists := promptAssets[assetID]; !exists {
			return nil, fmt.Errorf("分镜参考素材“%s”已不在当前提示词中", firstText(row["label"], key))
		}
		if err := botmodel.ValidateStoryboardReferencePurpose(workType, kind, purpose); err != nil {
			return nil, fmt.Errorf("分镜参考素材“%s”：%w", firstText(row["label"], key), err)
		}
		if _, exists := usedKeys[key]; exists {
			return nil, fmt.Errorf("分镜参考素材引用键 %s 重复", key)
		}
		if _, exists := usedAssets[assetID]; exists {
			return nil, fmt.Errorf("同一资产不能重复配置分镜参考用途")
		}
		usedKeys[key] = struct{}{}
		usedAssets[assetID] = struct{}{}
		result = append(result, canvasStoryboardReference{
			Key:       key,
			AssetID:   assetID,
			VersionID: firstUint64(uint64Value(row["version_id"]), uint64Value(row["versionId"])),
			Label:     firstText(row["label"], key),
			Kind:      kind,
			Purpose:   purpose,
		})
	}
	if err := validateCanvasStoryboardReferenceSet(workType, result); err != nil {
		return nil, err
	}
	return result, nil
}

func applyCanvasStoryboardReferenceInput(
	ctx context.Context,
	projectID uint64,
	input map[string]any,
	node canvasRunNode,
) error {
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return nil
	}
	stripLegacyStoryboardGenerationOverride(input)
	input["storyboard_work_type"] = node.StoryboardWorkType
	input[botmodel.StoryboardMinShotDurationKey] = node.StoryboardMinShotDuration
	delete(input, botmodel.StoryboardRangeStartMSKey)
	delete(input, botmodel.StoryboardRangeEndMSKey)
	delete(input, botmodel.StoryboardSoundtrackDurationMSKey)
	items := make([]any, 0, len(node.StoryboardReferences))
	soundtrackLyrics := ""
	var soundtrackTimeline *botmodel.StoryboardTimelineRange
	for _, reference := range node.StoryboardReferences {
		item := map[string]any{
			"key":     reference.Key,
			"label":   reference.Label,
			"kind":    reference.Kind,
			"purpose": reference.Purpose,
		}
		if node.StoryboardWorkType == botmodel.StoryboardWorkTypeMV && reference.Purpose == botmodel.StoryboardReferencePurposeSoundtrack {
			lyrics, durationMS, err := canvasStoryboardReferenceSoundtrack(ctx, projectID, reference)
			if err != nil {
				return err
			}
			timeline, err := botmodel.NormalizeStoryboardTimelineRange(
				durationMS,
				node.StoryboardRangeStartMS,
				node.StoryboardRangeEndMS,
			)
			if err != nil {
				return err
			}
			if _, _, err := botmodel.StoryboardShotCountRange(
				timeline.TargetDurationSeconds(),
				node.StoryboardMinShotDuration,
				botmodel.StoryboardMaxGeneratedShotDuration,
			); err != nil {
				return fmt.Errorf("制作范围无效: %w", err)
			}
			soundtrackTimeline = &timeline
			if lyrics != "" {
				soundtrackLyrics = lyrics
			}
		}
		items = append(items, item)
	}
	if len(items) > 0 {
		input["storyboard_references"] = items
	}
	if soundtrackTimeline != nil {
		input[botmodel.StoryboardRangeStartMSKey] = soundtrackTimeline.StartMS
		input[botmodel.StoryboardRangeEndMSKey] = soundtrackTimeline.EndMS
		input[botmodel.StoryboardSoundtrackDurationMSKey] = soundtrackTimeline.SoundtrackDurationMS
	}
	return applyCanvasStoryboardLyricsInput(input, soundtrackLyrics)
}

func applyCanvasStoryboardLyricsSourceInput(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	input map[string]any,
	node canvasRunNode,
	previousOutput any,
	results []canvasNodeResult,
) error {
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard || node.StoryboardLyricsSourceID == "" {
		return nil
	}
	lyrics, err := canvasStoryboardLyricsSourceText(
		ctx,
		projectID,
		req,
		node,
		previousOutput,
		results,
	)
	if err != nil {
		return err
	}
	return applyCanvasStoryboardLyricsInput(input, lyrics)
}

func canvasStoryboardLyricsSourceText(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	node canvasRunNode,
	previousOutput any,
	results []canvasNodeResult,
) (string, error) {
	sourceNodeID := strings.TrimSpace(node.StoryboardLyricsSourceID)
	directUpstream := false
	for _, edge := range logicalUpstreamCanvasEdges(node.ID, req.Canvas) {
		if edge.From == sourceNodeID {
			directUpstream = true
			break
		}
	}
	if !directUpstream || !canvasNodeProvidesPrimaryText(canvasNodeByID(sourceNodeID, req.Canvas)) {
		return "", fmt.Errorf("歌词来源节点必须是当前分镜的直接文本上游")
	}
	lyrics := strings.TrimSpace(canvasContextText(canvasReferencedNodeOutput(
		ctx,
		projectID,
		sourceNodeID,
		previousOutput,
		results,
		req.Canvas,
	)))
	if lyrics == "" {
		return "", fmt.Errorf("歌词来源节点暂无文本输出")
	}
	return lyrics, nil
}

func canvasStoryboardReferenceSoundtrack(
	ctx context.Context,
	projectID uint64,
	reference canvasStoryboardReference,
) (string, int64, error) {
	_, content, err := resolveCanvasReference(ctx, projectID, canvasPromptReference{
		ReferenceType: canvasReferenceTypeAsset,
		ReferenceID:   reference.AssetID,
		VersionID:     reference.VersionID,
		Label:         reference.Label,
	})
	if err != nil {
		return "", 0, fmt.Errorf("读取主音轨“%s”失败: %w", firstText(reference.Label, reference.Key), err)
	}
	durationMS := botprotocol.ExtractMediaDurationMS(content)
	if durationMS <= 0 {
		urls := botprotocol.ExtractPrimaryMediaURLs(content, botprotocol.MediaTypeAudio)
		if len(urls) == 0 {
			return "", 0, fmt.Errorf("主音轨“%s”没有可用音频", firstText(reference.Label, reference.Key))
		}
		durationMS, err = botprocessor.ProbeMediaDurationMS(ctx, urls[0])
		if err != nil {
			return "", 0, fmt.Errorf("读取主音轨“%s”的时长失败: %w", firstText(reference.Label, reference.Key), err)
		}
	}
	return botprotocol.ExtractLyrics(content), durationMS, nil
}

func applyCanvasStoryboardLyricsInput(input map[string]any, lyrics string) error {
	lyrics = strings.TrimSpace(lyrics)
	if lyrics == "" {
		delete(input, botmodel.StoryboardLyricsInputKey)
		return nil
	}
	timeline, hasTimeline, err := botmodel.NormalizeStoryboardTimelineInput(input)
	if err != nil {
		return err
	}
	if hasTimeline {
		lyrics = botmodel.SelectStoryboardLyricsForTimeline(lyrics, timeline)
	}
	if lyrics == "" {
		delete(input, botmodel.StoryboardLyricsInputKey)
		return nil
	}
	input[botmodel.StoryboardLyricsInputKey] = lyrics
	return nil
}

func canvasExternalReferenceRequired(node map[string]any, assetID uint64) bool {
	metadata := mapValue(firstPresent(node["storyboard_item"], node["storyboardItem"]))
	for _, raw := range sliceValue(firstPresent(
		metadata["external_reference_asset_ids"],
		metadata["externalReferenceAssetIds"],
	)) {
		if uint64Value(raw) == assetID {
			return true
		}
	}
	return false
}

func attachCanvasStoryboardReferences(payload map[string]any, node canvasRunNode) (map[string]any, error) {
	if len(node.StoryboardReferences) == 0 && botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return payload, nil
	}
	output := firstPresent(payload["output"], valueAtPath(payload, "result", "output"), valueAtPath(payload, "asset", "version", "content"))
	document, ok := storyboardDocument(output)
	if !ok {
		return payload, nil
	}
	if err := applyStoryboardReferenceDocument(
		document,
		node.StoryboardWorkType,
		node.StoryboardMinShotDuration,
		node.StoryboardReferences,
	); err != nil {
		return payload, err
	}
	payload["output"] = document
	if result := mapValue(payload["result"]); result != nil {
		result["output"] = document
	}
	return payload, nil
}

func applyStoryboardReferenceDocument(
	document map[string]any,
	workType string,
	minShotDuration int,
	references []canvasStoryboardReference,
) error {
	document["work_type"] = workType
	normalizedDuration, err := botmodel.NormalizeStoryboardMinShotDuration(minShotDuration)
	if err != nil {
		return err
	}
	document[botmodel.StoryboardMinShotDurationKey] = normalizedDuration
	applyStoryboardVisualStyleReference(document, references)
	document["references"] = canvasStoryboardReferenceMaps(references)
	if err := validateCanvasStoryboardReferenceSet(workType, references); err != nil {
		return err
	}
	return validateAndCompleteStoryboardReferenceAssignments(document, references, false)
}

func applyStoryboardVisualStyleReference(document map[string]any, references []canvasStoryboardReference) {
	if !hasCanvasStoryboardReferencePurpose(references, botmodel.StoryboardReferencePurposeVisualStyle) {
		return
	}
	visualMode := botmodel.NormalizeOrInferStoryboardVisualMode(
		textValue(document["visual_mode"]),
		textValue(document["style_prompt"]),
	)
	currentStyle := textValue(document["style_prompt"])
	defaultStyle := botmodel.DefaultStoryboardStylePrompt(visualMode, false)
	referenceStyle := botmodel.DefaultStoryboardStylePrompt(visualMode, true)
	switch {
	case currentStyle == "", currentStyle == defaultStyle:
		document["style_prompt"] = referenceStyle
	case !strings.Contains(currentStyle, "参考"):
		document["style_prompt"] = currentStyle + "；" + referenceStyle
	}
}

func hasCanvasStoryboardReferencePurpose(references []canvasStoryboardReference, purpose string) bool {
	for _, reference := range references {
		if reference.Purpose == purpose {
			return true
		}
	}
	return false
}

func validateStoredStoryboardReferences(document map[string]any) error {
	workType, err := botmodel.NormalizeStoryboardWorkType(textValue(document["work_type"]))
	if err != nil {
		return err
	}
	document["work_type"] = workType
	references, err := storedCanvasStoryboardReferences(document["references"], workType)
	if err != nil {
		return err
	}
	if err := validateCanvasStoryboardReferenceSet(workType, references); err != nil {
		return err
	}
	return validateAndCompleteStoryboardReferenceAssignments(document, references, true)
}

func storedCanvasStoryboardReferences(value any, workType string) ([]canvasStoryboardReference, error) {
	result := make([]canvasStoryboardReference, 0)
	usedKeys := map[string]struct{}{}
	usedAssets := map[uint64]struct{}{}
	for index, raw := range sliceValue(value) {
		row := mapValue(raw)
		reference := canvasStoryboardReference{
			Key:       textValue(row["key"]),
			AssetID:   uint64Value(row["asset_id"]),
			VersionID: uint64Value(row["version_id"]),
			Label:     textValue(row["label"]),
			Kind:      strings.ToLower(textValue(row["kind"])),
			Purpose:   strings.ToLower(textValue(row["purpose"])),
		}
		if reference.Key == "" || reference.AssetID == 0 {
			return nil, fmt.Errorf("分镜参考素材 %d 格式无效", index+1)
		}
		if err := botmodel.ValidateStoryboardReferencePurpose(workType, reference.Kind, reference.Purpose); err != nil {
			return nil, fmt.Errorf("分镜参考素材“%s”：%w", firstText(reference.Label, reference.Key), err)
		}
		if _, exists := usedKeys[reference.Key]; exists {
			return nil, fmt.Errorf("分镜参考素材引用键 %s 重复", reference.Key)
		}
		if _, exists := usedAssets[reference.AssetID]; exists {
			return nil, fmt.Errorf("同一资产不能重复配置分镜参考用途")
		}
		usedKeys[reference.Key] = struct{}{}
		usedAssets[reference.AssetID] = struct{}{}
		result = append(result, reference)
	}
	return result, nil
}

func canvasStoryboardReferenceMaps(references []canvasStoryboardReference) []any {
	result := make([]any, 0, len(references))
	for _, reference := range references {
		result = append(result, map[string]any{
			"key":        reference.Key,
			"asset_id":   reference.AssetID,
			"version_id": reference.VersionID,
			"label":      reference.Label,
			"kind":       reference.Kind,
			"purpose":    reference.Purpose,
		})
	}
	return result
}

func validateCanvasStoryboardReferenceSet(workType string, references []canvasStoryboardReference) error {
	normalizedWorkType, err := botmodel.NormalizeStoryboardWorkType(workType)
	if err != nil {
		return err
	}
	counts := make(map[string]int, len(references))
	for _, reference := range references {
		if err := botmodel.ValidateStoryboardReferencePurpose(normalizedWorkType, reference.Kind, reference.Purpose); err != nil {
			return fmt.Errorf("分镜参考素材“%s”：%w", reference.Label, err)
		}
		spec, _ := botmodel.FindStoryboardReferencePurposeSpec(reference.Purpose)
		counts[reference.Purpose]++
		if spec.MaxCount > 0 && counts[reference.Purpose] > spec.MaxCount {
			return fmt.Errorf("用途“%s”最多只能选择 %d 个素材", spec.Name, spec.MaxCount)
		}
	}
	workTypeSpec, _ := botmodel.FindStoryboardWorkTypeSpec(normalizedWorkType)
	for _, purpose := range workTypeSpec.RequiredReferencePurposes {
		if counts[purpose] > 0 {
			continue
		}
		purposeSpec, _ := botmodel.FindStoryboardReferencePurposeSpec(purpose)
		return fmt.Errorf("%s必须添加“%s”", workTypeSpec.Name, purposeSpec.Name)
	}
	return nil
}

func validateAndCompleteStoryboardReferenceAssignments(document map[string]any, references []canvasStoryboardReference, strict bool) error {
	referenceByKey := make(map[string]canvasStoryboardReference, len(references))
	assignmentCount := make(map[string]int, len(references))
	for _, reference := range references {
		referenceByKey[reference.Key] = reference
	}

	materialTargets := map[string][]map[string]any{}
	for index, raw := range sliceValue(document["materials"]) {
		material := mapValue(raw)
		materialType := strings.ToLower(textValue(material["type"]))
		materialTargets[materialType] = append(materialTargets[materialType], material)
		keys, err := validatedStoryboardReferenceKeys(
			material["reference_keys"],
			referenceByKey,
			botmodel.StoryboardReferenceScopeMaterial,
			materialType,
			fmt.Sprintf("素材 %d", index+1),
			strict,
		)
		if err != nil {
			return err
		}
		material["reference_keys"] = keys
		countStoryboardReferenceAssignments(assignmentCount, keys)
	}

	shotTargets := make([]map[string]any, 0)
	for index, raw := range sliceValue(document["shots"]) {
		shot := mapValue(raw)
		shotTargets = append(shotTargets, shot)
		keys, err := validatedStoryboardReferenceKeys(
			shot["reference_keys"],
			referenceByKey,
			botmodel.StoryboardReferenceScopeShot,
			"",
			fmt.Sprintf("镜头 %d", index+1),
			strict,
		)
		if err != nil {
			return err
		}
		shot["reference_keys"] = keys
		countStoryboardReferenceAssignments(assignmentCount, keys)
	}

	for _, reference := range references {
		purposeSpec, exists := botmodel.FindStoryboardReferencePurposeSpec(reference.Purpose)
		if !exists {
			return fmt.Errorf("参考素材“%s”的用途无效", reference.Label)
		}
		if purposeSpec.Scope != botmodel.StoryboardReferenceScopeMaterial && purposeSpec.Scope != botmodel.StoryboardReferenceScopeShot {
			continue
		}
		if assignmentCount[reference.Key] > 1 {
			return fmt.Errorf("参考素材“%s”不能关联多个%s", reference.Label, purposeSpec.Name)
		}
		if assignmentCount[reference.Key] == 1 {
			continue
		}
		var targets []map[string]any
		if purposeSpec.Scope == botmodel.StoryboardReferenceScopeShot {
			targets = shotTargets
		} else {
			targets = materialTargets[purposeSpec.MaterialType]
		}
		if target := matchStoryboardReferenceTarget(reference.Label, targets); target != nil {
			target["reference_keys"] = appendUniqueStoryboardReferenceKey(target["reference_keys"], reference.Key)
			continue
		}
		if len(targets) != 1 {
			return fmt.Errorf("参考素材“%s”尚未关联到唯一的%s", reference.Label, purposeSpec.Name)
		}
		targets[0]["reference_keys"] = appendUniqueStoryboardReferenceKey(targets[0]["reference_keys"], reference.Key)
	}
	return nil
}

func matchStoryboardReferenceTarget(referenceLabel string, targets []map[string]any) map[string]any {
	referenceLabels := []string{referenceLabel}
	var matched map[string]any
	for _, target := range targets {
		targetLabels := []string{
			textValue(target["id"]),
			textValue(target["name"]),
			textValue(target["beat"]),
		}
		if !storyboardReferenceLabelsMatch(referenceLabels, targetLabels) {
			continue
		}
		if matched != nil {
			return nil
		}
		matched = target
	}
	return matched
}

func storyboardReferenceLabelsMatch(referenceLabels []string, targetLabels []string) bool {
	for _, referenceLabel := range referenceLabels {
		referenceLabel = normalizeStoryboardReferenceLabel(referenceLabel)
		if referenceLabel == "" {
			continue
		}
		for _, targetLabel := range targetLabels {
			targetLabel = normalizeStoryboardReferenceLabel(targetLabel)
			if targetLabel == "" {
				continue
			}
			if referenceLabel == targetLabel || strings.Contains(referenceLabel, targetLabel) || strings.Contains(targetLabel, referenceLabel) {
				return true
			}
		}
	}
	return false
}

func normalizeStoryboardReferenceLabel(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	return strings.NewReplacer(
		"@", "",
		"#", "",
		" ", "",
		"-", "",
		"_", "",
		"参考图", "",
		"参考视频", "",
		"参考", "",
	).Replace(value)
}

func validatedStoryboardReferenceKeys(
	value any,
	references map[string]canvasStoryboardReference,
	targetScope string,
	targetMaterialType string,
	targetLabel string,
	strict bool,
) ([]any, error) {
	result := make([]any, 0)
	used := map[string]struct{}{}
	for index, raw := range sliceValue(value) {
		key := textValue(raw)
		if key == "" {
			if strict {
				return nil, fmt.Errorf("%s 的参考键 %d 无效", targetLabel, index+1)
			}
			continue
		}
		reference, exists := references[key]
		if !exists {
			if strict {
				return nil, fmt.Errorf("%s 引用了不存在的参考素材 %s", targetLabel, key)
			}
			continue
		}
		purposeSpec, purposeExists := botmodel.FindStoryboardReferencePurposeSpec(reference.Purpose)
		matchesTarget := purposeExists && purposeSpec.Scope == targetScope
		if matchesTarget && targetScope == botmodel.StoryboardReferenceScopeMaterial {
			matchesTarget = purposeSpec.MaterialType == targetMaterialType
		}
		if !matchesTarget {
			if strict {
				return nil, fmt.Errorf("参考素材“%s”不能关联到%s", reference.Label, targetLabel)
			}
			continue
		}
		if _, exists := used[key]; exists {
			continue
		}
		used[key] = struct{}{}
		result = append(result, key)
	}
	return result, nil
}

func countStoryboardReferenceAssignments(assigned map[string]int, keys []any) {
	for _, raw := range keys {
		if key := textValue(raw); key != "" {
			assigned[key]++
		}
	}
}

func appendUniqueStoryboardReferenceKey(value any, key string) []any {
	result := append([]any(nil), sliceValue(value)...)
	for _, raw := range result {
		if textValue(raw) == key {
			return result
		}
	}
	return append(result, key)
}
