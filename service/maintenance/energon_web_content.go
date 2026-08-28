package maintenance

import (
	"context"
	"fmt"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

type webContentCatalogMigration struct {
	retainedPowerID uint64
	powerIDs        []uint64
	paramID         uint64
	legacyParamIDs  []uint64
	targetIDs       map[uint64]uint64
	teamPowerIDs    map[uint64]uint64
}

// MigrateEnergonWeChatPowerIdentity preserves the historical v2 migration.
// The v3 migration registered immediately after it performs the final merge.
func MigrateEnergonWeChatPowerIdentity(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级微信公众号能力标识失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	powerModel := energonmodel.NewPowerModel()
	power := powerModel.Find(ctx, map[string]any{"key": botwebcontent.LegacyWeChatPowerKey})
	if power == nil {
		power = powerModel.Find(ctx, map[string]any{"key": botwebcontent.PowerKey})
		if power == nil {
			return nil
		}
		powerModel.Update(ctx, map[string]any{"id": power.ID}, map[string]any{
			"key":  botwebcontent.LegacyWeChatPowerKey,
			"name": "微信公众号",
		})
	}

	energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{
		"power_key": botwebcontent.PowerKey,
	}, map[string]any{
		"power_key": botwebcontent.LegacyWeChatPowerKey,
	})
	energonmodel.NewLogModel().Update(ctx, map[string]any{
		"power_id": power.ID,
	}, map[string]any{
		"power_key":  botwebcontent.LegacyWeChatPowerKey,
		"power_name": "微信公众号",
	})
	return nil
}

// MigrateEnergonWebContentCatalog merges the platform-specific managed
// capabilities into one content collection capability. It intentionally does
// nothing when no managed capability has ever been created.
func MigrateEnergonWebContentCatalog(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("合并内容采集能力失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	if len(findWebContentPowers(ctx)) == 0 {
		return nil
	}
	return orm.Transaction(ctx, func(tx context.Context) error {
		powers := findWebContentPowers(tx)
		if len(powers) == 0 {
			return nil
		}
		params := findWebContentParams(tx)
		catalog, err := botwebcontent.EnsureCatalog(tx)
		if err != nil {
			return err
		}

		migration := webContentCatalogMigration{
			retainedPowerID: catalog.Power.ID,
			powerIDs:        webContentPowerIDs(powers),
			paramID:         catalog.Param.ID,
			legacyParamIDs:  legacyWebContentParamIDs(params, catalog.Param.ID),
			targetIDs:       map[uint64]uint64{},
			teamPowerIDs:    map[uint64]uint64{},
		}
		migrateWebContentPowerTargets(tx, &migration)
		migrateWebContentPowerParams(tx, migration)
		migrateWebContentTeamPowers(tx, &migration)
		migrateWebContentDirectReferences(tx, migration)
		migrateWebContentJSONReferences(tx, migration)
		deleteLegacyWebContentCatalog(tx, migration)
		return nil
	})
}

func findWebContentPowers(ctx context.Context) []*energonmodel.Power {
	model := energonmodel.NewPowerModel()
	keys := append([]string{botwebcontent.PowerKey}, botwebcontent.LegacyPowerKeys()...)
	rows := make([]*energonmodel.Power, 0, len(keys))
	seen := map[uint64]struct{}{}
	for _, key := range keys {
		row := model.Find(ctx, map[string]any{"key": key})
		if row == nil {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		rows = append(rows, row)
	}
	return rows
}

func findWebContentParams(ctx context.Context) []*energonmodel.Param {
	model := energonmodel.NewParamModel()
	keys := []string{botwebcontent.InputParamKey, botwebcontent.LegacyDouyinInputParamKey}
	rows := make([]*energonmodel.Param, 0, len(keys))
	seen := map[uint64]struct{}{}
	for _, key := range keys {
		row := model.Find(ctx, map[string]any{"key": key})
		if row == nil {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		rows = append(rows, row)
	}
	return rows
}

func webContentPowerIDs(rows []*energonmodel.Power) []uint64 {
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			ids = append(ids, row.ID)
		}
	}
	return ids
}

func legacyWebContentParamIDs(rows []*energonmodel.Param, retainedID uint64) []uint64 {
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 && row.ID != retainedID {
			ids = append(ids, row.ID)
		}
	}
	return ids
}

func deleteLegacyWebContentCatalog(ctx context.Context, migration webContentCatalogMigration) {
	powerModel := energonmodel.NewPowerModel()
	for _, powerID := range migration.powerIDs {
		if powerID != migration.retainedPowerID {
			powerModel.Delete(ctx, map[string]any{"id": powerID})
		}
	}

	paramModel := energonmodel.NewParamModel()
	for _, paramID := range migration.legacyParamIDs {
		if webContentParamInUse(ctx, paramID) {
			continue
		}
		paramModel.Delete(ctx, map[string]any{"id": paramID})
	}
	powerModel.Update(ctx, map[string]any{"id": migration.retainedPowerID}, map[string]any{
		"key":         botwebcontent.PowerKey,
		"name":        botwebcontent.PowerName,
		"icon":        botwebcontent.PowerIcon,
		"output_type": energonmodel.OutputTypeGeneral,
		"kind":        botwebcontent.PowerKind,
		"source_rule": 1,
	})
	energonmodel.NewParamModel().Update(ctx, map[string]any{"id": migration.paramID}, map[string]any{
		"key":  botwebcontent.InputParamKey,
		"name": botwebcontent.InputParamName,
	})
}

func webContentParamInUse(ctx context.Context, paramID uint64) bool {
	if energonmodel.NewPowerParamModel().Find(ctx, map[string]any{"param_id": paramID}) != nil {
		return true
	}
	if energonmodel.NewServiceParamModel().Find(ctx, map[string]any{"param_id": paramID}) != nil {
		return true
	}
	if energonmodel.NewServiceParamModel().Find(ctx, map[string]any{"active_when_param_id": paramID}) != nil {
		return true
	}
	if agentmodel.NewAgentParamModel().Find(ctx, map[string]any{"param_id": paramID}) != nil {
		return true
	}
	if energonmodel.NewParamOptionModel().Find(ctx, map[string]any{"param_id": paramID}) != nil {
		return true
	}
	return false
}
