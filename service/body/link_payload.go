package body

import (
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func bodyLinkPayload(link *bodymodel.Link) map[string]any {
	if link == nil || strings.TrimSpace(link.Name) == "" {
		return nil
	}
	linkType := normalizedLoginLinkType(link.LinkType)
	payload := map[string]any{
		"id":     link.ID,
		"code":   bodyLinkCode(link),
		"name":   strings.TrimSpace(link.Name),
		"type":   linkType,
		"target": normalizeLinkTarget(link.Target),
	}
	if linkType == bodymodel.LinkTypeArticle {
		if link.ArticleID == 0 {
			return nil
		}
		payload["article_id"] = link.ArticleID
		payload["target"] = bodymodel.LinkTargetSelf
		return payload
	}

	url := strings.TrimSpace(link.URL)
	if url == "" {
		return nil
	}
	payload["url"] = url
	return payload
}
