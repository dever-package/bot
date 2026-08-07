package project

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	teamservice "github.com/dever-package/bot/service/team"
)

const (
	canvasMultiImageModePerImage        = "per_image"
	canvasMultiImageModeSharedReference = "shared_reference"
)

func normalizeCanvasMultiImageMode(value string) (string, error) {
	mode := strings.ToLower(strings.TrimSpace(value))
	switch mode {
	case "", canvasMultiImageModePerImage, canvasMultiImageModeSharedReference:
		return mode, nil
	default:
		return "", fmt.Errorf("不支持的多图生成方式: %s", value)
	}
}

func (s WorkspaceService) runCanvasPowerRequests(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	run *teammodel.Run,
	node canvasRunNode,
	nodeRunID uint64,
	input map[string]any,
	params map[string]any,
	references []energoninput.MediaReference,
) (map[string]any, error) {
	batches := canvasPowerReferenceBatches(node, references)
	if len(batches) == 1 {
		return s.runCanvasPowerRequest(
			ctx,
			projectID,
			req,
			run,
			node,
			nodeRunID,
			canvasChildRequestID(req.RequestID, node.ID),
			input,
			params,
			batches[0],
			nil,
		)
	}

	requestID := canvasChildRequestID(req.RequestID, node.ID)
	outputs := make([]botprotocol.Output, 0, len(batches))
	var result map[string]any
	for index, batch := range batches {
		if workspaceRunCanceled(ctx, run.ID) {
			return result, nil
		}
		childRequestID := canvasIndexedChildRequestID(requestID, index)
		current, err := s.runCanvasPowerRequest(
			ctx,
			projectID,
			req,
			run,
			node,
			nodeRunID,
			childRequestID,
			input,
			params,
			batch,
			outputs,
		)
		result = current
		if workspaceRunCanceled(ctx, run.ID) {
			return result, nil
		}
		if err != nil {
			return result, fmt.Errorf("第 %d 张参考图生成失败: %w", index+1, err)
		}
		if canvasRunStatus(current) != teammodel.RunStatusSuccess {
			return result, nil
		}

		output := botprotocol.ExtractOutput(current)
		if len(botprotocol.ExtractPrimaryMediaURLs(output, botprotocol.MediaTypeVideo)) == 0 {
			return result, fmt.Errorf("第 %d 张参考图未返回可用视频", index+1)
		}
		outputs = append(outputs, output)
		merged := botprotocol.MergeStreamResult(outputs)
		s.forwardWorkspaceNodeStream(ctx, run, node, nodeRunID, map[string]any{
			"output": map[string]any(merged),
		})
	}

	if result == nil {
		return nil, fmt.Errorf("图片参考未生成有效结果")
	}
	result = cloneInput(result)
	result["request_id"] = requestID
	result["status"] = teammodel.RunStatusSuccess
	result["output"] = map[string]any(botprotocol.MergeStreamResult(outputs))
	return result, nil
}

func (s WorkspaceService) runCanvasPowerRequest(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	run *teammodel.Run,
	node canvasRunNode,
	nodeRunID uint64,
	requestID string,
	input map[string]any,
	params map[string]any,
	references []energoninput.MediaReference,
	completed []botprotocol.Output,
) (map[string]any, error) {
	trackWorkspaceNodeChildRun(
		ctx,
		projectID,
		run.ID,
		nodeRunID,
		node.ID,
		0,
		requestID,
	)
	return s.project.RunCanvasPower(ctx, projectID, teamservice.CanvasPowerRunRequest{
		FlowID:            node.FlowID,
		RequestID:         requestID,
		AssetCateID:       firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:           node.ID,
		NodeName:          node.Title,
		Kind:              node.Kind,
		PowerID:           node.PowerID,
		PowerKey:          node.PowerKey,
		SourceTargetID:    node.SelectedTarget,
		ImageSequenceMode: canvasPowerImageSequenceMode(node),
		Input:             cloneInput(input),
		Params:            cloneInput(params),
		MediaReferences:   references,
		PersistResult:     false,
		OnRunCreated: func(childRunID uint64, childRequestID string) error {
			trackWorkspaceNodeChildRun(
				ctx,
				projectID,
				run.ID,
				nodeRunID,
				node.ID,
				childRunID,
				childRequestID,
			)
			if !workspaceRunCanceled(ctx, run.ID) {
				return nil
			}
			if _, err := s.project.team.StopProjectRun(
				context.WithoutCancel(ctx),
				projectID,
				childRunID,
				childRequestID,
			); err != nil {
				return context.Canceled
			}
			return nil
		},
		OnStream: func(payload map[string]any) {
			s.forwardWorkspaceNodeStream(
				ctx,
				run,
				node,
				nodeRunID,
				canvasPowerStreamPayload(completed, payload),
			)
		},
	})
}

