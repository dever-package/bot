package energon

import (
	"fmt"
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

const (
	ServiceEndpointGPTImage2API = "gpt-image-2"

	serviceEndpointRunningHubImageTextID  uint64 = 4
	serviceEndpointRunningHubImageImageID uint64 = 5
	serviceEndpointRunningHubMusicID      uint64 = 6
	serviceEndpointRunningHubClothingID   uint64 = 7
	serviceEndpointShemicLabImageID       uint64 = 8
	serviceEndpointDoubaoTextID           uint64 = 9
	serviceEndpointDoubaoImageID          uint64 = 10
	serviceEndpointDoubaoVideoID          uint64 = 11
	serviceEndpointShemicLabGeminiID      uint64 = 12
	serviceEndpointShemicLabGPTID         uint64 = 13
	serviceEndpointShemicLabGPT54ID       uint64 = 18
	serviceEndpointFFmpegComposeID        uint64 = 21
	serviceEndpointDoubaoAudioID          uint64 = 22
	serviceEndpointDoubaoVideoFastID      uint64 = 23
	serviceEndpointDoubaoImage5ID         uint64 = 24
	serviceEndpointDoubaoGLMID            uint64 = 25
	serviceEndpointRunningHubVideoImageID uint64 = 26
	serviceEndpointRunningHubVideoTextID  uint64 = 27
)

var (
	serviceEndpointSeed = []map[string]any{
		{
			"id":         serviceEndpointRunningHubImageTextID,
			"service_id": serviceRunningHubImageID,
			"api":        "rhart-image-n-g31-flash/text-to-image",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointRunningHubImageImageID,
			"service_id": serviceRunningHubImageID,
			"api":        "rhart-image-n-g31-flash/image-to-image",
			"param_mode": "any",
			"param_ids":  fmt.Sprintf(`[{"param_id":%d,"sort":1}]`, ParamImagesID),
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointRunningHubMusicID,
			"service_id": serviceRunningHubMusicID,
			"api":        "rhart-audio/suno-v5.5/single",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointRunningHubClothingID,
			"service_id": serviceRunningHubFlowClothingID,
			"api":        "2042521978606723074",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointShemicLabImageID,
			"service_id": serviceShemicLabImageID,
			"api":        ServiceEndpointGPTImage2API,
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoTextID,
			"service_id": serviceDoubaoTextID,
			"api":        "doubao-seed-2-0-pro-260215",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoImageID,
			"service_id": serviceDoubaoImageID,
			"api":        "doubao-seedream-4-5-251128",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoVideoID,
			"service_id": serviceDoubaoVideoID,
			"api":        "doubao-seedance-1-5-pro-251215",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointShemicLabGeminiID,
			"service_id": serviceShemicLabGeminiID,
			"api":        "gemini-3-flash",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointShemicLabGPTID,
			"service_id": serviceShemicLabGPTID,
			"api":        "gpt-5.5",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointShemicLabGPT54ID,
			"service_id": serviceShemicLabGPT54ID,
			"api":        "gpt-5.4-mini",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointFFmpegComposeID,
			"service_id": serviceFFmpegComposeID,
			"api":        "compose",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       1,
		},
		{
			"id":         serviceEndpointDoubaoAudioID,
			"service_id": serviceDoubaoAudioID,
			"api":        "seed-tts-2.0",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoVideoFastID,
			"service_id": serviceDoubaoVideoFastID,
			"api":        "doubao-seedance-2-0-fast-260128",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoImage5ID,
			"service_id": serviceDoubaoImage5ID,
			"api":        "doubao-seedream-5.0-lite",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointDoubaoGLMID,
			"service_id": serviceDoubaoGLMID,
			"api":        "glm-5.2",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointRunningHubVideoImageID,
			"service_id": serviceRunningHubVideoID,
			"api":        "kling-v3.0-pro/image-to-video",
			"param_mode": "any",
			"param_ids":  fmt.Sprintf(`[{"param_id":%d,"sort":1}]`, ParamFirstFrameID),
			"status":     1,
			"sort":       100,
		},
		{
			"id":         serviceEndpointRunningHubVideoTextID,
			"service_id": serviceRunningHubVideoID,
			"api":        "kling-v3.0-pro/text-to-video",
			"param_mode": "all",
			"param_ids":  "[]",
			"status":     1,
			"sort":       100,
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

	serviceEndpointPriceRelation = orm.Relation{
		Field:      "prices",
		Through:    "bot.energon.NewServicePriceModel",
		OwnerField: "service_endpoint_id",
		Order:      "id asc",
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
			serviceEndpointPriceRelation,
		},
	})
}
