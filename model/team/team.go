package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	StatusEnabled  int16 = 1
	StatusDisabled int16 = 2
)

const (
	TeamPublishStatusDraft     = "draft"
	TeamPublishStatusPublished = "published"
	TeamPublishStatusEditing   = "editing"
)

const DefaultTeamID uint64 = 1

var statusOptions = []map[string]any{
	{"id": StatusEnabled, "value": "开启"},
	{"id": StatusDisabled, "value": "停用"},
}

var teamPublishStatusOptions = []map[string]any{
	{"id": TeamPublishStatusDraft, "value": "草稿"},
	{"id": TeamPublishStatusPublished, "value": "已发布"},
	{"id": TeamPublishStatusEditing, "value": "编辑草稿"},
}

var teamSeed = []map[string]any{
	{
		"id":             DefaultTeamID,
		"cate_id":        DefaultTeamCateID,
		"name":           "默认团队",
		"description":    "你是一个通用 AI 团队，负责根据用户目标协调不同角色完成任务。理解用户目标，规划执行步骤，调度合适角色完成任务并输出可复用结果。",
		"config":         "{}",
		"status":         StatusEnabled,
		"publish_status": TeamPublishStatusDraft,
		"sort":           10,
	},
}

type Team struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:团队ID"`
	CateID           uint64    `dorm:"type:bigint;not null;default:1;comment:团队分类"`
	Name             string    `dorm:"type:varchar(128);not null;comment:名称"`
	Description      string    `dorm:"type:text;not null;default:'';comment:描述"`
	Config           string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	PublishStatus    string    `dorm:"type:varchar(32);not null;default:'draft';comment:发布状态"`
	CurrentReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:当前发布版本"`
	ReleaseVersion   int       `dorm:"type:int;not null;default:0;comment:发布版本号"`
	Sort             int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type TeamIndex struct {
	CateStatus    struct{} `index:"cate_id,status,sort,id"`
	StatusSort    struct{} `index:"status,sort,id"`
	PublishStatus struct{} `index:"publish_status,current_release_id"`
}

func NewTeamModel() *orm.Model[Team] {
	return orm.LoadModel[Team]("团队", "bot_team", orm.ModelConfig{
		Index:    TeamIndex{},
		Seeds:    teamSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":         statusOptions,
			"publish_status": teamPublishStatusOptions,
		},
		Relations: []orm.Relation{
			teamCateRelation,
		},
	})
}
