package task

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
)

const (
	defaultPollMaxAttempts   = 60
	defaultPollInterval      = 3 * time.Second
	plainMediaRequestTimeout = 9 * time.Minute
)

func (s Service) ResolveStream(ctx context.Context, job StreamJob) (StreamResult, error) {
	spec, ok := streamTaskSpec(job.Adapter, job.Input)
	if !ok {
		return StreamResult{}, nil
	}

	switch spec.Kind {
	case StreamKindRequest:
		return s.runRequest(ctx, spec, job)
	case StreamKindPolling:
		return s.runPollingCreate(ctx, spec, job)
	default:
		return StreamResult{}, nil
	}
}

func (s Service) ResolveResponse(ctx context.Context, job ResponseJob) (any, bool, error) {
	spec, ok := streamTaskSpec(job.Adapter, job.Input)
	if !ok || spec.Kind != StreamKindPolling {
		return nil, false, nil
	}

	polling, ok := job.Adapter.(PollingAdapter)
	if !ok {
		return nil, false, fmt.Errorf("长任务协议缺少轮询实现")
	}
	data, err := s.pollResult(ctx, spec, polling, StreamJob{
		Input:   job.Input,
		Adapter: job.Adapter,
		Client:  job.Client,
	}, job.Response, nil)
	return data, true, err
}

func (s Service) runRequest(ctx context.Context, spec StreamTaskSpec, job StreamJob) (StreamResult, error) {
	if !spec.PlainRequest && canStreamRequest(job) {
		return s.runStreamRequest(ctx, spec, job)
	}
	return s.runPlainRequest(ctx, spec, job)
}

func (s Service) runStreamRequest(ctx context.Context, spec StreamTaskSpec, job StreamJob) (StreamResult, error) {
	streamClient, ok := job.Client.(botprovider.StreamClient)
	if !ok {
		return s.runPlainRequest(ctx, spec, job)
	}

	rawChunks := make([]string, 0)
	resp, err := streamClient.Stream(ctx, job.Request, func(chunk botprovider.StreamChunk) error {
		rawChunks = append(rawChunks, encodeSSEChunk(chunk))
		output := botprotocol.ExtractMediaStreamOutput(chunk.Data, chunk.Event, spec.OutputType)
		if len(output) == 0 {
			return nil
		}
		if fmt.Sprint(output["event"]) == "end" {
			return nil
		}
		if botprotocol.HasMediaOutput(output) || output["meta"] != nil {
			output["event"] = "status"
			if _, exists := output["text"]; !exists {
				output["text"] = taskPartialText(spec, job)
			}
			return writeTaskOutput(job.Write, output)
		}
		return nil
	})
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	if resp == nil {
		return StreamResult{Handled: true}, fmt.Errorf("来源流式返回为空")
	}
	if len(rawChunks) > 0 {
		resp.Body = strings.Join(rawChunks, "")
	}
	if err := ensureProviderOK(taskActionText(spec, job), resp); err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}

	data, err := job.Adapter.BuildClientResponse(job.Input.Request, resp)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	data = normalizeRequestTaskData(spec, data)
	return StreamResult{Response: resp, Data: data, Handled: true}, nil
}

func (s Service) runPlainRequest(ctx context.Context, spec StreamTaskSpec, job StreamJob) (StreamResult, error) {
	job.Request = withPlainRequestTimeout(spec, job.Request)

	resp, err := job.Client.Do(ctx, job.Request)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	if err := ensureProviderOK(taskActionText(spec, job), resp); err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}

	data, err := job.Adapter.BuildClientResponse(job.Input.Request, resp)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	data = normalizeRequestTaskData(spec, data)
	return StreamResult{Response: resp, Data: data, Handled: true}, nil
}

func (s Service) runPollingCreate(ctx context.Context, spec StreamTaskSpec, job StreamJob) (StreamResult, error) {
	polling, ok := job.Adapter.(PollingAdapter)
	if !ok {
		return StreamResult{Handled: true}, fmt.Errorf("长任务协议缺少轮询实现")
	}

	resp, err := job.Client.Do(ctx, job.Request)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	if err := ensureProviderOK(taskActionText(spec, job), resp); err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}

	data, err := s.pollResult(ctx, spec, polling, job, resp, job.Write)
	return StreamResult{Response: resp, Data: data, Handled: true}, err
}

