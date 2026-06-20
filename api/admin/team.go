package api

import (
	"strings"

	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
)

type Team struct{}

var teamRunner = teamservice.NewService()

func (Team) GetWorkspaceData(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	data, err := teamRunner.Workspace(c.Context(), teamID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostSaveFlowGraph(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	teamID := botapi.Uint64FromBody(body, "team_id", "teamId", "id")
	var data map[string]any
	action := strings.TrimSpace(frontstream.InputText(body["action"]))
	switch action {
	case "publish":
		data, err = teamRunner.PublishTeam(c.Context(), teamID)
	case "edit_draft":
		data, err = teamRunner.EditTeamDraft(c.Context(), teamID)
	default:
		data, err = teamRunner.SaveFlowGraph(c.Context(), teamID, body)
	}
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostSaveNodeGraph(c *server.Context) error {
	return saveNodeGraph(c)
}

func saveNodeGraph(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	flowID := botapi.Uint64FromBody(body, "flow_id", "flowId", "id")
	data, err := teamRunner.SaveFlowNodeGraph(c.Context(), flowID, body)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetValidateFlow(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	data, err := teamRunner.ValidateFlowGraph(c.Context(), teamID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetValidateNode(c *server.Context) error {
	flowID := uint64(frontstream.InputInt64(c.Input("flow_id"), 0))
	data, err := teamRunner.ValidateFlowNodeGraph(c.Context(), flowID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostRunTeam(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "team"
	releaseID := botapi.Uint64FromBody(body, "release_id", "releaseId")
	if requestedMode := strings.TrimSpace(botapi.TextFromBody(body, "mode")); requestedMode == "conversation" {
		mode = requestedMode
	}
	if botapi.BoolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_team"
		releaseID = 0
	}
	data, err := teamRunner.RunTeam(c.Context(), teamservice.RunRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId", "id"),
		ReleaseID: releaseID,
		ProjectID: botapi.Uint64FromBody(body, "project_id", "projectId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      mode,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostRunFlow(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "flow"
	releaseID := botapi.Uint64FromBody(body, "release_id", "releaseId")
	if botapi.BoolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_flow"
		releaseID = 0
	}
	data, err := teamRunner.RunFlow(c.Context(), teamservice.RunRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId"),
		FlowID:    botapi.Uint64FromBody(body, "flow_id", "flowId", "id"),
		ReleaseID: releaseID,
		ProjectID: botapi.Uint64FromBody(body, "project_id", "projectId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      mode,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetTypeList(c *server.Context) error {
	data, err := teamRunner.TeamList(c.Context())
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetTeamList(c *server.Context) error {
	data, err := teamRunner.TeamList(c.Context())
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetTypeDetail(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.TeamDetail(c.Context(), teamID, releaseID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetTeamDetail(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.TeamDetail(c.Context(), teamID, releaseID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetRuntimeGraph(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.RuntimeGraph(c.Context(), teamID, releaseID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetCanvasConfig(c *server.Context) error {
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	flowID := uint64(frontstream.InputInt64(c.Input("flow_id"), 0))
	data, err := teamRunner.CanvasConfig(c.Context(), releaseID, flowID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostRunCanvasPower(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.RunCanvasPower(c.Context(), teamservice.CanvasPowerRunRequest{
		ProjectID:      botapi.Uint64FromBody(body, "project_id", "projectId"),
		BodyID:         botapi.Uint64FromBody(body, "body_id", "bodyId"),
		TeamID:         botapi.Uint64FromBody(body, "team_id", "teamId"),
		ReleaseID:      botapi.Uint64FromBody(body, "release_id", "releaseId"),
		FlowID:         botapi.Uint64FromBody(body, "flow_id", "flowId"),
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

func (Team) PostRunProjectFlow(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.RunFlow(c.Context(), teamservice.RunRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId"),
		FlowID:    botapi.Uint64FromBody(body, "flow_id", "flowId", "id"),
		ReleaseID: botapi.Uint64FromBody(body, "release_id", "releaseId"),
		ProjectID: botapi.Uint64FromBody(body, "project_id", "projectId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
		Input:     botapi.MapFromBody(body, "input"),
		Mode:      "flow",
	})
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetRunStatus(c *server.Context) error {
	runID := uint64(frontstream.InputInt64(c.Input("run_id"), 0))
	requestID := strings.TrimSpace(frontstream.InputText(c.Input("request_id")))
	data, err := teamRunner.RunStatus(c.Context(), runID, requestID)
	return botapi.WriteJSON(c, data, err)
}

func (Team) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, teamRunner.ReadStream)
}

func (Team) PostStopRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.StopRun(
		c.Context(),
		botapi.Uint64FromBody(body, "run_id", "runId", "id"),
		botapi.TextFromBody(body, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Team) PostSubmitApproval(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.SubmitApproval(
		c.Context(),
		botapi.Uint64FromBody(body, "approval_id", "approvalId", "id"),
		botapi.TextFromBody(body, "decision"),
		botapi.TextFromBody(body, "comment"),
		botapi.MapFromBody(body, "data"),
	)
	return botapi.WriteJSON(c, data, err)
}
