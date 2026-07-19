package provider

import (
	"context"
	"fmt"
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

type BinaryPayload struct {
	MIME    string         `json:"mime"`
	Content []byte         `json:"-"`
	Meta    map[string]any `json:"meta,omitempty"`
}

func (payload BinaryPayload) String() string {
	mimeType := strings.TrimSpace(payload.MIME)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}
	return fmt.Sprintf("[binary payload mime=%s size=%d]", mimeType, len(payload.Content))
}

func AsBinaryPayload(value any) (BinaryPayload, bool) {
	switch current := value.(type) {
	case BinaryPayload:
		return current, true
	case *BinaryPayload:
		if current != nil {
			return *current, true
		}
	}
	return BinaryPayload{}, false
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
