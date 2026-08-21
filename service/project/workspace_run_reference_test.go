package project

import "testing"

func TestCanvasStructuredPromptReferencesSupportsAssetAndMaterial(t *testing.T) {
	content := map[string]any{
		"version": 1,
		"parts": []any{
			map[string]any{
				"type":           "reference",
				"ref_type":       "asset",
				"ref_id":         11,
				"ref_version_id": 22,
				"label":          "用户图片",
			},
			map[string]any{
				"type":     "reference",
				"ref_type": "material",
				"ref_id":   11,
				"label":    "官方图片",
			},
		},
	}

	references, err := canvasStructuredPromptReferences(content)
	if err != nil {
		t.Fatalf("canvasStructuredPromptReferences() error = %v", err)
	}
	if len(references) != 2 {
		t.Fatalf("len(references) = %d, want 2", len(references))
	}
	if references[0].ReferenceType != "asset" || references[0].ReferenceID != 11 || references[0].VersionID != 22 {
		t.Fatalf("asset reference = %#v", references[0])
	}
	if references[1].ReferenceType != "material" || references[1].ReferenceID != 11 || references[1].VersionID != 0 {
		t.Fatalf("material reference = %#v", references[1])
	}
}
