package body

import (
	"context"
	"fmt"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
	skillservice "github.com/dever-package/bot/service/agent/skill"
	usermodel "github.com/dever-package/user/model"
	userservice "github.com/dever-package/user/service"
)

func (Service) FeishuLogin(ctx context.Context, accountID uint64, code string) (map[string]any, error) {
	code = strings.TrimSpace(code)
	if accountID == 0 || code == "" {
		return nil, fmt.Errorf("飞书登录参数不完整")
	}
	account := bodymodel.NewAccountModel().Find(ctx, map[string]any{
		"id":       accountID,
		"provider": bodymodel.AccountProviderFeishu,
		"status":   bodymodel.StatusEnabled,
	})
	configValues := loadAccountConfigValues(ctx, []uint64{accountID})[accountID]
	if account == nil || !accountConfigured(account, configValues) {
		return nil, fmt.Errorf("飞书登录入口不存在或尚未配置")
	}
	appSecret, err := skillservice.DecryptSecret(configValues[bodymodel.AccountConfigKeyAppSecret])
	if err != nil || strings.TrimSpace(appSecret) == "" {
		return nil, fmt.Errorf("飞书登录密钥不可用，请联系管理员重新配置")
	}

	identity, err := userservice.ExchangeFeishuAuthorizationCode(
		ctx,
		configValues[bodymodel.AccountConfigKeyAppID],
		appSecret,
		code,
	)
	if err != nil {
		return nil, err
	}
	return (userservice.AuthService{}).ExternalLogin(ctx, userservice.ExternalLoginRequest{
		Provider: usermodel.CredentialProviderFeishu,
		Subject:  identity.OpenID,
		Account:  identity.Mobile,
		Name:     identity.Name,
	})
}
