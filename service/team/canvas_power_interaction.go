package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
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
) map[string]any {
	s.repo.UpdateRun(ctx, run.ID, map[string]any{
		"interaction":          jsonText(interaction),
		"interaction_response": "{}",
		"error":                "",
	})
	s.repo.UpdateNodeRun(ctx, nodeRunID, map[string]any{
		"status": teammodel.RunStatusWaiting,
		"output": jsonText(output),
		"error":  "",
	})
	if flowRun != nil && nodeRun != nil {
		nodeRun.Status = teammodel.RunStatusWaiting
		s.writeNodeEvent(ctx, run, *flowRun, flow, node, *nodeRun, stream.EventWaiting, map[string]any{
			"output":      output,
			"interaction": interaction,
		})
	}
	if flowRun != nil {
		s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusWaiting,
			"output": jsonText(output),
			"error":  "",
		})
		flowRun.Status = teammodel.RunStatusWaiting
		s.writeFlowEvent(ctx, run, *flowRun, flow, stream.EventWaiting, map[string]any{
			"output":      output,
			"interaction": interaction,
		})
	}
	s.finishRun(ctx, run.ID, teammodel.RunStatusWaiting, output, nil)
	return map[string]any{
		"run_id":      run.ID,
		"request_id":  run.RequestID,
		"flow_run_id": flowRunID,
		"node_run_id": nodeRunID,
		"status":      teammodel.RunStatusWaiting,
		"output":      output,
		"interaction": interaction,
	}
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
	power, ok := s.repo.FindPowerOption(
		ctx,
		uint64Value(resumeContext["power_id"]),
		firstText(resumeContext["power_key"]),
	)
	if !ok {
		s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, fmt.Errorf("恢复画布能力失败：能力不存在"))
		return
	}

	input, err := resumedCanvasPowerInput(*run, runInput)
	if err != nil {
		s.finishResumedCanvasPower(ctx, *run, teammodel.RunStatusFail, nil, err)
		return
	}
	requestID := strings.TrimSpace(run.ChildRequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	s.repo.UpdateRun(ctx, run.ID, map[string]any{
		"child_request_id":     requestID,
		"interaction":          "{}",
		"interaction_response": "{}",
		"error":                "",
	})
	markCanvasPowerRecordsRunning(ctx, s.repo, run.ID)

	billing := runBillingContext(*run)
	billing.RunID = run.ID
	billing.TeamID = run.TeamID
	billing.ProjectID = run.ProjectID
	billing.BusinessKey = requestID
	output, callErr := s.executePower(
		ctx,
		requestID,
		power,
		input,
		uint64Value(resumeContext["source_target_id"]),
		"",
		billing,
		nil,
	)
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
			latestCanvasPowerNodeRunID(ctx, s.repo, run.ID),
			requestID,
			output,
		)
		if saveErr != nil {
			status = teammodel.RunStatusFail
			callErr = saveErr
		}
	}
	s.finishResumedCanvasPower(ctx, *run, status, output, callErr)
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

func markCanvasPowerRecordsRunning(ctx context.Context, repo Repo, runID uint64) {
	for _, flowRun := range repo.ListFlowRuns(ctx, runID) {
		repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
		})
	}
	for _, nodeRun := range repo.ListNodeRuns(ctx, runID) {
		repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
			"status": teammodel.RunStatusRunning,
			"error":  "",
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
	for _, flowRun := range s.repo.ListFlowRuns(ctx, run.ID) {
		s.repo.UpdateFlowRun(ctx, flowRun.ID, canvasPowerFinishRecord(status, output, err))
	}
	for _, nodeRun := range s.repo.ListNodeRuns(ctx, run.ID) {
		s.repo.UpdateNodeRun(ctx, nodeRun.ID, canvasPowerFinishRecord(status, output, err))
	}
	s.repo.UpdateRun(ctx, run.ID, map[string]any{
		"interaction":          "{}",
		"interaction_response": "{}",
	})
	s.finishRun(ctx, run.ID, status, output, err)
}

func canvasPowerFinishRecord(status string, output map[string]any, err error) map[string]any {
	return map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"error":       errorText(err),
		"finished_at": time.Now(),
	}
}
