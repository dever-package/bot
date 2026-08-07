package reference

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimesessionstate "github.com/dever-package/bot/service/agent/runtime/sessionstate"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	uploadaccess "github.com/dever-package/front/service/upload/access"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const maxResolvedMedia = 32

type Resolver struct {
	artifacts runtimeartifact.Service
	assets    assetservice.Service
	server    *server.Context
}

func NewRequestResolver(serverContext *server.Context) Resolver {
	return Resolver{artifacts: runtimeartifact.NewService(), assets: assetservice.NewService(), server: serverContext}
}

func (r Resolver) Resolve(ctx context.Context, session agentmodel.Session, references []Reference) (Result, error) {
	result := Result{Items: make([]Resolved, 0, len(references))}
	for _, current := range references {
		resolved, err := r.resolveOne(ctx, session, current)
		if err != nil {
			return Result{}, err
		}
		for index := range resolved.Media {
			if strings.TrimSpace(resolved.Media[index].Usage) == "" {
				resolved.Media[index].Usage = current.Usage
			}
		}
		result.Items = append(result.Items, resolved)
		result.Media = appendUniqueMedia(result.Media, resolved.Media...)
	}
	result.Context = resolvedContext(result.Items, result.Media)
	return result, nil
}

func (r Resolver) Preview(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	return r.resolveOne(ctx, session, reference)
}

func (r Resolver) resolveOne(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	switch reference.Type {
	case TypeMessage:
		return r.resolveMessage(ctx, session, reference)
	case TypeArtifact:
		return r.resolveArtifact(ctx, session, reference)
	case TypeUploadFile:
		return r.resolveUploadFile(ctx, reference)
	case TypeSession:
		return r.resolveSession(ctx, session, reference)
	case TypeAsset:
		return r.resolveAsset(ctx, session, reference)
	default:
		return Resolved{}, fmt.Errorf("不支持的引用类型: %s", reference.Type)
	}
}

func (r Resolver) resolveAsset(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	teamID := bodyTeamID(session.ContextKey)
	if teamID == 0 {
		return Resolved{}, fmt.Errorf("当前会话不支持团队资产引用")
	}
	resolved, err := r.assets.RequireCurrentReference(ctx, teamID, reference.ID, reference.VersionID)
	if err != nil {
		return Resolved{}, err
	}
	content := resolved.Content
	title := firstText(resolved.Asset.Name, reference.Label, fmt.Sprintf("资产 %d", reference.ID))
	kind := firstText(resolved.Asset.Kind, "file")
	resolvedMedia := energoninput.MediaReferencesFromContent(TypeAsset, reference.ID, kind, content, reference.Usage)
	// Collections and legacy file assets may not expose a typed media array.
	// Preserve their existing single-file fallback without truncating typed media.
	if len(resolvedMedia) == 0 && (kind == "file" || kind == "collection") {
		if url := assetContentURL(content, kind); url != "" {
			resolvedMedia = append(resolvedMedia, energoninput.MediaReference{
				ReferenceType: TypeAsset,
				ReferenceID:   reference.ID,
				Kind:          kind,
				URL:           url,
				Usage:         reference.Usage,
			})
		}
	}
	selection := energoninput.MediaReferenceSelection{
		URL:   reference.MediaURL,
		Index: reference.MediaIndex,
		Items: mediaReferenceSelectionItems(reference.MediaItems),
	}
	resolvedMedia, err = energoninput.SelectMediaReferences(resolvedMedia, selection)
	if err != nil {
		return Resolved{}, err
	}
	selectedContent := energoninput.SelectedMediaReferenceContent(
		content,
		resolvedMedia,
		selection,
	)
	media := make([]Media, 0, len(resolvedMedia))
	for _, current := range resolvedMedia {
		media = append(media, Media{
			ReferenceType: TypeAsset,
			ReferenceID:   reference.ID,
			Kind:          normalizeMediaKind(current.Kind),
			Name:          title,
			Label:         title,
			URL:           current.URL,
			Usage:         current.Usage,
		})
	}
	output := mapValue(selectedContent)
	if len(output) == 0 && selectedContent != nil {
		output = map[string]any{"content": selectedContent}
	}
	return Resolved{
		Reference: reference,
		Title:     title,
		Text:      assetContentText(selectedContent),
		Media:     cleanMedia(media),
		Output:    output,
	}, nil
}

