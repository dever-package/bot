package energon

import (
	"context"
	"encoding/base64"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"path"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontupload "github.com/dever-package/front/service/upload"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	generatedMediaBizKey       = "energon"
	generatedImageUploadRuleID = uint64(1)
	generatedVideoUploadRuleID = uint64(2)
	generatedAudioUploadRuleID = uint64(3)
	generatedFileUploadRuleID  = uint64(4)
)

type generatedMediaRule struct {
	kind   string
	key    string
	ruleID uint64
}

var generatedMediaRules = map[string]generatedMediaRule{
	botprotocol.MediaTypeImage: {kind: botprotocol.MediaTypeImage, key: "images", ruleID: generatedImageUploadRuleID},
	botprotocol.MediaTypeVideo: {kind: botprotocol.MediaTypeVideo, key: "videos", ruleID: generatedVideoUploadRuleID},
	botprotocol.MediaTypeAudio: {kind: botprotocol.MediaTypeAudio, key: "audios", ruleID: generatedAudioUploadRuleID},
	botprotocol.MediaTypeFile:  {kind: botprotocol.MediaTypeFile, key: "files", ruleID: generatedFileUploadRuleID},
}

func (s GatewayService) storeGeneratedMediaOutput(
	ctx context.Context,
	requestID string,
	kind string,
	value any,
	onOutput func(botprotocol.Output) error,
) (any, error) {
	rule, exists := generatedMediaRuleForKind(kind)
	if !exists {
		return value, nil
	}
	output := botprotocol.ExtractOutput(value)
	media := botprotocol.NormalizeMediaList(output[rule.key], rule.kind)
	if len(media) == 0 {
		return value, nil
	}
	if onOutput != nil {
		if err := onOutput(botprotocol.Output{
			"event": "progress",
			"text":  "正在保存" + botprotocol.MediaOutputLabel(rule.kind),
		}); err != nil {
			return nil, err
		}
	}

	stored := make([]string, 0, len(media))
	files := make([]map[string]any, 0, len(media))
	for index, source := range media {
		payload, err := storeGeneratedMedia(ctx, requestID, rule, source, index)
		if err != nil {
			return nil, fmt.Errorf("保存%s失败: %w", botprotocol.MediaOutputLabel(rule.kind), err)
		}
		fileURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
		if fileURL == "" {
			return nil, fmt.Errorf("保存%s后未返回文件地址", botprotocol.MediaOutputLabel(rule.kind))
		}
		stored = append(stored, fileURL)
		file := make(map[string]any, len(payload)+2)
		for key, item := range payload {
			file[key] = item
		}
		file["file_id"] = payload["id"]
		file["kind"] = rule.kind
		files = append(files, file)
	}

	result := cloneMediaOutput(output)
	result[rule.key] = stored
	delete(result, rule.kind)
	delete(result, rule.kind+"_url")
	delete(result, "b64_json")
	result["media_files"] = files
	result["meta"] = storedMediaMeta(output["meta"], rule.ruleID)
	return result, nil
}

func generatedMediaRuleForKind(kind string) (generatedMediaRule, bool) {
	rule, exists := generatedMediaRules[strings.ToLower(strings.TrimSpace(kind))]
	return rule, exists
}

func storeGeneratedMedia(ctx context.Context, requestID string, rule generatedMediaRule, value string, index int) (map[string]any, error) {
	content, mimeType, decoded, err := decodeGeneratedMedia(value)
	if err != nil {
		return nil, err
	}
	if decoded {
		mimeType = detectGeneratedMediaMIME(content, mimeType)
		file, err := frontupload.ImportFile(ctx, frontupload.ImportFileInput{
			RuleID:  rule.ruleID,
			Kind:    rule.kind,
			Name:    generatedMediaName(requestID, rule.kind, mimeType, index),
			Mime:    mimeType,
			Content: content,
			BizKey:  generatedMediaBizKey,
			BizName: "AI生成",
		})
		if err != nil {
			return nil, err
		}
		return uploadrepo.BuildUploadFilePayload(file), nil
	}

	parsed, err := url.Parse(strings.TrimSpace(value))
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return nil, fmt.Errorf("生成结果不是可保存的文件或网络地址")
	}
	name := path.Base(parsed.Path)
	if name == "." || name == "/" {
		name = ""
	}
	return frontupload.ImportURLResource(ctx, frontupload.ImportURLResourceInput{
		RuleID:  rule.ruleID,
		URL:     parsed.String(),
		Name:    name,
		Kind:    rule.kind,
		BizKey:  generatedMediaBizKey,
		BizName: "AI生成",
	})
}

