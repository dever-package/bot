package input

import (
	"fmt"
	"strings"
)

const mediaReferenceIndexTitle = "参考素材索引（顺序与本次媒体输入一致）："
const mediaReferenceIndexGuide = "提示词可以使用图1、参考图1、视频1、音频1、文件1或素材标签引用对应的实际输入。"

// AppendMediaReferenceIndex describes the exact media order used by parameter
// binding, so labels mentioned in a prompt remain aligned with model inputs.
func AppendMediaReferenceIndex(prompt string, references []MediaReference) string {
	if len(references) == 0 {
		return prompt
	}

	counts := map[string]int{}
	lines := make([]string, 0, len(references))
	for _, reference := range references {
		kind, unit, inputKind := mediaReferencePromptKind(reference.Kind)
		if kind == "" {
			continue
		}
		counts[kind]++
		index := counts[kind]
		label := normalizeMediaReferencePromptLabel(reference.Label)
		line := fmt.Sprintf("- %s%d（参考%s%d）= 第%d%s%s输入", kind, index, kind, index, index, unit, inputKind)
		if label != "" {
			line += fmt.Sprintf("；素材标签：@%s", label)
		}
		if usage := mediaReferencePromptUsage(reference.Usage); usage != "" {
			line += fmt.Sprintf("（用途：%s）", usage)
		}
		lines = append(lines, line)
	}
	if len(lines) == 0 {
		return prompt
	}

	prompt = strings.TrimSpace(prompt)
	if index := strings.Index(prompt, mediaReferenceIndexTitle); index >= 0 {
		prompt = strings.TrimSpace(prompt[:index])
	}
	indexText := mediaReferenceIndexTitle + "\n" + mediaReferenceIndexGuide + "\n" + strings.Join(lines, "\n")
	if prompt == "" {
		return indexText
	}
	return prompt + "\n\n" + indexText
}

func mediaReferencePromptKind(kind string) (string, string, string) {
	switch normalizeMediaKind(kind) {
	case "image":
		return "图", "张", "图片"
	case "video":
		return "视频", "个", "视频"
	case "audio":
		return "音频", "段", "音频"
	case "file":
		return "文件", "个", "文件"
	default:
		return "", "", ""
	}
}

func normalizeMediaReferencePromptLabel(label string) string {
	label = strings.TrimSpace(strings.TrimLeft(label, "@#"))
	return strings.Join(strings.Fields(label), " ")
}

func mediaReferencePromptUsage(usage string) string {
	switch normalizeMediaUsageRole(usage) {
	case "firstframe", "startframe":
		return "首帧"
	case "lastframe", "endframe":
		return "尾帧"
	case "reference", "referenceimage", "referenceimages":
		return "参考图"
	default:
		return strings.TrimSpace(usage)
	}
}
