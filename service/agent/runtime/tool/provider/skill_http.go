package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/netguard"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	defaultHTTPTimeout      = 10
	maxHTTPTimeout          = 60
	maxHTTPRequestURLRunes  = 4096
	maxHTTPRequestHeaders   = 64
	maxHTTPHeaderNameRunes  = 128
	maxHTTPHeaderValueBytes = 8192
	maxHTTPQueryItems       = 128
	maxHTTPQueryKeyRunes    = 128
	maxHTTPQueryValueRunes  = 4096
	maxHTTPResponseHeaders  = 64
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
			if err := requireSkillCapability(entry, agentskill.CapabilityHTTP); err != nil {
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
	if err := applyHTTPQuery(parsed, argumentMap(arguments, "query")); err != nil {
		return httpRequestSpec{}, err
	}
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
	spec := httpRequestSpec{
		Method: method, URL: parsed.String(), Headers: headers, Body: body,
		Timeout: clampHTTPTimeout(ArgumentInt(arguments, "timeout_seconds", defaultHTTPTimeout)),
	}
	if err := validateHTTPRequestSpec(spec); err != nil {
		return httpRequestSpec{}, err
	}
	return spec, nil
}

func performHTTP(ctx context.Context, spec httpRequestSpec) (map[string]any, error) {
	if err := validateHTTPRequestSpec(spec); err != nil {
		return nil, err
	}
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
	if err := agentskill.ValidateStoredText("HTTP URL", raw, maxHTTPRequestURLRunes); err != nil {
		return nil, err
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

func applyHTTPQuery(parsed *url.URL, query map[string]any) error {
	if len(query) > maxHTTPQueryItems {
		return fmt.Errorf("HTTP 查询参数不能超过 %d 项", maxHTTPQueryItems)
	}
	values := parsed.Query()
	items := 0
	for key, raw := range query {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		if err := agentskill.ValidateStoredText("HTTP 查询参数名", key, maxHTTPQueryKeyRunes); err != nil {
			return err
		}
		switch current := raw.(type) {
		case []any:
			for _, item := range current {
				items++
				if items > maxHTTPQueryItems {
					return fmt.Errorf("HTTP 查询参数值不能超过 %d 项", maxHTTPQueryItems)
				}
				value := strings.TrimSpace(fmt.Sprint(item))
				if err := agentskill.ValidateStoredText("HTTP 查询参数值", value, maxHTTPQueryValueRunes); err != nil {
					return err
				}
				values.Add(key, value)
			}
		default:
			items++
			value := strings.TrimSpace(fmt.Sprint(raw))
			if err := agentskill.ValidateStoredText("HTTP 查询参数值", value, maxHTTPQueryValueRunes); err != nil {
				return err
			}
			values.Set(key, value)
		}
	}
	parsed.RawQuery = values.Encode()
	return agentskill.ValidateStoredText("HTTP URL", parsed.String(), maxHTTPRequestURLRunes)
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

func validateHTTPRequestSpec(spec httpRequestSpec) error {
	if err := agentskill.ValidateStoredText("HTTP URL", strings.TrimSpace(spec.URL), maxHTTPRequestURLRunes); err != nil {
		return err
	}
	if len(spec.Headers) > maxHTTPRequestHeaders {
		return fmt.Errorf("HTTP 请求头不能超过 %d 项", maxHTTPRequestHeaders)
	}
	for key, value := range spec.Headers {
		key = strings.TrimSpace(key)
		if key == "" || strings.ContainsAny(key, "\r\n:") {
			return fmt.Errorf("HTTP 请求头名称不合法")
		}
		if err := agentskill.ValidateStoredText("HTTP 请求头名称", key, maxHTTPHeaderNameRunes); err != nil {
			return err
		}
		if strings.ContainsAny(value, "\r\n") {
			return fmt.Errorf("HTTP 请求头 %s 包含换行符", key)
		}
		if err := agentskill.ValidateStoredBytes("HTTP 请求头值", value, maxHTTPHeaderValueBytes); err != nil {
			return err
		}
	}
	if len(spec.Body) > agentskill.HTTPMaxLen {
		return fmt.Errorf("HTTP 请求正文超过 %d 字节", agentskill.HTTPMaxLen)
	}
	return nil
}

func responseHeaders(headers http.Header) map[string]string {
	result := map[string]string{}
	keys := make([]string, 0, len(headers))
	for key := range headers {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		values := headers.Values(key)
		switch strings.ToLower(strings.TrimSpace(key)) {
		case "set-cookie", "authorization", "proxy-authorization", "cookie":
			continue
		}
		if len(values) > 0 {
			value := strings.Join(values, ", ")
			if len(value) > maxHTTPHeaderValueBytes {
				value = value[:maxHTTPHeaderValueBytes]
			}
			result[key] = value
			if len(result) >= maxHTTPResponseHeaders {
				break
			}
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
