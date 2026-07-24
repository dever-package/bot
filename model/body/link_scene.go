package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	LinkSceneNavigationID         uint64 = 1
	LinkSceneWorkbenchContentID   uint64 = 2
	LinkSceneNavigationCode              = "navigation"
	LinkSceneWorkbenchContentCode        = "workbench_content"
)

type LinkScene struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:使用场景ID"`
	Code      string    `dorm:"type:varchar(32);not null;comment:场景编码"`
	Name      string    `dorm:"type:varchar(64);not null;comment:场景名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type LinkSceneIndex struct {
	Code struct{} `unique:"code"`
}

var linkSceneSeed = []map[string]any{
	{
		"id":   LinkSceneNavigationID,
		"code": LinkSceneNavigationCode,
		"name": "登录页导航",
		"sort": 10,
	},
	{
		"id":   LinkSceneWorkbenchContentID,
		"code": LinkSceneWorkbenchContentCode,
		"name": "工作台内容",
		"sort": 20,
	},
}

func NewLinkSceneModel() *orm.Model[LinkScene] {
	return orm.LoadModel[LinkScene]("Body单页链接场景", "bot_body_link_scene", orm.ModelConfig{
		Index:    LinkSceneIndex{},
		Seeds:    linkSceneSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}

var linkSceneRelation = orm.Relation{
	Field:        "scene_ids",
	Name:         "scenes",
	Through:      "bot.body.NewLinkSceneBindingModel",
	Option:       "bot.body.NewLinkSceneModel",
	OwnerField:   "link_id",
	TargetField:  "scene_id",
	ThroughOrder: "id asc",
	OptionOrder:  "sort asc,id asc",
}
