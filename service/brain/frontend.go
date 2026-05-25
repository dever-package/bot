package brain

import (
	"context"
	"fmt"
	"strings"
	"time"

	brainmodel "my/package/bot/model/brain"
	assetservice "my/package/bot/service/asset"
	energonservice "my/package/bot/service/energon"
)

func (s Service) TypeList(ctx context.Context) (map[string]any, error) {
	brains := s.repo.ListEnabledBrains(ctx)
	rows := make([]map[string]any, 0, len(brains))
	for _, brain := range brains {
		release := s.currentBrainRelease(ctx, brain)
		if release == nil {
			continue
		}
		rows = append(rows, map[string]any{
			"id":             brain.ID,
			"name":           brain.Name,
			"description":    strings.TrimSpace(brain.Description),
			"publish_status": normalizeBrainPublishStatus(brain.PublishStatus),
			"release_id":     release.ID,
			"version":        release.Version,
			"can_create":     true,
			"created_at":     brain.CreatedAt,
		})
	}
	return map[string]any{"items": rows}, nil
}

func (s Service) TypeDetail(ctx context.Context, brainID uint64, releaseID uint64) (map[string]any, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, brainID, releaseID)
	if err != nil {
		return nil, err
	}
	nodesByThink := map[string]any{}
	nodeEdgesByThink := map[string]any{}
	for _, think := range graph.Thinks {
		nodesByThink[think.Key] = thinkNodePayloads(graph.NodesByThinkID[think.ID])
		nodeEdgesByThink[think.Key] = thinkNodeEdgePayloads(
			graph.NodesByThinkID[think.ID],
			graph.NodeEdgesByThinkID[think.ID],
		)
	}
	return map[string]any{
		"type": map[string]any{
			"id":          graph.Brain.ID,
			"name":        graph.Brain.Name,
			"description": strings.TrimSpace(graph.Brain.Description),
		},
		"release": map[string]any{
			"id":         release.ID,
			"brain_id":   release.BrainID,
			"version":    release.Version,
			"status":     release.Status,
			"created_at": release.CreatedAt,
		},
		"thinks":              thinkPayloads(graph.Thinks),
		"think_edges":         thinkEdgePayloads(graph.Thinks, graph.ThinkEdges),
		"nodes_by_think":      nodesByThink,
		"node_edges_by_think": nodeEdgesByThink,
	}, nil
}

func (s Service) RuntimeGraph(ctx context.Context, brainID uint64, releaseID uint64) (map[string]any, error) {
	return s.TypeDetail(ctx, brainID, releaseID)
}

