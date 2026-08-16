package workbench

import (
	"context"
	"fmt"
	"strings"

	runtimeselection "github.com/dever-package/bot/service/agent/runtime/selection"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energoninput "github.com/dever-package/bot/service/energon/input"
	teamservice "github.com/dever-package/bot/service/team"
)

const (
	dialogueToolModeAuto     = "auto"
	dialogueToolModeNone     = "none"
	dialogueToolModeSpecific = "specific"
)

type DialogueExecution struct {
	Input            map[string]any
	ModelTargetID    uint64
	PowerPolicy      runtimetool.PowerPolicy
	RequiredToolName string
	MediaReferences  []runtimeprovider.MediaReference
}

type DialogueResumeSelection struct {
	ModelTargetID       uint64
	PowerPolicy         runtimetool.PowerPolicy
	InteractionToolName string
	InteractionToolArgs map[string]any
	MediaReferences     []runtimeprovider.MediaReference
}

func (s Service) DialogueConfig(ctx context.Context, binding ChatRoleBinding) (map[string]any, error) {
	config, err := s.team.WorkbenchDialogueConfig(ctx, binding.WorkbenchRoleBinding)
	if err != nil {
		return nil, err
	}
	tools := make([]map[string]any, 0, len(config.Tools))
	for _, tool := range config.Tools {
		tools = append(tools, map[string]any{
			"team_power_id": tool.TeamPowerID,
			"power_id":      tool.Power.ID,
			"cate_id":       tool.Power.CateID,
			"key":           tool.Power.Key,
			"name":          tool.Power.Name,
			"icon":          tool.Power.Icon,
			"kind":          tool.Power.Kind,
			"output_type":   tool.Power.OutputType,
		})
	}
	return map[string]any{
		"model_power":              config.ModelPower,
		"model_source_rule":        config.ModelSourceRule,
		"model_sources":            config.ModelSources,
		"selected_model_target_id": config.SelectedModelTargetID,
		"tools":                    tools,
	}, nil
}

func (s Service) PrepareDialogueExecution(
	ctx context.Context,
	binding ChatRoleBinding,
	input map[string]any,
	resume *DialogueResumeSelection,
) (DialogueExecution, error) {
	config, err := s.team.WorkbenchDialogueConfig(ctx, binding.WorkbenchRoleBinding)
	if err != nil {
		return DialogueExecution{}, err
	}
	nextInput := cloneMap(input)
	content := recordValue(nextInput["content"])
	if resume != nil {
		return s.prepareResumedDialogueExecution(ctx, binding, config, nextInput, content, *resume)
	}
	if len(recordValue(content["interaction_response"])) > 0 {
		return DialogueExecution{}, fmt.Errorf("交互来源运行不存在，请重新提交当前需求")
	}
	selection := recordValue(content["execution"])
	modelTargetID, modelName, err := resolveDialogueModel(config, nestedUint64(selection, "model_target_id"))
	if err != nil {
		return DialogueExecution{}, err
	}
	mode, err := resolveDialogueToolMode(nestedText(selection, "tool_mode"))
	if err != nil {
		return DialogueExecution{}, err
	}
	execution := DialogueExecution{
		Input:         nextInput,
		ModelTargetID: modelTargetID,
		PowerPolicy:   runtimetool.PowerPolicy{Restricted: true},
	}
	metadata := map[string]any{
		"model_target_id": modelTargetID,
		"model_name":      modelName,
		"tool_mode":       mode,
	}

	allowedPowerIDs := make([]uint64, 0, len(config.Tools))
	toolsByID := make(map[uint64]teamservice.WorkbenchExecutablePower, len(config.Tools))
	for _, tool := range config.Tools {
		allowedPowerIDs = append(allowedPowerIDs, tool.Power.ID)
		toolsByID[tool.TeamPowerID] = tool
	}
	switch mode {
	case dialogueToolModeAuto:
		execution.PowerPolicy.AllowedPowerIDs = allowedPowerIDs
	case dialogueToolModeNone:
		// A restricted empty list deliberately disables ordinary Power tools.
	case dialogueToolModeSpecific:
		teamPowerID := nestedUint64(selection, "team_power_id")
		tool, exists := toolsByID[teamPowerID]
		if !exists {
			return DialogueExecution{}, fmt.Errorf("所选工具不属于当前智能体或当前发布版本")
		}
		requestedTargetID := nestedUint64(selection, "tool_target_id")
		fixedArguments := map[string]any{}
		visibleArguments := map[string]any{}
		targetID := uint64(0)
		fixedArguments, visibleArguments, targetID, err = s.prepareDialogueToolArguments(
			ctx,
			binding,
			tool,
			requestedTargetID,
			recordValue(selection["tool_params"]),
			content,
		)
		if err != nil {
			return DialogueExecution{}, err
		}
		applySpecificDialogueTool(
			&execution, metadata, tool, targetID, fixedArguments, visibleArguments, true,
		)
		delete(nextInput, "params")
		delete(content, "params")
	}
	execution.PowerPolicy = execution.PowerPolicy.Normalize()
	content["execution"] = metadata
	nextInput["content"] = content
	return execution, nil
}

