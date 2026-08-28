package workbench

import (
	"context"
	"fmt"
	"net/url"
	"path"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
	frontrichtext "github.com/dever-package/front/service/richtext"
	frontupload "github.com/dever-package/front/service/upload"
	frontwebcontent "github.com/dever-package/front/service/webcontent"
)

const (
	bodyUploadBizKey  = "bot_work"
	bodyUploadBizName = "神创工作台"
)

var webContentImportGateway = energonservice.NewGatewayService()

func webContentImportAvailablePlatforms(ctx context.Context) map[string]bool {
	result := make(map[string]bool)
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{
		"key":    botwebcontent.PowerKey,
		"status": energonservice.StatusActive,
	})
	if power == nil {
		return result
	}
	for platform, targetIDs := range webContentImportGateway.AvailableWebContentTargetIDs(ctx, power.ID) {
		result[platform] = len(targetIDs) > 0
	}
	return result
}

func webContentImportPlatformOptions(available map[string]bool) []map[string]any {
	result := make([]map[string]any, 0, len(available))
	for _, spec := range botwebcontent.Platforms() {
		if !available[spec.Key] {
			continue
		}
		result = append(result, map[string]any{"key": spec.Key, "name": spec.Name})
	}
	return result
}

type importedWebContentMedia struct {
	Kind       string
	SourceURL  string
	Name       string
	MIMEType   string
	Width      int
	Height     int
	DurationMS int64
	ExpiresAt  string
}

type webContentMediaTransfer struct {
	Replacements  map[string]string
	Source        []any
	ContentByKind map[string][]any
	Warnings      []string
}

type resolvedWebContentImport struct {
	Payload     map[string]any
	Document    map[string]any
	Platform    string
	ExternalID  string
	SourceURL   string
	ContentType string
	Title       string
	DedupeKey   string
	ProviderID  uint64
	AccountID   uint64
}

type webContentImportItemResult struct {
	AssetID  uint64
	Status   string
	Result   map[string]any
	Warnings []string
}

type webContentImportProgressFunc func(stage string, message string, progress int)

func resolveWebContentImport(
	ctx context.Context,
	task assetmodel.ImportTask,
	item assetmodel.ImportItem,
) (resolvedWebContentImport, error) {
	spec, ok := botwebcontent.FindPlatform(item.Platform)
	if !ok {
		return resolvedWebContentImport{}, fmt.Errorf("导入任务包含不支持的平台")
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{
		"key":    botwebcontent.PowerKey,
		"status": energonservice.StatusActive,
	})
	if power == nil {
		return resolvedWebContentImport{}, fmt.Errorf("请先配置并启用%s来源", spec.Name)
	}
	targetIDs := webContentImportGateway.AvailableWebContentTargetIDs(ctx, power.ID)[item.Platform]
	if len(targetIDs) == 0 {
		return resolvedWebContentImport{}, fmt.Errorf("请先配置并启用%s来源", spec.Name)
	}
	requestID := webContentImportItemRequestID(task.ID, item.ID)
	result, err := webContentImportGateway.Invoke(ctx, energonservice.GatewayRequest{
		RequestID:              requestID,
		Method:                 "POST",
		Path:                   "/bot/admin/energon/request",
		AllowedSourceTargetIDs: targetIDs,
		Body: map[string]any{
			"power": botwebcontent.PowerKey,
			"input": map[string]any{botwebcontent.InputParamKey: item.SourceURL},
			"options": map[string]any{
				"stream": false,
			},
		},
		Billing: botprotocol.BillingContext{
			Billable:  false,
			Scene:     "web_content_import",
			UserID:    task.UserID,
			TeamID:    task.TeamID,
			ProjectID: task.ProjectID,
		},
	}, energonservice.InvokeOptions{})
	selection := webContentImportSelection(ctx, requestID)
	if err != nil {
		return resolvedWebContentImport{
			ProviderID: selection.ProviderID,
			AccountID:  selection.AccountID,
		}, fmt.Errorf("解析网页内容失败: %w", err)
	}
	payload := webContentResolvedPayload(result.Output)
	document := recordValue(result.Output["rich"])
	if err := validateResolvedWebContent(spec, payload, document); err != nil {
		return resolvedWebContentImport{
			ProviderID: selection.ProviderID,
			AccountID:  selection.AccountID,
		}, err
	}
	platform := nestedText(payload, "platform")
	externalID := nestedText(payload, "external_id")
	sourceURL := nestedText(payload, "source_url")
	dedupeKey := assetmodel.BuildImportDedupeKey(platform, externalID, sourceURL)
	if dedupeKey == "" {
		return resolvedWebContentImport{}, fmt.Errorf("网页内容缺少稳定来源标识")
	}
	title := nestedText(payload, "title")
	if title == "" {
		title = webContentDefaultTitle(platform)
	}
	return resolvedWebContentImport{
		Payload:     payload,
		Document:    document,
		Platform:    platform,
		ExternalID:  externalID,
		SourceURL:   sourceURL,
		ContentType: nestedText(payload, "content_type"),
		Title:       title,
		DedupeKey:   dedupeKey,
		ProviderID:  selection.ProviderID,
		AccountID:   selection.AccountID,
	}, nil
}

