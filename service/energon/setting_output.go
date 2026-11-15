package energon

import (
	"fmt"

	botmodel "github.com/dever-package/bot/model/energon"
)

// Setting and storyboard share material identities and the image production contract.
func storyboardMaterialSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":             map[string]any{"type": "string", "minLength": 1},
			"type":           map[string]any{"type": "string", "enum": []any{"character", "scene", "prop"}},
			"name":           map[string]any{"type": "string", "minLength": 1},
			"prompt":         map[string]any{"type": "string", "minLength": 1, "description": storyboardMaterialPromptDescription},
			"voice":          map[string]any{"type": "string"},
			"reference_keys": map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}, "uniqueItems": true},
		},
		"required":             []any{"id", "type", "name", "prompt", "voice", "reference_keys"},
		"additionalProperties": false,
	}
}

func settingOutputContract(_ powerOutputContractContext) (powerOutputContract, error) {
	return powerOutputContract{
		Type:        "设定",
		Description: "提交角色、场景和道具设定，供多个分镜共用。",
		Prompt:      "根据用户内容提取需要的角色、场景和道具，提交 submit_output。输入中的 " + botmodel.SettingSourceInputKey + " 是用户引用的上游故事或资料原文，素材必须来自其中出场的实体，保留原有名称与身份。只生成素材设定，不生成镜头。每个素材提供唯一且稳定的 id、名称及完整的视觉描述；同一实体只出现一次，类型为 character、scene 或 prop。prompt 描述该素材自身的外观、服装、环境或造型，供单独生成参考图，不加入剧情动作和镜头切换。没有出场的类别可以为空，不为凑数量添加素材。画风、画幅遵循用户需求。",
		Schema: map[string]any{
			"type": "object",
			"properties": map[string]any{
				"type":         map[string]any{"type": "string", "enum": []any{botmodel.OutputTypeSetting}},
				"version":      map[string]any{"type": "integer", "enum": []any{1}},
				"title":        map[string]any{"type": "string", "minLength": 1},
				"style_prompt": map[string]any{"type": "string", "minLength": 1},
				"visual_mode":  map[string]any{"type": "string", "enum": []any{botmodel.StoryboardVisualModePhotoreal, botmodel.StoryboardVisualModeStylized}},
				"aspect_ratio": map[string]any{"type": "string", "enum": []any{"16:9", "9:16", "1:1", "4:3", "3:4", "21:9"}},
				"materials":    map[string]any{"type": "array", "minItems": 1, "items": storyboardMaterialSchema()},
			},
			"required":             []any{"type", "version", "title", "style_prompt", "visual_mode", "aspect_ratio", "materials"},
			"additionalProperties": false,
		},
		Normalize: normalizeSettingOutput,
	}, nil
}

func normalizeSettingOutput(output, _ map[string]any) (map[string]any, error) {
	return NormalizeSettingDocument(output)
}

// NormalizeSettingDocument is shared by generation and edits of saved settings.
func NormalizeSettingDocument(output map[string]any) (map[string]any, error) {
	version, validVersion := integerValue(output["version"])
	if output["type"] != botmodel.OutputTypeSetting || !validVersion || version != 1 {
		return nil, fmt.Errorf("设定格式或版本无效")
	}
	items, ok := storyboardValueItems(output["materials"])
	if !ok {
		return nil, fmt.Errorf("materials 必须是素材数组")
	}
	ids := map[string]bool{}
	names := map[string]bool{}
	for _, raw := range items {
		item, ok := raw.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("设定素材格式无效")
		}
		id := requiredString(item, "id")
		if id == "" || ids[id] || requiredString(item, "name") == "" || requiredString(item, "prompt") == "" {
			return nil, fmt.Errorf("设定素材需要唯一 ID、名称和外观描述")
		}
		name := requiredString(item, "name")
		key := storyboardLookupKey(name)
		if names[key] {
			return nil, fmt.Errorf("设定素材名称不能重复: %s", name)
		}
		names[key] = true
		ids[id] = true
	}
	materials, _, _, err := normalizeStoryboardMaterials(output["materials"])
	if err != nil {
		return nil, err
	}
	mode := requiredString(output, "visual_mode")
	ratio := requiredString(output, "aspect_ratio")
	if normalizeStoryboardAspectRatio(ratio) != ratio {
		return nil, fmt.Errorf("无效的设定画幅: %s", ratio)
	}
	if len(materials) == 0 || requiredString(output, "title") == "" || requiredString(output, "style_prompt") == "" || !botmodel.IsStoryboardVisualMode(mode) || ratio == "" {
		return nil, fmt.Errorf("设定必须包含标题、画风、有效画幅和至少一个角色、场景或道具")
	}
	return map[string]any{
		"type": botmodel.OutputTypeSetting, "version": 1, "title": requiredString(output, "title"),
		"style_prompt": requiredString(output, "style_prompt"), "visual_mode": mode, "aspect_ratio": ratio, "materials": materials,
	}, nil
}
