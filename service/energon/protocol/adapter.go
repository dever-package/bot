package protocol

import (
	botmodel "github.com/dever-package/bot/model/energon"
	botprovider "github.com/dever-package/bot/service/energon/provider"
)

type RawRequest struct {
	Method  string
	Host    string
	Path    string
	Mode    string
	Headers map[string]string
	Body    map[string]any
}

type BillingContext struct {
	Billable    bool   `json:"billable,omitempty"`
	ChargeID    uint64 `json:"charge_id,omitempty"`
	Scene       string `json:"scene,omitempty"`
	BusinessKey string `json:"business_key,omitempty"`
	UserID      uint64 `json:"user_id,omitempty"`
	TeamID      uint64 `json:"team_id,omitempty"`
	ProjectID   uint64 `json:"project_id,omitempty"`
	SessionID   uint64 `json:"session_id,omitempty"`
	RunID       uint64 `json:"run_id,omitempty"`
}

type ShemicRequest struct {
	RequestID   string
	Mode        string
	Protocol    string
	Kind        string
	Name        string
	PromptOwner string
	Set         map[string]any
	Input       map[string]any
	History     []any
	Options     map[string]any
	Raw         RawRequest
	Billing     BillingContext
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
