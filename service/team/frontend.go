package team

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	"github.com/dever-package/bot/service/stream"
)

func (s Service) TeamList(ctx context.Context) (map[string]any, error) {
	rows, _ := s.teamListRows(ctx)
	return map[string]any{"items": rows}, nil
}

func (s Service) teamListRows(ctx context.Context) ([]map[string]any, map[uint64]teammodel.TeamRelease) {
	teams := s.repo.ListEnabledTeams(ctx)
	releases := s.repo.CurrentTeamReleases(ctx, teams)
	rows := make([]map[string]any, 0, len(teams))
	for _, team := range teams {
		release, exists := releases[team.ID]
		if !exists {
			continue
		}
		projectEnabled := releaseProjectEnabled(&release)
		rows = append(rows, map[string]any{
			"id":              team.ID,
			"name":            team.Name,
			"description":     strings.TrimSpace(team.Description),
			"publish_status":  normalizeTeamPublishStatus(team.PublishStatus),
			"release_id":      release.ID,
			"version":         release.Version,
			"project_enabled": projectEnabled,
			"can_create":      projectEnabled,
			"created_at":      team.CreatedAt,
		})
	}
	return rows, releases
}

func releaseProjectEnabled(release *teammodel.TeamRelease) bool {
	if release == nil {
		return false
	}
	graph, err := runtimeGraphFromRelease(*release)
	if err != nil {
		return false
	}
	return graph.Team.ProjectEnabled != teammodel.StatusDisabled
}

func (s Service) TeamDetail(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return nil, err
	}
	payload := teamRuntimePayload(release, graph)
	nodeEdgesByFlow := map[string]any{}
	for _, flow := range graph.Flows {
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(
			graph.NodesByFlowID[flow.ID],
			graph.NodeEdgesByFlowID[flow.ID],
		)
	}
	payload["type"] = payload["team"]
	payload["team_powers"] = teamPowerPayloads(graph.TeamPowers)
	payload["flow_edges"] = flowEdgePayloads(graph.Flows, graph.FlowEdges)
	payload["node_edges_by_flow"] = nodeEdgesByFlow
	return payload, nil
}

// WorkspaceCanvasBootstrap returns only the release catalog required by the
// project canvas. General team, agent and knowledge options remain lazy-loaded
// through their existing endpoints.
func (s Service) WorkspaceCanvasBootstrap(ctx context.Context, teamID uint64, releaseID uint64) (map[string]any, error) {
	if teamID == 0 {
		return map[string]any{
			"team":        map[string]any{},
			"release":     map[string]any{},
			"asset_cates": []GraphAssetCate{},
			"flows":       []CanvasFlowOption{},
		}, nil
	}
	release, graph, err := s.workspaceCanvasGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return nil, err
	}
	return workspaceCanvasPayload(release, graph), nil
}

func workspaceCanvasPayload(release *teammodel.TeamRelease, graph runtimeGraph) map[string]any {
	return map[string]any{
		"team": map[string]any{
			"id":              graph.Team.ID,
			"name":            graph.Team.Name,
			"description":     strings.TrimSpace(graph.Team.Description),
			"project_enabled": graph.Team.ProjectEnabled == teammodel.StatusEnabled,
		},
		"release": map[string]any{
			"id":         release.ID,
			"team_id":    release.TeamID,
			"version":    release.Version,
			"status":     release.Status,
			"created_at": release.CreatedAt,
		},
		"asset_cates": assetCatePayloads(graph.AssetCates),
		"flows":       canvasFlowOptions(graph),
	}
}

func canvasFlowOptions(graph runtimeGraph) []CanvasFlowOption {
	flows := flowPayloads(graph.Flows)
	result := make([]CanvasFlowOption, 0, len(flows))
	for _, flow := range flows {
		result = append(result, CanvasFlowOption{
			GraphFlow:          flow,
			OutputAssetCateIDs: canvasFlowOutputAssetCateIDs(graph.NodesByFlowID[flow.ID]),
		})
	}
	return result
}

func canvasFlowOutputAssetCateIDs(nodes []teammodel.FlowNode) []uint64 {
	result := make([]uint64, 0, len(nodes))
	seen := make(map[uint64]struct{}, len(nodes))
	for _, node := range nodes {
		if !strings.EqualFold(strings.TrimSpace(node.Type), "save") {
			continue
		}
		assetCateID := firstUint64(node.AssetCateID, uint64Value(jsonMap(node.Config)["asset_cate_id"]))
		if assetCateID == 0 {
			continue
		}
		if _, exists := seen[assetCateID]; exists {
			continue
		}
		seen[assetCateID] = struct{}{}
		result = append(result, assetCateID)
	}
	return result
}

