package loop

import "testing"

func TestModelPowerChargeBusinessKeyIsStablePerLogicalRequest(t *testing.T) {
	first := modelPowerChargeBusinessKey("turn-key", 42, "model", 3)
	second := modelPowerChargeBusinessKey("turn-key", 42, "model", 3)
	if first == "" || first != second {
		t.Fatalf("expected stable non-empty key, got %q and %q", first, second)
	}
	if first == modelPowerChargeBusinessKey("turn-key", 42, "model", 4) {
		t.Fatal("different model steps must not share a charge key")
	}
	if first == modelPowerChargeBusinessKey("turn-key", 42, "completion_review", 3) {
		t.Fatal("model and completion-review requests must not share a charge key")
	}
}
