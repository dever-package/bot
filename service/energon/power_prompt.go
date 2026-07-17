package energon

import (
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func applyPowerPrompt(req *botprotocol.ShemicRequest, power botmodel.Power, outputPrompt string) {
	if req == nil {
		return
	}

	promptOwner := consumePromptOwner(req)
	parts := make([]string, 0, 3)
	if prompt := strings.TrimSpace(power.Prompt); prompt != "" && !strings.EqualFold(promptOwner, botprotocol.PromptOwnerAgentRuntime) {
		parts = append(parts, prompt)
	}
	if prompt := strings.TrimSpace(botprotocol.AsText(req.Set["role"])); prompt != "" {
		parts = append(parts, prompt)
	}
	if prompt := strings.TrimSpace(outputPrompt); prompt != "" {
		parts = append(parts, prompt)
	}
	if len(parts) == 0 {
		return
	}

	set := cloneAnyMap(req.Set)
	set["role"] = strings.Join(parts, "\n\n")
	req.Set = set

	if req.Raw.Body == nil {
		req.Raw.Body = map[string]any{}
	}
	req.Raw.Body["set"] = cloneAnyMap(set)
}

func consumePromptOwner(req *botprotocol.ShemicRequest) string {
	set := cloneAnyMap(req.Set)
	if set == nil {
		set = map[string]any{}
	}
	owner := strings.TrimSpace(botprotocol.AsText(set[botprotocol.SetPromptOwnerKey]))
	req.PromptOwner = owner
	delete(set, botprotocol.SetPromptOwnerKey)
	req.Set = set
	if req.Raw.Body == nil {
		req.Raw.Body = map[string]any{}
	}
	req.Raw.Body["set"] = cloneAnyMap(set)
	return owner
}
