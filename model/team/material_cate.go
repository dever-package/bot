package team

import (
	"strings"
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultMaterialCateID uint64 = 1

	MaterialKindPrompt = "prompt"
	MaterialKindImage  = "image"
	MaterialKindAudio  = "audio"
	MaterialKindVideo  = "video"
	// Kept for legacy records; new selections only use materialKindOptions.
	MaterialKindFile = "file"
)

var materialKindOptions = []map[string]any{
	{"id": MaterialKindPrompt, "value": "提示词"},
	{"id": MaterialKindImage, "value": "图片"},
	{"id": MaterialKindAudio, "value": "音频"},
	{"id": MaterialKindVideo, "value": "视频"},
}

var materialCateSeed = []map[string]any{
	{
		"id":     DefaultMaterialCateID,
		"name":   "通用提示词",
		"kind":   MaterialKindPrompt,
		"status": StatusEnabled,
		"sort":   1,
	},
}

type MaterialCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:素材分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Kind      string    `dorm:"type:varchar(32);not null;default:'prompt';comment:素材类型"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type MaterialCateIndex struct {
	KindStatus struct{} `index:"kind,status,sort,id"`
	StatusSort struct{} `index:"status,sort,id"`
}

func NewMaterialCateModel() *orm.Model[MaterialCate] {
	return orm.LoadModel[MaterialCate]("素材分类", "bot_material_cate", orm.ModelConfig{
		Index:    MaterialCateIndex{},
		Seeds:    materialCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"kind":   materialKindOptions,
			"status": statusOptions,
		},
	})
}

func NormalizeMaterialKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case MaterialKindImage:
		return MaterialKindImage
	case MaterialKindAudio:
		return MaterialKindAudio
	case MaterialKindVideo:
		return MaterialKindVideo
	case MaterialKindFile:
		return MaterialKindFile
	default:
		return MaterialKindPrompt
	}
}

func MaterialKindLabel(kind string) string {
	switch NormalizeMaterialKind(kind) {
	case MaterialKindImage:
		return "图片"
	case MaterialKindAudio:
		return "音频"
	case MaterialKindVideo:
		return "视频"
	case MaterialKindFile:
		return "文件"
	default:
		return "提示词"
	}
}
