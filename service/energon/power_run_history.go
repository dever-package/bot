package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"

	energonmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
)

const (
	defaultPowerRunHistoryLimit   = 20
	maxPowerRunHistoryLimit       = 50
	powerRunHistoryTitleLimit     = 24
	powerRunHistorySummaryLimit   = 96
	powerRunHistoryPendingTimeout = 2 * time.Hour
	powerRunHistoryStreamTimeout  = botstream.WorkerTimeout + 10*time.Second
	powerRunHistoryUpdateTimeout  = 5 * time.Second
)

type PowerRunHistoryService struct{}

type PowerRunHistoryCreateRequest struct {
	AdminID        uint64
	PowerKey       string
	Input          map[string]any
	SourceTargetID uint64
}

type PowerRunHistoryCreated struct {
	HistoryID      uint64
	RequestID      string
	Title          string
	InputSummary   string
	SourceTargetID uint64
}

type PowerRunHistoryListRequest struct {
	AdminID  uint64
	PowerKey string
	BeforeID uint64
	Limit    int
}

type PowerRunHistoryDetailRequest struct {
	AdminID   uint64
	PowerKey  string
	HistoryID uint64
}

func NewPowerRunHistoryService() PowerRunHistoryService {
	return PowerRunHistoryService{}
}

func (PowerRunHistoryService) Create(
	ctx context.Context,
	request PowerRunHistoryCreateRequest,
) (PowerRunHistoryCreated, error) {
	request.PowerKey = strings.TrimSpace(request.PowerKey)
	if request.AdminID == 0 {
		return PowerRunHistoryCreated{}, fmt.Errorf("登录账号无效")
	}
	if request.PowerKey == "" {
		return PowerRunHistoryCreated{}, fmt.Errorf("能力不能为空")
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"key": request.PowerKey})
	if power == nil {
		return PowerRunHistoryCreated{}, fmt.Errorf("能力不存在: %s", request.PowerKey)
	}
	if request.Input == nil {
		request.Input = map[string]any{}
	}
	inputSnapshot, err := json.Marshal(request.Input)
	if err != nil {
		return PowerRunHistoryCreated{}, fmt.Errorf("保存能力输入失败: %w", err)
	}

	now := time.Now()
	summary := powerRunHistoryInputSummary(request.Input)
	title := powerRunHistoryTitle(power.Name, summary, now)
	requestID := uuid.NewString()
	historyID := uint64(energonmodel.NewPowerRunHistoryModel().Insert(ctx, map[string]any{
		"admin_id":         request.AdminID,
		"power_id":         power.ID,
		"power_key":        power.Key,
		"request_id":       requestID,
		"title":            title,
		"input_summary":    summary,
		"input":            string(inputSnapshot),
		"output":           "{}",
		"source_target_id": request.SourceTargetID,
		"status":           energonmodel.PowerRunHistoryStatusPending,
		"started_at":       now,
		"created_at":       now,
		"updated_at":       now,
	}))
	if historyID == 0 {
		return PowerRunHistoryCreated{}, fmt.Errorf("创建能力运行历史失败")
	}
	return PowerRunHistoryCreated{
		HistoryID:      historyID,
		RequestID:      requestID,
		Title:          title,
		InputSummary:   summary,
		SourceTargetID: request.SourceTargetID,
	}, nil
}

func (PowerRunHistoryService) List(
	ctx context.Context,
	request PowerRunHistoryListRequest,
) (map[string]any, error) {
	baseFilter, err := powerRunHistoryFilter(request.AdminID, request.PowerKey)
	if err != nil {
		return nil, err
	}
	filter := cloneAnyMap(baseFilter)
	if request.BeforeID > 0 {
		filter["id"] = map[string]any{"lt": request.BeforeID}
	}
	limit := normalizePowerRunHistoryLimit(request.Limit)
	model := energonmodel.NewPowerRunHistoryModel()
	rows := model.Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": limit + 1,
	})
	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}
	items := make([]map[string]any, 0, len(rows))
	var beforeID uint64
	for _, row := range rows {
		if row == nil {
			continue
		}
		items = append(items, powerRunHistoryItem(*row))
		beforeID = row.ID
	}
	return map[string]any{
		"items":     items,
		"total":     model.Count(ctx, baseFilter),
		"has_more":  hasMore,
		"before_id": beforeID,
	}, nil
}

