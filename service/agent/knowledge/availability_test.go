package knowledge

import (
	"testing"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func TestKnowledgeDocAvailableAtAppliesReviewPolicy(t *testing.T) {
	now := time.Date(2026, time.August, 18, 12, 0, 0, 0, time.UTC)
	tests := []struct {
		name           string
		reviewStatus   string
		reviewRequired bool
		want           bool
	}{
		{name: "strict review accepts approved document", reviewStatus: agentmodel.KnowledgeReviewStatusApproved, reviewRequired: true, want: true},
		{name: "strict review rejects pending document", reviewStatus: agentmodel.KnowledgeReviewStatusPending, reviewRequired: true, want: false},
		{name: "non-strict review accepts pending document", reviewStatus: agentmodel.KnowledgeReviewStatusPending, reviewRequired: false, want: true},
		{name: "rejected document is unavailable in non-strict mode", reviewStatus: agentmodel.KnowledgeReviewStatusRejected, reviewRequired: false, want: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			doc := availableKnowledgeTestDoc()
			doc.ReviewStatus = test.reviewStatus
			if got := knowledgeDocAvailableAt(doc, test.reviewRequired, now); got != test.want {
				t.Fatalf("knowledgeDocAvailableAt() = %v, want %v", got, test.want)
			}
		})
	}
}

func TestKnowledgeDocAvailableAtRejectsExpiredDocument(t *testing.T) {
	now := time.Date(2026, time.August, 18, 12, 0, 0, 0, time.UTC)
	tests := []struct {
		name      string
		expiresAt time.Time
		want      bool
	}{
		{name: "past expiration", expiresAt: now.Add(-time.Second), want: false},
		{name: "future expiration", expiresAt: now.Add(time.Second), want: true},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			doc := availableKnowledgeTestDoc()
			doc.ExpiresAt = &test.expiresAt
			if got := knowledgeDocAvailableAt(doc, true, now); got != test.want {
				t.Fatalf("knowledgeDocAvailableAt() = %v, want %v", got, test.want)
			}
		})
	}
}

func TestKnowledgeDocAvailableAtKeepsPreviousNodesDuringReindex(t *testing.T) {
	now := time.Date(2026, time.August, 18, 12, 0, 0, 0, time.UTC)
	tests := []struct {
		name        string
		indexStatus string
		nodeCount   int
		want        bool
	}{
		{name: "running reindex with previous nodes", indexStatus: agentmodel.KnowledgeIndexStatusRunning, nodeCount: 12, want: true},
		{name: "first running index without nodes", indexStatus: agentmodel.KnowledgeIndexStatusRunning, nodeCount: 0, want: false},
		{name: "pending index does not expose previous count", indexStatus: agentmodel.KnowledgeIndexStatusPending, nodeCount: 12, want: false},
		{name: "failed index does not expose previous count", indexStatus: agentmodel.KnowledgeIndexStatusFailed, nodeCount: 12, want: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			doc := availableKnowledgeTestDoc()
			doc.IndexStatus = test.indexStatus
			doc.NodeCount = test.nodeCount
			if got := knowledgeDocAvailableAt(doc, true, now); got != test.want {
				t.Fatalf("knowledgeDocAvailableAt() = %v, want %v", got, test.want)
			}
		})
	}
}

func availableKnowledgeTestDoc() *agentmodel.KnowledgeDoc {
	return &agentmodel.KnowledgeDoc{
		IndexStatus:  agentmodel.KnowledgeIndexStatusSuccess,
		ReviewStatus: agentmodel.KnowledgeReviewStatusApproved,
		Status:       1,
	}
}
