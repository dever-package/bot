package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Skill struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:技能ID"`
	CateID      uint64    `dorm:"type:bigint;not null;default:1;comment:技能分类"`
	Key         string    `dorm:"type:varchar(128);not null;comment:技能标识"`
	Name        string    `dorm:"type:varchar(128);not null;comment:技能名称"`
	Description string    `dorm:"type:varchar(512);not null;default:'';comment:技能描述"`
	SourceURL   string    `dorm:"type:varchar(512);not null;default:'';comment:来源链接"`
	InstallPath string    `dorm:"type:varchar(512);not null;default:'';comment:安装目录"`
	EntryFile   string    `dorm:"type:varchar(128);not null;default:'SKILL.md';comment:入口文件"`
	Manifest    string    `dorm:"type:text;not null;default:'';comment:技能元信息"`
	ContentHash string    `dorm:"type:varchar(128);not null;default:'';comment:内容哈希"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type SkillIndex struct {
	Key            struct{} `unique:"key"`
	CateStatusSort struct{} `index:"cate_id,status,sort"`
	StatusSort     struct{} `index:"status,sort"`
}

var skillCateRelation = orm.Relation{
	Field:      "cate_id",
	Option:     "bot.agent.NewSkillCateModel",
	OptionKeys: []string{"name"},
}

func NewSkillModel() *orm.Model[Skill] {
	return orm.LoadModel[Skill]("技能", "bot_skill", orm.ModelConfig{
		Index:    SkillIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			skillCateRelation,
		},
	})
}
