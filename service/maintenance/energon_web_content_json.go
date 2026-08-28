package maintenance

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/shemic/dever/util"

	energonmodel "github.com/dever-package/bot/model/energon"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

const webContentJSONMigrationBatchSize = 500

type webContentJSONModel interface {
	SelectMap(context.Context, any, ...map[string]any) []map[string]any
	Update(context.Context, any, map[string]any, ...bool) int64
}

type webContentReferenceMap struct {
	powerIDs     map[uint64]uint64
	powerKeys    map[string]string
	paramKeys    map[string]string
	targetIDs    map[uint64]uint64
	teamPowerIDs map[uint64]uint64
}

func migrateWebContentJSONReferences(ctx context.Context, migration webContentCatalogMigration) {
	references := newWebContentReferenceMap(migration)
	migrateWebContentJSONField(ctx, teammodel.NewTeamPowerModel(), "config", references)
	migrateWebContentJSONField(ctx, teammodel.NewTeamModel(), "config", references)
	migrateWebContentJSONField(ctx, teammodel.NewRoleModel(), "config", references)
	migrateWebContentJSONField(ctx, teammodel.NewFlowModel(), "config", references)
	migrateWebContentJSONField(ctx, teammodel.NewFlowNodeModel(), "config", references)
	migrateWebContentJSONField(ctx, teammodel.NewTeamReleaseModel(), "snapshot", references)
	migrateWebContentTeamRunInputs(ctx, migration, references)
	migrateWebContentJSONField(ctx, projectmodel.NewCanvasModel(), "nodes", references)
	migrateWebContentJSONFieldWhere(ctx, energonmodel.NewPowerRunHistoryModel(), "input", map[string]any{
		"power_id": migration.retainedPowerID,
	}, references)
	migrateWebContentJSONFieldWhere(ctx, energonmodel.NewLogModel(), "power_params", map[string]any{
		"power_id": migration.retainedPowerID,
	}, references)
}

func newWebContentReferenceMap(migration webContentCatalogMigration) webContentReferenceMap {
	powerIDs := make(map[uint64]uint64, len(migration.powerIDs))
	for _, powerID := range migration.powerIDs {
		powerIDs[powerID] = migration.retainedPowerID
	}
	powerKeys := map[string]string{botwebcontent.PowerKey: botwebcontent.PowerKey}
	for _, key := range botwebcontent.LegacyPowerKeys() {
		powerKeys[key] = botwebcontent.PowerKey
	}
	return webContentReferenceMap{
		powerIDs:  powerIDs,
		powerKeys: powerKeys,
		paramKeys: map[string]string{
			botwebcontent.LegacyDouyinInputParamKey: botwebcontent.InputParamKey,
		},
		targetIDs:    migration.targetIDs,
		teamPowerIDs: migration.teamPowerIDs,
	}
}

func migrateWebContentJSONField(
	ctx context.Context,
	model webContentJSONModel,
	field string,
	references webContentReferenceMap,
) {
	migrateWebContentJSONFieldWhere(ctx, model, field, map[string]any{}, references)
}

func migrateWebContentJSONFieldWhere(
	ctx context.Context,
	model webContentJSONModel,
	field string,
	filter map[string]any,
	references webContentReferenceMap,
) {
	for page := 1; ; page++ {
		rows := model.SelectMap(ctx, filter, map[string]any{
			"field":    "main.id,main." + field,
			"order":    "main.id asc",
			"page":     page,
			"pageSize": webContentJSONMigrationBatchSize,
		})
		for _, row := range rows {
			raw := util.ToStringTrimmed(row[field])
			updated, changed := rewriteWebContentJSON(raw, references)
			if !changed {
				continue
			}
			model.Update(ctx, map[string]any{"id": util.ToUint64(row["id"])}, map[string]any{
				field: updated,
			})
		}
		if len(rows) < webContentJSONMigrationBatchSize {
			break
		}
	}
}

