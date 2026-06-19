package action

import (
	"fmt"
	"path"
	"strings"

	energonservice "github.com/dever-package/bot/service/energon"
)

const maxPromptAssets = 24

type Asset struct {
	Kind   string
	URL    string
	Name   string
	MIME   string
	Source string
}

type assetCollector struct {
	items []Asset
	seen  map[string]struct{}
}

func CollectAssets(input map[string]any, history []any) []Asset {
	collector := assetCollector{seen: map[string]struct{}{}}
	collector.addValue(input, "input")
	for index := len(history) - 1; index >= 0; index-- {
		collector.addValue(history[index], "history")
	}
	return collector.items
}

func AssetPrompt(assets []Asset) string {
	if len(assets) == 0 {
		return ""
	}
	rows := make([]string, 0, minInt(len(assets), maxPromptAssets)+1)
	rows = append(rows,
		"当前可用素材:",
		"以下素材来自用户输入、交互补充或本轮已完成的能力结果。任务需要已有素材时，优先使用这里的素材 URL；多个素材无法判断时先询问用户。",
	)
	limit := minInt(len(assets), maxPromptAssets)
	for index := 0; index < limit; index++ {
		asset := assets[index]
		name := strings.TrimSpace(asset.Name)
		if name == "" {
			name = fmt.Sprintf("%s-%d", asset.Kind, index+1)
		}
		rows = append(rows, fmt.Sprintf("- %s: %s，来源: %s，url: %s", asset.Kind, name, asset.Source, promptAssetURL(asset.URL)))
	}
	if len(assets) > limit {
		rows = append(rows, fmt.Sprintf("- 其余 %d 个素材已省略。", len(assets)-limit))
	}
	return strings.Join(rows, "\n")
}

func fillRequiredAssetInput(input map[string]any, params []energonservice.PowerParam, assets []Asset) map[string]any {
	if len(assets) == 0 {
		return input
	}
	result := cloneMap(input)
	for _, param := range params {
		if !param.Required || !isFileParam(param) || hasParamValue(result, param) {
			continue
		}
		key := paramInputKey(param)
		if key == "" {
			continue
		}
		selected := selectAssetsForParam(param, assets)
		if len(selected) == 0 {
			continue
		}
		if strings.EqualFold(strings.TrimSpace(param.Type), "file") {
			if len(selected) == 1 {
				result[key] = selected[0].URL
			}
			continue
		}
		result[key] = assetURLs(selected, param.MaxFiles)
	}
	return result
}

func (c *assetCollector) addValue(value any, source string) {
	switch current := value.(type) {
	case nil:
		return
	case []any:
		for _, item := range current {
			c.addValue(item, source)
		}
	case []map[string]any:
		for _, item := range current {
			c.addMap(item, source)
		}
	case map[string]any:
		c.addMap(current, source)
	}
}

func (c *assetCollector) addMap(value map[string]any, source string) {
	if len(value) == 0 {
		return
	}
	if asset, ok := assetFromMap(value, source); ok {
		c.add(asset)
	}
	c.addReferenceFiles(value, source)
	c.addMediaFields(value, source)
	c.addRich(value["rich"], source)
	c.addRich(normalizeMap(value["content"])["rich"], source)
	for _, key := range []string{"task", "input", "data", "output", "content", "interaction"} {
		if child, exists := value[key]; exists {
			c.addValue(child, sourceForChild(source, key))
		}
	}
}

func (c *assetCollector) addReferenceFiles(value map[string]any, source string) {
	for _, key := range []string{"reference_files", "references"} {
		if files, exists := value[key]; exists {
			c.addValue(files, "reference_files")
		}
	}
}

func (c *assetCollector) addMediaFields(value map[string]any, source string) {
	c.addMedia("image", source, value["images"], value["image"], value["image_url"])
	c.addMedia("video", source, value["videos"], value["video"], value["video_url"])
	c.addMedia("audio", source, value["audios"], value["audio"], value["audio_url"])
	c.addMedia("file", source, value["files"], value["file"], value["file_url"])
}

