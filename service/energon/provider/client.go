package provider

import (
	"context"
	"strings"
	"time"
)

type Request struct {
	URL     string
	Method  string
	Headers map[string]string
	Body    map[string]any
	Timeout time.Duration
}

type Response struct {
	StatusCode int
	Headers    map[string]string
	Body       any
}

type StreamChunk struct {
	Event string
	Data  string
}

type Client interface {
	Do(ctx context.Context, req Request) (*Response, error)
}

type StreamClient interface {
	Stream(ctx context.Context, req Request, handler func(StreamChunk) error) (*Response, error)
}

func JoinURL(baseURL, path string) string {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	path = strings.TrimSpace(path)
	if path == "" {
		return baseURL
	}
	lowerPath := strings.ToLower(path)
	if strings.HasPrefix(lowerPath, "http://") || strings.HasPrefix(lowerPath, "https://") {
		return path
	}
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	return baseURL + path
}

func AuthHeaders(token string) map[string]string {
	token = strings.TrimSpace(token)
	if token == "" {
		return map[string]string{}
	}
	return map[string]string{"Authorization": "Bearer " + token}
}
