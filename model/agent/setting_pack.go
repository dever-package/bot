package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultSettingPackID uint64 = 1
)

type SettingPack struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:方案ID"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Description string    `dorm:"type:text;not null;default:'';comment:描述"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type SettingPackIndex struct {
	Name       struct{} `unique:"name"`
	StatusSort struct{} `index:"status,sort"`
}

var (
	settingPackSeed = []map[string]any{
		{
			"id":          DefaultSettingPackID,
			"name":        "默认通用协议",
			"description": "默认加载的智能体通用设定方案。",
			"status":      1,
			"sort":        1,
		},
	}

	settingPackItemRelation = orm.Relation{
		Field:      "items",
		Through:    "bot.agent.NewSettingPackItemModel",
		OwnerField: "pack_id",
		Order:      "sort asc, id asc",
	}
)

func NewSettingPackModel() *orm.Model[SettingPack] {
	return orm.LoadModel[SettingPack]("方案", "bot_setting_pack", orm.ModelConfig{
		Index:    SettingPackIndex{},
		Seeds:    settingPackSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			settingPackItemRelation,
		},
	})
}
