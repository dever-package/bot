package team

import (
	"context"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	billingservice "github.com/dever-package/bot/service/billing"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	canvasPowerContextAllowedSourceTargetIDs    = "allowed_source_target_ids"
	canvasPowerContextStoryboardMaxShotDuration = "storyboard_max_shot_duration"
	canvasPowerContextImageSequenceMode         = "image_sequence_mode"
	canvasPowerContextImageSequenceMinImages    = "image_sequence_min_images"
	canvasPowerContextImageSequenceMaxImages    = "image_sequence_max_images"
	canvasPowerContextImageSequenceFrames       = "image_sequence_frames"
)

type powerExecutionConstraints struct {
	SourceTargetID            uint64
	AllowedSourceTargetIDs    []uint64
	StoryboardMaxShotDuration int
	ImageSequenceMode         string
	ImageSequenceMinImages    int
	ImageSequenceMaxImages    int
	ImageSequenceFrames       []map[string]any
	MediaReferences           []map[string]any
}

func (s Service) executePower(
	ctx context.Context,
	requestID string,
	power PowerOption,
	input map[string]any,
	constraints powerExecutionConstraints,
	billing botprotocol.BillingContext,
	onStream func(map[string]any),
) (map[string]any, error) {
	constraints.SourceTargetID = resolveSourceTargetID(constraints.SourceTargetID, input)
	body := canvasPowerGatewayBody(power, input, constraints)
	output, err := billingservice.ExecutePower(ctx, billingservice.PowerExecutionRequest{
		Prepare: billingservice.PreparePowerChargeRequest{
			Billing:       billing,
			RequestID:     requestID,
			PowerID:       power.ID,
			PowerName:     power.Name,
			PowerTargetID: constraints.SourceTargetID,
		},
		RunID: billing.RunID,
	}, func(ctx context.Context, charged botprotocol.BillingContext) (botprotocol.Output, error) {
		result, invokeErr := s.gateway.Invoke(ctx, energonservice.GatewayRequest{
			RequestID:                 requestID,
			Method:                    "POST",
			Path:                      "/bot/admin/energon/request",
			Body:                      body,
			Billing:                   charged,
			AllowedSourceTargetIDs:    constraints.AllowedSourceTargetIDs,
			StoryboardMaxShotDuration: constraints.StoryboardMaxShotDuration,
		}, energonservice.InvokeOptions{
			Block: time.Second,
			OnOutput: func(_ context.Context, current botprotocol.Output) error {
				if onStream != nil {
					onStream(botprotocol.BuildStreamResponse(requestID, current).Payload())
				}
				return nil
			},
		})
		if run := s.repo.FindRun(context.WithoutCancel(ctx), billing.RunID); run != nil && run.Status == teammodel.RunStatusCanceled {
			return result.Output, context.Canceled
		}
		return result.Output, invokeErr
	})
	return powerOutputValue(output, power.Kind), err
}

func canvasPowerConstraints(req CanvasPowerRunRequest) powerExecutionConstraints {
	return powerExecutionConstraints{
		SourceTargetID:            req.SourceTargetID,
		AllowedSourceTargetIDs:    append([]uint64(nil), req.AllowedSourceTargetIDs...),
		StoryboardMaxShotDuration: req.StoryboardMaxShotDuration,
		ImageSequenceMode:         req.ImageSequenceMode,
		ImageSequenceMinImages:    req.ImageSequenceMinImages,
		ImageSequenceMaxImages:    req.ImageSequenceMaxImages,
		ImageSequenceFrames:       cloneCanvasPowerSequenceFrames(req.ImageSequenceFrames),
		MediaReferences:           energoninput.MediaReferencePromptMetadata(req.MediaReferences),
	}
}

