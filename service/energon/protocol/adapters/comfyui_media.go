package adapters

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"path"
	"slices"
	"strconv"
	"strings"

	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
)

func (ComfyUIAdapter) PrepareNativeRequest(ctx context.Context, input botprotocol.NativeInput, request botprovider.Request, client botprovider.Client) (botprovider.Request, error) {
	workflow := botprotocol.NormalizeMap(request.Body["prompt"])
	uploaded := make(map[string]string)
	for _, param := range comfyMappedParams(input.Mapped.Params) {
		if param.ParamType != "file" && param.ParamType != "files" {
			continue
		}
		inputs, inputName, err := botprotocol.ComfyWorkflowInput(workflow, param.NativeKey)
		if err != nil {
			return request, err
		}
		source, err := comfySingleFile(inputs[inputName], param.NativeKey)
		if err != nil {
			return request, err
		}
		filename, exists := uploaded[source]
		if !exists {
			filename, err = uploadComfyImage(ctx, input, source, client)
			if err != nil {
				return request, fmt.Errorf("ComfyUI 输入 %q 上传失败：%w", param.NativeKey, err)
			}
			uploaded[source] = filename
		}
		inputs[inputName] = filename
	}
	return request, nil
}

func uploadComfyImage(ctx context.Context, input botprotocol.NativeInput, source string, client botprovider.Client) (string, error) {
	content, _, err := botinput.ReadFileReference(ctx, source, botruntimeconfig.Load().MaxResponseBytes())
	if err != nil {
		return "", err
	}
	mimeType := http.DetectContentType(content)
	if !strings.HasPrefix(mimeType, "image/") {
		return "", fmt.Errorf("工作流参考图输入只支持可识别的图片文件")
	}
	extensions, _ := mime.ExtensionsByType(mimeType)
	if len(extensions) == 0 {
		return "", fmt.Errorf("无法识别参考图的文件扩展名")
	}
	digest := sha256.Sum256(content)
	filename := "energon-" + hex.EncodeToString(digest[:]) + extensions[0]
	request, err := comfyRequest(input, "/upload/image", http.MethodPost)
	if err != nil {
		return "", err
	}
	request.Multipart = &botprovider.MultipartForm{
		Fields: map[string]string{"type": "input", "overwrite": "false"},
		Files:  []botprovider.MultipartFile{{Field: "image", Filename: filename, MIME: mimeType, Content: content}},
	}
	response, err := client.Do(ctx, request)
	if err != nil {
		return "", err
	}
	if err := comfyResponseOK(response); err != nil {
		return "", err
	}
	body := botprotocol.NormalizeMap(response.Body)
	name := botprotocol.AsText(body["name"])
	subfolder := botprotocol.AsText(body["subfolder"])
	if err := validateComfyFilePath(name, subfolder); err != nil {
		return "", err
	}
	return path.Join(subfolder, name), nil
}

func (ComfyUIAdapter) ResolveTaskResult(ctx context.Context, input botprotocol.NativeInput, taskID string, response *botprovider.Response, client botprovider.Client) (any, error) {
	entry, err := comfyHistoryEntry(response, taskID)
	if err != nil {
		return nil, err
	}
	kind, err := comfyOutputType(input)
	if err != nil {
		return nil, err
	}
	files, err := comfyOutputFiles(entry, kind)
	if err != nil {
		return nil, err
	}
	result := botprovider.BinaryMediaOutput{Meta: map[string]any{"prompt_id": taskID}, Files: make([]botprovider.BinaryPayload, 0, len(files))}
	var totalBytes int64
	for _, file := range files {
		request, err := comfyRequest(input, "/view?"+file.Encode(), http.MethodGet)
		if err != nil {
			return nil, err
		}
		request.BinaryResponse = true
		response, err := client.Do(ctx, request)
		if err != nil {
			return nil, err
		}
		if err := comfyResponseOK(response); err != nil {
			return nil, err
		}
		payload, ok := botprovider.AsBinaryPayload(response.Body)
		if !ok || len(payload.Content) == 0 {
			return nil, fmt.Errorf("ComfyUI 输出文件未返回有效的二进制内容")
		}
		if !strings.HasPrefix(strings.ToLower(payload.MIME), kind+"/") {
			return nil, fmt.Errorf("ComfyUI 输出文件类型与 %s 能力不匹配", kind)
		}
		totalBytes += int64(len(payload.Content))
		if totalBytes > botruntimeconfig.Load().MaxResponseBytes() {
			return nil, fmt.Errorf("ComfyUI 输出文件总大小超过响应限制")
		}
		result.Files = append(result.Files, payload)
	}
	return result, nil
}

