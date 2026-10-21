package energon

// 实际衔接只读取已保存正文；引用原句由 Team 再次验证，规划不能变成事实。
const writingContinuityOutputPrompt = "整理saved_body已经发生的事实，不写正文、不把plan/未来资料当事实。synopsis简洁记录实际剧情；end_state概述结束状态。facts逐条给出text和正文原句quote。character_changes只列正文证实的变化：character_id引用已有身份、aspect为state或knowledge、key为稳定的具体主题（位置、伤势、知道寄信人等），value是该时刻状态，quote必须逐字来自saved_body。未证实未知信息不可推断为已知。threads列新埋/推进/本章解决的线索：已有线索保留id，新线索id留空；status为open/resolved，text明确内容，quote为本章证据。旧线索未提及就不要输出，不得因为本章没提到而标为解决。findings核对本章plan覆盖及前文事实/时间/知识/人物关系/线索一致性；每项code为plan_coverage或continuity，message指出具体问题及对应计划/前文，evidence给出本章原句；无问题为[]。所有资料仅从saved_body和actual_history取证，不能杜撰证据。"

func writingContinuityOutputProperties() map[string]any {
	evidence := writingObject(map[string]any{"text": writingString(), "quote": writingString()}, "text", "quote")
	state := writingObject(map[string]any{
		"character_id": writingString(), "aspect": map[string]any{"type": "string", "enum": []string{"state", "knowledge"}}, "key": writingString(), "value": writingString(), "quote": writingString(),
	}, "character_id", "aspect", "key", "value", "quote")
	thread := writingObject(map[string]any{
		"id": writingString(), "status": map[string]any{"type": "string", "enum": []string{"open", "resolved"}}, "text": writingString(), "quote": writingString(),
	}, "id", "status", "text", "quote")
	finding := writingObject(map[string]any{
		"code": map[string]any{"type": "string", "enum": []string{"plan_coverage", "continuity"}}, "message": writingString(), "evidence": writingString(),
	}, "code", "message", "evidence")
	return map[string]any{"synopsis": writingString(), "end_state": writingString(), "facts": writingArray(evidence), "character_changes": writingArray(state), "threads": writingArray(thread), "findings": writingArray(finding)}
}
