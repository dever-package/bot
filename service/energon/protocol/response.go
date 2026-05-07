package protocol

import (
	"encoding/json"
	"fmt"
	"strings"
)

const (
	ResponseTypeResult = "result"
	ResponseTypeStream = "stream"

	ResponseStatusSuccess = 1
	ResponseStatusFail    = 2
)

type Response struct {
	RequestID string `json:"request_id"`
	Type      string `json:"type"`
	Output    Output `json:"output"`
	Msg       string `json:"msg"`
	Status    int    `json:"status"`
}

type Output map[string]any

var (
	scalarOutputKeys  = []string{"event", "title", "text", "reasoning", "progress", "error", "json"}
	mediaOutputFields = []struct {
		Target  string
		Sources []string
	}{
		{Target: "images", Sources: []string{"images", "image"}},
		{Target: "videos", Sources: []string{"videos", "video"}},
		{Target: "audios", Sources: []string{"audios", "audio"}},
		{Target: "files", Sources: []string{"files", "file"}},
	}
	setPromptKeys = []string{"id", "role", "skills"}
)

type RequestParts struct {
	Set     map[string]any
	Input   map[string]any
	History []any
	Options map[string]any
}

func NormalizeRequestParts(body map[string]any) RequestParts {
	return RequestParts{
		Set:     normalizeBodyMap(body, "set"),
		Input:   normalizeBodyMap(body, "input"),
		History: normalizeAnyList(body["history"]),
		Options: normalizeBodyMap(body, "options"),
	}
}

func normalizeRequestParts(body map[string]any) RequestParts {
	return NormalizeRequestParts(body)
}

func normalizeBodyMap(body map[string]any, key string) map[string]any {
	if body == nil {
		return map[string]any{}
	}
	if mapped := normalizeMap(body[key]); mapped != nil {
		return mapped
	}
	return map[string]any{}
}

func cloneBody(body map[string]any) map[string]any {
	result := make(map[string]any, len(body))
	for key, value := range body {
		result[key] = value
	}
	return result
}

func NormalizeRequestBody(body map[string]any) map[string]any {
	next := cloneBody(body)
	if next == nil {
		next = map[string]any{}
	}

	if strings.TrimSpace(asText(next["mode"])) == "" {
		next["mode"] = "normalize"
	}

	options := normalizeMap(next["options"])
	if options == nil {
		options = map[string]any{}
		next["options"] = options
	}
	if input := normalizeMap(next["input"]); input == nil {
		next["input"] = map[string]any{}
	}

	power := strings.TrimSpace(asText(next["power"]))
	if power != "" {
		next["power"] = power
	}

	protocol := strings.ToLower(strings.TrimSpace(asText(next["protocol"])))
	if protocol == "shemic" {
		if strings.TrimSpace(asText(next["name"])) == "" && power != "" {
			next["name"] = power
		}
		if strings.TrimSpace(asText(next["kind"])) == "" {
			next["kind"] = "llm.chat"
		}
		return next
	}

	if messages := BuildOpenAIMessages(next); len(messages) > 0 {
		next["messages"] = messages
	} else {
		delete(next, "messages")
	}
	for key, value := range options {
		if _, exists := next[key]; !exists {
			next[key] = value
		}
	}
	return next
}

func BuildSuccessResponse(requestID string, data any) Response {
	return newResponse(
		requestID,
		ResponseTypeResult,
		ExtractOutput(data),
		"",
		ResponseStatusSuccess,
	)
}

func BuildErrorResponse(requestID string, err error) Response {
	message := ""
	if err != nil {
		message = err.Error()
	}
	return newResponse(
		requestID,
		ResponseTypeResult,
		Output{},
		message,
		ResponseStatusFail,
	)
}

func (r Response) Payload() map[string]any {
	responseType := strings.TrimSpace(r.Type)
	if responseType == "" {
		responseType = ResponseTypeResult
	}
	status := r.Status
	if status == 0 {
		status = ResponseStatusSuccess
	}
	output := Output{}
	if r.Output != nil {
		output = r.Output
	}
	return map[string]any{
		"request_id": r.RequestID,
		"type":       responseType,
		"output":     output,
		"msg":        r.Msg,
		"status":     status,
	}
}

func BuildStreamResponse(requestID string, output Output) Response {
	return newResponse(
		requestID,
		ResponseTypeStream,
		normalizeOutput(output),
		"",
		ResponseStatusSuccess,
	)
}