func mediaReferenceSelectionItems(items []MediaSelectionItem) []energoninput.MediaReferenceSelectionItem {
	result := make([]energoninput.MediaReferenceSelectionItem, 0, len(items))
	for _, item := range items {
		result = append(result, energoninput.MediaReferenceSelectionItem{
			URL:   item.URL,
			Index: item.Index,
			Usage: item.Usage,
		})
	}
	return result
}

func (r Resolver) resolveMessage(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{"id": reference.ID})
	if message == nil {
		return Resolved{}, fmt.Errorf("引用消息不存在")
	}
	if _, err := requireSourceSession(ctx, session, message.SessionID); err != nil {
		return Resolved{}, err
	}
	artifacts := r.artifacts.MessagePayloads(ctx, message.ID)
	media := make([]Media, 0, len(artifacts))
	for _, artifact := range artifacts {
		media = append(media, mediaFromArtifactPayload(artifact))
	}
	output, text := runtimemessageoutput.FormatMessage(message.Output, message.Text, artifacts)
	return Resolved{
		Reference: reference,
		Title:     messageReferenceTitle(*message),
		Text:      text,
		Media:     cleanMedia(media),
		Output:    output,
	}, nil
}

func (r Resolver) resolveArtifact(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	artifact := r.artifacts.Find(ctx, reference.ID)
	if artifact == nil {
		return Resolved{}, fmt.Errorf("引用素材不存在")
	}
	if _, err := requireSourceSession(ctx, session, artifact.SessionID); err != nil {
		return Resolved{}, err
	}
	payload := runtimeartifact.Payload(ctx, *artifact)
	media := mediaFromArtifactPayload(payload)
	if media.URL == "" || artifact.Status != agentmodel.ArtifactStatusReady {
		return Resolved{}, fmt.Errorf("引用素材尚未生成完成")
	}
	return Resolved{
		Reference: reference,
		Title:     textValue(payload["label"]),
		Media:     []Media{media},
	}, nil
}

func (r Resolver) resolveUploadFile(ctx context.Context, reference Reference) (Resolved, error) {
	file, err := uploadrepo.FindUploadFile(ctx, reference.ID)
	if err != nil {
		return Resolved{}, fmt.Errorf("引用文件不存在")
	}
	if r.server != nil {
		if err := uploadaccess.EnsureFile(r.server, uploadaccess.OperationRead, file); err != nil {
			return Resolved{}, fmt.Errorf("引用文件不存在或无权访问")
		}
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	name := firstText(payload["name"], reference.Label, fmt.Sprintf("文件 %d", reference.ID))
	media := Media{
		ReferenceType: TypeUploadFile,
		ReferenceID:   reference.ID,
		FileID:        reference.ID,
		Kind:          normalizeMediaKind(firstText(payload["kind"], payload["mime"])),
		Name:          name,
		Label:         name,
		URL:           firstText(payload["url"], payload["open_url"]),
	}
	return Resolved{Reference: reference, Title: name, Media: []Media{media}}, nil
}

func (r Resolver) resolveSession(ctx context.Context, current agentmodel.Session, reference Reference) (Resolved, error) {
	session, err := requireSourceSession(ctx, current, reference.ID)
	if err != nil {
		return Resolved{}, err
	}
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": session.ID,
		"role":       "assistant",
		"status":     agentmodel.MessageStatusNormal,
	}, map[string]any{"order": "main.id desc", "limit": 1})
	text := runtimesessionstate.Render(session.ContextSummary)
	media := []Media{}
	if len(rows) > 0 && rows[0] != nil {
		if text == "" {
			text = rows[0].Text
		}
		for _, artifact := range r.artifacts.ByMessage(ctx, rows[0].ID) {
			media = append(media, mediaFromArtifactPayload(runtimeartifact.Payload(ctx, artifact)))
		}
	}
	return Resolved{Reference: reference, Title: session.Title, Text: strings.TrimSpace(text), Media: cleanMedia(media)}, nil
}

