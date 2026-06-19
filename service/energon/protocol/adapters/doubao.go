package adapters

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

const (
	doubaoImagePath        = "/images/generations"
	doubaoVideoTaskPath    = "/contents/generations/tasks"
	doubaoKindText         = "doubao.text"
	doubaoKindEmbedding    = "doubao.embeddings"
	doubaoKindImage        = "doubao.image"
	doubaoKindVideo        = "doubao.video"
	doubaoVideoPollMax     = 60
	doubaoVideoPollDelayMS = 3000
)

type DoubaoAdapter struct{}

func (DoubaoAdapter) Name() string {
	return "doubao"
}

func (DoubaoAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	name := strings.TrimSpace(botprotocol.AsText(raw.Body["power"]))
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	kind := strings.TrimSpace(botprotocol.AsText(raw.Body["kind"]))
	if kind == "" {
		kind = "llm.chat"
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)

	return &botprotocol.ShemicRequest{
		Mode:     raw.Mode,
		Protocol: "doubao",
		Kind:     kind,
		Name:     name,
		Set:      parts.Set,
		Input:    parts.Input,
		History:  parts.History,
		Options:  parts.Options,
		Raw:      raw,
	}, nil
}

func (adapter DoubaoAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	switch doubaoServiceType(input) {
	case "text", "llm", "chat", "llm.chat":
		input.Request.Kind = doubaoKindText
		return OpenAIAdapter{}.BuildNativeRequest(input)
	case "embeddings", "embedding":
		input.Request.Kind = doubaoKindEmbedding
		return doubaoEmbeddingRequest(input), nil
	case "image":
		input.Request.Kind = doubaoKindImage
		return adapter.buildImageRequest(input)
	case "video":
		input.Request.Kind = doubaoKindVideo
		return adapter.buildVideoRequest(input)
	default:
		return botprovider.Request{}, fmt.Errorf("豆包协议暂不支持服务类型: %s", input.Service.Type)
	}
}

func doubaoEmbeddingRequest(input botprotocol.NativeInput) botprovider.Request {
	path := resolveNativePath(input, "/embeddings")
	body := doubaoBody(input)
	if doubaoIsMultimodalEmbeddingPath(path) {
		if items := doubaoMultimodalEmbeddingInput(input, body); len(items) > 0 {
			body["input"] = items
		}
	} else if _, exists := body["input"]; !exists {
		if value := doubaoEmbeddingInput(input); value != "" {
			body["input"] = value
		}
	}
	if nativeName := nativeModelName(input.ServiceAPI); nativeName != "" {
		setBodyDefault(body, "model", nativeName)
	}
	return doubaoJSONRequest(input, path, body)
}

func doubaoIsMultimodalEmbeddingPath(path string) bool {
	return strings.Contains(strings.ToLower(strings.TrimSpace(path)), "multimodal")
}

func doubaoEmbeddingInput(input botprotocol.NativeInput) string {
	for _, value := range []any{
		input.Request.Input["input"],
		input.Request.Input["text"],
		input.Request.Input["prompt"],
		input.Request.Input["content"],
	} {
		if text := strings.TrimSpace(botprotocol.AsText(value)); text != "" {
			return text
		}
	}
	return strings.TrimSpace(doubaoMappedInput(input).PrimaryPrompt())
}

func doubaoMultimodalEmbeddingInput(input botprotocol.NativeInput, body map[string]any) []any {
	mapped := doubaoMappedInput(input)
	prompt := botprotocol.BuildPromptContent(mapped.PromptInput(mapped.InputKeySet()), mapped.PromptOptions("用户输入"))
	images := collectDoubaoEmbeddingImages(body, prompt)
	videos := collectDoubaoEmbeddingVideos(body, prompt)

	if items := normalizeDoubaoEmbeddingContentItems(body["input"]); len(items) > 0 {
		items = appendDoubaoEmbeddingImageItems(items, images)
		items = appendDoubaoEmbeddingVideoItems(items, videos)
		deleteDoubaoEmbeddingSourceFields(body)
		return items
	}
	if items := normalizeDoubaoEmbeddingContentItems(body["content"]); len(items) > 0 {
		items = appendDoubaoEmbeddingImageItems(items, images)
		items = appendDoubaoEmbeddingVideoItems(items, videos)
		deleteDoubaoEmbeddingSourceFields(body)
		return items
	}

	text := firstDoubaoEmbeddingText(body, prompt, input)
	deleteDoubaoEmbeddingSourceFields(body)

	items := make([]any, 0, 1+len(images)+len(videos))
	if text != "" {
		items = append(items, map[string]any{
			"type": "text",
			"text": text,
		})
	}
	items = appendDoubaoEmbeddingImageItems(items, images)
	return appendDoubaoEmbeddingVideoItems(items, videos)
}

