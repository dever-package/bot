package maintenance

import (
	"context"
	"fmt"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
)

// MigrateProviderProtocolOption copies the legacy local processor key into the
// generic protocol option field without overwriting an already migrated value.
func MigrateProviderProtocolOption(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移来源协议选项失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	providerModel := energonmodel.NewProviderModel()
	providers := providerModel.Select(ctx, map[string]any{
		"protocol":        botprocessor.ProtocolLocal,
		"protocol_option": "",
		"processor":       map[string]any{"neq": ""},
	}, map[string]any{
		"field": "main.id,main.processor",
		"order": "main.id asc",
	})
	for _, provider := range providers {
		if provider == nil {
			continue
		}
		protocolOption := strings.ToLower(strings.TrimSpace(provider.LegacyProcessor))
		if protocolOption == "" {
			continue
		}
		providerModel.Update(ctx, map[string]any{
			"id":              provider.ID,
			"protocol_option": "",
		}, map[string]any{"protocol_option": protocolOption})
	}

	remaining := providerModel.Count(ctx, map[string]any{
		"protocol":        botprocessor.ProtocolLocal,
		"protocol_option": "",
		"processor":       map[string]any{"neq": ""},
	})
	if remaining > 0 {
		return fmt.Errorf("仍有 %d 条本地来源未写入协议选项", remaining)
	}
	return nil
}
