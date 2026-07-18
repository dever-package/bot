package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/netguard"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	defaultHTTPTimeout = 10
	maxHTTPTimeout     = 60
)

type httpRequestSpec struct {
	Method  string
	URL     string
	Headers map[string]string
	Body    []byte
	Timeout int
}

func httpRequestTool(loaded map[string]agentskill.Entry) Tool {
	return Tool{
		Definition: Definition{
			Name:        "http_request",
			Description: "通过已加载技能发起 HTTP 请求。",
			Parameters: objectParameters(map[string]any{
				"skill":           skillProperty(),
				"url":             map[string]any{"type": "string", "description": "请求地址"},
				"method":          map[string]any{"type": "string", "enum": []any{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"}},
				"headers":         map[string]any{"type": "object", "additionalProperties": map[string]any{"type": "string"}},
				"query":           map[string]any{"type": "object", "additionalProperties": true},
				"json":            map[string]any{"description": "JSON 内容"},
				"body":            map[string]any{"type": "string", "description": "文本内容"},
				"timeout_seconds": map[string]any{"type": "integer", "minimum": 1, "maximum": 60},
			}, "url"),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			spec, err := httpSpec(call.Arguments)
			if err != nil {
				return Result{}, err
			}
			content, err := performHTTP(ctx, spec)
			if err != nil {
				return Result{}, err
			}
			content["skill"] = entry.Key
			return Result{Text: resultText(content, "HTTP 请求完成"), Content: content}, nil
		},
	}
}

func httpSpec(arguments map[string]any) (httpRequestSpec, error) {
	method := strings.ToUpper(argumentText(arguments, "method"))
	if method == "" {
		method = http.MethodGet
	}
	if !allowedHTTPMethod(method) {
		return httpRequestSpec{}, fmt.Errorf("不支持的 HTTP 方法: %s", method)
	}
	parsed, err := normalizeHTTPURL(argumentText(arguments, "url"))
	if err != nil {
		return httpRequestSpec{}, err
	}
	applyHTTPQuery(parsed, argumentMap(arguments, "query"))
	headers := requestHeaders(argumentMap(arguments, "headers"))
	body, contentType, err := requestBody(arguments)
	if err != nil {
		return httpRequestSpec{}, err
	}
	if contentType != "" {
		if _, exists := headers["Content-Type"]; !exists {
			headers["Content-Type"] = contentType
		}
	}
	if len(body) > 0 && method == http.MethodGet {
		method = http.MethodPost
	}
	return httpRequestSpec{
		Method: method, URL: parsed.String(), Headers: headers, Body: body,
		Timeout: clampHTTPTimeout(ArgumentInt(arguments, "timeout_seconds", defaultHTTPTimeout)),
	}, nil
}

func performHTTP(ctx context.Context, spec httpRequestSpec) (map[string]any, error) {
	parsed, err := url.Parse(spec.URL)
	if err != nil {
		return nil, err
	}
	if err := netguard.ValidateURL(ctx, parsed); err != nil {
		return nil, err
	}
	timeout := clampHTTPTimeout(spec.Timeout)
	timeoutCtx, cancel := context.WithTimeout(ctx, time.Duration(timeout)*time.Second)
	defer cancel()
	request, err := http.NewRequestWithContext(timeoutCtx, spec.Method, parsed.String(), bytes.NewReader(spec.Body))
	if err != nil {
		return nil, err
	}
	for key, value := range spec.Headers {
		request.Header.Set(key, value)
	}
	client := netguard.NewClient(time.Duration(timeout) * time.Second)
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(response.Body, int64(agentskill.HTTPMaxLen)+1))
	if err != nil {
		return nil, err
	}
	truncated := len(raw) > agentskill.HTTPMaxLen
	if truncated {
		raw = raw[:agentskill.HTTPMaxLen]
	}
	body := string(raw)
	return map[string]any{
		"status_code": response.StatusCode,
		"headers":     responseHeaders(response.Header),
		"body":        body,
		"text":        body,
		"truncated":   truncated,
	}, nil
}

func allowedHTTPMethod(method string) bool {
	switch method {
	case http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodHead:
		return true
	default:
		return false
	}
}

func normalizeHTTPURL(raw string) (*url.URL, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil, fmt.Errorf("HTTP URL 不能为空")
	}
	if !strings.Contains(raw, "://") {
		raw = "https://" + raw
	}
	parsed, err := url.Parse(strings.ReplaceAll(raw, " ", "%20"))
	if err != nil {
		return nil, err
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return nil, fmt.Errorf("只允许 http/https URL")
	}
	if strings.TrimSpace(parsed.Hostname()) == "" {
		return nil, fmt.Errorf("HTTP URL 缺少主机")
	}
	return parsed, nil
}

func applyHTTPQuery(parsed *url.URL, query map[string]any) {
	values := parsed.Query()
	for key, raw := range query {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		switch current := raw.(type) {
		case []any:
			for _, item := range current {
				values.Add(key, strings.TrimSpace(fmt.Sprint(item)))
			}
		default:
			values.Set(key, strings.TrimSpace(fmt.Sprint(raw)))
		}
	}
	parsed.RawQuery = values.Encode()
}

func requestHeaders(raw map[string]any) map[string]string {
	result := make(map[string]string, len(raw))
	for key, value := range raw {
		key = strings.TrimSpace(key)
		if key == "" || blockedRequestHeader(key) {
			continue
		}
		if text := strings.TrimSpace(fmt.Sprint(value)); text != "" && text != "<nil>" {
			result[key] = text
		}
	}
	return result
}

func blockedRequestHeader(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "host", "content-length", "connection", "proxy-authorization", "authorization", "cookie":
		return true
	default:
		return false
	}
}

func requestBody(arguments map[string]any) ([]byte, string, error) {
	if raw, exists := arguments["json"]; exists && raw != nil {
		body, err := json.Marshal(raw)
		return body, "application/json", err
	}
	if body := argumentText(arguments, "body"); body != "" {
		return []byte(body), "", nil
	}
	return nil, "", nil
}

func responseHeaders(headers http.Header) map[string]string {
	result := map[string]string{}
	for key, values := range headers {
		switch strings.ToLower(strings.TrimSpace(key)) {
		case "set-cookie", "authorization", "proxy-authorization", "cookie":
			continue
		}
		if len(values) > 0 {
			result[key] = strings.Join(values, ", ")
		}
	}
	return result
}

func clampHTTPTimeout(value int) int {
	if value <= 0 {
		return defaultHTTPTimeout
	}
	if value > maxHTTPTimeout {
		return maxHTTPTimeout
	}
	return value
}