func migrateWebContentTeamRunInputs(
	ctx context.Context,
	migration webContentCatalogMigration,
	references webContentReferenceMap,
) {
	teamPowerIDs := retainedWebContentTeamPowerIDs(migration.teamPowerIDs)
	if len(teamPowerIDs) == 0 {
		return
	}
	historyModel := workspacemodel.NewPowerHistoryModel()
	for page := 1; ; page++ {
		rows := historyModel.SelectMap(ctx, map[string]any{"team_power_id": teamPowerIDs}, map[string]any{
			"field":    "main.run_id",
			"order":    "main.id asc",
			"page":     page,
			"pageSize": webContentJSONMigrationBatchSize,
		})
		runIDs := make([]uint64, 0, len(rows))
		for _, row := range rows {
			if runID := util.ToUint64(row["run_id"]); runID > 0 {
				runIDs = append(runIDs, runID)
			}
		}
		if len(runIDs) > 0 {
			migrateWebContentJSONFieldWhere(ctx, teammodel.NewRunModel(), "input", map[string]any{
				"id": runIDs,
			}, references)
		}
		if len(rows) < webContentJSONMigrationBatchSize {
			break
		}
	}
}

func retainedWebContentTeamPowerIDs(replacements map[uint64]uint64) []uint64 {
	seen := make(map[uint64]struct{}, len(replacements))
	result := make([]uint64, 0, len(replacements))
	for _, retainedID := range replacements {
		if retainedID == 0 {
			continue
		}
		if _, exists := seen[retainedID]; exists {
			continue
		}
		seen[retainedID] = struct{}{}
		result = append(result, retainedID)
	}
	return result
}

func rewriteWebContentJSON(raw string, references webContentReferenceMap) (string, bool) {
	if raw == "" || !json.Valid([]byte(raw)) {
		return raw, false
	}
	var value any
	decoder := json.NewDecoder(strings.NewReader(raw))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil {
		return raw, false
	}
	if !rewriteWebContentJSONValue(value, references) {
		return raw, false
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return raw, false
	}
	return string(encoded), true
}

func rewriteWebContentJSONValue(value any, references webContentReferenceMap) bool {
	changed := false
	switch current := value.(type) {
	case map[string]any:
		changed = rewriteWebContentJSONParamObjectKeys(current, references.paramKeys) || changed
		for key, child := range current {
			switch {
			case isWebContentPowerIDKey(key):
				changed = replaceWebContentJSONID(current, key, child, references.powerIDs) || changed
			case isWebContentTargetIDsKey(key):
				changed = replaceWebContentJSONIDs(current, key, child, references.targetIDs) || changed
			case isWebContentTargetIDKey(key):
				changed = replaceWebContentJSONID(current, key, child, references.targetIDs) || changed
			case isWebContentTeamPowerIDKey(key):
				changed = replaceWebContentJSONID(current, key, child, references.teamPowerIDs) || changed
			case isWebContentPowerKey(key):
				changed = replaceWebContentJSONPowerKey(current, key, child, references.powerKeys) || changed
			case isWebContentParamKeyValueKey(key):
				changed = replaceWebContentJSONParamKey(current, key, child, references.paramKeys) || changed
			case isWebContentParamKeyValuesKey(key):
				changed = replaceWebContentJSONParamKeys(current, key, child, references.paramKeys) || changed
			case key == "power":
				changed = rewriteWebContentPowerValue(current, key, child, references) || changed
			case key == "team_powers" || key == "teamPowers":
				changed = rewriteWebContentTeamPowerRows(current, key, child, references) || changed
			default:
				changed = rewriteWebContentJSONValue(child, references) || changed
			}
		}
	case []any:
		for _, child := range current {
			changed = rewriteWebContentJSONValue(child, references) || changed
		}
	}
	return changed
}

func rewriteWebContentJSONParamObjectKeys(current map[string]any, replacements map[string]string) bool {
	changed := false
	for legacyKey, replacement := range replacements {
		value, exists := current[legacyKey]
		if !exists || replacement == "" || replacement == legacyKey {
			continue
		}
		if _, retained := current[replacement]; !retained {
			current[replacement] = value
		}
		delete(current, legacyKey)
		changed = true
	}
	return changed
}

