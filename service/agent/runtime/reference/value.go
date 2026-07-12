package reference

import (
	"fmt"
	"strconv"
	"strings"
)

func textValue(value any) string {
	if value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return strings.TrimSpace(text)
	}
	return strings.TrimSpace(fmt.Sprint(value))
}

func uint64Value(value any) uint64 {
	switch current := value.(type) {
	case uint64:
		return current
	case int:
		if current > 0 {
			return uint64(current)
		}
	case int64:
		if current > 0 {
			return uint64(current)
		}
	case float64:
		if current > 0 {
			return uint64(current)
		}
	case string:
		parsed, _ := strconv.ParseUint(strings.TrimSpace(current), 10, 64)
		return parsed
	}
	return 0
}

func intValue(value any) int {
	return int(uint64Value(value))
}