func decodeGeneratedMedia(value string) ([]byte, string, bool, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil, "", false, fmt.Errorf("生成结果为空")
	}
	if strings.HasPrefix(strings.ToLower(value), "data:") {
		header, encoded, found := strings.Cut(value, ",")
		if !found || !strings.Contains(strings.ToLower(header), ";base64") {
			return nil, "", true, fmt.Errorf("不支持的 data URL")
		}
		content, err := decodeBase64Content(encoded)
		if err != nil {
			return nil, "", true, fmt.Errorf("素材数据格式错误: %w", err)
		}
		mimeType := strings.TrimSpace(strings.TrimSuffix(header[5:], ";base64"))
		return content, mimeType, true, nil
	}
	if strings.Contains(value, "://") || len(value) < 256 {
		return nil, "", false, nil
	}
	content, err := decodeBase64Content(value)
	if err != nil {
		return nil, "", false, nil
	}
	return content, "", true, nil
}

func decodeBase64Content(value string) ([]byte, error) {
	value = strings.NewReplacer("\n", "", "\r", "", " ", "", "\t", "").Replace(value)
	if content, err := base64.StdEncoding.DecodeString(value); err == nil {
		return content, nil
	}
	return base64.RawStdEncoding.DecodeString(strings.TrimRight(value, "="))
}

func detectGeneratedMediaMIME(content []byte, fallback string) string {
	detected := strings.ToLower(strings.TrimSpace(http.DetectContentType(content)))
	if detected != "" && detected != "application/octet-stream" {
		return detected
	}
	return strings.ToLower(strings.TrimSpace(strings.Split(fallback, ";")[0]))
}

func generatedMediaName(requestID string, kind string, mimeType string, index int) string {
	requestID = strings.ReplaceAll(strings.TrimSpace(requestID), "-", "")
	if len(requestID) > 12 {
		requestID = requestID[:12]
	}
	if requestID == "" {
		requestID = "generated"
	}
	return fmt.Sprintf("generated-%s-%s-%d%s", kind, requestID, index+1, generatedMediaExtension(mimeType))
}

func generatedMediaExtension(mimeType string) string {
	switch strings.ToLower(strings.TrimSpace(mimeType)) {
	case "image/png":
		return ".png"
	case "image/jpeg":
		return ".jpg"
	case "image/webp":
		return ".webp"
	case "image/gif":
		return ".gif"
	case "video/mp4":
		return ".mp4"
	case "audio/mpeg":
		return ".mp3"
	case "audio/wav", "audio/x-wav":
		return ".wav"
	}
	extensions, _ := mime.ExtensionsByType(mimeType)
	if len(extensions) > 0 {
		return strings.ToLower(extensions[0])
	}
	return ""
}

func cloneMediaOutput(output botprotocol.Output) botprotocol.Output {
	result := make(botprotocol.Output, len(output))
	for key, value := range output {
		result[key] = value
	}
	return result
}

func storedMediaMeta(value any, ruleID uint64) map[string]any {
	meta := map[string]any{}
	if current, ok := value.(map[string]any); ok {
		for key, item := range current {
			meta[key] = item
		}
	}
	meta["stored"] = true
	meta["upload_rule_id"] = ruleID
	return meta
}
