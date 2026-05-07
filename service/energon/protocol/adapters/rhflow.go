package adapters

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"sync"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	bottask "my/package/bot/service/energon/task"
)

const (
	rhflowCreatePath      = "/task/openapi/create"
	rhflowQueryPath       = "/openapi/v2/query"
	rhflowCancelPath      = "/task/openapi/cancel"
	rhflowTaskRunningCode = "804"
	rhflowPollMax         = 1200
	rhflowPollDelayMS     = 3000
	rhflowKindPrefix      = "rhflow."
	rhflowDefaultKind     = "rhflow.workflow"
	rhflowDefaultMessage  = "RunningHub 工作流任务运行中，请稍候"
)

var rhflowTaskCache sync.Map

type RhFlowAdapter struct{}

func (RhFlowAdapter) Name() string {
	return "rhflow"
}

func (RhFlowAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	name := strings.TrimSpace(botprotocol.AsText(raw.Body["power"]))
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	kind := strings.TrimSpace(botprotocol.AsText(raw.Body["kind"]))
	if kind == "" {
		kind = rhflowDefaultKind
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)

	return &botprotocol.ShemicRequest{
		Mode:     raw.Mode,
		Protocol: "rhflow",
		Kind:     kind,
		Name:     name,
		Set:      parts.Set,
		Input:    parts.Input,
		History:  parts.History,
		Options:  parts.Options,
		Raw:      raw,
	}, nil
}

func (RhFlowAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	workflowID := strings.TrimSpace(input.ServiceAPI)
	if workflowID == "" {
		return botprovider.Request{}, fmt.Errorf("RunningHub 工作流服务地址必须填写 workflowId")
	}

	if input.Request != nil {
		input.Request.Kind = rhflowRequestKind(input)
	}
	body := rhflowBody(input, workflowID)

	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"

	return botprovider.Request{
		URL:     rhflowJoinURL(input.Provider.Host, resolveConfiguredPath(input, rhflowCreatePath)),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}, nil
}

func (RhFlowAdapter) BuildClientResponse(req *botprotocol.ShemicRequest, resp *botprovider.Response) (any, error) {
	kind := ""
	if req != nil {
		kind = req.Kind
	}
	if err := rhflowResponseError(resp.Body); err != nil {
		return nil, err
	}
	return map[string]any{
		"output": rhflowOutput(resp.Body, runningHubOutputTypeFromKind(kind)),
	}, nil
}

func (RhFlowAdapter) SupportsCancel(input botprotocol.NativeInput) bool {
	return true
}

func (RhFlowAdapter) CancelTask(ctx context.Context, input botprotocol.NativeInput, taskID string, client botprovider.Client) error {
	taskID = strings.TrimSpace(taskID)
	if taskID == "" {
		return nil
	}
	if client == nil {
		return fmt.Errorf("取消 RunningHub 工作流任务失败: 来源客户端未初始化")
	}

	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"
	req := botprovider.Request{
		URL:     rhflowJoinURL(input.Provider.Host, rhflowCancelPath),
		Method:  http.MethodPost,
		Headers: headers,
		Body: map[string]any{
			"apiKey": strings.TrimSpace(input.Account.Key),
			"taskId": taskID,
		},
	}
	resp, err := client.Do(ctx, req)
	if err != nil {
		return fmt.Errorf("取消 RunningHub 工作流任务失败: %w", err)
	}
	if resp != nil && resp.StatusCode >= http.StatusBadRequest {
		return fmt.Errorf("取消 RunningHub 工作流任务失败: status=%d body=%s", resp.StatusCode, botprotocol.AsText(resp.Body))
	}
	if code := strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "code"))); code != "" && code != "0" {
		return fmt.Errorf("取消 RunningHub 工作流任务失败: %s", firstNonEmptyText(valueFromMap(resp.Body, "msg"), valueFromMap(resp.Body, "message"), code))
	}
	return nil
}

