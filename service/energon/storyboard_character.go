package energon

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type storyboardCharacterShot struct {
	row  map[string]any
	text string
}

// Models occasionally describe one recurring MV protagonist without creating a
// character material. Repair that unambiguous case so every derived shot image
// shares the same generated character reference.
func ensureMVStoryboardCharacterContinuity(
	requestInput map[string]any,
	materials []any,
	shots []any,
	summary string,
	storyline map[string]any,
) ([]any, []any) {
	workType, err := botmodel.NormalizeStoryboardWorkType(
		storyboardProfileInputText(requestInput["storyboard_work_type"]),
	)
	if err != nil || workType != botmodel.StoryboardWorkTypeMV {
		return materials, shots
	}

	characterIDs, usedIDs, usedNames := storyboardCharacterMaterialState(materials)
	candidates, identityCount := storyboardCharacterShots(shots)
	if len(candidates) == 0 || identityCount > 1 || len(characterIDs) > 1 {
		return materials, shots
	}

	characterID := ""
	if len(characterIDs) == 1 {
		characterID = characterIDs[0]
	} else {
		characterID = uniqueStoryboardID("character-main", "character-main", usedIDs)
		name := uniqueStoryboardName(storyboardMVCharacterName(candidates), usedNames)
		materials = append(materials, map[string]any{
			"id":             characterID,
			"type":           "character",
			"name":           name,
			"prompt":         storyboardMVCharacterPrompt(name, summary, storyline, candidates),
			"voice":          "",
			"reference_keys": []any{},
		})
	}

	for _, candidate := range candidates {
		appendStoryboardMaterialID(candidate.row, characterID)
	}
	return materials, shots
}

func storyboardCharacterMaterialState(materials []any) ([]string, map[string]struct{}, map[string]struct{}) {
	characterIDs := make([]string, 0, 1)
	usedIDs := make(map[string]struct{}, len(materials))
	usedNames := make(map[string]struct{}, len(materials))
	for _, value := range materials {
		material, _ := value.(map[string]any)
		id := requiredString(material, "id")
		if id != "" {
			usedIDs[id] = struct{}{}
		}
		if name := requiredString(material, "name"); name != "" {
			usedNames[storyboardLookupKey(name)] = struct{}{}
		}
		if requiredString(material, "type") == "character" && id != "" {
			characterIDs = append(characterIDs, id)
		}
	}
	return characterIDs, usedIDs, usedNames
}

func storyboardCharacterShots(shots []any) ([]storyboardCharacterShot, int) {
	result := make([]storyboardCharacterShot, 0, len(shots))
	identities := make(map[string]struct{})
	for _, value := range shots {
		shot, _ := value.(map[string]any)
		text := storyboardShotVisualCharacterText(shot)
		if !storyboardHasVisualCharacter(text) || storyboardHasMultipleVisualCharacters(text) {
			continue
		}
		identity, ambiguous := storyboardVisualCharacterIdentity(text)
		if ambiguous {
			return nil, 2
		}
		if identity != "" {
			identities[identity] = struct{}{}
		}
		result = append(result, storyboardCharacterShot{row: shot, text: text})
	}
	return result, len(identities)
}

func storyboardShotVisualCharacterText(shot map[string]any) string {
	continuity, _ := shot["continuity_state"].(map[string]any)
	return strings.Join([]string{
		requiredString(shot, "beat"),
		requiredString(shot, "description"),
		requiredString(shot, "video_prompt"),
		requiredString(continuity, "entry"),
		requiredString(continuity, "exit"),
	}, " ")
}

func storyboardHasVisualCharacter(value string) bool {
	content := strings.ToLower(value)
	for _, phrase := range []string{
		"画面无人", "画面中无人", "镜头中无人", "空无一人", "没有人物", "无人物",
		"不出现人物", "不出现任何人物", "没有人出现", "无清晰人物", "no people",
		"no person", "without people", "empty of people",
	} {
		content = strings.ReplaceAll(content, phrase, "")
	}
	return containsStoryboardHint(
		content,
		"主角", "主人公", "人物", "角色", "歌手", "乐手", "舞者", "演员", "旅人", "行人",
		"女孩", "少女", "姑娘", "女人", "女子", "女性", "母亲", "妈妈",
		"男孩", "少年", "青年", "男人", "男子", "男性", "父亲", "爸爸",
		"孩子", "儿童", "老人", "老者", "老爷爷", "老奶奶",
		"他在", "她在", "他走", "她走", "他站", "她站", "他坐", "她坐",
		"他拿", "她拿", "他望", "她望", "他回", "她回", "他的", "她的",
		"protagonist", "character", "singer", "performer", "musician", "actor",
		"woman", "girl", "female", "man", "boy", "male", "child", "elderly person", "traveler",
	)
}

