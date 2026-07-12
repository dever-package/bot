package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ArtifactSeriesStatusActive   int16 = 1
	ArtifactSeriesStatusArchived int16 = 2
)

var artifactSeriesStatusOptions = []map[string]any{
	{"id": ArtifactSeriesStatusActive, "value": "启用"},
	{"id": ArtifactSeriesStatusArchived, "value": "归档"},
}

type ArtifactSeries struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:系列ID"`
	OwnerType        string    `dorm:"type:varchar(32);not null;default:'admin';comment:归属类型"`
	OwnerID          uint64    `dorm:"type:bigint;not null;default:0;comment:归属账号"`
	AgentKey         string    `dorm:"type:varchar(128);not null;default:'';comment:智能体"`
	Name             string    `dorm:"type:varchar(255);not null;default:'';comment:系列名称"`
	MasterArtifactID uint64    `dorm:"type:bigint;not null;default:0;comment:主参考素材"`
	Profile          string    `dorm:"type:text;not null;default:'{}';comment:一致性配置"`
	ProfileVersion   int       `dorm:"type:int;not null;default:1;comment:配置版本"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
	UpdatedAt        time.Time `dorm:"comment:更新时间"`
}

type ArtifactSeriesIndex struct {
	OwnerStatus struct{} `index:"owner_type,owner_id,status,updated_at"`
	AgentStatus struct{} `index:"agent_key,status,updated_at"`
	Master      struct{} `index:"master_artifact_id"`
}

func NewArtifactSeriesModel() *orm.Model[ArtifactSeries] {
	return orm.LoadModel[ArtifactSeries]("智能体素材系列", "bot_agent_artifact_series", orm.ModelConfig{
		Index:    ArtifactSeriesIndex{},
		Order:    "updated_at desc,id desc",
		Database: "default",
		Options: map[string]any{
			"status": artifactSeriesStatusOptions,
		},
	})
}
