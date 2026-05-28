package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "my/package/bot/model/team"
)

func (s Service) SubmitApproval(ctx context.Context, approvalID uint64, decision string, comment string, data map[string]any) (map[string]any, error) {
	approval := s.repo.FindApproval(ctx, approvalID)
	if approval == nil {
		return nil, fmt.Errorf("人工确认不存在")
	}
	return s.submitResolvedApproval(ctx, *approval, decision, comment, data)
}

func (s Service) SubmitProjectApproval(ctx context.Context, projectID uint64, approvalID uint64, decision string, comment string, data map[string]any) (map[string]any, error) {
	approval := s.repo.FindApproval(ctx, approvalID)
	if approval == nil {
		return nil, fmt.Errorf("人工确认不存在")
	}
	run := s.repo.FindRunInProject(ctx, approval.RunID, projectID)
	if run == nil {
		return nil, fmt.Errorf("人工确认不属于当前项目")
	}
	return s.submitResolvedApproval(ctx, *approval, decision, comment, data)
}

func (s Service) submitResolvedApproval(ctx context.Context, approval teammodel.Approval, decision string, comment string, data map[string]any) (map[string]any, error) {
	if approval.Status != teammodel.RunStatusPending {
		return nil, fmt.Errorf("人工确认已处理")
	}
	decision = strings.ToLower(strings.TrimSpace(decision))
	if decision == "" {
		decision = "approved"
	}
	if decision != "approved" && decision != "rejected" {
		return nil, fmt.Errorf("人工确认结果只能是 approved 或 rejected")
	}
	nodeRun := s.repo.FindNodeRun(ctx, approval.NodeRunID)
	flowRun := s.repo.FindFlowRun(ctx, approval.FlowRunID)
	run := s.repo.FindRun(ctx, approval.RunID)
	content := jsonMap(approval.Content)
	if textValue(content["kind"]) == "role_interaction" {
		if run == nil {
			return nil, fmt.Errorf("人工确认运行记录不完整")
		}
		if len(data) > 0 {
			content["data"] = data
		}
		output := approvalOutput(approval.ID, decision, comment, content, data)
		return s.submitRoleInteractionApproval(ctx, approval, *run, decision, comment, output, time.Now())
	}
	if nodeRun == nil || flowRun == nil || run == nil {
		return nil, fmt.Errorf("人工确认运行记录不完整")
	}
	if len(data) > 0 {
		content["data"] = data
	}
	output := approvalOutput(approval.ID, decision, comment, content, data)
	now := time.Now()
	if textValue(content["kind"]) == "agent_interaction" {
		return s.submitAgentInteractionApproval(ctx, approval, *run, *flowRun, *nodeRun, decision, comment, output, now)
	}
	s.repo.UpdateApproval(ctx, approval.ID, map[string]any{
		"decision": decision,
		"comment":  strings.TrimSpace(comment),
		"status":   teammodel.RunStatusSuccess,
	})
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status":      teammodel.RunStatusSuccess,
		"output":      jsonText(output),
		"error":       "",
		"finished_at": now,
	})
	s.writeBlackboard(ctx, *run, *flowRun, nodeRun.NodeKey, output, approvalSourceKind(content), approval.ID)
	s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
		"status": teammodel.RunStatusRunning,
		"error":  "",
	})
	runRecord := map[string]any{
		"status": teammodel.RunStatusRunning,
		"error":  "",
	}
	requestID := renewRunRequestID(runRecord, run)
	s.repo.UpdateRun(ctx, run.ID, runRecord)
	s.continueWaitingRun(context.Background(), *run, flowRun)
	return map[string]any{
		"approval_id": approval.ID,
		"run_id":      run.ID,
		"request_id":  requestID,
		"decision":    decision,
		"status":      teammodel.RunStatusRunning,
	}, nil
}