func teamRuntimePayload(release *teammodel.TeamRelease, graph runtimeGraph) map[string]any {
	nodesByFlow := map[string]any{}
	for _, flow := range graph.Flows {
		nodesByFlow[flow.Key] = flowNodePayloads(graph.NodesByFlowID[flow.ID])
	}
	teamPayload := map[string]any{
		"id":              graph.Team.ID,
		"name":            graph.Team.Name,
		"description":     strings.TrimSpace(graph.Team.Description),
		"project_enabled": graph.Team.ProjectEnabled == teammodel.StatusEnabled,
	}
	return map[string]any{
		"team": teamPayload,
		"release": map[string]any{
			"id":         release.ID,
			"team_id":    release.TeamID,
			"version":    release.Version,
			"status":     release.Status,
			"created_at": release.CreatedAt,
		},
		"asset_cates":   assetCatePayloads(graph.AssetCates),
		"roles":         rolePayloads(graph.Roles),
		"flows":         flowPayloads(graph.Flows),
		"nodes_by_flow": nodesByFlow,
	}
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
			"power_cates":     s.repo.ListPowerCates(ctx),
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
	powers := s.teamPowerOptions(ctx, graph.TeamPowers)
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
		"power_cates":      s.repo.ListPowerCates(ctx),
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
	result := map[string]any{
		"release_id":         releaseID,
		"flow":               singleFlowPayload(flow),
		"power":              power,
		"source_rule":        form.SourceRule,
		"selected_target_id": form.SelectedTargetID,
		"sources":            form.Sources,
		"params":             form.Params,
		"primary_param_key":  primaryPowerParamKey(form.Params),
	}
	if energonmodel.NormalizeOutputType(power.OutputType) == energonmodel.OutputTypeStoryboard {
		result["storyboard_work_types"] = energonmodel.StoryboardWorkTypeSpecs()
		result["storyboard_reference_purposes"] = energonmodel.StoryboardReferencePurposeSpecs()
	}
	return result, nil
}

type preparedCanvasPower struct {
	request      CanvasPowerRunRequest
	workspaceRun bool
	releaseID    uint64
	teamID       uint64
	flow         teammodel.Flow
	power        PowerOption
}

func (s Service) prepareCanvasPower(ctx context.Context, req CanvasPowerRunRequest) (preparedCanvasPower, error) {
	workspaceRun := req.ProjectID == 0
	if req.ProjectID == 0 && req.BodyID == 0 {
		return preparedCanvasPower{}, fmt.Errorf("项目或团队工作区不能为空")
	}
	var releaseID uint64
	var teamID uint64
	flow := teammodel.Flow{}
	teamPowers := []teammodel.TeamPower{}
	if req.TeamID > 0 || req.ReleaseID > 0 {
		release, graph, err := s.runtimeGraphByRelease(ctx, req.TeamID, req.ReleaseID)
		if err != nil {
			return preparedCanvasPower{}, err
		}
		releaseID = release.ID
		teamID = graph.Team.ID
		teamPowers = graph.TeamPowers
		if req.FlowID > 0 {
			flow = graph.findFlow(req.FlowID)
			if flow.ID == 0 {
				return preparedCanvasPower{}, fmt.Errorf("发布版本中不存在当前工作流")
			}
		}
	}
	if workspaceRun {
		if req.TeamPowerID == 0 {
			return preparedCanvasPower{}, fmt.Errorf("团队能力不能为空")
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
			return preparedCanvasPower{}, fmt.Errorf("当前团队发布版本中不存在该能力")
		}
	}
	power, ok := s.repo.FindPowerOption(ctx, req.PowerID, req.PowerKey)
	if !ok {
		return preparedCanvasPower{}, fmt.Errorf("能力不存在")
	}
	if !powerAllowedByScope(teamPowers, power.ID) {
		return preparedCanvasPower{}, fmt.Errorf("当前团队不允许使用该能力")
	}
	form, err := s.gateway.RuntimePowerParamConfig(ctx, power.Key, req.SourceTargetID)
	if err != nil {
		return preparedCanvasPower{}, err
	}
	req.SourceTargetID = form.SelectedTargetID
	req.Params, err = s.prepareCanvasPowerParamValues(ctx, power, req, form)
	if err != nil {
		return preparedCanvasPower{}, err
	}
	return preparedCanvasPower{
		request:      req,
		workspaceRun: workspaceRun,
		releaseID:    releaseID,
		teamID:       teamID,
		flow:         flow,
		power:        power,
	}, nil
}

type canvasPowerParamCandidate struct {
	values     map[string]any
	boundCount int
}

