package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Log struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:日志ID"`
	RequestID string `dorm:"type:varchar(64);not null;comment:请求ID"`
	Mode      string `dorm:"type:varchar(32);not null;comment:调用方式"`
	Protocol  string `dorm:"type:varchar(32);not null;comment:协议"`

	PowerID       uint64 `dorm:"type:bigint;not null;default:0;comment:能力ID"`
	PowerKey      string `dorm:"type:varchar(128);not null;default:'';comment:能力标识"`
	PowerName     string `dorm:"type:varchar(128);not null;default:'';comment:能力名称"`
	PowerTargetID uint64 `dorm:"type:bigint;not null;default:0;comment:能力来源ID"`
	PowerParams   string `dorm:"type:text;not null;default:'{}';comment:能力参数"`

	ProviderID   uint64 `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	ProviderName string `dorm:"type:varchar(128);not null;default:'';comment:来源名称"`
	AccountID    uint64 `dorm:"type:bigint;not null;default:0;comment:账号ID"`
	AccountName  string `dorm:"type:varchar(128);not null;default:'';comment:账号"`

	ServiceID   uint64 `dorm:"type:bigint;not null;default:0;comment:服务ID"`
	ServiceName string `dorm:"type:varchar(128);not null;default:'';comment:服务名称"`
	ServiceApi  string `dorm:"type:varchar(128);not null;comment:服务地址"`

	Status    string    `dorm:"type:varchar(32);not null;comment:状态"`
	Latency   int64     `dorm:"type:bigint;not null;default:0;comment:耗时"`
	Result    string    `dorm:"type:text;not null;comment:响应数据"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type LogIndex struct {
	RequestID struct{} `index:"request_id"`
	Status    struct{} `index:"status,created_at"`
	Power     struct{} `index:"power_id,created_at"`
	Service   struct{} `index:"service_id,created_at"`
	Provider  struct{} `index:"provider_id,created_at"`
}

var (
	modeOptions = []map[string]any{
		{"id": "normalize", "value": "默认调用"},
		{"id": "proxy", "value": "代理"},
	}

	callStatusOptions = []map[string]any{
		{"id": "success", "value": "成功"},
		{"id": "fail", "value": "失败"},
	}

	logPowerRelation = orm.Relation{
		Field:      "power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key"},
	}

	logPowerTargetRelation = orm.Relation{
		Field:      "power_target_id",
		Option:     "bot.energon.NewPowerTargetModel",
		OptionKeys: []string{"service_id", "sort"},
	}

	logServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}

	logProviderRelation = orm.Relation{
		Field:      "provider_id",
		Option:     "bot.energon.NewProviderModel",
		OptionKeys: []string{"name", "host"},
	}

	logAccountRelation = orm.Relation{
		Field:      "account_id",
		Option:     "bot.energon.NewAccountModel",
		OptionKeys: []string{"name"},
	}
)

func NewLogModel() *orm.Model[Log] {
	return orm.LoadModel[Log]("日志", "bot_energon_log", orm.ModelConfig{
		Index:    LogIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"mode":     modeOptions,
			"protocol": protocolOptions,
			"status":   callStatusOptions,
		},
		Relations: []orm.Relation{
			logPowerRelation,
			logPowerTargetRelation,
			logServiceRelation,
			logProviderRelation,
			logAccountRelation,
		},
	})
}
