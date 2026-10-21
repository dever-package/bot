package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/dever-package/bot/service/stream"
)

type canvasPowerExecution struct {
	request     CanvasPowerRunRequest
	power       PowerOption
	flow        teammodel.Flow
	requestID   string
	nodeKey     string
	nodeName    string
	runInput    map[string]any
	input       map[string]any
	run         *teammodel.Run
	flowRun     *teammodel.FlowRun
	nodeRun     *teammodel.NodeRun
	dynamicNode teammodel.FlowNode
	flowRunID   uint64
	nodeRunID   uint64
	release     func()
	canceled    bool
}

func newCanvasPowerExecution(prepared preparedCanvasPower) *canvasPowerExecution {
	req := prepared.request
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	nodeKey := normalizeKey("node", req.NodeKey)
	if prepared.workspaceRun {
		nodeKey = fmt.Sprintf("function:%d:%s", req.TeamPowerID, requestID)
	}
	nodeName := strings.TrimSpace(req.NodeName)
	if nodeName == "" {
		nodeName = prepared.power.Name
	}
	req.Billing.TeamID = prepared.teamID
	req.Billing.ProjectID = req.ProjectID
	runInput := canvasPowerRunInput(req)
	delete(runInput, writingRunKey)
	if req.SourceTargetID > 0 {
		runInput[CanvasPowerMetaSourceTargetID] = req.SourceTargetID
	}
	runInput[CanvasPowerMetaResumeMode] = CanvasPowerResumeMode
	runInput[CanvasPowerMetaContext] = map[string]any{
		"power_id":                               prepared.power.ID,
		"power_key":                              prepared.power.Key,
		"source_target_id":                       req.SourceTargetID,
		canvasPowerContextAllowedSourceTargetIDs: append([]uint64(nil), req.AllowedSourceTargetIDs...),
		canvasPowerContextStoryboardMaxShotDuration:     req.StoryboardMaxShotDuration,
		canvasPowerContextImageSequenceMode:             req.ImageSequenceMode,
		canvasPowerContextImageSequenceMinImages:        req.ImageSequenceMinImages,
		canvasPowerContextImageSequenceMaxImages:        req.ImageSequenceMaxImages,
		canvasPowerContextImageSequenceFrames:           cloneCanvasPowerSequenceFrames(req.ImageSequenceFrames),
		botprotocol.OptionImageSequenceMediaReferences:  canvasPowerConstraints(req).MediaReferences,
		botprotocol.OptionMediaReferencePromptContent:   req.PromptContent,
		botprotocol.OptionImageSequenceFixedConstraints: append([]string(nil), req.ImageSequenceFixedConstraints...),
		"flow_id":        prepared.flow.ID,
		"asset_cate_id":  req.AssetCateID,
		"canvas_id":      req.CanvasID,
		"node_key":       nodeKey,
		"node_name":      nodeName,
		"kind":           prepared.power.Kind,
		"persist_result": req.PersistResult,
	}
	if prepared.workspaceRun {
		runInput["_mode"] = "workspace_power"
		runInput[CanvasPowerMetaTeamPowerID] = req.TeamPowerID
	}
	if req.CanvasID > 0 {
		runInput["_canvas_id"] = req.CanvasID
	}
	attachRunBilling(runInput, req.Billing)
	return &canvasPowerExecution{
		request:   req,
		power:     prepared.power,
		flow:      prepared.flow,
		requestID: requestID,
		nodeKey:   nodeKey,
		nodeName:  nodeName,
		runInput:  runInput,
		input:     executionInput(runInput),
		dynamicNode: teammodel.FlowNode{
			NodeKey: nodeKey,
			Name:    nodeName,
			Type:    teammodel.NodeTypePower,
		},
	}
}