func webContentImportItemRequestID(taskID uint64, itemID uint64) string {
	return fmt.Sprintf("web-content:%d:%d", taskID, itemID)
}

func (s Service) saveResolvedWebContentImport(
	ctx context.Context,
	task assetmodel.ImportTask,
	item assetmodel.ImportItem,
	resolved resolvedWebContentImport,
	progress webContentImportProgressFunc,
) (webContentImportItemResult, error) {
	nodeKey := assetmodel.BuildImportNodeKey(resolved.Platform, resolved.DedupeKey)
	if existing := findExistingWebContentAsset(ctx, task, nodeKey); existing != nil {
		return webContentImportItemResult{
			AssetID:  existing.ID,
			Status:   assetmodel.ImportItemStatusSkipped,
			Result:   webContentImportResultSummary(resolved, existing.ID),
			Warnings: []string{},
		}, nil
	}

	mediaTransfer := importWebContentMedia(ctx, resolved.Payload, progress)
	assetKind, content, err := projectWebContentAsset(resolved, mediaTransfer)
	if err != nil {
		return webContentImportItemResult{}, err
	}
	if progress != nil {
		progress("saving", "正在保存素材", 94)
	}

	sourceMetadata := map[string]any{
		"platform":          resolved.Platform,
		"content_type":      resolved.ContentType,
		"external_id":       resolved.ExternalID,
		"source_url":        resolved.SourceURL,
		"author":            recordValue(resolved.Payload["author"]),
		"published_at":      nestedText(resolved.Payload, "published_at"),
		"text":              nestedText(resolved.Payload, "text"),
		"cover":             recordValue(resolved.Payload["cover"]),
		"import_request_id": task.RequestID,
		"import_task_id":    task.ID,
		"import_item_id":    item.ID,
		"media":             mediaTransfer.Source,
		"warnings":          mediaTransfer.Warnings,
	}
	asset, _, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		UserID:     task.UserID,
		ProjectID:  task.ProjectID,
		CanvasID:   task.CanvasID,
		BodyID:     task.BodyID,
		TeamID:     task.TeamID,
		ReleaseID:  task.ReleaseID,
		RequestID:  "web-content:" + resolved.DedupeKey,
		NodeKey:    nodeKey,
		SourceType: assetmodel.SourceImport,
		SourceID:   0,
		SourceName: webContentSourceName(resolved.Platform),
		Source:     sourceMetadata,
		Name:       resolved.Title,
		Kind:       assetKind,
		Role:       assetmodel.RoleMaterial,
		Content:    content,
	})
	if err != nil {
		return webContentImportItemResult{}, err
	}
	return webContentImportItemResult{
		AssetID:  asset.ID,
		Status:   assetmodel.ImportItemStatusSuccess,
		Result:   webContentImportResultSummary(resolved, asset.ID),
		Warnings: mediaTransfer.Warnings,
	}, nil
}

