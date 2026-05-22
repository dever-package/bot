package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	BrainReleaseStatusCurrent = "current"
	BrainReleaseStatusArchive = "archive"
)

var brainReleaseStatusOptions = []map[string]any{
	{"id": BrainReleaseStatusCurrent, "value": "当前"},
	{"id": BrainReleaseStatusArchive, "value": "历史"},
}

type BrainRelease struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:发布版本ID"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	Version   int       `dorm:"type:int;not null;default:1;comment:版本号"`
	Snapshot  string    `dorm:"type:text;not null;default:'{}';comment:发布快照"`
	Status    string    `dorm:"type:varchar(32);not null;default:'current';comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type BrainReleaseIndex struct {
	BrainVersion struct{} `unique:"brain_id,version"`
	BrainStatus  struct{} `index:"brain_id,status,version"`
}

func NewBrainReleaseModel() *orm.Model[BrainRelease] {
	return orm.LoadModel[BrainRelease]("大脑发布版本", "bot_brain_release", orm.ModelConfig{
		Index:    BrainReleaseIndex{},
		Order:    "version desc,id desc",
		Database: "default",
		Options: map[string]any{
			"status": brainReleaseStatusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
		},
	})
}
