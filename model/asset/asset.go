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
	{"id": KindMixed, "value": "富文本"},
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

var teamRelation = orm.Relation{
	Field:      "team_id",
	Option:     "bot.team.NewTeamModel",
	OptionKeys: []string{"name", "key"},
}

var flowRelation = orm.Relation{
	Field:      "flow_id",
	Option:     "bot.team.NewFlowModel",
	OptionKeys: []string{"name", "key"},
}

var assetCateRelation = orm.Relation{
	Field:      "asset_cate_id",
	Option:     "bot.team.NewAssetCateModel",
	OptionKeys: []string{"name", "kind", "cardinality"},
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
	Option:     "bot.team.NewRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var nodeRunRelation = orm.Relation{
	Field:      "node_run_id",
	Option:     "bot.team.NewNodeRunModel",
	OptionKeys: []string{"request_id", "status"},
}

var releaseRelation = orm.Relation{
	Field:      "release_id",
	Option:     "bot.team.NewTeamReleaseModel",
	OptionKeys: []string{"version", "status"},
}

type Asset struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:资产ID"`
	ProjectID   uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	BodyID      uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	TeamID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID      uint64    `dorm:"type:bigint;not null;default:0;comment:工作流"`
	AssetCateID uint64    `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Kind        string    `dorm:"type:varchar(32);not null;default:'text';comment:产物类型"`
	VersionID   uint64    `dorm:"type:bigint;not null;default:0;comment:当前版本"`
	Status      string    `dorm:"type:varchar(32);not null;default:'draft';comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type AssetIndex struct {
	ProjectStatus   struct{} `index:"project_id,status,sort,id"`
	ProjectFlow     struct{} `index:"project_id,flow_id,status,sort,id"`
	BodyStatus      struct{} `index:"body_id,status,sort,id"`
	TeamStatus      struct{} `index:"team_id,status,sort,id"`
	FlowStatus      struct{} `index:"flow_id,status,sort,id"`
	AssetCateStatus struct{} `index:"asset_cate_id,status,sort,id"`
	Version         struct{} `index:"version_id"`
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
			teamRelation,
			flowRelation,
			assetCateRelation,
			versionRelation,
		},
	})
}
