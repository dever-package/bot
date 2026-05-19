package action

import (
	"encoding/json"
	"strings"
)

func extractJSONFence(text string, languages []string, accept func(map[string]any) bool) (string, map[string]any, bool) {
	for _, lang := range languages {
		clean, payload, ok := extractJSONFenceByLang(text, lang, accept)
		if ok {
			return clean, payload, true
		}
	}
	return text, nil, false
}

func extractJSONObject(text string, accept func(map[string]any) bool) (map[string]any, bool) {
	trimmed := strings.TrimSpace(text)
	if trimmed == "" || !strings.HasPrefix(trimmed, "{") {
		return nil, false
	}

	var payload map[string]any
	if err := unmarshalJSONPayload(trimmed, &payload); err != nil {
		return nil, false
	}
	if !accept(payload) {
		return nil, false
	}
	return payload, true
}

func extractJSONFenceByLang(text string, lang string, accept func(map[string]any) bool) (string, map[string]any, bool) {
	open := "```" + lang
	start := strings.Index(text, open)
	if start < 0 {
		return text, nil, false
	}

	bodyStart := start + len(open)
	for bodyStart < len(text) && isFenceWhitespace(text[bodyStart]) {
		bodyStart++
	}

	searchStart := bodyStart
	for {
		endOffset := strings.Index(text[searchStart:], "```")
		if endOffset < 0 {
			return text, nil, false
		}
		end := searchStart + endOffset

		var payload map[string]any
		if err := unmarshalJSONPayload(strings.TrimSpace(text[bodyStart:end]), &payload); err != nil {
			searchStart = end + 3
			continue
		}
		if !accept(payload) {
			searchStart = end + 3
			continue
		}

		clean := strings.TrimSpace(text[:start] + text[end+3:])
		return clean, payload, true
	}
}

func unmarshalJSONPayload(text string, target any) error {
	if err := json.Unmarshal([]byte(text), target); err == nil {
		return nil
	}
	return json.Unmarshal([]byte(escapeJSONControlChars(text)), target)
}

func escapeJSONControlChars(text string) string {
	var builder strings.Builder
	builder.Grow(len(text))
	inString := false
	escaped := false
	for _, value := range text {
		if escaped {
			builder.WriteRune(value)
			escaped = false
			continue
		}
		if value == '\\' {
			builder.WriteRune(value)
			escaped = inString
			continue
		}
		if value == '"' {
			inString = !inString
			builder.WriteRune(value)
			continue
		}
		if inString && value < 0x20 {
			switch value {
			case '\n':
				builder.WriteString(`\n`)
			case '\r':
				builder.WriteString(`\r`)
			case '\t':
				builder.WriteString(`\t`)
			default:
				builder.WriteString(`\u00`)
				builder.WriteByte(hexDigit(byte(value >> 4)))
				builder.WriteByte(hexDigit(byte(value & 0x0f)))
			}
			continue
		}
		builder.WriteRune(value)
	}
	return builder.String()
}

func hexDigit(value byte) byte {
	if value < 10 {
		return '0' + value
	}
	return 'a' + value - 10
}

func isFenceWhitespace(value byte) bool {
	return value == ' ' || value == '\t' || value == '\r' || value == '\n'
}
