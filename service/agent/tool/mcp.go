package tool

import (
	"context"
	"fmt"
)

func executeMCPCall(_ context.Context, req Request) (map[string]any, error) {
	server := inputText(firstPresent(req.Action.Input, "server", "name"))
	toolName := inputText(firstPresent(req.Action.Input, "tool", "method"))
	if server == "" || toolName == "" {
		return nil, fmt.Errorf("mcp_call 需要提供 server 和 tool")
	}
	return nil, fmt.Errorf("mcp_call 尚未接入 MCP 执行器: %s.%s", server, toolName)
}
