package adapters

import (
	"context"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"path"
	"slices"
	"strconv"
	"strings"
	"unicode/utf8"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntimeconfig "github.com/dever-package/bot/service/energon/runtimeconfig"
	uploadprovider "github.com/dever-package/front/service/upload/provider"
)

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
		payload, err := downloadComfyFile(ctx, input, file, client)
		if err != nil {
			return nil, err
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
	if kind == botprotocol.MediaTypeAudio {
		result.Lyrics, result.Text, err = comfyAudioText(input, entry)
		if err != nil {
			return nil, err
		}
		attachments, err := comfyOutputFiles(entry, botprotocol.MediaTypeFile)
		if err != nil {
			return nil, err
		}
		for _, file := range attachments {
			name := file.Get("filename")
			if !strings.EqualFold(path.Ext(name), ".lrc") {
				return nil, fmt.Errorf("ComfyUI 歌词附件必须是 LRC 文件")
			}
			payload, err := downloadComfyFile(ctx, input, file, client)
			if err != nil {
				return nil, err
			}
			if !utf8.Valid(payload.Content) {
				return nil, fmt.Errorf("ComfyUI 歌词附件不是有效的 UTF-8 文本")
			}
			mediaType, _, _ := mime.ParseMediaType(payload.MIME)
			if mediaType != "text/plain" && mediaType != "application/octet-stream" {
				return nil, fmt.Errorf("ComfyUI 歌词附件类型无效: %s", mediaType)
			}
			totalBytes += int64(len(payload.Content))
			if totalBytes > botruntimeconfig.Load().MaxResponseBytes() {
				return nil, fmt.Errorf("ComfyUI 输出文件总大小超过响应限制")
			}
			result.Attachments = append(result.Attachments, botprovider.BinaryFile{Name: name, Payload: payload})
			// 下游分镜使用实际演唱时间，不用歌词正文重新估算。
			result.Lyrics = strings.TrimSpace(string(payload.Content))
		}
	}
	return result, nil
}

func downloadComfyFile(ctx context.Context, input botprotocol.NativeInput, file url.Values, client botprovider.Client) (botprovider.BinaryPayload, error) {
	request, err := comfyRequest(input, "/view?"+file.Encode(), http.MethodGet)
	if err != nil {
		return botprovider.BinaryPayload{}, err
	}
	request.BinaryResponse = true
	response, err := client.Do(ctx, request)
	if err != nil {
		return botprovider.BinaryPayload{}, err
	}
	if err := comfyResponseOK(response); err != nil {
		return botprovider.BinaryPayload{}, err
	}
	payload, ok := botprovider.AsBinaryPayload(response.Body)
	if !ok || len(payload.Content) == 0 {
		return botprovider.BinaryPayload{}, fmt.Errorf("ComfyUI 输出文件未返回有效的二进制内容")
	}
	return payload, nil
}

func comfyOutputFiles(entry map[string]any, kind string) ([]url.Values, error) {
	outputs := botprotocol.NormalizeMap(entry["outputs"])
	nodeIDs := comfyOutputNodeIDs(outputs)
	keys := map[string][]string{"image": {"images"}, "video": {"videos", "gifs", "images"}, "audio": {"audio", "audios"}, "file": {"lyrics"}}[kind]
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
				if !comfyOutputMatchesKind(file, key, kind) {
					continue
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
	if len(files) == 0 && kind != botprotocol.MediaTypeFile {
		return nil, fmt.Errorf("ComfyUI 工作流没有可读取的 %s 输出文件，请检查输出节点", kind)
	}
	return files, nil
}

func comfyOutputNodeIDs(outputs map[string]any) []string {
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
	return nodeIDs
}

func comfyAudioText(input botprotocol.NativeInput, entry map[string]any) (string, string, error) {
	workflow, err := botprotocol.ParseComfyWorkflow(input.ServiceEndpoint.WorkflowJSON)
	if err != nil {
		return "", "", err
	}
	outputs := botprotocol.NormalizeMap(entry["outputs"])
	var lyrics, messages []string
	for _, nodeID := range comfyOutputNodeIDs(outputs) {
		output := botprotocol.NormalizeMap(outputs[nodeID])
		if len(botprotocol.NormalizeAnyList(output["audio"])) == 0 && len(botprotocol.NormalizeAnyList(output["audios"])) == 0 {
			continue
		}
		for _, text := range botprotocol.NormalizeAnyList(output["text"]) {
			if value := strings.TrimSpace(botprotocol.AsText(text)); value != "" {
				messages = append(messages, value)
			}
		}
		node := botprotocol.NormalizeMap(workflow[nodeID])
		inputs := botprotocol.NormalizeMap(node["inputs"])
		link, linked := inputs["lyrics"].([]any)
		if !linked || len(link) != 2 {
			continue
		}
		source := botprotocol.NormalizeMap(outputs[botprotocol.AsText(link[0])])
		// The lyric preparer emits structure for lyrics; its instrumental branch only emits status text.
		if len(botprotocol.NormalizeAnyList(source["structure"])) == 0 {
			continue
		}
		for _, text := range botprotocol.NormalizeAnyList(source["text"]) {
			if value := strings.TrimSpace(botprotocol.AsText(text)); value != "" {
				lyrics = append(lyrics, value)
			}
		}
	}
	return strings.Join(lyrics, "\n\n"), strings.Join(messages, "\n\n"), nil
}

func comfyOutputMatchesKind(file map[string]any, key string, kind string) bool {
	extension := strings.ToLower(path.Ext(botprotocol.AsText(file["filename"])))
	if uploadprovider.IsVideoFile("", "", extension) {
		return kind == botprotocol.MediaTypeVideo
	}
	for _, mediaType := range []string{
		mime.TypeByExtension(extension),
		strings.ToLower(botprotocol.AsText(file["format"])),
	} {
		family, _, _ := strings.Cut(mediaType, "/")
		if family == "image" || family == "video" || family == "audio" {
			return family == kind
		}
	}
	return key != "images" || kind == "image"
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
