package agent

import (
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
	"github.com/shemic/dever/orm"
)

type AgentParam struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:智能体参数ID"`
	AgentID   uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	ParamID   uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	Required  int16     `dorm:"type:smallint;not null;default:2;comment:必填"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type AgentParamIndex struct {
	AgentParam struct{} `unique:"agent_id,param_id"`
	AgentSort  struct{} `index:"agent_id,sort"`
}

var (
	agentParamSeed = []map[string]any{
		{
			"id":       1,
			"agent_id": DefaultAgentID,
			"param_id": energonmodel.ParamImageID,
			"required": 2,
			"sort":     1,
		},
	}

	agentParamRequiredOptions = []map[string]any{
		{"id": 1, "value": "必填"},
		{"id": 2, "value": "选填"},
	}

	agentParamAgentRelation = orm.Relation{
		Field:      "agent_id",
		Option:     "bot.agent.NewAgentModel",
		OptionKeys: []string{"name", "key"},
	}

	agentParamParamRelation = orm.Relation{
		Field:      "param_id",
		Option:     "bot.energon.NewParamModel",
		OptionKeys: []string{"name", "key", "type", "upload_rule_id", "max_files"},
	}
)

func NewAgentParamModel() *orm.Model[AgentParam] {
	return orm.LoadModel[AgentParam]("智能体参数", "bot_agent_param", orm.ModelConfig{
		Index:    AgentParamIndex{},
		Seeds:    agentParamSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"required": agentParamRequiredOptions,
		},
		Relations: []orm.Relation{
			agentParamAgentRelation,
			agentParamParamRelation,
		},
	})
}
