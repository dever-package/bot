package api

import (
	"context"
	"time"

	"github.com/shemic/dever/server"

	projectservice "my/package/bot/service/project"
	teamservice "my/package/bot/service/team"
	frontstream "my/package/front/service/stream"
)

type Run struct{}

func (Run) PostCanvasPower(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := uint64ValueFromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunCanvasPower(c.Context(), projectID, teamservice.CanvasPowerRunRequest{
		FlowID:         uint64ValueFromBody(body, "flow_id", "flowId"),
		AssetCateID:    uint64ValueFromBody(body, "asset_cate_id", "assetCateId"),
		NodeKey:        textFromBody(body, "node_key", "nodeKey"),
		NodeName:       textFromBody(body, "node_name", "nodeName", "name"),
		Kind:           textFromBody(body, "kind"),
		PowerID:        uint64ValueFromBody(body, "power_id", "powerId"),
		PowerKey:       textFromBody(body, "power_key", "powerKey", "power"),
		SourceTargetID: uint64ValueFromBody(body, "source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"),
		Input:          mapFromBody(body, "input"),
		Params:         mapFromBody(body, "params"),
	})
	return teamJSON(c, data, err)
}

func (Run) PostCanvasAgent(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := uint64ValueFromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunCanvasAgent(c.Context(), projectID, projectservice.CanvasAgentRunRequest{
		FlowID:      uint64ValueFromBody(body, "flow_id", "flowId"),
		AssetCateID: uint64ValueFromBody(body, "asset_cate_id", "assetCateId"),
		NodeKey:     textFromBody(body, "node_key", "nodeKey"),
		NodeName:    textFromBody(body, "node_name", "nodeName", "name"),
		AgentID:     uint64ValueFromBody(body, "agent_id", "agentId", "id"),
		RequestID:   textFromBody(body, "request_id", "requestId"),
		Input:       mapFromBody(body, "input"),
	})
	return teamJSON(c, data, err)
}

func (Run) PostFlow(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := uint64ValueFromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunFlow(c.Context(), projectID, teamservice.RunRequest{
		TeamID:    uint64ValueFromBody(body, "team_id", "teamId"),
		ReleaseID: uint64ValueFromBody(body, "release_id", "releaseId"),
		FlowID:    uint64ValueFromBody(body, "flow_id", "flowId", "id"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      "flow",
	})
	return teamJSON(c, data, err)
}

func (Run) PostTeam(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := uint64ValueFromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunTeam(c.Context(), projectID, teamservice.RunRequest{
		TeamID:    uint64ValueFromBody(body, "team_id", "teamId"),
		ReleaseID: uint64ValueFromBody(body, "release_id", "releaseId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      runModeOrDefault(textFromBody(body, "mode"), "team"),
	})
	return teamJSON(c, data, err)
}

func (Run) PostRole(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	projectID := uint64ValueFromBody(body, "project_id", "projectId")
	data, err := projectRunner.RunRole(c.Context(), projectID, teamservice.RunRequest{
		RoleID:    uint64ValueFromBody(body, "role_id", "roleId", "id"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      "role",
	})
	return teamJSON(c, data, err)
}

func (Run) GetStatus(c *server.Context) error {
	data, err := projectRunner.RunStatus(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "run_id", "runId"),
		queryText(c, "request_id", "requestId"),
	)
	return teamJSON(c, data, err)
}

func (Run) GetStream(c *server.Context) error {
	params := frontstream.ReadParamsFromServerContext(c)
	projectID := queryUint64(c, "project_id", "projectId")
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
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.StopRun(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		uint64ValueFromBody(body, "run_id", "runId", "id"),
		textFromBody(body, "request_id", "requestId"),
	)
	return teamJSON(c, data, err)
}

func (Run) PostApproval(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.SubmitApproval(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		uint64ValueFromBody(body, "approval_id", "approvalId", "id"),
		textFromBody(body, "decision"),
		textFromBody(body, "comment"),
		mapFromBody(body, "data"),
	)
	return teamJSON(c, data, err)
}

func runModeOrDefault(mode string, fallback string) string {
	switch mode {
	case "team", "conversation":
		return mode
	default:
		return fallback
	}
}
