package project

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

const (
	storyboardReferenceVisualStyle = "visual_style"
	storyboardReferenceMotionStyle = "motion_style"
	storyboardReferenceCharacter   = "character"
	storyboardReferenceScene       = "scene"
	storyboardReferenceProp        = "prop"
	storyboardReferenceShot        = "shot"
)

type canvasStoryboardReference struct {
	Key         string
	AssetID     uint64
	VersionID   uint64
	Label       string
	Kind        string
	Purpose     string
	Instruction string
}

func parseCanvasStoryboardReferences(value any, promptContent map[string]any) ([]canvasStoryboardReference, error) {
	promptReferences, err := canvasStructuredPromptReferences(promptContent)
	if err != nil {
		return nil, err
	}
	promptAssets := make(map[uint64]struct{}, len(promptReferences))
	for _, reference := range promptReferences {
		promptAssets[reference.AssetID] = struct{}{}
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
		if !isCanvasStoryboardReferenceKind(kind) || !isCanvasStoryboardReferencePurpose(kind, purpose) {
			return nil, fmt.Errorf("分镜参考素材“%s”的类型或用途无效", firstText(row["label"], key))
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
			Key:         key,
			AssetID:     assetID,
			VersionID:   firstUint64(uint64Value(row["version_id"]), uint64Value(row["versionId"])),
			Label:       firstText(row["label"], key),
			Kind:        kind,
			Purpose:     purpose,
			Instruction: textValue(row["instruction"]),
		})
	}
	return result, nil
}

func isCanvasStoryboardReferenceKind(kind string) bool {
	return kind == "image" || kind == "video"
}

func isCanvasStoryboardReferencePurpose(kind string, purpose string) bool {
	switch purpose {
	case storyboardReferenceVisualStyle, storyboardReferenceShot:
		return true
	case storyboardReferenceMotionStyle:
		return kind == "video"
	case storyboardReferenceCharacter, storyboardReferenceScene, storyboardReferenceProp:
		return kind == "image"
	default:
		return false
	}
}

func applyCanvasStoryboardReferenceInput(input map[string]any, node canvasRunNode) {
	if len(node.StoryboardReferences) == 0 || botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return
	}
	items := make([]any, 0, len(node.StoryboardReferences))
	for _, reference := range node.StoryboardReferences {
		items = append(items, map[string]any{
			"key":         reference.Key,
			"label":       reference.Label,
			"kind":        reference.Kind,
			"purpose":     reference.Purpose,
			"instruction": reference.Instruction,
		})
	}
	input["storyboard_references"] = items
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
	if err := applyStoryboardReferenceDocument(document, node.StoryboardReferences); err != nil {
		return payload, err
	}
	payload["output"] = document
	if result := mapValue(payload["result"]); result != nil {
		result["output"] = document
	}
	return payload, nil
}

func applyStoryboardReferenceDocument(document map[string]any, references []canvasStoryboardReference) error {
	applyStoryboardVisualStyleReference(document, references)
	document["references"] = canvasStoryboardReferenceMaps(references)
	return validateAndCompleteStoryboardReferenceAssignments(document, references, false)
}

func applyStoryboardVisualStyleReference(document map[string]any, references []canvasStoryboardReference) {
	if !hasCanvasStoryboardReferencePurpose(references, storyboardReferenceVisualStyle) {
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
	references, err := storedCanvasStoryboardReferences(document["references"])
	if err != nil {
		return err
	}
	return validateAndCompleteStoryboardReferenceAssignments(document, references, true)
}

func storedCanvasStoryboardReferences(value any) ([]canvasStoryboardReference, error) {
	result := make([]canvasStoryboardReference, 0)
	usedKeys := map[string]struct{}{}
	usedAssets := map[uint64]struct{}{}
	for index, raw := range sliceValue(value) {
		row := mapValue(raw)
		reference := canvasStoryboardReference{
			Key:         textValue(row["key"]),
			AssetID:     uint64Value(row["asset_id"]),
			VersionID:   uint64Value(row["version_id"]),
			Label:       textValue(row["label"]),
			Kind:        strings.ToLower(textValue(row["kind"])),
			Purpose:     strings.ToLower(textValue(row["purpose"])),
			Instruction: textValue(row["instruction"]),
		}
		if reference.Key == "" || reference.AssetID == 0 || !isCanvasStoryboardReferenceKind(reference.Kind) || !isCanvasStoryboardReferencePurpose(reference.Kind, reference.Purpose) {
			return nil, fmt.Errorf("分镜参考素材 %d 格式无效", index+1)
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
			"key":         reference.Key,
			"asset_id":    reference.AssetID,
			"version_id":  reference.VersionID,
			"label":       reference.Label,
			"kind":        reference.Kind,
			"purpose":     reference.Purpose,
			"instruction": reference.Instruction,
		})
	}
	return result
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
		keys, err := validatedStoryboardReferenceKeys(material["reference_keys"], referenceByKey, materialType, fmt.Sprintf("素材 %d", index+1), strict)
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
		keys, err := validatedStoryboardReferenceKeys(shot["reference_keys"], referenceByKey, storyboardReferenceShot, fmt.Sprintf("镜头 %d", index+1), strict)
		if err != nil {
			return err
		}
		shot["reference_keys"] = keys
		countStoryboardReferenceAssignments(assignmentCount, keys)
	}

	for _, reference := range references {
		if reference.Purpose == storyboardReferenceVisualStyle || reference.Purpose == storyboardReferenceMotionStyle {
			continue
		}
		if assignmentCount[reference.Key] > 1 {
			return fmt.Errorf("参考素材“%s”不能关联多个%s", reference.Label, storyboardReferencePurposeLabel(reference.Purpose))
		}
		if assignmentCount[reference.Key] == 1 {
			continue
		}
		var targets []map[string]any
		if reference.Purpose == storyboardReferenceShot {
			targets = shotTargets
		} else {
			targets = materialTargets[reference.Purpose]
		}
		if target := matchStoryboardReferenceTarget(reference, targets); target != nil {
			target["reference_keys"] = appendUniqueStoryboardReferenceKey(target["reference_keys"], reference.Key)
			continue
		}
		if len(targets) != 1 {
			return fmt.Errorf("参考素材“%s”尚未关联到唯一的%s", reference.Label, storyboardReferencePurposeLabel(reference.Purpose))
		}
		targets[0]["reference_keys"] = appendUniqueStoryboardReferenceKey(targets[0]["reference_keys"], reference.Key)
	}
	return nil
}

func matchStoryboardReferenceTarget(reference canvasStoryboardReference, targets []map[string]any) map[string]any {
	referenceLabels := []string{reference.Label, reference.Instruction}
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

func validatedStoryboardReferenceKeys(value any, references map[string]canvasStoryboardReference, targetPurpose string, targetLabel string, strict bool) ([]any, error) {
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
		if reference.Purpose != targetPurpose {
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

func storyboardReferencePurposeLabel(purpose string) string {
	switch purpose {
	case storyboardReferenceCharacter:
		return "角色"
	case storyboardReferenceScene:
		return "场景"
	case storyboardReferenceProp:
		return "道具"
	case storyboardReferenceShot:
		return "镜头"
	default:
		return "目标"
	}
}
