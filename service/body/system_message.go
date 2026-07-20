package body

import (
	"context"
	"net/url"
	"strings"
	"time"

	bodymodel "github.com/dever-package/bot/model/body"
)

const (
	defaultSystemMessageLimit = 20
	maxSystemMessageLimit     = 50
)

func (Service) SystemMessages(ctx context.Context, limit int) (map[string]any, error) {
	if limit <= 0 {
		limit = defaultSystemMessageLimit
	}
	if limit > maxSystemMessageLimit {
		limit = maxSystemMessageLimit
	}

	now := time.Now()
	rows := bodymodel.NewSystemMessageModel().Select(ctx, map[string]any{
		"status":       bodymodel.StatusEnabled,
		"published_at": map[string]any{"<=": now},
		"or": []any{
			map[string]any{"expires_at": nil},
			map[string]any{"expires_at": map[string]any{">": now}},
		},
	}, map[string]any{
		"order": "pinned asc,sort asc,published_at desc,id desc",
		"limit": limit,
	})

	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		items = append(items, map[string]any{
			"id":           row.ID,
			"title":        strings.TrimSpace(row.Title),
			"content":      strings.TrimSpace(row.Content),
			"url":          publicSystemMessageURL(row.URL),
			"pinned":       row.Pinned == bodymodel.SystemMessagePinnedYes,
			"published_at": row.PublishedAt,
		})
	}
	return map[string]any{"items": items}, nil
}

func publicSystemMessageURL(value string) string {
	raw := strings.TrimSpace(value)
	if raw == "" {
		return ""
	}
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Hostname() == "" || parsed.User != nil {
		return ""
	}
	scheme := strings.ToLower(strings.TrimSpace(parsed.Scheme))
	if scheme != "http" && scheme != "https" {
		return ""
	}
	return raw
}
