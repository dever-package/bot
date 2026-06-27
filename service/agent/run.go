package agent

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentaction "github.com/dever-package/bot/service/agent/action"
	agentcontext "github.com/dever-package/bot/service/agent/context"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	agenttool "github.com/dever-package/bot/service/agent/tool"
)

type runtimeOptions = agentcontext.RuntimeOptions

type agentLoopResult struct {
	Output  map[string]any
	Summary string
	Status  string
	Message string
}

type runExecution struct {
	Request     RunRequest
	Parsed      parsedRunRequest
	Agent       agentmodel.Agent
	Power       energonmodel.Power
	Scene       agentcontext.Scene
	RunID       uint64
	RequestID   string
	StartedAt   time.Time
	ContextPlan agentcontext.Plan
	Baseline    agentcontext.Baseline
}

func (s Service) execute(exec runExecution) {
	timeout := time.Duration(exec.Agent.TimeoutSeconds) * time.Second
	if timeout <= 0 {
		timeout = time.Hour
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	tracker := runTracker{
		repo:      s.repo,
		runID:     exec.RunID,
		requestID: exec.RequestID,
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err := fmt.Errorf("%v", recovered)
			tracker.Step(context.Background(), "error", "运行异常", err.Error(), map[string]any{"error": err.Error()}, stepStatusFail)
			s.finishRun(context.Background(), exec, runStatusFail, nil, "", err.Error(), tracker.seq)
			_ = s.writeErrorResult(context.Background(), exec.RequestID, err.Error())
		}
	}()

	tracker.Step(ctx, "input", "用户输入", primaryInputText(exec.Parsed.Input), map[string]any{
		"input":   exec.Parsed.Input,
		"history": exec.Parsed.History,
	}, stepStatusSuccess)

	scene := exec.Scene
	if scene == "" {
		scene = agentcontext.SceneAgent
	}
	contextStartedAt := time.Now()
	bundle := agentcontext.NewAssembler(agentcontext.Dependencies{
		Repo:    s.repo,
		Gateway: s.gateway,
	}).Build(ctx, agentcontext.Request{
		Scene:              scene,
		Method:             exec.Request.Method,
		Host:               exec.Request.Host,
		Path:               exec.Request.Path,
		Headers:            exec.Request.Headers,
		Agent:              exec.Agent,
		Power:              exec.Power,
		Input:              exec.Parsed.Input,
		History:            exec.Parsed.History,
		Options:            exec.Parsed.Options,
		SourceTargetID:     exec.Parsed.SourceTargetID,
		AssistantSessionID: exec.Parsed.AssistantSessionID,
		Memory: agentcontext.MemoryRequest{
			Enabled:   exec.Parsed.MemoryEnabled,
			SessionID: exec.Parsed.AssistantSessionID,
		},
	})
	contextLatencyMs := time.Since(contextStartedAt).Milliseconds()
	exec.ContextPlan = bundle.Diagnostics.Plan
	exec.Baseline = bundle.Baseline
	runtimeOptions := bundle.RuntimeOptions
	catalog := bundle.SkillCatalog
	skillCatalogStatus := stepStatusSuccess
	if catalog.Warning != "" {
		skillCatalogStatus = stepStatusWarning
	}
	tracker.Step(ctx, "skill_catalog", "技能目录", catalog.Metadata, map[string]any{
		"skill_pack_id":      exec.Agent.SkillPackID,
		"available":          catalog.AvailableKeys(),
		"loaded":             catalog.LoadedKeys(),
		"warning":            catalog.Warning,
		"context":            bundle.Diagnostics,
		"context_latency_ms": contextLatencyMs,
	}, skillCatalogStatus)
	if catalog.Warning != "" {
		_ = s.writeStreamStatus(ctx, exec.RequestID, catalog.Warning, nil)
	} else {
		_ = s.writeStreamStatus(ctx, exec.RequestID, "已加载技能方案", nil)
	}

	selection := bundle.SkillSelection
	selectionStatus := stepStatusSuccess
	if selection.Warning != "" {
		selectionStatus = stepStatusWarning
	}
	tracker.Step(ctx, "skill_select", "技能选择", strings.Join(selection.Keys, ", "), map[string]any{
		"selected": selection.Keys,
		"reason":   selection.Reason,
		"warning":  selection.Warning,
		"raw":      selection.Raw,
	}, selectionStatus)
	if selection.Warning != "" {
		_ = s.writeStreamStatus(ctx, exec.RequestID, selection.Warning, nil)
	}

	loadStatus := stepStatusSuccess
	if catalog.Warning != "" {
		loadStatus = stepStatusWarning
	}
	tracker.Step(ctx, "skill_load", "技能加载", catalog.LoadedContent, map[string]any{
		"loaded":  catalog.LoadedKeys(),
		"warning": catalog.Warning,
	}, loadStatus)

	runtimePrompt := bundle.RuntimePrompt
	tracker.Step(ctx, "knowledge", "运行资料", runtimePrompt, map[string]any{
		"setting_pack_id":      exec.Agent.SettingPackID,
		"public_settings":      len(bundle.PromptInput.PublicSettings),
		"agent_settings":       len(bundle.PromptInput.AgentSettings),
		"knowledge_bases":      len(bundle.KnowledgeBases),
		"memories":             len(bundle.Memories),
		"knowledge_mode":       bundle.Diagnostics.KnowledgeMode,
		"history_messages":     len(exec.Parsed.History),
		"context":              bundle.Diagnostics,
		"context_latency_ms":   contextLatencyMs,
		"prompt_mode":          bundle.PromptInput.Mode,
		"prompt_sections":      bundle.PromptSections,
		"runtime_prompt_runes": len([]rune(runtimePrompt)),
		"runtime_prompt_bytes": len(runtimePrompt),
	}, stepStatusSuccess)
	s.repo.UpdateRun(ctx, exec.RunID, map[string]any{
		"skills": jsonText(map[string]any{
			"skill_pack_id":      catalog.PackID,
			"available":          catalog.AvailableKeys(),
			"selected":           selection.Keys,
			"loaded":             catalog.LoadedKeys(),
			"warning":            firstText(selection.Warning, catalog.Warning),
			"context":            bundle.Diagnostics,
			"context_latency_ms": contextLatencyMs,
		}),
		"runtime_context": runtimePrompt,
	})

	tracker.Step(ctx, "runtime_config", "运行配置", fmt.Sprintf("最大自动步骤: %d", runtimeOptions.MaxSteps), map[string]any{
		"max_steps":             runtimeOptions.MaxSteps,
		"agent_max_steps":       exec.Agent.MaxAutoSteps,
		"request_options":       exec.Parsed.Options,
		"script_sandbox":        runtimeOptions.Tool.ScriptSandbox.Driver,
		"script_bwrap_path":     runtimeOptions.Tool.ScriptSandbox.BwrapPath,
		"script_network":        runtimeOptions.Tool.ScriptSandbox.NetworkMode,
		"script_timeout_ms":     runtimeOptions.Tool.ScriptSandbox.Timeout.Milliseconds(),
		"async_max_concurrency": runtimeOptions.AsyncMaxConcurrency,
	}, stepStatusSuccess)

	result := s.runAgentLoop(ctx, exec, runtimePrompt, bundle.ModelHistory, catalog, &tracker, runtimeOptions)
	if result.Status == runStatusSuccess {
		tracker.Step(ctx, "final", "最终输出", result.Summary, map[string]any{"output": result.Output}, stepStatusSuccess)
		s.finishRun(ctx, exec, runStatusSuccess, result.Output, result.Summary, "", tracker.seq)
		return
	}

	stepStatus := stepStatusFail
	if result.Status == runStatusCanceled {
		stepStatus = stepStatusWarning
	}
	tracker.Step(context.Background(), "error", "运行结束", result.Message, map[string]any{
		"status": result.Status,
		"output": result.Output,
	}, stepStatus)
	s.finishRun(context.Background(), exec, result.Status, result.Output, result.Summary, result.Message, tracker.seq)
}

