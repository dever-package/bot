package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Provider struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:来源ID"`
	CateID    uint64    `dorm:"type:bigint;not null;default:1;comment:来源分类"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Protocol  string    `dorm:"type:varchar(32);not null;comment:协议"`
	Host      string    `dorm:"type:varchar(255);not null;comment:主机域名"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ProviderIndex struct {
	CateStatus   struct{} `index:"cate_id,status"`
	CateProtocol struct{} `index:"cate_id,protocol,status"`
}

const (
	providerShemicLabID      uint64 = 1
	providerDoubaoID         uint64 = 2
	providerRunningHubAPIID  uint64 = 3
	providerRunningHubFlowID uint64 = 4
	providerShemicLabHost           = "http://t.s.dever.cc:8080/v1"
	providerDoubaoHost              = "https://ark.cn-beijing.volces.com/api/v3/"
	providerRunningHubHost          = "https://www.runninghub.cn/openapi/v2/"
)

var (
	providerSeed = []map[string]any{
		{
			"id":       providerShemicLabID,
			"cate_id":  defaultProviderCateID,
			"name":     "神秘城实验室",
			"protocol": "openai",
			"host":     providerShemicLabHost,
			"status":   1,
		},
		{
			"id":       providerDoubaoID,
			"cate_id":  defaultProviderCateID,
			"name":     "火山",
			"protocol": "doubao",
			"host":     providerDoubaoHost,
			"status":   1,
		},
		{
			"id":       providerRunningHubAPIID,
			"cate_id":  defaultProviderCateID,
			"name":     "runninghubapi",
			"protocol": "rhapi",
			"host":     providerRunningHubHost,
			"status":   1,
		},
		{
			"id":       providerRunningHubFlowID,
			"cate_id":  defaultProviderCateID,
			"name":     "runninghubflow",
			"protocol": "rhflow",
			"host":     providerRunningHubHost,
			"status":   1,
		},
	}

	statusOptions = []map[string]any{
		{"id": 1, "value": "开启"},
		{"id": 2, "value": "停用"},
	}

	protocolOptions = []map[string]any{
		{"id": "openai", "value": "OpenAI"},
		{"id": "doubao", "value": "豆包/火山方舟"},
		{"id": "rhapi", "value": "RunningHub API"},
		{"id": "rhflow", "value": "RunningHub 工作流"},
		{"id": "shemic", "value": "Shemic"},
	}

	providerCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.energon.NewProviderCateModel",
		OptionKeys: []string{"name"},
	}

	providerAccountRelation = orm.Relation{
		Field:      "accounts",
		Through:    "bot.energon.NewAccountModel",
		OwnerField: "provider_id",
		Order:      "sort asc, id asc",
	}

	providerServiceRelation = orm.Relation{
		Field:      "services",
		Through:    "bot.energon.NewServiceModel",
		OwnerField: "provider_id",
		Order:      "sort asc, id asc",
	}
)

func NewProviderModel() *orm.Model[Provider] {
	return orm.LoadModel[Provider]("来源", "bot_energon_provider", orm.ModelConfig{
		Index:    ProviderIndex{},
		Seeds:    providerSeed,
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"protocol": protocolOptions,
			"status":   statusOptions,
		},
		Relations: []orm.Relation{
			providerCateRelation,
			providerAccountRelation,
			providerServiceRelation,
		},
	})
}
