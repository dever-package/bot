package agent

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	frontstream "my/package/front/service/stream"
)

func (s Service) Run(ctx context.Context, req RunRequest) map[string]any {
	parsed, err := parseRunRequest(req.Body)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	agent, err := s.repo.FindAgent(ctx, parsed.AgentIdentity)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}
	power, err := s.repo.FindPower(ctx, agent.LLMPowerID)
	if err != nil {
		return frontstream.ResponsePayload("", "result", map[string]any{}, err.Error(), 2)
	}

	requestID := resolveRequestID(req)
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"agent_id":   agent.ID,
		"agent_key":  agent.Key,
		"input": jsonText(map[string]any{
			"input":   parsed.Input,
			"history": parsed.History,
		}),
		"skills":          "[]",
		"runtime_context": "",
		"output":          "",
		"error":           "",
		"status":          runStatusRunning,
		"step_count":      0,
		"latency":         0,
		"started_at":      now,
		"created_at":      now,
	})
	if runID == 0 {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "创建智能体运行记录失败", 2)
	}

	startPayload := streamPayload(requestID, map[string]any{
		"event": "start",
		"text":  "智能体运行已开始",
		"meta": map[string]any{
			"cancelable":    true,
			"agent":         agent.Key,
			"run_id":        runID,
			"started_at":    now.Format(time.RFC3339Nano),
			"started_at_ms": now.UnixMilli(),
		},
	})
	_ = s.writePayload(ctx, requestID, startPayload)

	go s.execute(runExecution{
		Request:   req,
		Parsed:    parsed,
		Agent:     agent,
		Power:     power,
		RunID:     runID,
		RequestID: requestID,
		StartedAt: now,
	})

	return startPayload
}

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
}

func (s Service) Stop(ctx context.Context, requestID string) map[string]any {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return frontstream.ResponsePayload(requestID, "result", map[string]any{}, "request_id 不能为空", 2)
	}
	resp := s.gateway.StopStream(ctx, requestID)
	payload := resp.Payload()
	if payloadStatus(payload) != 2 {
		now := time.Now()
		s.repo.UpdateRunByRequestID(ctx, requestID, map[string]any{
			"status":      runStatusCanceled,
			"finished_at": now,
		})
		_ = s.writeStreamOutput(ctx, requestID, cancelOutput())
		_ = s.writeCancelResult(ctx, requestID)
	}
	return payload
}

type runExecution struct {
	Request   RunRequest
	Parsed    parsedRunRequest
	Agent     agentmodel.Agent
	Power     energonmodel.Power
	RunID     uint64
	RequestID string
	StartedAt time.Time
}

