package input

import (
	"sort"
	"strings"
	"unicode"
	"unicode/utf8"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/shemic/dever/util"
)

type mediaPromptReplacement struct {
	start, end int
	text       string
}

// CompileMediaGenerationPrompt compiles only recognized references against the
// selected service's actual inputs. The editor document is never rewritten.
func CompileMediaGenerationPrompt(prompt, kind string, inputs []MediaReference, context *botprotocol.MediaReferencePromptContext) string {
	if context == nil || (kind != "image" && kind != "video") {
		return prompt
	}
	prompt = mediaReferencePromptBody(prompt)
	entries := mediaReferencePromptEntries(inputs)
	references := MediaReferencesFromPromptMetadata(context.References)
	replacements, structured := structuredMediaPromptReplacements(prompt, context.Content, references, entries)
	if !structured {
		replacements = labeledMediaPromptReplacements(prompt, references, entries)
	}
	var compiled, remaining strings.Builder
	position := 0
	for _, replacement := range replacements {
		compiled.WriteString(prompt[position:replacement.start])
		compiled.WriteString(replacement.text)
		remaining.WriteString(prompt[position:replacement.start])
		position = replacement.end
	}
	compiled.WriteString(prompt[position:])
	remaining.WriteString(prompt[position:])
	prompt = compiled.String()
	if len(entries) > 0 && strings.IndexFunc(remaining.String(), func(r rune) bool { return unicode.IsLetter(r) || unicode.IsNumber(r) }) < 0 {
		prompt = strings.TrimSpace(mediaGenerationInstruction(kind) + "\n" + prompt)
	}
	return appendMediaReferencePromptIndex(prompt, entries, false)
}

func structuredMediaPromptReplacements(prompt string, content map[string]any, references []MediaReference, entries []mediaReferencePromptEntry) ([]mediaPromptReplacement, bool) {
	if util.ToIntDefault(content["version"], 0) != 1 {
		return nil, false
	}
	var plain strings.Builder
	var parts []mediaPromptReplacement
	for _, raw := range botprotocol.NormalizeAnyList(content["parts"]) {
		part := botprotocol.NormalizeMap(raw)
		if botprotocol.AsText(part["type"]) != "reference" {
			plain.WriteString(botprotocol.AsText(part["text"]))
			continue
		}
		label := "@" + normalizeMediaReferencePromptLabel(botprotocol.AsText(part["label"]))
		start := plain.Len()
		plain.WriteString(label)
		names := []string{}
		for _, reference := range references {
			if reference.ReferenceID == 0 || reference.ReferenceID != util.ToUint64(part["ref_id"]) || reference.ReferenceType != botprotocol.AsText(part["ref_type"]) {
				continue
			}
			if !mediaPromptPartSelects(part, reference) {
				continue
			}
			for _, name := range mediaPromptReferenceNames(reference, entries) {
				names = appendUniqueInputKey(names, name)
			}
		}
		if len(names) > 0 {
			parts = append(parts, mediaPromptReplacement{start: start, end: plain.Len(), text: strings.Join(names, "、")})
		}
	}
	if plain.Len() == 0 {
		return nil, false
	}
	result := make([]mediaPromptReplacement, 0, len(parts))
	matched := false
	for offset := 0; offset < len(prompt); {
		start := strings.Index(prompt[offset:], plain.String())
		if start < 0 {
			break
		}
		start += offset
		offset = start + plain.Len()
		// 生成后的正文可能包含同名邮箱；它不是编辑器引用片段。
		if strings.HasPrefix(plain.String(), "@") && mediaPromptEmailAt(prompt, start) {
			continue
		}
		if mediaPromptQuotedAt(prompt, start) {
			continue // 生成正文另外引用的显示文字，不是原编辑器片段。
		}
		if len(parts) > 0 && parts[len(parts)-1].end == plain.Len() && mediaPromptWordContinues(prompt, offset) {
			continue
		}
		matched = true
		for _, part := range parts {
			part.start += start
			part.end += start
			result = append(result, part)
		}
	}
	return result, matched
}

