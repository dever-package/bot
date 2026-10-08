package input

import (
	"context"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func applyPromptMappedParams(mapped *botprotocol.MappedInput) {
	if mapped == nil || len(mapped.Params) == 0 {
		return
	}

	prompt := mapped.PrimaryPrompt()
	if strings.TrimSpace(prompt) == "" {
		return
	}

	for index := range mapped.Params {
		if !isPromptMappedParam(mapped.Params[index]) {
			continue
		}
		value, ok := promptMappedParamInput(prompt, mapped.Params[index].Value)
		if !ok {
			continue
		}
		mapped.Params[index].Value = value
	}
}

func promptMappedParamInput(prompt string, value any) (any, bool) {
	switch current := value.(type) {
	case string:
		if strings.TrimSpace(current) == "" {
			return prompt, true
		}
		return current, false
	case map[string]any:
		next := map[string]any{}
		for key, item := range current {
			next[key] = item
		}
		for _, key := range []string{"prompt", "text", "content", "input"} {
			if existing, ok := next[key]; ok && !IsMissing(existing) {
				return current, false
			}
			if _, ok := next[key]; ok {
				next[key] = prompt
				return next, true
			}
		}
		next["prompt"] = prompt
		return next, true
	default:
		if IsMissing(current) {
			return prompt, true
		}
		return current, false
	}
}

func isPromptMappedParam(param botprotocol.MappedParam) bool {
	return param.IsPrompt()
}

func mediaPromptInputKeys(ctx context.Context, repo Repository, target Target, params map[uint64]botmodel.Param) map[uint64][]string {
	promptKeys := map[uint64][]string{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, target.PowerID) {
		param, exists := params[powerParam.ParamID]
		if !exists || !IsActive(param.Status) || !IsPromptParam(param) {
			continue
		}
		promptKeys[param.ID] = paramInputKeys(param)
	}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, target.ServiceID) {
		param, exists := params[serviceParam.ParamID]
		if exists && IsActive(param.Status) && IsPromptParam(param) && IsActive(serviceParam.Status) && serviceParamAcceptsInput(serviceParam) {
			for _, key := range serviceParamInputKeys(serviceParam, param) {
				promptKeys[param.ID] = appendUniqueInputKey(promptKeys[param.ID], key)
			}
		}
	}
	return promptKeys
}
