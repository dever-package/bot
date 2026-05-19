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
	searchStart := 0
	for {
		start, bodyStart, ok := findFenceStart(text, lang, searchStart)
		if !ok {
			return text, nil, false
		}

		endOffset := strings.Index(text[bodyStart:], "```")
		if endOffset < 0 {
			if payload, ok := parseJSONPayload(strings.TrimSpace(text[bodyStart:]), accept); ok {
				return strings.TrimSpace(text[:start]), payload, true
			}
			if payload, ok := extractJSONObjectInText(text[bodyStart:], accept); ok {
				return strings.TrimSpace(text[:start]), payload, true
			}
			return text, nil, false
		}

		end := bodyStart + endOffset
		body := strings.TrimSpace(text[bodyStart:end])
		if payload, ok := parseJSONPayload(body, accept); ok {
			clean := strings.TrimSpace(text[:start] + text[end+3:])
			return clean, payload, true
		}
		if payload, ok := extractJSONObjectInText(body, accept); ok {
			clean := strings.TrimSpace(text[:start] + text[end+3:])
			return clean, payload, true
		}
		searchStart = end + 3
	}
}

func findFenceStart(text string, lang string, offset int) (int, int, bool) {
	for offset < len(text) {
		startOffset := strings.Index(text[offset:], "```")
		if startOffset < 0 {
			return 0, 0, false
		}
		start := offset + startOffset
		headerStart := start + 3
		headerEnd := lineEnd(text, headerStart)
		header := strings.TrimSpace(text[headerStart:headerEnd])
		if fenceLangMatches(header, lang) {
			bodyStart := headerEnd
			for bodyStart < len(text) && (text[bodyStart] == '\r' || text[bodyStart] == '\n') {
				bodyStart++
			}
			return start, bodyStart, true
		}
		offset = headerStart
	}
	return 0, 0, false
}

func lineEnd(text string, offset int) int {
	for offset < len(text) && text[offset] != '\n' && text[offset] != '\r' {
		offset++
	}
	return offset
}

func fenceLangMatches(header string, lang string) bool {
	fields := strings.Fields(header)
	return len(fields) > 0 && fields[0] == lang
}

func parseJSONPayload(text string, accept func(map[string]any) bool) (map[string]any, bool) {
	var payload map[string]any
	if err := unmarshalJSONPayload(text, &payload); err != nil {
		return nil, false
	}
	if !accept(payload) {
		return nil, false
	}
	return payload, true
}

func extractJSONObjectInText(text string, accept func(map[string]any) bool) (map[string]any, bool) {
	for offset := 0; offset < len(text); {
		startOffset := strings.Index(text[offset:], "{")
		if startOffset < 0 {
			return nil, false
		}
		start := offset + startOffset
		raw, ok := balancedJSONObject(text[start:])
		if ok {
			if payload, ok := parseJSONPayload(raw, accept); ok {
				return payload, true
			}
		}
		offset = start + 1
	}
	return nil, false
}

func balancedJSONObject(text string) (string, bool) {
	depth := 0
	inString := false
	escaped := false
	for index, value := range text {
		if escaped {
			escaped = false
			continue
		}
		if inString {
			if value == '\\' {
				escaped = true
				continue
			}
			if value == '"' {
				inString = false
			}
			continue
		}
		switch value {
		case '"':
			inString = true
		case '{':
			depth++
		case '}':
			depth--
			if depth == 0 {
				return text[:index+1], true
			}
		}
	}
	return "", false
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
