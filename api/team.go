package api

import (
	"strings"

	"github.com/shemic/dever/server"

	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
	userservice "github.com/dever-package/user/service"
)

type Team struct{}

var teamRunner = teamservice.NewService()

func (Team) GetWorkspaceData(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	data, err := teamRunner.Workspace(c.Context(), teamID)
	return teamJSON(c, data, err)
}

func (Team) PostSaveFlowGraph(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	teamID := uint64ValueFromBody(body, "team_id", "teamId", "id")
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
	return teamJSON(c, data, err)
}

func (Team) PostSaveNodeGraph(c *server.Context) error {
	return saveNodeGraph(c)
}

func saveNodeGraph(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	flowID := uint64ValueFromBody(body, "flow_id", "flowId", "id")
	data, err := teamRunner.SaveFlowNodeGraph(c.Context(), flowID, body)
	return teamJSON(c, data, err)
}

func (Team) GetValidateFlow(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	data, err := teamRunner.ValidateFlowGraph(c.Context(), teamID)
	return teamJSON(c, data, err)
}

func (Team) GetValidateNode(c *server.Context) error {
	flowID := uint64(frontstream.InputInt64(c.Input("flow_id"), 0))
	data, err := teamRunner.ValidateFlowNodeGraph(c.Context(), flowID)
	return teamJSON(c, data, err)
}

func (Team) PostRunTeam(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "team"
	releaseID := uint64ValueFromBody(body, "release_id", "releaseId")
	if requestedMode := strings.TrimSpace(textFromBody(body, "mode")); requestedMode == "conversation" {
		mode = requestedMode
	}
	if boolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_team"
		releaseID = 0
	}
	data, err := teamRunner.RunTeam(c.Context(), teamservice.RunRequest{
		TeamID:    uint64ValueFromBody(body, "team_id", "teamId", "id"),
		ReleaseID: releaseID,
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      mode,
	})
	return teamJSON(c, data, err)
}

func (Team) PostRunFlow(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "flow"
	releaseID := uint64ValueFromBody(body, "release_id", "releaseId")
	if boolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_flow"
		releaseID = 0
	}
	data, err := teamRunner.RunFlow(c.Context(), teamservice.RunRequest{
		TeamID:    uint64ValueFromBody(body, "team_id", "teamId"),
		FlowID:    uint64ValueFromBody(body, "flow_id", "flowId", "id"),
		ReleaseID: releaseID,
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      mode,
	})
	return teamJSON(c, data, err)
}

func (Team) GetTypeList(c *server.Context) error {
	data, err := teamRunner.TeamList(c.Context())
	return teamJSON(c, data, err)
}

func (Team) GetTeamList(c *server.Context) error {
	data, err := teamRunner.TeamList(c.Context())
	return teamJSON(c, data, err)
}

func (Team) GetTypeDetail(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.TeamDetail(c.Context(), teamID, releaseID)
	return teamJSON(c, data, err)
}

func (Team) GetTeamDetail(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	if teamID == 0 {
		teamID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.TeamDetail(c.Context(), teamID, releaseID)
	return teamJSON(c, data, err)
}

func (Team) GetRuntimeGraph(c *server.Context) error {
	teamID := uint64(frontstream.InputInt64(c.Input("team_id"), 0))
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := teamRunner.RuntimeGraph(c.Context(), teamID, releaseID)
	return teamJSON(c, data, err)
}

func (Team) GetCanvasConfig(c *server.Context) error {
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	flowID := uint64(frontstream.InputInt64(c.Input("flow_id"), 0))
	data, err := teamRunner.CanvasConfig(c.Context(), releaseID, flowID)
	return teamJSON(c, data, err)
}

func (Team) PostRunCanvasPower(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.RunCanvasPower(c.Context(), teamservice.CanvasPowerRunRequest{
		ProjectID:      uint64ValueFromBody(body, "project_id", "projectId"),
		BodyID:         uint64ValueFromBody(body, "body_id", "bodyId"),
		TeamID:         uint64ValueFromBody(body, "team_id", "teamId"),
		ReleaseID:      uint64ValueFromBody(body, "release_id", "releaseId"),
		FlowID:         uint64ValueFromBody(body, "flow_id", "flowId"),
		NodeKey:        textFromBody(body, "node_key", "nodeKey"),
		NodeName:       textFromBody(body, "node_name", "nodeName", "name"),
		Kind:           textFromBody(body, "kind"),
		PowerID:        uint64ValueFromBody(body, "power_id", "powerId"),
		PowerKey:       textFromBody(body, "power_key", "powerKey", "power"),
		SourceTargetID: uint64ValueFromBody(body, "source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"),
		Input:          mapFromBody(body, "input"),
		Params:         mapFromBody(body, "params"),
		PersistResult:  true,
	})
	return teamJSON(c, data, err)
}

func (Team) PostRunProjectFlow(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.RunFlow(c.Context(), teamservice.RunRequest{
		TeamID:    uint64ValueFromBody(body, "team_id", "teamId"),
		FlowID:    uint64ValueFromBody(body, "flow_id", "flowId", "id"),
		ReleaseID: uint64ValueFromBody(body, "release_id", "releaseId"),
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      "flow",
	})
	return teamJSON(c, data, err)
}

func (Team) GetRunStatus(c *server.Context) error {
	runID := uint64(frontstream.InputInt64(c.Input("run_id"), 0))
	requestID := strings.TrimSpace(frontstream.InputText(c.Input("request_id")))
	data, err := teamRunner.RunStatus(c.Context(), runID, requestID)
	return teamJSON(c, data, err)
}

func (Team) GetStream(c *server.Context) error {
	return handleStreamRead(c, teamRunner.ReadStream)
}

func (Team) PostStopRun(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.StopRun(
		c.Context(),
		uint64ValueFromBody(body, "run_id", "runId", "id"),
		textFromBody(body, "request_id", "requestId"),
	)
	return teamJSON(c, data, err)
}

func (Team) PostSubmitApproval(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := teamRunner.SubmitApproval(
		c.Context(),
		uint64ValueFromBody(body, "approval_id", "approvalId", "id"),
		textFromBody(body, "decision"),
		textFromBody(body, "comment"),
		mapFromBody(body, "data"),
	)
	return teamJSON(c, data, err)
}

func bindTeamBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func teamJSON(c *server.Context, data any, err error) error {
	if err != nil {
		payload := map[string]any{
			"status": 2,
			"data":   map[string]any{},
			"msg":    err.Error(),
		}
		if userservice.IsAuthRequired(err) {
			payload["code"] = 401
		}
		return c.JSONPayload(200, payload)
	}
	return c.JSONPayload(200, map[string]any{
		"status": 1,
		"data":   data,
		"msg":    "",
	})
}

func uint64ValueFromBody(body map[string]any, keys ...string) uint64 {
	for _, key := range keys {
		if value := uint64(frontstream.InputInt64(body[key], 0)); value > 0 {
			return value
		}
	}
	return 0
}

func textFromBody(body map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(body[key])); text != "" {
			return text
		}
	}
	return ""
}

func mapFromBody(body map[string]any, key string) map[string]any {
	if row, ok := body[key].(map[string]any); ok && row != nil {
		return row
	}
	return map[string]any{}
}

func boolFromBody(body map[string]any, keys ...string) bool {
	for _, key := range keys {
		switch strings.ToLower(strings.TrimSpace(frontstream.InputText(body[key]))) {
		case "1", "true", "yes", "y", "on":
			return true
		}
	}
	return false
}
