package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ServiceEndpoint struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:服务接口ID"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	Api       string    `dorm:"type:varchar(255);not null;comment:接口标识"`
	ParamMode string    `dorm:"type:varchar(16);not null;default:all;comment:参数要求"`
	ParamIds  string    `dorm:"type:text;not null;comment:关联参数"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ServiceEndpointIndex struct {
	ServiceApi    struct{} `unique:"service_id,api"`
	ServiceStatus struct{} `index:"service_id,status,sort"`
}

var (
	serviceEndpointSeed = []map[string]any{
		{
			"id":         1,
			"service_id": serviceShemicLabImageID,
			"api":        "gpt-image-2",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         2,
			"service_id": serviceShemicLabGeminiID,
			"api":        "gemini-3-flash",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         3,
			"service_id": serviceShemicLabGPTID,
			"api":        "gpt-5.5",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         4,
			"service_id": serviceDoubaoTextID,
			"api":        "doubao-seed-2-0-pro-260215",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         5,
			"service_id": serviceDoubaoImageID,
			"api":        "doubao-seedream-4-5-251128",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         6,
			"service_id": serviceDoubaoVideoID,
			"api":        "doubao-seedance-1-5-pro-251215",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         7,
			"service_id": serviceRunningHubImageID,
			"api":        "rhart-image-n-g31-flash/text-to-image",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         8,
			"service_id": serviceRunningHubImageID,
			"api":        "rhart-image-n-g31-flash/image-to-image",
			"param_mode": "any",
			"param_ids":  `[{"param_id":2,"sort":1}]`,
			"status":     1,
			"sort":       2,
		},
		{
			"id":         9,
			"service_id": serviceRunningHubMusicID,
			"api":        "rhart-audio/suno-v5.5/single",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         10,
			"service_id": serviceRunningHubFlowClothingID,
			"api":        "2042521978606723074",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
	}

	serviceEndpointParamModeOptions = []map[string]any{
		{"id": "all", "value": "全部参数满足"},
		{"id": "any", "value": "任一参数满足"},
	}

	serviceEndpointServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}
)

func NewServiceEndpointModel() *orm.Model[ServiceEndpoint] {
	return orm.LoadModel[ServiceEndpoint]("服务接口", "bot_energon_service_endpoint", orm.ModelConfig{
		Index:    ServiceEndpointIndex{},
		Seeds:    serviceEndpointSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"param_mode": serviceEndpointParamModeOptions,
			"status":     statusOptions,
		},
		Relations: []orm.Relation{
			serviceEndpointServiceRelation,
		},
	})
}
