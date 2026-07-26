package provider

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	ComposeDocumentToolName       = "compose_document"
	ComposeDocumentOutputContract = "document_body_only"
	ComposeDocumentOutputRule     = "每次调用 compose_document 都会创建一份独立文档，并由文档子运行异步生成完整正文和所需素材。调用时必须把正文内容、结构和风格完整整理到 content_requirements，并把图片、视频、音频或文件的类型与数量写入 media_requirements；纯文本传空数组。不得把素材要求只藏在正文简报中，也不得混入聊天收尾或后续建议。调用前只用一句简短自然语言说明正在生成；这句话保留在聊天中，不属于正文。工具结束后以结构化结果返回文档标识、真实状态或错误，正文只作为后续对话的内部引用并只在文档中展示；禁止再用普通文本复述正文，也不要把生成过程、完成说明、后续邀约或可选方向写入文档。"
)

type ComposeDocumentInput struct {
	Title               string
	Purpose             string
	ContentRequirements string
	MediaRequirements   []DocumentMediaRequirement
	FollowUp            *SuggestionPresentation
}

type DocumentMediaRequirement struct {
	Kind        string `json:"kind"`
	Count       int    `json:"count"`
	Description string `json:"description,omitempty"`
}

func (input ComposeDocumentInput) RequiredMediaCounts() map[string]int {
	result := map[string]int{}
	for _, requirement := range input.MediaRequirements {
		result[requirement.Kind] += requirement.Count
	}
	return result
}

func ComposeDocumentIntro(title string) string {
	title = strings.TrimSpace(title)
	if title == "" {
		return "正在生成完整图文。"
	}
	return "正在生成完整图文《" + title + "》。"
}

func DocumentCompletionPresentation(title string, status string, requiredMedia int) SuggestionPresentation {
	title = strings.TrimSpace(title)
	subject := "文档"
	if title != "" {
		subject = "文档《" + title + "》"
	}
	switch strings.ToLower(strings.TrimSpace(status)) {
	case agentmodel.DocumentStatusWriting:
		return SuggestionPresentation{Message: subject + "正文正在生成。"}
	case agentmodel.DocumentStatusGenerating:
		return SuggestionPresentation{Message: subject + "正文已完成，所需素材正在生成。"}
	case agentmodel.DocumentStatusPartialFailed:
		return SuggestionPresentation{Message: subject + "正文已完成，但部分素材未能生成。"}
	case agentmodel.DocumentStatusFailed:
		return SuggestionPresentation{Message: subject + "生成失败，请重试或调整要求。"}
	default:
		if requiredMedia > 0 {
			return SuggestionPresentation{Message: strings.Replace(subject, "文档", "图文", 1) + "已完成。"}
		}
		return SuggestionPresentation{Message: subject + "已完成。"}
	}
}

func DocumentFailurePresentation(title string, withSuggestions bool) SuggestionPresentation {
	title = strings.TrimSpace(title)
	subject := "这份文档"
	if title != "" {
		subject = "《" + title + "》"
	}
	presentation := SuggestionPresentation{Message: subject + "生成失败，请重试或调整要求。"}
	if withSuggestions {
		presentation.Items = []map[string]any{
			{"label": "重新生成", "prompt": "请重新生成" + subject + "。"},
			{"label": "调整要求", "prompt": "请先和我一起调整" + subject + "的内容要求。"},
		}
	}
	return presentation
}

func ComposeDocumentOutputRuleForMode(mode string) string {
	switch agentmodel.NormalizeSuggestionMode(mode) {
	case agentmodel.SuggestionModeAfterResult:
		return ComposeDocumentOutputRule + " 文档返回真实结果后，必须调用 present_suggestions，并把工具结果中的 completion_message 原样作为 message；不得把正在生成或失败的素材描述成已完成。再根据真实结果给出 2 至 4 个修改、扩展或使用方向。"
	case agentmodel.SuggestionModeOff:
		return ComposeDocumentOutputRule + " 当前智能体已关闭后续建议；文档返回后直接结束，不得输出或调用后续建议。"
	default:
		return ComposeDocumentOutputRule + " 调用时必须在 follow_up 中同时准备文档成功后的自然完成说明和 2 至 4 个可选方向；运行时只会在正文真实完成后展示，调用后不得再次生成建议。"
	}
}

