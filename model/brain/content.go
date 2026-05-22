package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ContentStatusDraft   = "draft"
	ContentStatusCurrent = "current"
	ContentStatusArchive = "archived"
)

var contentStatusOptions = []map[string]any{
	{"id": ContentStatusDraft, "value": "草稿"},
	{"id": ContentStatusCurrent, "value": "当前"},
	{"id": ContentStatusArchive, "value": "归档"},
}

type Content struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:内容ID"`
	BrainID          uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID          uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	Name             string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key              string    `dorm:"type:varchar(128);not null;comment:标识"`
	Type             string    `dorm:"type:varchar(64);not null;default:'text';comment:类型"`
	CurrentVersionID uint64    `dorm:"type:bigint;not null;default:0;comment:当前版本"`
	Status           string    `dorm:"type:varchar(32);not null;default:'draft';comment:状态"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type ContentIndex struct {
	BrainKey    struct{} `unique:"brain_id,key"`
	BrainType   struct{} `index:"brain_id,type,status"`
	Current     struct{} `index:"current_version_id"`
	ThinkStatus struct{} `index:"think_id,status"`
}

func NewContentModel() *orm.Model[Content] {
	return orm.LoadModel[Content]("大脑内容", "bot_brain_content", orm.ModelConfig{
		Index:    ContentIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": contentStatusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			thinkRelation,
			currentVersionRelation,
		},
	})
}
