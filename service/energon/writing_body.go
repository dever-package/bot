package energon

import (
	"fmt"
	"strings"
)

const writingChapterBodyPrompt = "为unit指定章节一次完成正文和简短实际衔接。blocks按正文顺序排列，每块text包含连续的一个或数个自然段，保留完整Markdown和段间换行；所有text直接无分隔拼接就是最终正文，块间换行必须放在text里，不重复章节标题。每块的facts、character_changes、threads、findings只记录该块原文足以证实的重要变化，无变化用[]，不逐段重复摘要，不引用其他块来推断秘密。character_id只能选择工具枚举里的已有身份编号，不得填姓名；已有线索保留枚举id，新线索id留空。正文全部写完后body_complete才为true；synopsis、end_state最后简要概括本章实际剧情与结束状态。不返回source_id、quote、hash或版本，它们由程序绑定当前正文块。严格按plan推进，不抢写后章，遵循文风、视角、软字数；plan和未来资料不是已发生事实。actual_history是实际前文：structured_through之前的状态是较早前缀，required_sources是其后必须按顺序完整读取的真实原文，后文优先，不能把旧状态当当前状态，知识必须有获取过程，不复活已解线索。"

func writingChapterBodyProperties(request powerOutputContractContext) map[string]any {
	block := writingContinuityDeltaProperties(request.WritingCharacterIDs, request.WritingThreadIDs, nil)
	block["text"] = writingString()
	return map[string]any{
		"blocks":        writingArray(writingObject(block, "text", "facts", "character_changes", "threads", "findings")),
		"body_complete": map[string]any{"type": "boolean"},
		"synopsis":      writingString(), "end_state": writingString(),
	}
}

// 这里只确认正文的独立完整性。派生候选仍须由 Team 的来源/身份领域校验器验证。
func normalizeWritingChapterBody(output map[string]any) (map[string]any, error) {
	if complete, ok := output["body_complete"].(bool); !ok || !complete {
		return nil, fmt.Errorf("result.body_complete 必须明确确认正文已完整结束")
	}
	blocks, ok := output["blocks"].([]any)
	if !ok || len(blocks) == 0 {
		return nil, fmt.Errorf("result.blocks 必须包含完整正文")
	}
	var body strings.Builder
	for index, value := range blocks {
		block, ok := value.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("result.blocks[%d] 必须为正文块", index)
		}
		text, ok := block["text"].(string)
		if !ok || strings.TrimSpace(text) == "" {
			return nil, fmt.Errorf("result.blocks[%d].text 必须为非空正文", index)
		}
		body.WriteString(text)
	}
	return map[string]any{"body": body.String(), "continuity": output}, nil
}
