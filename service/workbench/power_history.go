package workbench

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	teamservice "github.com/dever-package/bot/service/team"
)

const (
	defaultPowerHistoryLimit = 20
	maxPowerHistoryLimit     = 50
	powerHistoryTitleLimit   = 24
	powerHistorySummaryLimit = 96
	powerHistoryTitleTimeout = 20 * time.Second
)

var powerHistoryTitleGateway = energonservice.NewGatewayService()

type PowerHistoryListRequest struct {
	TeamID      uint64
	TeamPowerID uint64
	BeforeID    uint64
	Limit       int
}

type powerHistoryCreated struct {
	RunID        uint64
	HistoryID    uint64
	Title        string
	InputSummary string
}

func (s Service) createPowerHistory(
	ctx context.Context,
	workspace workspacemodel.TeamWorkspace,
	binding teamservice.WorkbenchPowerBinding,
	runID uint64,
	requestID string,
	prompt string,
	inputSummary string,
) (created powerHistoryCreated, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			created = powerHistoryCreated{}
			err = fmt.Errorf("创建工具历史失败: %v", recovered)
		}
	}()
	requestID = strings.TrimSpace(requestID)
	if workspace.UserID == 0 || workspace.BodyID == 0 || runID == 0 || requestID == "" {
		return powerHistoryCreated{}, fmt.Errorf("工具历史运行信息不完整")
	}
	now := time.Now()
	title := powerHistoryFallbackTitle(binding.Name, prompt, now)
	historyID := uint64(workspacemodel.NewPowerHistoryModel().Insert(ctx, map[string]any{
		"user_id":       workspace.UserID,
		"team_id":       binding.TeamID,
		"team_power_id": binding.TeamPowerID,
		"body_id":       workspace.BodyID,
		"run_id":        runID,
		"request_id":    requestID,
		"title":         title,
		"title_source":  workspacemodel.PowerHistoryTitleSourceAuto,
		"created_at":    now,
		"updated_at":    now,
	}))
	if historyID == 0 {
		return powerHistoryCreated{}, fmt.Errorf("创建工具历史失败")
	}
	s.generatePowerHistoryTitleAsync(historyID, binding.Name, binding.Power.Kind, prompt)
	return powerHistoryCreated{
		RunID:        runID,
		HistoryID:    historyID,
		Title:        title,
		InputSummary: inputSummary,
	}, nil
}

func (s Service) generatePowerHistoryTitleAsync(historyID uint64, powerName string, kind string, prompt string) {
	go func() {
		defer func() {
			_ = recover()
		}()
		titleCtx, cancelTitle := context.WithTimeout(context.Background(), powerHistoryTitleTimeout)
		title, err := powerHistoryTitleGateway.GenerateShortTitle(titleCtx, energonservice.ShortTitleRequest{
			PowerID:  energonmodel.DefaultLLMPowerID,
			Role:     powerHistoryTitleRole(),
			Source:   powerHistoryTitleSource(powerName, kind, prompt),
			MaxRunes: 16,
		})
		cancelTitle()
		if err != nil || title == "" {
			return
		}
		updateCtx, cancelUpdate := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancelUpdate()
		workspacemodel.NewPowerHistoryModel().Update(updateCtx, map[string]any{
			"id":           historyID,
			"title_source": workspacemodel.PowerHistoryTitleSourceAuto,
		}, map[string]any{
			"title":        title,
			"title_source": workspacemodel.PowerHistoryTitleSourceLLM,
			"updated_at":   time.Now(),
		})
	}()
}

func (s Service) PowerHistory(ctx context.Context, request PowerHistoryListRequest) (map[string]any, error) {
	binding, err := s.team.ResolveWorkbenchPower(ctx, request.TeamID, request.TeamPowerID)
	if err != nil {
		return nil, err
	}
	workspace, err := s.requireWorkspace(ctx, binding.TeamID)
	if err != nil {
		return nil, err
	}
	baseFilter := powerHistoryOwnershipFilter(*workspace, binding.TeamPowerID)
	filter := cloneMap(baseFilter)
	if request.BeforeID > 0 {
		filter["id"] = map[string]any{"lt": request.BeforeID}
	}
	limit := normalizePowerHistoryLimit(request.Limit)
	model := workspacemodel.NewPowerHistoryModel()
	rows := model.Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": limit + 1,
	})
	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}
	runs := powerHistoryRuns(ctx, rows)
	params := s.powerHistoryParams(ctx, binding, 0)
	items := make([]map[string]any, 0, len(rows))
	var beforeID uint64
	for _, row := range rows {
		if row == nil {
			continue
		}
		items = append(items, powerHistoryItem(*row, runs[row.RunID], params))
		beforeID = row.ID
	}
	return map[string]any{
		"items":     items,
		"total":     model.Count(ctx, baseFilter),
		"has_more":  hasMore,
		"before_id": beforeID,
	}, nil
}

