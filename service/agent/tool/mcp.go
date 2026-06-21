package tool

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	agentskill "github.com/dever-package/bot/service/agent/skill"
	"github.com/dever-package/bot/service/agent/tool/sandbox"
)

const mcpCallTimeout = 60 * time.Second

type mcpServerSpec struct {
	Key     string
	Command string
	Args    []string
	Tools   []string
}

type rpcMessage struct {
	JSONRPC string         `json:"jsonrpc"`
	ID      int            `json:"id,omitempty"`
	Method  string         `json:"method,omitempty"`
	Params  map[string]any `json:"params,omitempty"`
	Result  any            `json:"result,omitempty"`
	Error   any            `json:"error,omitempty"`
}

func executeMCPCall(ctx context.Context, req Request) (map[string]any, error) {
	entry, err := resolveSkill(req.Loaded, req.Action.Skill)
	if err != nil {
		return nil, err
	}
	serverKey := inputText(firstPresent(req.Action.Input, "server", "name"))
	toolName := inputText(firstPresent(req.Action.Input, "tool", "method"))
	if serverKey == "" || toolName == "" {
		return nil, fmt.Errorf("mcp_call 需要提供 server 和 tool")
	}
	server, err := resolveMCPServer(entry, serverKey, toolName)
	if err != nil {
		return nil, err
	}
	arguments := inputMap(firstPresent(req.Action.Input, "arguments", "args", "input"))
	target := inputText(firstPresent(req.Action.Input, "target", "target_key", "targetKey"))
	if missing := agentskill.MissingRequiredConfig(ctx, entry.ID, entry.Manifest, target); len(missing) > 0 {
		return map[string]any{
			"kind":     "missing_config",
			"skill":    entry.Key,
			"target":   target,
			"required": missing,
			"message":  "该技能需要补充配置后才能调用 MCP。",
			"text":     "该技能需要补充配置后才能调用 MCP: " + strings.Join(missing, ", "),
		}, nil
	}
	configEnv, err := agentskill.LoadConfigEnv(ctx, entry.ID, target)
	if err != nil {
		return nil, err
	}
	result, err := callStdioMCP(ctx, req, entry, server, toolName, arguments, configEnv.Env)
	if err != nil {
		return nil, fmt.Errorf("%s", agentskill.RedactSecrets(err.Error(), configEnv.Secrets))
	}
	result = redactSecretValue(result, configEnv.Secrets)
	text := truncateText(agentskill.JSONText(result), maxFileBytes)
	return map[string]any{
		"server": server.Key,
		"tool":   toolName,
		"result": result,
		"text":   text,
	}, nil
}

func resolveMCPServer(entry agentskill.Entry, serverKey string, toolName string) (mcpServerSpec, error) {
	servers, err := manifestMCPServers(entry.Manifest)
	if err != nil {
		return mcpServerSpec{}, err
	}
	for _, server := range servers {
		if server.Key != serverKey {
			continue
		}
		if !mcpToolAllowed(server, toolName) {
			return mcpServerSpec{}, fmt.Errorf("MCP server %s 未声明 tool: %s", serverKey, toolName)
		}
		if strings.TrimSpace(server.Command) == "" {
			return mcpServerSpec{}, fmt.Errorf("MCP server %s 未声明 command", serverKey)
		}
		return server, nil
	}
	return mcpServerSpec{}, fmt.Errorf("当前技能未声明 MCP server: %s", serverKey)
}

func manifestMCPServers(manifest string) ([]mcpServerSpec, error) {
	payload := map[string]any{}
	if err := json.Unmarshal([]byte(strings.TrimSpace(manifest)), &payload); err != nil {
		return nil, fmt.Errorf("技能 manifest 无效")
	}
	raw, exists := payload["mcp"]
	if !exists {
		return nil, nil
	}
	items, ok := raw.([]any)
	if !ok {
		if single, ok := raw.(map[string]any); ok {
			items = []any{single}
		} else {
			return nil, fmt.Errorf("manifest.mcp 必须是对象数组")
		}
	}
	servers := make([]mcpServerSpec, 0, len(items))
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := inputText(firstPresent(mapped, "key", "name"))
		if key == "" {
			continue
		}
		servers = append(servers, mcpServerSpec{
			Key:     key,
			Command: inputText(firstPresent(mapped, "command", "cmd")),
			Args:    inputStringSlice(firstPresent(mapped, "args", "arguments")),
			Tools:   inputStringSlice(firstPresent(mapped, "tools")),
		})
	}
	return servers, nil
}

func mcpToolAllowed(server mcpServerSpec, toolName string) bool {
	if len(server.Tools) == 0 {
		return false
	}
	for _, item := range server.Tools {
		if strings.TrimSpace(item) == toolName {
			return true
		}
	}
	return false
}

