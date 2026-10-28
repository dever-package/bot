package team

import (
	"context"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
	"github.com/dever-package/bot/service/stream"
)

// Provider 请求与 Run 请求是不同身份；客户端只订阅作品所属 Run。
func (s Service) publishWritingPreview(ctx context.Context, run teammodel.Run, checkpoint writingCheckpoint, providerPayload map[string]any, onStream func(map[string]any)) {
	if ctx.Err() != nil {
		return
	}
	payload := writingPreviewPayload(run, checkpoint, providerPayload)
	if payload == nil {
		return
	}
	_, _ = s.streams.WritePayload(ctx, run.RequestID, payload)
	if onStream != nil {
		onStream(payload)
	}
}

func writingPreviewPayload(run teammodel.Run, checkpoint writingCheckpoint, providerPayload map[string]any) map[string]any {
	partial := mapValue(mapValue(mapValue(providerPayload["output"])["meta"])["writing_preview"])
	if len(partial) == 0 || firstText(providerPayload["request_id"]) != checkpoint.RequestID {
		return nil
	}
	preview := map[string]any{
		"work_asset_id": checkpoint.WorkAssetID, "run_id": run.ID,
		"request_id": run.RequestID, "step_request_id": checkpoint.RequestID,
		"unit_id": checkpoint.UnitID, "section_id": checkpoint.SectionID,
		"entity_id": checkpoint.EntityID, "inspiration_id": checkpoint.InspirationID,
		"fields": partial["fields"], "active_field": partial["active_field"], "phase": checkpoint.Phase,
	}
	if writingChapterDraftPhase(checkpoint) {
		preview["fields"], preview["active_field"] = writingChapterPreviewFields(checkpoint, partial)
	}
	if checkpoint.Action == "generate_outline" && checkpoint.Phase != "" {
		fields := map[string]any{}
		for key, value := range mapValue(preview["fields"]) {
			fields[writingPlanningPreviewField(checkpoint.Phase, key)] = value
		}
		preview["fields"] = fields
		preview["active_field"] = writingPlanningPreviewField(checkpoint.Phase, firstText(preview["active_field"]))
	}
	if values, ok := partial["values"]; ok {
		preview["values"] = values
	}
	if completed, ok := partial["completed_sections"]; ok && checkpoint.Action == "generate_outline" && checkpoint.Phase == "background" {
		preview["completed_sections"] = completed
	}
	return stream.Payload(run.RequestID, stream.FeaturePower, "status", map[string]any{"writing_preview": preview})
}

func writingPlanningPreviewField(phase, key string) string {
	if phase == "direction" && key == "content" {
		return "outline.overview"
	}
	if phase == "characters" && strings.HasPrefix(key, "entities.") {
		return "outline.characters." + strings.TrimPrefix(key, "entities.")
	}
	if phase == "background" && (key == "world" || strings.HasPrefix(key, "locations.") || strings.HasPrefix(key, "props.")) {
		return "outline." + key
	}
	return key
}
