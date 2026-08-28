package project

import (
	"fmt"
	"time"

	"github.com/shemic/dever/orm"
)

const (
	CanvasStatusEnabled int16 = 1
	CanvasStatusDeleted int16 = 2
	CanvasDefaultName         = "第一幕"
)

func DefaultCanvasName(position int) string {
	names := []string{
		CanvasDefaultName,
		"第二幕",
		"第三幕",
		"第四幕",
		"第五幕",
		"第六幕",
		"第七幕",
		"第八幕",
		"第九幕",
		"第十幕",
	}
	if position > 0 && position <= len(names) {
		return names[position-1]
	}
	return fmt.Sprintf("第%d幕", position)
}

type Canvas struct {
	ID          uint64     `dorm:"primaryKey;autoIncrement;comment:画布ID"`
	ProjectID   uint64     `dorm:"type:bigint;not null;default:0;comment:项目"`
	AssetCateID uint64     `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	Name        string     `dorm:"type:varchar(128);not null;default:'';comment:名称"`
	Sort        int        `dorm:"type:int;not null;default:1;comment:排序"`
	Status      int16      `dorm:"type:smallint;not null;default:1;comment:状态"`
	NextNodeNo  int        `dorm:"type:int;not null;default:1;comment:下一个节点编号"`
	Nodes       string     `dorm:"type:text;not null;default:'[]';comment:节点"`
	Edges       string     `dorm:"type:text;not null;default:'[]';comment:连线"`
	Viewport    string     `dorm:"type:text;not null;default:'{}';comment:视图"`
	CreatedAt   time.Time  `dorm:"comment:创建时间"`
	UpdatedAt   time.Time  `dorm:"comment:更新时间"`
	DeletedAt   *time.Time `dorm:"type:timestamp;null;comment:删除时间"`
}

type CanvasIndex struct {
	ProjectScope struct{} `index:"project_id,asset_cate_id,status,sort,id"`
	ProjectTrash struct{} `index:"project_id,asset_cate_id,status,deleted_at,id"`
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
