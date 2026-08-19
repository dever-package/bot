package team

import (
	"testing"

	teammodel "github.com/dever-package/bot/model/team"
)

func TestNormalizeMaterialCateOptions(t *testing.T) {
	options := normalizeMaterialCateOptions([]map[string]any{
		{"id": 3, "name": " 通用提示词 ", "kind": teammodel.MaterialKindPrompt, "status": 1, "sort": 8},
	})

	if len(options) != 1 {
		t.Fatalf("len(options) = %d, want 1", len(options))
	}
	if options[0]["id"] != uint64(3) || options[0]["value"] != "通用提示词" {
		t.Fatalf("option identity = %#v, want id=3 value=通用提示词", options[0])
	}
	if options[0]["kind"] != teammodel.MaterialKindPrompt {
		t.Fatalf("option kind = %#v, want %s", options[0]["kind"], teammodel.MaterialKindPrompt)
	}
}

func TestBeforeSaveMaterialPackItemRequiresIdentity(t *testing.T) {
	tests := []struct {
		name   string
		record map[string]any
	}{
		{name: "missing pack", record: map[string]any{"material_id": 2}},
		{name: "missing material", record: map[string]any{"pack_id": 1}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			defer func() {
				if recover() == nil {
					t.Fatal("ProviderBeforeSaveMaterialPackItem() did not panic")
				}
			}()
			MaterialHook{}.ProviderBeforeSaveMaterialPackItem(nil, []any{tt.record})
		})
	}
}

func TestBeforeSaveMaterialPackItemAppliesDefaults(t *testing.T) {
	result := MaterialHook{}.ProviderBeforeSaveMaterialPackItem(nil, []any{
		map[string]any{"pack_id": 1, "material_id": 2},
	})
	record, ok := result.(map[string]any)
	if !ok {
		t.Fatalf("result type = %T, want map[string]any", result)
	}
	if record["status"] != teammodel.StatusEnabled || record["sort"] != defaultTeamSort {
		t.Fatalf("defaults = status:%#v sort:%#v", record["status"], record["sort"])
	}
}

func TestNormalizeMaterialPackItemRows(t *testing.T) {
	rows := normalizeMaterialPackItemRows([]any{
		map[string]any{"material_id": 2},
		map[string]any{"material_id": 2, "status": 2, "sort": 9},
		map[string]any{"material_id": 0},
		map[string]any{"material_id": 3, "status": 2, "sort": 9},
	})

	if len(rows) != 2 {
		t.Fatalf("len(rows) = %d, want 2", len(rows))
	}

	first, ok := rows[0].(map[string]any)
	if !ok {
		t.Fatalf("rows[0] type = %T, want map[string]any", rows[0])
	}
	if first["material_id"] != uint64(2) {
		t.Fatalf("first material_id = %#v, want 2", first["material_id"])
	}
	if first["status"] != teammodel.StatusEnabled {
		t.Fatalf("first status = %#v, want %d", first["status"], teammodel.StatusEnabled)
	}
	if first["sort"] != 1 {
		t.Fatalf("first sort = %#v, want 1", first["sort"])
	}

	second, ok := rows[1].(map[string]any)
	if !ok {
		t.Fatalf("rows[1] type = %T, want map[string]any", rows[1])
	}
	if second["material_id"] != uint64(3) {
		t.Fatalf("second material_id = %#v, want 3", second["material_id"])
	}
	if second["status"] != 2 || second["sort"] != 9 {
		t.Fatalf("second defaults changed: status=%#v sort=%#v", second["status"], second["sort"])
	}
}

func TestTeamReleasePayloadKeepsMaterialPack(t *testing.T) {
	team := teammodel.Team{
		ID:             9,
		MaterialPackID: 7,
	}

	payload := teamReleasePayload(team)
	if payload.MaterialPackID != team.MaterialPackID {
		t.Fatalf("payload material_pack_id = %d, want %d", payload.MaterialPackID, team.MaterialPackID)
	}

	roundTrip := graphTeamToModel(payload)
	if roundTrip.MaterialPackID != team.MaterialPackID {
		t.Fatalf("round-trip material_pack_id = %d, want %d", roundTrip.MaterialPackID, team.MaterialPackID)
	}
}

func TestAttachMaterialPackItemListAddsKindLabel(t *testing.T) {
	result := MaterialHook{}.ProviderAttachMaterialPackItemList(nil, []any{
		map[string]any{
			"rows": []any{
				map[string]any{
					"material": map[string]any{"kind": teammodel.MaterialKindImage},
				},
			},
		},
	})

	rows, ok := result.([]map[string]any)
	if !ok || len(rows) != 1 {
		t.Fatalf("result = %#v, want one row", result)
	}
	if rows[0]["kind_label"] != "图片" {
		t.Fatalf("kind_label = %#v, want 图片", rows[0]["kind_label"])
	}
}

func TestMaterialCateKindChanged(t *testing.T) {
	tests := []struct {
		current string
		next    string
		want    bool
	}{
		{current: teammodel.MaterialKindPrompt, next: teammodel.MaterialKindImage, want: true},
		{current: teammodel.MaterialKindImage, next: " IMAGE ", want: false},
		{current: "", next: teammodel.MaterialKindPrompt, want: false},
	}

	for _, tt := range tests {
		if got := materialCateKindChanged(tt.current, tt.next); got != tt.want {
			t.Fatalf("materialCateKindChanged(%q, %q) = %v, want %v", tt.current, tt.next, got, tt.want)
		}
	}
}
