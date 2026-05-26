package memory

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	StatusEnabled  int16 = 1
	StatusDisabled int16 = 2

	OwnerTypeTeam  = "team"
	OwnerTypeAgent = "agent"
)

var statusOptions = []map[string]any{
	{"id": StatusEnabled, "value": "开启"},
	{"id": StatusDisabled, "value": "停用"},
}

var ownerTypeOptions = []map[string]any{
	{"id": OwnerTypeTeam, "value": "团队"},
	{"id": OwnerTypeAgent, "value": "智能体"},
}

var memoryKindOptions = []map[string]any{
	{"id": "working", "value": "工作记忆"},
	{"id": "episodic", "value": "事件记忆"},
	{"id": "semantic", "value": "语义记忆"},
	{"id": "procedural", "value": "流程记忆"},
	{"id": "persona", "value": "人格记忆"},
	{"id": "content", "value": "内容记忆"},
}

type Memory struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:记忆ID"`
	OwnerType  string    `dorm:"type:varchar(32);not null;default:'team';comment:归属类型"`
	OwnerID    uint64    `dorm:"type:bigint;not null;default:0;comment:归属ID"`
	ProjectID  uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	TeamID     uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID     uint64    `dorm:"type:bigint;not null;default:0;comment:工作流"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	NodeRunID  uint64    `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	AssetID    uint64    `dorm:"type:bigint;not null;default:0;comment:资产"`
	VersionID  uint64    `dorm:"type:bigint;not null;default:0;comment:资产版本"`
	Kind       string    `dorm:"type:varchar(32);not null;default:'episodic';comment:类型"`
	Title      string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Content    string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	Tags       string    `dorm:"type:text;not null;default:'[]';comment:标签"`
	Importance int       `dorm:"type:int;not null;default:50;comment:重要度"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type MemoryIndex struct {
	OwnerKind   struct{} `index:"owner_type,owner_id,kind,status,created_at"`
	ProjectKind struct{} `index:"project_id,kind,status,created_at"`
	TeamKind    struct{} `index:"team_id,kind,status,created_at"`
	FlowKind    struct{} `index:"flow_id,kind,status,created_at"`
	RunStatus   struct{} `index:"run_id,status"`
	Asset       struct{} `index:"asset_id,version_id"`
	Importance  struct{} `index:"importance,status"`
}

func NewMemoryModel() *orm.Model[Memory] {
	return orm.LoadModel[Memory]("记忆", "bot_memory", orm.ModelConfig{
		Index:    MemoryIndex{},
		Order:    "importance desc,id desc",
		Database: "default",
		Options: map[string]any{
			"status":     statusOptions,
			"kind":       memoryKindOptions,
			"owner_type": ownerTypeOptions,
		},
	})
}
