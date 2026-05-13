package agent

import (
	"context"
	"strings"
	"time"

	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	frontstream "my/package/front/service/stream"
)

func (s Service) executePowerAction(ctx context.Context, exec runExecution, action agentAction, intro string, gatewayLastID string) (string, string, string) {
	powerKey, err := s.repo.ResolvePowerKey(ctx, action.Power)
	if err != nil {
		message := err.Error()
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return "", runStatusFail, message
	}
	action.Power = powerKey
	action = normalizePowerActionWithInteraction(exec.Parsed, action)
	var missingParams []energonservice.TestParam
	action, missingParams, err = s.preparePowerAction(ctx, action)
	if err != nil {
		message := err.Error()
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return "", runStatusFail, message
	}
	if len(missingParams) > 0 {
		return s.finishPowerParamsInteraction(ctx, exec, action, intro, missingParams)
	}

	_ = s.writeStreamStatus(ctx, exec.RequestID, "正在调用能力: "+action.Power, map[string]any{
		"meta": map[string]any{
			"action": "call_power",
			"power":  action.Power,
		},
	})

	body := buildPowerActionBody(action, exec.Parsed.History)
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
		message := responseErrorMessage(startPayload, nil, "调用能力失败: "+action.Power)
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return "", runStatusFail, message
	}
	if frameType(startPayload) == "result" {
		output := normalizePowerActionFinal(frameOutput(startPayload), action, intro)
		_ = s.writeSuccessResult(ctx, exec.RequestID, output)
		return outputSummaryText(output), runStatusSuccess, ""
	}

	return s.collectPowerActionStream(ctx, exec, action, intro, gatewayLastID)
}

func (s Service) preparePowerAction(ctx context.Context, action agentAction) (agentAction, []energonservice.TestParam, error) {
	config, err := s.gateway.TestParamConfig(ctx, action.Power, action.SourceTargetID)
	if err != nil {
		return action, nil, err
	}
	if action.SourceTargetID == 0 {
		action.SourceTargetID = config.SelectedTargetID
	}
	action.Input = normalizePowerActionInputAliases(action.Input, config.Params)
	return action, missingPowerActionParams(config.Params, action.Input), nil
}

func (s Service) finishPowerParamsInteraction(ctx context.Context, exec runExecution, action agentAction, intro string, missingParams []energonservice.TestParam) (string, string, string) {
	text := strings.TrimSpace(intro)
	if text == "" {
		text = "调用能力前还需要补充参数：" + powerParamNames(missingParams)
	}
	interaction := map[string]any{
		"id":          "power-params-" + action.Power,
		"type":        "power_params",
		"power":       action.Power,
		"title":       "补充能力参数",
		"description": "缺少 " + powerParamNames(missingParams) + "，提交后我会继续调用能力。",
		"values":      action.Input,
	}
	output := map[string]any{
		"event":       "interaction",
		"text":        text,
		"interaction": interaction,
	}
	_ = s.writeStreamOutput(ctx, exec.RequestID, output)
	_ = s.writeSuccessResult(ctx, exec.RequestID, output)
	return text, runStatusSuccess, ""
}

func buildPowerActionBody(action agentAction, history []any) map[string]any {
	options := cloneMap(action.Options)
	options["stream"] = true

	body := map[string]any{
		"power":   action.Power,
		"input":   action.Input,
		"history": history,
		"options": options,
	}
	if strings.TrimSpace(action.Protocol) != "" {
		body["protocol"] = action.Protocol
	}
	if strings.TrimSpace(action.Kind) != "" {
		body["kind"] = action.Kind
	}
	if action.SourceTargetID > 0 {
		body["source_target_id"] = action.SourceTargetID
	}
	return body
}

func normalizePowerActionWithInteraction(parsed parsedRunRequest, action agentAction) agentAction {
	mergedInput := mergePowerActionInput(latestInteractionData(parsed), action.Input)
	if action.SourceTargetID == 0 {
		action.SourceTargetID = sourceTargetIDFromInput(mergedInput)
	}
	if action.SourceTargetID == 0 {
		action.SourceTargetID = parsed.SourceTargetID
	}
	action.Input = stripPowerActionControlInput(mergedInput)
	return action
}

