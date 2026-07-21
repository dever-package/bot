package body

import (
	"context"

	frontsite "github.com/dever-package/front/service/site"
	"github.com/dever-package/front/service/siteconfig"

	bodymodel "github.com/dever-package/bot/model/body"
)

const bodySiteKey = "body"

func init() {
	frontsite.RegisterRuntimeSiteConfigProvider(bodySiteKey, bodyRuntimeSiteConfig)
}

func bodyRuntimeSiteConfig(ctx context.Context, _ siteconfig.Site) frontsite.RuntimeSiteConfig {
	config := loadBodyConfig(ctx)
	return frontsite.RuntimeSiteConfig{
		Name:    firstBodyConfigText(config.SiteName, bodymodel.DefaultSiteName),
		Logo:    bodyConfigMediaURL(firstBodyConfigText(config.Logo, bodymodel.DefaultLogo)),
		Favicon: bodyConfigMediaURL(firstBodyConfigText(config.Favicon, bodymodel.DefaultFavicon)),
	}
}
