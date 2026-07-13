package loop

import (
	"fmt"
	"strings"

	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const toolContinuationPrompt = "请根据刚刚返回的工具结果继续完成当前用户任务，并直接向用户给出最终结果。不要重复调用已经成功完成的同一工具。工具返回的图片、视频、音频和文件会由界面原位展示，正文不要重复嵌入、输出或列出这些素材链接。"

func toolContinuationInput() map[string]any {
	return map[string]any{"text": toolContinuationPrompt}
}

func shouldStreamToolActivity(definition runtimeprovider.Definition) bool {
	switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
	case "interaction", "presentation":
		return false
	default:
		return true
	}
}

func fallbackToolPreamble(calls []botprotocol.ToolCall, registry *runtimetool.Registry) string {
	if len(calls) == 0 || registry == nil {
		return ""
	}
	if definition, exists := registry.Definition(calls[0].Name); exists && strings.EqualFold(strings.TrimSpace(definition.Kind), "interaction") {
		return "为了继续完成这个任务，我需要先确认几个关键信息。"
	}
	for _, call := range calls {
		definition, exists := registry.Definition(call.Name)
		if !exists || !isGeneratedMediaKind(definition.Kind) {
			continue
		}
		label := botprotocol.MediaOutputLabel(definition.Kind)
		if subject := toolPromptSubject(call); subject != "" {
			return fmt.Sprintf("我会按这个方向为你生成%s：%s。", label, subject)
		}
		return fmt.Sprintf("我会根据你的要求生成%s，完成后直接展示结果。", label)
	}
	return ""
}

func isGeneratedMediaKind(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case botprotocol.MediaTypeImage, botprotocol.MediaTypeVideo, botprotocol.MediaTypeAudio:
		return true
	default:
		return false
	}
}

func toolPromptSubject(call botprotocol.ToolCall) string {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return ""
	}
	for _, key := range []string{"prompt", "text", "content", "description"} {
		if text := compactToolSubject(botprotocol.AsText(arguments[key])); text != "" {
			return text
		}
	}
	return ""
}

func compactToolSubject(value string) string {
	value = strings.Join(strings.Fields(strings.TrimSpace(value)), " ")
	value = strings.TrimRight(value, "。！？!?；;，,")
	runes := []rune(value)
	if len(runes) > 64 {
		return string(runes[:64]) + "..."
	}
	return value
}
