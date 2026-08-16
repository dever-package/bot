package tool

import (
	"fmt"
	"sort"
	"strconv"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

// PowerPolicy limits the ordinary Power tools available to one agent run.
// An unrestricted policy uses the current executable Power catalog; a
// restricted empty policy disables ordinary Power tools.
type PowerPolicy struct {
	Restricted         bool           `json:"restricted,omitempty"`
	AllowedPowerIDs    []uint64       `json:"allowed_power_ids,omitempty"`
	SelectedPowerID    uint64         `json:"selected_power_id,omitempty"`
	SelectedTargetID   uint64         `json:"selected_target_id,omitempty"`
	FixedParameterKeys []string       `json:"fixed_parameter_keys,omitempty"`
	FixedArguments     map[string]any `json:"fixed_arguments,omitempty"`
}

func (policy PowerPolicy) Normalize() PowerPolicy {
	allowed := make(map[uint64]struct{}, len(policy.AllowedPowerIDs)+1)
	for _, powerID := range policy.AllowedPowerIDs {
		if powerID > 0 {
			allowed[powerID] = struct{}{}
		}
	}
	if policy.Restricted && policy.SelectedPowerID > 0 {
		allowed[policy.SelectedPowerID] = struct{}{}
	}
	policy.AllowedPowerIDs = make([]uint64, 0, len(allowed))
	for powerID := range allowed {
		policy.AllowedPowerIDs = append(policy.AllowedPowerIDs, powerID)
	}
	sort.Slice(policy.AllowedPowerIDs, func(i, j int) bool {
		return policy.AllowedPowerIDs[i] < policy.AllowedPowerIDs[j]
	})
	policy.FixedArguments = clonePolicyArguments(policy.FixedArguments)
	policy.FixedParameterKeys = normalizePolicyKeys(policy.FixedParameterKeys)
	if policy.SelectedPowerID == 0 {
		policy.SelectedTargetID = 0
		policy.FixedParameterKeys = nil
		policy.FixedArguments = nil
	}
	return policy
}

func (policy PowerPolicy) Allows(powerID uint64) bool {
	policy = policy.Normalize()
	if !policy.Restricted {
		return true
	}
	for _, allowedID := range policy.AllowedPowerIDs {
		if allowedID == powerID {
			return true
		}
	}
	return false
}

func (policy PowerPolicy) TargetID(powerID uint64) uint64 {
	if powerID == policy.SelectedPowerID {
		return policy.SelectedTargetID
	}
	return 0
}

func (policy PowerPolicy) Arguments(powerID uint64) map[string]any {
	if powerID != policy.SelectedPowerID {
		return nil
	}
	return clonePolicyArguments(policy.FixedArguments)
}

func (policy PowerPolicy) ParameterKeys(powerID uint64) []string {
	if powerID != policy.SelectedPowerID {
		return nil
	}
	return append([]string(nil), policy.FixedParameterKeys...)
}

// ConsumesReference reports whether a fixed Power invocation owns one input
// reference. Callers use it to keep tool-only attachments out of the agent
// parameter and text-model media pipelines while retaining them for the tool.
func (policy PowerPolicy) ConsumesReference(referenceType string, referenceID uint64, parameterKey string) bool {
	if policy.SelectedPowerID == 0 || referenceID == 0 {
		return false
	}
	referenceType = strings.ToLower(strings.TrimSpace(referenceType))
	parameterKey = strings.TrimSpace(parameterKey)
	for _, selection := range policyReferenceSelections(policy.FixedArguments[runtimeprovider.MediaReferencesArgument]) {
		if strings.ToLower(strings.TrimSpace(fmt.Sprint(selection["ref_type"]))) == referenceType &&
			policyUint64(selection["ref_id"]) == referenceID &&
			strings.TrimSpace(fmt.Sprint(selection["param_key"])) == parameterKey {
			return true
		}
	}
	return false
}

func (policy PowerPolicy) CacheKey() string {
	policy = policy.Normalize()
	if !policy.Restricted && policy.SelectedPowerID == 0 {
		return "default"
	}
	ids := make([]string, 0, len(policy.AllowedPowerIDs))
	for _, powerID := range policy.AllowedPowerIDs {
		ids = append(ids, strconv.FormatUint(powerID, 10))
	}
	return strings.Join([]string{
		strconv.FormatBool(policy.Restricted),
		strings.Join(ids, ","),
		strconv.FormatUint(policy.SelectedPowerID, 10),
		strconv.FormatUint(policy.SelectedTargetID, 10),
		strings.Join(policy.FixedParameterKeys, ","),
	}, ":")
}

func normalizePolicyKeys(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		key := strings.TrimSpace(value)
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, key)
	}
	sort.Strings(result)
	return result
}

func clonePolicyArguments(source map[string]any) map[string]any {
	if len(source) == 0 {
		return nil
	}
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}

func policyReferenceSelections(value any) []map[string]any {
	switch current := value.(type) {
	case []map[string]any:
		return current
	case []any:
		result := make([]map[string]any, 0, len(current))
		for _, item := range current {
			if selection, ok := item.(map[string]any); ok {
				result = append(result, selection)
			}
		}
		return result
	default:
		return nil
	}
}

func policyUint64(value any) uint64 {
	switch current := value.(type) {
	case uint64:
		return current
	case uint:
		return uint64(current)
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
	case string:
		parsed, _ := strconv.ParseUint(strings.TrimSpace(current), 10, 64)
		return parsed
	}
	return 0
}
