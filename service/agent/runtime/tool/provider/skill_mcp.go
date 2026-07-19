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

const maxMCPMessageBytes = 1024 * 1024

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

type mcpSession struct {
	cancel      context.CancelFunc
	command     *exec.Cmd
	stdin       io.WriteCloser
	reader      *bufio.Reader
	stderr      *sandbox.OutputBuffer
	outputLimit int
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
			if err := requireSkillCapability(entry, agentskill.CapabilityMCP); err != nil {
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
			configEnv, err := agentskill.LoadConfigEnv(ctx, entry.ID, entry.Manifest, target)
			if err != nil {
				return Result{}, err
			}
			tempRoot, err := skillTempRoot(runtime, entry)
			if err != nil {
				return Result{}, err
			}
			currentRuntime := runtime
			currentRuntime.TempRoot = tempRoot
			currentRuntime.Sandbox, err = skillSandboxConfig(entry, runtime.Sandbox)
			if err != nil {
				return Result{}, err
			}
			result, err := callMCP(ctx, currentRuntime, entry, server, argumentText(call.Arguments, "tool"), argumentMap(call.Arguments, "arguments"), configEnv.Env)
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
	session, err := startMCPSession(ctx, runtime, entry, server, env)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	return session.request(2, "tools/call", map[string]any{"name": toolName, "arguments": arguments})
}

// SmokeTestMCPServers starts every declared server through the same runtime
// path used by mcp_call and verifies its advertised tool allowlist.
func SmokeTestMCPServers(ctx context.Context, runtime SkillRuntime, entry agentskill.Entry, env []string) ([]any, error) {
	servers := manifestMCPServers(entry.Manifest)
	results := make([]any, 0, len(servers))
	for _, server := range servers {
		session, err := startMCPSession(ctx, runtime, entry, server, env)
		if err != nil {
			return results, fmt.Errorf("MCP server %s 启动失败: %w", server.Key, err)
		}
		listed, listErr := session.request(2, "tools/list", map[string]any{})
		session.Close()
		if listErr != nil {
			return results, fmt.Errorf("MCP server %s 读取工具失败: %w", server.Key, listErr)
		}
		available := mcpToolNames(listed)
		for _, toolName := range server.Tools {
			if !containsString(available, toolName) {
				return results, fmt.Errorf("MCP server %s 未提供声明的 tool: %s", server.Key, toolName)
			}
		}
		results = append(results, map[string]any{
			"server": server.Key, "declared_tools": append([]string(nil), server.Tools...), "available_tools": available,
		})
	}
	return results, nil
}

func startMCPSession(ctx context.Context, runtime SkillRuntime, entry agentskill.Entry, server mcpServer, env []string) (*mcpSession, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, mcpTimeout)
	commandName, commandArgs, err := mcpCommand(entry, server, runtime.Sandbox.Driver)
	if err != nil {
		cancel()
		return nil, err
	}
	process, err := sandbox.PrepareProcess(runtime.Sandbox, sandbox.Request{
		SkillRoot: entry.InstallPath, TempRoot: runtime.TempRoot, Env: env, Timeout: mcpTimeout,
	}, commandName, commandArgs)
	if err != nil {
		cancel()
		return nil, err
	}
	command := exec.CommandContext(timeoutCtx, process.CommandName, process.CommandArgs...)
	command.Dir = process.WorkDir
	command.Env = process.Env
	stdin, err := command.StdinPipe()
	if err != nil {
		cancel()
		return nil, err
	}
	stdout, err := command.StdoutPipe()
	if err != nil {
		cancel()
		return nil, err
	}
	outputLimit := mcpOutputLimit(runtime.Sandbox.OutputMaxBytes)
	stderr := sandbox.NewOutputBuffer(outputLimit)
	command.Stderr = stderr
	if err := command.Start(); err != nil {
		cancel()
		return nil, err
	}
	session := &mcpSession{
		cancel: cancel, command: command, stdin: stdin,
		reader: bufio.NewReaderSize(stdout, 64*1024), stderr: stderr, outputLimit: outputLimit,
	}
	if err := writeMCPMessage(stdin, mcpMessage{
		JSONRPC: "2.0", ID: 1, Method: "initialize",
		Params: map[string]any{
			"protocolVersion": "2024-11-05",
			"capabilities":    map[string]any{},
			"clientInfo":      map[string]any{"name": "dever-bot", "version": "0.1.0"},
		},
	}); err != nil {
		session.Close()
		return nil, err
	}
	if _, err := readMCPResult(session.reader, 1, outputLimit); err != nil {
		session.Close()
		return nil, appendMCPStderr(err, stderr)
	}
	if err := writeMCPMessage(stdin, mcpMessage{JSONRPC: "2.0", Method: "notifications/initialized", Params: map[string]any{}}); err != nil {
		session.Close()
		return nil, err
	}
	return session, nil
}

func (session *mcpSession) request(id int, method string, params map[string]any) (any, error) {
	if session == nil || session.stdin == nil || session.reader == nil {
		return nil, fmt.Errorf("MCP session 未启动")
	}
	if err := writeMCPMessage(session.stdin, mcpMessage{JSONRPC: "2.0", ID: id, Method: method, Params: params}); err != nil {
		return nil, err
	}
	result, err := readMCPResult(session.reader, id, session.outputLimit)
	if err != nil {
		return nil, appendMCPStderr(err, session.stderr)
	}
	return result, nil
}

func (session *mcpSession) Close() {
	if session == nil || session.cancel == nil {
		return
	}
	_ = session.stdin.Close()
	session.cancel()
	if session.command != nil && session.command.Process != nil {
		_ = session.command.Process.Kill()
	}
	if session.command != nil {
		_ = session.command.Wait()
	}
	session.cancel = nil
}

func mcpToolNames(result any) []string {
	payload, _ := result.(map[string]any)
	items, _ := payload["tools"].([]any)
	names := make([]string, 0, len(items))
	for _, item := range items {
		tool, _ := item.(map[string]any)
		if name := cleanManifestText(tool["name"]); name != "" {
			names = append(names, name)
		}
	}
	return names
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
	if len(raw) > maxMCPMessageBytes {
		return fmt.Errorf("MCP 请求超过 %d 字节限制", maxMCPMessageBytes)
	}
	_, err = writer.Write(append(raw, '\n'))
	return err
}

func readMCPResult(reader *bufio.Reader, id int, maxBytes int) (any, error) {
	for {
		line, err := readMCPLine(reader, maxBytes)
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

func readMCPLine(reader *bufio.Reader, maxBytes int) ([]byte, error) {
	line := make([]byte, 0, min(maxBytes, 64*1024))
	for {
		fragment, err := reader.ReadSlice('\n')
		if len(line)+len(fragment) > maxBytes {
			return nil, fmt.Errorf("MCP 消息超过 %d 字节限制", maxBytes)
		}
		line = append(line, fragment...)
		switch err {
		case nil:
			return line, nil
		case bufio.ErrBufferFull:
			continue
		case io.EOF:
			if len(line) > 0 {
				return line, nil
			}
			return nil, err
		default:
			return nil, err
		}
	}
}

func mcpOutputLimit(configured int) int {
	if configured <= 0 {
		configured = sandbox.DefaultOutputMaxBytes
	}
	if configured > maxMCPMessageBytes {
		return maxMCPMessageBytes
	}
	return configured
}

func appendMCPStderr(err error, stderr *sandbox.OutputBuffer) error {
	if text := strings.TrimSpace(stderr.String()); text != "" {
		if stderr.Truncated() {
			text += "\n[MCP stderr 已截断]"
		}
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
