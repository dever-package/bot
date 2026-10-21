package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/dever-package/bot/service/stream"
)

func canvasPowerInteraction(output map[string]any) map[string]any {
	for _, current := range []map[string]any{
		output,
		mapValue(output["output"]),
		mapValue(output["result"]),
	} {
		interaction := mapValue(current["interaction"])
		if firstText(interaction["id"]) != "" && firstText(interaction["type"]) != "" {
			return interaction
		}
	}
	return nil
}

func (s Service) waitCanvasPowerInteraction(
	ctx context.Context,
	run teammodel.Run,
	flowRun *teammodel.FlowRun,
	flow teammodel.Flow,
	node teammodel.FlowNode,
	nodeRun *teammodel.NodeRun,
	flowRunID uint64,
	nodeRunID uint64,
	output map[string]any,
	interaction map[string]any,
) (map[string]any, error) {
	completed, commitErr := s.commitCanvasPowerRun(ctx, run.ID, teammodel.RunStatusWaiting, output, nil, interaction)
	if commitErr != nil {
		commitErr = s.deferPowerFinalization(ctx, run.ID, nodeRunID, run.ChildRequestID, commitErr)
		return map[string]any{"run_id": run.ID, "request_id": run.RequestID, "status": teammodel.RunStatusRunning, "error": commitErr.Error()}, commitErr
	}
	if flowRun != nil && nodeRun != nil {
		nodeRun.Status = teammodel.RunStatusWaiting
		s.writeNodeEvent(ctx, run, *flowRun, flow, node, *nodeRun, stream.EventWaiting, map[string]any{
			"output":      output,
			"interaction": interaction,
		})
	}
	if flowRun != nil {
		flowRun.Status = teammodel.RunStatusWaiting
		s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventWaiting, map[string]any{
			"output":      output,
			"interaction": interaction,
		})
	}
	s.publishRunCompletion(ctx, *completed, output, nil)
	return map[string]any{
		"run_id":      run.ID,
		"request_id":  run.RequestID,
		"flow_run_id": flowRunID,
		"node_run_id": nodeRunID,
		"status":      teammodel.RunStatusWaiting,
		"output":      output,
		"interaction": interaction,
	}, nil
}

func isCanvasPowerRun(run teammodel.Run) bool {
	return firstText(jsonMap(run.Input)[CanvasPowerMetaResumeMode]) == CanvasPowerResumeMode
}

func invalidWaitingCanvasPowerRun(run *teammodel.Run) bool {
	if run == nil || run.Status != teammodel.RunStatusWaiting || !isCanvasPowerRun(*run) {
		return false
	}
	interaction := jsonMap(run.Interaction)
	return firstText(interaction["id"]) == "" || firstText(interaction["type"]) == ""
}

func (s Service) failInterruptedCanvasPowerRun(ctx context.Context, run teammodel.Run) {
	s.runAsync(ctx, run.ID, func(ctx context.Context) {
		current := s.repo.FindRun(ctx, run.ID)
		if current == nil || teamRunTerminal(current.Status) {
			return
		}
		err := fmt.Errorf("画布能力运行已中断，请重新执行")
		s.finishResumedCanvasPower(ctx, *current, teammodel.RunStatusFail, nil, err)
	})
}

func (s Service) continueCanvasPowerRun(ctx context.Context, runID uint64) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil || run.Status == teammodel.RunStatusCanceled {
		return
	}
	runInput := jsonMap(run.Input)
	resumeContext := mapValue(runInput[CanvasPowerMetaContext])
	requestID := strings.TrimSpace(run.ChildRequestID)
	if requestID == "" {
		// 首次能力调用沿用 Run.RequestID；旧记录未填 child_request_id 时也不能新建提交身份。
		requestID = strings.TrimSpace(run.RequestID)
	}
	if requestID == "" {
		s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, fmt.Errorf("原能力调用身份缺失，未重新提交"))
		return
	}
	nodeRunID := latestCanvasPowerNodeRunID(ctx, s.repo, run.ID)
	node := s.repo.FindNodeRun(ctx, nodeRunID)
	if node != nil {
		if nodeRequestID := strings.TrimSpace(node.ChildRequestID); nodeRequestID != "" && nodeRequestID != requestID {
			s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, fmt.Errorf("能力调用身份冲突，未重新提交"))
			return
		}
	}
	if len(jsonMap(run.InteractionResponse)) > 0 {
		requestID = bottask.ChildRequestID(requestID, "selection")
	}
	if node != nil && teamRunTerminal(node.Status) {
		// 旧版本可能已提交节点结果、尚未提交父运行。不得再经过 executePower 的活动节点写入。
		if identityErr := completedCanvasPowerIdentity(*run, *node, requestID); identityErr != nil {
			s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, identityErr)
			return
		}
		var completedErr error
		if node.Error != "" {
			completedErr = fmt.Errorf("%s", node.Error)
		}
		s.finishResumedCanvasPower(ctx, *run, node.Status, jsonMap(node.Output), completedErr)
		return
	}

	power, ok := s.repo.FindPowerOption(
		ctx,
		uint64Value(resumeContext["power_id"]),
		firstText(resumeContext["power_key"]),
	)
	if !ok {
		s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, fmt.Errorf("恢复画布能力失败：能力不存在"))
		return
	}

	input := executionInput(runInput)
	var err error
	if len(jsonMap(run.InteractionResponse)) > 0 {
		input, err = resumedCanvasPowerInput(*run, runInput)
	}
	if err != nil {
		s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, err)
		return
	}

	if err := s.startResumedCanvasPowerRecords(ctx, run.ID, requestID); err != nil {
		_ = s.deferPowerFinalization(ctx, run.ID, nodeRunID, requestID, err)
		return
	}

	billing := runBillingContext(*run)
	billing.RunID = run.ID
	billing.TeamRunID = run.ID
	billing.TeamNodeRunID = nodeRunID
	billing.TeamID = run.TeamID
	billing.ProjectID = run.ProjectID
	billing.BusinessKey = requestID
	output, callErr := s.executePower(
		ctx,
		requestID,
		power,
		input,
		resumedCanvasPowerConstraints(resumeContext),
		billing,
		nil,
	)
	if powerExecutionHandedOff(callErr) {
		return
	}
	status := teammodel.RunStatusSuccess
	if callErr != nil {
		status = teammodel.RunStatusFail
	}
	if current := s.repo.FindRun(ctx, run.ID); current != nil && current.Status == teammodel.RunStatusCanceled {
		status = teammodel.RunStatusCanceled
		callErr = nil
	}
	if status == teammodel.RunStatusSuccess {
		_, _, saveErr := s.saveCanvasPowerResult(
			ctx,
			*run,
			resumeContext,
			billing.TeamNodeRunID,
			requestID,
			output,
		)
		if saveErr != nil {
			_ = s.deferPowerFinalization(ctx, run.ID, billing.TeamNodeRunID, requestID, saveErr)
			return
		}
	}
	s.finishResumedCanvasPower(ctx, *run, status, output, callErr)
}

