package energon

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	bodymodel "github.com/dever-package/bot/model/body"
	energonmodel "github.com/dever-package/bot/model/energon"
	usermodel "github.com/dever-package/user/model"
)

// UserUsageService provides the user-facing usage views backed by billing and cost facts.
type UserUsageService struct{}

type usageUser struct {
	Name    string
	Account string
}

var usageDefaultUserShortCache = newUsageShortCache[usageAggregatePage]()

func (UserUsageService) ProviderLoadUserUsage(c *server.Context, _ []any) any {
	return loadUserUsage(c)
}

func (UserUsageService) ProviderLoadFrontendUserUsage(c *server.Context, _ []any) any {
	return loadFrontendUserUsage(c)
}

func loadUserUsage(c *server.Context) any {
	ctx, query := usageContext(c)
	page, err := loadUsageAggregatePage(ctx, query, usageUserDimension)
	panicUsageError(err)
	return buildUserUsagePage(ctx, query, page, false)
}

func loadFrontendUserUsage(c *server.Context) any {
	now := time.Now()
	ctx, query, window, cacheable := frontendUserUsageContext(c, now)
	loadPage := func() (usageAggregatePage, error) {
		return loadUsageAggregatePage(ctx, query, usageUserDimension)
	}
	var page usageAggregatePage
	var err error
	if cacheable {
		page, err = usageDefaultUserShortCache.load(
			ctx,
			usageDefaultUserCacheKey(query, now),
			loadPage,
		)
	} else {
		page, err = loadPage()
	}
	panicUsageError(err)
	result := buildUserUsagePage(ctx, query, page, true)
	result["range_label"] = usageDashboardRangeLabel(window)
	return result
}

func frontendUserUsageContext(
	c *server.Context,
	now time.Time,
) (context.Context, userUsageQuery, usageDashboardWindow, bool) {
	ctx, query := frontendUsageContext(c)
	period := usageDashboardPeriodFromContext(c)
	window := resolveUsageDashboardWindow(period, query.StartedAt, query.EndedAt, now)
	query.StartedAt = window.StartedAt
	query.EndedAt = window.EndedAt
	if period != usageDashboardPeriodCustom {
		query.EndedAtGranularity = usageTimeGranularityInstant
	}
	cacheable := shouldCacheDefaultFrontendUserUsage(query, period)
	if cacheable {
		window = snapshotUsageDashboardWindow(period, window, now)
		query.StartedAt = window.StartedAt
		query.EndedAt = window.EndedAt
	}
	return ctx, query, window, cacheable
}

func shouldCacheDefaultFrontendUserUsage(query userUsageQuery, period string) bool {
	return query.FrontendOnly &&
		normalizeUsageDashboardPeriod(period) == usageDashboardPeriodThisMonth &&
		!query.UserIDSet &&
		query.ProjectID == 0 && len(query.ProjectIDs) == 0 &&
		query.SessionID == 0 && len(query.SessionIDs) == 0 &&
		len(query.TeamRunIDs) == 0 &&
		query.PowerID == 0 &&
		strings.TrimSpace(query.Scene) == "" &&
		strings.TrimSpace(query.BodyFunctionCode) == "" &&
		strings.TrimSpace(query.Keyword) == ""
}

func usageDefaultUserCacheKey(query userUsageQuery, now time.Time) string {
	return usageStatisticsCacheKey(
		"users",
		now,
		query.StartedAt.Format(time.RFC3339Nano),
		query.EndedAt.Format(time.RFC3339Nano),
		query.EndedAtGranularity,
		strconv.Itoa(query.Page),
		strconv.Itoa(query.PageSize),
	)
}

func buildUserUsagePage(
	ctx context.Context,
	query userUsageQuery,
	page usageAggregatePage,
	frontendOnly bool,
) map[string]any {
	users := loadUsageUsers(ctx, page.Rows)
	bodyFunctionEnabled := map[string]bool{}
	if frontendOnly {
		bodyFunctionEnabled = usageBodyFunctionEnabledMap(ctx, []string{
			bodymodel.FunctionCodeWorks,
			bodymodel.FunctionCodeDialogue,
			bodymodel.FunctionCodeTool,
			bodymodel.FunctionCodeAssets,
		})
	}
	rows := make([]map[string]any, 0, len(page.Rows))
	for _, aggregate := range page.Rows {
		row := usageMetricRow(aggregate)
		user := users[aggregate.UserID]
		row["id"] = "user-" + strconv.FormatUint(aggregate.UserID, 10)
		row["user_id"] = aggregate.UserID
		row["user_name"] = usageUserName(aggregate.UserID, user)
		row["user_account"] = usageUserAccount(aggregate.UserID, user)
		if frontendOnly {
			row["body_function_enabled"] = bodyFunctionEnabled
		}
		appendUsageDetailQuery(row, query)
		rows = append(rows, row)
	}
	return usagePageMap(page, rows)
}

