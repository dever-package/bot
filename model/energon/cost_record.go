package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	CostPricingPriced              = "priced"
	CostPricingMissingPrice        = "missing_price"
	CostPricingInvalidPrice        = "invalid_price"
	CostPricingMissingUsage        = "missing_usage"
	CostPricingMissingExchangeRate = "missing_exchange_rate"
)

type CostRecord struct {
	ID uint64 `dorm:"primaryKey;autoIncrement;comment:成本记录ID"`

	LogID         uint64 `dorm:"type:bigint;not null;default:0;comment:调用日志"`
	PowerChargeID uint64 `dorm:"type:bigint;not null;default:0;comment:能力计费单"`
	RequestID     string `dorm:"type:varchar(64);not null;comment:请求ID"`
	BusinessKey   string `dorm:"type:varchar(128);not null;default:'';comment:业务键"`
	Scene         string `dorm:"type:varchar(32);not null;default:'system';comment:调用场景"`
	Billable      int16  `dorm:"type:smallint;not null;default:2;comment:是否用户计费"`
	UserID        uint64 `dorm:"type:bigint;not null;default:0;comment:用户ID"`
	TeamID        uint64 `dorm:"type:bigint;not null;default:0;comment:团队ID"`
	ProjectID     uint64 `dorm:"type:bigint;not null;default:0;comment:项目ID"`
	SessionID     uint64 `dorm:"type:bigint;not null;default:0;comment:会话ID"`
	RunID         uint64 `dorm:"type:bigint;not null;default:0;comment:运行ID"`

	PowerID           uint64 `dorm:"type:bigint;not null;default:0;comment:能力ID"`
	PowerName         string `dorm:"type:varchar(128);not null;default:'';comment:能力名称"`
	PowerTargetID     uint64 `dorm:"type:bigint;not null;default:0;comment:能力来源ID"`
	ProviderID        uint64 `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	ProviderName      string `dorm:"type:varchar(128);not null;default:'';comment:来源名称"`
	AccountID         uint64 `dorm:"type:bigint;not null;default:0;comment:账号ID"`
	ServiceID         uint64 `dorm:"type:bigint;not null;default:0;comment:服务ID"`
	ServiceName       string `dorm:"type:varchar(128);not null;default:'';comment:服务名称"`
	ServiceEndpointID uint64 `dorm:"type:bigint;not null;default:0;comment:服务接口ID"`
	ServiceAPI        string `dorm:"type:varchar(255);not null;default:'';comment:服务接口标识"`
	ServicePriceID    uint64 `dorm:"type:bigint;not null;default:0;comment:服务价格ID"`

	CallStatus       string    `dorm:"type:varchar(32);not null;comment:调用状态"`
	PricingStatus    string    `dorm:"type:varchar(32);not null;comment:计价状态"`
	PricingMode      string    `dorm:"type:varchar(16);not null;default:'';comment:计价方式"`
	SourceCurrency   string    `dorm:"type:varchar(8);not null;default:'CNY';comment:原始成本币种"`
	SourceCostMicros int64     `dorm:"type:bigint;not null;default:0;comment:原始成本微单位"`
	ExchangeRate     string    `dorm:"type:varchar(24);not null;default:'1';comment:结算汇率快照"`
	Currency         string    `dorm:"type:varchar(8);not null;default:'CNY';comment:结算币种"`
	PromptTokens     int64     `dorm:"type:bigint;not null;default:0;comment:输入Token"`
	CompletionTokens int64     `dorm:"type:bigint;not null;default:0;comment:输出Token"`
	CachedTokens     int64     `dorm:"type:bigint;not null;default:0;comment:缓存Token"`
	CostMicros       int64     `dorm:"type:bigint;not null;default:0;comment:结算成本微单位"`
	PricingSnapshot  string    `dorm:"type:text;not null;default:'{}';comment:计价快照"`
	Error            string    `dorm:"type:text;not null;default:'';comment:计价错误"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type CostRecordIndex struct {
	Log             struct{} `unique:"log_id"`
	PowerCharge     struct{} `index:"power_charge_id,created_at,id"`
	RequestCreated  struct{} `index:"request_id,created_at,id"`
	BusinessCreated struct{} `index:"business_key,created_at,id"`
	UserCreated     struct{} `index:"user_id,created_at,id"`
	TeamCreated     struct{} `index:"team_id,created_at,id"`
	ProjectCreated  struct{} `index:"project_id,created_at,id"`
	PowerCreated    struct{} `index:"power_id,created_at,id"`
	EndpointCreated struct{} `index:"service_endpoint_id,created_at,id"`
	PricingCreated  struct{} `index:"pricing_status,created_at,id"`
	SceneCreated    struct{} `index:"scene,created_at,id"`
}

var (
	costPricingStatusOptions = []map[string]any{
		{"id": CostPricingPriced, "value": "已计价"},
		{"id": CostPricingMissingPrice, "value": "缺少价格"},
		{"id": CostPricingInvalidPrice, "value": "价格无效"},
		{"id": CostPricingMissingUsage, "value": "缺少用量"},
		{"id": CostPricingMissingExchangeRate, "value": "缺少结算汇率"},
	}

	costBillableOptions = []map[string]any{
		{"id": 1, "value": "计费"},
		{"id": 2, "value": "仅记成本"},
	}

	costSceneOptions = []map[string]any{
		{"id": "system", "value": "系统"},
		{"id": "body_tool", "value": "工具"},
		{"id": "project_power", "value": "项目能力"},
		{"id": "agent_power", "value": "智能体能力"},
	}
)

func NewCostRecordModel() *orm.Model[CostRecord] {
	return orm.LoadModel[CostRecord]("能力成本", "bot_energon_cost_record", orm.ModelConfig{
		Index:    CostRecordIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"billable":       costBillableOptions,
			"scene":          costSceneOptions,
			"call_status":    callStatusOptions,
			"pricing_status": costPricingStatusOptions,
			"pricing_mode":   servicePriceModeOptions,
		},
	})
}
