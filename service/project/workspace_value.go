package project

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
)

const workspaceDocumentMaxSearchDepth = 12

func mapValue(raw any) map[string]any {
	row, ok := raw.(map[string]any)
	if !ok || row == nil {
		return nil
	}
	return row
}

func sliceValue(raw any) []any {
	switch items := raw.(type) {
	case []any:
		return items
	case []map[string]any:
		result := make([]any, 0, len(items))
		for _, item := range items {
			result = append(result, item)
		}
		return result
	default:
		return nil
	}
}

func textValue(raw any) string {
	if raw == nil {
		return ""
	}
	text := strings.TrimSpace(fmt.Sprint(raw))
	if text == "<nil>" {
		return ""
	}
	return text
}

func uint64Value(raw any) uint64 {
	switch value := raw.(type) {
	case uint64:
		return value
	case uint:
		return uint64(value)
	case uint32:
		return uint64(value)
	case int:
		if value > 0 {
			return uint64(value)
		}
	case int64:
		if value > 0 {
			return uint64(value)
		}
	case float64:
		if value > 0 {
			return uint64(value)
		}
	case string:
		var parsed uint64
		_, _ = fmt.Sscan(strings.TrimSpace(value), &parsed)
		return parsed
	}
	return 0
}

func firstPresent(values ...any) any {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" && text != "<nil>" {
			return text
		}
	}
	return ""
}

func findWorkspaceDocument(value any, expectedType string, wrapperKeys []string) (map[string]any, bool) {
	expectedType = strings.ToLower(strings.TrimSpace(expectedType))
	if expectedType == "" {
		return nil, false
	}
	return findWorkspaceDocumentAtDepth(value, expectedType, wrapperKeys, 0)
}

func findWorkspaceDocumentAtDepth(
	value any,
	expectedType string,
	wrapperKeys []string,
	depth int,
) (map[string]any, bool) {
	if value == nil || depth > workspaceDocumentMaxSearchDepth {
		return nil, false
	}
	if text, ok := value.(string); ok {
		var decoded any
		if json.Unmarshal([]byte(strings.TrimSpace(text)), &decoded) != nil {
			return nil, false
		}
		return findWorkspaceDocumentAtDepth(decoded, expectedType, wrapperKeys, depth+1)
	}
	if values := sliceValue(value); values != nil {
		for _, item := range values {
			if document, found := findWorkspaceDocumentAtDepth(item, expectedType, wrapperKeys, depth+1); found {
				return document, true
			}
		}
		return nil, false
	}
	document := mapValue(value)
	if document == nil {
		return nil, false
	}
	if strings.ToLower(textValue(document["type"])) == expectedType {
		return document, true
	}
	for _, key := range wrapperKeys {
		candidate, exists := document[key]
		if !exists || candidate == nil {
			continue
		}
		if nested, found := findWorkspaceDocumentAtDepth(candidate, expectedType, wrapperKeys, depth+1); found {
			return nested, true
		}
	}
	return nil, false
}

func valueAtPath(raw any, path ...string) any {
	current := raw
	for _, key := range path {
		row := mapValue(current)
		if row == nil {
			return nil
		}
		current = row[key]
	}
	return current
}

func mergeMap(base map[string]any, patch map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range base {
		result[key] = value
	}
	for key, value := range patch {
		result[key] = value
	}
	return result
}

func firstCanvasNodeResult(payload map[string]any) map[string]any {
	for _, item := range sliceValue(payload["node_results"]) {
		if row := mapValue(item); row != nil {
			return row
		}
	}
	return map[string]any{}
}

func canvasChildRequestID(parentRequestID string, nodeID string) string {
	parentRequestID = strings.TrimSpace(parentRequestID)
	nodeID = strings.TrimSpace(nodeID)
	if parentRequestID == "" {
		return normalizeWorkspaceRequestID(nodeID)
	}
	if nodeID == "" {
		return normalizeWorkspaceRequestID(parentRequestID)
	}
	sum := sha1.Sum([]byte(nodeID))
	suffix := hex.EncodeToString(sum[:])[:12]
	prefixLimit := 64 - len(suffix) - 1
	if prefixLimit < 1 {
		return suffix
	}
	if len(parentRequestID) > prefixLimit {
		parentRequestID = parentRequestID[:prefixLimit]
	}
	return parentRequestID + "-" + suffix
}
