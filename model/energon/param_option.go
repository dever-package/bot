package energon

import (
	"github.com/shemic/dever/orm"
)

type ParamOption struct {
	ID         uint64 `dorm:"primaryKey;autoIncrement;comment:参数选项ID"`
	ParamID    uint64 `dorm:"type:bigint;not null;default:0;comment:参数"`
	Name       string `dorm:"type:varchar(128);not null;comment:选项名"`
	Value      string `dorm:"type:varchar(255);not null;comment:选项值"`
	PreviewURL string `dorm:"type:text;not null;default:'';comment:预览地址"`
	Sort       int    `dorm:"type:int;not null;default:100;comment:排序"`
}

type ParamOptionIndex struct {
	ParamValue struct{} `unique:"param_id,value"`
	ParamSort  struct{} `index:"param_id,sort"`
}

const ParamOptionAspectRatioAutoID uint64 = 37

var (
	paramOptionSeed = []map[string]any{
		{"id": 1, "param_id": paramResolutionID, "name": "1k", "value": "1k", "sort": 1},
		{"id": 2, "param_id": paramResolutionID, "name": "2k", "value": "2k", "sort": 2},
		{"id": 3, "param_id": paramResolutionID, "name": "4k", "value": "4k", "sort": 3},
		{"id": ParamOptionAspectRatioAutoID, "param_id": paramAspectRatioID, "name": "自动", "value": "auto", "sort": 0},
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
		{"id": 36, "param_id": paramDurationID, "name": "4秒", "value": "4", "sort": 1},
		{"id": 14, "param_id": paramDurationID, "name": "5秒", "value": "5", "sort": 2},
		{"id": 15, "param_id": paramDurationID, "name": "6秒", "value": "6", "sort": 3},
		{"id": 16, "param_id": paramDurationID, "name": "7秒", "value": "7", "sort": 4},
		{"id": 17, "param_id": paramDurationID, "name": "8秒", "value": "8", "sort": 5},
		{"id": 18, "param_id": paramDurationID, "name": "9秒", "value": "9", "sort": 6},
		{"id": 19, "param_id": paramDurationID, "name": "10秒", "value": "10", "sort": 7},
		{"id": 20, "param_id": paramDurationID, "name": "11秒", "value": "11", "sort": 8},
		{"id": 22, "param_id": paramDurationID, "name": "12秒", "value": "12", "sort": 9},
		{"id": 23, "param_id": paramVoiceID, "name": "通用女声", "value": "zh_female_kefunvsheng_uranus_bigtts", "sort": 1},
		{"id": 24, "param_id": paramVoiceID, "name": "清新女声", "value": "zh_female_qingxinnvsheng_uranus_bigtts", "sort": 2},
		{"id": 25, "param_id": paramVoiceID, "name": "撒娇女声", "value": "zh_female_sajiaoxuemei_uranus_bigtts", "sort": 3},
		{"id": 26, "param_id": paramVoiceID, "name": "甜美女声", "value": "zh_female_tianmeitaozi_uranus_bigtts", "sort": 4},
		{"id": 27, "param_id": paramVoiceID, "name": "邻家女声", "value": "zh_female_linjianvhai_uranus_bigtts", "sort": 5},
		{"id": 28, "param_id": paramVoiceID, "name": "鸡汤女声", "value": "zh_female_jitangnv_uranus_bigtts", "sort": 6},
		{"id": 29, "param_id": paramVoiceID, "name": "魅力女声", "value": "zh_female_meilinvyou_uranus_bigtts", "sort": 7},
		{"id": 30, "param_id": paramVoiceID, "name": "温柔女声", "value": "zh_female_wenroumama_uranus_bigtts", "sort": 8},
		{"id": 31, "param_id": paramVoiceID, "name": "通用男声", "value": "zh_male_ruyaqingnian_uranus_bigtts", "sort": 9},
		{"id": 32, "param_id": paramVoiceID, "name": "温暖男声", "value": "zh_male_wennuanahu_uranus_bigtts", "sort": 10},
		{"id": 33, "param_id": paramVoiceID, "name": "活力男声", "value": "zh_male_huolixiaoge_uranus_bigtts", "sort": 11},
		{"id": 34, "param_id": paramVoiceID, "name": "磁性男声", "value": "zh_male_cixingjieshuonan_uranus_bigtts", "sort": 12},
		{"id": 35, "param_id": paramVoiceID, "name": "清爽男声", "value": "zh_male_qingshuangnanda_uranus_bigtts", "sort": 13},
		{"id": 1001, "param_id": ParamReferenceModeID, "name": "首尾帧", "value": ReferenceModeFrames, "sort": 1},
		{"id": 1002, "param_id": ParamReferenceModeID, "name": "参考素材", "value": ReferenceModeReferences, "sort": 2},
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
