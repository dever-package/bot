package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type SettingPackItem struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:规则列表ID"`
	PackID    uint64    `dorm:"type:bigint;not null;default:0;comment:方案"`
	SettingID uint64    `dorm:"type:bigint;not null;default:0;comment:规则"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SettingPackItemIndex struct {
	PackSetting struct{} `unique:"pack_id,setting_id"`
	PackStatus  struct{} `index:"pack_id,status,sort"`
}

var (
	settingPackItemSeed = []map[string]any{
		{"id": 1, "pack_id": DefaultSettingPackID, "setting_id": 1, "status": 1, "sort": 10},
		{"id": 2, "pack_id": DefaultSettingPackID, "setting_id": 7, "status": 1, "sort": 20},
		{"id": 3, "pack_id": DefaultSettingPackID, "setting_id": 2, "status": 1, "sort": 30},
		{"id": 4, "pack_id": DefaultSettingPackID, "setting_id": 4, "status": 1, "sort": 40},
		{"id": 102, "pack_id": AssistantSettingPackID, "setting_id": 4, "status": 1, "sort": 5},
		{"id": 101, "pack_id": AssistantSettingPackID, "setting_id": AssistantWorkSettingID, "status": 1, "sort": 10},
	}

	settingPackRelation = orm.Relation{
		Field:      "pack_id",
		Option:     "bot.agent.NewSettingPackModel",
		OptionKeys: []string{"name"},
	}

	packItemSettingRelation = orm.Relation{
		Field:      "setting_id",
		Option:     "bot.agent.NewSettingModel",
		OptionKeys: []string{"name", "cate_id", "load_mode"},
	}
)

func NewSettingPackItemModel() *orm.Model[SettingPackItem] {
	return orm.LoadModel[SettingPackItem]("规则列表", "bot_setting_pack_item", orm.ModelConfig{
		Index:    SettingPackItemIndex{},
		Seeds:    settingPackItemSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			settingPackRelation,
			packItemSettingRelation,
		},
	})
}
