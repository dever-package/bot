package input

import (
	"context"
	"encoding/base64"
	"fmt"
	"mime"
	"net/http"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type serviceParamFileCacheEntry struct {
	value string
	size  int64
}

func ParseServiceParamFileValueFormat(value string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", botmodel.ServiceParamFileValueFormatURL:
		return botmodel.ServiceParamFileValueFormatURL, nil
	case botmodel.ServiceParamFileValueFormatBase64:
		return botmodel.ServiceParamFileValueFormatBase64, nil
	case botmodel.ServiceParamFileValueFormatDataURL:
		return botmodel.ServiceParamFileValueFormatDataURL, nil
	default:
		return "", fmt.Errorf("文件值格式仅支持 URL、Base64 或 Data URL")
	}
}

func formatServiceParamFileValue(
	ctx context.Context,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
	cache map[string]serviceParamFileCacheEntry,
) (any, error) {
	if !IsFileParamType(param.Type) {
		return value, nil
	}
	format, err := ParseServiceParamFileValueFormat(serviceParam.FileValueFormat)
	if err != nil {
		return nil, err
	}
	if format == botmodel.ServiceParamFileValueFormatURL {
		return value, nil
	}
	maxBytes, err := serviceParamFileValueMaxBytes(ctx, param)
	if err != nil {
		return nil, err
	}
	return formatServiceParamFileValues(ctx, value, format, maxBytes, cache)
}

func formatServiceParamFileValues(
	ctx context.Context,
	value any,
	format string,
	maxBytes int64,
	cache map[string]serviceParamFileCacheEntry,
) (any, error) {
	switch current := value.(type) {
	case []any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			formatted, err := formatServiceParamFileValues(ctx, item, format, maxBytes, cache)
			if err != nil {
				return nil, err
			}
			result = append(result, formatted)
		}
		return result, nil
	case []string:
		result := make([]string, 0, len(current))
		for _, item := range current {
			formatted, err := formatServiceParamFileString(ctx, item, format, maxBytes, cache)
			if err != nil {
				return nil, err
			}
			result = append(result, formatted)
		}
		return result, nil
	default:
		return formatServiceParamFileString(ctx, ValueText(value), format, maxBytes, cache)
	}
}

func formatServiceParamFileString(
	ctx context.Context,
	value string,
	format string,
	maxBytes int64,
	cache map[string]serviceParamFileCacheEntry,
) (string, error) {
	value = strings.TrimSpace(value)
	cacheKey := format + "\x00" + value
	if cached, exists := cache[cacheKey]; exists {
		if cached.size > maxBytes {
			return "", serviceParamFileTooLargeError(maxBytes)
		}
		return cached.value, nil
	}
	content, mimeType, err := readServiceParamFileValue(ctx, value, maxBytes)
	if err != nil {
		return "", err
	}
	encoded := base64.StdEncoding.EncodeToString(content)
	formatted := encoded
	if format == botmodel.ServiceParamFileValueFormatDataURL {
		formatted = "data:" + detectServiceParamFileMIME(content, mimeType) + ";base64," + encoded
	}
	cache[cacheKey] = serviceParamFileCacheEntry{value: formatted, size: int64(len(content))}
	return formatted, nil
}

func decodeServiceParamDataURL(value string, maxBytes int64) ([]byte, string, error) {
	header, encoded, found := strings.Cut(strings.TrimSpace(value), ",")
	if !found || !strings.Contains(strings.ToLower(header), ";base64") {
		return nil, "", fmt.Errorf("Data URL 必须包含 Base64 文件内容")
	}
	content, err := decodeServiceParamBase64(encoded, maxBytes)
	if err != nil {
		return nil, "", err
	}
	mimeType := ""
	if len(header) >= len("data:") {
		mimeType = strings.TrimSpace(strings.Split(header[len("data:"):], ";")[0])
	}
	return content, mimeType, nil
}

func decodeServiceParamBase64(value string, maxBytes int64) ([]byte, error) {
	encoded := compactServiceParamBase64(value)
	if encoded == "" {
		return nil, fmt.Errorf("Base64 文件内容为空")
	}
	if int64(base64.StdEncoding.DecodedLen(len(encoded))) > maxBytes {
		return nil, serviceParamFileTooLargeError(maxBytes)
	}
	content, err := botprotocol.DecodeBase64Content(encoded)
	if err != nil {
		return nil, fmt.Errorf("Base64 文件格式无效")
	}
	if int64(len(content)) > maxBytes {
		return nil, serviceParamFileTooLargeError(maxBytes)
	}
	return content, nil
}

func compactServiceParamBase64(value string) string {
	return strings.NewReplacer("\n", "", "\r", "", " ", "", "\t", "").Replace(strings.TrimSpace(value))
}

func isLikelyServiceParamBase64(value string) bool {
	value = strings.TrimSpace(value)
	if len(value) > 4096 {
		value = value[:4096]
	}
	value = strings.NewReplacer("\n", "", "\r", "", "\t", "").Replace(value)
	if len(value) < 128 || strings.Contains(value, " ") || strings.Contains(value, "://") || strings.HasPrefix(value, "/") {
		return false
	}
	for _, current := range value {
		if (current >= 'a' && current <= 'z') || (current >= 'A' && current <= 'Z') || (current >= '0' && current <= '9') || current == '+' || current == '/' || current == '=' {
			continue
		}
		return false
	}
	prefixLength := len(value)
	if prefixLength > 1024 {
		prefixLength = 1024
	}
	prefixLength -= prefixLength % 4
	if prefixLength == 0 {
		return false
	}
	_, err := base64.StdEncoding.DecodeString(value[:prefixLength])
	return err == nil
}

func detectServiceParamFileMIME(content []byte, fallback string) string {
	fallback = normalizeServiceParamMIME(fallback)
	if fallback != "" && fallback != "application/octet-stream" {
		return fallback
	}
	if len(content) > 0 {
		if detected := normalizeServiceParamMIME(http.DetectContentType(content)); detected != "" {
			return detected
		}
	}
	return "application/octet-stream"
}

func normalizeServiceParamMIME(value string) string {
	mediaType, _, err := mime.ParseMediaType(strings.TrimSpace(value))
	if err != nil {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(mediaType))
}
