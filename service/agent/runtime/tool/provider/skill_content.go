package provider

import (
	"context"
	"fmt"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func continueSkillContentTool(
	loaded map[string]agentskill.Entry,
	limits agentskill.Limits,
	budget *skillContentBudget,
) Tool {
	return Tool{
		Definition: Definition{
			Name:        "continue_skill_content",
			Description: "继续分页读取已加载技能的入口正文；使用 load_skill 返回的 next_offset，且不需要 files 能力。",
			Parameters: objectParameters(map[string]any{
				"skill": skillProperty(),
				"offset": map[string]any{
					"type": "integer", "minimum": 0,
					"description": "字符偏移，使用上次返回的 next_offset",
				},
				"limit": map[string]any{
					"type": "integer", "minimum": 1, "maximum": agentskill.DefaultContentPageRunes,
					"description": "本次最多读取字符数",
				},
			}),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			content, warnings, err := agentskill.ReadContent(entry, limits)
			if err != nil {
				return Result{}, err
			}
			page, remaining, err := budget.paginate(
				content,
				ArgumentInt(call.Arguments, "offset", 0),
				ArgumentInt(call.Arguments, "limit", agentskill.DefaultContentPageRunes),
			)
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("已继续读取技能 %s（%d/%d）", entry.Name, page.NextOffset, page.TotalRunes),
				Content: map[string]any{
					"skill": entry.Key, "content_hash": entry.ContentHash,
					"content": page.Content, "offset": page.Offset,
					"next_offset": page.NextOffset, "total_runes": page.TotalRunes,
					"eof": page.EOF, "remaining_runes": remaining,
					"warnings": warnings,
				},
			}, nil
		},
	}
}