func (s Service) execute(exec runExecution) {
	timeout := time.Duration(exec.Agent.TimeoutSeconds) * time.Second
	if timeout <= 0 {
		timeout = 300 * time.Second
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	tracker := runTracker{
		repo:      s.repo,
		runID:     exec.RunID,
		requestID: exec.RequestID,
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err := fmt.Errorf("%v", recovered)
			tracker.Step(context.Background(), "error", "运行异常", err.Error(), map[string]any{"error": err.Error()}, stepStatusFail)
			s.finishRun(context.Background(), exec, runStatusFail, "", err.Error(), tracker.seq)
			_ = s.writeErrorResult(context.Background(), exec.RequestID, err.Error())
		}
	}()

	tracker.Step(ctx, "input", "用户输入", primaryInputText(exec.Parsed.Input), map[string]any{
		"input":   exec.Parsed.Input,
		"history": exec.Parsed.History,
	}, stepStatusSuccess)

	if action, ok := powerActionFromInteractionResult(exec.Parsed); ok {
		tracker.Step(ctx, "power_resume", "交互续跑能力", action.Power, map[string]any{
			"power":            action.Power,
			"input":            action.Input,
			"source_target_id": action.SourceTargetID,
		}, stepStatusSuccess)
		output, status, message := s.executePowerAction(ctx, exec, action, "", "0-0")
		if status == runStatusSuccess {
			tracker.Step(ctx, "final", "最终输出", output, map[string]any{"output": output}, stepStatusSuccess)
			s.finishRun(ctx, exec, runStatusSuccess, output, "", tracker.seq)
			return
		}
		stepStatus := stepStatusFail
		if status == runStatusCanceled {
			stepStatus = stepStatusWarning
		}
		tracker.Step(context.Background(), "error", "运行结束", message, map[string]any{"status": status}, stepStatus)
		s.finishRun(context.Background(), exec, status, output, message, tracker.seq)
		return
	}

	catalog := loadSkillCatalog()
	if catalog.Warning != "" {
		tracker.Step(ctx, "warning", "技能目录", catalog.Warning, catalog, stepStatusWarning)
		_ = s.writeStreamStatus(ctx, exec.RequestID, catalog.Warning, nil)
	} else {
		tracker.Step(ctx, "skill_catalog", "技能目录", catalog.Content, map[string]any{"path": catalog.Path}, stepStatusSuccess)
		_ = s.writeStreamStatus(ctx, exec.RequestID, "已加载本地技能目录", nil)
	}

	powers := s.repo.ListActivePowers(ctx)
	settingPackID := exec.Agent.SettingPackID
	publicSettings := s.repo.ListActivePublicSettings(ctx, settingPackID)
	agentSettings := s.repo.ListActiveAgentSettings(ctx, exec.Agent.ID)
	agentKnowledge := s.repo.ListActiveAgentKnowledge(ctx, exec.Agent.ID)
	runtimeContext := buildAgentContext(publicSettings, agentSettings, agentKnowledge, catalog, powers, exec.Parsed.History)
	tracker.Step(ctx, "context", "运行上下文", runtimeContext, map[string]any{
		"setting_pack_id":  settingPackID,
		"public_settings":  len(publicSettings),
		"agent_settings":   len(agentSettings),
		"agent_knowledge":  len(agentKnowledge),
		"history_messages": len(exec.Parsed.History),
	}, stepStatusSuccess)
	s.repo.UpdateRun(ctx, exec.RunID, map[string]any{
		"skills": jsonText(map[string]any{
			"catalog": catalog.Path,
			"loaded":  catalog.Warning == "",
		}),
		"runtime_context": runtimeContext,
	})

	output, status, message := s.proxyEnergon(ctx, exec, runtimeContext)
	if status == runStatusSuccess {
		tracker.Step(ctx, "final", "最终输出", output, map[string]any{"output": output}, stepStatusSuccess)
		s.finishRun(ctx, exec, runStatusSuccess, output, "", tracker.seq)
		return
	}

	stepStatus := stepStatusFail
	if status == runStatusCanceled {
		stepStatus = stepStatusWarning
	}
	tracker.Step(context.Background(), "error", "运行结束", message, map[string]any{"status": status}, stepStatus)
	s.finishRun(context.Background(), exec, status, output, message, tracker.seq)
}

func (s Service) proxyEnergon(ctx context.Context, exec runExecution, runtimeContext string) (string, string, string) {
	body := buildEnergonBody(exec.Agent, exec.Power, exec.Parsed, runtimeContext)
	start := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: exec.RequestID,
		Method:    exec.Request.Method,
		Host:      exec.Request.Host,
		Path:      exec.Request.Path,
		Headers:   exec.Request.Headers,
		Body:      body,
	})
	startPayload := start.Payload()
	if payloadStatus(startPayload) == 2 {
		message := responseErrorMessage(startPayload, nil, "调用 LLM 能力失败")
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return "", runStatusFail, message
	}

	_ = s.writeStreamStatus(ctx, exec.RequestID, "已开始调用 LLM 能力", nil)

	return s.collectGatewayStream(ctx, exec, gatewayStreamOptions{
		TimeoutMessage:   "智能体运行超时",
		CollectDeltaText: true,
		OnOutput: func(ctx context.Context, output map[string]any) error {
			next := normalizeProxyOutput(output)
			if len(next) == 0 {
				return nil
			}
			return s.writeStreamOutput(ctx, exec.RequestID, next)
		},
		OnResult: func(ctx context.Context, frame map[string]any, state gatewayStreamState) (string, string, string) {
			return s.finishStreamResult(ctx, exec, state.Text, frame, state.LastID)
		},
	})
}

