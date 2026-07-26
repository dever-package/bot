package api

import (
	"context"
	"fmt"
	"strings"

	deverjwt "github.com/shemic/dever/auth/jwt"
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontauthcontext "github.com/dever-package/front/service/authcontext"
	frontstream "github.com/dever-package/front/service/stream"
)

type Energon struct{}

var gateway = energonservice.NewGatewayService()
var powerRunHistory = energonservice.NewPowerRunHistoryService()

func (Energon) PostRequest(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	adminID, err := currentAdminAccountID(c.Context())
	if err != nil {
		return c.Error(err)
	}
	created, err := powerRunHistory.Create(c.Context(), energonservice.PowerRunHistoryCreateRequest{
		AdminID:        adminID,
		PowerKey:       botapi.TextFromBody(body, "power"),
		Input:          botapi.MapFromBody(body, "input"),
		SourceTargetID: botapi.Uint64FromBody(body, "source_target_id", "sourceTargetId"),
	})
	if err != nil {
		return c.Error(err)
	}
	resp := gateway.Request(c.Context(), energonservice.GatewayRequest{
		RequestID: created.RequestID,
		Method:    c.Method(),
		Host:      c.Header("Host"),
		Path:      c.Path(),
		Headers:   botapi.RequestHeaders(c),
		Body:      body,
	})
	switch {
	case resp.Status == botprotocol.ResponseStatusFail:
		powerRunHistory.MarkFailed(c.Context(), adminID, created.RequestID, resp.Msg)
	case resp.Type == botprotocol.ResponseTypeStream:
		attachPowerRunHistoryMeta(&resp, created)
		powerRunHistory.TrackStream(c.Context(), adminID, created.RequestID, gateway.ReadStream)
	default:
		powerRunHistory.Complete(c.Context(), adminID, created.RequestID, resp.Output)
	}
	return c.JSONPayload(200, resp.Payload())
}

func (Energon) GetDemo(c *server.Context) error {
	return handlePowerRequest(c, map[string]any{
		"power":   "llm",
		"input":   energonservice.PromptInput("你好"),
		"history": []any{},
		"options": map[string]any{
			"stream": isRequestTruthy(c.Input("stream")),
		},
	})
}

func (Energon) GetPowerParams(c *server.Context) error {
	powerKey := strings.TrimSpace(frontstream.InputText(c.Input("power", "required", "能力")))
	targetID := uint64(frontstream.InputInt64(c.Input("source_target_id"), 0))
	if targetID == 0 {
		targetID = uint64(frontstream.InputInt64(c.Input("sourceTargetId"), 0))
	}
	if isRequestTruthy(c.Input("include_sources")) || isRequestTruthy(c.Input("includeSources")) {
		config, err := gateway.PowerParamConfig(c.Context(), powerKey, targetID)
		if err != nil {
			return c.Error(err)
		}
		return c.JSON(config)
	}
	rows, err := gateway.PowerParams(c.Context(), powerKey)
	if err != nil {
		return c.Error(err)
	}
	return c.JSON(rows)
}

func (Energon) PostCopyService(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := energonservice.DuplicateServiceConfiguration(
		c.Context(),
		botapi.Uint64FromBody(body, "service_id", "serviceId", "id"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Energon) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, gateway.ReadStream)
}

func (Energon) PostStreamStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := botapi.StreamRequestIDFromBody(body)
	resp := gateway.StopStream(c.Context(), requestID)
	if resp.Status == botprotocol.ResponseStatusSuccess {
		if adminID, err := currentAdminAccountID(c.Context()); err == nil {
			powerRunHistory.MarkCanceled(c.Context(), adminID, requestID)
		}
	}
	return c.JSONPayload(200, resp.Payload())
}

func (Energon) GetPowerHistory(c *server.Context) error {
	adminID, err := currentAdminAccountID(c.Context())
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := powerRunHistory.List(c.Context(), energonservice.PowerRunHistoryListRequest{
		AdminID:  adminID,
		PowerKey: botapi.QueryText(c, "power"),
		BeforeID: botapi.QueryUint64(c, "before_id", "beforeId"),
		Limit:    int(botapi.QueryUint64(c, "limit")),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Energon) GetPowerHistoryDetail(c *server.Context) error {
	adminID, err := currentAdminAccountID(c.Context())
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := powerRunHistory.Detail(c.Context(), energonservice.PowerRunHistoryDetailRequest{
		AdminID:   adminID,
		PowerKey:  botapi.QueryText(c, "power"),
		HistoryID: botapi.QueryUint64(c, "history_id", "historyId", "id"),
	})
	return botapi.WriteJSON(c, data, err)
}

func handlePowerRequest(c *server.Context, body map[string]any) error {
	resp := gateway.Request(c.Context(), energonservice.GatewayRequest{
		Method:  c.Method(),
		Host:    c.Header("Host"),
		Path:    c.Path(),
		Headers: botapi.RequestHeaders(c),
		Body:    body,
	})
	return c.JSONPayload(200, resp.Payload())
}

func isRequestTruthy(value any) bool {
	switch strings.ToLower(strings.TrimSpace(frontstream.InputText(value))) {
	case "1", "true", "yes", "y", "on":
		return true
	default:
		return false
	}
}

func currentAdminAccountID(ctx context.Context) (uint64, error) {
	if current, ok := deverjwt.ActiveInt64(ctx); ok && current > 0 {
		return uint64(current), nil
	}
	if current, ok := frontauthcontext.AdminID(ctx); ok && current > 0 {
		return current, nil
	}
	return 0, fmt.Errorf("登录账号无效")
}

func attachPowerRunHistoryMeta(resp *botprotocol.Response, history energonservice.PowerRunHistoryCreated) {
	if resp == nil {
		return
	}
	meta := map[string]any{}
	if current, ok := resp.Output["meta"].(map[string]any); ok {
		for key, value := range current {
			meta[key] = value
		}
	}
	meta["history_id"] = history.HistoryID
	meta["history_title"] = history.Title
	meta["history_input_summary"] = history.InputSummary
	meta["source_target_id"] = history.SourceTargetID
	resp.Output["meta"] = meta
}
