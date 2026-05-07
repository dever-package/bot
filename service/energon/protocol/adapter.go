package protocol

import (
	botmodel "my/package/bot/model/energon"
	botprovider "my/package/bot/service/energon/provider"
)

type RawRequest struct {
	Method  string
	Host    string
	Path    string
	Mode    string
	Headers map[string]string
	Body    map[string]any
}

type ShemicRequest struct {
	RequestID string
	Mode      string
	Protocol  string
	Kind      string
	Name      string
	Set       map[string]any
	Input     map[string]any
	History   []any
	Options   map[string]any
	Raw       RawRequest
}

type NativeInput struct {
	Request     *ShemicRequest
	Provider    botmodel.Provider
	Account     botmodel.Account
	Power       botmodel.Power
	PowerTarget botmodel.PowerTarget
	Service     botmodel.Service
	ServiceAPI  string
	Mapped      MappedInput
}

type Adapter interface {
	Name() string
	Normalize(raw RawRequest) (*ShemicRequest, error)
	BuildNativeRequest(input NativeInput) (botprovider.Request, error)
	BuildClientResponse(req *ShemicRequest, resp *botprovider.Response) (any, error)
}
