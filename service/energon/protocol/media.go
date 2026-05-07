package protocol

import (
	"encoding/json"
	"strings"
)

const (
	MediaTypeImage = "image"
	MediaTypeVideo = "video"
	MediaTypeAudio = "audio"
	MediaTypeFile  = "file"
)

var mediaMetaKeys = []string{
	"id",
	"model",
	"created",
	"status",
	"usage",
	"duration",
	"ratio",
	"resolution",
	"size",
}

func ExtractMediaOutput(value any, defaultType string) Output {
	output := Output{}
	collectMediaOutput(output, value, normalizeMediaType(defaultType), "")
	if len(output) == 0 {
		output["json"] = value
	}
	return normalizeOutput(output)
}

func ExtractMediaStreamOutput(data string, event string, defaultType string) Output {
	data = strings.TrimSpace(data)
	if data == "" {
		return Output{}
	}
	if strings.EqualFold(data, "[DONE]") {
		return Output{"event": "end"}
	}

	payload := map[string]any{}
	if err := json.Unmarshal([]byte(data), &payload); err != nil {
		return Output{"event": "delta", "text": data}
	}
	event = strings.TrimSpace(event)
	if event != "" {
		if strings.TrimSpace(asText(payload["event"])) == "" {
			payload["event"] = event
		}
		if strings.TrimSpace(asText(payload["type"])) == "" {
			payload["type"] = event
		}
	}
	return ExtractMediaOutput(payload, defaultType)
}

func HasMediaOutput(output Output) bool {
	if output == nil {
		return false
	}
	for _, key := range []string{"images", "videos", "audios", "files", "image", "video", "audio", "file"} {
		if !isEmptyProtocolValue(output[key]) {
			return true
		}
	}
	return false
}

func collectMediaOutput(output Output, value any, defaultType string, eventType string) {
	switch current := value.(type) {
	case nil:
		return
	case string:
		collectMediaString(output, current, defaultType, eventType)
	case []any:
		for _, item := range current {
			collectMediaOutput(output, item, defaultType, eventType)
		}
	case []string:
		appendMediaByType(output, defaultType, current)
	case map[string]any:
		collectMediaMap(output, current, defaultType, eventType)
	default:
		if text := strings.TrimSpace(asText(current)); text != "" {
			appendMediaByType(output, defaultType, []string{text})
		}
	}
}

func collectMediaString(output Output, value string, defaultType string, eventType string) {
	value = strings.TrimSpace(value)
	if value == "" {
		return
	}

	if strings.Contains(value, "\ndata:") || strings.HasPrefix(value, "data:") || strings.Contains(value, "\nevent:") || strings.HasPrefix(value, "event:") {
		for _, payload := range ParseSSEPayloads(value) {
			collectMediaMap(output, payload, defaultType, eventType)
		}
		return
	}

	var payload any
	if err := json.Unmarshal([]byte(value), &payload); err == nil {
		collectMediaOutput(output, payload, defaultType, eventType)
		return
	}

	appendMediaByType(output, mediaTypeFromEvent(eventType, defaultType), []string{value})
}

func collectMediaMap(output Output, mapped map[string]any, defaultType string, eventType string) {
	if len(mapped) == 0 {
		return
	}
	if outputValue, exists := mapped["output"]; exists {
		collectMediaOutput(output, outputValue, defaultType, eventType)
		return
	}

	currentEvent := firstText(
		eventType,
		strings.TrimSpace(asText(mapped["event"])),
		strings.TrimSpace(asText(mapped["type"])),
	)
	currentType := mediaTypeFromEvent(currentEvent, defaultType)

	collectKnownMediaFields(output, mapped, currentType)
	collectMediaOutput(output, mapped["content"], currentType, currentEvent)
	collectMediaOutput(output, mapped["data"], currentType, currentEvent)
	collectMetaFields(output, mapped)
}

func collectKnownMediaFields(output Output, mapped map[string]any, currentType string) {
	appendOutputText(output, mapped["text"])
	appendOutputList(output, "images", mapped["images"], mapped["image"])
	appendOutputList(output, "videos", mapped["videos"], mapped["video"])
	appendOutputList(output, "audios", mapped["audios"], mapped["audio"])
	appendOutputList(output, "files", mapped["files"], mapped["file"])

	appendMediaByType(output, MediaTypeImage, collectURLValues(mapped["image_url"]))
	appendMediaByType(output, MediaTypeVideo, collectURLValues(mapped["video_url"]))
	appendMediaByType(output, MediaTypeAudio, collectURLValues(mapped["audio_url"]))
	appendMediaByType(output, MediaTypeFile, collectURLValues(mapped["file_url"]))
	appendMediaByType(output, MediaTypeImage, collectURLValues(mapped["first_frame_url"]))
	appendMediaByType(output, MediaTypeImage, collectURLValues(mapped["last_frame_url"]))
	appendMediaByType(output, MediaTypeImage, collectURLValues(mapped["cover_url"]))
	appendMediaByType(output, MediaTypeImage, collectURLValues(mapped["thumbnail_url"]))
	if b64 := strings.TrimSpace(asText(mapped["b64_json"])); b64 != "" {
		appendMediaByType(output, MediaTypeImage, []string{normalizeBase64ImageURL(b64)})
	}
	if urls := collectURLValues(mapped["url"]); len(urls) > 0 {
		appendMediaByType(output, currentType, urls)
	}
}