func appendDoubaoEmbeddingImageItems(items []any, images []string) []any {
	for _, url := range images {
		url = strings.TrimSpace(url)
		if url == "" {
			continue
		}
		items = append(items, map[string]any{
			"type": "image_url",
			"image_url": map[string]any{
				"url": url,
			},
		})
	}
	return items
}

func appendDoubaoEmbeddingVideoItems(items []any, videos []string) []any {
	for _, url := range videos {
		url = strings.TrimSpace(url)
		if url == "" {
			continue
		}
		items = append(items, map[string]any{
			"type": "video_url",
			"video_url": map[string]any{
				"url": url,
			},
		})
	}
	return items
}

func normalizeDoubaoEmbeddingContentItems(value any) []any {
	items := make([]any, 0)
	for _, item := range botprotocol.NormalizeAnyList(value) {
		items = appendDoubaoEmbeddingContentItem(items, item)
	}
	return items
}

func appendDoubaoEmbeddingContentItem(items []any, item any) []any {
	switch current := item.(type) {
	case string:
		text := strings.TrimSpace(current)
		if text != "" {
			return append(items, map[string]any{
				"type": "text",
				"text": text,
			})
		}
	case map[string]any:
		normalized, ok := normalizeDoubaoContentItem(current)
		if ok && isDoubaoEmbeddingContentType(normalized["type"]) {
			return append(items, normalized)
		}
	default:
		if text := strings.TrimSpace(botprotocol.AsText(current)); text != "" {
			return append(items, map[string]any{
				"type": "text",
				"text": text,
			})
		}
	}
	return items
}

func isDoubaoEmbeddingContentType(value any) bool {
	switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(value))) {
	case "text", "image_url", "video_url":
		return true
	default:
		return false
	}
}

func firstDoubaoEmbeddingText(body map[string]any, prompt botprotocol.PromptContent, input botprotocol.NativeInput) string {
	for _, value := range []any{
		body["text"],
		body["prompt"],
		body["content"],
		prompt.Text,
		doubaoEmbeddingInput(input),
	} {
		if text := strings.TrimSpace(botprotocol.AsText(value)); text != "" {
			return text
		}
	}
	return ""
}

func collectDoubaoEmbeddingImages(body map[string]any, prompt botprotocol.PromptContent) []string {
	images := make([]string, 0)
	for _, key := range []string{"image", "images", "image_url", "image_urls"} {
		images = append(images, normalizeDoubaoEmbeddingMediaURLs(body[key])...)
	}
	images = append(images, prompt.Images...)
	return images
}

func collectDoubaoEmbeddingVideos(body map[string]any, prompt botprotocol.PromptContent) []string {
	videos := make([]string, 0)
	for _, key := range []string{"video", "videos", "video_url", "video_urls"} {
		videos = append(videos, normalizeDoubaoEmbeddingMediaURLs(body[key])...)
	}
	videos = append(videos, prompt.Videos...)
	return videos
}

func normalizeDoubaoEmbeddingMediaURLs(value any) []string {
	urls := make([]string, 0)
	for _, item := range botprotocol.NormalizeAnyList(value) {
		if url := doubaoContentMediaURL(item); url != "" {
			urls = append(urls, url)
		}
	}
	return urls
}

func deleteDoubaoEmbeddingSourceFields(body map[string]any) {
	for _, key := range []string{
		"text",
		"prompt",
		"content",
		"image",
		"images",
		"image_url",
		"image_urls",
		"video",
		"videos",
		"video_url",
		"video_urls",
	} {
		delete(body, key)
	}
}

func (adapter DoubaoAdapter) BuildClientResponse(req *botprotocol.ShemicRequest, resp *botprovider.Response) (any, error) {
	switch strings.TrimSpace(req.Kind) {
	case doubaoKindEmbedding:
		return doubaoEmbeddingOutput(resp.Body), nil
	case doubaoKindImage:
		return doubaoImageOutput(resp.Body), nil
	case doubaoKindVideo:
		return doubaoVideoOutput(resp.Body), nil
	default:
		return OpenAIAdapter{}.BuildClientResponse(req, resp)
	}
}

