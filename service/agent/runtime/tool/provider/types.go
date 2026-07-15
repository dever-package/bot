package provider

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const maxModelResultRunes = 24000

type Definition struct {
	Name                  string
	Title                 string
	Kind                  string
	Description           string
	Parameters            map[string]any
	ActivityParameterKeys []string
	ActivityCountKey      string
	ActivityPromptKey     string
}

func (definition Definition) Native() map[string]any {
	return botprotocol.FunctionToolDefinition(
		definition.Name,
		definition.Description,
		definition.Parameters,
		false,
	)
}

type Call struct {
	ID        string
	Name      string
	RequestID string
	Arguments map[string]any
	OnOutput  OutputHandler
}

type OutputHandler func(map[string]any) error

type Result struct {
	Text         string
	Content      any
	ModelResult  any
	Interaction  map[string]any
	Presentation map[string]any
	Terminal     bool
	Tools        []Tool
}

func (result Result) ModelContent() string {
	payload := map[string]any{}
	if text := strings.TrimSpace(result.Text); text != "" {
		payload["text"] = text
	}
	modelResult := result.Content
	if result.ModelResult != nil {
		modelResult = result.ModelResult
	}
	if modelResult != nil {
		payload["result"] = modelResult
	}
	if len(result.Interaction) > 0 {
		payload["interaction"] = result.Interaction
	}
	for key, value := range result.Presentation {
		payload[key] = value
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return `{"error":"工具结果无法序列化"}`
	}
	runes := []rune(string(raw))
	if len(runes) <= maxModelResultRunes {
		return string(raw)
	}
	preview, _ := json.Marshal(map[string]any{
		"truncated": true,
		"preview":   string(runes[:maxModelResultRunes]),
	})
	return string(preview)
}

func (result Result) Output() map[string]any {
	output := map[string]any{
		"event": "tool_result",
		"text":  strings.TrimSpace(result.Text),
	}
	if result.Content != nil {
		output["result"] = result.Content
	}
	if len(result.Interaction) > 0 {
		output["event"] = "interaction"
		output["interaction"] = result.Interaction
	} else if result.Terminal {
		output["event"] = "final"
	}
	for key, value := range result.Presentation {
		output[key] = value
	}
	return output
}

type Handler func(context.Context, Call) (Result, error)

type Tool struct {
	Definition         Definition
	ResolveDefinition  func() Definition
	AddMediaReferences func([]MediaReference)
	Handle             Handler
}

func (tool Tool) CurrentDefinition() Definition {
	if tool.ResolveDefinition != nil {
		return tool.ResolveDefinition()
	}
	return tool.Definition
}

func FunctionName(prefix string, value string) string {
	value = strings.TrimSpace(value)
	var builder strings.Builder
	lastSeparator := false
	for _, current := range prefix + value {
		if isFunctionNameRune(current) {
			builder.WriteRune(current)
			lastSeparator = false
			continue
		}
		if builder.Len() > 0 && !lastSeparator {
			builder.WriteByte('_')
			lastSeparator = true
		}
	}
	name := strings.Trim(builder.String(), "_-")
	if name == "" {
		name = "tool"
	}
	runes := []rune(name)
	if len(runes) > 64 {
		name = string(runes[:64])
	}
	return name
}

func isFunctionNameRune(value rune) bool {
	return (value >= 'a' && value <= 'z') ||
		(value >= 'A' && value <= 'Z') ||
		(value >= '0' && value <= '9') ||
		value == '_' || value == '-'
}

func ArgumentUint64(arguments map[string]any, key string) uint64 {
	if arguments == nil {
		return 0
	}
	switch current := arguments[key].(type) {
	case uint64:
		return current
	case int:
		if current > 0 {
			return uint64(current)
		}
	case int64:
		if current > 0 {
			return uint64(current)
		}
	case float64:
		if current > 0 {
			return uint64(current)
		}
	case json.Number:
		if parsed, err := strconv.ParseUint(current.String(), 10, 64); err == nil {
			return parsed
		}
	default:
		if parsed, err := strconv.ParseUint(strings.TrimSpace(fmt.Sprint(current)), 10, 64); err == nil {
			return parsed
		}
	}
	return 0
}

func ArgumentInt(arguments map[string]any, key string, fallback int) int {
	if arguments == nil {
		return fallback
	}
	value := strings.TrimSpace(fmt.Sprint(arguments[key]))
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func appendRequired(required []any, fields ...string) []any {
	result := append([]any{}, required...)
	for _, field := range fields {
		result = append(result, field)
	}
	return result
}
