package api

import (
	"strings"

	"github.com/shemic/dever/server"

	brainservice "my/package/bot/service/brain"
	frontstream "my/package/front/service/stream"
)

type Brain struct{}

var brainRunner = brainservice.NewService()

func (Brain) GetWorkspaceData(c *server.Context) error {
	brainID := uint64(frontstream.InputInt64(c.Input("brain_id"), 0))
	if brainID == 0 {
		brainID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	data, err := brainRunner.Workspace(c.Context(), brainID)
	return brainJSON(c, data, err)
}

func (Brain) PostSaveThinkGraph(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	brainID := uint64ValueFromBody(body, "brain_id", "brainId", "id")
	var data map[string]any
	action := strings.TrimSpace(frontstream.InputText(body["action"]))
	switch action {
	case "publish":
		data, err = brainRunner.PublishBrain(c.Context(), brainID)
	case "edit_draft":
		data, err = brainRunner.EditBrainDraft(c.Context(), brainID)
	default:
		data, err = brainRunner.SaveThinkGraph(c.Context(), brainID, body)
	}
	return brainJSON(c, data, err)
}

func (Brain) PostSaveNodeGraph(c *server.Context) error {
	return saveNodeGraph(c)
}

func saveNodeGraph(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	thinkID := uint64ValueFromBody(body, "think_id", "thinkId", "id")
	data, err := brainRunner.SaveThinkNodeGraph(c.Context(), thinkID, body)
	return brainJSON(c, data, err)
}

func (Brain) GetValidateThink(c *server.Context) error {
	brainID := uint64(frontstream.InputInt64(c.Input("brain_id"), 0))
	data, err := brainRunner.ValidateThinkGraph(c.Context(), brainID)
	return brainJSON(c, data, err)
}

func (Brain) GetValidateNode(c *server.Context) error {
	thinkID := uint64(frontstream.InputInt64(c.Input("think_id"), 0))
	data, err := brainRunner.ValidateThinkNodeGraph(c.Context(), thinkID)
	return brainJSON(c, data, err)
}

func (Brain) PostRunBrain(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "brain"
	releaseID := uint64ValueFromBody(body, "release_id", "releaseId")
	if boolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_brain"
		releaseID = 0
	}
	data, err := brainRunner.RunBrain(c.Context(), brainservice.RunRequest{
		BrainID:   uint64ValueFromBody(body, "brain_id", "brainId", "id"),
		ReleaseID: releaseID,
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      mode,
	})
	return brainJSON(c, data, err)
}

func (Brain) PostRunThink(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	mode := "think"
	releaseID := uint64ValueFromBody(body, "release_id", "releaseId")
	if boolFromBody(body, "debug_current_graph", "debugCurrentGraph") {
		mode = "debug_think"
		releaseID = 0
	}
	data, err := brainRunner.RunThink(c.Context(), brainservice.RunRequest{
		BrainID:   uint64ValueFromBody(body, "brain_id", "brainId"),
		ThinkID:   uint64ValueFromBody(body, "think_id", "thinkId", "id"),
		ReleaseID: releaseID,
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      mode,
	})
	return brainJSON(c, data, err)
}

func (Brain) GetTypeList(c *server.Context) error {
	data, err := brainRunner.TypeList(c.Context())
	return brainJSON(c, data, err)
}

func (Brain) GetTypeDetail(c *server.Context) error {
	brainID := uint64(frontstream.InputInt64(c.Input("brain_id"), 0))
	if brainID == 0 {
		brainID = uint64(frontstream.InputInt64(c.Input("id"), 0))
	}
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := brainRunner.TypeDetail(c.Context(), brainID, releaseID)
	return brainJSON(c, data, err)
}

func (Brain) GetRuntimeGraph(c *server.Context) error {
	brainID := uint64(frontstream.InputInt64(c.Input("brain_id"), 0))
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	data, err := brainRunner.RuntimeGraph(c.Context(), brainID, releaseID)
	return brainJSON(c, data, err)
}

func (Brain) GetCanvasConfig(c *server.Context) error {
	releaseID := uint64(frontstream.InputInt64(c.Input("release_id"), 0))
	thinkID := uint64(frontstream.InputInt64(c.Input("think_id"), 0))
	data, err := brainRunner.CanvasConfig(c.Context(), releaseID, thinkID)
	return brainJSON(c, data, err)
}

func (Brain) PostRunCanvasPower(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.RunCanvasPower(c.Context(), brainservice.CanvasPowerRunRequest{
		ProjectID:      uint64ValueFromBody(body, "project_id", "projectId"),
		BodyID:         uint64ValueFromBody(body, "body_id", "bodyId"),
		BrainID:        uint64ValueFromBody(body, "brain_id", "brainId"),
		ReleaseID:      uint64ValueFromBody(body, "release_id", "releaseId"),
		ThinkID:        uint64ValueFromBody(body, "think_id", "thinkId"),
		NodeKey:        textFromBody(body, "node_key", "nodeKey"),
		NodeName:       textFromBody(body, "node_name", "nodeName", "name"),
		Kind:           textFromBody(body, "kind"),
		PowerID:        uint64ValueFromBody(body, "power_id", "powerId"),
		PowerKey:       textFromBody(body, "power_key", "powerKey", "power"),
		SourceTargetID: uint64ValueFromBody(body, "source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"),
		Input:          mapFromBody(body, "input"),
		Params:         mapFromBody(body, "params"),
	})
	return brainJSON(c, data, err)
}

func (Brain) PostRunProjectThink(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.RunThink(c.Context(), brainservice.RunRequest{
		BrainID:   uint64ValueFromBody(body, "brain_id", "brainId"),
		ThinkID:   uint64ValueFromBody(body, "think_id", "thinkId", "id"),
		ReleaseID: uint64ValueFromBody(body, "release_id", "releaseId"),
		ProjectID: uint64ValueFromBody(body, "project_id", "projectId"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      "think",
	})
	return brainJSON(c, data, err)
}

func (Brain) GetRunStatus(c *server.Context) error {
	runID := uint64(frontstream.InputInt64(c.Input("run_id"), 0))
	requestID := strings.TrimSpace(frontstream.InputText(c.Input("request_id")))
	data, err := brainRunner.RunStatus(c.Context(), runID, requestID)
	return brainJSON(c, data, err)
}

func (Brain) PostStopRun(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.StopRun(
		c.Context(),
		uint64ValueFromBody(body, "run_id", "runId", "id"),
		textFromBody(body, "request_id", "requestId"),
	)
	return brainJSON(c, data, err)
}

func (Brain) PostSubmitApproval(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.SubmitApproval(
		c.Context(),
		uint64ValueFromBody(body, "approval_id", "approvalId", "id"),
		textFromBody(body, "decision"),
		textFromBody(body, "comment"),
		mapFromBody(body, "data"),
	)
	return brainJSON(c, data, err)
}

func bindBrainBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func brainJSON(c *server.Context, data any, err error) error {
	if err != nil {
		return c.JSONPayload(200, map[string]any{
			"status": 2,
			"data":   map[string]any{},
			"msg":    err.Error(),
		})
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