func requireSourceSession(ctx context.Context, current agentmodel.Session, sessionID uint64) (*agentmodel.Session, error) {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         sessionID,
		"owner_type": current.OwnerType,
		"owner_id":   current.OwnerID,
	})
	if session == nil ||
		strings.TrimSpace(session.AgentKey) != strings.TrimSpace(current.AgentKey) ||
		strings.TrimSpace(session.ContextKey) != strings.TrimSpace(current.ContextKey) {
		return nil, fmt.Errorf("引用内容不存在或无权访问")
	}
	return session, nil
}

func resolvedContext(items []Resolved, allowedMedia []Media) []map[string]any {
	if len(items) == 0 {
		return nil
	}
	allowed := make(map[string]struct{}, len(allowedMedia))
	for _, media := range allowedMedia {
		allowed[mediaKey(media)] = struct{}{}
	}
	result := make([]map[string]any, 0, len(items))
	for _, item := range items {
		current := map[string]any{
			"ref_type": item.Reference.Type,
			"ref_id":   item.Reference.ID,
			"trigger":  item.Reference.Trigger,
			"title":    strings.TrimSpace(item.Title),
		}
		if item.Reference.VersionID > 0 {
			current["version_id"] = item.Reference.VersionID
		}
		if item.Reference.Usage != "" {
			current["usage"] = item.Reference.Usage
		}
		if text := strings.TrimSpace(item.Text); text != "" {
			current["text"] = text
		}
		mediaItems := make([]map[string]any, 0, len(item.Media))
		seenMedia := make(map[string]struct{}, len(item.Media))
		for _, media := range item.Media {
			if _, exists := allowed[mediaKey(media)]; !exists {
				continue
			}
			logicalKey := mediaKey(media)
			if _, exists := seenMedia[logicalKey]; exists {
				continue
			}
			seenMedia[logicalKey] = struct{}{}
			mediaItem := map[string]any{
				"ref_type": media.ReferenceType,
				"ref_id":   media.ReferenceID,
				"label":    media.Label,
				"kind":     media.Kind,
				"order":    len(mediaItems) + 1,
			}
			if media.ArtifactID > 0 {
				mediaItem["artifact_id"] = media.ArtifactID
			}
			if usage := strings.TrimSpace(media.Usage); usage != "" {
				mediaItem["usage"] = usage
			}
			mediaItems = append(mediaItems, mediaItem)
		}
		if len(mediaItems) > 0 {
			current["media"] = mediaItems
		}
		result = append(result, current)
	}
	return result
}

func bodyTeamID(contextKey string) uint64 {
	const prefix = "body-team:"
	value := strings.TrimSpace(contextKey)
	if !strings.HasPrefix(value, prefix) {
		return 0
	}
	value = strings.TrimPrefix(value, prefix)
	teamText, _, exists := strings.Cut(value, ":role:")
	if !exists {
		return 0
	}
	teamID, _ := strconv.ParseUint(teamText, 10, 64)
	return teamID
}

func assetContentText(value any) string {
	if text := nestedAssetText(value, 0); text != "" {
		return text
	}
	raw, _ := json.Marshal(value)
	return strings.TrimSpace(string(raw))
}

