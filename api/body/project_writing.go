package api

import (
	"encoding/json"

	botapi "github.com/dever-package/bot/api"
	teamservice "github.com/dever-package/bot/service/team"
	"github.com/shemic/dever/server"
)

func (Project) PostWritingCommand(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	encoded, err := json.Marshal(body)
	if err != nil {
		return c.Error(err)
	}
	var command teamservice.WritingCommand
	if err = json.Unmarshal(encoded, &command); err != nil {
		return c.Error(err)
	}
	result, err := projectRunner.WritingCommand(c.Context(), command)
	return botapi.WriteJSON(c, result, err)
}

func (Project) GetWritingRuns(c *server.Context) error {
	result, err := projectRunner.WritingRuns(c.Context(), botapi.QueryUint64(c, "project_id"), botapi.QueryUint64(c, "canvas_id"), botapi.QueryUint64(c, "work_asset_id"), botapi.QueryUint64(c, "before_id"))
	return botapi.WriteJSON(c, result, err)
}