func replaceWebContentJSONParamKey(
	parent map[string]any,
	key string,
	value any,
	replacements map[string]string,
) bool {
	current, ok := value.(string)
	if !ok {
		return false
	}
	replacement, exists := replacements[strings.TrimSpace(current)]
	if !exists || replacement == current {
		return false
	}
	parent[key] = replacement
	return true
}

func replaceWebContentJSONParamKeys(
	parent map[string]any,
	key string,
	value any,
	replacements map[string]string,
) bool {
	values, ok := value.([]any)
	if !ok {
		return false
	}
	changed := false
	seen := map[string]struct{}{}
	result := make([]any, 0, len(values))
	for _, rawValue := range values {
		current, isString := rawValue.(string)
		if !isString {
			result = append(result, rawValue)
			continue
		}
		replacement := replacements[strings.TrimSpace(current)]
		if replacement == "" {
			replacement = current
		}
		if replacement != current {
			changed = true
		}
		if _, duplicate := seen[replacement]; duplicate {
			changed = true
			continue
		}
		seen[replacement] = struct{}{}
		result = append(result, replacement)
	}
	if changed {
		parent[key] = result
	}
	return changed
}

func rewriteWebContentPowerValue(
	parent map[string]any,
	key string,
	value any,
	references webContentReferenceMap,
) bool {
	if powerKey, ok := value.(string); ok {
		return replaceWebContentJSONPowerKey(parent, key, powerKey, references.powerKeys)
	}
	power, ok := value.(map[string]any)
	if !ok {
		return rewriteWebContentJSONValue(value, references)
	}
	changed := replaceWebContentJSONID(power, "id", power["id"], references.powerIDs)
	changed = replaceWebContentJSONPowerKey(power, "key", power["key"], references.powerKeys) || changed
	changed = rewriteWebContentJSONValue(power, references) || changed
	return changed
}

func rewriteWebContentTeamPowerRows(
	parent map[string]any,
	key string,
	value any,
	references webContentReferenceMap,
) bool {
	rows, ok := value.([]any)
	if !ok {
		return rewriteWebContentJSONValue(value, references)
	}
	changed := false
	type retainedRow struct {
		index              int
		fromRetainedRecord bool
	}
	retainedByID := map[uint64]retainedRow{}
	result := make([]any, 0, len(rows))
	for _, rawRow := range rows {
		row, isRow := rawRow.(map[string]any)
		if !isRow {
			changed = rewriteWebContentJSONValue(rawRow, references) || changed
			result = append(result, rawRow)
			continue
		}
		originalID := webContentJSONID(row["id"])
		changed = replaceWebContentJSONID(row, "id", row["id"], references.teamPowerIDs) || changed
		changed = rewriteWebContentJSONValue(row, references) || changed
		id := webContentJSONID(row["id"])
		if id > 0 {
			if retained, duplicate := retainedByID[id]; duplicate {
				existing := result[retained.index].(map[string]any)
				fromRetainedRecord := originalID == id
				if fromRetainedRecord && !retained.fromRetainedRecord {
					mergeWebContentTeamPowerSnapshotRow(row, existing)
					result[retained.index] = row
					retained.fromRetainedRecord = true
					retainedByID[id] = retained
				} else {
					mergeWebContentTeamPowerSnapshotRow(existing, row)
				}
				changed = true
				continue
			}
			retainedByID[id] = retainedRow{
				index:              len(result),
				fromRetainedRecord: originalID == id,
			}
		}
		result = append(result, row)
	}
	if changed {
		parent[key] = result
	}
	return changed
}

func mergeWebContentTeamPowerSnapshotRow(retained map[string]any, incoming map[string]any) {
	mergeWebContentEnabledSnapshotField(retained, incoming, "status")
	mergeWebContentEnabledSnapshotField(retained, incoming, "home_status", "homeStatus")
	mergeWebContentEnabledSnapshotField(retained, incoming, "create_status", "createStatus")
	mergeWebContentMinimumSnapshotField(retained, incoming, "sort")
}

