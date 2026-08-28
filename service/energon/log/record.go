package log

import (
	"context"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
)

func Record(ctx context.Context, item botmodel.Log) (record botmodel.Log) {
	record, _ = save(ctx, item)
	return record
}

func RecordRequired(ctx context.Context, item botmodel.Log) (botmodel.Log, error) {
	return save(ctx, item)
}

func save(ctx context.Context, item botmodel.Log) (record botmodel.Log, err error) {
	if item.CreatedAt.IsZero() {
		item.CreatedAt = time.Now()
	}
	record = item
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("运行日志保存失败: %v", recovered)
		}
	}()
	id := botmodel.NewLogModel().Insert(ctx, recordValues(item))
	if id <= 0 {
		return record, fmt.Errorf("运行日志保存失败: 未返回有效记录 ID")
	}
	record.ID = uint64(id)
	return record, nil
}

func recordValues(item botmodel.Log) map[string]any {
	if item.CreatedAt.IsZero() {
		item.CreatedAt = time.Now()
	}
	return map[string]any{
		"request_id":          item.RequestID,
		"mode":                item.Mode,
		"protocol":            item.Protocol,
		"scene":               item.Scene,
		"user_id":             item.UserID,
		"team_id":             item.TeamID,
		"project_id":          item.ProjectID,
		"team_run_id":         item.TeamRunID,
		"team_node_run_id":    item.TeamNodeRunID,
		"session_id":          item.SessionID,
		"agent_run_id":        item.AgentRunID,
		"run_id":              item.RunID,
		"power_id":            item.PowerID,
		"power_key":           item.PowerKey,
		"power_name":          item.PowerName,
		"power_target_id":     item.PowerTargetID,
		"power_params":        item.PowerParams,
		"provider_id":         item.ProviderID,
		"provider_name":       item.ProviderName,
		"account_id":          item.AccountID,
		"account_name":        item.AccountName,
		"service_id":          item.ServiceID,
		"service_name":        item.ServiceName,
		"service_endpoint_id": item.ServiceEndpointID,
		"service_api":         item.ServiceApi,
		"status":              item.Status,
		"latency":             item.Latency,
		"prompt_tokens":       item.PromptTokens,
		"completion_tokens":   item.CompletionTokens,
		"total_tokens":        item.TotalTokens,
		"cached_tokens":       item.CachedTokens,
		"result":              item.Result,
		"created_at":          item.CreatedAt,
	}
}
