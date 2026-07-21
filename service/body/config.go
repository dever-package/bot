package body

import (
	"context"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func (Service) LoginConfig(ctx context.Context) (map[string]any, error) {
	config := loadBodyConfig(ctx)

	links := bodymodel.NewLinkModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})
	accounts := bodymodel.NewAccountModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})

	return map[string]any{
		"config":   loginConfigPayload(config),
		"links":    loginLinkPayloads(links),
		"accounts": loginAccountPayloads(ctx, accounts),
	}, nil
}

func loadBodyConfig(ctx context.Context) *bodymodel.Config {
	config := bodymodel.NewConfigModel().Find(ctx, map[string]any{
		"id": bodymodel.DefaultConfigID,
	})
	if config != nil {
		return config
	}
	fallback := bodymodel.DefaultConfig()
	return &fallback
}

func loginConfigPayload(config *bodymodel.Config) map[string]any {
	return map[string]any{
		"site_name":                  firstBodyConfigText(config.SiteName, bodymodel.DefaultSiteName),
		"logo":                       bodyConfigMediaURL(firstBodyConfigText(config.Logo, bodymodel.DefaultLogo)),
		"favicon":                    bodyConfigMediaURL(firstBodyConfigText(config.Favicon, bodymodel.DefaultFavicon)),
		"login_image":                bodyConfigMediaURL(firstBodyConfigText(config.LoginImage, bodymodel.DefaultLoginImage)),
		"login_title":                firstBodyConfigText(config.LoginTitle, bodymodel.DefaultLoginTitle),
		"login_description":          strings.TrimSpace(config.LoginDescription),
		"home_menu":                  homeMenuConfigPayload(config),
		"company_name":               strings.TrimSpace(config.CompanyName),
		"company_address":            strings.TrimSpace(config.CompanyAddress),
		"business_license_url":       strings.TrimSpace(config.BusinessLicenseURL),
		"icp_record":                 strings.TrimSpace(config.ICPRecord),
		"icp_record_url":             strings.TrimSpace(config.ICPRecordURL),
		"public_security_record":     strings.TrimSpace(config.PublicSecurityRecord),
		"public_security_record_url": strings.TrimSpace(config.PublicSecurityRecordURL),
	}
}

func homeMenuConfigPayload(config *bodymodel.Config) map[string]any {
	return map[string]any{
		"works":    homeMenuItemPayload(config.HomeWorksName, bodymodel.DefaultHomeWorksName, config.HomeWorksIcon, bodymodel.DefaultHomeWorksIcon, config.HomeWorksStatus),
		"dialogue": homeMenuItemPayload(config.HomeDialogueName, bodymodel.DefaultHomeDialogueName, config.HomeDialogueIcon, bodymodel.DefaultHomeDialogueIcon, config.HomeDialogueStatus),
		"function": homeMenuItemPayload(config.HomeFunctionName, bodymodel.DefaultHomeFunctionName, config.HomeFunctionIcon, bodymodel.DefaultHomeFunctionIcon, config.HomeFunctionStatus),
		"assets":   homeMenuItemPayload(config.HomeAssetsName, bodymodel.DefaultHomeAssetsName, config.HomeAssetsIcon, bodymodel.DefaultHomeAssetsIcon, config.HomeAssetsStatus),
		"points":   homeMenuItemPayload(config.HomePointsName, bodymodel.DefaultHomePointsName, config.HomePointsIcon, bodymodel.DefaultHomePointsIcon, config.HomePointsStatus),
		"messages": homeMenuItemPayload(config.HomeMessagesName, bodymodel.DefaultHomeMessagesName, config.HomeMessagesIcon, bodymodel.DefaultHomeMessagesIcon, config.HomeMessagesStatus),
	}
}

func homeMenuItemPayload(name string, defaultName string, icon string, defaultIcon string, status int16) map[string]any {
	return map[string]any{
		"name":    firstBodyConfigText(name, defaultName),
		"icon":    firstBodyConfigText(icon, defaultIcon),
		"enabled": status == bodymodel.StatusEnabled,
	}
}

func loginLinkPayloads(rows []*bodymodel.Link) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"id":     row.ID,
			"name":   strings.TrimSpace(row.Name),
			"url":    strings.TrimSpace(row.URL),
			"target": normalizeLinkTarget(row.Target),
		})
	}
	return result
}

func loginAccountPayloads(ctx context.Context, rows []*bodymodel.Account) []map[string]any {
	accountIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			accountIDs = append(accountIDs, row.ID)
		}
	}
	configsByAccount := loadAccountConfigValues(ctx, accountIDs)
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		configValues := configsByAccount[row.ID]
		result = append(result, map[string]any{
			"id":         row.ID,
			"provider":   strings.TrimSpace(row.Provider),
			"name":       strings.TrimSpace(row.Name),
			"icon":       strings.TrimSpace(row.Icon),
			"app_id":     strings.TrimSpace(configValues[bodymodel.AccountConfigKeyAppID]),
			"configured": accountConfigured(row, configValues),
		})
	}
	return result
}

func normalizeLinkTarget(target string) string {
	if strings.TrimSpace(target) == bodymodel.LinkTargetBlank {
		return bodymodel.LinkTargetBlank
	}
	return bodymodel.LinkTargetSelf
}

func firstBodyConfigText(value string, fallback string) string {
	if text := strings.TrimSpace(value); text != "" {
		return text
	}
	return fallback
}
