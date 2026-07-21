package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	AccountConfigKeyAppID     = "app_id"
	AccountConfigKeyAppSecret = "app_secret"
)

type AccountConfig struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:账号配置ID"`
	AccountID uint64    `dorm:"type:bigint;not null;default:0;comment:账号入口"`
	Key       string    `dorm:"type:varchar(64);not null;comment:配置键"`
	Value     string    `dorm:"type:text;not null;default:'';comment:配置值"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type AccountConfigIndex struct {
	AccountKey struct{} `unique:"account_id,key"`
	Account    struct{} `index:"account_id,id"`
}

var accountConfigSeed = []map[string]any{
	{
		"account_id": DefaultAccountID,
		"key":        AccountConfigKeyAppID,
		"value":      "",
	},
	{
		"account_id": DefaultAccountID,
		"key":        AccountConfigKeyAppSecret,
		"value":      "",
	},
}

func NewAccountConfigModel() *orm.Model[AccountConfig] {
	return orm.LoadModel[AccountConfig]("Body三方账号配置", "bot_body_account_config", orm.ModelConfig{
		Index:    AccountConfigIndex{},
		Order:    "id asc",
		Seeds:    accountConfigSeed,
		Database: "default",
		Fields: map[string]orm.FieldConfig{
			"account_id": {Type: orm.FieldTypeHidden},
			"value":      {Type: orm.FieldTypeHidden},
		},
	})
}
