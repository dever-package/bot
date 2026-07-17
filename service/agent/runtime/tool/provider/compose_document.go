package provider

import (
	"context"
	"fmt"
	"strings"

	energoninput "github.com/dever-package/bot/service/energon/input"
)

const (
	ComposeDocumentToolName = "compose_document"
	maxDocumentBlocks       = 64
)

type ComposeDocumentBlock struct {
	Type      string
	Text      string
	Tool      string
	Arguments map[string]any
}

type ComposeDocumentInput struct {
	Title   string
	Purpose string
	Blocks  []ComposeDocumentBlock
}

func ComposeDocumentIntro(title string) string {
	title = strings.TrimSpace(title)
	if title == "" {
		return "正在生成完整图文。"
	}
	return "正在生成完整图文《" + title + "》。"
}

func ComposeDocumentTool(artifactTools []Definition) Tool {
	tools := uniqueDocumentToolDefinitions(artifactTools)
	return Tool{
		Definition: Definition{
			Name:        ComposeDocumentToolName,
			Title:       "生成完整图文",
			Kind:        "document",
			Description: "生成完整图文成品。调用前只说明一次；将最终标题、正文和素材按阅读顺序一次性提交。",
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
					"blocks": map[string]any{
						"type":     "array",
						"minItems": 2,
						"maxItems": maxDocumentBlocks,
						"items":    documentBlockSchema(tools),
					},
				},
				"required":             []any{"title", "blocks"},
				"additionalProperties": false,
			},
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			_, err := ParseComposeDocument(call.Arguments, tools)
			if err != nil {
				return Result{}, err
			}
			return Result{}, fmt.Errorf("compose_document 只能由智能体运行时执行")
		},
	}
}

func ParseComposeDocument(arguments map[string]any, artifactTools []Definition) (ComposeDocumentInput, error) {
	input := ComposeDocumentInput{
		Title:   strings.TrimSpace(argumentText(arguments, "title")),
		Purpose: strings.TrimSpace(argumentText(arguments, "purpose")),
	}
	if input.Title == "" {
		return input, fmt.Errorf("compose_document.title 不能为空")
	}
	items, ok := arguments["blocks"].([]any)
	if !ok || len(items) < 2 {
		return input, fmt.Errorf("compose_document.blocks 至少需要正文和素材两个内容块")
	}
	if len(items) > maxDocumentBlocks {
		return input, fmt.Errorf("compose_document.blocks 最多支持 %d 个内容块", maxDocumentBlocks)
	}
	allowedTools := make(map[string]Definition, len(artifactTools))
	for _, definition := range uniqueDocumentToolDefinitions(artifactTools) {
		allowedTools[definition.Name] = definition
	}
	hasText := false
	hasArtifact := false
	input.Blocks = make([]ComposeDocumentBlock, 0, len(items))
	for index, item := range items {
		current, currentOK := item.(map[string]any)
		if !currentOK {
			return input, fmt.Errorf("compose_document.blocks[%d] 格式无效", index)
		}
		block := ComposeDocumentBlock{Type: strings.ToLower(strings.TrimSpace(argumentText(current, "type")))}
		switch block.Type {
		case "text":
			block.Text = strings.TrimSpace(argumentText(current, "text"))
			if block.Text == "" {
				return input, fmt.Errorf("compose_document.blocks[%d].text 不能为空", index)
			}
			hasText = true
		case "artifact":
			block.Tool = strings.TrimSpace(argumentText(current, "tool"))
			definition, exists := allowedTools[block.Tool]
			if !exists {
				return input, fmt.Errorf("compose_document.blocks[%d].tool 不是当前智能体已挂载的素材工具", index)
			}
			block.Arguments, _ = current["arguments"].(map[string]any)
			if block.Arguments == nil {
				block.Arguments = map[string]any{}
			}
			if missing := missingDocumentToolArguments(block.Arguments, definition.Parameters); len(missing) > 0 {
				return input, fmt.Errorf(
					"compose_document.blocks[%d].arguments 缺少工具 %s 的必填参数: %s",
					index,
					block.Tool,
					strings.Join(missing, "、"),
				)
			}
			hasArtifact = true
		default:
			return input, fmt.Errorf("compose_document.blocks[%d].type 只支持 text 或 artifact", index)
		}
		input.Blocks = append(input.Blocks, block)
	}
	if !hasText || !hasArtifact {
		return input, fmt.Errorf("compose_document.blocks 必须同时包含正文和素材位置")
	}
	return input, nil
}

func uniqueDocumentToolDefinitions(values []Definition) []Definition {
	seen := make(map[string]struct{}, len(values))
	result := make([]Definition, 0, len(values))
	for _, value := range values {
		value.Name = strings.TrimSpace(value.Name)
		if value.Name == "" {
			continue
		}
		if _, exists := seen[value.Name]; exists {
			continue
		}
		seen[value.Name] = struct{}{}
		result = append(result, value)
	}
	return result
}

func documentBlockSchema(artifactTools []Definition) map[string]any {
	variants := []any{map[string]any{
		"type": "object",
		"properties": map[string]any{
			"type": map[string]any{"type": "string", "enum": []any{"text"}},
			"text": map[string]any{
				"type":        "string",
				"description": "最终正文",
			},
		},
		"required":             []any{"type", "text"},
		"additionalProperties": false,
	}}
	for _, definition := range artifactTools {
		variants = append(variants, map[string]any{
			"type": "object",
			"properties": map[string]any{
				"type": map[string]any{"type": "string", "enum": []any{"artifact"}},
				"tool": map[string]any{
					"type":        "string",
					"enum":        []any{definition.Name},
					"description": "素材工具",
				},
				"arguments": documentToolParameters(definition),
			},
			"required":             []any{"type", "tool", "arguments"},
			"additionalProperties": false,
		})
	}
	return map[string]any{"oneOf": variants}
}

func documentToolParameters(definition Definition) map[string]any {
	parameters := make(map[string]any, len(definition.Parameters)+1)
	for key, value := range definition.Parameters {
		parameters[key] = value
	}
	parameters["description"] = fmt.Sprintf("%s 的调用参数", definition.Name)
	if strings.TrimSpace(fmt.Sprint(parameters["type"])) == "" {
		parameters["type"] = "object"
	}
	if _, exists := parameters["properties"]; !exists {
		parameters["properties"] = map[string]any{}
	}
	return parameters
}

func missingDocumentToolArguments(arguments map[string]any, parameters map[string]any) []string {
	result := make([]string, 0)
	for _, key := range documentRequiredParameterNames(parameters["required"]) {
		if value, exists := arguments[key]; !exists || energoninput.IsMissing(value) {
			result = append(result, key)
		}
	}
	return result
}

func documentRequiredParameterNames(value any) []string {
	items := make([]any, 0)
	switch current := value.(type) {
	case []any:
		items = current
	case []string:
		items = make([]any, 0, len(current))
		for _, item := range current {
			items = append(items, item)
		}
	}
	result := make([]string, 0, len(items))
	for _, item := range items {
		if key := strings.TrimSpace(fmt.Sprint(item)); key != "" {
			result = append(result, key)
		}
	}
	return result
}
