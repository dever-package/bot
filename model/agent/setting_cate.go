package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultSettingCateID uint64 = 1
)

type SettingCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:设定分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SettingCateIndex struct {
	Name       struct{} `unique:"name"`
	StatusSort struct{} `index:"status,sort"`
}

var settingCateSeed = []map[string]any{
	{"id": DefaultSettingCateID, "name": "默认", "status": 1, "sort": 1},
}

func NewSettingCateModel() *orm.Model[SettingCate] {
	return orm.LoadModel[SettingCate]("设定分类", "bot_setting_cate", orm.ModelConfig{
		Index:    SettingCateIndex{},
		Seeds:    settingCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
