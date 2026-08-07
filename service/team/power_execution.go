package team

import (
	"context"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	billingservice "github.com/dever-package/bot/service/billing"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) executePower(
	ctx context.Context,
	requestID string,
	power PowerOption,
	input map[string]any,
	sourceTargetID uint64,
	imageSequenceMode string,
	billing botprotocol.BillingContext,
	onStream func(map[string]any),
) (map[string]any, error) {
	sourceTargetID = resolveSourceTargetID(sourceTargetID, input)
	body := canvasPowerGatewayBody(power, input, sourceTargetID, imageSequenceMode)
	output, err := billingservice.ExecutePower(ctx, billingservice.PowerExecutionRequest{
		Prepare: billingservice.PreparePowerChargeRequest{
			Billing:       billing,
			RequestID:     requestID,
			PowerID:       power.ID,
			PowerName:     power.Name,
			PowerTargetID: sourceTargetID,
		},
		RunID: billing.RunID,
	}, func(ctx context.Context, charged botprotocol.BillingContext) (botprotocol.Output, error) {
		result, invokeErr := s.gateway.Invoke(ctx, energonservice.GatewayRequest{
			RequestID: requestID,
			Method:    "POST",
			Path:      "/bot/admin/energon/request",
			Body:      body,
			Billing:   charged,
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

func (s Service) PreflightCanvasPower(ctx context.Context, req CanvasPowerRunRequest) error {
	prepared, err := s.prepareCanvasPower(ctx, req)
	if err != nil {
		return err
	}
	input := canvasPowerRunInput(prepared.request)
	return s.gateway.Validate(ctx, energonservice.GatewayRequest{
		Method: "POST",
		Path:   "/bot/admin/energon/request",
		Body: canvasPowerGatewayBody(
			prepared.power,
			input,
			prepared.request.SourceTargetID,
			prepared.request.ImageSequenceMode,
		),
	})
}

func canvasPowerGatewayBody(
	power PowerOption,
	input map[string]any,
	sourceTargetID uint64,
	imageSequenceMode string,
) map[string]any {
	sourceTargetID = resolveSourceTargetID(sourceTargetID, input)
	options := map[string]any{"stream": true}
	if imageSequenceMode != "" {
		options[botprotocol.OptionImageSequenceMode] = imageSequenceMode
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