func (s Service) finishRun(
	ctx context.Context,
	exec runExecution,
	status string,
	output map[string]any,
	summary string,
	message string,
	stepCount int,
) {
	finishedAt := time.Now()
	s.repo.UpdateRun(ctx, exec.RunID, map[string]any{
		"status":      status,
		"output":      runOutputText(output, summary),
		"error":       message,
		"step_count":  stepCount,
		"latency":     finishedAt.Sub(exec.StartedAt).Milliseconds(),
		"finished_at": finishedAt,
	})
}

func (s Service) runAgentLoop(ctx context.Context, exec runExecution, runtimePrompt string, initialModelHistory []any, catalog agentskill.Catalog, tracker *runTracker, options runtimeOptions) agentLoopResult {
	sourceHistory := append([]any{}, exec.Parsed.History...)
	history := append([]any{}, initialModelHistory...)
	artifacts := agentaction.NewArtifactAccumulator()
	lastOutput := ""
	gatewayLastID := ""
	executedActions := map[string]struct{}{}
	tempRoot := agentToolTempRoot(exec.RequestID)
	_ = os.RemoveAll(tempRoot)
	_ = os.MkdirAll(tempRoot, 0o700)
	defer os.RemoveAll(tempRoot)

	for step := 1; step <= options.MaxSteps; step++ {
		assets := agentaction.CollectAssets(exec.Parsed.Input, combinedRunHistory(sourceHistory, history))
		turn := s.collectAgentTurn(ctx, exec, runtimePromptWithAssets(runtimePrompt, assets), history, step, options.MaxSteps, gatewayLastID)
		if turn.LastID != "" {
			gatewayLastID = turn.LastID
		}
		tracker.Step(ctx, "llm_turn", fmt.Sprintf("内容生成 %d/%d", step, options.MaxSteps), turn.Text, map[string]any{
			"kind":        turn.Kind,
			"text":        turn.Text,
			"interaction": turn.Interaction,
			"action":      turn.Action,
			"message":     turn.Message,
		}, turnStepStatus(turn))

		switch turn.Kind {
		case agentTurnFinal:
			output := artifacts.MergeInto(turn.Output)
			return s.handleFinalResult(ctx, exec, tracker, output, history, options)
		case agentTurnInteraction:
			_ = s.writeStreamOutput(ctx, exec.RequestID, turn.Output)
			_ = s.writeSuccessResult(ctx, exec.RequestID, turn.Output)
			return newAgentLoopResult(turn.Output, runStatusSuccess, "")
		case agentTurnAction:
			if output, duplicate := duplicateActionOutput(turn.Action, executedActions, artifacts); duplicate {
				return s.handleFinalResult(ctx, exec, tracker, output, history, options)
			}
			tracker.Step(ctx, "agent_action", actionStepTitle(turn.Action), actionStepContent(turn.Action), map[string]any{
				"text":   turn.Text,
				"action": turn.Action,
			}, stepStatusSuccess)
			result := s.executeAgentAction(ctx, exec, turn.Action, turn.Text, gatewayLastID, history, assets, catalog, tempRoot, options.Tool)
			if result.LastID != "" {
				gatewayLastID = result.LastID
			}
			if loopResult, done := s.handleActionResult(ctx, exec, tracker, result, &artifacts, &history, &lastOutput); done {
				return loopResult
			}
		case agentTurnCanceled:
			_ = s.writeCancelResult(ctx, exec.RequestID)
			return newAgentLoopTextResult(turn.Text, runStatusCanceled, "任务已取消")
		default:
			message := firstText(turn.Message, "智能体运行失败")
			_ = s.writeErrorResult(ctx, exec.RequestID, message)
			return newAgentLoopTextResult(turn.Text, runStatusFail, message)
		}
	}

	output := stepLimitOutput(options.MaxSteps, lastOutput, artifacts)
	return s.handleFinalResult(ctx, exec, tracker, output, history, options)
}

