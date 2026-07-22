package runtimecontext

import "testing"

func TestResolveTokenBudgetUsesHardWindowAsUpperBound(t *testing.T) {
	budget, err := ResolveTokenBudget(64000, 128000, 16000, 1000)
	if err != nil {
		t.Fatalf("ResolveTokenBudget returned error: %v", err)
	}
	if budget.WorkingContextTokens != 64000 {
		t.Fatalf("working context = %d, want 64000", budget.WorkingContextTokens)
	}
	if budget.SafetyTokens != 3200 {
		t.Fatalf("safety tokens = %d, want 3200", budget.SafetyTokens)
	}
	if budget.MaxInputTokens != 44800 {
		t.Fatalf("max input tokens = %d, want 44800", budget.MaxInputTokens)
	}
	if budget.Expanded {
		t.Fatal("budget should not expand when required input fits")
	}
}

func TestResolveTokenBudgetTemporarilyExpandsForRequiredInput(t *testing.T) {
	budget, err := ResolveTokenBudget(1050000, 128000, 16000, 200000)
	if err != nil {
		t.Fatalf("ResolveTokenBudget returned error: %v", err)
	}
	if !budget.Expanded {
		t.Fatal("budget should expand for required current input")
	}
	if budget.WorkingContextTokens <= 128000 || budget.WorkingContextTokens > 1050000 {
		t.Fatalf("unexpected expanded context: %d", budget.WorkingContextTokens)
	}
	if budget.MaxInputTokens < 200000 {
		t.Fatalf("expanded max input = %d, want at least 200000", budget.MaxInputTokens)
	}
}

func TestResolveTokenBudgetRejectsInputBeyondHardWindow(t *testing.T) {
	if _, err := ResolveTokenBudget(64000, 64000, 16000, 44801); err == nil {
		t.Fatal("required input beyond the hard window should fail")
	}
}

func TestEstimateTextTokensIsConservativeForMixedText(t *testing.T) {
	if EstimateTextTokens("") != 0 {
		t.Fatal("empty text should estimate to zero tokens")
	}
	ascii := EstimateTextTokens("abcdefghijklmnop")
	mixed := EstimateTextTokens("abcdefghijklmnop中文")
	if ascii <= 0 || mixed <= ascii {
		t.Fatalf("unexpected estimates: ascii=%d mixed=%d", ascii, mixed)
	}
}
