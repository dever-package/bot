package provider

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const mcpTimeout = 60 * time.Second

type mcpServer struct {
	Key     string
	Command string
	Args    []string
	Tools   []string
}

type mcpMessage struct {
	JSONRPC string         `json:"jsonrpc"`
	ID      int            `json:"id,omitempty"`
	Method  string         `json:"method,omitempty"`
	Params  map[string]any `json:"params,omitempty"`
	Result  any            `json:"result,omitempty"`
	Error   any            `json:"error,omitempty"`
}

func mcpCallTool(loaded map[string]agentskill.Entry, runtime SkillRuntime) Tool {
	return Tool{
		Definition: Definition{
			Name:        "mcp_call",
			Description: "调用已加载技能声明的 MCP 工具。",
			Parameters: objectParameters(map[string]any{
				"skill":     skillProperty(),
				"server":    map[string]any{"type": "string", "description": "MCP 服务标识"},
				"tool":      map[string]any{"type": "string", "description": "MCP 工具名称"},
				"arguments": map[string]any{"type": "object", "additionalProperties": true},
				"target":    map[string]any{"type": "string", "description": "配置目标"},
			}, "server", "tool"),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			server, err := resolveMCPServer(entry, argumentText(call.Arguments, "server"), argumentText(call.Arguments, "tool"))
			if err != nil {
				return Result{}, err
			}
			target := argumentText(call.Arguments, "target")
			if missing := agentskill.MissingRequiredConfig(ctx, entry.ID, entry.Manifest, target); len(missing) > 0 {
				text := "该技能需要补充配置后才能调用 MCP: " + strings.Join(missing, ", ")
				return Result{Text: text, Content: map[string]any{
					"kind": "missing_config", "skill": entry.Key, "target": target, "required": missing,
				}}, nil
			}
			configEnv, err := agentskill.LoadConfigEnv(ctx, entry.ID, target)
			if err != nil {
				return Result{}, err
			}
			result, err := callMCP(ctx, runtime, entry, server, argumentText(call.Arguments, "tool"), argumentMap(call.Arguments, "arguments"), configEnv.Env)
			if err != nil {
				return Result{}, fmt.Errorf("%s", agentskill.RedactSecrets(err.Error(), configEnv.Secrets))
			}
			result = redactSkillSecrets(result, configEnv.Secrets)
			content := map[string]any{"skill": entry.Key, "server": server.Key, "tool": argumentText(call.Arguments, "tool"), "result": result}
			return Result{Text: truncateRunes(agentskill.JSONText(result), 4000), Content: content}, nil
		},
	}
}

func resolveMCPServer(entry agentskill.Entry, serverKey string, toolName string) (mcpServer, error) {
	for _, server := range manifestMCPServers(entry.Manifest) {
		if server.Key != strings.TrimSpace(serverKey) {
			continue
		}
		if !containsString(server.Tools, strings.TrimSpace(toolName)) {
			return mcpServer{}, fmt.Errorf("MCP server %s 未声明 tool: %s", serverKey, toolName)
		}
		if server.Command == "" {
			return mcpServer{}, fmt.Errorf("MCP server %s 未声明 command", serverKey)
		}
		return server, nil
	}
	return mcpServer{}, fmt.Errorf("技能 %s 未声明 MCP server: %s", entry.Key, serverKey)
}

func manifestMCPServers(manifest string) []mcpServer {
	payload := agentskill.ParseManifestMap(manifest)
	raw := payload["mcp"]
	items, ok := raw.([]any)
	if !ok {
		if single, singleOK := raw.(map[string]any); singleOK {
			items = []any{single}
		}
	}
	result := make([]mcpServer, 0, len(items))
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := strings.TrimSpace(fmt.Sprint(argumentValue(mapped, "key", "name")))
		if key == "" || key == "<nil>" {
			continue
		}
		result = append(result, mcpServer{
			Key:     key,
			Command: cleanManifestText(argumentValue(mapped, "command", "cmd")),
			Args:    manifestStrings(argumentValue(mapped, "args", "arguments")),
			Tools:   manifestStrings(mapped["tools"]),
		})
	}
	return result
}