func (RhFlowAdapter) StreamTaskSpec(input botprotocol.NativeInput) (bottask.StreamTaskSpec, bool) {
	outputType := rhflowOutputType(input)
	return bottask.StreamTaskSpec{
		Kind:          bottask.StreamKindPolling,
		OutputType:    outputType,
		StartText:     "正在请求 RunningHub 工作流任务",
		CreatedText:   "已创建 RunningHub 工作流任务: %s",
		RunningText:   rhflowDefaultMessage,
		DoneText:      "RunningHub 工作流任务完成",
		StartProgress: 5,
		DoneProgress:  100,
		EstimateMax:   90,
		MaxAttempts:   rhflowPollMax,
		PollInterval:  rhflowPollDelayMS * time.Millisecond,
	}, true
}

func (RhFlowAdapter) ParseTaskID(input botprotocol.NativeInput, resp *botprovider.Response) (string, error) {
	if taskID := rhflowTaskIDFromBody(resp.Body); taskID != "" {
		rhflowStoreTaskID(input, taskID)
		return taskID, nil
	}

	code := strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "code")))
	if code != "" && code != "0" {
		message := firstNonEmptyText(valueFromMap(resp.Body, "msg"), valueFromMap(resp.Body, "message"), code)
		if code == rhflowTaskRunningCode || strings.EqualFold(message, "APIKEY_TASK_IS_RUNNING") {
			if taskID := rhflowCachedTaskID(input); taskID != "" {
				return taskID, nil
			}
			return "", fmt.Errorf("RunningHub 工作流任务创建失败: APIKEY_TASK_IS_RUNNING")
		}
		return "", fmt.Errorf("RunningHub 工作流任务创建失败: %s", firstNonEmptyText(message, code))
	}

	return "", fmt.Errorf("RunningHub 工作流任务创建失败: 未返回 taskId")
}

func rhflowTaskIDFromBody(body any) string {
	for _, value := range []any{
		valueFromMap(body, "taskId"),
		valueFromMap(rhflowResponseData(body), "taskId"),
		valueFromMap(body, "task_id"),
		valueFromMap(rhflowResponseData(body), "task_id"),
	} {
		if taskID := strings.TrimSpace(botprotocol.AsText(value)); taskID != "" {
			return taskID
		}
	}
	return ""
}

func rhflowStoreTaskID(input botprotocol.NativeInput, taskID string) {
	taskID = strings.TrimSpace(taskID)
	if taskID == "" {
		return
	}
	key := rhflowTaskCacheKey(input)
	if key == "" {
		return
	}
	rhflowTaskCache.Store(key, taskID)
}

func rhflowCachedTaskID(input botprotocol.NativeInput) string {
	key := rhflowTaskCacheKey(input)
	if key == "" {
		return ""
	}
	value, ok := rhflowTaskCache.Load(key)
	if !ok {
		return ""
	}
	return strings.TrimSpace(botprotocol.AsText(value))
}

func rhflowClearTaskID(input botprotocol.NativeInput) {
	key := rhflowTaskCacheKey(input)
	if key != "" {
		rhflowTaskCache.Delete(key)
	}
}

func rhflowTaskCacheKey(input botprotocol.NativeInput) string {
	workflowID := strings.TrimSpace(input.ServiceAPI)
	accountKey := strings.TrimSpace(input.Account.Key)
	if workflowID == "" || accountKey == "" {
		return ""
	}
	payload := rhflowBody(input, workflowID)
	raw, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	sum := sha256.Sum256(raw)
	return hex.EncodeToString(sum[:])
}

func (RhFlowAdapter) BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error) {
	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"
	return botprovider.Request{
		URL:     rhflowJoinURL(input.Provider.Host, rhflowQueryPath),
		Method:  http.MethodPost,
		Headers: headers,
		Body: map[string]any{
			"taskId": strings.TrimSpace(taskID),
		},
	}, nil
}

