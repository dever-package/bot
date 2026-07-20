package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	"github.com/dever-package/bot/service/stream"
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
			"id":              team.ID,
			"name":            team.Name,
			"description":     strings.TrimSpace(team.Description),
			"publish_status":  normalizeTeamPublishStatus(team.PublishStatus),
			"release_id":      release.ID,
			"version":         release.Version,
			"project_enabled": releaseProjectEnabled(release),
			"can_create":      releaseProjectEnabled(release),
			"created_at":      team.CreatedAt,
		})
	}
	return map[string]any{"items": rows}, nil
}

func releaseProjectEnabled(release *teammodel.TeamRelease) bool {
	if release == nil {
		return false
	}
	snapshot, err := releaseSnapshotFromText(release.Snapshot)
	if err != nil {
		return false
	}
	return snapshot.Team.ProjectEnabled != teammodel.StatusDisabled
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
		"id":              graph.Team.ID,
		"name":            graph.Team.Name,
		"description":     strings.TrimSpace(graph.Team.Description),
		"project_enabled": graph.Team.ProjectEnabled == teammodel.StatusEnabled,
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
		"team_powers":        teamPowerPayloads(graph.TeamPowers),
		"roles":              rolePayloads(graph.Roles),
		"flows":              flowPayloads(graph.Flows),
		"flow_edges":         flowEdgePayloads(graph.Flows, graph.FlowEdges),
		"nodes_by_flow":      nodesByFlow,
		"node_edges_by_flow": nodeEdgesByFlow,
	}, nil
}

func (s Service) RuntimeGraph(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	return s.TeamDetail(ctx, teamID, releaseID)
}

func (s Service) CanvasConfig(ctx context.Context, releaseID uint64, flowID uint64) (map[string]any, error) {
	if releaseID == 0 {
		powers := s.repo.ListPowers(ctx)
		return map[string]any{
			"release_id":      0,
			"flow":            map[string]any{},
			"roles":           []GraphRole{},
			"teams":           s.publishedTeamOptions(ctx),
			"agents":          s.repo.ListAgents(ctx),
			"agent_cates":     s.repo.ListAgentCates(ctx),
			"knowledge_cates": s.repo.ListKnowledgeCates(ctx),
			"knowledge_bases": s.repo.ListKnowledgeBases(ctx),
			"powers":          powers,
			"power_kinds":     powerKindOptions(powers),
			"output_types":    energonmodel.OutputTypeSpecs(),
		}, nil
	}
	release, graph, err := s.runtimeGraphByRelease(ctx, 0, releaseID)
	if err != nil {
		return nil, err
	}
	flow := teammodel.Flow{}
	if flowID > 0 {
		flow = graph.findFlow(flowID)
		if flow.ID == 0 {
			return nil, fmt.Errorf("发布版本中不存在当前工作流")
		}
	}
	powers := scopedPowerOptions(s.repo.ListPowers(ctx), graph.TeamPowers)
	return map[string]any{
		"release_id":       release.ID,
		"flow":             singleFlowPayload(flow),
		"default_agent_id": uint64Value(jsonMap(flow.Config)["default_agent_id"]),
		"roles":            rolePayloads(graph.Roles),
		"teams":            s.publishedTeamOptions(ctx),
		"agents":           s.repo.ListAgents(ctx),
		"agent_cates":      s.repo.ListAgentCates(ctx),
		"knowledge_cates":  s.repo.ListKnowledgeCates(ctx),
		"knowledge_bases":  s.repo.ListKnowledgeBases(ctx),
		"powers":           powers,
		"power_kinds":      powerKindOptions(powers),
		"output_types":     energonmodel.OutputTypeSpecs(),
	}, nil
}

