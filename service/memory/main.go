package memory

import (
	"context"
	"strings"
	"time"

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
	kind := strings.TrimSpace(req.Kind)
	if kind == "" {
		kind = "episodic"
	}
	tags := strings.TrimSpace(req.Tags)
	if tags == "" {
		tags = "[]"
	}
	importance := req.Importance
	if importance <= 0 {
		importance = 50
	}
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
		"title":       strings.TrimSpace(req.Title),
		"content":     req.Content,
		"tags":        tags,
		"importance":  importance,
		"status":      memorymodel.StatusEnabled,
		"created_at":  time.Now(),
	}
	return uint64(memorymodel.NewMemoryModel().Insert(ctx, record))
}