func (c *assetCollector) addMedia(kind string, source string, values ...any) {
	key := kind + "s"
	for _, value := range values {
		for _, url := range normalizeActionMediaList(value, key) {
			c.add(Asset{
				Kind:   assetKindFromURL(kind, url),
				URL:    strings.TrimSpace(url),
				Name:   assetNameFromURL(url),
				Source: source,
			})
		}
	}
}

func (c *assetCollector) addRich(value any, source string) {
	doc := normalizeMap(value)
	if len(doc) == 0 || doc["type"] != "doc" {
		return
	}
	c.collectRichNode(doc, source)
}

func (c *assetCollector) collectRichNode(node map[string]any, source string) {
	nodeType := strings.TrimSpace(firstText(node["type"]))
	attrs := normalizeMap(node["attrs"])
	src := strings.TrimSpace(firstText(attrs["src"]))
	switch nodeType {
	case richImageNode:
		c.add(Asset{Kind: "image", URL: src, Name: firstText(attrs["title"], attrs["alt"]), Source: source})
	case richVideoNode:
		c.add(Asset{Kind: "video", URL: src, Name: firstText(attrs["title"], attrs["alt"]), Source: source})
	case richAudioNode:
		c.add(Asset{Kind: "audio", URL: src, Name: firstText(attrs["title"], attrs["alt"]), Source: source})
	}
	switch children := node["content"].(type) {
	case []any:
		for _, child := range children {
			if mapped := normalizeMap(child); len(mapped) > 0 {
				c.collectRichNode(mapped, source)
			}
		}
	case []map[string]any:
		for _, child := range children {
			c.collectRichNode(child, source)
		}
	}
}

func (c *assetCollector) add(asset Asset) {
	asset.URL = strings.TrimSpace(asset.URL)
	if asset.URL == "" {
		return
	}
	asset.Kind = normalizeAssetKind(asset.Kind, asset.MIME, asset.URL)
	if asset.Kind == "" {
		asset.Kind = "file"
	}
	key := asset.Kind + "\x00" + asset.URL
	if _, exists := c.seen[key]; exists {
		return
	}
	c.seen[key] = struct{}{}
	if strings.TrimSpace(asset.Name) == "" {
		asset.Name = assetNameFromURL(asset.URL)
	}
	if strings.TrimSpace(asset.Source) == "" {
		asset.Source = "context"
	}
	c.items = append(c.items, asset)
}

func assetFromMap(value map[string]any, source string) (Asset, bool) {
	url := firstText(value["url"], value["src"], value["open_url"], value["download"], value["data_url"])
	if url == "" {
		return Asset{}, false
	}
	mime := firstText(value["mime"], value["mime_type"], value["content_type"])
	return Asset{
		Kind:   normalizeAssetKind(firstText(value["kind"], value["media_kind"], value["type"]), mime, url),
		URL:    url,
		Name:   firstText(value["name"], value["file_name"], value["filename"], value["title"]),
		MIME:   mime,
		Source: source,
	}, true
}

func selectAssetsForParam(param energonservice.PowerParam, assets []Asset) []Asset {
	kinds := assetKindsForParam(param)
	if len(kinds) > 0 {
		return assetsByKinds(assets, kinds)
	}
	if len(assets) == 1 {
		return assets
	}
	if assetsShareKind(assets) {
		return assets
	}
	return nil
}

func assetsByKinds(assets []Asset, kinds []string) []Asset {
	allowed := map[string]struct{}{}
	for _, kind := range kinds {
		allowed[kind] = struct{}{}
	}
	result := make([]Asset, 0, len(assets))
	for _, asset := range assets {
		if _, ok := allowed[asset.Kind]; ok {
			result = append(result, asset)
		}
	}
	return result
}

