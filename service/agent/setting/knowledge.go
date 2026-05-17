package setting

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"
)

func (AgentHook) ProviderBeforeSaveAgentKnowledge(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	if !partial && util.ToUint64(record["agent_id"]) == 0 {
		panicAgentField("form.agent_id", "智能体不能为空。")
	}
	trimStringField(record, "name", partial)
	trimStringField(record, "type", partial)
	trimStringField(record, "load_mode", partial)
	trimStringField(record, "description", partial)
	trimStringField(record, "content", partial)
	if shouldNormalizeField(record, "type", partial) {
		record["type"] = normalizeAgentKnowledgeType(util.ToStringTrimmed(record["type"]))
	}
	if shouldNormalizeField(record, "load_mode", partial) {
		record["load_mode"] = normalizeSettingLoadMode(util.ToStringTrimmed(record["load_mode"]))
	}
	if !partial && util.ToStringTrimmed(record["name"]) == "" {
		panicAgentField("form.name", "资料名称不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["content"]) == "" {
		panicAgentField("form.content", "资料正文不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func normalizeAgentKnowledgeType(knowledgeType string) string {
	switch strings.ToLower(strings.TrimSpace(knowledgeType)) {
	case "background":
		return "background"
	case "document", "doc":
		return "document"
	case "glossary", "term", "terms", "vocabulary":
		return "glossary"
	case "example", "sample":
		return "example"
	case "constraint", "boundary":
		return "document"
	case "state", "status", "record":
		return "state"
	case "other":
		return "other"
	default:
		return "document"
	}
}
