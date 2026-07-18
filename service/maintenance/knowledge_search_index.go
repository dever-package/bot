package maintenance

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
)

const (
	knowledgeSearchIndexProvider = "bot.maintenance.EnsureKnowledgeSearchIndexes"
	knowledgeSearchIndexName     = "知识库关键词索引维护"
)

var postgresIdentifierPattern = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*$`)

func init() {
	frontmodel.RegisterCronProvider(knowledgeSearchIndexProvider, knowledgeSearchIndexName)
	frontcron.RegisterProvider(knowledgeSearchIndexProvider, func(ctx context.Context, _ map[string]any) (any, error) {
		if err := EnsureKnowledgeSearchIndexes(ctx); err != nil {
			return nil, err
		}
		return map[string]any{"status": "success"}, nil
	})
	frontcron.RegisterBootstrap(EnsureKnowledgeSearchIndexes)
}

// EnsureKnowledgeSearchIndexes 安装关键词 LIKE 检索需要的 PostgreSQL 索引。
func EnsureKnowledgeSearchIndexes(ctx context.Context) error {
	ctx = normalizeContext(ctx)
	db, err := orm.Get("default")
	if err != nil {
		return err
	}
	if !isPostgresDriver(db.DriverName()) {
		return nil
	}
	tableName := agentmodel.NewKnowledgeNodeModel().Config().Table
	table, err := quotePostgresIdentifier(tableName)
	if err != nil {
		return err
	}
	if _, err := db.ExecContext(ctx, "CREATE EXTENSION IF NOT EXISTS pg_trgm"); err != nil {
		return fmt.Errorf("启用 pg_trgm 失败: %w", err)
	}
	for _, column := range []string{"search_text", "keywords"} {
		indexName, err := quotePostgresIdentifier("idx_" + tableName + "_" + column + "_trgm")
		if err != nil {
			return err
		}
		quotedColumn, err := quotePostgresIdentifier(column)
		if err != nil {
			return err
		}
		statement := fmt.Sprintf(
			"CREATE INDEX CONCURRENTLY IF NOT EXISTS %s ON %s USING gin (%s gin_trgm_ops)",
			indexName,
			table,
			quotedColumn,
		)
		if _, err := db.ExecContext(ctx, statement); err != nil {
			return fmt.Errorf("创建知识库关键词索引失败: %w", err)
		}
	}
	return nil
}

func isPostgresDriver(driver string) bool {
	driver = strings.ToLower(strings.TrimSpace(driver))
	return driver == "pgx" || driver == "postgres" || driver == "postgresql"
}

func quotePostgresIdentifier(value string) (string, error) {
	value = strings.Trim(strings.TrimSpace(value), `"`)
	if !postgresIdentifierPattern.MatchString(value) {
		return "", fmt.Errorf("非法 PostgreSQL 标识符: %s", value)
	}
	return `"` + value + `"`, nil
}
