package energon

import (
	"context"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	bottask "github.com/dever-package/bot/service/energon/task"
)

// Composite requests orchestrate stable child requests; resuming them never recreates a submitted child.
func (s GatewayService) callExecutionPowerTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget, streaming bool) (result callResult, err error) {
	composite := botmodel.IsStoryboardGridPower(selected.Power) || shouldPlanContextImages(req, selected.Power) || isLocalProvider(selected.Provider) || isWebContentProvider(selected.Provider) || (s.isRunningHubTwoStageLipSync(ctx, req, selected) && !hasLipSyncSelection(req))
	if composite && bottask.Store(ctx) != nil {
		var loadErr error
		selected, loadErr = s.restoreExecutionSelection(ctx, req, selected)
		if loadErr != nil {
			return callResult{}, loadErr
		}
		checkpoint, loadErr := prepareExecution(ctx, req.RequestID)
		if loadErr != nil {
			return callResult{}, loadErr
		}
		if checkpoint.Persisted != nil {
			if streaming {
				_ = s.writePlannedImageStreamResult(ctx, req.RequestID, checkpoint.Persisted)
			}
			return callResult{Data: checkpoint.Persisted}, nil
		}
		if checkpoint.Stage == bottask.ExecutionPrepared {
			checkpoint.PowerID = selected.Power.ID
			checkpoint.TargetID = selected.PowerTarget.ID
			checkpoint.ProviderID = selected.Provider.ID
			checkpoint.AccountID = selected.Account.ID
			checkpoint.ServiceID = selected.Service.ID
			checkpoint.Stage = bottask.ExecutionSubmitting
			if _, loadErr = bottask.Store(ctx).Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint}); loadErr != nil {
				return callResult{}, loadErr
			}
		} else if isLocalProvider(selected.Provider) || isWebContentProvider(selected.Provider) {
			if checkpoint.Result == nil {
				return callResult{}, executionError(fmt.Errorf("能力提交结果待确认，未自动重新执行"))
			}
			return s.finishStreamResult(ctx, streamFinishInput{Request: req, Selected: selected, StartedAt: time.Now(), Data: checkpoint.Result, Usage: tokenUsageFromMap(checkpoint.Usage), SkipMediaStore: true, CostAttempted: isLocalProvider(selected.Provider)})
		}
	}
	if streaming {
		result, err = s.dispatchStreamPowerTarget(ctx, req, selected)
	} else {
		result, err = s.dispatchNormalizePowerTarget(ctx, req, selected)
	}
	if err != nil {
		if bottask.Store(ctx) != nil {
			err = executionError(err)
		}
		return result, err
	}
	if composite && bottask.Store(ctx) != nil {
		output := powerOutputFromData(result.Data)
		if err = saveExecutionResult(ctx, req.RequestID, output, false); err != nil {
			return result, s.deferFinalizationError(ctx, req.RequestID, err)
		}
		if err = saveExecutionResult(ctx, req.RequestID, output, true); err != nil {
			return result, s.deferFinalizationError(ctx, req.RequestID, err)
		}
	}
	return result, nil
}
func (s GatewayService) callNormalizePowerTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (callResult, error) {
	return s.callExecutionPowerTarget(ctx, req, selected, false)
}
func (s GatewayService) callStreamPowerTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (callResult, error) {
	return s.callExecutionPowerTarget(ctx, req, selected, true)
}