func (adapter DoubaoAdapter) SupportsCancel(input botprotocol.NativeInput) bool {
	switch doubaoServiceType(input) {
	case "text", "llm", "chat", "llm.chat", "embeddings", "embedding", "image", "video":
		return true
	default:
		return false
	}
}

func (DoubaoAdapter) StreamTaskSpec(input botprotocol.NativeInput) (bottask.StreamTaskSpec, bool) {
	switch strings.TrimSpace(input.Request.Kind) {
	case doubaoKindEmbedding:
		return bottask.StreamTaskSpec{
			Kind:         bottask.StreamKindRequest,
			PlainRequest: true,
		}, true
	case doubaoKindImage:
		return bottask.StreamTaskSpec{
			Kind:         bottask.StreamKindRequest,
			OutputType:   botprotocol.MediaTypeImage,
			PlainRequest: true,
		}, true
	case doubaoKindVideo:
		return bottask.StreamTaskSpec{
			Kind:         bottask.StreamKindPolling,
			OutputType:   botprotocol.MediaTypeVideo,
			MaxAttempts:  doubaoVideoPollMax,
			PollInterval: doubaoVideoPollDelayMS * time.Millisecond,
		}, true
	default:
		return bottask.StreamTaskSpec{}, false
	}
}

func (DoubaoAdapter) ParseTaskID(input botprotocol.NativeInput, resp *botprovider.Response) (string, error) {
	return strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "id"))), nil
}

func (DoubaoAdapter) BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error) {
	return botprovider.Request{
		URL:     botprovider.JoinURL(input.Provider.Host, doubaoTaskItemPath(input, taskID)),
		Method:  http.MethodGet,
		Headers: botprovider.AuthHeaders(input.Account.Key),
	}, nil
}

func (DoubaoAdapter) ParseTaskStatus(input botprotocol.NativeInput, resp *botprovider.Response) (bottask.TaskStatus, error) {
	status := strings.ToLower(strings.TrimSpace(botprotocol.AsText(valueFromMap(resp.Body, "status"))))
	if terminalMessage := botprotocol.TerminalTaskErrorText(valueFromMap(resp.Body, "error"), valueFromMap(resp.Body, "error_message"), valueFromMap(resp.Body, "message")); terminalMessage != "" {
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: "failed", Message: terminalMessage}, nil
	}
	switch status {
	case "succeeded":
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: status}, nil
	case "failed", "cancelled", "canceled", "stopped", "terminated", "aborted", "expired":
		return bottask.TaskStatus{
			State:   bottask.TaskStateFailed,
			Label:   status,
			Message: fmt.Sprintf("豆包视频任务%s: %s", status, botprotocol.AsText(valueFromMap(resp.Body, "error"))),
		}, nil
	default:
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: status}, nil
	}
}

func (DoubaoAdapter) CancelTask(ctx context.Context, input botprotocol.NativeInput, taskID string, client botprovider.Client) error {
	taskID = strings.TrimSpace(taskID)
	if taskID == "" {
		return nil
	}
	if client == nil {
		return fmt.Errorf("取消豆包视频任务失败: 来源客户端未初始化")
	}
	req := botprovider.Request{
		URL:     botprovider.JoinURL(input.Provider.Host, doubaoTaskItemPath(input, taskID)),
		Method:  http.MethodDelete,
		Headers: botprovider.AuthHeaders(input.Account.Key),
	}
	resp, err := client.Do(ctx, req)
	if err != nil {
		return fmt.Errorf("取消豆包视频任务失败: %w", err)
	}
	if resp != nil && resp.StatusCode >= http.StatusBadRequest {
		if isDoubaoRunningTaskDeletionConflict(resp) {
			return nil
		}
		return fmt.Errorf("取消豆包视频任务失败: status=%d body=%s", resp.StatusCode, botprotocol.AsText(resp.Body))
	}
	return nil
}

func isDoubaoRunningTaskDeletionConflict(resp *botprovider.Response) bool {
	if resp == nil || resp.StatusCode != http.StatusConflict {
		return false
	}

	code := strings.TrimSpace(botprotocol.AsText(valueFromMap(valueFromMap(resp.Body, "error"), "code")))
	if code == "InvalidAction.RunningTaskDeletion" {
		return true
	}

	bodyText := botprotocol.AsText(resp.Body)
	return strings.Contains(bodyText, "InvalidAction.RunningTaskDeletion")
}

