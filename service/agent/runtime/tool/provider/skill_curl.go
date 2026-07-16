package provider

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func curlRequestTool(loaded map[string]agentskill.Entry) Tool {
	return Tool{
		Definition: Definition{
			Name:        "curl_request",
			Description: "解析一条不含 shell 管道和重定向的 curl 命令，并按 http_request 相同安全规则请求。",
			Parameters: objectParameters(map[string]any{
				"skill":   skillProperty(),
				"command": map[string]any{"type": "string", "description": "受限 curl 命令"},
			}, "command"),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			spec, err := parseCurl(argumentText(call.Arguments, "command"))
			if err != nil {
				return Result{}, err
			}
			content, err := performHTTP(ctx, spec)
			if err != nil {
				return Result{}, err
			}
			content["skill"] = entry.Key
			return Result{Text: resultText(content, "curl 请求完成"), Content: content}, nil
		},
	}
}

func parseCurl(raw string) (httpRequestSpec, error) {
	fields, err := splitCurl(raw)
	if err != nil {
		return httpRequestSpec{}, err
	}
	if len(fields) > 0 && fields[0] == "curl" {
		fields = fields[1:]
	}
	spec := httpRequestSpec{Method: http.MethodGet, Headers: map[string]string{}, Timeout: defaultHTTPTimeout}
	for index := 0; index < len(fields); index++ {
		token := fields[index]
		switch {
		case token == "-s" || token == "-S" || token == "-L" || token == "--silent" || token == "--show-error" || token == "--location":
		case isPassiveCurlFlags(token):
		case token == "-G" || token == "--get":
			spec.Method = http.MethodGet
		case token == "-I" || token == "--head":
			spec.Method = http.MethodHead
		case token == "-X" || token == "--request":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpRequestSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Method, index = strings.ToUpper(value), next
		case strings.HasPrefix(token, "-X") && len(token) > 2:
			spec.Method = strings.ToUpper(strings.TrimSpace(token[2:]))
		case strings.HasPrefix(token, "--request="):
			spec.Method = strings.ToUpper(strings.TrimSpace(strings.TrimPrefix(token, "--request=")))
		case token == "-H" || token == "--header":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpRequestSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			key, value, ok := strings.Cut(value, ":")
			if ok && !blockedRequestHeader(key) {
				spec.Headers[strings.TrimSpace(key)] = strings.TrimSpace(value)
			}
			index = next
		case token == "-A" || token == "--user-agent":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpRequestSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Headers["User-Agent"], index = value, next
		case token == "-d" || token == "--data" || token == "--data-raw" || token == "--data-binary":
			value, next, ok := nextCurlValue(fields, index)
			if !ok {
				return httpRequestSpec{}, fmt.Errorf("curl %s 缺少参数", token)
			}
			spec.Body, spec.Method, index = []byte(value), http.MethodPost, next
		case strings.HasPrefix(token, "--data="):
			spec.Body, spec.Method = []byte(strings.TrimPrefix(token, "--data=")), http.MethodPost
		case token == "-o" || token == "--output" || token == "-O" || token == "--remote-name" || token == "-k" || token == "--insecure":
			return httpRequestSpec{}, fmt.Errorf("不允许的 curl 参数: %s", token)
		case strings.HasPrefix(token, "-"):
			return httpRequestSpec{}, fmt.Errorf("暂不支持的 curl 参数: %s", token)
		default:
			if spec.URL != "" {
				return httpRequestSpec{}, fmt.Errorf("curl 命令包含多个 URL")
			}
			spec.URL = token
		}
	}
	if !allowedHTTPMethod(spec.Method) {
		return httpRequestSpec{}, fmt.Errorf("不支持的 HTTP 方法: %s", spec.Method)
	}
	parsed, err := normalizeHTTPURL(spec.URL)
	if err != nil {
		return httpRequestSpec{}, err
	}
	spec.URL = parsed.String()
	return spec, nil
}

func isPassiveCurlFlags(token string) bool {
	if len(token) < 3 || !strings.HasPrefix(token, "-") || strings.HasPrefix(token, "--") {
		return false
	}
	for _, flag := range token[1:] {
		if flag != 's' && flag != 'S' && flag != 'L' {
			return false
		}
	}
	return true
}

func splitCurl(raw string) ([]string, error) {
	fields := make([]string, 0)
	var builder strings.Builder
	var quote rune
	escaped := false
	for _, current := range strings.TrimSpace(raw) {
		if escaped {
			builder.WriteRune(current)
			escaped = false
			continue
		}
		if current == '\\' && quote != '\'' {
			escaped = true
			continue
		}
		if quote != 0 {
			if current == quote {
				quote = 0
			} else {
				builder.WriteRune(current)
			}
			continue
		}
		switch current {
		case '\'', '"':
			quote = current
		case '|', ';', '<', '>', '`', '&':
			return nil, fmt.Errorf("curl 命令包含不允许的 shell 操作符")
		case ' ', '\t', '\r', '\n':
			if builder.Len() > 0 {
				fields = append(fields, builder.String())
				builder.Reset()
			}
		default:
			builder.WriteRune(current)
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
