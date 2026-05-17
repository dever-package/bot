package action

import (
	"context"
	"strings"
	"time"

	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	botstream "my/package/bot/service/energon/stream"
	frontstream "my/package/front/service/stream"
)

const (
	ResultDone        = "done"
	ResultInteraction = "interaction"
	ResultCanceled    = "canceled"
	ResultError       = "error"
)

type ExecuteRequest struct {
	RequestID      string
	Method         string
	Host           string
	Path           string
	Headers        map[string]string
	Input          map[string]any
	History        []any
	SourceTargetID uint64
	Gateway        energonservice.GatewayService
	ResolvePower   func(ctx context.Context, identity string) (string, error)
	WriteStatus    func(ctx context.Context, text string, meta map[string]any) error
	WriteOutput    func(ctx context.Context, output map[string]any) error
	StreamBlock    time.Duration
}

type Result struct {
	Kind        string
	Action      Action
	Text        string
	Output      map[string]any
	Interaction map[string]any
	LastID      string
	Message     string
}

func ExecutePower(ctx context.Context, req ExecuteRequest, action Action, intro string, gatewayLastID string) Result {
	if req.ResolvePower == nil {
		return actionError(action, "能力解析器未配置")
	}

	powerKey, err := req.ResolvePower(ctx, action.Power)
	if err != nil {
		return actionError(action, err.Error())
	}
	action.Power = powerKey
	action = normalizeWithInteraction(req, action)

	var missingParams []energonservice.PowerParam
	action, missingParams, err = prepare(ctx, req.Gateway, action)
	if err != nil {
		return actionError(action, err.Error())
	}
	if len(missingParams) > 0 {
		return buildParamsInteraction(action, intro, missingParams)
	}

	writeStatus(req, ctx, "正在调用能力: "+action.Power, map[string]any{
		"meta": map[string]any{
			"action": "call_power",
			"power":  action.Power,
		},
	})

	start := req.Gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: req.RequestID,
		Method:    req.Method,
		Host:      req.Host,
		Path:      req.Path,
		Headers:   req.Headers,
		Body:      buildBody(action),
	})
	startPayload := start.Payload()
	if int(frontstream.InputInt64(startPayload["status"], 0)) == 2 {
		message := responseErrorMessage(startPayload, nil, "调用能力失败: "+action.Power)
		return actionError(action, message)
	}
	if botstream.FrameType(startPayload) == "result" {
		output := normalizeFinal(map[string]any(botstream.FrameOutput(startPayload)), action, intro)
		return actionDone(action, output, gatewayLastID)
	}

	return collectStream(ctx, req, action, intro, gatewayLastID)
}

func ActionFromInteractionResult(input map[string]any, history []any, sourceTargetID uint64) (Action, bool) {
	if !isInteractionResult(input) {
		return Action{}, false
	}
	interactionType := strings.ToLower(strings.TrimSpace(firstText(input["interaction_type"], input["interactionType"])))
	if interactionType != "" && interactionType != "power_params" {
		return Action{}, false
	}
	interaction := currentPowerParamsInteraction(input, history)
	power := strings.TrimSpace(firstText(interaction["power"]))
	if power == "" {
		return Action{}, false
	}

	submittedData := latestInteractionData(input)
	interactionValues := normalizeMap(interaction["values"])
	mergedInput := mergeInput(interactionValues, submittedData)
	targetID := sourceTargetIDFromInput(mergedInput)
	if targetID == 0 {
		targetID = sourceTargetID
	}
	return Action{
		Type:           "call_power",
		Power:          power,
		Input:          stripControlInput(mergedInput),
		SourceTargetID: targetID,
	}, true
}

func AppendHistoryObservation(history []any, result Result) []any {
	observation := map[string]any{
		"role":   "user",
		"type":   "tool_observation",
		"power":  result.Action.Power,
		"text":   observationText(result),
		"output": result.Output,
	}
	if result.Action.SourceTargetID > 0 {
		observation["source_target_id"] = result.Action.SourceTargetID
	}
	return append(append([]any{}, history...), observation)
}