func canvasPowerImageSequenceMode(node canvasRunNode) string {
	if assetservice.NormalizeKind(node.Kind) != assetmodel.KindImage ||
		energonmodel.NormalizeOutputType(node.OutputType) != energonmodel.OutputTypeGeneral {
		return ""
	}

	// A storyboard-derived image node represents one material or shot.
	if canvasStoryboardItemType(node) != "" {
		return botprotocol.ImageSequenceModeSingle
	}
	return botprotocol.ImageSequenceModeAuto
}

func canvasPowerStreamPayload(
	completed []botprotocol.Output,
	payload map[string]any,
) map[string]any {
	if len(completed) == 0 || payload == nil {
		return payload
	}
	rawOutput := mapValue(payload["output"])
	if len(rawOutput) == 0 || !assetservice.HasContent(rawOutput) {
		return payload
	}
	current := botprotocol.ExtractOutput(rawOutput)
	if len(current) == 0 {
		return payload
	}
	outputs := make([]botprotocol.Output, 0, len(completed)+1)
	outputs = append(outputs, completed...)
	outputs = append(outputs, current)
	merged := cloneInput(payload)
	merged["output"] = map[string]any(botprotocol.MergeStreamResult(outputs))
	return merged
}

func canvasPowerReferenceBatches(
	node canvasRunNode,
	references []energoninput.MediaReference,
) [][]energoninput.MediaReference {
	if !canvasShouldRunPerImage(node, references) {
		return [][]energoninput.MediaReference{references}
	}

	imageIndexes := make([]int, 0, len(references))
	firstImageIndex := -1
	for index, reference := range references {
		if canvasMediaReferenceKind(reference) == botprotocol.MediaTypeImage {
			if firstImageIndex < 0 {
				firstImageIndex = index
			}
			imageIndexes = append(imageIndexes, index)
		}
	}
	batches := make([][]energoninput.MediaReference, 0, len(imageIndexes))
	for _, selectedIndex := range imageIndexes {
		batch := make([]energoninput.MediaReference, 0, len(references)-len(imageIndexes)+1)
		for index, reference := range references {
			if canvasMediaReferenceKind(reference) == botprotocol.MediaTypeImage {
				if index == firstImageIndex {
					batch = append(batch, references[selectedIndex])
				}
				continue
			}
			batch = append(batch, reference)
		}
		batches = append(batches, batch)
	}
	return batches
}

func canvasShouldRunPerImage(
	node canvasRunNode,
	references []energoninput.MediaReference,
) bool {
	if strings.ToLower(strings.TrimSpace(node.MultiImageMode)) != canvasMultiImageModePerImage ||
		assetservice.NormalizeKind(node.Kind) != assetmodel.KindVideo ||
		energonmodel.NormalizeOutputType(node.OutputType) != energonmodel.OutputTypeGeneral {
		return false
	}
	imageCount := 0
	hasFirstFrame := false
	hasLastFrame := false
	for _, reference := range references {
		if canvasMediaReferenceKind(reference) != botprotocol.MediaTypeImage {
			continue
		}
		imageCount++
		switch canvasFrameUsage(reference.Usage) {
		case "first":
			hasFirstFrame = true
		case "last":
			hasLastFrame = true
		}
	}
	return imageCount > 1 && !(hasFirstFrame && hasLastFrame)
}

func canvasMediaReferenceKind(reference energoninput.MediaReference) string {
	return strings.ToLower(strings.TrimSpace(reference.Kind))
}

func canvasFrameUsage(value string) string {
	normalized := strings.NewReplacer("_", "", "-", "", " ", "").Replace(
		strings.ToLower(strings.TrimSpace(value)),
	)
	switch normalized {
	case "first", "firstframe", "start", "startframe", "首帧":
		return "first"
	case "last", "lastframe", "end", "endframe", "尾帧":
		return "last"
	default:
		return ""
	}
}

func canvasIndexedChildRequestID(base string, index int) string {
	suffix := fmt.Sprintf("-image-%02d", index+1)
	if len(base)+len(suffix) <= 64 {
		return base + suffix
	}
	return base[:64-len(suffix)] + suffix
}
