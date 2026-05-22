package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ThinkCreatePower struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:创作能力ID"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID   uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	Kind      string    `dorm:"type:varchar(64);not null;comment:能力类型"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ThinkCreatePowerIndex struct {
	ThinkKindPower struct{} `unique:"think_id,kind,power_id"`
	BrainStatus    struct{} `index:"brain_id,status,sort,id"`
	ThinkStatus    struct{} `index:"think_id,status,sort,id"`
	KindStatus     struct{} `index:"kind,status"`
	PowerStatus    struct{} `index:"power_id,status"`
}

func NewThinkCreatePowerModel() *orm.Model[ThinkCreatePower] {
	return orm.LoadModel[ThinkCreatePower]("创作能力", "bot_brain_think_create_power", orm.ModelConfig{
		Index:    ThinkCreatePowerIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			thinkRelation,
			createPowerRelation,
		},
	})
}