func (PowerRunHistoryService) Detail(
	ctx context.Context,
	request PowerRunHistoryDetailRequest,
) (map[string]any, error) {
	filter, err := powerRunHistoryFilter(request.AdminID, request.PowerKey)
	if err != nil {
		return nil, err
	}
	if request.HistoryID == 0 {
		return nil, fmt.Errorf("能力运行历史不存在")
	}
	filter["id"] = request.HistoryID
	history := energonmodel.NewPowerRunHistoryModel().Find(ctx, filter)
	if history == nil {
		return nil, fmt.Errorf("能力运行历史不存在")
	}
	item := powerRunHistoryItem(*history)
	item["input"] = decodePowerRunHistoryMap(history.Input)
	item["output"] = powerRunHistoryOutput(history.Output)
	item["target_asset_id"] = 0
	item["source_target_id"] = history.SourceTargetID
	return map[string]any{"history": item}, nil
}

func (PowerRunHistoryService) MarkFailed(ctx context.Context, adminID uint64, requestID string, message string) {
	message = strings.TrimSpace(message)
	if message == "" {
		message = "能力运行失败"
	}
	finishPowerRunHistory(ctx, adminID, requestID, energonmodel.PowerRunHistoryStatusFail, message)
}

func (PowerRunHistoryService) MarkCanceled(ctx context.Context, adminID uint64, requestID string) {
	finishPowerRunHistory(ctx, adminID, requestID, energonmodel.PowerRunHistoryStatusCanceled, "运行已停止")
}

func (service PowerRunHistoryService) Complete(
	ctx context.Context,
	adminID uint64,
	requestID string,
	output any,
) {
	requestID = strings.TrimSpace(requestID)
	if adminID == 0 || requestID == "" {
		return
	}
	finalOutput := botprotocol.ExtractOutput(output)
	raw, err := json.Marshal(finalOutput)
	if err != nil {
		service.MarkFailed(ctx, adminID, requestID, "保存能力运行结果失败")
		return
	}
	now := time.Now()
	energonmodel.NewPowerRunHistoryModel().Update(ctx, map[string]any{
		"admin_id":   adminID,
		"request_id": requestID,
		"status":     energonmodel.PowerRunHistoryStatusPending,
	}, map[string]any{
		"output":      string(raw),
		"status":      energonmodel.PowerRunHistoryStatusSuccess,
		"error":       "",
		"finished_at": now,
		"updated_at":  now,
	})
}

func (service PowerRunHistoryService) TrackStream(
	ctx context.Context,
	adminID uint64,
	requestID string,
	reader botstream.Reader,
) {
	requestID = strings.TrimSpace(requestID)
	if adminID == 0 || requestID == "" || reader == nil {
		return
	}
	detached := context.WithoutCancel(ctx)
	go service.trackStream(detached, adminID, requestID, reader)
}

func finishPowerRunHistory(ctx context.Context, adminID uint64, requestID string, status string, message string) {
	requestID = strings.TrimSpace(requestID)
	if adminID == 0 || requestID == "" {
		return
	}
	updatePowerRunHistoryState(ctx, map[string]any{
		"admin_id":   adminID,
		"request_id": requestID,
	}, status, message)
}

func (service PowerRunHistoryService) trackStream(
	ctx context.Context,
	adminID uint64,
	requestID string,
	reader botstream.Reader,
) {
	defer func() {
		if recovered := recover(); recovered != nil {
			updateCtx, cancel := context.WithTimeout(ctx, powerRunHistoryUpdateTimeout)
			defer cancel()
			service.MarkFailed(updateCtx, adminID, requestID, fmt.Sprintf("读取能力运行结果失败: %v", recovered))
		}
	}()

	watchCtx, cancelWatch := context.WithTimeout(ctx, powerRunHistoryStreamTimeout)
	collected := botstream.Collect(watchCtx, reader, nil, botstream.CollectOptions{
		RequestID:      requestID,
		InitialLastID:  "0-0",
		Block:          time.Second,
		CollectOutputs: true,
	})
	cancelWatch()

	updateCtx, cancelUpdate := context.WithTimeout(ctx, powerRunHistoryUpdateTimeout)
	defer cancelUpdate()
	if collected.Err != nil {
		message := collected.Err.Error()
		if collected.Timeout {
			message = "等待能力运行结果超时"
		}
		service.MarkFailed(updateCtx, adminID, requestID, message)
		return
	}
	finalOutput := botstream.FrameOutput(collected.Frame)
	if strings.EqualFold(strings.TrimSpace(botprotocol.AsText(finalOutput["event"])), "cancel") {
		service.MarkCanceled(updateCtx, adminID, requestID)
		return
	}
	if botstream.FrameStatus(collected.Frame) != botprotocol.ResponseStatusSuccess {
		service.MarkFailed(updateCtx, adminID, requestID, powerRunHistoryFrameError(collected.Frame))
		return
	}
	service.Complete(
		updateCtx,
		adminID,
		requestID,
		botprotocol.MergeStreamFinal(collected.State.Outputs, finalOutput),
	)
}

