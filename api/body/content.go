package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	bodyservice "github.com/dever-package/bot/service/body"
)

type Content struct{}

func (Content) GetList(c *server.Context) error {
	data, err := bodyservice.NewService().ContentNavigation(c.Context())
	return botapi.WriteJSON(c, data, err)
}

func (Content) GetPublic(c *server.Context) error {
	data, err := bodyservice.NewService().PublicContentDetail(
		c.Context(),
		botapi.QueryUint64(c, "id", "article_id", "articleId"),
	)
	return botapi.WriteJSON(c, data, err)
}
