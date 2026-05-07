package provider

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
)

type HTTPClient struct {
	client         *http.Client
	defaultTimeout time.Duration
}

func NewHTTPClient(timeout time.Duration) HTTPClient {
	if timeout <= 0 {
		timeout = 60 * time.Second
	}
	return HTTPClient{
		client:         &http.Client{},
		defaultTimeout: timeout,
	}
}

func (c HTTPClient) Do(ctx context.Context, req Request) (*Response, error) {
	ctx, cancel := c.requestContext(ctx, req)
	defer cancel()

	httpReq, err := newHTTPRequest(ctx, req)
	if err != nil {
		return nil, err
	}

	resp, err := c.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	payload, err := readResponsePayload(resp.Body)
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

	resp, err := c.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	headers := responseHeaders(resp.Header)
	if resp.StatusCode >= http.StatusBadRequest {
		payload, readErr := readResponsePayload(resp.Body)
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
	if httpReq.Header.Get("Content-Type") == "" && req.Body != nil {
		httpReq.Header.Set("Content-Type", "application/json")
	}
	return httpReq, nil
}

func readResponsePayload(body io.Reader) (any, error) {
	rawBody, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}

	var payload any
	if len(rawBody) > 0 {
		if err := json.Unmarshal(rawBody, &payload); err != nil {
			payload = string(rawBody)
		}
	}
	return payload, nil
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
