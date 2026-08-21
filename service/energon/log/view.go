package log

import (
	"encoding/json"
	"strconv"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	frontmeta "github.com/dever-package/front/service/meta"
)

type LogViewService struct{}

const (
	logRequestIDSelectFields   = "main.request_id"
	logPowerParamsSelectFields = "main.power_params"
	logAttemptsSelectFields    = "main.id,main.power_target_id,main.service_id,main.service_name,main.provider_id,main.provider_name,main.account_id,main.account_name,main.status,main.latency,main.prompt_tokens,main.completion_tokens,main.total_tokens,main.cached_tokens,main.result,main.created_at"
	logCostSelectFields        = "main.id,main.log_id,main.call_status,main.pricing_status,main.pricing_mode,main.source_currency,main.source_cost_micros,main.exchange_rate,main.currency,main.cost_micros,main.error,main.created_at"
)

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

	current := botmodel.NewLogModel().FindMap(c.Context(), map[string]any{"id": logID}, map[string]any{
		"field": logRequestIDSelectFields,
	})
	requestID := util.ToStringTrimmed(current["request_id"])
	if requestID == "" {
		return []map[string]any{}
	}

	rows := botmodel.NewLogModel().SelectMap(c.Context(), map[string]any{
		"request_id": requestID,
	}, map[string]any{
		"order": "main.id asc",
		"field": logAttemptsSelectFields,
	})

	attempts := make([]map[string]any, 0, len(rows))
	for index, row := range rows {
		attempts = append(attempts, map[string]any{
			"attempt_no":        index + 1,
			"id":                row["id"],
			"power_target_id":   row["power_target_id"],
			"service_id":        row["service_id"],
			"service_name":      row["service_name"],
			"provider_id":       row["provider_id"],
			"provider_name":     row["provider_name"],
			"account_id":        row["account_id"],
			"account_name":      row["account_name"],
			"status":            row["status"],
			"latency":           row["latency"],
			"prompt_tokens":     row["prompt_tokens"],
			"completion_tokens": row["completion_tokens"],
			"total_tokens":      row["total_tokens"],
			"cached_tokens":     row["cached_tokens"],
			"error_detail":      extractLogFailureDetail(row["result"]),
			"created_at":        row["created_at"],
		})
	}
	return attempts
}

func (LogViewService) ProviderLoadCost(c *server.Context, _ []any) any {
	if c == nil {
		return map[string]any{}
	}

	result := map[string]any{
		"options": frontmeta.ResolveModelOptions(c.Context(), "bot.energon.NewCostRecordModel"),
	}
	logID := util.ToUint64(c.Input("id"))
	if logID == 0 {
		return result
	}

	record := botmodel.NewCostRecordModel().FindMap(c.Context(), map[string]any{"log_id": logID}, map[string]any{
		"field": logCostSelectFields,
	})
	for key, value := range record {
		result[key] = value
	}
	return result
}

func (LogViewService) ProviderAttachUserInfo(_ *server.Context, params []any) any {
	return attachLogUserInfo(logRowsFromProviderParams(params))
}

func logRowsFromProviderParams(params []any) []map[string]any {
	if len(params) == 0 {
		return []map[string]any{}
	}
	payload, ok := params[0].(map[string]any)
	if !ok {
		return []map[string]any{}
	}
	switch rows := payload["rows"].(type) {
	case []map[string]any:
		return rows
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, item := range rows {
			if row, ok := item.(map[string]any); ok && row != nil {
				result = append(result, row)
			}
		}
		return result
	default:
		return []map[string]any{}
	}
}

func attachLogUserInfo(rows []map[string]any) []map[string]any {
	for _, row := range rows {
		userID := util.ToUint64(row["user_id"])
		user, _ := row["user"].(map[string]any)
		name := util.ToStringTrimmed(user["name"])
		account := util.ToStringTrimmed(user["account"])
		switch {
		case userID > 0 && name != "":
		case userID > 0:
			name = "用户 #" + strconv.FormatUint(userID, 10) + "（已删除）"
		case util.ToStringTrimmed(row["scene"]) == "system":
			name = "系统调用"
		default:
			name = "未记录"
		}
		if account == "" {
			account = "-"
		}
		row["user_name"] = name
		row["user_account"] = account
	}
	return rows
}

func loadLogPowerParams(c *server.Context) (map[string]any, string) {
	if c == nil {
		return nil, ""
	}

	logID := util.ToUint64(c.Input("id"))
	if logID == 0 {
		return nil, ""
	}

	current := botmodel.NewLogModel().FindMap(c.Context(), map[string]any{"id": logID}, map[string]any{
		"field": logPowerParamsSelectFields,
	})
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
