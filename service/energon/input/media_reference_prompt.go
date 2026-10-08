package input

import (
	"fmt"
	"github.com/shemic/dever/util"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const mediaReferenceIndexTitle = "参考素材索引（顺序与本次媒体输入一致）："
const mediaReferenceIndexGuide = "提示词可以使用图1、参考图1、视频1、音频1、文件1或素材标签引用对应的实际输入。"

func MediaReferencePromptMetadata(references []MediaReference) []map[string]any {
	result := make([]map[string]any, 0, len(references))
	for _, reference := range references {
		result = append(result, map[string]any{
			"kind": reference.Kind, "url": reference.URL,
			"ref_type": reference.ReferenceType, "ref_id": reference.ReferenceID, "media_index": reference.MediaIndex,
			"label": reference.Label, "usage": reference.Usage,
		})
	}
	return result
}

func MediaReferencesFromPromptMetadata(value any) []MediaReference {
	rows := botprotocol.NormalizeAnyList(value)
	result := make([]MediaReference, 0, len(rows))
	for _, value := range rows {
		row := botprotocol.NormalizeMap(value)
		result = append(result, MediaReference{
			Kind: botprotocol.AsText(row["kind"]), URL: botprotocol.AsText(row["url"]),
			ReferenceType: botprotocol.AsText(row["ref_type"]), ReferenceID: util.ToUint64(row["ref_id"]), MediaIndex: util.ToIntDefault(row["media_index"], 0),
			Label: botprotocol.AsText(row["label"]), Usage: botprotocol.AsText(row["usage"]),
		})
	}
	return result
}

// AppendMediaReferenceIndex describes the exact media order used by parameter
// binding, so labels mentioned in a prompt remain aligned with model inputs.
func AppendMediaReferenceIndex(prompt string, references []MediaReference) string {
	return appendMediaReferencePromptIndex(prompt, mediaReferencePromptEntries(references), true)
}

type mediaReferencePromptEntry struct {
	Reference MediaReference
	Name      string
	Line      string
}

func mediaReferencePromptEntries(references []MediaReference) []mediaReferencePromptEntry {
	counts := map[string]int{}
	entries := make([]mediaReferencePromptEntry, 0, len(references))
	for _, reference := range references {
		kind, unit, inputKind := mediaReferencePromptKind(reference.Kind)
		if kind == "" {
			continue
		}
		counts[kind]++
		index := counts[kind]
		entries = append(entries, mediaReferencePromptEntry{
			Reference: reference,
			Name:      fmt.Sprintf("参考%s%d", kind, index),
			Line:      fmt.Sprintf("- %s%d（参考%s%d）= 第%d%s%s输入", kind, index, kind, index, index, unit, inputKind),
		})
	}
	return entries
}

func appendMediaReferencePromptIndex(prompt string, entries []mediaReferencePromptEntry, labels bool) string {
	if len(entries) == 0 {
		return prompt
	}
	lines := make([]string, 0, len(entries))
	for _, entry := range entries {
		line := entry.Line
		if label := normalizeMediaReferencePromptLabel(entry.Reference.Label); labels && label != "" {
			line += fmt.Sprintf("；素材标签：@%s", label)
		}
		if usage := mediaReferencePromptUsage(entry.Reference.Usage); usage != "" {
			line += fmt.Sprintf("（用途：%s）", usage)
		}
		lines = append(lines, line)
	}
	prompt = mediaReferencePromptBody(prompt)
	guide := mediaReferenceIndexGuide
	if !labels {
		guide = "参考编号仅用于关联输入素材，不是画面文字；除正文明确要求的文字外，不要生成素材标签或编号。"
	}
	indexText := mediaReferenceIndexTitle + "\n" + guide + "\n" + strings.Join(lines, "\n")
	if prompt == "" {
		return indexText
	}
	return prompt + "\n\n" + indexText
}

func mediaReferencePromptBody(prompt string) string {
	if index := strings.Index(prompt, mediaReferenceIndexTitle); index >= 0 {
		prompt = prompt[:index]
	}
	return strings.TrimSpace(prompt)
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
	case "image", "images", "reference", "referenceimage", "referenceimages":
		return "参考图"
	default:
		return strings.TrimSpace(usage)
	}
}