func resumedCanvasPowerConstraints(resumeContext map[string]any) powerExecutionConstraints {
	return powerExecutionConstraints{
		SourceTargetID:            uint64Value(resumeContext["source_target_id"]),
		AllowedSourceTargetIDs:    canvasPowerTargetIDs(resumeContext[canvasPowerContextAllowedSourceTargetIDs]),
		StoryboardMaxShotDuration: intValue(resumeContext[canvasPowerContextStoryboardMaxShotDuration], 0),
		ImageSequenceMode:         firstText(resumeContext[canvasPowerContextImageSequenceMode]),
		ImageSequenceMinImages:    intValue(resumeContext[canvasPowerContextImageSequenceMinImages], 0),
		ImageSequenceMaxImages:    intValue(resumeContext[canvasPowerContextImageSequenceMaxImages], 0),
		ImageSequenceFrames:       canvasPowerSequenceFrames(resumeContext[canvasPowerContextImageSequenceFrames]),
		MediaReferences:           canvasPowerSequenceFrames(resumeContext[botprotocol.OptionImageSequenceMediaReferences]),
	}
}

func canvasPowerTargetIDs(raw any) []uint64 {
	var values []any
	switch current := raw.(type) {
	case []any:
		values = current
	case []uint64:
		values = make([]any, 0, len(current))
		for _, targetID := range current {
			values = append(values, targetID)
		}
	default:
		return nil
	}
	result := make([]uint64, 0, len(values))
	seen := make(map[uint64]struct{}, len(values))
	for _, value := range values {
		targetID := uint64Value(value)
		if targetID == 0 {
			continue
		}
		if _, exists := seen[targetID]; exists {
			continue
		}
		seen[targetID] = struct{}{}
		result = append(result, targetID)
	}
	return result
}

func (s Service) PreflightCanvasPower(ctx context.Context, req CanvasPowerRunRequest) error {
	prepared, err := s.prepareCanvasPower(ctx, req)
	if err != nil {
		return err
	}
	input := canvasPowerRunInput(prepared.request)
	return s.gateway.Validate(ctx, energonservice.GatewayRequest{
		Method:                    "POST",
		Path:                      "/bot/admin/energon/request",
		AllowedSourceTargetIDs:    prepared.request.AllowedSourceTargetIDs,
		StoryboardMaxShotDuration: prepared.request.StoryboardMaxShotDuration,
		Body: canvasPowerGatewayBody(
			prepared.power,
			input,
			canvasPowerConstraints(prepared.request),
		),
	})
}

func canvasPowerGatewayBody(
	power PowerOption,
	input map[string]any,
	constraints powerExecutionConstraints,
) map[string]any {
	sourceTargetID := resolveSourceTargetID(constraints.SourceTargetID, input)
	options := map[string]any{"stream": true}
	if constraints.ImageSequenceMode != "" {
		options[botprotocol.OptionImageSequenceMode] = constraints.ImageSequenceMode
	}
	if constraints.ImageSequenceMinImages > 0 {
		options[botprotocol.OptionImageSequenceMinImages] = constraints.ImageSequenceMinImages
	}
	if constraints.ImageSequenceMaxImages > 0 {
		options[botprotocol.OptionImageSequenceMaxImages] = constraints.ImageSequenceMaxImages
	}
	if len(constraints.ImageSequenceFrames) > 0 {
		options[botprotocol.OptionImageSequenceFrames] = cloneCanvasPowerSequenceFrames(constraints.ImageSequenceFrames)
	}
	if len(constraints.MediaReferences) > 0 {
		options[botprotocol.OptionImageSequenceMediaReferences] = cloneCanvasPowerSequenceFrames(constraints.MediaReferences)
	}
	body := map[string]any{
		"protocol": "shemic",
		"power":    power.Key,
		"input":    input,
		"history":  []any{},
		"options":  options,
	}
	if sourceTargetID > 0 {
		body["source_target_id"] = sourceTargetID
	}
	return body
}

func canvasPowerSequenceFrames(value any) []map[string]any {
	if frames, ok := value.([]map[string]any); ok {
		return cloneCanvasPowerSequenceFrames(frames)
	}
	return cloneCanvasPowerSequenceFrames(sliceMapValue(value))
}

func cloneCanvasPowerSequenceFrames(frames []map[string]any) []map[string]any {
	result := make([]map[string]any, 0, len(frames))
	for _, frame := range frames {
		result = append(result, cloneInput(frame))
	}
	return result
}
