package adapters

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/google/uuid"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

const (
	doubaoAudioURL     = "https://openspeech.bytedance.com/api/v3/plan/tts/unidirectional"
	doubaoKindAudio    = "doubao.audio"
	doubaoAudioEndCode = 20000000
)

func (adapter DoubaoAdapter) buildAudioRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	body := doubaoBody(input)
	requestParams := doubaoAudioRequestParams(input, body)
	text := strings.TrimSpace(botprotocol.AsText(requestParams["text"]))
	ssml := strings.TrimSpace(botprotocol.AsText(requestParams["ssml"]))
	if text == "" && ssml == "" {
		return botprovider.Request{}, fmt.Errorf("豆包语音服务缺少 text 或 ssml")
	}
	if strings.TrimSpace(botprotocol.AsText(requestParams["speaker"])) == "" {
		return botprovider.Request{}, fmt.Errorf("豆包语音服务缺少 speaker")
	}
	body["req_params"] = requestParams

	resourceID := doubaoAudioResourceID(input.ServiceAPI)
	if resourceID == "" {
		return botprovider.Request{}, fmt.Errorf("豆包语音服务缺少资源标识")
	}
	apiKey := strings.TrimSpace(input.Account.Key)
	if apiKey == "" {
		return botprovider.Request{}, fmt.Errorf("豆包语音服务缺少 API Key")
	}
	headers := map[string]string{
		"X-Api-Key":                             apiKey,
		"X-Api-Resource-Id":                     resourceID,
		"X-Api-Request-Id":                      uuid.NewString(),
		"X-Control-Require-Usage-Tokens-Return": "*",
		"Content-Type":                          "application/json",
	}
	return botprovider.Request{
		URL:     botprovider.JoinURL(input.Provider.Host, resolveConfiguredPath(input, doubaoAudioURL)),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}, nil
}

func doubaoAudioRequestParams(input botprotocol.NativeInput, body map[string]any) map[string]any {
	mapped := doubaoMappedInput(input)
	requestParams := cloneBody(botprotocol.NormalizeMap(body["req_params"]))
	if strings.TrimSpace(botprotocol.AsText(requestParams["text"])) == "" {
		text := firstNonEmptyText(
			requestParams["input"],
			requestParams["prompt"],
			body["text"],
			body["input"],
			body["prompt"],
			doubaoMappedInput(input).PrimaryPrompt(),
		)
		if text != "" {
			requestParams["text"] = text
		}
	}
	if strings.TrimSpace(botprotocol.AsText(requestParams["ssml"])) == "" {
		if ssml := strings.TrimSpace(botprotocol.AsText(body["ssml"])); ssml != "" {
			requestParams["ssml"] = ssml
		}
	}
	if strings.TrimSpace(botprotocol.AsText(requestParams["speaker"])) == "" {
		if speaker := firstNonEmptyText(
			requestParams["voice"],
			body["speaker"],
			body["voice"],
			mapped.Original["speaker"],
			mapped.Original["voice"],
		); speaker != "" {
			requestParams["speaker"] = speaker
		}
	}

	audioParams := cloneBody(botprotocol.NormalizeMap(requestParams["audio_params"]))
	for key, value := range botprotocol.NormalizeMap(body["audio_params"]) {
		if _, exists := audioParams[key]; !exists {
			audioParams[key] = value
		}
	}
	if botprotocol.IsEmptyProtocolValue(audioParams["format"]) {
		audioParams["format"] = firstNonEmptyText(body["format"], body["response_format"], "mp3")
	}
	if botprotocol.IsEmptyProtocolValue(audioParams["sample_rate"]) {
		if sampleRate := body["sample_rate"]; !botprotocol.IsEmptyProtocolValue(sampleRate) {
			audioParams["sample_rate"] = sampleRate
		} else {
			audioParams["sample_rate"] = 24000
		}
	}
	requestParams["audio_params"] = audioParams
	delete(requestParams, "input")
	delete(requestParams, "prompt")
	delete(requestParams, "voice")

	for _, key := range []string{"text", "ssml", "input", "prompt", "speaker", "voice", "audio_params", "format", "response_format", "sample_rate"} {
		delete(body, key)
	}
	return requestParams
}

