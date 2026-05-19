package tool

import (
	"context"
	"fmt"
	"net/http"
	"strings"
)

func executeCurlRequest(ctx context.Context, req Request) (map[string]any, error) {
	raw := inputText(firstPresent(req.Action.Input, "command", "curl", "text"))
	if raw == "" {
		if inputText(firstPresent(req.Action.Input, "url", "uri", "endpoint")) == "" {
			return nil, fmt.Errorf("curl_request 需要提供 command/curl/text 或 url")
		}
		spec, err := httpSpecFromInput(req.Action.Input)
		if err != nil {
			return nil, err
		}
		return performHTTPRequest(ctx, spec)
	}
	spec, err := parseCurlCommand(raw)
	if err != nil {
		return nil, err
	}
	return performHTTPRequest(ctx, spec)
}

func parseCurlCommand(raw string) (httpSpec, error) {
	fields, err := splitCurlFields(raw)
	if err != nil {
		return httpSpec{}, err
	}
	if len(fields) == 0 {
		return httpSpec{}, fmt.Errorf("curl 命令不能为空")
	}
	if fields[0] == "curl" {
		fields = fields[1:]
	}

	spec := httpSpec{Method: http.MethodGet, Headers: map[string]string{}}
	for index := 0; index < len(fields); index++ {
		token := fields[index]
		switch {
		case token == "-s" || token == "-S" || token == "-L" || token == "--silent" || token == "--show-error" || token == "--location":
			continue
		case token == "-G" || token == "--get":
			spec.Method = http.MethodGet
		case token == "-I" || token == "--head":
			spec.Method = http.MethodHead
		case token == "-X" || token == "--request":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Method = strings.ToUpper(value)
			index = next
		case strings.HasPrefix(token, "-X") && len(token) > 2:
			spec.Method = strings.ToUpper(strings.TrimSpace(token[2:]))
		case strings.HasPrefix(token, "--request="):
			spec.Method = strings.ToUpper(strings.TrimSpace(strings.TrimPrefix(token, "--request=")))
		case token == "-H" || token == "--header":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			key, headerValue, ok := strings.Cut(value, ":")
			if ok && !blockedRequestHeader(key) {
				spec.Headers[strings.TrimSpace(key)] = strings.TrimSpace(headerValue)
			}
			index = next
		case token == "-A" || token == "--user-agent":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Headers["User-Agent"] = value
			index = next
		case token == "-d" || token == "--data" || token == "--data-raw" || token == "--data-binary":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Body = []byte(value)
			if spec.Method == http.MethodGet {
				spec.Method = http.MethodPost
			}
			index = next
		case strings.HasPrefix(token, "--data="):
			spec.Body = []byte(strings.TrimPrefix(token, "--data="))
			if spec.Method == http.MethodGet {
				spec.Method = http.MethodPost
			}
		case token == "-o" || token == "--output" || token == "-O" || token == "--remote-name" || token == "-k" || token == "--insecure":
			return httpSpec{}, fmt.Errorf("不允许的 curl 参数: %s", token)
		case strings.HasPrefix(token, "-"):
			return httpSpec{}, fmt.Errorf("暂不支持的 curl 参数: %s", token)
		default:
			if spec.URL != "" {
				return httpSpec{}, fmt.Errorf("curl 命令包含多个 URL")
			}
			spec.URL = token
		}
	}
	if spec.URL == "" {
		return httpSpec{}, fmt.Errorf("curl 命令缺少 URL")
	}
	if !allowedHTTPMethod(spec.Method) {
		return httpSpec{}, fmt.Errorf("不支持的 HTTP 方法: %s", spec.Method)
	}
	parsed, err := normalizeHTTPURL(spec.URL)
	if err != nil {
		return httpSpec{}, err
	}
	spec.URL = parsed.String()
	return spec, nil
}

func splitCurlFields(raw string) ([]string, error) {
	fields := make([]string, 0)
	var builder strings.Builder
	var quote rune
	escaped := false
	for _, char := range raw {
		if escaped {
			builder.WriteRune(char)
			escaped = false
			continue
		}
		if char == '\\' && quote != '\'' {
			escaped = true
			continue
		}
		if quote != 0 {
			if char == quote {
				quote = 0
				continue
			}
			builder.WriteRune(char)
			continue
		}
		switch char {
		case '\'', '"':
			quote = char
		case '|', ';', '<', '>', '`', '&':
			return nil, fmt.Errorf("curl 命令包含不允许的 shell 操作符")
		case ' ', '\t', '\r', '\n':
			if builder.Len() > 0 {
				fields = append(fields, builder.String())
				builder.Reset()
			}
		default:
			builder.WriteRune(char)
		}
	}
	if escaped {
		builder.WriteRune('\\')
	}
	if quote != 0 {
		return nil, fmt.Errorf("curl 命令引号未闭合")
	}
	if builder.Len() > 0 {
		fields = append(fields, builder.String())
	}
	return fields, nil
}

func nextCurlValue(fields []string, index int) (string, int, bool) {
	next := index + 1
	if next >= len(fields) {
		return "", index, false
	}
	return fields[next], next, true
}