func combinedRunHistory(sourceHistory []any, modelHistory []any) []any {
	if len(sourceHistory) == 0 {
		return append([]any{}, modelHistory...)
	}
	if len(modelHistory) == 0 {
		return append([]any{}, sourceHistory...)
	}
	combined := make([]any, 0, len(sourceHistory)+len(modelHistory))
	combined = append(combined, sourceHistory...)
	combined = append(combined, modelHistory...)
	return combined
}

func duplicateActionOutput(action agentaction.Action, executed map[string]struct{}, artifacts agentaction.ArtifactAccumulator) (map[string]any, bool) {
	signature := agentaction.ActionSignature(action)
	if signature == "" {
		return nil, false
	}
	if _, exists := executed[signature]; !exists {
		executed[signature] = struct{}{}
		return nil, false
	}
	if !artifacts.HasAny() {
		return nil, false
	}
	return agentaction.EnsureAgentRichOutput(artifacts.MergeInto(map[string]any{
		"event": "final",
		"kind":  agentaction.KindFinal,
		"text":  "已完成当前能力生成，避免重复调用同一能力。",
	})), true
}

func (s Service) executeAgentAction(ctx context.Context, exec runExecution, action agentaction.Action, intro string, gatewayLastID string, history []any, assets []agentaction.Asset, catalog agentskill.Catalog, tempRoot string, toolOptions agenttool.Options) agentaction.Result {
	switch strings.TrimSpace(action.Type) {
	case "call_tool":
		return s.executeToolAction(ctx, exec, action, catalog, tempRoot, toolOptions)
	default:
		return s.executePowerAction(ctx, exec, action, intro, gatewayLastID, history, assets)
	}
}

