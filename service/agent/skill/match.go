package skill

import (
	"path/filepath"
	"strings"
	"unicode"
)

func MatchByInput(entries []Entry, input string) ([]Entry, []string) {
	normalizedInput := normalizeMatchText(input)
	if normalizedInput == "" {
		return nil, nil
	}
	selected := make([]Entry, 0)
	keys := make([]string, 0)
	seen := map[string]bool{}
	for _, entry := range entries {
		key := NormalizeKey(entry.Key)
		if key == "" || seen[key] {
			continue
		}
		if entryMatchesInput(entry, normalizedInput) {
			seen[key] = true
			selected = append(selected, entry)
			keys = append(keys, key)
		}
	}
	return selected, keys
}

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

func entryMatchesInput(entry Entry, normalizedInput string) bool {
	for _, term := range entryMatchTerms(entry) {
		term = normalizeMatchText(term)
		if !isUsefulMatchTerm(term) {
			continue
		}
		if termMatches(normalizedInput, term) {
			return true
		}
	}
	return false
}

func entryMatchTerms(entry Entry) []string {
	terms := make([]string, 0, len(entry.Triggers)+2)
	terms = append(terms, entry.Key, entry.Name)
	terms = append(terms, entry.Triggers...)
	return terms
}

func termMatches(input string, term string) bool {
	if isASCIIText(term) {
		return strings.Contains(" "+input+" ", " "+term+" ")
	}
	return strings.Contains(input, term)
}

func isUsefulMatchTerm(term string) bool {
	if term == "" {
		return false
	}
	count := runeLen(term)
	if isASCIIText(term) {
		return count >= 3
	}
	return count >= 2
}

func normalizeMatchText(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == "" {
		return ""
	}
	var builder strings.Builder
	lastSpace := false
	for _, char := range value {
		if unicode.IsLetter(char) || unicode.IsNumber(char) {
			builder.WriteRune(char)
			lastSpace = false
			continue
		}
		if !lastSpace {
			builder.WriteByte(' ')
			lastSpace = true
		}
	}
	return strings.Join(strings.Fields(builder.String()), " ")
}

func isASCIIText(value string) bool {
	for _, char := range value {
		if char > unicode.MaxASCII {
			return false
		}
	}
	return true
}