func ComposeDocumentTool(mode string) Tool {
	mode = agentmodel.NormalizeSuggestionMode(mode)
	parameters := map[string]any{
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
				"description": "完整的文档正文简报：正文要写什么、结构和风格。素材要求同时写入 media_requirements；不包含聊天完成消息、后续建议或下一步邀约",
			},
			"media_requirements": map[string]any{
				"type":        "array",
				"description": "文档必须生成的素材清单。用户要求图文、配图、封面或正文插图时必须声明 image；纯文本必须传空数组。不得把尚未生成的素材描述成已完成",
				"maxItems":    4,
				"items": map[string]any{
					"type": "object",
					"properties": map[string]any{
						"kind": map[string]any{
							"type": "string",
							"enum": []any{"image", "video", "audio", "file"},
						},
						"count": map[string]any{
							"type":    "integer",
							"minimum": 1,
							"maximum": 8,
						},
						"description": map[string]any{
							"type":        "string",
							"description": "素材内容、用途和风格要求",
						},
					},
					"required":             []any{"kind", "count"},
					"additionalProperties": false,
				},
			},
		},
		"required":             []any{"title", "content_requirements", "media_requirements"},
		"additionalProperties": false,
	}
	if mode == agentmodel.SuggestionModeInstant {
		properties := parameters["properties"].(map[string]any)
		properties["follow_up"] = suggestionParameters(2, 4)
		parameters["required"] = append(parameters["required"].([]any), "follow_up")
	}
	return Tool{
		Definition: Definition{
			Name:        ComposeDocumentToolName,
			Title:       "生成完整图文",
			Kind:        "document",
			Description: "启动独立的完整图文生成子任务；若同一轮还有其他工具调用，必须把本工具放在最后。" + ComposeDocumentOutputRuleForMode(mode),
			Parameters:  parameters,
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			_, err := ParseComposeDocument(call.Arguments, mode)
			if err != nil {
				return Result{}, err
			}
			return Result{}, fmt.Errorf("compose_document 只能由智能体运行时执行")
		},
	}
}

func ParseComposeDocument(arguments map[string]any, mode string) (ComposeDocumentInput, error) {
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
	mediaRequirements, err := parseDocumentMediaRequirements(arguments["media_requirements"])
	if err != nil {
		return input, fmt.Errorf("compose_document.media_requirements 无效: %w", err)
	}
	input.MediaRequirements = mediaRequirements
	if agentmodel.NormalizeSuggestionMode(mode) == agentmodel.SuggestionModeInstant {
		followUp, ok := arguments["follow_up"].(map[string]any)
		if !ok {
			return input, fmt.Errorf("compose_document.follow_up 不能为空")
		}
		presentation, err := parseSuggestionPresentation(followUp, defaultSuggestionMessage, 2, 4)
		if err != nil {
			return input, fmt.Errorf("compose_document.follow_up 无效: %w", err)
		}
		input.FollowUp = &presentation
	}
	return input, nil
}

func parseDocumentMediaRequirements(value any) ([]DocumentMediaRequirement, error) {
	items, ok := value.([]any)
	if !ok {
		return nil, fmt.Errorf("必须是数组；纯文本文档请传空数组")
	}
	result := make([]DocumentMediaRequirement, 0, len(items))
	indexes := map[string]int{}
	for index, raw := range items {
		item, ok := raw.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("第 %d 项必须是对象", index+1)
		}
		kind := strings.ToLower(strings.TrimSpace(argumentText(item, "kind")))
		if !isDocumentMediaKind(kind) {
			return nil, fmt.Errorf("第 %d 项 kind 仅支持 image、video、audio 或 file", index+1)
		}
		count := ArgumentInt(item, "count", 0)
		if count < 1 || count > 8 {
			return nil, fmt.Errorf("第 %d 项 count 必须在 1 到 8 之间", index+1)
		}
		description := strings.TrimSpace(argumentText(item, "description"))
		if current, exists := indexes[kind]; exists {
			result[current].Count += count
			if result[current].Count > 8 {
				return nil, fmt.Errorf("%s 素材总数不能超过 8", kind)
			}
			if description != "" {
				if result[current].Description != "" {
					result[current].Description += "；"
				}
				result[current].Description += description
			}
			continue
		}
		indexes[kind] = len(result)
		result = append(result, DocumentMediaRequirement{
			Kind:        kind,
			Count:       count,
			Description: description,
		})
	}
	return result, nil
}

func isDocumentMediaKind(kind string) bool {
	switch kind {
	case "image", "video", "audio", "file":
		return true
	default:
		return false
	}
}
