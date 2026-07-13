package reference

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	uploadaccess "github.com/dever-package/front/service/upload/access"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	maxResolvedMedia      = 32
	maxReferenceTextRunes = 12000
	maxReferenceItemRunes = 4000
)

type Resolver struct {
	artifacts runtimeartifact.Service
	server    *server.Context
}

func NewRequestResolver(serverContext *server.Context) Resolver {
	return Resolver{artifacts: runtimeartifact.NewService(), server: serverContext}
}

func NewResolver() Resolver {
	return Resolver{artifacts: runtimeartifact.NewService()}
}

func (r Resolver) Resolve(ctx context.Context, session agentmodel.Session, references []Reference) (Result, error) {
	result := Result{Items: make([]Resolved, 0, len(references))}
	for _, current := range references {
		resolved, err := r.resolveOne(ctx, session, current)
		if err != nil {
			return Result{}, err
		}
		result.Items = append(result.Items, resolved)
		result.Media = appendUniqueMedia(result.Media, resolved.Media...)
	}
	result.Prompt = resolvedPrompt(result.Items, result.Media)
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
	default:
		return Resolved{}, fmt.Errorf("不支持的引用类型: %s", reference.Type)
	}
}

func (r Resolver) resolveMessage(ctx context.Context, session agentmodel.Session, reference Reference) (Resolved, error) {
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{"id": reference.ID})
	if message == nil {
		return Resolved{}, fmt.Errorf("引用消息不存在")
	}
	if _, err := requireSourceSession(ctx, session, message.SessionID); err != nil {
		return Resolved{}, err
	}
	media := make([]Media, 0)
	for _, artifact := range r.artifacts.ByMessage(ctx, message.ID) {
		media = append(media, mediaFromArtifactPayload(runtimeartifact.Payload(ctx, artifact)))
	}
	return Resolved{
		Reference: reference,
		Title:     messageReferenceTitle(*message),
		Text:      strings.TrimSpace(message.Text),
		Media:     cleanMedia(media),
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
	text := strings.TrimSpace(session.ContextSummary)
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
	if session == nil {
		return nil, fmt.Errorf("引用内容不存在或无权访问")
	}
	return session, nil
}

func resolvedPrompt(items []Resolved, allowedMedia []Media) string {
	if len(items) == 0 {
		return ""
	}
	rows := []string{"用户通过 @ 明确引用了以下内容。引用素材时必须使用列出的 ref_type 和 ref_id，禁止猜测其他素材："}
	allowed := make(map[string]struct{}, len(allowedMedia))
	for _, media := range allowedMedia {
		allowed[fmt.Sprintf("%s:%d", media.ReferenceType, media.ReferenceID)] = struct{}{}
	}
	remainingTextRunes := maxReferenceTextRunes
	for index, item := range items {
		line := fmt.Sprintf("%d. [%s:%d] %s", index+1, item.Reference.Type, item.Reference.ID, strings.TrimSpace(item.Title))
		if item.Text != "" && remainingTextRunes > 0 {
			limit := min(maxReferenceItemRunes, remainingTextRunes)
			text := limitText(item.Text, limit)
			line += "\n" + text
			remainingTextRunes -= len([]rune(text))
		}
		for _, media := range item.Media {
			if _, exists := allowed[fmt.Sprintf("%s:%d", media.ReferenceType, media.ReferenceID)]; !exists {
				continue
			}
			line += fmt.Sprintf("\n- 素材 [%s:%d] %s，类型 %s", media.ReferenceType, media.ReferenceID, media.Label, media.Kind)
			if media.ArtifactID > 0 {
				line += fmt.Sprintf("，artifact_id=%d", media.ArtifactID)
			}
		}
		rows = append(rows, line)
	}
	return strings.Join(rows, "\n")
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
		seen[fmt.Sprintf("%s:%d", item.ReferenceType, item.ReferenceID)] = struct{}{}
	}
	for _, item := range values {
		if len(current) >= maxResolvedMedia {
			break
		}
		if item.ReferenceID == 0 || item.URL == "" {
			continue
		}
		key := fmt.Sprintf("%s:%d", item.ReferenceType, item.ReferenceID)
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
		key := fmt.Sprintf("%s:%d", item.ReferenceType, item.ReferenceID)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, item)
	}
	return result
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
	preview := limitText(message.Text, 36)
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
