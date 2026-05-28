package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "my/package/bot/model/team"
	assetservice "my/package/bot/service/asset"
	energonservice "my/package/bot/service/energon"
	"my/package/bot/service/stream"
)

func (s Service) TeamList(ctx context.Context) (map[string]any, error) {
	teams := s.repo.ListEnabledTeams(ctx)
	rows := make([]map[string]any, 0, len(teams))
	for _, team := range teams {
		release := s.currentTeamRelease(ctx, team)
		if release == nil {
			continue
		}
		rows = append(rows, map[string]any{
			"id":             team.ID,
			"name":           team.Name,
			"description":    strings.TrimSpace(team.Description),
			"publish_status": normalizeTeamPublishStatus(team.PublishStatus),
			"release_id":     release.ID,
			"version":        release.Version,
			"can_create":     true,
			"created_at":     team.CreatedAt,
		})
	}
	return map[string]any{"items": rows}, nil
}

func (s Service) TypeList(ctx context.Context) (map[string]any, error) {
	return s.TeamList(ctx)
}

func (s Service) TeamDetail(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return nil, err
	}
	nodesByFlow := map[string]any{}
	nodeEdgesByFlow := map[string]any{}
	for _, flow := range graph.Flows {
		nodesByFlow[flow.Key] = flowNodePayloads(graph.NodesByFlowID[flow.ID])
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(
			graph.NodesByFlowID[flow.ID],
			graph.NodeEdgesByFlowID[flow.ID],
		)
	}
	teamPayload := map[string]any{
		"id":          graph.Team.ID,
		"name":        graph.Team.Name,
		"description": strings.TrimSpace(graph.Team.Description),
	}
	return map[string]any{
		"team": teamPayload,
		"type": teamPayload,
		"release": map[string]any{
			"id":         release.ID,
			"team_id":    release.TeamID,
			"version":    release.Version,
			"status":     release.Status,
			"created_at": release.CreatedAt,
		},
		"asset_cates":        assetCatePayloads(graph.AssetCates),
		"roles":              rolePayloads(graph.Roles),
		"flows":              flowPayloads(graph.Flows),
		"flow_edges":         flowEdgePayloads(graph.Flows, graph.FlowEdges),
		"nodes_by_flow":      nodesByFlow,
		"node_edges_by_flow": nodeEdgesByFlow,
	}, nil
}

func (s Service) TypeDetail(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	return s.TeamDetail(ctx, teamID, releaseID)
}

func (s Service) RuntimeGraph(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	return s.TeamDetail(ctx, teamID, releaseID)
}

func (s Service) CanvasConfig(ctx context.Context, releaseID uint64, flowID uint64) (map[string]any, error) {
	if releaseID == 0 {
		powers := s.repo.ListPowers(ctx)
		return map[string]any{
			"release_id":  0,
			"flow":        map[string]any{},
			"roles":       []GraphRole{},
			"teams":       s.publishedTeamOptions(ctx),
			"agents":      s.repo.ListAgents(ctx),
			"agent_cates": s.repo.ListAgentCates(ctx),
			"powers":      powers,
			"power_kinds": powerKindOptions(powers),
		}, nil
	}
	release, graph, err := s.runtimeGraphByRelease(ctx, 0, releaseID)
	if err != nil {
		return nil, err
	}
	flow := graph.findFlow(flowID)
	if flow.ID == 0 {
		return nil, fmt.Errorf("发布版本中不存在当前工作流")
	}
	powers := s.repo.ListPowers(ctx)
	return map[string]any{
		"release_id":       release.ID,
		"flow":             singleFlowPayload(flow),
		"default_agent_id": uint64Value(jsonMap(flow.Config)["default_agent_id"]),
		"roles":            rolePayloads(graph.Roles),
		"teams":            s.publishedTeamOptions(ctx),
		"agents":           s.repo.ListAgents(ctx),
		"agent_cates":      s.repo.ListAgentCates(ctx),
		"powers":           powers,
		"power_kinds":      powerKindOptions(powers),
	}, nil
}

