package parse

import (
	"regexp"
	"strings"
	"unicode/utf8"
)

var blankLinePattern = regexp.MustCompile(`\n{3,}`)

func normalizeText(value string) string {
	value = strings.ReplaceAll(value, "\r\n", "\n")
	value = strings.ReplaceAll(value, "\r", "\n")
	value = strings.TrimSpace(value)
	return blankLinePattern.ReplaceAllString(value, "\n\n")
}

func splitLongText(content string, limit int) []string {
	content = strings.TrimSpace(content)
	if content == "" {
		return nil
	}
	if limit <= 0 || utf8.RuneCountInString(content) <= limit {
		return []string{content}
	}
	paragraphs := splitParagraphs(content)
	chunks := make([]string, 0)
	current := ""
	for _, paragraph := range paragraphs {
		if current == "" {
			current = paragraph
			continue
		}
		if utf8.RuneCountInString(current)+utf8.RuneCountInString(paragraph)+2 <= limit {
			current += "\n\n" + paragraph
			continue
		}
		chunks = append(chunks, current)
		current = paragraph
	}
	if strings.TrimSpace(current) != "" {
		chunks = append(chunks, current)
	}
	result := make([]string, 0, len(chunks))
	for _, chunk := range chunks {
		result = append(result, splitOversizedText(chunk, limit)...)
	}
	return result
}

func splitOversizedText(content string, limit int) []string {
	if limit <= 0 || utf8.RuneCountInString(content) <= limit {
		return []string{content}
	}
	runes := []rune(content)
	result := make([]string, 0, len(runes)/limit+1)
	for start := 0; start < len(runes); start += limit {
		end := start + limit
		if end > len(runes) {
			end = len(runes)
		}
		result = append(result, strings.TrimSpace(string(runes[start:end])))
	}
	return result
}

func splitParagraphs(content string) []string {
	parts := strings.Split(normalizeText(content), "\n\n")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			result = append(result, part)
		}
	}
	if len(result) > 0 {
		return result
	}
	for _, line := range strings.Split(normalizeText(content), "\n") {
		line = strings.TrimSpace(line)
		if line != "" {
			result = append(result, line)
		}
	}
	return result
}

func firstLine(content string) string {
	content = normalizeText(content)
	if content == "" {
		return ""
	}
	line := strings.TrimSpace(strings.Split(content, "\n")[0])
	runes := []rune(line)
	if len(runes) > 60 {
		line = string(runes[:60])
	}
	return line
}
