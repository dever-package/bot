package adapters

import (
	"context"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

// /videos/generations 使用 xAI 的异步合同；/videos 使用 id/status/result.url 合同。
// https://docs.x.ai/developers/model-capabilities/video/generation
func openAIVideoPath(input botprotocol.NativeInput) string {
	if openAIConfiguredOutputType(input) != botprotocol.MediaTypeVideo {
		return ""
	}
	endpoint, err := url.Parse(strings.TrimSpace(input.Service.Path))
	if err != nil {
		return ""
	}
	return "/" + strings.Trim(endpoint.Path, "/")
}

func isOpenAIVideoGeneration(input botprotocol.NativeInput) bool {
	path := openAIVideoPath(input)
	return strings.HasSuffix(path, "/videos") || strings.HasSuffix(path, "/videos/generations")
}

func resolveOpenAIVideoTaskResult(ctx context.Context, input botprotocol.NativeInput, taskID string, response *botprovider.Response, client botprovider.Client) (any, error) {
	if openAITaskIDKey(input) == "id" {
		return openAIVideoURLResult(input, taskID, response.Body)
	}
	video := valueFromMap(response.Body, "video")
	videoURL, _ := valueFromMap(video, "url").(string)
	reference, err := url.Parse(videoURL)
	if err != nil {
		return nil, fmt.Errorf("OpenAI 视频结果地址无效: %w", err)
	}
	endpoint, err := openAITaskURL(input, taskID)
	if err != nil {
		return nil, err
	}
	mediaURL := endpoint.ResolveReference(reference)
	contentEndpoint := botprovider.SameOrigin(mediaURL, endpoint) && mediaURL.EscapedPath() == strings.TrimRight(endpoint.EscapedPath(), "/")+"/content"
	if reference.IsAbs() && !contentEndpoint {
		return response.Body, nil
	}
	// 网关的相对结果地址只允许指向当前任务的同源内容接口。
	if !contentEndpoint || mediaURL.User != nil {
		return nil, fmt.Errorf("OpenAI 视频结果地址未指向原任务内容接口")
	}
	result, err := client.Do(ctx, botprovider.Request{
		URL: mediaURL.String(), Method: http.MethodGet,
		Headers:        botprovider.AuthHeaders(input.Account.Key),
		BinaryResponse: true, SameOriginRedirects: true,
	})
	if err != nil {
		return nil, fmt.Errorf("下载 OpenAI 视频结果失败: %w", err)
	}
	if result.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("下载 OpenAI 视频结果失败: HTTP %d: %s", result.StatusCode, botprotocol.AsText(result.Body))
	}
	payload, ok := botprovider.AsBinaryPayload(result.Body)
	if !ok || len(payload.Content) == 0 {
		return nil, fmt.Errorf("OpenAI 视频内容接口未返回有效的二进制内容")
	}
	mediaType, _, err := mime.ParseMediaType(payload.MIME)
	if err != nil {
		return nil, fmt.Errorf("OpenAI 视频结果文件类型无效: %w", err)
	}
	if !strings.HasPrefix(mediaType, "video/") {
		return nil, fmt.Errorf("OpenAI 视频内容接口未返回视频: %s", mediaType)
	}
	payload.Meta = map[string]any{"request_id": taskID, "model": valueFromMap(response.Body, "model"), "duration": valueFromMap(video, "duration")}
	return payload, nil
}

func openAIVideoURLResult(input botprotocol.NativeInput, taskID string, body any) (any, error) {
	result := valueFromMap(body, "result")
	videoURL, _ := valueFromMap(result, "url").(string)
	reference, err := url.Parse(strings.TrimSpace(videoURL))
	if err != nil {
		return nil, fmt.Errorf("OpenAI 视频结果地址无效: %w", err)
	}
	endpoint, err := openAITaskURL(input, taskID)
	if err != nil {
		return nil, err
	}
	mediaURL := endpoint.ResolveReference(reference)
	if videoURL == "" || mediaURL.User != nil || (mediaURL.Scheme != "http" && mediaURL.Scheme != "https") || (!reference.IsAbs() && !botprovider.SameOrigin(mediaURL, endpoint)) {
		return nil, fmt.Errorf("OpenAI 视频结果 result.url 必须为 HTTP(S) 地址或同源相对地址")
	}
	// 媒体地址不携带账号鉴权；相对地址先转换为完整 URL，再交给现有媒体保存链路。
	return map[string]any{
		"id": taskID, "model": valueFromMap(body, "model"),
		"video": map[string]any{"url": mediaURL.String(), "duration": valueFromMap(body, "duration")},
	}, nil
}

func parseOpenAIVideoTaskStatus(input botprotocol.NativeInput, body any) (bottask.TaskStatus, error) {
	status, _ := valueFromMap(body, "status").(string)
	if openAITaskIDKey(input) == "id" {
		switch status {
		case "queued", "processing":
			return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: status, Message: "视频生成中"}, nil
		case "completed", "succeeded":
			videoURL, _ := valueFromMap(valueFromMap(body, "result"), "url").(string)
			if strings.TrimSpace(videoURL) == "" {
				return bottask.TaskStatus{}, fmt.Errorf("OpenAI 视频任务已完成，但缺少有效的 result.url")
			}
			return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: status}, nil
		case "failed":
			return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: status, Message: fmt.Sprintf("OpenAI 视频任务失败: %s", botprotocol.AsText(valueFromMap(body, "error")))}, nil
		default:
			return bottask.TaskStatus{}, fmt.Errorf("OpenAI 视频任务返回无效的 status: %q", status)
		}
	}
	switch status {
	case "pending":
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: status, Message: "视频生成中"}, nil
	case "done":
		video := valueFromMap(body, "video")
		if allowed, ok := valueFromMap(video, "respect_moderation").(bool); ok && !allowed {
			return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: status, Message: "视频未通过来源内容审核"}, nil
		}
		videoURL, _ := valueFromMap(video, "url").(string)
		if strings.TrimSpace(videoURL) == "" {
			return bottask.TaskStatus{}, fmt.Errorf("OpenAI 视频任务已完成，但缺少有效的 video.url")
		}
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: status}, nil
	case "failed":
		return bottask.TaskStatus{
			State:   bottask.TaskStateFailed,
			Label:   status,
			Message: fmt.Sprintf("OpenAI 视频任务失败: %s", botprotocol.AsText(valueFromMap(body, "error"))),
		}, nil
	default:
		return bottask.TaskStatus{}, fmt.Errorf("OpenAI 视频任务返回无效的 status: %q", status)
	}
}
