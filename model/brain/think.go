package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Think struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:思维ID"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key       string    `dorm:"type:varchar(128);not null;comment:标识"`
	Goal      string    `dorm:"type:text;not null;default:'';comment:目标"`
	Position  string    `dorm:"type:text;not null;default:'{}';comment:位置"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ThinkIndex struct {
	BrainKey    struct{} `unique:"brain_id,key"`
	BrainStatus struct{} `index:"brain_id,status,sort,id"`
}

func NewThinkModel() *orm.Model[Think] {
	return orm.LoadModel[Think]("大脑思维", "bot_brain_think", orm.ModelConfig{
		Index:    ThinkIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
		},
	})
}
