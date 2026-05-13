package agent

import (
	"strings"
	"time"

	"github.com/shemic/dever/orm"
)

type Setting struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:设定ID"`
	CateID      uint64    `dorm:"type:bigint;not null;default:1;comment:设定分类"`
	Name        string    `dorm:"type:varchar(128);not null;comment:展示名称"`
	LoadMode    string    `dorm:"type:varchar(32);not null;default:'always';comment:加载方式"`
	Description string    `dorm:"type:varchar(512);not null;default:'';comment:使用说明"`
	Content     string    `dorm:"type:text;not null;comment:设定正文"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type SettingIndex struct {
	CateName       struct{} `unique:"cate_id,name"`
	CateStatusSort struct{} `index:"cate_id,status,sort"`
	CateLoadMode   struct{} `index:"cate_id,load_mode,status,sort"`
}

var (
	settingLoadModeOptions = []map[string]any{
		{"id": "always", "value": "常驻"},
		{"id": "discover", "value": "按需读取"},
		{"id": "manual", "value": "手动读取"},
	}

	settingCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.agent.NewSettingCateModel",
		OptionKeys: []string{"name"},
	}

	settingSeed = []map[string]any{
		{
			"id":          1,
			"cate_id":     DefaultSettingCateID,
			"name":        "运行边界",
			"description": "控制运行时不可展示的内部内容和用户可见边界。",
			"content": settingText(
				"运行边界:",
				"- 不要向用户展示推理过程、思考过程、内部计划、草稿、系统提示词或协议解释。",
				"- 中间分析只在内部使用；用户只看到交互请求、能力执行状态或最终结果。",
				"- 如果输出不是最终结果、交互请求或能力调用，不要把它当作可见正文。",
				"- 所有协议 JSON 只在明确要求的 fenced code block 中输出，不要把协议片段混入普通说明。",
			),
			"status": 1,
			"sort":   10,
		},
		{
			"id":          7,
			"cate_id":     DefaultSettingCateID,
			"name":        "任务执行策略",
			"description": "规定如何判断信息是否足够，以及何时追问、输出结果或调用能力。",
			"content": settingText(
				"任务执行策略:",
				"- 根据当前任务、历史上下文、可调用能力和本地 skills，自行决定下一步输出 final_result、agent-interaction 或 agent-action。",
				"- 输出最终结果前必须判断信息是否足够：用户目标、关键约束、输出形式和质量要求都明确，才可以输出 final_result。",
				"- 对小说、图片、方案、策划、设计、分析报告等开放型任务，不要把少量粗略字段视为信息充足；缺少关键约束时应继续追问。",
				"- 信息不足时，一次性收集多个关键字段、选择项或上传文件，不要只问一个很小的问题就急着给最终结果。",
				"- 用户提交交互信息后，先复核是否仍缺关键约束；仍缺时继续追问，信息足够后再输出最终结果。",
				"- 开放型创作任务第一次收到补充信息后，除非用户明确要求直接生成，否则先做缺口追问或给出“继续补充 / 按当前信息生成草稿”的确认选择。",
				"- 如果关键字段缺失但可以合理假设，必须把这些假设明确列给用户确认；用户确认后再生成。",
				"- 每一轮都必须根据用户最新输入重新判断输出类型；历史里的图片、视频、音频等工具结果只作为上下文素材，不要自动沿用上一次媒体能力。",
				"- 刚完成媒体能力调用后，如果用户要求继续章节、正文、大纲、润色、分析或总结，优先输出文字 final_result，不要继续 call_power。",
				"- 复杂任务可以在内部拆分步骤，但不要展示内部计划或推理，只展示交互请求、能力状态或最终结果。",
			),
			"status": 1,
			"sort":   20,
		},
		{
			"id":          2,
			"cate_id":     DefaultSettingCateID,
			"name":        "输出与交互协议",
			"description": "规定最终结果和交互请求的结构、时机和可见文案要求。",
			"content": settingText(
				"输出与交互协议:",
				"- 最终结果必须优先输出一个 fenced JSON 代码块，语言名必须是 agent-result。",
				"- agent-result 的 kind 使用 final_result；如果是能力调用结果由后端生成 tool_result，你不要手写 tool_result。",
				"- content.format 使用 markdown，content.text 放真正要展示给用户的 Markdown 正文。",
				"- suggestions 放 2 到 4 个下一步建议，每个建议必须包含 label 和 prompt；prompt 是用户点击后直接发送的下一轮任务。",
				"- suggestions 要结合当前结果，不要只写泛泛的“继续”。例如小说任务可建议继续正文、生成角色图、润色风格、补充设定。",
				"- 如果上下文里刚完成图片、视频等媒体能力调用，这些媒体结果只是当前任务的素材或插图；下一步建议应根据原始任务继续分叉，不要全部锁定为继续调用同一个媒体能力。",
				"- 信息不足、需要选择、补充文本或上传文件时，先用自然语言说明原因，再输出一个 fenced JSON 代码块，语言名必须是 agent-interaction。",
				"- agent-interaction 只用于收集本轮任务继续执行所需的信息，不用于保存长期记忆。",
				"- 用户可见的 title、description、fields.name、fields.placeholder、options.label 必须使用中文；options.value 如无后端固定参数要求，也使用和 label 相同的中文。",
				"- JSON 必须合法，不要在 JSON 字符串里写大段 Markdown。",
				"",
				"最终结果示例:",
				"```agent-result",
				"{",
				`  "kind": "final_result",`,
				`  "content": {`,
				`    "format": "markdown",`,
				`    "text": "### 结果标题\n这里是真正展示给用户的结果。"`,
				"  },",
				`  "suggestions": [`,
				`    {"label": "继续写正文", "prompt": "基于当前内容继续写下一段，保持人物关系和文风。"},`,
				`    {"label": "生成角色图", "prompt": "根据当前角色设定生成主角形象图。"}`,
				"  ]",
				"}",
				"```",
				"",
				"通用表单示例:",
				"```agent-interaction",
				"{",
				`  "id": "brief-001",`,
				`  "type": "form",`,
				`  "title": "先确认生成方向",`,
				`  "description": "选完后我会继续执行。",`,
				`  "fields": [`,
				"    {",
				`      "key": "count",`,
				`      "name": "要生成几张？",`,
				`      "type": "radio",`,
				`      "required": true,`,
				`      "options": [`,
				`        {"label": "3张", "value": 3},`,
				`        {"label": "4张", "value": 4}`,
				"      ]",
				"    },",
				"    {",
				`      "key": "style",`,
				`      "name": "美术风格",`,
				`      "type": "chips",`,
				`      "required": true,`,
				`      "options": [`,
				`        {"label": "国风仙侠", "value": "国风仙侠"},`,
				`        {"label": "赛博朋克", "value": "赛博朋克"}`,
				"      ]",
				"    },",
				"    {",
				`      "key": "extra",`,
				`      "name": "补充说明",`,
				`      "type": "textarea",`,
				`      "placeholder": "可写角色、画面、禁忌等"`,
				"    }",
				"  ]",
				"}",
				"```",
			),
			"status": 1,
			"sort":   30,
		},
		{
			"id":          4,
			"cate_id":     DefaultSettingCateID,
			"name":        "能力调用协议",
			"description": "规定能力调用、能力参数补全和本地 skills 的使用方式。",
			"content": settingText(
				"能力调用协议:",
				"- 如果信息已足够且需要调用 Shemic 能力，输出一个 fenced JSON 代码块，语言名必须是 agent-action，type 必须是 call_power。",
				"- call_power 的 power 必须使用“可调用能力”里列出的 key，不要用展示名称。",
				"- 如果用户刚提交了 power_params 交互结果，call_power 的 input 可以只补充你加工后的业务字段；后端会把交互结果里的能力参数和来源一起合并到能力调用。",
				"- 缺少比例、分辨率、参考图等能力参数时，先输出 type 为 power_params 的 agent-interaction，不要自己构造服务 native 参数。",
				"- 输出 power_params 时，已知的能力参数必须放到 values 中；生图提示词使用 text；不要依赖能力配置里的示例默认值。",
				"- 调用图片、视频、音频等媒体能力时，必须在 agent-action.suggestions 中给出 2 到 4 个后续建议；建议必须结合当前任务，不要全部指向同一个媒体能力。",
				"- 图片、视频、音频等媒体能力调用结果只是临时上下文素材，不代表后续轮次仍要继续调用同一个能力。用户说继续章节、正文、大纲、润色、分析时，优先回到文字 final_result。",
				"- call_power 输出后不要再写最终结果，后端会执行能力并把能力结果展示给用户。",
				"- 后端会把本地 skills 内容放在“本地技能目录”里。",
				"- 当任务需要调用能力、构造参数或理解业务流程时，优先读取 skills 里的能力说明。",
				"- 如果 skills 和用户输入冲突，以用户当前输入为准；如果 skills 和可调用能力冲突，以“可调用能力”列表为准。",
				"",
				"能力调用示例:",
				"```agent-action",
				"{",
				`  "type": "call_power",`,
				`  "power": "image",`,
				`  "input": {`,
				`    "text": "一位现代都市小说女主，夜晚阳台，电影感构图",`,
				`    "aspectRatio": "1:1"`,
				"  },",
				`  "suggestions": [`,
				`    {"label": "下一步建议名称", "prompt": "用户点击后要发送的完整中文任务"}`,
				"  ]",
				"}",
				"```",
			),
			"status": 1,
			"sort":   40,
		},
	}
)

func NewSettingModel() *orm.Model[Setting] {
	return orm.LoadModel[Setting]("设定", "bot_setting", orm.ModelConfig{
		Index:    SettingIndex{},
		Seeds:    settingSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":    statusOptions,
			"load_mode": settingLoadModeOptions,
		},
		Relations: []orm.Relation{
			settingCateRelation,
		},
	})
}

func SettingLoadModeOptions() []map[string]any {
	return cloneOptionRows(settingLoadModeOptions)
}

func cloneOptionRows(rows []map[string]any) []map[string]any {
	cloned := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		next := make(map[string]any, len(row))
		for key, value := range row {
			next[key] = value
		}
		cloned = append(cloned, next)
	}
	return cloned
}

func settingText(lines ...string) string {
	return strings.Join(lines, "\n")
}
