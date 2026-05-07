package energon

import (
	"github.com/shemic/dever/orm"
)

type ParamOption struct {
	ID      uint64 `dorm:"primaryKey;autoIncrement;comment:参数选项ID"`
	ParamID uint64 `dorm:"type:bigint;not null;default:0;comment:参数"`
	Name    string `dorm:"type:varchar(128);not null;comment:选项名"`
	Value   string `dorm:"type:varchar(255);not null;comment:选项值"`
	Sort    int    `dorm:"type:int;not null;default:100;comment:排序"`
}

type ParamOptionIndex struct {
	ParamValue struct{} `unique:"param_id,value"`
	ParamSort  struct{} `index:"param_id,sort"`
}

var paramOptionParamRelation = orm.Relation{
	Field:      "param_id",
	Option:     "bot.energon.NewParamModel",
	OptionKeys: []string{"name", "key"},
}

func NewParamOptionModel() *orm.Model[ParamOption] {
	return orm.LoadModel[ParamOption]("参数选项", "bot_energon_param_option", orm.ModelConfig{
		Index:     ParamOptionIndex{},
		Order:     "sort asc,id asc",
		Database:  "default",
		Relations: []orm.Relation{paramOptionParamRelation},
	})
}