func mediaPromptPartSelects(part map[string]any, reference MediaReference) bool {
	if usage := botprotocol.AsText(part["usage"]); usage != "" && normalizeMediaUsageRole(usage) != normalizeMediaUsageRole(reference.Usage) {
		return false
	}
	items := botprotocol.NormalizeAnyList(part["ref_media_items"])
	if len(items) == 0 {
		items = []any{map[string]any{"url": part["ref_media_url"], "index": part["ref_media_index"]}}
	}
	for _, raw := range items {
		item := botprotocol.NormalizeMap(raw)
		url := botprotocol.AsText(item["url"])
		index := util.ToIntDefault(item["index"], 0)
		if url != "" && url != reference.URL {
			continue
		}
		if url == "" && index > 0 && index != reference.MediaIndex {
			continue
		}
		return true
	}
	return false
}

func mediaPromptReferenceNames(reference MediaReference, entries []mediaReferencePromptEntry) []string {
	names, exactUsage := []string{}, []string{}
	for _, entry := range entries {
		if reference.URL != entry.Reference.URL || normalizeMediaKind(reference.Kind) != normalizeMediaKind(entry.Reference.Kind) {
			continue
		}
		names = appendUniqueInputKey(names, entry.Name)
		if reference.Usage != "" && normalizeMediaUsageRole(reference.Usage) == normalizeMediaUsageRole(entry.Reference.Usage) {
			exactUsage = appendUniqueInputKey(exactUsage, entry.Name)
		}
	}
	if len(exactUsage) > 0 {
		return exactUsage
	}
	return names
}

func labeledMediaPromptReplacements(prompt string, references []MediaReference, entries []mediaReferencePromptEntry) []mediaPromptReplacement {
	labels := map[string]string{}
	for _, reference := range references {
		label := normalizeMediaReferencePromptLabel(reference.Label)
		names := mediaPromptReferenceNames(reference, entries)
		if label == "" || len(names) == 0 {
			continue
		}
		text := strings.Join(names, "、")
		if previous, exists := labels[label]; exists && previous != text {
			text = "" // 同名素材必须由结构化身份区分，不能猜测。
		}
		labels[label] = text
	}
	ordered := make([]string, 0, len(labels))
	for label := range labels {
		ordered = append(ordered, label)
	}
	sort.Slice(ordered, func(i, j int) bool { return len(ordered[i]) > len(ordered[j]) })
	var result []mediaPromptReplacement
	for position := 0; position < len(prompt); position++ {
		if prompt[position] != '@' || mediaPromptQuotedAt(prompt, position) {
			continue
		}
		if mediaPromptEmailAt(prompt, position) {
			continue
		}
		for _, label := range ordered {
			if labels[label] == "" || !strings.HasPrefix(prompt[position+1:], label) {
				continue
			}
			end := position + 1 + len(label)
			if mediaPromptWordContinues(prompt, end) {
				continue
			}
			result = append(result, mediaPromptReplacement{start: position, end: end, text: labels[label]})
			position = end - 1
			break
		}
	}
	return result
}

func mediaPromptEmailAt(prompt string, position int) bool {
	if position == 0 {
		return false
	}
	previous, _ := utf8.DecodeLastRuneInString(prompt[:position])
	return (previous >= 'a' && previous <= 'z') || (previous >= 'A' && previous <= 'Z') || (previous >= '0' && previous <= '9') || strings.ContainsRune("._%+-", previous)
}

func mediaPromptWordContinues(prompt string, position int) bool {
	if position == len(prompt) {
		return false
	}
	next, _ := utf8.DecodeRuneInString(prompt[position:])
	return unicode.IsLetter(next) || unicode.IsNumber(next) || next == '_'
}

func mediaPromptQuotedAt(prompt string, position int) bool {
	var closing rune
	for index, current := range prompt[:position] {
		if current == '\'' && index > 0 && index+1 < len(prompt) {
			before, _ := utf8.DecodeLastRuneInString(prompt[:index])
			after, _ := utf8.DecodeRuneInString(prompt[index+1:])
			if unicode.IsLetter(before) && unicode.IsLetter(after) {
				continue
			}
		}
		if closing != 0 {
			if current == closing {
				closing = 0
			}
			continue
		}
		switch current {
		case '"', '\'':
			closing = current
		case '“':
			closing = '”'
		case '「':
			closing = '」'
		}
	}
	return closing != 0
}

func mediaGenerationInstruction(kind string) string {
	if kind == "video" {
		return "请根据以下参考素材生成视频，保持主体与场景一致。"
	}
	return "请根据以下参考素材生成一张图片。"
}
