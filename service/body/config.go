package body

import (
	"context"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func (Service) LoginConfig(ctx context.Context) (map[string]any, error) {
	config := bodymodel.NewConfigModel().Find(ctx, map[string]any{
		"id": bodymodel.DefaultConfigID,
	})
	if config == nil {
		fallback := bodymodel.DefaultConfig()
		config = &fallback
	}

	links := bodymodel.NewLinkModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})
	accounts := bodymodel.NewAccountModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})

	return map[string]any{
		"config":   loginConfigPayload(config),
		"links":    loginLinkPayloads(links),
		"accounts": loginAccountPayloads(accounts),
	}, nil
}

func loginConfigPayload(config *bodymodel.Config) map[string]any {
	return map[string]any{
		"site_name":         firstBodyConfigText(config.SiteName, bodymodel.DefaultSiteName),
		"logo":              firstBodyConfigText(config.Logo, bodymodel.DefaultLogo),
		"favicon":           firstBodyConfigText(config.Favicon, bodymodel.DefaultFavicon),
		"login_title":       firstBodyConfigText(config.LoginTitle, bodymodel.DefaultLoginTitle),
		"login_description": strings.TrimSpace(config.LoginDescription),
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

func loginAccountPayloads(rows []*bodymodel.Account) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"id":       row.ID,
			"provider": strings.TrimSpace(row.Provider),
			"name":     strings.TrimSpace(row.Name),
			"icon":     strings.TrimSpace(row.Icon),
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
