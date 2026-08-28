package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	userservice "github.com/dever-package/user/service"
)

func (tools projectAssistantTools) handleCanvasInspect(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	assetCateID := tools.assetCateID(call.Arguments)
	bundle, err := tools.workspace.Canvas(ctx, tools.scope.ProjectID, tools.scope.CanvasID, assetCateID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	canvas := mapValue(bundle["canvas"])
	config, configErr := tools.project.CanvasConfig(ctx, tools.scope.ProjectID, 0)
	flows, flowErr := tools.project.AssistantFlows(ctx, tools.scope.ProjectID)
	content := map[string]any{
		"project_id":      tools.scope.ProjectID,
		"canvas_id":       tools.scope.CanvasID,
		"asset_cate_id":   assetCateID,
		"revision":        assistantCanvasRevision(canvas),
		"canvas":          limitedAssistantCanvas(canvas),
		"assets":          bundle["assets"],
		"assistant_flows": flows,
	}
	if configErr == nil {
		content["catalog"] = map[string]any{
			"roles":        config["roles"],
			"powers":       config["powers"],
			"flows":        config["flows"],
			"output_types": config["output_types"],
		}
	}
	if flowErr != nil {
		content["flows_warning"] = flowErr.Error()
	}
	return runtimeprovider.Result{
		Text:    "已读取当前项目画布",
		Content: content,
	}, nil
}

func (tools projectAssistantTools) handleCanvasPreviewPatch(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	assetCateID := tools.assetCateID(call.Arguments)
	patch, err := decodeAssistantCanvasPatch(call.Arguments["patch"])
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	bundle, err := tools.workspace.Canvas(ctx, tools.scope.ProjectID, tools.scope.CanvasID, assetCateID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	canvas := mapValue(bundle["canvas"])
	next, summary, err := applyAssistantCanvasPatch(canvas, patch)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	catalog, err := tools.project.assistantCanvasCatalog(ctx, tools.scope.ProjectID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	if err = validateAssistantCanvasReferences(next, catalog); err != nil {
		return runtimeprovider.Result{}, err
	}
	return tools.previewConfirmation(ctx, call, assistantConfirmation{
		Action:        assistantActionCanvasPatch,
		BaseRevision:  assistantCanvasRevision(canvas),
		InteractionID: assistantInteractionID("canvas", call),
		Payload: map[string]any{
			"canvas_id":     tools.scope.CanvasID,
			"asset_cate_id": assetCateID,
			"patch":         patch,
		},
	}, "确认修改画布", "画布修改待确认", map[string]any{
		"kind": "canvas_patch", "summary": summary,
	})
}

func (tools projectAssistantTools) handleCanvasApplyPatch(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	confirmation, canceled, err := tools.confirmedCanvasAction(ctx, call, assistantActionCanvasPatch)
	if err != nil || canceled {
		return assistantCanceledResult("已取消画布修改", canceled), err
	}
	assetCateID := uint64Value(confirmation.Payload["asset_cate_id"])
	patch, err := decodeAssistantCanvasPatch(confirmation.Payload["patch"])
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	canvas, summary, err := tools.workspace.applyAssistantCanvasPatch(
		ctx,
		tools.scope.ProjectID,
		tools.scope.CanvasID,
		assetCateID,
		confirmation.BaseRevision,
		patch,
	)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	revision := assistantCanvasRevision(canvas)
	return runtimeprovider.Result{
		Text: "画布修改已保存",
		Content: map[string]any{
			"asset_cate_id": assetCateID,
			"revision":      revision,
			"summary":       summary,
		},
		Presentation: map[string]any{
			"canvas_change": map[string]any{
				"canvas_id":     tools.scope.CanvasID,
				"asset_cate_id": assetCateID,
				"revision":      revision,
			},
		},
	}, nil
}

func (tools projectAssistantTools) handleCanvasPreviewExecution(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	assetCateID := tools.assetCateID(call.Arguments)
	startNodeID := strings.TrimSpace(fmt.Sprint(call.Arguments["start_node_id"]))
	singleNode := assistantArgumentBool(call.Arguments, "single_node")
	bundle, err := tools.workspace.Canvas(ctx, tools.scope.ProjectID, tools.scope.CanvasID, assetCateID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	canvas := mapValue(bundle["canvas"])
	if err = validateAssistantCanvasRun(canvas, startNodeID, singleNode); err != nil {
		return runtimeprovider.Result{}, err
	}
	input := cloneInput(mapValue(call.Arguments["input"]))
	return tools.previewConfirmation(ctx, call, assistantConfirmation{
		Action:        assistantActionCanvasRun,
		BaseRevision:  assistantCanvasRevision(canvas),
		InteractionID: assistantInteractionID("canvas-run", call),
		Payload: map[string]any{
			"canvas_id":     tools.scope.CanvasID,
			"asset_cate_id": assetCateID,
			"start_node_id": startNodeID,
			"single_node":   singleNode,
			"input":         input,
		},
	}, "确认运行画布", "画布运行待确认", map[string]any{
		"kind": "canvas_run", "asset_cate_id": assetCateID,
		"start_node_id": startNodeID, "single_node": singleNode,
	})
}

func (tools projectAssistantTools) handleCanvasExecute(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	confirmation, canceled, err := tools.confirmedCanvasAction(ctx, call, assistantActionCanvasRun)
	if err != nil || canceled {
		return assistantCanceledResult("已取消画布运行", canceled), err
	}
	assetCateID := uint64Value(confirmation.Payload["asset_cate_id"])
	bundle, err := tools.workspace.Canvas(ctx, tools.scope.ProjectID, tools.scope.CanvasID, assetCateID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	canvas := mapValue(bundle["canvas"])
	result, err := tools.workspace.RunCanvas(ctx, CanvasRunRequest{
		ProjectID:   tools.scope.ProjectID,
		CanvasID:    tools.scope.CanvasID,
		AssetCateID: assetCateID,
		StartNodeID: textValue(confirmation.Payload["start_node_id"]),
		SingleNode:  assistantBoolValue(confirmation.Payload["single_node"]),
		Canvas:      canvas,
		Input:       cloneInput(mapValue(confirmation.Payload["input"])),
	})
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	task := assistantRunTaskPayload("canvas", "画布运行", result)
	return runtimeprovider.Result{
		Text:         "画布运行已启动",
		Content:      result,
		Presentation: map[string]any{"task": task},
	}, nil
}

func (tools projectAssistantTools) handleTeamListFlows(
	ctx context.Context,
	_ runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	flows, err := tools.project.AssistantFlows(ctx, tools.scope.ProjectID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	return runtimeprovider.Result{
		Text: "已读取画布助手可调用的团队流程",
		Content: map[string]any{
			"project_id": tools.scope.ProjectID,
			"flows":      flows,
		},
	}, nil
}

func (tools projectAssistantTools) handleTeamPreviewFlowRun(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	flowID := runtimeprovider.ArgumentUint64(call.Arguments, "flow_id")
	flow, err := tools.project.RequireAssistantFlow(ctx, tools.scope.ProjectID, flowID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	goal := strings.TrimSpace(fmt.Sprint(call.Arguments["goal"]))
	if goal == "" {
		return runtimeprovider.Result{}, fmt.Errorf("协作目标不能为空")
	}
	input := cloneInput(mapValue(call.Arguments["input"]))
	input["goal"] = goal
	return tools.previewConfirmation(ctx, call, assistantConfirmation{
		Action:        assistantActionFlowRun,
		InteractionID: assistantInteractionID("team-flow", call),
		Payload: map[string]any{
			"flow_id": flow.ID,
			"goal":    goal,
			"input":   input,
		},
	}, "确认启动团队流程", "团队流程运行待确认", map[string]any{
		"kind": "team_flow", "flow_id": flow.ID, "title": flow.Name, "goal": goal,
	})
}

func (tools projectAssistantTools) handleTeamRunFlow(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	confirmation, canceled, err := tools.confirmedAction(ctx, call, assistantActionFlowRun, "")
	if err != nil || canceled {
		return assistantCanceledResult("已取消团队流程运行", canceled), err
	}
	flowID := uint64Value(confirmation.Payload["flow_id"])
	flow, err := tools.project.RequireAssistantFlow(ctx, tools.scope.ProjectID, flowID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	result, err := tools.project.RunAssistantFlow(
		ctx,
		tools.scope.ProjectID,
		flow.ID,
		cloneInput(mapValue(confirmation.Payload["input"])),
	)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	task := assistantFlowTaskPayload(flow, result)
	return runtimeprovider.Result{
		Text:         "团队流程已启动",
		Content:      result,
		Presentation: map[string]any{"task": task},
	}, nil
}

func (tools projectAssistantTools) handleTeamRunStatus(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	runID := runtimeprovider.ArgumentUint64(call.Arguments, "run_id")
	requestID := strings.TrimSpace(fmt.Sprint(call.Arguments["request_id"]))
	result, err := tools.project.RunStatus(ctx, tools.scope.ProjectID, runID, requestID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	task := assistantRunTaskPayload("project", "项目任务", result)
	response := runtimeprovider.Result{
		Text:         "已更新项目任务状态",
		Content:      result,
		Presentation: map[string]any{"task": task},
	}
	if pending, ok := findAssistantPendingRunInteraction(result, ""); ok {
		response.Text = "项目任务等待补充信息"
		response.Interaction = pending.Interaction
		response.Terminal = true
	}
	return response, nil
}

func (tools projectAssistantTools) handleTeamSubmitInteraction(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	runID := runtimeprovider.ArgumentUint64(call.Arguments, "run_id")
	requestID := strings.TrimSpace(fmt.Sprint(call.Arguments["request_id"]))
	interactionID := strings.TrimSpace(fmt.Sprint(call.Arguments["_interaction_id"]))
	data := cloneInput(mapValue(call.Arguments["_interaction_data"]))
	if interactionID == "" {
		return runtimeprovider.Result{}, fmt.Errorf("任务交互标识不能为空")
	}
	status, err := tools.project.RunStatus(ctx, tools.scope.ProjectID, runID, requestID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	pending, ok := findAssistantPendingRunInteraction(status, interactionID)
	if !ok {
		return runtimeprovider.Result{}, fmt.Errorf("待处理任务交互已失效，请重新查询任务状态")
	}
	if pending.ApprovalID > 0 {
		decision, comment, approvalData, responseErr := assistantApprovalResponse(data)
		if responseErr != nil {
			return runtimeprovider.Result{}, responseErr
		}
		status, err = tools.project.SubmitApproval(
			ctx, tools.scope.ProjectID, pending.ApprovalID, decision, comment, approvalData,
		)
	} else if pending.NodeRunID > 0 {
		status, err = tools.project.SubmitInteraction(
			ctx, tools.scope.ProjectID, pending.NodeRunID, interactionID, data,
		)
	} else {
		status, err = tools.project.SubmitRunInteraction(
			ctx, tools.scope.ProjectID, pending.RunID, interactionID, data,
		)
	}
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	task := assistantRunTaskPayload("project", "项目任务", status)
	return runtimeprovider.Result{
		Text:         "已提交补充信息，项目任务继续运行",
		Content:      status,
		Presentation: map[string]any{"task": task},
	}, nil
}

func (tools projectAssistantTools) handleTeamPreviewRunStop(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	runID := runtimeprovider.ArgumentUint64(call.Arguments, "run_id")
	requestID := strings.TrimSpace(fmt.Sprint(call.Arguments["request_id"]))
	status, err := tools.project.RunStatus(ctx, tools.scope.ProjectID, runID, requestID)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	resolvedRunID, resolvedRequestID := assistantRunReference(status)
	return tools.previewConfirmation(ctx, call, assistantConfirmation{
		Action:        assistantActionRunStop,
		InteractionID: assistantInteractionID("run-stop", call),
		Payload: map[string]any{
			"run_id":     resolvedRunID,
			"request_id": resolvedRequestID,
		},
	}, "确认停止项目任务", "停止任务待确认", map[string]any{
		"kind": "run_stop", "task": assistantRunTaskPayload("project", "项目任务", status),
	})
}

func (tools projectAssistantTools) handleTeamRunStop(
	ctx context.Context,
	call runtimeprovider.Call,
) (runtimeprovider.Result, error) {
	confirmation, canceled, err := tools.confirmedAction(ctx, call, assistantActionRunStop, "")
	if err != nil || canceled {
		return assistantCanceledResult("已取消停止项目任务", canceled), err
	}
	result, err := tools.project.StopRun(
		ctx,
		tools.scope.ProjectID,
		uint64Value(confirmation.Payload["run_id"]),
		textValue(confirmation.Payload["request_id"]),
	)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	task := assistantRunTaskPayload("project", "项目任务", result)
	return runtimeprovider.Result{
		Text:         "项目任务已停止",
		Content:      result,
		Presentation: map[string]any{"task": task},
	}, nil
}

func (tools projectAssistantTools) previewConfirmation(
	ctx context.Context,
	_ runtimeprovider.Call,
	confirmation assistantConfirmation,
	interactionTitle string,
	text string,
	operation map[string]any,
) (runtimeprovider.Result, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	confirmation.ProjectID = tools.scope.ProjectID
	confirmation.CanvasID = tools.scope.CanvasID
	confirmation.SessionID = tools.scope.SessionID
	confirmation.UserID = actor.UserID
	confirmation.ExpiresAt = time.Now().Add(assistantConfirmationTTL).Unix()
	token, err := encodeAssistantConfirmation(confirmation)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	operation["status"] = "awaiting_confirmation"
	return runtimeprovider.Result{
		Text: text,
		Content: map[string]any{
			"confirmation_token": token,
			"operation":          operation,
		},
		Interaction:  assistantConfirmationInteraction(confirmation.InteractionID, interactionTitle),
		Presentation: map[string]any{"operation": operation},
		Terminal:     true,
	}, nil
}

func (tools projectAssistantTools) confirmedCanvasAction(
	ctx context.Context,
	call runtimeprovider.Call,
	action string,
) (assistantConfirmation, bool, error) {
	token := strings.TrimSpace(fmt.Sprint(call.Arguments["confirmation_token"]))
	confirmation, err := decodeAssistantConfirmation(token)
	if err != nil {
		return assistantConfirmation{}, false, err
	}
	assetCateID := uint64Value(confirmation.Payload["asset_cate_id"])
	if canvasID := uint64Value(confirmation.Payload["canvas_id"]); canvasID != tools.scope.CanvasID {
		return assistantConfirmation{}, false, fmt.Errorf("确认凭证不属于当前画布")
	}
	bundle, err := tools.workspace.Canvas(ctx, tools.scope.ProjectID, tools.scope.CanvasID, assetCateID)
	if err != nil {
		return assistantConfirmation{}, false, err
	}
	return tools.confirmedActionValue(ctx, call, action, assistantCanvasRevision(mapValue(bundle["canvas"])), confirmation)
}

func (tools projectAssistantTools) confirmedAction(
	ctx context.Context,
	call runtimeprovider.Call,
	action string,
	revision string,
) (assistantConfirmation, bool, error) {
	token := strings.TrimSpace(fmt.Sprint(call.Arguments["confirmation_token"]))
	confirmation, err := decodeAssistantConfirmation(token)
	if err != nil {
		return assistantConfirmation{}, false, err
	}
	return tools.confirmedActionValue(ctx, call, action, revision, confirmation)
}

func (tools projectAssistantTools) confirmedActionValue(
	ctx context.Context,
	call runtimeprovider.Call,
	action string,
	revision string,
	confirmation assistantConfirmation,
) (assistantConfirmation, bool, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return assistantConfirmation{}, false, err
	}
	interactionID := strings.TrimSpace(fmt.Sprint(call.Arguments["_interaction_id"]))
	decision := strings.ToLower(strings.TrimSpace(fmt.Sprint(call.Arguments["_decision"])))
	if decision != assistantDecisionConfirm && decision != assistantDecisionCancel {
		return assistantConfirmation{}, false, fmt.Errorf("请先在预览卡片中确认或取消")
	}
	validation := assistantConfirmationValidation{
		Action:        action,
		ProjectID:     tools.scope.ProjectID,
		CanvasID:      tools.scope.CanvasID,
		SessionID:     tools.scope.SessionID,
		UserID:        actor.UserID,
		InteractionID: interactionID,
		Decision:      assistantDecisionConfirm,
		Revision:      revision,
		Now:           time.Now(),
	}
	if err = validateAssistantConfirmation(confirmation, validation); err != nil {
		return assistantConfirmation{}, false, err
	}
	return confirmation, decision == assistantDecisionCancel, nil
}

func (tools projectAssistantTools) assetCateID(_ map[string]any) uint64 {
	return tools.scope.AssetCateID
}

func assistantInteractionID(prefix string, call runtimeprovider.Call) string {
	id := strings.TrimSpace(call.ID)
	if id == "" {
		id = strings.TrimSpace(call.RequestID)
	}
	return prefix + "-confirm-" + id
}

func assistantCanceledResult(text string, canceled bool) runtimeprovider.Result {
	if !canceled {
		return runtimeprovider.Result{}
	}
	return runtimeprovider.Result{
		Text:    text,
		Content: map[string]any{"canceled": true},
	}
}

func assistantRunTaskPayload(kind string, title string, result map[string]any) map[string]any {
	run := mapValue(result["run"])
	runID, requestID := assistantRunReference(result)
	return map[string]any{
		"kind":       kind,
		"title":      strings.TrimSpace(title),
		"run_id":     runID,
		"request_id": requestID,
		"status":     firstText(result["status"], run["status"]),
		"updated_at": firstPresent(result["updated_at"], run["updated_at"], result["created_at"], run["created_at"]),
	}
}

func limitedAssistantCanvas(canvas map[string]any) map[string]any {
	result := cloneInput(canvas)
	nodes := sliceValue(canvas["nodes"])
	edges := sliceValue(canvas["edges"])
	const maxNodes = 160
	const maxEdges = 320
	result["node_count"] = len(nodes)
	result["edge_count"] = len(edges)
	if len(nodes) > maxNodes {
		result["nodes"] = nodes[:maxNodes]
		result["nodes_truncated"] = true
	}
	if len(edges) > maxEdges {
		result["edges"] = edges[:maxEdges]
		result["edges_truncated"] = true
	}
	return result
}

func validateAssistantCanvasRun(canvas map[string]any, startNodeID string, singleNode bool) error {
	nodes, edges, err := parseCanvasRunGraph(canvas)
	if err != nil {
		return err
	}
	nodesByID := canvasRunNodeMap(nodes)
	if err = validateCanvasGroups(nodesByID, edges); err != nil {
		return err
	}
	if err = validateCanvasRunGraph(nodesByID, edges); err != nil {
		return err
	}
	startNode, exists := nodesByID[strings.TrimSpace(startNodeID)]
	if !exists {
		return fmt.Errorf("开始节点不存在")
	}
	if !singleNode && !isCanvasStartNode(startNode) {
		return fmt.Errorf("请选择开始节点运行")
	}
	return validateReachableCanvasGroups(nodesByID, edges, strings.TrimSpace(startNodeID), singleNode)
}

func assistantArgumentBool(arguments map[string]any, key string) bool {
	return assistantBoolValue(arguments[key])
}

func assistantBoolValue(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case string:
		return strings.EqualFold(strings.TrimSpace(current), "true") || strings.TrimSpace(current) == "1"
	case float64:
		return current != 0
	case int:
		return current != 0
	default:
		return false
	}
}