func storyboardHasMultipleVisualCharacters(value string) bool {
	return containsStoryboardHint(
		strings.ToLower(value),
		"人群", "众人", "多人", "两人", "二人", "二人组", "他们", "她们", "情侣", "夫妇",
		"父子", "父女", "母子", "母女", "一家人", "一群人", "crowd", "couple",
		"two people", "two characters", "several people", "multiple people",
	)
}

func storyboardVisualCharacterIdentity(value string) (string, bool) {
	content := strings.ToLower(value)
	identities := make(map[string]struct{})
	identityHints := map[string][]string{
		"female-child": {"女孩", "少女", "小姑娘", "girl", "young female"},
		"male-child":   {"男孩", "少年", "boy", "young male"},
		"female-adult": {"女人", "女子", "女性", "姑娘", "母亲", "妈妈", "woman", "adult female", "mother"},
		"male-adult":   {"男人", "男子", "男性", "青年", "父亲", "爸爸", "man", "adult male", "father"},
		"elderly":      {"老人", "老者", "老爷爷", "老奶奶", "elderly person", "old man", "old woman"},
		"child":        {"孩子", "儿童", "child"},
	}
	for identity, hints := range identityHints {
		if containsStoryboardHint(content, hints...) {
			identities[identity] = struct{}{}
		}
	}
	if len(identities) > 1 {
		return "", true
	}
	for identity := range identities {
		return identity, false
	}
	return "", false
}

func storyboardMVCharacterName(candidates []storyboardCharacterShot) string {
	content := ""
	for _, candidate := range candidates {
		content += " " + candidate.text
	}
	for _, choice := range []struct {
		name  string
		hints []string
	}{
		{name: "女孩", hints: []string{"女孩", "少女", "girl"}},
		{name: "男孩", hints: []string{"男孩", "少年", "boy"}},
		{name: "老人", hints: []string{"老人", "老者", "老爷爷", "老奶奶", "elderly person"}},
		{name: "女主角", hints: []string{"女人", "女子", "女性", "姑娘", "母亲", "woman"}},
		{name: "男主角", hints: []string{"男人", "男子", "男性", "青年", "父亲", "man"}},
		{name: "歌手", hints: []string{"歌手", "singer"}},
		{name: "舞者", hints: []string{"舞者", "dancer"}},
	} {
		if containsStoryboardHint(strings.ToLower(content), choice.hints...) {
			return choice.name
		}
	}
	return "主角"
}

func storyboardMVCharacterPrompt(
	name string,
	summary string,
	storyline map[string]any,
	candidates []storyboardCharacterShot,
) string {
	context := []string{
		summary,
		requiredString(storyline, "setup"),
		requiredString(storyline, "development"),
		requiredString(storyline, "payoff"),
	}
	for _, candidate := range candidates {
		context = append(context, candidate.text)
	}
	return fmt.Sprintf(
		"%s是本支 MV 多个相关镜头中反复出现的同一位叙事人物。根据以下内容确定角色身份：%s。固定并清楚描述其年龄段、五官、发型、体型、服装款式、服装颜色和鞋履；只描述跨镜头不变的外观，不包含场景、动作、运镜、文字或其他人物。",
		name,
		truncateStoryboardText(strings.Join(context, "；"), 480),
	)
}

func appendStoryboardMaterialID(shot map[string]any, materialID string) {
	materialIDs := storyboardStringItems(shot["material_ids"])
	for _, current := range materialIDs {
		if current == materialID {
			return
		}
	}
	result := make([]any, 0, len(materialIDs)+1)
	for _, current := range materialIDs {
		result = append(result, current)
	}
	shot["material_ids"] = append(result, materialID)
}

func truncateStoryboardText(value string, limit int) string {
	runes := []rune(strings.TrimSpace(value))
	if len(runes) <= limit {
		return string(runes)
	}
	return string(runes[:limit])
}