func appendOutputText(output Output, values ...any) {
	parts := make([]string, 0, len(values)+1)
	if current := strings.TrimSpace(asText(output["text"])); current != "" {
		parts = append(parts, current)
	}
	for _, value := range values {
		if text := strings.TrimSpace(asText(value)); text != "" {
			parts = append(parts, text)
		}
	}
	if len(parts) > 0 {
		output["text"] = strings.Join(parts, "\n\n")
	}
}

func collectURLValues(value any) []string {
	switch current := value.(type) {
	case nil:
		return nil
	case map[string]any:
		return normalizeStringList(current["url"])
	case []any:
		result := make([]string, 0, len(current))
		for _, item := range current {
			result = append(result, collectURLValues(item)...)
		}
		return result
	default:
		return normalizeStringList(current)
	}
}

func collectMetaFields(output Output, mapped map[string]any) {
	meta := normalizeMap(output["meta"])
	if meta == nil {
		meta = map[string]any{}
	}
	for _, key := range mediaMetaKeys {
		value, exists := mapped[key]
		if !exists || isEmptyProtocolValue(value) {
			continue
		}
		meta[key] = value
	}
	if len(meta) > 0 {
		output["meta"] = meta
	}
}

func ParseSSEPayloads(raw string) []map[string]any {
	lines := strings.Split(raw, "\n")
	payloads := make([]map[string]any, 0)
	event := ""
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			event = ""
			continue
		}
		if strings.HasPrefix(line, "event:") {
			event = strings.TrimSpace(strings.TrimPrefix(line, "event:"))
			continue
		}
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "" || strings.EqualFold(data, "[DONE]") {
			continue
		}
		payload := map[string]any{}
		if err := json.Unmarshal([]byte(data), &payload); err != nil {
			continue
		}
		if event != "" {
			if strings.TrimSpace(asText(payload["event"])) == "" {
				payload["event"] = event
			}
			if strings.TrimSpace(asText(payload["type"])) == "" {
				payload["type"] = event
			}
		}
		payloads = append(payloads, payload)
	}
	return payloads
}

func mediaTypeFromEvent(eventType string, fallback string) string {
	eventType = strings.ToLower(strings.TrimSpace(eventType))
	switch {
	case strings.Contains(eventType, "image") || strings.Contains(eventType, "图片"):
		return MediaTypeImage
	case strings.Contains(eventType, "video") || strings.Contains(eventType, "视频"):
		return MediaTypeVideo
	case strings.Contains(eventType, "audio") || strings.Contains(eventType, "音频"):
		return MediaTypeAudio
	case strings.Contains(eventType, "file") || strings.Contains(eventType, "附件"):
		return MediaTypeFile
	default:
		return normalizeMediaType(fallback)
	}
}

func appendMediaByType(output Output, mediaType string, values ...[]string) {
	key := mediaOutputKey(mediaType)
	if key == "" {
		return
	}
	merged := make([]any, 0)
	for _, group := range values {
		for _, value := range group {
			value = strings.TrimSpace(value)
			if value != "" {
				merged = append(merged, value)
			}
		}
	}
	appendOutputList(output, key, merged...)
}

func mediaOutputKey(mediaType string) string {
	switch normalizeMediaType(mediaType) {
	case MediaTypeImage:
		return "images"
	case MediaTypeVideo:
		return "videos"
	case MediaTypeAudio:
		return "audios"
	case MediaTypeFile:
		return "files"
	default:
		return ""
	}
}

func normalizeMediaType(mediaType string) string {
	switch strings.ToLower(strings.TrimSpace(mediaType)) {
	case "image", "images":
		return MediaTypeImage
	case "video", "videos":
		return MediaTypeVideo
	case "audio", "audios":
		return MediaTypeAudio
	case "file", "files":
		return MediaTypeFile
	default:
		return ""
	}
}

func normalizeBase64ImageURL(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || strings.HasPrefix(value, "data:") {
		return value
	}
	return "data:image/jpeg;base64," + value
}
