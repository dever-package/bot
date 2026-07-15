package reference

func PreviewPayload(value Resolved) map[string]any {
	media := make([]map[string]any, 0, len(value.Media))
	for _, current := range value.Media {
		media = append(media, map[string]any{
			"ref_type":    current.ReferenceType,
			"ref_id":      current.ReferenceID,
			"artifact_id": current.ArtifactID,
			"file_id":     current.FileID,
			"series_id":   current.SeriesID,
			"kind":        current.Kind,
			"name":        current.Name,
			"label":       current.Label,
			"url":         current.URL,
		})
	}
	result := map[string]any{
		"ref_type": value.Reference.Type,
		"ref_id":   value.Reference.ID,
		"title":    value.Title,
		"text":     value.Text,
		"media":    media,
	}
	if len(value.Output) > 0 {
		result["output"] = value.Output
	}
	return result
}