func webContentImportSelection(ctx context.Context, requestID string) energonmodel.Log {
	if strings.TrimSpace(requestID) == "" {
		return energonmodel.Log{}
	}
	row := energonmodel.NewLogModel().Find(ctx, map[string]any{"request_id": requestID}, map[string]any{
		"order": "main.id desc",
	})
	if row == nil {
		return energonmodel.Log{}
	}
	return *row
}

func findExistingWebContentAsset(
	ctx context.Context,
	task assetmodel.ImportTask,
	nodeKey string,
) *assetmodel.Asset {
	if nodeKey == "" {
		return nil
	}
	return assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"user_id":     task.UserID,
		"team_id":     task.TeamID,
		"project_id":  task.ProjectID,
		"canvas_id":   task.CanvasID,
		"body_id":     task.BodyID,
		"source_type": assetmodel.SourceImport,
		"node_key":    nodeKey,
		"role":        assetmodel.RoleMaterial,
		"status":      assetmodel.StatusCurrent,
		"version_id":  map[string]any{"gt": 0},
	})
}

func webContentImportResultSummary(resolved resolvedWebContentImport, assetID uint64) map[string]any {
	return map[string]any{
		"asset_id":     assetID,
		"platform":     resolved.Platform,
		"external_id":  resolved.ExternalID,
		"source_url":   resolved.SourceURL,
		"content_type": resolved.ContentType,
		"title":        resolved.Title,
	}
}

func webContentDefaultTitle(platform string) string {
	if spec, ok := botwebcontent.FindPlatform(platform); ok {
		return spec.DefaultTitle
	}
	return "导入内容"
}

func webContentSourceName(platform string) string {
	if spec, ok := botwebcontent.FindPlatform(platform); ok {
		return spec.Name
	}
	return "网页内容"
}

func webContentResolvedPayload(output botprotocol.Output) map[string]any {
	if payload := recordValue(output["json"]); len(payload) > 0 {
		return payload
	}
	payload := make(map[string]any, len(output))
	for key, value := range output {
		payload[key] = value
	}
	return payload
}

func validateResolvedWebContent(
	spec botwebcontent.PlatformSpec,
	resolved map[string]any,
	document map[string]any,
) error {
	if nestedText(resolved, "platform") != spec.Key {
		return fmt.Errorf("解析结果与导入平台不匹配")
	}
	if nestedText(resolved, "content_type") != spec.ContentType {
		return fmt.Errorf("%s解析结果类型无效", spec.Name)
	}
	switch spec.ContentType {
	case frontwebcontent.ContentTypeRichText:
		if document["type"] != "doc" || len(listValue(document["content"])) == 0 {
			return fmt.Errorf("公众号文章正文为空")
		}
	case frontwebcontent.ContentTypeVideo:
		if !resolvedWebContentHasMedia(resolved, frontwebcontent.MediaKindVideo) {
			return fmt.Errorf("抖音作品缺少可用视频")
		}
	default:
		return fmt.Errorf("暂不支持该内容类型")
	}
	return nil
}

func resolvedWebContentHasMedia(resolved map[string]any, kind string) bool {
	for _, value := range listValue(resolved["media"]) {
		media := parseWebContentMedia(value)
		if media.Kind == kind && media.SourceURL != "" {
			return true
		}
	}
	return false
}

