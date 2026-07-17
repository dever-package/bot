package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	bodyservice "github.com/dever-package/bot/service/body"
)

type Login struct{}

func (Login) GetConfig(c *server.Context) error {
	data, err := bodyservice.NewService().LoginConfig(c.Context())
	return botapi.WriteJSON(c, data, err)
}
