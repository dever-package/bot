package adapters

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	bottask "my/package/bot/service/energon/task"
)

const (
	rhapiKindPrefix        = "rhapi."
	rhapiDefaultPathPrefix = "/openapi/v2/"
	rhapiQueryPath         = "/openapi/v2/query"
	rhapiPollMax           = 1200
	rhapiPollDelayMS       = 3000
)

type RhApiAdapter struct{}

func (RhApiAdapter) Name() string {
	return "rhapi"
}

func (RhApiAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	name := strings.TrimSpace(botprotocol.AsText(raw.Body["power"]))
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	kind := strings.TrimSpace(botprotocol.AsText(raw.Body["kind"]))
	if kind == "" {
		kind = rhapiKindPrefix + botprotocol.MediaTypeImage
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)

	return &botprotocol.ShemicRequest{
		Mode:     raw.Mode,
		Protocol: "rhapi",
		Kind:     kind,
		Name:     name,
		Set:      parts.Set,
		Input:    parts.Input,
		History:  parts.History,
		Options:  parts.Options,
		Raw:      raw,
	}, nil
}

func (RhApiAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	api := strings.TrimSpace(input.Service.Path)
	if api == "" {
		api = input.ServiceAPI
	}
	path, err := rhapiServicePath(api)
	if err != nil {
		return botprovider.Request{}, err
	}
	if input.Request != nil {
		input.Request.Kind = rhapiRequestKind(input)
	}

	body := rhapiBody(input)
	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"

	return botprovider.Request{
		URL:     rhapiJoinURL(input.Provider.Host, path),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}, nil
}

func (RhApiAdapter) BuildClientResponse(req *botprotocol.ShemicRequest, resp *botprovider.Response) (any, error) {
	return map[string]any{"output": rhapiMediaOutput(resp.Body, rhapiClientOutputType(req))}, nil
}

func (RhApiAdapter) StreamTaskSpec(input botprotocol.NativeInput) (bottask.StreamTaskSpec, bool) {
	outputType := rhapiOutputType(input)
	return bottask.StreamTaskSpec{
		Kind:          bottask.StreamKindPolling,
		OutputType:    outputType,
		StartText:     "正在请求 RunningHub 任务生成",
		CreatedText:   "已创建 RunningHub 任务: %s",
		RunningText:   "RunningHub 任务生成中，请稍候",
		DoneText:      "RunningHub 任务生成完成",
		StartProgress: 5,
		DoneProgress:  100,
		EstimateMax:   90,
		MaxAttempts:   rhapiPollMax,
		PollInterval:  rhapiPollDelayMS * time.Millisecond,
	}, true
}

func (RhApiAdapter) ParseTaskID(input botprotocol.NativeInput, resp *botprovider.Response) (string, error) {
	taskID := strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "taskId")))
	if taskID == "" {
		taskID = strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "task_id")))
	}
	return taskID, nil
}

func (RhApiAdapter) BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error) {
	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"
	return botprovider.Request{
		URL:     rhapiJoinURL(input.Provider.Host, rhapiQueryPath),
		Method:  http.MethodPost,
		Headers: headers,
		Body: map[string]any{
			"taskId": strings.TrimSpace(taskID),
		},
	}, nil
}

func (RhApiAdapter) ParseTaskStatus(input botprotocol.NativeInput, resp *botprovider.Response) (bottask.TaskStatus, error) {
	body := botprotocol.NormalizeMap(resp.Body)
	status := strings.ToUpper(strings.TrimSpace(botprotocol.AsText(body["status"])))
	message := firstNonEmptyText(body["errorMessage"], body["message"], body["msg"])
	if terminalMessage := botprotocol.TerminalTaskErrorText(body["errorMessage"], body["failedReason"], message); terminalMessage != "" {
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: "FAILED", Message: terminalMessage}, nil
	}

	if codeText := strings.TrimSpace(botprotocol.AsText(body["code"])); codeText != "" && codeText != "0" {
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: codeText, Message: message}, nil
	}
	if results := botprotocol.NormalizeAnyList(body["results"]); len(results) > 0 && status == "" {
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: "SUCCESS"}, nil
	}

	switch status {
	case "SUCCESS", "SUCCEEDED", "FINISHED", "COMPLETED":
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: status, Message: message}, nil
	case "FAILED", "FAIL", "ERROR", "CANCELED", "CANCELLED", "STOPPED", "TERMINATED", "ABORTED", "EXPIRED":
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: status, Message: firstNonEmptyText(message, status)}, nil
	default:
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: firstNonEmptyText(status, "RUNNING"), Message: message}, nil
	}
}

