package energon

import (
	"context"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	agentservice "github.com/dever-package/bot/service/agent"
)

const (
	defaultBodyRecordPageSize = 20
	maxBodyRecordPageSize     = 100
)

type bodyRecordQuery struct {
	UserID   uint64
	User     usageUser
	Keyword  string
	Page     int
	PageSize int
}

type bodyRecordAssetVersion struct {
	Version   int
	UpdatedAt time.Time
}

func (UserUsageService) ProviderLoadUserWorks(c *server.Context, _ []any) any {
	ctx, recordQuery, usageQuery := userBodyRecordContext(c)
	if recordQuery.UserID == 0 {
		return emptyBodyRecordPage(recordQuery)
	}

	filter := map[string]any{"user_id": recordQuery.UserID}
	if recordQuery.Keyword != "" {
		filter["name"] = bodyRecordLike(recordQuery.Keyword)
	}
	if status := util.ToIntDefault(bodyRecordInput(c, "status"), 0); status > 0 {
		filter["status"] = status
	}
	model := projectmodel.NewProjectModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.name,main.status,main.created_at,main.updated_at",
		"order":    "main.id desc",
		"page":     recordQuery.Page,
		"pageSize": recordQuery.PageSize,
	})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			ids = append(ids, row.ID)
		}
	}
	usageByID, err := loadUsageMapForIDs(
		ctx,
		usageQuery,
		ids,
		usageProjectDimension,
		func(query *userUsageQuery, currentIDs []uint64) { query.ProjectIDs = currentIDs },
		func(aggregate usageAggregate) uint64 { return aggregate.ProjectID },
	)
	panicUsageError(err)

	list := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		item := usageMetricRow(usageByID[row.ID])
		item["id"] = row.ID
		item["name"] = usageRelationName("作品", row.ID, strings.TrimSpace(row.Name))
		item["status"] = row.Status
		item["created_at"] = row.CreatedAt
		item["updated_at"] = row.UpdatedAt
		list = append(list, item)
	}
	return bodyRecordPageMap(recordQuery, int(model.Count(ctx, filter)), list)
}

func (UserUsageService) ProviderLoadUserDialogues(c *server.Context, _ []any) any {
	ctx, recordQuery, usageQuery := userBodyRecordContext(c)
	if recordQuery.UserID == 0 {
		return emptyBodyRecordPage(recordQuery)
	}

	filter := map[string]any{
		"owner_type": agentmodel.SessionOwnerTypeBodyUser,
		"owner_id":   recordQuery.UserID,
	}
	if recordQuery.Keyword != "" {
		filter["title"] = bodyRecordLike(recordQuery.Keyword)
	}
	if status := util.ToIntDefault(bodyRecordInput(c, "status"), 0); status > 0 {
		filter["status"] = status
	}
	if agentID := util.ToUint64(bodyRecordInput(c, "agent_id")); agentID > 0 {
		filter["agent_id"] = agentID
	}
	model := agentmodel.NewSessionModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.agent_id,main.agent_key,main.title,main.status,main.message_count,main.last_message_at,main.created_at",
		"order":    "main.last_message_at desc,main.id desc",
		"page":     recordQuery.Page,
		"pageSize": recordQuery.PageSize,
	})
	ids := make([]uint64, 0, len(rows))
	agentRefs := make([]agentservice.DisplayReference, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		ids = append(ids, row.ID)
		agentRefs = append(agentRefs, agentservice.DisplayReference{ID: row.AgentID, Key: row.AgentKey})
	}
	usageByID, err := loadUsageMapForIDs(
		ctx,
		usageQuery,
		ids,
		usageDialogueDimension,
		func(query *userUsageQuery, currentIDs []uint64) { query.SessionIDs = currentIDs },
		func(aggregate usageAggregate) uint64 { return aggregate.SessionID },
	)
	panicUsageError(err)
	agentNames := agentservice.ResolveDisplayNames(ctx, agentRefs)

	list := make([]map[string]any, 0, len(rows))
	agentIndex := 0
	for _, row := range rows {
		if row == nil {
			continue
		}
		item := usageMetricRow(usageByID[row.ID])
		item["id"] = row.ID
		item["title"] = usageRelationName("对话", row.ID, strings.TrimSpace(row.Title))
		item["agent_name"] = agentNames[agentIndex]
		agentIndex++
		item["status"] = row.Status
		item["message_count"] = row.MessageCount
		item["last_message_at"] = row.LastMessageAt
		item["created_at"] = row.CreatedAt
		list = append(list, item)
	}
	return bodyRecordPageMap(recordQuery, int(model.Count(ctx, filter)), list)
}

