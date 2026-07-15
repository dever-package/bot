package energon

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const submitOutputToolName = "submit_output"

var structuredOutputContracts = map[string]func() powerOutputContract{
	botmodel.OutputTypeStoryboard: storyboardOutputContract,
}

var structuredOutputProgressCounters = map[string]func(botprotocol.ToolCall) int{
	botmodel.OutputTypeStoryboard: func(call botprotocol.ToolCall) int {
		return strings.Count(call.Arguments, `"order"`)
	},
}

type powerOutputContract struct {
	Type        string
	Description string
	Prompt      string
	Schema      map[string]any
	Normalize   func(map[string]any) (map[string]any, error)
}

type powerOutputStreamProgress struct {
	outputType     string
	outputName     string
	calls          []botprotocol.ToolCall
	started        bool
	generatedCount int
}

func preparePowerRequest(req *botprotocol.ShemicRequest, power botmodel.Power) error {
	outputType := botmodel.NormalizeOutputType(power.OutputType)
	spec, exists := botmodel.FindOutputTypeSpec(outputType)
	if !exists {
		return fmt.Errorf("能力“%s”的输出类型无效: %s", power.Name, outputType)
	}
	kind := botmodel.NormalizePowerKind(power.Kind)
	if !botmodel.IsOutputKindAllowed(outputType, kind) {
		return fmt.Errorf("能力“%s”的输出类型 %s 不支持技术类型 %s", power.Name, spec.Name, kind)
	}

	contract, structured, err := powerOutputContractFor(outputType)
	if err != nil {
		return err
	}
	if !structured {
		applyPowerPrompt(req, power, "")
		return nil
	}
	applyPowerPrompt(req, power, contract.Prompt)
	applyPowerOutputTool(req, contract)
	return nil
}

func powerOutputContractFor(outputType string) (powerOutputContract, bool, error) {
	outputType = botmodel.NormalizeOutputType(outputType)
	spec, exists := botmodel.FindOutputTypeSpec(outputType)
	if !exists {
		return powerOutputContract{}, false, fmt.Errorf("输出类型不存在: %s", outputType)
	}
	if !spec.Structured {
		return powerOutputContract{}, false, nil
	}
	factory, exists := structuredOutputContracts[outputType]
	if !exists {
		return powerOutputContract{}, false, fmt.Errorf("输出类型尚未实现: %s", outputType)
	}
	return factory(), true, nil
}

func applyPowerOutputTool(req *botprotocol.ShemicRequest, contract powerOutputContract) {
	if req == nil {
		return
	}
	options := cloneAnyMap(req.Options)
	if options == nil {
		options = map[string]any{}
	}
	options["tools"] = []any{
		botprotocol.FunctionToolDefinition(
			submitOutputToolName,
			contract.Description,
			contract.Schema,
			false,
		),
	}
	options["tool_choice"] = botprotocol.ForcedFunctionToolChoice(submitOutputToolName)
	options["parallel_tool_calls"] = false
	req.Options = options

	if req.Raw.Body == nil {
		req.Raw.Body = map[string]any{}
	}
	req.Raw.Body["options"] = cloneAnyMap(options)
}

func normalizePowerOutput(power botmodel.Power, value any) (any, error) {
	outputType := botmodel.NormalizeOutputType(power.OutputType)
	contract, structured, err := powerOutputContractFor(outputType)
	if err != nil || !structured {
		return value, err
	}

	output := botprotocol.ExtractOutput(value)
	calls := botprotocol.ParseToolCalls(output["tool_calls"])
	call, err := submittedOutputCall(calls)
	if err != nil {
		return nil, err
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return nil, err
	}
	normalized, err := contract.Normalize(arguments)
	if err != nil {
		return nil, fmt.Errorf("%s输出格式无效: %w", contract.Type, err)
	}
	return botprotocol.Output{
		"event": "final",
		"json":  normalized,
		"meta": map[string]any{
			"output_type": outputType,
		},
	}, nil
}

func submittedOutputCall(calls []botprotocol.ToolCall) (botprotocol.ToolCall, error) {
	var submitted botprotocol.ToolCall
	count := 0
	for _, call := range calls {
		if strings.EqualFold(strings.TrimSpace(call.Name), submitOutputToolName) {
			submitted = call
			count++
		}
	}
	if count == 0 {
		return botprotocol.ToolCall{}, fmt.Errorf("模型未调用 %s", submitOutputToolName)
	}
	if count > 1 {
		return botprotocol.ToolCall{}, fmt.Errorf("模型重复调用 %s", submitOutputToolName)
	}
	return submitted, nil
}

func suppressStructuredOutputStream(power botmodel.Power, output botprotocol.Output) bool {
	if !botmodel.RequiresStructuredOutput(power) {
		return false
	}
	switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(output["event"]))) {
	case "control", "status", "warning":
		return false
	default:
		return true
	}
}

func newPowerOutputStreamProgress(power botmodel.Power) *powerOutputStreamProgress {
	if !botmodel.RequiresStructuredOutput(power) {
		return nil
	}
	outputType := botmodel.NormalizeOutputType(power.OutputType)
	spec, exists := botmodel.FindOutputTypeSpec(outputType)
	if !exists {
		return nil
	}
	return &powerOutputStreamProgress{
		outputType: outputType,
		outputName: spec.Name,
	}
}

func (progress *powerOutputStreamProgress) Consume(output botprotocol.Output) (botprotocol.Output, bool) {
	if progress == nil {
		return nil, false
	}
	fragments := botprotocol.ParseToolCalls(output["tool_calls"])
	if len(fragments) == 0 {
		return nil, false
	}
	progress.calls = botprotocol.MergeToolCalls(progress.calls, fragments)
	generatedCount := progress.generatedCount
	if counter := structuredOutputProgressCounters[progress.outputType]; counter != nil {
		for _, call := range progress.calls {
			if strings.EqualFold(strings.TrimSpace(call.Name), submitOutputToolName) {
				generatedCount = max(generatedCount, counter(call))
			}
		}
	}
	if progress.started && generatedCount == progress.generatedCount {
		return nil, false
	}
	progress.started = true
	progress.generatedCount = generatedCount
	return botprotocol.Output{
		"event": "status",
		"text":  progress.outputName + "正在生成",
		"meta": map[string]any{
			"output_type":     progress.outputType,
			"generated_count": generatedCount,
		},
	}, true
}