func (UserUsageService) ProviderLoadScenes(_ *server.Context, _ []any) any {
	return usageSceneOptions()
}

func usageSceneOptions() []map[string]any {
	options := energonmodel.CostSceneOptions()
	result := make([]map[string]any, 0, len(options))
	for _, option := range options {
		label := util.ToStringTrimmed(option["value"])
		option["label"] = label
		option["name"] = label
		result = append(result, option)
	}
	return result
}

func usageContext(c *server.Context) (context.Context, userUsageQuery) {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
	}
	return ctx, userUsageQueryFromContext(c, time.Now())
}

func frontendUsageContext(c *server.Context) (context.Context, userUsageQuery) {
	ctx, query := usageContext(c)
	query.FrontendOnly = true
	return ctx, query
}

func loadUsageUsers(ctx context.Context, aggregates []usageAggregate) map[uint64]usageUser {
	ids := collectUsageIDs(aggregates, func(row usageAggregate) uint64 { return row.UserID })
	return loadUsageUsersByIDs(ctx, ids)
}

func loadUsageUsersByIDs(ctx context.Context, ids []uint64) map[uint64]usageUser {
	if len(ids) == 0 {
		return map[uint64]usageUser{}
	}
	rows := usermodel.NewUserModel().Select(ctx, map[string]any{"id": ids}, map[string]any{
		"field": "main.id,main.name,main.account",
	})
	users := make(map[uint64]usageUser, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			users[row.ID] = usageUser{Name: strings.TrimSpace(row.Name), Account: strings.TrimSpace(row.Account)}
		}
	}
	return users
}

func loadPowerNames(ctx context.Context, ids []uint64) map[uint64]string {
	if len(ids) == 0 {
		return map[uint64]string{}
	}
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{"id": ids}, map[string]any{
		"field": "main.id,main.name",
	})
	names := make(map[uint64]string, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			names[row.ID] = strings.TrimSpace(row.Name)
		}
	}
	return names
}

func collectUsageIDs(rows []usageAggregate, getID func(usageAggregate) uint64) []uint64 {
	unique := make(map[uint64]struct{})
	for _, row := range rows {
		if id := getID(row); id > 0 {
			unique[id] = struct{}{}
		}
	}
	return sortedUsageIDs(unique)
}

func sortedUsageIDs(unique map[uint64]struct{}) []uint64 {
	ids := make([]uint64, 0, len(unique))
	for id := range unique {
		ids = append(ids, id)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
	return ids
}

func usageMetricRow(aggregate usageAggregate) map[string]any {
	return map[string]any{
		"logical_calls":     aggregate.LogicalCalls,
		"success_calls":     aggregate.SuccessCalls,
		"failed_calls":      aggregate.FailedCalls,
		"success_rate":      aggregate.successRate(),
		"provider_attempts": aggregate.ProviderAttempts,
		"prompt_tokens":     aggregate.PromptTokens,
		"completion_tokens": aggregate.CompletionTokens,
		"total_tokens":      aggregate.PromptTokens + aggregate.CompletionTokens,
		"cached_tokens":     aggregate.CachedTokens,
		"cost_micros":       aggregate.CostMicros,
		"cost_cny":          fmt.Sprintf("%.6f", float64(aggregate.CostMicros)/1_000_000),
		"settled_points":    aggregate.SettledPoints,
		"last_used_at":      aggregate.LastUsedAt,
	}
}

func (aggregate usageAggregate) successRate() string {
	completed := aggregate.SuccessCalls + aggregate.FailedCalls
	if completed == 0 {
		return "-"
	}
	return fmt.Sprintf("%.1f%%", float64(aggregate.SuccessCalls)*100/float64(completed))
}

func usagePageMap(page usageAggregatePage, rows []map[string]any) map[string]any {
	return map[string]any{
		"list":     rows,
		"total":    page.Total,
		"page":     page.Page,
		"pageSize": page.PageSize,
	}
}

func appendUsageDetailQuery(row map[string]any, query userUsageQuery) {
	row["detail_power_id"] = query.PowerID
	row["detail_started_at"] = query.StartedAt.Format(time.RFC3339)
	row["detail_ended_at"] = usageQueryExclusiveEnd(query).Format(time.RFC3339Nano)
}

func usageUserName(userID uint64, user usageUser) string {
	if userID == 0 {
		return "系统调用"
	}
	if user.Name != "" {
		return user.Name
	}
	return "用户 #" + strconv.FormatUint(userID, 10) + "（已删除）"
}

func usageUserAccount(userID uint64, user usageUser) string {
	if userID == 0 || user.Account == "" {
		return "-"
	}
	return user.Account
}

func usageRelationName(kind string, id uint64, name string) string {
	if id == 0 {
		return "未关联" + kind
	}
	if name != "" {
		return name
	}
	return fmt.Sprintf("%s #%d（已删除）", kind, id)
}

func panicUsageError(err error) {
	if err != nil {
		panic(err)
	}
}
