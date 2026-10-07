package provider

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"net/url"
	"slices"
	"strings"
	"time"

	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
)

const (
	jsonFallbackCaptureBytes = int64(64 << 10)
)

type HTTPClient struct {
	client         *http.Client
	defaultTimeout time.Duration
	responseLimit  int64
}

func NewHTTPClient(timeout time.Duration) HTTPClient {
	if timeout <= 0 {
		timeout = time.Hour
	}
	return HTTPClient{
		client:         &http.Client{},
		defaultTimeout: timeout,
		responseLimit:  botruntimeconfig.Load().MaxResponseBytes(),
	}
}

func (c HTTPClient) Do(ctx context.Context, req Request) (*Response, error) {
	ctx, cancel := c.requestContext(ctx, req)
	defer cancel()

	httpReq, err := newHTTPRequest(ctx, req)
	if err != nil {
		return nil, err
	}

	resp, err := c.requestClient(req).Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var payload any
	if req.BinaryResponse && resp.StatusCode < http.StatusBadRequest {
		payload, err = readBinaryResponse(resp, c.maxResponseBytes())
	} else {
		payload, err = readResponsePayload(
			resp.Body,
			resp.Header.Get("Content-Type"),
			resp.ContentLength,
			c.maxResponseBytes(),
		)
	}
	if err != nil {
		return nil, err
	}

	return &Response{
		StatusCode: resp.StatusCode,
		Headers:    responseHeaders(resp.Header),
		Body:       payload,
	}, nil
}

func (c HTTPClient) Stream(ctx context.Context, req Request, handler func(StreamChunk) error) (*Response, error) {
	ctx, cancel := c.requestContext(ctx, req)
	defer cancel()

	httpReq, err := newHTTPRequest(ctx, req)
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Accept", "text/event-stream")

	resp, err := c.requestClient(req).Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	headers := responseHeaders(resp.Header)
	if resp.StatusCode >= http.StatusBadRequest {
		payload, readErr := readResponsePayload(
			resp.Body,
			resp.Header.Get("Content-Type"),
			resp.ContentLength,
			c.maxResponseBytes(),
		)
		if readErr != nil {
			return nil, readErr
		}
		return &Response{
			StatusCode: resp.StatusCode,
			Headers:    headers,
			Body:       payload,
		}, nil
	}

	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	event := ""
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		if strings.HasPrefix(line, ":") {
			continue
		}
		if strings.HasPrefix(line, "event:") {
			event = strings.TrimSpace(strings.TrimPrefix(line, "event:"))
			continue
		}
		if strings.HasPrefix(line, "data:") {
			data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
			if err := handler(StreamChunk{Event: event, Data: data}); err != nil {
				return &Response{StatusCode: resp.StatusCode, Headers: headers}, err
			}
			event = ""
			continue
		}
		if err := handler(StreamChunk{Event: event, Data: line}); err != nil {
			return &Response{StatusCode: resp.StatusCode, Headers: headers}, err
		}
		event = ""
	}
	if err := scanner.Err(); err != nil {
		return &Response{StatusCode: resp.StatusCode, Headers: headers}, err
	}

	return &Response{
		StatusCode: resp.StatusCode,
		Headers:    headers,
	}, nil
}

func (c HTTPClient) requestContext(ctx context.Context, req Request) (context.Context, context.CancelFunc) {
	if ctx == nil {
		ctx = context.Background()
	}

	timeout := req.Timeout
	if timeout <= 0 {
		timeout = c.defaultTimeout
	}
	if timeout <= 0 {
		return context.WithCancel(ctx)
	}

	return context.WithTimeout(ctx, timeout)
}