func (s Service) CanvasPowerForm(ctx context.Context, releaseID uint64, flowID uint64, powerID uint64, powerKey string, targetID uint64) (map[string]any, error) {
	power, ok := s.repo.FindPowerOption(ctx, powerID, powerKey)
	if !ok {
		return nil, fmt.Errorf("能力不存在")
	}
	flow := teammodel.Flow{}
	if releaseID > 0 {
		_, graph, err := s.runtimeGraphByRelease(ctx, 0, releaseID)
		if err != nil {
			return nil, err
		}
		flow = graph.findFlow(flowID)
		if flow.ID == 0 {
			return nil, fmt.Errorf("发布版本中不存在当前工作流")
		}
	}
	form, err := s.gateway.PowerParamConfig(ctx, power.Key, targetID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"release_id":         releaseID,
		"flow":               singleFlowPayload(flow),
		"power":              power,
		"source_rule":        form.SourceRule,
		"selected_target_id": form.SelectedTargetID,
		"sources":            form.Sources,
		"params":             form.Params,
		"primary_param_key":  primaryPowerParamKey(form.Params),
	}, nil
}

func (s Service) RunCanvasPower(ctx context.Context, req CanvasPowerRunRequest) (map[string]any, error) {
	if req.ProjectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	var releaseID uint64
	var teamID uint64
	flow := teammodel.Flow{}
	if req.TeamID > 0 || req.ReleaseID > 0 {
		release, graph, err := s.runtimeGraphByRelease(ctx, req.TeamID, req.ReleaseID)
		if err != nil {
			return nil, err
		}
		releaseID = release.ID
		teamID = graph.Team.ID
		flow = graph.findFlow(req.FlowID)
		if flow.ID == 0 {
			return nil, fmt.Errorf("发布版本中不存在当前工作流")
		}
	}
	power, ok := s.repo.FindPowerOption(ctx, req.PowerID, req.PowerKey)
	if !ok {
		return nil, fmt.Errorf("能力不存在")
	}

	requestID := newRequestID()
	now := time.Now()
	input := mergeMaps(req.Input, req.Params)
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"team_id":    teamID,
		"release_id": releaseID,
		"input":      jsonText(input),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	})
	if runID == 0 {
		return nil, fmt.Errorf("创建画布能力运行失败")
	}
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return nil, fmt.Errorf("画布能力运行不存在")
	}
	s.writeRunEvent(ctx, *run, stream.EventRunStarted, map[string]any{
		"feature": stream.FeaturePower,
		"scope":   "run",
		"mode":    "canvas_power",
		"input":   input,
		"power": map[string]any{
			"id":   power.ID,
			"name": power.Name,
			"key":  power.Key,
			"kind": power.Kind,
		},
	})
	var flowRunID uint64
	var flowRun *teammodel.FlowRun
	if flow.ID > 0 {
		flowRunID = s.repo.FindOrCreateFlowRun(ctx, *run, flow, input)
		flowRun = s.repo.FindFlowRun(ctx, flowRunID)
		if flowRun == nil {
			return nil, fmt.Errorf("创建工作流运行失败")
		}
		s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status":     teammodel.RunStatusRunning,
			"started_at": now,
		})
		flowRun.Status = teammodel.RunStatusRunning
		s.writeFlowEvent(ctx, *run, *flowRun, flow, stream.EventFlowStarted, map[string]any{
			"input":      input,
			"started_at": now.Format(time.RFC3339Nano),
		})
	}
	nodeKey := normalizeKey("node", req.NodeKey)
	nodeName := strings.TrimSpace(req.NodeName)
	if nodeName == "" {
		nodeName = power.Name
	}
	var nodeRunID uint64
	if flow.ID > 0 && flowRun != nil {
		nodeRunID = s.repo.FindOrCreateDynamicNodeRun(ctx, *run, *flowRun, flow, 0, nodeKey, nodeName, teammodel.NodeTypePower, input)
	}
	s.repo.UpdateNodeRun(ctx, nodeRunID, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
	})
	nodeRun := s.repo.FindNodeRun(ctx, nodeRunID)
	dynamicNode := teammodel.FlowNode{
		NodeKey: nodeKey,
		Name:    nodeName,
		Type:    teammodel.NodeTypePower,
	}
	if flowRun != nil && nodeRun != nil {
		nodeRun.Status = teammodel.RunStatusRunning
		s.writeNodeEvent(ctx, *run, *flowRun, flow, dynamicNode, *nodeRun, stream.EventNodeStarted, map[string]any{
			"input":      input,
			"started_at": now.Format(time.RFC3339Nano),
		})
	}

	output, err := s.callCanvasPower(ctx, requestID, power, input, req.SourceTargetID)
	status := teammodel.RunStatusSuccess
	if err != nil {
		status = teammodel.RunStatusFail
	}
	finishedAt := time.Now()
	nodeRecord := map[string]any{
		"status":      status,
		"output":      jsonText(output),
		"finished_at": finishedAt,
	}
	if err != nil {
		nodeRecord["error"] = err.Error()
	}
	s.repo.UpdateNodeRun(ctx, nodeRunID, nodeRecord)
	if flowRun != nil && nodeRun != nil {
		nodeRun.Status = status
		if status == teammodel.RunStatusSuccess {
			s.writeNodeEvent(ctx, *run, *flowRun, flow, dynamicNode, *nodeRun, stream.EventNodeOutput, map[string]any{
				"output": output,
			})
		}
		s.writeNodeEvent(ctx, *run, *flowRun, flow, dynamicNode, *nodeRun, stream.EventNodeFinished, map[string]any{
			"output":      output,
			"error":       errorText(err),
			"finished_at": finishedAt.Format(time.RFC3339Nano),
		})
	}
	if flowRun != nil {
		s.repo.UpdateFlowRun(ctx, flowRun.ID, map[string]any{
			"status":      status,
			"output":      jsonText(output),
			"error":       errorText(err),
			"finished_at": finishedAt,
		})
		flowRun.Status = status
		s.writeFlowEvent(ctx, *run, *flowRun, flow, stream.EventFlowFinished, map[string]any{
			"output":      output,
			"error":       errorText(err),
			"finished_at": finishedAt.Format(time.RFC3339Nano),
		})
	}
	s.finishRun(ctx, run.ID, status, output, err)
	if err != nil {
		return map[string]any{
			"run_id":      run.ID,
			"request_id":  requestID,
			"node_run_id": nodeRunID,
			"status":      status,
		}, err
	}

	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID: req.ProjectID,
		BodyID:    req.BodyID,
		TeamID:    teamID,
		FlowID:    flow.ID,
		RunID:     run.ID,
		NodeRunID: nodeRunID,
		ReleaseID: releaseID,
		Name:      nodeName,
		Kind:      power.Kind,
		Content:   output,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"run_id":      run.ID,
		"request_id":  requestID,
		"flow_run_id": flowRunID,
		"node_run_id": nodeRunID,
		"status":      status,
		"output":      output,
		"asset":       assetservice.AssetToMap(*asset),
		"version":     assetservice.VersionToMap(*version),
	}, nil
}

