package provider

import (
	"context"
	"strings"
)

const StartDocumentToolName = "start_document"

const StartDocumentPrompt = `当用户需要一份正文与图片、视频、音频或文件按顺序编排的完整图文内容时，先调用 start_document 进入文档模式。普通聊天、纯文本回答、单独生成素材或仅修改一个现有素材时不要调用。
进入文档模式后按阅读顺序推进：每轮只输出紧邻下一个素材位置的正文，需要插入素材时立即调用一次对应素材工具；不要先输出多段正文再集中调用素材。素材进入后台生成后立即继续下一段，不要等待素材完成，也不要要求用户回复“继续”。正文与素材的先后顺序就是最终文档顺序。`

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
						"description": "文档标题；尚未确定时留空",
					},
					"purpose": map[string]any{
						"type":        "string",
						"description": "文档用途或目标平台的简短说明",
					},
				},
				"required":             []any{},
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
		Text: "图文文档已开始。请按最终阅读顺序继续生成正文；需要素材时每次调用一个对应工具，素材已进入后台后立即继续下一段。",
		Content: map[string]any{
			"started": true,
			"title":   title,
			"purpose": purpose,
		},
	}, nil
}