func rhapiBody(input botprotocol.NativeInput) map[string]any {
	body := map[string]any{}
	mapped := rhapiMappedInput(input)
	for key, value := range rhapiMappedNativeBody(mapped) {
		body[key] = value
	}

	prompt := botprotocol.BuildPromptContent(
		rhapiPromptInput(mapped, rhapiPromptExcludedKeys(mapped)),
		mapped.PromptOptions("用户输入"),
	)
	ensureRhApiPrompt(body, prompt)
	ensureRhApiImages(body)
	return body
}

func rhapiMappedNativeBody(mapped botprotocol.MappedInput) map[string]any {
	body := mapped.NativeBody()
	for key := range body {
		if rhapiIsPromptNativeKey(key) {
			delete(body, key)
		}
	}
	return body
}

func rhapiPromptExcludedKeys(mapped botprotocol.MappedInput) map[string]bool {
	keys := map[string]bool{}
	for key := range mapped.NativeBody() {
		keys[key] = true
	}
	delete(keys, "text")
	for _, param := range mapped.Params {
		if rhapiIsPromptNativeKey(param.NativeKey) {
			continue
		}
		for _, key := range param.InputKeys() {
			keys[key] = true
		}
	}
	if len(keys) == 0 {
		return nil
	}
	return keys
}

func rhapiPromptInput(mapped botprotocol.MappedInput, excludedKeys map[string]bool) map[string]any {
	input := mapped.PromptInput(excludedKeys)
	if rhapiHasValue(input["text"]) {
		return input
	}

	for _, param := range mapped.Params {
		if !rhapiIsPromptNativeKey(param.NativeKey) {
			continue
		}
		key := param.FirstInputKey()
		if key == "" {
			continue
		}
		value, exists := mapped.Original[key]
		if !exists || !rhapiHasValue(value) {
			continue
		}
		delete(input, key)
		input["text"] = value
		return input
	}
	return input
}

func rhapiIsPromptNativeKey(key string) bool {
	switch rhapiLastNativeKeySegment(key) {
	case "prompt", "prompt_text", "text", "query", "input", "content":
		return true
	default:
		return false
	}
}

func rhapiLastNativeKeySegment(key string) string {
	parts := strings.Split(strings.ToLower(strings.TrimSpace(key)), ".")
	for index := len(parts) - 1; index >= 0; index-- {
		if part := strings.TrimSpace(parts[index]); part != "" {
			return part
		}
	}
	return ""
}

func ensureRhApiPrompt(body map[string]any, prompt botprotocol.PromptContent) {
	if hasBodyValue(body, "prompt") {
		return
	}
	if text := strings.TrimSpace(botprotocol.AsText(body["text"])); text != "" {
		body["prompt"] = text
		delete(body, "text")
		return
	}
	if text := strings.TrimSpace(prompt.Text); text != "" {
		body["prompt"] = text
	}
}

func ensureRhApiImages(body map[string]any) {
	if images := botprotocol.NormalizeStringList(body["imageUrls"]); len(images) > 0 {
		body["imageUrls"] = images
	}
}

func rhapiMappedInput(input botprotocol.NativeInput) botprotocol.MappedInput {
	if input.Mapped.IsZero() {
		return botprotocol.NewMappedInput(input.Request.Input, nil)
	}
	return input.Mapped
}

func rhapiRequestKind(input botprotocol.NativeInput) string {
	return rhapiKindPrefix + rhapiOutputType(input)
}

func rhapiOutputType(input botprotocol.NativeInput) string {
	requestKind := ""
	if input.Request != nil {
		requestKind = input.Request.Kind
	}
	for _, value := range []string{input.Service.Type, input.Power.Kind, requestKind} {
		if outputType := runningHubOutputTypeFromKind(value); outputType != "" {
			return outputType
		}
	}
	return botprotocol.MediaTypeImage
}

