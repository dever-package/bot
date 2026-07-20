package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	teammodel "github.com/dever-package/bot/model/team"
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
	if nodeRun == nil || flowRun == nil || run == nil {
		return nil, fmt.Errorf("人工确认运行记录不完整")
	}
	if run.Status == teammodel.RunStatusCanceled {
		return nil, fmt.Errorf("运行已取消，不能继续提交反馈")
	}
	if len(data) > 0 {
		content["data"] = data
	}
	output := approvalOutput(approval.ID, decision, comment, content, data)
	now := time.Now()
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		if !s.repo.ClaimApproval(tx, approval.ID, map[string]any{
			"decision": decision,
			"comment":  strings.TrimSpace(comment),
			"status":   teammodel.RunStatusSuccess,
		}) {
			return fmt.Errorf("人工确认已处理")
		}
		if !s.repo.UpdateRunUnlessCanceled(tx, run.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		}) {
			return fmt.Errorf("运行已取消，不能继续提交反馈")
		}
		s.repo.UpdateNodeRun(tx, nodeRun.ID, map[string]any{
			"status":      teammodel.RunStatusSuccess,
			"output":      jsonText(output),
			"error":       "",
			"finished_at": now,
		})
		s.writeBlackboard(tx, *run, *flowRun, nodeRun.NodeKey, output, "approval", approval.ID)
		s.repo.UpdateFlowRun(tx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		})
		return nil
	}); err != nil {
		return nil, err
	}
	s.continueWaitingRun(context.Background(), *run, flowRun)
	return map[string]any{
		"approval_id": approval.ID,
		"run_id":      run.ID,
		"request_id":  run.RequestID,
		"decision":    decision,
		"status":      teammodel.RunStatusRunning,
	}, nil
}

func approvalOutput(approvalID uint64, decision string, comment string, content map[string]any, data map[string]any) map[string]any {
	return map[string]any{
		"decision":    decision,
		"comment":     strings.TrimSpace(comment),
		"approved":    decision == "approved",
		"content":     content,
		"approval_id": approvalID,
	}
}
