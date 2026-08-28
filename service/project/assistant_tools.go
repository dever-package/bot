package project

import (
	"context"
	"fmt"
	"strings"

	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

const (
	assistantToolCanvasInspect          = "canvas_inspect"
	assistantToolCanvasPreviewPatch     = "canvas_preview_patch"
	assistantToolCanvasApplyPatch       = "canvas_apply_patch"
	assistantToolCanvasPreviewExecution = "canvas_preview_execution"
	assistantToolCanvasExecute          = "canvas_execute"
	assistantToolTeamListFlows          = "team_list_flows"
	assistantToolTeamPreviewFlowRun     = "team_preview_flow_run"
	assistantToolTeamRunFlow            = "team_run_flow"
	assistantToolTeamRunStatus          = "team_run_status"
	assistantToolTeamSubmitInteraction  = "team_submit_interaction"
	assistantToolTeamPreviewRunStop     = "team_preview_run_stop"
	assistantToolTeamRunStop            = "team_run_stop"
)

type assistantToolScope struct {
	ProjectID   uint64
	CanvasID    uint64
	SessionID   uint64
	AssetCateID uint64
}

type projectAssistantTools struct {
	project   Service
	workspace WorkspaceService
	scope     assistantToolScope
	input     map[string]any
}

func init() {
	if err := runtimetool.RegisterToolProfile("project_canvas", projectCanvasToolFactory); err != nil {
		panic(err)
	}
}

func projectCanvasToolFactory(
	ctx context.Context,
	request runtimetool.ToolProfileMountRequest,
) ([]runtimeprovider.Tool, error) {
	scope := assistantToolScope{
		ProjectID:   runtimeprovider.ArgumentUint64(request.Profile.Config, "project_id"),
		CanvasID:    runtimeprovider.ArgumentUint64(request.Profile.Config, "canvas_id"),
		SessionID:   runtimeprovider.ArgumentUint64(request.Profile.Config, "session_id"),
		AssetCateID: runtimeprovider.ArgumentUint64(request.Profile.Config, "asset_cate_id"),
	}
	if scope.ProjectID == 0 || scope.CanvasID == 0 || scope.SessionID == 0 {
		return nil, fmt.Errorf("画布助手工具作用域不完整")
	}
	workspace := NewWorkspaceService()
	binding, err := workspace.ResolveAssistant(ctx, scope.ProjectID, scope.CanvasID, scope.AssetCateID)
	if err != nil {
		return nil, err
	}
	scope.AssetCateID = binding.AssetCateID
	tools := projectAssistantTools{
		project:   NewService(),
		workspace: workspace,
		scope:     scope,
		input:     cloneInput(request.Input),
	}
	return tools.mount(), nil
}

func (tools projectAssistantTools) mount() []runtimeprovider.Tool {
	return []runtimeprovider.Tool{
		tools.canvasInspectTool(),
		tools.canvasPreviewPatchTool(),
		tools.canvasApplyPatchTool(),
		tools.canvasPreviewExecutionTool(),
		tools.canvasExecuteTool(),
		tools.teamListFlowsTool(),
		tools.teamPreviewFlowRunTool(),
		tools.teamRunFlowTool(),
		tools.teamRunStatusTool(),
		tools.teamSubmitInteractionTool(),
		tools.teamPreviewRunStopTool(),
		tools.teamRunStopTool(),
	}
}

func AssistantContinuationToolName(previewToolName string) string {
	switch strings.TrimSpace(previewToolName) {
	case assistantToolCanvasPreviewPatch:
		return assistantToolCanvasApplyPatch
	case assistantToolCanvasPreviewExecution:
		return assistantToolCanvasExecute
	case assistantToolTeamPreviewFlowRun:
		return assistantToolTeamRunFlow
	case assistantToolTeamRunStatus:
		return assistantToolTeamSubmitInteraction
	case assistantToolTeamPreviewRunStop:
		return assistantToolTeamRunStop
	default:
		return ""
	}
}

func (tools projectAssistantTools) canvasInspectTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolCanvasInspect,
			Title:       "读取项目画布",
			Kind:        "canvas",
			Description: "读取当前画布、节点、连线、素材引用和可用角色/能力目录。创建或修改节点前必须先调用。",
			Parameters:  assistantObjectSchema(map[string]any{}, nil),
		},
		Handle: tools.handleCanvasInspect,
	}
}

