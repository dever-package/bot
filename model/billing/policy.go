package billing

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultPolicyID      uint64 = 1
	PolicyStatusEnabled         = 1
	PolicyStatusDisabled        = 2
	DefaultPointConfigID uint64 = 1
	DefaultSaleRatio            = "1"
	DefaultUSDToCNYRate         = "0"
)

type Policy struct {
	ID uint64 `dorm:"primaryKey;autoIncrement;comment:成本结算配置ID"`
	// 下面三个字段仅保留旧表结构和历史数据兼容，用户扣费规则统一来自身份计费权益。
	Status        int16     `dorm:"type:smallint;not null;default:2;comment:计费状态"`
	PointConfigID uint64    `dorm:"type:bigint;not null;default:1;comment:默认扣费积分"`
	SaleRatio     string    `dorm:"type:varchar(24);not null;default:'1';comment:默认售价系数"`
	USDToCNYRate  string    `dorm:"type:varchar(24);not null;default:'0';comment:美元兑人民币汇率"`
	CreatedAt     time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
	UpdatedAt     time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:更新时间"`
}

var (
	policyStatusOptions = []map[string]any{
		{"id": PolicyStatusEnabled, "value": "开启"},
		{"id": PolicyStatusDisabled, "value": "关闭"},
	}

	policyPointConfigRelation = orm.Relation{
		Field:      "point_config_id",
		Name:       "point_config",
		Option:     "user.NewPointConfigModel",
		OptionKeys: []string{"name", "exchange_rate", "symbol", "symbol_position"},
	}

	policySeed = []map[string]any{
		{
			"id":              DefaultPolicyID,
			"status":          PolicyStatusDisabled,
			"point_config_id": DefaultPointConfigID,
			"sale_ratio":      DefaultSaleRatio,
			"usd_to_cny_rate": DefaultUSDToCNYRate,
		},
	}
)

func NewPolicyModel() *orm.Model[Policy] {
	return orm.LoadModel[Policy]("能力成本结算", "bot_billing_policy", orm.ModelConfig{
		Seeds:    policySeed,
		Database: "default",
		Options: map[string]any{
			"status": policyStatusOptions,
		},
		Relations: []orm.Relation{
			policyPointConfigRelation,
		},
	})
}

// DefaultPolicy 返回旧版系统默认策略。
//
// Deprecated: 用户扣费规则不再使用系统默认策略，仅保留给已有调用方兼容。
func DefaultPolicy() Policy {
	return Policy{
		ID:            DefaultPolicyID,
		Status:        PolicyStatusDisabled,
		PointConfigID: DefaultPointConfigID,
		SaleRatio:     DefaultSaleRatio,
		USDToCNYRate:  DefaultUSDToCNYRate,
	}
}
