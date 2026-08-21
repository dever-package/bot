package energon

import (
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func TestApplyLogAttributionCopiesBillingContext(t *testing.T) {
	record := botmodel.Log{}
	applyLogAttribution(&record, botprotocol.BillingContext{
		UserID:    12,
		TeamID:    34,
		ProjectID: 56,
		Scene:     "project_power",
	})

	if record.UserID != 12 || record.TeamID != 34 || record.ProjectID != 56 {
		t.Fatalf("unexpected attribution: %#v", record)
	}
	if record.Scene != "project_power" {
		t.Fatalf("scene = %q, want project_power", record.Scene)
	}
}

func TestApplyLogAttributionDefaultsEmptySceneToSystem(t *testing.T) {
	record := botmodel.Log{}
	applyLogAttribution(&record, botprotocol.BillingContext{})

	if record.UserID != 0 {
		t.Fatalf("user_id = %d, want 0", record.UserID)
	}
	if record.Scene != "system" {
		t.Fatalf("scene = %q, want system", record.Scene)
	}
}
