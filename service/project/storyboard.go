package project

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
)

const (
	storyboardType            = "storyboard"
	storyboardVersion         = botmodel.StoryboardVersion
	storyboardWorkflowDraft   = "draft"
	storyboardWorkflowConfirm = "confirmed"
	storyboardMaxSearchDepth  = 12
	storyboardDefaultAspect   = "16:9"
)

var storyboardWrapperKeys = [...]string{
	"storyboard",
	"json",
	"output",
	"result",
	"data",
	"content",
	"body",
	"value",
	"text",
	"finalOutput",
	"final_output",
	"rich",
}

type ConfirmStoryboardRequest struct {
	AssetID   uint64
	VersionID uint64
}

type CreateStoryboardRevisionRequest struct {
	AssetID   uint64
	VersionID uint64
	RequestID string
	NodeKey   string
}

func (s Service) ConfirmStoryboard(ctx context.Context, projectID uint64, req ConfirmStoryboardRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"confirm-storyboard",
		fmt.Sprintf("%d", req.AssetID),
		fmt.Sprintf("%d", req.VersionID),
	}, func() (map[string]any, error) {
		asset := s.asset.FindProjectAsset(ctx, projectID, req.AssetID)
		if asset == nil {
			return nil, fmt.Errorf("分镜资产不存在")
		}
		versionID := req.VersionID
		if versionID == 0 {
			versionID = asset.VersionID
		}
		if versionID != asset.VersionID {
			return nil, fmt.Errorf("历史分镜版本不能确认，请先创建修订稿")
		}
		version := s.asset.FindVersion(ctx, versionID)
		if version == nil || version.AssetID != asset.ID {
			return nil, fmt.Errorf("分镜版本不存在")
		}
		document, ok := storyboardDocument(assetservice.VersionToMap(*version)["content"])
		if !ok {
			return nil, fmt.Errorf("当前内容不是分镜脚本")
		}
		if storyboardStatus(document) == storyboardWorkflowConfirm {
			return map[string]any{
				"asset": s.asset.AssetDetailMap(ctx, *asset, version),
			}, nil
		}
		if err := validateStoryboard(document); err != nil {
			return nil, err
		}
		document["workflow"] = map[string]any{
			"status":       storyboardWorkflowConfirm,
			"confirmed_at": time.Now().UTC().Format(time.RFC3339),
		}
		updatedAsset, updatedVersion, err := s.asset.UpdateVersionContent(
			ctx,
			projectID,
			asset.ID,
			version.ID,
			document,
		)
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *updatedAsset, updatedVersion),
		}, nil
	})
}

func (s Service) CreateStoryboardRevision(ctx context.Context, projectID uint64, req CreateStoryboardRevisionRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"revise-storyboard",
		fmt.Sprintf("%d", req.AssetID),
		fmt.Sprintf("%d", req.VersionID),
		strings.TrimSpace(req.RequestID),
	}, func() (map[string]any, error) {
		asset := s.asset.FindProjectAsset(ctx, projectID, req.AssetID)
		if asset == nil {
			return nil, fmt.Errorf("分镜资产不存在")
		}
		versionID := req.VersionID
		if versionID == 0 {
			versionID = asset.VersionID
		}
		version := s.asset.FindVersion(ctx, versionID)
		if version == nil || version.AssetID != asset.ID {
			return nil, fmt.Errorf("分镜版本不存在")
		}
		document, ok := storyboardDocument(assetservice.VersionToMap(*version)["content"])
		if !ok {
			return nil, fmt.Errorf("当前内容不是分镜脚本")
		}
		if storyboardStatus(document) != storyboardWorkflowConfirm {
			return nil, fmt.Errorf("只有已确认分镜才能创建修订稿")
		}
		if err := validateStoryboard(document); err != nil {
			return nil, err
		}
		document["workflow"] = map[string]any{
			"status":       storyboardWorkflowDraft,
			"confirmed_at": "",
		}
		clonedAsset, clonedVersion, err := s.asset.CloneProjectVersion(ctx, assetservice.CloneProjectVersionRequest{
			ProjectID: projectID,
			AssetID:   asset.ID,
			VersionID: version.ID,
			RequestID: req.RequestID,
			NodeKey:   req.NodeKey,
			Content:   document,
		})
		if err != nil {
			return nil, err
		}
		return map[string]any{
			"asset": s.asset.AssetDetailMap(ctx, *clonedAsset, clonedVersion),
		}, nil
	})
}