func (s Service) submitAgentInteractionApproval(ctx context.Context, approval teammodel.Approval, run teammodel.Run, flowRun teammodel.FlowRun, nodeRun teammodel.NodeRun, decision string, comment string, output map[string]any, now time.Time) (map[string]any, error) {
	s.repo.UpdateApproval(ctx, approval.ID, map[string]any{
		"decision": decision,
		"comment":  strings.TrimSpace(comment),
		"status":   teammodel.RunStatusSuccess,
	})
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status": teammodel.RunStatusPending,
		"output": jsonText(map[string]any{
			"approval_id": approval.ID,
			"feedback":    output,
		}),
		"error": "",
	})
	s.writeBlackboard(ctx, run, flowRun, nodeInteractionFeedbackKey(nodeRun.NodeKey, nodeRun.NodeID), output, "approval", approval.ID)
	s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
		"status": teammodel.RunStatusRunning,
		"error":  "",
	})
	runRecord := map[string]any{
		"status": teammodel.RunStatusRunning,
		"error":  "",
	}
	requestID := renewRunRequestID(runRecord, &run)
	s.repo.UpdateRun(ctx, run.ID, runRecord)
	s.continueWaitingRun(context.Background(), run, &flowRun)
	return map[string]any{
		"approval_id":  approval.ID,
		"run_id":       run.ID,
		"request_id":   requestID,
		"decision":     decision,
		"status":       teammodel.RunStatusRunning,
		"submitted_at": now.Format(time.RFC3339Nano),
	}, nil
}

func (s Service) submitRoleInteractionApproval(ctx context.Context, approval teammodel.Approval, run teammodel.Run, decision string, comment string, output map[string]any, now time.Time) (map[string]any, error) {
	s.repo.UpdateApproval(ctx, approval.ID, map[string]any{
		"decision": decision,
		"comment":  strings.TrimSpace(comment),
		"status":   teammodel.RunStatusSuccess,
	})
	input := jsonMap(run.Input)
	previousOutput := jsonMap(run.Output)
	if outputs := mapValue(previousOutput["conversation_outputs"]); len(outputs) > 0 {
		input["_conversation_outputs"] = outputs
	}
	content := jsonMap(approval.Content)
	if role := mapValue(content["role"]); len(role) > 0 {
		input["_resume_role_id"] = uint64Value(role["id"])
		input["_resume_role_type"] = firstText(role["type"])
	}
	input["user_feedback"] = output
	runRecord := map[string]any{
		"input":      jsonText(input),
		"output":     jsonText(map[string]any{"approval_id": approval.ID, "feedback": output}),
		"status":     teammodel.RunStatusRunning,
		"error":      "",
		"updated_at": now,
	}
	requestID := renewRunRequestID(runRecord, &run)
	s.repo.UpdateRun(ctx, run.ID, runRecord)
	if textValue(input["_mode"]) == "conversation" {
		go s.executeTeamRun(context.Background(), run.ID)
	} else {
		go s.executeRoleRun(context.Background(), run.ID)
	}
	return map[string]any{
		"approval_id":  approval.ID,
		"run_id":       run.ID,
		"request_id":   requestID,
		"decision":     decision,
		"status":       teammodel.RunStatusRunning,
		"submitted_at": now.Format(time.RFC3339Nano),
	}, nil
}

func approvalOutput(approvalID uint64, decision string, comment string, content map[string]any, data map[string]any) map[string]any {
	if textValue(content["kind"]) == "power" || textValue(content["type"]) == "power" {
		if output := mapValue(data["output"]); len(output) > 0 {
			return map[string]any{
				"power":      firstText(data["power"], content["power"]),
				"params":     mapValue(data["params"]),
				"output":     output,
				"request_id": textValue(data["request_id"]),
			}
		}
		return map[string]any{
			"power":      firstText(data["power"], content["power"]),
			"params":     mapValue(data["params"]),
			"output":     data["output"],
			"request_id": textValue(data["request_id"]),
		}
	}
	if textValue(content["kind"]) == "agent_interaction" || textValue(content["kind"]) == "role_interaction" {
		return agentInteractionApprovalOutput(approvalID, decision, comment, content, data)
	}
	return map[string]any{
		"decision":    decision,
		"comment":     strings.TrimSpace(comment),
		"approved":    decision == "approved",
		"content":     content,
		"approval_id": approvalID,
	}
}

func agentInteractionApprovalOutput(approvalID uint64, decision string, comment string, content map[string]any, data map[string]any) map[string]any {
	output := map[string]any{
		"decision":    decision,
		"comment":     strings.TrimSpace(comment),
		"approved":    decision == "approved",
		"approval_id": approvalID,
	}
	if text := firstText(data["text"], comment); text != "" {
		output["text"] = text
	}
	if len(data) > 0 {
		output["data"] = data
	}
	if params := mapValue(data["params"]); len(params) > 0 {
		output["params"] = params
	}
	if interaction := mapValue(content["interaction"]); len(interaction) > 0 {
		output["interaction"] = interaction
	}
	return output
}

func approvalSourceKind(content map[string]any) string {
	if textValue(content["kind"]) == "power" || textValue(content["type"]) == "power" {
		return "power"
	}
	return "approval"
}
