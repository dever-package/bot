package provider

import (
	"context"
	"strings"
)

const StartDocumentToolName = "start_document"

const StartDocumentPrompt = `当用户需要一份正文与图片、视频、音频或文件按顺序编排的完整图文内容时，立即调用 start_document 进入文档模式。调用前不要输出开场说明、计划、承诺或正文；普通聊天、纯文本回答、单独生成素材或仅修改一个现有素材时不要调用。
start_document 的 title 必须填写最终成品标题；界面会把该标题固定展示在文档最前面，后续正文不得再次输出任何 Markdown 标题形式的文档主标题。
进入文档模式后，严格按最终阅读顺序逐段推进：下一轮从第一段正式正文开始，每轮先输出一段可以直接复制发布的正文，需要插入素材时在同一轮立即调用一次对应素材工具，然后下一轮继续下一段正式正文。不得先输出多段正文再集中调用素材，也不得把标题或全部正文拖到最后一步。
图文模式中的可见文本只能是成品正文，不得输出创作计划、执行进度、操作说明、素材提示词或“我会继续、我将补齐、接下来生成”等过程文案。正文结尾禁止出现“配图需要、图片内容、生成一张、素材方向”等插入说明；是否插入素材只通过紧随正文的工具调用表达。普通素材调用前的说明规则不适用于图文模式，正文段落本身就是素材前的自然上下文。
每个插图位置默认只生成一个素材；只有用户明确要求同一位置提供多张候选图或组图时，才在一个位置生成多个素材。同一段正文后存在多个连续素材位置时，可以在一次响应中按最终顺序调用多个素材工具。素材进入后台后立即继续下一段，不要等待素材完成，也不要要求用户回复“继续”。正文与素材的先后顺序就是最终文档顺序。每一轮只写尚未生成的新正文，禁止重复标题、段落或已完成内容。最后一段及其素材位置都已提交后，把 finish_document 放在本轮全部素材调用之后；禁止重新输出整篇文章。`

func StartDocumentTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        StartDocumentToolName,
			Title:       "开始图文文档",
			Kind:        "document",
			Description: "开始生成一份正文与素材按阅读顺序编排的完整图文文档。只在任务目标是完整图文内容时调用；进入后继续输出正文并按插入位置调用素材工具。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"title": map[string]any{
						"type":        "string",
						"description": "最终成品标题，必须填写；界面会单独显示，正文不要重复输出",
					},
					"purpose": map[string]any{
						"type":        "string",
						"description": "文档用途或目标平台的简短说明",
					},
				},
				"required":             []any{"title"},
				"additionalProperties": false,
			},
		},
		Handle: executeStartDocument,
	}
}

func executeStartDocument(_ context.Context, call Call) (Result, error) {
	title := strings.TrimSpace(argumentText(call.Arguments, "title"))
	purpose := strings.TrimSpace(argumentText(call.Arguments, "purpose"))
	return Result{
		Text: "标题已由界面单独展示。下一轮直接输出第一段可发布正文，并在对应位置调用一次素材工具；不要重复标题，也不要说明文档状态、计划或进度。",
		Content: map[string]any{
			"started": true,
			"title":   title,
			"purpose": purpose,
		},
	}, nil
}