func (s Service) editableAssetVersionContent(ctx context.Context, projectID uint64, req UpdateAssetVersionRequest) (any, error) {
	asset := s.asset.FindProjectAsset(ctx, projectID, req.AssetID)
	if asset == nil {
		return nil, fmt.Errorf("资产不存在")
	}
	versionID := req.VersionID
	if versionID == 0 {
		versionID = asset.VersionID
	}
	version := s.asset.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("资产版本不存在")
	}
	current, isStoryboard := storyboardDocument(assetservice.VersionToMap(*version)["content"])
	if !isStoryboard {
		return req.Content, nil
	}
	if storyboardStatus(current) == storyboardWorkflowConfirm {
		return nil, fmt.Errorf("分镜已确认，不能直接修改，请先创建修订稿")
	}
	incoming, ok := storyboardDocument(req.Content)
	if !ok {
		return nil, fmt.Errorf("分镜版本内容格式无效")
	}
	if version, ok := storyboardNumber(incoming["version"]); !ok || int(version) != storyboardVersion {
		return nil, fmt.Errorf("分镜版本必须为 %d", storyboardVersion)
	}
	visualMode := botmodel.NormalizeStoryboardVisualMode(storyboardText(incoming["visual_mode"]))
	if !botmodel.IsStoryboardVisualMode(visualMode) {
		return nil, fmt.Errorf("分镜画面类型必须是 photoreal 或 stylized")
	}
	aspectRatio, ok := storyboardAspectRatio(incoming["aspect_ratio"])
	if !ok {
		return nil, fmt.Errorf("分镜画幅必须是 16:9、9:16、1:1、4:3、3:4 或 21:9")
	}
	incoming["visual_mode"] = visualMode
	incoming["aspect_ratio"] = aspectRatio
	incoming["workflow"] = map[string]any{
		"status":       storyboardWorkflowDraft,
		"confirmed_at": "",
	}
	return incoming, nil
}

func storyboardDocument(value any) (map[string]any, bool) {
	return findStoryboardDocument(value, 0)
}

func findStoryboardDocument(value any, depth int) (map[string]any, bool) {
	if depth > storyboardMaxSearchDepth || value == nil {
		return nil, false
	}
	if text, ok := value.(string); ok {
		var decoded any
		if json.Unmarshal([]byte(strings.TrimSpace(text)), &decoded) != nil {
			return nil, false
		}
		return findStoryboardDocument(decoded, depth+1)
	}
	if values, ok := value.([]any); ok {
		for _, item := range values {
			if document, found := findStoryboardDocument(item, depth+1); found {
				return document, true
			}
		}
		return nil, false
	}
	document, ok := value.(map[string]any)
	if !ok {
		return nil, false
	}
	if strings.ToLower(storyboardText(document["type"])) == storyboardType {
		return cloneStoryboardDocument(document)
	}
	for _, key := range storyboardWrapperKeys {
		candidate, exists := document[key]
		if !exists || candidate == nil {
			continue
		}
		if storyboard, found := findStoryboardDocument(candidate, depth+1); found {
			return storyboard, true
		}
	}
	return nil, false
}

func cloneStoryboardDocument(document map[string]any) (map[string]any, bool) {
	raw, err := json.Marshal(document)
	if err != nil {
		return nil, false
	}
	var clone map[string]any
	if json.Unmarshal(raw, &clone) != nil {
		return nil, false
	}
	return clone, true
}

func storyboardStatus(document map[string]any) string {
	workflow, _ := document["workflow"].(map[string]any)
	if strings.ToLower(storyboardText(workflow["status"])) == storyboardWorkflowConfirm {
		return storyboardWorkflowConfirm
	}
	return storyboardWorkflowDraft
}

