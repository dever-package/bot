package runtimecontext

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentrichtext "github.com/dever-package/bot/service/agent/richtext"
	runtimesessionstate "github.com/dever-package/bot/service/agent/runtime/sessionstate"
)

func buildPrompt(agentPrompt string) string {
	return strings.Join(agentPromptSections(agentPrompt), "\n\n")
}

func buildRuntimeContext(ctx context.Context, request AssembleRequest, session agentmodel.Session) map[string]any {
	result := map[string]any{}
	if request.IncludeMemory {
		if memory := strings.TrimSpace(runtimeMemoryText(ctx, session, request.Input)); memory != "" {
			result["long_term_memory"] = memory
		}
	}
	if summary, ok := runtimesessionstate.Decode(session.ContextSummary); ok {
		result["session_state"] = summary
	} else if summary := strings.TrimSpace(runtimesessionstate.Render(session.ContextSummary)); summary != "" {
		result["session_state"] = summary
	}
	return result
}

func agentPromptSections(agentPrompt string) []string {
	return appendPromptSection(nil, "智能体设定", agentrichtext.PlainText(agentPrompt))
}

func appendPromptSection(sections []string, title string, content string) []string {
	content = strings.TrimSpace(content)
	if content == "" {
		return sections
	}
	return append(sections, title+":\n"+content)
}
