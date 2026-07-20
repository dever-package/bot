package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	userservice "github.com/dever-package/user/service"
)

type Account struct{}

var accountRunner userservice.AccountService

func (Account) GetOverview(c *server.Context) error {
	data, err := accountRunner.Overview(c.Context())
	return botapi.WriteJSON(c, data, err)
}

func (Account) GetPointLogs(c *server.Context) error {
	data, err := accountRunner.PointLogs(c.Context(), userservice.AccountPageRequest{
		Cursor:        botapi.QueryText(c, "cursor"),
		Limit:         botapi.QueryInt(c, "limit"),
		PointConfigID: botapi.QueryUint64(c, "point_config_id", "pointConfigId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Account) GetOrders(c *server.Context) error {
	data, err := accountRunner.Orders(c.Context(), userservice.AccountPageRequest{
		Cursor:        botapi.QueryText(c, "cursor"),
		Limit:         botapi.QueryInt(c, "limit"),
		Type:          botapi.QueryText(c, "type"),
		PointConfigID: botapi.QueryUint64(c, "point_config_id", "pointConfigId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Account) GetOrderStatus(c *server.Context) error {
	data, err := accountRunner.OrderStatus(
		c.Context(),
		botapi.QueryText(c, "type", "order_type", "orderType"),
		botapi.QueryText(c, "order_no", "orderNo"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Account) PostSubscriptionCheckout(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := accountRunner.CheckoutSubscription(c.Context(), userservice.SubscriptionCheckoutRequest{
		LevelID:   botapi.Uint64FromBody(body, "level_id", "levelId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Account) PostPointCheckout(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := accountRunner.CheckoutPointPackage(c.Context(), userservice.PointCheckoutRequest{
		PackageID: botapi.Uint64FromBody(body, "package_id", "packageId"),
		RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Account) PostOrderCancel(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := accountRunner.CancelOrder(
		c.Context(),
		botapi.TextFromBody(body, "type", "order_type", "orderType"),
		botapi.TextFromBody(body, "order_no", "orderNo"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Account) PostOrderRetry(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := accountRunner.RetryOrder(
		c.Context(),
		botapi.TextFromBody(body, "type", "order_type", "orderType"),
		botapi.TextFromBody(body, "order_no", "orderNo"),
	)
	return botapi.WriteJSON(c, data, err)
}
