package provider

import (
	"context"
	"fmt"
)

const FinishResponseToolName = "finish_response"

func FinishResponseTool() Tool {
	return Tool{
		Definition: Definition{
			Name:  FinishResponseToolName,
			Title: "完成本轮回答",
			Kind:  "control",
			Description: "普通非图文任务已经按照用户要求和当前智能体设定完整交付后，在同一次响应已输出最终正文的末尾调用本工具。" +
				"调用前由当前主模型自行检查是否仍有可自主完成的步骤；不得用它代替 ask_user、知识库读取或当前任务。" +
				"如果智能体设定要求本任务读取知识库，knowledge_required 必须为 true，runtime 会核验本轮实际知识工具调用。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"completed": map[string]any{
						"type":        "boolean",
						"description": "本轮任务是否已经完整交付，只能传 true",
						"enum":        []any{true},
					},
					"knowledge_required": map[string]any{
						"type":        "boolean",
						"description": "当前智能体设定是否要求本任务读取知识库",
					},
				},
				"required":             []any{"completed", "knowledge_required"},
				"additionalProperties": false,
			},
		},
		Handle: executeFinishResponse,
	}
}

func executeFinishResponse(_ context.Context, call Call) (Result, error) {
	completed, ok := call.Arguments["completed"].(bool)
	if !ok || !completed {
		return Result{}, fmt.Errorf("finish_response.completed 必须为 true")
	}
	knowledgeRequired, ok := call.Arguments["knowledge_required"].(bool)
	if !ok {
		return Result{}, fmt.Errorf("finish_response.knowledge_required 必须为布尔值")
	}
	return Result{
		Content: map[string]any{
			"completed":          true,
			"knowledge_required": knowledgeRequired,
		},
		Terminal: true,
	}, nil
}
