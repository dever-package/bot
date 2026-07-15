package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ArtifactStatusGenerating int16 = 1
	ArtifactStatusReady      int16 = 2
	ArtifactStatusFailed     int16 = 3
)

var artifactStatusOptions = []map[string]any{
	{"id": ArtifactStatusGenerating, "value": "生成中"},
	{"id": ArtifactStatusReady, "value": "已完成"},
	{"id": ArtifactStatusFailed, "value": "失败"},
}

type Artifact struct {
	ID                uint64    `dorm:"primaryKey;autoIncrement;comment:素材ID"`
	SessionID         uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	MessageID         uint64    `dorm:"type:bigint;not null;default:0;comment:消息"`
	RunID             uint64    `dorm:"type:bigint;not null;default:0;comment:运行"`
	StepID            uint64    `dorm:"type:bigint;not null;default:0;comment:步骤"`
	DocumentID        uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	BlockID           uint64    `dorm:"type:bigint;not null;default:0;comment:内容块"`
	FileID            uint64    `dorm:"type:bigint;not null;default:0;comment:上传文件"`
	SeriesID          uint64    `dorm:"type:bigint;not null;default:0;comment:素材系列"`
	Kind              string    `dorm:"type:varchar(32);not null;default:'file';comment:素材类型"`
	DisplayNo         int       `dorm:"type:int;not null;default:0;comment:会话内编号"`
	Name              string    `dorm:"type:varchar(255);not null;default:'';comment:素材名称"`
	BatchKey          string    `dorm:"type:varchar(128);not null;default:'';comment:生成批次"`
	SourceArtifactIDs string    `dorm:"column:source_artifact_ids;type:text;not null;default:'[]';comment:来源素材"`
	Meta              string    `dorm:"type:text;not null;default:'{}';comment:生成信息"`
	Error             string    `dorm:"type:text;not null;default:'';comment:错误"`
	Status            int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt         time.Time `dorm:"comment:创建时间"`
	UpdatedAt         time.Time `dorm:"comment:更新时间"`
}

type ArtifactIndex struct {
	SessionKindNo struct{} `unique:"session_id,kind,display_no"`
	SessionID     struct{} `index:"session_id,id"`
	MessageID     struct{} `index:"message_id,id"`
	RunID         struct{} `index:"run_id,id"`
	DocumentID    struct{} `index:"document_id,id"`
	BlockID       struct{} `index:"block_id,id"`
	SeriesID      struct{} `index:"series_id,id"`
	FileID        struct{} `index:"file_id"`
	BatchKey      struct{} `index:"batch_key"`
}

func NewArtifactModel() *orm.Model[Artifact] {
	return orm.LoadModel[Artifact]("智能体素材", "bot_agent_artifact", orm.ModelConfig{
		Index:    ArtifactIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": artifactStatusOptions,
		},
	})
}