func (s Service) executePowerAction(ctx context.Context, exec runExecution, action agentaction.Action, intro string, gatewayLastID string, history []any, assets []agentaction.Asset) agentaction.Result {
	return agentaction.ExecutePower(ctx, agentaction.ExecuteRequest{
		RequestID:      exec.RequestID,
		Method:         exec.Request.Method,
		Host:           exec.Request.Host,
		Path:           exec.Request.Path,
		Headers:        exec.Request.Headers,
		Input:          exec.Parsed.Input,
		History:        history,
		Assets:         assets,
		SourceTargetID: exec.Parsed.SourceTargetID,
		Gateway:        s.gateway,
		ResolvePower: func(ctx context.Context, identity string) (string, error) {
			return s.repo.ResolveCallablePowerKey(ctx, identity, exec.Power.ID)
		},
		WriteStatus: func(ctx context.Context, text string, meta map[string]any) error {
			return s.writeStreamStatus(ctx, exec.RequestID, text, meta)
		},
		WriteOutput: func(ctx context.Context, output map[string]any) error {
			return s.writeStreamOutput(ctx, exec.RequestID, output)
		},
		StreamBlock: time.Duration(defaultAgentStreamBlockMs) * time.Millisecond,
	}, action, intro, gatewayLastID)
}

func (s Service) executeToolAction(ctx context.Context, exec runExecution, action agentaction.Action, catalog agentskill.Catalog, tempRoot string, toolOptions agenttool.Options) agentaction.Result {
	return agenttool.Execute(ctx, agenttool.Request{
		RequestID: exec.RequestID,
		Action:    action,
		Loaded:    catalog.Loaded,
		TempRoot:  tempRoot,
		Options:   toolOptions,
		Server:    exec.Request.Server,
		WriteStatus: func(ctx context.Context, text string, meta map[string]any) error {
			return s.writeStreamStatus(ctx, exec.RequestID, text, meta)
		},
	})
}

func runtimePromptWithAssets(runtimePrompt string, assets []agentaction.Asset) string {
	assetPrompt := agentaction.AssetPrompt(assets)
	if strings.TrimSpace(assetPrompt) == "" {
		return runtimePrompt
	}
	if strings.TrimSpace(runtimePrompt) == "" {
		return assetPrompt
	}
	return runtimePrompt + "\n\n" + assetPrompt
}

func (s Service) handleActionResult(
	ctx context.Context,
	exec runExecution,
	tracker *runTracker,
	result agentaction.Result,
	artifacts *agentaction.ArtifactAccumulator,
	history *[]any,
	lastOutput *string,
) (agentLoopResult, bool) {
	switch result.Kind {
	case agentaction.ResultDone:
		if !isKnowledgeAction(result.Action) {
			artifacts.Add(result.Output)
		}
		*lastOutput = agentaction.SummaryText(result.Output)
		tracker.Step(ctx, "tool_result", actionResultTitle(result.Action), *lastOutput, actionResultPayload(result), stepStatusSuccess)
		*history = agentaction.AppendHistoryObservation(*history, result)
		return agentLoopResult{}, false
	case agentaction.ResultInteraction:
		_ = s.writeStreamOutput(ctx, exec.RequestID, result.Output)
		_ = s.writeSuccessResult(ctx, exec.RequestID, result.Output)
		return newAgentLoopResult(result.Output, runStatusSuccess, ""), true
	case agentaction.ResultCanceled:
		_ = s.writeCancelResult(ctx, exec.RequestID)
		return newAgentLoopTextResult(result.Text, runStatusCanceled, firstText(result.Message, "任务已取消")), true
	default:
		message := firstText(result.Message, actionFailureMessage(result.Action))
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return newAgentLoopTextResult(result.Text, runStatusFail, message), true
	}
}

