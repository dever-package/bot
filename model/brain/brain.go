package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	StatusEnabled  int16 = 1
	StatusDisabled int16 = 2
)

const (
	BrainPublishStatusDraft     = "draft"
	BrainPublishStatusPublished = "published"
	BrainPublishStatusEditing   = "editing"
)

var statusOptions = []map[string]any{
	{"id": StatusEnabled, "value": "开启"},
	{"id": StatusDisabled, "value": "停用"},
}

var brainPublishStatusOptions = []map[string]any{
	{"id": BrainPublishStatusDraft, "value": "草稿"},
	{"id": BrainPublishStatusPublished, "value": "已发布"},
	{"id": BrainPublishStatusEditing, "value": "编辑草稿"},
}

type Brain struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:大脑ID"`
	CateID           uint64    `dorm:"type:bigint;not null;default:1;comment:大脑分类"`
	Name             string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key              string    `dorm:"type:varchar(128);not null;comment:标识"`
	Description      string    `dorm:"type:text;not null;default:'';comment:描述"`
	Persona          string    `dorm:"type:text;not null;default:'';comment:人格"`
	Goal             string    `dorm:"type:text;not null;default:'';comment:目标"`
	Config           string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	PublishStatus    string    `dorm:"type:varchar(32);not null;default:'draft';comment:发布状态"`
	CurrentReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:当前发布版本"`
	ReleaseVersion   int       `dorm:"type:int;not null;default:0;comment:发布版本号"`
	Sort             int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type BrainIndex struct {
	Key           struct{} `unique:"key"`
	CateStatus    struct{} `index:"cate_id,status,sort,id"`
	StatusSort    struct{} `index:"status,sort,id"`
	PublishStatus struct{} `index:"publish_status,current_release_id"`
}

func NewBrainModel() *orm.Model[Brain] {
	return orm.LoadModel[Brain]("大脑", "bot_brain", orm.ModelConfig{
		Index:    BrainIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":         statusOptions,
			"publish_status": brainPublishStatusOptions,
		},
		Relations: []orm.Relation{
			brainCateRelation,
		},
	})
}
