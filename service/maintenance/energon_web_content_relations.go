package maintenance

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

func migrateWebContentPowerTargets(ctx context.Context, migration *webContentCatalogMigration) {
	model := energonmodel.NewPowerTargetModel()
	rows := model.Select(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"order": "main.id asc",
	})
	retainedByService := map[uint64]*energonmodel.PowerTarget{}
	for _, row := range rows {
		if row.PowerID == migration.retainedPowerID {
			retainedByService[row.ServiceID] = row
			migration.targetIDs[row.ID] = row.ID
		}
	}
	for _, row := range rows {
		if row.PowerID == migration.retainedPowerID {
			continue
		}
		if retained := retainedByService[row.ServiceID]; retained != nil {
			retained.Sort = smallerInt(retained.Sort, row.Sort)
			retained.Status = enabledStatus(retained.Status, row.Status)
			model.Update(ctx, map[string]any{"id": retained.ID}, map[string]any{
				"sort":   retained.Sort,
				"status": retained.Status,
			})
			migration.targetIDs[row.ID] = retained.ID
			migrateWebContentTargetReferences(ctx, row.ID, retained.ID)
			model.Delete(ctx, map[string]any{"id": row.ID})
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"power_id": migration.retainedPowerID,
		})
		migration.targetIDs[row.ID] = row.ID
		retainedByService[row.ServiceID] = row
	}
}

func migrateWebContentTargetReferences(ctx context.Context, from uint64, to uint64) {
	if from == 0 || to == 0 || from == to {
		return
	}
	energonmodel.NewLogModel().Update(ctx, map[string]any{"power_target_id": from}, map[string]any{"power_target_id": to})
	energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{"source_target_id": from}, map[string]any{"source_target_id": to})
	energonmodel.NewCostRecordModel().Update(ctx, map[string]any{"power_target_id": from}, map[string]any{"power_target_id": to})
	billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{"power_target_id": from}, map[string]any{"power_target_id": to})
}

func migrateWebContentPowerParams(ctx context.Context, migration webContentCatalogMigration) {
	migrateWebContentServiceParams(ctx, migration.paramID, migration.legacyParamIDs)
	migrateWebContentEndpointParams(ctx, migration.paramID, migration.legacyParamIDs)
	migrateWebContentAgentParams(ctx, migration.paramID, migration.legacyParamIDs)
	migrateWebContentParamOptions(ctx, migration.paramID, migration.legacyParamIDs)

	model := energonmodel.NewPowerParamModel()
	for _, row := range model.Select(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"order": "main.id asc",
	}) {
		paramID := migratedWebContentParamID(row.ParamID, migration.paramID, migration.legacyParamIDs)
		existing := model.Find(ctx, map[string]any{
			"power_id": migration.retainedPowerID,
			"param_id": paramID,
		})
		if existing != nil && existing.ID != row.ID {
			model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
				"show":   requiredPowerParamShow(existing.Show, row.Show),
				"status": requiredPowerParamStatus(existing.Status, row.Status),
				"sort":   smallerInt(existing.Sort, row.Sort),
			})
			model.Delete(ctx, map[string]any{"id": row.ID})
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"power_id": migration.retainedPowerID,
			"param_id": paramID,
		})
	}
	if shared := model.Find(ctx, map[string]any{
		"power_id": migration.retainedPowerID,
		"param_id": migration.paramID,
	}); shared != nil {
		model.Update(ctx, map[string]any{"id": shared.ID}, map[string]any{
			"show":   energonmodel.PowerParamShowAlways,
			"status": int16(1),
			"sort":   10,
		})
	}
}

func migrateWebContentAgentParams(ctx context.Context, retainedID uint64, legacyIDs []uint64) {
	model := agentmodel.NewAgentParamModel()
	for _, legacyID := range legacyIDs {
		for _, row := range model.Select(ctx, map[string]any{"param_id": legacyID}) {
			existing := model.Find(ctx, map[string]any{
				"agent_id": row.AgentID,
				"param_id": retainedID,
			})
			if existing != nil && existing.ID != row.ID {
				model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
					"required": requiredPowerParamStatus(existing.Required, row.Required),
					"sort":     smallerInt(existing.Sort, row.Sort),
				})
				model.Delete(ctx, map[string]any{"id": row.ID})
				continue
			}
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"param_id": retainedID})
		}
	}
}

func migrateWebContentParamOptions(ctx context.Context, retainedID uint64, legacyIDs []uint64) {
	model := energonmodel.NewParamOptionModel()
	for _, legacyID := range legacyIDs {
		for _, row := range model.Select(ctx, map[string]any{"param_id": legacyID}) {
			existing := model.Find(ctx, map[string]any{
				"param_id": retainedID,
				"value":    row.Value,
			})
			if existing != nil && existing.ID != row.ID {
				model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
					"sort": smallerInt(existing.Sort, row.Sort),
				})
				model.Delete(ctx, map[string]any{"id": row.ID})
				continue
			}
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"param_id": retainedID})
		}
	}
}

func migrateWebContentServiceParams(ctx context.Context, retainedID uint64, legacyIDs []uint64) {
	model := energonmodel.NewServiceParamModel()
	for _, legacyID := range legacyIDs {
		for _, row := range model.Select(ctx, map[string]any{"param_id": legacyID}) {
			existing := model.Find(ctx, map[string]any{
				"service_id": row.ServiceID,
				"param_id":   retainedID,
				"key":        row.Key,
			})
			if existing != nil && existing.ID != row.ID {
				model.Delete(ctx, map[string]any{"id": row.ID})
				continue
			}
			values := map[string]any{"param_id": retainedID}
			if row.Key == "source" {
				values["name"] = botwebcontent.InputParamName
			}
			model.Update(ctx, map[string]any{"id": row.ID}, values)
		}
		model.Update(ctx, map[string]any{"active_when_param_id": legacyID}, map[string]any{
			"active_when_param_id": retainedID,
		})
	}
	model.Update(ctx, map[string]any{"param_id": retainedID, "key": "source"}, map[string]any{
		"name": botwebcontent.InputParamName,
	})
}

