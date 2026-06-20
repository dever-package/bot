package api

import (
	"context"
	"time"

	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	projectservice "github.com/dever-package/bot/service/project"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
)

type Run struct{}

func (Run) PostCanvasPower(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := botapi.Uint64FromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunCanvasPower(c.Context(), projectID, teamservice.CanvasPowerRunRequest{
		FlowID:         botapi.Uint64FromBody(body, "flow_id", "flowId"),
		AssetCateID:    botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
		NodeKey:        botapi.TextFromBody(body, "node_key", "nodeKey"),
		NodeName:       botapi.TextFromBody(body, "node_name", "nodeName", "name"),
		Kind:           botapi.TextFromBody(body, "kind"),
		PowerID:        botapi.Uint64FromBody(body, "power_id", "powerId"),
		PowerKey:       botapi.TextFromBody(body, "power_key", "powerKey", "power"),
		SourceTargetID: botapi.Uint64FromBody(body, "source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"),
		Input:          botapi.MapFromBody(body, "input"),
		Params:         botapi.MapFromBody(body, "params"),
		PersistResult:  true,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Run) PostCanvasAgent(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := botapi.Uint64FromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunCanvasAgent(c.Context(), projectID, projectservice.CanvasAgentRunRequest{
		FlowID:        botapi.Uint64FromBody(body, "flow_id", "flowId"),
		AssetCateID:   botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
		NodeKey:       botapi.TextFromBody(body, "node_key", "nodeKey"),
		NodeName:      botapi.TextFromBody(body, "node_name", "nodeName", "name"),
		AgentID:       botapi.Uint64FromBody(body, "agent_id", "agentId", "id"),
		RequestID:     botapi.TextFromBody(body, "request_id", "requestId"),
		Input:         botapi.MapFromBody(body, "input"),
		PersistResult: true,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Run) PostFlow(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := botapi.Uint64FromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunFlow(c.Context(), projectID, teamservice.RunRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId"),
		ReleaseID: botapi.Uint64FromBody(body, "release_id", "releaseId"),
		FlowID:    botapi.Uint64FromBody(body, "flow_id", "flowId", "id"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      "flow",
	})
	return botapi.WriteJSON(c, data, err)
}

func (Run) PostTeam(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := botapi.Uint64FromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunTeam(c.Context(), projectID, teamservice.RunRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId"),
		ReleaseID: botapi.Uint64FromBody(body, "release_id", "releaseId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      runModeOrDefault(botapi.TextFromBody(body, "mode"), "team"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Run) PostRole(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := botapi.Uint64FromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunRole(c.Context(), projectID, teamservice.RunRequest{
		RoleID:    botapi.Uint64FromBody(body, "role_id", "roleId", "id"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      "role",
	})
	return botapi.WriteJSON(c, data, err)
}

func (Run) GetStatus(c *server.Context) error {
	data, err := projectRunner.RunStatus(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "run_id", "runId"),
		botapi.QueryText(c, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Run) GetStream(c *server.Context) error {
	params := frontstream.ReadParamsFromServerContext(c)
	projectID := botapi.QueryUint64(c, "project_id", "projectId")
	reader := func(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
		return projectRunner.ReadStream(ctx, projectID, requestID, lastID, count, block)
	}
	if frontstream.WantsSSE(c) {
		return frontstream.ServeSSE(c, reader, params)
	}
	entries, err := reader(c.Context(), params.RequestID, params.LastID, params.Count, params.Block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(params.RequestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(params.RequestID, params.LastID, entries))
}

func (Run) PostStop(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.StopRun(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		botapi.Uint64FromBody(body, "run_id", "runId", "id"),
		botapi.TextFromBody(body, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Run) PostApproval(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.SubmitApproval(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		botapi.Uint64FromBody(body, "approval_id", "approvalId", "id"),
		botapi.TextFromBody(body, "decision"),
		botapi.TextFromBody(body, "comment"),
		botapi.MapFromBody(body, "data"),
	)
	return botapi.WriteJSON(c, data, err)
}

func runModeOrDefault(mode string, fallback string) string {
	switch mode {
	case "team", "conversation":
		return mode
	default:
		return fallback
	}
}
