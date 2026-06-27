package agentcontext

import (
	"context"
)

func (a Assembler) plannerPowerKey(ctx context.Context, req Request) string {
	return a.auxiliaryPowerKey(ctx, req.Agent.PlannerPowerID)
}

func (a Assembler) selectorPowerKey(ctx context.Context, req Request) string {
	return a.auxiliaryPowerKey(ctx, req.Agent.SelectorPowerID)
}

func (a Assembler) auxiliaryPowerKey(ctx context.Context, powerID uint64) string {
	if powerID > 0 {
		if key, ok := a.repo.FindActiveTextPowerKey(ctx, powerID); ok {
			return key
		}
	}
	return ""
}