func (tools projectAssistantTools) canvasPreviewPatchTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolCanvasPreviewPatch,
			Title:       "预览画布修改",
			Kind:        "canvas",
			Description: "预览受控画布补丁并请求用户确认，不会写入画布。只能使用 canvas_inspect 返回的真实角色、能力和流程；更新对象必须带现有 id，新增对象必须带唯一 id。",
			Parameters: assistantObjectSchema(map[string]any{
				"patch": assistantCanvasPatchSchema(),
			}, []any{"patch"}),
			ActivityParameterKeys: []string{"patch"},
		},
		Handle: tools.handleCanvasPreviewPatch,
	}
}

func (tools projectAssistantTools) canvasApplyPatchTool() runtimeprovider.Tool {
	return tools.confirmationTool(
		assistantToolCanvasApplyPatch,
		"提交画布修改",
		"仅在 canvas_preview_patch 的确认表单提交后调用。confirmation_token 必须原样使用预览结果中的值；取消时仍调用本工具，由服务端结束操作。",
		assistantActionCanvasPatch,
		tools.handleCanvasApplyPatch,
	)
}

func (tools projectAssistantTools) canvasPreviewExecutionTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolCanvasPreviewExecution,
			Title:       "预览画布运行",
			Kind:        "canvas",
			Description: "校验并预览一次画布运行，请求用户确认，不会启动运行。",
			Parameters: assistantObjectSchema(map[string]any{
				"start_node_id": map[string]any{"type": "string", "description": "开始节点 ID"},
				"single_node":   map[string]any{"type": "boolean", "description": "是否只运行当前节点"},
				"input":         map[string]any{"type": "object", "description": "运行输入"},
			}, []any{"start_node_id"}),
			ActivityParameterKeys: []string{"start_node_id", "single_node"},
		},
		Handle: tools.handleCanvasPreviewExecution,
	}
}

func (tools projectAssistantTools) canvasExecuteTool() runtimeprovider.Tool {
	return tools.confirmationTool(
		assistantToolCanvasExecute,
		"启动画布运行",
		"仅在 canvas_preview_execution 的确认表单提交后调用，使用预览返回的 confirmation_token。",
		assistantActionCanvasRun,
		tools.handleCanvasExecute,
	)
}

func (tools projectAssistantTools) teamListFlowsTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolTeamListFlows,
			Title:       "读取可调用团队流程",
			Kind:        "team",
			Description: "列出当前项目发布版本中显式允许画布助手调用的团队流程。普通问答不应调用流程；只有任务确实需要现有协作流程时才选择。",
			Parameters:  assistantObjectSchema(map[string]any{}, nil),
		},
		Handle: tools.handleTeamListFlows,
	}
}

func (tools projectAssistantTools) teamPreviewFlowRunTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolTeamPreviewFlowRun,
			Title:       "预览团队流程运行",
			Kind:        "team",
			Description: "预览一个已开放团队流程的运行输入并请求确认，不会启动流程。flow_id 必须来自 team_list_flows。",
			Parameters: assistantObjectSchema(map[string]any{
				"flow_id": map[string]any{"type": "integer", "description": "团队流程 ID"},
				"goal":    map[string]any{"type": "string", "description": "本次协作目标"},
				"input":   map[string]any{"type": "object", "description": "结构化流程输入"},
			}, []any{"flow_id", "goal"}),
			ActivityParameterKeys: []string{"flow_id", "goal"},
		},
		Handle: tools.handleTeamPreviewFlowRun,
	}
}

func (tools projectAssistantTools) teamRunFlowTool() runtimeprovider.Tool {
	return tools.confirmationTool(
		assistantToolTeamRunFlow,
		"启动团队流程",
		"仅在 team_preview_flow_run 的确认表单提交后调用，使用预览返回的 confirmation_token。",
		assistantActionFlowRun,
		tools.handleTeamRunFlow,
	)
}

func (tools projectAssistantTools) teamRunStatusTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolTeamRunStatus,
			Title:       "查询项目任务状态",
			Kind:        "team",
			Description: "查询由画布或团队流程启动的项目任务状态。run_id 与 request_id 至少提供一个。",
			Parameters: assistantObjectSchema(map[string]any{
				"run_id":     map[string]any{"type": "integer", "description": "运行 ID"},
				"request_id": map[string]any{"type": "string", "description": "请求 ID"},
			}, nil),
			ActivityParameterKeys: []string{"run_id", "request_id"},
		},
		ValidateArguments: validateAssistantRunReference,
		Handle:            tools.handleTeamRunStatus,
	}
}