func validateStoryboard(document map[string]any) error {
	if version, ok := storyboardNumber(document["version"]); !ok || int(version) != storyboardVersion {
		return fmt.Errorf("分镜版本必须为 %d", storyboardVersion)
	}
	if storyboardText(document["title"]) == "" {
		return fmt.Errorf("分镜标题不能为空")
	}
	targetDuration, ok := storyboardInteger(document["target_duration"])
	if !ok || targetDuration < botmodel.StoryboardMinShotDuration {
		return fmt.Errorf("分镜目标总时长必须是不小于 %d 秒的整数", botmodel.StoryboardMinShotDuration)
	}
	targetShotCount, ok := storyboardInteger(document["target_shot_count"])
	if !ok || targetShotCount < 1 || targetShotCount > botmodel.StoryboardMaxShots {
		return fmt.Errorf("分镜目标镜头数必须是 1 到 %d 的整数", botmodel.StoryboardMaxShots)
	}
	if _, ok := document["narrator_voice"].(string); !ok {
		return fmt.Errorf("分镜旁白音色格式无效")
	}
	if err := validateStoryboardStoryline(document["storyline"]); err != nil {
		return err
	}
	if storyboardText(document["style_prompt"]) == "" {
		return fmt.Errorf("分镜统一视觉风格不能为空")
	}
	visualMode := botmodel.NormalizeStoryboardVisualMode(storyboardText(document["visual_mode"]))
	if !botmodel.IsStoryboardVisualMode(visualMode) {
		return fmt.Errorf("分镜画面类型必须是 photoreal 或 stylized")
	}
	document["visual_mode"] = visualMode
	aspectRatio, ok := storyboardAspectRatio(document["aspect_ratio"])
	if !ok {
		return fmt.Errorf("分镜画幅必须是 16:9、9:16、1:1、4:3、3:4 或 21:9")
	}
	document["aspect_ratio"] = aspectRatio
	if _, ok := document["references"].([]any); !ok {
		return fmt.Errorf("分镜参考素材必须是数组")
	}
	materialTypes, err := storyboardMaterialTypes(document["materials"])
	if err != nil {
		return err
	}
	shots, ok := document["shots"].([]any)
	if !ok || len(shots) == 0 {
		return fmt.Errorf("分镜至少需要一个镜头")
	}
	if len(shots) > botmodel.StoryboardMaxShots {
		return fmt.Errorf("分镜不能超过 %d 个镜头", botmodel.StoryboardMaxShots)
	}
	if len(shots) != targetShotCount {
		return fmt.Errorf("分镜目标镜头数与实际镜头数不一致")
	}
	shotIDs := map[string]struct{}{}
	speechIDs := map[string]struct{}{}
	captionIDs := map[string]struct{}{}
	shotDescriptions := make([]string, 0, len(shots))
	var previousMaterialIDs map[string]struct{}
	previousVisibleDialogue := false
	continuityChainLength := 0
	totalDuration := 0
	for shotIndex, value := range shots {
		shot, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("镜头 %d 格式无效", shotIndex+1)
		}
		shotID := storyboardText(shot["id"])
		if shotID == "" {
			return fmt.Errorf("镜头 %d 缺少稳定 ID", shotIndex+1)
		}
		if _, exists := shotIDs[shotID]; exists {
			return fmt.Errorf("镜头 ID %s 重复", shotID)
		}
		shotIDs[shotID] = struct{}{}
		order, ok := storyboardNumber(shot["order"])
		if !ok || order != float64(shotIndex+1) {
			return fmt.Errorf("镜头 %d 排序无效", shotIndex+1)
		}
		duration, ok := storyboardNumber(shot["duration"])
		if !ok || !botmodel.IsStoryboardShotDurationValid(duration) {
			return fmt.Errorf("镜头 %d 时长必须是不小于 %d 秒的整数", shotIndex+1, botmodel.StoryboardMinShotDuration)
		}
		totalDuration += int(duration)
		if storyboardText(shot["beat"]) == "" {
			return fmt.Errorf("镜头 %d 缺少本镜叙事作用", shotIndex+1)
		}
		transition, ok := shot["transition"].(string)
		if !ok {
			return fmt.Errorf("镜头 %d 的承接关系格式无效", shotIndex+1)
		}
		transition = strings.TrimSpace(transition)
		if shotIndex == 0 {
			shot["transition"] = ""
		} else if transition == "" {
			return fmt.Errorf("镜头 %d 必须说明与上一镜头的承接关系", shotIndex+1)
		}
		transitionTypeValue, ok := shot["transition_type"].(string)
		transitionType := botmodel.NormalizeStoryboardTransitionType(transitionTypeValue)
		if !ok || strings.TrimSpace(transitionTypeValue) == "" || !botmodel.IsStoryboardTransitionType(transitionType) {
			return fmt.Errorf("镜头 %d 的结构化转场类型无效", shotIndex+1)
		}
		transitionDurationMS, ok := storyboardInteger(shot["transition_duration_ms"])
		if !ok || transitionDurationMS < 0 || transitionDurationMS > 5000 {
			return fmt.Errorf("镜头 %d 的转场时长必须是 0 到 5000 毫秒的整数", shotIndex+1)
		}
		if shotIndex == 0 {
			if transitionType != botmodel.StoryboardTransitionNone || transitionDurationMS != 0 {
				return fmt.Errorf("第一个镜头不能配置转场效果")
			}
		} else if transitionType == botmodel.StoryboardTransitionNone {
			if transitionDurationMS != 0 {
				return fmt.Errorf("镜头 %d 使用硬切时转场时长必须为 0", shotIndex+1)
			}
		} else if transitionDurationMS < 100 {
			return fmt.Errorf("镜头 %d 启用转场时转场时长不能小于 100 毫秒", shotIndex+1)
		}
		shot["transition_type"] = transitionType
		shot["transition_duration_ms"] = transitionDurationMS
		shotDescription := storyboardText(shot["description"])
		if shotDescription == "" {
			return fmt.Errorf("镜头 %d 缺少镜头描述", shotIndex+1)
		}
		shotDescriptions = append(shotDescriptions, shotDescription)
		if _, ok := shot["camera_instruction"].(string); !ok {
			return fmt.Errorf("镜头 %d 的镜头语言格式无效", shotIndex+1)
		}
		if storyboardText(shot["video_prompt"]) == "" {
			return fmt.Errorf("镜头 %d 缺少视频提示词", shotIndex+1)
		}
		if _, ok := shot["reference_keys"].([]any); !ok {
			return fmt.Errorf("镜头 %d 的参考键必须是数组", shotIndex+1)
		}
		matchPrevious, ok := shot["match_previous"].(bool)
		if !ok {
			return fmt.Errorf("镜头 %d 的画面匹配配置无效", shotIndex+1)
		}
		continuePrevious, ok := shot["continue_previous"].(bool)
		if !ok {
			return fmt.Errorf("镜头 %d 的连续性配置无效", shotIndex+1)
		}
		if shotIndex == 0 && (matchPrevious || continuePrevious) {
			return fmt.Errorf("第一个镜头不能匹配或延续上一镜头")
		}
		if matchPrevious && continuePrevious {
			return fmt.Errorf("镜头 %d 不能同时匹配上一镜画面和延续上一镜视频", shotIndex+1)
		}
		continuityAnchor, ok := shot["continuity_anchor"].(string)
		if !ok {
			return fmt.Errorf("镜头 %d 的连续性锚点格式无效", shotIndex+1)
		}
		continuityAnchor = strings.TrimSpace(continuityAnchor)
		if continuePrevious && continuityAnchor == "" {
			return fmt.Errorf("镜头 %d 承接上一镜头时必须填写连续性锚点", shotIndex+1)
		}
		if continuePrevious {
			continuityChainLength++
			if continuityChainLength >= 3 {
				return fmt.Errorf("镜头 %d 所在连续镜头链不能超过 3 个镜头", shotIndex+1)
			}
		} else {
			shot["continuity_anchor"] = ""
			continuityChainLength = 0
		}
		materialIDs, err := storyboardShotMaterialIDs(shot["material_ids"], shotIndex, materialTypes)
		if err != nil {
			return err
		}
		if continuePrevious && !sameStoryboardMaterialIDSet(previousMaterialIDs, materialIDs) {
			return fmt.Errorf("镜头 %d 连续镜头不能新增、移除或更换角色、场景或道具", shotIndex+1)
		}
		visibleDialogue, err := validateStoryboardSpeech(shot, shotIndex, duration, speechIDs, materialTypes, materialIDs)
		if err != nil {
			return err
		}
		if continuePrevious && (previousVisibleDialogue || visibleDialogue) {
			return fmt.Errorf("镜头 %d 的出镜对白不能跨越连续镜头边界", shotIndex+1)
		}
		if err := validateStoryboardCaptions(shot, shotIndex, duration, captionIDs); err != nil {
			return err
		}
		previousMaterialIDs = materialIDs
		previousVisibleDialogue = visibleDialogue
	}
	if totalDuration != targetDuration {
		return fmt.Errorf("分镜目标总时长与镜头时长之和不一致")
	}
	if storyboardText(document["summary"]) == "" {
		storyline, _ := document["storyline"].(map[string]any)
		summary := botmodel.StoryboardSummaryFromStoryline(
			storyboardText(storyline["setup"]),
			storyboardText(storyline["development"]),
			storyboardText(storyline["payoff"]),
		)
		if summary == "" {
			summary = strings.Join(shotDescriptions, "；")
		}
		document["summary"] = summary
	}
	if err := validateStoredStoryboardReferences(document); err != nil {
		return err
	}
	return nil
}

