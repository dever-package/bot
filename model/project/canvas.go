package project

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Canvas struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:画布ID"`
	ProjectID   uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	AssetCateID uint64    `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	Nodes       string    `dorm:"type:text;not null;default:'[]';comment:节点"`
	Edges       string    `dorm:"type:text;not null;default:'[]';comment:连线"`
	Viewport    string    `dorm:"type:text;not null;default:'{}';comment:视图"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
	UpdatedAt   time.Time `dorm:"comment:更新时间"`
}

type CanvasIndex struct {
	ProjectCate struct{} `unique:"project_id,asset_cate_id"`
}

var canvasProjectRelation = orm.Relation{
	Field:      "project_id",
	Option:     "bot.project.NewProjectModel",
	OptionKeys: []string{"name", "status"},
}

var canvasAssetCateRelation = orm.Relation{
	Field:      "asset_cate_id",
	Option:     "bot.team.NewAssetCateModel",
	OptionKeys: []string{"name", "kind", "cardinality"},
}

func NewCanvasModel() *orm.Model[Canvas] {
	return orm.LoadModel[Canvas]("项目画布", "bot_project_canvas", orm.ModelConfig{
		Index:    CanvasIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			canvasProjectRelation,
			canvasAssetCateRelation,
		},
	})
}
