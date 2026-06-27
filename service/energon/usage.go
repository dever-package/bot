package energon

import (
	"encoding/json"
	"math"
	"strconv"
	"strings"

	botprovider "github.com/dever-package/bot/service/energon/provider"
)

type tokenUsage struct {
	PromptTokens     int64
	CompletionTokens int64
	TotalTokens      int64
	CachedTokens     int64
}

func (usage tokenUsage) IsZero() bool {
	return usage.PromptTokens == 0 &&
		usage.CompletionTokens == 0 &&
		usage.TotalTokens == 0 &&
		usage.CachedTokens == 0
}

func (usage tokenUsage) Map() map[string]any {
	return map[string]any{
		"prompt_tokens":     usage.PromptTokens,
		"completion_tokens": usage.CompletionTokens,
		"total_tokens":      usage.TotalTokens,
		"cached_tokens":     usage.CachedTokens,
	}
}

func (usage tokenUsage) Prefer(next tokenUsage) tokenUsage {
	if next.IsZero() {
		return usage
	}
	if usage.IsZero() || next.TotalTokens >= usage.TotalTokens {
		return next
	}
	return usage
}

func extractTokenUsage(values ...any) tokenUsage {
	for _, value := range values {
		if usage := extractTokenUsageValue(value); !usage.IsZero() {
			return usage
		}
	}
	return tokenUsage{}
}

func extractResponseTokenUsage(resp *botprovider.Response, values ...any) tokenUsage {
	usage := extractTokenUsage(values...)
	if resp == nil {
		return usage
	}
	return usage.Prefer(extractTokenUsage(resp.Body))
}

func extractTokenUsageValue(value any) tokenUsage {
	switch current := value.(type) {
	case nil:
		return tokenUsage{}
	case string:
		return extractTokenUsageString(current)
	case []byte:
		return extractTokenUsageString(string(current))
	case map[string]any:
		return extractTokenUsageMap(current)
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return tokenUsage{}
		}
		return extractTokenUsageString(string(raw))
	}
}

func extractTokenUsageString(value string) tokenUsage {
	value = strings.TrimSpace(value)
	if value == "" {
		return tokenUsage{}
	}
	var payload any
	if err := json.Unmarshal([]byte(value), &payload); err != nil {
		return tokenUsage{}
	}
	return extractTokenUsageValue(payload)
}

func extractTokenUsageMap(payload map[string]any) tokenUsage {
	if len(payload) == 0 {
		return tokenUsage{}
	}
	for _, key := range []string{"usage", "usage_metadata", "usageMetadata", "token_usage", "tokenUsage"} {
		if usageMap := normalizeUsageMap(payload[key]); len(usageMap) > 0 {
			if usage := tokenUsageFromMap(usageMap); !usage.IsZero() {
				return usage
			}
		}
	}
	if dataMap := normalizeUsageMap(payload["data"]); len(dataMap) > 0 {
		if usage := extractTokenUsageMap(dataMap); !usage.IsZero() {
			return usage
		}
	}
	if jsonMap := normalizeUsageMap(payload["json"]); len(jsonMap) > 0 {
		if usage := extractTokenUsageMap(jsonMap); !usage.IsZero() {
			return usage
		}
	}
	return tokenUsageFromMap(payload)
}

func tokenUsageFromMap(payload map[string]any) tokenUsage {
	usage := tokenUsage{
		PromptTokens: firstUsageInt(payload,
			"prompt_tokens",
			"prompt_token_count",
			"input_tokens",
			"input_token_count",
			"inputTokenCount",
			"promptTokens",
			"promptTokenCount",
			"inputTokens",
		),
		CompletionTokens: firstUsageInt(payload,
			"completion_tokens",
			"completion_token_count",
			"candidates_token_count",
			"output_tokens",
			"output_token_count",
			"outputTokenCount",
			"completionTokens",
			"completionTokenCount",
			"candidatesTokenCount",
			"outputTokens",
		),
		TotalTokens: firstUsageInt(payload,
			"total_tokens",
			"total_token_count",
			"totalTokens",
			"totalTokenCount",
		),
		CachedTokens: firstUsageInt(payload,
			"cached_tokens",
			"cached_token_count",
			"cached_content_token_count",
			"cache_read_input_tokens",
			"cachedTokens",
			"cachedTokenCount",
			"cachedContentTokenCount",
			"cacheReadInputTokens",
		),
	}
	if details := normalizeUsageMap(payload["prompt_tokens_details"]); len(details) > 0 {
		usage.CachedTokens = firstNonZeroInt64(usage.CachedTokens, firstUsageInt(details, "cached_tokens", "cachedTokens"))
	}
	if details := normalizeUsageMap(payload["input_token_details"]); len(details) > 0 {
		usage.CachedTokens = firstNonZeroInt64(usage.CachedTokens, firstUsageInt(details, "cached_tokens", "cache_read_input_tokens", "cachedTokens", "cacheReadInputTokens"))
	}
	if usage.TotalTokens == 0 {
		usage.TotalTokens = usage.PromptTokens + usage.CompletionTokens
	}
	return usage
}

func normalizeUsageMap(value any) map[string]any {
	switch current := value.(type) {
	case map[string]any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return nil
		}
		var result map[string]any
		if err := json.Unmarshal(raw, &result); err != nil {
			return nil
		}
		return result
	}
}

func firstUsageInt(payload map[string]any, keys ...string) int64 {
	for _, key := range keys {
		if value, exists := payload[key]; exists {
			if result := usageInt(value); result > 0 {
				return result
			}
		}
	}
	return 0
}

func usageInt(value any) int64 {
	switch current := value.(type) {
	case int:
		return int64(current)
	case int64:
		return current
	case int32:
		return int64(current)
	case uint64:
		if current > math.MaxInt64 {
			return 0
		}
		return int64(current)
	case uint:
		if uint64(current) > math.MaxInt64 {
			return 0
		}
		return int64(current)
	case float64:
		if current <= 0 {
			return 0
		}
		return int64(current)
	case float32:
		if current <= 0 {
			return 0
		}
		return int64(current)
	case string:
		parsed, err := strconv.ParseInt(strings.TrimSpace(current), 10, 64)
		if err != nil || parsed <= 0 {
			return 0
		}
		return parsed
	default:
		return 0
	}
}

func firstNonZeroInt64(values ...int64) int64 {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}
