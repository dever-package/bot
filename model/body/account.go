package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultAccountID      uint64 = 1
	AccountProviderFeishu        = "feishu"
)

type Account struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:账号入口ID"`
	Provider  string    `dorm:"type:varchar(32);not null;comment:账号标识"`
	Name      string    `dorm:"type:varchar(96);not null;comment:按钮名称"`
	Icon      string    `dorm:"type:text;not null;default:'';comment:按钮图标"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type AccountIndex struct {
	Provider   struct{} `unique:"provider"`
	StatusSort struct{} `index:"status,sort,id"`
}

var accountSeed = []map[string]any{
	{
		"id":       DefaultAccountID,
		"provider": AccountProviderFeishu,
		"name":     "使用飞书账户继续",
		"icon":     "",
		"status":   StatusEnabled,
		"sort":     10,
	},
}

func NewAccountModel() *orm.Model[Account] {
	return orm.LoadModel[Account]("Body三方账号", "bot_body_account", orm.ModelConfig{
		Index:    AccountIndex{},
		Order:    "sort asc,id asc",
		Seeds:    accountSeed,
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
