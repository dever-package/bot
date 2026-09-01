package energon

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/shemic/dever/orm"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"
)

const (
	usageDashboardPeriodToday     = "today"
	usageDashboardPeriodYesterday = "yesterday"
	usageDashboardPeriodThisWeek  = "this_week"
	usageDashboardPeriodLastWeek  = "last_week"
	usageDashboardPeriodThisMonth = "this_month"
	usageDashboardPeriodLastMonth = "last_month"
	usageDashboardPeriodThisYear  = "this_year"
	usageDashboardPeriodCustom    = "custom"

	usageDashboardGranularityHour  = "hour"
	usageDashboardGranularityDay   = "day"
	usageDashboardGranularityMonth = "month"
)

type usageDashboardWindow struct {
	StartedAt   time.Time
	EndedAt     time.Time
	Granularity string
}

type usageDashboardTrendValue struct {
	LogicalCalls  int64
	CostMicros    int64
	SettledPoints int64
}

type usageDashboardSnapshot struct {
	Overview            usageAggregate   `json:"overview"`
	ActiveUsers         int64            `json:"active_users"`
	LogicalCallTrend    []map[string]any `json:"logical_call_trend"`
	CostTrend           []map[string]any `json:"cost_trend"`
	SettledPointTrend   []map[string]any `json:"settled_point_trend"`
	BusinessEntryTotals map[string]int64 `json:"business_entry_totals"`
	RangeLabel          string           `json:"range_label"`
}

var usageDashboardShortCache = newUsageShortCache[usageDashboardSnapshot]()

func (UserUsageService) ProviderLoadUsageDashboard(c *server.Context, _ []any) any {
	now := time.Now()
	ctx, query, window := usageDashboardContext(c, now)
	result, err := usageDashboardShortCache.load(
		ctx,
		usageDashboardCacheKey(query, window, now),
		func() (usageDashboardSnapshot, error) {
			return loadUsageDashboardSnapshot(ctx, query, window)
		},
	)
	panicUsageError(err)
	return presentUsageDashboard(result, usageDashboardBodyFunctions(ctx))
}

func loadUsageDashboardSnapshot(
	ctx context.Context,
	query userUsageQuery,
	window usageDashboardWindow,
) (usageDashboardSnapshot, error) {
	overview, activeUsers, err := loadUsageOverview(ctx, query)
	if err != nil {
		return usageDashboardSnapshot{}, err
	}
	trend, err := loadUsageDashboardTrend(ctx, query, window.Granularity)
	if err != nil {
		return usageDashboardSnapshot{}, err
	}
	businessEntryTotals, err := loadUsageDashboardBusinessEntryTotals(ctx, query)
	if err != nil {
		return usageDashboardSnapshot{}, err
	}

	logicalCallTrend, costTrend, settledPointTrend := fillUsageDashboardTrend(window, trend)
	return usageDashboardSnapshot{
		Overview:            overview,
		ActiveUsers:         activeUsers,
		LogicalCallTrend:    logicalCallTrend,
		CostTrend:           costTrend,
		SettledPointTrend:   settledPointTrend,
		BusinessEntryTotals: businessEntryTotals,
		RangeLabel:          usageDashboardRangeLabel(window),
	}, nil
}

func presentUsageDashboard(
	snapshot usageDashboardSnapshot,
	functions []usageBodyFunction,
) map[string]any {
	summary := usageMetricRow(snapshot.Overview)
	summary["active_users"] = snapshot.ActiveUsers
	return map[string]any{
		"summary":                     summary,
		"logical_call_trend":          snapshot.LogicalCallTrend,
		"cost_trend":                  snapshot.CostTrend,
		"settled_point_trend":         snapshot.SettledPointTrend,
		"business_entry_distribution": usageDashboardBusinessEntries(snapshot.BusinessEntryTotals, functions),
		"range_label":                 snapshot.RangeLabel,
	}
}

