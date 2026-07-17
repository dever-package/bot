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
		{"id": 14, "param_id": paramDurationID, "name": "5秒", "value": "5", "sort": 1},
		{"id": 15, "param_id": paramDurationID, "name": "6秒", "value": "6", "sort": 2},
		{"id": 16, "param_id": paramDurationID, "name": "7秒", "value": "7", "sort": 3},
		{"id": 17, "param_id": paramDurationID, "name": "8秒", "value": "8", "sort": 4},
		{"id": 18, "param_id": paramDurationID, "name": "9秒", "value": "9", "sort": 5},
		{"id": 19, "param_id": paramDurationID, "name": "10秒", "value": "10", "sort": 6},
		{"id": 20, "param_id": paramDurationID, "name": "11秒", "value": "11", "sort": 7},
		{"id": 22, "param_id": paramDurationID, "name": "12秒", "value": "12", "sort": 8},
		{"id": 23, "param_id": paramFPSID, "name": "24 帧/秒", "value": "24", "sort": 1},
		{"id": 24, "param_id": paramFPSID, "name": "25 帧/秒", "value": "25", "sort": 2},
		{"id": 25, "param_id": paramFPSID, "name": "30 帧/秒", "value": "30", "sort": 3},
		{"id": 26, "param_id": paramFPSID, "name": "50 帧/秒", "value": "50", "sort": 4},
		{"id": 27, "param_id": paramFPSID, "name": "60 帧/秒", "value": "60", "sort": 5},
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
