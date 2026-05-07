package adapters

import (
	"fmt"
	"net/http"
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
)

type ShemicAdapter struct{}

func (ShemicAdapter) Name() string {
	return "shemic"
}

func (ShemicAdapter) Normalize(raw botprotocol.RawRequest) (*botprotocol.ShemicRequest, error) {
	kind := strings.TrimSpace(botprotocol.AsText(raw.Body["kind"]))
	if kind == "" {
		kind = "llm.chat"
	}
	name := strings.TrimSpace(botprotocol.AsText(raw.Body["power"]))
	if name == "" {
		return nil, fmt.Errorf("power 不能为空")
	}
	parts := botprotocol.NormalizeRequestParts(raw.Body)

	return &botprotocol.ShemicRequest{
		Mode:     raw.Mode,
		Protocol: "shemic",
		Kind:     kind,
		Name:     name,
		Set:      parts.Set,
		Input:    parts.Input,
		History:  parts.History,
		Options:  parts.Options,
		Raw:      raw,
	}, nil
}

func (ShemicAdapter) BuildNativeRequest(input botprotocol.NativeInput) (botprovider.Request, error) {
	body := cloneBody(input.Request.Raw.Body)
	deleteGatewayKeys(body)
	if !input.Mapped.IsZero() && len(input.Mapped.Params) > 0 {
		body = input.Mapped.NativeBody()
		for key, value := range input.Request.Options {
			if _, exists := body[key]; !exists {
				body[key] = value
			}
		}
	}

	path := resolveNativePath(input, "/")
	if path == "" {
		path = "/"
	}
	baseURL := input.Provider.Host

	headers := botprovider.AuthHeaders(input.Account.Key)
	headers["Content-Type"] = "application/json"

	return botprovider.Request{
		URL:     botprovider.JoinURL(baseURL, path),
		Method:  http.MethodPost,
		Headers: headers,
		Body:    body,
	}, nil
}

func (ShemicAdapter) BuildClientResponse(req *botprotocol.ShemicRequest, resp *botprovider.Response) (any, error) {
	return resp.Body, nil
}

func (ShemicAdapter) SupportsCancel(input botprotocol.NativeInput) bool {
	return true
}
