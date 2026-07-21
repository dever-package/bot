package project

import (
	"context"
	"encoding/json"
	"fmt"
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
		return nil, fmt.Errorf("分镜视觉模式必须是 photoreal 或 stylized")
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
	if storyboardText(document["style_prompt"]) == "" {
		return fmt.Errorf("分镜统一视觉风格不能为空")
	}
	visualMode := botmodel.NormalizeStoryboardVisualMode(storyboardText(document["visual_mode"]))
	if !botmodel.IsStoryboardVisualMode(visualMode) {
		return fmt.Errorf("分镜视觉模式必须是 photoreal 或 stylized")
	}
	document["visual_mode"] = visualMode
	aspectRatio, ok := storyboardAspectRatio(document["aspect_ratio"])
	if !ok {
		return fmt.Errorf("分镜画幅必须是 16:9、9:16、1:1、4:3、3:4 或 21:9")
	}
	document["aspect_ratio"] = aspectRatio
	materialTypes, err := storyboardMaterialTypes(document["materials"])
	if err != nil {
		return err
	}
	shots, ok := document["shots"].([]any)
	if !ok || len(shots) == 0 {
		return fmt.Errorf("分镜至少需要一个镜头")
	}
	shotIDs := map[string]struct{}{}
	speechIDs := map[string]struct{}{}
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
		if storyboardText(shot["description"]) == "" {
			return fmt.Errorf("镜头 %d 缺少镜头描述", shotIndex+1)
		}
		if _, ok := shot["camera_instruction"].(string); !ok {
			return fmt.Errorf("镜头 %d 的镜头语言格式无效", shotIndex+1)
		}
		if storyboardText(shot["video_prompt"]) == "" {
			return fmt.Errorf("镜头 %d 缺少视频提示词", shotIndex+1)
		}
		continuePrevious, ok := shot["continue_previous"].(bool)
		if !ok {
			return fmt.Errorf("镜头 %d 的连续性配置无效", shotIndex+1)
		}
		if shotIndex == 0 && continuePrevious {
			return fmt.Errorf("第一个镜头不能承接上一镜头")
		}
		materialIDs, err := storyboardShotMaterialIDs(shot["material_ids"], shotIndex, materialTypes)
		if err != nil {
			return err
		}
		if err := validateStoryboardSpeech(shot, shotIndex, duration, speechIDs, materialTypes, materialIDs); err != nil {
			return err
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
		if storyboardText(material["name"]) == "" {
			return nil, fmt.Errorf("素材 %d 名称不能为空", index+1)
		}
		if storyboardText(material["prompt"]) == "" {
			return nil, fmt.Errorf("素材 %d 提示词不能为空", index+1)
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
) error {
	speech, ok := shot["speech"].([]any)
	if !ok {
		return fmt.Errorf("镜头 %d 的语音必须是数组", shotIndex+1)
	}
	visibleCharacterID := ""
	for speechIndex, value := range speech {
		item, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("镜头 %d 的语音 %d 格式无效", shotIndex+1, speechIndex+1)
		}
		id := storyboardText(item["id"])
		if id == "" {
			return fmt.Errorf("镜头 %d 的语音 %d 缺少稳定 ID", shotIndex+1, speechIndex+1)
		}
		if _, exists := usedIDs[id]; exists {
			return fmt.Errorf("语音 ID %s 重复", id)
		}
		usedIDs[id] = struct{}{}
		kind := strings.ToLower(storyboardText(item["kind"]))
		if kind != "dialogue" && kind != "narration" {
			return fmt.Errorf("镜头 %d 的语音 %d 类型无效", shotIndex+1, speechIndex+1)
		}
		if storyboardText(item["text"]) == "" {
			return fmt.Errorf("镜头 %d 的语音 %d 文本不能为空", shotIndex+1, speechIndex+1)
		}
		startTime, ok := storyboardNumber(item["start_time"])
		if !ok || startTime < 0 || startTime >= duration {
			return fmt.Errorf("镜头 %d 的语音 %d 开始时间超出镜头范围", shotIndex+1, speechIndex+1)
		}
		if kind != "dialogue" {
			continue
		}
		characterID := storyboardText(item["character_id"])
		if materialTypes[characterID] != "character" {
			return fmt.Errorf("镜头 %d 的语音 %d 未选择有效角色", shotIndex+1, speechIndex+1)
		}
		if _, exists := shotMaterialIDs[characterID]; !exists {
			return fmt.Errorf("镜头 %d 的语音 %d 角色未包含在镜头素材中", shotIndex+1, speechIndex+1)
		}
		speakerMode := strings.ToLower(storyboardText(item["speaker_mode"]))
		if speakerMode != "visible" && speakerMode != "offscreen" {
			return fmt.Errorf("镜头 %d 的语音 %d 说话方式无效", shotIndex+1, speechIndex+1)
		}
		if speakerMode != "visible" {
			continue
		}
		if visibleCharacterID != "" && visibleCharacterID != characterID {
			return fmt.Errorf("镜头 %d 最多只能有一个出镜说话角色", shotIndex+1)
		}
		visibleCharacterID = characterID
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
