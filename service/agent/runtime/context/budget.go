package runtimecontext

import (
	"encoding/json"
	"fmt"
	"strings"
)

const contextSafetyPercent = 5

type TokenBudget struct {
	HardContextTokens    int  `json:"hard_context_tokens"`
	WorkingContextTokens int  `json:"working_context_tokens"`
	MaxOutputTokens      int  `json:"max_output_tokens"`
	SafetyTokens         int  `json:"safety_tokens"`
	MaxInputTokens       int  `json:"max_input_tokens"`
	Expanded             bool `json:"context_expanded,omitempty"`
}

func ResolveTokenBudget(hardContext int, workingContext int, maxOutput int, requiredInput int) (TokenBudget, error) {
	if hardContext <= 0 {
		return TokenBudget{}, fmt.Errorf("模型上下文窗口必须大于 0")
	}
	if workingContext <= 0 || workingContext > hardContext {
		workingContext = hardContext
	}
	if maxOutput <= 0 {
		return TokenBudget{}, fmt.Errorf("模型输出预算必须大于 0")
	}
	if maxOutput >= usableContextTokens(hardContext) {
		return TokenBudget{}, fmt.Errorf("模型输出预算必须小于可用上下文窗口")
	}

	budget := tokenBudget(hardContext, workingContext, maxOutput)
	if requiredInput <= budget.MaxInputTokens {
		return budget, nil
	}
	requiredWorking := ceilDivide((requiredInput+maxOutput)*100, 100-contextSafetyPercent)
	if requiredWorking > hardContext {
		return TokenBudget{}, fmt.Errorf(
			"当前必要输入约 %d Token，超过来源服务可用输入上限 %d Token",
			requiredInput,
			usableContextTokens(hardContext)-maxOutput,
		)
	}
	budget = tokenBudget(hardContext, requiredWorking, maxOutput)
	budget.Expanded = true
	return budget, nil
}

func tokenBudget(hardContext int, workingContext int, maxOutput int) TokenBudget {
	usable := usableContextTokens(workingContext)
	return TokenBudget{
		HardContextTokens:    hardContext,
		WorkingContextTokens: workingContext,
		MaxOutputTokens:      maxOutput,
		SafetyTokens:         workingContext - usable,
		MaxInputTokens:       usable - maxOutput,
	}
}

func usableContextTokens(contextTokens int) int {
	return contextTokens * (100 - contextSafetyPercent) / 100
}

func ceilDivide(value int, divisor int) int {
	if value <= 0 {
		return 0
	}
	return (value + divisor - 1) / divisor
}

// EstimateTokens intentionally overestimates mixed Chinese/JSON payloads. It
// is provider-neutral and can later be replaced by a protocol tokenizer.
func EstimateTokens(value any) int {
	if value == nil {
		return 0
	}
	if text, ok := value.(string); ok {
		return EstimateTextTokens(text)
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return EstimateTextTokens(fmt.Sprint(value))
	}
	return EstimateTextTokens(string(encoded))
}

func EstimateTextTokens(value string) int {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0
	}
	ascii := 0
	nonASCII := 0
	for _, current := range value {
		if current <= 0x7f {
			ascii++
		} else {
			nonASCII++
		}
	}
	base := ceilDivide(ascii, 4) + nonASCII
	return base + ceilDivide(base, 20) + 8
}

func limitRunes(value string, maximum int) string {
	value = strings.TrimSpace(value)
	if value == "" || maximum <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= maximum {
		return value
	}
	return strings.TrimSpace(string(runes[:maximum]))
}

func runeCount(value string) int {
	return len([]rune(value))
}