func (RhFlowAdapter) ParseTaskStatus(input botprotocol.NativeInput, resp *botprovider.Response) (bottask.TaskStatus, error) {
	body := botprotocol.NormalizeMap(resp.Body)
	if body == nil {
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: "RUNNING"}, nil
	}

	errorMessage := firstNonEmptyText(body["errorMessage"], body["failedReason"])
	message := firstNonEmptyText(body["msg"], body["message"], errorMessage)
	if terminalMessage := botprotocol.TerminalTaskErrorText(errorMessage, message); terminalMessage != "" {
		rhflowClearTaskID(input)
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: "FAILED", Message: terminalMessage}, nil
	}
	data := body["data"]
	if results := botprotocol.NormalizeAnyList(body["results"]); len(results) > 0 {
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: "SUCCESS", Message: message}, nil
	}
	if outputs := botprotocol.NormalizeAnyList(data); len(outputs) > 0 {
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: "SUCCESS", Message: message}, nil
	}

	status := strings.ToUpper(firstNonEmptyText(
		body["status"],
		body["taskStatus"],
		valueFromMap(data, "status"),
		valueFromMap(data, "taskStatus"),
	))
	code := strings.TrimSpace(botprotocol.AsText(body["code"]))
	if code != "" && code != "0" {
		if rhflowIsRunningStatus(status) || rhflowIsRunningMessage(message) {
			return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: firstNonEmptyText(status, "RUNNING"), Message: message}, nil
		}
		rhflowClearTaskID(input)
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: code, Message: firstNonEmptyText(message, code)}, nil
	}

	switch {
	case rhflowIsSucceededStatus(status):
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: firstNonEmptyText(status, "SUCCESS"), Message: message}, nil
	case rhflowIsFailedStatus(status):
		rhflowClearTaskID(input)
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: status, Message: firstNonEmptyText(message, status)}, nil
	default:
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: firstNonEmptyText(status, "RUNNING"), Message: firstNonEmptyText(message, rhflowDefaultMessage)}, nil
	}
}

func rhflowJoinURL(baseURL string, path string) string {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	for _, suffix := range []string{"/openapi/v2", "/task/openapi/create", "/task/openapi/outputs", "/task/openapi"} {
		baseURL = strings.TrimSuffix(baseURL, suffix)
	}
	return botprovider.JoinURL(baseURL, path)
}

func rhflowBody(input botprotocol.NativeInput, workflowID string) map[string]any {
	body := map[string]any{}
	mapped := input.Mapped
	if mapped.IsZero() && input.Request != nil {
		mapped = botprotocol.NewMappedInput(input.Request.Input, nil)
	}
	nodeInfoList := make([]map[string]any, 0, len(mapped.Params))
	for _, param := range mapped.Params {
		key := strings.TrimSpace(param.NativeKey)
		if key == "" || !rhapiHasValue(param.Value) {
			continue
		}
		nodeID, fieldName, ok := rhflowNodeField(key)
		if !ok {
			continue
		}
		nodeInfoList = append(nodeInfoList, map[string]any{
			"nodeId":     nodeID,
			"fieldName":  fieldName,
			"fieldValue": param.Value,
		})
	}

	if len(nodeInfoList) > 0 {
		body["nodeInfoList"] = nodeInfoList
	}
	body["apiKey"] = strings.TrimSpace(input.Account.Key)
	body["workflowId"] = workflowID
	return body
}

func rhflowNodeField(key string) (string, string, bool) {
	nodeID, fieldName, found := strings.Cut(strings.TrimSpace(key), ".")
	nodeID = strings.TrimSpace(nodeID)
	fieldName = strings.TrimSpace(fieldName)
	return nodeID, fieldName, found && nodeID != "" && fieldName != ""
}

func rhflowRequestKind(input botprotocol.NativeInput) string {
	outputType := rhflowOutputType(input)
	if outputType == "" {
		return rhflowDefaultKind
	}
	return rhflowKindPrefix + outputType
}

