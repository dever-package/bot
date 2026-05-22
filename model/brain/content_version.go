package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ContentVersion struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:版本ID"`
	ContentID uint64    `dorm:"type:bigint;not null;default:0;comment:内容"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID   uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	RunID     uint64    `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	NodeRunID uint64    `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	ReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:大脑发布版本"`
	Version   int       `dorm:"type:int;not null;default:1;comment:版本号"`
	Title     string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Body      string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	Note      string    `dorm:"type:text;not null;default:'';comment:版本说明"`
	Status    string    `dorm:"type:varchar(32);not null;default:'draft';comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ContentVersionIndex struct {
	ContentVersion struct{} `unique:"content_id,version"`
	ContentStatus  struct{} `index:"content_id,status,created_at"`
	BrainRun       struct{} `index:"brain_id,run_id"`
	ReleaseStatus  struct{} `index:"release_id,status,created_at"`
	ThinkStatus    struct{} `index:"think_id,status,created_at"`
}

func NewContentVersionModel() *orm.Model[ContentVersion] {
	return orm.LoadModel[ContentVersion]("大脑内容版本", "bot_brain_content_version", orm.ModelConfig{
		Index:    ContentVersionIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": contentStatusOptions,
		},
		Relations: []orm.Relation{
			contentRelation,
			brainRelation,
			thinkRelation,
			runRelation,
			nodeRunRelation,
		},
	})
}