func (adapter DoubaoAdapter) buildImageRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	body := doubaoBody(input)
	if model := strings.TrimSpace(input.ServiceAPI); model != "" {
		setBodyDefault(body, "model", model)
	}
	if strings.TrimSpace(botprotocol.AsText(body["model"])) == "" {
		return botprovider.Request{}, fmt.Errorf("豆包图片服务缺少模型名")
	}

	mapped := doubaoMappedInput(input)
	promptInput := mapped.PromptInput(mapped.InputKeySet())
	prompt := botprotocol.BuildPromptContent(promptInput, mapped.PromptOptions("用户输入"))
	if strings.TrimSpace(botprotocol.AsText(body["prompt"])) == "" {
		if text := strings.TrimSpace(botprotocol.AsText(body["text"])); text != "" {
			body["prompt"] = text
			delete(body, "text")
		}
	}
	if strings.TrimSpace(botprotocol.AsText(body["prompt"])) == "" {
		text := prompt.TextWithMediaReferences(botprotocol.MediaReferenceOptions{
			Videos: true,
			Audios: true,
			Files:  true,
		})
		if text != "" {
			body["prompt"] = text
		}
	}
	if _, exists := body["image"]; !exists && len(prompt.Images) > 0 {
		body["image"] = doubaoOneOrMany(prompt.Images)
	}
	if _, exists := body["image"]; !exists {
		if images := botprotocol.NormalizeStringList(body["images"]); len(images) > 0 {
			body["image"] = doubaoOneOrMany(images)
			delete(body, "images")
		}
	}

	return doubaoJSONRequest(input, resolveConfiguredPath(input, doubaoImagePath), body), nil
}

func (adapter DoubaoAdapter) buildVideoRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	body := doubaoBody(input)
	if model := strings.TrimSpace(input.ServiceAPI); model != "" {
		setBodyDefault(body, "model", model)
	}
	if strings.TrimSpace(botprotocol.AsText(body["model"])) == "" {
		return botprovider.Request{}, fmt.Errorf("豆包视频服务缺少模型名")
	}

	normalizeDoubaoVideoBodyContent(body)
	if _, exists := body["content"]; !exists {
		content := doubaoVideoContent(input, body)
		if len(content) > 0 {
			body["content"] = content
		}
	}
	if len(botprotocol.NormalizeAnyList(body["content"])) == 0 {
		return botprovider.Request{}, fmt.Errorf("豆包视频服务缺少 content")
	}

	return doubaoJSONRequest(input, resolveConfiguredPath(input, doubaoVideoTaskPath), body), nil
}

func doubaoServiceType(input botprotocol.NativeInput) string {
	if value := strings.ToLower(strings.TrimSpace(input.Service.Type)); value != "" {
		return value
	}
	return strings.ToLower(strings.TrimSpace(input.Power.Kind))
}

func doubaoTaskItemPath(input botprotocol.NativeInput, taskID string) string {
	basePath := strings.TrimRight(resolveConfiguredPath(input, doubaoVideoTaskPath), "/")
	taskID = strings.TrimSpace(taskID)
	if taskID == "" {
		return basePath
	}
	return basePath + "/" + taskID
}

func doubaoBody(input botprotocol.NativeInput) map[string]any {
	body := map[string]any{}
	for key, value := range input.Request.Options {
		if isGatewayStreamOption(key) {
			continue
		}
		body[key] = value
	}
	for key, value := range doubaoMappedInput(input).NativeBody() {
		body[key] = value
	}
	return body
}

func doubaoMappedInput(input botprotocol.NativeInput) botprotocol.MappedInput {
	if input.Mapped.IsZero() {
		return botprotocol.NewMappedInput(input.Request.Input, nil)
	}
	return input.Mapped
}

