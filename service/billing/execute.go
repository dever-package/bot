package billing

import (
	"context"
	"errors"
	"fmt"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type PowerExecutionRequest struct {
	Prepare PreparePowerChargeRequest
	RunID   uint64
}

type PowerExecution func(context.Context, botprotocol.BillingContext) (botprotocol.Output, error)

const powerSettlementTimeout = 30 * time.Second

// ExecutePower wraps one provider-side power invocation in the common charge
// reservation and settlement lifecycle.
func ExecutePower(ctx context.Context, request PowerExecutionRequest, execute PowerExecution) (output botprotocol.Output, resultErr error) {
	return Execute(ctx, request, execute)
}

// Execute applies the common reservation and settlement lifecycle to any
// provider-side invocation. Tool, agent-model and team calls share this path.
func Execute[T any](ctx context.Context, request PowerExecutionRequest, execute func(context.Context, botprotocol.BillingContext) (T, error)) (output T, resultErr error) {
	prepared, err := PreparePowerCharge(ctx, request.Prepare)
	if err != nil {
		return output, err
	}

	defer func() {
		recovered := recover()
		if recovered != nil {
			resultErr = panicError(recovered)
		}
		settleCtx, cancel := powerSettlementContext(ctx)
		settleErr := FinishPowerCharge(settleCtx, FinishPowerChargeRequest{
			ChargeID: prepared.Charge.ID,
			RunID:    request.RunID,
			Success:  resultErr == nil,
			Canceled: ctx.Err() != nil || errors.Is(resultErr, context.Canceled),
			Error:    resultErr,
		})
		cancel()
		if recovered != nil {
			panic(recovered)
		}
		if resultErr == nil && settleErr != nil {
			resultErr = settleErr
		}
	}()

	if execute == nil {
		return output, fmt.Errorf("能力执行函数不能为空")
	}
	return execute(ctx, prepared.Billing)
}

func powerSettlementContext(ctx context.Context) (context.Context, context.CancelFunc) {
	if ctx == nil {
		ctx = context.Background()
	}
	return context.WithTimeout(context.WithoutCancel(ctx), powerSettlementTimeout)
}

func panicError(value any) error {
	if err, ok := value.(error); ok {
		return err
	}
	return fmt.Errorf("能力执行异常: %v", value)
}