func (s Service) startCanvasPowerExecution(ctx context.Context, execution *canvasPowerExecution, releaseID uint64, teamID uint64) (context.Context, error) {
	now := time.Now()
	runRecord := map[string]any{
		"request_id":       execution.requestID,
		"child_request_id": execution.requestID,
		"project_id":       execution.request.ProjectID,
		"body_id":          execution.request.BodyID,
		"team_id":          teamID,
		"release_id":       releaseID,
		"input":            jsonText(execution.runInput),
		"output":           "{}",
		"error":            "",
		"status":           teammodel.RunStatusRunning,
		"started_at":       now,
		"created_at":       now,
		"updated_at":       now,
	}
	attachRunScope(ctx, runRecord)
	runID := s.repo.InsertRun(ctx, runRecord)
	if runID == 0 {
		return ctx, fmt.Errorf("创建画布能力运行失败")
	}
	execution.run = s.repo.FindRun(ctx, runID)
	if execution.run == nil {
		return ctx, fmt.Errorf("画布能力运行不存在")
	}

	executionContext, releaseExecution, claimed, executionErr := s.acquireRunExecution(ctx, execution.run.ID)
	if !claimed {
		return ctx, fmt.Errorf("画布能力运行已结束或已被其他进程接管")
	}
	execution.release = releaseExecution
	if executionErr != nil {
		return executionContext, s.failCanvasPowerStart(executionContext, execution, executionErr)
	}
	execution.request.Billing.RunID = execution.run.ID
	execution.request.Billing.TeamRunID = execution.run.ID
	s.writeRunEvent(executionContext, *execution.run, stream.EventRunStarted, map[string]any{
		"feature": stream.FeaturePower,
		"scope":   "run",
		"mode":    "canvas_power",
		"input":   execution.input,
		"power": map[string]any{
			"id":          execution.power.ID,
			"name":        execution.power.Name,
			"key":         execution.power.Key,
			"kind":        execution.power.Kind,
			"output_type": execution.power.OutputType,
		},
	})
	if execution.request.OnRunCreated != nil {
		if err := execution.request.OnRunCreated(execution.run.ID, execution.requestID); err != nil {
			return executionContext, s.failCanvasPowerStart(executionContext, execution, err)
		}
	}
	if current := s.repo.FindRun(executionContext, execution.run.ID); current != nil && current.Status == teammodel.RunStatusCanceled {
		execution.canceled = true
		return executionContext, nil
	}
	if err := s.startCanvasPowerRecords(executionContext, execution, now); err != nil {
		return executionContext, s.failCanvasPowerStart(executionContext, execution, err)
	}
	return executionContext, nil
}

func (s Service) startCanvasPowerRecords(ctx context.Context, execution *canvasPowerExecution, startedAt time.Time) error {
	var flowRun *teammodel.FlowRun
	var flowRunID, nodeRunID uint64
	var nodeRun *teammodel.NodeRun
	if err := withRunExecutionCommit(ctx, execution.run.ID, func(tx context.Context) error {
		if execution.flow.ID > 0 {
			flowRunID = s.repo.FindOrCreateFlowRun(tx, *execution.run, execution.flow, execution.input)
			flowRun = s.repo.FindFlowRun(tx, flowRunID)
			if flowRun == nil {
				return fmt.Errorf("创建工作流运行失败")
			}
			s.repo.UpdateFlowRun(tx, flowRun.ID, map[string]any{
				"status":     teammodel.RunStatusRunning,
				"started_at": startedAt,
			})
			flowRun.Status = teammodel.RunStatusRunning
		}
		nodeRunID = s.repo.FindOrCreateDynamicNodeRun(
			tx,
			*execution.run,
			teammodel.FlowRun{ID: flowRunID},
			execution.flow,
			0,
			execution.nodeKey,
			execution.nodeName,
			teammodel.NodeTypePower,
			execution.input,
		)
		if nodeRunID == 0 {
			return fmt.Errorf("创建能力节点运行失败")
		}
		if !s.repo.UpdateActiveNodeRun(tx, nodeRunID, map[string]any{"status": teammodel.RunStatusRunning, "started_at": startedAt, "child_request_id": execution.requestID}) {
			return fmt.Errorf("能力节点运行已结束或不存在")
		}
		nodeRun = s.repo.FindNodeRun(tx, nodeRunID)
		return nil
	}); err != nil {
		return err
	}
	execution.flowRun, execution.flowRunID = flowRun, flowRunID
	execution.nodeRun, execution.nodeRunID = nodeRun, nodeRunID
	if execution.flowRun != nil {
		s.writeFlowEvent(ctx, *execution.run, *execution.flowRun, execution.flow, stream.EventFlowStarted, map[string]any{
			"input":      execution.input,
			"started_at": startedAt.Format(time.RFC3339Nano),
		})
	}

	execution.request.Billing.TeamNodeRunID = execution.nodeRunID
	if execution.flowRun != nil && execution.nodeRun != nil {
		execution.nodeRun.Status = teammodel.RunStatusRunning
		s.writeNodeEvent(ctx, *execution.run, *execution.flowRun, execution.flow, execution.dynamicNode, *execution.nodeRun, stream.EventNodeStarted, map[string]any{
			"input":      execution.input,
			"started_at": startedAt.Format(time.RFC3339Nano),
		})
	}
	return nil
}

