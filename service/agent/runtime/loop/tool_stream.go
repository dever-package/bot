package loop

import (
	"context"
	"errors"
	"strconv"
	"strings"

	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	toolEventStart    = "tool_start"
	toolEventProgress = "tool_progress"
	toolEventResult   = "tool_result"
	toolEventError    = "tool_error"
)

var toolDisplayFields = []string{"title", "rich", "artifacts", "images", "videos", "audios", "files"}

func (s Service) writeToolStarted(ctx context.Context, execution execution, call botprotocol.ToolCall, definition runtimeprovider.Definition, source map[string]any) error {
	return s.writeExecutionOutput(ctx, execution, toolStartedOutput(call, definition, source))
}

func toolStartedOutput(call botprotocol.ToolCall, definition runtimeprovider.Definition, sources ...map[string]any) map[string]any {
	var source map[string]any
	if len(sources) > 0 {
		source = sources[0]
	}
	return toolEventOutput(
		toolEventStart,
		toolStatusText(definition, "running"),
		"running",
		call,
		definition,
		source,
	)
}

func (s Service) writeToolProgress(ctx context.Context, execution execution, call botprotocol.ToolCall, definition runtimeprovider.Definition, current map[string]any) error {
	if !isVisibleToolProgress(current) {
		return nil
	}
	text := strings.TrimSpace(botprotocol.AsText(current["text"]))
	if text == "" {
		text = toolStatusText(definition, "running")
	}
	return s.writeExecutionOutput(ctx, execution, toolEventOutput(
		toolEventProgress,
		text,
		"running",
		call,
		definition,
		current,
	))
}

func (s Service) writeToolFinished(ctx context.Context, execution execution, call botprotocol.ToolCall, definition runtimeprovider.Definition, result runtimeprovider.Result, resultErr error) error {
	return s.writeExecutionOutput(ctx, execution, toolFinishedOutput(call, definition, result, resultErr))
}

func toolFinishedOutput(call botprotocol.ToolCall, definition runtimeprovider.Definition, result runtimeprovider.Result, resultErr error) map[string]any {
	activityMetadata := toolResultActivityMetadata(result, resultErr)
	if resultErr != nil {
		content, _ := result.Content.(map[string]any)
		content = toolActivitySource(content, activityMetadata)
		message := toolFailureText(definition, resultErr)
		output := toolEventOutput(toolEventError, message, "failed", call, definition, content)
		output["error"] = message
		return output
	}
	if result.IsBlocked() {
		content, _ := result.Content.(map[string]any)
		content = toolActivitySource(content, activityMetadata)
		message := strings.TrimSpace(result.Text)
		if message == "" {
			message = toolTitle(definition, call.Name) + "需要补充配置"
		}
		output := toolEventOutput(toolEventError, message, "blocked", call, definition, content)
		output["error"] = message
		output["outcome"] = runtimeprovider.ResultOutcomeBlocked
		output["outcome_code"] = result.OutcomeCode
		return output
	}
	var content map[string]any
	if strings.TrimSpace(definition.Kind) != "" && !isCompactToolActivity(definition.Kind) {
		content, _ = result.Content.(map[string]any)
	}
	content = toolActivitySource(content, activityMetadata)
	text := toolStatusText(definition, "succeeded")
	if strings.EqualFold(strings.TrimSpace(definition.Kind), "knowledge") && strings.TrimSpace(result.Text) != "" {
		text = strings.TrimSpace(result.Text)
	}
	if strings.EqualFold(strings.TrimSpace(definition.Kind), "skill") && len(activityMetadata) > 0 {
		text = botprotocol.AsText(activityMetadata["skill_name"]) + " · " + botprotocol.AsText(activityMetadata["skill_action"]) + "完成"
	}
	return toolEventOutput(
		toolEventResult,
		text,
		"succeeded",
		call,
		definition,
		content,
	)
}

func toolResultActivityMetadata(result runtimeprovider.Result, resultErr error) map[string]any {
	var activityErr *runtimeprovider.SkillActivityError
	if errors.As(resultErr, &activityErr) {
		return activityErr.Metadata
	}
	metadata, _ := result.Presentation["meta"].(map[string]any)
	return metadata
}

func toolActivitySource(source map[string]any, metadata map[string]any) map[string]any {
	if len(metadata) == 0 {
		return source
	}
	result := make(map[string]any, len(source)+1)
	for key, value := range source {
		result[key] = value
	}
	result["meta"] = metadata
	return result
}

func toolQueuedOutput(call botprotocol.ToolCall, definition runtimeprovider.Definition, content map[string]any) map[string]any {
	return toolEventOutput(
		toolEventResult,
		botprotocol.MediaOutputLabel(definition.Kind)+"已提交后台生成",
		"running",
		call,
		definition,
		content,
	)
}

func toolFailureText(definition runtimeprovider.Definition, resultErr error) string {
	if resultErr == nil {
		return ""
	}
	detail := strings.TrimSpace(resultErr.Error())
	if detail == "生成已停止" {
		return detail
	}
	var inputErr *runtimeprovider.MediaToolInputError
	if errors.As(resultErr, &inputErr) {
		return detail
	}
	return runtimeartifact.FailureMessage(definition.Kind, detail)
}

