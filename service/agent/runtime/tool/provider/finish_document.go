package provider

import "context"

const FinishDocumentToolName = "finish_document"

// FinishDocumentTool gives document mode an explicit terminal action. Without
// it the model must emit another visible message after the final media call,
// which commonly repeats the completed article.
func FinishDocumentTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        FinishDocumentToolName,
			Title:       "完成图文文档",
			Kind:        "control",
			Description: "图文正文和全部素材位置均已按最终阅读顺序提交后，调用此工具结束文档。调用前不要输出任何可见文本。",
			Parameters: map[string]any{
				"type":                 "object",
				"properties":           map[string]any{},
				"additionalProperties": false,
			},
		},
		Handle: func(_ context.Context, _ Call) (Result, error) {
			return Result{
				Content:  map[string]any{"completed": true},
				Terminal: true,
			}, nil
		},
	}
}