func (s Service) ListProjectAssets(ctx context.Context, projectID uint64, flowID uint64, kind string) (map[string]any, error) {
	if projectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	return s.asset.ListProject(ctx, projectID, flowID, kind)
}

func (s Service) ProjectAssetDetail(ctx context.Context, projectID uint64, assetID uint64) (map[string]any, error) {
	return s.asset.ProjectDetail(ctx, projectID, assetID)
}

func (s Service) runtimeGraphByRelease(ctx context.Context, teamID uint64, releaseID uint64) (*teammodel.TeamRelease, runtimeGraph, error) {
	var team teammodel.Team
	var err error
	if releaseID > 0 {
		release := s.repo.FindTeamRelease(ctx, releaseID)
		if release == nil {
			return nil, runtimeGraph{}, fmt.Errorf("发布版本不存在")
		}
		if teamID > 0 && release.TeamID != teamID {
			return nil, runtimeGraph{}, fmt.Errorf("发布版本不属于当前团队")
		}
		team, err = s.repo.FindTeam(ctx, release.TeamID)
		if err != nil {
			return nil, runtimeGraph{}, err
		}
		graph, err := runtimeGraphFromRelease(*release)
		return release, graph, err
	}
	if teamID == 0 {
		return nil, runtimeGraph{}, fmt.Errorf("团队不能为空")
	}
	team, err = s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return nil, runtimeGraph{}, err
	}
	release, err := s.runnableTeamRelease(ctx, team)
	if err != nil {
		return nil, runtimeGraph{}, err
	}
	graph, err := runtimeGraphFromRelease(*release)
	return release, graph, err
}

