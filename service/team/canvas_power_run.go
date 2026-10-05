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
	if req.SourceTargetID > 0 {
		runInput[CanvasPowerMetaSourceTargetID] = req.SourceTargetID
	}
	runInput[CanvasPowerMetaResumeMode] = CanvasPowerResumeMode
	runInput[CanvasPowerMetaContext] = map[string]any{
		"power_id":                               prepared.power.ID,
		"power_key":                              prepared.power.Key,
		"source_target_id":                       req.SourceTargetID,
		canvasPowerContextAllowedSourceTargetIDs: append([]uint64(nil), req.AllowedSourceTargetIDs...),
		canvasPowerContextStoryboardMaxShotDuration:    req.StoryboardMaxShotDuration,
		canvasPowerContextImageSequenceMode:            req.ImageSequenceMode,
		canvasPowerContextImageSequenceMinImages:       req.ImageSequenceMinImages,
		canvasPowerContextImageSequenceMaxImages:       req.ImageSequenceMaxImages,
		canvasPowerContextImageSequenceFrames:          cloneCanvasPowerSequenceFrames(req.ImageSequenceFrames),
		botprotocol.OptionImageSequenceMediaReferences: canvasPowerConstraints(req).MediaReferences,
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
		"request_id": execution.requestID,
		"project_id": execution.request.ProjectID,
		"body_id":    execution.request.BodyID,
		"team_id":    teamID,
		"release_id": releaseID,
		"input":      jsonText(execution.runInput),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
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
	if execution.flow.ID > 0 {
		execution.flowRunID = s.repo.FindOrCreateFlowRun(ctx, *execution.run, execution.flow, execution.input)
		execution.flowRun = s.repo.FindFlowRun(ctx, execution.flowRunID)
		if execution.flowRun == nil {
			return fmt.Errorf("创建工作流运行失败")
		}
		s.repo.UpdateFlowRun(ctx, execution.flowRun.ID, map[string]any{
			"status":     teammodel.RunStatusRunning,
			"started_at": startedAt,
		})
		execution.flowRun.Status = teammodel.RunStatusRunning
		s.writeFlowEvent(ctx, *execution.run, *execution.flowRun, execution.flow, stream.EventFlowStarted, map[string]any{
			"input":      execution.input,
			"started_at": startedAt.Format(time.RFC3339Nano),
		})

		execution.nodeRunID = s.repo.FindOrCreateDynamicNodeRun(
			ctx,
			*execution.run,
			*execution.flowRun,
			execution.flow,
			0,
			execution.nodeKey,
			execution.nodeName,
			teammodel.NodeTypePower,
			execution.input,
		)
		if execution.nodeRunID == 0 {
			return fmt.Errorf("创建能力节点运行失败")
		}
	}
	s.repo.UpdateNodeRun(ctx, execution.nodeRunID, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"started_at": startedAt,
	})
	execution.nodeRun = s.repo.FindNodeRun(ctx, execution.nodeRunID)
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
	if execution.run != nil {
		s.finishCanvasPowerRecords(ctx, execution, teammodel.RunStatusFail, nil, err)
		s.finishRun(ctx, execution.run.ID, teammodel.RunStatusFail, nil, err)
	}
	execution.releaseRunLease()
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
			), nil
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
			status = teammodel.RunStatusFail
			if runErr == nil {
				runErr = fmt.Errorf("保存画布能力结果失败")
			}
		}
	}

	s.finishCanvasPowerRecords(ctx, execution, status, output, runErr)
	s.finishRun(ctx, execution.run.ID, status, output, runErr)
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

func (s Service) finishCanvasPowerRecords(ctx context.Context, execution *canvasPowerExecution, status string, output map[string]any, runErr error) {
	finishedAt := time.Now()
	nodeRecord := map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"finished_at": finishedAt,
	}
	if runErr != nil {
		nodeRecord["error"] = runErr.Error()
	}
	s.repo.UpdateNodeRun(ctx, execution.nodeRunID, nodeRecord)
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
	if execution.flowRun == nil {
		return
	}
	s.repo.UpdateFlowRun(ctx, execution.flowRun.ID, map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"error":       errorText(runErr),
		"finished_at": finishedAt,
	})
	execution.flowRun.Status = status
	s.writeFlowEvent(ctx, *execution.run, *execution.flowRun, execution.flow, stream.EventFlowFinished, map[string]any{
		"output":      output,
		"error":       errorText(runErr),
		"finished_at": finishedAt.Format(time.RFC3339Nano),
	})
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
