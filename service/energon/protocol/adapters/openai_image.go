package adapters

import (
	"fmt"
	"net/url"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// 只规范标准图像端点；自定义接口继续使用配置的路径和字段。
func normalizeOpenAIImageRequest(path string, body map[string]any) (string, error) {
	endpoint, err := url.Parse(path)
	if err != nil {
		return "", fmt.Errorf("OpenAI 图片接口路径无效")
	}
	nativePath := strings.Trim(endpoint.Path, "/")
	switch nativePath {
	case "images/generations", "v1/images/generations", "images/edits", "v1/images/edits":
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