func actionStepTitle(action agentaction.Action) string {
	if strings.TrimSpace(action.Type) == "call_tool" {
		if isKnowledgeAction(action) {
			return "正在调用知识库"
		}
		return "准备调用工具"
	}
	return "准备调用能力"
}

func actionStepContent(action agentaction.Action) string {
	if strings.TrimSpace(action.Type) == "call_tool" {
		if isKnowledgeAction(action) {
			return ""
		}
		return strings.TrimSpace(action.Tool)
	}
	return strings.TrimSpace(action.Power)
}

func actionResultTitle(action agentaction.Action) string {
	if strings.TrimSpace(action.Type) == "call_tool" {
		if isKnowledgeAction(action) {
			return "内容整理完成"
		}
		return "工具调用结果"
	}
	return "能力调用结果"
}

func actionFailureMessage(action agentaction.Action) string {
	if strings.TrimSpace(action.Type) == "call_tool" {
		if isKnowledgeAction(action) {
			return "知识库调用失败"
		}
		return "工具调用失败"
	}
	return "能力调用失败"
}

func isKnowledgeAction(action agentaction.Action) bool {
	switch strings.TrimSpace(action.Tool) {
	case "list_knowledge_tree", "search_knowledge_nodes", "open_knowledge_node", "expand_knowledge_node", "find_related_knowledge", "debug_knowledge_retrieval",
		"open_knowledge_init", "list_knowledge_files", "search_knowledge_files", "read_knowledge_file":
		return true
	default:
		return false
	}
}

func actionResultPayload(result agentaction.Result) map[string]any {
	payload := map[string]any{"output": result.Output}
	if strings.TrimSpace(result.Action.Power) != "" {
		payload["power"] = result.Action.Power
	}
	if strings.TrimSpace(result.Action.Tool) != "" {
		payload["tool"] = result.Action.Tool
	}
	if strings.TrimSpace(result.Action.Skill) != "" {
		payload["skill"] = result.Action.Skill
	}
	return payload
}

func newAgentLoopResult(output map[string]any, status string, message string) agentLoopResult {
	return agentLoopResult{
		Output:  output,
		Summary: agentaction.SummaryText(output),
		Status:  status,
		Message: message,
	}
}

func newAgentLoopTextResult(text string, status string, message string) agentLoopResult {
	return agentLoopResult{
		Summary: strings.TrimSpace(firstText(text, message)),
		Status:  status,
		Message: message,
	}
}

func runOutputText(output map[string]any, summary string) string {
	if len(output) > 0 {
		text := strings.TrimSpace(jsonText(output))
		if text != "" && text != "null" {
			return text
		}
	}
	return strings.TrimSpace(summary)
}

func turnStepStatus(turn agentTurnResult) string {
	switch turn.Kind {
	case agentTurnError:
		return stepStatusFail
	case agentTurnCanceled:
		return stepStatusWarning
	default:
		return stepStatusSuccess
	}
}

func stepLimitOutput(maxSteps int, lastOutput string, artifacts agentaction.ArtifactAccumulator) map[string]any {
	text := fmt.Sprintf("已达到自动执行步数上限（%d 步），以下是当前已完成结果。", maxSteps)
	if lastOutput != "" {
		text += "\n\n" + lastOutput
	}
	if lastOutput == "" && !artifacts.HasAny() {
		text = fmt.Sprintf("已达到自动执行步数上限（%d 步），请补充信息或调整智能体运行配置后继续。", maxSteps)
	}
	return artifacts.MergeInto(map[string]any{
		"event": "final",
		"kind":  agentaction.KindFinal,
		"text":  text,
	})
}

func agentToolTempRoot(requestID string) string {
	requestID = strings.TrimSpace(requestID)
	var builder strings.Builder
	for _, char := range requestID {
		switch {
		case char >= 'a' && char <= 'z':
			builder.WriteRune(char)
		case char >= 'A' && char <= 'Z':
			builder.WriteRune(char)
		case char >= '0' && char <= '9':
			builder.WriteRune(char)
		case char == '-' || char == '_':
			builder.WriteRune(char)
		}
	}
	name := builder.String()
	if name == "" {
		name = fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return filepath.Join(os.TempDir(), "shemic-agent-tool-"+name)
}
