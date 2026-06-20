package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	skillinstall "github.com/dever-package/bot/service/agent/skill/install"
)

type SkillInstall struct{}

var skillInstaller = skillinstall.NewService()

func (SkillInstall) PostRun(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	resp := skillInstaller.Run(c.Context(), skillinstall.RunRequest{
		Method:  c.Method(),
		Host:    c.Header("Host"),
		Path:    c.Path(),
		Headers: requestHeaders(c),
		Body:    body,
	})
	return c.JSONPayload(200, resp)
}

func (SkillInstall) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, skillInstaller.ReadStream)
}

func (SkillInstall) PostStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := botapi.StreamRequestIDFromBody(body)
	resp := skillInstaller.Stop(c.Context(), requestID)
	return c.JSONPayload(200, resp)
}
