package energon

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/shemic/dever/orm"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	billingmodel "github.com/dever-package/bot/model/billing"
	bodymodel "github.com/dever-package/bot/model/body"
	energonmodel "github.com/dever-package/bot/model/energon"
	usermodel "github.com/dever-package/user/model"
)

const (
	defaultUserUsagePageSize = 10
	maxUserUsagePageSize     = 100
	systemUsageScene         = "system"

	usageTimeGranularityInstant = "instant"
	usageTimeGranularitySecond  = "second"
	usageTimeGranularityMinute  = "minute"
	usageTimeGranularityDate    = "date"
)

type userUsageQuery struct {
	UserID               uint64
	UserIDSet            bool
	ProjectID            uint64
	ProjectIDs           []uint64
	SessionID            uint64
	SessionIDs           []uint64
	TeamRunIDs           []uint64
	PowerID              uint64
	Scene                string
	BodyFunctionCode     string
	Keyword              string
	FrontendOnly         bool
	StartedAt            time.Time
	EndedAt              time.Time
	StartedAtGranularity string
	EndedAtGranularity   string
	Page                 int
	PageSize             int
}

type usageAggregate struct {
	UserID           uint64
	ProjectID        uint64
	SessionID        uint64
	TeamRunID        uint64
	PowerID          uint64
	LogicalCalls     int64
	SuccessCalls     int64
	FailedCalls      int64
	ProviderAttempts int64
	PromptTokens     int64
	CompletionTokens int64
	CachedTokens     int64
	CostMicros       int64
	SettledPoints    int64
	LastUsedAt       any
}

type usageAggregatePage struct {
	Rows     []usageAggregate
	Total    int
	Page     int
	PageSize int
}

type usageAggregateRows interface {
	Next() bool
	MapScan(map[string]any) error
	Err() error
}

type usageDimension struct {
	Fields []string
}

type usageSourceTables struct {
	ChargeTable string
	CostTable   string
	UserTable   string
	Database    string
}

