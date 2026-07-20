package team

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/orm"

	teammodel "github.com/dever-package/bot/model/team"
	runtimeinteraction "github.com/dever-package/bot/service/agent/runtime/interaction"
)

func (s Service) SubmitInteraction(ctx context.Context, nodeRunID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	return s.submitResolvedInteraction(ctx, s.repo.FindNodeRun(ctx, nodeRunID), nil, interactionID, data)
}

func (s Service) SubmitProjectInteraction(ctx context.Context, projectID uint64, nodeRunID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	return s.submitResolvedInteraction(ctx, s.repo.FindNodeRun(ctx, nodeRunID), &projectID, interactionID, data)
}

func (s Service) SubmitRunInteraction(ctx context.Context, runID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	return s.submitResolvedRunInteraction(ctx, s.repo.FindRun(ctx, runID), nil, interactionID, data)
}

func (s Service) SubmitProjectRunInteraction(ctx context.Context, projectID uint64, runID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	return s.submitResolvedRunInteraction(ctx, s.repo.FindRun(ctx, runID), &projectID, interactionID, data)
}

func (s Service) submitResolvedInteraction(ctx context.Context, nodeRun *teammodel.NodeRun, projectID *uint64, interactionID string, data map[string]any) (map[string]any, error) {
	if nodeRun == nil {
		return nil, fmt.Errorf("待处理交互不存在")
	}
	if projectID != nil && (*projectID == 0 || nodeRun.ProjectID != *projectID) {
		return nil, fmt.Errorf("待处理交互不属于当前项目")
	}
	if nodeRun.Status != teammodel.RunStatusWaiting {
		return nil, fmt.Errorf("待处理交互已提交")
	}
	interaction := jsonMap(nodeRun.Interaction)
	expectedID := textValue(interaction["id"])
	interactionID = strings.TrimSpace(interactionID)
	if expectedID == "" || interactionID == "" || interactionID != expectedID {
		return nil, fmt.Errorf("交互标识无效")
	}
	if err := runtimeinteraction.ValidateResponse(interaction, data); err != nil {
		return nil, err
	}
	run := s.repo.FindRun(ctx, nodeRun.RunID)
	flowRun := s.repo.FindFlowRun(ctx, nodeRun.FlowRunID)
	if run == nil || flowRun == nil {
		return nil, fmt.Errorf("交互运行记录不完整")
	}
	if run.Status == teammodel.RunStatusCanceled {
		return nil, fmt.Errorf("运行已取消，不能继续提交信息")
	}
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		if !s.repo.ClaimNodeInteraction(tx, nodeRun.ID, data) {
			return fmt.Errorf("待处理交互已提交")
		}
		if !s.repo.UpdateRunUnlessCanceled(tx, run.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		}) {
			return fmt.Errorf("运行已取消，不能继续提交信息")
		}
		s.repo.UpdateFlowRun(tx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		})
		return nil
	}); err != nil {
		return nil, err
	}
	run.Status = teammodel.RunStatusRunning
	s.continueWaitingRun(context.Background(), *run, flowRun)
	return map[string]any{
		"run_id":         run.ID,
		"request_id":     run.RequestID,
		"node_run_id":    nodeRun.ID,
		"interaction_id": interactionID,
		"status":         teammodel.RunStatusRunning,
	}, nil
}

func (s Service) submitResolvedRunInteraction(ctx context.Context, run *teammodel.Run, projectID *uint64, interactionID string, data map[string]any) (map[string]any, error) {
	if run == nil {
		return nil, fmt.Errorf("待处理交互不存在")
	}
	if projectID != nil && (*projectID == 0 || run.ProjectID != *projectID) {
		return nil, fmt.Errorf("待处理交互不属于当前项目")
	}
	if run.Status != teammodel.RunStatusWaiting {
		return nil, fmt.Errorf("待处理交互已提交")
	}
	interaction := jsonMap(run.Interaction)
	expectedID := textValue(interaction["id"])
	interactionID = strings.TrimSpace(interactionID)
	if expectedID == "" || interactionID == "" || interactionID != expectedID {
		return nil, fmt.Errorf("交互标识无效")
	}
	if err := runtimeinteraction.ValidateResponse(interaction, data); err != nil {
		return nil, err
	}
	if !s.repo.ClaimRunInteraction(ctx, run.ID, data) {
		return nil, fmt.Errorf("待处理交互已提交")
	}
	run.Status = teammodel.RunStatusRunning
	s.runAsync(context.Background(), run.ID, func(ctx context.Context) {
		if isCanvasPowerRun(*run) {
			s.continueCanvasPowerRun(ctx, run.ID)
			return
		}
		s.executeRoleRun(ctx, run.ID)
	})
	return map[string]any{
		"run_id":         run.ID,
		"request_id":     run.RequestID,
		"interaction_id": interactionID,
		"status":         teammodel.RunStatusRunning,
	}, nil
}