func SummaryText(output map[string]any) string {
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

func prepare(ctx context.Context, gateway energonservice.GatewayService, action Action) (Action, []energonservice.PowerParam, error) {
	config, err := gateway.PowerParamConfig(ctx, action.Power, action.SourceTargetID)
	if err != nil {
		return action, nil, err
	}
	if action.SourceTargetID == 0 {
		action.SourceTargetID = config.SelectedTargetID
	}
	action.Input = normalizeInputAliases(action.Input, config.Params)
	return action, missingParams(config.Params, action.Input), nil
}

func buildParamsInteraction(action Action, intro string, missing []energonservice.PowerParam) Result {
	text := strings.TrimSpace(intro)
	if text == "" {
		text = "调用能力前还需要补充参数：" + paramNames(missing)
	}
	interaction := map[string]any{
		"id":          "power-params-" + action.Power,
		"type":        "power_params",
		"power":       action.Power,
		"title":       "补充能力参数",
		"description": "缺少 " + paramNames(missing) + "，提交后我会继续调用能力。",
		"values":      action.Input,
	}
	output := map[string]any{
		"event":       "interaction",
		"text":        text,
		"interaction": interaction,
	}
	return Result{
		Kind:        ResultInteraction,
		Action:      action,
		Text:        text,
		Output:      output,
		Interaction: interaction,
	}
}

func buildBody(action Action) map[string]any {
	options := cloneMap(action.Options)
	options["stream"] = true

	body := map[string]any{
		"power":   action.Power,
		"input":   action.Input,
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

func normalizeWithInteraction(req ExecuteRequest, action Action) Action {
	mergedInput := mergeInput(latestInteractionData(req.Input), action.Input)
	if action.SourceTargetID == 0 {
		action.SourceTargetID = sourceTargetIDFromInput(mergedInput)
	}
	if action.SourceTargetID == 0 {
		action.SourceTargetID = req.SourceTargetID
	}
	action.Input = stripControlInput(mergedInput)
	return action
}

func currentPowerParamsInteraction(input map[string]any, history []any) map[string]any {
	if interaction := normalizeMap(input["interaction"]); isPowerParamsInteraction(interaction) {
		return interaction
	}

	interactionID := strings.TrimSpace(firstText(input["interaction_id"], input["interactionId"]))
	for index := len(history) - 1; index >= 0; index-- {
		row := normalizeMap(history[index])
		if len(row) == 0 {
			continue
		}
		interaction := normalizeMap(row["interaction"])
		if !isPowerParamsInteraction(interaction) {
			continue
		}
		if interactionID == "" || strings.TrimSpace(firstText(interaction["id"])) == interactionID {
			return interaction
		}
	}
	return map[string]any{}
}

func isPowerParamsInteraction(interaction map[string]any) bool {
	if len(interaction) == 0 {
		return false
	}
	interactionType := strings.ToLower(strings.TrimSpace(firstText(interaction["type"])))
	return interactionType == "power_params" && strings.TrimSpace(firstText(interaction["power"])) != ""
}

func latestInteractionData(input map[string]any) map[string]any {
	if isInteractionResult(input) {
		if data := normalizeMap(input["data"]); len(data) > 0 {
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

func mergeInput(base map[string]any, override map[string]any) map[string]any {
	result := cloneMap(base)
	for key, value := range override {
		if inputValueMissing(value) {
			continue
		}
		result[key] = value
	}
	return result
}

func inputValueMissing(value any) bool {
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

func stripControlInput(input map[string]any) map[string]any {
	if len(input) == 0 {
		return map[string]any{}
	}
	result := cloneMap(input)
	for _, key := range []string{"source_target_id", "sourceTargetId", "power_target_id", "powerTargetId", "target_id", "targetId"} {
		delete(result, key)
	}
	return result
}

func normalizeInputAliases(input map[string]any, params []energonservice.PowerParam) map[string]any {
	result := cloneMap(input)
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" || hasParamValue(result, param) {
			continue
		}
		for _, alias := range paramAliases(param) {
			value, exists := result[alias]
			if exists && !inputValueMissing(value) {
				result[key] = value
				break
			}
		}
	}
	return result
}

func missingParams(params []energonservice.PowerParam, input map[string]any) []energonservice.PowerParam {
	missing := make([]energonservice.PowerParam, 0)
	for _, param := range params {
		if !param.Required {
			continue
		}
		if strings.TrimSpace(param.DefaultValue) != "" {
			continue
		}
		if hasParamValue(input, param) {
			continue
		}
		missing = append(missing, param)
	}
	return missing
}

func hasParamValue(input map[string]any, param energonservice.PowerParam) bool {
	for _, key := range paramLookupKeys(param) {
		value, exists := input[key]
		if exists && !inputValueMissing(value) {
			return true
		}
	}
	return false
}

func paramLookupKeys(param energonservice.PowerParam) []string {
	keys := make([]string, 0, 6)
	keys = appendNonEmptyKey(keys, param.Key)
	keys = appendNonEmptyKey(keys, param.Name)
	keys = append(keys, paramAliases(param)...)
	return keys
}

func paramAliases(param energonservice.PowerParam) []string {
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

func appendNonEmptyKey(keys []string, value string) []string {
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

func paramNames(params []energonservice.PowerParam) string {
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

func collectStream(ctx context.Context, req ExecuteRequest, action Action, intro string, gatewayLastID string) Result {
	block := req.StreamBlock
	if block <= 0 {
		block = time.Second
	}

	result := req.Gateway.CollectStream(ctx, botstream.CollectOptions{
		RequestID:      req.RequestID,
		InitialLastID:  gatewayLastID,
		Block:          block,
		CollectOutputs: true,
		OnOutput: func(ctx context.Context, output botprotocol.Output) error {
			return writeOutput(req, ctx, withMeta(normalizeGatewayOutput(map[string]any(output)), action.Power))
		},
	})
	if result.Err != nil {
		message := result.Err.Error()
		if result.Timeout {
			message = "能力调用超时"
		}
		return actionError(action, message)
	}

	output := map[string]any(botstream.FrameOutput(result.Frame))
	if botstream.OutputEvent(botprotocol.Output(output)) == "cancel" {
		return Result{Kind: ResultCanceled, Action: action, Message: "任务已取消"}
	}
	if int(frontstream.InputInt64(result.Frame["status"], 0)) == 2 {
		return actionError(action, responseErrorMessage(result.Frame, output, "能力调用失败: "+action.Power))
	}
	finalOutput := map[string]any(botstream.FrameOutput(result.Frame))
	if len(finalOutput) == 0 {
		finalOutput = map[string]any(botprotocol.MergeStreamResult(result.State.Outputs))
	}
	finalOutput = normalizeFinal(finalOutput, action, intro)
	return actionDone(action, finalOutput, result.State.LastID)
}

func normalizeFinal(output map[string]any, action Action, intro string) map[string]any {
	next := NormalizeToolResultOutput(output, action.Power)
	next["event"] = "final"
	if suggestions := NormalizeSuggestions(next["suggestions"]); len(suggestions) == 0 && len(action.Suggestions) > 0 {
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
	return withMeta(next, action.Power)
}

func withMeta(output map[string]any, power string) map[string]any {
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

func observationText(result Result) string {
	if text := strings.TrimSpace(SummaryText(result.Output)); text != "" {
		return text
	}
	if result.Action.Power != "" {
		return "能力 " + result.Action.Power + " 已完成。"
	}
	return "能力调用已完成。"
}

func actionDone(action Action, output map[string]any, lastID string) Result {
	return Result{
		Kind:   ResultDone,
		Action: action,
		Text:   SummaryText(output),
		Output: output,
		LastID: lastID,
	}
}

func actionError(action Action, message string) Result {
	return Result{
		Kind:    ResultError,
		Action:  action,
		Message: message,
	}
}

func writeStatus(req ExecuteRequest, ctx context.Context, text string, meta map[string]any) {
	if req.WriteStatus != nil {
		_ = req.WriteStatus(ctx, text, meta)
	}
}

func writeOutput(req ExecuteRequest, ctx context.Context, output map[string]any) error {
	if req.WriteOutput == nil {
		return nil
	}
	return req.WriteOutput(ctx, output)
}

func responseErrorMessage(payload map[string]any, output map[string]any, fallback string) string {
	if output == nil {
		output = map[string]any{}
	}
	for _, item := range []any{payload["msg"], output["error"], output["text"]} {
		if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
			return text
		}
	}
	return fallback
}

func normalizeGatewayOutput(output map[string]any) map[string]any {
	next := cloneMap(output)
	if botstream.OutputEvent(botprotocol.Output(next)) == "" {
		next["event"] = "status"
	}
	return next
}
