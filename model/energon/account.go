package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	AccountScopeCommon    int16 = 1
	AccountScopeDedicated int16 = 2
)

type Account struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:账号ID"`
	ProviderID uint64    `dorm:"type:bigint;not null;default:0;comment:来源"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Scope      int16     `dorm:"type:smallint;not null;default:1;comment:账号范围"`
	Host       string    `dorm:"type:varchar(255);not null;default:'';comment:账号主机"`
	Key        string    `dorm:"type:varchar(128);not null;comment:密钥"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type AccountIndex struct {
	ProviderKey         struct{} `unique:"provider_id,key"`
	ProviderStatus      struct{} `index:"provider_id,status,sort"`
	ProviderScopeStatus struct{} `index:"provider_id,scope,status,sort"`
}

var (
	accountScopeOptions = []map[string]any{
		{"id": AccountScopeCommon, "value": "通用"},
		{"id": AccountScopeDedicated, "value": "专用"},
	}

	accountProviderRelation = orm.Relation{
		Field:      "provider_id",
		Option:     "bot.energon.NewProviderModel",
		OptionKeys: []string{"name", "host"},
	}
)

func NormalizeAccountScope(value int) int16 {
	if int16(value) == AccountScopeDedicated {
		return AccountScopeDedicated
	}
	return AccountScopeCommon
}

func NewAccountModel() *orm.Model[Account] {
	return orm.LoadModel[Account]("来源账号", "bot_energon_account", orm.ModelConfig{
		Index:    AccountIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"scope":  accountScopeOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{accountProviderRelation},
	})
}
