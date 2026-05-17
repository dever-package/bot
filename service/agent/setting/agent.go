package setting

import (
	"math"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	energonmodel "my/package/bot/model/energon"
)

func (AgentHook) ProviderBeforeSaveAgent(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["key"] = util.ToStringTrimmed(record["key"])
	record["description"] = util.ToStringTrimmed(record["description"])
	if util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultAgentCateID
	}
	if util.ToUint64(record["setting_pack_id"]) == 0 {
		record["setting_pack_id"] = defaultAgentSettingPackID
	}
	if util.ToUint64(record["skill_pack_id"]) == 0 {
		record["skill_pack_id"] = defaultAgentSkillPackID
	}
	defaultInt16Field(record, "status", defaultAgentStatus, false)
	defaultIntField(record, "sort", defaultAgentSort, false)
	record["temperature"] = normalizeAgentTemperature(record["temperature"])
	record["timeout_seconds"] = normalizePositiveInt(record["timeout_seconds"], defaultAgentTimeout)
	record["max_auto_steps"] = normalizeNonNegativeInt(record["max_auto_steps"], defaultAgentMaxAutoSteps)

	validateAgentLLMPower(c, util.ToUint64(record["llm_power_id"]))
	return record
}

func normalizeAgentTemperature(value any) float64 {
	temperature, ok := util.ParseFloat64(value)
	if !ok {
		temperature = defaultAgentTemperature
	}
	temperature = math.Round(temperature*100) / 100
	if temperature < 0 {
		panicAgentField("form.temperature", "温度不能小于 0。")
	}
	if temperature > 2 {
		panicAgentField("form.temperature", "温度不能大于 2。")
	}
	return temperature
}

func validateAgentLLMPower(c *server.Context, powerID uint64) {
	if powerID == 0 {
		panicAgentField("form.llm_power_id", "LLM能力不能为空。")
	}
	row := energonmodel.NewPowerModel().Find(c.Context(), map[string]any{"id": powerID})
	if row == nil {
		panicAgentField("form.llm_power_id", "LLM能力不存在。")
	}
	if row.Status != 1 {
		panicAgentField("form.llm_power_id", "LLM能力已停用。")
	}
	if strings.ToLower(strings.TrimSpace(row.Kind)) != "text" {
		panicAgentField("form.llm_power_id", "LLM能力只能选择文本类型能力。")
	}
}