// ValidateCanvasAgent ensures a canvas node uses the agent assigned to a role
// in the current team release snapshot.
func (s Service) ValidateCanvasAgent(ctx context.Context, releaseID uint64, roleID uint64, agentID uint64) error {
	if releaseID == 0 {
		return fmt.Errorf("当前项目未绑定已发布团队")
	}
	if roleID == 0 {
		return fmt.Errorf("智能体节点未配置团队角色")
	}
	if agentID == 0 {
		return fmt.Errorf("智能体节点未配置智能体")
	}
	_, graph, err := s.runtimeGraphByRelease(ctx, 0, releaseID)
	if err != nil {
		return err
	}
	for _, role := range graph.Roles {
		if role.ID != roleID || role.Status != teammodel.StatusEnabled {
			continue
		}
		if role.AgentID != agentID {
			return fmt.Errorf("智能体与当前团队角色不匹配")
		}
		return nil
	}
	return fmt.Errorf("当前团队发布版本中不存在该角色")
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
		if !powerAllowedByScope(graph.TeamPowers, power.ID) {
			return nil, fmt.Errorf("当前团队不允许使用该能力")
		}
		if flowID > 0 {
			flow = graph.findFlow(flowID)
			if flow.ID == 0 {
				return nil, fmt.Errorf("发布版本中不存在当前工作流")
			}
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
	workspaceRun := req.ProjectID == 0
	if req.ProjectID == 0 && req.BodyID == 0 {
		return nil, fmt.Errorf("项目或团队工作区不能为空")
	}
	var releaseID uint64
	var teamID uint64
	flow := teammodel.Flow{}
	teamPowers := []teammodel.TeamPower{}
	if req.TeamID > 0 || req.ReleaseID > 0 {
		release, graph, err := s.runtimeGraphByRelease(ctx, req.TeamID, req.ReleaseID)
		if err != nil {
			return nil, err
		}
		releaseID = release.ID
		teamID = graph.Team.ID
		teamPowers = graph.TeamPowers
		if req.FlowID > 0 {
			flow = graph.findFlow(req.FlowID)
			if flow.ID == 0 {
				return nil, fmt.Errorf("发布版本中不存在当前工作流")
			}
		}
	}
	if workspaceRun {
		if req.TeamPowerID == 0 {
			return nil, fmt.Errorf("团队能力不能为空")
		}
		matched := false
		for _, teamPower := range teamPowers {
			if teamPower.ID != req.TeamPowerID || teamPower.Status != teammodel.StatusEnabled {
				continue
			}
			req.PowerID = teamPower.PowerID
			req.PowerKey = ""
			matched = true
			break
		}
		if !matched {
			return nil, fmt.Errorf("当前团队发布版本中不存在该能力")
		}
	}
	power, ok := s.repo.FindPowerOption(ctx, req.PowerID, req.PowerKey)
	if !ok {
		return nil, fmt.Errorf("能力不存在")
	}
	if !powerAllowedByScope(teamPowers, power.ID) {
		return nil, fmt.Errorf("当前团队不允许使用该能力")
	}
	form, err := s.gateway.PowerParamConfig(ctx, power.Key, req.SourceTargetID)
	if err != nil {
		return nil, err
	}
	req.SourceTargetID = form.SelectedTargetID
	req.Params = energonservice.ApplyPowerParamDefaults(req.Params, form.Params)

	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	nodeKey := normalizeKey("node", req.NodeKey)
	if workspaceRun {
		nodeKey = fmt.Sprintf("function:%d:%s", req.TeamPowerID, requestID)
	}
	nodeName := strings.TrimSpace(req.NodeName)
	if nodeName == "" {
		nodeName = power.Name
	}
	req.Billing.TeamID = teamID
	req.Billing.ProjectID = req.ProjectID
	now := time.Now()
	runInput := mergeMaps(req.Input, req.Params)
	if req.SourceTargetID > 0 {
		runInput[CanvasPowerMetaSourceTargetID] = req.SourceTargetID
	}
	runInput[CanvasPowerMetaResumeMode] = CanvasPowerResumeMode
	runInput[CanvasPowerMetaContext] = map[string]any{
		"power_id":         power.ID,
		"power_key":        power.Key,
		"source_target_id": req.SourceTargetID,
		"flow_id":          flow.ID,
		"asset_cate_id":    req.AssetCateID,
		"node_key":         nodeKey,
		"node_name":        nodeName,
		"kind":             power.Kind,
		"persist_result":   req.PersistResult,
	}
	if workspaceRun {
		runInput["_mode"] = "workspace_power"
		runInput[CanvasPowerMetaTeamPowerID] = req.TeamPowerID
	}
	attachRunBilling(runInput, req.Billing)
	input := executionInput(runInput)
	runRecord := map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"body_id":    req.BodyID,
		"team_id":    teamID,
		"release_id": releaseID,
		"input":      jsonText(runInput),
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
		return nil, fmt.Errorf("创建画布能力运行失败")
	}
	run := s.repo.FindRun(ctx, runID)
	if run == nil {
		return nil, fmt.Errorf("画布能力运行不存在")
	}
	req.Billing.RunID = run.ID
	s.writeRunEvent(ctx, *run, stream.EventRunStarted, map[string]any{
		"feature": stream.FeaturePower,
		"scope":   "run",
		"mode":    "canvas_power",
		"input":   input,
		"power": map[string]any{
			"id":          power.ID,
			"name":        power.Name,
			"key":         power.Key,
			"kind":        power.Kind,
			"output_type": power.OutputType,
		},
	})
	if req.OnRunCreated != nil {
		if err := req.OnRunCreated(run.ID, requestID); err != nil {
			s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, err)
			return nil, err
		}
	}
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

	onStream := func(payload map[string]any) {
		_, _ = s.streams.WritePayload(ctx, requestID, stream.NormalizePayload(stream.FeaturePower, payload))
		if req.OnStream != nil {
			req.OnStream(payload)
		}
	}
	output, err := s.executePower(ctx, requestID, power, input, req.SourceTargetID, req.Billing, onStream)
	status := teammodel.RunStatusSuccess
	if err != nil {
		status = teammodel.RunStatusFail
	}
	if current := s.repo.FindRun(ctx, run.ID); current != nil && current.Status == teammodel.RunStatusCanceled {
		status = teammodel.RunStatusCanceled
		err = nil
	}
	if status == teammodel.RunStatusSuccess {
		if interaction := canvasPowerInteraction(output); len(interaction) > 0 {
			return s.waitCanvasPowerInteraction(
				ctx,
				*run,
				flowRun,
				flow,
				dynamicNode,
				nodeRun,
				flowRunID,
				nodeRunID,
				output,
				interaction,
			), nil
		}
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
	var asset *assetmodel.Asset
	var version *assetmodel.Version
	s.finishRun(ctx, run.ID, status, output, err)
	if err != nil {
		return map[string]any{
			"run_id":      run.ID,
			"request_id":  requestID,
			"node_run_id": nodeRunID,
			"status":      status,
		}, err
	}
	if status != teammodel.RunStatusSuccess {
		return map[string]any{
			"run_id":      run.ID,
			"request_id":  requestID,
			"flow_run_id": flowRunID,
			"node_run_id": nodeRunID,
			"status":      status,
			"output":      output,
		}, nil
	}

	if !req.PersistResult {
		return map[string]any{
			"run_id":      run.ID,
			"request_id":  requestID,
			"flow_run_id": flowRunID,
			"node_run_id": nodeRunID,
			"status":      status,
			"output":      output,
		}, nil
	}

	if asset == nil || version == nil {
		asset, version, err = s.saveCanvasPowerResult(
			ctx,
			*run,
			mapValue(runInput[CanvasPowerMetaContext]),
			nodeRunID,
			requestID,
			output,
		)
		if err != nil {
			return nil, err
		}
	}
	return map[string]any{
		"run_id":      run.ID,
		"request_id":  requestID,
		"flow_run_id": flowRunID,
		"node_run_id": nodeRunID,
		"status":      status,
		"output":      output,
		"asset":       s.asset.AssetDetailMap(ctx, *asset, version),
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

func (s Service) saveCanvasPowerResult(
	ctx context.Context,
	run teammodel.Run,
	metadata map[string]any,
	nodeRunID uint64,
	requestID string,
	content map[string]any,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	if !boolValue(metadata["persist_result"]) {
		return nil, nil, nil
	}
	return s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:   run.ProjectID,
		BodyID:      run.BodyID,
		TeamID:      run.TeamID,
		FlowID:      uint64Value(metadata["flow_id"]),
		AssetCateID: uint64Value(metadata["asset_cate_id"]),
		RunID:       run.ID,
		NodeRunID:   nodeRunID,
		ReleaseID:   run.ReleaseID,
		RequestID:   requestID,
		NodeKey:     firstText(metadata["node_key"]),
		Name:        firstText(metadata["node_name"]),
		Kind:        firstText(metadata["kind"]),
		Role:        assetmodel.RoleMaterial,
		Content:     content,
	})
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
		if !energoninput.IsPromptParamType(param.Type) {
			continue
		}
		if key := strings.TrimSpace(param.Key); key != "" {
			return key
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
	if flow.ID == 0 {
		return GraphFlow{}
	}
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