func (s Service) pollResult(
	ctx context.Context,
	spec StreamTaskSpec,
	adapter PollingAdapter,
	job StreamJob,
	initialResp *botprovider.Response,
	write StreamWriter,
) (any, error) {
	taskID, err := adapter.ParseTaskID(job.Input, initialResp)
	if err != nil {
		return nil, err
	}
	if strings.TrimSpace(taskID) == "" {
		return job.Adapter.BuildClientResponse(job.Input.Request, initialResp)
	}
	registerRemoteCancel(adapter, job, taskID)

	maxAttempts := pollMaxAttempts(job.Input.Request.Options, spec.MaxAttempts)
	interval := pollInterval(job.Input.Request.Options, spec.PollInterval)
	for attempt := 0; attempt < maxAttempts; attempt++ {
		if attempt > 0 {
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(interval):
			}
		}

		pollReq, err := adapter.BuildPollRequest(job.Input, taskID)
		if err != nil {
			return nil, err
		}
		resp, err := job.Client.Do(ctx, pollReq)
		if err != nil {
			return nil, err
		}
		if err := ensureProviderOK("查询长任务", resp); err != nil {
			return nil, err
		}

		status, err := adapter.ParseTaskStatus(job.Input, resp)
		if err != nil {
			return nil, err
		}
		status = normalizeTerminalTaskStatus(status)
		switch status.State {
		case TaskStateSucceeded:
			return job.Adapter.BuildClientResponse(job.Input.Request, resp)
		case TaskStateFailed:
			return nil, fmt.Errorf("%s", firstText(taskStatusText(status.Message), taskStatusText(status.Label), "长任务失败"))
		}
	}

	return nil, fmt.Errorf("长任务超时: %s", taskID)
}

func registerRemoteCancel(adapter PollingAdapter, job StreamJob, taskID string) {
	remoteCancel, ok := adapter.(RemoteCancelAdapter)
	if !ok || job.RegisterCancel == nil || strings.TrimSpace(taskID) == "" {
		return
	}
	job.RegisterCancel(func(ctx context.Context) error {
		return remoteCancel.CancelTask(ctx, job.Input, taskID, job.Client)
	})
}

func streamTaskSpec(adapter botprotocol.Adapter, input botprotocol.NativeInput) (StreamTaskSpec, bool) {
	taskAdapter, ok := adapter.(StreamTaskAdapter)
	if !ok {
		return StreamTaskSpec{}, false
	}
	spec, ok := taskAdapter.StreamTaskSpec(input)
	if !ok {
		return StreamTaskSpec{}, false
	}
	return normalizeStreamTaskSpec(spec), true
}

func normalizeStreamTaskSpec(spec StreamTaskSpec) StreamTaskSpec {
	if spec.MaxAttempts <= 0 {
		spec.MaxAttempts = defaultPollMaxAttempts
	}
	if spec.PollInterval <= 0 {
		spec.PollInterval = defaultPollInterval
	}
	return spec
}

func writeTaskOutput(write StreamWriter, output botprotocol.Output) error {
	if write == nil || len(output) == 0 {
		return nil
	}
	botprotocol.StripOutputProgress(output)
	return write(output)
}

func ensureProviderOK(label string, resp *botprovider.Response) error {
	if resp == nil {
		return fmt.Errorf("%s失败: 来源返回为空", firstText(label, "请求来源"))
	}
	if resp.StatusCode < http.StatusBadRequest {
		return nil
	}
	return fmt.Errorf("%s失败: status=%d body=%s", firstText(label, "请求来源"), resp.StatusCode, botprotocol.AsText(resp.Body))
}

