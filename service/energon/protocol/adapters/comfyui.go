package adapters

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

type ComfyUIAdapter struct{}

func (ComfyUIAdapter) Name() string { return botmodel.ProtocolComfyUI }

func (ComfyUIAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	name := strings.TrimSpace(botprotocol.AsText(raw.Body["power"]))
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)
	return &botprotocol.ShemicRequest{
		Mode: raw.Mode, Protocol: botmodel.ProtocolComfyUI, Kind: "comfyui.image", Name: name,
		Set: parts.Set, Input: parts.Input, History: parts.History, Options: parts.Options, Raw: raw,
	}, nil
}

func (ComfyUIAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	if _, err := comfyOutputType(input); err != nil {
		return botprovider.Request{}, err
	}
	if err := botprotocol.ValidateServiceEndpointType(botmodel.ProtocolComfyUI, input.ServiceEndpoint.InterfaceType); err != nil {
		return botprovider.Request{}, err
	}
	workflow, err := botprotocol.ParseComfyWorkflow(input.ServiceEndpoint.WorkflowJSON)
	if err != nil {
		return botprovider.Request{}, err
	}
	for _, param := range comfyMappedParams(input.Mapped.Params) {
		inputs, inputName, err := botprotocol.ComfyWorkflowInput(workflow, param.NativeKey)
		if err != nil {
			return botprovider.Request{}, err
		}
		value, err := comfyInputValue(param, inputs[inputName])
		if err != nil {
			return botprovider.Request{}, err
		}
		inputs[inputName] = value
	}
	request, err := comfyRequest(input, resolveConfiguredPath(input, "/prompt"), http.MethodPost)
	if err != nil {
		return botprovider.Request{}, err
	}
	request.Body = map[string]any{"prompt": workflow}
	if input.Request != nil && strings.TrimSpace(input.Request.RequestID) != "" {
		request.Body["client_id"] = input.Request.RequestID
	}
	return request, nil
}

func (ComfyUIAdapter) BuildClientResponse(_ *botprotocol.ShemicRequest, _ *botprovider.Response) (any, error) {
	return nil, fmt.Errorf("ComfyUI 结果必须通过任务轮询和鉴权下载获取")
}

func (ComfyUIAdapter) StreamTaskSpec(input botprotocol.NativeInput) (bottask.StreamTaskSpec, bool) {
	kind, err := comfyOutputType(input)
	return bottask.StreamTaskSpec{Kind: bottask.StreamKindPolling, OutputType: kind, MaxAttempts: 1200, PollInterval: 3 * time.Second}, err == nil
}

func (ComfyUIAdapter) SupportsCancel(botprotocol.NativeInput) bool { return false }

func (ComfyUIAdapter) WrapTaskError(taskID string, err error) error {
	if err == nil || botprotocol.PreventsReplay(err) {
		return err
	}
	return &botprotocol.RemoteTaskError{TaskID: taskID, Cause: err}
}

func (ComfyUIAdapter) ParseTaskID(_ botprotocol.NativeInput, response *botprovider.Response) (string, error) {
	if response == nil {
		return "", fmt.Errorf("ComfyUI 返回为空")
	}
	body := botprotocol.NormalizeMap(response.Body)
	taskID := strings.TrimSpace(botprotocol.AsText(body["prompt_id"]))
	if taskID == "" {
		return "", fmt.Errorf("ComfyUI 未返回 prompt_id，请检查工作流和节点错误")
	}
	return taskID, nil
}

func (ComfyUIAdapter) BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error) {
	return comfyRequest(input, "/history/"+url.PathEscape(taskID), http.MethodGet)
}

