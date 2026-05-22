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

func (Brain) PostSaveFlowGraph(c *server.Context) error {
	return saveFlowGraph(c)
}

func (Brain) PostSaveNodeGraph(c *server.Context) error {
	return saveFlowGraph(c)
}

func saveFlowGraph(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	thinkID := uint64ValueFromBody(body, "think_id", "thinkId", "id")
	data, err := brainRunner.SaveFlowGraph(c.Context(), thinkID, body)
	return brainJSON(c, data, err)
}

func (Brain) PostSaveCreateConfig(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	thinkID := uint64ValueFromBody(body, "think_id", "thinkId", "id")
	data, err := brainRunner.SaveCreateConfig(c.Context(), thinkID, body)
	return brainJSON(c, data, err)
}

func (Brain) GetValidateThink(c *server.Context) error {
	brainID := uint64(frontstream.InputInt64(c.Input("brain_id"), 0))
	data, err := brainRunner.ValidateThinkGraph(c.Context(), brainID)
	return brainJSON(c, data, err)
}

func (Brain) GetValidateNode(c *server.Context) error {
	thinkID := uint64(frontstream.InputInt64(c.Input("think_id"), 0))
	data, err := brainRunner.ValidateFlowGraph(c.Context(), thinkID)
	return brainJSON(c, data, err)
}

func (Brain) PostRunBrain(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.RunBrain(c.Context(), brainservice.RunRequest{
		BrainID:   uint64ValueFromBody(body, "brain_id", "brainId", "id"),
		RequestID: textFromBody(body, "request_id", "requestId"),
		Input:     mapFromBody(body, "input"),
		Mode:      "brain",
	})
	return brainJSON(c, data, err)
}

func (Brain) PostRunThink(c *server.Context) error {
	body, err := bindBrainBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := brainRunner.RunThink(c.Context(), brainservice.RunRequest{
		BrainID:   uint64ValueFromBody(body, "brain_id", "brainId"),
		ThinkID:   uint64ValueFromBody(body, "think_id", "thinkId", "id"),
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