func callStdioMCP(ctx context.Context, req Request, entry agentskill.Entry, server mcpServerSpec, toolName string, arguments map[string]any, env []string) (any, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, mcpCallTimeout)
	defer cancel()

	if err := os.MkdirAll(req.TempRoot, 0o755); err != nil {
		return nil, err
	}
	commandName, commandArgs, err := mcpCommand(entry, server, req.Options.ScriptSandbox.Driver)
	if err != nil {
		return nil, err
	}
	process, err := sandbox.PrepareProcess(req.Options.ScriptSandbox, sandbox.Request{
		SkillRoot: strings.TrimSpace(entry.InstallPath),
		TempRoot:  req.TempRoot,
		Env:       env,
		Timeout:   mcpCallTimeout,
	}, commandName, commandArgs)
	if err != nil {
		return nil, err
	}
	command := exec.CommandContext(timeoutCtx, process.CommandName, process.CommandArgs...)
	command.Dir = process.WorkDir
	command.Env = process.Env
	stdin, err := command.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := command.StdoutPipe()
	if err != nil {
		return nil, err
	}
	stderr := &bytes.Buffer{}
	command.Stderr = stderr
	if err := command.Start(); err != nil {
		return nil, err
	}
	defer command.Process.Kill()

	reader := bufio.NewReader(stdout)
	if err := writeRPC(stdin, rpcMessage{
		JSONRPC: "2.0",
		ID:      1,
		Method:  "initialize",
		Params: map[string]any{
			"protocolVersion": "2024-11-05",
			"capabilities":    map[string]any{},
			"clientInfo": map[string]any{
				"name":    "dever-bot",
				"version": "0.1.0",
			},
		},
	}); err != nil {
		return nil, err
	}
	if _, err := readRPCResult(reader, 1); err != nil {
		return nil, mcpError(err, stderr)
	}
	_ = writeRPC(stdin, rpcMessage{
		JSONRPC: "2.0",
		Method:  "notifications/initialized",
		Params:  map[string]any{},
	})
	if err := writeRPC(stdin, rpcMessage{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "tools/call",
		Params: map[string]any{
			"name":      toolName,
			"arguments": arguments,
		},
	}); err != nil {
		return nil, err
	}
	result, err := readRPCResult(reader, 2)
	if err != nil {
		return nil, mcpError(err, stderr)
	}
	_ = stdin.Close()
	if command.Process != nil {
		_ = command.Process.Kill()
	}
	_ = command.Wait()
	return result, nil
}

func mcpCommand(entry agentskill.Entry, server mcpServerSpec, sandboxDriver string) (string, []string, error) {
	command := strings.TrimSpace(server.Command)
	if command == "" {
		return "", nil, fmt.Errorf("MCP command 不能为空")
	}
	args := append([]string{}, server.Args...)
	if strings.Contains(command, "/") || strings.HasPrefix(command, ".") {
		path, relative, err := safeSkillPath(entry, command)
		if err != nil {
			return "", nil, err
		}
		runPath := path
		if sandboxDriver == sandbox.DriverBwrap {
			runPath = "/skill/" + strings.TrimPrefix(filepath.ToSlash(relative), "/")
		}
		ext := strings.ToLower(filepath.Ext(runPath))
		switch ext {
		case ".py":
			return "python3", append([]string{runPath}, args...), nil
		case ".js":
			return "node", append([]string{runPath}, args...), nil
		case ".sh":
			return "/bin/sh", append([]string{runPath}, args...), nil
		case ".bash":
			return "/bin/bash", append([]string{runPath}, args...), nil
		default:
			return runPath, args, nil
		}
	}
	resolved, err := exec.LookPath(command)
	if err != nil {
		return "", nil, fmt.Errorf("MCP command 不可用: %s", command)
	}
	return resolved, args, nil
}

func writeRPC(writer io.Writer, message rpcMessage) error {
	raw, err := json.Marshal(message)
	if err != nil {
		return err
	}
	raw = append(raw, '\n')
	_, err = writer.Write(raw)
	return err
}

func readRPCResult(reader *bufio.Reader, id int) (any, error) {
	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			return nil, err
		}
		line = bytes.TrimSpace(line)
		if len(line) == 0 {
			continue
		}
		var message rpcMessage
		if err := json.Unmarshal(line, &message); err != nil {
			continue
		}
		if message.ID != id {
			continue
		}
		if message.Error != nil {
			return nil, fmt.Errorf("MCP error: %v", message.Error)
		}
		return message.Result, nil
	}
}

func mcpError(err error, stderr *bytes.Buffer) error {
	if stderr != nil && strings.TrimSpace(stderr.String()) != "" {
		return fmt.Errorf("%s: %s", err.Error(), strings.TrimSpace(stderr.String()))
	}
	return err
}

func redactSecretValue(value any, secrets []string) any {
	if len(secrets) == 0 {
		return value
	}
	switch typed := value.(type) {
	case string:
		return agentskill.RedactSecrets(typed, secrets)
	case []any:
		result := make([]any, 0, len(typed))
		for _, item := range typed {
			result = append(result, redactSecretValue(item, secrets))
		}
		return result
	case map[string]any:
		result := make(map[string]any, len(typed))
		for key, item := range typed {
			result[key] = redactSecretValue(item, secrets)
		}
		return result
	default:
		return value
	}
}