func completedCanvasPowerIdentity(run teammodel.Run, node teammodel.NodeRun, requestID string) error {
	if node.RunID != run.ID || strings.TrimSpace(node.RequestID) != strings.TrimSpace(run.RequestID) || (node.ChildRequestID != "" && node.ChildRequestID != requestID) {
		return fmt.Errorf("能力调用身份冲突，未重新提交")
	}
	if node.Status != teammodel.RunStatusSuccess {
		return nil
	}
	checkpoints, err := decodeNodeExecutionCheckpoints(node.ExecutionCheckpoint)
	if err != nil {
		return err
	}
	checkpoint, exists := checkpoints.Requests[requestID]
	if !exists || checkpoint.RequestID != requestID || checkpoint.Stage != bottask.ExecutionFinalized || checkpoint.Persisted == nil {
		return fmt.Errorf("原能力完成回执缺失，未重新提交")
	}
	return nil
}

func resumedCanvasPowerInput(run teammodel.Run, runInput map[string]any) (map[string]any, error) {
	response := jsonMap(run.InteractionResponse)
	interaction := jsonMap(run.Interaction)
	sessionID := firstText(
		response["session_id"],
		response["sessionId"],
		valueAtMap(interaction, "lip_sync", "session_id"),
	)
	faceID := firstText(response["face_id"], response["faceId"])
	if sessionID == "" || faceID == "" {
		return nil, fmt.Errorf("恢复口型同步失败：缺少识别会话或目标角色")
	}
	input := executionInput(runInput)
	for key, value := range response {
		if strings.TrimSpace(key) != "" {
			input[key] = value
		}
	}
	input["session_id"] = sessionID
	input["face_id"] = faceID
	return input, nil
}

func valueAtMap(source map[string]any, keys ...string) any {
	var current any = source
	for _, key := range keys {
		mapped := mapValue(current)
		if mapped == nil {
			return nil
		}
		current = mapped[key]
	}
	return current
}

func (s Service) startResumedCanvasPowerRecords(ctx context.Context, runID uint64, requestID string) error {
	return withRunExecutionCommit(ctx, runID, func(tx context.Context) error {
		s.repo.UpdateRun(tx, runID, map[string]any{"child_request_id": requestID, "interaction": "{}", "interaction_response": "{}", "error": ""})
		markCanvasPowerRecordsRunning(tx, s.repo, runID, requestID)
		return nil
	})
}

func markCanvasPowerRecordsRunning(ctx context.Context, repo Repo, runID uint64, requestID string) {
	for _, flowRun := range repo.ListFlowRuns(ctx, runID) {
		if teamRunTerminal(flowRun.Status) {
			continue
		}
		repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		})
	}
	for _, nodeRun := range repo.ListNodeRuns(ctx, runID) {
		if teamRunTerminal(nodeRun.Status) {
			continue
		}
		repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
			"status":           teammodel.RunStatusRunning,
			"error":            "",
			"child_request_id": requestID,
		})
	}
}

func latestCanvasPowerNodeRunID(ctx context.Context, repo Repo, runID uint64) uint64 {
	var result uint64
	for _, nodeRun := range repo.ListNodeRuns(ctx, runID) {
		if nodeRun.ID > result {
			result = nodeRun.ID
		}
	}
	return result
}

func (s Service) finishResumedCanvasPower(
	ctx context.Context,
	run teammodel.Run,
	status string,
	output map[string]any,
	err error,
) {
	completed, commitErr := s.commitCanvasPowerRun(ctx, run.ID, status, output, err, nil)
	if commitErr != nil {
		_ = s.deferPowerFinalization(ctx, run.ID, latestCanvasPowerNodeRunID(ctx, s.repo, run.ID), run.ChildRequestID, commitErr)
		return
	}
	s.publishRunCompletion(ctx, *completed, output, err)
}

func canvasPowerFinishRecord(status string, output map[string]any, err error) map[string]any {
	record := map[string]any{
		"status": status, "output": jsonText(output), "error": errorText(err), "updated_at": time.Now(), "finished_at": nil,
	}
	if teamRunTerminal(status) {
		record["finished_at"] = time.Now()
	}
	return record
}
