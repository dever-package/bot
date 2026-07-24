package body

import (
	"context"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func (Service) LoginConfig(ctx context.Context) (map[string]any, error) {
	config := loadBodyConfig(ctx)
	functions := bodymodel.NewFunctionModel().Select(ctx, map[string]any{}, map[string]any{
		"order": "sort asc,id asc",
	})

	links := bodymodel.NewLinkModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})
	accounts := bodymodel.NewAccountModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})

	return map[string]any{
		"config":   loginConfigPayload(config, functions),
		"links":    loginLinkPayloads(ctx, links),
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

func loginConfigPayload(config *bodymodel.Config, functions []*bodymodel.Function) map[string]any {
	return map[string]any{
		"site_name":                  firstBodyConfigText(config.SiteName, bodymodel.DefaultSiteName),
		"logo":                       bodyConfigMediaURL(firstBodyConfigText(config.Logo, bodymodel.DefaultLogo)),
		"favicon":                    bodyConfigMediaURL(firstBodyConfigText(config.Favicon, bodymodel.DefaultFavicon)),
		"login_image":                bodyConfigMediaURL(firstBodyConfigText(config.LoginImage, bodymodel.DefaultLoginImage)),
		"login_title":                firstBodyConfigText(config.LoginTitle, bodymodel.DefaultLoginTitle),
		"login_description":          strings.TrimSpace(config.LoginDescription),
		"login_text_color":           bodymodel.NormalizeAppearanceColor(config.LoginTextColor),
		"register_enabled":           config.RegisterStatus == bodymodel.StatusEnabled,
		"base_color":                 firstBodyConfigColor(config.BaseColor, bodymodel.DefaultBaseColor),
		"brand_primary_color":        bodymodel.NormalizeBrandPrimaryColor(config.BrandPrimaryColor),
		"login_template":             bodymodel.NormalizeLoginTemplate(config.LoginTemplate),
		"login_background_color":     bodymodel.NormalizeAppearanceColor(config.LoginBackgroundColor),
		"login_background_image":     bodyConfigMediaURL(config.LoginBackgroundImage),
		"workbench_template":         bodymodel.NormalizeWorkbenchTemplate(config.WorkbenchTemplate),
		"workbench_background_color": bodymodel.NormalizeAppearanceColor(config.WorkbenchBackgroundColor),
		"workbench_background_image": bodyConfigMediaURL(config.WorkbenchBackgroundImage),
		"home_menu":                  homeMenuConfigPayload(functions),
		"filing_content":             strings.TrimSpace(config.FilingContent),
		"company_name":               strings.TrimSpace(config.CompanyName),
		"company_address":            strings.TrimSpace(config.CompanyAddress),
		"business_license_url":       strings.TrimSpace(config.BusinessLicenseURL),
		"icp_record":                 strings.TrimSpace(config.ICPRecord),
		"icp_record_url":             strings.TrimSpace(config.ICPRecordURL),
		"public_security_record":     strings.TrimSpace(config.PublicSecurityRecord),
		"public_security_record_url": strings.TrimSpace(config.PublicSecurityRecordURL),
	}
}

func firstBodyConfigColor(value string, fallback string) string {
	if color := bodymodel.NormalizeAppearanceColor(value); color != "" {
		return color
	}
	return bodymodel.NormalizeAppearanceColor(fallback)
}

func homeMenuConfigPayload(rows []*bodymodel.Function) map[string]any {
	defaults := bodymodel.DefaultFunctions()
	functions := make(map[string]bodymodel.Function, len(defaults))
	for _, item := range defaults {
		functions[item.Code] = item
	}
	for _, row := range rows {
		if row == nil {
			continue
		}
		if _, exists := functions[row.Code]; !exists {
			continue
		}
		functions[row.Code] = *row
	}

	result := make(map[string]any, len(defaults))
	for _, fallback := range defaults {
		result[fallback.Code] = homeMenuItemPayload(functions[fallback.Code], fallback)
	}
	return result
}

func homeMenuItemPayload(item bodymodel.Function, fallback bodymodel.Function) map[string]any {
	return map[string]any{
		"name":       firstBodyConfigText(item.Name, fallback.Name),
		"icon":       firstBodyConfigText(item.Icon, fallback.Icon),
		"icon_image": bodyConfigMediaURL(item.IconImage),
		"enabled":    item.Status == bodymodel.StatusEnabled,
		"sort":       item.Sort,
	}
}

func loginLinkPayloads(ctx context.Context, rows []*bodymodel.Link) []map[string]any {
	linkIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			linkIDs = append(linkIDs, row.ID)
		}
	}
	sceneCodesByLinkID := bodyLinkSceneCodesByLinkID(ctx, linkIDs)
	publicArticles := publicContentArticleMap(ctx, bodyLinkArticleIDs(rows))
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		code := bodyLinkCode(row)
		sceneCodes := sceneCodesByLinkID[row.ID]
		if !loginConfigLinkVisible(code, sceneCodes) {
			continue
		}
		payload := bodyLinkPayload(row)
		if payload == nil {
			continue
		}
		if normalizedLoginLinkType(row.LinkType) == bodymodel.LinkTypeArticle {
			if publicArticles[row.ArticleID] == nil {
				continue
			}
		}
		payload["scenes"] = append([]string{}, sceneCodes...)
		result = append(result, payload)
	}
	return result
}

func loginConfigLinkVisible(code string, sceneCodes []string) bool {
	if isLoginAgreementLinkCode(code) {
		return true
	}
	if containsBodyLinkSceneCode(sceneCodes, bodymodel.LinkSceneNavigationCode) {
		return true
	}
	return code == "" && len(sceneCodes) == 0
}

func normalizedLoginLinkType(value string) string {
	if strings.TrimSpace(value) == bodymodel.LinkTypeArticle {
		return bodymodel.LinkTypeArticle
	}
	return bodymodel.LinkTypeURL
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
