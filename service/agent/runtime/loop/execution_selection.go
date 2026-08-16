package loop

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimeselection "github.com/dever-package/bot/service/agent/runtime/selection"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
)

const (
	agentToolModeAuto     = "auto"
	agentToolModeNone     = "none"
	agentToolModeSpecific = "specific"
)

type AgentExecution struct {
	Agent            agentmodel.Agent
	Input            map[string]any
	ModelTargetID    uint64
	PowerPolicy      runtimetool.PowerPolicy
	RequiredToolName string
	MediaReferences  []runtimeprovider.MediaReference
}

type agentExecutionConfig struct {
	Agent                 agentmodel.Agent
	ModelPower            energonmodel.Power
	ModelSources          []energonservice.PowerSource
	SelectedModelTargetID uint64
	Tools                 []energonmodel.Power
}

func (s Service) AgentExecutionConfig(ctx context.Context, identity string) (map[string]any, error) {
	config, err := s.loadAgentExecutionConfig(ctx, identity)
	if err != nil {
		return nil, err
	}
	tools := make([]map[string]any, 0, len(config.Tools))
	for _, tool := range config.Tools {
		tools = append(tools, agentToolPayload(tool))
	}
	return map[string]any{
		"model_power":              config.ModelPower,
		"model_source_rule":        config.ModelPower.SourceRule,
		"model_sources":            config.ModelSources,
		"selected_model_target_id": config.SelectedModelTargetID,
		"tools":                    tools,
		"power_cates":              agentPowerCategoryPayloads(ctx),
	}, nil
}

func (s Service) AgentToolForm(
	ctx context.Context,
	identity string,
	powerID uint64,
	targetID uint64,
) (energonservice.PowerParamConfig, error) {
	tool, err := s.requireAgentTool(ctx, identity, powerID)
	if err != nil {
		return energonservice.PowerParamConfig{}, err
	}
	return s.gateway.PowerParamConfig(ctx, tool.Key, targetID)
}

func (s Service) PrepareAgentExecution(
	ctx context.Context,
	identity string,
	input map[string]any,
	resume *RunExecutionSelection,
) (AgentExecution, error) {
	config, err := s.loadAgentExecutionConfig(ctx, identity)
	if err != nil {
		return AgentExecution{}, err
	}
	nextInput := cloneSelectionMap(input)
	content := cloneSelectionMap(selectionRecord(nextInput["content"]))
	if resume != nil {
		return s.prepareResumedAgentExecution(ctx, config, nextInput, content, *resume)
	}
	if len(selectionRecord(content["interaction_response"])) > 0 {
		return AgentExecution{}, fmt.Errorf("交互来源运行不存在，请重新提交当前需求")
	}
	selection := selectionRecord(content["execution"])
	modelTargetID, modelName, err := runtimeselection.ResolveModel(
		config.ModelPower.SourceRule,
		config.ModelSources,
		config.SelectedModelTargetID,
		selectionUint64(selection["model_target_id"]),
	)
	if err != nil {
		return AgentExecution{}, err
	}
	mode, err := resolveAgentToolMode(selectionText(selection["tool_mode"]))
	if err != nil {
		return AgentExecution{}, err
	}
	execution := AgentExecution{
		Agent:         config.Agent,
		Input:         nextInput,
		ModelTargetID: modelTargetID,
		PowerPolicy:   runtimetool.PowerPolicy{Restricted: true},
	}
	metadata := map[string]any{
		"model_target_id": modelTargetID,
		"model_name":      modelName,
		"tool_mode":       mode,
	}
	switch mode {
	case agentToolModeAuto:
		execution.PowerPolicy.AllowedPowerIDs = agentToolIDs(config.Tools)
	case agentToolModeNone:
	case agentToolModeSpecific:
		tool, exists := agentToolByID(config.Tools, selectionUint64(selection["power_id"]))
		if !exists {
			return AgentExecution{}, fmt.Errorf("所选工具不属于当前智能体")
		}
		form, err := s.gateway.PowerParamConfig(
			ctx,
			tool.Key,
			selectionUint64(selection["tool_target_id"]),
		)
		if err != nil {
			return AgentExecution{}, err
		}
		fixed, visible, err := runtimeselection.PrepareToolArguments(
			form.Params,
			selectionRecord(selection["tool_params"]),
			content,
		)
		if err != nil {
			return AgentExecution{}, err
		}
		applySpecificAgentTool(&execution, metadata, tool, form.SelectedTargetID, fixed, visible, true)
		delete(nextInput, "params")
		delete(content, "params")
	}
	execution.PowerPolicy = execution.PowerPolicy.Normalize()
	content["execution"] = metadata
	nextInput["content"] = content
	return execution, nil
}

