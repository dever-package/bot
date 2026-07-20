package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	RunStatusPending  = "pending"
	RunStatusRunning  = "running"
	RunStatusWaiting  = "waiting"
	RunStatusSuccess  = "success"
	RunStatusFail     = "fail"
	RunStatusCanceled = "canceled"
)

var runStatusOptions = []map[string]any{
	{"id": RunStatusPending, "value": "等待中"},
	{"id": RunStatusRunning, "value": "运行中"},
	{"id": RunStatusWaiting, "value": "等待交互"},
	{"id": RunStatusSuccess, "value": "成功"},
	{"id": RunStatusFail, "value": "失败"},
	{"id": RunStatusCanceled, "value": "已取消"},
}

type Run struct {
	ID                  uint64 `dorm:"primaryKey;autoIncrement;comment:运行ID"`
	RequestID           string `dorm:"type:varchar(64);not null;comment:请求ID"`
	ProjectID           uint64 `dorm:"type:bigint;not null;default:0;comment:项目"`
	BodyID              uint64 `dorm:"type:bigint;not null;default:0;comment:载体"`
	TeamID              uint64 `dorm:"type:bigint;not null;default:0;comment:团队"`
	ReleaseID           uint64 `dorm:"type:bigint;not null;default:0;comment:发布版本"`
	ActorType           string `dorm:"type:varchar(32);not null;default:'';comment:发起人类型"`
	ActorID             uint64 `dorm:"type:bigint;not null;default:0;comment:发起人"`
	SiteKey             string `dorm:"type:varchar(64);not null;default:'';comment:站点"`
	AgentRunID          uint64 `dorm:"type:bigint;not null;default:0;comment:智能体运行"`
	AgentSessionID      uint64 `dorm:"type:bigint;not null;default:0;comment:智能体会话"`
	ChildRequestID      string `dorm:"type:varchar(64);not null;default:'';comment:子运行请求"`
	Interaction         string `dorm:"type:text;not null;default:'{}';comment:待处理交互"`
	InteractionResponse string `dorm:"type:text;not null;default:'{}';comment:交互回答"`
	ExecutionOwner      string `dorm:"type:varchar(128);not null;default:'';comment:运行执行者"`
	ExecutionVersion    int    `dorm:"type:int;not null;default:0;comment:执行租约版本"`
	Input               string `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output              string `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error               string `dorm:"type:text;not null;default:'';comment:错误"`
	Status              string `dorm:"type:varchar(32);not null;default:'running';comment:状态"`

	ExecutionExpiresAt   *time.Time `dorm:"null;comment:执行租约过期时间"`
	ExecutionHeartbeatAt *time.Time `dorm:"null;comment:执行心跳时间"`
	StartedAt            time.Time  `dorm:"comment:开始时间"`
	FinishedAt           *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt            time.Time  `dorm:"comment:创建时间"`
	UpdatedAt            time.Time  `dorm:"comment:更新时间"`
}

type RunIndex struct {
	RequestID      struct{} `index:"request_id"`
	ProjectStatus  struct{} `index:"project_id,status,created_at"`
	BodyStatus     struct{} `index:"body_id,status,created_at"`
	TeamStatus     struct{} `index:"team_id,status,created_at"`
	ReleaseStatus  struct{} `index:"release_id,status,created_at"`
	StatusCreated  struct{} `index:"status,created_at"`
	ActorCreated   struct{} `index:"actor_type,actor_id,created_at"`
	ChildRequest   struct{} `index:"child_request_id"`
	AgentSession   struct{} `index:"agent_session_id"`
	ExecutionLease struct{} `index:"status,execution_expires_at,id"`
	ExecutionOwner struct{} `index:"execution_owner,status"`
}

func NewRunModel() *orm.Model[Run] {
	return orm.LoadModel[Run]("团队运行", "bot_team_run", orm.ModelConfig{
		Index:    RunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": runStatusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
		},
	})
}