func toolErrorModelContent(definition runtimeprovider.Definition, resultErr error) string {
	message := toolFailureText(definition, resultErr)
	var responseErr *runtimeprovider.HTTPStatusError
	if !errors.As(resultErr, &responseErr) {
		return toolErrorContent(message)
	}
	return encodeJSON(map[string]any{
		"error": message, "result": responseErr.ModelResult(),
	}, `{"error":"工具调用失败"}`)
}

func toolEventOutput(event string, text string, status string, call botprotocol.ToolCall, definition runtimeprovider.Definition, source map[string]any) map[string]any {
	output := map[string]any{
		"event": event,
		"text":  strings.TrimSpace(text),
		"meta":  toolEventMeta(call, definition, status, source),
	}
	if value := source["progress"]; value != nil {
		output["progress"] = value
	}
	for _, key := range toolDisplayFields {
		if value := source[key]; value != nil {
			output[key] = value
		}
	}
	return output
}

func toolEventMeta(call botprotocol.ToolCall, definition runtimeprovider.Definition, status string, source map[string]any) map[string]any {
	meta := map[string]any{}
	if current, ok := source["meta"].(map[string]any); ok {
		for key, value := range current {
			meta[key] = value
		}
	}
	meta["tool_call_id"] = strings.TrimSpace(call.ID)
	meta["tool_name"] = strings.TrimSpace(call.Name)
	meta["tool_title"] = toolTitle(definition, call.Name)
	if strings.EqualFold(strings.TrimSpace(definition.Kind), "skill") {
		name := strings.TrimSpace(botprotocol.AsText(meta["skill_name"]))
		action := strings.TrimSpace(botprotocol.AsText(meta["skill_action"]))
		if name != "" && action != "" {
			meta["tool_title"] = name + " · " + action
		}
	}
	meta["tool_kind"] = strings.TrimSpace(definition.Kind)
	meta["tool_status"] = status
	if count := toolRequestedCount(call, definition); count > 1 {
		meta["tool_count"] = count
	}
	if params := toolActivityParameterValues(call, definition); len(params) > 0 {
		meta["tool_params"] = params
	}
	return meta
}

func toolRequestedCount(call botprotocol.ToolCall, definition runtimeprovider.Definition) int {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return 1
	}
	return toolRequestedCountArguments(arguments, definition)
}

func toolRequestedCountArguments(arguments map[string]any, definition runtimeprovider.Definition) int {
	key := strings.TrimSpace(definition.ActivityCountKey)
	if key == "" {
		return 1
	}
	count, parseErr := strconv.ParseFloat(strings.TrimSpace(botprotocol.AsText(arguments[key])), 64)
	if parseErr == nil && count > 1 {
		return min(runtimeprovider.MaxMediaExecutionCount, int(count))
	}
	return 1
}

func toolActivityParameterValues(call botprotocol.ToolCall, definition runtimeprovider.Definition) map[string]any {
	if len(definition.ActivityParameterKeys) == 0 {
		return nil
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return nil
	}
	result := map[string]any{}
	for _, key := range definition.ActivityParameterKeys {
		if value, exists := arguments[key]; exists && value != nil {
			result[key] = value
		}
	}
	return result
}

func isVisibleToolProgress(output map[string]any) bool {
	if len(output) == 0 {
		return false
	}
	switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(output["event"]))) {
	case "status", "progress", "warning":
		return true
	}
	if output["progress"] != nil || botprotocol.HasMediaOutput(botprotocol.Output(output)) {
		return true
	}
	return output["rich"] != nil
}

func toolStatusText(definition runtimeprovider.Definition, status string) string {
	kind := strings.ToLower(strings.TrimSpace(definition.Kind))
	if kind == "knowledge" {
		if status == "succeeded" {
			return "知识库读取完成"
		}
		return "正在读取知识库"
	}
	if kind == "skill" {
		title := toolTitle(definition, "技能调用")
		if status == "succeeded" {
			return title + "完成"
		}
		return title + "中"
	}
	if isGeneratedMediaKind(kind) {
		label := botprotocol.MediaOutputLabel(kind)
		if status == "succeeded" {
			return label + "生成完成"
		}
		return label + "生成中，请稍后"
	}
	powerTool := strings.HasPrefix(strings.ToLower(strings.TrimSpace(definition.Name)), "power_")
	fallback := "工具"
	if powerTool {
		fallback = "能力"
	}
	label := toolTitle(definition, fallback)
	if powerTool && !strings.HasSuffix(label, "能力") {
		label += "能力"
	}
	if status == "succeeded" {
		return label + "调用完成"
	}
	return label + "调用中"
}

func isGeneratedMediaKind(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image", "video", "audio", "file":
		return true
	default:
		return false
	}
}

func isCompactToolActivity(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "knowledge", "skill":
		return true
	default:
		return false
	}
}

func toolTitle(definition runtimeprovider.Definition, fallback string) string {
	if title := strings.TrimSpace(definition.Title); title != "" {
		return title
	}
	return strings.TrimSpace(fallback)
}