func (s Service) PowerHistoryDetail(ctx context.Context, teamID uint64, historyID uint64) (map[string]any, error) {
	if historyID == 0 {
		return nil, fmt.Errorf("工具历史不存在")
	}
	workspace, err := s.requireWorkspace(ctx, teamID)
	if err != nil {
		return nil, err
	}
	history := workspacemodel.NewPowerHistoryModel().Find(ctx, map[string]any{
		"id":      historyID,
		"user_id": workspace.UserID,
		"team_id": workspace.TeamID,
		"body_id": workspace.BodyID,
	})
	if history == nil {
		return nil, fmt.Errorf("工具历史不存在")
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": history.RunID})
	if !powerHistoryRunMatches(*history, run) {
		return nil, fmt.Errorf("工具历史运行记录不可用")
	}
	binding, err := s.team.ResolveWorkbenchPower(ctx, workspace.TeamID, history.TeamPowerID)
	if err != nil {
		return nil, err
	}
	input := recordValue(run.Input)
	sourceTargetID := powerRunSourceTargetID(ctx, input, run.RequestID)
	params := s.powerHistoryParams(ctx, binding, sourceTargetID)
	item := powerHistoryItem(*history, run, params)
	item["error"] = strings.TrimSpace(run.Error)
	item["input"] = powerReplayParamInput(params, input)
	item["output"] = recordValue(run.Output)
	item["target_asset_id"] = nestedUint64(input, powerTargetAssetIDKey)
	item["source_target_id"] = sourceTargetID
	return map[string]any{"history": item}, nil
}

func (s Service) powerHistoryParams(
	ctx context.Context,
	binding teamservice.WorkbenchPowerBinding,
	sourceTargetID uint64,
) []energoninput.PowerParam {
	form, err := s.team.WorkbenchPowerForm(ctx, binding.TeamID, binding.TeamPowerID, sourceTargetID)
	if err != nil {
		return nil
	}
	params, _ := form["params"].([]energoninput.PowerParam)
	return params
}

func powerHistoryRuns(ctx context.Context, rows []*workspacemodel.PowerHistory) map[uint64]*teammodel.Run {
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.RunID > 0 {
			ids = append(ids, row.RunID)
		}
	}
	result := make(map[uint64]*teammodel.Run, len(ids))
	if len(ids) == 0 {
		return result
	}
	fields := "main.id,main.request_id,main.body_id,main.team_id,main.input,main.error,main.status,main.started_at,main.finished_at,main.created_at"
	for _, run := range teammodel.NewRunModel().Select(ctx, map[string]any{"id": ids}, map[string]any{
		"field": fields,
	}) {
		if run != nil {
			result[run.ID] = run
		}
	}
	return result
}

func powerHistoryItem(history workspacemodel.PowerHistory, run *teammodel.Run, params []energoninput.PowerParam) map[string]any {
	item := map[string]any{
		"id":            history.ID,
		"run_id":        history.RunID,
		"request_id":    history.RequestID,
		"title":         history.Title,
		"title_source":  history.TitleSource,
		"input_summary": "",
		"status":        "unavailable",
		"error":         "运行记录不可用",
		"created_at":    history.CreatedAt,
		"updated_at":    history.UpdatedAt,
	}
	if run == nil {
		return item
	}
	item["status"] = run.Status
	item["error"] = compactPowerHistoryText(run.Error, 180)
	item["started_at"] = run.StartedAt
	item["finished_at"] = run.FinishedAt
	runInput := recordValue(run.Input)
	item["input_summary"] = powerHistoryInputSummary(
		params,
		powerReplayInput(runInput),
	)
	return item
}

func powerHistoryOwnershipFilter(workspace workspacemodel.TeamWorkspace, teamPowerID uint64) map[string]any {
	return map[string]any{
		"user_id":       workspace.UserID,
		"team_id":       workspace.TeamID,
		"team_power_id": teamPowerID,
		"body_id":       workspace.BodyID,
	}
}

