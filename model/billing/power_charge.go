package billing

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ChargeRuleSystem   = "system"
	ChargeRuleIdentity = "identity"

	ChargeStatusPreparing    = "preparing"
	ChargeStatusRunning      = "running"
	ChargeStatusSettling     = "settling"
	ChargeStatusSettled      = "settled"
	ChargeStatusFree         = "free"
	ChargeStatusReleased     = "released"
	ChargeStatusPartial      = "partial"
	ChargeStatusPricingError = "pricing_error"
	ChargeStatusFailed       = "failed"

	ChargeFinishSuccess  = "success"
	ChargeFinishFailed   = "failed"
	ChargeFinishCanceled = "canceled"
)

type PowerCharge struct {
	ID          uint64 `dorm:"primaryKey;autoIncrement;comment:能力计费单ID"`
	BusinessKey string `dorm:"type:varchar(128);not null;comment:业务幂等键"`
	RequestID   string `dorm:"type:varchar(64);not null;default:'';comment:请求ID"`
	Scene       string `dorm:"type:varchar(32);not null;default:'system';comment:调用场景"`

	UserID    uint64 `dorm:"type:bigint;not null;default:0;comment:用户"`
	TeamID    uint64 `dorm:"type:bigint;not null;default:0;comment:团队"`
	ProjectID uint64 `dorm:"type:bigint;not null;default:0;comment:项目"`
	SessionID uint64 `dorm:"type:bigint;not null;default:0;comment:会话"`
	RunID     uint64 `dorm:"type:bigint;not null;default:0;comment:运行"`

	PowerID       uint64 `dorm:"type:bigint;not null;default:0;comment:能力"`
	PowerName     string `dorm:"type:varchar(128);not null;default:'';comment:能力名称"`
	PowerTargetID uint64 `dorm:"type:bigint;not null;default:0;comment:指定能力来源"`

	RuleSource       string `dorm:"type:varchar(16);not null;default:'system';comment:规则来源"`
	BillingBenefitID uint64 `dorm:"type:bigint;not null;default:0;comment:计费权益"`
	UserIdentityID   uint64 `dorm:"type:bigint;not null;default:0;comment:用户身份"`
	IdentityID       uint64 `dorm:"type:bigint;not null;default:0;comment:身份"`
	IdentityName     string `dorm:"type:varchar(64);not null;default:'';comment:身份名称"`
	LevelID          uint64 `dorm:"type:bigint;not null;default:0;comment:身份等级"`
	LevelName        string `dorm:"type:varchar(64);not null;default:'';comment:等级名称"`
	Level            int    `dorm:"type:int;not null;default:0;comment:等级数字"`
	Scope            string `dorm:"type:varchar(16);not null;default:'all';comment:适用范围"`

	PointConfigID        uint64 `dorm:"type:bigint;not null;default:1;comment:扣费积分"`
	PointName            string `dorm:"type:varchar(64);not null;default:'';comment:积分名称"`
	PointSymbol          string `dorm:"type:varchar(32);not null;default:'';comment:积分符号"`
	PointSymbolPosition  int16  `dorm:"type:smallint;not null;default:2;comment:符号位置"`
	PointExchangeRate    int    `dorm:"type:int;not null;default:0;comment:积分货币换算"`
	SaleRatio            string `dorm:"type:varchar(24);not null;default:'1';comment:售价系数"`
	SaleRatioBasisPoints int64  `dorm:"type:bigint;not null;default:10000;comment:售价系数万分比"`

	Currency            string     `dorm:"type:varchar(8);not null;default:'CNY';comment:结算币种"`
	ReservedCostMicros  int64      `dorm:"type:bigint;not null;default:0;comment:CNY预授权成本微单位"`
	ReservedPoints      int        `dorm:"type:int;not null;default:0;comment:预占积分"`
	PointHoldID         uint64     `dorm:"type:bigint;not null;default:0;comment:积分预占"`
	SuccessCostRecordID uint64     `dorm:"type:bigint;not null;default:0;comment:成功成本记录"`
	SuccessCostMicros   int64      `dorm:"type:bigint;not null;default:0;comment:CNY成功成本微单位"`
	TotalCostMicros     int64      `dorm:"type:bigint;not null;default:0;comment:CNY总尝试成本微单位"`
	SaleMicros          int64      `dorm:"type:bigint;not null;default:0;comment:CNY用户售价微单位"`
	ProfitMicros        int64      `dorm:"type:bigint;not null;default:0;comment:CNY利润微单位"`
	RequestedPoints     int        `dorm:"type:int;not null;default:0;comment:应扣积分"`
	SettledPoints       int        `dorm:"type:int;not null;default:0;comment:实扣积分"`
	UncollectedPoints   int        `dorm:"type:int;not null;default:0;comment:未收积分"`
	ConfigBreach        int16      `dorm:"type:smallint;not null;default:2;comment:是否超出预授权"`
	Status              string     `dorm:"type:varchar(24);not null;default:'preparing';comment:计费状态"`
	FinishStatus        string     `dorm:"type:varchar(16);not null;default:'';comment:完成意图"`
	FinishError         string     `dorm:"type:text;not null;default:'';comment:调用完成错误"`
	FinalizingAt        *time.Time `dorm:"null;comment:开始结算时间"`
	RuleSnapshot        string     `dorm:"type:text;not null;default:'{}';comment:规则快照"`
	Error               string     `dorm:"type:text;not null;default:'';comment:错误"`
	CreatedAt           time.Time  `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
	UpdatedAt           time.Time  `dorm:"not null;default:CURRENT_TIMESTAMP;comment:更新时间"`
}

type PowerChargeIndex struct {
	BusinessKey      struct{} `unique:"business_key"`
	RequestCreated   struct{} `index:"request_id,created_at,id"`
	UserCreated      struct{} `index:"user_id,created_at,id"`
	TeamCreated      struct{} `index:"team_id,created_at,id"`
	ProjectCreated   struct{} `index:"project_id,created_at,id"`
	PowerCreated     struct{} `index:"power_id,created_at,id"`
	PointHoldCreated struct{} `index:"point_hold_id,created_at,id"`
	StatusCreated    struct{} `index:"status,created_at,id"`
	CreatedAt        struct{} `index:"created_at"`
}

var (
	chargeRuleSourceOptions = []map[string]any{
		{"id": ChargeRuleSystem, "value": "系统默认"},
		{"id": ChargeRuleIdentity, "value": "身份权益"},
	}
	chargeStatusOptions = []map[string]any{
		{"id": ChargeStatusPreparing, "value": "准备中"},
		{"id": ChargeStatusRunning, "value": "运行中"},
		{"id": ChargeStatusSettling, "value": "结算中"},
		{"id": ChargeStatusSettled, "value": "已结算"},
		{"id": ChargeStatusFree, "value": "免费"},
		{"id": ChargeStatusReleased, "value": "已释放"},
		{"id": ChargeStatusPartial, "value": "部分结算"},
		{"id": ChargeStatusPricingError, "value": "计价异常"},
		{"id": ChargeStatusFailed, "value": "失败"},
	}
	chargeSceneOptions = []map[string]any{
		{"id": "body_tool", "value": "Body 工具"},
		{"id": "project_power", "value": "项目能力"},
		{"id": "agent_power", "value": "智能体能力"},
		{"id": "system", "value": "系统调用"},
	}
)

func NewPowerChargeModel() *orm.Model[PowerCharge] {
	return orm.LoadModel[PowerCharge]("能力计费单", "bot_billing_power_charge", orm.ModelConfig{
		Index:    PowerChargeIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"rule_source":   chargeRuleSourceOptions,
			"scene":         chargeSceneOptions,
			"status":        chargeStatusOptions,
			"config_breach": []map[string]any{{"id": 1, "value": "是"}, {"id": 2, "value": "否"}},
		},
	})
}
