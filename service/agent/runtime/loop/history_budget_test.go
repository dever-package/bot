package loop

import (
	"strings"
	"testing"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonservice "github.com/dever-package/bot/service/energon"
)

func TestPrepareModelRequestWithFallbackUsesEmergencyCompaction(t *testing.T) {
	history := make([]any, 0, 4)
	for index := 0; index < 4; index++ {
		history = append(history, map[string]any{
			"role":    "tool",
			"name":    "large_result",
			"content": strings.Repeat("中", 20000),
		})
	}
	execution := execution{
		agent: agentmodel.Agent{},
		modelLimits: energonservice.ModelLimits{
			ContextWindowTokens: 64000,
			MaxOutputTokens:     16000,
		},
		workingContextTokens: 64000,
		snapshotHistoryLen:   0,
	}

	_, preparedHistory, budget, err := prepareModelRequestWithFallback(
		execution,
		"role",
		map[string]any{"prompt": "continue"},
		history,
		nil,
	)
	if err != nil {
		t.Fatalf("fallback preparation returned error: %v", err)
	}
	if len(preparedHistory) != len(history) {
		t.Fatalf("current run history was dropped: got %d messages, want %d", len(preparedHistory), len(history))
	}
	if !budget.Compacted || budget.CompactionCount < 1 {
		t.Fatalf("expected emergency compaction metadata, got %#v", budget)
	}
	if budget.EstimatedInputTokens > budget.MaxInputTokens {
		t.Fatalf("prepared input exceeds budget: estimated=%d max=%d", budget.EstimatedInputTokens, budget.MaxInputTokens)
	}
}