func nestedAssetText(value any, depth int) string {
	if depth > 10 || value == nil {
		return ""
	}
	switch current := value.(type) {
	case string:
		text := strings.TrimSpace(current)
		if strings.HasPrefix(text, "http://") || strings.HasPrefix(text, "https://") || strings.HasPrefix(text, "/") || strings.HasPrefix(text, "data:") {
			return ""
		}
		return text
	case []any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			if text := nestedAssetText(item, depth+1); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "\n")
	case map[string]any:
		for _, key := range []string{"text", "markdown", "prompt", "summary", "caption", "title"} {
			if text := nestedAssetText(current[key], depth+1); text != "" {
				return text
			}
		}
		for _, key := range []string{"content", "body", "output", "result", "data", "parts", "blocks"} {
			if text := nestedAssetText(current[key], depth+1); text != "" {
				return text
			}
		}
	}
	return ""
}

func assetContentURL(value any, kind string) string {
	keys := []string{"url", "open_url", "source_url", kind}
	if kind != "" {
		keys = append(keys, kind+"s")
	}
	return nestedAssetURL(value, keys, 0)
}

func nestedAssetURL(value any, preferred []string, depth int) string {
	if depth > 5 || value == nil {
		return ""
	}
	switch current := value.(type) {
	case string:
		if strings.HasPrefix(current, "http://") || strings.HasPrefix(current, "https://") || strings.HasPrefix(current, "/") || strings.HasPrefix(current, "data:") {
			return strings.TrimSpace(current)
		}
	case []any:
		for _, item := range current {
			if url := nestedAssetURL(item, preferred, depth+1); url != "" {
				return url
			}
		}
	case map[string]any:
		for _, key := range preferred {
			if url := nestedAssetURL(current[key], preferred, depth+1); url != "" {
				return url
			}
		}
		for _, item := range current {
			if url := nestedAssetURL(item, preferred, depth+1); url != "" {
				return url
			}
		}
	}
	return ""
}

func mediaFromArtifactPayload(payload map[string]any) Media {
	id := uint64Value(payload["artifact_id"])
	return Media{
		ReferenceType: TypeArtifact,
		ReferenceID:   id,
		ArtifactID:    id,
		FileID:        uint64Value(payload["file_id"]),
		SeriesID:      uint64Value(payload["series_id"]),
		Kind:          normalizeMediaKind(textValue(payload["kind"])),
		Name:          textValue(payload["name"]),
		Label:         firstText(payload["label"], payload["name"]),
		URL:           firstText(payload["url"], payload["open_url"]),
	}
}

func appendUniqueMedia(current []Media, values ...Media) []Media {
	seen := make(map[string]struct{}, len(current))
	for _, item := range current {
		seen[mediaKey(item)] = struct{}{}
	}
	for _, item := range values {
		if len(current) >= maxResolvedMedia {
			break
		}
		if item.ReferenceID == 0 || item.URL == "" {
			continue
		}
		key := mediaKey(item)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		current = append(current, item)
	}
	return current
}

func cleanMedia(values []Media) []Media {
	result := make([]Media, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		if item.ReferenceID == 0 || item.URL == "" {
			continue
		}
		key := mediaKey(item)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, item)
	}
	return result
}

func mediaKey(item Media) string {
	return fmt.Sprintf(
		"%s:%d:%s:%s",
		item.ReferenceType,
		item.ReferenceID,
		strings.TrimSpace(item.Usage),
		strings.TrimSpace(item.URL),
	)
}

func normalizeMediaKind(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	switch {
	case value == "image", strings.HasPrefix(value, "image/"):
		return "image"
	case value == "video", strings.HasPrefix(value, "video/"):
		return "video"
	case value == "audio", strings.HasPrefix(value, "audio/"):
		return "audio"
	default:
		return "file"
	}
}

func messageReferenceTitle(message agentmodel.Message) string {
	prefix := "回答"
	if message.Role == "user" {
		prefix = "提问"
	}
	preview := limitText(runtimemessageoutput.NormalizeText(message.Text), 36)
	if preview == "" {
		return prefix
	}
	return prefix + " · " + preview
}

func limitText(value string, limit int) string {
	value = strings.TrimSpace(value)
	runes := []rune(value)
	if limit > 0 && len(runes) > limit {
		return strings.TrimSpace(string(runes[:limit])) + "…"
	}
	return value
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" {
			return text
		}
	}
	return ""
}
