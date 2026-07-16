package loop

import (
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

const toolContinuationPrompt = "请根据刚刚返回的工具结果，严格按照当前智能体设定从未完成的位置继续当前用户任务。不要重复调用已经成功完成的同一工具。工具返回的图片、视频、音频和文件会由界面原位展示，正文不要重复嵌入、输出或列出这些素材链接。"

const documentContinuationPrompt = "继续完成当前图文文档。文档标题已由界面单独展示，不要再次输出标题。若还有正文，立即写出尚未生成、且紧邻下一个素材位置的一段可复制发布正文；需要素材时在同一轮直接调用一次对应素材工具。严禁输出‘继续补充正文’‘下面补一段’‘接着生成配图’之类的操作说明，不能用声明将要写正文来代替正文。正文中不要提及配图、图片、素材、提示词或生成动作。若用户要求的正文与素材位置都已提交，不要输出任何可见文本，直接调用 finish_document。不要重复已有段落，也不要要求用户回复继续。"

const lengthContinuationPrompt = "上一段输出因模型长度限制被截断。严格按照当前智能体设定从截断位置继续，只输出尚未完成的内容，不要重复已有内容，不要说明计划或进度，也不要要求用户回复继续。"

const documentLengthContinuationPrompt = "上一段图文正文因模型长度限制被截断。严格按照当前智能体设定从截断位置继续当前图文文档，只输出尚未完成的正文或继续调用所需工具；不要重复已有段落，不要说明计划或进度，也不要要求用户回复继续。"

func toolContinuationInput() map[string]any {
	return map[string]any{"text": toolContinuationPrompt}
}

func nextModelInput(documentID uint64) map[string]any {
	if documentID > 0 {
		return map[string]any{"text": documentContinuationPrompt}
	}
	return toolContinuationInput()
}

func lengthContinuationInput(documentID uint64) map[string]any {
	prompt := lengthContinuationPrompt
	if documentID > 0 {
		prompt = documentLengthContinuationPrompt
	}
	return map[string]any{"text": prompt}
}

func shouldStreamToolActivity(definition runtimeprovider.Definition) bool {
	switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
	case "control", "interaction", "presentation", "document":
		return false
	default:
		return true
	}
}
