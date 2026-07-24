package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type LinkSceneBinding struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:链接场景关联ID"`
	LinkID    uint64    `dorm:"type:bigint;not null;comment:单页链接"`
	SceneID   uint64    `dorm:"type:bigint;not null;comment:使用场景"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type LinkSceneBindingIndex struct {
	LinkScene struct{} `unique:"link_id,scene_id"`
	SceneLink struct{} `index:"scene_id,link_id"`
}

func NewLinkSceneBindingModel() *orm.Model[LinkSceneBinding] {
	return orm.LoadModel[LinkSceneBinding]("Body单页链接场景关联", "bot_body_link_scene_binding", orm.ModelConfig{
		Index:    LinkSceneBindingIndex{},
		Order:    "id asc",
		Database: "default",
	})
}