func usageDashboardContext(
	c *server.Context,
	now time.Time,
) (context.Context, userUsageQuery, usageDashboardWindow) {
	ctx, query := frontendUsageContext(c)
	period := usageDashboardPeriodFromContext(c)
	window := resolveUsageDashboardWindow(period, query.StartedAt, query.EndedAt, now)
	window = snapshotUsageDashboardWindow(period, window, now)
	query.StartedAt = window.StartedAt
	query.EndedAt = window.EndedAt
	if period != usageDashboardPeriodCustom {
		query.EndedAtGranularity = usageTimeGranularityInstant
	}
	query.ProjectID = 0
	query.ProjectIDs = nil
	query.SessionID = 0
	query.SessionIDs = nil
	query.TeamRunIDs = nil
	query.Scene = ""
	query.FrontendOnly = true
	return ctx, query, window
}

func usageDashboardPeriodFromContext(c *server.Context) string {
	if c == nil {
		return usageDashboardPeriodThisMonth
	}
	return normalizeUsageDashboardPeriod(util.ToStringTrimmed(c.Input("period")))
}

func normalizeUsageDashboardPeriod(period string) string {
	switch strings.TrimSpace(period) {
	case usageDashboardPeriodToday,
		usageDashboardPeriodYesterday,
		usageDashboardPeriodThisWeek,
		usageDashboardPeriodLastWeek,
		usageDashboardPeriodThisMonth,
		usageDashboardPeriodLastMonth,
		usageDashboardPeriodThisYear,
		usageDashboardPeriodCustom:
		return strings.TrimSpace(period)
	default:
		return usageDashboardPeriodThisMonth
	}
}

func snapshotUsageDashboardWindow(
	period string,
	window usageDashboardWindow,
	now time.Time,
) usageDashboardWindow {
	switch normalizeUsageDashboardPeriod(period) {
	case usageDashboardPeriodToday,
		usageDashboardPeriodThisWeek,
		usageDashboardPeriodThisMonth,
		usageDashboardPeriodThisYear:
		window.EndedAt = usageStatisticsSnapshotTime(now)
		if window.EndedAt.Before(window.StartedAt) {
			window.EndedAt = window.StartedAt
		}
	}
	return window
}

func usageDashboardCacheKey(
	query userUsageQuery,
	window usageDashboardWindow,
	now time.Time,
) string {
	return usageStatisticsCacheKey(
		"dashboard",
		now,
		window.StartedAt.Format(time.RFC3339Nano),
		window.EndedAt.Format(time.RFC3339Nano),
		window.Granularity,
		strconv.FormatBool(query.UserIDSet),
		strconv.FormatUint(query.UserID, 10),
		strings.TrimSpace(query.Keyword),
		strconv.FormatUint(query.PowerID, 10),
		query.BodyFunctionCode,
		query.EndedAtGranularity,
	)
}

func resolveUsageDashboardWindow(
	period string,
	customStart time.Time,
	customEnd time.Time,
	now time.Time,
) usageDashboardWindow {
	now = now.In(time.Local)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	weekOffset := (int(today.Weekday()) + 6) % 7
	weekStart := today.AddDate(0, 0, -weekOffset)
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
	yearStart := time.Date(now.Year(), time.January, 1, 0, 0, 0, 0, time.Local)

	window := usageDashboardWindow{
		StartedAt:   monthStart,
		EndedAt:     now,
		Granularity: usageDashboardGranularityDay,
	}
	switch normalizeUsageDashboardPeriod(period) {
	case usageDashboardPeriodToday:
		window.StartedAt = today
		window.Granularity = usageDashboardGranularityHour
	case usageDashboardPeriodYesterday:
		window.StartedAt = today.AddDate(0, 0, -1)
		window.EndedAt = today.Add(-time.Nanosecond)
		window.Granularity = usageDashboardGranularityHour
	case usageDashboardPeriodThisWeek:
		window.StartedAt = weekStart
	case usageDashboardPeriodLastWeek:
		window.StartedAt = weekStart.AddDate(0, 0, -7)
		window.EndedAt = weekStart.Add(-time.Nanosecond)
	case usageDashboardPeriodLastMonth:
		window.StartedAt = monthStart.AddDate(0, -1, 0)
		window.EndedAt = monthStart.Add(-time.Nanosecond)
	case usageDashboardPeriodThisYear:
		window.StartedAt = yearStart
		window.Granularity = usageDashboardGranularityMonth
	case usageDashboardPeriodCustom:
		window.StartedAt = customStart.In(time.Local)
		window.EndedAt = customEnd.In(time.Local)
		if window.StartedAt.After(window.EndedAt) {
			window.StartedAt, window.EndedAt = window.EndedAt, window.StartedAt
		}
		window.Granularity = usageDashboardCustomGranularity(window.StartedAt, window.EndedAt)
	case usageDashboardPeriodThisMonth:
		// The initialized current-month window is already correct.
	}
	if window.StartedAt.After(window.EndedAt) {
		window.StartedAt, window.EndedAt = window.EndedAt, window.StartedAt
	}
	return window
}

