package materiallibrary

import (
	"reflect"
	"testing"

	teammodel "github.com/dever-package/bot/model/team"
)

func TestBuildSnapshotFiltersUnavailableRowsAndPreservesPackOrder(t *testing.T) {
	rows := sourceRows{
		Pack: &teammodel.MaterialPack{ID: 7, Name: "品牌素材", Status: teammodel.StatusEnabled},
		Items: []teammodel.MaterialPackItem{
			{ID: 1, PackID: 7, MaterialID: 10, Status: teammodel.StatusEnabled, Sort: 20},
			{ID: 2, PackID: 7, MaterialID: 11, Status: teammodel.StatusEnabled, Sort: 10},
			{ID: 3, PackID: 7, MaterialID: 12, Status: teammodel.StatusDisabled, Sort: 1},
			{ID: 4, PackID: 8, MaterialID: 13, Status: teammodel.StatusEnabled, Sort: 1},
			{ID: 5, PackID: 7, MaterialID: 14, Status: teammodel.StatusEnabled, Sort: 30},
		},
		Materials: []teammodel.Material{
			{ID: 10, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "通用文案", Content: "请优化文案", Status: teammodel.StatusEnabled},
			{ID: 11, CateID: 2, Kind: teammodel.MaterialKindImage, Name: "品牌图", ResourceURL: "/brand.png", Status: teammodel.StatusEnabled},
			{ID: 12, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "停用条目", Status: teammodel.StatusEnabled},
			{ID: 13, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "其他方案", Status: teammodel.StatusEnabled},
			{ID: 14, CateID: 3, Kind: teammodel.MaterialKindAudio, Name: "停用分类", ResourceURL: "/audio.mp3", Status: teammodel.StatusEnabled},
		},
		Categories: []teammodel.MaterialCate{
			{ID: 1, Kind: teammodel.MaterialKindPrompt, Name: "文案", Status: teammodel.StatusEnabled, Sort: 20},
			{ID: 2, Kind: teammodel.MaterialKindImage, Name: "视觉", Status: teammodel.StatusEnabled, Sort: 10},
			{ID: 3, Kind: teammodel.MaterialKindAudio, Name: "声音", Status: teammodel.StatusDisabled, Sort: 1},
		},
	}

	snapshot := buildSnapshot(rows)
	if !snapshot.Enabled || snapshot.Pack.ID != 7 {
		t.Fatalf("snapshot availability = %#v, want enabled pack 7", snapshot.Pack)
	}
	if got := materialIDs(snapshot.Materials); !reflect.DeepEqual(got, []uint64{11, 10}) {
		t.Fatalf("material order = %v, want [11 10]", got)
	}
	if got := categoryIDs(snapshot.Categories); !reflect.DeepEqual(got, []uint64{2, 1}) {
		t.Fatalf("category order = %v, want [2 1]", got)
	}
	if got := kindIDs(snapshot.Kinds); !reflect.DeepEqual(got, []string{"prompt", "image"}) {
		t.Fatalf("kind order = %v, want [prompt image]", got)
	}
}

func TestBuildSnapshotWithoutEnabledPackIsEmpty(t *testing.T) {
	for _, pack := range []*teammodel.MaterialPack{
		nil,
		{ID: 7, Name: "停用方案", Status: teammodel.StatusDisabled},
	} {
		snapshot := buildSnapshot(sourceRows{
			Pack: pack,
			Items: []teammodel.MaterialPackItem{
				{ID: 1, PackID: 7, MaterialID: 10, Status: teammodel.StatusEnabled},
			},
			Materials: []teammodel.Material{
				{ID: 10, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "不会暴露", Status: teammodel.StatusEnabled},
			},
			Categories: []teammodel.MaterialCate{
				{ID: 1, Kind: teammodel.MaterialKindPrompt, Name: "文案", Status: teammodel.StatusEnabled},
			},
		})
		if snapshot.Enabled || len(snapshot.Materials) != 0 || len(snapshot.Categories) != 0 {
			t.Fatalf("disabled pack exposed library data: %#v", snapshot)
		}
	}
}

func TestSnapshotQueryFiltersAndPaginates(t *testing.T) {
	snapshot := buildSnapshot(sourceRows{
		Pack: &teammodel.MaterialPack{ID: 7, Name: "品牌素材", Status: teammodel.StatusEnabled},
		Items: []teammodel.MaterialPackItem{
			{ID: 1, PackID: 7, MaterialID: 10, Status: teammodel.StatusEnabled, Sort: 10},
			{ID: 2, PackID: 7, MaterialID: 11, Status: teammodel.StatusEnabled, Sort: 20},
			{ID: 3, PackID: 7, MaterialID: 12, Status: teammodel.StatusEnabled, Sort: 30},
		},
		Materials: []teammodel.Material{
			{ID: 10, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "一", Content: "内容一", Status: teammodel.StatusEnabled},
			{ID: 11, CateID: 1, Kind: teammodel.MaterialKindPrompt, Name: "二", Content: "内容二", Status: teammodel.StatusEnabled},
			{ID: 12, CateID: 2, Kind: teammodel.MaterialKindImage, Name: "三", ResourceURL: "/three.png", Status: teammodel.StatusEnabled},
		},
		Categories: []teammodel.MaterialCate{
			{ID: 1, Kind: teammodel.MaterialKindPrompt, Name: "文案", Status: teammodel.StatusEnabled},
			{ID: 2, Kind: teammodel.MaterialKindImage, Name: "视觉", Status: teammodel.StatusEnabled},
		},
	})

	page := snapshot.Query(QueryRequest{Kind: teammodel.MaterialKindPrompt, CateID: 1, Page: 2, PageSize: 1})
	if page.Total != 2 || page.Page != 2 || page.PageSize != 1 || page.HasMore {
		t.Fatalf("unexpected page metadata: %#v", page)
	}
	if got := materialIDs(page.Items); !reflect.DeepEqual(got, []uint64{11}) {
		t.Fatalf("page material ids = %v, want [11]", got)
	}
	if _, err := snapshot.Require(12); err != nil {
		t.Fatalf("require visible material: %v", err)
	}
	if _, err := snapshot.Require(99); err == nil {
		t.Fatal("require missing material returned nil error")
	}
}

func materialIDs(rows []Material) []uint64 {
	result := make([]uint64, 0, len(rows))
	for _, row := range rows {
		result = append(result, row.ID)
	}
	return result
}

func categoryIDs(rows []Category) []uint64 {
	result := make([]uint64, 0, len(rows))
	for _, row := range rows {
		result = append(result, row.ID)
	}
	return result
}

func kindIDs(rows []KindOption) []string {
	result := make([]string, 0, len(rows))
	for _, row := range rows {
		result = append(result, row.ID)
	}
	return result
}
