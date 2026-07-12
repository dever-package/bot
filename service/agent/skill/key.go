package skill

import (
	"path/filepath"
	"strings"
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

func IsSafePath(path string) bool {
	cleaned := filepath.Clean(path)
	root := filepath.Clean(Root)
	return cleaned == root || strings.HasPrefix(cleaned, root+string(filepath.Separator))
}