func mergeWebContentEnabledSnapshotField(retained map[string]any, incoming map[string]any, keys ...string) {
	retainedKey, retainedValue, retainedExists := firstWebContentSnapshotField(retained, keys...)
	incomingKey, incomingValue, incomingExists := firstWebContentSnapshotField(incoming, keys...)
	if !incomingExists {
		return
	}
	if !retainedExists {
		retained[incomingKey] = incomingValue
		return
	}
	if webContentJSONID(retainedValue) != 1 && webContentJSONID(incomingValue) == 1 {
		retained[retainedKey] = incomingValue
	}
}

func mergeWebContentMinimumSnapshotField(retained map[string]any, incoming map[string]any, keys ...string) {
	retainedKey, retainedValue, retainedExists := firstWebContentSnapshotField(retained, keys...)
	incomingKey, incomingValue, incomingExists := firstWebContentSnapshotField(incoming, keys...)
	if !incomingExists {
		return
	}
	if !retainedExists {
		retained[incomingKey] = incomingValue
		return
	}
	if webContentJSONID(incomingValue) < webContentJSONID(retainedValue) {
		retained[retainedKey] = incomingValue
	}
}

func firstWebContentSnapshotField(row map[string]any, keys ...string) (string, any, bool) {
	for _, key := range keys {
		value, exists := row[key]
		if exists {
			return key, value, true
		}
	}
	return "", nil, false
}

func replaceWebContentJSONID(parent map[string]any, key string, value any, replacements map[uint64]uint64) bool {
	current := webContentJSONID(value)
	replacement, exists := replacements[current]
	if !exists || replacement == 0 || replacement == current {
		return false
	}
	parent[key] = replacement
	return true
}

func replaceWebContentJSONIDs(parent map[string]any, key string, value any, replacements map[uint64]uint64) bool {
	values, ok := value.([]any)
	if !ok {
		return false
	}
	changed := false
	seen := map[uint64]struct{}{}
	result := make([]any, 0, len(values))
	for _, value := range values {
		current := webContentJSONID(value)
		replacement, exists := replacements[current]
		if !exists || replacement == 0 {
			result = append(result, value)
			continue
		}
		if replacement != current {
			changed = true
		}
		if _, duplicate := seen[replacement]; duplicate {
			changed = true
			continue
		}
		seen[replacement] = struct{}{}
		result = append(result, replacement)
	}
	if changed {
		parent[key] = result
	}
	return changed
}

func replaceWebContentJSONPowerKey(
	parent map[string]any,
	key string,
	value any,
	replacements map[string]string,
) bool {
	current, ok := value.(string)
	if !ok {
		return false
	}
	replacement, exists := replacements[strings.TrimSpace(current)]
	if !exists || replacement == current {
		return false
	}
	parent[key] = replacement
	return true
}

func webContentJSONID(value any) uint64 {
	switch current := value.(type) {
	case float64:
		if current > 0 {
			return uint64(current)
		}
	case json.Number:
		id, _ := current.Int64()
		if id > 0 {
			return uint64(id)
		}
	case string:
		return util.ToUint64(current)
	case uint64:
		return current
	case int:
		if current > 0 {
			return uint64(current)
		}
	}
	return 0
}

func isWebContentPowerIDKey(key string) bool {
	return key == "power_id" || key == "powerId"
}

func isWebContentTargetIDKey(key string) bool {
	return key == "source_target_id" || key == "sourceTargetId" ||
		key == "power_target_id" || key == "powerTargetId" || key == "_source_target_id"
}

func isWebContentTargetIDsKey(key string) bool {
	return key == "allowed_source_target_ids" || key == "allowedSourceTargetIds"
}

func isWebContentTeamPowerIDKey(key string) bool {
	return key == "team_power_id" || key == "teamPowerId" || key == "_team_power_id"
}

func isWebContentPowerKey(key string) bool {
	return key == "power_key" || key == "powerKey"
}

func isWebContentParamKeyValueKey(key string) bool {
	return key == "param_key" || key == "paramKey" ||
		key == "primary_param_key" || key == "primaryParamKey" ||
		key == "input_key" || key == "inputKey" ||
		key == "source_key" || key == "sourceKey"
}

func isWebContentParamKeyValuesKey(key string) bool {
	return key == "input_keys" || key == "inputKeys"
}
