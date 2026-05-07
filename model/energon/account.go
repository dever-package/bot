package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Account struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:账号ID"`
	ProviderID uint64    `dorm:"type:bigint;not null;default:0;comment:来源"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key        string    `dorm:"type:varchar(128);not null;comment:密钥"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type AccountIndex struct {
	ProviderKey    struct{} `unique:"provider_id,key"`
	ProviderStatus struct{} `index:"provider_id,status,sort"`
}

var accountProviderRelation = orm.Relation{
	Field:      "provider_id",
	Option:     "bot.energon.NewProviderModel",
	OptionKeys: []string{"name", "host"},
}

func NewAccountModel() *orm.Model[Account] {
	return orm.LoadModel[Account]("来源账号", "bot_energon_account", orm.ModelConfig{
		Index:    AccountIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{accountProviderRelation},
	})
}
