package tool

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type MountRequest struct {
	// 工具调用晚于限时挂载阶段；执行上下文必须存活到该运行结束。
	ExecutionContext       context.Context
	Agent                  agentmodel.Agent
	Gateway                energonservice.GatewayService
	EnablePreparationCache bool
	PreparationKey         string
	PowerPolicy            PowerPolicy
	ToolProfile            ToolProfile
	Input                  map[string]any
	References             []runtimeprovider.MediaReference
	Billing                botprotocol.BillingContext
	EnableDocument         bool
	BuiltinOnly            bool
	Method                 string
	Host                   string
	Path                   string
	Headers                map[string]string
	Server                 *server.Context
}

type MountResult struct {
	Registry  *Registry
	Warnings  []string
	Readiness AgentReadiness
	cleanup   func()
}

func (result MountResult) Close() {
	if result.cleanup != nil {
		result.cleanup()
	}
}

func Mount(ctx context.Context, request MountRequest) (MountResult, error) {
	suggestionMode := agentmodel.NormalizeSuggestionMode(request.Agent.SuggestionMode)
	tools := []runtimeprovider.Tool{runtimeprovider.AskUserTool()}
	if agentmodel.SuggestionEnabled(suggestionMode) {
		tools = append(tools, runtimeprovider.PresentSuggestionsTool(suggestionMode))
	}
	if !request.BuiltinOnly && request.Agent.Key == agentmodel.SkillInstallerAgentKey {
		tools = append(tools, runtimeprovider.SkillInstallPlanTool())
	}
	registry, err := NewRegistry(tools...)
	if err != nil {
		return MountResult{}, err
	}
	result := MountResult{Registry: registry}
	if request.BuiltinOnly {
		return result, nil
	}
	profileTools, err := mountToolProfile(ctx, request.ToolProfile, request.Input, request.Server)
	if err != nil {
		return MountResult{}, err
	}
	if err := registry.Add(profileTools...); err != nil {
		return MountResult{}, err
	}
	prepared, err := prepareMount(ctx, request)
	if err != nil {
		return MountResult{}, err
	}
	if len(prepared.knowledgeBases) > 0 {
		knowledgeTools := runtimeprovider.KnowledgeTools(prepared.knowledgeBases)
		if err := registry.Add(knowledgeTools...); err != nil {
			return MountResult{}, err
		}
	}

	if len(prepared.skillEntries) > 0 {
		tempRoot := ""
		tempRoot, err = os.MkdirTemp("", "dever-agent-runtime-*")
		if err != nil {
			return MountResult{}, fmt.Errorf("创建智能体临时目录失败: %w", err)
		}
		var cleanupOnce sync.Once
		result.cleanup = func() {
			cleanupOnce.Do(func() { _ = os.RemoveAll(tempRoot) })
		}
		tools := runtimeprovider.SkillTools(prepared.skillEntries, skillLimits(prepared.skillConfig), request.Server, runtimeprovider.SkillRuntime{
			TempRoot: tempRoot,
			Sandbox:  SandboxConfig(prepared.skillConfig),
		})
		if err := registry.Add(tools...); err != nil {
			result.Close()
			return MountResult{}, err
		}
	}

	powerWarnings, mountedPowerCount := mountPowerTools(ctx, request, registry, prepared.powerCandidates)
	result.Readiness = BuildMountReadiness(
		request.Agent,
		mountPowerPolicy(request),
		mountedPowerCount,
		len(prepared.knowledgeBases),
		len(prepared.skillEntries),
		prepared.warnings...,
	)
	warnings := append([]string(nil), result.Readiness.Warnings...)
	warnings = append(warnings, powerWarnings...)
	if request.EnableDocument {
		if err := registry.Add(runtimeprovider.ComposeDocumentTool(suggestionMode)); err != nil {
			result.Close()
			return MountResult{}, err
		}
	}
	result.Warnings = warnings
	return result, nil
}

func mountPowerTools(ctx context.Context, request MountRequest, registry *Registry, candidates []powerMountCandidate) ([]string, int) {
	executionCtx := request.ExecutionContext
	if executionCtx == nil {
		executionCtx = ctx
	}
	warnings := make([]string, 0)
	mounted := 0
	referenceScope := runtimeprovider.ReferenceScopeFromInput(request.Input)
	for _, candidate := range candidates {
		if candidate.err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", candidate.row.Name, candidate.err.Error()))
			continue
		}
		if len(candidate.config.Sources) == 0 {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: 没有启用来源", candidate.row.Name))
			continue
		}
		fixedArguments := request.PowerPolicy.Arguments(candidate.row.ID)
		fixedParameterKeys := request.PowerPolicy.ParameterKeys(candidate.row.ID)
		current := runtimeprovider.PowerTool(candidate.row, candidate.config, powerParametersSchema(candidate.config.Params, fixedParameterKeys), fixedArguments, request.Gateway, runtimeprovider.Transport{
			Method: request.Method, Host: request.Host, Path: request.Path, Headers: request.Headers,
		}, request.References, referenceScope, request.Billing, runtimeprovider.PowerTargetAccess{
			Config: func(targetID uint64) (energonservice.PowerParamConfig, error) {
				return request.Gateway.PowerTargetParamConfig(executionCtx, candidate.row.Key, targetID)
			},
			Validate: func(targetID uint64, input map[string]any) error {
				return request.Gateway.ValidatePowerTarget(executionCtx, energonservice.GatewayRequest{
					Method: request.Method, Host: request.Host, Path: request.Path,
					Body: map[string]any{"power": candidate.row.Key, "input": input, "source_target_id": targetID},
				}, targetID)
			},
		})
		if err := registry.Add(current); err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", candidate.row.Name, err.Error()))
			continue
		}
		mounted++
	}
	return warnings, mounted
}

func runtimeConfig(ctx context.Context) agentmodel.RuntimeConfig {
	return runtimeconfig.Load(ctx)
}

func skillLimits(config agentmodel.RuntimeConfig) agentskill.Limits {
	return agentskill.Limits{
		MetadataMaxSkills:     config.SkillMetadataMaxSkills,
		MetadataFieldMaxRunes: config.SkillMetadataFieldMaxLength,
		SkillFileMaxBytes:     int64(config.SkillFileMaxBytes),
		LoadedContentMaxRunes: config.SkillLoadedContentMaxLength,
	}
}
