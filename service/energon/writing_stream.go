package energon

import (
	"encoding/json"
	"fmt"
	"math"
	"regexp"
	"strings"
	"unicode/utf8"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

var writingBodyBlockField = regexp.MustCompile(`^blocks\.[0-9]+\.text$`)

var writingNestedPreviewField = regexp.MustCompile(`^(outline\.(overview|world)|inspirations\.[0-9]+\.(title|content)|units\.[0-9]+\.(title|plan)|outline\.(characters|locations|props)\.[0-9]+\.(name|description)|entities\.[0-9]+\.(name|description)|(locations|props)\.[0-9]+\.(name|description))$`)

var writingPreferenceTextField = regexp.MustCompile(`^preferences\.(genre|style|style_instructions|pov|mode)$`)
var writingPreviewNumberField = regexp.MustCompile(`^preferences\.(chapter_words|planned_chapters)$`)
var writingPreviewIdentityField = regexp.MustCompile(`^outline\.(characters|locations|props)\.[0-9]+\.id$`)

// 递归读取合法 JSON 结构和当前字符串前缀，只投影允许展示的创作字段。
func writingPartialFields(arguments string) (map[string]string, map[string]any, string) {
	fields, values, activeField, _ := writingPartialPreview(arguments)
	return fields, values, activeField
}

func writingPartialPreview(arguments string) (map[string]string, map[string]any, string, []string) {
	decoder := json.NewDecoder(strings.NewReader(arguments))
	fields := map[string]string{}
	bodyBlocks := map[string]string{}
	values := map[string]any{}
	activeField := ""
	completedSections := []string{}
	var value func(string) bool
	value = func(path string) bool {
		tail := strings.TrimLeft(arguments[decoder.InputOffset():], " \t\r\n:,")
		bodyBlock := writingBodyBlockField.MatchString(path)
		allowed := bodyBlock || path == "world" || path == "content" || path == "body" || path == "replacement" || path == "plan" || writingNestedPreviewField.MatchString(path) || writingPreferenceTextField.MatchString(path)
		if allowed && strings.HasPrefix(tail, "\"") {
			prefix := writingJSONStringPrefix(tail)
			if prefix != "" {
				if bodyBlock {
					bodyBlocks[path] = prefix
					var body strings.Builder
					for index := 0; ; index++ {
						text, exists := bodyBlocks[fmt.Sprintf("blocks.%d.text", index)]
						if !exists {
							break
						}
						body.WriteString(text)
					}
					fields["body"] = body.String()
					activeField = "body"
				} else {
					fields[path] = prefix
					activeField = path
				}
			}
		}
		token, err := decoder.Token()
		if err != nil {
			return false
		}
		delimiter, ok := token.(json.Delim)
		if !ok {
			// Token 已读到原生字符串的结束引号；非空前缀或字段切换不能证明闭合。
			if _, textual := token.(string); textual && path == "world" {
				completedSections = append(completedSections, path)
			}
			// 标量须有合法分隔符，不能把仍可能继续增长的数字/ID 当完成值。
			rest := strings.TrimLeft(arguments[decoder.InputOffset():], " \t\r\n")
			complete := len(rest) > 0 && strings.ContainsRune(",}]", rune(rest[0]))
			if complete {
				if number, numeric := token.(float64); numeric && writingPreviewNumberField.MatchString(path) && number >= 0 && number <= 1<<53-1 && math.Trunc(number) == number {
					values[path] = number
					if strings.HasPrefix(path, "preferences.") {
						fields[path] = fmt.Sprintf("%.0f", number)
						activeField = path
					}
				}
				if text, textual := token.(string); textual && writingPreviewIdentityField.MatchString(path) {
					values[path] = text
				}
			}
			return true
		}
		switch delimiter {
		case '{':
			for decoder.More() {
				key, err := decoder.Token()
				if err != nil {
					return false
				}
				name, ok := key.(string)
				if !ok {
					return false
				}
				child := name
				if path != "" {
					child = path + "." + name
				}
				if !value(child) {
					return false
				}
			}
		case '[':
			index := 0
			for decoder.More() {
				if !value(fmt.Sprintf("%s.%d", path, index)) {
					return false
				}
				index++
			}
		default:
			return false
		}
		closing, err := decoder.Token()
		if err != nil || delimiter == '{' && closing != json.Delim('}') || delimiter == '[' && closing != json.Delim(']') {
			return false
		}
		if delimiter == '[' && (path == "locations" || path == "props") {
			completedSections = append(completedSections, path)
		}
		return true
	}
	value("")
	return fields, values, activeField, completedSections
}

// 分片可能停在转义、UTF-8 或 UTF-16 代理对中间，只显示已完整解码的前缀。
func writingJSONStringPrefix(raw string) string {
	end := 1
	for end < len(raw) {
		switch raw[end] {
		case '"':
			var value string
			if json.Unmarshal([]byte(raw[:end+1]), &value) == nil {
				return value
			}
			return ""
		case '\\':
			if end+1 >= len(raw) {
				goto complete
			}
			if raw[end+1] != 'u' {
				if !strings.ContainsRune("\"\\/bfnrt", rune(raw[end+1])) {
					return ""
				}
				end += 2
				continue
			}
			if end+6 > len(raw) {
				goto complete
			}
			var escaped string
			if json.Unmarshal([]byte("\""+raw[end:end+6]+"\""), &escaped) != nil {
				return ""
			}
			// json.Unmarshal 将不完整代理对替换为 RuneError，等待后一转义后再显示。
			if escaped == string(utf8.RuneError) && strings.HasPrefix(strings.ToLower(raw[end:end+6]), "\\ud") {
				if end+12 > len(raw) {
					goto complete
				}
				if json.Unmarshal([]byte("\""+raw[end:end+12]+"\""), &escaped) != nil || strings.ContainsRune(escaped, utf8.RuneError) {
					return ""
				}
				end += 12
				continue
			}
			end += 6
		default:
			if !utf8.FullRuneInString(raw[end:]) {
				goto complete
			}
			r, size := utf8.DecodeRuneInString(raw[end:])
			if r < 0x20 || r == utf8.RuneError && size == 1 {
				return ""
			}
			end += size
		}
	}
complete:
	var value string
	if json.Unmarshal([]byte(raw[:end]+"\""), &value) != nil {
		return ""
	}
	return value
}

func (progress *powerOutputStreamProgress) writingPreview(force bool) (botprotocol.Output, bool) {
	if progress.outputType != "story" || !progress.refreshPreview(force) {
		return nil, false
	}
	for _, call := range progress.calls.Snapshot() {
		if !strings.EqualFold(strings.TrimSpace(call.Name), submitOutputToolName) {
			continue
		}
		fields, values, activeField, completedSections := writingPartialPreview(call.Arguments)
		preview := map[string]any{"fields": fields, "values": values, "active_field": activeField}
		if len(completedSections) > 0 {
			preview["completed_sections"] = completedSections
		}
		// 仅已闭合的章节对象可进入持久草稿；显示用的字符串前缀不能冒充完整章纲。
		if units := writingPartialChapterPlans(call.Arguments); len(units) > 0 {
			preview["units"] = units
		}
		encoded, _ := json.Marshal(preview)
		signature := string(encoded)
		if len(fields) == 0 && len(completedSections) == 0 || signature == progress.previewText {
			continue
		}
		progress.previewText = signature
		return botprotocol.Output{"event": "status", "meta": map[string]any{"writing_preview": preview}}, true
	}
	return nil, false
}

func writingPartialChapterPlans(arguments string) []json.RawMessage {
	decoder := json.NewDecoder(strings.NewReader(arguments))
	if token, err := decoder.Token(); err != nil || token != json.Delim('{') {
		return nil
	}
	for decoder.More() {
		key, err := decoder.Token()
		if err != nil {
			return nil
		}
		if key != "units" {
			var ignored json.RawMessage
			if decoder.Decode(&ignored) != nil {
				return nil
			}
			continue
		}
		if token, err := decoder.Token(); err != nil || token != json.Delim('[') {
			return nil
		}
		var units []json.RawMessage
		for decoder.More() {
			var unit json.RawMessage
			if decoder.Decode(&unit) != nil {
				break
			}
			units = append(units, unit)
		}
		return units
	}
	return nil
}
