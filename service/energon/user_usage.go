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

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
	usermodel "github.com/dever-package/user/model"
)

const (
	userUsageBatchSize       = 500
	defaultUserUsagePageSize = 10
	maxUserUsagePageSize     = 100
)

// UserUsageService aggregates logical billing calls and provider costs by user.
type UserUsageService struct{}

type userUsageQuery struct {
	UserID    uint64
	PowerID   uint64
	Scene     string
	Keyword   string
	StartedAt time.Time
	EndedAt   time.Time
	Page      int
	PageSize  int
}

type userUsageSummary struct {
	UserID           uint64
	LogicalCalls     int64
	SuccessCalls     int64
	FailedCalls      int64
	ProviderAttempts int64
	PromptTokens     int64
	CompletionTokens int64
	CachedTokens     int64
	CostMicros       int64
	SettledPoints    int64
	LastUsedAt       time.Time
}

type usageUser struct {
	Name    string
	Account string
}

func (UserUsageService) ProviderLoadUserUsage(c *server.Context, _ []any) any {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
	}
	query := userUsageQueryFromContext(c, time.Now())
	summaries := aggregateUserUsage(
		loadUserUsageCharges(ctx, query),
		loadUserUsageCosts(ctx, query),
	)
	return buildUserUsageTable(summaries, loadUsageUsers(ctx, summaries), query)
}

func (UserUsageService) ProviderLoadScenes(_ *server.Context, _ []any) any {
	options := energonmodel.CostSceneOptions()
	for _, option := range options {
		label := util.ToStringTrimmed(option["value"])
		option["label"] = label
		option["name"] = label
	}
	return options
}

func userUsageQueryFromContext(c *server.Context, now time.Time) userUsageQuery {
	query := userUsageQuery{
		StartedAt: now.AddDate(0, 0, -7),
		EndedAt:   now,
		Page:      1,
		PageSize:  defaultUserUsagePageSize,
	}
	if c == nil {
		return query
	}
	query.UserID = util.ToUint64(c.Input("user_id"))
	query.PowerID = util.ToUint64(c.Input("power_id"))
	query.Scene = util.ToStringTrimmed(c.Input("scene"))
	query.Keyword = strings.ToLower(util.ToStringTrimmed(c.Input("keyword")))
	query.Page = util.ToIntDefault(c.Input("page"), 1)
	query.PageSize = util.ToIntDefault(c.Input("pageSize"), defaultUserUsagePageSize)
	if parsed, ok := parseUserUsageTime(c.Input("created_at_start")); ok {
		query.StartedAt = parsed
	}
	if parsed, ok := parseUserUsageTime(c.Input("created_at_end")); ok {
		query.EndedAt = parsed
	}
	if query.StartedAt.After(query.EndedAt) {
		query.StartedAt, query.EndedAt = query.EndedAt, query.StartedAt
	}
	query.Page = max(query.Page, 1)
	query.PageSize = min(max(query.PageSize, 1), maxUserUsagePageSize)
	return query
}

func parseUserUsageTime(value any) (time.Time, bool) {
	text := util.ToStringTrimmed(value)
	for _, layout := range []string{
		time.RFC3339,
		"2006-01-02T15:04:05",
		"2006-01-02T15:04",
		"2006-01-02 15:04:05",
		"2006-01-02",
	} {
		if parsed, err := time.ParseInLocation(layout, text, time.Local); err == nil {
			return parsed, true
		}
	}
	return time.Time{}, false
}

func userUsageFilters(query userUsageQuery) map[string]any {
	filters := map[string]any{
		"created_at": map[string]any{
			">=": query.StartedAt,
			"<=": query.EndedAt,
		},
	}
	if query.UserID > 0 {
		filters["user_id"] = query.UserID
	}
	if query.PowerID > 0 {
		filters["power_id"] = query.PowerID
	}
	if query.Scene != "" {
		filters["scene"] = query.Scene
	}
	return filters
}

func loadUserUsageCharges(ctx context.Context, query userUsageQuery) []*billingmodel.PowerCharge {
	model := billingmodel.NewPowerChargeModel()
	filters := userUsageFilters(query)
	return loadUserUsageRows(func(page int) []*billingmodel.PowerCharge {
		return model.Select(ctx, filters, map[string]any{
			"field":    "main.id,main.user_id,main.finish_status,main.settled_points,main.created_at",
			"order":    "main.id asc",
			"page":     page,
			"pageSize": userUsageBatchSize,
		})
	})
}

func loadUserUsageCosts(ctx context.Context, query userUsageQuery) []*energonmodel.CostRecord {
	model := energonmodel.NewCostRecordModel()
	filters := userUsageFilters(query)
	return loadUserUsageRows(func(page int) []*energonmodel.CostRecord {
		return model.Select(ctx, filters, map[string]any{
			"field":    "main.id,main.user_id,main.prompt_tokens,main.completion_tokens,main.cached_tokens,main.cost_micros,main.created_at",
			"order":    "main.id asc",
			"page":     page,
			"pageSize": userUsageBatchSize,
		})
	})
}

func loadUserUsageRows[T any](loadPage func(page int) []*T) []*T {
	rows := make([]*T, 0)
	for page := 1; ; page++ {
		batch := loadPage(page)
		rows = append(rows, batch...)
		if len(batch) < userUsageBatchSize {
			break
		}
	}
	return rows
}