func latestInteractionData(parsed parsedRunRequest) map[string]any {
	if isInteractionResult(parsed.Input) {
		if data := normalizeMap(parsed.Input["data"]); len(data) > 0 {
			return data
		}
	}
	for index := len(parsed.History) - 1; index >= 0; index-- {
		row := normalizeMap(parsed.History[index])
		if len(row) == 0 {
			continue
		}
		if isInteractionResult(row) {
			if data := normalizeMap(row["data"]); len(data) > 0 {
				return data
			}
		}
		if data := normalizeMap(row["interaction_data"]); len(data) > 0 {
			return data
		}
	}
	return map[string]any{}
}

func isInteractionResult(value map[string]any) bool {
	if len(value) == 0 {
		return false
	}
	kind := strings.ToLower(strings.TrimSpace(firstText(value["type"], value["kind"])))
	return kind == "interaction_result"
}

func mergePowerActionInput(base map[string]any, override map[string]any) map[string]any {
	result := cloneMap(base)
	for key, value := range override {
		if powerActionInputValueMissing(value) {
			continue
		}
		result[key] = value
	}
	return result
}

func powerActionInputValueMissing(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case []any:
		return len(current) == 0
	case []string:
		return len(current) == 0
	case map[string]any:
		return len(current) == 0
	default:
		return false
	}
}

func sourceTargetIDFromInput(input map[string]any) uint64 {
	for _, key := range []string{"source_target_id", "sourceTargetId", "power_target_id", "powerTargetId", "target_id", "targetId"} {
		if id := uint64(frontstream.InputInt64(input[key], 0)); id > 0 {
			return id
		}
	}
	return 0
}

func stripPowerActionControlInput(input map[string]any) map[string]any {
	if len(input) == 0 {
		return map[string]any{}
	}
	result := cloneMap(input)
	for _, key := range []string{"source_target_id", "sourceTargetId", "power_target_id", "powerTargetId", "target_id", "targetId"} {
		delete(result, key)
	}
	return result
}

func normalizePowerActionInputAliases(input map[string]any, params []energonservice.TestParam) map[string]any {
	result := cloneMap(input)
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" || hasPowerActionParamValue(result, param) {
			continue
		}
		for _, alias := range powerActionParamAliases(param) {
			value, exists := result[alias]
			if exists && !powerActionInputValueMissing(value) {
				result[key] = value
				break
			}
		}
	}
	return result
}

func missingPowerActionParams(params []energonservice.TestParam, input map[string]any) []energonservice.TestParam {
	missing := make([]energonservice.TestParam, 0)
	for _, param := range params {
		if !param.Required {
			continue
		}
		if strings.TrimSpace(param.DefaultValue) != "" {
			continue
		}
		if hasPowerActionParamValue(input, param) {
			continue
		}
		missing = append(missing, param)
	}
	return missing
}

func hasPowerActionParamValue(input map[string]any, param energonservice.TestParam) bool {
	for _, key := range powerActionParamLookupKeys(param) {
		value, exists := input[key]
		if exists && !powerActionInputValueMissing(value) {
			return true
		}
	}
	return false
}

func powerActionParamLookupKeys(param energonservice.TestParam) []string {
	keys := make([]string, 0, 6)
	keys = appendNonEmptyActionKey(keys, param.Key)
	keys = appendNonEmptyActionKey(keys, param.Name)
	keys = append(keys, powerActionParamAliases(param)...)
	return keys
}

func powerActionParamAliases(param energonservice.TestParam) []string {
	key := strings.TrimSpace(param.Key)
	name := strings.TrimSpace(param.Name)
	aliases := make([]string, 0, 4)
	switch key {
	case "text":
		aliases = append(aliases, "prompt", "message")
	case "aspectRatio":
		aliases = append(aliases, "ratio", "aspect_ratio")
	}
	switch name {
	case "提示词":
		aliases = append(aliases, "prompt", "message")
	case "比例":
		aliases = append(aliases, "ratio", "aspect_ratio")
	case "分辨率":
		aliases = append(aliases, "resolution")
	}
	return aliases
}

func appendNonEmptyActionKey(keys []string, value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return keys
	}
	for _, key := range keys {
		if key == value {
			return keys
		}
	}
	return append(keys, value)
}