func doubaoAudioResourceID(value string) string {
	value = strings.TrimSpace(value)
	if strings.EqualFold(value, "doubao-seed-tts-2.0") {
		return "seed-tts-2.0"
	}
	return value
}

func doubaoAudioOutput(resp *botprovider.Response) (any, error) {
	if resp == nil {
		return nil, fmt.Errorf("豆包语音合成返回为空")
	}
	if payload, ok := botprovider.AsBinaryPayload(resp.Body); ok {
		return payload, nil
	}

	content, meta, recognized, err := decodeDoubaoAudioResponse(resp.Body)
	if err != nil {
		return nil, err
	}
	if !recognized {
		return nil, fmt.Errorf("豆包语音合成未返回可识别的音频数据")
	}
	if len(content) == 0 {
		return nil, fmt.Errorf("豆包语音合成未返回音频数据")
	}
	if logID := doubaoResponseHeader(resp.Headers, "X-Tt-Logid"); logID != "" {
		if meta == nil {
			meta = map[string]any{}
		}
		meta["provider_log_id"] = logID
	}
	return botprovider.BinaryPayload{
		MIME:    doubaoAudioMIME(content),
		Content: content,
		Meta:    meta,
	}, nil
}

type doubaoAudioResponseAccumulator struct {
	content    []byte
	meta       map[string]any
	recognized bool
}

type doubaoAudioStreamDecoder struct {
	accumulator doubaoAudioResponseAccumulator
	mime        string
}

func (DoubaoAdapter) NewBinaryStreamDecoder(
	input botprotocol.NativeInput,
	request botprovider.Request,
) (bottask.BinaryStreamDecoder, bool) {
	if input.Request == nil || strings.TrimSpace(input.Request.Kind) != doubaoKindAudio {
		return nil, false
	}
	return &doubaoAudioStreamDecoder{mime: doubaoAudioRequestMIME(request)}, true
}

func (decoder *doubaoAudioStreamDecoder) Decode(chunk botprovider.StreamChunk) (botprovider.BinaryPayload, error) {
	before := len(decoder.accumulator.content)
	if err := decoder.accumulator.appendText(chunk.Data); err != nil {
		return botprovider.BinaryPayload{}, err
	}
	if len(decoder.accumulator.content) <= before {
		return botprovider.BinaryPayload{}, nil
	}
	return botprovider.BinaryPayload{
		MIME:    decoder.mime,
		Content: decoder.accumulator.content[before:],
	}, nil
}

func (decoder *doubaoAudioStreamDecoder) Result(resp *botprovider.Response) (botprovider.BinaryPayload, error) {
	if !decoder.accumulator.recognized {
		return botprovider.BinaryPayload{}, fmt.Errorf("豆包语音合成未返回可识别的音频数据")
	}
	if len(decoder.accumulator.content) == 0 {
		return botprovider.BinaryPayload{}, fmt.Errorf("豆包语音合成未返回音频数据")
	}
	meta := cloneBody(decoder.accumulator.meta)
	if resp != nil {
		if logID := doubaoResponseHeader(resp.Headers, "X-Tt-Logid"); logID != "" {
			meta["provider_log_id"] = logID
		}
	}
	return botprovider.BinaryPayload{
		MIME:    decoder.mime,
		Content: decoder.accumulator.content,
		Meta:    meta,
	}, nil
}

func decodeDoubaoAudioResponse(value any) ([]byte, map[string]any, bool, error) {
	accumulator := doubaoAudioResponseAccumulator{}
	if err := accumulator.appendValue(value); err != nil {
		return nil, nil, accumulator.recognized, err
	}
	return accumulator.content, accumulator.meta, accumulator.recognized, nil
}