func (s Service) prepareResumedDialogueExecution(
	ctx context.Context,
	binding ChatRoleBinding,
	config teamservice.WorkbenchDialogueConfig,
	nextInput map[string]any,
	content map[string]any,
	resume DialogueResumeSelection,
) (DialogueExecution, error) {
	modelTargetID, modelName, err := resolveDialogueModel(config, resume.ModelTargetID)
	if err != nil {
		return DialogueExecution{}, fmt.Errorf("交互来源模型已不可用: %w", err)
	}
	execution := DialogueExecution{
		Input:         nextInput,
		ModelTargetID: modelTargetID,
		PowerPolicy:   runtimetool.PowerPolicy{Restricted: true},
	}
	metadata := map[string]any{
		"model_target_id": modelTargetID,
		"model_name":      modelName,
	}
	policy := resume.PowerPolicy.Normalize()
	if !policy.Restricted {
		policy.AllowedPowerIDs = dialoguePowerIDs(config.Tools)
	}
	interactionToolName := strings.TrimSpace(resume.InteractionToolName)
	if strings.HasPrefix(interactionToolName, "power_") {
		tool, exists := dialogueToolByFunctionName(config.Tools, interactionToolName)
		if !exists || (policy.Restricted && !policy.Allows(tool.Power.ID)) {
			return DialogueExecution{}, fmt.Errorf("交互来源工具已不可用，请重新提交当前需求")
		}
		targetID := uint64(0)
		if policy.SelectedPowerID == tool.Power.ID {
			targetID = policy.SelectedTargetID
		}
		params, targetID, err := s.dialogueToolForm(ctx, binding, tool, targetID)
		if err != nil {
			return DialogueExecution{}, fmt.Errorf("交互来源工具已不可用: %w", err)
		}
		fixedArguments := dialogueResumeFixedArguments(policy, resume.InteractionToolArgs, content)
		metadata["tool_mode"] = dialogueToolModeSpecific
		applySpecificDialogueTool(
			&execution,
			metadata,
			tool,
			targetID,
			fixedArguments,
			runtimeselection.VisibleToolArguments(params, fixedArguments),
			true,
		)
	} else if policy.SelectedPowerID > 0 {
		tool, exists := dialogueToolByPowerID(config.Tools, policy.SelectedPowerID)
		if !exists || !policy.Allows(tool.Power.ID) {
			return DialogueExecution{}, fmt.Errorf("交互来源工具已不可用，请重新提交当前需求")
		}
		params, targetID, formErr := s.dialogueToolForm(
			ctx, binding, tool, policy.SelectedTargetID,
		)
		if formErr != nil {
			return DialogueExecution{}, fmt.Errorf("交互来源工具已不可用: %w", formErr)
		}
		fixedArguments := dialogueResumePolicyArguments(policy)
		metadata["tool_mode"] = dialogueToolModeSpecific
		applySpecificDialogueTool(
			&execution,
			metadata,
			tool,
			targetID,
			fixedArguments,
			runtimeselection.VisibleToolArguments(params, fixedArguments),
			false,
		)
	} else {
		allowed := intersectDialoguePowerIDs(policy.AllowedPowerIDs, config.Tools)
		execution.PowerPolicy.AllowedPowerIDs = allowed
		if len(allowed) == 0 {
			metadata["tool_mode"] = dialogueToolModeNone
		} else {
			metadata["tool_mode"] = dialogueToolModeAuto
		}
	}
	execution.PowerPolicy = execution.PowerPolicy.Normalize()
	execution.MediaReferences = dialogueResumeMediaReferences(
		resume.MediaReferences,
		execution.PowerPolicy,
	)
	content["execution"] = metadata
	nextInput["content"] = content
	delete(nextInput, "params")
	delete(content, "params")
	return execution, nil
}

func DialogueInteractionID(input map[string]any) string {
	content := recordValue(input["content"])
	response := recordValue(content["interaction_response"])
	return nestedText(response, "interaction_id")
}

func applySpecificDialogueTool(
	execution *DialogueExecution,
	metadata map[string]any,
	tool teamservice.WorkbenchExecutablePower,
	targetID uint64,
	fixedArguments map[string]any,
	visibleArguments map[string]any,
	required bool,
) {
	execution.PowerPolicy.AllowedPowerIDs = []uint64{tool.Power.ID}
	execution.PowerPolicy.SelectedPowerID = tool.Power.ID
	execution.PowerPolicy.SelectedTargetID = targetID
	execution.PowerPolicy.FixedParameterKeys = runtimeselection.FixedParameterKeys(fixedArguments)
	execution.PowerPolicy.FixedArguments = fixedArguments
	if required {
		execution.RequiredToolName = runtimeprovider.FunctionName("power_", tool.Power.Key)
	}
	metadata["team_power_id"] = tool.TeamPowerID
	metadata["power_id"] = tool.Power.ID
	metadata["tool_key"] = tool.Power.Key
	metadata["tool_name"] = tool.Power.Name
	metadata["tool_target_id"] = targetID
	metadata["tool_params"] = visibleArguments
}