var (
	usageUserDimension     = usageDimension{Fields: []string{"user_id"}}
	usageProjectDimension  = usageDimension{Fields: []string{"project_id"}}
	usageDialogueDimension = usageDimension{Fields: []string{"session_id"}}
	usageTeamRunDimension  = usageDimension{Fields: []string{"team_run_id"}}
	usageTablePattern      = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$`)
)

func userUsageQueryFromContext(c *server.Context, now time.Time) userUsageQuery {
	query := userUsageQuery{
		StartedAt:            now.AddDate(0, 0, -7),
		EndedAt:              now,
		StartedAtGranularity: usageTimeGranularityInstant,
		EndedAtGranularity:   usageTimeGranularityInstant,
		Page:                 1,
		PageSize:             defaultUserUsagePageSize,
	}
	if c == nil {
		return query
	}

	userID := util.ToStringTrimmed(c.Input("user_id"))
	query.UserID = util.ToUint64(userID)
	query.UserIDSet = userID != ""
	query.ProjectID = util.ToUint64(c.Input("project_id"))
	query.SessionID = util.ToUint64(c.Input("session_id"))
	query.PowerID = util.ToUint64(c.Input("power_id"))
	query.Scene = util.ToStringTrimmed(c.Input("scene"))
	query.BodyFunctionCode = normalizeUsageBodyFunctionCode(c.Input("body_function_code"))
	query.Keyword = util.ToStringTrimmed(c.Input("keyword"))
	query.Page = util.ToIntDefault(c.Input("page"), 1)
	query.PageSize = util.ToIntDefault(c.Input("pageSize"), defaultUserUsagePageSize)
	if parsed, granularity, ok := parseUserUsageTime(c.Input("created_at_start")); ok {
		query.StartedAt = parsed
		query.StartedAtGranularity = granularity
	}
	if parsed, granularity, ok := parseUserUsageTime(c.Input("created_at_end")); ok {
		query.EndedAt = parsed
		query.EndedAtGranularity = granularity
	}
	if query.StartedAt.After(query.EndedAt) {
		query.StartedAt, query.EndedAt = query.EndedAt, query.StartedAt
		query.StartedAtGranularity, query.EndedAtGranularity = query.EndedAtGranularity, query.StartedAtGranularity
	}
	query.Page = max(query.Page, 1)
	query.PageSize = min(max(query.PageSize, 1), maxUserUsagePageSize)
	return query
}

func parseUserUsageTime(value any) (time.Time, string, bool) {
	text := util.ToStringTrimmed(value)
	for _, current := range []struct {
		Layout      string
		Granularity string
	}{
		{Layout: time.RFC3339Nano, Granularity: usageTimeGranularityInstant},
		{Layout: "2006-01-02T15:04:05", Granularity: usageTimeGranularitySecond},
		{Layout: "2006-01-02T15:04", Granularity: usageTimeGranularityMinute},
		{Layout: "2006-01-02 15:04:05", Granularity: usageTimeGranularitySecond},
		{Layout: "2006-01-02 15:04", Granularity: usageTimeGranularityMinute},
		{Layout: "2006-01-02", Granularity: usageTimeGranularityDate},
	} {
		if parsed, err := time.ParseInLocation(current.Layout, text, time.Local); err == nil {
			return parsed, current.Granularity, true
		}
	}
	return time.Time{}, "", false
}

func usageQueryExclusiveEnd(query userUsageQuery) time.Time {
	switch query.EndedAtGranularity {
	case usageTimeGranularityDate:
		return query.EndedAt.AddDate(0, 0, 1)
	case usageTimeGranularityMinute:
		return query.EndedAt.Add(time.Minute)
	case usageTimeGranularitySecond:
		return query.EndedAt.Add(time.Second)
	default:
		return query.EndedAt
	}
}

func loadUsageAggregatePage(
	ctx context.Context,
	query userUsageQuery,
	dimension usageDimension,
) (usageAggregatePage, error) {
	aggregateSQL, args, database, err := buildUsageAggregateQuery(query, dimension)
	if err != nil {
		return usageAggregatePage{}, err
	}
	db, err := orm.Get(database)
	if err != nil {
		return usageAggregatePage{}, fmt.Errorf("读取统计数据库失败: %w", err)
	}

	countSQL := "SELECT COUNT(*) FROM (" + aggregateSQL + ") AS usage_count"
	var total int64
	if err := db.GetContext(ctx, &total, db.Rebind(countSQL), args...); err != nil {
		return usageAggregatePage{}, fmt.Errorf("统计分组数量失败: %w", err)
	}

	page := max(query.Page, 1)
	pageSize := min(max(query.PageSize, 1), maxUserUsagePageSize)
	offset := (page - 1) * pageSize
	pageSQL := aggregateSQL + usageOrderSQL(dimension) + " LIMIT ? OFFSET ?"
	pageArgs := append(append([]any{}, args...), pageSize, offset)
	rows, err := db.QueryxContext(ctx, db.Rebind(pageSQL), pageArgs...)
	if err != nil {
		return usageAggregatePage{}, fmt.Errorf("读取统计分组失败: %w", err)
	}
	defer rows.Close()

	aggregates, err := scanUsageAggregateRows(rows, pageSize)
	if err != nil {
		return usageAggregatePage{}, err
	}

	return usageAggregatePage{
		Rows:     aggregates,
		Total:    int(total),
		Page:     page,
		PageSize: pageSize,
	}, nil
}

func loadUsageAggregates(
	ctx context.Context,
	query userUsageQuery,
	dimension usageDimension,
) ([]usageAggregate, error) {
	aggregateSQL, args, database, err := buildUsageAggregateQuery(query, dimension)
	if err != nil {
		return nil, err
	}
	db, err := orm.Get(database)
	if err != nil {
		return nil, fmt.Errorf("读取统计数据库失败: %w", err)
	}
	rows, err := db.QueryxContext(ctx, db.Rebind(aggregateSQL), args...)
	if err != nil {
		return nil, fmt.Errorf("读取统计分组失败: %w", err)
	}
	defer rows.Close()
	return scanUsageAggregateRows(rows, query.PageSize)
}

func scanUsageAggregateRows(rows usageAggregateRows, capacity int) ([]usageAggregate, error) {
	aggregates := make([]usageAggregate, 0, max(capacity, 0))
	for rows.Next() {
		record := map[string]any{}
		if err := rows.MapScan(record); err != nil {
			return nil, fmt.Errorf("读取统计结果失败: %w", err)
		}
		aggregates = append(aggregates, usageAggregateFromMap(record))
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历统计结果失败: %w", err)
	}
	return aggregates, nil
}

func loadUsageOverview(
	ctx context.Context,
	query userUsageQuery,
) (usageAggregate, int64, error) {
	aggregateSQL, args, database, err := buildUsageAggregateQuery(query, usageUserDimension)
	if err != nil {
		return usageAggregate{}, 0, err
	}
	db, err := orm.Get(database)
	if err != nil {
		return usageAggregate{}, 0, fmt.Errorf("读取统计数据库失败: %w", err)
	}
	overviewSQL := usageOverviewSQL(aggregateSQL)
	rows, err := db.QueryxContext(ctx, db.Rebind(overviewSQL), args...)
	if err != nil {
		return usageAggregate{}, 0, fmt.Errorf("读取统计总览失败: %w", err)
	}
	defer rows.Close()
	if !rows.Next() {
		return usageAggregate{}, 0, nil
	}
	record := map[string]any{}
	if err := rows.MapScan(record); err != nil {
		return usageAggregate{}, 0, fmt.Errorf("读取统计总览结果失败: %w", err)
	}
	return usageAggregateFromMap(record), util.ToInt64(record["active_users"]), nil
}

func usageOverviewSQL(aggregateSQL string) string {
	return `SELECT
		COUNT(*) AS active_users,
		COALESCE(SUM(logical_calls), 0) AS logical_calls,
		COALESCE(SUM(success_calls), 0) AS success_calls,
		COALESCE(SUM(failed_calls), 0) AS failed_calls,
		COALESCE(SUM(provider_attempts), 0) AS provider_attempts,
		COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
		COALESCE(SUM(completion_tokens), 0) AS completion_tokens,
		COALESCE(SUM(cached_tokens), 0) AS cached_tokens,
		COALESCE(SUM(cost_micros), 0) AS cost_micros,
		COALESCE(SUM(settled_points), 0) AS settled_points,
		MAX(last_used_at) AS last_used_at
	FROM (` + aggregateSQL + `) AS usage_overview`
}

func buildUsageAggregateQuery(
	query userUsageQuery,
	dimension usageDimension,
) (string, []any, string, error) {
	sources, err := resolveUsageSourceTables()
	if err != nil {
		return "", nil, "", err
	}
	aggregateSQL, args, err := buildUsageAggregateSQL(
		sources.ChargeTable,
		sources.CostTable,
		sources.UserTable,
		query,
		dimension,
	)
	if err != nil {
		return "", nil, "", err
	}
	return aggregateSQL, args, sources.Database, nil
}

func resolveUsageSourceTables() (usageSourceTables, error) {
	chargeConfig := billingmodel.NewPowerChargeModel().Config()
	costConfig := energonmodel.NewCostRecordModel().Config()
	userConfig := usermodel.NewUserModel().Config()
	chargeDatabase := usageDatabaseName(chargeConfig.Database)
	costDatabase := usageDatabaseName(costConfig.Database)
	userDatabase := usageDatabaseName(userConfig.Database)
	if chargeDatabase != costDatabase || chargeDatabase != userDatabase {
		return usageSourceTables{}, fmt.Errorf(
			"统计相关表不在同一数据库: charge=%s, cost=%s, user=%s",
			chargeDatabase,
			costDatabase,
			userDatabase,
		)
	}
	chargeTable, err := safeUsageTable(chargeConfig.Table)
	if err != nil {
		return usageSourceTables{}, err
	}
	costTable, err := safeUsageTable(costConfig.Table)
	if err != nil {
		return usageSourceTables{}, err
	}
	userTable, err := safeUsageTable(userConfig.Table)
	if err != nil {
		return usageSourceTables{}, err
	}
	return usageSourceTables{
		ChargeTable: chargeTable,
		CostTable:   costTable,
		UserTable:   userTable,
		Database:    chargeDatabase,
	}, nil
}

func buildUsageAggregateSQL(
	chargeTable string,
	costTable string,
	userTable string,
	query userUsageQuery,
	dimension usageDimension,
) (string, []any, error) {
	chargeTable, err := safeUsageTable(chargeTable)
	if err != nil {
		return "", nil, err
	}
	costTable, err = safeUsageTable(costTable)
	if err != nil {
		return "", nil, err
	}
	userTable, err = safeUsageTable(userTable)
	if err != nil {
		return "", nil, err
	}
	if err := validateUsageDimension(dimension); err != nil {
		return "", nil, err
	}

	whereSQL, filterArgs := usageFilterSQL(query, userTable)
	chargeSQL := usageChargeAggregateSQL(chargeTable, whereSQL, dimension)
	costSQL := usageCostAggregateSQL(costTable, whereSQL, dimension)
	dimensionFields := strings.Join(dimension.Fields, ", ")
	selectPrefix := dimensionFields + ", "
	aggregateSQL := fmt.Sprintf(
		`SELECT %s
			COALESCE(SUM(logical_calls), 0) AS logical_calls,
			COALESCE(SUM(success_calls), 0) AS success_calls,
			COALESCE(SUM(failed_calls), 0) AS failed_calls,
			COALESCE(SUM(provider_attempts), 0) AS provider_attempts,
			COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
			COALESCE(SUM(completion_tokens), 0) AS completion_tokens,
			COALESCE(SUM(cached_tokens), 0) AS cached_tokens,
			COALESCE(SUM(cost_micros), 0) AS cost_micros,
			COALESCE(SUM(settled_points), 0) AS settled_points,
			MAX(last_used_at) AS last_used_at
		FROM (%s UNION ALL %s) AS usage
		GROUP BY %s`,
		selectPrefix,
		chargeSQL,
		costSQL,
		dimensionFields,
	)
	args := append(append([]any{}, filterArgs...), filterArgs...)
	return aggregateSQL, args, nil
}

func usageChargeAggregateSQL(table string, whereSQL string, dimension usageDimension) string {
	columns := usageDimensionSQL("main", dimension)
	selectPrefix := ""
	if columns != "" {
		selectPrefix = columns + ", "
	}
	return fmt.Sprintf(
		`SELECT %s
			COUNT(*) AS logical_calls,
			SUM(CASE WHEN main.finish_status = '%s' THEN 1 ELSE 0 END) AS success_calls,
			SUM(CASE WHEN main.finish_status IN ('%s', '%s') THEN 1 ELSE 0 END) AS failed_calls,
			0 AS provider_attempts,
			0 AS prompt_tokens,
			0 AS completion_tokens,
			0 AS cached_tokens,
			0 AS cost_micros,
			COALESCE(SUM(main.settled_points), 0) AS settled_points,
			MAX(main.created_at) AS last_used_at
		FROM %s AS main%s
		GROUP BY %s`,
		selectPrefix,
		billingmodel.ChargeFinishSuccess,
		billingmodel.ChargeFinishFailed,
		billingmodel.ChargeFinishCanceled,
		table,
		whereSQL,
		columns,
	)
}

func usageCostAggregateSQL(table string, whereSQL string, dimension usageDimension) string {
	columns := usageDimensionSQL("main", dimension)
	selectPrefix := ""
	if columns != "" {
		selectPrefix = columns + ", "
	}
	return fmt.Sprintf(
		`SELECT %s
			0 AS logical_calls,
			0 AS success_calls,
			0 AS failed_calls,
			COUNT(*) AS provider_attempts,
			COALESCE(SUM(main.prompt_tokens), 0) AS prompt_tokens,
			COALESCE(SUM(main.completion_tokens), 0) AS completion_tokens,
			COALESCE(SUM(main.cached_tokens), 0) AS cached_tokens,
			COALESCE(SUM(main.cost_micros), 0) AS cost_micros,
			0 AS settled_points,
			MAX(main.created_at) AS last_used_at
		FROM %s AS main%s
		GROUP BY %s`,
		selectPrefix,
		table,
		whereSQL,
		columns,
	)
}

func usageFilterSQL(query userUsageQuery, userTable string) (string, []any) {
	clauses := make([]string, 0, 10)
	args := make([]any, 0, 12)
	if query.FrontendOnly {
		clauses = append(clauses, "main.user_id > 0", "main.scene <> ?")
		args = append(args, systemUsageScene)
	}
	clauses = append(clauses, "main.created_at >= ?", "main.created_at < ?")
	args = append(args, query.StartedAt, usageQueryExclusiveEnd(query))
	if query.UserIDSet {
		clauses = append(clauses, "main.user_id = ?")
		args = append(args, query.UserID)
	}
	if query.ProjectID > 0 {
		clauses = append(clauses, "main.project_id = ?")
		args = append(args, query.ProjectID)
	}
	appendUsageIDFilter(&clauses, &args, "project_id", query.ProjectIDs)
	if query.SessionID > 0 {
		clauses = append(clauses, "main.session_id = ?")
		args = append(args, query.SessionID)
	}
	appendUsageIDFilter(&clauses, &args, "session_id", query.SessionIDs)
	appendUsageIDFilter(&clauses, &args, "team_run_id", query.TeamRunIDs)
	if query.PowerID > 0 {
		clauses = append(clauses, "main.power_id = ?")
		args = append(args, query.PowerID)
	}
	if query.Scene != "" {
		clauses = append(clauses, "main.scene = ?")
		args = append(args, query.Scene)
	}
	if clause, filterArgs := usageBodyFunctionFilterSQL(query.BodyFunctionCode); clause != "" {
		clauses = append(clauses, clause)
		args = append(args, filterArgs...)
	}
	if keyword := strings.ToLower(strings.TrimSpace(query.Keyword)); keyword != "" {
		keywordClauses := []string{fmt.Sprintf(
			`EXISTS (SELECT 1 FROM %s AS usage_user WHERE usage_user.id = main.user_id AND (LOWER(usage_user.name) LIKE ? ESCAPE '!' OR LOWER(usage_user.account) LIKE ? ESCAPE '!'))`,
			userTable,
		)}
		pattern := usageKeywordPattern(keyword)
		keywordArgs := []any{pattern, pattern}
		if userID, err := strconv.ParseUint(keyword, 10, 64); err == nil {
			keywordClauses = append(keywordClauses, "main.user_id = ?")
			keywordArgs = append(keywordArgs, userID)
		}
		if !query.FrontendOnly && strings.Contains(strings.ToLower("系统调用"), keyword) {
			keywordClauses = append(keywordClauses, "main.user_id = 0")
		}
		clauses = append(clauses, "("+strings.Join(keywordClauses, " OR ")+")")
		args = append(args, keywordArgs...)
	}
	return " WHERE " + strings.Join(clauses, " AND "), args
}

func normalizeUsageBodyFunctionCode(value any) string {
	code := util.ToStringTrimmed(value)
	switch code {
	case bodymodel.FunctionCodeWorks,
		bodymodel.FunctionCodeDialogue,
		bodymodel.FunctionCodeTool:
		return code
	default:
		return ""
	}
}

func usageBodyFunctionFilterSQL(code string) (string, []any) {
	switch normalizeUsageBodyFunctionCode(code) {
	case bodymodel.FunctionCodeWorks:
		return "(main.scene = ? OR (main.project_id > 0 AND main.scene <> ?))", []any{
			usageSceneProjectPower,
			usageSceneBodyTool,
		}
	case bodymodel.FunctionCodeDialogue:
		return "(main.project_id = 0 AND main.scene = ?)", []any{usageSceneAgentPower}
	case bodymodel.FunctionCodeTool:
		return "main.scene = ?", []any{usageSceneBodyTool}
	default:
		return "", nil
	}
}

func appendUsageIDFilter(clauses *[]string, args *[]any, field string, ids []uint64) {
	if len(ids) == 0 {
		return
	}
	placeholders := make([]string, 0, len(ids))
	for _, id := range ids {
		placeholders = append(placeholders, "?")
		*args = append(*args, id)
	}
	*clauses = append(*clauses, fmt.Sprintf("main.%s IN (%s)", field, strings.Join(placeholders, ",")))
}

func usageKeywordPattern(keyword string) string {
	replacer := strings.NewReplacer("!", "!!", "%", "!%", "_", "!_")
	return "%" + replacer.Replace(strings.ToLower(strings.TrimSpace(keyword))) + "%"
}

func usageDimensionSQL(prefix string, dimension usageDimension) string {
	columns := make([]string, 0, len(dimension.Fields))
	for _, field := range dimension.Fields {
		columns = append(columns, prefix+"."+field)
	}
	return strings.Join(columns, ", ")
}

func usageOrderSQL(dimension usageDimension) string {
	return " ORDER BY logical_calls DESC, provider_attempts DESC, last_used_at DESC, " +
		strings.Join(dimension.Fields, ", ")
}

func safeUsageTable(table string) (string, error) {
	table = strings.TrimSpace(table)
	if !usageTablePattern.MatchString(table) {
		return "", fmt.Errorf("统计表名不合法: %q", table)
	}
	return table, nil
}

func usageDatabaseName(database string) string {
	database = strings.TrimSpace(database)
	if database == "" {
		return "default"
	}
	return database
}

func validateUsageDimension(dimension usageDimension) error {
	if len(dimension.Fields) == 0 {
		return fmt.Errorf("统计维度不能为空")
	}
	allowed := map[string]struct{}{
		"user_id": {}, "project_id": {}, "session_id": {}, "team_run_id": {}, "power_id": {},
	}
	for _, field := range dimension.Fields {
		if _, ok := allowed[field]; !ok {
			return fmt.Errorf("不支持的统计维度: %s", field)
		}
	}
	return nil
}

func usageAggregateFromMap(record map[string]any) usageAggregate {
	return usageAggregate{
		UserID:           util.ToUint64(record["user_id"]),
		ProjectID:        util.ToUint64(record["project_id"]),
		SessionID:        util.ToUint64(record["session_id"]),
		TeamRunID:        util.ToUint64(record["team_run_id"]),
		PowerID:          util.ToUint64(record["power_id"]),
		LogicalCalls:     util.ToInt64(record["logical_calls"]),
		SuccessCalls:     util.ToInt64(record["success_calls"]),
		FailedCalls:      util.ToInt64(record["failed_calls"]),
		ProviderAttempts: util.ToInt64(record["provider_attempts"]),
		PromptTokens:     util.ToInt64(record["prompt_tokens"]),
		CompletionTokens: util.ToInt64(record["completion_tokens"]),
		CachedTokens:     util.ToInt64(record["cached_tokens"]),
		CostMicros:       util.ToInt64(record["cost_micros"]),
		SettledPoints:    util.ToInt64(record["settled_points"]),
		LastUsedAt:       normalizedUsageValue(record["last_used_at"]),
	}
}

func normalizedUsageValue(value any) any {
	if bytes, ok := value.([]byte); ok {
		return string(bytes)
	}
	if value == nil {
		return ""
	}
	return value
}
