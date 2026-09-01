package test

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestCanvasFunctionResultExposesQuickDetailButton(t *testing.T) {
	source := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/space/space-page.tsx",
	))
	start := strings.Index(source, "// 3. Function command capsule representation")
	if start < 0 {
		t.Fatal("canvas function node render branch not found")
	}
	end := strings.Index(source[start:], "// 4. Asset representations")
	if end < 0 {
		t.Fatal("canvas function node render branch end not found")
	}
	functionBranch := source[start : start+end]
	buttonStart := strings.Index(functionBranch, "<NodeQuickDetailButton")
	if buttonStart < 0 {
		t.Fatal("function result nodes must expose the shared quick detail button")
	}
	buttonEnd := strings.Index(functionBranch[buttonStart:], "/>")
	if buttonEnd < 0 {
		t.Fatal("function result quick detail button is incomplete")
	}
	button := functionBranch[buttonStart : buttonStart+buttonEnd]
	for _, prop := range []string{
		"node={node}",
		"onShowNodeDetail={onShowNodeDetail}",
	} {
		if !strings.Contains(button, prop) {
			t.Fatalf("function result quick detail button must include %s", prop)
		}
	}
}

func TestCanvasFunctionResultContentOpensDetail(t *testing.T) {
	source := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/space/space-page.tsx",
	))
	start := strings.Index(source, "function FunctionResultCard(")
	if start < 0 {
		t.Fatal("function result card not found")
	}
	end := strings.Index(source[start:], "function NodeFeedbackBeacon(")
	if end < 0 {
		t.Fatal("function result card end not found")
	}
	resultCard := source[start : start+end]
	if !strings.Contains(resultCard, "openOnContentClick") {
		t.Fatal("function result preview content must open the node detail")
	}

	resultView := readCanvasSource(t, filepath.Join(
		"..",
		"front/src/nodes/body-work/space/space-result-view.tsx",
	))
	for _, contract := range []string{
		"openOnContentClick?: boolean",
		"onClickCapture={openFromContentClick}",
	} {
		if !strings.Contains(resultView, contract) {
			t.Fatalf("canvas result view must implement content detail opening with %s", contract)
		}
	}
}