func BuildProgressResponse(requestID string, message string, percent int) Response {
	output := Output{
		"event": "progress",
		"text":  strings.TrimSpace(message),
	}
	if percent >= 0 {
		if percent > 100 {
			percent = 100
		}
		output["progress"] = percent
	}
	return BuildStreamResponse(requestID, output)
}

func BuildStreamErrorResponse(requestID string, err error) Response {
	message := ""
	if err != nil {
		message = err.Error()
	}
	return newResponse(
		requestID,
		ResponseTypeStream,
		Output{
			"event":    "progress",
			"text":     message,
			"progress": 100,
			"error":    message,
		},
		message,
		ResponseStatusFail,
	)
}

func newResponse(requestID string, responseType string, output Output, msg string, status int) Response {
	if output == nil {
		output = Output{}
	}
	return Response{
		RequestID: strings.TrimSpace(requestID),
		Type:      strings.TrimSpace(responseType),
		Output:    output,
		Msg:       strings.TrimSpace(msg),
		Status:    status,
	}
}

func IsStreamEnabled(body map[string]any) bool {
	if body == nil {
		return false
	}
	options := normalizeMap(body["options"])
	return isTruthy(options["stream"])
}

func ExtractStreamOutput(raw string) Output {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if strings.EqualFold(raw, "[DONE]") {
		return Output{"event": "end"}
	}

	var payload any
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return Output{"event": "delta", "text": raw}
	}
	return extractStreamPayload(payload)
}

func MergeStreamResult(outputs []Output) Output {
	textParts := make([]string, 0)
	reasoningParts := make([]string, 0)
	result := Output{}

	for _, output := range outputs {
		if output == nil {
			continue
		}
		event := strings.ToLower(strings.TrimSpace(asText(output["event"])))
		if text := strings.TrimSpace(asText(output["text"])); text != "" {
			switch event {
			case "reasoning":
				reasoningParts = append(reasoningParts, text)
			case "start", "progress", "end":
			default:
				textParts = append(textParts, text)
			}
		}
		if text := strings.TrimSpace(asText(output["reasoning"])); text != "" {
			reasoningParts = append(reasoningParts, text)
		}
		copyFirstOutputValue(result, output, "title")
		appendOutputList(result, "images", output["images"], output["image"])
		appendOutputList(result, "videos", output["videos"], output["video"])
		appendOutputList(result, "audios", output["audios"], output["audio"])
		appendOutputList(result, "files", output["files"], output["file"])
	}
	if len(textParts) > 0 {
		result["text"] = strings.Join(textParts, "")
	}
	if len(reasoningParts) > 0 {
		result["reasoning"] = strings.Join(reasoningParts, "")
	}
	return result
}

func ExtractOutput(value any) Output {
	if value == nil {
		return Output{}
	}

	mapped, ok := value.(map[string]any)
	if !ok {
		return normalizeOutputValue(value)
	}
	if outputValue, exists := mapped["output"]; exists {
		return normalizeOutputValue(outputValue)
	}

	if dataValue, exists := mapped["data"]; exists {
		if dataMap, ok := dataValue.(map[string]any); ok {
			if outputValue, hasOutput := dataMap["output"]; hasOutput {
				return normalizeOutputValue(outputValue)
			}
		}
	}
	if content, exists := extractOpenAIContentValue(mapped); exists {
		return normalizeOutputValue(map[string]any{"text": content})
	}

	return normalizeOutputValue(mapped)
}

func extractStreamPayload(payload any) Output {
	switch current := payload.(type) {
	case map[string]any:
		if output := extractOpenAIStreamOutput(current); len(output) > 0 {
			return output
		}
		if outputValue, exists := current["output"]; exists {
			return normalizeOutputValue(outputValue)
		}
		if hasOutputField(current) {
			return normalizeOutput(current)
		}
		return Output{"event": "delta", "json": current}
	default:
		return normalizeOutputValue(current)
	}
}

