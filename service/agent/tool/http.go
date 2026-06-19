package tool

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

func executeHTTPRequest(ctx context.Context, req Request) (map[string]any, error) {
	spec, err := httpSpecFromInput(req.Action.Input)
	if err != nil {
		return nil, err
	}
	return performHTTPRequest(ctx, spec)
}

type httpSpec struct {
	Method     string
	URL        string
	Headers    map[string]string
	Body       []byte
	TimeoutSec int
}

func httpSpecFromInput(input map[string]any) (httpSpec, error) {
	method := strings.ToUpper(inputText(input["method"]))
	if method == "" {
		method = http.MethodGet
	}
	if !allowedHTTPMethod(method) {
		return httpSpec{}, fmt.Errorf("不支持的 HTTP 方法: %s", method)
	}

	rawURL := inputText(firstPresent(input, "url", "uri", "endpoint"))
	if rawURL == "" {
		return httpSpec{}, fmt.Errorf("HTTP URL 不能为空")
	}
	parsed, err := normalizeHTTPURL(rawURL)
	if err != nil {
		return httpSpec{}, err
	}
	applyQuery(parsed, inputMap(input["query"]))

	headers := normalizeRequestHeaders(inputMap(input["headers"]))
	body, bodyContentType, err := normalizeHTTPBody(input)
	if err != nil {
		return httpSpec{}, err
	}
	if bodyContentType != "" {
		if _, exists := headers["Content-Type"]; !exists {
			headers["Content-Type"] = bodyContentType
		}
	}
	if len(body) > 0 && method == http.MethodGet {
		method = http.MethodPost
	}
	timeoutSec := inputInt(firstPresent(input, "timeout_seconds", "timeoutSeconds"), defaultTimeoutSec)
	if timeoutSec <= 0 {
		timeoutSec = defaultTimeoutSec
	}
	if timeoutSec > maxTimeoutSec {
		timeoutSec = maxTimeoutSec
	}
	return httpSpec{
		Method:     method,
		URL:        parsed.String(),
		Headers:    headers,
		Body:       body,
		TimeoutSec: timeoutSec,
	}, nil
}

