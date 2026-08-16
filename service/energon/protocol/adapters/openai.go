package adapters

import (
	"fmt"
	"net/http"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
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
	applyToolOptionOverrides(body, input.Request.Options)

	applyOpenAIChatMessages(body, input, mapped, excludedPromptKeys, false)
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
	if isOpenAIConfiguredChatRequest(input, path) {
		applyOpenAIChatMessages(body, input, mapped, mapped.InputKeySet(), true)
	}
	applyToolOptionOverrides(body, input.Request.Options)
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

func applyOpenAIChatMessages(
	body map[string]any,
	input botprotocol.NativeInput,
	mapped botprotocol.MappedInput,
	excludedPromptKeys map[string]bool,
	preserveMappedMessages bool,
) {
	if body == nil || input.Request == nil {
		return
	}
	if preserveMappedMessages {
		if mappedMessages := configuredOpenAIMessages(body); len(mappedMessages) > 0 {
			contextMessages := botprotocol.BuildOpenAIMessagesFromParts(
				input.Request.Set,
				input.Request.History,
				nil,
				mapped.PromptOptions("用户输入"),
			)
			body["messages"] = append(contextMessages, mappedMessages...)
			return
		}
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
}

func configuredOpenAIMessages(body map[string]any) []any {
	if body == nil {
		return nil
	}
	switch current := body["messages"].(type) {
	case []any, []map[string]any:
		return botprotocol.NormalizeAnyList(current)
	case map[string]any:
		if len(current) == 0 {
			return nil
		}
		message := cloneBody(current)
		setBodyDefault(message, "role", "user")
		return []any{message}
	case string:
		if text := strings.TrimSpace(current); text != "" {
			return []any{map[string]any{"role": "user", "content": text}}
		}
		return nil
	default:
		return nil
	}
}

func isOpenAIConfiguredChatRequest(input botprotocol.NativeInput, path string) bool {
	if !isTextService(input) {
		return false
	}
	path = strings.ToLower(strings.TrimSpace(path))
	return strings.Contains(path, "chat/completions")
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