func newHTTPRequest(ctx context.Context, req Request) (*http.Request, error) {
	var body io.Reader
	contentType := ""
	if req.Multipart != nil {
		if req.Body != nil {
			return nil, fmt.Errorf("JSON 和 multipart 请求体不能同时设置")
		}
		var err error
		body, contentType, err = multipartBody(*req.Multipart)
		if err != nil {
			return nil, err
		}
	}
	if req.Body != nil {
		raw, err := json.Marshal(req.Body)
		if err != nil {
			return nil, err
		}
		body = bytes.NewReader(raw)
	}

	httpReq, err := http.NewRequestWithContext(ctx, req.Method, req.URL, body)
	if err != nil {
		return nil, err
	}
	for key, value := range req.Headers {
		httpReq.Header.Set(key, value)
	}
	if contentType != "" {
		httpReq.Header.Set("Content-Type", contentType)
	}
	if httpReq.Header.Get("Content-Type") == "" && req.Body != nil {
		httpReq.Header.Set("Content-Type", "application/json")
	}
	return httpReq, nil
}

func (c HTTPClient) requestClient(req Request) *http.Client {
	if !req.SameOriginRedirects {
		return c.client
	}
	client := *c.client
	client.CheckRedirect = func(next *http.Request, previous []*http.Request) error {
		if len(previous) >= 10 {
			return fmt.Errorf("重定向次数超过限制")
		}
		if next.URL.User != nil || len(previous) > 0 && !SameOrigin(next.URL, previous[0].URL) {
			return fmt.Errorf("禁止向其他来源重定向鉴权请求")
		}
		if c.client.CheckRedirect != nil {
			return c.client.CheckRedirect(next, previous)
		}
		return nil
	}
	return &client
}

func SameOrigin(first, second *url.URL) bool {
	return strings.EqualFold(first.Scheme, second.Scheme) && strings.EqualFold(first.Hostname(), second.Hostname()) && originPort(first) == originPort(second)
}

func originPort(address *url.URL) string {
	if port := address.Port(); port != "" {
		return port
	}
	if strings.EqualFold(address.Scheme, "https") {
		return "443"
	}
	return "80"
}

func multipartBody(form MultipartForm) (io.Reader, string, error) {
	var buffer bytes.Buffer
	writer := multipart.NewWriter(&buffer)
	fields := make([]string, 0, len(form.Fields))
	for field := range form.Fields {
		fields = append(fields, field)
	}
	slices.Sort(fields)
	for _, field := range fields {
		if err := writer.WriteField(field, form.Fields[field]); err != nil {
			return nil, "", err
		}
	}
	for _, file := range form.Files {
		if strings.TrimSpace(file.Field) == "" || strings.TrimSpace(file.Filename) == "" {
			return nil, "", fmt.Errorf("上传文件必须提供字段和文件名")
		}
		header := make(textproto.MIMEHeader)
		header.Set("Content-Disposition", mime.FormatMediaType("form-data", map[string]string{"name": file.Field, "filename": file.Filename}))
		if file.MIME != "" {
			header.Set("Content-Type", file.MIME)
		}
		part, err := writer.CreatePart(header)
		if err != nil {
			return nil, "", err
		}
		if _, err := part.Write(file.Content); err != nil {
			return nil, "", err
		}
	}
	if err := writer.Close(); err != nil {
		return nil, "", err
	}
	return bytes.NewReader(buffer.Bytes()), writer.FormDataContentType(), nil
}

func readBinaryResponse(response *http.Response, maxBytes int64) (BinaryPayload, error) {
	if response.ContentLength > maxBytes {
		return BinaryPayload{}, responseTooLargeError(maxBytes)
	}
	content, err := io.ReadAll(io.LimitReader(response.Body, maxBytes+1))
	if err != nil {
		return BinaryPayload{}, err
	}
	if int64(len(content)) > maxBytes {
		return BinaryPayload{}, responseTooLargeError(maxBytes)
	}
	return BinaryPayload{MIME: response.Header.Get("Content-Type"), Content: content}, nil
}