func (s Service) prepareCanvasPowerParamValues(
	ctx context.Context,
	power PowerOption,
	req CanvasPowerRunRequest,
	form energonservice.PowerParamConfig,
) (map[string]any, error) {
	if len(req.MediaReferences) == 0 || form.SelectedTargetID > 0 {
		return bindCanvasPowerParamValues(req.Params, form.Params, req.MediaReferences)
	}

	var best *canvasPowerParamCandidate
	reasons := make([]string, 0, len(form.Sources))
	for _, source := range form.Sources {
		targetForm, err := s.gateway.PowerTargetParamConfig(ctx, power.Key, source.TargetID)
		if err != nil {
			reasons = append(reasons, canvasPowerSourceFailure(source.Name, err))
			continue
		}
		bound, err := energoninput.BindMediaReferences(
			canvasPowerReferenceParamValues(req.Params, targetForm.Params, req.MediaReferences),
			targetForm.Params,
			req.MediaReferences,
		)
		if err != nil {
			reasons = append(reasons, canvasPowerSourceFailure(source.Name, err))
			continue
		}
		values := energonservice.ApplyPowerParamDefaults(bound.Values, targetForm.Params)
		if err := s.gateway.ValidatePowerTarget(ctx, energonservice.GatewayRequest{
			Method: "POST",
			Path:   "/bot/admin/energon/request",
			Body: canvasPowerGatewayBody(
				power,
				mergeMaps(req.Input, values),
				source.TargetID,
				req.ImageSequenceMode,
			),
		}, source.TargetID); err != nil {
			reasons = append(reasons, canvasPowerSourceFailure(source.Name, err))
			continue
		}
		candidate := &canvasPowerParamCandidate{
			values:     values,
			boundCount: len(bound.Bound),
		}
		if candidate.boundCount == len(req.MediaReferences) {
			return candidate.values, nil
		}
		if best == nil || candidate.boundCount > best.boundCount {
			best = candidate
		}
	}
	if best != nil {
		return best.values, nil
	}
	if len(reasons) > 0 {
		return nil, fmt.Errorf("当前素材没有兼容的能力来源：%s", strings.Join(reasons, "；"))
	}
	return bindCanvasPowerParamValues(req.Params, form.Params, req.MediaReferences)
}

func bindCanvasPowerParamValues(
	values map[string]any,
	params []energonservice.PowerParam,
	references []energoninput.MediaReference,
) (map[string]any, error) {
	bound, err := energoninput.BindMediaReferences(
		canvasPowerReferenceParamValues(values, params, references),
		params,
		references,
	)
	if err != nil {
		return nil, err
	}
	return energonservice.ApplyPowerParamDefaults(bound.Values, params), nil
}

// Canvas media references are the source of truth for media parameters. Clear
// matching saved values before binding so a per-image child request cannot
// retain media selected for another child request.
func canvasPowerReferenceParamValues(
	values map[string]any,
	params []energonservice.PowerParam,
	references []energoninput.MediaReference,
) map[string]any {
	if len(references) == 0 {
		return values
	}
	kinds := make(map[string]bool, len(references))
	for _, reference := range references {
		kind := strings.ToLower(strings.TrimSpace(reference.Kind))
		if kind != "" {
			kinds[kind] = true
		}
	}
	result := make(map[string]any, len(values))
	for key, value := range values {
		result[key] = value
	}
	for _, param := range params {
		for kind := range kinds {
			if energoninput.MediaParamSupports(param, kind) {
				delete(result, strings.TrimSpace(param.Key))
				break
			}
		}
	}
	return result
}

func canvasPowerSourceFailure(sourceName string, err error) string {
	name := strings.TrimSpace(sourceName)
	if name == "" {
		name = "未命名来源"
	}
	return name + "：" + err.Error()
}

func (s Service) RunCanvasPower(ctx context.Context, req CanvasPowerRunRequest) (map[string]any, error) {
	prepared, err := s.prepareCanvasPower(ctx, req)
	if err != nil {
		return nil, err
	}
	execution := newCanvasPowerExecution(prepared)
	executionContext, err := s.startCanvasPowerExecution(ctx, execution, prepared.releaseID, prepared.teamID)
	if err != nil {
		return nil, err
	}
	defer execution.releaseRunLease()
	if execution.canceled {
		return map[string]any{
			"run_id":     execution.run.ID,
			"request_id": execution.requestID,
			"status":     teammodel.RunStatusCanceled,
		}, nil
	}

	onStream := func(payload map[string]any) {
		_, _ = s.streams.WritePayload(
			executionContext,
			execution.requestID,
			stream.NormalizePayload(stream.FeaturePower, payload),
		)
		if execution.request.OnStream != nil {
			execution.request.OnStream(payload)
		}
	}
	output, runErr := s.executePower(
		executionContext,
		execution.requestID,
		execution.power,
		execution.input,
		execution.request.SourceTargetID,
		execution.request.ImageSequenceMode,
		execution.request.Billing,
		onStream,
	)
	return s.completeCanvasPowerExecution(executionContext, execution, output, runErr)
}

func canvasPowerRunInput(req CanvasPowerRunRequest) map[string]any {
	input := mergeMaps(req.Input, req.Params)
	if len(req.MediaReferences) > 0 {
		input["prompt"] = energoninput.AppendMediaReferenceIndex(
			textValue(input["prompt"]),
			req.MediaReferences,
		)
	}
	return input
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
	releases := s.repo.CurrentTeamReleases(ctx, teams)
	result := make([]TeamOption, 0, len(teams))
	for _, team := range teams {
		release, exists := releases[team.ID]
		if !exists {
			continue
		}
		graph, err := runtimeGraphFromRelease(release)
		if err != nil {
			continue
		}
		result = append(result, TeamOption{
			ID:        team.ID,
			CateID:    team.CateID,
			ReleaseID: release.ID,
			Name:      team.Name,
			Flows:     flowPayloads(graph.Flows),
			Roles:     rolePayloads(graph.Roles),
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