func (tools projectAssistantTools) teamSubmitInteractionTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolTeamSubmitInteraction,
			Title:       "提交项目任务交互",
			Kind:        "team",
			Description: "仅在 team_run_status 返回等待交互表单、且用户提交表单后调用。run_id 与 request_id 沿用状态查询参数，交互内容由服务端从用户提交中读取。",
			Parameters: assistantObjectSchema(map[string]any{
				"run_id":     map[string]any{"type": "integer", "description": "运行 ID"},
				"request_id": map[string]any{"type": "string", "description": "请求 ID"},
			}, nil),
			ActivityParameterKeys: []string{"run_id", "request_id"},
			Execution:             runtimeprovider.ExecutionPolicy{PreventDuplicateRecovery: true},
		},
		ValidateArguments: validateAssistantRunReference,
		PrepareArguments: func(arguments map[string]any) (map[string]any, error) {
			interactionID, data := assistantInteractionPayload(tools.input)
			arguments["_interaction_id"] = interactionID
			arguments["_interaction_data"] = data
			return arguments, nil
		},
		Handle: tools.handleTeamSubmitInteraction,
	}
}

func (tools projectAssistantTools) teamPreviewRunStopTool() runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        assistantToolTeamPreviewRunStop,
			Title:       "预览停止项目任务",
			Kind:        "team",
			Description: "预览停止一个项目任务并请求用户确认，不会停止任务。",
			Parameters: assistantObjectSchema(map[string]any{
				"run_id":     map[string]any{"type": "integer", "description": "运行 ID"},
				"request_id": map[string]any{"type": "string", "description": "请求 ID"},
			}, nil),
			ActivityParameterKeys: []string{"run_id", "request_id"},
		},
		ValidateArguments: validateAssistantRunReference,
		Handle:            tools.handleTeamPreviewRunStop,
	}
}

func (tools projectAssistantTools) teamRunStopTool() runtimeprovider.Tool {
	return tools.confirmationTool(
		assistantToolTeamRunStop,
		"停止项目任务",
		"仅在 team_preview_run_stop 的确认表单提交后调用，使用预览返回的 confirmation_token。",
		assistantActionRunStop,
		tools.handleTeamRunStop,
	)
}

func (tools projectAssistantTools) confirmationTool(
	name string,
	title string,
	description string,
	action string,
	handler runtimeprovider.Handler,
) runtimeprovider.Tool {
	return runtimeprovider.Tool{
		Definition: runtimeprovider.Definition{
			Name:        name,
			Title:       title,
			Kind:        "confirmation",
			Description: description,
			Parameters: assistantObjectSchema(map[string]any{
				"confirmation_token": map[string]any{"type": "string", "description": "预览工具返回的确认凭证"},
			}, []any{"confirmation_token"}),
			Execution: runtimeprovider.ExecutionPolicy{PreventDuplicateRecovery: true},
		},
		PrepareArguments: func(arguments map[string]any) (map[string]any, error) {
			arguments["_confirmation_action"] = action
			interactionID, decision := assistantInteractionResponse(tools.input)
			arguments["_interaction_id"] = interactionID
			arguments["_decision"] = decision
			return arguments, nil
		},
		Handle: handler,
	}
}

func assistantObjectSchema(properties map[string]any, required []any) map[string]any {
	if required == nil {
		required = []any{}
	}
	return map[string]any{
		"type":                 "object",
		"properties":           properties,
		"required":             required,
		"additionalProperties": false,
	}
}

func assistantCanvasPatchSchema() map[string]any {
	objectList := func(description string) map[string]any {
		return map[string]any{
			"type": "array", "description": description,
			"maxItems": maxAssistantCanvasPatchOperations,
			"items":    map[string]any{"type": "object"},
		}
	}
	idList := func(description string) map[string]any {
		return map[string]any{
			"type": "array", "description": description,
			"maxItems": maxAssistantCanvasPatchOperations,
			"items":    map[string]any{"type": "string"},
		}
	}
	return assistantObjectSchema(map[string]any{
		"add_nodes":       objectList("新增节点。常用字段为 id、type、title、x、y，以及对应的 asset、role、power、flow 或 function_option"),
		"update_nodes":    objectList("按 id 合并更新现有节点"),
		"remove_node_ids": idList("删除的节点 ID，相关连线会同步删除"),
		"add_edges":       objectList("新增连线，必须包含唯一 id、from、to、purpose"),
		"update_edges":    objectList("按 id 合并更新现有连线"),
		"remove_edge_ids": idList("删除的连线 ID"),
		"viewport":        map[string]any{"type": "object", "description": "可选画布视图 x、y、zoom"},
	}, nil)
}

func validateAssistantRunReference(arguments map[string]any) error {
	if runtimeprovider.ArgumentUint64(arguments, "run_id") == 0 &&
		strings.TrimSpace(fmt.Sprint(arguments["request_id"])) == "" {
		return fmt.Errorf("run_id 与 request_id 至少提供一个")
	}
	return nil
}
