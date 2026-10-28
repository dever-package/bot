package energon

import "strconv"

// 模型只选择固定正文来源，精确原文由 Team 解析后写入现有账本。
const writingContinuityOutputPrompt = "source_passages按正文顺序完整提供已保存本章原文，每段有程序指定的短段落编号id（字符串“1”、“2”等）和text。整理其中已经发生的事实，不写正文、不把plan/未来资料当事实。synopsis简洁记录实际剧情；end_state概述结束状态。facts逐条给出事实text。character_changes只列正文证实的变化：character_id只能原样选择工具枚举里的已有身份编号，不得填姓名、aspect为state或knowledge、key为稳定的具体主题（位置、伤势、知道寄信人等），value是该时刻状态。未证实未知信息不可推断为已知。threads列新埋/推进/本章解决的线索：已有线索保留id，新线索id留空；status为open/resolved，text明确内容。旧线索未提及就不要输出，不得因为本章没提到而标为解决。findings核对本章plan覆盖及前文事实/时间/知识/人物关系/线索一致性；每项code为plan_coverage或continuity，message指出具体问题及对应计划/前文；无问题为[]。facts、character_changes、threads、findings的每一项都必须用source_id原样选择一个支持该项的本章source_passages.id，每项内容必须由所选的单段原文充分支持；跨段内容拆成各有单段依据的独立条目。不抄写或改写原句，不返回quote/evidence，不用actual_history里的旧来源ID。actual_history只供核对前文事实，不能杜撰证据。"

// 已有身份由执行所有者给出，正文和独立整理使用同一份有限选择。
func writingContinuityDeltaProperties(characters, threads []string, sourceID map[string]any) map[string]any {
	evidence := writingObject(map[string]any{"text": writingString()}, "text")
	state := writingObject(map[string]any{
		"character_id": writingChoice(characters), "aspect": writingChoice([]string{"state", "knowledge"}), "key": writingString(), "value": writingString(),
	}, "character_id", "aspect", "key", "value")
	thread := writingObject(map[string]any{
		"id": writingChoice(append([]string{""}, threads...)), "status": writingChoice([]string{"open", "resolved"}), "text": writingString(),
	}, "id", "status", "text")
	finding := writingObject(map[string]any{"code": writingChoice([]string{"plan_coverage", "continuity"}), "message": writingString()}, "code", "message")
	properties := map[string]any{"facts": writingArray(evidence), "character_changes": writingArray(state), "threads": writingArray(thread), "findings": writingArray(finding)}
	if len(characters) == 0 {
		// JSON Schema 不允许空 enum；没有角色时只能返回空变化列表。
		state["properties"].(map[string]any)["character_id"] = writingString()
		properties["character_changes"].(map[string]any)["maxItems"] = 0
	}
	if sourceID != nil {
		for _, property := range properties {
			row := property.(map[string]any)["items"].(map[string]any)
			row["properties"].(map[string]any)["source_id"] = sourceID
			row["required"] = append(row["required"].([]string), "source_id")
		}
	}
	return properties
}

func writingChoice(values []string) map[string]any {
	return map[string]any{"type": "string", "enum": append([]string(nil), values...)}
}

func writingContinuityOutputProperties(passageCount int, characters, threads []string) map[string]any {
	selectors := make([]string, passageCount)
	for index := range selectors {
		selectors[index] = strconv.Itoa(index + 1)
	}
	properties := writingContinuityDeltaProperties(characters, threads, writingChoice(selectors))
	properties["synopsis"], properties["end_state"] = writingString(), writingString()
	return properties
}