func (s Service) prepareResumedAgentExecution(
	ctx context.Context,
	config agentExecutionConfig,
	nextInput map[string]any,
	content map[string]any,
	resume RunExecutionSelection,
) (AgentExecution, error) {
	modelTargetID, modelName, err := runtimeselection.ResolveModel(
		config.ModelPower.SourceRule,
		config.ModelSources,
		config.SelectedModelTargetID,
		resume.ModelTargetID,
	)
	if err != nil {
		return AgentExecution{}, fmt.Errorf("交互来源模型已不可用: %w", err)
	}
	execution := AgentExecution{
		Agent:         config.Agent,
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
		policy.AllowedPowerIDs = agentToolIDs(config.Tools)
	}
	interactionToolName := strings.TrimSpace(resume.InteractionToolName)
	if strings.HasPrefix(interactionToolName, "power_") {
		tool, exists := agentToolByFunctionName(config.Tools, interactionToolName)
		if !exists || (policy.Restricted && !policy.Allows(tool.ID)) {
			return AgentExecution{}, fmt.Errorf("交互来源工具已不可用，请重新提交当前需求")
		}
		targetID := uint64(0)
		if policy.SelectedPowerID == tool.ID {
			targetID = policy.SelectedTargetID
		}
		form, formErr := s.gateway.PowerParamConfig(ctx, tool.Key, targetID)
		if formErr != nil {
			return AgentExecution{}, fmt.Errorf("交互来源工具已不可用: %w", formErr)
		}
		fixedArguments := agentResumeFixedArguments(policy, resume.InteractionToolArgs, content)
		metadata["tool_mode"] = agentToolModeSpecific
		applySpecificAgentTool(
			&execution,
			metadata,
			tool,
			form.SelectedTargetID,
			fixedArguments,
			runtimeselection.VisibleToolArguments(form.Params, fixedArguments),
			true,
		)
	} else if policy.SelectedPowerID > 0 {
		tool, exists := agentToolByID(config.Tools, policy.SelectedPowerID)
		if !exists || !policy.Allows(tool.ID) {
			return AgentExecution{}, fmt.Errorf("交互来源工具已不可用，请重新提交当前需求")
		}
		form, formErr := s.gateway.PowerParamConfig(ctx, tool.Key, policy.SelectedTargetID)
		if formErr != nil {
			return AgentExecution{}, fmt.Errorf("交互来源工具已不可用: %w", formErr)
		}
		fixedArguments := policy.Arguments(policy.SelectedPowerID)
		metadata["tool_mode"] = agentToolModeSpecific
		applySpecificAgentTool(
			&execution,
			metadata,
			tool,
			form.SelectedTargetID,
			fixedArguments,
			runtimeselection.VisibleToolArguments(form.Params, fixedArguments),
			false,
		)
	} else {
		allowed := intersectAgentToolIDs(policy.AllowedPowerIDs, config.Tools)
		execution.PowerPolicy.AllowedPowerIDs = allowed
		if len(allowed) == 0 {
			metadata["tool_mode"] = agentToolModeNone
		} else {
			metadata["tool_mode"] = agentToolModeAuto
		}
	}
	execution.PowerPolicy = execution.PowerPolicy.Normalize()
	execution.MediaReferences = agentResumeMediaReferences(resume.MediaReferences, execution.PowerPolicy)
	content["execution"] = metadata
	nextInput["content"] = content
	delete(nextInput, "params")
	delete(content, "params")
	return execution, nil
}

func (s Service) loadAgentExecutionConfig(ctx context.Context, identity string) (agentExecutionConfig, error) {
	agent, err := runtimecontext.ResolveAgent(ctx, identity)
	if err != nil {
		return agentExecutionConfig{}, err
	}
	modelPower, err := runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return agentExecutionConfig{}, err
	}
	modelSources, err := s.gateway.AvailablePowerSources(ctx, modelPower.Key)
	if err != nil {
		return agentExecutionConfig{}, err
	}
	if len(modelSources) == 0 {
		return agentExecutionConfig{}, fmt.Errorf("当前智能体的文本模型没有可用来源")
	}
	selectedModelTargetID := uint64(0)
	if energonservice.IsManualPowerSourceRule(modelPower.SourceRule) {
		selectedModelTargetID = modelSources[0].TargetID
	}
	tools := s.availableAgentTools(ctx, agent)
	return agentExecutionConfig{
		Agent:                 agent,
		ModelPower:            modelPower,
		ModelSources:          modelSources,
		SelectedModelTargetID: selectedModelTargetID,
		Tools:                 tools,
	}, nil
}

func agentToolPayload(tool energonmodel.Power) map[string]any {
	return map[string]any{
		"power_id":    tool.ID,
		"cate_id":     tool.CateID,
		"key":         tool.Key,
		"name":        tool.Name,
		"icon":        tool.Icon,
		"kind":        tool.Kind,
		"output_type": tool.OutputType,
	}
}

