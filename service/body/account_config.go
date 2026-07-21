package body

import (
	"context"
	"strings"

	bodymodel "github.com/dever-package/bot/model/body"
)

func selectAccountConfigs(ctx context.Context, accountIDs []uint64) []*bodymodel.AccountConfig {
	filterIDs := make([]any, 0, len(accountIDs))
	for _, accountID := range accountIDs {
		if accountID > 0 {
			filterIDs = append(filterIDs, accountID)
		}
	}
	if len(filterIDs) == 0 {
		return nil
	}
	return bodymodel.NewAccountConfigModel().Select(ctx, map[string]any{
		"account_id": filterIDs,
	}, map[string]any{"order": "id asc"})
}

func loadAccountConfigValues(ctx context.Context, accountIDs []uint64) map[uint64]map[string]string {
	result := make(map[uint64]map[string]string, len(accountIDs))
	for _, row := range selectAccountConfigs(ctx, accountIDs) {
		if row == nil || row.AccountID == 0 {
			continue
		}
		values := result[row.AccountID]
		if values == nil {
			values = map[string]string{}
			result[row.AccountID] = values
		}
		values[strings.ToLower(strings.TrimSpace(row.Key))] = strings.TrimSpace(row.Value)
	}
	return result
}

func accountConfigured(account *bodymodel.Account, values map[string]string) bool {
	return account != nil &&
		bodymodel.NormalizeAccountProvider(account.Provider) == bodymodel.AccountProviderFeishu &&
		strings.TrimSpace(values[bodymodel.AccountConfigKeyAppID]) != "" &&
		strings.TrimSpace(values[bodymodel.AccountConfigKeyAppSecret]) != ""
}
