package tool

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/load"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func executeBuiltinService(_ context.Context, req Request) (map[string]any, error) {
	method, entry, ok := agentskill.ResolveLoadedBuiltinMethod(req.Loaded, normalizeTool(req.Action.Tool))
	if !ok {
		return nil, fmt.Errorf("当前技能未声明内置工具: %s", req.Action.Tool)
	}
	payload := cloneToolInput(req.Action.Input)
	result, err := callBuiltinService(req, method, payload)
	if err != nil {
		return nil, err
	}
	output := normalizeBuiltinResult(result)
	output["tool"] = method.Key
	output["skill"] = entry.Key
	output["service"] = method.Service
	if strings.TrimSpace(inputText(output["summary"])) == "" {
		output["summary"] = fmt.Sprintf("%s 调用完成", method.Key)
	}
	return output, nil
}

func callBuiltinService(req Request, method agentskill.BuiltinMethod, payload map[string]any) (result any, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			if recoveredErr, ok := recovered.(error); ok {
				err = recoveredErr
				return
			}
			err = fmt.Errorf("%v", recovered)
		}
	}()
	if req.Server != nil {
		return load.Service(method.Service, req.Server, []any{payload}), nil
	}
	return load.Service(method.Service, []any{payload}), nil
}

func cloneToolInput(input map[string]any) map[string]any {
	if input == nil {
		return map[string]any{}
	}
	cloned := make(map[string]any, len(input))
	for key, value := range input {
		cloned[key] = value
	}
	return cloned
}

func normalizeBuiltinResult(result any) map[string]any {
	switch current := result.(type) {
	case nil:
		return map[string]any{}
	case map[string]any:
		return cloneToolInput(current)
	default:
		output := map[string]any{
			"result": current,
			"text":   fmt.Sprint(current),
		}
		if raw, err := json.Marshal(current); err == nil {
			output["json"] = string(raw)
		}
		return output
	}
}
