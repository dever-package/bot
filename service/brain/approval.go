package brain

import (
	"context"
	"fmt"
	"strings"
	"time"

	brainmodel "my/package/bot/model/brain"
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

func (s Service) submitResolvedApproval(ctx context.Context, approval brainmodel.Approval, decision string, comment string, data map[string]any) (map[string]any, error) {
	if approval.Status != brainmodel.RunStatusPending {
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
	thinkRun := s.repo.FindThinkRun(ctx, approval.ThinkRunID)
	run := s.repo.FindRun(ctx, approval.RunID)
	if nodeRun == nil || thinkRun == nil || run == nil {
		return nil, fmt.Errorf("人工确认运行记录不完整")
	}
	content := jsonMap(approval.Content)
	if len(data) > 0 {
		content["data"] = data
	}
	output := approvalOutput(approval.ID, decision, comment, content, data)
	now := time.Now()
	s.repo.UpdateApproval(ctx, approval.ID, map[string]any{
		"decision": decision,
		"comment":  strings.TrimSpace(comment),
		"status":   brainmodel.RunStatusSuccess,
	})
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status":      brainmodel.RunStatusSuccess,
		"output":      jsonText(output),
		"finished_at": now,
	})
	s.writeBlackboard(ctx, *run, *thinkRun, nodeRun.NodeKey, output, approvalSourceKind(content), approval.ID)
	s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{"status": brainmodel.RunStatusRunning})
	s.repo.UpdateRun(ctx, run.ID, map[string]any{"status": brainmodel.RunStatusRunning})
	if strings.EqualFold(textValue(jsonMap(run.Input)["_mode"]), "think") {
		go s.executeSingleThinkRun(context.Background(), run.ID, thinkRun.ThinkID, jsonMap(thinkRun.Input))
	} else {
		go s.executeBrainRun(context.Background(), run.ID)
	}
	return map[string]any{
		"approval_id": approval.ID,
		"run_id":      run.ID,
		"decision":    decision,
		"status":      brainmodel.RunStatusRunning,
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
	return map[string]any{
		"decision":    decision,
		"comment":     strings.TrimSpace(comment),
		"approved":    decision == "approved",
		"content":     content,
		"approval_id": approvalID,
	}
}

func approvalSourceKind(content map[string]any) string {
	if textValue(content["kind"]) == "power" || textValue(content["type"]) == "power" {
		return "power"
	}
	return "approval"
}
