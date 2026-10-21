package energon

import (
	"fmt"
	"strings"
	"sync"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
)

const (
	submitOutputToolName         = "submit_output"
	powerOutputPreviewEagerBytes = 256
	powerOutputPreviewInterval   = 100 * time.Millisecond
)

type powerOutputContractContext struct {
	WritingAction             string
	RequestInput              map[string]any
	StoryboardMaxShotDuration int
}

var structuredOutputContracts = map[string]func(powerOutputContractContext) (powerOutputContract, error){
	botmodel.OutputTypeStoryboard: storyboardOutputContract,
	botmodel.OutputTypeStory:      writingOutputContract,
}

type powerOutputContract struct {
	Type        string
	Description string
	Prompt      string
	Schema      map[string]any
	Strict      bool
	Normalize   func(output map[string]any, requestInput map[string]any) (map[string]any, error)
}

type powerOutputStreamProgress struct {
	mu                  sync.Mutex
	outputType          string
	outputName          string
	calls               botprotocol.ToolCallAccumulator
	started             bool
	generatedCount      int
	observedCount       int
	targetCount         int
	estimatedDurationMS int64
	previewText         string
	previewDirty        bool
	previewNextBytes    int
	previewCheckedAt    time.Time
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

func powerOutputContractForRequest(outputType string, req *botprotocol.ShemicRequest) (powerOutputContract, bool, error) {
	contractContext := powerOutputContractContext{}
	if req != nil {
		contractContext.WritingAction = req.WritingAction
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
	tool := botprotocol.FunctionToolDefinition(
		submitOutputToolName,
		contract.Description,
		contract.Schema,
		contract.Strict,
	)
	if contract.Strict {
		function := tool["function"].(map[string]any)
		function["parameters"] = orderedOutputSchema(function["parameters"].(map[string]any))
	}
	options["tools"] = []any{tool}
	options["tool_choice"] = botprotocol.ForcedFunctionToolChoice(submitOutputToolName)
	options["parallel_tool_calls"] = false
	req.Options = options

	if req.Raw.Body == nil {
		req.Raw.Body = map[string]any{}
	}
	req.Raw.Body["options"] = cloneAnyMap(options)
}

func normalizePowerOutput(req *botprotocol.ShemicRequest, power botmodel.Power, value any) (result any, failure error) {
	defer func() {
		if failure != nil && (power.OutputType == botmodel.OutputTypeStory) {
			failure = &botprotocol.ContentResultError{Cause: failure}
		}
	}()
	outputType := botmodel.NormalizeOutputType(power.OutputType)
	contract, structured, err := powerOutputContractForRequest(outputType, req)
	if err != nil {
		return value, err
	}
	if !structured {
		if botmodel.IsGeneralTextPower(power) {
			output := botprotocol.ExtractOutput(value)
			if !hasGeneralTextOutputContent(output) {
				return nil, &botprotocol.ContentResultError{Cause: fmt.Errorf("能力未返回有效内容，请重试")}
			}
		}
		return value, nil
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

func hasGeneralTextOutputContent(output botprotocol.Output) bool {
	if len(botprotocol.ParseToolCalls(output["tool_calls"])) > 0 {
		return true
	}
	content := map[string]any{}
	for _, key := range []string{"text", "json", "rich", "lyrics", "images", "videos", "audios", "files", "media_files"} {
		content[key] = output[key]
	}
	return assetservice.HasContent(content)
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
	event, _ := output["event"].(string)
	finishReason, _ := output["finish_reason"].(string)
	terminal := strings.EqualFold(strings.TrimSpace(event), "end") || strings.TrimSpace(finishReason) != ""
	if len(fragments) == 0 {
		if terminal {
			return progress.structuredPreview(true)
		}
		return nil, false
	}
	progress.calls.Append(fragments)
	progress.previewDirty = true
	if progress.outputType == botmodel.OutputTypeStoryboard {
		return progress.storyboardPreview(terminal)
	}
	if preview, changed := progress.writingPreview(terminal); changed {
		return preview, true
	}
	if progress.started {
		return nil, false
	}
	progress.started = true
	return botruntime.WithEstimatedDuration(botprotocol.Output{
		"event": "status",
		"text":  progress.outputName + "正在生成",
		"meta": map[string]any{
			"output_type": progress.outputType, "generated_count": 0,
		},
	}, progress.estimatedDurationMS), true
}

// 即使传输没有 end 分片，也交付最后可读前缀；持锁期间不再调用 Consume。
func (progress *powerOutputStreamProgress) Flush() (botprotocol.Output, bool) {
	if progress == nil {
		return nil, false
	}
	progress.mu.Lock()
	defer progress.mu.Unlock()
	return progress.structuredPreview(true)
}

func (progress *powerOutputStreamProgress) MergeFinal(outputs []botprotocol.Output, final botprotocol.Output) botprotocol.Output {
	progress.mu.Lock()
	defer progress.mu.Unlock()
	return botprotocol.MergeStreamFinalWithTools(outputs, final, &progress.calls)
}

func (progress *powerOutputStreamProgress) structuredPreview(force bool) (botprotocol.Output, bool) {
	if progress.outputType == botmodel.OutputTypeStoryboard {
		return progress.storyboardPreview(force)
	}
	return progress.writingPreview(force)
}

// 快速流按几何增长采样，缓慢流按时间窗口更新，避免每片复制并扫描全部工具参数。
func (progress *powerOutputStreamProgress) refreshPreview(force bool) bool {
	if !progress.previewDirty {
		return false
	}
	now := time.Now()
	size := progress.calls.ArgumentBytes()
	if !force && size > powerOutputPreviewEagerBytes && size < progress.previewNextBytes && now.Sub(progress.previewCheckedAt) < powerOutputPreviewInterval {
		return false
	}
	progress.previewCheckedAt = now
	progress.previewNextBytes = max(powerOutputPreviewEagerBytes, size*2)
	progress.previewDirty = false
	return true
}