func (ComfyUIAdapter) ParseTaskStatus(_ botprotocol.NativeInput, response *botprovider.Response) (bottask.TaskStatus, error) {
	entry, err := comfyHistoryEntry(response, "")
	if err != nil {
		return bottask.TaskStatus{}, err
	}
	if entry == nil {
		return bottask.TaskStatus{State: bottask.TaskStateRunning}, nil
	}
	status := botprotocol.NormalizeMap(entry["status"])
	if status == nil {
		return bottask.TaskStatus{}, fmt.Errorf("ComfyUI 历史记录缺少任务状态")
	}
	statusText := botprotocol.AsText(status["status_str"])
	for _, rawMessage := range botprotocol.NormalizeAnyList(status["messages"]) {
		message := botprotocol.NormalizeAnyList(rawMessage)
		if len(message) < 2 {
			continue
		}
		event := botprotocol.AsText(message[0])
		if event == "execution_error" || event == "execution_interrupted" {
			details := botprotocol.NormalizeMap(message[1])
			return bottask.TaskStatus{State: bottask.TaskStateFailed, Message: firstNonEmptyText(details["exception_message"], "ComfyUI 任务执行失败或已中断")}, nil
		}
	}
	if statusText == "error" {
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Message: "ComfyUI 任务执行失败"}, nil
	}
	if completed, _ := status["completed"].(bool); completed && statusText == "success" {
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded}, nil
	}
	return bottask.TaskStatus{State: bottask.TaskStateRunning}, nil
}

func comfyHistoryEntry(response *botprovider.Response, taskID string) (map[string]any, error) {
	if response == nil {
		return nil, fmt.Errorf("ComfyUI 历史记录返回为空")
	}
	body := botprotocol.NormalizeMap(response.Body)
	if body == nil {
		return nil, fmt.Errorf("ComfyUI 历史记录不是 JSON 对象")
	}
	if len(body) == 0 {
		return nil, nil
	}
	if taskID != "" {
		entry := botprotocol.NormalizeMap(body[taskID])
		if entry == nil {
			return nil, fmt.Errorf("ComfyUI 历史记录与任务 ID 不匹配")
		}
		return entry, nil
	}
	if len(body) != 1 {
		return nil, fmt.Errorf("ComfyUI 单任务查询返回了多个历史记录")
	}
	for _, value := range body {
		if entry := botprotocol.NormalizeMap(value); entry != nil {
			return entry, nil
		}
	}
	return nil, fmt.Errorf("ComfyUI 历史记录内容无效")
}

func comfyRequest(input botprotocol.NativeInput, endpoint, method string) (botprovider.Request, error) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.Unmarshal([]byte(input.Account.Key), &credentials); err != nil || strings.TrimSpace(credentials.Username) == "" || credentials.Password == "" || strings.Contains(credentials.Username, ":") {
		return botprovider.Request{}, fmt.Errorf("ComfyUI 账号凭据必须是包含 username 和 password 的 JSON，用户名不能包含冒号")
	}
	baseURL := strings.TrimSpace(input.Account.Host)
	if baseURL == "" {
		baseURL = strings.TrimSpace(input.Provider.Host)
	}
	base, err := url.Parse(baseURL)
	if err != nil || base == nil || (base.Scheme != "http" && base.Scheme != "https") || base.Host == "" || base.User != nil || base.RawQuery != "" || base.Fragment != "" {
		return botprovider.Request{}, fmt.Errorf("ComfyUI 主机必须是不含用户名、密码和查询参数的 HTTP(S) 地址")
	}
	address, err := url.Parse(botprovider.JoinURL(baseURL, endpoint))
	if err != nil || address == nil || address.User != nil || !botprovider.SameOrigin(address, base) {
		return botprovider.Request{}, fmt.Errorf("ComfyUI 接口必须与账号主机同源，不能把鉴权发送给其他站点")
	}
	auth := &http.Request{Header: make(http.Header)}
	auth.SetBasicAuth(credentials.Username, credentials.Password)
	return botprovider.Request{URL: address.String(), Method: method, Headers: map[string]string{"Authorization": auth.Header.Get("Authorization")}, SameOriginRedirects: true}, nil
}

func comfyOutputType(input botprotocol.NativeInput) (string, error) {
	kind := strings.TrimSpace(input.Power.Kind)
	if kind == "" {
		kind = strings.TrimSpace(input.Service.Type)
	}
	switch botmodel.NormalizePowerKind(kind) {
	case botprotocol.MediaTypeImage, botprotocol.MediaTypeVideo, botprotocol.MediaTypeAudio:
		return botmodel.NormalizePowerKind(kind), nil
	default:
		return "", fmt.Errorf("ComfyUI 工作流服务仅支持图片、视频或音频能力")
	}
}
