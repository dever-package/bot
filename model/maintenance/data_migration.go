package maintenance

import (
	"time"

	"github.com/shemic/dever/orm"
)

const ProjectMultiCanvasMigrationKey = "project.multi-canvas.v1"

type DataMigration struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:数据迁移ID"`
	Key       string    `dorm:"type:varchar(160);not null;default:'';comment:迁移标识"`
	AppliedAt time.Time `dorm:"comment:完成时间"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type DataMigrationIndex struct {
	Key struct{} `unique:"key"`
}

func NewDataMigrationModel() *orm.Model[DataMigration] {
	return orm.LoadModel[DataMigration]("Bot 数据迁移", "bot_data_migration", orm.ModelConfig{
		Index:    DataMigrationIndex{},
		Order:    "id desc",
		Database: "default",
	})
}