func migrateWebContentEndpointParams(ctx context.Context, retainedID uint64, legacyIDs []uint64) {
	model := energonmodel.NewServiceEndpointModel()
	for _, row := range model.Select(ctx, map[string]any{}) {
		paramIDs := row.ParamIds
		changed := false
		for _, legacyID := range legacyIDs {
			var currentChanged bool
			paramIDs, currentChanged = replaceEndpointParamID(paramIDs, legacyID, retainedID)
			changed = changed || currentChanged
		}
		if changed {
			model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"param_ids": paramIDs})
		}
	}
}

func migratedWebContentParamID(current uint64, retained uint64, legacy []uint64) uint64 {
	for _, legacyID := range legacy {
		if current == legacyID {
			return retained
		}
	}
	return current
}

func migrateWebContentTeamPowers(ctx context.Context, migration *webContentCatalogMigration) {
	model := teammodel.NewTeamPowerModel()
	rows := model.Select(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"order": "main.team_id asc,main.sort asc,main.id asc",
	})
	byTeam := map[uint64][]*teammodel.TeamPower{}
	for _, row := range rows {
		byTeam[row.TeamID] = append(byTeam[row.TeamID], row)
	}
	for _, bindings := range byTeam {
		retained := preferredWebContentTeamPower(bindings, migration.retainedPowerID)
		values := mergedWebContentTeamPowerValues(bindings, migration.retainedPowerID)
		model.Update(ctx, map[string]any{"id": retained.ID}, values)
		for _, row := range bindings {
			migration.teamPowerIDs[row.ID] = retained.ID
			if row.ID == retained.ID {
				continue
			}
			workspacemodel.NewPowerHistoryModel().Update(ctx, map[string]any{"team_power_id": row.ID}, map[string]any{
				"team_power_id": retained.ID,
			})
			model.Delete(ctx, map[string]any{"id": row.ID})
		}
	}
}

func preferredWebContentTeamPower(rows []*teammodel.TeamPower, retainedPowerID uint64) *teammodel.TeamPower {
	for _, row := range rows {
		if row.PowerID == retainedPowerID {
			return row
		}
	}
	return rows[0]
}

func mergedWebContentTeamPowerValues(rows []*teammodel.TeamPower, retainedPowerID uint64) map[string]any {
	retained := preferredWebContentTeamPower(rows, retainedPowerID)
	status := retained.Status
	homeStatus := retained.HomeStatus
	createStatus := retained.CreateStatus
	sort := retained.Sort
	for _, row := range rows {
		status = enabledStatus(status, row.Status)
		homeStatus = enabledStatus(homeStatus, row.HomeStatus)
		createStatus = enabledStatus(createStatus, row.CreateStatus)
		sort = smallerInt(sort, row.Sort)
	}
	return map[string]any{
		"power_id":      retainedPowerID,
		"status":        status,
		"home_status":   homeStatus,
		"create_status": createStatus,
		"sort":          sort,
	}
}

func migrateWebContentDirectReferences(ctx context.Context, migration webContentCatalogMigration) {
	powerValues := map[string]any{
		"power_id":   migration.retainedPowerID,
		"power_key":  botwebcontent.PowerKey,
		"power_name": botwebcontent.PowerName,
	}
	energonmodel.NewLogModel().Update(ctx, map[string]any{"power_id": migration.powerIDs}, powerValues)
	energonmodel.NewCostRecordModel().Update(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"power_id":   migration.retainedPowerID,
		"power_name": botwebcontent.PowerName,
	})
	billingmodel.NewPowerChargeModel().Update(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"power_id":   migration.retainedPowerID,
		"power_name": botwebcontent.PowerName,
	})
	energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"power_id":  migration.retainedPowerID,
		"power_key": botwebcontent.PowerKey,
	})
	for _, legacyKey := range botwebcontent.LegacyPowerKeys() {
		energonmodel.NewLogModel().Update(ctx, map[string]any{"power_key": legacyKey}, map[string]any{
			"power_key":  botwebcontent.PowerKey,
			"power_name": botwebcontent.PowerName,
		})
		energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{"power_key": legacyKey}, map[string]any{
			"power_key": botwebcontent.PowerKey,
		})
	}

	teammodel.NewFlowNodeModel().Update(ctx, map[string]any{"power_id": migration.powerIDs}, map[string]any{
		"power_id": migration.retainedPowerID,
	})
	agentmodel.NewAgentModel().Update(ctx, map[string]any{"llm_power_id": migration.powerIDs}, map[string]any{
		"llm_power_id": migration.retainedPowerID,
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"index_power_id": migration.powerIDs}, map[string]any{
		"index_power_id": migration.retainedPowerID,
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"embedding_power_id": migration.powerIDs}, map[string]any{
		"embedding_power_id": migration.retainedPowerID,
	})
}

func smallerInt(left int, right int) int {
	if right < left {
		return right
	}
	return left
}

func enabledStatus(left int16, right int16) int16 {
	if left == 1 || right == 1 {
		return 1
	}
	return left
}

func requiredPowerParamShow(left int16, right int16) int16 {
	if left == energonmodel.PowerParamShowAlways || right == energonmodel.PowerParamShowAlways {
		return energonmodel.PowerParamShowAlways
	}
	return left
}

func requiredPowerParamStatus(left int16, right int16) int16 {
	if left == 1 || right == 1 {
		return 1
	}
	return left
}
