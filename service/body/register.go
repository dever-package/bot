package body

import (
	"context"
	"fmt"

	bodymodel "github.com/dever-package/bot/model/body"
	userservice "github.com/dever-package/user/service"
)

type RegisterRequest struct {
	Account  string
	Password string
	Name     string
}

func (Service) Register(ctx context.Context, request RegisterRequest) (map[string]any, error) {
	if loadBodyConfig(ctx).RegisterStatus != bodymodel.StatusEnabled {
		return nil, fmt.Errorf("当前站点已关闭注册")
	}

	return (userservice.AuthService{}).Register(ctx, userservice.RegisterRequest{
		Account:  request.Account,
		Password: request.Password,
		Name:     request.Name,
	})
}
