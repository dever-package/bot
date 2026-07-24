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
	Agent          agentmodel.Agent
	Gateway        energonservice.GatewayService
	PreparationKey string
	References     []runtimeprovider.MediaReference
	Billing        botprotocol.BillingContext
	EnableDocument bool
	BuiltinOnly    bool
	Method         string
	Host           string
	Path           string
	Headers        map[string]string
	Server         *server.Context
}

type MountResult struct {
	Registry *Registry
	Warnings []string
	cleanup  func()
}

func (result MountResult) Close() {
	if result.cleanup != nil {
		result.cleanup()
	}
}

func Mount(ctx context.Context, request MountRequest) (MountResult, error) {
	tools := []runtimeprovider.Tool{
		runtimeprovider.AskUserTool(),
		runtimeprovider.PresentSuggestionsTool(),
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

	warnings := mountPowerTools(request, registry, prepared.powerCandidates)
	if request.EnableDocument {
		if err := registry.Add(runtimeprovider.ComposeDocumentTool()); err != nil {
			result.Close()
			return MountResult{}, err
		}
	}
	result.Warnings = warnings
	return result, nil
}

func mountPowerTools(request MountRequest, registry *Registry, candidates []powerMountCandidate) []string {
	warnings := make([]string, 0)
	for _, candidate := range candidates {
		if candidate.err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", candidate.row.Name, candidate.err.Error()))
			continue
		}
		if len(candidate.config.Sources) == 0 {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: 没有启用来源", candidate.row.Name))
			continue
		}
		current := runtimeprovider.PowerTool(candidate.row, candidate.config, powerParametersSchema(candidate.config.Params), request.Gateway, runtimeprovider.Transport{
			Method: request.Method, Host: request.Host, Path: request.Path, Headers: request.Headers,
		}, request.References, request.Billing)
		if err := registry.Add(current); err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", candidate.row.Name, err.Error()))
		}
	}
	return warnings
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
