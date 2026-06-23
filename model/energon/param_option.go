package energon

import (
	"github.com/shemic/dever/orm"
)

type ParamOption struct {
	ID      uint64 `dorm:"primaryKey;autoIncrement;comment:参数选项ID"`
	ParamID uint64 `dorm:"type:bigint;not null;default:0;comment:参数"`
	Name    string `dorm:"type:varchar(128);not null;comment:选项名"`
	Value   string `dorm:"type:varchar(255);not null;comment:选项值"`
	Sort    int    `dorm:"type:int;not null;default:100;comment:排序"`
}

type ParamOptionIndex struct {
	ParamValue struct{} `unique:"param_id,value"`
	ParamSort  struct{} `index:"param_id,sort"`
}

var (
	paramOptionSeed = []map[string]any{
		{"id": 1, "param_id": paramResolutionID, "name": "1k", "value": "1k", "sort": 1},
		{"id": 2, "param_id": paramResolutionID, "name": "2k", "value": "2k", "sort": 2},
		{"id": 3, "param_id": paramResolutionID, "name": "4k", "value": "4k", "sort": 3},
		{"id": 4, "param_id": paramAspectRatioID, "name": "1:1", "value": "1:1", "sort": 1},
		{"id": 5, "param_id": paramAspectRatioID, "name": "16:9", "value": "16:9", "sort": 2},
		{"id": 6, "param_id": paramAspectRatioID, "name": "9:16", "value": "9:16", "sort": 3},
		{"id": 7, "param_id": paramAspectRatioID, "name": "4:3", "value": "4:3", "sort": 4},
		{"id": 8, "param_id": paramAspectRatioID, "name": "3:4", "value": "3:4", "sort": 5},
		{"id": 9, "param_id": paramAspectRatioID, "name": "3:2", "value": "3:2", "sort": 6},
		{"id": 10, "param_id": paramAspectRatioID, "name": "2:3", "value": "2:3", "sort": 7},
		{"id": 11, "param_id": paramAspectRatioID, "name": "5:4", "value": "5:4", "sort": 8},
		{"id": 12, "param_id": paramAspectRatioID, "name": "4:5", "value": "4:5", "sort": 9},
		{"id": 13, "param_id": paramAspectRatioID, "name": "21:9", "value": "21:9", "sort": 10},
	}

	paramOptionParamRelation = orm.Relation{
		Field:      "param_id",
		Option:     "bot.energon.NewParamModel",
		OptionKeys: []string{"name", "key"},
	}
)

func NewParamOptionModel() *orm.Model[ParamOption] {
	return orm.LoadModel[ParamOption]("参数选项", "bot_energon_param_option", orm.ModelConfig{
		Index:     ParamOptionIndex{},
		Seeds:     paramOptionSeed,
		Order:     "sort asc,id asc",
		Database:  "default",
		Relations: []orm.Relation{paramOptionParamRelation},
	})
}