func rhflowOutputType(input botprotocol.NativeInput) string {
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

func runningHubOutputTypeFromKind(kind string) string {
	kind = strings.ToLower(strings.TrimSpace(kind))
	for _, prefix := range []string{rhflowKindPrefix, rhapiKindPrefix, "runninghub."} {
		kind = strings.TrimPrefix(kind, prefix)
	}
	switch kind {
	case botprotocol.MediaTypeImage, "images", "picture", "pictures":
		return botprotocol.MediaTypeImage
	case botprotocol.MediaTypeVideo, "videos":
		return botprotocol.MediaTypeVideo
	case botprotocol.MediaTypeAudio, "audios", "music", "song", "songs":
		return botprotocol.MediaTypeAudio
	case botprotocol.MediaTypeFile, "files":
		return botprotocol.MediaTypeFile
	default:
		return ""
	}
}

func rhflowResponseError(body any) error {
	code := strings.TrimSpace(botprotocol.AsText(valueFromMap(body, "code")))
	if code == "" || code == "0" {
		return nil
	}
	message := firstNonEmptyText(valueFromMap(body, "msg"), valueFromMap(body, "message"), valueFromMap(body, "errorMessage"), code)
	return fmt.Errorf("RunningHub 工作流返回失败: %s", message)
}

func rhflowOutput(body any, defaultType string) botprotocol.Output {
	output := botprotocol.ExtractMediaOutput(rhflowResultPayload(body, defaultType), defaultType)
	if botprotocol.HasMediaOutput(output) {
		return output
	}
	return botprotocol.ExtractMediaOutput(body, defaultType)
}

func rhflowResultPayload(body any, defaultType string) any {
	if results := botprotocol.NormalizeAnyList(valueFromMap(body, "results")); len(results) > 0 {
		return rhflowResultItemsPayload(results, defaultType)
	}
	data := rhflowResponseData(body)
	results := botprotocol.NormalizeAnyList(data)
	if len(results) == 0 {
		return data
	}
	return rhflowResultItemsPayload(results, defaultType)
}

func rhflowResultItemsPayload(results []any, defaultType string) any {
	payload := make([]any, 0, len(results))
	for _, item := range results {
		result := botprotocol.NormalizeMap(item)
		if result == nil {
			payload = append(payload, item)
			continue
		}
		fileURL := strings.TrimSpace(firstNonEmptyText(result["fileUrl"], result["url"]))
		if fileURL == "" {
			payload = append(payload, result)
			continue
		}
		outputType := runningHubMediaTypeFromFile(result["fileType"], result["outputType"], fileURL, defaultType)
		payload = append(payload, map[string]any{
			"url":          fileURL,
			"type":         outputType,
			"fileType":     result["fileType"],
			"nodeId":       result["nodeId"],
			"taskCostTime": result["taskCostTime"],
		})
	}
	return payload
}

func rhflowResponseData(body any) any {
	mapped := botprotocol.NormalizeMap(body)
	if mapped == nil {
		return body
	}
	return mapped["data"]
}

func runningHubMediaTypeFromFile(fileType any, outputType any, fileURL string, fallback string) string {
	for _, value := range []string{
		botprotocol.AsText(outputType),
		botprotocol.AsText(fileType),
		strings.TrimPrefix(strings.ToLower(filepath.Ext(fileURL)), "."),
	} {
		switch strings.ToLower(strings.TrimSpace(value)) {
		case "jpg", "jpeg", "png", "webp", "gif", "bmp":
			return botprotocol.MediaTypeImage
		case "mp4", "mov", "webm", "avi", "mkv":
			return botprotocol.MediaTypeVideo
		case "mp3", "wav", "m4a", "aac", "flac", "ogg":
			return botprotocol.MediaTypeAudio
		}
		if mediaType := runningHubOutputTypeFromKind(value); mediaType != "" {
			return mediaType
		}
	}
	if fallback != "" {
		return fallback
	}
	return botprotocol.MediaTypeFile
}

func rhflowIsRunningStatus(status string) bool {
	switch strings.ToUpper(strings.TrimSpace(status)) {
	case "", "PENDING", "CREATED", "SUBMITTED", "QUEUED", "IN_QUEUE", "RUNNING", "PROCESSING", "STARTED":
		return true
	default:
		return false
	}
}

func rhflowIsSucceededStatus(status string) bool {
	switch strings.ToUpper(strings.TrimSpace(status)) {
	case "SUCCESS", "SUCCEEDED", "FINISHED", "COMPLETED":
		return true
	default:
		return false
	}
}

func rhflowIsFailedStatus(status string) bool {
	switch strings.ToUpper(strings.TrimSpace(status)) {
	case "FAILED", "FAIL", "ERROR", "CANCELED", "CANCELLED", "STOPPED", "TERMINATED", "ABORTED", "EXPIRED":
		return true
	default:
		return false
	}
}

func rhflowIsRunningMessage(message string) bool {
	message = strings.ToLower(strings.TrimSpace(message))
	return strings.Contains(message, "running") ||
		strings.Contains(message, "queue") ||
		strings.Contains(message, "排队") ||
		strings.Contains(message, "运行")
}
