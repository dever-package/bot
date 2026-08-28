package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SessionStatusActive   int16 = 1
	SessionStatusArchived int16 = 2

	SessionOwnerTypeAdmin    = "admin"
	SessionOwnerTypeBodyUser = "body_user"

	TitleSourceAuto   = "auto"
	TitleSourceLLM    = "llm"
	TitleSourceManual = "manual"
)

var sessionStatusOptions = []map[string]any{
	{"id": SessionStatusActive, "value": "活跃"},
	{"id": SessionStatusArchived, "value": "归档"},
}

var sessionOwnerTypeOptions = []map[string]any{
	{"id": SessionOwnerTypeAdmin, "value": "后台账号"},
	{"id": SessionOwnerTypeBodyUser, "value": "前台用户"},
}

var titleSourceOptions = []map[string]any{
	{"id": TitleSourceAuto, "value": "自动"},
	{"id": TitleSourceLLM, "value": "模型生成"},
	{"id": TitleSourceManual, "value": "手动"},
}

type Session struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:会话ID"`
	OwnerType        string    `dorm:"type:varchar(32);not null;default:'admin';comment:归属类型"`
	OwnerID          uint64    `dorm:"type:bigint;not null;default:0;comment:归属账号"`
	ProjectID        uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	TeamID           uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	AgentID          uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	ContextKey       string    `dorm:"type:varchar(128);not null;default:'';comment:上下文"`
	AgentKey         string    `dorm:"type:varchar(128);not null;default:'';comment:智能体"`
	Title            string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	TitleSource      string    `dorm:"type:varchar(32);not null;default:'auto';comment:标题来源"`
	ContextSummary   string    `dorm:"type:text;not null;default:'';comment:上下文摘要"`
	SummaryMessageID uint64    `dorm:"type:bigint;not null;default:0;comment:摘要覆盖的最后消息"`
	ActiveSeriesID   uint64    `dorm:"type:bigint;not null;default:0;comment:当前素材系列"`
	ActiveRequestID  string    `dorm:"type:varchar(64);not null;default:'';comment:当前运行请求"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	MessageCount     int       `dorm:"type:int;not null;default:0;comment:消息数"`
	LastMessageAt    time.Time `dorm:"comment:最后消息时间"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type SessionIndex struct {
	OwnerContext        struct{} `index:"owner_type,owner_id,context_key,agent_key,status,last_message_at,id"`
	OwnerContextHistory struct{} `index:"owner_type,owner_id,context_key,agent_key,last_message_at,id"`
	OwnerStatus         struct{} `index:"owner_type,owner_id,status,last_message_at,id"`
	AgentStatus         struct{} `index:"agent_key,status,last_message_at,id"`
	AgentCreated        struct{} `index:"agent_id,last_message_at,id"`
	ProjectCreated      struct{} `index:"project_id,last_message_at,id"`
	TeamCreated         struct{} `index:"team_id,last_message_at,id"`
	ActiveRequest       struct{} `index:"active_request_id"`
}

var (
	sessionAgentRelation = orm.Relation{
		Field:      "agent_id",
		Option:     "bot.agent.NewAgentModel",
		OptionKeys: []string{"name", "key", "status"},
	}
	sessionProjectRelation = orm.Relation{
		Field:      "project_id",
		Option:     "bot.project.NewProjectModel",
		OptionKeys: []string{"name", "status"},
	}
	sessionTeamRelation = orm.Relation{
		Field:      "team_id",
		Option:     "bot.team.NewTeamModel",
		OptionKeys: []string{"name", "status"},
	}
)

func NewSessionModel() *orm.Model[Session] {
	return orm.LoadModel[Session]("智能体会话", "bot_agent_session", orm.ModelConfig{
		Index:    SessionIndex{},
		Order:    "last_message_at desc,id desc",
		Database: "default",
		Options: map[string]any{
			"owner_type":   sessionOwnerTypeOptions,
			"status":       sessionStatusOptions,
			"title_source": titleSourceOptions,
		},
		Relations: []orm.Relation{
			sessionAgentRelation,
			sessionProjectRelation,
			sessionTeamRelation,
		},
	})
}
