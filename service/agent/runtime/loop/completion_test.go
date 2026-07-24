package loop

import (
	"testing"
)

func TestResolveCompletionReview(t *testing.T) {
	review, err := resolveCompletionReview("complete", "", completionDependencyNone, completionFollowUpNone)
	if err != nil {
		t.Fatalf("resolve complete review returned error: %v", err)
	}
	if review.needsContinuation() {
		t.Fatalf("expected complete review, got %#v", review)
	}

	review, err = resolveCompletionReview("incomplete", "", completionDependencyUserInput, completionFollowUpNone)
	if err != nil {
		t.Fatalf("resolve incomplete review returned error: %v", err)
	}
	if review.Missing == "" || review.Dependency != completionDependencyUserInput || !review.needsContinuation() {
		t.Fatalf("unexpected incomplete review: %#v", review)
	}

	review, err = resolveCompletionReview("complete", "", completionDependencyNone, completionFollowUpSuggestions)
	if err != nil {
		t.Fatalf("resolve complete review with suggestions returned error: %v", err)
	}
	if review.Delivery != "complete" || review.FollowUp != completionFollowUpSuggestions || !review.needsContinuation() {
		t.Fatalf("complete delivery should continue into structured suggestions: %#v", review)
	}
}

func TestResolveCompletionReviewNormalizesInteractionSemantics(t *testing.T) {
	if _, err := resolveCompletionReview("unknown", "", completionDependencyNone, completionFollowUpNone); err == nil {
		t.Fatal("invalid delivery should fail")
	}
	if _, err := resolveCompletionReview("incomplete", "missing", "unknown_dependency", completionFollowUpNone); err == nil {
		t.Fatal("invalid dependency should fail")
	}

	review, err := resolveCompletionReview("complete", "", completionDependencyUserInput, completionFollowUpNone)
	if err != nil {
		t.Fatalf("ask_user interaction should normalize to incomplete delivery: %v", err)
	}
	if review.Delivery != "incomplete" || review.Dependency != completionDependencyUserInput {
		t.Fatalf("unexpected ask_user normalization: %#v", review)
	}

	review, err = resolveCompletionReview("incomplete", "missing", completionDependencyNone, completionFollowUpSuggestions)
	if err != nil {
		t.Fatalf("optional suggestions should not invalidate incomplete delivery: %v", err)
	}
	if review.FollowUp != completionFollowUpNone || !review.needsContinuation() {
		t.Fatalf("incomplete delivery must continue before optional suggestions: %#v", review)
	}
}

func TestLengthLimitedFinishModes(t *testing.T) {
	for _, mode := range []string{"length", "max_tokens", "max_output_tokens", " MAX_TOKENS "} {
		if !isLengthLimitedFinish(mode) {
			t.Fatalf("%q should trigger automatic continuation", mode)
		}
	}
	if isLengthLimitedFinish("stop") {
		t.Fatal("normal stop must not be treated as a length limit")
	}
}

func TestExplicitMaxOutputTokens(t *testing.T) {
	if got := explicitMaxOutputTokens(0, 8000); got != 0 {
		t.Fatalf("zero preference should stay implicit, got %d", got)
	}
	if got := explicitMaxOutputTokens(4000, 8000); got != 4000 {
		t.Fatalf("preference below source max = %d, want 4000", got)
	}
	if got := explicitMaxOutputTokens(12000, 8000); got != 8000 {
		t.Fatalf("preference should clamp to source max, got %d", got)
	}
}

func TestCompletionCandidateTextUsesAccumulatedOutput(t *testing.T) {
	state := &runState{lastText: "第一段正文。\n\n第二段正文。"}
	result := modelStepResult{Text: "第二段正文。"}
	if got := completionCandidateText(state, result); got != state.lastText {
		t.Fatalf("completion candidate = %q, want accumulated output %q", got, state.lastText)
	}
}

func TestCompletionReviewOnlyRunsForPendingStopGate(t *testing.T) {
	result := modelStepResult{Text: "普通回复"}
	if shouldReviewCompletion(&runState{}, result) {
		t.Fatal("ordinary tool-free output must finish without completion review")
	}

	state := &runState{completionReviewPending: true}
	if !shouldReviewCompletion(state, result) {
		t.Fatal("pending stop gate should review the candidate once")
	}
	state.completionReviews = maxCompletionReviews
	if shouldReviewCompletion(state, result) {
		t.Fatal("completion review must not run more than once per run")
	}
}

func TestInteractionResumeStartsPendingStopGate(t *testing.T) {
	execution := execution{input: runtimeEventInput("interaction_resumed", nil)}
	checkpoint := initialCheckpoint(execution)
	if !checkpoint.AwaitingDelivery || !checkpoint.CompletionReviewPending {
		t.Fatalf("interaction resume checkpoint did not require delivery review: %#v", checkpoint)
	}
}

func TestInitialTurnStartsPendingStopGateWithoutForcingDelivery(t *testing.T) {
	checkpoint := initialCheckpoint(execution{input: map[string]any{"prompt": "你好"}})
	if checkpoint.AwaitingDelivery || !checkpoint.CompletionReviewPending {
		t.Fatalf("initial checkpoint should review a natural stop without predeclaring missing delivery: %#v", checkpoint)
	}
}