func validateStoryboardStoryline(value any) error {
	storyline, ok := value.(map[string]any)
	if !ok {
		return fmt.Errorf("分镜叙事主线格式无效")
	}
	for _, field := range []struct {
		key   string
		label string
	}{
		{key: "setup", label: "故事起点"},
		{key: "development", label: "核心推进"},
		{key: "payoff", label: "结果落点"},
	} {
		if storyboardText(storyline[field.key]) == "" {
			return fmt.Errorf("分镜%s不能为空", field.label)
		}
	}
	return nil
}

func storyboardAspectRatio(value any) (string, bool) {
	text := storyboardText(value)
	if text == "" {
		return storyboardDefaultAspect, true
	}
	switch text {
	case "16:9", "9:16", "1:1", "4:3", "3:4", "21:9":
		return text, true
	default:
		return "", false
	}
}

func storyboardMaterialTypes(value any) (map[string]string, error) {
	materials, ok := value.([]any)
	if !ok {
		return nil, fmt.Errorf("分镜素材清单格式无效")
	}
	result := make(map[string]string, len(materials))
	materialNames := make(map[string]struct{}, len(materials))
	for index, value := range materials {
		material, ok := value.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("素材 %d 格式无效", index+1)
		}
		id := storyboardText(material["id"])
		if id == "" {
			return nil, fmt.Errorf("素材 %d 缺少稳定 ID", index+1)
		}
		if _, exists := result[id]; exists {
			return nil, fmt.Errorf("素材 ID %s 重复", id)
		}
		materialType := strings.ToLower(storyboardText(material["type"]))
		if materialType != "character" && materialType != "scene" && materialType != "prop" {
			return nil, fmt.Errorf("素材 %d 类型无效", index+1)
		}
		materialName := storyboardText(material["name"])
		if materialName == "" {
			return nil, fmt.Errorf("素材 %d 名称不能为空", index+1)
		}
		nameKey := strings.ToLower(materialName)
		if _, exists := materialNames[nameKey]; exists {
			return nil, fmt.Errorf("素材名称 %s 重复", materialName)
		}
		materialNames[nameKey] = struct{}{}
		if storyboardText(material["prompt"]) == "" {
			return nil, fmt.Errorf("素材 %d 提示词不能为空", index+1)
		}
		voice, ok := material["voice"].(string)
		if !ok {
			return nil, fmt.Errorf("素材 %d 的音色格式无效", index+1)
		}
		if materialType != "character" && strings.TrimSpace(voice) != "" {
			return nil, fmt.Errorf("素材 %d 只有角色可以配置音色", index+1)
		}
		if _, ok := material["reference_keys"].([]any); !ok {
			return nil, fmt.Errorf("素材 %d 的参考键必须是数组", index+1)
		}
		result[id] = materialType
	}
	return result, nil
}