func callMCP(ctx context.Context, runtime SkillRuntime, entry agentskill.Entry, server mcpServer, toolName string, arguments map[string]any, env []string) (any, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, mcpTimeout)
	defer cancel()
	commandName, commandArgs, err := mcpCommand(entry, server, runtime.Sandbox.Driver)
	if err != nil {
		return nil, err
	}
	process, err := sandbox.PrepareProcess(runtime.Sandbox, sandbox.Request{
		SkillRoot: entry.InstallPath, TempRoot: runtime.TempRoot, Env: env, Timeout: mcpTimeout,
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
	defer func() {
		if command.Process != nil {
			_ = command.Process.Kill()
		}
		_ = command.Wait()
	}()
	reader := bufio.NewReader(stdout)
	if err := writeMCPMessage(stdin, mcpMessage{
		JSONRPC: "2.0", ID: 1, Method: "initialize",
		Params: map[string]any{
			"protocolVersion": "2024-11-05",
			"capabilities":    map[string]any{},
			"clientInfo":      map[string]any{"name": "dever-bot", "version": "0.1.0"},
		},
	}); err != nil {
		return nil, err
	}
	if _, err := readMCPResult(reader, 1); err != nil {
		return nil, appendMCPStderr(err, stderr)
	}
	_ = writeMCPMessage(stdin, mcpMessage{JSONRPC: "2.0", Method: "notifications/initialized", Params: map[string]any{}})
	if err := writeMCPMessage(stdin, mcpMessage{
		JSONRPC: "2.0", ID: 2, Method: "tools/call",
		Params: map[string]any{"name": toolName, "arguments": arguments},
	}); err != nil {
		return nil, err
	}
	result, err := readMCPResult(reader, 2)
	if err != nil {
		return nil, appendMCPStderr(err, stderr)
	}
	_ = stdin.Close()
	return result, nil
}

func mcpCommand(entry agentskill.Entry, server mcpServer, sandboxDriver string) (string, []string, error) {
	command := strings.TrimSpace(server.Command)
	args := append([]string(nil), server.Args...)
	if strings.Contains(command, "/") || strings.HasPrefix(command, ".") {
		path, relative, err := safeSkillPath(entry, command)
		if err != nil {
			return "", nil, err
		}
		runPath := path
		if sandboxDriver == sandbox.DriverBwrap {
			runPath = "/skill/" + strings.TrimPrefix(filepath.ToSlash(relative), "/")
		}
		return sandbox.ScriptCommandForPath(runPath, path, args)
	}
	resolved, err := exec.LookPath(command)
	if err != nil {
		return "", nil, fmt.Errorf("MCP command 不可用: %s", command)
	}
	return resolved, args, nil
}

func writeMCPMessage(writer io.Writer, message mcpMessage) error {
	raw, err := json.Marshal(message)
	if err != nil {
		return err
	}
	_, err = writer.Write(append(raw, '\n'))
	return err
}

func readMCPResult(reader *bufio.Reader, id int) (any, error) {
	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			return nil, err
		}
		var message mcpMessage
		if err := json.Unmarshal(bytes.TrimSpace(line), &message); err != nil || message.ID != id {
			continue
		}
		if message.Error != nil {
			return nil, fmt.Errorf("MCP error: %v", message.Error)
		}
		return message.Result, nil
	}
}

func appendMCPStderr(err error, stderr *bytes.Buffer) error {
	if text := strings.TrimSpace(stderr.String()); text != "" {
		return fmt.Errorf("%s: %s", err.Error(), text)
	}
	return err
}

func redactSkillSecrets(value any, secrets []string) any {
	switch current := value.(type) {
	case string:
		return agentskill.RedactSecrets(current, secrets)
	case []any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, redactSkillSecrets(item, secrets))
		}
		return result
	case map[string]any:
		result := make(map[string]any, len(current))
		for key, item := range current {
			result[key] = redactSkillSecrets(item, secrets)
		}
		return result
	default:
		return value
	}
}

func manifestStrings(value any) []string {
	items, ok := value.([]any)
	if !ok {
		return nil
	}
	result := make([]string, 0, len(items))
	for _, item := range items {
		if text := cleanManifestText(item); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func cleanManifestText(value any) string {
	text := strings.TrimSpace(fmt.Sprint(value))
	if text == "<nil>" {
		return ""
	}
	return text
}

func containsString(values []string, target string) bool {
	for _, value := range values {
		if strings.TrimSpace(value) == target {
			return true
		}
	}
	return false
}