func agentPowerCategoryPayloads(ctx context.Context) []map[string]any {
	rows := energonmodel.NewPowerCateModel().Select(ctx, map[string]any{"status": 1})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"id": row.ID, "name": row.Name, "type": row.Type,
			"status": row.Status, "sort": row.Sort,
		})
	}
	return result
}

func (s Service) requireAgentTool(
	ctx context.Context,
	identity string,
	powerID uint64,
) (energonmodel.Power, error) {
	agent, err := runtimecontext.ResolveAgent(ctx, identity)
	if err != nil {
		return energonmodel.Power{}, err
	}
	if powerID == 0 || powerID == agent.LLMPowerID {
		return energonmodel.Power{}, fmt.Errorf("所选工具不属于当前智能体")
	}
	for _, tool := range s.gateway.AvailableToolPowers(ctx, []uint64{powerID}) {
		if tool.ID == powerID {
			return tool, nil
		}
	}
	return energonmodel.Power{}, fmt.Errorf("所选工具当前不可用")
}

func (s Service) availableAgentTools(ctx context.Context, agent agentmodel.Agent) []energonmodel.Power {
	rows := s.gateway.AvailableToolPowers(ctx, nil)
	result := make([]energonmodel.Power, 0, len(rows))
	for _, row := range rows {
		if row.ID != agent.LLMPowerID {
			result = append(result, row)
		}
	}
	return result
}

func applySpecificAgentTool(
	execution *AgentExecution,
	metadata map[string]any,
	tool energonmodel.Power,
	targetID uint64,
	fixedArguments map[string]any,
	visibleArguments map[string]any,
	required bool,
) {
	execution.PowerPolicy.AllowedPowerIDs = []uint64{tool.ID}
	execution.PowerPolicy.SelectedPowerID = tool.ID
	execution.PowerPolicy.SelectedTargetID = targetID
	execution.PowerPolicy.FixedParameterKeys = runtimeselection.FixedParameterKeys(fixedArguments)
	execution.PowerPolicy.FixedArguments = fixedArguments
	if required {
		execution.RequiredToolName = runtimeprovider.FunctionName("power_", tool.Key)
	}
	metadata["power_id"] = tool.ID
	metadata["tool_key"] = tool.Key
	metadata["tool_name"] = tool.Name
	metadata["tool_target_id"] = targetID
	metadata["tool_params"] = visibleArguments
}

func agentResumeFixedArguments(
	policy runtimetool.PowerPolicy,
	interactionArguments map[string]any,
	content map[string]any,
) map[string]any {
	result := cloneSelectionMap(interactionArguments)
	response := selectionRecord(content["interaction_response"])
	for key, value := range selectionRecord(response["data"]) {
		if strings.TrimSpace(key) != "" && key != runtimeprovider.MediaReferencesArgument {
			result[key] = value
		}
	}
	for key, value := range policy.Arguments(policy.SelectedPowerID) {
		result[key] = value
	}
	return result
}

func agentResumeMediaReferences(
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

func agentToolIDs(tools []energonmodel.Power) []uint64 {
	result := make([]uint64, 0, len(tools))
	for _, tool := range tools {
		result = append(result, tool.ID)
	}
	return result
}

func intersectAgentToolIDs(requested []uint64, tools []energonmodel.Power) []uint64 {
	available := make(map[uint64]struct{}, len(tools))
	for _, tool := range tools {
		available[tool.ID] = struct{}{}
	}
	result := make([]uint64, 0, len(requested))
	for _, powerID := range requested {
		if _, exists := available[powerID]; exists {
			result = append(result, powerID)
		}
	}
	return result
}

func agentToolByID(tools []energonmodel.Power, powerID uint64) (energonmodel.Power, bool) {
	for _, tool := range tools {
		if tool.ID == powerID {
			return tool, true
		}
	}
	return energonmodel.Power{}, false
}

func agentToolByFunctionName(tools []energonmodel.Power, name string) (energonmodel.Power, bool) {
	for _, tool := range tools {
		if runtimeprovider.FunctionName("power_", tool.Key) == name {
			return tool, true
		}
	}
	return energonmodel.Power{}, false
}

func resolveAgentToolMode(value string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", agentToolModeAuto:
		return agentToolModeAuto, nil
	case agentToolModeNone:
		return agentToolModeNone, nil
	case agentToolModeSpecific:
		return agentToolModeSpecific, nil
	default:
		return "", fmt.Errorf("工具调用模式无效")
	}
}

func cloneSelectionMap(value map[string]any) map[string]any {
	result := make(map[string]any, len(value))
	for key, current := range value {
		result[key] = current
	}
	return result
}

func selectionRecord(value any) map[string]any {
	row, _ := value.(map[string]any)
	if row == nil {
		return map[string]any{}
	}
	return row
}

func selectionText(value any) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(value))
}

func selectionUint64(value any) uint64 {
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
	}
	return 0
}
