package protocol

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

type PromptOptions struct {
	TextTitle string
	Labels    map[string]string
}

type MediaReferenceOptions struct {
	Images bool
	Videos bool
	Audios bool
	Files  bool
}

type PromptContent struct {
	Text   string
	Images []string
	Videos []string
	Audios []string
	Files  []string
}

var promptMediaFields = []struct {
	Target  string
	Sources []string
}{
	{Target: "images", Sources: []string{"images", "image"}},
	{Target: "videos", Sources: []string{"videos", "video"}},
	{Target: "audios", Sources: []string{"audios", "audio"}},
	{Target: "files", Sources: []string{"files", "file"}},
}

func BuildPromptContent(input map[string]any, options PromptOptions) PromptContent {
	if len(input) == 0 {
		return PromptContent{}
	}

	content := PromptContent{
		Images: collectPromptMedia(input, "images"),
		Videos: collectPromptMedia(input, "videos"),
		Audios: collectPromptMedia(input, "audios"),
		Files:  collectPromptMedia(input, "files"),
	}
	content.Text = buildPromptText(promptMainText(input), promptExtraParams(input, options.Labels), options, content.HasMedia())
	return content
}

func (p PromptContent) HasMedia() bool {
	return len(p.Images) > 0 || len(p.Videos) > 0 || len(p.Audios) > 0 || len(p.Files) > 0
}

func (p PromptContent) TextWithMediaReferences(options MediaReferenceOptions) string {
	parts := make([]string, 0, 5)
	if strings.TrimSpace(p.Text) != "" {
		parts = append(parts, strings.TrimSpace(p.Text))
	}
	if options.Images {
		appendMediaReference(&parts, "图片", p.Images)
	}
	if options.Videos {
		appendMediaReference(&parts, "视频", p.Videos)
	}
	if options.Audios {
		appendMediaReference(&parts, "音频", p.Audios)
	}
	if options.Files {
		appendMediaReference(&parts, "附件", p.Files)
	}
	return strings.Join(parts, "\n\n")
}

func promptMainText(input map[string]any) string {
	if text, exists := input["text"]; exists {
		return strings.TrimSpace(promptValueText(text))
	}
	return ""
}

func promptExtraParams(input map[string]any, labels map[string]string) []string {
	keys := make([]string, 0, len(input))
	for key, value := range input {
		if isPromptReservedKey(key) || isEmptyProtocolValue(value) {
			continue
		}
		keys = append(keys, key)
	}
	sort.Strings(keys)

	params := make([]string, 0, len(keys))
	for _, key := range keys {
		if text := strings.TrimSpace(promptValueText(input[key])); text != "" {
			params = append(params, fmt.Sprintf("- %s：%s", promptParamLabel(key, labels), text))
		}
	}
	return params
}

func buildPromptText(mainText string, extraParams []string, options PromptOptions, forceTitle bool) string {
	mainText = strings.TrimSpace(mainText)
	if mainText != "" && len(extraParams) == 0 && !forceTitle {
		return mainText
	}

	parts := make([]string, 0, 2)
	if mainText != "" {
		title := strings.TrimSpace(options.TextTitle)
		if title == "" {
			title = "用户输入"
		}
		parts = append(parts, title+"：\n"+mainText)
	}
	if len(extraParams) > 0 {
		parts = append(parts, "补充参数：\n"+strings.Join(extraParams, "\n"))
	}
	return strings.Join(parts, "\n\n")
}

func collectPromptMedia(input map[string]any, target string) []string {
	for _, field := range promptMediaFields {
		if field.Target != target {
			continue
		}
		result := make([]string, 0)
		for _, source := range field.Sources {
			result = append(result, normalizeStringList(input[source])...)
		}
		return result
	}
	return nil
}

func appendMediaReference(parts *[]string, label string, urls []string) {
	if len(urls) == 0 {
		return
	}
	lines := make([]string, 0, len(urls)+1)
	lines = append(lines, label+"：")
	for _, url := range urls {
		lines = append(lines, "- "+url)
	}
	*parts = append(*parts, strings.Join(lines, "\n"))
}

func isPromptReservedKey(key string) bool {
	key = strings.TrimSpace(key)
	if key == "text" {
		return true
	}
	for _, field := range promptMediaFields {
		for _, source := range field.Sources {
			if key == source {
				return true
			}
		}
	}
	return false
}

func promptValueText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return fmt.Sprint(current)
		}
		return string(raw)
	}
}

func promptParamLabel(key string, labels map[string]string) string {
	key = strings.TrimSpace(key)
	if label := strings.TrimSpace(labels[key]); label != "" {
		return label
	}
	return key
}
