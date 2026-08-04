package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Service struct {
	ID                  uint64    `dorm:"primaryKey;autoIncrement;comment:服务ID"`
	ProviderID          uint64    `dorm:"type:bigint;not null;default:0;comment:来源"`
	AccountID           uint64    `dorm:"type:bigint;not null;default:0;comment:鉴权账号"`
	Name                string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type                string    `dorm:"type:varchar(64);not null;comment:类型"`
	ImageOutputMode     string    `dorm:"type:varchar(32);not null;default:'single';comment:图片输出模式"`
	MaxImagesPerRequest int       `dorm:"type:int;not null;default:0;comment:单次最多图片数"`
	ContextWindowTokens int       `dorm:"type:int;not null;default:0;comment:上下文窗口Token数"`
	MaxOutputTokens     int       `dorm:"type:int;not null;default:0;comment:单次最大输出Token数"`
	Path                string    `dorm:"type:varchar(255);not null;default:'';comment:接口路径"`
	Sort                int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status              int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt           time.Time `dorm:"comment:创建时间"`
}

const (
	ImageOutputModeSingle = "single"
	ImageOutputModeGroup  = "group"
)

type ServiceIndex struct {
	ProviderStatus struct{} `index:"provider_id,status,sort"`
	AccountStatus  struct{} `index:"account_id,status"`
}

const (
	serviceRunningHubImageID        uint64 = 4
	serviceRunningHubMusicID        uint64 = 5
	serviceRunningHubFlowClothingID uint64 = 6
	serviceShemicLabImageID         uint64 = 7
	serviceDoubaoTextID             uint64 = 8
	serviceDoubaoImageID            uint64 = 9
	serviceDoubaoVideoID            uint64 = 10
	serviceShemicLabGeminiID        uint64 = 11
	serviceShemicLabGPTID           uint64 = 12
	serviceShemicLabGPT54ID         uint64 = 15
	serviceFFmpegComposeID          uint64 = 18
	serviceDoubaoAudioID            uint64 = 19
	serviceDoubaoVideoFastID        uint64 = 20
	serviceDoubaoImage5ID           uint64 = 21
	serviceDoubaoGLMID              uint64 = 22
	serviceRunningHubVideoID        uint64 = 23

	ServiceDoubaoVideoID     = serviceDoubaoVideoID
	ServiceDoubaoVideoFastID = serviceDoubaoVideoFastID
	ServiceRunningHubVideoID = serviceRunningHubVideoID
)

