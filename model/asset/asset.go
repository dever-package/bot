package asset

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	KindText  = "text"
	KindImage = "image"
	KindVideo = "video"
	KindAudio = "audio"
	KindFile  = "file"
	KindMixed = "mixed"

	StatusDraft   = "draft"
	StatusCurrent = "current"
	StatusArchive = "archived"
)

var kindOptions = []map[string]any{
	{"id": KindText, "value": "文本"},
	{"id": KindImage, "value": "图片"},
	{"id": KindVideo, "value": "视频"},
	{"id": KindAudio, "value": "音频"},
	{"id": KindFile, "value": "文件"},
	{"id": KindMixed, "value": "混合"},
}

var statusOptions = []map[string]any{
	{"id": StatusDraft, "value": "草稿"},
	{"id": StatusCurrent, "value": "当前"},
	{"id": StatusArchive, "value": "归档"},
}

var bodyRelation = orm.Relation{
	Field:      "body_id",
	Option:     "bot.body.NewBodyModel",
	OptionKeys: []string{"name", "type"},
}

var brainRelation = orm.Relation{
	Field:      "brain_id",
	Option:     "bot.brain.NewBrainModel",
	OptionKeys: []string{"name", "key"},
}

var thinkRelation = orm.Relation{
	Field:      "think_id",
	Option:     "bot.brain.NewThinkModel",
	OptionKeys: []string{"name", "key"},
}

var versionRelation = orm.Relation{
	Field:      "version_id",
	Option:     "bot.asset.NewVersionModel",
	OptionKeys: []string{"version", "created_at"},
}

var assetRelation = orm.Relation{
	Field:      "asset_id",
	Option:     "bot.asset.NewAssetModel",
	OptionKeys: []string{"name", "kind", "status"},
}

var runRelation = orm.Relation{
	Field:      "run_id",
	Option:     "bot.brain.NewRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var nodeRunRelation = orm.Relation{
	Field:      "node_run_id",
	Option:     "bot.brain.NewNodeRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var releaseRelation = orm.Relation{
	Field:      "release_id",
	Option:     "bot.brain.NewBrainReleaseModel",
	OptionKeys: []string{"version", "status"},
}

type Asset struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:资产ID"`
	ProjectID uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID   uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Kind      string    `dorm:"type:varchar(32);not null;default:'text';comment:产物类型"`
	VersionID uint64    `dorm:"type:bigint;not null;default:0;comment:当前版本"`
	Status    string    `dorm:"type:varchar(32);not null;default:'draft';comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type AssetIndex struct {
	ProjectStatus struct{} `index:"project_id,status,sort,id"`
	ProjectThink  struct{} `index:"project_id,think_id,status,sort,id"`
	BodyStatus    struct{} `index:"body_id,status,sort,id"`
	BrainStatus   struct{} `index:"brain_id,status,sort,id"`
	ThinkStatus   struct{} `index:"think_id,status,sort,id"`
	Version       struct{} `index:"version_id"`
}

func NewAssetModel() *orm.Model[Asset] {
	return orm.LoadModel[Asset]("资产", "bot_asset", orm.ModelConfig{
		Index:    AssetIndex{},
		Order:    "sort asc,id desc",
		Database: "default",
		Options: map[string]any{
			"kind":   kindOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			bodyRelation,
			brainRelation,
			thinkRelation,
			versionRelation,
		},
	})
}
