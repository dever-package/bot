package loop

import (
	"fmt"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func validateTerminalCall(state *runState, call botprotocol.ToolCall) error {
	if state == nil {
		return nil
	}
	name := strings.ToLower(strings.TrimSpace(call.Name))
	if isTerminalToolName(name) && state.pendingIndex < len(state.pendingTools)-1 {
		return fmt.Errorf("终态工具必须是本轮最后一个工具调用，请先完成其他工具调用后再结束")
	}
	switch name {
	case runtimeprovider.AskUserToolName:
		return nil
	case runtimeprovider.PresentSuggestionsToolName:
		if state.documentID > 0 {
			return fmt.Errorf("当前任务已经进入图文模式，请完成图文文档后再结束")
		}
	case runtimeprovider.ComposeDocumentToolName:
	default:
		return nil
	}
	if state.execution.agent.KnowledgeCateID > 0 && !state.knowledgeUsed {
		return fmt.Errorf("当前智能体已绑定知识库，但本轮还没有成功调用知识工具；请先读取知识库后继续完成任务")
	}
	return nil
}

func isTerminalToolName(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case runtimeprovider.AskUserToolName,
		runtimeprovider.PresentSuggestionsToolName,
		runtimeprovider.ComposeDocumentToolName:
		return true
	default:
		return false
	}
}
