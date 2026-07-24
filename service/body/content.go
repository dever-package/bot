package body

import (
	"context"
	"fmt"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func (Service) ContentNavigation(ctx context.Context) (map[string]any, error) {
	linkIDs := bodyLinkIDsForScene(ctx, bodymodel.LinkSceneWorkbenchContentID)
	if len(linkIDs) == 0 {
		return emptyContentNavigation(), nil
	}

	links := bodymodel.NewLinkModel().Select(ctx, map[string]any{
		"id":     linkIDs,
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"order": "sort asc,id asc"})
	articles := enabledContentArticleMap(ctx, bodyLinkArticleIDs(links), "")
	items := make([]map[string]any, 0, len(links))
	for _, link := range links {
		if item := workbenchContentLinkPayload(link, articles); item != nil {
			items = append(items, item)
		}
	}
	return map[string]any{"items": items}, nil
}

func (Service) ContentDetail(ctx context.Context, linkID uint64) (map[string]any, error) {
	if !bodyLinkHasScene(ctx, linkID, bodymodel.LinkSceneWorkbenchContentID) {
		return nil, fmt.Errorf("内容入口不存在或不可访问")
	}
	link := bodymodel.NewLinkModel().Find(ctx, map[string]any{
		"id":     linkID,
		"status": bodymodel.StatusEnabled,
	})
	if link == nil || normalizedLoginLinkType(link.LinkType) != bodymodel.LinkTypeArticle {
		return nil, fmt.Errorf("内容入口不存在或不可访问")
	}

	article := enabledContentArticle(ctx, link.ArticleID, 0, "")
	if article == nil || !enabledContentCategory(ctx, article.CategoryID) {
		return nil, fmt.Errorf("文章不存在或不可访问")
	}
	return map[string]any{"article": contentArticlePayload(article)}, nil
}

func (Service) PublicContentDetail(ctx context.Context, articleID uint64) (map[string]any, error) {
	article := publicContentArticle(ctx, articleID)
	if article == nil {
		return nil, fmt.Errorf("文章不存在或不可公开访问")
	}
	return map[string]any{"article": contentArticlePayload(article)}, nil
}

func publicContentArticle(ctx context.Context, articleID uint64) *bodymodel.ContentArticle {
	article := enabledContentArticle(
		ctx,
		articleID,
		0,
		bodymodel.ContentVisibilityPublic,
	)
	if article == nil || !enabledContentCategory(ctx, article.CategoryID) {
		return nil
	}
	return article
}

func enabledContentArticle(
	ctx context.Context,
	articleID uint64,
	categoryID uint64,
	visibility string,
) *bodymodel.ContentArticle {
	if articleID == 0 {
		return nil
	}
	filters := map[string]any{
		"id":     articleID,
		"status": bodymodel.StatusEnabled,
	}
	if categoryID > 0 {
		filters["category_id"] = categoryID
	}
	if visibility != "" {
		filters["visibility"] = visibility
	}
	return bodymodel.NewContentArticleModel().Find(ctx, filters)
}

func enabledContentCategory(ctx context.Context, categoryID uint64) bool {
	if categoryID == 0 {
		return false
	}
	return bodymodel.NewContentCategoryModel().Find(ctx, map[string]any{
		"id":     categoryID,
		"status": bodymodel.StatusEnabled,
	}) != nil
}

func publicContentArticleMap(
	ctx context.Context,
	articleIDs []uint64,
) map[uint64]*bodymodel.ContentArticle {
	return enabledContentArticleMap(
		ctx,
		articleIDs,
		bodymodel.ContentVisibilityPublic,
	)
}

func enabledContentArticleMap(
	ctx context.Context,
	articleIDs []uint64,
	visibility string,
) map[uint64]*bodymodel.ContentArticle {
	if len(articleIDs) == 0 {
		return map[uint64]*bodymodel.ContentArticle{}
	}
	categories := bodymodel.NewContentCategoryModel().Select(ctx, map[string]any{
		"status": bodymodel.StatusEnabled,
	}, map[string]any{"field": "id", "order": "id asc"})
	enabledCategories := make(map[uint64]struct{}, len(categories))
	for _, category := range categories {
		if category != nil {
			enabledCategories[category.ID] = struct{}{}
		}
	}
	filters := map[string]any{
		"id":     articleIDs,
		"status": bodymodel.StatusEnabled,
	}
	if visibility != "" {
		filters["visibility"] = visibility
	}
	rows := bodymodel.NewContentArticleModel().Select(ctx, filters, map[string]any{
		"field": "id,category_id",
		"order": "id asc",
	})
	result := make(map[uint64]*bodymodel.ContentArticle, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if _, exists := enabledCategories[row.CategoryID]; exists {
			result[row.ID] = row
		}
	}
	return result
}

func bodyLinkArticleIDs(rows []*bodymodel.Link) []uint64 {
	result := make([]uint64, 0, len(rows))
	seen := make(map[uint64]struct{}, len(rows))
	for _, row := range rows {
		if row == nil || row.ArticleID == 0 ||
			normalizedLoginLinkType(row.LinkType) != bodymodel.LinkTypeArticle {
			continue
		}
		if _, exists := seen[row.ArticleID]; exists {
			continue
		}
		seen[row.ArticleID] = struct{}{}
		result = append(result, row.ArticleID)
	}
	return result
}

func workbenchContentLinkPayload(
	link *bodymodel.Link,
	articles map[uint64]*bodymodel.ContentArticle,
) map[string]any {
	payload := bodyLinkPayload(link)
	if payload == nil {
		return nil
	}
	if normalizedLoginLinkType(link.LinkType) == bodymodel.LinkTypeArticle {
		if articles[link.ArticleID] == nil {
			return nil
		}
	}
	return payload
}

func contentArticlePayload(article *bodymodel.ContentArticle) map[string]any {
	if article == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":          article.ID,
		"category_id": article.CategoryID,
		"title":       strings.TrimSpace(article.Title),
		"content":     strings.TrimSpace(article.Content),
	}
}

func emptyContentNavigation() map[string]any {
	return map[string]any{"items": []map[string]any{}}
}
