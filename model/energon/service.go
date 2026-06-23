package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Service struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:服务ID"`
	ProviderID uint64    `dorm:"type:bigint;not null;default:0;comment:来源"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type       string    `dorm:"type:varchar(64);not null;comment:类型"`
	Path       string    `dorm:"type:varchar(255);not null;default:'';comment:接口路径"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type ServiceIndex struct {
	ProviderStatus struct{} `index:"provider_id,status,sort"`
}

const (
	serviceShemicLabImageID         uint64 = 1
	serviceShemicLabGeminiID        uint64 = 2
	serviceShemicLabGPTID           uint64 = 3
	serviceDoubaoTextID             uint64 = 4
	serviceDoubaoImageID            uint64 = 5
	serviceDoubaoVideoID            uint64 = 6
	serviceRunningHubImageID        uint64 = 7
	serviceRunningHubMusicID        uint64 = 8
	serviceRunningHubFlowClothingID uint64 = 9
)

var (
	serviceSeed = []map[string]any{
		{
			"id":          serviceShemicLabImageID,
			"provider_id": providerShemicLabID,
			"name":        "image2生图",
			"type":        "image",
			"path":        "images/generations",
			"sort":        1,
			"status":      1,
		},
		{
			"id":          serviceShemicLabGeminiID,
			"provider_id": providerShemicLabID,
			"name":        "gemini-3-flash",
			"type":        "text",
			"path":        "",
			"sort":        2,
			"status":      1,
		},
		{
			"id":          serviceShemicLabGPTID,
			"provider_id": providerShemicLabID,
			"name":        "gpt-5.5",
			"type":        "text",
			"path":        "",
			"sort":        3,
			"status":      1,
		},
		{
			"id":          serviceDoubaoTextID,
			"provider_id": providerDoubaoID,
			"name":        "doubao-seed-2-0-pro",
			"type":        "text",
			"path":        "",
			"sort":        10,
			"status":      1,
		},
		{
			"id":          serviceDoubaoImageID,
			"provider_id": providerDoubaoID,
			"name":        "doubao-seedream-4-5",
			"type":        "image",
			"path":        "",
			"sort":        11,
			"status":      1,
		},
		{
			"id":          serviceDoubaoVideoID,
			"provider_id": providerDoubaoID,
			"name":        "doubao-seedance-1-5-pro",
			"type":        "video",
			"path":        "/contents/generations/tasks",
			"sort":        12,
			"status":      1,
		},
		{
			"id":          serviceRunningHubImageID,
			"provider_id": providerRunningHubAPIID,
			"name":        "生图",
			"type":        "text",
			"path":        "",
			"sort":        20,
			"status":      1,
		},
		{
			"id":          serviceRunningHubMusicID,
			"provider_id": providerRunningHubAPIID,
			"name":        "生成歌曲",
			"type":        "audio",
			"path":        "",
			"sort":        21,
			"status":      1,
		},
		{
			"id":          serviceRunningHubFlowClothingID,
			"provider_id": providerRunningHubFlowID,
			"name":        "换装",
			"type":        "image",
			"path":        "",
			"sort":        30,
			"status":      1,
		},
	}

	serviceProviderRelation = orm.Relation{
		Field:      "provider_id",
		Option:     "bot.energon.NewProviderModel",
		OptionKeys: []string{"name", "host"},
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
			"type":   kindOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			serviceProviderRelation,
			serviceEndpointRelation,
			serviceParamRelation,
			serviceRuntimeStatRelation,
		},
	})
}