func extractOpenAIStreamOutput(mapped map[string]any) Output {
	choices := normalizeAnyList(mapped["choices"])
	if len(choices) == 0 {
		return nil
	}

	choice, _ := choices[0].(map[string]any)
	if choice == nil {
		return nil
	}

	output := Output{}
	if delta, ok := choice["delta"].(map[string]any); ok {
		if text := firstText(delta["reasoning_content"], delta["reasoning"], delta["reasoning_text"]); text != "" {
			output["event"] = "reasoning"
			output["reasoning"] = text
		}
		if text := strings.TrimSpace(asText(delta["content"])); text != "" {
			if output["event"] == nil {
				output["event"] = "delta"
			}
			output["text"] = text
		}
	}
	if text := strings.TrimSpace(asText(choice["text"])); text != "" {
		if output["event"] == nil {
			output["event"] = "delta"
		}
		output["text"] = text
	}
	if finishReason := strings.TrimSpace(asText(choice["finish_reason"])); finishReason != "" {
		output["event"] = "end"
		output["text"] = finishReason
	}
	return normalizeOutput(output)
}

func normalizeOutputValue(value any) Output {
	switch current := value.(type) {
	case nil:
		return Output{}
	case Output:
		return normalizeOutput(current)
	case map[string]any:
		return normalizeOutput(current)
	case string:
		text := strings.TrimSpace(current)
		if text == "" {
			return Output{}
		}
		return Output{"text": text}
	default:
		return Output{"json": current}
	}
}

func normalizeOutput(output map[string]any) Output {
	if len(output) == 0 {
		return Output{}
	}
	if !hasOutputField(output) {
		return Output{"json": output}
	}

	result := Output{}
	for _, key := range scalarOutputKeys {
		copyOutputValue(result, output, key)
	}
	if meta := normalizeMap(output["meta"]); len(meta) > 0 {
		result["meta"] = meta
	}
	for _, field := range mediaOutputFields {
		values := make([]any, 0, len(field.Sources))
		for _, source := range field.Sources {
			values = append(values, output[source])
		}
		appendOutputList(result, field.Target, values...)
	}
	return result
}

func hasOutputField(output map[string]any) bool {
	for _, key := range scalarOutputKeys {
		if _, exists := output[key]; exists {
			return true
		}
	}
	if _, exists := output["meta"]; exists {
		return true
	}
	for _, field := range mediaOutputFields {
		for _, key := range field.Sources {
			if _, exists := output[key]; exists {
				return true
			}
		}
	}
	return false
}

func copyOutputValue(target Output, source map[string]any, key string) {
	value, exists := source[key]
	if !exists || isEmptyProtocolValue(value) {
		return
	}
	target[key] = value
}

func copyFirstOutputValue(target Output, source Output, key string) {
	if _, exists := target[key]; exists {
		return
	}
	copyOutputValue(target, source, key)
}

func appendOutputList(target Output, key string, values ...any) {
	result := normalizeStringList(target[key])
	for _, value := range values {
		result = append(result, normalizeStringList(value)...)
	}
	if len(result) > 0 {
		target[key] = result
	}
}

func isEmptyProtocolValue(value any) bool {
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

func IsEmptyProtocolValue(value any) bool {
	return isEmptyProtocolValue(value)
}

func BuildOpenAIMessages(body map[string]any) []any {
	if body == nil {
		return nil
	}

	parts := normalizeRequestParts(body)
	return BuildOpenAIMessagesFromParts(parts.Set, parts.History, parts.Input, PromptOptions{})
}

func BuildOpenAIMessagesFromParts(set map[string]any, history []any, input map[string]any, options PromptOptions) []any {
	messages := make([]any, 0)
	if systemPrompt := buildSystemPrompt(set); systemPrompt != "" {
		messages = append(messages, map[string]any{
			"role":    "system",
			"content": systemPrompt,
		})
	}

	for _, item := range history {
		if message := buildOpenAIHistoryMessage(item, options); message != nil {
			messages = append(messages, message)
		}
	}

	if message := buildOpenAIInputMessage(input, "user", options); message != nil {
		messages = append(messages, message)
	}
	return messages
}

func buildOpenAIHistoryMessage(value any, options PromptOptions) map[string]any {
	if value == nil {
		return nil
	}

	if mapped, ok := value.(map[string]any); ok {
		role := "user"
		if currentRole := strings.TrimSpace(asText(mapped["role"])); currentRole != "" {
			role = currentRole
		}
		input := make(map[string]any, len(mapped))
		for key, current := range mapped {
			if key != "role" {
				input[key] = current
			}
		}
		return buildOpenAIInputMessage(input, role, options)
	}

	return buildOpenAIInputMessage(map[string]any{"text": value}, "user", options)
}

func buildOpenAIInputMessage(input map[string]any, role string, options PromptOptions) map[string]any {
	if len(input) == 0 {
		return nil
	}
	role = strings.TrimSpace(role)
	if role == "" {
		role = "user"
	}
	content := buildOpenAIContent(input, role, options)
	if isEmptyContent(content) {
		return nil
	}
	return map[string]any{
		"role":    role,
		"content": content,
	}
}

func buildOpenAIContent(input map[string]any, role string, options PromptOptions) any {
	if len(input) == 0 {
		return nil
	}

	options.TextTitle = openAIPromptTextTitle(role)
	prompt := BuildPromptContent(input, options)
	text := prompt.TextWithMediaReferences(MediaReferenceOptions{
		Videos: true,
		Audios: true,
		Files:  true,
	})
	if len(prompt.Images) == 0 {
		return text
	}

	parts := make([]any, 0, 1+len(prompt.Images))
	if text != "" {
		parts = append(parts, map[string]any{"type": "text", "text": text})
	}
	for _, url := range prompt.Images {
		parts = append(parts, map[string]any{
			"type": "image_url",
			"image_url": map[string]any{
				"url": url,
			},
		})
	}
	return parts
}

func openAIPromptTextTitle(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "assistant":
		return "助手回复"
	case "system":
		return "系统输入"
	default:
		return "用户输入"
	}
}