func rhapiClientOutputType(req *botprotocol.ShemicRequest) string {
	if req != nil {
		if outputType := runningHubOutputTypeFromKind(req.Kind); outputType != "" {
			return outputType
		}
	}
	return botprotocol.MediaTypeImage
}

func rhapiServicePath(api string) (string, error) {
	api = strings.TrimSpace(api)
	if api == "" {
		return "", rhapiServicePathError()
	}
	if strings.HasPrefix(api, "http://") || strings.HasPrefix(api, "https://") {
		parsed, err := url.Parse(api)
		if err != nil {
			return "", fmt.Errorf("RunningHub API 服务地址格式不正确: %w", err)
		}
		if !rhapiHasConcreteEndpoint(parsed.Path) {
			return "", rhapiServicePathError()
		}
		return api, nil
	}

	path := strings.TrimLeft(api, "/")
	if strings.HasPrefix(path, "openapi/v2/") {
		if !rhapiHasConcreteEndpoint(path) {
			return "", rhapiServicePathError()
		}
		return "/" + path, nil
	}
	path = strings.Trim(path, "/")
	if path == "" {
		return "", rhapiServicePathError()
	}
	return rhapiDefaultPathPrefix + path, nil
}

func rhapiHasConcreteEndpoint(path string) bool {
	path = strings.Trim(path, "/")
	if path == "" {
		return false
	}
	path = strings.TrimPrefix(path, "openapi/v2")
	return strings.Trim(path, "/") != ""
}

func rhapiServicePathError() error {
	return fmt.Errorf("RunningHub API 服务地址必须填写具体接口，例如 rhart-image-n-g31-flash/text-to-image 或 rhart-image-n-g31-flash/image-to-image")
}

func rhapiJoinURL(baseURL string, path string) string {
	if strings.HasPrefix(path, "http://") || strings.HasPrefix(path, "https://") {
		return path
	}
	if strings.HasPrefix(strings.TrimLeft(path, "/"), "openapi/v2/") {
		baseURL = strings.TrimSuffix(strings.TrimRight(strings.TrimSpace(baseURL), "/"), "/openapi/v2")
	}
	return botprovider.JoinURL(baseURL, path)
}

func rhapiMediaOutput(body any, defaultType string) botprotocol.Output {
	output := botprotocol.ExtractMediaOutput(rhapiResultPayload(body, defaultType), defaultType)
	if rhapiHasParsedOutput(output) {
		return output
	}
	return botprotocol.ExtractMediaOutput(body, defaultType)
}

func rhapiHasParsedOutput(output botprotocol.Output) bool {
	if botprotocol.HasMediaOutput(output) {
		return true
	}
	return strings.TrimSpace(botprotocol.AsText(output["text"])) != ""
}

func rhapiResultPayload(body any, defaultType string) any {
	mapped := botprotocol.NormalizeMap(body)
	if mapped == nil {
		return body
	}
	if results := botprotocol.NormalizeAnyList(mapped["results"]); len(results) > 0 {
		payload := make([]any, 0, len(results))
		for _, item := range results {
			result := botprotocol.NormalizeMap(item)
			if result == nil {
				payload = append(payload, item)
				continue
			}
			if url := strings.TrimSpace(botprotocol.AsText(result["url"])); url != "" {
				outputType := runningHubMediaTypeFromFile(result["fileType"], result["outputType"], url, defaultType)
				payload = append(payload, map[string]any{
					"url":        url,
					"type":       outputType,
					"outputType": result["outputType"],
				})
				continue
			}
			payload = append(payload, result)
		}
		return payload
	}
	return body
}

func hasBodyValue(body map[string]any, key string) bool {
	value, exists := body[key]
	if !exists {
		return false
	}
	return rhapiHasValue(value)
}

func rhapiHasValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case []string:
		return len(current) > 0
	default:
		return true
	}
}

func firstNonEmptyText(values ...any) string {
	for _, value := range values {
		if text := meaningfulText(value); text != "" {
			return text
		}
	}
	return ""
}

func meaningfulText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(current)
	case []any:
		if len(current) == 0 {
			return ""
		}
	case []string:
		if len(current) == 0 {
			return ""
		}
	case map[string]any:
		if len(current) == 0 {
			return ""
		}
	}
	text := strings.TrimSpace(botprotocol.AsText(value))
	switch text {
	case "", "{}", "[]", "null":
		return ""
	default:
		return text
	}
}
