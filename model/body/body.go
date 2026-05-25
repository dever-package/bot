package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	TypeCanvas = "canvas"
	TypeRobot  = "robot"
	TypeChat   = "chat"
	TypeApp    = "app"

	StatusDisabled int16 = 2
	StatusEnabled  int16 = 1
)

var typeOptions = []map[string]any{
	{"id": TypeCanvas, "value": "画布"},
	{"id": TypeRobot, "value": "机器人"},
	{"id": TypeChat, "value": "聊天"},
	{"id": TypeApp, "value": "应用"},
}

var statusOptions = []map[string]any{
	{"id": StatusEnabled, "value": "启用"},
	{"id": StatusDisabled, "value": "停用"},
}

var bodyRelation = orm.Relation{
	Field:      "body_id",
	Option:     "bot.body.NewBodyModel",
	OptionKeys: []string{"name", "type"},
}

var sessionRelation = orm.Relation{
	Field:      "session_id",
	Option:     "bot.body.NewSessionModel",
	OptionKeys: []string{"request_id", "status"},
}

var canvasRelation = orm.Relation{
	Field:      "canvas_id",
	Option:     "bot.body.NewCanvasModel",
	OptionKeys: []string{"name", "status"},
}

var powerRelation = orm.Relation{
	Field:      "power_id",
	Option:     "bot.energon.NewPowerModel",
	OptionKeys: []string{"name", "key", "kind", "cate_id"},
}

var agentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name", "key", "cate_id"},
}

var brainRelation = orm.Relation{
	Field:      "brain_id",
	Option:     "bot.brain.NewBrainModel",
	OptionKeys: []string{"name", "key", "cate_id"},
}

var releaseRelation = orm.Relation{
	Field:      "release_id",
	Option:     "bot.brain.NewBrainReleaseModel",
	OptionKeys: []string{"version", "status"},
}

type Body struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:载体ID"`
	ProjectID uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type      string    `dorm:"type:varchar(32);not null;default:'canvas';comment:类型"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type BodyIndex struct {
	ProjectStatus struct{} `index:"project_id,status,sort,id"`
	TypeStatus    struct{} `index:"type,status,sort,id"`
}

func NewBodyModel() *orm.Model[Body] {
	return orm.LoadModel[Body]("载体", "bot_body", orm.ModelConfig{
		Index:    BodyIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":   typeOptions,
			"status": statusOptions,
		},
	})
}