func (s Service) callCanvasPower(ctx context.Context, requestID string, power PowerOption, input map[string]any, sourceTargetID uint64) (map[string]any, error) {
	sourceTargetID = resolveSourceTargetID(sourceTargetID, input)
	body := map[string]any{
		"protocol": "shemic",
		"power":    power.Key,
		"input":    input,
		"history":  []any{},
		"options":  map[string]any{"stream": false},
	}
	if sourceTargetID > 0 {
		body["source_target_id"] = sourceTargetID
	}
	resp := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: requestID,
		Method:    "POST",
		Path:      "/bot/energon/request",
		Body:      body,
	})
	payload := resp.Payload()
	if resp.Status != 1 {
		return powerOutputValue(payload["output"], power.Kind), fmt.Errorf("%s", firstText(payload["msg"], "能力运行失败"))
	}
	return powerOutputValue(payload["output"], power.Kind), nil
}

func powerOutputValue(raw any, kind string) map[string]any {
	if row := mapValue(raw); len(row) > 0 {
		return row
	}
	if values, ok := raw.([]any); ok {
		list := stringSlice(values)
		if len(list) > 0 {
			return map[string]any{powerOutputListKey(kind): list}
		}
	}
	if text := textValue(raw); text != "" {
		return map[string]any{powerOutputScalarKey(kind): text}
	}
	return map[string]any{}
}

func powerOutputScalarKey(kind string) string {
	switch assetservice.NormalizeKind(kind) {
	case "image":
		return "image"
	case "video":
		return "video"
	case "audio":
		return "audio"
	case "file":
		return "file"
	default:
		return "text"
	}
}

func powerOutputListKey(kind string) string {
	switch assetservice.NormalizeKind(kind) {
	case "image":
		return "images"
	case "video":
		return "videos"
	case "audio":
		return "audios"
	case "file":
		return "files"
	default:
		return "texts"
	}
}

func primaryPowerParamKey(params []energonservice.PowerParam) string {
	for _, param := range params {
		if param.Usage != 1 || strings.TrimSpace(param.Key) == "" {
			continue
		}
		switch strings.TrimSpace(param.Type) {
		case "textarea", "input":
			return strings.TrimSpace(param.Key)
		}
	}
	for _, param := range params {
		if strings.TrimSpace(param.Key) == "" {
			continue
		}
		switch strings.TrimSpace(param.Type) {
		case "textarea", "input":
			return strings.TrimSpace(param.Key)
		}
	}
	return ""
}

func resolveSourceTargetID(explicit uint64, input map[string]any) uint64 {
	if explicit > 0 {
		return explicit
	}
	for _, key := range []string{"source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"} {
		if id := uint64Value(input[key]); id > 0 {
			return id
		}
	}
	return 0
}

func singleFlowPayload(flow teammodel.Flow) GraphFlow {
	rows := flowPayloads([]teammodel.Flow{flow})
	if len(rows) == 0 {
		return GraphFlow{}
	}
	return rows[0]
}

func (s Service) publishedTeamOptions(ctx context.Context) []TeamOption {
	teams := s.repo.ListEnabledTeams(ctx)
	result := make([]TeamOption, 0, len(teams))
	for _, team := range teams {
		release := s.currentTeamRelease(ctx, team)
		if release == nil {
			continue
		}
		snapshot, err := releaseSnapshotFromText(release.Snapshot)
		if err != nil {
			continue
		}
		result = append(result, TeamOption{
			ID:        team.ID,
			CateID:    team.CateID,
			ReleaseID: release.ID,
			Name:      team.Name,
			Flows:     snapshot.Flows,
			Roles:     snapshot.Roles,
		})
	}
	return result
}

func mergeMaps(items ...map[string]any) map[string]any {
	result := map[string]any{}
	for _, item := range items {
		for key, value := range item {
			result[key] = value
		}
	}
	return result
}
