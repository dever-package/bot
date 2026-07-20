package billing

import (
	"context"
	"testing"
	"time"
)

func TestPowerSettlementContextSurvivesCallerCancellation(t *testing.T) {
	parent, cancelParent := context.WithCancel(context.Background())
	cancelParent()

	ctx, cancel := powerSettlementContext(parent)
	defer cancel()
	if err := ctx.Err(); err != nil {
		t.Fatalf("settlement context inherited caller cancellation: %v", err)
	}
	deadline, ok := ctx.Deadline()
	if !ok {
		t.Fatal("settlement context must have a deadline")
	}
	remaining := time.Until(deadline)
	if remaining <= 0 || remaining > powerSettlementTimeout {
		t.Fatalf("unexpected settlement deadline: %v", remaining)
	}
}
