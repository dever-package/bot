package maintenance

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

// MigrateEnergonWeChatPowerIdentity upgrades an existing managed capability.
// The provider hook remains the only place that creates this catalog.
func MigrateEnergonWeChatPowerIdentity(ctx context.Context) error {
	powerModel := energonmodel.NewPowerModel()
	power := powerModel.Find(ctx, map[string]any{"key": botwebcontent.PowerKey})
	if power == nil {
		power = powerModel.Find(ctx, map[string]any{"key": botwebcontent.LegacyPowerKey})
	}
	if power == nil {
		return nil
	}

	powerModel.Update(ctx, map[string]any{"id": power.ID}, map[string]any{
		"key":  botwebcontent.PowerKey,
		"name": botwebcontent.PowerName,
	})
	updatedPower := powerModel.Find(ctx, map[string]any{"id": power.ID})
	if updatedPower == nil || updatedPower.Key != botwebcontent.PowerKey {
		return fmt.Errorf("升级微信公众号能力标识失败")
	}

	paramModel := energonmodel.NewParamModel()
	if param := paramModel.Find(ctx, map[string]any{"key": botwebcontent.InputParamKey}); param != nil {
		paramModel.Update(ctx, map[string]any{"id": param.ID}, map[string]any{
			"name": botwebcontent.InputParamName,
		})
		energonmodel.NewServiceParamModel().Update(ctx, map[string]any{
			"param_id": param.ID,
			"key":      "source",
		}, map[string]any{
			"name": botwebcontent.InputParamName,
		})
	}

	energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{
		"power_key": botwebcontent.LegacyPowerKey,
	}, map[string]any{
		"power_key": botwebcontent.PowerKey,
	})
	energonmodel.NewLogModel().Update(ctx, map[string]any{
		"power_id":  updatedPower.ID,
		"power_key": botwebcontent.LegacyPowerKey,
	}, map[string]any{
		"power_key": botwebcontent.PowerKey,
	})
	energonmodel.NewLogModel().Update(ctx, map[string]any{
		"power_id": updatedPower.ID,
	}, map[string]any{
		"power_name": botwebcontent.PowerName,
	})
	return nil
}
