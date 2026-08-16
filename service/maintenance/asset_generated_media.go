package maintenance

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	botenergon "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const legacyDataImageLikePattern = "%data:image/%"

type legacyDataImageMigrator struct {
	ctx       context.Context
	storedURL map[string]string
	nextIndex int
}

// MigrateLegacyGeneratedDataImages replaces persisted generated Data URLs with
// upload URLs while preserving the surrounding JSON document structure.
func MigrateLegacyGeneratedDataImages(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移历史生成图片失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	migrator := &legacyDataImageMigrator{
		ctx:       ctx,
		storedURL: map[string]string{},
	}
	if err := migrateLegacyAssetVersionImages(ctx, migrator); err != nil {
		return err
	}
	if err := migrateLegacyCanvasImages(ctx, migrator); err != nil {
		return err
	}
	if err := migrateLegacyTeamRunImages(ctx, migrator); err != nil {
		return err
	}
	if err := migrateLegacyNodeRunImages(ctx, migrator); err != nil {
		return err
	}
	return migrateLegacyNodeExecutionImages(ctx, migrator)
}

func migrateLegacyAssetVersionImages(ctx context.Context, migrator *legacyDataImageMigrator) error {
	model := assetmodel.NewVersionModel()
	return migrateLegacyDataImageRows(
		migrator,
		model.Select(ctx, map[string]any{"content": map[string]any{"like": legacyDataImageLikePattern}}),
		"asset-version",
		nil,
		func(row *assetmodel.Version) uint64 { return row.ID },
		func(row *assetmodel.Version) string { return row.Content },
		func(row *assetmodel.Version, content string) int64 {
			return model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"content": content})
		},
	)
}

func migrateLegacyCanvasImages(ctx context.Context, migrator *legacyDataImageMigrator) error {
	model := projectmodel.NewCanvasModel()
	return migrateLegacyDataImageRows(
		migrator,
		model.Select(ctx, map[string]any{"nodes": map[string]any{"like": legacyDataImageLikePattern}}),
		"canvas",
		cleanLegacyCanvasMediaDescriptions,
		func(row *projectmodel.Canvas) uint64 { return row.ID },
		func(row *projectmodel.Canvas) string { return row.Nodes },
		func(row *projectmodel.Canvas, nodes string) int64 {
			return model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"nodes": nodes})
		},
	)
}

func migrateLegacyTeamRunImages(ctx context.Context, migrator *legacyDataImageMigrator) error {
	model := teammodel.NewRunModel()
	return migrateLegacyDataImageRows(
		migrator,
		model.Select(ctx, map[string]any{"output": map[string]any{"like": legacyDataImageLikePattern}}),
		"team-run",
		nil,
		func(row *teammodel.Run) uint64 { return row.ID },
		func(row *teammodel.Run) string { return row.Output },
		func(row *teammodel.Run, output string) int64 {
			return model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"output": output})
		},
	)
}

func migrateLegacyNodeRunImages(ctx context.Context, migrator *legacyDataImageMigrator) error {
	model := teammodel.NewNodeRunModel()
	return migrateLegacyDataImageRows(
		migrator,
		model.Select(ctx, map[string]any{"output": map[string]any{"like": legacyDataImageLikePattern}}),
		"node-run",
		nil,
		func(row *teammodel.NodeRun) uint64 { return row.ID },
		func(row *teammodel.NodeRun) string { return row.Output },
		func(row *teammodel.NodeRun, output string) int64 {
			return model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"output": output})
		},
	)
}

func migrateLegacyNodeExecutionImages(ctx context.Context, migrator *legacyDataImageMigrator) error {
	model := workspacemodel.NewNodeExecutionModel()
	return migrateLegacyDataImageRows(
		migrator,
		model.Select(ctx, map[string]any{"output": map[string]any{"like": legacyDataImageLikePattern}}),
		"node-execution",
		nil,
		func(row *workspacemodel.NodeExecution) uint64 { return row.ID },
		func(row *workspacemodel.NodeExecution) string { return row.Output },
		func(row *workspacemodel.NodeExecution, output string) int64 {
			return model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"output": output})
		},
	)
}

