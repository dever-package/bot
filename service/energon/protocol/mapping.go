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

func (p MappedParam) IsPrompt() bool {
	return strings.EqualFold(strings.TrimSpace(p.ParamType), "prompt")
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
	for _, param := range nativeMappedParamOrder(m.Params) {
		assignNativeValue(
			body,
			param.NativeKey,
			param.Value,
			isFixedNativeRangeParam(param),
		)
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
		if key == "" || isNativeInputKeyExcluded(key) || mappedKeys[key] || mappedNativeKeys[key] || isEmptyNativeValue(value) {
			continue
		}
		assignNativeValue(body, key, value, false)
	}
	return body
}

func nativeMappedParamOrder(params []MappedParam) []MappedParam {
	ordered := make([]MappedParam, 0, len(params))
	for _, param := range params {
		if !isFixedNativeRangeParam(param) {
			ordered = append(ordered, param)
		}
	}
	for _, param := range params {
		if isFixedNativeRangeParam(param) {
			ordered = append(ordered, param)
		}
	}
	return ordered
}

func isFixedNativeRangeParam(param MappedParam) bool {
	if !strings.EqualFold(strings.TrimSpace(param.ParamType), "fixed") {
		return false
	}
	for _, segment := range parseNativePath(param.NativeKey) {
		if segment.IsRange {
			return true
		}
	}
	return false
}

func (m MappedInput) PromptInput(excludedKeys map[string]bool) map[string]any {
	input := map[string]any{}
	for key, value := range m.Original {
		key = strings.TrimSpace(key)
		if key == "" || isNativeInputKeyExcluded(key) {
			continue
		}
		if excludedKeys != nil && excludedKeys[key] {
			continue
		}
		input[key] = value
	}
	if prompt := m.PrimaryPrompt(); prompt != "" {
		input["prompt"] = prompt
	}
	return input
}

func (m MappedInput) PrimaryPrompt() string {
	for _, param := range m.Params {
		if !param.IsPrompt() {
			continue
		}
		if prompt := firstText(param.Value); prompt != "" {
			return prompt
		}
	}
	return firstText(
		m.Original["prompt"],
		m.Original["content"],
		m.Original["input"],
	)
}

func (m MappedInput) PromptOptions(textTitle string) PromptOptions {
	return PromptOptions{
		TextTitle: textTitle,
		MainKey:   "prompt",
		Labels:    m.Labels,
	}
}

func assignNativeValue(body map[string]any, key string, value any, onlyExistingRange bool) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}

	segments := parseNativePath(key)
	if len(segments) == 0 || segments[0].IsIndex {
		body[key] = value
		return
	}
	assignNativePathValue(body, segments, value, onlyExistingRange)
}

func nativeRootKey(path string) string {
	segments := parseNativePath(path)
	if len(segments) == 0 || segments[0].IsIndex {
		return ""
	}
	return segments[0].Key
}

type nativePathSegment struct {
	Key      string
	Index    int
	EndIndex int
	IsIndex  bool
	IsRange  bool
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
			segment, ok := parseNativeIndexSegment(rawIndex)
			if !ok {
				return nil
			}
			segments = append(segments, segment)
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

func parseNativeIndexSegment(value string) (nativePathSegment, bool) {
	startValue, endValue, hasRange := strings.Cut(value, "-")
	start, err := strconv.Atoi(strings.TrimSpace(startValue))
	if err != nil || start < 0 {
		return nativePathSegment{}, false
	}
	if !hasRange {
		return nativePathSegment{Index: start, EndIndex: start, IsIndex: true}, true
	}
	if strings.Contains(endValue, "-") {
		return nativePathSegment{}, false
	}
	end, err := strconv.Atoi(strings.TrimSpace(endValue))
	if err != nil || end < start {
		return nativePathSegment{}, false
	}
	return nativePathSegment{
		Index:    start,
		EndIndex: end,
		IsIndex:  true,
		IsRange:  true,
	}, true
}

func assignNativePathValue(
	container any,
	segments []nativePathSegment,
	value any,
	onlyExistingRange bool,
) any {
	if len(segments) == 0 {
		return value
	}

	segment := segments[0]
	if segment.IsIndex {
		items, _ := container.([]any)
		if segment.IsRange {
			return assignNativeRangeValue(
				items,
				segment,
				segments[1:],
				value,
				onlyExistingRange,
			)
		}
		items = ensureNativeArrayLength(items, segment.Index+1)
		if len(segments) == 1 {
			items[segment.Index] = value
			return items
		}

		child := items[segment.Index]
		if !nativeContainerMatches(child, segments[1]) {
			child = newNativeContainer(segments[1])
		}
		items[segment.Index] = assignNativePathValue(
			child,
			segments[1:],
			value,
			onlyExistingRange,
		)
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
	mapped[segment.Key] = assignNativePathValue(
		child,
		segments[1:],
		value,
		onlyExistingRange,
	)
	return mapped
}

// Range segments broadcast scalar values and map list values by position.
// Fixed structural fields are applied after attachment values and only decorate
// native items that the attachment mapping actually created.
func assignNativeRangeValue(
	items []any,
	segment nativePathSegment,
	segments []nativePathSegment,
	value any,
	onlyExistingRange bool,
) []any {
	values, isList := nativeRangeValues(value)
	for index := segment.Index; index <= segment.EndIndex; index++ {
		currentValue := value
		if isList {
			offset := index - segment.Index
			if offset >= len(values) {
				break
			}
			currentValue = values[offset]
		}
		if onlyExistingRange && len(segments) > 0 && (index >= len(items) || items[index] == nil) {
			continue
		}

		items = ensureNativeArrayLength(items, index+1)
		if len(segments) == 0 {
			items[index] = currentValue
			continue
		}

		child := items[index]
		if !nativeContainerMatches(child, segments[0]) {
			child = newNativeContainer(segments[0])
		}
		items[index] = assignNativePathValue(
			child,
			segments,
			currentValue,
			onlyExistingRange,
		)
	}
	return items
}

func nativeRangeValues(value any) ([]any, bool) {
	switch value.(type) {
	case []any, []string, []map[string]any:
		return normalizeAnyList(value), true
	default:
		return nil, false
	}
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

func isNativeInputKeyExcluded(key string) bool {
	key = strings.TrimSpace(key)
	return key == "previous_output" || IsInternalInputKey(key)
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
