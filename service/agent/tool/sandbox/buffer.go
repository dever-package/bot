package sandbox

import "strings"

type limitedBuffer struct {
	builder   strings.Builder
	limit     int
	truncated bool
}

func (buffer *limitedBuffer) Write(data []byte) (int, error) {
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

func (buffer *limitedBuffer) String() string {
	return buffer.builder.String()
}
