package input

import (
	"fmt"
	"strings"
)

const mediaReferenceIndexTitle = "参考素材索引（顺序与本次媒体输入一致）："

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
		line := fmt.Sprintf("- 参考%s%d = 第%d%s输入%s", kind, index, index, unit, inputKind)
		if label != "" {
			line = fmt.Sprintf("- 提示词中的 @%s = 参考%s%d = 第%d%s输入%s", label, kind, index, index, unit, inputKind)
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
	indexText := mediaReferenceIndexTitle + "\n" + strings.Join(lines, "\n")
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
