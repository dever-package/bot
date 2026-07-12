package runtimecontext

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentrichtext "github.com/dever-package/bot/service/agent/richtext"
)

func buildPrompt(ctx context.Context, request AssembleRequest, session agentmodel.Session) string {
	sections := basePromptSections(request.CategoryPrompt, request.Agent.Prompt)
	sections = appendPromptSection(sections, "长期记忆", runtimeMemoryText(ctx, session.ID, request.Input))
	sections = appendPromptSection(sections, "较早对话摘要", session.ContextSummary)
	sections = appendPromptSection(sections, "本轮引用", request.ReferencePrompt)
	return strings.Join(sections, "\n\n")
}

func buildInternalPrompt(request InternalAssembleRequest) string {
	return strings.Join(basePromptSections(request.CategoryPrompt, request.Agent.Prompt), "\n\n")
}

func basePromptSections(categoryPrompt string, agentPrompt string) []string {
	sections := make([]string, 0, 2)
	sections = appendPromptSection(sections, "通用设定", agentrichtext.PlainText(categoryPrompt))
	return appendPromptSection(sections, "智能体设定", agentrichtext.PlainText(agentPrompt))
}

func appendPromptSection(sections []string, title string, content string) []string {
	content = strings.TrimSpace(content)
	if content == "" {
		return sections
	}
	return append(sections, title+":\n"+content)
}
