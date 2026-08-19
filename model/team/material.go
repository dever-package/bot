package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Material struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:素材ID"`
	CateID      uint64    `dorm:"type:bigint;not null;default:1;comment:素材分类"`
	Kind        string    `dorm:"type:varchar(32);not null;default:'prompt';comment:素材类型"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Description string    `dorm:"type:varchar(512);not null;default:'';comment:描述"`
	Content     string    `dorm:"type:text;not null;default:'';comment:文本内容"`
	ResourceURL string    `dorm:"type:text;not null;default:'';comment:资源地址"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type MaterialIndex struct {
	KindStatus struct{} `index:"kind,status,sort,id"`
	CateStatus struct{} `index:"cate_id,status,sort,id"`
	StatusSort struct{} `index:"status,sort,id"`
}

var materialCateRelation = orm.Relation{
	Field:      "cate_id",
	Option:     "bot.team.NewMaterialCateModel",
	OptionKeys: []string{"name"},
}

func NewMaterialModel() *orm.Model[Material] {
	return orm.LoadModel[Material]("素材", "bot_material", orm.ModelConfig{
		Index:    MaterialIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"kind":   materialKindOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			materialCateRelation,
		},
	})
}
