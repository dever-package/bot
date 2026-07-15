package loop

import (
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

const toolContinuationPrompt = "请根据刚刚返回的工具结果继续完成当前用户任务，并直接向用户给出最终结果。不要重复调用已经成功完成的同一工具。工具返回的图片、视频、音频和文件会由界面原位展示，正文不要重复嵌入、输出或列出这些素材链接。"

func toolContinuationInput() map[string]any {
	return map[string]any{"text": toolContinuationPrompt}
}

func shouldStreamToolActivity(definition runtimeprovider.Definition) bool {
	switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
	case "control", "interaction", "presentation", "document":
		return false
	default:
		return true
	}
}
