package api

import (
	"github.com/shemic/dever/server"

	skillinstall "my/package/bot/service/agent/skill/install"
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
	return handleStreamRead(c, skillInstaller.ReadStream)
}

func (SkillInstall) PostStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := streamRequestIDFromBody(body)
	resp := skillInstaller.Stop(c.Context(), requestID)
	return c.JSONPayload(200, resp)
}
