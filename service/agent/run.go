package agent

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	agentaction "my/package/bot/service/agent/action"
	agentprompt "my/package/bot/service/agent/prompt"
	agentskill "my/package/bot/service/agent/skill"
	frontstream "my/package/front/service/stream"
)

type runtimeOptions struct {
	MaxSteps int
}

type agentLoopResult struct {
	Output  map[string]any
	Summary string
	Status  string
	Message string
}

type runExecution struct {
	Request   RunRequest
	Parsed    parsedRunRequest
	Agent     agentmodel.Agent
	Power     energonmodel.Power
	RunID     uint64
	RequestID string
	StartedAt time.Time
}

func (s Service) execute(exec runExecution) {
	timeout := time.Duration(exec.Agent.TimeoutSeconds) * time.Second
	if timeout <= 0 {
		timeout = 300 * time.Second
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

	powers := s.repo.ListActiveCallablePowers(ctx, exec.Power.ID)
	runtimeConfig := s.repo.FindRuntimeConfig(ctx)
	skillLimits := agentskill.LimitsFromRuntimeConfig(runtimeConfig)
	catalog := agentskill.BuildCatalog(exec.Agent.SkillPackID, s.repo.ListActiveSkillPackEntries(ctx, exec.Agent.SkillPackID), skillLimits)
	skillCatalogStatus := stepStatusSuccess
	if catalog.Warning != "" {
		skillCatalogStatus = stepStatusWarning
	}
	tracker.Step(ctx, "skill_catalog", "技能目录", catalog.Metadata, map[string]any{
		"skill_pack_id": exec.Agent.SkillPackID,
		"available":     catalog.AvailableKeys(),
		"loaded":        catalog.LoadedKeys(),
		"warning":       catalog.Warning,
		"limits": map[string]any{
			"metadata_max_skills":       skillLimits.MetadataMaxSkills,
			"metadata_field_max_length": skillLimits.MetadataFieldMaxRunes,
			"skill_file_max_bytes":      skillLimits.SkillFileMaxBytes,
			"loaded_content_max_length": skillLimits.LoadedContentMaxRunes,
		},
	}, skillCatalogStatus)
	if catalog.Warning != "" {
		_ = s.writeStreamStatus(ctx, exec.RequestID, catalog.Warning, nil)
	} else {
		_ = s.writeStreamStatus(ctx, exec.RequestID, "已加载技能方案", nil)
	}

	selection := agentskill.SelectRuntime(ctx, agentskill.SelectionRequest{
		Gateway:        s.gateway,
		Method:         exec.Request.Method,
		Host:           exec.Request.Host,
		Path:           exec.Request.Path,
		Headers:        exec.Request.Headers,
		AgentKey:       exec.Agent.Key,
		PowerKey:       exec.Power.Key,
		Input:          exec.Parsed.Input,
		History:        exec.Parsed.History,
		SourceTargetID: exec.Parsed.SourceTargetID,
		Catalog:        catalog,
		Limits:         skillLimits,
	})
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

	loadedSkills, loadWarnings := agentskill.LoadContents(selection.Selected, skillLimits)
	catalog.Loaded = loadedSkills
	catalog.LoadedContent = agentskill.RenderLoaded(loadedSkills)
	if len(loadWarnings) > 0 {
		catalog.Warning = strings.Join(loadWarnings, "\n")
	}
	loadStatus := stepStatusSuccess
	if catalog.Warning != "" {
		loadStatus = stepStatusWarning
	}
	tracker.Step(ctx, "skill_load", "技能加载", catalog.LoadedContent, map[string]any{
		"loaded":  catalog.LoadedKeys(),
		"warning": catalog.Warning,
	}, loadStatus)

	publicSettings := s.repo.ListActivePublicSettings(ctx, exec.Agent.SettingPackID)
	agentSettings := s.repo.ListActiveAgentSettings(ctx, exec.Agent.ID)
	agentKnowledge := s.repo.ListActiveAgentKnowledge(ctx, exec.Agent.ID)
	runtimePrompt := agentprompt.BuildRuntimePrompt(agentprompt.RuntimeInput{
		PublicSettings: publicSettings,
		AgentSettings:  agentSettings,
		Knowledge:      agentKnowledge,
		Powers:         powers,
		SkillCatalog:   catalog,
		History:        exec.Parsed.History,
	})
	tracker.Step(ctx, "knowledge", "运行资料", runtimePrompt, map[string]any{
		"setting_pack_id":  exec.Agent.SettingPackID,
		"public_settings":  len(publicSettings),
		"agent_settings":   len(agentSettings),
		"agent_knowledge":  len(agentKnowledge),
		"history_messages": len(exec.Parsed.History),
	}, stepStatusSuccess)
	s.repo.UpdateRun(ctx, exec.RunID, map[string]any{
		"skills": jsonText(map[string]any{
			"skill_pack_id": catalog.PackID,
			"available":     catalog.AvailableKeys(),
			"selected":      selection.Keys,
			"loaded":        catalog.LoadedKeys(),
			"warning":       firstText(selection.Warning, catalog.Warning),
		}),
		"runtime_context": runtimePrompt,
	})

	runtimeOptions := resolveRuntimeOptions(runtimeConfig, exec.Agent, exec.Parsed.Options)
	tracker.Step(ctx, "runtime_config", "运行配置", fmt.Sprintf("最大自动步骤: %d", runtimeOptions.MaxSteps), map[string]any{
		"max_steps":       runtimeOptions.MaxSteps,
		"agent_max_steps": exec.Agent.MaxAutoSteps,
		"request_options": exec.Parsed.Options,
	}, stepStatusSuccess)

	result := s.runAgentLoop(ctx, exec, runtimePrompt, &tracker, runtimeOptions)
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

func (s Service) runAgentLoop(ctx context.Context, exec runExecution, runtimePrompt string, tracker *runTracker, options runtimeOptions) agentLoopResult {
	history := append([]any{}, exec.Parsed.History...)
	artifacts := agentaction.NewArtifactAccumulator()
	lastOutput := ""
	gatewayLastID := ""

	if action, ok := agentaction.ActionFromInteractionResult(exec.Parsed.Input, exec.Parsed.History, exec.Parsed.SourceTargetID); ok {
		tracker.Step(ctx, "power_resume", "交互续跑能力", action.Power, map[string]any{
			"power":            action.Power,
			"input":            action.Input,
			"source_target_id": action.SourceTargetID,
		}, stepStatusSuccess)
		result := s.executePowerAction(ctx, exec, action, "", gatewayLastID)
		if result.LastID != "" {
			gatewayLastID = result.LastID
		}
		if loopResult, done := s.handlePowerActionResult(ctx, exec, tracker, result, &artifacts, &history, &lastOutput); done {
			return loopResult
		}
	}

	for step := 1; step <= options.MaxSteps; step++ {
		turn := s.collectAgentTurn(ctx, exec, runtimePrompt, history, step, options.MaxSteps, gatewayLastID)
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
			_ = s.writeSuccessResult(ctx, exec.RequestID, output)
			return newAgentLoopResult(output, runStatusSuccess, "")
		case agentTurnInteraction:
			_ = s.writeStreamOutput(ctx, exec.RequestID, turn.Output)
			_ = s.writeSuccessResult(ctx, exec.RequestID, turn.Output)
			return newAgentLoopResult(turn.Output, runStatusSuccess, "")
		case agentTurnAction:
			tracker.Step(ctx, "agent_action", "准备调用能力", turn.Action.Power, map[string]any{
				"text":   turn.Text,
				"action": turn.Action,
			}, stepStatusSuccess)
			result := s.executePowerAction(ctx, exec, turn.Action, turn.Text, gatewayLastID)
			if result.LastID != "" {
				gatewayLastID = result.LastID
			}
			if loopResult, done := s.handlePowerActionResult(ctx, exec, tracker, result, &artifacts, &history, &lastOutput); done {
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
	_ = s.writeSuccessResult(ctx, exec.RequestID, output)
	return newAgentLoopResult(output, runStatusSuccess, "")
}

func (s Service) executePowerAction(ctx context.Context, exec runExecution, action agentaction.Action, intro string, gatewayLastID string) agentaction.Result {
	return agentaction.ExecutePower(ctx, agentaction.ExecuteRequest{
		RequestID:      exec.RequestID,
		Method:         exec.Request.Method,
		Host:           exec.Request.Host,
		Path:           exec.Request.Path,
		Headers:        exec.Request.Headers,
		Input:          exec.Parsed.Input,
		History:        exec.Parsed.History,
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

func (s Service) handlePowerActionResult(
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
		artifacts.Add(result.Output)
		*lastOutput = agentaction.SummaryText(result.Output)
		tracker.Step(ctx, "tool_result", "能力调用结果", *lastOutput, map[string]any{
			"power":  result.Action.Power,
			"output": result.Output,
		}, stepStatusSuccess)
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
		message := firstText(result.Message, "能力调用失败")
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return newAgentLoopTextResult(result.Text, runStatusFail, message), true
	}
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

func resolveRuntimeOptions(config agentmodel.RuntimeConfig, agent agentmodel.Agent, requestOptions map[string]any) runtimeOptions {
	defaultMax := positiveInt(config.DefaultMaxAutoSteps, agentmodel.DefaultRuntimeMaxAutoSteps)
	hardMax := positiveInt(config.HardMaxAutoSteps, agentmodel.DefaultRuntimeHardMaxAutoSteps)
	if hardMax < defaultMax {
		hardMax = defaultMax
	}

	maxSteps := defaultMax
	if agent.MaxAutoSteps > 0 {
		maxSteps = agent.MaxAutoSteps
	}
	if requested := requestMaxSteps(requestOptions); requested > 0 {
		maxSteps = requested
	}
	if maxSteps <= 0 {
		maxSteps = defaultMax
	}
	if maxSteps > hardMax {
		maxSteps = hardMax
	}
	return runtimeOptions{MaxSteps: maxSteps}
}

func requestMaxSteps(options map[string]any) int {
	if len(options) == 0 {
		return 0
	}
	for _, key := range []string{"max_steps", "maxSteps", "max_auto_steps", "maxAutoSteps"} {
		value, exists := options[key]
		if exists {
			return int(frontstream.InputInt64(value, 0))
		}
	}
	return 0
}

func positiveInt(value int, fallback int) int {
	if value > 0 {
		return value
	}
	return fallback
}
