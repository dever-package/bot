package tool

import (
	"context"
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
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
	tools := []runtimeprovider.Tool{
		runtimeprovider.AskUserTool(),
		runtimeprovider.PresentSuggestionsTool(),
	}
	if request.EnableDocument {
		tools = append(tools, runtimeprovider.StartDocumentTool())
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

	if request.Agent.KnowledgeCateID > 0 {
		bases := knowledgeservice.NewService().KnowledgeBasesByCate(ctx, request.Agent.KnowledgeCateID)
		tools, prompt := runtimeprovider.KnowledgeTools(bases)
		if err := registry.Add(tools...); err != nil {
			return MountResult{}, err
		}
		if strings.TrimSpace(prompt) != "" {
			prompts = append(prompts, prompt)
		}
	}

	if request.Agent.SkillPackID > 0 {
		entries := agentskill.EntriesByPack(ctx, request.Agent.SkillPackID)
		config := runtimeConfig(ctx)
		tempRoot := ""
		if len(entries) > 0 {
			tempRoot, err = os.MkdirTemp("", "dever-agent-runtime-*")
			if err != nil {
				return MountResult{}, fmt.Errorf("创建智能体临时目录失败: %w", err)
			}
			var cleanupOnce sync.Once
			result.cleanup = func() {
				cleanupOnce.Do(func() { _ = os.RemoveAll(tempRoot) })
			}
		}
		tools, prompt := runtimeprovider.SkillTools(entries, skillLimits(config), request.Server, runtimeprovider.SkillRuntime{
			TempRoot: tempRoot,
			Sandbox:  SandboxConfig(config),
		})
		if err := registry.Add(tools...); err != nil {
			result.Close()
			return MountResult{}, err
		}
		if strings.TrimSpace(prompt) != "" {
			prompts = append(prompts, prompt)
		}
	}

	warnings := mountPowerTools(ctx, request, registry)
	result.Prompt = strings.Join(prompts, "\n\n")
	result.Warnings = warnings
	return result, nil
}

func mountPowerTools(ctx context.Context, request MountRequest, registry *Registry) []string {
	if request.Agent.PowerCateID == 0 {
		return nil
	}
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{
		"cate_id": request.Agent.PowerCateID,
		"status":  1,
	}, map[string]any{"order": "main.id asc"})
	warnings := make([]string, 0)
	for _, row := range rows {
		if row == nil || row.ID == request.Agent.LLMPowerID || strings.EqualFold(strings.TrimSpace(row.Kind), "embeddings") {
			continue
		}
		config, err := request.Gateway.PowerParamConfig(ctx, row.Key, 0)
		if err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", row.Name, err.Error()))
			continue
		}
		if len(config.Sources) == 0 {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: 没有启用来源", row.Name))
			continue
		}
		current := runtimeprovider.PowerTool(*row, config, powerParametersSchema(config.Params), request.Gateway, runtimeprovider.Transport{
			Method: request.Method, Host: request.Host, Path: request.Path, Headers: request.Headers,
		}, request.References)
		if err := registry.Add(current); err != nil {
			warnings = append(warnings, fmt.Sprintf("能力 %s 未挂载: %s", row.Name, err.Error()))
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
