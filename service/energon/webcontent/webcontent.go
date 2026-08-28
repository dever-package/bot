package webcontent

import (
	"context"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"

	botprovider "github.com/dever-package/bot/service/energon/provider"
	frontrichtext "github.com/dever-package/front/service/richtext"
	frontwebcontent "github.com/dever-package/front/service/webcontent"
)

const (
	Protocol             = "webcontent"
	PlatformWeChat       = frontwebcontent.PlatformWeChat
	PlatformDouyin       = frontwebcontent.PlatformDouyin
	PowerKey             = "wechat-official-account-import"
	PowerName            = "微信公众号"
	LegacyPowerKey       = "web-content-import"
	InputParamKey        = "webContentSource"
	InputParamName       = "公众号文章链接或分享内容"
	DouyinPowerKey       = "douyin-content-import"
	DouyinPowerName      = "抖音"
	DouyinInputParamKey  = "douyinContentSource"
	DouyinInputParamName = "抖音作品链接或分享内容"
	ResolveAPI           = "resolve"
	defaultMaxAssets     = 50
	maxSourceLength      = 8192
)

type PlatformSpec struct {
	Key            string
	Name           string
	ServiceName    string
	ServicePath    string
	PowerKey       string
	PowerName      string
	PowerIcon      string
	PowerKind      string
	InputParamKey  string
	InputParamName string
	LegacyPowerKey string
	ContentType    string
	AssetKind      string
	DefaultTitle   string
}

type mediaOutputSpec struct {
	Kind  string
	Field string
}

var platformSpecs = []PlatformSpec{
	{
		Key:            PlatformWeChat,
		Name:           PowerName,
		ServiceName:    "微信公众号解析",
		ServicePath:    "webcontent://wechat/resolve",
		PowerKey:       PowerKey,
		PowerName:      PowerName,
		PowerIcon:      "file-input",
		PowerKind:      "text",
		InputParamKey:  InputParamKey,
		InputParamName: InputParamName,
		LegacyPowerKey: LegacyPowerKey,
		ContentType:    frontwebcontent.ContentTypeRichText,
		AssetKind:      "richtext",
		DefaultTitle:   "公众号文章",
	},
	{
		Key:            PlatformDouyin,
		Name:           DouyinPowerName,
		ServiceName:    "抖音作品解析",
		ServicePath:    "webcontent://douyin/resolve",
		PowerKey:       DouyinPowerKey,
		PowerName:      DouyinPowerName,
		PowerIcon:      "circle-play",
		PowerKind:      "video",
		InputParamKey:  DouyinInputParamKey,
		InputParamName: DouyinInputParamName,
		ContentType:    frontwebcontent.ContentTypeVideo,
		AssetKind:      "video",
		DefaultTitle:   "抖音作品",
	},
}

var mediaOutputSpecs = []mediaOutputSpec{
	{Kind: frontwebcontent.MediaKindImage, Field: "images"},
	{Kind: frontwebcontent.MediaKindVideo, Field: "videos"},
	{Kind: frontwebcontent.MediaKindAudio, Field: "audios"},
}

func Platforms() []PlatformSpec {
	return append([]PlatformSpec(nil), platformSpecs...)
}

func FindPlatform(key string) (PlatformSpec, bool) {
	key = strings.ToLower(strings.TrimSpace(key))
	for _, spec := range platformSpecs {
		if spec.Key == key {
			return spec, true
		}
	}
	return PlatformSpec{}, false
}

func BuildNativeRequest(platform string, input map[string]any, credential string) (botprovider.Request, error) {
	spec, ok := FindPlatform(platform)
	if !ok {
		return botprovider.Request{}, fmt.Errorf("暂不支持该自媒体平台")
	}
	if strings.ContainsAny(credential, "\r\n") {
		return botprovider.Request{}, fmt.Errorf("平台登录态格式无效")
	}
	source, _ := input["source"].(string)
	source = strings.TrimSpace(source)
	if source == "" {
		return botprovider.Request{}, fmt.Errorf("链接或分享内容不能为空")
	}
	if utf8.RuneCountInString(source) > maxSourceLength {
		return botprovider.Request{}, fmt.Errorf("链接或分享内容不能超过 %d 个字符", maxSourceLength)
	}
	maxAssets := positiveInt(input["max_assets"])
	if maxAssets == 0 {
		maxAssets = defaultMaxAssets
	}
	body := map[string]any{
		"source":     source,
		"max_assets": maxAssets,
	}
	return botprovider.Request{
		URL:     spec.ServicePath,
		Method:  "EXEC",
		Headers: map[string]string{},
		Body:    body,
	}, nil
}

