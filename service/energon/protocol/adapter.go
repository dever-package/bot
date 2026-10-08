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
	Billable      bool   `json:"billable,omitempty"`
	ChargeID      uint64 `json:"charge_id,omitempty"`
	Scene         string `json:"scene,omitempty"`
	BusinessKey   string `json:"business_key,omitempty"`
	UserID        uint64 `json:"user_id,omitempty"`
	TeamID        uint64 `json:"team_id,omitempty"`
	ProjectID     uint64 `json:"project_id,omitempty"`
	TeamRunID     uint64 `json:"team_run_id,omitempty"`
	TeamNodeRunID uint64 `json:"team_node_run_id,omitempty"`
	SessionID     uint64 `json:"session_id,omitempty"`
	AgentRunID    uint64 `json:"agent_run_id,omitempty"`
	RunID         uint64 `json:"run_id,omitempty"`
}

type MediaReferencePromptContext struct {
	References []map[string]any
	Content    map[string]any
}

type ShemicRequest struct {
	MediaReferencePrompt      *MediaReferencePromptContext `json:"-"`
	RequestID                 string
	Mode                      string
	Protocol                  string
	Kind                      string
	Name                      string
	PromptOwner               string
	Set                       map[string]any
	Input                     map[string]any
	History                   []any
	Options                   map[string]any
	Raw                       RawRequest
	Billing                   BillingContext
	AllowedSourceTargetIDs    []uint64
	StoryboardMaxShotDuration int
}

type NativeInput struct {
	Request         *ShemicRequest
	Provider        botmodel.Provider
	Account         botmodel.Account
	Power           botmodel.Power
	PowerTarget     botmodel.PowerTarget
	Service         botmodel.Service
	ServiceEndpoint botmodel.ServiceEndpoint
	ServiceAPI      string
	Mapped          MappedInput
}

type Adapter interface {
	Name() string
	Normalize(raw RawRequest) (*ShemicRequest, error)
	BuildNativeRequest(input NativeInput) (botprovider.Request, error)
	BuildClientResponse(req *ShemicRequest, resp *botprovider.Response) (any, error)
}