func buildSystemPrompt(value any) string {
	items := normalizeAnyList(value)
	if len(items) == 0 {
		if mapped := normalizeMap(value); len(mapped) > 0 {
			items = []any{mapped}
		}
	}

	parts := make([]string, 0, len(items))
	for _, item := range items {
		switch current := item.(type) {
		case string:
			if text := strings.TrimSpace(current); text != "" {
				parts = append(parts, text)
			}
		case map[string]any:
			for _, key := range setPromptKeys {
				if text := strings.TrimSpace(asText(current[key])); text != "" {
					parts = append(parts, fmt.Sprintf("%s: %s", key, text))
				}
			}
		}
	}
	return strings.Join(parts, "\n")
}

func extractOpenAIContentValue(mapped map[string]any) (any, bool) {
	choices := normalizeAnyList(mapped["choices"])
	if len(choices) == 0 {
		return nil, false
	}

	choice, _ := choices[0].(map[string]any)
	if choice == nil {
		return nil, false
	}
	if message, ok := choice["message"].(map[string]any); ok {
		if content, exists := message["content"]; exists {
			return content, true
		}
	}
	if delta, ok := choice["delta"].(map[string]any); ok {
		if content, exists := delta["content"]; exists {
			return content, true
		}
	}
	if text, exists := choice["text"]; exists {
		return text, true
	}
	return nil, false
}

func normalizeMap(value any) map[string]any {
	if mapped, ok := value.(map[string]any); ok {
		return mapped
	}
	return nil
}

func NormalizeMap(value any) map[string]any {
	return normalizeMap(value)
}

func normalizeAnyList(value any) []any {
	switch current := value.(type) {
	case nil:
		return nil
	case []any:
		return current
	case []map[string]any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case []string:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	default:
		return []any{current}
	}
}

func NormalizeAnyList(value any) []any {
	return normalizeAnyList(value)
}

func normalizeStringList(value any) []string {
	items := normalizeAnyList(value)
	result := make([]string, 0, len(items))
	for _, item := range items {
		text := strings.TrimSpace(asText(item))
		if text != "" {
			result = append(result, text)
		}
	}
	return result
}

func NormalizeStringList(value any) []string {
	return normalizeStringList(value)
}

func isEmptyContent(value any) bool {
	if value == nil {
		return true
	}
	if text, ok := value.(string); ok {
		return strings.TrimSpace(text) == ""
	}
	if items, ok := value.([]any); ok {
		return len(items) == 0
	}
	return false
}

func isTruthy(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "y", "on":
			return true
		default:
			return false
		}
	case int:
		return current != 0
	case int64:
		return current != 0
	case float64:
		return current != 0
	default:
		return false
	}
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(asText(value)); text != "" {
			return text
		}
	}
	return ""
}

func asText(value any) string {
	switch current := value.(type) {
	case string:
		return current
	case fmt.Stringer:
		return current.String()
	default:
		if current == nil {
			return ""
		}
		raw, err := json.Marshal(current)
		if err == nil {
			return string(raw)
		}
		return fmt.Sprint(current)
	}
}

func AsText(value any) string {
	return asText(value)
}