func doubaoVideoContent(input botprotocol.NativeInput, body map[string]any) []any {
	mapped := doubaoMappedInput(input)
	prompt := botprotocol.BuildPromptContent(mapped.PromptInput(mapped.InputKeySet()), mapped.PromptOptions("用户输入"))
	text := strings.TrimSpace(botprotocol.AsText(body["prompt"]))
	if text != "" {
		delete(body, "prompt")
	} else if text = strings.TrimSpace(botprotocol.AsText(body["text"])); text != "" {
		delete(body, "text")
	} else {
		text = prompt.TextWithMediaReferences(botprotocol.MediaReferenceOptions{
			Files: true,
		})
	}

	images := append(botprotocol.NormalizeStringList(body["image"]), botprotocol.NormalizeStringList(body["images"])...)
	videos := append(botprotocol.NormalizeStringList(body["video"]), botprotocol.NormalizeStringList(body["videos"])...)
	audios := append(botprotocol.NormalizeStringList(body["audio"]), botprotocol.NormalizeStringList(body["audios"])...)
	delete(body, "image")
	delete(body, "images")
	delete(body, "video")
	delete(body, "videos")
	delete(body, "audio")
	delete(body, "audios")
	images = append(images, prompt.Images...)
	videos = append(videos, prompt.Videos...)
	audios = append(audios, prompt.Audios...)

	content := make([]any, 0, 1+len(images)+len(videos)+len(audios))
	if text != "" {
		content = append(content, map[string]any{
			"type": "text",
			"text": text,
		})
	}
	imageRoles := doubaoVideoImageRoles(body, len(images))
	for index, url := range images {
		item := map[string]any{
			"type": "image_url",
			"image_url": map[string]any{
				"url": url,
			},
		}
		if role := doubaoIndexedRole(imageRoles, index); role != "" {
			item["role"] = role
		}
		content = append(content, item)
	}
	for _, url := range videos {
		content = append(content, map[string]any{
			"type": "video_url",
			"video_url": map[string]any{
				"url": url,
			},
			"role": "reference_video",
		})
	}
	for _, url := range audios {
		content = append(content, map[string]any{
			"type": "audio_url",
			"audio_url": map[string]any{
				"url": url,
			},
			"role": "reference_audio",
		})
	}
	return content
}

func normalizeDoubaoVideoBodyContent(body map[string]any) {
	value, exists := body["content"]
	if !exists {
		return
	}
	items := make([]any, 0)
	switch current := value.(type) {
	case string:
		text := strings.TrimSpace(current)
		if text != "" {
			items = append(items, map[string]any{
				"type": "text",
				"text": text,
			})
		}
	case map[string]any:
		items = appendValidDoubaoVideoContentItem(items, current)
	default:
		for _, item := range botprotocol.NormalizeAnyList(value) {
			switch currentItem := item.(type) {
			case string:
				text := strings.TrimSpace(currentItem)
				if text != "" {
					items = append(items, map[string]any{
						"type": "text",
						"text": text,
					})
				}
			case map[string]any:
				items = appendValidDoubaoVideoContentItem(items, currentItem)
			default:
				if text := strings.TrimSpace(botprotocol.AsText(currentItem)); text != "" {
					items = append(items, map[string]any{
						"type": "text",
						"text": text,
					})
				}
			}
		}
	}
	if len(items) == 0 {
		delete(body, "content")
		return
	}
	body["content"] = items
}

func appendValidDoubaoVideoContentItem(items []any, item map[string]any) []any {
	normalized, ok := normalizeDoubaoContentItem(item)
	if !ok {
		return items
	}
	return append(items, normalized)
}

func normalizeDoubaoContentItem(item map[string]any) (map[string]any, bool) {
	contentType := strings.ToLower(strings.TrimSpace(botprotocol.AsText(item["type"])))
	if contentType == "" {
		contentType = inferDoubaoContentType(item)
	}
	if contentType == "" {
		return item, true
	}

	next := cloneBody(item)
	next["type"] = contentType
	switch contentType {
	case "text":
		text := strings.TrimSpace(botprotocol.AsText(next["text"]))
		if text == "" {
			return nil, false
		}
		next["text"] = text
	case "image_url":
		url := doubaoContentMediaURL(next["image_url"])
		if url == "" {
			return nil, false
		}
		next["image_url"] = map[string]any{"url": url}
	case "video_url":
		url := doubaoContentMediaURL(next["video_url"])
		if url == "" {
			return nil, false
		}
		next["video_url"] = map[string]any{"url": url}
	case "audio_url":
		url := doubaoContentMediaURL(next["audio_url"])
		if url == "" {
			return nil, false
		}
		next["audio_url"] = map[string]any{"url": url}
	}
	return next, true
}

func inferDoubaoContentType(item map[string]any) string {
	for _, candidate := range []string{"text", "image_url", "video_url", "audio_url"} {
		if _, exists := item[candidate]; exists {
			return candidate
		}
	}
	return ""
}

