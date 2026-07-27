package body

import (
	"net/url"
	"regexp"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	bodymodel "github.com/dever-package/bot/model/body"
)

type LinkHook struct{}

var bodyLinkCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,63}$`)

func (LinkHook) ProviderBeforeSaveLink(c *server.Context, params []any) any {
	record := cloneBodyRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialBodyRecord(record)
	trimBodyStringField(record, "code", partial)
	trimBodyStringField(record, "name", partial)
	trimBodyStringField(record, "link_type", partial)
	trimBodyStringField(record, "url", partial)
	trimBodyStringField(record, "target", partial)
	if partial {
		return record
	}
	if util.ToStringTrimmed(record["name"]) == "" {
		panicBodyField("form.name", "名称不能为空。")
	}

	code := normalizedBodyLinkCode(util.ToStringTrimmed(record["code"]))
	if code == "" {
		panicBodyField("form.code", "唯一编码不能为空。")
	}
	if !bodyLinkCodePattern.MatchString(code) {
		panicBodyField("form.code", "唯一编码只能以小写字母开头，并包含小写字母、数字或下划线。")
	}
	if c != nil {
		codeFilters := map[string]any{"code": code}
		if linkID := util.ToUint64(record["id"]); linkID > 0 {
			codeFilters["id"] = map[string]any{"ne": linkID}
		}
		if bodymodel.NewLinkModel().Count(c.Context(), codeFilters) > 0 {
			panicBodyField("form.code", "唯一编码已存在。")
		}
	}
	record["code"] = code

	sceneIDs := normalizedBodyLinkSceneIDs(record["scene_ids"])
	for _, sceneID := range sceneIDs {
		if !validBodyLinkSceneID(sceneID) {
			panicBodyField("form.scene_ids", "使用场景不正确。")
		}
	}
	record["scene_ids"] = bodyLinkSceneIDValues(sceneIDs)

	linkType := util.ToStringTrimmed(record["link_type"])
	if linkType == "" {
		linkType = bodymodel.LinkTypeURL
	}
	switch linkType {
	case bodymodel.LinkTypeArticle:
		articleID := util.ToUint64(record["article_id"])
		if articleID == 0 {
			panicBodyField("form.article_id", "请选择内容文章。")
		}
		if c != nil {
			article := enabledContentArticle(c.Context(), articleID, 0)
			if article == nil || !enabledContentCategory(c.Context(), article.CategoryID) {
				panicBodyField("form.article_id", "文章不存在、已停用或所属分类已停用。")
			}
		}
		record["article_id"] = articleID
		record["url"] = ""
	case bodymodel.LinkTypeURL:
		record["article_id"] = uint64(0)
		record["url"] = normalizeLoginLinkURL(record["url"])
	default:
		panicBodyField("form.link_type", "链接类型不正确。")
	}
	record["link_type"] = linkType
	record["target"] = normalizeLinkTarget(util.ToStringTrimmed(record["target"]))
	defaultBodyInt16Field(record, "status", bodymodel.StatusEnabled, false)
	defaultBodyIntField(record, "sort", defaultSort, false)
	return record
}

func normalizeLoginLinkURL(value any) string {
	raw := util.ToStringTrimmed(value)
	if raw == "" {
		panicBodyField("form.url", "链接地址不能为空。")
	}
	parsed, err := url.Parse(raw)
	if err != nil || parsed.User != nil {
		panicBodyField("form.url", "链接地址格式不正确。")
	}
	scheme := strings.ToLower(strings.TrimSpace(parsed.Scheme))
	switch scheme {
	case "http", "https":
		if parsed.Hostname() == "" {
			panicBodyField("form.url", "HTTP(S) 链接必须包含完整域名。")
		}
	case "mailto":
		if strings.TrimSpace(parsed.Opaque) == "" {
			panicBodyField("form.url", "mailto 链接必须包含邮箱地址。")
		}
	case "":
		if parsed.Host != "" || strings.HasPrefix(raw, "//") {
			panicBodyField("form.url", "站内链接不能以 // 开头。")
		}
	default:
		panicBodyField("form.url", "链接只支持站内地址、HTTP(S) 或 mailto。")
	}
	return raw
}