func migrateLegacyDataImageRows[T any](
	migrator *legacyDataImageMigrator,
	rows []*T,
	recordKey string,
	normalize func(any) bool,
	recordID func(*T) uint64,
	rawJSON func(*T) string,
	update func(*T, string) int64,
) error {
	for _, row := range rows {
		if row == nil {
			continue
		}
		id := recordID(row)
		encoded, changed, err := migrator.migrateJSON(
			rawJSON(row),
			fmt.Sprintf("legacy-%s-%d", recordKey, id),
			normalize,
		)
		if err != nil {
			return fmt.Errorf("迁移 %s %d 失败: %w", recordKey, id, err)
		}
		if !changed {
			continue
		}
		if affected := update(row, encoded); affected != 1 {
			return fmt.Errorf("更新 %s %d 失败", recordKey, id)
		}
	}
	return nil
}

func (migrator *legacyDataImageMigrator) migrateJSON(
	raw string,
	requestID string,
	normalize func(any) bool,
) (string, bool, error) {
	if !strings.Contains(strings.ToLower(raw), "data:image/") {
		return raw, false, nil
	}
	var document any
	if err := json.Unmarshal([]byte(raw), &document); err != nil {
		return "", false, fmt.Errorf("解析 JSON 失败: %w", err)
	}
	migrated, changed, err := migrator.migrateValue(document, requestID)
	if err != nil {
		return raw, false, err
	}
	if normalize != nil && normalize(migrated) {
		changed = true
	}
	if !changed {
		return raw, changed, err
	}
	encoded, err := json.Marshal(migrated)
	if err != nil {
		return "", false, fmt.Errorf("编码 JSON 失败: %w", err)
	}
	return string(encoded), true, nil
}

func cleanLegacyCanvasMediaDescriptions(value any) bool {
	nodes, ok := value.([]any)
	if !ok {
		return false
	}
	changed := false
	for _, item := range nodes {
		node, ok := item.(map[string]any)
		if !ok || !canvasNodeHasStoredResult(node) {
			continue
		}
		description := strings.TrimSpace(botprotocol.AsText(node["description"]))
		if !botprotocol.IsMediaReferenceURL(description) {
			continue
		}
		node["description"] = "生成完成"
		changed = true
	}
	return changed
}

func canvasNodeHasStoredResult(node map[string]any) bool {
	if asset, ok := node["asset"].(map[string]any); ok {
		if id := strings.TrimSpace(botprotocol.AsText(asset["id"])); id != "" && id != "0" {
			return true
		}
	}
	for _, key := range []string{"result_ref", "result_output"} {
		if value, exists := node[key]; exists && value != nil {
			return true
		}
	}
	return false
}

func (migrator *legacyDataImageMigrator) migrateValue(value any, requestID string) (any, bool, error) {
	switch current := value.(type) {
	case map[string]any:
		changed := false
		for key, item := range current {
			migrated, itemChanged, err := migrator.migrateValue(item, requestID)
			if err != nil {
				return nil, false, err
			}
			if itemChanged {
				current[key] = migrated
				changed = true
			}
		}
		return current, changed, nil
	case []any:
		changed := false
		for index, item := range current {
			migrated, itemChanged, err := migrator.migrateValue(item, requestID)
			if err != nil {
				return nil, false, err
			}
			if itemChanged {
				current[index] = migrated
				changed = true
			}
		}
		return current, changed, nil
	case string:
		if !isLegacyDataImageReference(current) {
			return current, false, nil
		}
		storedURL, err := migrator.store(current, requestID)
		if err != nil {
			return nil, false, err
		}
		return storedURL, true, nil
	default:
		return current, false, nil
	}
}

func (migrator *legacyDataImageMigrator) store(source string, requestID string) (string, error) {
	source = strings.TrimSpace(source)
	if storedURL := migrator.storedURL[source]; storedURL != "" {
		return storedURL, nil
	}
	payload, err := botenergon.StoreGeneratedMediaReference(
		migrator.ctx,
		requestID,
		botprotocol.MediaTypeImage,
		source,
		migrator.nextIndex,
	)
	if err != nil {
		return "", err
	}
	migrator.nextIndex++
	storedURL := strings.TrimSpace(botprotocol.AsText(payload["url"]))
	if storedURL == "" || strings.HasPrefix(strings.ToLower(storedURL), "data:") {
		return "", fmt.Errorf("保存图片后未返回 URL")
	}
	migrator.storedURL[source] = storedURL
	return storedURL, nil
}

func isLegacyDataImageReference(value string) bool {
	value = strings.TrimSpace(value)
	header, _, found := strings.Cut(value, ",")
	if !found {
		return false
	}
	header = strings.ToLower(header)
	return strings.HasPrefix(header, "data:image/") && strings.Contains(header, ";base64")
}