func doubaoContentMediaURL(value any) string {
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current)
	case map[string]any:
		return strings.TrimSpace(botprotocol.AsText(current["url"]))
	default:
		return strings.TrimSpace(botprotocol.AsText(value))
	}
}

func doubaoVideoImageRoles(body map[string]any, imageCount int) []string {
	if imageCount <= 0 {
		return nil
	}

	defer delete(body, "image_role")
	defer delete(body, "image_roles")

	if roles := normalizeDoubaoRoleList(body["image_roles"]); len(roles) > 0 {
		return roles
	}
	if role := strings.TrimSpace(botprotocol.AsText(body["image_role"])); role != "" {
		return repeatRole(role, imageCount)
	}

	switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(body["task_type"]))) {
	case "r2v", "reference_image", "reference_images":
		return repeatRole("reference_image", imageCount)
	}

	if imageCount == 1 {
		return []string{"first_frame"}
	}
	if imageCount == 2 {
		return []string{"first_frame", "last_frame"}
	}
	return repeatRole("reference_image", imageCount)
}

func normalizeDoubaoRoleList(value any) []string {
	roles := botprotocol.NormalizeStringList(value)
	if len(roles) == 0 {
		raw := strings.TrimSpace(botprotocol.AsText(value))
		if raw != "" {
			roles = strings.Split(raw, ",")
		}
	}

	result := make([]string, 0, len(roles))
	for _, role := range roles {
		if role = strings.TrimSpace(role); role != "" {
			result = append(result, role)
		}
	}
	return result
}

func repeatRole(role string, count int) []string {
	role = strings.TrimSpace(role)
	if role == "" || count <= 0 {
		return nil
	}
	roles := make([]string, count)
	for index := range roles {
		roles[index] = role
	}
	return roles
}

func doubaoIndexedRole(roles []string, index int) string {
	if index < 0 || index >= len(roles) {
		return ""
	}
	return strings.TrimSpace(roles[index])
}

func doubaoJSONRequest(input botprotocol.NativeInput, path string, body map[string]any) botprovider.Request {
	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"
	return botprovider.Request{
		URL:     botprovider.JoinURL(input.Provider.Host, path),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}
}

func doubaoImageOutput(body any) any {
	return map[string]any{"output": botprotocol.ExtractMediaOutput(body, botprotocol.MediaTypeImage)}
}

func doubaoEmbeddingOutput(body any) any {
	output := botprotocol.Output{
		"json": body,
	}
	if size := doubaoEmbeddingSize(body); size > 0 {
		output["text"] = fmt.Sprintf("已生成 %d 维向量", size)
	} else {
		output["text"] = "已生成向量"
	}
	return map[string]any{"output": output}
}

func doubaoEmbeddingSize(value any) int {
	mapped := botprotocol.NormalizeMap(value)
	if len(mapped) == 0 {
		return vectorValueLength(value)
	}
	for _, key := range botprotocol.EmbeddingVectorKeys() {
		if size := vectorValueLength(mapped[key]); size > 0 {
			return size
		}
	}
	if size := doubaoEmbeddingDataSize(mapped["data"]); size > 0 {
		return size
	}
	return 0
}

func doubaoEmbeddingDataSize(value any) int {
	if mapped := botprotocol.NormalizeMap(value); len(mapped) > 0 {
		return doubaoEmbeddingSize(mapped)
	}
	for _, item := range botprotocol.NormalizeAnyList(value) {
		if size := doubaoEmbeddingSize(item); size > 0 {
			return size
		}
	}
	return vectorValueLength(value)
}

func vectorValueLength(value any) int {
	switch current := value.(type) {
	case []float64:
		return len(current)
	case []float32:
		return len(current)
	case []int:
		return len(current)
	case []int64:
		return len(current)
	case []any:
		return len(current)
	default:
		return 0
	}
}

func doubaoVideoOutput(body any) any {
	return map[string]any{"output": botprotocol.ExtractMediaOutput(body, botprotocol.MediaTypeVideo)}
}

func setBodyDefault(body map[string]any, key string, value any) {
	if _, exists := body[key]; exists {
		return
	}
	body[key] = value
}

func doubaoOneOrMany(values []string) any {
	if len(values) == 1 {
		return values[0]
	}
	return values
}

func valueFromMap(value any, key string) any {
	mapped := botprotocol.NormalizeMap(value)
	if mapped == nil {
		return nil
	}
	return mapped[key]
}