func storyboardShotMaterialIDs(value any, shotIndex int, materialTypes map[string]string) (map[string]struct{}, error) {
	items, ok := value.([]any)
	if !ok {
		return nil, fmt.Errorf("镜头 %d 的素材引用必须是数组", shotIndex+1)
	}
	result := make(map[string]struct{}, len(items))
	for materialIndex, value := range items {
		id, ok := value.(string)
		id = strings.TrimSpace(id)
		if !ok || id == "" {
			return nil, fmt.Errorf("镜头 %d 的素材引用 %d 格式无效", shotIndex+1, materialIndex+1)
		}
		if _, exists := materialTypes[id]; !exists {
			return nil, fmt.Errorf("镜头 %d 引用了不存在的素材 %s", shotIndex+1, id)
		}
		if _, exists := result[id]; exists {
			return nil, fmt.Errorf("镜头 %d 重复引用素材 %s", shotIndex+1, id)
		}
		result[id] = struct{}{}
	}
	return result, nil
}

func sameStoryboardMaterialIDSet(left map[string]struct{}, right map[string]struct{}) bool {
	if len(left) != len(right) {
		return false
	}
	for id := range left {
		if _, exists := right[id]; !exists {
			return false
		}
	}
	return true
}

func validateStoryboardSpeech(
	shot map[string]any,
	shotIndex int,
	duration float64,
	usedIDs map[string]struct{},
	materialTypes map[string]string,
	shotMaterialIDs map[string]struct{},
) (bool, error) {
	speech, ok := shot["speech"].([]any)
	if !ok {
		return false, fmt.Errorf("镜头 %d 的语音必须是数组", shotIndex+1)
	}
	visibleCharacterID := ""
	windows := make([]storyboardSpeechWindow, 0, len(speech))
	for speechIndex, value := range speech {
		item, ok := value.(map[string]any)
		if !ok {
			return false, fmt.Errorf("镜头 %d 的语音 %d 格式无效", shotIndex+1, speechIndex+1)
		}
		id := storyboardText(item["id"])
		if id == "" {
			return false, fmt.Errorf("镜头 %d 的语音 %d 缺少稳定 ID", shotIndex+1, speechIndex+1)
		}
		if _, exists := usedIDs[id]; exists {
			return false, fmt.Errorf("语音 ID %s 重复", id)
		}
		usedIDs[id] = struct{}{}
		kind := strings.ToLower(storyboardText(item["kind"]))
		if kind != "dialogue" && kind != "narration" {
			return false, fmt.Errorf("镜头 %d 的语音 %d 类型无效", shotIndex+1, speechIndex+1)
		}
		if storyboardText(item["text"]) == "" {
			return false, fmt.Errorf("镜头 %d 的语音 %d 文本不能为空", shotIndex+1, speechIndex+1)
		}
		startTime, ok := storyboardNumber(item["start_time"])
		if !ok || startTime < 0 || startTime >= duration {
			return false, fmt.Errorf("镜头 %d 的语音 %d 开始时间超出镜头范围", shotIndex+1, speechIndex+1)
		}
		windows = append(windows, storyboardSpeechWindow{
			id:    id,
			start: startTime,
			end:   startTime + botmodel.EstimateStoryboardSpeechDuration(storyboardText(item["text"])),
		})
		if _, ok := item["subtitle_enabled"].(bool); !ok {
			return false, fmt.Errorf("镜头 %d 的语音 %d 字幕开关格式无效", shotIndex+1, speechIndex+1)
		}
		if _, ok := item["subtitle_text"].(string); !ok {
			return false, fmt.Errorf("镜头 %d 的语音 %d 字幕文本格式无效", shotIndex+1, speechIndex+1)
		}
		if kind != "dialogue" {
			continue
		}
		characterID := storyboardText(item["character_id"])
		if materialTypes[characterID] != "character" {
			return false, fmt.Errorf("镜头 %d 的语音 %d 未选择有效角色", shotIndex+1, speechIndex+1)
		}
		if _, exists := shotMaterialIDs[characterID]; !exists {
			return false, fmt.Errorf("镜头 %d 的语音 %d 角色未包含在镜头素材中", shotIndex+1, speechIndex+1)
		}
		speakerMode := strings.ToLower(storyboardText(item["speaker_mode"]))
		if speakerMode != "visible" && speakerMode != "offscreen" {
			return false, fmt.Errorf("镜头 %d 的语音 %d 说话方式无效", shotIndex+1, speechIndex+1)
		}
		if speakerMode != "visible" {
			continue
		}
		if visibleCharacterID != "" && visibleCharacterID != characterID {
			return false, fmt.Errorf("镜头 %d 最多只能有一个出镜说话角色", shotIndex+1)
		}
		visibleCharacterID = characterID
	}
	sort.SliceStable(windows, func(left int, right int) bool {
		return windows[left].start < windows[right].start
	})
	for index, current := range windows {
		if current.end > duration+0.01 {
			return false, fmt.Errorf("镜头 %d 的语音 %s 按正常语速无法在镜头内说完", shotIndex+1, current.id)
		}
		if index+1 < len(windows) && current.end > windows[index+1].start+0.01 {
			return false, fmt.Errorf("镜头 %d 的语音 %s 与下一条语音按正常语速会重叠", shotIndex+1, current.id)
		}
	}
	return visibleCharacterID != "", nil
}

