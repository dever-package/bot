package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	FunctionCodeWorks    = "works"
	FunctionCodeDialogue = "dialogue"
	FunctionCodeTool     = "function"
	FunctionCodeAssets   = "assets"
	FunctionCodePoints   = "points"
	FunctionCodeMessages = "messages"
)

var functionCodeOptions = []map[string]any{
	{"id": FunctionCodeWorks, "value": "创作"},
	{"id": FunctionCodeDialogue, "value": "对话"},
	{"id": FunctionCodeTool, "value": "工具"},
	{"id": FunctionCodeAssets, "value": "资产"},
	{"id": FunctionCodePoints, "value": "积分"},
	{"id": FunctionCodeMessages, "value": "消息"},
}

type Function struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:功能ID"`
	Code      string    `dorm:"type:varchar(32);not null;comment:固定入口"`
	Name      string    `dorm:"type:varchar(64);not null;comment:显示名称"`
	Icon      string    `dorm:"type:varchar(64);not null;comment:系统图标"`
	IconImage string    `dorm:"type:text;not null;default:'';comment:上传图标"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type FunctionIndex struct {
	Code       struct{} `unique:"code"`
	StatusSort struct{} `index:"status,sort,id"`
}

var defaultFunctions = []Function{
	{ID: 1, Code: FunctionCodeWorks, Name: "创作", Icon: "file-stack", Status: StatusEnabled, Sort: 10},
	{ID: 2, Code: FunctionCodeDialogue, Name: "对话", Icon: "messages-square", Status: StatusEnabled, Sort: 20},
	{ID: 3, Code: FunctionCodeTool, Name: "工具", Icon: "zap", Status: StatusEnabled, Sort: 30},
	{ID: 4, Code: FunctionCodeAssets, Name: "资产", Icon: "archive", Status: StatusEnabled, Sort: 40},
	{ID: 5, Code: FunctionCodePoints, Name: "积分", Icon: "sparkles", Status: StatusEnabled, Sort: 50},
	{ID: 6, Code: FunctionCodeMessages, Name: "消息", Icon: "bell", Status: StatusEnabled, Sort: 60},
}

var functionSeed = buildFunctionSeed(defaultFunctions)

func NewFunctionModel() *orm.Model[Function] {
	return orm.LoadModel[Function]("Body功能", "bot_body_function", orm.ModelConfig{
		Index:    FunctionIndex{},
		Order:    "sort asc,id asc",
		Seeds:    functionSeed,
		Database: "default",
		Options: map[string]any{
			"code":   functionCodeOptions,
			"status": statusOptions,
		},
	})
}

func DefaultFunctions() []Function {
	result := make([]Function, len(defaultFunctions))
	copy(result, defaultFunctions)
	return result
}

func buildFunctionSeed(rows []Function) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, map[string]any{
			"id":         row.ID,
			"code":       row.Code,
			"name":       row.Name,
			"icon":       row.Icon,
			"icon_image": row.IconImage,
			"status":     row.Status,
			"sort":       row.Sort,
		})
	}
	return result
}