func assetKindsForParam(param energonservice.PowerParam) []string {
	text := strings.ToLower(strings.Join([]string{param.Key, param.Name, param.ValueType}, " "))
	candidates := []struct {
		kind  string
		words []string
	}{
		{"image", []string{"image", "img", "picture", "photo", "参考图", "图片", "图像", "素材图"}},
		{"video", []string{"video", "movie", "clip", "视频", "影片", "素材视频"}},
		{"audio", []string{"audio", "voice", "music", "sound", "音频", "语音", "音乐", "声音"}},
		{"file", []string{"file", "attachment", "document", "文件", "附件", "资料", "文档"}},
	}
	kinds := make([]string, 0, 1)
	for _, candidate := range candidates {
		for _, word := range candidate.words {
			if strings.Contains(text, word) {
				kinds = appendUniqueStrings(kinds, candidate.kind)
				break
			}
		}
	}
	return kinds
}

func assetURLs(assets []Asset, maxFiles int) []string {
	limit := len(assets)
	if maxFiles > 0 && maxFiles < limit {
		limit = maxFiles
	}
	urls := make([]string, 0, limit)
	for index := 0; index < limit; index++ {
		if assets[index].URL != "" {
			urls = append(urls, assets[index].URL)
		}
	}
	return urls
}

func assetsShareKind(assets []Asset) bool {
	if len(assets) == 0 {
		return false
	}
	kind := assets[0].Kind
	for _, asset := range assets[1:] {
		if asset.Kind != kind {
			return false
		}
	}
	return true
}

func isFileParam(param energonservice.PowerParam) bool {
	switch strings.ToLower(strings.TrimSpace(param.Type)) {
	case "file", "files":
		return true
	default:
		return false
	}
}

func normalizeAssetKind(values ...string) string {
	fallback := ""
	for _, value := range values {
		text := strings.ToLower(strings.TrimSpace(value))
		switch {
		case text == "":
			continue
		case text == "image" || text == "images" || strings.HasPrefix(text, "image/") || strings.HasPrefix(text, "data:image/") || hasExt(text, imageExts):
			return "image"
		case text == "video" || text == "videos" || strings.HasPrefix(text, "video/") || strings.HasPrefix(text, "data:video/") || hasExt(text, videoExts):
			return "video"
		case text == "audio" || text == "audios" || strings.HasPrefix(text, "audio/") || strings.HasPrefix(text, "data:audio/") || hasExt(text, audioExts):
			return "audio"
		case text == "file" || text == "files" || strings.HasPrefix(text, "application/") || strings.HasPrefix(text, "text/"):
			fallback = "file"
		default:
			if fallback == "" {
				fallback = "file"
			}
		}
	}
	return fallback
}

func assetKindFromURL(fallback string, url string) string {
	if kind := normalizeAssetKind(url); kind != "" && kind != "file" {
		return kind
	}
	return normalizeAssetKind(fallback)
}

func assetNameFromURL(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || strings.HasPrefix(value, "data:") {
		return ""
	}
	name := path.Base(strings.Split(value, "?")[0])
	if name == "." || name == "/" {
		return ""
	}
	return name
}

func sourceForChild(source string, key string) string {
	switch key {
	case "output":
		return "tool_observation"
	case "interaction":
		return "interaction"
	default:
		return source
	}
}

func promptAssetURL(value string) string {
	value = strings.TrimSpace(value)
	if len(value) <= 240 {
		return value
	}
	if strings.HasPrefix(value, "data:") {
		return value[:160] + "...(data URL 已截断，完整值仍在输入上下文中)"
	}
	return value[:220] + "..."
}

func hasExt(value string, exts map[string]struct{}) bool {
	ext := strings.ToLower(path.Ext(strings.Split(value, "?")[0]))
	if ext == "" {
		return false
	}
	_, ok := exts[ext]
	return ok
}

func minInt(a int, b int) int {
	if a < b {
		return a
	}
	return b
}

var (
	imageExts = map[string]struct{}{
		".jpg": {}, ".jpeg": {}, ".png": {}, ".gif": {}, ".webp": {}, ".svg": {}, ".bmp": {}, ".avif": {},
	}
	videoExts = map[string]struct{}{
		".mp4": {}, ".mov": {}, ".webm": {}, ".mkv": {}, ".avi": {}, ".m4v": {}, ".m3u8": {},
	}
	audioExts = map[string]struct{}{
		".mp3": {}, ".wav": {}, ".m4a": {}, ".aac": {}, ".flac": {}, ".ogg": {}, ".opus": {},
	}
)
