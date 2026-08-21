package energon

import (
	"testing"
	"time"

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
)

func TestAggregateUserUsageSeparatesLogicalCallsFromProviderAttempts(t *testing.T) {
	createdAt := time.Date(2026, 8, 20, 10, 0, 0, 0, time.UTC)
	summaries := aggregateUserUsage(
		[]*billingmodel.PowerCharge{{
			ID:            1,
			UserID:        12,
			FinishStatus:  billingmodel.ChargeFinishSuccess,
			SettledPoints: 9,
			CreatedAt:     createdAt,
		}},
		[]*energonmodel.CostRecord{
			{ID: 10, UserID: 12, PromptTokens: 100, CompletionTokens: 20, CachedTokens: 40, CostMicros: 110_000, CreatedAt: createdAt.Add(time.Minute)},
			{ID: 11, UserID: 12, PromptTokens: 50, CompletionTokens: 10, CachedTokens: 5, CostMicros: 70_000, CreatedAt: createdAt.Add(2 * time.Minute)},
		},
	)

	summary := summaries[12]
	if summary == nil {
		t.Fatal("missing user 12 summary")
	}
	if summary.LogicalCalls != 1 || summary.ProviderAttempts != 2 {
		t.Fatalf("calls/attempts = %d/%d, want 1/2", summary.LogicalCalls, summary.ProviderAttempts)
	}
	if summary.SuccessCalls != 1 || summary.FailedCalls != 0 {
		t.Fatalf("success/failed = %d/%d, want 1/0", summary.SuccessCalls, summary.FailedCalls)
	}
	if summary.PromptTokens != 150 || summary.CompletionTokens != 30 || summary.CachedTokens != 45 {
		t.Fatalf("unexpected token totals: %#v", summary)
	}
	if summary.CostMicros != 180_000 || summary.SettledPoints != 9 {
		t.Fatalf("unexpected cost/points: %#v", summary)
	}
	if !summary.LastUsedAt.Equal(createdAt.Add(2 * time.Minute)) {
		t.Fatalf("last_used_at = %v", summary.LastUsedAt)
	}
	if got := summary.SuccessRate(); got != "100.0%" {
		t.Fatalf("success rate = %q, want 100.0%%", got)
	}
}

func TestAggregateUserUsageKeepsSystemCallsSeparate(t *testing.T) {
	summaries := aggregateUserUsage(nil, []*energonmodel.CostRecord{{
		ID: 1, UserID: 0, CostMicros: 10,
	}})

	if summaries[0] == nil || summaries[0].ProviderAttempts != 1 {
		t.Fatalf("system usage should remain in user_id=0 group: %#v", summaries[0])
	}
	if got := summaries[0].SuccessRate(); got != "-" {
		t.Fatalf("unfinished success rate = %q, want -", got)
	}
}

func TestBuildUserUsageTableSortsThenPaginates(t *testing.T) {
	summaries := map[uint64]*userUsageSummary{
		12: {UserID: 12, LogicalCalls: 1, LastUsedAt: time.Date(2026, 8, 20, 9, 0, 0, 0, time.UTC)},
		34: {UserID: 34, LogicalCalls: 3, LastUsedAt: time.Date(2026, 8, 20, 8, 0, 0, 0, time.UTC)},
	}
	users := map[uint64]usageUser{
		12: {Name: "用户甲", Account: "13800000001"},
		34: {Name: "用户乙", Account: "13800000002"},
	}

	table := buildUserUsageTable(summaries, users, userUsageQuery{Page: 1, PageSize: 1})
	rows, ok := table["list"].([]map[string]any)
	if !ok || len(rows) != 1 {
		t.Fatalf("unexpected page rows: %#v", table["list"])
	}
	if got := rows[0]["user_id"]; got != uint64(34) {
		t.Fatalf("first user_id = %#v, want 34", got)
	}
	if table["total"] != 2 {
		t.Fatalf("total = %#v, want 2", table["total"])
	}
}