func (s Service) finishStreamResult(ctx context.Context, exec runExecution, aggregateText string, frame map[string]any, gatewayLastID string) (string, string, string) {
	requestID := exec.RequestID
	output := frameOutput(frame)
	event := outputEvent(output)
	if event == "cancel" {
		_ = s.writeCancelResult(ctx, requestID)
		return aggregateText, runStatusCanceled, "任务已取消"
	}
	if payloadStatus(frame) == 2 {
		message := responseErrorMessage(frame, output, "LLM 能力调用失败")
		_ = s.writeErrorResult(ctx, requestID, message)
		return aggregateText, runStatusFail, message
	}

	finalOutput := normalizeAgentFinalOutput(output, aggregateText)
	if strings.TrimSpace(frontstream.InputText(finalOutput["event"])) == "" {
		finalOutput["event"] = "final"
	}
	if strings.TrimSpace(frontstream.InputText(finalOutput["text"])) == "" && strings.TrimSpace(aggregateText) != "" {
		finalOutput["text"] = aggregateText
	}
	outputText := strings.TrimSpace(frontstream.InputText(finalOutput["text"]))
	if outputText == "" {
		outputText = strings.TrimSpace(aggregateText)
	}
	if cleanText, interaction, ok := extractInteraction(outputText); ok {
		outputText = cleanText
		finalOutput["event"] = "interaction"
		finalOutput["text"] = cleanText
		finalOutput["interaction"] = interaction
		_ = s.writeStreamOutput(ctx, requestID, map[string]any{
			"event":       "interaction",
			"text":        cleanText,
			"interaction": interaction,
		})
		if outputText == "" {
			outputText = jsonText(map[string]any{"interaction": interaction})
		}
	}
	if cleanText, action, ok := extractAgentAction(outputText); ok {
		return s.executePowerAction(ctx, exec, action, cleanText, gatewayLastID)
	}
	if cleanText, result, ok := extractAgentResult(outputText); ok {
		outputText = cleanText
		finalOutput = applyAgentResult(finalOutput, result, cleanText)
		outputText = strings.TrimSpace(frontstream.InputText(finalOutput["text"]))
	}
	_ = s.writeSuccessResult(ctx, requestID, finalOutput)
	return outputText, runStatusSuccess, ""
}

func (s Service) finishRun(ctx context.Context, exec runExecution, status string, output string, message string, stepCount int) {
	finishedAt := time.Now()
	s.repo.UpdateRun(ctx, exec.RunID, map[string]any{
		"status":      status,
		"output":      output,
		"error":       message,
		"step_count":  stepCount,
		"latency":     finishedAt.Sub(exec.StartedAt).Milliseconds(),
		"finished_at": finishedAt,
	})
}

func (s Service) writePayload(ctx context.Context, requestID string, payload map[string]any) error {
	_, err := s.streams.WritePayload(ctx, requestID, payload)
	return err
}

func (s Service) writeStreamOutput(ctx context.Context, requestID string, output map[string]any) error {
	return s.writePayload(ctx, requestID, streamPayload(requestID, output))
}

func (s Service) writeStreamStatus(ctx context.Context, requestID string, text string, meta map[string]any) error {
	output := map[string]any{
		"event": "status",
		"text":  text,
	}
	for key, value := range meta {
		output[key] = value
	}
	return s.writeStreamOutput(ctx, requestID, output)
}

func (s Service) writeErrorResult(ctx context.Context, requestID string, message string) error {
	return s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "result", map[string]any{}, message, 2))
}

func (s Service) writeSuccessResult(ctx context.Context, requestID string, output map[string]any) error {
	return s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "result", output, "", 1))
}

func (s Service) writeCancelResult(ctx context.Context, requestID string) error {
	return s.writeSuccessResult(ctx, requestID, cancelOutput())
}

func cancelOutput() map[string]any {
	return map[string]any{
		"event": "cancel",
		"text":  "任务已取消",
	}
}

