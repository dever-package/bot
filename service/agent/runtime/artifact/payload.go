package artifact

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

func Payload(ctx context.Context, row agentmodel.Artifact) map[string]any {
	result := map[string]any{
		"artifact_id":         row.ID,
		"session_id":          row.SessionID,
		"message_id":          row.MessageID,
		"run_id":              row.RunID,
		"step_id":             row.StepID,
		"file_id":             row.FileID,
		"series_id":           row.SeriesID,
		"kind":                row.Kind,
		"display_no":          row.DisplayNo,
		"name":                row.Name,
		"label":               displayLabel(row),
		"batch_key":           row.BatchKey,
		"source_artifact_ids": decodeIDs(row.SourceArtifactIDs),
		"meta":                decodeMap(row.Meta),
		"status":              artifactStatusName(row.Status),
		"status_code":         row.Status,
		"error":               row.Error,
	}
	if row.FileID == 0 {
		return result
	}
	file, err := uploadrepo.FindUploadFile(ctx, row.FileID)
	if err != nil {
		result["status"] = "failed"
		result["error"] = "素材文件不存在"
		return result
	}
	filePayload := uploadrepo.BuildUploadFilePayload(file)
	result["url"] = filePayload["url"]
	result["preview_url"] = firstText(filePayload["thumbnail"], filePayload["url"], filePayload["open_url"])
	result["open_url"] = filePayload["open_url"]
	result["download"] = filePayload["download"]
	result["mime"] = filePayload["mime"]
	result["size"] = filePayload["size"]
	return result
}

func Payloads(ctx context.Context, rows []agentmodel.Artifact) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, Payload(ctx, row))
	}
	return result
}

func displayLabel(row agentmodel.Artifact) string {
	prefix := artifactKindLabel(row.Kind)
	if row.DisplayNo > 0 {
		prefix = fmt.Sprintf("%s%d", prefix, row.DisplayNo)
	}
	if strings.TrimSpace(row.Name) == "" {
		return prefix
	}
	return prefix + " · " + strings.TrimSpace(row.Name)
}

func artifactKindLabel(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image":
		return "图"
	case "video":
		return "视频"
	case "audio":
		return "音频"
	default:
		return "文件"
	}
}

func artifactStatusName(status int16) string {
	switch status {
	case agentmodel.ArtifactStatusReady:
		return "ready"
	case agentmodel.ArtifactStatusFailed:
		return "failed"
	default:
		return "generating"
	}
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" {
			return text
		}
	}
	return ""
}
