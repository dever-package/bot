package team

import (
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	assetmodel "my/package/bot/model/asset"
)

const (
	AssetCateCardinalitySingle   = "single"
	AssetCateCardinalityMultiple = "multiple"
	AssetCateCardinalityOrdered  = "ordered"
)

var assetCateKindOptions = []map[string]any{
	{"id": assetmodel.KindText, "value": "文本"},
	{"id": assetmodel.KindImage, "value": "图片"},
	{"id": assetmodel.KindAudio, "value": "音频"},
	{"id": assetmodel.KindVideo, "value": "视频"},
	{"id": assetmodel.KindFile, "value": "文件"},
	{"id": assetmodel.KindMixed, "value": "富文本"},
}

var assetCateCardinalityOptions = []map[string]any{
	{"id": AssetCateCardinalitySingle, "value": "单个"},
	{"id": AssetCateCardinalityMultiple, "value": "多个"},
	{"id": AssetCateCardinalityOrdered, "value": "有序多个"},
}

type AssetCate struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:资产分类ID"`
	TeamID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Kind        string    `dorm:"type:varchar(32);not null;default:'text';comment:产物类型"`
	Cardinality string    `dorm:"type:varchar(32);not null;default:'single';comment:数量规则"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type AssetCateIndex struct {
	TeamStatus struct{} `index:"team_id,status,sort,id"`
}

func NewAssetCateModel() *orm.Model[AssetCate] {
	return orm.LoadModel[AssetCate]("资产分类", "bot_team_asset_cate", orm.ModelConfig{
		Index:    AssetCateIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"kind":        assetCateKindOptions,
			"cardinality": assetCateCardinalityOptions,
			"status":      statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
		},
	})
}

func NormalizeAssetCateKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindImage:
		return assetmodel.KindImage
	case assetmodel.KindAudio:
		return assetmodel.KindAudio
	case assetmodel.KindVideo:
		return assetmodel.KindVideo
	case assetmodel.KindFile:
		return assetmodel.KindFile
	case assetmodel.KindMixed:
		return assetmodel.KindMixed
	default:
		return assetmodel.KindText
	}
}

func NormalizeAssetCateCardinality(cardinality string) string {
	switch strings.ToLower(strings.TrimSpace(cardinality)) {
	case AssetCateCardinalitySingle:
		return AssetCateCardinalitySingle
	case AssetCateCardinalityOrdered:
		return AssetCateCardinalityOrdered
	default:
		return AssetCateCardinalitySingle
	}
}
