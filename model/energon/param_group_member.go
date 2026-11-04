package energon

import "github.com/shemic/dever/orm"

type ParamGroupMember struct {
	ID       uint64 `dorm:"primaryKey;autoIncrement;comment:组内参数ID"`
	GroupID  uint64 `dorm:"type:bigint;not null;default:0;comment:参数组"`
	ParamID  uint64 `dorm:"type:bigint;not null;default:0;comment:参数"`
	Required int16  `dorm:"type:smallint;not null;default:2;comment:必填"`
	Sort     int    `dorm:"type:int;not null;default:100;comment:排序"`
}

type ParamGroupMemberIndex struct {
	GroupParam struct{} `unique:"group_id,param_id"`
	ParamGroup struct{} `index:"param_id,group_id"`
}

func NewParamGroupMemberModel() *orm.Model[ParamGroupMember] {
	return orm.LoadModel[ParamGroupMember]("组内参数", "bot_energon_param_group_member", orm.ModelConfig{
		Index:    ParamGroupMemberIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options:  map[string]any{"required": powerParamRequiredOptions},
		Relations: []orm.Relation{{
			Field:      "param_id",
			Option:     "bot.energon.NewParamModel",
			OptionKeys: []string{"name", "key", "type"},
		}},
	})
}