func dialoguePowerIDs(tools []teamservice.WorkbenchExecutablePower) []uint64 {
	result := make([]uint64, 0, len(tools))
	for _, tool := range tools {
		result = append(result, tool.Power.ID)
	}
	return result
}

func dialogueResumeFixedArguments(
	policy runtimetool.PowerPolicy,
	interactionArguments map[string]any,
	content map[string]any,
) map[string]any {
	result := map[string]any{}
	for key, value := range interactionArguments {
		if strings.TrimSpace(key) != "" {
			result[key] = value
		}
	}
	response := recordValue(content["interaction_response"])
	for key, value := range recordValue(response["data"]) {
		if strings.TrimSpace(key) != "" && key != runtimeprovider.MediaReferencesArgument {
			result[key] = value
		}
	}
	// Values validated and fixed on the original user message remain
	// authoritative throughout an interaction continuation.
	for key, value := range dialogueResumePolicyArguments(policy) {
		result[key] = value
	}
	return result
}

func dialogueResumePolicyArguments(policy runtimetool.PowerPolicy) map[string]any {
	result := policy.Arguments(policy.SelectedPowerID)
	if result == nil {
		result = map[string]any{}
	}
	return result
}

func dialogueResumeMediaReferences(
	values []runtimeprovider.MediaReference,
	policy runtimetool.PowerPolicy,
) []runtimeprovider.MediaReference {
	result := make([]runtimeprovider.MediaReference, 0, len(values))
	for _, current := range values {
		if policy.ConsumesReference(current.ReferenceType, current.ReferenceID, current.ParameterKey) {
			result = append(result, current)
		}
	}
	return result
}

func intersectDialoguePowerIDs(
	requested []uint64,
	tools []teamservice.WorkbenchExecutablePower,
) []uint64 {
	available := make(map[uint64]struct{}, len(tools))
	for _, tool := range tools {
		available[tool.Power.ID] = struct{}{}
	}
	result := make([]uint64, 0, len(requested))
	for _, powerID := range requested {
		if _, exists := available[powerID]; exists {
			result = append(result, powerID)
		}
	}
	return result
}

func dialogueToolByFunctionName(
	tools []teamservice.WorkbenchExecutablePower,
	name string,
) (teamservice.WorkbenchExecutablePower, bool) {
	for _, tool := range tools {
		if runtimeprovider.FunctionName("power_", tool.Power.Key) == name {
			return tool, true
		}
	}
	return teamservice.WorkbenchExecutablePower{}, false
}

func dialogueToolByPowerID(
	tools []teamservice.WorkbenchExecutablePower,
	powerID uint64,
) (teamservice.WorkbenchExecutablePower, bool) {
	for _, tool := range tools {
		if tool.Power.ID == powerID {
			return tool, true
		}
	}
	return teamservice.WorkbenchExecutablePower{}, false
}

func resolveDialogueModel(
	config teamservice.WorkbenchDialogueConfig,
	requestedTargetID uint64,
) (uint64, string, error) {
	return runtimeselection.ResolveModel(
		config.ModelSourceRule,
		config.ModelSources,
		config.SelectedModelTargetID,
		requestedTargetID,
	)
}

func (s Service) prepareDialogueToolArguments(
	ctx context.Context,
	binding ChatRoleBinding,
	tool teamservice.WorkbenchExecutablePower,
	targetID uint64,
	source map[string]any,
	content map[string]any,
) (map[string]any, map[string]any, uint64, error) {
	params, selectedTargetID, err := s.dialogueToolForm(ctx, binding, tool, targetID)
	if err != nil {
		return nil, nil, 0, err
	}
	values, visible, err := runtimeselection.PrepareToolArguments(params, source, content)
	return values, visible, selectedTargetID, err
}

func (s Service) dialogueToolForm(
	ctx context.Context,
	binding ChatRoleBinding,
	tool teamservice.WorkbenchExecutablePower,
	targetID uint64,
) ([]energoninput.PowerParam, uint64, error) {
	// The tool was already resolved from the role's published dialogue config.
	// Reuse that validated release and avoid resolving the team power a second time.
	form, err := s.team.CanvasPowerForm(ctx, binding.ReleaseID, 0, tool.Power.ID, "", targetID)
	if err != nil {
		return nil, 0, err
	}
	params, ok := form["params"].([]energoninput.PowerParam)
	if !ok {
		return nil, 0, fmt.Errorf("工具参数配置无效")
	}
	return params, nestedUint64(form, "selected_target_id"), nil
}

func resolveDialogueToolMode(value string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", dialogueToolModeAuto:
		return dialogueToolModeAuto, nil
	case dialogueToolModeNone:
		return dialogueToolModeNone, nil
	case dialogueToolModeSpecific:
		return dialogueToolModeSpecific, nil
	default:
		return "", fmt.Errorf("工具调用模式无效")
	}
}
