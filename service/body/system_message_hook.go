package body

import (
	"net/url"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	bodymodel "github.com/dever-package/bot/model/body"
)

type SystemMessageHook struct{}

func (SystemMessageHook) ProviderBeforeSaveSystemMessage(c *server.Context, params []any) any {
	record := cloneBodyRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialBodyRecord(record)

	trimBodyStringField(record, "title", partial)
	trimBodyStringField(record, "content", partial)
	trimBodyStringField(record, "url", partial)
	if !partial && util.ToStringTrimmed(record["title"]) == "" {
		panicBodyField("form.title", "系统消息标题不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["content"]) == "" {
		panicBodyField("form.content", "系统消息内容不能为空。")
	}
	if shouldNormalizeBodyField(record, "url", partial) {
		record["url"] = normalizeSystemMessageURL(record["url"])
	}

	publishedAt := normalizeSystemMessagePublishedAt(record, partial)
	expiresAt := normalizeSystemMessageExpiresAt(record, partial)
	if !partial && expiresAt != nil && !expiresAt.After(publishedAt) {
		panicBodyField("form.expires_at", "结束时间必须晚于发布时间。")
	}

	defaultBodyInt16Field(record, "pinned", bodymodel.SystemMessagePinnedNo, partial)
	normalizeSystemMessageListFields(record, partial)
	return record
}

func normalizeSystemMessageListFields(record map[string]any, partial bool) {
	if partial {
		defaultBodyInt16Field(record, "status", bodymodel.StatusEnabled, true)
		if _, ok := record["sort"]; ok {
			sort := util.ToIntDefault(record["sort"], defaultSort)
			if sort < 0 {
				sort = 0
			}
			record["sort"] = sort
		}
		return
	}
	if util.ToUint64(record["id"]) == 0 {
		defaultBodyInt16Field(record, "status", bodymodel.StatusEnabled, false)
		defaultBodyIntField(record, "sort", defaultSort, false)
		return
	}
	delete(record, "status")
	delete(record, "sort")
}

func normalizeSystemMessageURL(value any) string {
	raw := util.ToStringTrimmed(value)
	if raw == "" {
		return ""
	}
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Hostname() == "" || parsed.User != nil {
		panicBodyField("form.url", "外链地址必须是完整的 HTTP(S) 地址。")
	}
	scheme := strings.ToLower(strings.TrimSpace(parsed.Scheme))
	if scheme != "http" && scheme != "https" {
		panicBodyField("form.url", "外链地址只支持 http:// 或 https://。")
	}
	return raw
}

func normalizeSystemMessagePublishedAt(record map[string]any, partial bool) time.Time {
	if !shouldNormalizeBodyField(record, "published_at", partial) {
		return time.Time{}
	}
	if util.ToStringTrimmed(record["published_at"]) == "" {
		now := time.Now()
		record["published_at"] = now
		return now
	}
	value, ok := systemMessageTime(record["published_at"])
	if !ok {
		panicBodyField("form.published_at", "发布时间格式不正确。")
	}
	return value
}

func normalizeSystemMessageExpiresAt(record map[string]any, partial bool) *time.Time {
	if !shouldNormalizeBodyField(record, "expires_at", partial) {
		return nil
	}
	if util.ToStringTrimmed(record["expires_at"]) == "" {
		record["expires_at"] = nil
		return nil
	}
	value, ok := systemMessageTime(record["expires_at"])
	if !ok {
		panicBodyField("form.expires_at", "结束时间格式不正确。")
	}
	return &value
}

func systemMessageTime(value any) (time.Time, bool) {
	switch current := value.(type) {
	case time.Time:
		return current, !current.IsZero()
	case *time.Time:
		if current != nil {
			return *current, !current.IsZero()
		}
		return time.Time{}, false
	}
	text := util.ToStringTrimmed(value)
	for _, layout := range []string{
		time.RFC3339Nano,
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02 15:04",
		"2006-01-02T15:04",
	} {
		if parsed, err := time.ParseInLocation(layout, text, time.Local); err == nil {
			return parsed, true
		}
	}
	return time.Time{}, false
}
