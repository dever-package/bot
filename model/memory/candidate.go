package memory

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	CandidateStatusPending  int16 = 1
	CandidateStatusAccepted int16 = 2
	CandidateStatusRejected int16 = 3
	CandidateStatusExpired  int16 = 4

	CandidateActionRemember = "remember"
	CandidateActionUpdate   = "update"
	CandidateActionIgnore   = "ignore"
	CandidateActionSession  = "session"
	CandidateActionKeepOld  = "keep_old"
)

var candidateStatusOptions = []map[string]any{
	{"id": CandidateStatusPending, "value": "待确认"},
	{"id": CandidateStatusAccepted, "value": "已接受"},
	{"id": CandidateStatusRejected, "value": "已拒绝"},
	{"id": CandidateStatusExpired, "value": "已过期"},
}

type Candidate struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:候选记忆ID"`
	OwnerType       string    `dorm:"type:varchar(32);not null;default:'admin';comment:归属类型"`
	OwnerID         uint64    `dorm:"type:bigint;not null;default:0;comment:归属ID"`
	AgentKey        string    `dorm:"type:varchar(128);not null;default:'';comment:智能体"`
	ContextKey      string    `dorm:"type:varchar(128);not null;default:'';comment:上下文"`
	SessionID       uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	SourceMessageID uint64    `dorm:"type:bigint;not null;default:0;comment:来源消息"`
	ExistingID      uint64    `dorm:"type:bigint;not null;default:0;comment:冲突记忆"`
	Scope           string    `dorm:"type:varchar(32);not null;default:'context';comment:作用域"`
	Kind            string    `dorm:"type:varchar(32);not null;default:'semantic';comment:类型"`
	Title           string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Content         string    `dorm:"type:text;not null;default:'';comment:内容"`
	Reason          string    `dorm:"type:text;not null;default:'';comment:原因"`
	Tags            string    `dorm:"type:text;not null;default:'[]';comment:标签"`
	Source          string    `dorm:"type:varchar(32);not null;default:'auto';comment:来源"`
	Confidence      float64   `dorm:"type:double precision;not null;default:0;comment:置信度"`
	Score           float64   `dorm:"type:double precision;not null;default:0;comment:评分"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type CandidateIndex struct {
	OwnerScope struct{} `index:"owner_type,owner_id,agent_key,context_key,session_id,status,created_at"`
	Message    struct{} `index:"source_message_id,status"`
	Existing   struct{} `index:"existing_id,status"`
}

func NewCandidateModel() *orm.Model[Candidate] {
	return orm.LoadModel[Candidate]("候选记忆", "bot_memory_candidate", orm.ModelConfig{
		Index:    CandidateIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": candidateStatusOptions,
			"scope":  scopeOptions,
			"kind":   memoryKindOptions,
			"source": sourceOptions,
		},
	})
}
