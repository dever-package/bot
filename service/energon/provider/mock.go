package provider

import (
	"context"
	"net/http"
)

type MockClient struct{}

func NewMockClient() MockClient {
	return MockClient{}
}

func (MockClient) Do(ctx context.Context, req Request) (*Response, error) {
	return &Response{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"content-type": "application/json",
		},
		Body: map[string]any{
			"mock":    true,
			"url":     req.URL,
			"method":  req.Method,
			"headers": req.Headers,
			"body":    req.Body,
			"choices": []map[string]any{
				{
					"message": map[string]any{
						"role":    "assistant",
						"content": "mock energon response",
					},
				},
			},
		},
	}, nil
}

func (MockClient) Stream(ctx context.Context, req Request, handler func(StreamChunk) error) (*Response, error) {
	for _, data := range []string{
		`{"choices":[{"delta":{"content":"mock "}}]}`,
		`{"choices":[{"delta":{"content":"energon "}}]}`,
		`{"choices":[{"delta":{"content":"stream"}}]}`,
		`[DONE]`,
	} {
		if err := handler(StreamChunk{Data: data}); err != nil {
			return nil, err
		}
	}
	return &Response{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"content-type": "text/event-stream",
		},
	}, nil
}