func usageDashboardCustomGranularity(startedAt time.Time, endedAt time.Time) string {
	duration := endedAt.Sub(startedAt)
	if duration <= 48*time.Hour {
		return usageDashboardGranularityHour
	}
	if duration <= 93*24*time.Hour {
		return usageDashboardGranularityDay
	}
	return usageDashboardGranularityMonth
}

func loadUsageDashboardTrend(
	ctx context.Context,
	query userUsageQuery,
	granularity string,
) (map[string]usageDashboardTrendValue, error) {
	sources, err := resolveUsageSourceTables()
	if err != nil {
		return nil, err
	}
	db, err := orm.Get(sources.Database)
	if err != nil {
		return nil, fmt.Errorf("读取统计数据库失败: %w", err)
	}
	bucketExpression, err := usageDashboardBucketExpression(db.DriverName(), granularity, "main.created_at")
	if err != nil {
		return nil, err
	}
	logicalRequestBucketExpression, err := usageDashboardBucketExpression(
		db.DriverName(), granularity, "logical_request.created_at",
	)
	if err != nil {
		return nil, err
	}
	whereSQL, filterArgs := usageFilterSQL(query, sources.UserTable)
	unchargedLogicalSQL := usageUnchargedLogicalRequestsSQL(sources.CostTable, whereSQL)
	trendSQL := fmt.Sprintf(
		`SELECT bucket,
			COALESCE(SUM(logical_calls), 0) AS logical_calls,
			COALESCE(SUM(cost_micros), 0) AS cost_micros,
			COALESCE(SUM(settled_points), 0) AS settled_points
		FROM (
			SELECT %s AS bucket,
				COUNT(*) AS logical_calls,
				0 AS cost_micros,
				COALESCE(SUM(main.settled_points), 0) AS settled_points
			FROM %s AS main%s
			GROUP BY %s
			UNION ALL
			SELECT %s AS bucket,
				COUNT(*) AS logical_calls,
				0 AS cost_micros,
				0 AS settled_points
			FROM (%s) AS logical_request
			GROUP BY %s
			UNION ALL
			SELECT %s AS bucket,
				0 AS logical_calls,
				COALESCE(SUM(main.cost_micros), 0) AS cost_micros,
				0 AS settled_points
			FROM %s AS main%s
			GROUP BY %s
		) AS usage_trend
		GROUP BY bucket
		ORDER BY bucket`,
		bucketExpression,
		sources.ChargeTable,
		whereSQL,
		bucketExpression,
		logicalRequestBucketExpression,
		unchargedLogicalSQL,
		logicalRequestBucketExpression,
		bucketExpression,
		sources.CostTable,
		whereSQL,
		bucketExpression,
	)
	args := repeatUsageFilterArgs(filterArgs, 3)
	rows, err := db.QueryxContext(ctx, db.Rebind(trendSQL), args...)
	if err != nil {
		return nil, fmt.Errorf("读取用量趋势失败: %w", err)
	}
	defer rows.Close()

	trend := make(map[string]usageDashboardTrendValue)
	for rows.Next() {
		record := map[string]any{}
		if err := rows.MapScan(record); err != nil {
			return nil, fmt.Errorf("读取用量趋势结果失败: %w", err)
		}
		bucket := util.ToStringTrimmed(normalizedUsageValue(record["bucket"]))
		if bucket == "" {
			continue
		}
		trend[bucket] = usageDashboardTrendValue{
			LogicalCalls:  util.ToInt64(record["logical_calls"]),
			CostMicros:    util.ToInt64(record["cost_micros"]),
			SettledPoints: util.ToInt64(record["settled_points"]),
		}
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历用量趋势失败: %w", err)
	}
	return trend, nil
}

