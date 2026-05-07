package energon

import (
	botmodel "my/package/bot/model/energon"
	botprovider "my/package/bot/service/energon/provider"
)

const (
	ModeNormalize = "normalize"
	ModeProxy     = "proxy"

	StatusActive   int16 = 1
	StatusInactive       = 2
	StatusSuccess        = "success"
	StatusFail           = "fail"

	DefaultProxyPower = "shemic.proxy.openai"
)

func isActive(status int16) bool {
	return status == StatusActive
}

type GatewayRequest struct {
	RequestID string
	Method    string
	Host      string
	Path      string
	Headers   map[string]string
	Body      map[string]any
}

type GatewayResponse struct {
	RequestID  string           `json:"request_id"`
	Mode       string           `json:"mode"`
	Protocol   string           `json:"protocol"`
	Power      string           `json:"power"`
	Target     string           `json:"target"`
	Provider   string           `json:"provider"`
	Account    string           `json:"account"`
	NativeName string           `json:"native_name"`
	Data       any              `json:"data"`
	Call       map[string]any   `json:"call"`
	Log        botmodel.Log     `json:"log"`
	Attempts   []GatewayAttempt `json:"attempts,omitempty"`
}

type GatewayAttempt struct {
	PowerTargetID uint64 `json:"power_target_id"`
	ServiceID     uint64 `json:"service_id,omitempty"`
	ServiceName   string `json:"service_name,omitempty"`
	ProviderID    uint64 `json:"provider_id,omitempty"`
	ProviderName  string `json:"provider_name,omitempty"`
	AccountID     uint64 `json:"account_id,omitempty"`
	AccountName   string `json:"account_name,omitempty"`
	Status        string `json:"status"`
	Error         string `json:"error,omitempty"`
	LogID         uint64 `json:"log_id,omitempty"`
	Latency       int64  `json:"latency,omitempty"`
}

type selectedTarget struct {
	Provider    botmodel.Provider
	Account     botmodel.Account
	Power       botmodel.Power
	PowerTarget botmodel.PowerTarget
	Service     botmodel.Service
	ServiceAPI  string
}

type callResult struct {
	NativeRequest botprovider.Request
	Response      *botprovider.Response
	ServiceAPI    string
	Data          any
	Log           botmodel.Log
	Attempt       GatewayAttempt
	Attempts      []GatewayAttempt
}
