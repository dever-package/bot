package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultContentCategoryID uint64 = 1

type ContentCategory struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:内容分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:分类名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type ContentCategoryIndex struct {
	StatusSort struct{} `index:"status,sort,id"`
}

var contentCategorySeed = []map[string]any{
	{"id": DefaultContentCategoryID, "name": "默认分类", "status": StatusEnabled, "sort": 100},
}

func contentCategoryRelation(field string, name string) orm.Relation {
	return orm.Relation{
		Field:      field,
		Name:       name,
		Option:     "bot.body.NewContentCategoryModel",
		OptionKeys: []string{"name"},
	}
}

func NewContentCategoryModel() *orm.Model[ContentCategory] {
	return orm.LoadModel[ContentCategory]("内容分类", "bot_body_content_category", orm.ModelConfig{
		Index:    ContentCategoryIndex{},
		Seeds:    contentCategorySeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
