package adapters

import (
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
)

func resolveServicePath(api string, fallback string) string {
	api = strings.TrimSpace(api)
	if strings.HasPrefix(api, "/") || hasHTTPURLScheme(api) {
		return api
	}
	return fallback
}

func resolveNativePath(input botprotocol.NativeInput, fallback string) string {
	if path := normalizeConfiguredPath(input.Service.Path); path != "" {
		return path
	}
	return resolveServicePath(input.ServiceAPI, fallback)
}

func resolveConfiguredPath(input botprotocol.NativeInput, fallback string) string {
	if path := normalizeConfiguredPath(input.Service.Path); path != "" {
		return path
	}
	return fallback
}

func normalizeConfiguredPath(path string) string {
	path = strings.TrimSpace(path)
	if path == "" {
		return ""
	}
	return path
}

func nativeModelName(api string) string {
	api = strings.TrimSpace(api)
	if api == "" || strings.HasPrefix(api, "/") || hasHTTPURLScheme(api) {
		return ""
	}
	return api
}

func hasHTTPURLScheme(value string) bool {
	value = strings.ToLower(strings.TrimSpace(value))
	return strings.HasPrefix(value, "http://") || strings.HasPrefix(value, "https://")
}

func cloneBody(body map[string]any) map[string]any {
	result := make(map[string]any, len(body))
	for key, value := range body {
		result[key] = value
	}
	return result
}

func deleteGatewayKeys(body map[string]any) {
	delete(body, "mode")
	delete(body, "protocol")
	delete(body, "path")
	delete(body, "method")
	delete(body, "host")
	delete(body, "power")
}

func isGatewayStreamOption(key string) bool {
	return strings.EqualFold(strings.TrimSpace(key), "stream")
}

func isOpenAINativeBodyKey(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "temperature",
		"top_p",
		"max_tokens",
		"max_completion_tokens",
		"presence_penalty",
		"frequency_penalty",
		"stop",
		"seed",
		"response_format",
		"tools",
		"tool_choice",
		"parallel_tool_calls",
		"logprobs",
		"top_logprobs",
		"user",
		"n",
		"modalities",
		"audio",
		"reasoning_effort":
		return true
	default:
		return false
	}
}