func (UserUsageService) ProviderLoadUserTools(c *server.Context, _ []any) any {
	ctx, recordQuery, usageQuery := userBodyRecordContext(c)
	if recordQuery.UserID == 0 {
		return emptyBodyRecordPage(recordQuery)
	}

	filter := map[string]any{
		"user_id": recordQuery.UserID,
		"created_at": map[string]any{
			"gte": usageQuery.StartedAt,
			"lt":  usageQueryExclusiveEnd(usageQuery),
		},
	}
	if recordQuery.Keyword != "" {
		filter["title"] = bodyRecordLike(recordQuery.Keyword)
	}
	model := workspacemodel.NewPowerHistoryModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.team_id,main.team_power_id,main.run_id,main.title,main.created_at,main.updated_at",
		"order":    "main.id desc",
		"page":     recordQuery.Page,
		"pageSize": recordQuery.PageSize,
	})
	runIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.RunID > 0 {
			runIDs = append(runIDs, row.RunID)
		}
	}
	usageByID, err := loadUsageMapForIDs(
		ctx,
		usageQuery,
		runIDs,
		usageTeamRunDimension,
		func(query *userUsageQuery, currentIDs []uint64) { query.TeamRunIDs = currentIDs },
		func(aggregate usageAggregate) uint64 { return aggregate.TeamRunID },
	)
	panicUsageError(err)
	powerIDsByTeamPower, powerNames := loadBodyRecordToolNames(ctx, rows)
	runStatuses := loadBodyRecordRunStatuses(ctx, runIDs)

	list := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		powerID := powerIDsByTeamPower[row.TeamPowerID]
		item := usageMetricRow(usageByID[row.RunID])
		item["id"] = row.ID
		item["title"] = usageRelationName("工具历史", row.ID, strings.TrimSpace(row.Title))
		item["tool_name"] = usageRelationName("工具", row.TeamPowerID, powerNames[powerID])
		item["status"] = runStatuses[row.RunID]
		item["created_at"] = row.CreatedAt
		list = append(list, item)
	}
	return bodyRecordPageMap(recordQuery, int(model.Count(ctx, filter)), list)
}

func (UserUsageService) ProviderLoadUserAssets(c *server.Context, _ []any) any {
	ctx, recordQuery, _ := userBodyRecordContext(c)
	if recordQuery.UserID == 0 {
		return emptyBodyRecordPage(recordQuery)
	}

	filter := map[string]any{
		"user_id":    recordQuery.UserID,
		"version_id": map[string]any{"gt": 0},
	}
	if recordQuery.Keyword != "" {
		filter["name"] = bodyRecordLike(recordQuery.Keyword)
	}
	status := util.ToStringTrimmed(bodyRecordInput(c, "status"))
	if status == "" {
		status = assetmodel.StatusCurrent
	}
	filter["status"] = status
	if kind := util.ToStringTrimmed(bodyRecordInput(c, "kind")); kind != "" {
		filter["kind"] = kind
	}
	if sourceType := util.ToStringTrimmed(bodyRecordInput(c, "source_type")); sourceType != "" {
		filter["source_type"] = sourceType
	}
	model := assetmodel.NewAssetModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.name,main.kind,main.role,main.source_type,main.source_name,main.version_id,main.status,main.created_at",
		"order":    "main.id desc",
		"page":     recordQuery.Page,
		"pageSize": recordQuery.PageSize,
	})
	versions := loadBodyRecordAssetVersions(ctx, rows)
	list := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		version := versions[row.VersionID]
		list = append(list, map[string]any{
			"id":          row.ID,
			"name":        usageRelationName("资产", row.ID, strings.TrimSpace(row.Name)),
			"kind":        row.Kind,
			"role":        row.Role,
			"source_type": row.SourceType,
			"source_name": strings.TrimSpace(row.SourceName),
			"version":     version.Version,
			"status":      row.Status,
			"created_at":  row.CreatedAt,
			"updated_at":  version.UpdatedAt,
		})
	}
	return bodyRecordPageMap(recordQuery, int(model.Count(ctx, filter)), list)
}

func userBodyRecordContext(c *server.Context) (context.Context, bodyRecordQuery, userUsageQuery) {
	ctx, usageQuery := frontendUsageContext(c)
	recordQuery := bodyRecordQuery{
		UserID:   usageQuery.UserID,
		Page:     1,
		PageSize: defaultBodyRecordPageSize,
	}
	if c != nil {
		recordQuery.Keyword = util.ToStringTrimmed(c.Input("keyword"))
		recordQuery.Page = util.ToIntDefault(c.Input("page"), 1)
		recordQuery.PageSize = util.ToIntDefault(c.Input("pageSize"), defaultBodyRecordPageSize)
	}
	recordQuery.Page = max(recordQuery.Page, 1)
	recordQuery.PageSize = min(max(recordQuery.PageSize, 1), maxBodyRecordPageSize)
	if recordQuery.UserID > 0 {
		recordQuery.User = loadUsageUsersByIDs(ctx, []uint64{recordQuery.UserID})[recordQuery.UserID]
	}
	usageQuery.Keyword = ""
	usageQuery.PageSize = recordQuery.PageSize
	return ctx, recordQuery, usageQuery
}

