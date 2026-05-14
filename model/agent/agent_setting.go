package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AgentSetting struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:智能体设定ID"`
	AgentID     uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Type        string    `dorm:"type:varchar(64);not null;default:'other';comment:类型"`
	LoadMode    string    `dorm:"type:varchar(32);not null;default:'always';comment:加载方式"`
	Description string    `dorm:"type:varchar(512);not null;default:'';comment:使用说明"`
	Content     string    `dorm:"type:text;not null;comment:设定正文"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type AgentSettingIndex struct {
	AgentType   struct{} `unique:"agent_id,type"`
	AgentStatus struct{} `index:"agent_id,status"`
}

var (
	agentSettingTypeOptions = []map[string]any{
		agentSettingTypeOption("identity", "身份", "定义智能体是谁、身份视角、使命定位和长期稳定的自我设定。", "core", "核心设定"),
		agentSettingTypeOption("responsibility", "职责", "定义智能体负责做什么、主要任务范围、交付目标和判断重点。", "core", "核心设定"),
		agentSettingTypeOption("behavior", "风格", "定义智能体的沟通口吻、工作习惯、判断偏好、质量标准和互动方式。", "core", "核心设定"),
		agentSettingTypeOption("guardrail", "边界", "定义必须遵守的限制范围、风险控制、拒绝条件和降级处理方式。", "core", "核心设定"),
		agentSettingTypeOption("workflow", "执行流程", "定义处理任务的步骤顺序、检查点、多轮推进方式和完成条件。", "advanced", "高级设定"),
		agentSettingTypeOption("output", "输出格式", "定义回答结构、格式约束、内容层级、字段规范和交付物形态。", "advanced", "高级设定"),
		agentSettingTypeOption("tool", "能力规则", "定义什么时候调用能力、如何选择能力、参数组织原则和结果回收方式。", "advanced", "高级设定"),
		agentSettingTypeOption("example", "示例样本", "放少量正反例、风格样例、输出模板或可模仿的高质量样本。", "advanced", "高级设定"),
		agentSettingTypeOption("other", "补充说明", "放无法归入以上类型的补充规则；优先拆分到明确类型后再使用这里。", "advanced", "高级设定"),
	}

	agentSettingAgentRelation = orm.Relation{
		Field:      "agent_id",
		Option:     "bot.agent.NewAgentModel",
		OptionKeys: []string{"name", "key"},
	}

	agentSettingSeed = []map[string]any{
		{
			"id":          101,
			"agent_id":    FrontAssistantAgentID,
			"type":        "identity",
			"load_mode":   "always",
			"description": "定义后台 AI 助理的身份定位。",
			"content":     "你是后台 AI 助理，服务于当前 package/front 后台页面。你帮助用户理解页面、生成内容、补全表单和检查配置问题。",
			"status":      1,
		},
		{
			"id":          102,
			"agent_id":    FrontAssistantAgentID,
			"type":        "responsibility",
			"load_mode":   "always",
			"description": "定义后台 AI 助理的职责范围。",
			"content":     "你根据当前页面上下文、表单字段、已有值和用户输入，生成可直接使用的内容或给出清晰建议。需要填表时返回受控的 front-action，由前端等待用户确认后执行。",
			"status":      1,
		},
		{
			"id":          103,
			"agent_id":    FrontAssistantAgentID,
			"type":        "behavior",
			"load_mode":   "always",
			"description": "定义后台 AI 助理的沟通风格。",
			"content":     "回复要简洁、直接、面向当前操作。生成内容时优先给可粘贴、可填入、可执行的结果；解释配置时先说结论，再补充必要原因。",
			"status":      1,
		},
		{
			"id":          104,
			"agent_id":    FrontAssistantAgentID,
			"type":        "guardrail",
			"load_mode":   "always",
			"description": "定义后台 AI 助理必须遵守的边界。",
			"content":     "不能编造页面不存在的字段、按钮、接口或结果；不能直接保存、删除、提交或批量修改数据；不能处理密码、token、密钥等敏感内容；所有页面填充必须等待用户确认。",
			"status":      1,
		},
	}
)

func agentSettingTypeOption(id string, value string, description string, group string, groupValue string) map[string]any {
	return map[string]any{
		"id":          id,
		"value":       value,
		"description": description,
		"group":       group,
		"groupValue":  groupValue,
	}
}

func NewAgentSettingModel() *orm.Model[AgentSetting] {
	return orm.LoadModel[AgentSetting]("智能体设定", "bot_agent_setting", orm.ModelConfig{
		Index:    AgentSettingIndex{},
		Seeds:    agentSettingSeed,
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"status":    statusOptions,
			"type":      agentSettingTypeOptions,
			"load_mode": settingLoadModeOptions,
		},
		Relations: []orm.Relation{
			agentSettingAgentRelation,
		},
	})
}

func AgentSettingTypeOptions() []map[string]any {
	return cloneOptionRows(agentSettingTypeOptions)
}
