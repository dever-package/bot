package team

import (
	"context"

	teammodel "my/package/bot/model/team"
)

var conversationRoleStages = []string{
	teammodel.RoleTypeChat,
	teammodel.RoleTypePlanner,
	teammodel.RoleTypeWorker,
	teammodel.RoleTypeReviewer,
}

func (s Service) executeConversationRun(ctx context.Context, run teammodel.Run, graph runtimeGraph, runInput map[string]any) (string, map[string]any, error) {
	input := executionInput(runInput)
	outputs := conversationOutputs(runInput["_conversation_outputs"])
	resumeRoleType := firstText(runInput["_resume_role_type"])
	resumeRoleID := uint64Value(runInput["_resume_role_id"])
	startIndex := conversationStageIndex(resumeRoleType)
	if startIndex < 0 {
		startIndex = 0
	}
	chatRoleID := uint64Value(runInput["_chat_role_id"])
	originalGoal := firstText(input["goal"], input["prompt"], input["requirement"], input["user_input"], "团队对话")
	workingInput := cloneInput(input)
	applyConversationOutputs(workingInput, outputs)

	for index := startIndex; index < len(conversationRoleStages); index++ {
		roleType := conversationRoleStages[index]
		role, ok := conversationRole(graph.Roles, roleType, conversationPreferredRoleID(roleType, chatRoleID, resumeRoleID, resumeRoleType))
		if !ok {
			continue
		}

		roleInput := conversationRoleInput(workingInput, outputs, roleType, originalGoal)
		status, output, err := s.executeStandaloneRole(ctx, run, graph.Team, role, roleInput)
		if status == teammodel.RunStatusWaiting {
			return status, conversationWaitingOutput(roleType, role, outputs, output), err
		}
		if err != nil {
			return status, conversationFinalOutput(outputs), err
		}

		outputs[roleType] = output
		workingInput[roleType+"_output"] = output
		workingInput["last_output"] = output
		delete(workingInput, "user_feedback")
	}

	return teammodel.RunStatusSuccess, conversationFinalOutput(outputs), nil
}

func conversationRole(roles []teammodel.Role, roleType string, preferredID uint64) (teammodel.Role, bool) {
	if preferredID > 0 {
		for _, role := range roles {
			if role.ID == preferredID && role.RoleType == roleType && role.Status == teammodel.StatusEnabled {
				return role, true
			}
		}
	}
	for _, role := range roles {
		if role.RoleType == roleType && role.Status == teammodel.StatusEnabled {
			return role, true
		}
	}
	return teammodel.Role{}, false
}

func conversationPreferredRoleID(roleType string, chatRoleID uint64, resumeRoleID uint64, resumeRoleType string) uint64 {
	if resumeRoleID > 0 && resumeRoleType == roleType {
		return resumeRoleID
	}
	if roleType == teammodel.RoleTypeChat {
		return chatRoleID
	}
	return 0
}

func conversationRoleInput(input map[string]any, outputs map[string]any, roleType string, originalGoal string) map[string]any {
	result := cloneInput(input)
	result["original_goal"] = originalGoal
	result["conversation_stage"] = roleType
	result["conversation_stage_name"] = conversationStageName(roleType)
	result["conversation_stage_order"] = conversationStageOrder(roleType)
	result["conversation_outputs"] = outputs
	stageGoal := conversationStageGoal(roleType, originalGoal)
	result["goal"] = stageGoal
	result["task"] = stageGoal
	return result
}

func conversationStageGoal(roleType string, originalGoal string) string {
	switch roleType {
	case teammodel.RoleTypeChat:
		return "你是沟通角色。先接收用户目标，识别缺失信息，并把需求整理成后续角色可执行的简明上下文。原始目标：" + originalGoal + "。如果信息不足，必须发起表单交互让用户选择或补充；如果信息足够，输出需求摘要和已确认约束，不要直接执行最终创作。"
	case teammodel.RoleTypePlanner:
		return "你是规划角色。基于沟通结果制定执行计划，明确任务拆分、依赖顺序、是否需要调用工作流或能力，以及执行角色下一步要产出什么。原始目标：" + originalGoal + "。输出要体现规划判断，不要写成沟通摘要。"
	case teammodel.RoleTypeWorker:
		return "你是执行角色。根据用户需求、沟通结果和规划输出查找合适能力或启动相关工作流；没有合适工作流时直接完成任务。原始目标：" + originalGoal + "。输出要体现实际执行过程和最终产物，不要重复规划角色的话。"
	case teammodel.RoleTypeReviewer:
		return "你是审核角色。检查执行结果是否满足用户目标，指出遗漏、风险和可改进点；如果通过，给出最终交付摘要和可选下一步建议。原始目标：" + originalGoal + "。输出要体现审查结论，不要重复执行角色正文。"
	default:
		return originalGoal
	}
}

func conversationStageName(roleType string) string {
	switch roleType {
	case teammodel.RoleTypeChat:
		return "沟通"
	case teammodel.RoleTypePlanner:
		return "规划"
	case teammodel.RoleTypeWorker:
		return "执行"
	case teammodel.RoleTypeReviewer:
		return "审核"
	default:
		return roleType
	}
}

func conversationStageOrder(roleType string) int {
	for index, stage := range conversationRoleStages {
		if stage == roleType {
			return (index + 1) * 10
		}
	}
	return 0
}

func conversationOutputs(value any) map[string]any {
	outputs := mapValue(value)
	if len(outputs) == 0 {
		return map[string]any{}
	}
	return cloneInput(outputs)
}

func applyConversationOutputs(input map[string]any, outputs map[string]any) {
	for _, roleType := range conversationRoleStages {
		if output, exists := outputs[roleType]; exists {
			input[roleType+"_output"] = output
			input["last_output"] = output
		}
	}
}

func conversationWaitingOutput(roleType string, role teammodel.Role, outputs map[string]any, output map[string]any) map[string]any {
	result := cloneInput(output)
	result["stage"] = roleType
	result["role"] = roleInputPayload(&role)
	result["conversation_outputs"] = outputs
	return result
}

func conversationFinalOutput(outputs map[string]any) map[string]any {
	for _, roleType := range []string{teammodel.RoleTypeWorker, teammodel.RoleTypeReviewer, teammodel.RoleTypePlanner, teammodel.RoleTypeChat} {
		output := mapValue(outputs[roleType])
		if len(output) == 0 {
			continue
		}
		result := cloneInput(output)
		if planner := mapValue(outputs[teammodel.RoleTypePlanner]); len(planner) > 0 {
			result["plan"] = planner
		}
		if reviewer := mapValue(outputs[teammodel.RoleTypeReviewer]); len(reviewer) > 0 && roleType != teammodel.RoleTypeReviewer {
			result["review"] = reviewer
		}
		return result
	}
	return map[string]any{}
}

func conversationStageIndex(roleType string) int {
	for index, stage := range conversationRoleStages {
		if stage == roleType {
			return index
		}
	}
	return -1
}