func (c HTTPClient) maxResponseBytes() int64 {
	if c.responseLimit > 0 {
		return c.responseLimit
	}
	return botruntimeconfig.DefaultMaxResponseMB << 20
}

func readResponsePayload(body io.Reader, contentType string, contentLength int64, maxBytes int64) (any, error) {
	if maxBytes <= 0 {
		maxBytes = botruntimeconfig.DefaultMaxResponseMB << 20
	}
	if contentLength > maxBytes {
		return nil, responseTooLargeError(maxBytes)
	}
	limited := &io.LimitedReader{R: body, N: maxBytes + 1}
	if isJSONContentType(contentType) {
		return decodeJSONResponse(limited, maxBytes)
	}
	rawBody, err := io.ReadAll(limited)
	if err != nil {
		return nil, err
	}
	if int64(len(rawBody)) > maxBytes {
		return nil, responseTooLargeError(maxBytes)
	}

	var payload any
	if len(rawBody) > 0 {
		if err := json.Unmarshal(rawBody, &payload); err != nil {
			payload = string(rawBody)
		}
	}
	return payload, nil
}

func decodeJSONResponse(body *io.LimitedReader, maxBytes int64) (any, error) {
	capture := &limitedCaptureBuffer{limit: jsonFallbackCaptureBytes}
	reader := io.TeeReader(body, capture)
	decoder := json.NewDecoder(reader)
	var payload any
	if err := decoder.Decode(&payload); err != nil {
		return jsonDecodeFallback(reader, body, capture, maxBytes, err)
	}
	var trailing any
	if err := decoder.Decode(&trailing); err != io.EOF {
		if err == nil {
			err = fmt.Errorf("响应包含多个 JSON 值")
		}
		return jsonDecodeFallback(reader, body, capture, maxBytes, err)
	}
	if body.N == 0 {
		return nil, responseTooLargeError(maxBytes)
	}
	return payload, nil
}

func jsonDecodeFallback(
	reader io.Reader,
	body *io.LimitedReader,
	capture *limitedCaptureBuffer,
	maxBytes int64,
	decodeErr error,
) (any, error) {
	if _, err := io.Copy(io.Discard, reader); err != nil {
		return nil, err
	}
	if body.N == 0 {
		return nil, responseTooLargeError(maxBytes)
	}
	if !capture.overflow {
		if capture.buffer.Len() == 0 {
			return nil, nil
		}
		return capture.String(), nil
	}
	return nil, fmt.Errorf("解析服务 JSON 响应失败: %w", decodeErr)
}

type limitedCaptureBuffer struct {
	buffer   bytes.Buffer
	limit    int64
	overflow bool
}

func (buffer *limitedCaptureBuffer) Write(data []byte) (int, error) {
	written := len(data)
	remaining := buffer.limit - int64(buffer.buffer.Len())
	if remaining <= 0 {
		buffer.overflow = buffer.overflow || written > 0
		return written, nil
	}
	if int64(len(data)) > remaining {
		data = data[:remaining]
		buffer.overflow = true
	}
	_, _ = buffer.buffer.Write(data)
	return written, nil
}

func (buffer *limitedCaptureBuffer) String() string {
	return buffer.buffer.String()
}

func isJSONContentType(contentType string) bool {
	mediaType, _, err := mime.ParseMediaType(strings.TrimSpace(contentType))
	if err != nil {
		mediaType = strings.TrimSpace(strings.Split(contentType, ";")[0])
	}
	mediaType = strings.ToLower(mediaType)
	return mediaType == "application/json" || strings.HasSuffix(mediaType, "+json")
}

func responseTooLargeError(maxBytes int64) error {
	return fmt.Errorf("服务响应超过 %d MB 限制", maxBytes>>20)
}

func responseHeaders(header http.Header) map[string]string {
	headers := make(map[string]string, len(header))
	for key, values := range header {
		if len(values) > 0 {
			headers[key] = values[0]
		}
	}
	return headers
}
