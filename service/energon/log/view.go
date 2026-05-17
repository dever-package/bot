package log

import (
	"encoding/json"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
)

type LogViewService struct{}

func (LogViewService) ProviderLoadRequestParams(c *server.Context, _ []any) any {
	payload, raw := loadLogPowerParams(c)
	if len(payload) == 0 {
		return firstNonEmpty(raw, "{}")
	}

	requestPayload := map[string]any{}
	for _, key := range []string{"set", "input", "history", "options"} {
		if value, exists := payload[key]; exists {
			requestPayload[key] = value
		}
	}
	if len(requestPayload) == 0 {
		return prettyLogJSON(payload)
	}
	return prettyLogJSON(requestPayload)
}

func (LogViewService) ProviderLoadChannelRequest(c *server.Context, _ []any) any {
	payload, _ := loadLogPowerParams(c)
	channel, exists := payload["channel"]
	if !exists {
		return "本次日志未记录渠道请求。"
	}
	return prettyLogJSON(channel)
}

func (LogViewService) ProviderLoadAttempts(c *server.Context, _ []any) any {
	if c == nil {
		return []map[string]any{}
	}

	logID := util.ToUint64(c.Input("id"))
	if logID == 0 {
		return []map[string]any{}
	}

	current := botmodel.NewLogModel().FindMap(c.Context(), map[string]any{"id": logID})
	requestID := util.ToStringTrimmed(current["request_id"])
	if requestID == "" {
		return []map[string]any{}
	}

	rows := botmodel.NewLogModel().SelectMap(c.Context(), map[string]any{
		"request_id": requestID,
	}, map[string]any{
		"order": "main.id asc",
	})

	attempts := make([]map[string]any, 0, len(rows))
	for index, row := range rows {
		attempts = append(attempts, map[string]any{
			"attempt_no":      index + 1,
			"id":              row["id"],
			"power_target_id": row["power_target_id"],
			"service_id":      row["service_id"],
			"service_name":    row["service_name"],
			"provider_id":     row["provider_id"],
			"provider_name":   row["provider_name"],
			"account_id":      row["account_id"],
			"account_name":    row["account_name"],
			"status":          row["status"],
			"latency":         row["latency"],
			"error_detail":    extractLogFailureDetail(row["result"]),
			"created_at":      row["created_at"],
		})
	}
	return attempts
}

func loadLogPowerParams(c *server.Context) (map[string]any, string) {
	if c == nil {
		return nil, ""
	}

	logID := util.ToUint64(c.Input("id"))
	if logID == 0 {
		return nil, ""
	}

	current := botmodel.NewLogModel().FindMap(c.Context(), map[string]any{"id": logID})
	raw := util.ToStringTrimmed(current["power_params"])
	if raw == "" {
		return nil, ""
	}

	payload := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return nil, raw
	}
	return payload, raw
}

func prettyLogJSON(value any) string {
	raw, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return "{}"
	}
	return string(raw)
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value := util.ToStringTrimmed(value); value != "" {
			return value
		}
	}
	return ""
}

func extractLogFailureDetail(value any) string {
	text := util.ToStringTrimmed(value)
	if text == "" {
		return "无错误信息。"
	}

	var payload map[string]any
	if err := json.Unmarshal([]byte(text), &payload); err != nil {
		return text
	}

	message := util.ToStringTrimmed(payload["message"])
	if message == "" {
		return "无错误信息。"
	}
	stage := util.ToStringTrimmed(payload["stage"])
	if stage == "" {
		return message
	}
	return stage + ": " + message
}
