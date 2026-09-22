package energon

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"sync"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
)

const submitOutputToolName = "submit_output"

var (
	storyboardTargetShotCountPattern = regexp.MustCompile(`"target_shot_count"\s*:\s*([0-9]+)\s*[,}]`)
	storyboardShotOrderPattern       = regexp.MustCompile(`"order"\s*:`)
)

type powerOutputContractContext struct {
	RequestInput              map[string]any
	StoryboardMaxShotDuration int
}

var structuredOutputContracts = map[string]func(powerOutputContractContext) (powerOutputContract, error){
	botmodel.OutputTypeStoryboard: storyboardOutputContract,
}

var structuredOutputProgressCounters = map[string]func(botprotocol.ToolCall) int{
	botmodel.OutputTypeStoryboard: func(call botprotocol.ToolCall) int {
		return len(storyboardShotOrderPattern.FindAllStringIndex(call.Arguments, -1))
	},
}

type powerOutputContract struct {
	Type        string
	Description string
	Prompt      string
	Schema      map[string]any
	Normalize   func(output map[string]any, requestInput map[string]any) (map[string]any, error)
}

type powerOutputStreamProgress struct {
	mu                  sync.Mutex
	outputType          string
	outputName          string
	calls               []botprotocol.ToolCall
	started             bool
	generatedCount      int
	observedCount       int
	targetCount         int
	estimatedDurationMS int64
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

	contract, structured, err := powerOutputContractForRequest(outputType, req)
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
	return powerOutputContractForContext(outputType, powerOutputContractContext{})
}

func powerOutputContractForRequest(outputType string, req *botprotocol.ShemicRequest) (powerOutputContract, bool, error) {
	contractContext := powerOutputContractContext{}
	if req != nil {
		contractContext.RequestInput = req.Input
		contractContext.StoryboardMaxShotDuration = req.StoryboardMaxShotDuration
	}
	return powerOutputContractForContext(outputType, contractContext)
}

func powerOutputContractForContext(outputType string, contractContext powerOutputContractContext) (powerOutputContract, bool, error) {
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
	contract, err := factory(contractContext)
	return contract, true, err
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

func normalizePowerOutput(req *botprotocol.ShemicRequest, power botmodel.Power, value any) (any, error) {
	outputType := botmodel.NormalizeOutputType(power.OutputType)
	contract, structured, err := powerOutputContractForRequest(outputType, req)
	if err != nil || !structured {
		return value, err
	}
	var requestInput map[string]any
	if req != nil {
		requestInput = req.Input
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
	normalized, err := contract.Normalize(arguments, requestInput)
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
	// 历史估时与模型分片来自不同写入协程，投影时共同保留两种进度。
	progress.mu.Lock()
	defer progress.mu.Unlock()
	if meta := botprotocol.NormalizeMap(output["meta"]); meta != nil {
		if duration, ok := numberValue(meta["estimated_duration_ms"]); ok && duration > 0 {
			progress.estimatedDurationMS = int64(duration)
		}
	}
	fragments := botprotocol.ParseToolCalls(output["tool_calls"])
	if len(fragments) == 0 {
		return nil, false
	}
	progress.calls = botprotocol.MergeToolCalls(progress.calls, fragments)
	observedCount := progress.observedCount
	targetCount := progress.targetCount
	if counter := structuredOutputProgressCounters[progress.outputType]; counter != nil {
		for _, call := range progress.calls {
			if strings.EqualFold(strings.TrimSpace(call.Name), submitOutputToolName) {
				observedCount = max(observedCount, counter(call))
				if progress.outputType == botmodel.OutputTypeStoryboard && targetCount == 0 {
					if match := storyboardTargetShotCountPattern.FindStringSubmatch(call.Arguments); len(match) > 1 {
						count, err := strconv.Atoi(match[1])
						if err == nil && count > 0 && count <= botmodel.StoryboardMaxShots {
							targetCount = count
						}
					}
				}
			}
		}
	}
	progress.observedCount = observedCount
	generatedCount := observedCount
	if targetCount > 0 {
		generatedCount = min(generatedCount, targetCount)
	}
	if progress.started && generatedCount == progress.generatedCount && targetCount == progress.targetCount {
		return nil, false
	}
	progress.started = true
	progress.generatedCount = generatedCount
	progress.targetCount = targetCount
	meta := map[string]any{
		"output_type":     progress.outputType,
		"generated_count": generatedCount,
	}
	if targetCount > 0 {
		meta["target_count"] = targetCount
	}
	return botruntime.WithEstimatedDuration(botprotocol.Output{
		"event": "status",
		"text":  progress.outputName + "正在生成",
		"meta":  meta,
	}, progress.estimatedDurationMS), true
}
