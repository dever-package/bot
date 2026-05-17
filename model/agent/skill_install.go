package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SkillInstallActionInstall = "install"

	SkillInstallStatusPending    = "pending"
	SkillInstallStatusInstalling = "installing"
	SkillInstallStatusSuccess    = "success"
	SkillInstallStatusFail       = "failed"
)

type SkillInstall struct {
	ID            uint64     `dorm:"primaryKey;autoIncrement;comment:安装记录ID"`
	CateID        uint64     `dorm:"type:bigint;not null;default:1;comment:技能分类"`
	TargetPackID  uint64     `dorm:"type:bigint;not null;default:0;comment:目标技能方案"`
	AutoAddToPack int16      `dorm:"type:smallint;not null;default:1;comment:安装成功后加入方案"`
	Action        string     `dorm:"type:varchar(32);not null;default:'install';comment:动作"`
	InstallType   string     `dorm:"type:varchar(32);not null;default:'prompt';comment:安装类型"`
	InstallInput  string     `dorm:"type:text;not null;comment:安装输入"`
	Status        string     `dorm:"type:varchar(32);not null;default:'pending';comment:安装状态"`
	SkillID       uint64     `dorm:"type:bigint;not null;default:0;comment:技能"`
	RequestID     string     `dorm:"type:varchar(64);not null;default:'';comment:请求ID"`
	TargetPath    string     `dorm:"type:varchar(512);not null;default:'';comment:目标目录"`
	Plan          string     `dorm:"type:text;not null;default:'';comment:安装计划"`
	Log           string     `dorm:"type:text;not null;default:'';comment:安装日志"`
	Error         string     `dorm:"type:text;not null;default:'';comment:错误信息"`
	StartedAt     *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt    *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt     time.Time  `dorm:"comment:创建时间"`
}

type SkillInstallIndex struct {
	StatusCreated struct{} `index:"status,created_at"`
	RequestID     struct{} `index:"request_id"`
	SkillCreated  struct{} `index:"skill_id,created_at"`
	PackCreated   struct{} `index:"target_pack_id,created_at"`
}

var (
	skillInstallActionOptions = []map[string]any{
		{"id": SkillInstallActionInstall, "value": "安装"},
	}

	skillInstallTypeOptions = []map[string]any{
		{"id": "command", "value": "命令"},
		{"id": "url", "value": "链接"},
		{"id": "prompt", "value": "提示词"},
	}

	skillInstallStatusOptions = []map[string]any{
		{"id": SkillInstallStatusPending, "value": "等待安装"},
		{"id": SkillInstallStatusInstalling, "value": "安装中"},
		{"id": SkillInstallStatusSuccess, "value": "成功"},
		{"id": SkillInstallStatusFail, "value": "失败"},
	}

	skillInstallCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.agent.NewSkillCateModel",
		OptionKeys: []string{"name"},
	}

	skillInstallPackRelation = orm.Relation{
		Field:      "target_pack_id",
		Option:     "bot.agent.NewSkillPackModel",
		OptionKeys: []string{"name"},
	}

	skillInstallSkillRelation = orm.Relation{
		Field:      "skill_id",
		Option:     "bot.agent.NewSkillModel",
		OptionKeys: []string{"name", "key"},
	}
)

func NewSkillInstallModel() *orm.Model[SkillInstall] {
	return orm.LoadModel[SkillInstall]("技能安装记录", "bot_skill_install", orm.ModelConfig{
		Index:    SkillInstallIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"action":       skillInstallActionOptions,
			"install_type": skillInstallTypeOptions,
			"status":       skillInstallStatusOptions,
		},
		Relations: []orm.Relation{
			skillInstallCateRelation,
			skillInstallPackRelation,
			skillInstallSkillRelation,
		},
	})
}

func SkillInstallActionOptions() []map[string]any {
	return cloneOptionRows(skillInstallActionOptions)
}

func SkillInstallTypeOptions() []map[string]any {
	return cloneOptionRows(skillInstallTypeOptions)
}

func SkillInstallStatusOptions() []map[string]any {
	return cloneOptionRows(skillInstallStatusOptions)
}
