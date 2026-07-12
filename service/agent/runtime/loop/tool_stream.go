package loop

import (
	"context"
	"strconv"
	"strings"

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
	if resultErr != nil {
		content, _ := result.Content.(map[string]any)
		output := toolEventOutput(toolEventError, resultErr.Error(), "failed", call, definition, content)
		output["error"] = strings.TrimSpace(resultErr.Error())
		return output
	}
	var content map[string]any
	if strings.TrimSpace(definition.Kind) != "" {
		content, _ = result.Content.(map[string]any)
	}
	return toolEventOutput(
		toolEventResult,
		toolStatusText(definition, "succeeded"),
		"succeeded",
		call,
		definition,
		content,
	)
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
	meta["tool_kind"] = strings.TrimSpace(definition.Kind)
	meta["tool_status"] = status
	if count := toolRequestedCount(call); count > 1 {
		meta["tool_count"] = count
	}
	if ratio := toolRequestedRatio(call); ratio != "" {
		meta["tool_ratio"] = ratio
	}
	return meta
}

func toolRequestedCount(call botprotocol.ToolCall) int {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return 1
	}
	for _, key := range []string{"count", "n", "num", "quantity"} {
		value, exists := arguments[key]
		if !exists {
			continue
		}
		count, parseErr := strconv.ParseFloat(strings.TrimSpace(botprotocol.AsText(value)), 64)
		if parseErr == nil && count > 1 {
			return min(8, int(count))
		}
	}
	return 1
}

func toolRequestedRatio(call botprotocol.ToolCall) string {
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return ""
	}
	for _, key := range []string{"aspectRatio", "aspect_ratio", "ratio"} {
		if value := strings.TrimSpace(botprotocol.AsText(arguments[key])); value != "" {
			return value
		}
	}
	return ""
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
	label := botprotocol.MediaOutputLabel(definition.Kind)
	if status == "succeeded" {
		return label + "生成完成"
	}
	return label + "生成中，请稍后"
}

func toolTitle(definition runtimeprovider.Definition, fallback string) string {
	if title := strings.TrimSpace(definition.Title); title != "" {
		return title
	}
	return strings.TrimSpace(fallback)
}
