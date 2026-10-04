package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func resolveSeries(ctx context.Context, session agentmodel.Session, kind string, requestedID uint64, profile map[string]any) (uint64, error) {
	if !strings.EqualFold(strings.TrimSpace(kind), "image") {
		return 0, nil
	}
	if requestedID > 0 {
		if row := validSeries(ctx, session, requestedID); row != nil {
			return row.ID, nil
		}
		return 0, fmt.Errorf("素材系列不存在或无权访问")
	}
	now := time.Now()
	id := uint64(agentmodel.NewArtifactSeriesModel().Insert(ctx, map[string]any{
		"owner_type":         session.OwnerType,
		"owner_id":           session.OwnerID,
		"agent_key":          session.AgentKey,
		"name":               seriesName(profile),
		"master_artifact_id": 0,
		"profile":            encodeJSON(profile, "{}"),
		"profile_version":    1,
		"status":             agentmodel.ArtifactSeriesStatusActive,
		"created_at":         now,
		"updated_at":         now,
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建素材系列失败")
	}
	return id, nil
}

func validSeries(ctx context.Context, session agentmodel.Session, id uint64) *agentmodel.ArtifactSeries {
	return agentmodel.NewArtifactSeriesModel().Find(ctx, map[string]any{
		"id":         id,
		"owner_type": session.OwnerType,
		"owner_id":   session.OwnerID,
		"status":     agentmodel.ArtifactSeriesStatusActive,
	})
}

// A batch consistently uses its first result. Session locking serializes
// completions; an older request finishing late cannot replace a newer master.
func activateReadyImageBatch(ctx context.Context, artifacts []agentmodel.Artifact) error {
	if len(artifacts) == 0 {
		return nil
	}
	image := artifacts[0]
	if image.Kind != "image" || image.SeriesID == 0 || image.Status != agentmodel.ArtifactStatusReady || image.FileID == 0 {
		return nil
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": image.SessionID})
	if session == nil {
		return fmt.Errorf("素材所属会话不存在")
	}
	series := validSeries(ctx, *session, image.SeriesID)
	if series == nil {
		return fmt.Errorf("素材系列不存在或无权访问")
	}
	if series.MasterArtifactID > image.ID {
		return nil
	}
	agentmodel.NewArtifactSeriesModel().Update(ctx, map[string]any{
		"id":                 series.ID,
		"master_artifact_id": map[string]any{"lt": image.ID},
	}, map[string]any{
		"master_artifact_id": image.ID,
		"profile":            image.Meta,
		"updated_at":         time.Now(),
	})
	if active := validSeries(ctx, *session, session.ActiveSeriesID); active != nil && active.MasterArtifactID > image.ID {
		return nil
	}
	agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{"active_series_id": series.ID})
	return nil
}

func SeriesProfile(series agentmodel.ArtifactSeries) map[string]any {
	return decodeMap(series.Profile)
}

func seriesName(profile map[string]any) string {
	if value := textValue(profile["artifact_name"]); value != "" {
		runes := []rune(strings.Join(strings.Fields(value), " "))
		if len(runes) > 28 {
			runes = runes[:28]
		}
		return string(runes)
	}
	return "素材系列"
}