func projectWebContentAsset(
	resolved resolvedWebContentImport,
	media webContentMediaTransfer,
) (string, map[string]any, error) {
	spec, ok := botwebcontent.FindPlatform(resolved.Platform)
	if !ok {
		return "", nil, fmt.Errorf("暂不支持该内容平台")
	}
	switch spec.AssetKind {
	case assetmodel.KindRichText:
		return spec.AssetKind, frontrichtext.RewriteMediaURLs(resolved.Document, media.Replacements), nil
	case assetmodel.KindVideo:
		return projectWebContentVideoAsset(resolved, media)
	default:
		return "", nil, fmt.Errorf("暂不支持保存该内容类型")
	}
}

func projectWebContentVideoAsset(
	resolved resolvedWebContentImport,
	media webContentMediaTransfer,
) (string, map[string]any, error) {
	videoItems := cloneWebContentMediaPayloads(media.ContentByKind[frontwebcontent.MediaKindVideo])
	if len(videoItems) == 0 {
		return "", nil, fmt.Errorf("抖音作品缺少可保存的视频")
	}
	videoURL := nestedText(recordValue(videoItems[0]), "url")
	if videoURL == "" {
		return "", nil, fmt.Errorf("抖音作品视频地址为空")
	}
	if coverURL := firstWebContentMediaURL(media.ContentByKind[frontwebcontent.MediaKindImage]); coverURL != "" {
		for index, value := range videoItems {
			payload := recordValue(value)
			payload["thumbnail"] = coverURL
			videoItems[index] = payload
		}
	}
	raw := map[string]any{
		"video":  videoURL,
		"videos": videoItems,
	}
	if durationMS := nestedUint64(recordValue(videoItems[0]), "duration_ms"); durationMS > 0 {
		raw["duration_ms"] = durationMS
	}
	document := assetservice.EnsureDocument(raw, assetmodel.KindVideo)
	if text := nestedText(resolved.Payload, "text"); text != "" {
		document["text"] = text
	}
	return assetmodel.KindVideo, document, nil
}

func cloneWebContentMediaPayloads(values []any) []any {
	result := make([]any, 0, len(values))
	for _, value := range values {
		payload := recordValue(value)
		if len(payload) == 0 {
			continue
		}
		result = append(result, cloneMap(payload))
	}
	return result
}

func firstWebContentMediaURL(values []any) string {
	for _, value := range values {
		if mediaURL := nestedText(recordValue(value), "url"); mediaURL != "" {
			return mediaURL
		}
	}
	return ""
}

func importWebContentMedia(
	ctx context.Context,
	resolved map[string]any,
	progress webContentImportProgressFunc,
) webContentMediaTransfer {
	result := webContentMediaTransfer{
		Replacements:  map[string]string{},
		Source:        make([]any, 0),
		ContentByKind: make(map[string][]any),
		Warnings:      make([]string, 0),
	}
	mediaItems := webContentMediaItems(resolved)
	if len(mediaItems) == 0 {
		if progress != nil {
			progress("transferring", "媒体处理完成", 88)
		}
		return result
	}
	for index, media := range mediaItems {
		entry := webContentMediaSourceEntry(media)
		file, err := frontupload.ImportURLResource(ctx, frontupload.ImportURLResourceInput{
			RuleID:  webContentUploadRule(media.Kind),
			URL:     media.SourceURL,
			Name:    webContentMediaName(media),
			Mime:    media.MIMEType,
			Kind:    media.Kind,
			BizKey:  bodyUploadBizKey,
			BizName: bodyUploadBizName,
			Progress: func(message string, current int) {
				if progress == nil {
					return
				}
				mapped := 30 + ((index*58)+(clampImportProgress(current)*58/100))/len(mediaItems)
				progress("transferring", strings.TrimSpace(message), mapped)
			},
		})
		if err != nil {
			entry["status"] = "remote"
			entry["url"] = media.SourceURL
			result.Warnings = append(result.Warnings, fmt.Sprintf("%s转存失败，已保留原地址: %v", webContentMediaLabel(media.Kind), err))
			result.Source = append(result.Source, entry)
			result.ContentByKind[media.Kind] = append(
				result.ContentByKind[media.Kind],
				webContentMediaPayload(media, media.SourceURL),
			)
			continue
		}
		storedURL := nestedText(file, "url")
		if storedURL == "" {
			storedURL = media.SourceURL
		}
		result.Replacements[media.SourceURL] = storedURL
		entry["status"] = "stored"
		entry["url"] = storedURL
		entry["file_id"] = nestedUint64(file, "id")
		result.Source = append(result.Source, entry)
		payload := cloneMap(file)
		mergeWebContentMediaMetadata(payload, media, storedURL)
		result.ContentByKind[media.Kind] = append(result.ContentByKind[media.Kind], payload)
		if progress != nil {
			progress("transferring", "媒体转存完成", 30+((index+1)*58)/len(mediaItems))
		}
	}
	return result
}

