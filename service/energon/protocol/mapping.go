package protocol

import (
	"strconv"
	"strings"
)

const InternalServiceParamInputPrefix = "__service_param_"

type MappedParam struct {
	ParamID   uint64
	ParamKey  string
	InputKey  string
	ParamName string
	ParamType string
	NativeKey string
	ParamRule int16
	Value     any
}

func (p MappedParam) InputKeys() []string {
	return splitMappedInputKeys(p.InputKey)
}

func (p MappedParam) FirstInputKey() string {
	keys := p.InputKeys()
	if len(keys) == 0 {
		return ""
	}
	return keys[0]
}

func (p MappedParam) HasInputKey(target string) bool {
	target = strings.TrimSpace(target)
	if target == "" {
		return false
	}
	for _, key := range p.InputKeys() {
		if key == target {
			return true
		}
	}
	return false
}

type MappedInput struct {
	Original map[string]any
	Labels   map[string]string
	Params   []MappedParam
}

func NewMappedInput(input map[string]any, labels map[string]string) MappedInput {
	return MappedInput{
		Original: cloneAnyMap(input),
		Labels:   cloneStringMap(labels),
		Params:   []MappedParam{},
	}
}

func (m MappedInput) IsZero() bool {
	return m.Original == nil && m.Labels == nil && m.Params == nil
}

func (m MappedInput) InputKeySet() map[string]bool {
	if len(m.Params) == 0 {
		return nil
	}
	keys := make(map[string]bool, len(m.Params))
	for _, param := range m.Params {
		for _, key := range param.InputKeys() {
			keys[key] = true
		}
	}
	return keys
}

func (m MappedInput) NativeBody() map[string]any {
	body := map[string]any{}
	mappedKeys := map[string]bool{}
	mappedNativeKeys := map[string]bool{}
	for _, param := range m.Params {
		assignNativeValue(body, param.NativeKey, param.Value)
		for _, key := range param.InputKeys() {
			mappedKeys[key] = true
		}
		if key := strings.TrimSpace(param.NativeKey); key != "" {
			mappedNativeKeys[key] = true
			if rootKey := nativeRootKey(key); rootKey != "" {
				mappedNativeKeys[rootKey] = true
			}
		}
	}
	for key, value := range m.Original {
		key = strings.TrimSpace(key)
		if key == "" || IsInternalInputKey(key) || mappedKeys[key] || mappedNativeKeys[key] || isEmptyNativeValue(value) {
			continue
		}
		assignNativeValue(body, key, value)
	}
	return body
}

func (m MappedInput) PromptInput(excludedKeys map[string]bool) map[string]any {
	input := map[string]any{}
	for key, value := range m.Original {
		key = strings.TrimSpace(key)
		if key == "" || IsInternalInputKey(key) {
			continue
		}
		if excludedKeys != nil && excludedKeys[key] {
			continue
		}
		input[key] = value
	}
	return input
}

func (m MappedInput) PromptOptions(textTitle string) PromptOptions {
	return PromptOptions{
		TextTitle: textTitle,
		Labels:    m.Labels,
	}
}

func assignNativeValue(body map[string]any, key string, value any) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}

	segments := parseNativePath(key)
	if len(segments) == 0 || segments[0].IsIndex {
		body[key] = value
		return
	}
	assignNativePathValue(body, segments, value)
}

func nativeRootKey(path string) string {
	segments := parseNativePath(path)
	if len(segments) == 0 || segments[0].IsIndex {
		return ""
	}
	return segments[0].Key
}

type nativePathSegment struct {
	Key     string
	Index   int
	IsIndex bool
}

func parseNativePath(path string) []nativePathSegment {
	path = strings.TrimSpace(path)
	if path == "" {
		return nil
	}

	segments := make([]nativePathSegment, 0)
	for index := 0; index < len(path); {
		switch path[index] {
		case '.':
			return nil
		case '[':
			end := strings.IndexByte(path[index:], ']')
			if end <= 1 {
				return nil
			}
			rawIndex := strings.TrimSpace(path[index+1 : index+end])
			value, err := strconv.Atoi(rawIndex)
			if err != nil || value < 0 {
				return nil
			}
			segments = append(segments, nativePathSegment{Index: value, IsIndex: true})
			index += end + 1
		default:
			end := index
			for end < len(path) && path[end] != '.' && path[end] != '[' {
				end++
			}
			key := strings.TrimSpace(path[index:end])
			if key == "" {
				return nil
			}
			segments = append(segments, nativePathSegment{Key: key})
			index = end
		}

		if index >= len(path) {
			break
		}
		if path[index] == '.' {
			index++
			if index >= len(path) {
				return nil
			}
		}
	}
	return segments
}

func assignNativePathValue(container any, segments []nativePathSegment, value any) any {
	if len(segments) == 0 {
		return value
	}

	segment := segments[0]
	if segment.IsIndex {
		items, _ := container.([]any)
		items = ensureNativeArrayLength(items, segment.Index+1)
		if len(segments) == 1 {
			items[segment.Index] = value
			return items
		}

		child := items[segment.Index]
		if !nativeContainerMatches(child, segments[1]) {
			child = newNativeContainer(segments[1])
		}
		items[segment.Index] = assignNativePathValue(child, segments[1:], value)
		return items
	}

	mapped, _ := container.(map[string]any)
	if mapped == nil {
		mapped = map[string]any{}
	}
	if len(segments) == 1 {
		mapped[segment.Key] = value
		return mapped
	}

	child := mapped[segment.Key]
	if !nativeContainerMatches(child, segments[1]) {
		child = newNativeContainer(segments[1])
	}
	mapped[segment.Key] = assignNativePathValue(child, segments[1:], value)
	return mapped
}

func ensureNativeArrayLength(items []any, length int) []any {
	for len(items) < length {
		items = append(items, nil)
	}
	return items
}

func nativeContainerMatches(value any, next nativePathSegment) bool {
	if next.IsIndex {
		_, ok := value.([]any)
		return ok
	}
	_, ok := value.(map[string]any)
	return ok
}

func newNativeContainer(next nativePathSegment) any {
	if next.IsIndex {
		return []any{}
	}
	return map[string]any{}
}

func isEmptyNativeValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case []any:
		return len(current) == 0
	case []string:
		return len(current) == 0
	default:
		return false
	}
}

func splitMappedInputKeys(value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}

	result := make([]string, 0, 1)
	seen := map[string]struct{}{}
	for _, item := range strings.Split(value, ",") {
		key := strings.TrimSpace(item)
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, key)
	}
	return result
}

func IsInternalInputKey(key string) bool {
	return strings.HasPrefix(strings.TrimSpace(key), InternalServiceParamInputPrefix)
}

func cloneAnyMap(source map[string]any) map[string]any {
	if source == nil {
		return map[string]any{}
	}
	target := make(map[string]any, len(source))
	for key, value := range source {
		target[key] = value
	}
	return target
}

func cloneStringMap(source map[string]string) map[string]string {
	if source == nil {
		return map[string]string{}
	}
	target := make(map[string]string, len(source))
	for key, value := range source {
		target[key] = value
	}
	return target
}
