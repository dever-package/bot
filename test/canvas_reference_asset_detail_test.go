package test

import (
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

func TestCanvasReferenceUsesAssetLibraryDetail(t *testing.T) {
	source := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/space/space-page.tsx",
	))

	for _, contract := range []string{
		"referenceAssetDetailTarget(node)",
		"setReferenceAssetDetail(referenceTarget)",
		"<AssetDetailDialog",
		"assetID={referenceAssetDetail.assetID}",
		`layer="nested"`,
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("canvas references must open the shared asset detail with %s", contract)
		}
	}
}

func TestCanvasReferenceAssetChangesRefreshTheNodeSnapshot(t *testing.T) {
	source := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/space/space-page.tsx",
	))

	for _, contract := range []string{
		"onReferenceAssetChanged",
		"normalizeProjectAsset(asset)",
		"updateNodeResult(referenceNode.id, nodePatch)",
	} {
		if !strings.Contains(source, contract) {
			t.Fatalf("reference asset edits must refresh the canvas node with %s", contract)
		}
	}
	if !regexp.MustCompile(
		`buildAssetVersionNodePatch\(\s*referenceNode,\s*normalizedAsset,?\s*\)`,
	).MatchString(source) {
		t.Fatal("reference asset edits must rebuild the node from the saved asset")
	}
}
