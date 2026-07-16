package tool

import (
	"context"
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
)

type MountRequest struct {
	Agent          agentmodel.Agent
	Gateway        energonservice.GatewayService
	References     []runtimeprovider.MediaReference
	EnableDocument bool
	Method         string
	Host           string
	Path           string
	Headers        map[string]string
	Server         *server.Context
}

type MountResult struct {
	Registry *Registry
	Prompt   string
	Warnings []string
	cleanup  func()
}

func (result MountResult) Close() {
	if result.cleanup != nil {
		result.cleanup()
	}
}

func Mount(ctx context.Context, request MountRequest) (MountResult, error) {
	prepared, err := prepareMount(ctx, request)
	if err != nil {
		return MountResult{}, err
	}
	tools := []runtimeprovider.Tool{
		runtimeprovider.AskUserTool(),
		runtimeprovider.FinishResponseTool(),
		runtimeprovider.PresentSuggestionsTool(),
	}
	if request.EnableDocument {
		tools = append(tools,
			runtimeprovider.StartDocumentTool(),
			runtimeprovider.FinishDocumentTool(),
		)
	}
	registry, err := NewRegistry(tools...)
	if err != nil {
		return MountResult{}, err
	}
	result := MountResult{Registry: registry}
	prompts := make([]string, 0, 3)
	if request.EnableDocument {
		prompts = append(prompts, runtimeprovider.StartDocumentPrompt)
	}

	if len(prepared.knowledgeBases) > 0 {
		knowledgeTools, knowledgePrompt := runtimeprovider.KnowledgeTools(prepared.knowledgeBases)
		if err := registry.Add(knowledgeTools...); err != nil {
			return MountResult{}, err
		}
		if strings.TrimSpace(knowledgePrompt) != "" {
			prompts = append(prompts, knowledgePrompt)
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
		tools, prompt := runtimeprovider.SkillTools(prepared.skillEntries, skillLimits(prepared.skillConfig), request.Server, runtimeprovider.SkillRuntime{
			TempRoot: tempRoot,
			Sandbox:  SandboxConfig(prepared.skillConfig),
		})
		if err := registry.Add(tools...); err != nil {
			result.Close()
			return MountResult{}, err
		}
		if strings.TrimSpace(prompt) != "" {
			prompts = append(prompts, prompt)
		}
	}

	warnings := mountPowerTools(request, registry, prepared.powerCandidates)
	result.Prompt = strings.Join(prompts, "\n\n")
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
		}, request.References)
		if err := registry.Add(current); err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", candidate.row.Name, err.Error()))
		}
	}
	return warnings
}

func runtimeConfig(ctx context.Context) agentmodel.RuntimeConfig {
	config := agentmodel.DefaultRuntimeConfig()
	if row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{"id": agentmodel.DefaultRuntimeConfigID}); row != nil {
		config = runtimeconfig.WithDefaults(*row)
	}
	return config
}

func skillLimits(config agentmodel.RuntimeConfig) agentskill.Limits {
	return agentskill.Limits{
		MetadataMaxSkills:     config.SkillMetadataMaxSkills,
		MetadataFieldMaxRunes: config.SkillMetadataFieldMaxLength,
		SkillFileMaxBytes:     int64(config.SkillFileMaxBytes),
		LoadedContentMaxRunes: config.SkillLoadedContentMaxLength,
	}
}
