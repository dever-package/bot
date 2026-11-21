package project

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	botmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
)

const (
	storyboardType             = "storyboard"
	storyboardVersion          = botmodel.StoryboardVersion
	storyboardWorkflowDraft    = "draft"
	storyboardWorkflowConfirm  = "confirmed"
	storyboardDefaultAspect    = "16:9"
	storyboardOutputImages     = "shot_images"
	storyboardOutputFinal      = "final_video"
	storyboardOutputShots      = "shot_videos"
	storyboardOutputOnly       = "storyboard_only"
	storyboardProductionAuto   = "auto"
	storyboardProductionNative = "native"
	storyboardProductionOff    = "off"
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
	AssetID           uint64
	VersionID         uint64
	ExpectedUpdatedAt string
	ProductionPlan    any
}

type CreateStoryboardRevisionRequest struct {
	AssetID                  uint64
	VersionID                uint64
	ExpectedCurrentVersionID uint64
	RequestID                string
	NodeKey                  string
}

type storyboardValidationScope struct {
	referenceImages bool
	shotVideos      bool
	speech          bool
	voice           bool
	subtitles       bool
}

func (s Service) ConfirmStoryboard(ctx context.Context, projectID uint64, req ConfirmStoryboardRequest) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if req.VersionID == 0 || strings.TrimSpace(req.ExpectedUpdatedAt) == "" {
		return nil, fmt.Errorf("缺少分镜正文版本，请刷新后再确认")
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
		if req.VersionID != asset.VersionID {
			return nil, fmt.Errorf("分镜版本已更新，请刷新后再确认")
		}
		version := s.asset.FindVersion(ctx, req.VersionID)
		if version == nil || version.AssetID != asset.ID {
			return nil, fmt.Errorf("分镜版本不存在")
		}
		if !assetservice.VersionUpdatedAtMatches(*version, req.ExpectedUpdatedAt) {
			return nil, fmt.Errorf("分镜正文已更新，请刷新核对后再确认")
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
		productionPlan, err := normalizeStoryboardProductionPlan(req.ProductionPlan)
		if err != nil {
			return nil, err
		}
		document["production_plan"] = productionPlan
		if err := validateStoryboard(document); err != nil {
			return nil, err
		}
		document["workflow"] = map[string]any{
			"status":       storyboardWorkflowConfirm,
			"confirmed_at": time.Now().UTC().Format(time.RFC3339),
		}
		updatedAsset, updatedVersion, err := s.asset.UpdateVersionContentWithBaseline(ctx, projectID, assetservice.SaveContentRequest{
			AssetID: asset.ID, ExpectedVersionID: version.ID,
			ExpectedUpdatedAt: req.ExpectedUpdatedAt,
			Content:           document,
		})
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
	if req.VersionID == 0 || req.ExpectedCurrentVersionID == 0 {
		return nil, fmt.Errorf("缺少当前分镜版本，请刷新后再创建修订稿")
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
		version := s.asset.FindVersion(ctx, req.VersionID)
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
			ProjectID:                projectID,
			AssetID:                  asset.ID,
			VersionID:                version.ID,
			ExpectedCurrentVersionID: req.ExpectedCurrentVersionID,
			RequestID:                req.RequestID,
			NodeKey:                  req.NodeKey,
			Content:                  document,
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
	currentContent := assetservice.VersionToMap(*version)["content"]
	if _, isStoryboardGrid := workspaceStoryboardGridDocument(currentContent); isStoryboardGrid {
		if asset.Kind != assetmodel.KindCollection || asset.CollectionID > 0 {
			return nil, fmt.Errorf("宫格内容必须保存为顶层集合")
		}
		incoming, ok := workspaceStoryboardGridDocument(req.Content)
		if !ok {
			return nil, fmt.Errorf("宫格版本内容格式无效")
		}
		return s.editableStoryboardGridContent(ctx, asset, incoming)
	}
	if _, setting := findWorkspaceDocument(currentContent, botmodel.OutputTypeSetting, storyboardWrapperKeys[:]); setting {
		incoming, ok := findWorkspaceDocument(req.Content, botmodel.OutputTypeSetting, storyboardWrapperKeys[:])
		if !ok {
			return nil, fmt.Errorf("设定版本内容格式无效")
		}
		return energonservice.NormalizeSettingDocument(incoming)
	}
	current, isStoryboard := storyboardDocument(currentContent)
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
	if err := editableCanvasScreenplay(current, incoming); err != nil {
		return nil, err
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
	if err := validateStoredStoryboardReferences(incoming); err != nil {
		return nil, err
	}
	if productionPlan, exists := incoming["production_plan"]; exists {
		normalized, err := normalizeStoryboardProductionPlan(productionPlan)
		if err != nil {
			return nil, err
		}
		incoming["production_plan"] = normalized
	}
	incoming["workflow"] = map[string]any{
		"status":       storyboardWorkflowDraft,
		"confirmed_at": "",
	}
	return incoming, nil
}

func storyboardDocument(value any) (map[string]any, bool) {
	document, ok := findWorkspaceDocument(
		value,
		storyboardType,
		storyboardWrapperKeys[:],
	)
	if !ok {
		return nil, false
	}
	clone, ok := cloneStoryboardDocument(document)
	if !ok {
		return nil, false
	}
	if storyboardText(clone["work_type"]) == "" {
		clone["work_type"] = botmodel.StoryboardWorkTypeShort
	}
	minShotDuration, err := botmodel.NormalizeStoryboardMinShotDuration(
		clone[botmodel.StoryboardMinShotDurationKey],
	)
	if err != nil {
		return nil, false
	}
	clone[botmodel.StoryboardMinShotDurationKey] = minShotDuration
	return clone, true
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
	if _, ok := document["narrator_voice"].(string); !ok {
		return fmt.Errorf("分镜旁白音色格式无效")
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
	productionPlan, err := normalizeStoryboardProductionPlan(document["production_plan"])
	if err != nil {
		return err
	}
	soundPolicy := botmodel.StoryboardSoundPolicyForWorkType(storyboardText(document["work_type"]))
	if !soundPolicy.GeneratedSpeech {
		productionPlan["voice_mode"] = storyboardProductionOff
	}
	if !soundPolicy.GeneratedCaptions {
		productionPlan["subtitle_mode"] = storyboardProductionOff
	}
	document["production_plan"] = productionPlan
	validationScope := storyboardValidationScopeForPlan(productionPlan)
	if _, ok := document["references"].([]any); !ok {
		return fmt.Errorf("分镜参考素材必须是数组")
	}
	materialTypes, err := storyboardMaterialTypes(document["materials"], validationScope.referenceImages)
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
	shotIDs := map[string]struct{}{}
	speechIDs := map[string]struct{}{}
	captionIDs := map[string]struct{}{}
	shotDescriptions := make([]string, 0, len(shots))
	lyricShotPlans := make([]botmodel.StoryboardLyricShotPlan, 0, len(shots))
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
		lyricLineIndexes := storedStoryboardLyricLineIndexes(shot["lyric_line_indexes"])
		shot["lyric_line_indexes"] = lyricLineIndexes
		lyricShotPlan := botmodel.StoryboardLyricShotPlan{Duration: int(duration)}
		for _, value := range lyricLineIndexes {
			lyricShotPlan.LineIndexes = append(lyricShotPlan.LineIndexes, value.(int))
		}
		lyricShotPlans = append(lyricShotPlans, lyricShotPlan)
		_, ok = shot["transition"].(string)
		if !ok {
			return fmt.Errorf("镜头 %d 的承接关系格式无效", shotIndex+1)
		}
		if shotIndex == 0 {
			shot["transition"] = ""
		}
		shot["transition_type"] = botmodel.StoryboardTransitionNone
		shot["transition_duration_ms"] = 0
		shotDescription := storyboardText(shot["description"])
		if shotDescription == "" {
			return fmt.Errorf("镜头 %d 缺少镜头描述", shotIndex+1)
		}
		shotDescriptions = append(shotDescriptions, shotDescription)
		if _, ok := shot["camera_instruction"].(string); !ok {
			return fmt.Errorf("镜头 %d 的镜头语言格式无效", shotIndex+1)
		}
		for _, field := range []string{"spatial_layout", "start_framing", "end_framing"} {
			if value, exists := shot[field]; exists {
				if _, ok := value.(string); !ok {
					return fmt.Errorf("镜头 %d 的空间与构图字段格式无效", shotIndex+1)
				}
			} else {
				// Version 9 historical storyboards may predate these production fields.
				shot[field] = ""
			}
		}
		if validationScope.shotVideos && storyboardText(shot["video_prompt"]) == "" {
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
			return fmt.Errorf("镜头 %d 不能同时另起机位和沿用上一镜尾图", shotIndex+1)
		}
		shot["shot_image_mode"] = botmodel.StoryboardShotImageFirstLast
		shot["shared_end_shot_id"] = ""
		if validationScope.referenceImages {
			if _, _, err := normalizeStoredStoryboardContinuityState(shot, shotIndex); err != nil {
				return err
			}
		}
		_, ok = shot["continuity_anchor"].(string)
		if !ok {
			return fmt.Errorf("镜头 %d 的连续性锚点格式无效", shotIndex+1)
		}
		if !continuePrevious {
			shot["continuity_anchor"] = ""
		}
		materialIDs, err := storyboardShotMaterialIDs(shot["material_ids"], shotIndex, materialTypes)
		if err != nil {
			return err
		}
		if validationScope.speech {
			if _, err := validateStoryboardSpeech(
				shot,
				shotIndex,
				duration,
				speechIDs,
				materialTypes,
				materialIDs,
			); err != nil {
				return err
			}
		}
		if validationScope.subtitles {
			if err := validateStoryboardCaptions(shot, shotIndex, duration, captionIDs); err != nil {
				return err
			}
		}
	}
	document["target_duration"] = totalDuration
	document["target_shot_count"] = len(shots)
	if err := validateStoryboardTimelineRange(document); err != nil {
		return err
	}
	lyrics := botmodel.NormalizeStoryboardLyrics(storyboardText(document["lyrics_lrc"]))
	if storyboardText(document["work_type"]) == botmodel.StoryboardWorkTypeMV && len(lyrics) > 0 {
		completedPlans, err := botmodel.CompleteStoryboardLyricShotPlans(len(lyrics), lyricShotPlans)
		if err != nil {
			return fmt.Errorf("MV 歌词镜头映射无效：%w", err)
		}
		for index, plan := range completedPlans {
			indexes := make([]any, len(plan.LineIndexes))
			for lineIndex, value := range plan.LineIndexes {
				indexes[lineIndex] = value
			}
			shots[index].(map[string]any)["lyric_line_indexes"] = indexes
		}
		lyricsLRC, err := botmodel.BuildStoryboardLyricsLRCFromInput(storyboardText(document["lyrics_lrc"]), completedPlans)
		if err != nil {
			return fmt.Errorf("MV 歌词镜头映射无效：%w", err)
		}
		document["lyrics_lrc"] = lyricsLRC
	} else {
		document["lyrics_lrc"] = ""
		for _, value := range shots {
			value.(map[string]any)["lyric_line_indexes"] = []any{}
		}
	}
	if validationScope.voice {
		if err := validateStoryboardVoiceAssignments(document, shots); err != nil {
			return err
		}
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

func validateStoryboardTimelineRange(document map[string]any) error {
	if document[botmodel.StoryboardTimelineDurationMSKey] == nil {
		return nil
	}
	startMS, startOK := storyboardInteger(document[botmodel.StoryboardRangeStartMSKey])
	endMS, endOK := storyboardInteger(document[botmodel.StoryboardRangeEndMSKey])
	soundtrackDurationMS, soundtrackOK := storyboardInteger(document[botmodel.StoryboardSoundtrackDurationMSKey])
	timelineDurationMS, timelineOK := storyboardInteger(document[botmodel.StoryboardTimelineDurationMSKey])
	if !startOK || !endOK || !soundtrackOK || !timelineOK ||
		startMS < 0 || endMS <= startMS || endMS > soundtrackDurationMS ||
		timelineDurationMS != endMS-startMS {
		return fmt.Errorf("MV 制作时间范围无效")
	}

	return nil
}

func storedStoryboardLyricLineIndexes(value any) []any {
	seen := map[int]struct{}{}
	indexes := make([]int, 0)
	for _, raw := range sliceValue(value) {
		index, ok := storyboardInteger(raw)
		if !ok || index < 1 {
			continue
		}
		if _, exists := seen[index]; exists {
			continue
		}
		seen[index] = struct{}{}
		indexes = append(indexes, index)
	}
	sort.Ints(indexes)
	result := make([]any, 0, len(indexes))
	for _, index := range indexes {
		result = append(result, index)
	}
	return result
}

func validateStoryboardVoiceAssignments(document map[string]any, shots []any) error {
	speakingCharacterIDs := map[string]struct{}{}
	hasNarration := false
	for _, value := range shots {
		shot, _ := value.(map[string]any)
		speechValues, _ := shot["speech"].([]any)
		for _, speechValue := range speechValues {
			speech, _ := speechValue.(map[string]any)
			if storyboardText(speech["text"]) == "" {
				continue
			}
			if storyboardText(speech["kind"]) == "narration" {
				hasNarration = true
				continue
			}
			if characterID := storyboardText(speech["character_id"]); characterID != "" {
				speakingCharacterIDs[characterID] = struct{}{}
			}
		}
	}
	if hasNarration && storyboardText(document["narrator_voice"]) == "" {
		return fmt.Errorf("旁白未配置音色")
	}
	materials, _ := document["materials"].([]any)
	for _, value := range materials {
		material, _ := value.(map[string]any)
		if _, required := speakingCharacterIDs[storyboardText(material["id"])]; !required {
			continue
		}
		if storyboardText(material["voice"]) == "" {
			return fmt.Errorf("角色 %s 未配置音色", storyboardText(material["name"]))
		}
	}
	return nil
}

func storyboardValidationScopeForPlan(plan map[string]any) storyboardValidationScope {
	outputTarget := storyboardText(plan["output_target"])
	shotVideos := outputTarget == storyboardOutputShots || outputTarget == storyboardOutputFinal
	voiceMode := storyboardText(plan["voice_mode"])
	voice := shotVideos && voiceMode == storyboardProductionAuto
	subtitles := shotVideos && storyboardText(plan["subtitle_mode"]) == storyboardProductionAuto
	return storyboardValidationScope{
		referenceImages: outputTarget != storyboardOutputOnly,
		shotVideos:      shotVideos,
		speech:          voice || subtitles || (shotVideos && voiceMode == storyboardProductionNative),
		voice:           voice,
		subtitles:       subtitles,
	}
}

func normalizeStoredStoryboardContinuityState(shot map[string]any, shotIndex int) (string, string, error) {
	state, ok := shot["continuity_state"].(map[string]any)
	if !ok {
		return "", "", fmt.Errorf("镜头 %d 的连续状态格式无效", shotIndex+1)
	}
	entry := storyboardText(state["entry"])
	exit := storyboardText(state["exit"])
	shot["continuity_state"] = map[string]any{
		"entry": entry,
		"exit":  exit,
	}
	return entry, exit, nil
}

func normalizeStoryboardProductionPlan(value any) (map[string]any, error) {
	if value == nil {
		return defaultStoryboardProductionPlan(), nil
	}
	plan, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("分镜制作方案格式无效")
	}
	outputTarget := strings.ToLower(storyboardText(plan["output_target"]))
	if outputTarget != storyboardOutputImages && outputTarget != storyboardOutputFinal && outputTarget != storyboardOutputShots && outputTarget != storyboardOutputOnly {
		return nil, fmt.Errorf("分镜制作方案的产出目标无效")
	}
	voiceMode := strings.ToLower(storyboardText(plan["voice_mode"]))
	if voiceMode != storyboardProductionAuto && voiceMode != storyboardProductionNative && voiceMode != storyboardProductionOff {
		return nil, fmt.Errorf("分镜制作方案的声音配置无效")
	}
	subtitleMode, err := storyboardProductionMode(plan["subtitle_mode"], "字幕")
	if err != nil {
		return nil, err
	}
	strategy := strings.ToLower(storyboardText(plan["shot_visual_strategy"]))
	if strategy != "auto" {
		return nil, fmt.Errorf("分镜制作方案的镜头参考图策略无效")
	}
	return map[string]any{
		"output_target":        outputTarget,
		"voice_mode":           voiceMode,
		"subtitle_mode":        subtitleMode,
		"shot_visual_strategy": strategy,
	}, nil
}

func defaultStoryboardProductionPlan() map[string]any {
	return map[string]any{
		"output_target":        storyboardOutputImages,
		"voice_mode":           storyboardProductionAuto,
		"subtitle_mode":        storyboardProductionAuto,
		"shot_visual_strategy": "auto",
	}
}

func storyboardProductionMode(value any, label string) (string, error) {
	mode := strings.ToLower(storyboardText(value))
	if mode != storyboardProductionAuto && mode != storyboardProductionOff {
		return "", fmt.Errorf("分镜制作方案的%s配置无效", label)
	}
	return mode, nil
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

func storyboardMaterialTypes(value any, requirePrompt bool) (map[string]string, error) {
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
		if requirePrompt && storyboardText(material["prompt"]) == "" {
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
		if visibleCharacterID == "" {
			visibleCharacterID = characterID
		}
	}
	return visibleCharacterID != "", nil
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