func (s Service) failCanvasPowerStart(ctx context.Context, execution *canvasPowerExecution, err error) error {
	defer execution.releaseRunLease()
	if execution.run != nil {
		if commitErr := s.finishCanvasPowerRecords(ctx, execution, teammodel.RunStatusFail, nil, err); commitErr != nil {
			return commitErr
		}
	}
	return err
}

func (execution *canvasPowerExecution) releaseRunLease() {
	if execution.release == nil {
		return
	}
	execution.release()
	execution.release = nil
}

func (s Service) completeCanvasPowerExecution(ctx context.Context, execution *canvasPowerExecution, output map[string]any, runErr error) (map[string]any, error) {
	if powerExecutionHandedOff(runErr) {
		return execution.result(teammodel.RunStatusRunning, output), runErr
	}
	status := teammodel.RunStatusSuccess
	if runErr != nil {
		status = teammodel.RunStatusFail
	}
	if current := s.repo.FindRun(ctx, execution.run.ID); current != nil && current.Status == teammodel.RunStatusCanceled {
		status = teammodel.RunStatusCanceled
		runErr = nil
	}
	if status == teammodel.RunStatusSuccess {
		if interaction := canvasPowerInteraction(output); len(interaction) > 0 {
			return s.waitCanvasPowerInteraction(
				ctx,
				*execution.run,
				execution.flowRun,
				execution.flow,
				execution.dynamicNode,
				execution.nodeRun,
				execution.flowRunID,
				execution.nodeRunID,
				output,
				interaction,
			)
		}
	}

	var asset *assetmodel.Asset
	var version *assetmodel.Version
	if status == teammodel.RunStatusSuccess && execution.request.PersistResult {
		asset, version, runErr = s.saveCanvasPowerResult(
			ctx,
			*execution.run,
			mapValue(execution.runInput[CanvasPowerMetaContext]),
			execution.nodeRunID,
			execution.requestID,
			output,
		)
		if runErr != nil || asset == nil || version == nil {
			if runErr == nil {
				runErr = fmt.Errorf("保存画布能力结果失败")
			}
			return execution.result(teammodel.RunStatusRunning, output), s.deferPowerFinalization(ctx, execution.run.ID, execution.nodeRunID, execution.requestID, runErr)
		}
	}

	if commitErr := s.finishCanvasPowerRecords(ctx, execution, status, output, runErr); commitErr != nil {
		return execution.result(teammodel.RunStatusRunning, output), s.deferPowerFinalization(ctx, execution.run.ID, execution.nodeRunID, execution.requestID, commitErr)
	}
	if runErr != nil {
		return map[string]any{
			"run_id":      execution.run.ID,
			"request_id":  execution.requestID,
			"node_run_id": execution.nodeRunID,
			"status":      status,
		}, runErr
	}

	result := execution.result(status, output)
	if asset != nil && version != nil {
		result["asset"] = s.asset.AssetDetailMap(ctx, *asset, version)
		result["version"] = assetservice.VersionToMap(*version)
	}
	return result, nil
}

