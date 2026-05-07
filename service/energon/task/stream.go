package task

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
)

const (
	defaultPollMaxAttempts   = 60
	defaultPollInterval      = 3 * time.Second
	defaultPollEstimateMax   = 100
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
	if err := writeProgress(job.Write, taskStartText(spec, job), spec.StartProgress); err != nil {
		return StreamResult{Handled: true}, err
	}
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

	stopEstimate := startEstimatedProgress(ctx, spec, job)
	defer stopEstimate()

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
		if botprotocol.HasMediaOutput(output) {
			output["event"] = "progress"
			if _, exists := output["text"]; !exists {
				output["text"] = taskPartialText(spec, job)
			}
			if _, exists := output["progress"]; !exists {
				output["progress"] = estimateMax(spec)
			}
			return writeTaskOutput(job.Write, output)
		}
		if _, ok := output["meta"]; ok {
			output["event"] = "progress"
			if _, exists := output["text"]; !exists {
				output["text"] = taskAlmostDoneText(spec, job)
			}
			if _, exists := output["progress"]; !exists {
				output["progress"] = estimateMax(spec)
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
	if err := ensureProviderOK(spec.StartText, resp); err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}

	data, err := job.Adapter.BuildClientResponse(job.Input.Request, resp)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	data = normalizeRequestTaskData(spec, data)
	stopEstimate()
	stopEstimate = func() {}
	if err := writeProgress(job.Write, taskDoneText(spec, job), spec.DoneProgress); err != nil {
		return StreamResult{Response: resp, Data: data, Handled: true}, err
	}
	return StreamResult{Response: resp, Data: data, Handled: true}, nil
}

func (s Service) runPlainRequest(ctx context.Context, spec StreamTaskSpec, job StreamJob) (StreamResult, error) {
	stopEstimate := startEstimatedProgress(ctx, spec, job)
	defer stopEstimate()

	job.Request = withPlainRequestTimeout(spec, job.Request)
	resp, err := job.Client.Do(ctx, job.Request)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	if err := ensureProviderOK(spec.StartText, resp); err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}

	data, err := job.Adapter.BuildClientResponse(job.Input.Request, resp)
	if err != nil {
		return StreamResult{Response: resp, Handled: true}, err
	}
	data = normalizeRequestTaskData(spec, data)
	stopEstimate()
	stopEstimate = func() {}
	if err := writeProgress(job.Write, taskDoneText(spec, job), spec.DoneProgress); err != nil {
		return StreamResult{Response: resp, Data: data, Handled: true}, err
	}
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
	if err := ensureProviderOK(spec.StartText, resp); err != nil {
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
	write ProgressWriter,
) (any, error) {
	taskID, err := adapter.ParseTaskID(job.Input, initialResp)
	if err != nil {
		return nil, err
	}
	if strings.TrimSpace(taskID) == "" {
		return job.Adapter.BuildClientResponse(job.Input.Request, initialResp)
	}
	registerRemoteCancel(adapter, job, taskID)
	if err := writeProgress(write, taskMessage(spec.CreatedText, taskID), estimateStart(spec)+5); err != nil {
		return nil, err
	}

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
			if err := writeProgress(write, firstText(spec.DoneText, status.Message), spec.DoneProgress); err != nil {
				return nil, err
			}
			return job.Adapter.BuildClientResponse(job.Input.Request, resp)
		case TaskStateFailed:
			return nil, fmt.Errorf("%s", firstText(taskStatusText(status.Message), taskStatusText(status.Label), "长任务失败"))
		default:
			progress := estimatePollingProgress(spec, attempt, maxAttempts)
			if err := writeProgress(write, taskMessage(firstText(status.Message, spec.RunningText), status.Label), progress); err != nil {
				return nil, err
			}
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
	if spec.StartProgress == 0 {
		spec.StartProgress = 20
	}
	if spec.DoneProgress <= 0 {
		spec.DoneProgress = 100
	}
	if spec.EstimateMax <= 0 {
		spec.EstimateMax = 90
	}
	if spec.EstimateMax > 99 {
		spec.EstimateMax = 99
	}
	if spec.MaxAttempts <= 0 {
		spec.MaxAttempts = defaultPollMaxAttempts
	}
	if spec.PollInterval <= 0 {
		spec.PollInterval = defaultPollInterval
	}
	return spec
}

func startEstimatedProgress(ctx context.Context, spec StreamTaskSpec, job StreamJob) func() {
	if !spec.EstimateProgress || job.Write == nil {
		return func() {}
	}
	stop := make(chan struct{})
	done := make(chan struct{})
	var once sync.Once
	go func() {
		defer close(done)
		ticker := time.NewTicker(1500 * time.Millisecond)
		defer ticker.Stop()

		progress := estimateStart(spec)
		maxProgress := estimateMax(spec)
		for {
			select {
			case <-ctx.Done():
				return
			case <-stop:
				return
			case <-ticker.C:
				next := nextEstimatedProgress(progress, maxProgress)
				if next == progress {
					continue
				}
				progress = next
				_ = writeProgress(job.Write, taskPartialText(spec, job), progress)
			}
		}
	}()
	return func() {
		once.Do(func() {
			close(stop)
			<-done
		})
	}
}

func estimatePollingProgress(spec StreamTaskSpec, attempt int, maxAttempts int) int {
	if maxAttempts <= 0 {
		return estimateMax(spec)
	}
	start := estimateStart(spec)
	maxProgress := estimateMax(spec)
	estimateAttempts := maxAttempts
	if estimateAttempts > defaultPollEstimateMax {
		estimateAttempts = defaultPollEstimateMax
	}
	progress := start + (attempt+1)*(maxProgress-start)/estimateAttempts
	if progress < start {
		return start
	}
	if progress > maxProgress {
		return maxProgress
	}
	return progress
}

func nextEstimatedProgress(current int, maxProgress int) int {
	if current < 0 {
		current = 0
	}
	if maxProgress <= 0 || current >= maxProgress {
		return current
	}
	step := (maxProgress - current) / 6
	if step < 1 {
		step = 1
	}
	next := current + step
	if next > maxProgress {
		return maxProgress
	}
	return next
}

func estimateStart(spec StreamTaskSpec) int {
	if spec.StartProgress < 0 {
		return 0
	}
	if spec.StartProgress > 100 {
		return 100
	}
	return spec.StartProgress
}

func estimateMax(spec StreamTaskSpec) int {
	if spec.EstimateMax <= 0 {
		return 90
	}
	if spec.EstimateMax > 99 {
		return 99
	}
	return spec.EstimateMax
}

func writeProgress(write ProgressWriter, text string, progress int) error {
	if write == nil {
		return nil
	}
	output := botprotocol.Output{
		"event": "progress",
		"text":  strings.TrimSpace(text),
	}
	if progress >= 0 {
		if progress > 100 {
			progress = 100
		}
		output["progress"] = progress
	}
	return write(output)
}

func writeTaskOutput(write ProgressWriter, output botprotocol.Output) error {
	if write == nil || len(output) == 0 {
		return nil
	}
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

func taskMessage(format string, value string) string {
	format = strings.TrimSpace(format)
	value = taskStatusText(value)
	if format == "" {
		return value
	}
	if value == "" {
		return format
	}
	if strings.Contains(format, "%s") {
		return fmt.Sprintf(format, value)
	}
	return format + ": " + value
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

func taskStartText(spec StreamTaskSpec, job StreamJob) string {
	if text := strings.TrimSpace(spec.StartText); text != "" {
		return text
	}
	return "正在生成" + taskOutputLabel(spec, job)
}

func taskPartialText(spec StreamTaskSpec, job StreamJob) string {
	if text := strings.TrimSpace(spec.RunningText); text != "" {
		return text
	}
	return taskOutputLabel(spec, job) + "生成中"
}

func taskAlmostDoneText(spec StreamTaskSpec, job StreamJob) string {
	return taskOutputLabel(spec, job) + "生成即将完成"
}

func taskDoneText(spec StreamTaskSpec, job StreamJob) string {
	if text := strings.TrimSpace(spec.DoneText); text != "" {
		return text
	}
	return taskOutputLabel(spec, job) + "生成完成"
}

func taskOutputLabel(spec StreamTaskSpec, job StreamJob) string {
	switch strings.ToLower(strings.TrimSpace(spec.OutputType)) {
	case botprotocol.MediaTypeImage, "images":
		return "图片"
	case botprotocol.MediaTypeVideo, "videos":
		return "视频"
	case botprotocol.MediaTypeAudio, "audios":
		return "音频"
	case botprotocol.MediaTypeFile, "files":
		return "文件"
	}

	switch strings.ToLower(strings.TrimSpace(firstText(job.Input.Service.Type, job.Input.Power.Kind))) {
	case "image", "images":
		return "图片"
	case "video", "videos":
		return "视频"
	case "audio", "audios":
		return "音频"
	default:
		return "内容"
	}
}
