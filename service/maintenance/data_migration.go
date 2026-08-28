package maintenance

import (
	"context"
	"fmt"
	"time"

	maintenancemodel "github.com/dever-package/bot/model/maintenance"
	"github.com/dever-package/bot/service/agent/knowledge"
	"github.com/dever-package/bot/service/internal/dbop"
	frontcron "github.com/dever-package/front/service/cron"
)

type dataMigrationSpec struct {
	key       string
	run       func(context.Context) error
	onApplied func()
}

var botDataMigrations = []dataMigrationSpec{
	{key: "energon.provider-protocol-option.v1", run: MigrateProviderProtocolOption},
	{key: "energon.prompt-param.v1", run: EnsureEnergonPromptParam},
	{key: "energon.image-params.v1", run: EnsureEnergonImageParams},
	{key: "energon.image2-size.v1", run: EnsureEnergonImage2SizeMapping},
	{key: "energon.seedream-size.v1", run: EnsureEnergonSeedreamSizeMapping},
	{key: "energon.video-reference-params.v1", run: EnsureEnergonVideoReferenceParams},
	{key: "energon.video-reference-params.v2", run: EnsureEnergonVideoReferenceParams},
	{key: "energon.video-duration-params.v1", run: EnsureEnergonVideoDurationParams},
	{key: "energon.voice-option-mappings.v1", run: EnsureEnergonVoiceOptionMappings},
	{key: "energon.video-compose.v1", run: EnsureEnergonVideoComposePower},
	{key: "energon.wechat-official-account-import.v2", run: MigrateEnergonWeChatPowerIdentity},
	{key: "energon.web-content-import.v3", run: MigrateEnergonWebContentCatalog},
	{key: "energon.storyboard-grid.v1", run: EnsureEnergonStoryboardGridPower},
	{key: "energon.log-attribution.v1", run: MigrateEnergonLogAttribution},
	{key: "asset.audio-covers.v1", run: MigrateLegacyAudioCovers},
	{key: "asset.generated-data-images.v1", run: MigrateLegacyGeneratedDataImages},
	{key: "asset.owner-user.v1", run: MigrateAssetOwners},
	{key: maintenancemodel.ProjectMultiCanvasMigrationKey, run: MigrateProjectMultiCanvas},
	{
		key:       "knowledge.concept-sources.v1",
		run:       knowledge.MigrateLegacyConceptSources,
		onApplied: knowledge.MarkLegacyConceptSourcesMigrated,
	},
}

func registerDataMigrations() {
	for _, spec := range botDataMigrations {
		current := spec
		frontcron.RegisterBootstrap(func(ctx context.Context) error {
			return applyDataMigration(ctx, current)
		})
	}
}

func applyDataMigration(ctx context.Context, spec dataMigrationSpec) error {
	ctx = normalizeContext(ctx)
	model := maintenancemodel.NewDataMigrationModel()
	if model.Find(ctx, map[string]any{"key": spec.key}) != nil {
		markDataMigrationApplied(spec)
		return nil
	}
	if err := spec.run(ctx); err != nil {
		return fmt.Errorf("执行数据迁移 %s 失败: %w", spec.key, err)
	}

	now := time.Now()
	id, insertErr := dbop.Insert(func() int64 {
		return model.Insert(ctx, map[string]any{
			"key":        spec.key,
			"applied_at": now,
			"created_at": now,
		})
	})
	if insertErr != nil || id == 0 {
		// Another instance may have completed the same idempotent migration.
		// Only accept the insert error when its durable ledger row now exists.
		if model.Find(ctx, map[string]any{"key": spec.key}) == nil {
			if insertErr != nil {
				return fmt.Errorf("记录数据迁移 %s 失败: %w", spec.key, insertErr)
			}
			return fmt.Errorf("记录数据迁移 %s 失败", spec.key)
		}
	}
	markDataMigrationApplied(spec)
	return nil
}

func markDataMigrationApplied(spec dataMigrationSpec) {
	if spec.onApplied != nil {
		spec.onApplied()
	}
}
