package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	LinkTargetSelf  = "_self"
	LinkTargetBlank = "_blank"
)

var linkTargetOptions = []map[string]any{
	{"id": LinkTargetSelf, "value": "当前窗口"},
	{"id": LinkTargetBlank, "value": "新窗口"},
}

type Link struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:链接ID"`
	Name      string    `dorm:"type:varchar(64);not null;comment:名称"`
	URL       string    `dorm:"type:text;not null;comment:链接地址"`
	Target    string    `dorm:"type:varchar(16);not null;default:'_self';comment:打开方式"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type LinkIndex struct {
	StatusSort struct{} `index:"status,sort,id"`
}

func NewLinkModel() *orm.Model[Link] {
	return orm.LoadModel[Link]("Body登录页菜单", "bot_body_link", orm.ModelConfig{
		Index:    LinkIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"target": linkTargetOptions,
			"status": statusOptions,
		},
	})
}