func comfyOutputFiles(entry map[string]any, kind string) ([]url.Values, error) {
	outputs := botprotocol.NormalizeMap(entry["outputs"])
	nodeIDs := make([]string, 0, len(outputs))
	for nodeID := range outputs {
		nodeIDs = append(nodeIDs, nodeID)
	}
	slices.SortFunc(nodeIDs, func(first, second string) int {
		firstID, firstErr := strconv.ParseUint(first, 10, 64)
		secondID, secondErr := strconv.ParseUint(second, 10, 64)
		if firstErr == nil && secondErr == nil && firstID != secondID {
			if firstID < secondID {
				return -1
			}
			return 1
		}
		return strings.Compare(first, second)
	})
	keys := map[string][]string{"image": {"images"}, "video": {"videos", "gifs"}, "audio": {"audio", "audios"}}[kind]
	files := make([]url.Values, 0)
	seen := make(map[string]bool)
	for _, nodeID := range nodeIDs {
		output := botprotocol.NormalizeMap(outputs[nodeID])
		for _, key := range keys {
			for _, rawFile := range botprotocol.NormalizeAnyList(output[key]) {
				file := botprotocol.NormalizeMap(rawFile)
				filename, subfolder := botprotocol.AsText(file["filename"]), botprotocol.AsText(file["subfolder"])
				if err := validateComfyFilePath(filename, subfolder); err != nil {
					return nil, err
				}
				fileType := botprotocol.AsText(file["type"])
				if fileType == "" {
					fileType = "output"
				}
				if fileType != "output" && fileType != "temp" {
					return nil, fmt.Errorf("ComfyUI 输出文件类型无效")
				}
				values := url.Values{"filename": {filename}, "subfolder": {subfolder}, "type": {fileType}}
				if !seen[values.Encode()] {
					seen[values.Encode()] = true
					files = append(files, values)
				}
			}
		}
	}
	if len(files) == 0 {
		return nil, fmt.Errorf("ComfyUI 工作流没有可读取的 %s 输出文件，请检查输出节点", kind)
	}
	return files, nil
}

func validateComfyFilePath(filename, subfolder string) error {
	clean := path.Clean(subfolder)
	if filename == "" || filename == "." || filename == ".." || strings.ContainsAny(filename, "/\\") || strings.Contains(subfolder, "\\") || strings.HasPrefix(subfolder, "/") || clean == ".." || strings.HasPrefix(clean, "../") {
		return fmt.Errorf("ComfyUI 返回的文件名或子目录无效")
	}
	return nil
}

func comfyResponseOK(response *botprovider.Response) error {
	if response == nil {
		return fmt.Errorf("ComfyUI 返回为空")
	}
	switch response.StatusCode {
	case http.StatusUnauthorized, http.StatusForbidden:
		return fmt.Errorf("ComfyUI 鉴权失败（HTTP %d），请检查来源账号的用户名和密码", response.StatusCode)
	}
	if response.StatusCode >= http.StatusBadRequest {
		return fmt.Errorf("ComfyUI 请求失败（HTTP %d）", response.StatusCode)
	}
	return nil
}
