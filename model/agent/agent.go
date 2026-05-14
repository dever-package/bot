package agent

import (
	"time"

	"github.com/shemic/dever/orm"

	energonmodel "my/package/bot/model/energon"
)

type Agent struct {
	ID             uint64    `dorm:"primaryKey;autoIncrement;comment:智能体ID"`
	CateID         uint64    `dorm:"type:bigint;not null;default:1;comment:智能体分类"`
	Name           string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key            string    `dorm:"type:varchar(128);not null;comment:标识"`
	Description    string    `dorm:"type:text;not null;default:'';comment:描述"`
	LLMPowerID     uint64    `dorm:"type:bigint;not null;default:0;comment:LLM能力"`
	SettingPackID  uint64    `dorm:"type:bigint;not null;default:1;comment:执行方案"`
	Temperature    float64   `dorm:"type:double precision;not null;default:0.7;comment:温度"`
	TimeoutSeconds int       `dorm:"type:int;not null;default:300;comment:超时时间(秒)"`
	Status         int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort           int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt      time.Time `dorm:"comment:创建时间"`
}

type AgentIndex struct {
	Key               struct{} `unique:"key"`
	CateStatusSort    struct{} `index:"cate_id,status,sort"`
	SettingPackStatus struct{} `index:"setting_pack_id,status"`
	StatusSort        struct{} `index:"status,sort"`
}

const (
	DefaultAgentID        uint64 = 1
	FrontAssistantAgentID uint64 = 2
)

var (
	statusOptions = []map[string]any{
		{"id": 1, "value": "开启"},
		{"id": 2, "value": "停用"},
	}

	agentSeed = []map[string]any{
		{
			"id":              DefaultAgentID,
			"cate_id":         DefaultAgentCateID,
			"name":            "默认智能体",
			"key":             "default",
			"description":     "默认通用智能体，适合普通文本任务和能力调用。",
			"llm_power_id":    energonmodel.DefaultLLMPowerID,
			"setting_pack_id": DefaultSettingPackID,
			"temperature":     0.7,
			"timeout_seconds": 300,
			"status":          1,
			"sort":            10,
		},
		{
			"id":              FrontAssistantAgentID,
			"cate_id":         AssistantAgentCateID,
			"name":            "AI助理",
			"key":             "front-assistant",
			"description":     "后台页面 AI 助理，用于理解当前页面、生成内容、补全表单和返回受控前端动作。",
			"llm_power_id":    energonmodel.DefaultLLMPowerID,
			"setting_pack_id": AssistantSettingPackID,
			"temperature":     0.4,
			"timeout_seconds": 300,
			"status":          1,
			"sort":            10,
		},
	}

	agentCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.agent.NewAgentCateModel",
		OptionKeys: []string{"name"},
	}

	agentLLMPowerRelation = orm.Relation{
		Field:      "llm_power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key", "kind"},
	}

	agentSettingPackRelation = orm.Relation{
		Field:      "setting_pack_id",
		Option:     "bot.agent.NewSettingPackModel",
		OptionKeys: []string{"name"},
	}
)

func NewAgentModel() *orm.Model[Agent] {
	return orm.LoadModel[Agent]("智能体", "bot_agent", orm.ModelConfig{
		Index:    AgentIndex{},
		Seeds:    agentSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			agentCateRelation,
			agentLLMPowerRelation,
			agentSettingPackRelation,
		},
	})
}
