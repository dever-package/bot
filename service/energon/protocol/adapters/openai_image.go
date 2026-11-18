package adapters

import (
	"fmt"
	"net/url"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

// 图片任务扩展由服务路径启用，不依赖供应商或模型名称。
func isOpenAIImageTask(input botprotocol.NativeInput) bool {
	if openAIConfiguredOutputType(input) != botprotocol.MediaTypeImage {
		return false
	}
	endpoint, err := url.Parse(strings.TrimSpace(input.Service.Path))
	return err == nil && strings.HasSuffix("/"+strings.Trim(endpoint.Path, "/"), "/images/tasks")
}

// 只规范标准图像端点；自定义接口继续使用配置的路径和字段。
func normalizeOpenAIImageRequest(path string, body map[string]any) (string, error) {
	endpoint, err := url.Parse(path)
	if err != nil {
		return "", fmt.Errorf("OpenAI 图片接口路径无效")
	}
	nativePath := strings.Trim(endpoint.Path, "/")
	switch nativePath {
	case "images/generations", "v1/images/generations", "images/edits", "v1/images/edits", "images/tasks", "v1/images/tasks":
	default:
		return path, nil
	}

	images, err := openAIEditImages(body["images"])
	if err != nil {
		return "", err
	}
	legacyImages, err := openAIEditImages(body["image"])
	if err != nil {
		return "", err
	}
	if len(images) > 0 && len(legacyImages) > 0 {
		return "", fmt.Errorf("OpenAI 图片输入同时配置了 image 和 images，请保留一个引用映射")
	}
	if len(images) == 0 {
		images = legacyImages
	}
	if len(images) == 0 {
		if strings.HasSuffix(nativePath, "/edits") {
			return "", fmt.Errorf("OpenAI 图片编辑缺少参考图，请检查图片参数映射")
		}
		delete(body, "image")
		delete(body, "images")
		return path, nil
	}
	delete(body, "image")
	body["images"] = images
	if strings.HasSuffix(nativePath, "/generations") {
		endpoint.Path = strings.TrimSuffix(strings.TrimRight(endpoint.Path, "/"), "generations") + "edits"
		endpoint.RawPath = ""
	}
	return endpoint.String(), nil
}

func openAIEditImages(value any) ([]any, error) {
	if value == nil {
		return nil, nil
	}
	values := botprotocol.NormalizeAnyList(value)
	images := make([]any, 0, len(values))
	for index, value := range values {
		switch image := value.(type) {
		case string:
			if strings.TrimSpace(image) == "" {
				return nil, fmt.Errorf("OpenAI 第 %d 张参考图地址为空", index+1)
			}
			images = append(images, map[string]any{"image_url": image})
		case map[string]any:
			imageURL, _ := image["image_url"].(string)
			fileID, _ := image["file_id"].(string)
			if (strings.TrimSpace(imageURL) == "") == (strings.TrimSpace(fileID) == "") {
				return nil, fmt.Errorf("OpenAI 第 %d 张参考图须配置 image_url 或 file_id", index+1)
			}
			images = append(images, image)
		default:
			return nil, fmt.Errorf("OpenAI 第 %d 张参考图格式无效", index+1)
		}
	}
	return images, nil
}

func parseOpenAIImageTaskStatus(body any) (bottask.TaskStatus, error) {
	status, _ := valueFromMap(body, "status").(string)
	switch status {
	case "queued":
		return bottask.TaskStatus{State: bottask.TaskStatePending, Label: status, Message: "图片排队中"}, nil
	case "processing":
		return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: status, Message: "图片生成中"}, nil
	case "completed":
		return bottask.TaskStatus{State: bottask.TaskStateSucceeded, Label: status}, nil
	case "failed":
		return bottask.TaskStatus{State: bottask.TaskStateFailed, Label: status, Message: fmt.Sprintf("OpenAI 图片任务失败: %s", botprotocol.AsText(valueFromMap(body, "error")))}, nil
	default:
		return bottask.TaskStatus{}, fmt.Errorf("OpenAI 图片任务返回无效的 status: %q", status)
	}
}

func resolveOpenAIImageTaskResult(input botprotocol.NativeInput, taskID string, body any) (any, error) {
	data, _ := valueFromMap(body, "data").([]any)
	if len(data) == 0 {
		return nil, fmt.Errorf("OpenAI 图片任务已完成，但缺少有效的 data")
	}
	endpoint, err := openAITaskURL(input, taskID)
	if err != nil {
		return nil, err
	}
	images := make([]any, 0, len(data))
	for index, value := range data {
		image, ok := value.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("OpenAI 图片结果 data[%d] 格式无效", index)
		}
		item := cloneBody(image)
		imageURL, _ := image["url"].(string)
		if imageURL = strings.TrimSpace(imageURL); imageURL != "" {
			reference, err := url.Parse(imageURL)
			if err != nil {
				return nil, fmt.Errorf("OpenAI 图片结果地址无效: %w", err)
			}
			mediaURL := endpoint.ResolveReference(reference)
			if mediaURL.User != nil || (mediaURL.Scheme != "http" && mediaURL.Scheme != "https") || (!reference.IsAbs() && !botprovider.SameOrigin(mediaURL, endpoint)) {
				return nil, fmt.Errorf("OpenAI 图片结果 data[%d].url 必须为 HTTP(S) 地址或同源相对地址", index)
			}
			item["url"] = mediaURL.String()
		} else if encoded, _ := image["b64_json"].(string); strings.TrimSpace(encoded) == "" {
			return nil, fmt.Errorf("OpenAI 图片结果 data[%d] 缺少有效的 url 或 b64_json", index)
		}
		images = append(images, item)
	}
	// 不把任务内部的输入、参考素材和账号信息作为生成结果交给调用方。
	return map[string]any{"created": valueFromMap(body, "created"), "data": images}, nil
}