func performHTTPRequest(ctx context.Context, spec httpSpec) (map[string]any, error) {
	parsed, err := url.Parse(spec.URL)
	if err != nil {
		return nil, err
	}
	if err := validateExternalURL(ctx, parsed); err != nil {
		return nil, err
	}

	timeoutSec := spec.TimeoutSec
	if timeoutSec <= 0 {
		timeoutSec = defaultTimeoutSec
	}
	if timeoutSec > maxTimeoutSec {
		timeoutSec = maxTimeoutSec
	}
	timeoutCtx, cancel := context.WithTimeout(ctx, time.Duration(timeoutSec)*time.Second)
	defer cancel()
	request, err := http.NewRequestWithContext(timeoutCtx, spec.Method, parsed.String(), bytes.NewReader(spec.Body))
	if err != nil {
		return nil, err
	}
	for key, value := range spec.Headers {
		request.Header.Set(key, value)
	}

	client := &http.Client{
		Timeout:   time.Duration(timeoutSec) * time.Second,
		Transport: newExternalHTTPTransport(),
		CheckRedirect: func(next *http.Request, via []*http.Request) error {
			if len(via) >= 3 {
				return fmt.Errorf("HTTP 跳转次数超过限制")
			}
			return validateExternalURL(next.Context(), next.URL)
		},
	}
	defer client.CloseIdleConnections()
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	raw, err := io.ReadAll(io.LimitReader(response.Body, maxBodyBytes+1))
	if err != nil {
		return nil, err
	}
	truncated := len(raw) > maxBodyBytes
	if truncated {
		raw = raw[:maxBodyBytes]
	}
	body := string(raw)
	return map[string]any{
		"status_code": response.StatusCode,
		"headers":     sanitizeResponseHeaders(response.Header),
		"body":        body,
		"truncated":   truncated,
		"text":        body,
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
	raw = escapeInvalidURL(raw)
	parsed, err := url.Parse(raw)
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

func escapeInvalidURL(raw string) string {
	var builder strings.Builder
	for index := 0; index < len(raw); index++ {
		char := raw[index]
		if char == ' ' {
			builder.WriteString("%20")
			continue
		}
		if char == '%' && (index+2 >= len(raw) || !isHex(raw[index+1]) || !isHex(raw[index+2])) {
			builder.WriteString("%25")
			continue
		}
		builder.WriteByte(char)
	}
	return builder.String()
}

func isHex(char byte) bool {
	return (char >= '0' && char <= '9') ||
		(char >= 'a' && char <= 'f') ||
		(char >= 'A' && char <= 'F')
}

func validateExternalURL(ctx context.Context, parsed *url.URL) error {
	if parsed == nil {
		return fmt.Errorf("HTTP URL 不能为空")
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return fmt.Errorf("只允许 http/https URL")
	}
	host := strings.TrimSpace(parsed.Hostname())
	if host == "" {
		return fmt.Errorf("HTTP URL 缺少主机")
	}
	_, err := resolveAllowedExternalIPs(ctx, host)
	return err
}

func newExternalHTTPTransport() *http.Transport {
	if base, ok := http.DefaultTransport.(*http.Transport); ok {
		transport := base.Clone()
		transport.Proxy = nil
		transport.DialContext = dialAllowedExternalAddress
		transport.TLSHandshakeTimeout = 10 * time.Second
		transport.ResponseHeaderTimeout = 30 * time.Second
		transport.ExpectContinueTimeout = time.Second
		return transport
	}
	return &http.Transport{
		Proxy:                 nil,
		DialContext:           dialAllowedExternalAddress,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 30 * time.Second,
		ExpectContinueTimeout: time.Second,
	}
}

var externalHTTPDialer = &net.Dialer{
	Timeout:   10 * time.Second,
	KeepAlive: 30 * time.Second,
}

func dialAllowedExternalAddress(ctx context.Context, network string, address string) (net.Conn, error) {
	host, port, err := net.SplitHostPort(address)
	if err != nil {
		return nil, fmt.Errorf("HTTP 地址无效")
	}
	ips, err := resolveAllowedExternalIPs(ctx, host)
	if err != nil {
		return nil, err
	}
	var lastErr error
	for _, ip := range ips {
		conn, err := externalHTTPDialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
		if err == nil {
			return conn, nil
		}
		lastErr = err
	}
	if lastErr != nil {
		return nil, lastErr
	}
	return nil, fmt.Errorf("HTTP 主机没有可用地址: %s", host)
}

func resolveAllowedExternalIPs(ctx context.Context, host string) ([]net.IP, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	host = strings.Trim(strings.ToLower(strings.TrimSpace(host)), ".")
	switch host {
	case "", "localhost", "localhost.localdomain":
		return nil, fmt.Errorf("HTTP 请求拒绝访问内网或本机地址: %s", host)
	}
	if ip := net.ParseIP(host); ip != nil {
		if rejectUnsafeHost(ip) {
			return nil, fmt.Errorf("HTTP 请求拒绝访问内网或本机地址: %s", host)
		}
		return []net.IP{ip}, nil
	}
	lookupCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	addrs, err := net.DefaultResolver.LookupIPAddr(lookupCtx, host)
	if err != nil {
		return nil, fmt.Errorf("解析 HTTP 主机失败: %s", err.Error())
	}
	if len(addrs) == 0 {
		return nil, fmt.Errorf("HTTP 主机没有可用地址: %s", host)
	}
	ips := make([]net.IP, 0, len(addrs))
	for _, item := range addrs {
		if rejectUnsafeHost(item.IP) {
			return nil, fmt.Errorf("HTTP 请求拒绝访问内网或本机地址: %s", host)
		}
		ips = append(ips, item.IP)
	}
	return ips, nil
}

func applyQuery(parsed *url.URL, query map[string]any) {
	if len(query) == 0 {
		return
	}
	values := parsed.Query()
	for key, raw := range query {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		switch current := raw.(type) {
		case []any:
			for _, item := range current {
				values.Add(key, inputText(item))
			}
		case []string:
			for _, item := range current {
				values.Add(key, strings.TrimSpace(item))
			}
		default:
			values.Set(key, inputText(raw))
		}
	}
	parsed.RawQuery = values.Encode()
}

func normalizeRequestHeaders(input map[string]any) map[string]string {
	headers := make(map[string]string, len(input))
	for key, value := range input {
		key = strings.TrimSpace(key)
		if key == "" || blockedRequestHeader(key) {
			continue
		}
		if text := inputText(value); text != "" {
			headers[key] = text
		}
	}
	return headers
}

func blockedRequestHeader(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "host", "content-length", "connection", "proxy-authorization", "cookie":
		return true
	default:
		return false
	}
}

func normalizeHTTPBody(input map[string]any) ([]byte, string, error) {
	if raw, exists := input["json"]; exists {
		body, err := json.Marshal(raw)
		if err != nil {
			return nil, "", err
		}
		return body, "application/json", nil
	}
	for _, key := range []string{"body", "data", "payload"} {
		if text := inputText(input[key]); text != "" {
			return []byte(text), "", nil
		}
	}
	return nil, "", nil
}

func sanitizeResponseHeaders(headers http.Header) map[string]string {
	result := map[string]string{}
	for key, values := range headers {
		if blockedResponseHeader(key) || len(values) == 0 {
			continue
		}
		result[key] = strings.Join(values, ", ")
	}
	return result
}

func blockedResponseHeader(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "set-cookie", "authorization", "proxy-authorization", "cookie":
		return true
	default:
		return false
	}
}
