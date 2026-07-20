package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	bodyservice "github.com/dever-package/bot/service/body"
)

type SystemMessage struct{}

func (SystemMessage) GetList(c *server.Context) error {
	data, err := bodyservice.NewService().SystemMessages(
		c.Context(),
		int(botapi.QueryUint64(c, "limit")),
	)
	return botapi.WriteJSON(c, data, err)
}