func webContentMediaItems(resolved map[string]any) []importedWebContentMedia {
	result := make([]importedWebContentMedia, 0)
	seen := make(map[string]struct{})
	appendMedia := func(value any) {
		media := parseWebContentMedia(value)
		if media.SourceURL == "" || media.Kind == "" {
			return
		}
		key := media.Kind + "\x00" + media.SourceURL
		if _, exists := seen[key]; exists {
			return
		}
		seen[key] = struct{}{}
		result = append(result, media)
	}
	appendMedia(resolved["cover"])
	for _, value := range listValue(resolved["media"]) {
		appendMedia(value)
	}
	return result
}

func webContentMediaSourceEntry(media importedWebContentMedia) map[string]any {
	entry := map[string]any{
		"kind":       media.Kind,
		"source_url": media.SourceURL,
		"name":       media.Name,
	}
	mergeWebContentMediaMetadata(entry, media, "")
	return entry
}

func webContentMediaPayload(media importedWebContentMedia, mediaURL string) map[string]any {
	payload := map[string]any{}
	mergeWebContentMediaMetadata(payload, media, mediaURL)
	return payload
}

func mergeWebContentMediaMetadata(
	payload map[string]any,
	media importedWebContentMedia,
	mediaURL string,
) {
	payload["kind"] = media.Kind
	if mediaURL != "" {
		payload["url"] = mediaURL
	}
	if media.Name != "" {
		payload["name"] = media.Name
	}
	if media.MIMEType != "" {
		payload["mime"] = media.MIMEType
	}
	if media.Width > 0 {
		payload["width"] = media.Width
	}
	if media.Height > 0 {
		payload["height"] = media.Height
	}
	if media.DurationMS > 0 {
		payload["duration_ms"] = media.DurationMS
	}
	if media.ExpiresAt != "" {
		payload["expires_at"] = media.ExpiresAt
	}
}

func parseWebContentMedia(value any) importedWebContentMedia {
	row := recordValue(value)
	return importedWebContentMedia{
		Kind:       strings.ToLower(nestedText(row, "kind")),
		SourceURL:  nestedText(row, "source_url"),
		Name:       nestedText(row, "name"),
		MIMEType:   nestedText(row, "mime_type"),
		Width:      int(nestedUint64(row, "width")),
		Height:     int(nestedUint64(row, "height")),
		DurationMS: int64(nestedUint64(row, "duration_ms")),
		ExpiresAt:  nestedText(row, "expires_at"),
	}
}

func webContentUploadRule(kind string) uint64 {
	switch kind {
	case "video":
		return 2
	case "audio":
		return 3
	default:
		return 1
	}
}

func webContentMediaName(media importedWebContentMedia) string {
	if media.Name != "" {
		return media.Name
	}
	parsed, err := url.Parse(media.SourceURL)
	if err == nil {
		if name := strings.TrimSpace(path.Base(parsed.Path)); name != "" && name != "." && name != "/" {
			return name
		}
	}
	return webContentMediaLabel(media.Kind)
}

func webContentMediaLabel(kind string) string {
	switch kind {
	case "video":
		return "视频"
	case "audio":
		return "音频"
	default:
		return "图片"
	}
}