func updatePowerRunHistoryState(ctx context.Context, filter map[string]any, status string, message string) {
	filter["status"] = energonmodel.PowerRunHistoryStatusPending
	now := time.Now()
	energonmodel.NewPowerRunHistoryModel().Update(ctx, filter, map[string]any{
		"status":      status,
		"error":       strings.TrimSpace(message),
		"finished_at": now,
		"updated_at":  now,
	})
}

func powerRunHistoryFilter(adminID uint64, powerKey string) (map[string]any, error) {
	powerKey = strings.TrimSpace(powerKey)
	if adminID == 0 {
		return nil, fmt.Errorf("登录账号无效")
	}
	if powerKey == "" {
		return nil, fmt.Errorf("能力不能为空")
	}
	return map[string]any{
		"admin_id":  adminID,
		"power_key": powerKey,
	}, nil
}

func powerRunHistoryItem(history energonmodel.PowerRunHistory) map[string]any {
	status, errorText := powerRunHistoryState(history)
	startedAt := history.StartedAt
	if startedAt.IsZero() {
		startedAt = history.CreatedAt
	}
	return map[string]any{
		"id":            history.ID,
		"run_id":        0,
		"request_id":    history.RequestID,
		"title":         history.Title,
		"title_source":  "auto",
		"input_summary": history.InputSummary,
		"status":        status,
		"error":         errorText,
		"created_at":    history.CreatedAt,
		"started_at":    startedAt,
		"finished_at":   history.FinishedAt,
	}
}

func powerRunHistoryState(history energonmodel.PowerRunHistory) (string, string) {
	if history.Status == energonmodel.PowerRunHistoryStatusSuccess {
		return energonmodel.PowerRunHistoryStatusSuccess, ""
	}
	if history.Status == energonmodel.PowerRunHistoryStatusCanceled {
		return energonmodel.PowerRunHistoryStatusCanceled, history.Error
	}
	if history.Status == energonmodel.PowerRunHistoryStatusFail {
		return energonmodel.PowerRunHistoryStatusFail, history.Error
	}
	if !history.CreatedAt.IsZero() && time.Since(history.CreatedAt) > powerRunHistoryPendingTimeout {
		return "unavailable", "运行结果已不可用"
	}
	return energonmodel.PowerRunHistoryStatusPending, ""
}

func powerRunHistoryFrameError(frame map[string]any) string {
	message := strings.TrimSpace(botprotocol.AsText(frame["msg"]))
	if message == "" {
		message = strings.TrimSpace(botprotocol.AsText(botstream.FrameOutput(frame)["error"]))
	}
	if message == "" {
		message = "能力运行失败"
	}
	return message
}

func powerRunHistoryOutput(raw string) map[string]any {
	output := decodePowerRunHistoryMap(raw)
	if len(output) == 0 {
		return nil
	}
	return output
}

func decodePowerRunHistoryMap(raw string) map[string]any {
	result := map[string]any{}
	if strings.TrimSpace(raw) == "" || json.Unmarshal([]byte(raw), &result) != nil {
		return map[string]any{}
	}
	return result
}

func powerRunHistoryInputSummary(input map[string]any) string {
	for _, key := range []string{"prompt", "text", "input", "content", "description"} {
		if value, ok := input[key].(string); ok {
			if summary := compactPowerRunHistoryText(value, powerRunHistorySummaryLimit); summary != "" {
				return summary
			}
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
		if value, ok := input[key].(string); ok {
			if summary := compactPowerRunHistoryText(value, powerRunHistorySummaryLimit); summary != "" {
				return summary
			}
		}
	}
	return ""
}

func powerRunHistoryTitle(powerName string, summary string, now time.Time) string {
	if title := compactPowerRunHistoryText(summary, powerRunHistoryTitleLimit); title != "" {
		return title
	}
	powerName = compactPowerRunHistoryText(powerName, 16)
	if powerName == "" {
		powerName = "能力运行"
	}
	return powerName + " " + now.Format("01-02 15:04")
}

func compactPowerRunHistoryText(value string, limit int) string {
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

func normalizePowerRunHistoryLimit(limit int) int {
	if limit <= 0 {
		return defaultPowerRunHistoryLimit
	}
	if limit > maxPowerRunHistoryLimit {
		return maxPowerRunHistoryLimit
	}
	return limit
}
