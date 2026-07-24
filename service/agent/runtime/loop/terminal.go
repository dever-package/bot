package loop

import (
	"context"
	"fmt"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func validateTerminalCall(ctx context.Context, state *runState, call botprotocol.ToolCall) error {
	if state == nil {
		return nil
	}
	name := strings.ToLower(strings.TrimSpace(call.Name))
	if isTerminalToolName(name) && state.pendingIndex < len(state.pendingTools)-1 {
		return fmt.Errorf("终态工具必须是本轮最后一个工具调用，请先完成其他工具调用后再结束")
	}
	switch name {
	case runtimeprovider.AskUserToolName:
		if state.isDocumentWriter() {
			return fmt.Errorf("图文文档已开始生成，不能在文档中途等待用户补充信息")
		}
		return nil
	case runtimeprovider.SkillInstallPlanToolName:
		return nil
	case runtimeprovider.PresentSuggestionsToolName:
		if state.documentID > 0 &&
			(!documentHasText(ctx, state.documentID) || !state.documentDeliveryReady) &&
			!documentHasFailed(ctx, state.documentID) {
			return fmt.Errorf("图文正文尚未完整交付，不能先展示后续建议")
		}
	case runtimeprovider.ComposeDocumentToolName:
		if state.documentID > 0 {
			return fmt.Errorf("当前运行已经开始生成图文文档")
		}
	default:
		return nil
	}
	return nil
}

func isTerminalToolName(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case runtimeprovider.AskUserToolName,
		runtimeprovider.PresentSuggestionsToolName,
		runtimeprovider.SkillInstallPlanToolName:
		return true
	default:
		return false
	}
}
