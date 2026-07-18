package sandbox

import (
	"strings"
	"sync"
)

type OutputBuffer struct {
	mu        sync.Mutex
	builder   strings.Builder
	limit     int
	truncated bool
}

func NewOutputBuffer(limit int) *OutputBuffer {
	return &OutputBuffer{limit: limit}
}

func (buffer *OutputBuffer) Write(data []byte) (int, error) {
	buffer.mu.Lock()
	defer buffer.mu.Unlock()
	if buffer.limit <= 0 || buffer.builder.Len() >= buffer.limit {
		buffer.truncated = true
		return len(data), nil
	}
	remaining := buffer.limit - buffer.builder.Len()
	if len(data) > remaining {
		_, _ = buffer.builder.Write(data[:remaining])
		buffer.truncated = true
		return len(data), nil
	}
	_, _ = buffer.builder.Write(data)
	return len(data), nil
}

func (buffer *OutputBuffer) String() string {
	buffer.mu.Lock()
	defer buffer.mu.Unlock()
	return buffer.builder.String()
}

func (buffer *OutputBuffer) Truncated() bool {
	buffer.mu.Lock()
	defer buffer.mu.Unlock()
	return buffer.truncated
}
