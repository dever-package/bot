package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultSettingPackID      uint64 = 1
	AssistantSettingPackID    uint64 = 2
	SkillInstallSettingPackID uint64 = 3
	SkillCreateSettingPackID  uint64 = 4
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
	StatusSort struct{} `index:"status,sort"`
}

var (
	settingPackSeed = []map[string]any{
		{
			"id":          DefaultSettingPackID,
			"name":        "默认规则",
			"description": "默认加载的智能体规则。",
			"status":      1,
			"sort":        1,
		},
		{
			"id":          AssistantSettingPackID,
			"name":        "后台助理规则",
			"description": "后台 AI 助理专用规则，用于理解当前后台页面并返回受控前端动作。",
			"status":      1,
			"sort":        2,
		},
		{
			"id":          SkillInstallSettingPackID,
			"name":        "技能安装规则",
			"description": "系统内置技能安装规划器专用规则，只生成受控安装计划。",
			"status":      1,
			"sort":        3,
		},
		{
			"id":          SkillCreateSettingPackID,
			"name":        "技能创建规则",
			"description": "系统内置技能创建工程师专用规则，只生成受控技能草稿 patch。",
			"status":      1,
			"sort":        4,
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