func loadUsageDashboardBusinessEntryTotals(
	ctx context.Context,
	query userUsageQuery,
) (map[string]int64, error) {
	sources, err := resolveUsageSourceTables()
	if err != nil {
		return nil, err
	}
	db, err := orm.Get(sources.Database)
	if err != nil {
		return nil, fmt.Errorf("读取统计数据库失败: %w", err)
	}
	whereSQL, filterArgs := usageFilterSQL(query, sources.UserTable)
	unchargedLogicalSQL := usageUnchargedLogicalRequestsSQL(sources.CostTable, whereSQL)
	const mainProjectFlagSQL = "CASE WHEN main.project_id > 0 THEN 1 ELSE 0 END"
	const logicalProjectFlagSQL = "CASE WHEN logical_request.project_id > 0 THEN 1 ELSE 0 END"
	businessEntrySQL := fmt.Sprintf(
		`SELECT usage_entry.scene AS scene,
			usage_entry.has_project AS has_project,
			SUM(usage_entry.logical_calls) AS value
		FROM (
			SELECT main.scene AS scene, %s AS has_project, COUNT(*) AS logical_calls
			FROM %s AS main%s
			GROUP BY main.scene, %s
			UNION ALL
			SELECT logical_request.scene AS scene, %s AS has_project, COUNT(*) AS logical_calls
			FROM (%s) AS logical_request
			GROUP BY logical_request.scene, %s
		) AS usage_entry
		GROUP BY usage_entry.scene, usage_entry.has_project
		ORDER BY usage_entry.scene, usage_entry.has_project`,
		mainProjectFlagSQL,
		sources.ChargeTable,
		whereSQL,
		mainProjectFlagSQL,
		logicalProjectFlagSQL,
		unchargedLogicalSQL,
		logicalProjectFlagSQL,
	)
	args := repeatUsageFilterArgs(filterArgs, 2)
	rows, err := db.QueryxContext(ctx, db.Rebind(businessEntrySQL), args...)
	if err != nil {
		return nil, fmt.Errorf("读取业务入口分布失败: %w", err)
	}
	defer rows.Close()

	totals := make(map[string]int64)
	for rows.Next() {
		record := map[string]any{}
		if err := rows.MapScan(record); err != nil {
			return nil, fmt.Errorf("读取业务入口分布结果失败: %w", err)
		}
		scene := util.ToStringTrimmed(normalizedUsageValue(record["scene"]))
		code := usageDashboardBodyFunctionCode(
			scene,
			util.ToInt64(record["has_project"]) > 0,
		)
		totals[code] += util.ToInt64(record["value"])
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历业务入口分布失败: %w", err)
	}
	return totals, nil
}

func usageDashboardBusinessEntries(
	totals map[string]int64,
	functions []usageBodyFunction,
) []map[string]any {
	result := make([]map[string]any, 0, len(totals))
	for _, function := range functions {
		value := totals[function.Code]
		if value <= 0 {
			continue
		}
		result = append(result, map[string]any{
			"name":  function.Name,
			"value": value,
		})
	}
	return result
}

func usageDashboardBodyFunctions(ctx context.Context) []usageBodyFunction {
	codes := usageBusinessFunctionCodes()
	result := make([]usageBodyFunction, 0, len(codes)+1)
	for _, function := range loadUsageBodyFunctions(ctx, codes) {
		if !function.Enabled {
			continue
		}
		result = append(result, function)
	}
	return append(result, usageBodyFunction{
		Code:    usageOtherBodyFunction,
		Name:    "其他服务",
		Enabled: true,
	})
}

func usageDashboardBucketExpression(driver string, granularity string, timestampColumn string) (string, error) {
	format, err := usageDashboardBucketFormat(granularity)
	if err != nil {
		return "", err
	}
	switch timestampColumn {
	case "main.created_at", "logical_request.created_at":
	default:
		return "", fmt.Errorf("统计趋势时间字段不合法: %s", timestampColumn)
	}
	switch strings.ToLower(strings.TrimSpace(driver)) {
	case "pgx", "postgres", "postgresql":
		return fmt.Sprintf("TO_CHAR(%s, '%s')", timestampColumn, format.Postgres), nil
	case "mysql":
		return fmt.Sprintf("DATE_FORMAT(%s, '%s')", timestampColumn, format.MySQL), nil
	case "sqlite3", "sqlite":
		return fmt.Sprintf("strftime('%s', %s)", format.SQLite, timestampColumn), nil
	default:
		return "", fmt.Errorf("统计趋势不支持数据库驱动: %s", driver)
	}
}

