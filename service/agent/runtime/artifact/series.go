package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func resolveSeries(ctx context.Context, session agentmodel.Session, kind string, requestedID uint64, sourceIDs []uint64, profile map[string]any) (uint64, error) {
	if !strings.EqualFold(strings.TrimSpace(kind), "image") {
		return requestedID, nil
	}
	if requestedID > 0 {
		if row := validSeries(ctx, session, requestedID); row != nil {
			return row.ID, nil
		}
		return 0, fmt.Errorf("素材系列不存在或无权访问")
	}
	masterID := uint64(0)
	if len(sourceIDs) > 0 {
		masterID = sourceIDs[0]
		if source := agentmodel.NewArtifactModel().Find(ctx, map[string]any{"id": masterID}); source != nil {
			if source.SeriesID > 0 && validSeries(ctx, session, source.SeriesID) != nil {
				return source.SeriesID, nil
			}
		}
	}
	now := time.Now()
	id := uint64(agentmodel.NewArtifactSeriesModel().Insert(ctx, map[string]any{
		"owner_type":         session.OwnerType,
		"owner_id":           session.OwnerID,
		"agent_key":          session.AgentKey,
		"name":               seriesName(profile),
		"master_artifact_id": masterID,
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

func setSeriesMaster(ctx context.Context, seriesID uint64, artifactID uint64) {
	if seriesID == 0 || artifactID == 0 {
		return
	}
	series := agentmodel.NewArtifactSeriesModel().Find(ctx, map[string]any{"id": seriesID})
	if series == nil || series.MasterArtifactID > 0 {
		return
	}
	agentmodel.NewArtifactSeriesModel().Update(ctx, map[string]any{"id": seriesID}, map[string]any{
		"master_artifact_id": artifactID,
		"updated_at":         time.Now(),
	})
}

func ensureReadySeriesMaster(ctx context.Context, artifacts []agentmodel.Artifact) {
	for _, artifact := range artifacts {
		if artifact.SeriesID == 0 || artifact.Status != agentmodel.ArtifactStatusReady {
			continue
		}
		series := agentmodel.NewArtifactSeriesModel().Find(ctx, map[string]any{"id": artifact.SeriesID})
		if series == nil {
			continue
		}
		master := agentmodel.NewArtifactModel().Find(ctx, map[string]any{"id": series.MasterArtifactID})
		if master != nil && master.Status == agentmodel.ArtifactStatusReady {
			continue
		}
		agentmodel.NewArtifactSeriesModel().Update(ctx, map[string]any{"id": series.ID}, map[string]any{
			"master_artifact_id": artifact.ID,
			"updated_at":         time.Now(),
		})
	}
}

func seriesName(profile map[string]any) string {
	for _, key := range []string{"prompt", "text", "name"} {
		if value := textValue(profile[key]); value != "" {
			runes := []rune(strings.Join(strings.Fields(value), " "))
			if len(runes) > 28 {
				runes = runes[:28]
			}
			return string(runes)
		}
	}
	return "素材系列"
}