func taskStatusText(value string) string {
	text := strings.TrimSpace(value)
	switch text {
	case "{}", "[]", "null":
		return ""
	}
	switch strings.ToUpper(text) {
	case "PENDING", "CREATED", "SUBMITTED":
		return "等待中"
	case "QUEUED", "IN_QUEUE":
		return "排队中"
	case "RUNNING", "PROCESSING", "STARTED":
		return "运行中"
	case "SUCCESS", "SUCCEEDED", "FINISHED", "COMPLETED":
		return "已完成"
	case "FAILED", "FAIL", "ERROR":
		return "失败"
	case "CANCELED", "CANCELLED":
		return "已取消"
	case "STOPPED", "TERMINATED", "ABORTED":
		return "已停止"
	case "EXPIRED":
		return "已过期"
	default:
		return text
	}
}

func normalizeTerminalTaskStatus(status TaskStatus) TaskStatus {
	if status.State != TaskStateRunning && status.State != TaskStatePending {
		return status
	}
	message := firstText(status.Message, status.Label)
	if !botprotocol.IsTerminalTaskErrorText(message) {
		return status
	}
	status.State = TaskStateFailed
	status.Label = firstText(status.Label, "FAILED")
	status.Message = message
	return status
}

func pollMaxAttempts(options map[string]any, fallback int) int {
	value := intOption(options, "poll_max_attempts", fallback)
	if value <= 0 {
		return defaultPollMaxAttempts
	}
	return value
}

func pollInterval(options map[string]any, fallback time.Duration) time.Duration {
	value := time.Duration(intOption(options, "poll_interval_ms", int(fallback/time.Millisecond))) * time.Millisecond
	if value <= 0 {
		return defaultPollInterval
	}
	return value
}

func intOption(options map[string]any, key string, fallback int) int {
	if options == nil {
		return fallback
	}
	switch current := options[key].(type) {
	case int:
		return current
	case int64:
		return int(current)
	case float64:
		return int(current)
	case string:
		var value int
		if _, err := fmt.Sscanf(strings.TrimSpace(current), "%d", &value); err == nil {
			return value
		}
	}
	return fallback
}

func firstText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}

func canStreamRequest(job StreamJob) bool {
	return boolOption(job.Request.Body, "stream") || boolOption(job.Input.Request.Options, "stream")
}

func normalizeRequestTaskData(spec StreamTaskSpec, data any) any {
	if strings.TrimSpace(spec.OutputType) == "" {
		return data
	}
	return map[string]any{
		"output": botprotocol.ExtractMediaOutput(data, spec.OutputType),
	}
}

func withPlainRequestTimeout(spec StreamTaskSpec, req botprovider.Request) botprovider.Request {
	if req.Timeout > 0 || strings.TrimSpace(spec.OutputType) == "" {
		return req
	}
	req.Timeout = plainMediaRequestTimeout
	return req
}

func boolOption(values map[string]any, key string) bool {
	if values == nil {
		return false
	}
	switch current := values[key].(type) {
	case bool:
		return current
	case int:
		return current != 0
	case int64:
		return current != 0
	case float64:
		return current != 0
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "y", "on":
			return true
		default:
			return false
		}
	default:
		return false
	}
}

func encodeSSEChunk(chunk botprovider.StreamChunk) string {
	var builder strings.Builder
	if event := strings.TrimSpace(chunk.Event); event != "" {
		builder.WriteString("event: ")
		builder.WriteString(event)
		builder.WriteString("\n")
	}
	builder.WriteString("data: ")
	builder.WriteString(strings.TrimSpace(chunk.Data))
	builder.WriteString("\n\n")
	return builder.String()
}

func taskPartialText(spec StreamTaskSpec, job StreamJob) string {
	return taskOutputLabel(spec, job) + "生成中，请稍后"
}

func taskActionText(spec StreamTaskSpec, job StreamJob) string {
	return taskOutputLabel(spec, job) + "生成"
}

func taskOutputLabel(spec StreamTaskSpec, job StreamJob) string {
	return botprotocol.MediaOutputLabel(spec.OutputType, job.Input.Service.Type, job.Input.Power.Kind)
}