type usageDashboardBucketFormats struct {
	Postgres string
	MySQL    string
	SQLite   string
}

func usageDashboardBucketFormat(granularity string) (usageDashboardBucketFormats, error) {
	switch granularity {
	case usageDashboardGranularityHour:
		return usageDashboardBucketFormats{
			Postgres: "YYYY-MM-DD HH24:00",
			MySQL:    "%Y-%m-%d %H:00",
			SQLite:   "%Y-%m-%d %H:00",
		}, nil
	case usageDashboardGranularityDay:
		return usageDashboardBucketFormats{
			Postgres: "YYYY-MM-DD",
			MySQL:    "%Y-%m-%d",
			SQLite:   "%Y-%m-%d",
		}, nil
	case usageDashboardGranularityMonth:
		return usageDashboardBucketFormats{
			Postgres: "YYYY-MM",
			MySQL:    "%Y-%m",
			SQLite:   "%Y-%m",
		}, nil
	default:
		return usageDashboardBucketFormats{}, fmt.Errorf("不支持的统计趋势粒度: %s", granularity)
	}
}

func fillUsageDashboardTrend(
	window usageDashboardWindow,
	trend map[string]usageDashboardTrendValue,
) ([]map[string]any, []map[string]any, []map[string]any) {
	logicalCalls := make([]map[string]any, 0)
	costs := make([]map[string]any, 0)
	settledPoints := make([]map[string]any, 0)
	for bucket := usageDashboardBucketStart(window.StartedAt, window.Granularity); !bucket.After(window.EndedAt); bucket = usageDashboardNextBucket(bucket, window.Granularity) {
		key := usageDashboardBucketKey(bucket, window.Granularity)
		value := trend[key]
		name := usageDashboardBucketLabel(bucket, window.Granularity)
		logicalCalls = append(logicalCalls, map[string]any{
			"name":  name,
			"value": value.LogicalCalls,
		})
		costs = append(costs, map[string]any{
			"name":  name,
			"value": float64(value.CostMicros) / 1_000_000,
			"color": "var(--primary)",
		})
		settledPoints = append(settledPoints, map[string]any{
			"name":  name,
			"value": value.SettledPoints,
		})
	}
	return logicalCalls, costs, settledPoints
}

func usageDashboardBucketStart(value time.Time, granularity string) time.Time {
	value = value.In(time.Local)
	switch granularity {
	case usageDashboardGranularityHour:
		return time.Date(value.Year(), value.Month(), value.Day(), value.Hour(), 0, 0, 0, time.Local)
	case usageDashboardGranularityMonth:
		return time.Date(value.Year(), value.Month(), 1, 0, 0, 0, 0, time.Local)
	case usageDashboardGranularityDay:
		fallthrough
	default:
		return time.Date(value.Year(), value.Month(), value.Day(), 0, 0, 0, 0, time.Local)
	}
}

func usageDashboardNextBucket(value time.Time, granularity string) time.Time {
	switch granularity {
	case usageDashboardGranularityHour:
		return value.Add(time.Hour)
	case usageDashboardGranularityMonth:
		return value.AddDate(0, 1, 0)
	case usageDashboardGranularityDay:
		fallthrough
	default:
		return value.AddDate(0, 0, 1)
	}
}

func usageDashboardBucketKey(value time.Time, granularity string) string {
	switch granularity {
	case usageDashboardGranularityHour:
		return value.Format("2006-01-02 15:00")
	case usageDashboardGranularityMonth:
		return value.Format("2006-01")
	case usageDashboardGranularityDay:
		fallthrough
	default:
		return value.Format("2006-01-02")
	}
}

func usageDashboardBucketLabel(value time.Time, granularity string) string {
	switch granularity {
	case usageDashboardGranularityHour:
		return value.Format("15:00")
	case usageDashboardGranularityMonth:
		return value.Format("2006-01")
	case usageDashboardGranularityDay:
		fallthrough
	default:
		return value.Format("01-02")
	}
}

func usageDashboardRangeLabel(window usageDashboardWindow) string {
	const layout = "2006-01-02 15:04"
	return window.StartedAt.Format(layout) + " 至 " + window.EndedAt.Format(layout)
}