func aggregateUserUsage(
	charges []*billingmodel.PowerCharge,
	costs []*energonmodel.CostRecord,
) map[uint64]*userUsageSummary {
	summaries := make(map[uint64]*userUsageSummary)
	for _, charge := range charges {
		if charge == nil {
			continue
		}
		summary := ensureUserUsageSummary(summaries, charge.UserID)
		summary.LogicalCalls++
		summary.SettledPoints += int64(charge.SettledPoints)
		switch charge.FinishStatus {
		case billingmodel.ChargeFinishSuccess:
			summary.SuccessCalls++
		case billingmodel.ChargeFinishFailed, billingmodel.ChargeFinishCanceled:
			summary.FailedCalls++
		}
		summary.recordUse(charge.CreatedAt)
	}
	for _, cost := range costs {
		if cost == nil {
			continue
		}
		summary := ensureUserUsageSummary(summaries, cost.UserID)
		summary.ProviderAttempts++
		summary.PromptTokens += cost.PromptTokens
		summary.CompletionTokens += cost.CompletionTokens
		summary.CachedTokens += cost.CachedTokens
		summary.CostMicros += cost.CostMicros
		summary.recordUse(cost.CreatedAt)
	}
	return summaries
}

func ensureUserUsageSummary(summaries map[uint64]*userUsageSummary, userID uint64) *userUsageSummary {
	summary := summaries[userID]
	if summary == nil {
		summary = &userUsageSummary{UserID: userID}
		summaries[userID] = summary
	}
	return summary
}

func (summary *userUsageSummary) recordUse(createdAt time.Time) {
	if summary != nil && createdAt.After(summary.LastUsedAt) {
		summary.LastUsedAt = createdAt
	}
}

func (summary *userUsageSummary) SuccessRate() string {
	if summary == nil {
		return "-"
	}
	completed := summary.SuccessCalls + summary.FailedCalls
	if completed == 0 {
		return "-"
	}
	return fmt.Sprintf("%.1f%%", float64(summary.SuccessCalls)*100/float64(completed))
}

func loadUsageUsers(ctx context.Context, summaries map[uint64]*userUsageSummary) map[uint64]usageUser {
	userIDs := make([]uint64, 0, len(summaries))
	for userID := range summaries {
		if userID > 0 {
			userIDs = append(userIDs, userID)
		}
	}
	if len(userIDs) == 0 {
		return map[uint64]usageUser{}
	}
	sort.Slice(userIDs, func(i, j int) bool { return userIDs[i] < userIDs[j] })
	rows := usermodel.NewUserModel().Select(ctx, map[string]any{"id": userIDs}, map[string]any{
		"field": "main.id,main.name,main.account",
	})
	users := make(map[uint64]usageUser, len(rows))
	for _, row := range rows {
		if row == nil || row.ID == 0 {
			continue
		}
		users[row.ID] = usageUser{
			Name:    strings.TrimSpace(row.Name),
			Account: strings.TrimSpace(row.Account),
		}
	}
	return users
}

func buildUserUsageTable(
	summaries map[uint64]*userUsageSummary,
	users map[uint64]usageUser,
	query userUsageQuery,
) map[string]any {
	ordered := make([]*userUsageSummary, 0, len(summaries))
	for _, summary := range summaries {
		if summary == nil || !matchesUserUsageKeyword(summary.UserID, users[summary.UserID], query.Keyword) {
			continue
		}
		ordered = append(ordered, summary)
	}
	sort.Slice(ordered, func(i, j int) bool {
		left, right := ordered[i], ordered[j]
		if left.LogicalCalls != right.LogicalCalls {
			return left.LogicalCalls > right.LogicalCalls
		}
		if left.ProviderAttempts != right.ProviderAttempts {
			return left.ProviderAttempts > right.ProviderAttempts
		}
		if !left.LastUsedAt.Equal(right.LastUsedAt) {
			return left.LastUsedAt.After(right.LastUsedAt)
		}
		return left.UserID < right.UserID
	})

	page := max(query.Page, 1)
	pageSize := query.PageSize
	if pageSize <= 0 {
		pageSize = defaultUserUsagePageSize
	}
	pageSize = min(pageSize, maxUserUsagePageSize)
	total := len(ordered)
	start := (page - 1) * pageSize
	end := min(start+pageSize, total)
	if start >= total {
		start, end = total, total
	}
	rows := make([]map[string]any, 0, end-start)
	for _, summary := range ordered[start:end] {
		rows = append(rows, userUsageRow(summary, users[summary.UserID]))
	}
	return map[string]any{
		"list":     rows,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	}
}

func matchesUserUsageKeyword(userID uint64, user usageUser, keyword string) bool {
	if keyword == "" {
		return true
	}
	searchable := strings.ToLower(user.Name + " " + user.Account + " " + usageUserName(userID, user))
	return strings.Contains(searchable, keyword)
}

func userUsageRow(summary *userUsageSummary, user usageUser) map[string]any {
	lastUsedAt := any("")
	if !summary.LastUsedAt.IsZero() {
		lastUsedAt = summary.LastUsedAt
	}
	return map[string]any{
		"id":                "user-" + strconv.FormatUint(summary.UserID, 10),
		"user_id":           summary.UserID,
		"user_name":         usageUserName(summary.UserID, user),
		"user_account":      usageUserAccount(summary.UserID, user),
		"logical_calls":     summary.LogicalCalls,
		"success_calls":     summary.SuccessCalls,
		"failed_calls":      summary.FailedCalls,
		"success_rate":      summary.SuccessRate(),
		"provider_attempts": summary.ProviderAttempts,
		"prompt_tokens":     summary.PromptTokens,
		"completion_tokens": summary.CompletionTokens,
		"total_tokens":      summary.PromptTokens + summary.CompletionTokens,
		"cached_tokens":     summary.CachedTokens,
		"cost_micros":       summary.CostMicros,
		"cost_cny":          fmt.Sprintf("%.6f", float64(summary.CostMicros)/1_000_000),
		"settled_points":    summary.SettledPoints,
		"last_used_at":      lastUsedAt,
	}
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
