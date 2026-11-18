package energon

import (
	"fmt"
	"strings"
)

const writingChapterBodyPrompt = "本次只写unit指定的这一章，原始需求和outline是全书背景，不是本次整篇写作任务。context_scope.target_unit_ids只允许本章；正文从本章plan的起点推进，停在本章plan规定的章末事件。neighboring_units仅供承接与伏笔参考，不能把其行动、转折或结局写入本章；全书结局只在计划末章按章纲展开。一次完成本章正文和简短实际衔接。blocks必须连续且不重叠，每段正文只输出一次，概括仅写入synopsis/end_state等元数据；每块text包含连续的一个或数个自然段，保留完整Markdown和段间换行；所有text直接无分隔拼接就是最终正文，块间换行必须放在text里，不重复章节标题。每块的facts、character_changes、threads、findings只记录该块原文足以证实的重要变化，无变化用[]，不逐段重复摘要，不引用其他块来推断秘密。character_id只能选择工具枚举里的已有身份编号，不得填姓名；已有线索保留枚举id，新线索id留空且status只能open，本章已经解决的新问题记入facts，不伪造旧线索id。body_complete只确认本章正文完整结束，不代表整批或全书完结；synopsis、end_state最后简要概括本章实际剧情与结束状态。不返回source_id、quote、hash或版本，它们由程序绑定当前正文块。严格按plan推进，遵循文风、视角、软字数；plan和未来资料不是已发生事实。actual_history是实际前文：structured_through之前的状态是较早前缀，required_sources是其后必须按顺序完整读取的真实原文，后文优先，不能把旧状态当当前状态，知识必须有获取过程，不复活已解线索。"

func writingChapterBodyProperties(request powerOutputContractContext) map[string]any {
	block := writingContinuityDeltaProperties(request.WritingCharacterIDs, request.WritingThreadIDs, nil)
	block["text"] = map[string]any{"type": "string", "minLength": 1}
	return map[string]any{
		"blocks":        writingArray(writingObject(block, "text", "facts", "character_changes", "threads", "findings")),
		"body_complete": map[string]any{"type": "boolean"},
		"synopsis":      writingString(), "end_state": writingString(),
	}
}

// 这里只确认正文的独立完整性。派生候选仍须由 Team 的来源/身份领域校验器验证。
func normalizeWritingChapterBody(output map[string]any) (map[string]any, error) {
	blocks, ok := output["blocks"].([]any)
	if !ok || len(blocks) == 0 {
		return nil, fmt.Errorf("result.blocks 必须包含完整正文")
	}
	var body strings.Builder
	merged := make([]any, 0, len(blocks))
	for index, value := range blocks {
		block, ok := value.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("result.blocks[%d] 必须为正文块", index)
		}
		text, ok := block["text"].(string)
		if !ok || text == "" {
			return nil, fmt.Errorf("result.blocks[%d].text 必须为非空正文", index)
		}
		if strings.TrimSpace(text) == "" {
			// 只有换行的块是段间分隔：并入前一块，保持所有 text 拼接即正文；
			// 它没有可佐证的原文，不能携带事实或变化。
			if writingBlockHasContinuity(block) {
				return nil, fmt.Errorf("result.blocks[%d] 没有正文却记录了事实或变化", index)
			}
			if len(merged) > 0 {
				previous := merged[len(merged)-1].(map[string]any)
				previous["text"] = previous["text"].(string) + text
				body.WriteString(text)
			}
			continue
		}
		body.WriteString(text)
		copied := make(map[string]any, len(block))
		for key, item := range block {
			copied[key] = item
		}
		merged = append(merged, copied)
	}
	if len(merged) == 0 {
		return nil, fmt.Errorf("result.blocks 必须包含完整正文")
	}
	continuity := make(map[string]any, len(output))
	for key, item := range output {
		continuity[key] = item
	}
	continuity["blocks"] = merged
	return map[string]any{"body": body.String(), "continuity": continuity}, nil
}

func writingBlockHasContinuity(block map[string]any) bool {
	for _, key := range []string{"facts", "character_changes", "threads", "findings"} {
		if items, ok := block[key].([]any); ok && len(items) > 0 {
			return true
		}
	}
	return false
}