func (s Service) CanvasConfig(ctx context.Context, releaseID uint64, thinkID uint64) (map[string]any, error) {
	if releaseID == 0 {
		powers := s.repo.ListPowers(ctx)
		return map[string]any{
			"release_id":  0,
			"think":       map[string]any{},
			"brains":      s.publishedBrainOptions(ctx),
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
	think := graph.findThink(thinkID)
	if think.ID == 0 {
		return nil, fmt.Errorf("发布版本中不存在当前思维")
	}
	powers := s.repo.ListPowers(ctx)
	return map[string]any{
		"release_id":       release.ID,
		"think":            singleThinkPayload(think),
		"default_agent_id": uint64Value(jsonMap(think.Config)["default_agent_id"]),
		"brains":           s.publishedBrainOptions(ctx),
		"agents":           s.repo.ListAgents(ctx),
		"agent_cates":      s.repo.ListAgentCates(ctx),
		"powers":           powers,
		"power_kinds":      powerKindOptions(powers),
	}, nil
}

func (s Service) CanvasPowerForm(ctx context.Context, releaseID uint64, thinkID uint64, powerID uint64, powerKey string, targetID uint64) (map[string]any, error) {
	power, ok := s.repo.FindPowerOption(ctx, powerID, powerKey)
	if !ok {
		return nil, fmt.Errorf("能力不存在")
	}
	think := brainmodel.Think{}
	if releaseID > 0 {
		_, graph, err := s.runtimeGraphByRelease(ctx, 0, releaseID)
		if err != nil {
			return nil, err
		}
		think = graph.findThink(thinkID)
		if think.ID == 0 {
			return nil, fmt.Errorf("发布版本中不存在当前思维")
		}
	}
	form, err := s.gateway.PowerParamConfig(ctx, power.Key, targetID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"release_id":         releaseID,
		"think":              singleThinkPayload(think),
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
	var brainID uint64
	think := brainmodel.Think{}
	if req.BrainID > 0 || req.ReleaseID > 0 {
		release, graph, err := s.runtimeGraphByRelease(ctx, req.BrainID, req.ReleaseID)
		if err != nil {
			return nil, err
		}
		releaseID = release.ID
		brainID = graph.Brain.ID
		think = graph.findThink(req.ThinkID)
		if think.ID == 0 {
			return nil, fmt.Errorf("发布版本中不存在当前思维")
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
		"brain_id":   brainID,
		"release_id": releaseID,
		"input":      jsonText(input),
		"output":     "{}",
		"error":      "",
		"status":     brainmodel.RunStatusRunning,
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
	var thinkRunID uint64
	var thinkRun *brainmodel.ThinkRun
	if think.ID > 0 {
		thinkRunID = s.repo.FindOrCreateThinkRun(ctx, *run, think, input)
		thinkRun = s.repo.FindThinkRun(ctx, thinkRunID)
		if thinkRun == nil {
			return nil, fmt.Errorf("创建思维运行失败")
		}
		s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
			"status":     brainmodel.RunStatusRunning,
			"started_at": now,
		})
	}
	nodeKey := normalizeKey("node", req.NodeKey)
	nodeName := strings.TrimSpace(req.NodeName)
	if nodeName == "" {
		nodeName = power.Name
	}
	var nodeRunID uint64
	if think.ID > 0 && thinkRun != nil {
		nodeRunID = s.repo.FindOrCreateDynamicNodeRun(ctx, *run, *thinkRun, think, 0, nodeKey, nodeName, brainmodel.NodeTypePower, input)
	}
	s.repo.UpdateNodeRun(ctx, nodeRunID, map[string]any{
		"status":     brainmodel.RunStatusRunning,
		"started_at": now,
	})

	output, err := s.callCanvasPower(ctx, requestID, power, input, req.SourceTargetID)
	status := brainmodel.RunStatusSuccess
	if err != nil {
		status = brainmodel.RunStatusFail
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
	if thinkRun != nil {
		s.repo.UpdateThinkRun(ctx, thinkRun.ID, map[string]any{
			"status":      status,
			"output":      jsonText(output),
			"error":       errorText(err),
			"finished_at": finishedAt,
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
		BrainID:   brainID,
		ThinkID:   think.ID,
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
		"run_id":       run.ID,
		"request_id":   requestID,
		"think_run_id": thinkRunID,
		"node_run_id":  nodeRunID,
		"status":       status,
		"output":       output,
		"asset":        assetservice.AssetToMap(*asset),
		"version":      assetservice.VersionToMap(*version),
	}, nil
}

func (s Service) ListProjectAssets(ctx context.Context, projectID uint64, thinkID uint64, kind string) (map[string]any, error) {
	if projectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	return s.asset.ListProject(ctx, projectID, thinkID, kind)
}

func (s Service) ProjectAssetDetail(ctx context.Context, projectID uint64, assetID uint64) (map[string]any, error) {
	return s.asset.ProjectDetail(ctx, projectID, assetID)
}

func (s Service) runtimeGraphByRelease(ctx context.Context, brainID uint64, releaseID uint64) (*brainmodel.BrainRelease, runtimeGraph, error) {
	var brain brainmodel.Brain
	var err error
	if releaseID > 0 {
		release := s.repo.FindBrainRelease(ctx, releaseID)
		if release == nil {
			return nil, runtimeGraph{}, fmt.Errorf("发布版本不存在")
		}
		if brainID > 0 && release.BrainID != brainID {
			return nil, runtimeGraph{}, fmt.Errorf("发布版本不属于当前类型")
		}
		brain, err = s.repo.FindBrain(ctx, release.BrainID)
		if err != nil {
			return nil, runtimeGraph{}, err
		}
		graph, err := runtimeGraphFromRelease(*release)
		return release, graph, err
	}
	if brainID == 0 {
		return nil, runtimeGraph{}, fmt.Errorf("类型不能为空")
	}
	brain, err = s.repo.FindBrain(ctx, brainID)
	if err != nil {
		return nil, runtimeGraph{}, err
	}
	release, err := s.runnableBrainRelease(ctx, brain)
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

func singleThinkPayload(think brainmodel.Think) GraphThink {
	rows := thinkPayloads([]brainmodel.Think{think})
	if len(rows) == 0 {
		return GraphThink{}
	}
	return rows[0]
}

func (s Service) publishedBrainOptions(ctx context.Context) []BrainOption {
	brains := s.repo.ListEnabledBrains(ctx)
	result := make([]BrainOption, 0, len(brains))
	for _, brain := range brains {
		release := s.currentBrainRelease(ctx, brain)
		if release == nil {
			continue
		}
		result = append(result, BrainOption{
			ID:        brain.ID,
			CateID:    brain.CateID,
			ReleaseID: release.ID,
			Name:      brain.Name,
			Key:       brain.Key,
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

func errorText(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}