func loadUsageMapForIDs(
	ctx context.Context,
	query userUsageQuery,
	ids []uint64,
	dimension usageDimension,
	applyIDs func(*userUsageQuery, []uint64),
	entityID func(usageAggregate) uint64,
) (map[uint64]usageAggregate, error) {
	result := make(map[uint64]usageAggregate, len(ids))
	if len(ids) == 0 {
		return result, nil
	}
	applyIDs(&query, ids)
	rows, err := loadUsageAggregates(ctx, query, dimension)
	if err != nil {
		return nil, err
	}
	for _, row := range rows {
		if id := entityID(row); id > 0 {
			result[id] = row
		}
	}
	return result, nil
}

func loadBodyRecordToolNames(
	ctx context.Context,
	rows []*workspacemodel.PowerHistory,
) (map[uint64]uint64, map[uint64]string) {
	teamPowerIDs := make(map[uint64]struct{})
	for _, row := range rows {
		if row != nil && row.TeamPowerID > 0 {
			teamPowerIDs[row.TeamPowerID] = struct{}{}
		}
	}
	powerIDsByTeamPower := make(map[uint64]uint64, len(teamPowerIDs))
	powerIDs := make(map[uint64]struct{})
	if len(teamPowerIDs) > 0 {
		for _, row := range teammodel.NewTeamPowerModel().Select(
			ctx,
			map[string]any{"id": sortedUsageIDs(teamPowerIDs)},
			map[string]any{"field": "main.id,main.power_id"},
		) {
			if row == nil {
				continue
			}
			powerIDsByTeamPower[row.ID] = row.PowerID
			if row.PowerID > 0 {
				powerIDs[row.PowerID] = struct{}{}
			}
		}
	}
	return powerIDsByTeamPower, loadPowerNames(ctx, sortedUsageIDs(powerIDs))
}

func loadBodyRecordRunStatuses(ctx context.Context, ids []uint64) map[uint64]string {
	result := make(map[uint64]string, len(ids))
	if len(ids) == 0 {
		return result
	}
	for _, row := range teammodel.NewRunModel().Select(ctx, map[string]any{"id": ids}, map[string]any{
		"field": "main.id,main.status",
	}) {
		if row != nil {
			result[row.ID] = row.Status
		}
	}
	return result
}

func loadBodyRecordAssetVersions(
	ctx context.Context,
	rows []*assetmodel.Asset,
) map[uint64]bodyRecordAssetVersion {
	versionIDs := make(map[uint64]struct{})
	for _, row := range rows {
		if row != nil && row.VersionID > 0 {
			versionIDs[row.VersionID] = struct{}{}
		}
	}
	result := make(map[uint64]bodyRecordAssetVersion, len(versionIDs))
	if len(versionIDs) == 0 {
		return result
	}
	for _, row := range assetmodel.NewVersionModel().Select(
		ctx,
		map[string]any{"id": sortedUsageIDs(versionIDs)},
		map[string]any{"field": "main.id,main.version,main.created_at,main.updated_at"},
	) {
		if row == nil {
			continue
		}
		updatedAt := row.CreatedAt
		if row.UpdatedAt != nil && !row.UpdatedAt.IsZero() {
			updatedAt = *row.UpdatedAt
		}
		result[row.ID] = bodyRecordAssetVersion{Version: row.Version, UpdatedAt: updatedAt}
	}
	return result
}

func bodyRecordInput(c *server.Context, key string) any {
	if c == nil {
		return nil
	}
	return c.Input(key)
}

func bodyRecordLike(keyword string) map[string]any {
	return map[string]any{"like": "%" + strings.TrimSpace(keyword) + "%"}
}

func bodyRecordPageMap(query bodyRecordQuery, total int, list []map[string]any) map[string]any {
	return map[string]any{
		"list":     list,
		"total":    total,
		"page":     query.Page,
		"pageSize": query.PageSize,
		"user":     bodyRecordUserMap(query),
	}
}

func bodyRecordUserMap(query bodyRecordQuery) map[string]any {
	return map[string]any{
		"id":      query.UserID,
		"name":    usageUserName(query.UserID, query.User),
		"account": usageUserAccount(query.UserID, query.User),
	}
}

func emptyBodyRecordPage(query bodyRecordQuery) map[string]any {
	return bodyRecordPageMap(query, 0, []map[string]any{})
}
