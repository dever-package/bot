package tool

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/server"

	agentaction "github.com/dever-package/bot/service/agent/action"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	"github.com/dever-package/bot/service/agent/tool/sandbox"
)

const (
	NameHTTPRequest         = "http_request"
	NameCurlRequest         = "curl_request"
	NameListSkill           = "list_skill_files"
	NameReadSkill           = "read_skill_file"
	NameWriteTemp           = "write_temp_file"
	NameReadTemp            = "read_temp_file"
	NameRunScript           = "run_skill_script"
	NameInternalAPI         = "internal_api"
	NameMCPCall             = "mcp_call"
	NameKnowledgeTree       = "list_knowledge_tree"
	NameKnowledgeSearch     = "search_knowledge_nodes"
	NameKnowledgeOpen       = "open_knowledge_node"
	NameKnowledgeExpand     = "expand_knowledge_node"
	NameKnowledgeRelated    = "find_related_knowledge"
	NameKnowledgeDebug      = "debug_knowledge_retrieval"
	NameKnowledgeInit       = "open_knowledge_init"
	NameKnowledgeFiles      = "list_knowledge_files"
	NameKnowledgeFileSearch = "search_knowledge_files"
	NameKnowledgeFileRead   = "read_knowledge_file"
	defaultTimeoutSec       = 10
	maxTimeoutSec           = 60
	maxBodyBytes            = agentskill.HTTPMaxLen
)

type Request struct {
	RequestID   string
	Action      agentaction.Action
	Loaded      []agentskill.Entry
	TempRoot    string
	Options     Options
	Server      *server.Context
	WriteStatus func(ctx context.Context, text string, meta map[string]any) error
}

type Options struct {
	ScriptSandbox sandbox.Config
}

type handler func(context.Context, Request) (map[string]any, error)

func Execute(ctx context.Context, req Request) agentaction.Result {
	req.Action.Type = "call_tool"
	req.Action.Tool = normalizeTool(req.Action.Tool)
	if req.Action.Tool == "" {
		return toolError(req.Action, "工具不能为空")
	}
	resolved, err := resolveSkill(req.Loaded, req.Action.Skill)
	if err != nil && toolRequiresSkill(req.Action.Tool) {
		return toolError(req.Action, err.Error())
	}
	if resolved.Key != "" {
		req.Action.Skill = resolved.Key
		req.Loaded = []agentskill.Entry{resolved}
	}

	toolHandler, ok := registry()[req.Action.Tool]
	if !ok {
		return toolError(req.Action, "不支持的工具: "+req.Action.Tool)
	}
	writeStatus(req, ctx, toolStatusText(req.Action.Tool), map[string]any{
		"meta": map[string]any{
			"action": "call_tool",
			"tool":   req.Action.Tool,
			"skill":  req.Action.Skill,
		},
	})

	startedAt := time.Now()
	result, err := toolHandler(ctx, req)
	if err != nil {
		return toolError(req.Action, err.Error())
	}
	duration := time.Since(startedAt).Milliseconds()
	summary := summaryText(req.Action.Tool, result)
	output := map[string]any{
		"event":       "tool_result",
		"kind":        agentaction.KindTool,
		"tool":        req.Action.Tool,
		"skill":       req.Action.Skill,
		"duration_ms": duration,
		"result":      result,
		"text":        summary,
	}
	promoteToolDisplayOutput(output, result)
	return agentaction.Result{
		Kind:   agentaction.ResultDone,
		Action: req.Action,
		Text:   summary,
		Output: output,
	}
}

