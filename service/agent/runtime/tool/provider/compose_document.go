package provider

import (
	"context"
	"fmt"
	"strings"
)

const (
	ComposeDocumentToolName       = "compose_document"
	ComposeDocumentOutputContract = "document_body_only"
	ComposeDocumentOutputRule     = "每次调用 compose_document 都会创建一份独立文档，并由文档子运行异步生成完整正文和所需素材。调用时必须把正文所需的内容、结构、风格和素材要求完整整理到 content_requirements，不得混入聊天收尾或后续建议。调用前只用一句简短自然语言说明正在生成；这句话保留在聊天中，不属于正文。工具结束后以结构化结果返回文档标识、状态或错误，正文只作为后续对话的内部引用并只在文档中展示；禁止再用普通文本复述正文，也不要把生成过程、完成说明、后续邀约或可选方向写入文档。随后必须调用 present_suggestions：成功时在 message 中自然说明文档已完成，并提供 2 至 4 个修改、扩展或使用方向；失败时必须明确说明生成失败，并提供重新生成或调整要求的方向，不得把失败说成完成。"
)

type ComposeDocumentInput struct {
	Title               string
	Purpose             string
	ContentRequirements string
}

func ComposeDocumentIntro(title string) string {
	title = strings.TrimSpace(title)
	if title == "" {
		return "正在生成完整图文。"
	}
	return "正在生成完整图文《" + title + "》。"
}

func ComposeDocumentTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        ComposeDocumentToolName,
			Title:       "生成完整图文",
			Kind:        "document",
			Description: "启动独立的完整图文生成子任务；若同一轮还有其他工具调用，必须把本工具放在最后。" + ComposeDocumentOutputRule,
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"title": map[string]any{
						"type":        "string",
						"description": "最终成品标题",
					},
					"purpose": map[string]any{
						"type":        "string",
						"description": "用途或目标平台",
					},
					"content_requirements": map[string]any{
						"type":        "string",
						"description": "完整的文档正文简报：正文要写什么、结构、风格及素材要求。只写文档交付要求，不包含聊天完成消息、后续建议或下一步邀约",
					},
				},
				"required":             []any{"title", "content_requirements"},
				"additionalProperties": false,
			},
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			_, err := ParseComposeDocument(call.Arguments)
			if err != nil {
				return Result{}, err
			}
			return Result{}, fmt.Errorf("compose_document 只能由智能体运行时执行")
		},
	}
}

func ParseComposeDocument(arguments map[string]any) (ComposeDocumentInput, error) {
	input := ComposeDocumentInput{
		Title:               strings.TrimSpace(argumentText(arguments, "title")),
		Purpose:             strings.TrimSpace(argumentText(arguments, "purpose")),
		ContentRequirements: strings.TrimSpace(argumentText(arguments, "content_requirements")),
	}
	if input.Title == "" {
		return input, fmt.Errorf("compose_document.title 不能为空")
	}
	if input.ContentRequirements == "" {
		return input, fmt.Errorf("compose_document.content_requirements 不能为空")
	}
	return input, nil
}