func powerParamNames(params []energonservice.TestParam) string {
	names := make([]string, 0, len(params))
	for _, param := range params {
		name := strings.TrimSpace(param.Name)
		if name == "" {
			name = strings.TrimSpace(param.Key)
		}
		if name != "" {
			names = append(names, name)
		}
	}
	return strings.Join(names, "、")
}

func (s Service) collectPowerActionStream(ctx context.Context, exec runExecution, action agentAction, intro string, gatewayLastID string) (string, string, string) {
	lastID := strings.TrimSpace(gatewayLastID)
	if lastID == "" {
		lastID = "0-0"
	}
	outputs := make([]botprotocol.Output, 0)

	for {
		select {
		case <-ctx.Done():
			_ = s.gateway.StopStream(context.Background(), exec.RequestID)
			message := "能力调用超时"
			_ = s.writeErrorResult(context.Background(), exec.RequestID, message)
			return "", runStatusFail, message
		default:
		}

		entries, err := s.gateway.ReadStream(ctx, exec.RequestID, lastID, 1, time.Duration(defaultAgentStreamBlockMs)*time.Millisecond)
		if err != nil {
			message := err.Error()
			_ = s.writeErrorResult(context.Background(), exec.RequestID, message)
			return "", runStatusFail, message
		}
		if len(entries) == 0 {
			continue
		}

		for _, entry := range entries {
			lastID = entry.ID
			frame := entry.Payload
			output := frameOutput(frame)
			if len(output) > 0 {
				outputs = append(outputs, botprotocol.Output(output))
			}
			if frameType(frame) == "result" {
				if payloadStatus(frame) == 2 {
					message := responseErrorMessage(frame, output, "能力调用失败: "+action.Power)
					_ = s.writeErrorResult(ctx, exec.RequestID, message)
					return "", runStatusFail, message
				}
				finalOutput := frameOutput(frame)
				if len(finalOutput) == 0 {
					finalOutput = map[string]any(botprotocol.MergeStreamResult(outputs))
				}
				finalOutput = normalizePowerActionFinal(finalOutput, action, intro)
				_ = s.writeSuccessResult(ctx, exec.RequestID, finalOutput)
				return outputSummaryText(finalOutput), runStatusSuccess, ""
			}
			if len(output) > 0 {
				_ = s.writeStreamOutput(ctx, exec.RequestID, normalizePowerActionStreamOutput(output, action))
			}
		}
	}
}

func normalizePowerActionStreamOutput(output map[string]any, action agentAction) map[string]any {
	next := cloneMap(output)
	if strings.TrimSpace(frontstream.InputText(next["event"])) == "" {
		next["event"] = "status"
	}
	return withPowerActionMeta(next, action.Power)
}

func normalizePowerActionFinal(output map[string]any, action agentAction, intro string) map[string]any {
	next := normalizeToolResultOutput(output, action.Power)
	next["event"] = "final"
	if suggestions := normalizeAgentSuggestions(next["suggestions"]); len(suggestions) == 0 && len(action.Suggestions) > 0 {
		next["suggestions"] = action.Suggestions
	}
	if strings.TrimSpace(intro) != "" {
		currentText := strings.TrimSpace(frontstream.InputText(next["text"]))
		if currentText == "" {
			next["text"] = intro
		} else {
			next["text"] = strings.TrimSpace(intro) + "\n\n" + currentText
		}
	}
	if strings.TrimSpace(frontstream.InputText(next["title"])) == "" {
		next["title"] = "能力调用结果"
	}
	return withPowerActionMeta(next, action.Power)
}

func withPowerActionMeta(output map[string]any, power string) map[string]any {
	if meta, ok := output["meta"].(map[string]any); ok {
		meta["action"] = "call_power"
		meta["power"] = power
		return output
	}
	output["meta"] = map[string]any{
		"action": "call_power",
		"power":  power,
	}
	return output
}

func outputSummaryText(output map[string]any) string {
	if text := strings.TrimSpace(frontstream.InputText(output["text"])); text != "" {
		return text
	}
	for _, key := range []string{"images", "videos", "audios", "files"} {
		if values := botprotocol.NormalizeStringList(output[key]); len(values) > 0 {
			return jsonText(map[string]any{key: values})
		}
	}
	return jsonText(output)
}