func registry() map[string]handler {
	handlers := map[string]handler{
		NameHTTPRequest:         executeHTTPRequest,
		NameCurlRequest:         executeCurlRequest,
		NameListSkill:           executeListSkillFiles,
		NameReadSkill:           executeReadSkillFile,
		NameWriteTemp:           executeWriteTempFile,
		NameReadTemp:            executeReadTempFile,
		NameRunScript:           executeRunSkillScript,
		NameInternalAPI:         executeInternalAPI,
		NameMCPCall:             executeMCPCall,
		NameKnowledgeTree:       executeKnowledgeTree,
		NameKnowledgeSearch:     executeKnowledgeSearch,
		NameKnowledgeOpen:       executeKnowledgeOpen,
		NameKnowledgeExpand:     executeKnowledgeExpand,
		NameKnowledgeRelated:    executeKnowledgeRelated,
		NameKnowledgeDebug:      executeKnowledgeDebug,
		NameKnowledgeInit:       executeKnowledgeInit,
		NameKnowledgeFiles:      executeKnowledgeFiles,
		NameKnowledgeFileSearch: executeKnowledgeFileSearch,
		NameKnowledgeFileRead:   executeKnowledgeFileRead,
	}
	for _, definition := range agentskill.BuiltinDefinitions() {
		for _, method := range definition.Methods {
			handlers[normalizeTool(method.Key)] = executeBuiltinService
		}
	}
	return handlers
}

func toolRequiresSkill(name string) bool {
	switch normalizeTool(name) {
	case NameInternalAPI, NameMCPCall,
		NameKnowledgeTree, NameKnowledgeSearch, NameKnowledgeOpen, NameKnowledgeExpand, NameKnowledgeRelated, NameKnowledgeDebug,
		NameKnowledgeInit, NameKnowledgeFiles, NameKnowledgeFileSearch, NameKnowledgeFileRead:
		return false
	default:
		return true
	}
}

func toolError(action agentaction.Action, message string) agentaction.Result {
	message = strings.TrimSpace(message)
	if message == "" {
		message = "工具调用失败"
	}
	return agentaction.Result{
		Kind:    agentaction.ResultError,
		Action:  action,
		Text:    message,
		Message: message,
		Output: map[string]any{
			"event": "tool_result",
			"kind":  agentaction.KindTool,
			"tool":  action.Tool,
			"skill": action.Skill,
			"error": message,
			"text":  message,
		},
	}
}

func writeStatus(req Request, ctx context.Context, text string, meta map[string]any) {
	if req.WriteStatus == nil {
		return
	}
	_ = req.WriteStatus(ctx, text, meta)
}

func summaryText(name string, result map[string]any) string {
	if summary := inputText(result["summary"]); summary != "" {
		return summary
	}
	if text := inputText(result["text"]); text != "" {
		return text
	}
	if body := inputText(result["body"]); body != "" {
		return truncateText(body, 1000)
	}
	if content := inputText(result["content"]); content != "" {
		return truncateText(content, 1000)
	}
	return fmt.Sprintf("%s 调用完成: %s", name, agentskill.JSONText(result))
}

func promoteToolDisplayOutput(output map[string]any, result map[string]any) {
	for _, key := range []string{"title", "rich", "content", "images", "videos", "audios", "files", "json", "result_mode", "display_mode"} {
		value, ok := result[key]
		if !ok || isEmptyToolDisplayValue(value) {
			continue
		}
		output[key] = value
	}
}

func isEmptyToolDisplayValue(value any) bool {
	if value == nil {
		return true
	}
	if text, ok := value.(string); ok {
		return strings.TrimSpace(text) == ""
	}
	if list, ok := value.([]any); ok {
		return len(list) == 0
	}
	if record, ok := value.(map[string]any); ok {
		return len(record) == 0
	}
	return false
}

func toolStatusText(name string) string {
	if isKnowledgeTool(name) {
		return "正在调用知识库"
	}
	if agentskill.IsBuiltinMethod(normalizeTool(name)) {
		return "正在调用内置工具"
	}
	return "正在调用工具"
}

func isKnowledgeTool(name string) bool {
	switch normalizeTool(name) {
	case NameKnowledgeTree, NameKnowledgeSearch, NameKnowledgeOpen, NameKnowledgeExpand, NameKnowledgeRelated, NameKnowledgeDebug,
		NameKnowledgeInit, NameKnowledgeFiles, NameKnowledgeFileSearch, NameKnowledgeFileRead:
		return true
	default:
		return false
	}
}
