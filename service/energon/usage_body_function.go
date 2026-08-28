package energon

import (
	"context"
	"strings"

	"github.com/shemic/dever/server"

	bodymodel "github.com/dever-package/bot/model/body"
)

const (
	usageSceneBodyTool     = "body_tool"
	usageSceneProjectPower = "project_power"
	usageSceneAgentPower   = "agent_power"
	usageOtherBodyFunction = "other"
)

type usageBodyFunction struct {
	Code    string
	Name    string
	Enabled bool
}

func (UserUsageService) ProviderLoadBodyFunctionOptions(c *server.Context, _ []any) any {
	codes := usageBusinessFunctionCodes()
	options := make([]map[string]any, 0, len(codes))
	for _, function := range loadUsageBodyFunctions(c.Context(), codes) {
		if !function.Enabled {
			continue
		}
		options = append(options, map[string]any{
			"code": function.Code,
			"name": function.Name,
		})
	}
	return options
}

func usageBusinessFunctionCodes() []string {
	return []string{
		bodymodel.FunctionCodeWorks,
		bodymodel.FunctionCodeDialogue,
		bodymodel.FunctionCodeTool,
	}
}

func usageDashboardBodyFunctionCode(scene string, hasProject bool) string {
	scene = strings.TrimSpace(scene)
	switch {
	case scene == usageSceneBodyTool:
		return bodymodel.FunctionCodeTool
	case hasProject || scene == usageSceneProjectPower:
		return bodymodel.FunctionCodeWorks
	case scene == usageSceneAgentPower:
		return bodymodel.FunctionCodeDialogue
	default:
		return usageOtherBodyFunction
	}
}

func loadUsageBodyFunctions(ctx context.Context, codes []string) []usageBodyFunction {
	defaultByCode := make(map[string]bodymodel.Function)
	for _, function := range bodymodel.DefaultFunctions() {
		defaultByCode[function.Code] = function
	}

	requested := make([]string, 0, len(codes))
	requestedSet := make(map[string]struct{}, len(codes))
	for _, code := range codes {
		code = strings.TrimSpace(code)
		if _, valid := defaultByCode[code]; !valid {
			continue
		}
		if _, exists := requestedSet[code]; exists {
			continue
		}
		requested = append(requested, code)
		requestedSet[code] = struct{}{}
	}
	if len(requested) == 0 {
		return []usageBodyFunction{}
	}

	rows := bodymodel.NewFunctionModel().Select(ctx, map[string]any{"code": requested}, map[string]any{
		"field": "main.code,main.name,main.status",
		"order": "main.sort asc,main.id asc",
	})
	result := make([]usageBodyFunction, 0, len(requested))
	seen := make(map[string]struct{}, len(requested))
	for _, row := range rows {
		if row == nil {
			continue
		}
		fallback, knownCode := defaultByCode[row.Code]
		if !knownCode {
			continue
		}
		if _, requestedCode := requestedSet[row.Code]; !requestedCode {
			continue
		}
		name := strings.TrimSpace(row.Name)
		if name == "" {
			name = fallback.Name
		}
		result = append(result, usageBodyFunction{
			Code:    row.Code,
			Name:    name,
			Enabled: row.Status == bodymodel.StatusEnabled,
		})
		seen[row.Code] = struct{}{}
	}
	for _, code := range requested {
		if _, exists := seen[code]; exists {
			continue
		}
		fallback := defaultByCode[code]
		result = append(result, usageBodyFunction{
			Code:    fallback.Code,
			Name:    fallback.Name,
			Enabled: fallback.Status == bodymodel.StatusEnabled,
		})
	}
	return result
}

func usageBodyFunctionEnabledMap(ctx context.Context, codes []string) map[string]bool {
	result := make(map[string]bool, len(codes))
	for _, function := range loadUsageBodyFunctions(ctx, codes) {
		result[function.Code] = function.Enabled
	}
	return result
}
