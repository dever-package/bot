package agent

import "strings"

const (
	SuggestionModeInstant     = "instant"
	SuggestionModeAfterResult = "after_result"
	SuggestionModeOff         = "off"
)

var suggestionModeOptions = []map[string]any{
	{"id": SuggestionModeInstant, "value": "即时生成（推荐）"},
	{"id": SuggestionModeAfterResult, "value": "结果后生成"},
	{"id": SuggestionModeOff, "value": "关闭建议"},
}

func NormalizeSuggestionMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case SuggestionModeAfterResult:
		return SuggestionModeAfterResult
	case SuggestionModeOff:
		return SuggestionModeOff
	default:
		return SuggestionModeInstant
	}
}

func SuggestionEnabled(value string) bool {
	return NormalizeSuggestionMode(value) != SuggestionModeOff
}
