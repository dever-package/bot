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
		OptionKeys: []string{"name"},
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
			"content":     "你根据当前页面上下文、表单字段、已有值和用户输入，生成可直接使用的内容或给出清晰建议。需要填表或打开页面时返回受控的 front-action，由前端自动执行安全页面动作；保存、提交、删除等高风险动作仍由用户手动确认。",
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
			"content":     "不能编造页面不存在的字段、按钮、接口或结果；不能直接保存、删除、提交或批量修改数据；不能处理密码、token、密钥等敏感内容；页面填充和打开页面等安全动作只能通过 front-action 受控执行。",
			"status":      1,
		},
		{
			"id":          201,
			"agent_id":    SkillInstallerAgentID,
			"type":        "identity",
			"load_mode":   "always",
			"description": "定义技能安装规划器的身份定位。",
			"content":     "你是系统内置的技能安装规划器。你只负责理解用户的技能安装输入，并输出后端可校验的安装计划 JSON。",
			"status":      1,
		},
		{
			"id":          202,
			"agent_id":    SkillInstallerAgentID,
			"type":        "responsibility",
			"load_mode":   "always",
			"description": "定义技能安装规划器的职责范围。",
			"content":     "你需要识别 GitHub 仓库、npx skills add、SkillHub 安装说明、curl 安装说明或自然语言安装任务，生成最小可执行步骤。计划必须让后端最终扫描到一个或多个 SKILL.md。",
			"status":      1,
		},
		{
			"id":          203,
			"agent_id":    SkillInstallerAgentID,
			"type":        "guardrail",
			"load_mode":   "always",
			"description": "定义技能安装规划器的安全边界。",
			"content":     "不要输出 sudo、后台常驻进程、删除根目录、读取密钥或写入系统目录的命令。无法形成安全计划时，输出空 steps 并在 summary 说明原因。",
			"status":      1,
		},
		{
			"id":          301,
			"agent_id":    SkillCreatorAgentID,
			"type":        "identity",
			"load_mode":   "always",
			"description": "定义技能创建工程师的身份定位。",
			"content":     "你是 Dever skill 创建工程师，负责把用户的自然语言需求整理成可保存的技能草稿 patch。你只创建或修改草稿，不安装第三方 skill，不发布正式 skill。",
			"status":      1,
		},
		{
			"id":          302,
			"agent_id":    SkillCreatorAgentID,
			"type":        "responsibility",
			"load_mode":   "always",
			"description": "定义技能创建工程师的职责范围。",
			"content":     "你根据本轮输入、历史会话和 input.draft 当前草稿快照，生成或修改 SKILL.md、manifest、scripts/*、references/*。第三方来源文件只能进入 references/source/；真正可执行能力必须包装到 scripts/ 并在 manifest.scripts 声明。",
			"status":      1,
		},
		{
			"id":          303,
			"agent_id":    SkillCreatorAgentID,
			"type":        "guardrail",
			"load_mode":   "always",
			"description": "定义技能创建工程师的安全边界。",
			"content":     "不要把真实 cookie、token、api key、secret、私钥或验证码写入 SKILL.md、manifest、files_json、日志或回答。需要密钥时只在 manifest.config 声明配置项。脚本只能放在 scripts/，参考资料只能放在 references/。manifest.mcp 必须显式声明 tools allowlist。不要生成 sudo、后台常驻进程、删除系统目录或读取项目外文件的脚本。",
			"status":      1,
		},
		{
			"id":          304,
			"agent_id":    SkillCreatorAgentID,
			"type":        "output",
			"load_mode":   "always",
			"description": "定义技能草稿 patch 输出协议。",
			"content": settingText(
				"信息不足时先用普通回复提出最少的问题，不输出 agent-result，也不要输出空 patch。",
				"信息足够、用户明确要求生成或更新草稿时，输出一个 agent-result，kind 固定为 skill_draft_patch。",
				"json.patch 只允许包含 key、name、description、skill_md、files_json、manifest、pack_id、cate_id。",
				"files_json 必须是对象，key 是相对路径，且只能使用 scripts/、references/、requirements.txt、package.json。",
				"manifest 只写 Dever 运行配置，不要把这些字段塞进 SKILL.md frontmatter。",
				"manifest.config 只声明配置 schema，可写 key、name、type、target_key、required；required=true 表示缺配置时禁止执行脚本。",
				"manifest.mcp 可声明 stdio MCP server，但每个 server 必须写 key、command、args、tools；tools 不能为空。",
				"如果只是在追问，不要输出下面的 agent-result 示例；只有生成或更新草稿时才输出。",
				"",
				"```agent-result",
				"{",
				`  "kind": "skill_draft_patch",`,
				`  "text": "已生成技能草稿，请检查后保存/测试/发布。",`,
				`  "json": {`,
				`    "draft_id": 0,`,
				`    "patch": {`,
				`      "key": "example-skill",`,
				`      "name": "示例技能",`,
				`      "description": "技能用途说明",`,
				`      "skill_md": "---\nname: 示例技能\ndescription: 技能用途说明\n---\n\n# 示例技能\n\n## Usage\n\n按用户输入选择是否使用该技能。",`,
				`      "files_json": {"scripts/run.py": "print('ok')"},`,
				`      "manifest": {"triggers": [], "config": [], "scripts": [{"key": "run", "path": "scripts/run.py", "runtime": "python"}], "source_refs": []}`,
				"    }",
				"  }",
				"}",
				"```",
			),
			"status": 1,
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
