package provider

import (
	"context"
	"fmt"
	"strings"
)

const ComposeDocumentToolName = "compose_document"

type ComposeDocumentInput struct {
	Title   string
	Purpose string
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
			Name:  ComposeDocumentToolName,
			Title: "生成完整图文",
			Kind:  "document",
			Description: "开始生成完整图文文档。调用前只说明一次；工具返回后，直接输出最终正文，正文会流式写入文档。" +
				"需要图片、视频、音频或文件时，在对应正文位置直接调用已挂载的素材工具，素材提交后继续输出后续正文；进入文档后不再输出工具过程说明。",
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
				},
				"required":             []any{"title"},
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
		Title:   strings.TrimSpace(argumentText(arguments, "title")),
		Purpose: strings.TrimSpace(argumentText(arguments, "purpose")),
	}
	if input.Title == "" {
		return input, fmt.Errorf("compose_document.title 不能为空")
	}
	return input, nil
}
