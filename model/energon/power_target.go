package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type PowerTarget struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:能力来源ID"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type PowerTargetIndex struct {
	PowerService struct{} `unique:"power_id,service_id"`
	PowerStatus  struct{} `index:"power_id,status,sort"`
}

var (
	powerTargetSeed = []map[string]any{
		{
			"id":         20,
			"power_id":   DefaultLLMPowerID,
			"service_id": serviceShemicLabGPT54ID,
			"sort":       1,
			"status":     1,
		},
		{
			"id":         10,
			"power_id":   DefaultLLMPowerID,
			"service_id": serviceShemicLabGPTID,
			"sort":       2,
			"status":     1,
		},
		{
			"id":         2,
			"power_id":   DefaultLLMPowerID,
			"service_id": serviceDoubaoTextID,
			"sort":       3,
			"status":     1,
		},
		{"id": 23, "power_id": defaultImagePowerID, "service_id": serviceDoubaoImage5ID, "sort": 1, "status": 1},
		{"id": 4, "power_id": defaultImagePowerID, "service_id": serviceDoubaoImageID, "sort": 2, "status": 1},
		{"id": 6, "power_id": defaultImagePowerID, "service_id": serviceShemicLabImageID, "sort": 3, "status": 1},
		{"id": 7, "power_id": defaultVideoPowerID, "service_id": serviceDoubaoVideoID, "sort": 1, "status": 1},
		{"id": 28, "power_id": defaultVideoPowerID, "service_id": serviceRunningHubVideoID, "sort": 2, "status": 1},
		{"id": 21, "power_id": defaultVideoPowerID, "service_id": serviceDoubaoVideoFastID, "sort": 3, "status": 1},
		{"id": 8, "power_id": defaultClothingPowerID, "service_id": serviceRunningHubFlowClothingID, "sort": 1, "status": 1},
		{"id": 9, "power_id": defaultMusicPowerID, "service_id": serviceRunningHubMusicID, "sort": 1, "status": 1},
		{"id": 17, "power_id": defaultStoryboardPowerID, "service_id": serviceShemicLabGPT54ID, "sort": 1, "status": 1},
		{"id": 18, "power_id": defaultVideoComposePowerID, "service_id": serviceFFmpegComposeID, "sort": 1, "status": 1},
		{"id": 19, "power_id": defaultSpeechPowerID, "service_id": serviceDoubaoAudioID, "sort": 1, "status": 1},
		{"id": 22, "power_id": defaultCopywritingPowerID, "service_id": serviceShemicLabGPT54ID, "sort": 1, "status": 1},
		{"id": 24, "power_id": defaultCopywritingPowerID, "service_id": serviceShemicLabGPTID, "sort": 2, "status": 1},
		{"id": 25, "power_id": defaultCopywritingPowerID, "service_id": serviceDoubaoTextID, "sort": 3, "status": 1},
		{"id": 27, "power_id": defaultCopywritingPowerID, "service_id": serviceDoubaoGLMID, "sort": 5, "status": 1},
		{"id": 29, "power_id": defaultStoryboardGridPowerID, "service_id": serviceDoubaoImage5ID, "sort": 1, "status": 1},
		{"id": 30, "power_id": defaultStoryboardGridPowerID, "service_id": serviceDoubaoImageID, "sort": 2, "status": 1},
		{"id": 31, "power_id": defaultStoryboardGridPowerID, "service_id": serviceShemicLabImageID, "sort": 3, "status": 1},
		{"id": 32, "power_id": defaultVideoPowerID, "service_id": serviceRunningHubMiniMaxH3ID, "sort": 4, "status": 1},
	}

	powerTargetPowerRelation = orm.Relation{
		Field:      "power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key"},
	}

	powerTargetServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}
)

func NewPowerTargetModel() *orm.Model[PowerTarget] {
	return orm.LoadModel[PowerTarget]("能力来源", "bot_energon_power_target", orm.ModelConfig{
		Index:    PowerTargetIndex{},
		Seeds:    powerTargetSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			powerTargetPowerRelation,
			powerTargetServiceRelation,
		},
	})
}
