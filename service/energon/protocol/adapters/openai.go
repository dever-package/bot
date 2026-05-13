package adapters

import (
	"fmt"
	"net/http"
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	bottask "my/package/bot/service/energon/task"
)

type OpenAIAdapter struct{}

func (OpenAIAdapter) Name() string {
	return "openai"
}

func (OpenAIAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	power, _ := raw.Body["power"].(string)
	name := strings.TrimSpace(power)
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)

	return &botprotocol.ShemicRequest{
		Mode:     raw.Mode,
		Protocol: "openai",
		Kind:     "llm.chat",
		Name:     name,
		Set:      parts.Set,
		Input:    parts.Input,
		History:  parts.History,
		Options:  parts.Options,
		Raw:      raw,
	}, nil
}

func (OpenAIAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	path := resolveNativePath(input, "/chat/completions")
	if path == "" {
		path = "/chat/completions"
	}
	if strings.TrimSpace(input.Service.Path) != "" {
		return buildOpenAIConfiguredRequest(input, path), nil
	}

	return buildOpenAIChatRequest(input, path), nil
}

func (OpenAIAdapter) BuildClientResponse(req *botprotocol.ShemicRequest, resp *botprovider.Response) (any, error) {
	return resp.Body, nil
}

func (OpenAIAdapter) SupportsCancel(input botprotocol.NativeInput) bool {
	if openAIConfiguredOutputType(input) != "" {
		return false
	}
	return true
}

func (OpenAIAdapter) StreamTaskSpec(input botprotocol.NativeInput) (bottask.StreamTaskSpec, bool) {
	outputType := openAIConfiguredOutputType(input)
	if outputType == "" {
		return bottask.StreamTaskSpec{}, false
	}

	return bottask.StreamTaskSpec{
		Kind:         bottask.StreamKindRequest,
		OutputType:   outputType,
		PlainRequest: true,
	}, true
}

func buildOpenAIChatRequest(input botprotocol.NativeInput, path string) botprovider.Request {
	body := map[string]any{}
	for key, value := range input.Request.Options {
		body[key] = value
	}

	mapped := input.Mapped
	if mapped.IsZero() {
		mapped = botprotocol.NewMappedInput(input.Request.Input, nil)
	}
	excludedPromptKeys := map[string]bool{}
	for _, param := range mapped.Params {
		if !isOpenAINativeBodyKey(param.NativeKey) {
			continue
		}
		body[param.NativeKey] = param.Value
		for _, key := range param.InputKeys() {
			excludedPromptKeys[key] = true
		}
	}
	for key, value := range mapped.NativeBody() {
		if !isOpenAINativeBodyKey(key) {
			continue
		}
		body[key] = value
		excludedPromptKeys[key] = true
	}

	messages := botprotocol.BuildOpenAIMessagesFromParts(
		input.Request.Set,
		input.Request.History,
		mapped.PromptInput(excludedPromptKeys),
		mapped.PromptOptions("用户输入"),
	)
	if len(messages) > 0 {
		body["messages"] = messages
	}
	if nativeName := nativeModelName(input.ServiceAPI); nativeName != "" {
		body["model"] = nativeName
	}

	baseURL := input.Provider.Host

	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"

	return botprovider.Request{
		URL:     botprovider.JoinURL(baseURL, path),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}
}

func buildOpenAIConfiguredRequest(input botprotocol.NativeInput, path string) botprovider.Request {
	body := map[string]any{}
	for key, value := range input.Request.Options {
		if skipOpenAIConfiguredOption(input, key) {
			continue
		}
		body[key] = value
	}

	mapped := input.Mapped
	if mapped.IsZero() {
		mapped = botprotocol.NewMappedInput(input.Request.Input, nil)
	}
	for key, value := range mapped.NativeBody() {
		body[key] = value
	}
	if nativeName := nativeModelName(input.ServiceAPI); nativeName != "" {
		setBodyDefault(body, "model", nativeName)
	}

	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"

	return botprovider.Request{
		URL:     botprovider.JoinURL(input.Provider.Host, path),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}
}

func skipOpenAIConfiguredOption(input botprotocol.NativeInput, key string) bool {
	if openAIConfiguredOutputType(input) == "" {
		return false
	}
	return isGatewayStreamOption(key)
}

func openAIConfiguredOutputType(input botprotocol.NativeInput) string {
	if strings.TrimSpace(input.Service.Path) == "" {
		return ""
	}

	switch strings.ToLower(strings.TrimSpace(input.Service.Type)) {
	case "image", "images", "图片":
		return botprotocol.MediaTypeImage
	case "video", "videos", "视频":
		return botprotocol.MediaTypeVideo
	case "audio", "audios", "音频":
		return botprotocol.MediaTypeAudio
	case "file", "files", "文件":
		return botprotocol.MediaTypeFile
	default:
		return ""
	}
}
