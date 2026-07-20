package workbench

import (
	"context"

	teammodel "github.com/dever-package/bot/model/team"
)

func prepareAssetVersionDetail(ctx context.Context, teamID uint64, version map[string]any) {
	if len(version) == 0 {
		return
	}
	reprojectDialogueVersionContent(ctx, teamID, version)
	hydrateAssetVersionPrompt(ctx, teamID, version)
}

func hydrateAssetVersionPrompt(ctx context.Context, teamID uint64, version map[string]any) {
	source := recordValue(version["source"])
	if nestedText(source, "prompt") != "" {
		return
	}

	runID := nestedUint64(source, "source_run_id")
	if runID == 0 {
		runID = nestedUint64(version, "run_id")
	}
	if runID == 0 {
		return
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{
		"id":      runID,
		"team_id": teamID,
	})
	if run == nil {
		return
	}
	prompt := assetGenerationPrompt(recordValue(run.Input))
	if prompt == "" {
		return
	}
	source["prompt"] = prompt
	version["source"] = source
}

func assetGenerationPrompt(input map[string]any) string {
	if prompt := nestedText(input, "prompt"); prompt != "" {
		return prompt
	}
	replayInput := recordValue(input[powerReplayInputKey])
	if prompt := nestedText(replayInput, "prompt"); prompt != "" {
		return prompt
	}
	if text := nestedText(input, "text"); text != "" {
		return text
	}
	return nestedText(replayInput, "text")
}
