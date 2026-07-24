package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type PowerParam struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:能力参数ID"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	ParamID   uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	Show      int16     `dorm:"type:smallint;not null;default:1;comment:展示"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:必填"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type PowerParamIndex struct {
	PowerStatus struct{} `index:"power_id,status,sort"`
}

var (
	powerParamSeed = []map[string]any{
		{"id": 1, "power_id": DefaultLLMPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 2, "power_id": DefaultLLMPowerID, "param_id": ParamImageID, "show": 1, "status": 2, "sort": 2},
		{"id": 3, "power_id": defaultImagePowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 4, "power_id": defaultImagePowerID, "param_id": ParamImageID, "show": 1, "status": 2, "sort": 2},
		{"id": 5, "power_id": defaultImagePowerID, "param_id": paramResolutionID, "show": 1, "status": 1, "sort": 3},
		{"id": 6, "power_id": defaultImagePowerID, "param_id": paramAspectRatioID, "show": 1, "status": 1, "sort": 4},
		{"id": 7, "power_id": defaultVideoPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 8, "power_id": defaultVideoPowerID, "param_id": ParamImageID, "show": 1, "status": 2, "sort": 2},
		{"id": 27, "power_id": defaultVideoPowerID, "param_id": paramVideoID, "show": 2, "status": 2, "sort": 3},
		{"id": 28, "power_id": defaultVideoPowerID, "param_id": paramAudioID, "show": 2, "status": 2, "sort": 4},
		{"id": 15, "power_id": defaultVideoPowerID, "param_id": paramResolutionID, "show": 1, "status": 1, "sort": 5},
		{"id": 16, "power_id": defaultVideoPowerID, "param_id": paramAspectRatioID, "show": 1, "status": 1, "sort": 6},
		{"id": 18, "power_id": defaultVideoPowerID, "param_id": paramDurationID, "show": 1, "status": 1, "sort": 7},
		{"id": 9, "power_id": defaultClothingPowerID, "param_id": ParamImageID, "show": 1, "status": 1, "sort": 1},
		{"id": 10, "power_id": defaultClothingPowerID, "param_id": ParamImageID, "show": 1, "status": 1, "sort": 2},
		{"id": 11, "power_id": defaultMusicPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 12, "power_id": defaultMusicPowerID, "param_id": paramSwitchID, "show": 1, "status": 1, "sort": 2},
		{"id": 17, "power_id": defaultStoryboardPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 19, "power_id": defaultStoryboardPowerID, "param_id": ParamImageID, "show": 1, "status": 2, "sort": 2},
		{"id": 20, "power_id": defaultVideoComposePowerID, "param_id": paramVideosID, "show": 1, "status": 2, "sort": 1},
		{"id": 21, "power_id": defaultVideoComposePowerID, "param_id": paramAudioID, "show": 1, "status": 2, "sort": 2},
		{"id": 22, "power_id": defaultVideoComposePowerID, "param_id": paramSubtitlesID, "show": 1, "status": 2, "sort": 3},
		{"id": 23, "power_id": defaultVideoComposePowerID, "param_id": paramResolutionID, "show": 1, "status": 2, "sort": 4},
		{"id": 24, "power_id": defaultVideoComposePowerID, "param_id": paramFPSID, "show": 1, "status": 2, "sort": 5},
		{"id": 25, "power_id": defaultSpeechPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 26, "power_id": defaultSpeechPowerID, "param_id": paramVoiceID, "show": 1, "status": 1, "sort": 2},
		{"id": 29, "power_id": defaultCopywritingPowerID, "param_id": ParamPromptID, "show": 1, "status": 1, "sort": 1},
		{"id": 30, "power_id": defaultCopywritingPowerID, "param_id": ParamImageID, "show": 1, "status": 2, "sort": 2},
	}

	powerParamShowOptions = []map[string]any{
		{"id": 1, "value": "始终展示"},
		{"id": 2, "value": "按来源展示"},
	}

	powerParamRequiredOptions = []map[string]any{
		{"id": 1, "value": "必填"},
		{"id": 2, "value": "选填"},
	}

	powerParamPowerRelation = orm.Relation{
		Field:      "power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key"},
	}

	powerParamParamRelation = orm.Relation{
		Field:      "param_id",
		Option:     "bot.energon.NewParamModel",
		OptionKeys: []string{"name", "key", "type"},
	}
)

func NewPowerParamModel() *orm.Model[PowerParam] {
	return orm.LoadModel[PowerParam]("能力参数", "bot_energon_power_param", orm.ModelConfig{
		Index:    PowerParamIndex{},
		Seeds:    powerParamSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"show":   powerParamShowOptions,
			"status": powerParamRequiredOptions,
		},
		Relations: []orm.Relation{
			powerParamPowerRelation,
			powerParamParamRelation,
		},
	})
}