func parseRunRequest(body map[string]any) (parsedRunRequest, error) {
	if body == nil {
		body = map[string]any{}
	}
	agentIdentity := firstText(body["agent"], body["agent_id"], body["agentId"])
	input := normalizeInput(body["input"])
	if len(input) == 0 {
		input = normalizeInput(firstText(body["text"], body["message"], body["prompt"]))
	}
	if len(input) == 0 || strings.TrimSpace(primaryInputText(input)) == "" {
		return parsedRunRequest{}, fmt.Errorf("任务输入不能为空")
	}

	history := normalizeHistory(body["history"])
	if len(history) == 0 {
		history = normalizeHistory(body["messages"])
	}

	return parsedRunRequest{
		AgentIdentity:  agentIdentity,
		Input:          input,
		History:        history,
		Options:        normalizeMap(body["options"]),
		SourceTargetID: uint64(frontstream.InputInt64(body["source_target_id"], 0)),
	}, nil
}

func buildEnergonBody(agent agentmodel.Agent, power energonmodel.Power, parsed parsedRunRequest, runtimeContext string) map[string]any {
	options := cloneMap(parsed.Options)
	options["stream"] = true
	if agent.Temperature >= 0 {
		options["temperature"] = agent.Temperature
	}

	body := map[string]any{
		"power": power.Key,
		"set": map[string]any{
			"id":   agent.Key,
			"role": runtimeContext,
		},
		"input":   parsed.Input,
		"history": parsed.History,
		"options": options,
	}
	if parsed.SourceTargetID > 0 {
		body["source_target_id"] = parsed.SourceTargetID
	}
	return body
}

func resolveRequestID(req RunRequest) string {
	for _, value := range []string{
		headerValue(req.Headers, "X-Request-Id"),
		headerValue(req.Headers, "X-Request-ID"),
	} {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return uuid.NewString()
}

func streamPayload(requestID string, output map[string]any) map[string]any {
	return frontstream.ResponsePayload(requestID, "stream", output, "", 1)
}

func normalizeProxyOutput(output map[string]any) map[string]any {
	next := cloneMap(output)
	if outputEvent(next) == "reasoning" {
		return map[string]any{}
	}
	delete(next, "reasoning")
	if outputEvent(next) == "start" {
		next["event"] = "status"
		if strings.TrimSpace(frontstream.InputText(next["text"])) == "" {
			next["text"] = "LLM 能力调用已开始"
		}
	}
	return next
}

func frameType(frame map[string]any) string {
	return energonservice.StreamFrameType(frame)
}

func frameOutput(frame map[string]any) map[string]any {
	return map[string]any(energonservice.StreamFrameOutput(frame))
}

func outputEvent(output map[string]any) string {
	return energonservice.StreamOutputEvent(botprotocol.Output(output))
}

func payloadStatus(payload map[string]any) int {
	return int(frontstream.InputInt64(payload["status"], 0))
}

func responseErrorMessage(payload map[string]any, output map[string]any, fallback string) string {
	for _, value := range []any{payload["msg"], output["error"], output["text"]} {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return fallback
}

func normalizeInput(value any) map[string]any {
	if mapped := normalizeMap(value); len(mapped) > 0 {
		return mapped
	}
	text := strings.TrimSpace(frontstream.InputText(value))
	if text == "" {
		return map[string]any{}
	}
	return map[string]any{"text": text}
}

func normalizeMap(value any) map[string]any {
	mapped, ok := value.(map[string]any)
	if !ok || mapped == nil {
		return map[string]any{}
	}
	return mapped
}

func normalizeHistory(value any) []any {
	if rows, ok := value.([]any); ok {
		return rows
	}
	return []any{}
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return ""
}

func primaryInputText(input map[string]any) string {
	if input == nil {
		return ""
	}
	if text := strings.TrimSpace(frontstream.InputText(input["text"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["prompt"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["message"])); text != "" {
		return text
	}
	return strings.TrimSpace(jsonText(input))
}

func cloneMap(source map[string]any) map[string]any {
	if source == nil {
		return map[string]any{}
	}
	next := make(map[string]any, len(source))
	for key, value := range source {
		next[key] = value
	}
	return next
}

func jsonText(value any) string {
	raw, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(raw)
}

func headerValue(headers map[string]string, key string) string {
	if headers == nil {
		return ""
	}
	if value := strings.TrimSpace(headers[key]); value != "" {
		return value
	}
	for currentKey, value := range headers {
		if strings.EqualFold(currentKey, key) {
			return strings.TrimSpace(value)
		}
	}
	return ""
}
