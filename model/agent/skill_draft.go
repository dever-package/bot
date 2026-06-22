package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SkillDraftStatusDraft     int16 = 1
	SkillDraftStatusPublished int16 = 2
	SkillDraftStatusDisabled  int16 = 3
)

type SkillDraft struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:技能草稿ID"`
	PackID           uint64    `dorm:"type:bigint;not null;default:1;comment:技能方案"`
	CateID           uint64    `dorm:"type:bigint;not null;default:1;comment:技能分类"`
	SourceSkillID    uint64    `dorm:"type:bigint;not null;default:0;comment:来源正式技能"`
	Key              string    `dorm:"type:varchar(128);not null;default:'';comment:技能标识"`
	Name             string    `dorm:"type:varchar(128);not null;default:'';comment:技能名称"`
	Description      string    `dorm:"type:varchar(512);not null;default:'';comment:技能描述"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	SkillMD          string    `dorm:"type:text;not null;default:'';comment:SKILL.md"`
	FilesJSON        string    `dorm:"type:text;not null;default:'';comment:草稿文件"`
	Manifest         string    `dorm:"type:text;not null;default:'';comment:运行配置"`
	ValidationResult string    `dorm:"type:text;not null;default:'';comment:测试结果"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type SkillDraftIndex struct {
	StatusSort    struct{} `index:"status,id"`
	PackStatus    struct{} `index:"pack_id,status,id"`
	SourceSkillID struct{} `index:"source_skill_id,status,id"`
}

var (
	skillDraftPackRelation = orm.Relation{
		Field:      "pack_id",
		Option:     "bot.agent.NewSkillPackModel",
		OptionKeys: []string{"name"},
	}
	skillDraftCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.agent.NewSkillCateModel",
		OptionKeys: []string{"name"},
	}
	skillDraftSourceRelation = orm.Relation{
		Field:      "source_skill_id",
		Option:     "bot.agent.NewSkillModel",
		OptionKeys: []string{"name", "key"},
	}
	skillDraftStatusOptions = []map[string]any{
		{"id": SkillDraftStatusDraft, "value": "未发布"},
		{"id": SkillDraftStatusPublished, "value": "已发布"},
		{"id": SkillDraftStatusDisabled, "value": "已丢弃"},
	}
)

func NewSkillDraftModel() *orm.Model[SkillDraft] {
	return orm.LoadModel[SkillDraft]("技能草稿", "bot_skill_draft", orm.ModelConfig{
		Index:    SkillDraftIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": skillDraftStatusOptions,
		},
		Relations: []orm.Relation{
			skillDraftPackRelation,
			skillDraftCateRelation,
			skillDraftSourceRelation,
		},
	})
}

func SkillDraftStatusOptions() []map[string]any {
	return cloneOptionRows(skillDraftStatusOptions)
}
