package loop

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

func mediaReferences(values []runtimereference.Media) []runtimeprovider.MediaReference {
	result := make([]runtimeprovider.MediaReference, 0, len(values))
	for _, current := range values {
		result = append(result, runtimeprovider.MediaReference{
			ReferenceType: current.ReferenceType,
			ReferenceID:   current.ReferenceID,
			ArtifactID:    current.ArtifactID,
			FileID:        current.FileID,
			SeriesID:      current.SeriesID,
			Kind:          current.Kind,
			Name:          current.Name,
			Label:         current.Label,
			URL:           current.URL,
			ParameterKey:  current.Usage,
		})
	}
	return result
}

func bindInputUploads(ctx context.Context, session agentmodel.Session, messageID uint64, media []runtimereference.Media) ([]agentmodel.Artifact, error) {
	bindings := make([]runtimeartifact.UploadBinding, 0, len(media))
	for _, current := range media {
		if current.ReferenceType != runtimereference.TypeUploadFile || current.FileID == 0 {
			continue
		}
		bindings = append(bindings, runtimeartifact.UploadBinding{
			FileID: current.FileID,
			Kind:   current.Kind,
			Name:   current.Name,
		})
	}
	return runtimeartifact.NewService().BindUploads(ctx, session.ID, messageID, bindings)
}

func attachBoundUploads(references []runtimeprovider.MediaReference, artifacts []agentmodel.Artifact) []runtimeprovider.MediaReference {
	byFileID := make(map[uint64]agentmodel.Artifact, len(artifacts))
	for _, artifact := range artifacts {
		byFileID[artifact.FileID] = artifact
	}
	result := append([]runtimeprovider.MediaReference(nil), references...)
	for index, current := range result {
		artifact, exists := byFileID[current.FileID]
		if !exists || current.ArtifactID > 0 {
			continue
		}
		result[index].ArtifactID = artifact.ID
		result[index].SeriesID = artifact.SeriesID
	}
	return result
}

func withActiveSeriesReference(ctx context.Context, session agentmodel.Session, references []runtimeprovider.MediaReference) []runtimeprovider.MediaReference {
	if session.ActiveSeriesID == 0 {
		return references
	}
	series := agentmodel.NewArtifactSeriesModel().Find(ctx, map[string]any{
		"id":         session.ActiveSeriesID,
		"owner_type": session.OwnerType,
		"owner_id":   session.OwnerID,
		"status":     agentmodel.ArtifactSeriesStatusActive,
	})
	if series == nil || series.MasterArtifactID == 0 {
		return references
	}
	profile := runtimeartifact.SeriesProfile(*series)
	for index, current := range references {
		if current.ArtifactID == series.MasterArtifactID {
			result := append([]runtimeprovider.MediaReference(nil), references...)
			result[index].SeriesID = series.ID
			result[index].ActiveSeries = true
			result[index].SeriesProfile = profile
			return result
		}
	}
	artifact := runtimeartifact.NewService().Find(ctx, series.MasterArtifactID)
	if artifact == nil || artifact.Status == agentmodel.ArtifactStatusFailed {
		return references
	}
	payload := runtimeartifact.Payload(ctx, *artifact)
	url, _ := payload["url"].(string)
	label, _ := payload["label"].(string)
	return append(references, runtimeprovider.MediaReference{
		ReferenceType: runtimereference.TypeArtifact,
		ReferenceID:   series.MasterArtifactID,
		ArtifactID:    series.MasterArtifactID,
		FileID:        artifact.FileID,
		SeriesID:      series.ID,
		Kind:          artifact.Kind,
		Name:          artifact.Name,
		Label:         "当前系列主素材 · " + strings.TrimSpace(label),
		URL:           strings.TrimSpace(url),
		ActiveSeries:  true,
		SeriesProfile: profile,
	})
}
