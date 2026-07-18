package memory

import (
	"context"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"

	memorymodel "github.com/dever-package/bot/model/memory"
)

type Service struct{}

type SaveRequest struct {
	OwnerType  string
	OwnerID    uint64
	ProjectID  uint64
	TeamID     uint64
	FlowID     uint64
	RunID      uint64
	NodeRunID  uint64
	AssetID    uint64
	VersionID  uint64
	Kind       string
	Title      string
	Content    string
	Tags       string
	Importance int
}

func NewService() Service {
	return Service{}
}

func (Service) Save(ctx context.Context, req SaveRequest) uint64 {
	ownerType := strings.TrimSpace(req.OwnerType)
	if ownerType == "" {
		ownerType = memorymodel.OwnerTypeTeam
	}
	kind := normalizeMemoryKind(req.Kind)
	if kind == "" {
		kind = "episodic"
	}
	title, content, tags, err := prepareMemoryFields(req.Title, req.Content, storedMemoryTags(req.Tags))
	if err != nil || title == "" || content == "" {
		logMemoryWriteFailure("团队记忆未保存", req, err)
		return 0
	}
	importance := req.Importance
	if importance <= 0 {
		importance = 50
	} else if importance > 100 {
		importance = 100
	}
	req.OwnerType = ownerType
	req.Title = title
	req.Content = content
	dedupeKey := sourceMemoryDedupeKey(req, title, content)
	record := map[string]any{
		"owner_type":  ownerType,
		"owner_id":    req.OwnerID,
		"project_id":  req.ProjectID,
		"team_id":     req.TeamID,
		"flow_id":     req.FlowID,
		"run_id":      req.RunID,
		"node_run_id": req.NodeRunID,
		"asset_id":    req.AssetID,
		"version_id":  req.VersionID,
		"kind":        kind,
		"dedupe_key":  memoryDedupeColumn(dedupeKey),
		"title":       title,
		"content":     content,
		"tags":        encodeMemoryJSON(tags, "[]"),
		"importance":  importance,
		"status":      memorymodel.StatusEnabled,
		"created_at":  time.Now(),
		"updated_at":  time.Now(),
	}
	existing := findMemoryByDedupeKey(ctx, dedupeKey)
	if existing == nil {
		existing = findMemoryBySource(ctx, req)
	}
	if existing != nil {
		delete(record, "created_at")
		if _, updateErr := updateMemoryRecord(ctx, existing.ID, record); updateErr != nil {
			logMemoryWriteFailure("团队记忆更新失败", req, updateErr)
			return 0
		}
		return existing.ID
	}
	id, insertErr := insertMemoryRecord(ctx, record)
	if insertErr == nil && id > 0 {
		return id
	}
	if existing := findMemoryByDedupeKey(ctx, dedupeKey); existing != nil {
		return existing.ID
	}
	logMemoryWriteFailure("团队记忆保存失败", req, insertErr)
	return 0
}

func logMemoryWriteFailure(message string, request SaveRequest, err error) {
	fields := dlog.Fields{
		"owner_type":  request.OwnerType,
		"owner_id":    request.OwnerID,
		"run_id":      request.RunID,
		"node_run_id": request.NodeRunID,
	}
	if err != nil {
		fields["error"] = err.Error()
	}
	dlog.ErrorFields("memory_write", message, fields)
}