var (
	serviceSeed = []map[string]any{
		{
			"id":          serviceRunningHubImageID,
			"provider_id": providerRunningHubAPIID,
			"account_id":  0,
			"name":        "生图",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceRunningHubMusicID,
			"provider_id": providerRunningHubAPIID,
			"account_id":  0,
			"name":        "生成歌曲",
			"type":        "audio",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":                     serviceRunningHubFlowClothingID,
			"provider_id":            providerRunningHubFlowID,
			"account_id":             0,
			"name":                   "换装",
			"type":                   "image",
			"image_output_mode":      ImageOutputModeSingle,
			"max_images_per_request": 0,
			"path":                   "",
			"sort":                   100,
			"status":                 1,
		},
		{
			"id":                     serviceShemicLabImageID,
			"provider_id":            providerShemicLabID,
			"account_id":             0,
			"name":                   "image2生图",
			"type":                   "image",
			"image_output_mode":      ImageOutputModeSingle,
			"max_images_per_request": 0,
			"path":                   "images/generations",
			"sort":                   100,
			"status":                 1,
		},
		{
			"id":          serviceDoubaoTextID,
			"provider_id": providerDoubaoID,
			"account_id":  0,
			"name":        "seed-2-0-pro",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":                     serviceDoubaoImageID,
			"provider_id":            providerDoubaoID,
			"account_id":             0,
			"name":                   "seedream-4-5",
			"type":                   "image",
			"image_output_mode":      ImageOutputModeSingle,
			"max_images_per_request": 0,
			"path":                   "",
			"sort":                   100,
			"status":                 1,
		},
		{
			"id":          serviceDoubaoVideoID,
			"provider_id": providerDoubaoID,
			"account_id":  0,
			"name":        "seedance-1-5-pro",
			"type":        "video",
			"path":        "/contents/generations/tasks",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceShemicLabGeminiID,
			"provider_id": providerShemicLabID,
			"account_id":  0,
			"name":        "gemini-3-flash",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceShemicLabGPTID,
			"provider_id": providerShemicLabID,
			"account_id":  0,
			"name":        "gpt-5.5",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceShemicLabGPT54ID,
			"provider_id": providerShemicLabID,
			"account_id":  0,
			"name":        "gpt-5.4",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceFFmpegComposeID,
			"provider_id": providerVideoProcessorID,
			"account_id":  0,
			"name":        "FFmpeg 视频合成",
			"type":        "video",
			"path":        "local://ffmpeg/compose",
			"sort":        10,
			"status":      1,
		},
		{
			"id":          serviceDoubaoAudioID,
			"provider_id": providerDoubaoID,
			"account_id":  0,
			"name":        "音频",
			"type":        "audio",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceDoubaoVideoFastID,
			"provider_id": providerDoubaoID,
			"account_id":  0,
			"name":        "doubao-seedance-2-0-fast",
			"type":        "video",
			"path":        "/contents/generations/tasks",
			"sort":        100,
			"status":      1,
		},
		{
			"id":                     serviceDoubaoImage5ID,
			"provider_id":            providerDoubaoID,
			"account_id":             0,
			"name":                   "seedream-5",
			"type":                   "image",
			"image_output_mode":      ImageOutputModeSingle,
			"max_images_per_request": 0,
			"path":                   "",
			"sort":                   100,
			"status":                 1,
		},
		{
			"id":          serviceDoubaoGLMID,
			"provider_id": providerDoubaoID,
			"account_id":  0,
			"name":        "glm-5.2",
			"type":        "text",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
		{
			"id":          serviceRunningHubVideoID,
			"provider_id": providerRunningHubAPIID,
			"account_id":  0,
			"name":        "可灵图生视频2.6-pro",
			"type":        "video",
			"path":        "",
			"sort":        100,
			"status":      1,
		},
	}

	serviceProviderRelation = orm.Relation{
		Field:      "provider_id",
		Option:     "bot.energon.NewProviderModel",
		OptionKeys: []string{"name", "host", "protocol", "processor"},
	}

	serviceAccountRelation = orm.Relation{
		Field:      "account_id",
		Option:     "bot.energon.NewAccountModel",
		OptionKeys: []string{"name", "provider_id", "scope", "status"},
	}

	serviceParamRelation = orm.Relation{
		Field:      "params",
		Through:    "bot.energon.NewServiceParamModel",
		OwnerField: "service_id",
		Order:      "sort asc, id asc",
	}

	serviceEndpointRelation = orm.Relation{
		Field:      "endpoints",
		Through:    "bot.energon.NewServiceEndpointModel",
		OwnerField: "service_id",
		Order:      "sort asc, id asc",
	}

	serviceRuntimeStatRelation = orm.Relation{
		Field:      "runtime_stats",
		Through:    "bot.energon.NewServiceRuntimeStatModel",
		OwnerField: "service_id",
		Order:      "id desc",
	}
)

func NewServiceModel() *orm.Model[Service] {
	return orm.LoadModel[Service]("来源服务", "bot_energon_service", orm.ModelConfig{
		Index:    ServiceIndex{},
		Seeds:    serviceSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type": kindOptions,
			"image_output_mode": []map[string]any{
				{"id": ImageOutputModeSingle, "value": "单图"},
				{"id": ImageOutputModeGroup, "value": "组图"},
			},
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			serviceProviderRelation,
			serviceAccountRelation,
			serviceEndpointRelation,
			serviceParamRelation,
			serviceRuntimeStatRelation,
		},
	})
}