func (accumulator *doubaoAudioResponseAccumulator) appendValue(value any) error {
	switch current := value.(type) {
	case string:
		return accumulator.appendText(current)
	case map[string]any:
		return accumulator.appendPayload(current)
	case []any:
		for _, item := range current {
			if err := accumulator.appendValue(item); err != nil {
				return err
			}
		}
	}
	return nil
}

func (accumulator *doubaoAudioResponseAccumulator) appendText(value string) error {
	parsed := false
	for _, line := range strings.Split(value, "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if strings.HasPrefix(line, "data:") {
			line = strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		}
		payload := map[string]any{}
		if err := json.Unmarshal([]byte(line), &payload); err != nil {
			if parsed || strings.HasPrefix(line, "{") {
				return fmt.Errorf("解析豆包语音响应失败: %w", err)
			}
			return nil
		}
		parsed = true
		if err := accumulator.appendPayload(payload); err != nil {
			return err
		}
	}
	return nil
}

func (accumulator *doubaoAudioResponseAccumulator) appendPayload(payload map[string]any) error {
	codeValue, hasCode := payload["code"]
	dataValue, hasData := payload["data"]
	if !hasCode && !hasData {
		return nil
	}
	accumulator.recognized = true

	code, err := doubaoAudioResponseCode(codeValue)
	if err != nil {
		return err
	}
	if code != 0 && code != doubaoAudioEndCode {
		message := firstNonEmptyText(payload["message"], payload["msg"], payload["error"])
		return fmt.Errorf("豆包语音合成失败: code=%d message=%s", code, message)
	}
	if usage := botprotocol.NormalizeMap(payload["usage"]); len(usage) > 0 {
		if accumulator.meta == nil {
			accumulator.meta = map[string]any{}
		}
		accumulator.meta["usage"] = usage
	}

	encoded := strings.TrimSpace(botprotocol.AsText(dataValue))
	if encoded == "" || strings.EqualFold(encoded, "null") {
		return nil
	}
	content, err := botprotocol.DecodeBase64Content(encoded)
	if err != nil {
		return fmt.Errorf("解析豆包语音音频失败: %w", err)
	}
	accumulator.content = append(accumulator.content, content...)
	return nil
}

func doubaoAudioResponseCode(value any) (int, error) {
	text := strings.TrimSpace(botprotocol.AsText(value))
	if text == "" {
		return 0, nil
	}
	if code, err := strconv.Atoi(text); err == nil {
		return code, nil
	}
	code, err := strconv.ParseFloat(text, 64)
	if err != nil {
		return 0, fmt.Errorf("豆包语音响应 code 无效: %s", text)
	}
	return int(code), nil
}

func doubaoAudioMIME(content []byte) string {
	detected := strings.ToLower(strings.TrimSpace(http.DetectContentType(content)))
	if strings.HasPrefix(detected, "audio/") {
		return detected
	}
	if detected == "application/ogg" {
		return "audio/ogg"
	}
	return "audio/mpeg"
}

func doubaoAudioRequestMIME(request botprovider.Request) string {
	requestParams := botprotocol.NormalizeMap(request.Body["req_params"])
	audioParams := botprotocol.NormalizeMap(requestParams["audio_params"])
	switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(audioParams["format"]))) {
	case "wav", "wave":
		return "audio/wav"
	case "ogg", "opus":
		return "audio/ogg"
	case "aac":
		return "audio/aac"
	case "flac":
		return "audio/flac"
	case "pcm", "s16le", "pcm_s16le":
		return "audio/L16"
	default:
		return "audio/mpeg"
	}
}

func doubaoResponseHeader(headers map[string]string, key string) string {
	for currentKey, value := range headers {
		if strings.EqualFold(strings.TrimSpace(currentKey), key) {
			return strings.TrimSpace(value)
		}
	}
	return ""
}