func (s Service) finishCanvasPowerRecords(ctx context.Context, execution *canvasPowerExecution, status string, output map[string]any, runErr error) error {
	run, err := s.commitCanvasPowerRun(ctx, execution.run.ID, status, output, runErr, nil)
	if err != nil {
		return err
	}
	finishedAt := run.FinishedAt
	if execution.flowRun != nil && execution.nodeRun != nil {
		execution.nodeRun.Status = status
		if status == teammodel.RunStatusSuccess {
			s.writeNodeEvent(ctx, *execution.run, *execution.flowRun, execution.flow, execution.dynamicNode, *execution.nodeRun, stream.EventNodeOutput, map[string]any{
				"output": output,
			})
		}
		s.writeNodeEvent(ctx, *execution.run, *execution.flowRun, execution.flow, execution.dynamicNode, *execution.nodeRun, stream.EventNodeFinished, map[string]any{
			"output":      output,
			"error":       errorText(runErr),
			"finished_at": finishedAt.Format(time.RFC3339Nano),
		})
	}
	if execution.flowRun != nil {
		execution.flowRun.Status = status
		s.writeFlowEvent(ctx, *execution.run, *execution.flowRun, execution.flow, stream.EventFlowFinished, map[string]any{
			"output": output, "error": errorText(runErr), "finished_at": finishedAt.Format(time.RFC3339Nano),
		})
	}
	s.publishRunCompletion(ctx, *run, output, runErr)
	return nil
}

// 能力的父子状态只有一个提交边界，任何一张表失败都会回滚；通知由调用方在提交后发布。
func (s Service) commitCanvasPowerRun(ctx context.Context, runID uint64, status string, output map[string]any, runErr error, interaction map[string]any) (*teammodel.Run, error) {
	var completed *teammodel.Run
	err := withRunExecutionCommit(ctx, runID, func(tx context.Context) error {
		record := canvasPowerFinishRecord(status, output, runErr)
		for _, node := range s.repo.ListNodeRuns(tx, runID) {
			// 已提交节点事实不可重写，历史半提交只补齐父运行与未完成的投影。
			if teamRunTerminal(node.Status) {
				continue
			}
			if teammodel.NewNodeRunModel().Update(tx, map[string]any{"id": node.ID, "run_id": runID, "status": node.Status}, record) != 1 {
				return fmt.Errorf("保存能力节点运行结果失败")
			}
		}
		for _, flow := range s.repo.ListFlowRuns(tx, runID) {
			if teamRunTerminal(flow.Status) {
				continue
			}
			if teammodel.NewFlowRunModel().Update(tx, map[string]any{"id": flow.ID, "run_id": runID, "status": flow.Status}, record) != 1 {
				return fmt.Errorf("保存工作流运行结果失败")
			}
		}
		record["interaction"], record["interaction_response"] = jsonText(interaction), "{}"
		if !s.repo.UpdateRunUnlessCanceled(tx, runID, record) {
			return fmt.Errorf("保存能力运行结果失败")
		}
		completed = s.repo.FindRun(tx, runID)
		return nil
	})
	return completed, err
}

func (execution *canvasPowerExecution) result(status string, output map[string]any) map[string]any {
	return map[string]any{
		"run_id":      execution.run.ID,
		"request_id":  execution.requestID,
		"flow_run_id": execution.flowRunID,
		"node_run_id": execution.nodeRunID,
		"status":      status,
		"output":      output,
	}
}