func powerHistoryRunMatches(history workspacemodel.PowerHistory, run *teammodel.Run) bool {
	if run == nil || run.ID != history.RunID || run.BodyID != history.BodyID || run.TeamID != history.TeamID {
		return false
	}
	if strings.TrimSpace(run.RequestID) != strings.TrimSpace(history.RequestID) {
		return false
	}
	return nestedUint64(recordValue(run.Input), teamservice.CanvasPowerMetaTeamPowerID) == history.TeamPowerID
}

func powerReplayParamInput(params []energoninput.PowerParam, runInput map[string]any) map[string]any {
	return powerConfiguredParamInput(params, powerReplayInput(runInput))
}

func powerConfiguredParamInput(params []energoninput.PowerParam, source map[string]any) map[string]any {
	result := make(map[string]any, len(params)+1)
	for _, param := range params {
		key := powerParamInputKey(param)
		if key == "" {
			continue
		}
		if value, exists := source[key]; exists {
			result[key] = value
		}
	}
	if references := recordValue(source["_reference_contents"]); len(references) > 0 {
		result["_reference_contents"] = references
	}
	return result
}

func powerReplayInput(runInput map[string]any) map[string]any {
	if source := recordValue(runInput[powerReplayInputKey]); len(source) > 0 {
		return source
	}
	return runInput
}

func powerRunSourceTargetID(ctx context.Context, runInput map[string]any, requestID string) uint64 {
	if targetID := nestedUint64(runInput, teamservice.CanvasPowerMetaSourceTargetID); targetID > 0 {
		return targetID
	}
	return energonservice.PowerTargetIDByRequestID(ctx, requestID)
}

func powerHistoryPrompt(params []energoninput.PowerParam, input map[string]any) string {
	for _, param := range params {
		if !energoninput.IsPromptParamType(param.Type) {
			continue
		}
		key := powerParamInputKey(param)
		if key == "" {
			continue
		}
		if value, ok := input[key].(string); ok {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func powerParamInputKey(param energoninput.PowerParam) string {
	if key := strings.TrimSpace(param.Key); key != "" {
		return key
	}
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	if param.ID > 0 {
		return fmt.Sprint(param.ID)
	}
	return ""
}

func powerHistoryInputSummary(params []energoninput.PowerParam, input map[string]any) string {
	if prompt := powerHistoryPrompt(params, input); prompt != "" {
		return compactPowerHistoryText(prompt, powerHistorySummaryLimit)
	}
	for _, key := range []string{"prompt", "text", "input", "content", "description"} {
		if value, ok := input[key].(string); ok && strings.TrimSpace(value) != "" {
			return compactPowerHistoryText(value, powerHistorySummaryLimit)
		}
	}
	keys := make([]string, 0, len(input))
	for key := range input {
		if !strings.HasPrefix(key, "_") {
			keys = append(keys, key)
		}
	}
	sort.Strings(keys)
	for _, key := range keys {
		if value, ok := input[key].(string); ok && strings.TrimSpace(value) != "" {
			return compactPowerHistoryText(value, powerHistorySummaryLimit)
		}
	}
	return ""
}

func powerHistoryFallbackTitle(powerName string, prompt string, now time.Time) string {
	if title := compactPowerHistoryText(prompt, powerHistoryTitleLimit); title != "" {
		return title
	}
	powerName = compactPowerHistoryText(powerName, 16)
	if powerName == "" {
		powerName = "工具运行"
	}
	return powerName + " " + now.Format("01-02 15:04")
}

func compactPowerHistoryText(value string, limit int) string {
	value = strings.Join(strings.Fields(strings.TrimSpace(value)), " ")
	if value == "" || limit <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) > limit {
		return string(runes[:limit])
	}
	return value
}

func powerHistoryTitleRole() string {
	return strings.Join([]string{
		"你是工具运行标题生成器。",
		"根据工具名称、工具类型和用户提示词生成简短中文标题。",
		"要求：6到16个汉字；准确概括用户意图；不要标点；不要解释。",
		"只输出标题文本。",
	}, "\n")
}

func powerHistoryTitleSource(powerName string, kind string, prompt string) string {
	parts := []string{
		"工具名称：" + compactPowerHistoryText(powerName, 32),
		"工具类型：" + compactPowerHistoryText(kind, 24),
	}
	if prompt = compactPowerHistoryText(prompt, 800); prompt != "" {
		parts = append(parts, "用户提示词："+prompt)
	}
	return strings.Join(parts, "\n")
}

func normalizePowerHistoryLimit(limit int) int {
	if limit <= 0 {
		return defaultPowerHistoryLimit
	}
	if limit > maxPowerHistoryLimit {
		return maxPowerHistoryLimit
	}
	return limit
}