func Execute(ctx context.Context, platform string, credential string, input map[string]any) (map[string]any, error) {
	native, err := BuildNativeRequest(platform, input, credential)
	if err != nil {
		return nil, err
	}
	resolved, err := frontwebcontent.Resolve(ctx, frontwebcontent.ResolveInput{
		Platform:   platform,
		Source:     strings.TrimSpace(native.Body["source"].(string)),
		Credential: credential,
		MaxAssets:  positiveInt(native.Body["max_assets"]),
	})
	if err != nil {
		return nil, err
	}
	return BuildOutput(resolved)
}

func BuildOutput(content frontwebcontent.ResolvedContent) (map[string]any, error) {
	metadata := resolvedContentMap(content)
	delete(metadata, "html")

	output := map[string]any{
		"event": "final",
		"json":  metadata,
	}
	if title := strings.TrimSpace(content.Title); title != "" {
		output["title"] = title
	}
	if text := strings.TrimSpace(content.Text); text != "" {
		output["text"] = text
	}
	if strings.EqualFold(strings.TrimSpace(content.ContentType), frontwebcontent.ContentTypeRichText) {
		document, err := frontrichtext.FromHTML(content.HTML, frontrichtext.HTMLOptions{
			Title: content.Title,
		})
		if err != nil {
			return nil, err
		}
		output["rich"] = document
	}

	mediaURLs := make(map[string][]string, len(mediaOutputSpecs))
	if content.Cover != nil {
		appendMediaOutputURL(mediaURLs, *content.Cover)
	}
	for _, current := range content.Media {
		appendMediaOutputURL(mediaURLs, current)
	}
	for _, spec := range mediaOutputSpecs {
		if urls := mediaURLs[spec.Kind]; len(urls) > 0 {
			output[spec.Field] = urls
		}
	}
	return output, nil
}

func appendMediaOutputURL(target map[string][]string, media frontwebcontent.Media) {
	kind := strings.ToLower(strings.TrimSpace(media.Kind))
	sourceURL := strings.TrimSpace(media.SourceURL)
	if sourceURL == "" {
		return
	}
	for _, spec := range mediaOutputSpecs {
		if spec.Kind != kind {
			continue
		}
		for _, existing := range target[kind] {
			if existing == sourceURL {
				return
			}
		}
		target[kind] = append(target[kind], sourceURL)
		return
	}
}

func ServiceMatchesPlatform(path string, platform string) bool {
	spec, ok := FindPlatform(platform)
	return ok && strings.EqualFold(strings.TrimSpace(path), spec.ServicePath)
}

func resolvedContentMap(content frontwebcontent.ResolvedContent) map[string]any {
	media := make([]any, 0, len(content.Media))
	for _, current := range content.Media {
		media = append(media, mediaMap(current))
	}
	author := map[string]any{}
	if content.Author != nil {
		author = map[string]any{
			"id":         strings.TrimSpace(content.Author.ID),
			"name":       strings.TrimSpace(content.Author.Name),
			"avatar_url": strings.TrimSpace(content.Author.AvatarURL),
		}
	}
	publishedAt := ""
	if content.PublishedAt != nil {
		publishedAt = content.PublishedAt.UTC().Format(time.RFC3339)
	}
	var cover any
	if content.Cover != nil {
		cover = mediaMap(*content.Cover)
	}
	return map[string]any{
		"platform":     strings.TrimSpace(content.Platform),
		"content_type": strings.TrimSpace(content.ContentType),
		"external_id":  strings.TrimSpace(content.ExternalID),
		"title":        strings.TrimSpace(content.Title),
		"text":         strings.TrimSpace(content.Text),
		"html":         strings.TrimSpace(content.HTML),
		"source_url":   strings.TrimSpace(content.SourceURL),
		"author":       author,
		"published_at": publishedAt,
		"cover":        cover,
		"media":        media,
	}
}

func mediaMap(current frontwebcontent.Media) map[string]any {
	result := map[string]any{
		"kind":        strings.TrimSpace(current.Kind),
		"source_url":  strings.TrimSpace(current.SourceURL),
		"name":        strings.TrimSpace(current.Name),
		"mime_type":   strings.TrimSpace(current.MIMEType),
		"width":       current.Width,
		"height":      current.Height,
		"duration_ms": current.DurationMS,
	}
	if current.ExpiresAt != nil {
		result["expires_at"] = current.ExpiresAt.UTC().Format(time.RFC3339)
	}
	return result
}

func positiveInt(value any) int {
	switch current := value.(type) {
	case int:
		if current > 0 {
			return current
		}
	case int64:
		if current > 0 {
			return int(current)
		}
	case uint64:
		if current > 0 {
			return int(current)
		}
	case float64:
		if current > 0 {
			return int(current)
		}
	}
	return 0
}
