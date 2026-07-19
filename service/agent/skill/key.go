package skill

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

const (
	MaxKeyRunes          = 128
	MaxNameRunes         = 128
	MaxDescriptionRunes  = 512
	MaxSourceURLRunes    = 512
	MaxEntryFileRunes    = 128
	MaxInstallInputBytes = 64 * 1024
	MaxManifestBytes     = 256 * 1024
)

func NormalizeKey(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	var builder strings.Builder
	for _, char := range value {
		switch {
		case char >= 'a' && char <= 'z':
			builder.WriteRune(char)
		case char >= 'A' && char <= 'Z':
			builder.WriteRune(char + ('a' - 'A'))
		case char >= '0' && char <= '9', char == '_', char == '-':
			builder.WriteRune(char)
		case char == ' ' || char == '/':
			builder.WriteRune('-')
		}
	}
	return strings.Trim(builder.String(), "-_")
}

func ValidateMetadata(key string, name string, description string) error {
	fields := []struct {
		label string
		value string
		limit int
	}{
		{label: "技能标识", value: strings.TrimSpace(key), limit: MaxKeyRunes},
		{label: "技能名称", value: strings.TrimSpace(name), limit: MaxNameRunes},
		{label: "技能描述", value: strings.TrimSpace(description), limit: MaxDescriptionRunes},
	}
	for index, field := range fields {
		if index < 2 && field.value == "" {
			return fmt.Errorf("%s不能为空", field.label)
		}
		if utf8.RuneCountInString(field.value) > field.limit {
			return fmt.Errorf("%s不能超过 %d 个字符", field.label, field.limit)
		}
	}
	return nil
}

func ValidateStoredText(label string, value string, limit int) error {
	if utf8.RuneCountInString(strings.TrimSpace(value)) > limit {
		return fmt.Errorf("%s不能超过 %d 个字符", label, limit)
	}
	return nil
}

func ValidateStoredBytes(label string, value string, limit int) error {
	if len([]byte(value)) > limit {
		return fmt.Errorf("%s不能超过 %dKB", label, limit/1024)
	}
	return nil
}
