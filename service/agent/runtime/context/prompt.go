package runtimecontext

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func buildPrompt(ctx context.Context, request AssembleRequest, session agentmodel.Session) string {
	sections := make([]string, 0, 4)
	appendSection := func(title string, content string) {
		if content = strings.TrimSpace(content); content != "" {
			sections = append(sections, title+":\n"+content)
		}
	}
	appendSection("通用设定", RichTextPlainText(request.CategoryPrompt))
	appendSection("智能体设定", RichTextPlainText(request.Agent.Prompt))
	appendSection("长期记忆", runtimeMemoryText(ctx, session.ID, request.Input))
	appendSection("较早对话摘要", session.ContextSummary)
	return strings.Join(sections, "\n\n")
}
