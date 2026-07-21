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

func (Login) PostFeishu(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := bodyservice.NewService().FeishuLogin(
		c.Context(),
		botapi.Uint64FromBody(body, "account_id", "accountId"),
		botapi.TextFromBody(body, "code"),
	)
	return botapi.WriteJSON(c, data, err)
}