type storyboardSpeechWindow struct {
	id    string
	start float64
	end   float64
}

func validateStoryboardCaptions(
	shot map[string]any,
	shotIndex int,
	duration float64,
	usedIDs map[string]struct{},
) error {
	captions, ok := shot["captions"].([]any)
	if !ok {
		return fmt.Errorf("镜头 %d 的字幕文案必须是数组", shotIndex+1)
	}
	for captionIndex, value := range captions {
		caption, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("镜头 %d 的字幕文案 %d 格式无效", shotIndex+1, captionIndex+1)
		}
		id := storyboardText(caption["id"])
		if id == "" {
			return fmt.Errorf("镜头 %d 的字幕文案 %d 缺少稳定 ID", shotIndex+1, captionIndex+1)
		}
		if _, exists := usedIDs[id]; exists {
			return fmt.Errorf("字幕文案 ID %s 重复", id)
		}
		usedIDs[id] = struct{}{}
		captionType := strings.ToLower(storyboardText(caption["type"]))
		if captionType != "caption" && captionType != "title" && captionType != "highlight" {
			return fmt.Errorf("镜头 %d 的字幕文案 %d 类型无效", shotIndex+1, captionIndex+1)
		}
		if storyboardText(caption["text"]) == "" {
			return fmt.Errorf("镜头 %d 的字幕文案 %d 文本不能为空", shotIndex+1, captionIndex+1)
		}
		startTime, startOK := storyboardNumber(caption["start_time"])
		endTime, endOK := storyboardNumber(caption["end_time"])
		if !startOK || !endOK || startTime < 0 || endTime <= startTime || endTime > duration {
			return fmt.Errorf("镜头 %d 的字幕文案 %d 时间范围必须位于镜头内", shotIndex+1, captionIndex+1)
		}
	}
	return nil
}

func storyboardText(value any) string {
	text, ok := value.(string)
	if !ok {
		return ""
	}
	return strings.TrimSpace(text)
}

func storyboardNumber(value any) (float64, bool) {
	switch number := value.(type) {
	case float64:
		return number, true
	case float32:
		return float64(number), true
	case int:
		return float64(number), true
	case int64:
		return float64(number), true
	case uint64:
		return float64(number), true
	case json.Number:
		result, err := number.Float64()
		return result, err == nil
	default:
		return 0, false
	}
}

func storyboardInteger(value any) (int, bool) {
	number, ok := storyboardNumber(value)
	if !ok || math.Trunc(number) != number {
		return 0, false
	}
	return int(number), true
}
