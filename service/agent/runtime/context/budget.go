package runtimecontext

import (
	"strings"

	runtimetokenbudget "github.com/dever-package/bot/service/agent/runtime/tokenbudget"
)

type TokenBudget = runtimetokenbudget.Budget

func ResolveTokenBudget(hardContext int, workingContext int, maxOutput int, requiredInput int) (TokenBudget, error) {
	return runtimetokenbudget.Resolve(hardContext, workingContext, maxOutput, requiredInput)
}

func EstimateTokens(value any) int {
	return runtimetokenbudget.Estimate(value)
}

func EstimateTextTokens(value string) int {
	return runtimetokenbudget.EstimateText(value)
}

func CompactConversationValue(value any, stringLimit int) any {
	return runtimetokenbudget.CompactValue(value, stringLimit)
}

func CompactConversationText(value string, stringLimit int) string {
	return runtimetokenbudget.CompactText(value, stringLimit)
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
