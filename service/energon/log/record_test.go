package log

import (
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	"github.com/shemic/dever/util"
)

func TestRecordValuesIncludeCallAttribution(t *testing.T) {
	values := recordValues(botmodel.Log{
		UserID:    12,
		TeamID:    34,
		ProjectID: 56,
		Scene:     "project_power",
	})

	want := map[string]any{
		"user_id":    uint64(12),
		"team_id":    uint64(34),
		"project_id": uint64(56),
		"scene":      "project_power",
	}
	for key, expected := range want {
		if actual := values[key]; actual != expected {
			t.Fatalf("recordValues[%q] = %#v, want %#v", key, actual, expected)
		}
	}
	if util.ToString(values["created_at"]) == "" {
		t.Fatal("recordValues should include created_at")
	}
}

func TestAttributionValuesFromCostRecordUsesExactLogLink(t *testing.T) {
	logID, values, ok := AttributionValuesFromCostRecord(&botmodel.CostRecord{
		LogID:     77,
		UserID:    12,
		TeamID:    34,
		ProjectID: 56,
		Scene:     "project_power",
	})

	if !ok || logID != 77 {
		t.Fatalf("log link = (%d, %v), want (77, true)", logID, ok)
	}
	want := map[string]any{
		"user_id":    uint64(12),
		"team_id":    uint64(34),
		"project_id": uint64(56),
		"scene":      "project_power",
	}
	for key, expected := range want {
		if actual := values[key]; actual != expected {
			t.Fatalf("values[%q] = %#v, want %#v", key, actual, expected)
		}
	}
}

func TestAttributionValuesFromCostRecordRejectsMissingLogLink(t *testing.T) {
	if _, _, ok := AttributionValuesFromCostRecord(&botmodel.CostRecord{UserID: 12}); ok {
		t.Fatal("cost record without log_id must not be used for attribution")
	}
}

func TestAttachLogUserInfoDistinguishesUserSystemAndLegacyRows(t *testing.T) {
	rows := attachLogUserInfo([]map[string]any{
		{
			"user_id": uint64(12),
			"scene":   "project_power",
			"user": map[string]any{
				"name":    "用户甲",
				"account": "13800000001",
			},
		},
		{"user_id": uint64(0), "scene": "system"},
		{"user_id": uint64(0), "scene": ""},
	})

	wantNames := []string{"用户甲", "系统调用", "未记录"}
	for index, expected := range wantNames {
		if actual := rows[index]["user_name"]; actual != expected {
			t.Fatalf("row %d user_name = %#v, want %q", index, actual, expected)
		}
	}
	if rows[0]["user_account"] != "13800000001" {
		t.Fatalf("user account = %#v", rows[0]["user_account"])
	}
}
